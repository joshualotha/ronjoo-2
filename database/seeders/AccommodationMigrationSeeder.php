<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use App\Models\DestinationAccommodation;
use App\Models\SafariAccommodation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Migrates accommodation data from the legacy per-entity tables
 * (destination_accommodations, safari_accommodations) into the
 * normalized global accommodations table + pivot tables.
 */
class AccommodationMigrationSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting accommodation data migration...');

        // ── 1. Collect all accommodations from both sources ──
        $all = [];

        // From destination_accommodations
        $destAccs = DestinationAccommodation::all();
        foreach ($destAccs as $da) {
            $key = Str::lower(trim($da->name));
            if (!isset($all[$key])) {
                $all[$key] = [
                    'name'        => trim($da->name),
                    'tier'        => $da->tier ?? 'Standard',
                    'stars'       => $da->stars,
                    'description' => $da->description,
                    'image'       => $da->image,
                    'amenities'   => $da->amenities,
                    'location'    => null,
                    'website'     => null,
                    'dest_ids'    => [],
                    'safari_ids'  => [],
                ];
            }
            $all[$key]['dest_ids'][] = $da->destination_id;
        }

        // From safari_accommodations
        $safAccs = SafariAccommodation::all();
        foreach ($safAccs as $sa) {
            $rawName = trim($sa->name);
            $key = Str::lower($rawName);

            if (!isset($all[$key])) {
                $all[$key] = [
                    'name'        => $rawName,
                    'tier'        => $sa->tier ?? 'Standard',
                    'stars'       => $sa->rating ?? null,
                    'description' => $sa->description,
                    'image'       => $sa->image,
                    'amenities'   => $sa->amenities,
                    'location'    => null,
                    'website'     => $sa->website,
                    'dest_ids'    => [],
                    'safari_ids'  => [],
                ];
            } else {
                if (empty($all[$key]['website']) && !empty($sa->website)) {
                    $all[$key]['website'] = $sa->website;
                }
                if (empty($all[$key]['image']) && !empty($sa->image)) {
                    $all[$key]['image'] = $sa->image;
                }
                if (empty($all[$key]['description']) && !empty($sa->description)) {
                    $all[$key]['description'] = $sa->description;
                }
                if (empty($all[$key]['stars']) && !empty($sa->rating)) {
                    $all[$key]['stars'] = $sa->rating;
                }
            }

            $all[$key]['safari_ids'][] = [
                'safari_id' => $sa->safari_id,
                'nights'    => $sa->nights ?? 1,
            ];
        }

        $count = count($all);
        $this->command->info("Found {$count} unique accommodations from both tables.");

        // ── 2. Create global Accommodation records ──
        $created = 0;
        foreach ($all as $key => $data) {
            $accommodation = Accommodation::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'name'        => $data['name'],
                    'slug'        => Str::slug($data['name']),
                    'location'    => $data['location'],
                    'tier'        => $data['tier'],
                    'stars'       => $data['stars'],
                    'description' => $data['description'],
                    'image'       => $data['image'],
                    'website'     => $data['website'],
                    'amenities'   => $data['amenities'],
                ]
            );

            // Link to destinations
            foreach (array_unique($data['dest_ids']) as $i => $destId) {
                $accommodation->destinations()->syncWithoutDetaching([
                    $destId => ['sort_order' => $i],
                ]);
            }

            // Link to safaris
            foreach ($data['safari_ids'] as $i => $entry) {
                $accommodation->safaris()->syncWithoutDetaching([
                    $entry['safari_id'] => [
                        'nights'     => $entry['nights'],
                        'sort_order' => $i,
                    ],
                ]);
            }

            $created++;
        }

        $destLinks  = \DB::table('accommodation_destination')->count();
        $safLinks   = \DB::table('accommodation_safari')->count();

        $this->command->info("Created {$created} accommodation records.");
        $this->command->info("Linked: {$destLinks} destination associations, {$safLinks} safari associations.");
        $this->command->info('Accommodation migration complete!');
    }
}
