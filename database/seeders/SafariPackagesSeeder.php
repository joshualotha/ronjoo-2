<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SafariPackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Parse the packages.txt file
        $packages = $this->parsePackagesData();

        foreach ($packages as $package) {
            // Generate a slug from the name
            $slug = Str::slug($package['name']);
            
            // Check if safari already exists
            $existing = DB::table('safaris')->where('slug', $slug)->first();
            if ($existing) {
                continue;
            }
            
            // Insert the main safari record
            $safariId = DB::table('safaris')->insertGetId([
                'name' => $package['name'],
                'slug' => $slug,
                'type' => $package['type'],
                'duration_nights' => $package['duration_nights'],
                'duration_days' => $package['duration_days'],
                'short_description' => $package['short_description'],
                'description' => $package['description'],
                'max_group_size' => $package['max_group_size'],
                'group_size' => $package['group_size'],
                'best_season_months' => json_encode($package['best_season_months']),
                'hero_images' => json_encode($package['hero_images']),
                'highlights' => json_encode($package['highlights']),
                'image' => $package['image'],
                'price_tiers' => json_encode($package['price_tiers']),
                'accommodations' => json_encode($package['accommodations']),
                'itinerary' => json_encode($package['itinerary']),
                'inclusions' => json_encode($package['inclusions']),
                'exclusions' => json_encode($package['exclusions']),
                'is_featured' => $package['is_featured'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert activities
            foreach ($package['activities'] as $activity) {
                DB::table('safari_activities')->insert([
                    'safari_id' => $safariId,
                    'name' => $activity,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Insert destinations
            foreach ($package['destinations'] as $destination) {
                // Find or create the destination
                $destId = DB::table('destinations')->where('name', $destination)->value('id');
                if (!$destId) {
                    $destId = DB::table('destinations')->insertGetId([
                        'name' => $destination,
                        'slug' => Str::slug($destination),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                
                // Link safari to destination
                DB::table('safari_destination')->insert([
                    'safari_id' => $safariId,
                    'destination_id' => $destId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        $this->command->info('Successfully seeded ' . count($packages) . ' safari packages.');
    }

    /**
     * Parse the packages.txt content into structured data
     */
    private function parsePackagesData()
    {
        $content = file_get_contents(base_path('packages.txt'));
        $packages = [];
        
        // Split by packages (look for patterns like "6 Nights / 7 Days")
        $packageSections = preg_split('/\n\s*\n\s*\n/', $content);
        
        foreach ($packageSections as $section) {
            if (empty(trim($section))) {
                continue;
            }
            
            // Check if this section contains a duration pattern
            if (preg_match('/(\d+)\s*Nights\s*\/\s*(\d+)\s*Days/', $section, $durationMatches)) {
                $package = $this->parsePackageSection($section, $durationMatches);
                if ($package) {
                    $packages[] = $package;
                }
            }
        }
        
        return $packages;
    }

    private function parsePackageSection($section, $durationMatches)
    {
        $lines = array_map('trim', explode("\n", $section));
        
        // Find the title line (it's usually the line after the duration line)
        $title = '';
        for ($i = 0; $i < count($lines); $i++) {
            if (preg_match('/\d+\s*Nights\s*\/\s*\d+\s*Days/', $lines[$i])) {
                // The next non-empty line is likely the title
                for ($j = $i + 1; $j < count($lines); $j++) {
                    if (!empty($lines[$j]) && !preg_match('/Activities\s*\/\s*Visit:/', $lines[$j])) {
                        $title = $lines[$j];
                        break 2;
                    }
                }
            }
        }
        
        // If no title found, use a default
        if (empty($title)) {
            $title = 'Safari Package ' . $durationMatches[1] . ' Nights / ' . $durationMatches[2] . ' Days';
        }
        
        // Extract activities
        $activities = [];
        if (preg_match('/Activities\s*\/\s*Visit:\s*(.+?)(?=Day \d+:)/s', $section, $activitiesMatch)) {
            $activitiesText = $activitiesMatch[1];
            $activities = array_map('trim', preg_split('/,|and/', $activitiesText));
            $activities = array_filter($activities, function($activity) {
                return !empty($activity) && strlen($activity) > 2;
            });
        }
        
        // Extract destinations from title and activities
        $destinations = $this->extractDestinations($title, $activities);
        
        // Extract itinerary days
        $itinerary = $this->extractItinerary($section);
        
        // Extract costings
        $costings = $this->extractCostings($section);
        
        // Create price tiers from costings
        $priceTiers = $this->createPriceTiers($costings);
        
        // Extract accommodations
        $accommodations = $this->extractAccommodations($section);
        
        return [
            'name' => $title,
            'type' => $this->determinePackageType($title),
            'duration_nights' => (int)$durationMatches[1],
            'duration_days' => (int)$durationMatches[2],
            'short_description' => $this->generateShortDescription($title, $durationMatches[2]),
            'description' => $this->generateDescription($title, $durationMatches[2], $activities, $destinations),
            'max_group_size' => 12,
            'group_size' => '4-12',
            'best_season_months' => ['Jan', 'Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'hero_images' => $this->generateHeroImages($title),
            'highlights' => $this->generateHighlights($title, $destinations),
            'image' => Str::slug($title) . '.jpg',
            'price_tiers' => $priceTiers,
            'accommodations' => $accommodations,
            'itinerary' => $itinerary,
            'activities' => $activities,
            'destinations' => $destinations,
            'inclusions' => $this->getDefaultInclusions(),
            'exclusions' => $this->getDefaultExclusions(),
            'is_featured' => (int)$durationMatches[2] >= 7,
        ];
    }

    private function determinePackageType($title)
    {
        $title = strtolower($title);
        
        if (strpos($title, 'fly in') !== false) {
            return 'fly_in';
        } elseif (strpos($title, 'zanzibar') !== false) {
            return 'beach_safari';
        } elseif (strpos($title, 'lake natron') !== false) {
            return 'adventure';
        } elseif (strpos($title, 'southern') !== false || strpos($title, 'selous') !== false || 
                  strpos($title, 'ruaha') !== false || strpos($title, 'mikumi') !== false) {
            return 'southern_circuit';
        } elseif (strpos($title, 'arusha') !== false && strpos($title, 'tarangire') !== false && 
                  strpos($title, 'ngorongoro') !== false) {
            return 'northern_circuit';
        } elseif (strpos($title, 'tarangire') !== false && strpos($title, 'serengeti') !== false && 
                  strpos($title, 'ngorongoro') !== false) {
            return 'classic_wildlife';
        } elseif (strpos($title, 'serengeti') !== false && strpos($title, 'ngorongoro') !== false) {
            return 'serengeti_ngorongoro';
        } else {
            return 'standard_safari';
        }
    }

    private function extractDestinations($title, $activities)
    {
        $destinations = [];
        $commonDestinations = [
            'Tarangire', 'Serengeti', 'Ngorongoro', 'Arusha', 'Lake Manyara',
            'Lake Natron', 'Zanzibar', 'Selous', 'Ruaha', 'Mikumi', 'Lake Eyasi'
        ];
        
        foreach ($commonDestinations as $dest) {
            if (stripos($title, $dest) !== false) {
                $destinations[] = $dest . (in_array($dest, ['Tarangire', 'Serengeti', 'Ngorongoro', 'Selous', 'Ruaha', 'Mikumi']) ? ' National Park' : 
                                          ($dest === 'Zanzibar' ? ' Island' : ''));
            }
        }
        
        return array_unique($destinations);
    }

    private function extractItinerary($section)
    {
        $itinerary = [];
        
        preg_match_all('/Day\s*(\d+):\s*(.+?)(?=(?:Day\s*\d+:|$))/s', $section, $dayMatches, PREG_SET_ORDER);
        
        foreach ($dayMatches as $match) {
            $dayNumber = (int)$match[1];
            $dayContent = trim($match[2]);
            
            $lines = explode("\n", $dayContent);
            $title = trim($lines[0]);
            $description = '';
            
            if (count($lines) > 1) {
                $description = trim(implode("\n", array_slice($lines, 1)));
            }
            
            $itinerary[] = [
                'day' => $dayNumber,
                'title' => $title,
                'description' => $description,
                'activities' => $this->extractDayActivities($description),
                'meals' => $this->extractDayMeals($description),
                'accommodation' => $this->extractDayAccommodation($description)
            ];
        }
        
        return $itinerary;
    }

    private function extractDayActivities($description)
    {
        $activities = [];
        if (preg_match('/Game Drive/i', $description)) {
            $activities[] = 'Game Drive';
        }
        if (preg_match('/Crater/i', $description)) {
            $activities[] = 'Ngorongoro Crater Visit';
        }
        if (preg_match('/Masai/i', $description)) {
            $activities[] = 'Cultural Visit';
        }
        if (preg_match('/Airport/i', $description)) {
            $activities[] = 'Airport Transfer';
        }
        if (preg_match('/Boat/i', $description)) {
            $activities[] = 'Boat Safari';
        }
        if (preg_match('/Walk/i', $description)) {
            $activities[] = 'Nature Walk';
        }
        return array_unique($activities);
    }

    private function extractDayMeals($description)
    {
        $meals = [];
        if (preg_match('/BB/', $description)) {
            $meals[] = 'Breakfast';
        }
        if (preg_match('/HB/', $description)) {
            $meals = ['Breakfast', 'Dinner'];
        }
        if (preg_match('/FB/', $description)) {
            $meals = ['Breakfast', 'Lunch', 'Dinner'];
        }
        if (preg_match('/AI/', $description)) {
            $meals = ['All Inclusive'];
        }
        return $meals;
    }

    private function extractDayAccommodation($description)
    {
        if (preg_match('/at\s+([A-Za-z\s\-\']+)(?:\s*\([^)]+\))?$/i', $description, $match)) {
            return trim($match[1]);
        }
        return '';
    }

    private function extractCostings($section)
    {
        $costings = [];
        
        preg_match_all('/Costing\s*(\d+)\s*–?\s*([^\n]+)(.*?)(?=(?:Costing\s*\d+|Seasons|$))/s', $section, $costingMatches, PREG_SET_ORDER);
        
        foreach ($costingMatches as $match) {
            $tierName = trim($match[2]);
            $costingContent = $match[3];
            
            // Extract price table
            $prices = $this->extractPriceTable($costingContent);
            
            $costings[] = [
                'tier' => strtolower($tierName),
                'tier_name' => $tierName,
                'prices' => $prices
            ];
        }
        
        return $costings;
    }

    private function extractPriceTable($content)
    {
        $prices = [];
        
        if (preg_match('/Seasons.*?\n(.*?)(?:\n\n|$)/s', $content, $tableMatch)) {
            $tableLines = explode("\n", trim($tableMatch[1]));
            
            for ($i = 1; $i < count($tableLines); $i++) {
                $line = trim($tableLines[$i]);
                if (empty($line)) continue;
                
                $columns = preg_split('/\s{2,}/', $line);
                
                if (count($columns) >= 8) {
                    $season = trim($columns[0]);
                    $prices[] = [
                        'season' => $season,
                        'pax_1' => (float)str_replace(',', '', $columns[1]),
                        'pax_2' => (float)str_replace(',', '', $columns[2]),
                        'pax_3' => (float)str_replace(',', '', $columns[3]),
                        'pax_4' => (float)str_replace(',', '', $columns[4]),
                        'pax_5' => (float)str_replace(',', '', $columns[5]),
                        'pax_6' => (float)str_replace(',', '', $columns[6]),
                        'single_supplement' => (float)str_replace(',', '', $columns[7])
                    ];
                }
            }
        }
        
        return $prices;
    }

    private function createPriceTiers($costings)
    {
        $priceTiers = [];
        
        foreach ($costings as $costing) {
            if (!empty($costing['prices'])) {
                foreach ($costing['prices'] as $price) {
                    $priceTiers[] = [
                        'label' => $costing['tier_name'],
                        'tier' => $costing['tier'],
                        'season' => $price['season'],
                        'price' => $price['pax_2'],
                        'currency' => 'USD',
                        'pax_1' => $price['pax_1'],
                        'pax_2' => $price['pax_2'],
                        'pax_3' => $price['pax_3'],
                        'pax_4' => $price['pax_4'],
                        'pax_5' => $price['pax_5'],
                        'pax_6' => $price['pax_6'],
                        'single_supplement' => $price['single_supplement']
                    ];
                }
            }
        }
        
        return $priceTiers;
    }

    private function extractAccommodations($section)
    {
        $accommodations = [];
        
        preg_match_all('/While staying –(.*?)(?=Seasons|Costing|$)/s', $section, $accomMatches, PREG_SET_ORDER);
        
        foreach ($accomMatches as $index => $match) {
            $accomText = trim($match[1]);
            $tier = $this->determineTierFromIndex($index);
            
            $accommodations[] = [
                'tier' => $tier,
                'description' => $accomText,
                'nights' => $this->parseAccommodationNights($accomText),
                'rating' => $this->determineRating($tier)
            ];
        }
        
        return $accommodations;
    }

    private function determineTierFromIndex($index)
    {
        $tiers = ['premium', 'superior', 'standard'];
        return $tiers[$index] ?? 'standard';
    }

    private function parseAccommodationNights($text)
    {
        $nights = [];
        
        $parts = preg_split('/(\d+)\s*Night(?:s)?/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
        
        for ($i = 1; $i < count($parts); $i += 2) {
            $nightCount = (int)$parts[$i];
            $locationInfo = trim($parts[$i + 1]);
            
            if (preg_match('/at\s+([^-]+)–\s*(.+)/', $locationInfo, $locMatch)) {
                $location = trim($locMatch[1]);
                $hotelInfo = trim($locMatch[2]);
                
                $hotel = $hotelInfo;
                $board = 'FB';
                
                if (preg_match('/(.*?)\s*\((BB|HB|FB|AI)\)/', $hotelInfo, $boardMatch)) {
                    $hotel = trim($boardMatch[1]);
                    $board = $boardMatch[2];
                }
                
                $nights[] = [
                    'nights_count' => $nightCount,
                    'location' => $location,
                    'hotel' => $hotel,
                    'board' => $board
                ];
            }
        }
        
        return $nights;
    }

    private function determineRating($tier)
    {
        $ratings = [
            'premium' => 5,
            'superior' => 4,
            'standard' => 3
        ];
        
        return $ratings[$tier] ?? 3;
    }

    private function generateShortDescription($title, $days)
    {
        return "Experience $days days of adventure in Tanzania's most iconic national parks.";
    }

    private function generateDescription($title, $days, $activities, $destinations)
    {
        $desc = "$title.\n\n";
        $desc .= "This $days-day safari package offers an unforgettable journey through Tanzania's most spectacular landscapes.\n\n";
        
        if (!empty($destinations)) {
            $desc .= "Visit: " . implode(', ', $destinations) . ".\n\n";
        }
        
        if (!empty($activities)) {
            $desc .= "Activities include: " . implode(', ', array_slice($activities, 0, 5)) . ".\n\n";
        }
        
        $desc .= "Our expertly crafted itinerary ensures you experience the best wildlife viewing, comfortable accommodations, and professional guiding throughout your adventure.";
        
        return $desc;
    }

    private function generateHeroImages($title)
    {
        $baseName = Str::slug($title);
        return [
            $baseName . '-1.jpg',
            $baseName . '-2.jpg',
            $baseName . '-3.jpg'
        ];
    }

    private function generateHighlights($title, $destinations)
    {
        $highlights = [];
        
        if (stripos($title, 'Serengeti') !== false) {
            $highlights[] = 'Great Migration viewing (seasonal)';
        }
        if (stripos($title, 'Ngorongoro') !== false) {
            $highlights[] = 'Ngorongoro Crater descent';
        }
        if (stripos($title, 'Tarangire') !== false) {
            $highlights[] = 'Large elephant herds';
        }
        if (stripos($title, 'Zanzibar') !== false) {
            $highlights[] = 'Beach relaxation and water activities';
        }
        
        $highlights = array_merge($highlights, [
            'Big Five game viewing',
            'Professional English-speaking guide',
            'Private 4x4 safari vehicle',
            'All park fees included',
            'Comfortable accommodations',
            'Delicious meals throughout'
        ]);
        
        return array_slice($highlights, 0, 6);
    }

    private function getDefaultInclusions()
    {
        return [
            'Accommodation as per itinerary',
            'All tours and meals as per the itinerary',
            'All Park Fees, Crater Fees & Concession Fees',
            'Private 4x4 non-AC safari vehicle',
            'Experienced English speaking Driver/Guide',
            'All Airport Transfers in Mwanza and Kilimanjaro / Arusha',
            'AMREF Flying Doctor Evacuation Insurance for National Parks'
        ];
    }

    private function getDefaultExclusions()
    {
        return [
            'Additional Transfer charges in case of multiple arrival / departure timings',
            'Festive Season Supplementary Charges',
            'Tips and gratuities to Driver/Guide ($35 per day per vehicle)',
            'Tips and gratuities porters and wait staff (USD 1 – 5 per Service)',
            'Any optional tours or excursions not mentioned',
            'Personal expenses such travel and medical insurance, excess baggage fee',
            'Beverages including water, soft drinks luxury champagne, spirits or meals not included in the itinerary',
            'International airfares and domestic airfares',
            'Any charges related to payment including bank charges',
            'Zanzibar Infrastructure Tax of $5 per person per day payable directly to the Hotel',
            'Zanzibar Insurance fee of $44 per person',
            'Tanzania Mainland Insurance fee of $44 per person'
        ];
    }
}
