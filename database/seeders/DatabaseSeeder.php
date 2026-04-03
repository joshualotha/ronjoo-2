<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SafariPackagesSeeder::class,  // Add the new comprehensive seeder
            SafariSeeder::class,           // Keep existing if needed, but SafariPackagesSeeder should be more complete
            DestinationSeeder::class,
            BookingSeeder::class,
            DepartureSeeder::class,
            EnquirySeeder::class,
            ReviewSeeder::class,
            BlogPostSeeder::class,
            FaqSeeder::class,
            TravelGuideSeeder::class,
            TeamMemberSeeder::class,
            SubscriberSeeder::class,
            AddOnSeeder::class,
        ]);
    }
}
