<?php

namespace Database\Seeders;

use App\Models\Subscriber;
use Illuminate\Database\Seeder;

class SubscriberSeeder extends Seeder
{
    public function run(): void
    {
        $subscribers = [
            ['email' => 'john@example.com',   'name' => 'John Smith',      'country' => 'United Kingdom', 'source' => 'Website',  'date_subscribed' => '2025-11-15', 'status' => 'active'],
            ['email' => 'sarah@example.com',  'name' => 'Sarah Mitchell',  'country' => 'United States',  'source' => 'Booking',  'date_subscribed' => '2025-08-28', 'status' => 'active'],
            ['email' => 'marco@example.com',  'name' => 'Marco Rossi',     'country' => 'Italy',          'source' => 'Website',  'date_subscribed' => '2026-01-10', 'status' => 'active'],
            ['email' => 'anna@example.com',   'name' => 'Anna Johansson',  'country' => 'Sweden',         'source' => 'Website',  'date_subscribed' => '2026-02-20', 'status' => 'active'],
            ['email' => 'chen@example.com',   'name' => 'Wei Chen',        'country' => 'China',          'source' => 'Import',   'date_subscribed' => '2025-06-01', 'status' => 'unsubscribed'],
        ];

        foreach ($subscribers as $sub) {
            Subscriber::updateOrCreate(['email' => $sub['email']], $sub);
        }
    }
}
