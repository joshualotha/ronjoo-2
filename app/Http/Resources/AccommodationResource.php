<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'slug'                => $this->slug,
            'location'            => $this->location,
            'tier'                => $this->tier,
            'stars'               => $this->stars,
            'description'         => $this->description,
            'image'               => $this->image,
            'website'             => $this->website,
            'amenities'           => $this->amenities ?? [],
            'destinations_count'  => $this->whenCounted('destinations'),
            'safaris_count'       => $this->whenCounted('safaris'),
            // Pivot data when loaded through a relationship
            'nights'              => $this->whenPivotLoaded('accommodation_safari', fn() => $this->pivot->nights),
            'sort_order'          => $this->whenPivotLoadedAs('pivot', 'accommodation_safari', fn() => $this->pivot->sort_order,
                $this->whenPivotLoadedAs('pivot', 'accommodation_destination', fn() => $this->pivot->sort_order)
            ),
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}
