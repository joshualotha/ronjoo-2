<?php

namespace Database\Seeders;

use App\Models\TravelGuide;
use Illuminate\Database\Seeder;

class TravelGuideSeeder extends Seeder
{
    public function run(): void
    {
        $guides = [
            [
                'slug'           => 'tanzania-visa-guide',
                'title'          => 'Tanzania Visa & Entry Guide',
                'category'       => 'before-you-go',
                'guide_type'     => 'standard',
                'description'    => 'Everything you need to know about visas, eVisa applications, and entry requirements.',
                'read_time'      => '8 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc'            => ["Do I Need a Visa?", "eVisa Step-by-Step", "Visa Costs & Types", "East Africa Tourist Visa", "Yellow Fever Certificate"],
                'content'        => [
                    [
                        'type' => 'h2',
                        'text' => 'Do I Need a Visa for Tanzania?'
                    ],
                    [
                        'type' => 'paragraph',
                        'text' => 'Most nationalities require a visa to enter Tanzania, including travelers from the US, UK, EU, Canada, and Australia.'
                    ],
                    [
                        'type' => 'info-box',
                        'icon' => 'tip',
                        'title' => 'Pro Tip',
                        'text' => 'Apply at least 2 weeks before departure. Processing typically takes 5–10 business days.'
                    ],
                    [
                        'type' => 'comparison-table',
                        'headers' => ["Type", "Cost", "Validity", "Entries"],
                        'rows' => [
                            ["Single Entry eVisa", "$50", "90 days", "1"],
                            ["Multiple Entry eVisa", "$100", "12 months", "Multiple"],
                        ]
                    ]
                ],
                'related_slugs'  => ["health-vaccinations-tanzania", "safari-travel-insurance"]
            ],
            [
                'slug'           => 'health-vaccinations-tanzania',
                'title'          => 'Health & Vaccinations',
                'category'       => 'before-you-go',
                'guide_type'     => 'standard',
                'description'    => 'Essential vaccinations, malaria prevention, and medical kit checklist.',
                'read_time'      => '10 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc'            => ["Essential Vaccinations", "Malaria Prevention", "Medical Kit"],
                'content'        => [
                    ['type' => 'h2', 'text' => 'Recommended Vaccinations'],
                    ['type' => 'paragraph', 'text' => 'Consult your doctor at least 6–8 weeks before departure.'],
                    ['type' => 'h3', 'text' => 'Checklist for Your Medical Kit'],
                    ['type' => 'checklist', 'items' => [
                        "Prescribed antimalarial medication",
                        "Broad-spectrum antibiotic",
                        "Oral rehydration salts",
                        "Imodium / anti-diarrheal tablets",
                        "High-SPF sunscreen (50+)",
                        "DEET insect repellent (minimum 30%)"
                    ]]
                ],
                'related_slugs'  => ["tanzania-visa-guide", "safari-packing-guide"]
            ],
            [
                'slug'           => 'safari-packing-guide',
                'title'          => 'Safari Packing Guide',
                'category'       => 'on-safari',
                'guide_type'     => 'standard',
                'description'    => 'The definitive packing list for a Tanzania safari, what to wear and what to bring.',
                'read_time'      => '10 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc'            => ["Luggage Rules", "Clothing Essentials", "Safari Colors", "Tech Gear"],
                'content'        => [
                    ['type' => 'h2', 'text' => 'Luggage Rules'],
                    ['type' => 'warning-box', 'icon' => 'warning', 'title' => 'Fly-in Safari Alert', 'text' => '15kg limit includes hand luggage. Use a soft-sided duffel bag only, no hard cases.'],
                    ['type' => 'checklist', 'items' => [
                        "3–4 lightweight long-sleeve shirts",
                        "2 pairs safari trousers",
                        "1 fleece or warm layer",
                        "Wide-brimmed hat",
                        "Binoculars (8x42 or 10x42)"
                    ]]
                ],
                'related_slugs'  => ["safari-safety", "photography-tips"]
            ],
            [
                'slug'           => 'swahili-phrases-safari',
                'title'          => 'Swahili Phrases for Travelers',
                'category'       => 'people-culture',
                'guide_type'     => 'standard',
                'description'    => 'Essential Swahili words and phrases with pronunciation guides.',
                'read_time'      => '6 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc'            => ["Greetings", "On Safari", "At the Lodge"],
                'content'        => [
                    ['type' => 'h2', 'text' => 'Essential Greetings'],
                    ['type' => 'phrase-cards', 'phrases' => [
                        ['swahili' => 'Habari?', 'english' => 'How are you?', 'pronunciation' => 'ha-BAR-ee'],
                        ['swahili' => 'Asante', 'english' => 'Thank you', 'pronunciation' => 'ah-SAN-teh'],
                        ['swahili' => 'Karibu', 'english' => 'Welcome', 'pronunciation' => 'kah-REE-boo'],
                        ['swahili' => 'Pole pole', 'english' => 'Slowly slowly', 'pronunciation' => 'POH-leh POH-leh'],
                    ]]
                ],
                'related_slugs'  => ["tanzanian-culture-customs", "responsible-safari-travel"]
            ],
            [
                'slug'           => 'family-safari-guide',
                'title'          => 'Traveling with Children on Safari',
                'category'       => 'specialist',
                'guide_type'     => 'standard',
                'description'    => 'How to create a magical family safari experience in Tanzania.',
                'read_time'      => '11 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1504600770771-fb03a7f37aca?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc'            => ["Is Tanzania Safe for Children?", "What Kids Love Most", "Making Memories"],
                'content'        => [
                    ['type' => 'h2', 'text' => 'Children on Safari'],
                    ['type' => 'paragraph', 'text' => 'Ages 7–12 are often the sweet spot, old enough to sit quietly on game drives, young enough to be awestruck.'],
                    ['type' => 'pull-quote', 'text' => 'A family safari is not a holiday, it is an inheritance of wonder.'],
                ],
                'related_slugs'  => ["safari-packing-guide", "health-vaccinations-tanzania"]
            ],
            [
                'slug'           => 'best-time-to-visit-tanzania',
                'title'          => 'Best Time to Visit Tanzania',
                'category'       => 'before-you-go',
                'guide_type'     => 'standard',
                'description'    => 'A month-by-month guide to weather, wildlife, and the Great Migration.',
                'read_time'      => '12 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=80',
                'popular'        => true,
                'status'         => 'published',
                'toc' => ["Quick Summary", "Dry Season (Jun–Oct)", "Short Rains (Nov–Dec)", "Calving Season (Jan–Feb)", "Long Rains (Mar–May)"],
                'content' => [
                    ['type' => 'h2', 'text' => 'When is the Best Time to Visit?'],
                    ['type' => 'paragraph', 'text' => 'Tanzania is a year-round destination, but the dry season (June to October) is widely considered the best time for general wildlife viewing.'],
                    ['type' => 'comparison-table', 'headers' => ["Season", "Months", "Best For", "Crowds"], 'rows' => [
                        ["Peak Dry", "Jun – Oct", "Wildlife, Crossings", "Highest"],
                        ["Calving", "Jan – Feb", "Wildebeest Births", "Medium"],
                        ["Green", "Mar – May", "Birding, Low Prices", "Lowest"],
                    ]]
                ],
                'related_slugs' => ["tanzania-visa-guide", "safari-packing-guide"]
            ],
            [
                'slug'           => 'tanzanian-culture-customs',
                'title'          => 'Tanzanian Culture & Customs',
                'category'       => 'people-culture',
                'guide_type'     => 'standard',
                'description'    => 'A guide to local etiquette, traditions, and the warm spirit of "Karibu".',
                'read_time'      => '9 min read',
                'updated_date'   => 'March 2026',
                'hero_image'     => 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1400&q=80',
                'popular'        => false,
                'status'         => 'published',
                'toc'            => ["Greetings", "Dress Code", "Photography Etiquette", "Dining"],
                'content'        => [
                    ['type' => 'h2', 'text' => 'The Spirit of Karibu'],
                    ['type' => 'paragraph', 'text' => 'Tanzanians are remarkably warm and hospitable. Understanding a few cultural norms will greatly enrich your experience.'],
                    ['type' => 'info-box', 'icon' => 'warning', 'title' => 'Photography', 'text' => 'Always ask permission before taking a photo of a person. A simple "Naomba kupiga picha?" (May I take a photo?) goes a long way.'],
                ],
                'related_slugs'  => ["swahili-phrases-safari", "responsible-safari-travel"]
            ]
        ];

        foreach ($guides as $g) {
            TravelGuide::updateOrCreate(['slug' => $g['slug']], $g);
        }
    }
}
