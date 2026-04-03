<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\DestinationAccommodation;
use App\Models\DestinationFaq;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear existing data
        Destination::query()->delete();
        DestinationAccommodation::query()->delete();
        DestinationFaq::query()->delete();

        $destinations = [
            // ━━━━━━━━ SERENGETI ━━━━
            [
                'name'           => 'Serengeti National Park',
                'slug'           => 'serengeti',
                'region'         => 'Northern Circuit',
                'tagline'        => 'The land of endless plains and ancient migrations.',
                'area_stat'      => '14,750 km²',
                'area_label'     => 'WORLD HERITAGE SITE',
                'hero_image'     => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                'pull_quote'     => 'There is no place on Earth that feels quite as primordial as the Serengeti at dawn.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Big Five'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Oct'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '25°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '14K km²'],
                ],
                'overview'       => [
                    "The Serengeti is not just a destination, it is a reckoning with the ancient. Stretching across 14,000 square kilometers of open savanna, this is the earth at its most elemental: grass and sky and the unceasing movement of life. The name itself, derived from the Maasai word 'Siringet', means 'endless plains', and standing here at dawn, with the acacia silhouettes against a bleeding horizon, you understand why.",
                    "This is the theater of the Great Migration, the largest movement of land animals on the planet, where 1.5 million wildebeest, 500,000 zebra, and 200,000 gazelle follow ancient instincts in a continuous loop across the Serengeti-Mara ecosystem. But the Serengeti is not only about the migration. Year-round, the park hosts the densest concentration of predators in Africa: lion prides draped across granite kopjes, leopards hanging their kills in acacia forks, and cheetah mothers teaching cubs the geometry of the hunt.",
                    "In the north, the Mara River crossings, where crocodiles wait in churning brown water, are among the most visceral wildlife spectacles on Earth. In the south, Ndutu's short-grass plains host the calving season in January and February, when tens of thousands of wildebeest calves are born within days of each other. The Serengeti does not offer you wildlife, it demands you witness it."
                ],
                'wildlife'       => [
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The Serengeti holds one of Africa\'s largest lion populations, over 3,000 individuals.'],
                    ['name' => 'Leopard', 'image' => 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Often found in the Seronera Valley, draped over the branches of large sausage trees.'],
                    ['name' => 'Cheetah', 'image' => 'https://images.unsplash.com/photo-1534149043227-d4677db02787?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'The open plains provide the perfect high-speed hunting grounds for these cats.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Massive herds move between the riverine forests and the open plains year-round.'],
                    ['name' => 'Black Rhino', 'image' => 'https://images.unsplash.com/photo-1598894000396-bc30e0996899?w=640&q=80', 'likelihood' => 'Rare', 'fact' => 'A small, protected population resides in the remote Moru Kopjes area.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Dry and warm', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Calving season begins in the south'],
                    ['abbr' => 'FEB', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Peak calving, thousands of births daily'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains begin', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lush green landscapes, excellent birding'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Quiet trails, best value photography'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Rains finish', 'crowds' => 1, 'price' => '$', 'expect' => 'Vibrant colours, migration moves north'],
                    ['abbr' => 'JUN', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry season begins', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Migration in the Western Corridor'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and cool', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Mara River crossings begin, peak drama'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and cool', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Intense river crossings continue'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry season peak', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Excellent predator sightings at water'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Final crossings, herds move south'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Herds return to the short grass plains'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday season', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Festive safari atmosphere in central'],
                ],
                'seasons' => [
                    ['name' => 'The Great Migration', 'dates' => 'June - October', 'highlights' => ['River crossings', 'Dry weather', 'High predator action'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'Calving Season', 'dates' => 'January - February', 'highlights' => ['Newborn calves', 'Cheetah hunting action', 'Green plains'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'],
                    ['name' => 'Emerald Season', 'dates' => 'March - May', 'highlights' => ['Lush landscapes', 'No crowds', 'Best photography light'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Balloon Safari', 'description' => 'Float over the endless plains as the sun rises, followed by a champagne breakfast.', 'tags' => ['Adventure', 'Luxury'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80'],
                   ['title' => 'Cheetah Interaction', 'description' => 'Observe the world\'s fastest land animal in its natural hunting grounds on the short grass plains.', 'tags' => ['Wildlife', 'Fast'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                   ['title' => 'Cultural Interaction', 'description' => 'Visit a local Maasai village and learn about their deep connection with the wild.', 'tags' => ['Culture', 'Community'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'Mid-June to October (Migration), or Jan-Feb (Calving)',
                    'flying_time' => '1 hour from Arusha or 2 hours from Zanzibar',
                    'transport' => '4x4 safari vehicles and light aircraft',
                    'visa' => 'eVisa available, apply online before arrival',
                ],
                'accommodations' => [
                    ['name' => 'Four Seasons Safari Lodge', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Serengeti Explorer', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Lake Magadi Lodge', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'When is the best time for the Great Migration?', 'answer' => 'The best time for river crossings is between July and October in the north. Calving happens in the south from late January to February.'],
                    ['question' => 'How do I get to the Serengeti?', 'answer' => 'Most travellers fly from Arusha directly into one of the several airstrips, or drive via the Ngorongoro Conservation Area.'],
                    ['question' => 'Is it safe for families?', 'answer' => 'Yes, many lodges are family-friendly and provide safe environments, though we recommend children be at least 6 years old for full game drives.'],
                ],
                'related_slugs' => ['ngorongoro', 'tarangire', 'zanzibar'],
            ],
            // ━━━━━━━━ NGORONGORO ━━━━
            [
                'name'           => 'Ngorongoro Conservation Area',
                'slug'           => 'ngorongoro',
                'region'         => 'Northern Circuit',
                'tagline'        => 'The world largest intact volcanic caldera.',
                'area_stat'      => '8,292 km²',
                'area_label'     => 'UNESCO WORLD HERITAGE',
                'hero_image'     => 'https://images.unsplash.com/photo-1621414050946-1b936a78cf58?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1502911661445-12c8203fdd39?w=800&q=80',
                'pull_quote'     => 'Descending into the crater is like stepping into a self-contained world from another geological era.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Black Rhino'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Year-round'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '20°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '8K km²'],
                ],
                'overview'       => [
                    "Three million years ago, a volcano larger than Kilimanjaro collapsed upon itself and formed the Ngorongoro Crater, a 264 square kilometer caldera that has since become one of the most extraordinary concentrations of wildlife on Earth. The crater is not merely a landmark, it is an entire world contained within its ancient walls.",
                    "Descending the steep crater wall at dawn, as mist rolls across the soda lake below and the first golden light catches the rim, is one of the great arrivals in African travel. The crater floor hosts an estimated 25,000 large animals in permanent residence, including one of Africa's last viable populations of black rhino, which can often be spotted grazing in the open plains near the Lerai Forest.",
                    "Beyond the crater itself, the Conservation Area spans a vast range of habitats, from mountain forests and volcanic peaks to the short-grass plains that border the Serengeti. It is unique in Tanzania as a multiple land-use area where the Maasai people coexist with the wildlife, creating a cultural landscape that is as fascinating as the wildlife spectacle."
                ],
                'wildlife'       => [
                    ['name' => 'Black Rhino', 'image' => 'https://images.unsplash.com/photo-1598894000396-bc30e0996899?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'One of the few places in East Africa where black rhino can be reliably spotted in the wild.'],
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The crater hosts a dense population of large-maned lions who are famously unperturbed by vehicles.'],
                    ['name' => 'Hippo', 'image' => 'https://images.unsplash.com/photo-1534149043227-d4677db02787?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Dozens of hippos can be found at the Ngoitokitok spring, often seen jostling for space.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Old bull elephants with massive tusks are an iconic sight in the Lerai Forest.'],
                    ['name' => 'Flamingo', 'image' => 'https://images.unsplash.com/photo-1598894000396-bc30e0996899?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Lake Magadi often turns pink with the presence of thousands of lesser flamingos.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Excellent visibility across the floor'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Wildlife congregates at water sources'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Lush greening', 'crowds' => 2, 'price' => '$$', 'expect' => 'Dramatic clouds, great photography'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Peak rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Quiet crater, emerald green walls'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Mist and rain', 'crowds' => 1, 'price' => '$', 'expect' => 'Ethereal atmosphere, low vehicle count'],
                    ['abbr' => 'JUN', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cool and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Sharp light, easy wildlife spotting'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cold mornings', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Peak season, incredible rhino luck'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and windy', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Dusty plains, high action at springs'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Clear and dry', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Best time for predator sightings'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warming up', 'crowds' => 4, 'price' => '$$$', 'expect' => 'Golden grass, intense blue skies'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Flowers blooming on the rim'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday peak', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Celebratoy vibe, busy crater descent'],
                ],
                'seasons'        => [
                    ['name' => 'The Big Five Window', 'dates' => 'June - September', 'highlights' => ['Black rhino sightings', 'Cooler climate', 'Best visibility'], 'image' => 'https://images.unsplash.com/photo-1621414050946-1b936a78cf58?w=800&q=80'],
                    ['name' => 'The Green Oasis', 'dates' => 'March - May', 'highlights' => ['Lush landscapes', 'No crowds', 'Active birdlife'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'Highland Explorer', 'dates' => 'October - February', 'highlights' => ['Emerald views', 'Migration nearby', 'Cultural depth'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences'    => [
                    ['title' => 'Crater Floor Game Drive', 'description' => 'A full 6-hour descent onto the floor of the caldera, exploring diverse habitats from soda lakes to acacia forests.', 'tags' => ['Wildlife', 'Iconic'], 'image' => 'https://images.unsplash.com/photo-1621414050946-1b936a78cf58?w=400&q=80'],
                    ['title' => 'Maasai Boma Visit', 'description' => 'Interact with the local Maasai community and learn about their ancient spiritual connection to the crater and its inhabitants.', 'tags' => ['Culture', 'Insight'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                    ['title' => 'Empakaai Crater Hike', 'description' => 'A guided walk to the remote Empakaai Crater, where you can hike down to the lake shore through ancient mountain forests.', 'tags' => ['Walking', 'Adventure'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1621414050946-1b936a78cf58?w=800&q=80',
                    'https://images.unsplash.com/photo-1502911661445-12c8203fdd39?w=800&q=80',
                    'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80',
                ],
                'travel_info'    => [
                    'best_time'     => 'June to September for wildlife, March to May for views',
                    'flying_time'   => '45m from Arusha to Lake Manyara Airstrip',
                    'transport'     => 'Closed safari vehicle for the rim and crater',
                    'visa'          => 'Included in standard Tanzanian eVisa',
                ],
                'related_slugs' => ['serengeti', 'tarangire', 'lake-manyara'],
                'accommodations' => [
                    ['name' => 'Melia Lodge Ngorongoro', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'The Manor at Karatu', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Neptune Lodge Karatu', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs'           => [
                    ['question' => 'How long should I spend at Ngorongoro?', 'answer' => 'Most visitors find that one full game drive on the crater floor is sufficient, which usually takes about 6 hours. However, staying for two nights allows you to explore the highlands and surrounding craters.'],
                    ['question' => 'Can I see the Big Five in one day here?', 'answer' => 'Yes, Ngorongoro is one of the few places in the world where it is possible to see all Big Five animals (Lion, Leopard, Elephant, Buffalo, and Rhino) in a single game drive.'],
                    ['question' => 'Is it cold at Ngorongoro?', 'answer' => 'Yes, because of the high elevation of the rim (2,200m), mornings and evenings can be very cold, even in the summer. Bring a warm fleece and jacket for your morning descent.'],
                ]
            ],
            // ━━━━━━━━ TARANGIRE ━━━━
            [
                'name'           => 'Tarangire National Park',
                'slug'           => 'tarangire',
                'region'         => 'Northern Circuit',
                'tagline'        => 'The kingdom of the ancient baobabs and giants.',
                'area_stat'      => '2,850 km²',
                'area_label'     => 'NORTHERN GIANTS',
                'hero_image'     => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1523806781031-bc6e572886f4?w=800&q=80',
                'pull_quote'     => 'Watching an elephant herd move through the silhouetted baobab forest is a memory that stays forever.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Elephants'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Oct'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '26°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '2.8K km²'],
                ],
                'overview'       => [
                    "Tarangire is where the baobab trees reign. These ancient, barrel-trunked giants, some over a thousand years old, define the visual character of the park entirely. Standing beneath them, watching a herd of elephants move like grey fog through the undergrowth, you understand why this park is called the Kingdom of the Elephant.",
                    "During the dry season (June to October), the Tarangire River becomes the only water source for hundreds of kilometres, drawing extraordinary concentrations of wildlife to its banks. Elephant herds numbering in the hundreds, among the largest gatherings in Tanzania, congregate along the river alongside buffalo, zebra, wildebeest, and giraffe. The predator action follows inevitably.",
                    "Tarangire is also a paradise for birders, with over 550 species of birds recorded. The various habitats, from open plains to swamps and riverine forests, provide sanctuary for everything from the massive ostrich to the tiny, vibrant Fischer's lovebird. It is a park of silhouettes, best experienced as the sun sets behind the iconic baobabs."
                ],
                'wildlife'       => [
                    ['name' => 'African Elephant', 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Tarangire has one of the highest elephant densities in Africa, herds of 300+ are common in the dry season.'],
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Often seen in the tall grass or perched on top of termite mounds used as lookouts.'],
                    ['name' => 'Oryx', 'image' => 'https://images.unsplash.com/photo-1534149043227-d4677db02787?w=640&q=80', 'likelihood' => 'Rare', 'fact' => 'The fringe-eared oryx is one of the more elusive and beautiful inhabitants of the drier sectors.'],
                    ['name' => 'Giraffe', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The Maasai giraffe is the national animal and is found in high numbers near the river.'],
                    ['name' => 'Leopard', 'image' => 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Masters of disguise, they are often found in the larger trees along the Tarangire River.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and green', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lush landscapes, birding peak'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and dry', 'crowds' => 2, 'price' => '$$', 'expect' => 'Good game viewing in the swamps'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Rains begin', 'crowds' => 1, 'price' => '$$', 'expect' => 'Migratory birds at their peak'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Peak rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Lush but some roads may be soft'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Quiet rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Solitude and green horizons'],
                    ['abbr' => 'JUN', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry season begins', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Wildlife moving toward the river'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cooler air', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Elephant numbers begin to swell'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and dusty', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Massive herds reaching their peak'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Very dry', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Intense action at the riverbanks'],
                    ['abbr' => 'OCT', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Final concentration of wildlife'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Landscape transforms overnight'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday peak', 'crowds' => 3, 'price' => '$$$$', 'expect' => 'Emerald season safari vibe'],
                ],
                'seasons'        => [
                    ['name' => 'The Elephant Gathering', 'dates' => 'July - October', 'highlights' => ['Massive herds', 'River tracking', 'Best predator sightings'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80'],
                    ['name' => 'The Green Sanctuary', 'dates' => 'November - February', 'highlights' => ['Emerald vistas', 'Active birdlife', 'Newborn animals'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'Birder\'s Paradise', 'dates' => 'March - May', 'highlights' => ['Migratory species', 'Lush photography', 'Total solitude'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'],
                ],
                'experiences'    => [
                    ['title' => 'Walking Safari', 'description' => 'Explore the smaller details of the park on foot with an armed ranger, understanding the ecosystem beyond the vehicles.', 'tags' => ['Adventure', 'Nature'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80'],
                    ['title' => 'Tarangire River Picnic', 'description' => 'Enjoy lunch overlooking the lifeblood of the park as elephants and zebras come to drink just metres away.', 'tags' => ['Wildlife', 'Relaxation'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                    ['title' => 'Birding Expedition', 'description' => 'A specialist-led tour focusing on the over 550 species of birds that call this diverse park home.', 'tags' => ['Speciailist', 'Birding'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
                    'https://images.unsplash.com/photo-1523806781031-bc6e572886f4?w=800&q=80',
                    'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80',
                ],
                'travel_info'    => [
                    'best_time'     => 'July to October for elephants, year-round for birding',
                    'flying_time'   => '2h drive from Arusha or 30m flight',
                    'transport'     => 'Open or closed safari vehicles',
                    'visa'          => 'Standard Tanzanian eVisa required',
                ],
                'related_slugs' => ['serengeti', 'ngorongoro', 'lake-manyara'],
                'accommodations' => [
                    ['name' => 'Tarangire Treetops', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Kilimamoja Lodge', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Tarangire Safari Lodge', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs'           => [
                    ['question' => 'Is Tarangire worth visiting?', 'answer' => 'Absolutely. It is often cited as a favorite by safari enthusiasts because of its high wildlife concentration and iconic baobab trees. It feels more wild and less crowded than some other northern parks.'],
                    ['question' => 'When do the elephants arrive?', 'answer' => 'While elephants are resident year-round, the massive herds begin to congregate along the river as the surrounding water sources dry up, usually starting in late June or July.'],
                    ['question' => 'Can we do a night game drive here?', 'answer' => 'Yes, some of the private concessions bordering the park or specific lodges like Treetops offer guided night game drives, which are a thrilling way to see nocturnal animals like porcupines and leopards.'],
                ]
            ],
            // ━━━━━━━━ ARUSHA ━━━━
            [
               'name'           => 'Arusha National Park',
               'slug'           => 'arusha',
               'region'         => 'Northern Circuit',
               'tagline'        => 'A pocket of mountain misty peaks and diverse forests.',
               'area_stat'      => '137 km²',
               'area_label'     => 'MOUNTAIN SANCTUARY',
               'hero_image'     => 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=1600&q=80',
               'portrait_image' => 'https://images.unsplash.com/photo-1555061614-7225cb85834d?w=800&q=80',
               'pull_quote'     => 'The silent beauty of Mt. Meru reflecting in the Momella Lakes is a moment of pure serenity.',
               'status'         => 'published',
               'quick_facts'    => [
                   ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Colobus Monkey'],
                   ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Year-round'],
                   ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '22°C'],
                   ['icon' => 'map', 'label' => 'SIZE', 'value' => '137 km²'],
               ],
               'overview'       => [
                   "Arusha National Park is often overshadowed by its larger neighbours, but it is one of Tanzania's most beautiful and diverse gems. Located just a short drive from the city, it offers a dramatic landscape that shifts from montane forest and alkaline lakes to the towering volcanic peak of Mt. Meru, Africa's fifth highest mountain. It is a place of shadows and mist, where the silence is only broken by the calls of birds and the rustle of the canopy.",
                   "The park is famous for its population of black-and-white colobus monkeys, whose long flowing tails and acrobatic leaps through the ancient moss-draped trees are a delight to watch. Unlike the open plains of the Serengeti, Arusha NP is an intimate experience, where you can explore the Ngurdoto Crater, often called the 'Little Ngorongoro', and the seven Momella Lakes, each with a different hue of blue or green due to their varying mineral content.",
                   "For those seeking adventure, the multi-day climb of Mt. Meru provides a challenging but rewarding trek through diverse ecological zones. On clear days, the views of Mt. Kilimanjaro from the slopes of Meru are unparalleled. It is the perfect introduction to the Tanzanian wild, whether for a day trip or as the starting point for a longer northern circuit expedition."
               ],
               'wildlife'       => [
                   ['name' => 'Colobus Monkey', 'image' => 'https://images.unsplash.com/photo-1555524330-9ec8058309ec?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Famous for their spectacular white tails and their preference for high-canopy mountain forests.'],
                   ['name' => 'Giraffe', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The park has an incredibly high density of Maasai giraffes, often seen grazing against the backdrop of Mt. Meru.'],
                   ['name' => 'Flamingo', 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Thousands of flamingos gather at the Momella Lakes, creating a pink haze on the water.'],
                   ['name' => 'Blue Monkey', 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Playful and vocal inhabitants of the park\'s dense montane forests.'],
                   ['name' => 'Buffalo', 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Often found grazing in the open glades and near the forest edges.'],
               ],
               'months'         => [
                   ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Clear and cool', 'crowds' => 2, 'price' => '$$', 'expect' => 'Excellent mountain views'],
                   ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 2, 'price' => '$$', 'expect' => 'Great for birding near the lakes'],
                   ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Mist and rain', 'crowds' => 1, 'price' => '$$', 'expect' => 'Lush forests, vibrant mosses'],
                   ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Emerald rainforest atmosphere'],
                   ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Fresh and green', 'crowds' => 1, 'price' => '$', 'expect' => 'Quietest month, pure solitude'],
                   ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Crisp and dry', 'crowds' => 2, 'price' => '$$', 'expect' => 'Clear air, ideal for photography'],
                   ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cold mornings', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Mt. Meru trekking season peak'],
                   ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Perfect walking safari conditions'],
                   ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Best for colobus monkey sightings'],
                   ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Clear skies', 'crowds' => 2, 'price' => '$$', 'expect' => 'Migratory birds begin to arrive'],
                   ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Flowering montane plants'],
                   ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday bright', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Ideal for festive day trips'],
               ],
               'seasons' => [
                   ['name' => 'Mount Meru Climbing', 'dates' => 'July - February', 'highlights' => ['Summit reaches', 'Alpine views', 'Diverse zones'], 'image' => 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800&q=80'],
                   ['name' => 'Birding & Lakes', 'dates' => 'November - April', 'highlights' => ['Flamingo flocks', 'Migratory species', 'Lush scenery'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                   ['name' => 'Walking Haven', 'dates' => 'June - September', 'highlights' => ['Guided bush walks', 'Colobus tracking', 'Cooler climate'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
               ],
               'experiences' => [
                  ['title' => 'Canoeing on Momella Lakes', 'description' => 'A unique way to see wildlife from the water, including hippos and thousands of flamingos.', 'tags' => ['Water', 'Serene'], 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=400&q=80'],
                  ['title' => 'Arusha NP Walking Safari', 'description' => 'Accompanied by an armed ranger, venture onto the savanna glades to see giraffes and buffalos up close.', 'tags' => ['Walking', 'Adventure'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80'],
                  ['title' => 'Ngurdoto Crater Viewpoint', 'description' => 'Take in the spectacular panoramic views of the "Little Ngorongoro" from the rim of this ancient caldera.', 'tags' => ['Views', 'Iconic'], 'image' => 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400&q=80'],
               ],
               'gallery' => [
                   'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800&q=80',
                   'https://images.unsplash.com/photo-1555061614-7225cb85834d?w=800&q=80',
                   'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=800&q=80',
               ],
               'travel_info' => [
                   'best_time' => 'June to February for views and trekking',
                   'flying_time' => '45m drive from central Arusha city',
                   'transport' => 'Accessible by standard vehicles or safari 4x4',
                   'visa' => 'Standard Tanzanian eVisa applies',
               ],
               'accommodations' => [
                   ['name' => 'Gran Melia Arusha', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                   ['name' => 'Legendary Lodge', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                   ['name' => 'Arusha Coffee Lodge', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
               ],
               'faqs' => [
                   ['question' => 'How close is Arusha NP to the city?', 'answer' => 'It is remarkably close, usually a 45-60 minute drive from the city centre, making it the perfect choice for a day trip or a short introduction to the Tanzanian wild.'],
                   ['question' => 'Is it possible to hike Mt. Meru?', 'answer' => 'Yes, Arusha NP is the gateway for Mt. Meru climbs. It usually takes 3 to 4 days to reach the summit, and it is considered a great warm-up for Mt. Kilimanjaro.'],
                   ['question' => 'Are there elephants in Arusha NP?', 'answer' => 'While elephants are present, they are more elusive here than in Tarangire or Serengeti. You are much more likely to see giraffes, buffalos, and colobus monkeys.'],
               ],
               'related_slugs' => ['serengeti', 'kilimanjaro', 'tarangire'],
            ],
            // ━━━━━━━━ LAKE MANYARA ━━━━
            [
                'name'           => 'Lake Manyara National Park',
                'slug'           => 'lake-manyara',
                'region'         => 'Northern Circuit',
                'tagline'        => 'A gem of groundwater forest and pink flamingos.',
                'area_stat'      => '330 km²',
                'area_label'     => 'RIFT VALLEY GEM',
                'hero_image'     => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                'pull_quote'     => 'The sight of thousands of flamingos as a pink ribbon along the lake shore is a Manyara classic.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Tree Lions'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Oct'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '24°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '330 km²'],
                ],
                'overview'       => [
                    "Ernest Hemingway once described Lake Manyara as the loveliest lake he had seen in Africa, and it is easy to see why. Tucked at the base of the Great Rift Valley Escarpment, the park is a surprisingly diverse mix of dense groundwater forest, open floodplains, and the vast soda lake itself. It is a compact sanctuary that punches far above its weight in terms of sheer scenic beauty.",
                    "The park is most famous for its tree-climbing lions, a rare behavior that is a signature of Manyara's prides. As you move from the lush forest—where baboons and blue monkeys play in the ancient mahogany trees—to the acacia woodlands, you might spot these predators draped over the branches of large sausage or umbrella trees. The lake shore is equally spectacular, often shimmering pink with the presence of thousands of lesser flamingos and other migratory waterfowl.",
                    "Beyond the lions and birds, Manyara is home to large herds of elephants, buffalos, and giraffes. The park's compact size makes it an excellent choice for a productive day trip or a gentle introduction to the northern circuit. Whether you are observing hippos at the hippo pool or taking in the views from the Maji Moto hot springs, Manyara offers a tranquil and visually stunning safari experience."
                ],
                'wildlife'       => [
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Manyara\'s lions are world-famous for their unique habit of climbing and resting in trees.'],
                    ['name' => 'Flamingo', 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Huge flocks of lesser flamingos create a vibrant pink fringe along the lake edge.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The park supports a healthy population of elephants that move frequently between the forest and the lake.'],
                    ['name' => 'Baboon', 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Manyara is home to some of the largest baboon troops seen in Africa.'],
                    ['name' => 'Hippo', 'image' => 'https://images.unsplash.com/photo-1534149043227-d4677db02787?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'The hippo pool at the northern tip of the lake provides reliable and close-up sightings.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Dry and warm', 'crowds' => 2, 'price' => '$$', 'expect' => 'Excellent birding on the lake'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and dry', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lions active in the tree shade'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 1, 'price' => '$$', 'expect' => 'Lush green groundwater forest'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Emerald vistas, quietest trails'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Mist and rain', 'crowds' => 1, 'price' => '$', 'expect' => 'Ethereal light for photography'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Crisp and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Wildlife moving toward water'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cool and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Peak season for game viewing'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Best visibility in the woodlands'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'High activity at the lake shore'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Migratory birds arrival peak'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Fresh greening of the plains'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday festive', 'crowds' => 3, 'price' => '$$$$', 'expect' => 'Excellent holiday safari vibe'],
                ],
                'seasons' => [
                    ['name' => 'The Birding Peak', 'dates' => 'November - June', 'highlights' => ['Flamingo concentrations', 'Migratory species', 'Lush scenery'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'],
                    ['name' => 'The Dry Game Season', 'dates' => 'July - October', 'highlights' => ['Tree-climbing lions', 'Large mammal herds', 'Best visibility'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'The Secret Emerald', 'dates' => 'April - May', 'highlights' => ['Quiet trails', 'Lush forest walks', 'Dramatic photography'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Groundwater Forest Walk', 'description' => 'Explore the unique lush forest at the base of the escarpment, home to massive mahogany trees and lively primate troops.', 'tags' => ['Nature', 'Walking'], 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=400&q=80'],
                   ['title' => 'Manyara Treetop Walkway', 'description' => 'Walk through the canopy of the forest on a suspended walkway, getting a bird\'s eye view of the unique ecosystem.', 'tags' => ['Adventure', 'Views'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                   ['title' => 'Night Game Drive', 'description' => 'Experience the park like never before, spotting nocturnal creatures like genets and porcupines under the guidance of expert rangers.', 'tags' => ['Wildlife', 'Intense'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'July to October for lions, November to June for birding',
                    'flying_time' => '1.5 hour drive from Arusha or 30m flight',
                    'transport' => 'Standard or 4x4 safari vehicles',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'andBeyond Lake Manyara Camp', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Manyara Serena Safari Lodge', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Lake Manyara Wildlife Lodge', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'Are there really tree-climbing lions in Manyara?', 'answer' => 'Yes, Manyara is one of the few places in Africa where you can reliably see lions resting in trees. It is believed they do this to avoid ground insects and enjoy the cooler breeze.'],
                    ['question' => 'Is a half-day safari enough for Manyara?', 'answer' => 'While Manyara is compact and can be explored in a few hours, a full day allows you to see the different zones, from the forest to the lake shore, and enjoy a picnic lunch in the wild.'],
                    ['question' => 'Can we see rhinos in Manyara?', 'answer' => 'No, rhinos are not present in Lake Manyara National Park. For rhino sightings, we recommend visiting the Ngorongoro Crater or the Serengeti.'],
                ],
                'related_slugs' => ['serengeti', 'ngorongoro', 'tarangire'],
            ],
            // ━━━━━━━━ KILIMANJARO ━━━━
            [
                'name'           => 'Mount Kilimanjaro National Park',
                'slug'           => 'kilimanjaro',
                'region'         => 'Northern Circuit',
                'tagline'        => 'The Roof of Africa standing alone in the clouds.',
                'area_stat'      => '1,688 km²',
                'area_label'     => 'HIGHEST ALONE',
                'hero_image'     => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80',
                'pull_quote'     => 'Standing on Uhuru Peak at sunrise, with the world below hidden by a sea of clouds, is the ultimate African triumph.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Alpine'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jan - Mar'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '10°C'],
                    ['icon' => 'map', 'label' => 'HEIGHT', 'value' => '5,895m'],
                ],
                'overview'       => [
                    "Mount Kilimanjaro is not just a mountain, it is an icon. Rising 5,895 meters above the East African plains, it is the highest free-standing mountain in the world and the roof of the African continent. To climb it is to walk through five different ecological zones in a single journey, from tropical rainforest and alpine meadows to the haunting lunar landscape of the summit crater.",
                    "The journey to Uhuru Peak is as much a mental challenge as it is a physical one. Each route—Marangu, Machame, Lemosho, and others—offers a unique perspective on the mountain's shifting majesty. You begin in the lush montane forest, home to elusive primates and birds, before emerging into the heather and moorland zones, where the giant groundsels stand like silent guardians against the thinning air.",
                    "But Kilimanjaro is not only for climbers. The surrounding national park offers spectacular day hikes and opportunities to witness the mountain's raw power from its base. The sight of Kibo's snow-capped peak glowing orange in the first light of dawn, while the plains below are still in shadow, is an experience that stays with every visitor forever. It is Africa's greatest landmark, a testament to the earth's ancient volcanic power."
                ],
                'wildlife'       => [
                    ['name' => 'Colobus Monkey', 'image' => 'https://images.unsplash.com/photo-1555524330-9ec8058309ec?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Found in the dense montane forest zone at the base of the mountain.'],
                    ['name' => 'Blue Monkey', 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Frequently seen playing in the canopy near the park gates.'],
                    ['name' => 'Four-striped Mouse', 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'A resilient inhabitant of the higher alpine moorland zones.'],
                    ['name' => 'Malachite Sunbird', 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Often seen feeding on the nectar of giant lobelias in the moorland zone.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Rare', 'fact' => 'Occasional sightings in the lower forest zones, though they are very elusive here.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Clear and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Ideal climbing conditions, best visibility'],
                    ['abbr' => 'FEB', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Excellent summit window'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Rains begin late', 'crowds' => 2, 'price' => '$$$', 'expect' => 'Good climbing before the heavy rains'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Not recommended for climbing'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Persistent rain', 'crowds' => 1, 'price' => '$', 'expect' => 'Snow on the summit, challenging'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Cold and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Clear air, ideal for photography'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Very cold', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Busy season, clear summit days'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Peak climbing season'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warmer air', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Excellent all-round conditions'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Cloudier skies', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Good climbing with dramatic clouds'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Quiet mountain, lush lower slopes'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday festive', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Celebratory summit attempts'],
                ],
                'seasons' => [
                    ['name' => 'The Main Summit Window', 'dates' => 'January - March', 'highlights' => ['Clear skies', 'Warmest weather', 'Best summit luck'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'The Winter Challenge', 'dates' => 'June - September', 'highlights' => ['Crisp air', 'Amazing visibility', 'Dynamic atmosphere'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                    ['name' => 'The Quiet Path', 'dates' => 'October - December', 'highlights' => ['Fewer climbers', 'Lush lower slopes', 'Dramatic vistas'], 'image' => 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Machame Route Trek', 'description' => 'The "Whiskey" route, known for its scenic beauty and challenging sections like the Barranco Wall.', 'tags' => ['Adventure', 'Trek'], 'image' => 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=400&q=80'],
                   ['title' => 'Lemosho Route Expedition', 'description' => 'A longer, more remote route offering superior acclimatization and breathtaking forest starts.', 'tags' => ['Remote', 'Scenic'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                   ['title' => 'Marangu Day Hike', 'description' => 'A perfect taste of the mountain for those not seeking a full summit attempt, reaching the first camp through dense rainforest.', 'tags' => ['Intro', 'Nature'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'January to March and June to September',
                    'flying_time' => '1h drive from Kilimanjaro Airport (JRO)',
                    'transport' => 'Standard vehicles to park gates, then on foot',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'Kilimanjaro Wonders Hotel', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Pink Flamingo Boutique', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Kaliwa Lodge', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'How hard is it to climb Kilimanjaro?', 'answer' => 'While it requires a good level of fitness and mental determination, it is a "trekking" mountain rather than a technical climb. The biggest challenge is acclimatizing to the high altitude.'],
                    ['question' => 'Which is the best route for beginners?', 'answer' => 'The Machame and Lemosho routes are highly recommended as they provide extra days for acclimatization, increasing your chances of a successful summit.'],
                    ['question' => 'What is the best time of year to climb?', 'answer' => 'The driest and clearest months are January through March and June through September. These windows offer the best visibility and safer trekking conditions.'],
                ],
                'related_slugs' => ['arusha', 'serengeti', 'tarangire'],
            ],
            // ━━━━━━━━ RUAHA ━━━━
            [
                'name'           => 'Ruaha National Park',
                'slug'           => 'ruaha',
                'region'         => 'Southern Circuit',
                'tagline'        => 'A vast wilderness of baobabs and massive lion prides.',
                'area_stat'      => '20,226 km²',
                'area_label'     => 'REMOTE GIANT',
                'hero_image'     => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
                'pull_quote'     => 'Ruaha is Africa as it was a century ago: wild, rugged, and completely uncompromising.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Wild Dogs'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Oct'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '28°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '20K km²'],
                ],
                'overview'       => [
                    "Ruaha National Park is the largest national park in Tanzania, yet it remains one of its best-kept secrets. This is a wilderness of staggering proportions, characterized by a rugged landscape of ancient baobabs, rocky hills, and the Great Ruaha River. It is a place for the serious safari-goer, where the wildlife is wild and the human footprint is incredibly light.",
                    "The park is legendary for its predator population, specifically its massive lion prides which can sometimes number over 20 individuals. It is also one of the few places in East Africa where you can see both Greater and Lesser Kudu, alongside a significant population of the endangered African wild dog. The river banks are a constant theater of life, drawing elephants, buffalos, and waterbucks in high numbers during the dry season.",
                    "Because of its remote location, Ruaha offers a level of exclusivity and solitude that is hard to find in the northern parks. You can drive for hours without seeing another vehicle, allowing for an intimate connection with the landscape. Whether you are tracking leopards in the riverine forest or watching the sun set behind a thousand-year-old baobab, Ruaha delivers a raw and authentic African experience."
                ],
                'wildlife'       => [
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Ruaha holds about 10% of the world\'s remaining lion population, with famously large prides.'],
                    ['name' => 'Wild Dog', 'image' => 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=640&q=80', 'likelihood' => 'Rare', 'fact' => 'One of the best places in Africa to search for these highly social and endangered predators.'],
                    ['name' => 'Greater Kudu', 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'The park\'s emblem, these elegant antelopes are frequently seen in the bush lands.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Massive herds congregate along the Great Ruaha River during the dry months.'],
                    ['name' => 'Leopard', 'image' => 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Often spotted in the large trees lining the riverbanks and rocky outcrops.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and green', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lush landscapes, active birdlife'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and clear', 'crowds' => 2, 'price' => '$$', 'expect' => 'Good sightings at the river pools'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 1, 'price' => '$$', 'expect' => 'Emerald vistas, calm atmosphere'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Lush but challenging road conditions'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Quiet rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Solitude and vibrant photography'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Dry and crisp', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Excellent game viewing begins'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cool and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Peak season for predator activity'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'High wildlife concentration at water'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Best time for big cat sightings'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warming up', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Golden landscapes, intense blue horizons'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Fresh greening of the bush'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday season', 'crowds' => 3, 'price' => '$$$$', 'expect' => 'Festive safari vibe in central'],
                ],
                'seasons' => [
                    ['name' => 'The Predator peak', 'dates' => 'July - October', 'highlights' => ['Large lion prides', 'Wild dog tracking', 'River action'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'],
                    ['name' => 'The Emerald Wilderness', 'dates' => 'November - March', 'highlights' => ['Migratory birds', 'Lush baobabs', 'Newborn animals'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'],
                    ['name' => 'The Solitude Season', 'dates' => 'April - May', 'highlights' => ['Total wilderness feel', 'No other vehicles', 'Dramatic light'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Ruaha River Tracking', 'description' => 'Follow the lifeblood of the park on a game drive, witnessing the intense daily drama at the water\'s edge.', 'tags' => ['Wildlife', 'Intense'], 'image' => 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80'],
                   ['title' => 'Walking with the Giants', 'description' => 'A guided walk among the ancient baobabs, learning about the smaller inhabitants and tracking predators on foot.', 'tags' => ['Walking', 'Adventure'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                   ['title' => 'Bush Picnic at Sunset', 'description' => 'Enjoy a private sundowner overlooking the vast plains as the sky turns into a canvas of oranges and purples.', 'tags' => ['Luxury', 'Serene'], 'image' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'July to October for game viewing',
                    'flying_time' => '1.5h to 2h flight from Dar es Salaam or Arusha',
                    'transport' => 'Exclusively by light aircraft and 4x4 safari vehicles',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'Jabali Ridge', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Ruaha River Lodge', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Mdonya Old River Camp', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'Is Ruaha better than the Serengeti?', 'answer' => 'It\'s different. While Serengeti has the migration, Ruaha offers a more rugged, remote wilderness feel with fewer tourists and exceptionally large lion prides.'],
                    ['question' => 'Can we see wild dogs in Ruaha?', 'answer' => 'Yes, Ruaha is one of the premier locations in Tanzania for seeing African wild dogs, though they are highly mobile and sightings are never guaranteed.'],
                    ['question' => 'How do I get to Ruaha?', 'answer' => 'The only practical way to reach Ruaha is by light aircraft from Dar es Salaam, Zanzibar, or Arusha, landing at one of the park\'s bush airstrips.'],
                ],
                'related_slugs' => ['selous', 'mikumi', 'serengeti'],
            ],
            // ━━━━━━━━ SELOUS / NYERERE ━━━━
            [
                'name'           => 'Nyerere National Park (Selous)',
                'slug'           => 'selous',
                'region'         => 'Southern Circuit',
                'tagline'        => 'A watery wilderness of rivers, lakes, and wild dogs.',
                'area_stat'      => '30,893 km²',
                'area_label'     => 'LARGEST RESERVE',
                'hero_image'     => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=800&q=80',
                'pull_quote'     => 'Drifting silently down the Rufiji River as the sun sets is the quintessential Selous experience.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Wild Dogs'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Oct'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '30°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '30K km²'],
                ],
                'overview'       => [
                    "Nyerere National Park, formerly known as the Selous Game Reserve, is a vast watery wilderness that offers a completely different safari experience from the northern plains. Dominated by the mighty Rufiji River and its complex system of lakes and lagoons, the park is a lush, sprawling sanctuary where the water is the lifeblood of the ecosystem.",
                    "The defining feature of Nyerere is the ability to conduct boat safaris, allowing you to drift silently among pods of hippos and massive crocodiles while observing elephants and buffalos drinking at the water's edge. It is also one of the last great strongholds of the African wild dog, which flourish in the park's diverse mix of riverine forest, palm groves, and open grasslands.",
                    "Because of its size and the variety of its habitats, Nyerere offers an incredible range of activities, from traditional game drives and boat safaris to guided walking tours. The human footprint here is minimal, and the sense of exploration is palpable. Whether you are navigating the intricate channels of the delta or tracking a lion pride through the bush, Nyerere provides a raw and immersive wilderness adventure."
                ],
                'wildlife'       => [
                    ['name' => 'Wild Dog', 'image' => 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Nyerere is one of the best places in the world to see the highly endangered and social African wild dog.'],
                    ['name' => 'Hippo', 'image' => 'https://images.unsplash.com/photo-1534149043227-d4677db02787?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'The Rufiji River is home to massive pods of hippos, which are best seen from a boat safari.'],
                    ['name' => 'Crocodile', 'image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Huge Nile crocodiles bask along the riverbanks and can be seen in the various lakes.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Large herds move between the river and the inland bush year-round.'],
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Lion prides are frequently found near the lakes and lagoons where prey is abundant.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and green', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lush scenery, great boat birding'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Very hot', 'crowds' => 2, 'price' => '$$', 'expect' => 'Wildlife concentrated near the river'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 1, 'price' => '$$', 'expect' => 'Emerald landscapes, quiet atmosphere'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Peak rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Many camps close, very lush'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Rains finish', 'crowds' => 1, 'price' => '$', 'expect' => 'Quiet, fresh greenery everywhere'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Cooler and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Excellent game viewing begins'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and pleasant', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Peak season for wild dog sightings'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Best time for boat safaris'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Hot and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Intense activity at the riverbanks'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Very hot', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Golden grass, high wildlife density'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Birdlife returns, fresh greening'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday season', 'crowds' => 3, 'price' => '$$$$', 'expect' => 'Festive vibe, excellent birding'],
                ],
                'seasons' => [
                    ['name' => 'The River Discovery', 'dates' => 'June - October', 'highlights' => ['Boat safaris', 'Wild dog action', 'Dry river drama'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80'],
                    ['name' => 'The Emerald Delta', 'dates' => 'November - March', 'highlights' => ['Lush vegetation', 'Birding peak', 'No crowds'], 'image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=800&q=80'],
                    ['name' => 'The Quiet Solitude', 'dates' => 'April - May', 'highlights' => ['Total wilderness feel', 'Exclusive access', 'Dramatic photography'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Rufiji River Boat Safari', 'description' => 'Drift among hippos and crocodiles on Africa\'s most spectacular river safari experience.', 'tags' => ['Water', 'Iconic'], 'image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=400&q=80'],
                   ['title' => 'Selous Walking Safari', 'description' => 'Explore the smaller details of the reserve on foot with an expert guide and armed ranger.', 'tags' => ['Walking', 'Adventure'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80'],
                   ['title' => 'Sand River Fly-camping', 'description' => 'Spend a night under the stars in a remote mobile camp, the ultimate wilderness experience.', 'tags' => ['Adventure', 'Luxury'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
                    'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'June to October for boat safaris and game viewing',
                    'flying_time' => '45m flight from Dar es Salaam or Zanzibar',
                    'transport' => 'Exclusively by light aircraft, boat, and 4x4 vehicles',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'Roho ya Selous', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Sand Rivers Selous', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Rufiji River Camp', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'What makes Selous different from the Serengeti?', 'answer' => 'Selous is much more watery and lush, with activities centered around the river and lakes. Boat safaris are a major highlight here, which are not possible in the Serengeti.'],
                    ['question' => 'Is it possible to see wild dogs in Selous?', 'answer' => 'Yes, Selous is one of the best locations in Africa to find the endangered wild dog, as they thrive in the reserve\'s varied habitats.'],
                    ['question' => 'Is a boat safari safe?', 'answer' => 'Yes, all boat safaris are conducted by experienced guides in sturdy boats designed for the river. You will remain a safe distance from hippos and crocodiles.'],
                ],
                'related_slugs' => ['ruaha', 'mikumi', 'zanzibar'],
            ],
            // ━━━━━━━━ ZANZIBAR ━━━━
            [
                'name'           => 'Zanzibar Archipelago',
                'slug'           => 'zanzibar',
                'region'         => 'Coastal Region',
                'tagline'        => 'The spice islands of white sands and azure waters.',
                'area_stat'      => '2,462 km²',
                'area_label'     => 'ISLAND PARADISE',
                'hero_image'     => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80',
                'pull_quote'     => 'Walking through Stone Town is like stepping back into a layered history written in coral stone and spice-scented air.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'sun', 'label' => 'WEATHER', 'value' => 'Tropical'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Jun - Feb'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '28°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '2,462 km²'],
                ],
                'overview'       => [
                    "Zanzibar is much more than a tropical island, it is a sensory journey through centuries of layered history. Floating in the turquoise waters of the Indian Ocean, the archipelago is a blend of ancient Swahili culture, fragrant spice plantations, and some of the world's most breathtaking white-sand beaches. This is a place where time slows down to the rhythm of the tides and the gentle creak of traditional dhows.",
                    "Stone Town, the island's historic heart, is a UNESCO World Heritage site known for its labyrinthine alleys, intricately carved teak doors, and bustling spice markets. Every corner tells a story of the Omani sultans, Portuguese explorers, and the rich Swahili heritage that defines the island today. Farther afield, the coastline offers a paradise of palm-fringed beaches, coral reefs teeming with marine life, and the unique Jozani Forest, home to the endemic red colobus monkey.",
                    "Whether you are diving in the pristine waters of the Mnemba Atoll, exploring the history of the spice trade, or simply watching the sun set over the Indian Ocean from a beachfront bar, Zanzibar provides the perfect post-safari retreat. It is a place for relaxation, discovery, and an deep immersion into a culture that is as warm and inviting as the tropical sun. The Spice Islands are a world unto themselves."
                ],
                'wildlife'       => [
                    ['name' => 'Red Colobus Monkey', 'image' => 'https://images.unsplash.com/photo-1555524330-9ec8058309ec?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Endemic to Zanzibar, these playful monkeys are best seen in the Jozani Chwaka Bay National Park.'],
                    ['name' => 'Dolphin', 'image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Frequently seen in effectively protected areas like the Menai Bay Conservation Area.'],
                    ['name' => 'Turtles', 'image' => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'Green sea turtles nest on several of the archipelago\'s remote beaches and satellite islands.'],
                    ['name' => 'Giant Aldabra Tortoise', 'image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'A protected population can be visited on Prison Island, some individuals are over 150 years old.'],
                    ['name' => 'Suni Antelope', 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=640&q=80', 'likelihood' => 'Rare', 'fact' => 'One of the smallest antelopes in the world, found in the island\'s dry forests and thickets.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Hot and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Perfect beach weather, calm seas'],
                    ['abbr' => 'FEB', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Ideal for diving and snorkeling'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains begin', 'crowds' => 2, 'price' => '$$$', 'expect' => 'Lush scenery, occasional showers'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Some resorts close, very quiet'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Rains finish', 'crowds' => 1, 'price' => '$', 'expect' => 'Fresh and green, quiet beaches'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Cooler and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Excellent all-round conditions'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Sunny and dry', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Peak holiday season, lively atmosphere'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Sunny and dry', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Clear water, perfect for islands'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Excellent visibility for marine life'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and dry', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Golden sunsets, warm waters'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Dramatic skies, lush palms'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Hot and festive', 'crowds' => 5, 'price' => '$$$$', 'expect' => 'Festive island celebrations'],
                ],
                'seasons' => [
                    ['name' => 'The Sunny Archipelago', 'dates' => 'December - March', 'highlights' => ['Calm azure waters', 'Diving peak', 'Starlit beach dinners'], 'image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80'],
                    ['name' => 'The Spice Harvest', 'dates' => 'June - October', 'highlights' => ['Cooler air', 'Historic tours', 'Vibrant markets'], 'image' => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80'],
                    ['name' => 'The Emerald Tide', 'dates' => 'April - May', 'highlights' => ['Quiet retreats', 'Lush gardens', 'Dramatic beachscapes'], 'image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Stone Town Walking Tour', 'description' => 'Explore the historic alleys and hidden gems of the ancient island capital with a local guide.', 'tags' => ['History', 'Culture'], 'image' => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&q=80'],
                   ['title' => 'Spice Plantation Exploration', 'description' => 'See, smell, and taste the world-famous spices that gave the island its name and shaped its history.', 'tags' => ['Senses', 'Discovery'], 'image' => 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80'],
                   ['title' => 'Sunset Dhow Cruise', 'description' => 'Sail on a traditional wooden boat as the sun sets over the Indian Ocean, with traditional music and snacks.', 'tags' => ['Relax', 'Romance'], 'image' => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
                    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80',
                    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'June to February for beach weather and diving',
                    'flying_time' => '15m flight from Dar es Salaam or 1h from Arusha',
                    'transport' => 'Standard vehicles, traditional dhows, and ferries',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'The Residence Zanzibar', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Zuri Zanzibar', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Tembo House Hotel', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'Is Zanzibar a separate country?', 'answer' => 'No, Zanzibar is a semi-autonomous part of the United Republic of Tanzania. It has its own president and government but shares a common visa and federal representation.'],
                    ['question' => 'How do I get to Stone Town from the airport?', 'answer' => 'Stone Town is a short 15-20 minute drive from Abeid Amani Karume International Airport (ZNZ). Taxis and hotel transfers are readily available.'],
                    ['question' => 'What should I wear in Zanzibar?', 'answer' => 'While beachwear is fine at resorts, Zanzibar is a conservative culture. We recommend covering shoulders and knees when exploring Stone Town or local villages out of respect.'],
                ],
                'related_slugs' => ['selous', 'mikumi', 'serengeti'],
            ],
            // ━━━━━━━━ MIKUMI ━━━━
            [
                'name'           => 'Mikumi National Park',
                'slug'           => 'mikumi',
                'region'         => 'Southern Circuit',
                'tagline'        => 'The "Little Serengeti" of the south.',
                'area_stat'      => '3,230 km²',
                'area_label'     => 'SOUTHERN GEM',
                'hero_image'     => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=1600&q=80',
                'portrait_image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
                'pull_quote'     => 'The open Mkata Plains offer a visibility and wildlife density that rivals the legendary Serengeti.',
                'status'         => 'published',
                'quick_facts'    => [
                    ['icon' => 'paw', 'label' => 'WILDLIFE', 'value' => 'Elephants'],
                    ['icon' => 'calendar', 'label' => 'PEAK TIME', 'value' => 'Year-round'],
                    ['icon' => 'thermometer', 'label' => 'AVG TEMP', 'value' => '28°C'],
                    ['icon' => 'map', 'label' => 'SIZE', 'value' => '3.2K km²'],
                ],
                'overview'       => [
                    "Mikumi National Park is the gateway to the Southern Circuit and is often affectionately called the 'Little Serengeti' due to its open floodplains and incredible wildlife density. Located between the Uluguru Mountains and the Lumango Range, the park is divided by the main road into two distinct sectors, with the northern Mkata Plains being the most wildlife-rich area.",
                    "The Mkata Plains are home to massive herds of buffalo, zebra, and wildebeest, which in turn attract large prides of lions. The park is also famous for its 'Mikumi Lions', which are often found resting in the branches of acacia trees, a behavior usually associated with Lake Manyara. Elephants move through the park in large family groups, and the hippo pools provide reliable sightings of these aquatic giants wallowing in the mud.",
                    "What makes Mikumi increasingly accessible is its connection to the new SGR high-speed train from Dar es Salaam. Travellers can now reach the park in a fraction of the time it used to take by road, making it the perfect getaway for those staying in the city or as a high-impact start to a longer southern safari adventure."
                ],
                'wildlife'       => [
                    ['name' => 'Lion', 'image' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Famous for their habit of resting in trees and their preference for the open Mkata Plains.'],
                    ['name' => 'Elephant', 'image' => 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Large herds move across the plains, often seen near the park\'s waterholes.'],
                    ['name' => 'Buffalo', 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=640&q=80', 'likelihood' => 'Very Common', 'fact' => 'Massive herds congregate near the Mkata riverbed during the dry season.'],
                    ['name' => 'Giraffe', 'image' => 'https://images.unsplash.com/photo-1555524330-9ec8058309ec?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'The Maasai giraffe is found in abundance throughout the acacia woodlands.'],
                    ['name' => 'Eland', 'image' => 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?w=640&q=80', 'likelihood' => 'Common', 'fact' => 'The largest antelope in Africa is frequently seen in the park\'s more open areas.'],
                ],
                'months'         => [
                    ['abbr' => 'JAN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warm and green', 'crowds' => 2, 'price' => '$$', 'expect' => 'Lush savanna, active birdlife'],
                    ['abbr' => 'FEB', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Hot and clear', 'crowds' => 2, 'price' => '$$', 'expect' => 'Good sightings at hippo pools'],
                    ['abbr' => 'MAR', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 1, 'price' => '$$', 'expect' => 'Emerald landscapes, calm atmosphere'],
                    ['abbr' => 'APR', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Heavy rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Lush but challenging road conditions'],
                    ['abbr' => 'MAY', 'band' => 'low', 'icon' => 'rain', 'weather' => 'Quiet rains', 'crowds' => 1, 'price' => '$', 'expect' => 'Solitude and vibrant photography'],
                    ['abbr' => 'JUN', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Dry and crisp', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Excellent game viewing begins'],
                    ['abbr' => 'JUL', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Cool and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Peak season for lion sightings'],
                    ['abbr' => 'AUG', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Dry and clear', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'High wildlife concentration at water'],
                    ['abbr' => 'SEP', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Warm and dry', 'crowds' => 4, 'price' => '$$$$', 'expect' => 'Best time for predator action'],
                    ['abbr' => 'OCT', 'band' => 'good', 'icon' => 'sun', 'weather' => 'Warming up', 'crowds' => 3, 'price' => '$$$', 'expect' => 'Golden grass, intense blue horizons'],
                    ['abbr' => 'NOV', 'band' => 'good', 'icon' => 'rain', 'weather' => 'Short rains', 'crowds' => 2, 'price' => '$$', 'expect' => 'Fresh greening of the plains'],
                    ['abbr' => 'DEC', 'band' => 'peak', 'icon' => 'sun', 'weather' => 'Holiday season', 'crowds' => 3, 'price' => '$$$$', 'expect' => 'Festive safari vibe in central'],
                ],
                'seasons' => [
                    ['name' => 'The Big Game Window', 'dates' => 'June - September', 'highlights' => ['Elephant herds', 'Lion hunting', 'Best visibility'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80'],
                    ['name' => 'The Birding Emerald', 'dates' => 'November - March', 'highlights' => ['Migratory birds', 'Lush scenery', 'No crowds'], 'image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=800&q=80'],
                    ['name' => 'Weekend Rail Getaway', 'dates' => 'Year-round', 'highlights' => ['SGR train journey', 'Quick access', 'Family friendly'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80'],
                ],
                'experiences' => [
                   ['title' => 'Mkata Plains Game Drive', 'description' => 'Patrol the vast open plains where wildlife concentration is at its highest, including the famous tree-climbing lions.', 'tags' => ['Wildlife', 'Iconic'], 'image' => 'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=400&q=80'],
                   ['title' => 'Hippo Pool Visit', 'description' => 'Observe large pods of hippos and crocodiles from the safety of a designated viewpoint near the Mkata River.', 'tags' => ['Wildlife', 'Water'], 'image' => 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80'],
                   ['title' => 'SGR Train Safari', 'description' => 'Combine your safari with a journey on the modern SGR high-speed train, a comfortable and scenic way to reach the park.', 'tags' => ['Rail', 'Travel'], 'image' => 'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=400&q=80'],
                ],
                'gallery' => [
                    'https://images.unsplash.com/photo-1516298773066-c48f8e9a4842?w=800&q=80',
                    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
                    'https://images.unsplash.com/photo-1535338454528-1b5a4f159e53?w=800&q=80',
                ],
                'travel_info' => [
                    'best_time' => 'June to September for large herds and predators',
                    'flying_time' => '1.5h by SGR train from Dar es Salaam or 4h drive',
                    'transport' => 'Accessible by rail, road, or light aircraft',
                    'visa' => 'Standard Tanzanian eVisa applies',
                ],
                'accommodations' => [
                    ['name' => 'Mikumi Luxury Camp', 'tier' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=640&q=80'],
                    ['name' => 'Stanley\'s Kopje', 'tier' => 'Superior', 'image' => 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=640&q=80'],
                    ['name' => 'Mikumi Wildlife Lodge', 'tier' => 'Standard', 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&q=80'],
                ],
                'faqs' => [
                    ['question' => 'How long is the train journey to Mikumi?', 'answer' => 'The new SGR train from Dar es Salaam to Morogoro takes approximately 1.5 to 2 hours, making it incredibly convenient for weekend safaris.'],
                    ['question' => 'Can I see the Big Five in Mikumi?', 'answer' => 'You can see four of the Big Five: Lion, Leopard, Elephant, and Buffalo. Rhinos are not present in the park.'],
                    ['question' => 'Is Mikumi a good alternative to the Serengeti?', 'answer' => 'Yes, for those with limited time or staying in southern Tanzania, Mikumi offers a very similar savanna experience with much easier access.'],
                ],
                'related_slugs' => ['selous', 'ruaha', 'zanzibar'],
            ],
        ];

        // Seeder implementation loop
        foreach ($destinations as $d) {
            $accommodations = $d['accommodations'] ?? [];
            $faqs = $d['faqs'] ?? [];
            unset($d['accommodations'], $d['faqs']);

            $destination = Destination::updateOrCreate(['slug' => $d['slug']], $d);

            // Seed Accommodations
            $destination->accommodations()->delete();
            foreach ($accommodations as $acc) {
                DestinationAccommodation::create(array_merge($acc, ['destination_id' => $destination->id]));
            }

            // Seed FAQs
            $destination->faqs()->delete();
            foreach ($faqs as $faq) {
                DestinationFaq::create(array_merge($faq, ['destination_id' => $destination->id]));
            }
        }
    }
}
