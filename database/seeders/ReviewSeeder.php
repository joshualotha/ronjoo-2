<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'guest_name'       => 'Sarah Mitchell',
                'country'          => 'United States',
                'country_flag'     => '🇺🇸',
                'rating'           => 5,
                'safari_name'      => 'Great Migration Safari',
                'safari_date'      => '2025-08-15',
                'submitted_date'   => '2025-08-28',
                'status'           => 'approved',
                'excerpt'          => 'Absolutely life-changing. Joseph was the most knowledgeable guide we have ever had.',
                'full_text'        => 'Absolutely life-changing. Joseph was the most knowledgeable guide we have ever had. He spotted a leopard in a tree from 200 meters away. The camps were luxurious and the food was incredible. We saw the river crossing on day 3 and I still get chills thinking about it. Ronjoo handled every detail perfectly.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 5, 'accommodation' => 5, 'value' => 5],
            ],
            [
                'guest_name'       => 'Tom & Claire Evans',
                'country'          => 'United Kingdom',
                'country_flag'     => '🇬🇧',
                'rating'           => 5,
                'safari_name'      => 'Northern Circuit Classic',
                'safari_date'      => '2025-10-05',
                'submitted_date'   => '2025-10-18',
                'status'           => 'approved',
                'excerpt'          => 'The Ngorongoro Crater was the highlight of our trip. Seeing a black rhino up close was extraordinary.',
                'full_text'        => 'The Ngorongoro Crater was the highlight of our trip. Seeing a black rhino up close was extraordinary. Daniel our guide knew every animal by name. The lodges were far better than we expected. Worth every penny.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 5, 'accommodation' => 4, 'value' => 5],
            ],
            [
                'guest_name'       => 'Markus Bauer',
                'country'          => 'Germany',
                'country_flag'     => '🇩🇪',
                'rating'           => 4,
                'safari_name'      => 'Kilimanjaro Lemosho Route',
                'safari_date'      => '2025-09-01',
                'submitted_date'   => '2025-09-15',
                'status'           => 'approved',
                'excerpt'          => 'Made it to the summit! The crew was incredible. Only wish we had one more acclimatization day.',
                'full_text'        => 'Made it to the summit! The crew was incredible, from the guides to the porters to the cook. Summit night was the hardest thing I have ever done but the sunrise from Uhuru Peak made it all worth it. Only wish we had one more acclimatization day, but 87% success rate speaks for itself.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 3, 'accommodation' => 3, 'value' => 4],
            ],
            [
                'guest_name'       => 'Akiko Watanabe',
                'country'          => 'Japan',
                'country_flag'     => '🇯🇵',
                'rating'           => 5,
                'safari_name'      => 'Photography Safari',
                'safari_date'      => '2025-07-10',
                'submitted_date'   => '2025-07-25',
                'status'           => 'approved',
                'excerpt'          => 'As a photographer, this was the perfect safari. The guide understood lighting and positioning perfectly.',
                'full_text'        => 'As a photographer, this was the perfect safari. The guide understood lighting and positioning perfectly. We spent 45 minutes with a cheetah family and he knew exactly when to reposition for the best backgrounds. The vehicle setup with beanbag mounts was excellent. I came home with portfolio-worthy images.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 5, 'accommodation' => 4, 'value' => 5],
            ],
            [
                'guest_name'       => 'Carlos & Ana Mendez',
                'country'          => 'Spain',
                'country_flag'     => '🇪🇸',
                'rating'           => 5,
                'safari_name'      => 'Serengeti & Zanzibar',
                'safari_date'      => '2025-12-10',
                'submitted_date'   => '2025-12-28',
                'status'           => 'approved',
                'excerpt'          => 'The perfect combination, wild Serengeti followed by stunning Zanzibar beaches. Our honeymoon was unforgettable.',
                'full_text'        => 'The perfect combination, wild Serengeti followed by stunning Zanzibar beaches. Our honeymoon was unforgettable. Ronjoo arranged a private dinner under the stars on our anniversary and the Zanzibar hotel had the most beautiful pool overlooking the ocean. The transition from bush to beach was seamless.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 4, 'accommodation' => 5, 'value' => 5],
            ],
            [
                'guest_name'       => 'James Patterson',
                'country'          => 'Australia',
                'country_flag'     => '🇦🇺',
                'rating'           => 5,
                'safari_name'      => 'Family Safari Adventure',
                'safari_date'      => '2025-12-20',
                'submitted_date'   => '2026-01-05',
                'status'           => 'approved',
                'excerpt'          => 'Traveling with three kids aged 6-12. Every lodge had a pool and the guides were brilliant with the children.',
                'full_text'        => 'Traveling with three kids aged 6-12 and I was nervous about keeping them engaged. Every lodge had a pool, the guide Grace was brilliant with the children, she taught them animal tracking and they loved the junior ranger program. My youngest still talks about the baby elephants at Tarangire every single day. Family safari is the best thing we have ever done.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 5, 'accommodation' => 5, 'value' => 4],
            ],
            [
                'guest_name'       => 'Emily R.',
                'country'          => 'Australia',
                'country_flag'     => '🇦🇺',
                'rating'           => 5,
                'safari_name'      => 'Southern Tanzania Wilderness',
                'safari_date'      => '2025-11-10',
                'submitted_date'   => '2025-11-25',
                'status'           => 'approved',
                'excerpt'          => 'Selous was incredible, we had entire game drives where we didn\'t see another vehicle.',
                'full_text'        => 'Selous was incredible, we had entire game drives where we didn\'t see another vehicle. Just us, the animals, and the African sky. The walking safari in Ruaha was the highlight of my trip. If you want true wilderness, go south.',
                'category_ratings' => ['guide' => 5, 'wildlife' => 5, 'accommodation' => 5, 'value' => 5],
            ],
        ];

        foreach ($reviews as $review) {
            Review::updateOrCreate(
                ['guest_name' => $review['guest_name'], 'safari_name' => $review['safari_name']],
                $review
            );
        }
    }
}
