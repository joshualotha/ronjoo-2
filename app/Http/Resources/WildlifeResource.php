<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WildlifeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'slug'                => $this->slug,
            'category'            => $this->category,
            'image'               => $this->image,
            'fact'                => $this->fact,
            'description'         => $this->description,
            'conservation_status' => $this->conservation_status,

            // Pivot data (when loaded via a relationship)
            'likelihood'  => $this->whenPivotLoaded('destination_wildlife', fn () => $this->pivot->likelihood),
            'custom_fact' => $this->whenPivotLoaded('destination_wildlife', fn () => $this->pivot->custom_fact),
            'sort_order'  => $this->whenPivotLoaded('destination_wildlife', fn () => $this->pivot->sort_order,
                $this->whenPivotLoaded('safari_wildlife', fn () => $this->pivot->sort_order)
            ),

            // Counts (when loaded)
            'destinations_count' => $this->whenCounted('destinations'),
            'safaris_count'      => $this->whenCounted('safaris'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
