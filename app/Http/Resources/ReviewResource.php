<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'guestName'       => $this->guest_name,
            'country'         => $this->country,
            'countryFlag'     => $this->country_flag,
            'rating'          => $this->rating,
            'safariName'      => $this->safari_name,
            'safariDate'      => $this->safari_date?->toDateString(),
            'submittedDate'   => $this->submitted_date?->toDateString(),
            'status'          => $this->status,
            'excerpt'         => $this->excerpt,
            'fullText'        => $this->full_text,
            'ownerResponse'   => $this->owner_response,
            'categoryRatings' => $this->category_ratings ?? (object)[],
        ];
    }
}
