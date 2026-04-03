<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'slug'      => $this->slug,
            'name'      => $this->name,
            'icon'      => $this->icon,
            'teaser'    => $this->teaser,
            'sortOrder' => $this->sort_order,
            'questions' => FaqResource::collection($this->whenLoaded('faqs')),
        ];
    }
}
