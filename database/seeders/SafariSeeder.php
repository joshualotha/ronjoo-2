<?php

namespace Database\Seeders;

use App\Models\Safari;
use App\Models\SafariAccommodation;
use App\Models\ItineraryDay;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SafariSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear existing data
        Safari::query()->delete();
        ItineraryDay::query()->delete();
        SafariAccommodation::query()->delete();

        // 2. Global inclusions and exclusions from brochure
        $globalInclusions = [
            "Accommodation as per itinerary",
            "All tours and meals as per the itinerary",
            "All Park Fees, Crater Fees & Concession Fees",
            "Private 4x4 non-AC safari vehicle",
            "Experienced English speaking Driver/Guide",
            "All Airport Transfers (Mwanza/Kilimanjaro/Arusha)",
            "AMREF Flying Doctor Evacuation Insurance",
        ];

        $globalExclusions = [
            "Tips and gratuities to Driver/Guide ($35 per day per vehicle)",
            "Tips to porters and wait staff ($1–5 per service)",
            "Personal travel and medical insurance",
            "International and domestic airfares",
            "Tanzania eVisa ($50–$100)",
            "Zanzibar Infrastructure Tax ($5 pppd)",
            "Alcoholic beverages and luxury champagne",
            "Festive season supplementary charges",
        ];

        $safariPackages = [
            // ━━━━━━━━ PACKAGE 1: TARANGIRE – SERENGETI – NGORONGORO (7D/6N) ━━━━
            [
                'name' => 'Tarangire – Serengeti – Ngorongoro',
                'slug' => 'tarangire-serengeti-ngorongoro-7d',
                'days' => 6,
                'duration' => 6,
                'destinations' => ['Tarangire', 'Serengeti', 'Ngorongoro'],
                'price' => 3640,
                'short_description' => "Tanzania's iconic northern trinity in 6 days.",
                'overview' => "This 6-day expedition is the quintessential Tanzanian Northern Circuit experience. You will traverse from the ancient, baobab-studded landscapes of Tarangire to the infinite horizons of the Serengeti, concluding with the prehistoric wonder of the Ngorongoro Crater floor. It is a journey that balances the scale of the savanna with the intimacy of private guiding and high-end lodge comfort.",
                'description' => "Our signature safari begins in the 'Elephant Playground' of Tarangire, where the ancient baobabs provide a silhouetted backdrop to the largest herds of elephants in Tanzania. From there, you will journey through the cooler highlands before descending into the Serengeti, the theater of the Great Migration and the densest concentration of big cats in Africa. The final act takes place 600 meters below the rim of the Ngorongoro volcano, a self-contained garden of Eden where the rare black rhino still roams. Each day is curated to maximize wildlife movement patterns while ensuring you retreat to the most evocative lodges in the region for sundowners and local storytelling.",
                'category' => ['Classic', 'Wildlife'],
                'difficulty' => 'Easy',
                'best_season' => 'Jun–Mar',
                'itinerary' => [
                    [
                        'day' => 1,
                        'title' => "Arrival & Arusha Sanctuary", 
                        'location' => "Arusha", 
                        'accommodation' => "Gran Melia Arusha", 
                        'description' => "Touch down at Kilimanjaro (JRO) or Arusha Airport (ARK) and be greeted by your private Ronjoo safari guide. A short drive brings you to the lush, garden-shrouded sanctuary of your hotel in the foothills of Mt. Meru. Spend the afternoon shaking off the dust of travel by the pool or wandering through the nearby coffee plantations. In the evening, gather for a comprehensive pre-safari briefing over a multi-course dinner, where your guide will outline the tracking strategy for the coming days of adventure.", 
                        'meals' => "BB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Tarangire: The Baobab Kingdom", 
                        'location' => "Tarangire NP", 
                        'accommodation' => "Kilimamoja Lodge", 
                        'description' => "After an early breakfast, your safari officially begins as you depart for Tarangire National Park. Known as the 'Elephant Kingdom', this park is defined by its massive baobab trees and the highest concentration of elephants in North Tanzania. You will spend the day tracking herds along the Tarangire River, the primary water source for thousands of animals during the dry season. Watch for lions using sun-drenched termite mounds as lookouts while scanning the riverbanks for kudu, oryx, and if you are lucky, tree-climbing pythons. Late afternoon, you will wind your way out of the park and into the cooler Karatu highlands for an evening of relaxation overlooking the Manyara escarpment.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Serengeti: The Endless Plains", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Lake Magadi Lodge", 
                        'description' => "Bid farewell to the highlands as you cross the Ngorongoro Conservation Area and descend onto the infinite short-grass plains of the Serengeti. The name itself comes from the Maasai word 'Siringet', meaning 'Endless Plains', and as the horizon bends away in every direction, you will understand why. Your afternoon game drive will focus on the Seronera Valley, a year-round predator-rich area where the leopard is often the prize sighting in the sausage trees. Arrive at your camp as the sun turns the savanna to gold, enjoying your first evening in the wild heart of Africa.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "Seronera: Big Cat Tracking", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Lake Magadi Lodge", 
                        'description' => "Wake before dawn to the smell of fresh coffee and the distant roar of a lion. A sunrise game drive is essential to catch the predators while they are still active before the midday heat. You will explore the granite kopjes, isolated island-like outcrops where lion prides often rest after a night of hunting. The afternoon is dedicated to tracking the movement of the Great Migration or searching for the elegant cheetah in the open plains. Lunch is often a picnic under a remote acacia tree, surrounded by the sights and sounds of the wild, before returning to the camp for a sundowner by the campfire.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 5, 
                        'title' => "Ngorongoro: The Volcanic Caldera", 
                        'location' => "Ngorongoro Crater", 
                        'accommodation' => "Melia Lodge Ngorongoro", 
                        'description' => "An early departure brings you to the rim of the Ngorongoro volcano. You will descend 600 meters onto the crater floor for a 6-hour game drive through another geological era. This ancient caldera is a self-contained ecosystem where over 25,000 large animals reside, including the endangered black rhino which is often spotted in the Lerai Forest. Enjoy a picnic lunch by the hippo pool before winding your way back up the steep walls of the caldera. In the afternoon, visit a traditional Maasai Boma to learn about the ancient culture that has coexisted with these giants for centuries, before retiring to your lodge perched on the rim.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 6, 
                        'title' => "Highland Farewell & Departure", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "Enjoy a final, slow breakfast overlooking the crater mist as it begins to lift. Your journey back to Arusha takes you through the scenic Rift Valley escarpment, where you will have the chance to visit local handicraft markets for last-minute gifts. Arrive in Arusha for a celebratory farewell lunch before your guide transfers you to the airport for your onward flight, carrying with you the spirit of the endless plains and the echoes of the wild.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 6980, '2' => 5135, '3' => 4965, '4' => 4555, '5' => 4560, '6' => 4350, 'SingleSupp' => 3422], 'Low' => ['1' => 5490, '2' => 4000, '3' => 3710, '4' => 3420, '5' => 3355, '6' => 3220, 'SingleSupp' => 2068]],
                    'Superior' => ['High' => ['1' => 5605, '2' => 3640, '3' => 3510, '4' => 3055, '5' => 3090, '6' => 2855, 'SingleSupp' => 2162], 'Low' => ['1' => 4695, '2' => 3030, '3' => 2800, '4' => 2450, '5' => 2425, '6' => 2250, 'SingleSupp' => 1334]],
                    'Standard' => ['High' => ['1' => 4385, '2' => 2860, '3' => 2585, '4' => 2280, '5' => 2225, '6' => 2075, 'SingleSupp' => 1054], 'Low' => ['1' => 4110, '2' => 2630, '3' => 2340, '4' => 2050, '5' => 1985, '6' => 1850, 'SingleSupp' => 801]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 2: SERENGETI – NGORONGORO (5D/4N) ━━━━
            [
                'name' => 'Serengeti – Ngorongoro Explorer',
                'slug' => 'serengeti-ngorongoro-5d',
                'days' => 5,
                'duration' => 5,
                'destinations' => ['Serengeti', 'Ngorongoro'],
                'price' => 2870,
                'short_description' => "Short, powerful, and wildly focused.",
                'overview' => "For those with limited time who refuse to compromise on the quality of their African experience, the Serengeti-Ngorongoro Explorer is the perfect solution. Focusing exclusively on the two most powerful icons of East Africa, this 5-day journey delivers maximum time in the prime wildlife corridors, ensuring you witness the predator action of the Serengeti and the volcanic density of the Crater.",
                'description' => "Skip the long transits and dive straight into the heart of the savanna. This itinerary is built for the wildlife purist who wants to maximize tracking hours in the Serengeti and the Ngorongoro caldera. By focusing on these two adjacent ecosystems, we spend less time on the road and more time following lion prides and chasing the horizon. You'll stay in boutique safari lodges that offer a blend of modern luxury and raw wilderness atmosphere, providing the perfect recovery for your next day's dawn patrol into the big cat territories.",
                'category' => ['Highlights', 'Wildlife'],
                'difficulty' => 'Easy',
                'best_season' => 'Jun–Mar',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Arusha Arrival & Briefing", 
                        'location' => "Arusha", 
                        'accommodation' => "Legendary Lodge", 
                        'description' => "Welcome to the gateway of Tanzania's wild circuit. After clearing customs, your private guide will transfer you to your boutique lodge nestled in the quiet highlands of Arusha. Spend the afternoon adjusting to the rhythm of East Africa, perhaps taking a guided coffee walk through the surrounding estate. In the evening, enjoy a locally sourced dinner as your guide presents the tracking maps for the Serengeti and Ngorongoro, preparing you for the dawn departure into the wild.", 
                        'meals' => "BB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Into the Serengeti Plains", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Serengeti Explorer", 
                        'description' => "A morning drive (or optional light aircraft flight) takes you through the rift valley and into the heart of the Serengeti National Park. As you enter the park, your first game drive begins immediately. The open savanna is home to over 4 million animals, and your guide will be scanning the horizon for the first signs of cheetahs or the massive wildebeest herds. You'll arrive at your camp in the Seronera valley just in time for a sundowner overlooking the endless plains, where the sounds of the night will soon take over.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Full Day: Big Cat Tracking", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Serengeti Explorer", 
                        'description' => "Today is dedicated to the unhurried exploration of the Serengeti ecosystem. We start before sunrise to observe the morning hunt when the air is cool and the big cats are most active. Explore the Retima Hippo Pool where hundreds of hippos jostle for space, and traverse the riverine forests where leopards are known to lurk in the sausage trees. Your lunch will be served as a gourmet picnic at a remote location, allowing you to maximize your time tracking the Great Migration herds. As evening falls, return to the lodge for a celebratory dinner under the clear stars of the southern hemisphere.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "The Ngorongoro Crater Floor", 
                        'location' => "Ngorongoro Crater", 
                        'accommodation' => "The Manor at Karatu", 
                        'description' => "Depart the Serengeti early for the drive to the Ngorongoro Conservation Area. You will descend 600 meters through the morning mist and onto the floor of the world's largest intact volcanic caldera. The wildlife here is incredibly unafraid, allowing for close-up encounters with elephants, lions, and the rare black rhino. Spend 6 hours exploring the diverse habitats of the floor, from the Lerai Forest to the alkaline Lake Magadi. After ascending back to the rim, you will move to a luxurious manor house in the Karatu highlands for an evening of fireside relaxation and fine dining.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 5, 
                        'title' => "Highland Tranquility & Departure", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "Enjoy a leisurely breakfast on the veranda, breathing in the fresh air of the highlands. If time permits, take a short nature walk around the estate or visit the local village of Karatu to experience the vibrant Tanzanian market life. Your guide will then drive you back to Arusha, arriving in time for an afternoon lunch before transferring you to the airport for your onward journey, leaving you with a profound connection to the rhythm of the wild.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 5550, '2' => 4255, '3' => 4080, '4' => 3805, '5' => 3785, '6' => 3650, 'SingleSupp' => 2648], 'Low' => ['1' => 4505, '2' => 3215, '3' => 3040, '4' => 2765, '5' => 2745, '6' => 2605, 'SingleSupp' => 1701]],
                    'Superior' => ['High' => ['1' => 4140, '2' => 2870, '3' => 2690, '4' => 2425, '5' => 2400, '6' => 2265, 'SingleSupp' => 1368], 'Low' => ['1' => 3740, '2' => 2575, '3' => 2355, '4' => 2125, '5' => 2080, '6' => 1970, 'SingleSupp' => 1003]],
                    'Standard' => ['High' => ['1' => 3565, '2' => 2470, '3' => 2230, '4' => 2020, '5' => 1960, '6' => 1865, 'SingleSupp' => 845], 'Low' => ['1' => 3470, '2' => 2380, '3' => 2115, '4' => 1930, '5' => 1845, '6' => 1770, 'SingleSupp' => 760]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 3: ARUSHA – TARANGIRE – NGORONGORO (3D/2N) ━━━━
            [
                'name' => 'Arusha – Tarangire – Ngorongoro Quick Safari',
                'slug' => 'arusha-tarangire-ngorongoro-3d',
                'days' => 3,
                'duration' => 3,
                'destinations' => ['Arusha NP', 'Tarangire', 'Ngorongoro'],
                'price' => 1390,
                'short_description' => "The perfect quick weekend escape.",
                'overview' => "Ideal for travelers with only a few days who want to experience the core essence of Tanzania's Northern Circuit. This 3-day sprint packs in Arusha's diversity, Tarangire's giants, and the world-famous Ngorongoro Crater floor. It is designed to minimize travel hours while maximizing your time in the presence of the Big Five.",
                'description' => "From the black-and-white colobus monkeys of Arusha NP to the massive elephants of Tarangire and the high-concentration wildlife of Ngorongoro, this 3-day adventure is designed to deliver maximum impact. We move quickly through the scenic highways, using a private 4x4 to jump directly into the wildlife corridors. You'll stay in selected luxury lodges in the Karatu highlands, providing a comfortable and atmospheric base between your game drives. This is the perfect introduction to East Africa for those on a tight schedule or as a high-adrenaline extension to a coastal stay.",
                'category' => ['Quick Escape', 'Wildlife'],
                'difficulty' => 'Easy',
                'best_season' => 'Year-round',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Arusha National Park & Meru Views", 
                        'location' => "Arusha NP", 
                        'accommodation' => "Gran Melia Arusha", 
                        'description' => "Start your safari with a game drive in Arusha National Park, a pocket of diversity featuring the pink-hued flamingos of Momella Lakes and the dramatic cliffs of Ngurdoto Crater. Watch for the rare black-and-white colobus monkeys in the montane forest and enjoy stunning views of Mt. Meru. In the late afternoon, retreat to your luxury Arusha hotel to gather your gear for tomorrow's early push into the northern circuit.", 
                        'meals' => "BB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Tarangire: Land of Giants", 
                        'location' => "Tarangire NP", 
                        'accommodation' => "Kilimamoja Lodge", 
                        'description' => "Drive into Tarangire National Park for a full day of game viewing among the iconic baobab trees. The park is famous for its large elephant herds and diverse birdlife gathering along the Tarangire River. Your guide will navigate the silhouetted forests to track lions and leopards before heading into the Karatu highlands. Your lodge here offers panoramic views of the surrounding hills, providing a perfect spot for your evening meal and pre-crater rest.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Ngorongoro Crater Floor & Return", 
                        'location' => "Ngorongoro Crater", 
                        'accommodation' => "N/A", 
                        'description' => "A morning of intense game viewing in the world-famous Ngorongoro Crater. This volcanic caldera hosts over 25,000 animals in a self-contained garden of Eden, including the rare black rhino. After a picnic lunch on the crater floor by the hippo pool, you will ascend the steep walls and drive back to Arusha. Arrive in the city for your evening departure, carrying the profound energy of the wild with you.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 2520, '2' => 1590, '3' => 1425, '4' => 1245, '5' => 1265, '6' => 1120, 'SingleSupp' => 734], 'Low' => ['1' => 2200, '2' => 1410, '3' => 1155, '4' => 1065, '5' => 1005, '6' => 940, 'SingleSupp' => 447]],
                    'Superior' => ['High' => ['1' => 2275, '2' => 1390, '3' => 1180, '4' => 1045, '5' => 1020, '6' => 920, 'SingleSupp' => 512], 'Low' => ['1' => 2140, '2' => 1100, '3' => 1055, '4' => 925, '5' => 900, '6' => 800, 'SingleSupp' => 390]],
                    'Standard' => ['High' => ['1' => 1935, '2' => 1170, '3' => 905, '4' => 820, '5' => 755, '6' => 700, 'SingleSupp' => 205], 'Low' => ['1' => 1910, '2' => 1145, '3' => 880, '4' => 795, '5' => 730, '6' => 675, 'SingleSupp' => 180]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 4: SAFARI & ZANZIBAR (14D/13N) ━━━━
            [
                'name' => 'Safari & Zanzibar: Bush to Beach',
                'slug' => 'safari-zanzibar-14d',
                'days' => 14,
                'duration' => 14,
                'destinations' => ['Tarangire', 'Serengeti', 'Ngorongoro', 'Zanzibar'],
                'price' => 5785,
                'short_description' => "The complete Tanzania. No compromises.",
                'overview' => "The ultimate 14-day Tanzanian odyssey. Spend your first week tracking the Great Migration and the Big Five in the legendary parks of the north, then fly to the spice island of Zanzibar for a week of barefoot luxury and turquoise Indian Ocean waters. This is the definitive journey that balances high-intensity wildlife with deep coastal relaxation.",
                'description' => "This is the 'Bucket List' safari. We start in the northern circuit, covering every major ecosystem from the baobabs of Tarangire to the endless plains of the Serengeti and the prehistoric crater of Ngorongoro. After 7 days of intense wildlife tracking and luxury lodge stays, you will fly directly from the savanna to the white sands of Zanzibar. This transition from the golden plains to the turquoise ocean is one of the world's great journeys. You'll immerse yourself in the spice-scented alleys of Stone Town before settling into a beachfront resort for 7 days of tropical bliss, snorkeling, and Swahili culture. Every detail is curated, from private transfers to all-inclusive resort stays.",
                'category' => ['Bush & Beach', 'Honeymoon'],
                'difficulty' => 'Easy',
                'best_season' => 'Jun–Oct',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Arusha Arrival & Coffee Retreat", 
                        'location' => "Arusha", 
                        'accommodation' => "Arusha Coffee Lodge", 
                        'description' => "Arrive at JRO and transfer to your luxury lodge on a working coffee plantation. Spend the day recovering from your travels, perhaps with a walk through the coffee trees or a spa treatment. Your first night will be a celebratory welcome dinner where you'll meet your guide and discuss the detailed plan for the northern circuit adventure.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Kilimanjaro West Exploration", 
                        'location' => "Kilimanjaro West", 
                        'accommodation' => "Arusha Coffee Lodge", 
                        'description' => "A day of mountain air and cultural insight. Drive to the western slopes of Mt. Kilimanjaro for a day trip featuring spectacular views of the summit and visits to local communities. It's a perfect 'warm-up' day before heading into the national parks, allowing you to settle into the pace of African life.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Tarangire: The Elephant River", 
                        'location' => "Tarangire NP", 
                        'accommodation' => "Kilimamoja Lodge", 
                        'description' => "Begin your safari in Tarangire, famous for its massive elephant herds and ancient baobab trees. You'll spend the day tracking wildlife along the riverbanks before driving to the Karatu highlands. Your lodge here is an oasis of calm perched above the Manyara escarpment with commanding views.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "Crossing the Ngorongoro Highlands", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Lake Magadi Lodge", 
                        'description' => "Drive through the misty highlands of Ngorongoro and descend onto the endless plains of the Serengeti. Your first Serengeti game drive begins immediately, scanning the short-grass plains for the first movement of the migration. Spend the night in an authentic luxury camp where the lions' roar is your evening music.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 5, 
                        'title' => "Serengeti: The Predator Valleys", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Lake Magadi Lodge", 
                        'description' => "Full day tracking the Big Five. Your guide will take you into the Seronera valley, a year-round predator-rich area. Search for lions on kopjes and leopards in the sausage trees. Lunch will be a picnic in the wild, surrounded by the infinite horizon of the savanna.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 6, 
                        'title' => "Return to the Rim", 
                        'location' => "Ngorongoro Rim", 
                        'accommodation' => "Melia Lodge Ngorongoro", 
                        'description' => "A final morning game drive in the Serengeti before winding your way back to the Ngorongoro highlands. You'll arrive at your lodge in time for a glass of wine on the balcony as you prepare for tomorrow's early descent into the volcanic crater.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 7, 
                        'title' => "The Crater Floor Expedition", 
                        'location' => "Ngorongoro Crater", 
                        'accommodation' => "Melia Lodge Ngorongoro", 
                        'description' => "Descend into the caldera for a 6-hour game drive. This is your best chance to spot the black rhino and see the Big Five in a single morning. After a picnic lunch on the floor, ascend and spend a final tranquil evening in the gardens of your Karatu lodge.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 8, 
                        'title' => "Savanna to Spice Island", 
                        'location' => "Zanzibar", 
                        'accommodation' => "Neptune Pwani Beach", 
                        'description' => "Drive back to Arusha for your light aircraft flight to Zanzibar. As the savanna fades below, the turquoise waters of the Indian Ocean appear. Transfer to your luxury beachfront resort on the east coast, where the sound of the surf replaces the sounds of the bush.", 
                        'meals' => "AI"
                    ],
                    [
                        'm' => 'AI', // This is just a marker for my internal loop
                        'day' => 9, 
                        'title' => "Zanzibar: Tropical Freedom (Days 9-13)", 
                        'location' => "Zanzibar", 
                        'accommodation' => "Neptune Pwani Beach", 
                        'description' => "Five days of unhurried tropical bliss. Relax on the white sands, snorkel the coral reefs of Mnemba Atoll, or take an optional excursion to Stone Town's historic spice markets. Every evening is a celebration of Swahili coastal cuisine and the unhurried rhythm of the island.", 
                        'meals' => "AI"
                    ],
                    [
                        'day' => 14, 
                        'title' => "Indian Ocean Farewell", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "A final morning swim and a slow breakfast overlooking the turquoise water. Transfer to Zanzibar International Airport for your flight home, carrying the dual spirits of the bush and the beach with you.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 12765, '2' => 9125, '3' => 9410, '4' => 8515, '5' => 8730, '6' => 8300, 'SingleSupp' => 8198], 'Low' => ['1' => 8735, '2' => 6145, '3' => 6325, '4' => 5335, '5' => 5830, '6' => 5325, 'SingleSupp' => 4536]],
                    'Superior' => ['High' => ['1' => 8075, '2' => 5785, '3' => 5720, '4' => 5175, '5' => 5235, '6' => 4965, 'SingleSupp' => 3935], 'Low' => ['1' => 6700, '2' => 4515, '3' => 4410, '4' => 3905, '5' => 3945, '6' => 3695, 'SingleSupp' => 2683]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 5: FLY-IN SERENGETI (4D/3N) ━━━━
            [
                'name' => 'Fly-in Serengeti & Ngorongoro Explorer',
                'slug' => 'fly-in-serengeti-4d',
                'days' => 4,
                'duration' => 4,
                'destinations' => ['Serengeti', 'Ngorongoro'],
                'price' => 3120,
                'short_description' => "Maximize your time with private flights.",
                'overview' => "The ultimate high-efficiency safari. By flying directly into the Serengeti, you bypass the long road transits, giving you more hours on the ground with the Great Migration. This 4-day intensive journey focuses on the pure wildlife action of the Seronera valley and the volcanic drama of the Ngorongoro Crater.",
                'description' => "For the traveler who values time above all else. This fly-in safari delivers you directly to the heartbeat of East Africa. Use light aircraft to jump the long dusty roads, arriving in the Serengeti in time for a morning game drive while others are still in transit. You'll stay in selected luxury camps within the prime wildlife sectors, ensuring every sunrise and sunset is spent in the presence of predators. Combined with a private 4x4 for your ground tracking in the Ngorongoro Crater, this is the most streamlined way to see the Big Five in under a week.",
                'category' => ['Fly-in', 'Luxury'],
                'difficulty' => 'Easy',
                'best_season' => 'Jun–Oct',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Wing Over the Rift Valley", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Four Seasons Safari Lodge", 
                        'description' => "Fly from Arusha Airport directly into the Seronera Airstrip. As the savanna fades into view from above, you'll see the massive herds of the migration across the plains. Your private guide will meet you at the airstrip and begin your first game drive immediately. Arrive at your luxury lodge in time for a late lunch and an afternoon exploring the Seronera river valley, a year-round leopard stronghold.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Serengeti Full Day Patrol", 
                        'location' => "Central Serengeti", 
                        'accommodation' => "Four Seasons Safari Lodge", 
                        'description' => "Spend a full day tracking the Big Five in the heart of the Serengeti. Your guide will focus on the kopjes where lion prides rest after a night of hunting. In the afternoon, follow the migratory herds as they move across the short-grass plains. Lunch is served as a gourmet picnic under a remote acacia, giving you maximum time in the wild.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "The Ngorongoro Descent", 
                        'location' => "Ngorongoro Crater", 
                        'accommodation' => "Melia Lodge Ngorongoro", 
                        'description' => "A morning drive across the Serengeti brings you to the Ngorongoro Crater. You will descend onto the caldera floor for a 6-hour game drive through an ecosystem that has changed little in thousands of years. Watch for black rhino and hippos before ascending to your lodge on the crater rim for a final celebratory dinner.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "Highland Mist & Departure", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "Enjoy a final breakfast overlooking the crater floor before driving back to Arusha. Along the way, visit a Maasai boma to learn about the ancient culture of the highlands. Arrive in Arusha in time for your evening departure, concluding your high-efficiency African odyssey.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 4500, '2' => 3120, '3' => 2900, '4' => 2700, 'SingleSupp' => 1500]],
                    'Superior' => ['High' => ['1' => 3800, '2' => 2600, '3' => 2400, '4' => 2200, 'SingleSupp' => 1100]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 6: SELOUS FLY-IN (4D/3N) ━━━━
            [
                'name' => 'Southern Safari: Selous Fly-In',
                'slug' => 'selous-fly-in-4d',
                'days' => 4,
                'duration' => 4,
                'destinations' => ['Selous (Nyerere)'],
                'price' => 2334,
                'short_description' => "Boat safaris and wild dog tracking in the vast south.",
                'overview' => "Experience the raw, untamed wilderness of Nyerere National Park (formerly Selous). This fly-in safari takes you to Africa's largest protected area, where the Rufiji River creates a network of lakes and channels home to massive populations of hippo, crocodile, and the rare African wild dog.",
                'description' => "Escape the crowds and dive into the wild south. The Selous is genuinely vast, larger than Switzerland, and offers a diversity of safari activities impossible in the north. This 4-day fly-in journey focuses on the Rufiji riverine ecosystem. You'll experience traditional game drives, silent boat safaris along the marshy channels, and guided walking safaris into the miombo woodland. It is a frontier experience for the traveler who wants to feel the true scale of the African bush away from the popular circuits.",
                'category' => ['Fly-in', 'Off-the-beaten-track'],
                'difficulty' => 'Moderate',
                'best_season' => 'Jun–Oct',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Into the Wild South", 
                        'location' => "Nyerere NP", 
                        'accommodation' => "Roho ya Selous", 
                        'description' => "Fly from Dar es Salaam or Zanzibar directly into the deep Selous. As the aircraft descends over the Rufiji River, you'll see the massive pods of hippos gathering in the channels. Your guide will meet you and transfer you to your luxury camp. In the afternoon, embark on your first boat safari, drifting silently through the marshes as the sun sets over the water.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Wild Dog Tracking & Game Drives", 
                        'location' => "Nyerere NP", 
                        'accommodation' => "Roho ya Selous", 
                        'description' => "Spend a full day exploring the diverse habitats of the Selous. Your guide will focus on tracking the African wild dog, a rare predator that has its strongest population here. In the afternoon, enjoy a game drive through the palm-lined savanna, spotting elephants, giraffes, and various antelope species. Lunch is a picnic in the wild, surrounded by the silence of the southern bush.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Walking Safari & Bush Dining", 
                        'location' => "Nyerere NP", 
                        'accommodation' => "Roho ya Selous", 
                        'description' => "Start the morning with a guided walking safari, learning the intricate details of the bush from an expert ranger. Following the tracks of animals on foot is a visceral experience that connects you more deeply to the ecosystem. The afternoon is free for a final boat safari or an unhurried game drive, concluding with a celebratory farewell bush dinner under the brilliant southern stars.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "Rufiji Ripple & Departure", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "Embark on a final morning game drive as the sun rises over the river. After a slow brunch at the camp, transfer to the airstrip for your flight back to Dar es Salaam or Zanzibar, carrying the wild spirit of the south with you.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 3500, '2' => 2334, '3' => 2200, '4' => 2000, 'SingleSupp' => 1200]],
                    'Superior' => ['High' => ['1' => 2900, '2' => 1985, '3' => 1800, '4' => 1650, 'SingleSupp' => 900]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 7: MIKUMI SGR TRAIN (3D/2N) ━━━━
            [
                'name' => 'Mikumi SGR Train Experience',
                'slug' => 'mikumi-sgr-3d',
                'days' => 3,
                'duration' => 3,
                'destinations' => ['Mikumi NP'],
                'price' => 1986,
                'short_description' => "Modern rail meets the golden savanna.",
                'overview' => "Experience the new era of Tanzanian travel with the SGR Train from Dar es Salaam to Morogoro, followed by an intensive wildlife safari in Mikumi National Park. This 3-day journey combines the luxury of modern rail with the wild energy of the Mkata plains.",
                'description' => "Avoid the long road transits with the high-speed SGR train, an experience in itself as you glide through the Tanzanian countryside. Mikumi is often called 'The Little Serengeti', and its open floodplains are home to massive herds of buffalo, zebra, and elephants. This 3-day adventure is perfect for those staying in Dar es Salaam who want a quick but high-quality wildlife encounter. You'll stay in a selected luxury camp bordering the park, ensuring you remain connected to the sounds of the bush throughout your stay.",
                'category' => ['Rail & Safari', 'Quick Escape'],
                'difficulty' => 'Easy',
                'best_season' => 'Year-round',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "The SGR Rail Journey", 
                        'location' => "Mikumi NP", 
                        'accommodation' => "Mikumi Luxury Camp", 
                        'description' => "Depart Dar es Salaam on the modern SGR high-speed train, enjoying the comfortable journey through the rift valley. Your private guide will meet you in Morogoro and drive you directly into Mikumi National Park. Embark on an afternoon game drive across the Mkata plains, spotting herds of giraffes and elephants before settling into your camp for a savanna-styled dinner.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Mkata Plains: The Little Serengeti", 
                        'location' => "Mikumi NP", 
                        'accommodation' => "Mikumi Luxury Camp", 
                        'description' => "Spend a full day patrolling the open savanna of Mikumi. This park is famous for its 'Mikumi Lions', which are often found resting in the acacia trees. Tracking buffalos and zebras along the floodplains is the focus of the morning, followed by a picnic lunch in the wild. In the afternoon, visit the hippo pool for some unique aquatic wildlife sightings before returning to the camp for sundowners.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Dawn Drive & Rail Return", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "A final morning game drive as the sun hits the Mkata plains. After a hearty breakfast, your guide will drive you back to Morogoro for your SGR train return to Dar es Salaam. Arrive in the city in time for your evening arrangements, carrying the vibrant pulse of the savanna with you.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 2200, '2' => 1986, '3' => 1800, '4' => 1650, 'SingleSupp' => 800]],
                    'Superior' => ['High' => ['1' => 1800, '2' => 1500, '3' => 1350, '4' => 1200, 'SingleSupp' => 600]],
                ]
            ],
            // ━━━━━━━━ PACKAGE 8: FLY-IN RUAHA (4D/3N) ━━━━
            [
                'name' => 'Ruaha Fly-In: The Untamed Core',
                'slug' => 'ruaha-fly-in-4d',
                'days' => 4,
                'duration' => 4,
                'destinations' => ['Ruaha NP'],
                'price' => 2650,
                'short_description' => "Deep wilderness in the largest park in Tanzania.",
                'overview' => "Ruaha is Tanzania's largest park and its best-kept secret. This 4-day fly-in safari takes you to the wild heart of the country, where the landscape is defined by ancient baobabs, red soil, and the predator-rich banks of the Great Ruaha River.",
                'description' => "Experience safari as it was meant to be: raw, unhurried, and genuinely wild. Ruaha receives a fraction of the visitors of the north, making every game drive feel like a private expedition. This itinerary focuses on the arid, baobab-studded landscapes that house the highest concentration of lions in East Africa. You'll fly over the rift valley as you land on a remote airstrip, jumping directly into the tracking of massive elephant herds and predators. Accommodation is in selected luxury camps that respect the environment while providing the ultimate comfort in a frontier setting.",
                'category' => ['Fly-in', 'Wilderness'],
                'difficulty' => 'Moderate',
                'best_season' => 'Jun–Oct',
                'itinerary' => [
                    [
                        'day' => 1, 
                        'title' => "Wing to the Baobab Heart", 
                        'location' => "Ruaha NP", 
                        'accommodation' => "Jongomero Camp", 
                        'description' => "Fly from Dar es Salaam or Arusha into the Ruaha Msembe airstrip. The scale of the park becomes apparent from the air, a vast expanse of baobabs and rocky outcrops. Your guide will meet you and transfer you to your camp along the riverbank. Embark on an afternoon game drive, tracking the movement of elephants as they dig for water in the dry riverbed.", 
                        'meals' => "HB"
                    ],
                    [
                        'day' => 2, 
                        'title' => "Great Ruaha River Patrol", 
                        'location' => "Ruaha NP", 
                        'accommodation' => "Jongomero Camp", 
                        'description' => "Spend a full day tracking the Big Five along the Great Ruaha River. The river is the lifeline of the park, and during the dry season, it draws thousands of animals to its banks. Watch for lion prides numbering up to 20 individuals and follow the elegant kudu as they graze in the riverine forest. Lunch is a picnic in a remote location, followed by an afternoon search for the rare wild dog.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 3, 
                        'title' => "Kopje Walk & Wilderness Drive", 
                        'location' => "Ruaha NP", 
                        'accommodation' => "Jongomero Camp", 
                        'description' => "Start the morning with a guided walking safari, exploring the rocky outcrops (kopjes) on foot. In the afternoon, embark on an unhurried game drive through the more remote sectors of the park, where spectacular views of the rift valley escarpment provide a perfect backdrop for your final African sunset. Conclude with a celebratory farewell dinner under the brilliant southern stars.", 
                        'meals' => "FB"
                    ],
                    [
                        'day' => 4, 
                        'title' => "Savanna Exhale & Departure", 
                        'location' => "Departure", 
                        'accommodation' => "N/A", 
                        'description' => "A final morning drive before flying back to Arusha or Dar es Salaam. The flight offers a final chance to see the vastness of the Tanzanian wilderness from above before you reconnect with your onward journey.", 
                        'meals' => "B"
                    ],
                ],
                'price_tiers' => [
                    'Premium' => ['High' => ['1' => 3800, '2' => 2650, '3' => 2500, '4' => 2300, 'SingleSupp' => 1200]],
                    'Superior' => ['High' => ['1' => 3200, '2' => 2200, '3' => 2000, '4' => 1800, 'SingleSupp' => 1000]],
                ]
            ],
        ];

        // Seeder implementation loop
        foreach ($safariPackages as $p) {
            $safari = Safari::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'name' => $p['name'],
                    'days' => $p['days'],
                    'duration' => $p['duration'],
                    'destinations' => $p['destinations'],
                    'price' => $p['price'],
                    'short_description' => $p['short_description'],
                    'overview' => $p['overview'],
                    'description' => $p['description'],
                    'category' => $p['category'],
                    'difficulty' => $p['difficulty'],
                    'best_season' => $p['best_season'],
                    'status' => 'published',
                    'featured' => in_array($p['slug'], ['tarangire-serengeti-ngorongoro-7d', 'safari-zanzibar-14d']),
                    'inclusions' => $globalInclusions,
                    'exclusions' => $globalExclusions,
                    'price_tiers' => $p['price_tiers'],
                ]
            );

            $safari->itineraryDays()->delete();
            foreach ($p['itinerary'] as $day) {
                ItineraryDay::create([
                    'safari_id' => $safari->id,
                    'day' => $day['day'],
                    'title' => $day['title'],
                    'location' => $day['location'],
                    'description' => $day['description'],
                    'meals' => $day['meals'],
                    'accommodation' => $day['accommodation'],
                ]);

                if ($day['accommodation'] !== 'N/A') {
                   SafariAccommodation::updateOrCreate(
                       ['safari_id' => $safari->id, 'name' => $day['accommodation']],
                       ['tier' => 'Premium', 'rating' => 5]
                   );
                }
            }
        }
    }
}
