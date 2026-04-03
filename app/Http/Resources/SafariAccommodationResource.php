<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SafariAccommodationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'nights'      => $this->nights,
            'tier'        => $this->tier,
            'image'       => $this->image,
            'rating'      => $this->rating,
            'description' => $this->description,
            'website'     => $this->website,
            'amenities'   => $this->amenities,
        ];
    }
}
