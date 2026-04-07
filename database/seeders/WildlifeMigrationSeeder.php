<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Safari;
use App\Models\Wildlife;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WildlifeMigrationSeeder extends Seeder
{
    /**
     * Migrate existing inline JSON wildlife data from destinations and safaris
     * into the normalized wildlife table with pivot relationships.
     */
    public function run(): void
    {
        $this->command->info('Starting wildlife data migration...');

        // ── Step 1: Collect all unique wildlife names from destinations ──
        $wildlifeMap = []; // name => Wildlife model

        $destinations = Destination::all();
        foreach ($destinations as $destination) {
            $wildlife = $destination->wildlife ?? [];
            foreach ($wildlife as $animal) {
                $name = trim($animal['name'] ?? '');
                if (empty($name)) continue;

                $key = Str::lower($name);

                if (!isset($wildlifeMap[$key])) {
                    $wildlifeMap[$key] = [
                        'name'     => $name,
                        'image'    => $animal['image'] ?? null,
                        'fact'     => $animal['fact'] ?? null,
                        'category' => $this->guessCategory($name),
                    ];
                } else {
                    // Prefer longer facts and non-null images
                    if (empty($wildlifeMap[$key]['image']) && !empty($animal['image'])) {
                        $wildlifeMap[$key]['image'] = $animal['image'];
                    }
                    if (strlen($animal['fact'] ?? '') > strlen($wildlifeMap[$key]['fact'] ?? '')) {
                        $wildlifeMap[$key]['fact'] = $animal['fact'];
                    }
                }
            }
        }

        // Also collect from safaris
        $safaris = Safari::all();
        foreach ($safaris as $safari) {
            $wildlife = $safari->wildlife ?? [];
            foreach ($wildlife as $animal) {
                $name = trim($animal['name'] ?? '');
                if (empty($name)) continue;

                $key = Str::lower($name);

                if (!isset($wildlifeMap[$key])) {
                    $wildlifeMap[$key] = [
                        'name'     => $name,
                        'image'    => $animal['image'] ?? null,
                        'fact'     => $animal['fact'] ?? null,
                        'category' => $this->guessCategory($name),
                    ];
                }
            }
        }

        $this->command->info('Found ' . count($wildlifeMap) . ' unique wildlife entries.');

        // ── Step 2: Create Wildlife records ──
        $models = [];
        foreach ($wildlifeMap as $key => $data) {
            $models[$key] = Wildlife::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'name'     => $data['name'],
                    'image'    => $data['image'],
                    'fact'     => $data['fact'],
                    'category' => $data['category'],
                ]
            );
        }

        $this->command->info('Created/found ' . count($models) . ' Wildlife records.');

        // ── Step 3: Create destination pivot entries ──
        $pivotCount = 0;
        foreach ($destinations as $destination) {
            $wildlife = $destination->wildlife ?? [];
            $syncData = [];

            foreach ($wildlife as $i => $animal) {
                $name = trim($animal['name'] ?? '');
                if (empty($name)) continue;

                $key = Str::lower($name);
                if (!isset($models[$key])) continue;

                $syncData[$models[$key]->id] = [
                    'likelihood'  => $animal['likelihood'] ?? 'Common',
                    'custom_fact' => null, // Use the global fact; override only if different
                    'sort_order'  => $i,
                ];

                // If this destination's fact differs from the global one, store it as custom
                $globalFact = $models[$key]->fact;
                $localFact  = $animal['fact'] ?? null;
                if ($localFact && $localFact !== $globalFact) {
                    $syncData[$models[$key]->id]['custom_fact'] = $localFact;
                }

                $pivotCount++;
            }

            $destination->wildlifeAnimals()->syncWithoutDetaching($syncData);
        }

        $this->command->info("Created {$pivotCount} destination-wildlife associations.");

        // ── Step 4: Create safari pivot entries ──
        $safariPivotCount = 0;
        foreach ($safaris as $safari) {
            $wildlife = $safari->wildlife ?? [];
            $syncData = [];

            foreach ($wildlife as $i => $animal) {
                $name = trim($animal['name'] ?? '');
                if (empty($name)) continue;

                $key = Str::lower($name);
                if (!isset($models[$key])) continue;

                $syncData[$models[$key]->id] = [
                    'sort_order' => $i,
                ];
                $safariPivotCount++;
            }

            $safari->wildlifeAnimals()->syncWithoutDetaching($syncData);
        }

        $this->command->info("Created {$safariPivotCount} safari-wildlife associations.");
        $this->command->info('Wildlife data migration complete!');
    }

    /**
     * Guess a category based on the animal name.
     */
    private function guessCategory(string $name): string
    {
        $name = Str::lower($name);

        $bigFive = ['lion', 'leopard', 'elephant', 'african elephant', 'buffalo', 'black rhino', 'rhino', 'rhinoceros'];
        if (in_array($name, $bigFive)) return 'Big Five';

        $predators = ['cheetah', 'wild dog', 'hyena', 'crocodile', 'serval', 'jackal'];
        if (in_array($name, $predators)) return 'Predator';

        $primates = ['colobus monkey', 'blue monkey', 'baboon', 'red colobus monkey', 'chimpanzee'];
        if (in_array($name, $primates)) return 'Primate';

        $birds = ['flamingo', 'malachite sunbird', 'eagle', 'vulture', 'secretary bird', 'ostrich'];
        if (in_array($name, $birds)) return 'Bird';

        $marine = ['dolphin', 'turtles', 'turtle', 'whale shark', 'giant aldabra tortoise'];
        if (in_array($name, $marine)) return 'Marine';

        return 'Herbivore';
    }
}
