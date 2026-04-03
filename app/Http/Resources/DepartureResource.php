<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $dateRange = null;
        if ($this->start_date && $this->end_date) {
            $dateRange = $this->start_date->format('M j') . ' – ' . $this->end_date->format('M j, Y');
        }

        $pricePerPerson = 0;
        if ($this->projected_revenue && $this->total_seats) {
            $pricePerPerson = (int) round($this->projected_revenue / $this->total_seats);
        }

        $nationalities = [];
        $guests = $this->guests ?? [];
        if (is_array($guests)) {
            foreach ($guests as $guest) {
                if (isset($guest['country'])) {
                    $nationalities[] = $guest['country'];
                }
            }
        }

        return [
            'id'               => $this->id,
            'safariId'         => $this->safari_id,
            'safariName'       => $this->safari_name,
            'startDate'        => $this->start_date?->toDateString(),
            'endDate'          => $this->end_date?->toDateString(),
            'month'            => $this->start_date?->format('M'),
            'dateRange'        => $dateRange,
            'totalSeats'       => $this->total_seats,
            'bookedSeats'      => $this->booked_seats,
            'takenSeats'       => $this->booked_seats,
            'seatsTaken'       => $this->booked_seats,
            'availableSeats'   => $this->available_seats,
            'pricePerPerson'   => $pricePerPerson,
            'soldOut'          => $this->available_seats <= 0,
            'status'           => $this->status,
            'revenue'          => $this->revenue ?? 0,
            'projectedRevenue' => $this->projected_revenue ?? 0,
            'guide'            => $this->guide,
            'guests'           => $guests,
            'nationalities'    => array_values(array_unique($nationalities)),
            'waitlist'         => $this->waitlist ?? [],
        ];
    }
}
