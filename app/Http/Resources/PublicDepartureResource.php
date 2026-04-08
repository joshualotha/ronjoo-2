<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicDepartureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $safari = $this->whenLoaded('safari');

        return [
            'id'             => $this->id,
            'safariId'       => $this->safari_id,
            'safariName'     => $this->safari_name,
            'safariSlug'     => $safari?->slug ?? null,
            'dateRange'      => $this->start_date && $this->end_date
                ? $this->start_date->format('M j') . ' – ' . $this->end_date->format('M j, Y')
                : null,
            'startDate'      => $this->start_date?->toDateString(),
            'endDate'        => $this->end_date?->toDateString(),
            'month'          => $this->start_date?->format('M'),
            'destinations'   => $safari?->destinations ?? [],
            'totalSeats'     => $this->total_seats,
            'seatsTaken'     => $this->booked_seats,
            'availableSeats' => $this->available_seats,
            'pricePerPerson' => $this->price_per_person ?? 0,
            'soldOut'        => $this->available_seats <= 0,
            'status'         => $this->status,
            'guide'          => $this->guide,
        ];
    }
}
