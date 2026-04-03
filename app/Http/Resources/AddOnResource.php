<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddOnResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'name'           => $this->name,
            'category'       => $this->category ?? '',
            'filterCategory' => $this->filter_category ?? [],
            'price'          => $this->price ?? '',
            'priceNumeric'   => $this->price_numeric ?? 0,
            'priceSuffix'    => $this->price_suffix ?? '',
            'duration'       => $this->duration ?? '',
            'location'       => $this->location ?? '',
            'bestSeason'     => $this->best_season ?? '',
            'groupSize'      => $this->group_size ?? '',
            'startTime'      => $this->start_time ?? '',
            'tagline'        => $this->tagline ?? '',
            'heroImages'     => is_array($this->hero_images) ? $this->hero_images : (json_decode($this->hero_images, true) ?? []),
            'overviewProse'  => $this->overview_prose ?? [],
            'pullQuote'      => $this->pull_quote ?? '',
            'included'       => $this->included ?? [],
            'notIncluded'    => $this->not_included ?? [],
            'timeline'       => $this->timeline ?? [],
            'faqs'           => $this->faqs ?? [],
            'practicalInfo'  => $this->practical_info ?? [],
            'relatedSlugs'   => $this->related_slugs ?? [],
        ];
    }
}
