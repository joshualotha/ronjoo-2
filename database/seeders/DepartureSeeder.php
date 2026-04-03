<?php

namespace Database\Seeders;

use App\Models\Departure;
use App\Models\Safari;
use Illuminate\Database\Seeder;

class DepartureSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing departures
        Departure::query()->delete();

        $safariIds = Safari::pluck('id', 'slug');

        $departures = [
            // ━━━━ TARANGIRE – SERENGETI – NGORONGORO (7D) ━━━━
            [
                'safari_id' => $safariIds['tarangire-serengeti-ngorongoro-7d'] ?? null,
                'safari_name' => 'Tarangire – Serengeti – Ngorongoro',
                'start_date' => '2026-07-12',
                'end_date' => '2026-07-18',
                'total_seats' => 6,
                'booked_seats' => 2,
                'status' => 'open',
                'revenue' => 7280,
                'projected_revenue' => 21840,
                'guide' => 'Joseph Makacha',
                'guests' => [],
                'waitlist' => [],
            ],
            [
                'safari_id' => $safariIds['tarangire-serengeti-ngorongoro-7d'] ?? null,
                'safari_name' => 'Tarangire – Serengeti – Ngorongoro',
                'start_date' => '2026-08-14',
                'end_date' => '2026-08-20',
                'total_seats' => 6,
                'booked_seats' => 6,
                'status' => 'full',
                'revenue' => 21840,
                'projected_revenue' => 21840,
                'guide' => 'Daniel Kimaro',
                'guests' => [],
                'waitlist' => [],
            ],

            // ━━━━ SERENGETI – NGORONGORO EXPLORER ━━━━
            [
                'safari_id' => $safariIds['serengeti-ngorongoro-5d'] ?? null,
                'safari_name' => 'Serengeti – Ngorongoro Explorer',
                'start_date' => '2026-09-05',
                'end_date' => '2026-09-09',
                'total_seats' => 6,
                'booked_seats' => 1,
                'status' => 'open',
                'revenue' => 2870,
                'projected_revenue' => 17220,
                'guide' => 'Grace Ngowi',
                'guests' => [],
                'waitlist' => [],
            ],

            // ━━━━ SAFARI & ZANZIBAR ULTIMATE ━━━━
            [
                'safari_id' => $safariIds['safari-zanzibar-14d'] ?? null,
                'safari_name' => 'Safari & Zanzibar Ultimate',
                'start_date' => '2026-10-10',
                'end_date' => '2026-10-23',
                'total_seats' => 4,
                'booked_seats' => 2,
                'status' => 'open',
                'revenue' => 11570,
                'projected_revenue' => 23140,
                'guide' => 'Baraka Mrema',
                'guests' => [],
                'waitlist' => [],
            ],

            // ━━━━ MIKUMI SGR TRAIN ━━━━
            [
                'safari_id' => $safariIds['mikumi-sgr-3d'] ?? null,
                'safari_name' => 'Mikumi SGR Train Experience',
                'start_date' => '2026-06-15',
                'end_date' => '2026-06-17',
                'total_seats' => 8,
                'booked_seats' => 4,
                'status' => 'open',
                'revenue' => 3972,
                'projected_revenue' => 7944,
                'guide' => 'Emmanuel Mollel',
                'guests' => [],
                'waitlist' => [],
            ],
            
            // ━━━━ SOUTHERN SELOUS ━━━━
            [
                'safari_id' => $safariIds['selous-fly-in-4d'] ?? null,
                'safari_name' => 'Southern Safari Selous Fly-In',
                'start_date' => '2026-07-20',
                'end_date' => '2026-07-23',
                'total_seats' => 4,
                'booked_seats' => 0,
                'status' => 'open',
                'revenue' => 0,
                'projected_revenue' => 9336,
                'guide' => 'Joseph Makacha',
                'guests' => [],
                'waitlist' => [],
            ],
        ];

        foreach ($departures as $departure) {
            Departure::create($departure);
        }
    }
}
