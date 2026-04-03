<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'src'        => $this->src,
            'alt'        => $this->alt ?? '',
            'caption'    => $this->caption ?? '',
            'tags'       => $this->tags ?? [],
            'category'   => $this->category ?? '',
            'destination'=> $this->destination ?? '',
            'safari'     => $this->safari ?? '',
            'createdAt'  => $this->created_at?->toIso8601String(),
            'updatedAt'  => $this->updated_at?->toIso8601String(),
        ];
    }
}

