<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title'          => 'The Complete Guide to the Great Migration',
                'slug'           => 'great-migration-guide',
                'category'       => 'Wildlife & Nature',
                'author'         => 'Safari Team',
                'published_date' => '2026-02-15',
                'status'         => 'published',
                'views'          => 2340,
                'excerpt'        => 'Everything you need to know about witnessing the greatest wildlife spectacle on Earth, timing, positioning, and what to expect.',
                'body'           => '<h2>Understanding the Great Migration</h2><p>The Great Migration is not a single event, it is a continuous cycle. Over two million wildebeest, zebra, and gazelle traverse the Serengeti-Mara ecosystem in an endless loop driven by rainfall and grass growth.</p><h2>When to Go</h2><p>July–October for river crossings. January–February for calving season. Each offers a completely different, equally extraordinary experience.</p>',
                'meta_title'     => 'The Complete Guide to the Great Migration | Ronjoo Safaris',
                'meta_description' => 'Plan your Great Migration safari with our expert guide covering timing, river crossings, calving season, and accommodation.',
                'related_safari' => 'great-migration',
                'show_cta'       => true,
            ],
            [
                'title'          => 'What to Pack for a Tanzania Safari',
                'slug'           => 'safari-packing-guide',
                'category'       => 'Safari Planning',
                'author'         => 'Safari Team',
                'published_date' => '2026-01-20',
                'status'         => 'published',
                'views'          => 1870,
                'excerpt'        => 'A practical, no-nonsense packing guide for Tanzania, what to bring, what to leave, and the one item everyone forgets.',
                'body'           => '<h2>The Golden Rules</h2><p>Pack light. Safari vehicles have limited luggage space, especially in bush planes. Soft-sided bags only, no hard suitcases.</p><h2>Clothing</h2><p>Neutral earth tones: khaki, olive, tan, brown, grey. No camouflage, it is illegal in Tanzania. Layers are essential for cold morning drives and warm afternoons.</p>',
                'meta_title'     => 'What to Pack for a Tanzania Safari | Ronjoo Safaris',
                'meta_description' => 'Expert packing advice for your Tanzania safari, clothing, gear, and essential items.',
                'show_cta'       => true,
            ],
            [
                'title'          => '5 Reasons to Choose the Lemosho Route',
                'slug'           => 'lemosho-route-reasons',
                'category'       => 'Kilimanjaro',
                'author'         => 'Emmanuel Mollel',
                'published_date' => '2026-03-01',
                'status'         => 'published',
                'views'          => 960,
                'excerpt'        => 'Why the Lemosho Route consistently delivers the highest summit success rates and the most diverse scenery on Kilimanjaro.',
                'body'           => '<h2>1. Highest Success Rate</h2><p>The 9-day Lemosho profile allows gradual acclimatization through five climate zones, resulting in our 87% summit success rate.</p><h2>2. Most Scenic Route</h2><p>No other Kilimanjaro route crosses such varied terrain, from tropical rainforest through alpine desert to arctic glacier.</p>',
                'meta_title'     => '5 Reasons to Choose the Lemosho Route | Ronjoo Safaris',
                'meta_description' => 'Discover why the Lemosho Route is the best Kilimanjaro climbing option for success, scenery, and experience.',
                'related_safari' => 'kilimanjaro-lemosho',
                'show_cta'       => true,
            ],
            [
                'title'          => 'Stone Town: A Walking Guide',
                'slug'           => 'stone-town-guide',
                'category'       => 'Destination Guide',
                'author'         => 'Safari Team',
                'published_date' => null,
                'status'         => 'draft',
                'views'          => 0,
                'excerpt'        => 'Navigate the UNESCO World Heritage labyrinth of Stone Town, carved doors, spice markets, and four centuries of layered history.',
                'body'           => '<h2>Getting Oriented</h2><p>Stone Town is designed to disorient. The narrow alleys, the coral stone walls, the sudden courtyards reveal themselves only on foot and only slowly.</p>',
                'related_destination' => 'zanzibar',
                'show_cta'       => false,
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
