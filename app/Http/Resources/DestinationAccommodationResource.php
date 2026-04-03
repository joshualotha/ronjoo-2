<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationAccommodationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'tier'        => $this->tier,
            'stars'       => $this->stars ?? 0,
            'description' => $this->description,
            'amenities'   => is_array($this->amenities) ? $this->amenities : (json_decode($this->amenities, true) ?? []),
            'image'       => $this->image,
        ];
    }
}
