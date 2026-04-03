<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Safari;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $safariIds = Safari::pluck('id', 'name');

        $bookings = [
            ['ref' => 'RNJ-2026-001', 'guest_name' => 'John & Sarah Smith', 'email' => 'john@example.com', 'whatsapp' => '+44 7700 900000', 'country' => 'United Kingdom', 'safari_id' => $safariIds['Great Migration Safari'] ?? null, 'safari_name' => 'Great Migration Safari', 'departure_date' => '2026-08-14', 'return_date' => '2026-08-22', 'pax' => 2, 'children' => 0, 'total_amount' => 6400, 'deposit_paid' => 1920, 'balance_due' => 4480, 'status' => 'confirmed', 'payment_status' => 'deposit-paid', 'group_type' => 'private', 'guide' => 'Joseph Makacha', 'notes' => ['Honeymoon couple, special dinner requested'], 'accommodation_tier' => 'Luxury'],
            ['ref' => 'RNJ-2026-002', 'guest_name' => 'Emma Wilson', 'email' => 'emma@example.com', 'whatsapp' => '+1 555 0123', 'country' => 'United States', 'safari_id' => $safariIds['Northern Circuit Classic'] ?? null, 'safari_name' => 'Northern Circuit Classic', 'departure_date' => '2026-07-05', 'return_date' => '2026-07-11', 'pax' => 1, 'children' => 0, 'total_amount' => 3200, 'deposit_paid' => 960, 'balance_due' => 2240, 'status' => 'confirmed', 'payment_status' => 'deposit-paid', 'group_type' => 'group', 'guide' => 'Daniel Kimaro', 'notes' => ['Solo traveler, photography enthusiast'], 'accommodation_tier' => 'Classic'],
            ['ref' => 'RNJ-2026-003', 'guest_name' => 'Pierre & Marie Dupont', 'email' => 'pierre@example.com', 'whatsapp' => '+33 6 12 34 56 78', 'country' => 'France', 'safari_id' => $safariIds['Kilimanjaro Lemosho Route'] ?? null, 'safari_name' => 'Kilimanjaro Lemosho Route', 'departure_date' => '2026-09-01', 'return_date' => '2026-09-09', 'pax' => 2, 'children' => 0, 'total_amount' => 5800, 'deposit_paid' => 5800, 'balance_due' => 0, 'status' => 'confirmed', 'payment_status' => 'fully-paid', 'group_type' => 'group', 'guide' => 'Emmanuel Mollel', 'notes' => ['Both experienced hikers'], 'accommodation_tier' => 'Standard'],
            ['ref' => 'RNJ-2026-004', 'guest_name' => 'Müller Family', 'email' => 'mueller@example.com', 'whatsapp' => '+49 170 1234567', 'country' => 'Germany', 'safari_id' => $safariIds['Family Safari Adventure'] ?? null, 'safari_name' => 'Family Safari Adventure', 'departure_date' => '2026-12-20', 'return_date' => '2026-12-28', 'pax' => 2, 'children' => 2, 'total_amount' => 8900, 'deposit_paid' => 2670, 'balance_due' => 6230, 'status' => 'confirmed', 'payment_status' => 'deposit-paid', 'group_type' => 'private', 'notes' => ['Children ages 8 and 12, need child seats'], 'accommodation_tier' => 'Luxury'],
            ['ref' => 'RNJ-2026-005', 'guest_name' => 'Takeshi Yamamoto', 'email' => 'takeshi@example.com', 'whatsapp' => '+81 90 1234 5678', 'country' => 'Japan', 'safari_id' => $safariIds['Photography Safari'] ?? null, 'safari_name' => 'Photography Safari', 'departure_date' => '2026-06-18', 'return_date' => '2026-06-25', 'pax' => 1, 'children' => 0, 'total_amount' => 4200, 'deposit_paid' => 0, 'balance_due' => 4200, 'status' => 'pending', 'payment_status' => 'pending', 'group_type' => 'private', 'notes' => ['Professional photographer, needs extra vehicle space'], 'accommodation_tier' => 'Luxury'],
            ['ref' => 'RNJ-2025-048', 'guest_name' => 'Oliver & Kate Brown', 'email' => 'oliver@example.com', 'whatsapp' => '+61 400 123 456', 'country' => 'Australia', 'safari_id' => $safariIds['Serengeti & Zanzibar'] ?? null, 'safari_name' => 'Serengeti & Zanzibar', 'departure_date' => '2026-02-10', 'return_date' => '2026-02-20', 'pax' => 2, 'children' => 0, 'total_amount' => 7200, 'deposit_paid' => 7200, 'balance_due' => 0, 'status' => 'completed', 'payment_status' => 'fully-paid', 'group_type' => 'private', 'guide' => 'Joseph Makacha', 'notes' => [], 'accommodation_tier' => 'Luxury'],
            ['ref' => 'RNJ-2026-006', 'guest_name' => 'Maria Santos', 'email' => 'maria@example.com', 'whatsapp' => '+55 11 91234 5678', 'country' => 'Brazil', 'safari_id' => $safariIds['Great Migration Safari'] ?? null, 'safari_name' => 'Great Migration Safari', 'departure_date' => '2026-08-14', 'return_date' => '2026-08-22', 'pax' => 1, 'children' => 0, 'total_amount' => 3200, 'deposit_paid' => 960, 'balance_due' => 2240, 'status' => 'confirmed', 'payment_status' => 'deposit-paid', 'group_type' => 'group', 'notes' => ['Speaks Portuguese and English'], 'accommodation_tier' => 'Classic'],
            ['ref' => 'RNJ-2026-007', 'guest_name' => 'Hans & Greta Weber', 'email' => 'hans@example.com', 'whatsapp' => '+41 79 123 45 67', 'country' => 'Switzerland', 'safari_id' => $safariIds['Northern Circuit Classic'] ?? null, 'safari_name' => 'Northern Circuit Classic', 'departure_date' => '2026-10-05', 'return_date' => '2026-10-12', 'pax' => 2, 'children' => 0, 'total_amount' => 6800, 'deposit_paid' => 0, 'balance_due' => 6800, 'status' => 'pending', 'payment_status' => 'pending', 'group_type' => 'private', 'notes' => ['Want to add Zanzibar extension'], 'accommodation_tier' => 'Premium'],
        ];

        foreach ($bookings as $booking) {
            Booking::updateOrCreate(['ref' => $booking['ref']], $booking);
        }
    }
}
