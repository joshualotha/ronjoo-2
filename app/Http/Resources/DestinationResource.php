<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // `overview` is cast to array on the model, but legacy payloads may still be a string.
        $overview = $this->overview ?? [];
        if (is_string($overview)) {
            $overviewArray = $overview ? explode("\n\n", $overview) : [];
            // Also if the seeder used single newlines for paragraphs:
            if (count($overviewArray) === 1 && str_contains($overview, "\n")) {
                $overviewArray = explode("\n", $overview);
            }
            $overview = array_values(array_filter(array_map('trim', $overviewArray), fn ($p) => $p !== ''));
        } elseif (!is_array($overview)) {
            $overview = [];
        }

        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'name'           => $this->name,
            'region'         => $this->region ?? '',
            'tagline'        => $this->tagline ?? '',
            'areaStat'       => $this->area_stat ?? '',
            'areaLabel'      => $this->area_label ?? '',
            'heroImage'      => $this->hero_image ?? '',
            'portraitImage'  => $this->portrait_image ?? '',
            'pullQuote'      => $this->pull_quote ?? '',
            'status'         => $this->status,
            'quickFacts'     => $this->quick_facts ?? [],
            'overview'       => $overview,
            'wildlife'       => $this->wildlife ?? [],
            'months'         => $this->months ?? [],
            'seasons'        => $this->seasons ?? [],
            'experiences'    => $this->experiences ?? [],
            'gallery'        => $this->gallery ?? [],
            'travelInfo'     => $this->travel_info ?? [],
            'relatedSlugs'   => $this->related_slugs ?? [],
            'accommodations' => DestinationAccommodationResource::collection($this->whenLoaded('accommodations')),
            'faqs'           => DestinationFaqResource::collection($this->whenLoaded('faqs')),
            'safariCount'    => $this->safaris_count ?? 0,
            'metaTitle'      => $this->meta_title ?? '',
            'metaDescription'=> $this->meta_description ?? '',
        ];
    }
}
