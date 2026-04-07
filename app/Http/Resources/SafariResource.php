<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SafariResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $destinations = $this->destinations ?? [];
        $destinationsStr = is_array($destinations) ? implode(' · ', $destinations) : ($destinations ?? '');

        $price = $this->price ?? 0;
        $priceFormatted = '$' . number_format($price);

        // Build typeBadge from type + category
        $badges = [];
        if ($this->type) $badges[] = $this->type;
        // If category is array, join first element
        $cat = $this->category;
        if (is_array($cat) && count($cat) > 0) {
            $badges[] = $cat[0];
        }
        $typeBadge = implode(' · ', array_unique($badges));

        // Duration as string
        $days = $this->days ?? $this->duration;
        $durationStr = $days ? $days . ' Days' : '';

        // Best season handling
        $bestSeason = $this->best_season;
        if (is_array($bestSeason)) {
            $bestSeason = implode(', ', $bestSeason);
        }

        // Group size
        $groupSize = $this->group_size;
        if (!$groupSize && $this->max_group_size) {
            $groupSize = 'Max ' . $this->max_group_size . ' guests';
        }

        // Build pricing table from price_tiers
        $pricing = [];
        $tiers = $this->price_tiers ?? [];

        // Check if we have the new associative tiers (Premium, Superior, Standard)
        if (isset($tiers['Premium']) || isset($tiers['Superior']) || isset($tiers['Standard'])) {
            $rank = 0;
            foreach ($tiers as $tierName => $tierData) {
                // Default to 2-pax High Season, or Low if High is missing
                $paxData = $tierData['High'] ?? $tierData['Low'] ?? [];
                $tierPrice = $paxData['2'] ?? $paxData['1'] ?? 0;

                $pricing[] = [
                    'groupSize' => $tierName,
                    'perPerson' => '$' . number_format($tierPrice),
                    'total' => '$' . number_format($tierPrice * 2), // Example for 2 pax
                    'savings' => $rank > 0 ? 'Best Value' : '',
                    'bestValue' => $tierName === 'Superior', // Mark Superior as middle-ground best value
                ];
                $rank++;
            }
        } else {
            // Legacy flat tiers fallback
            foreach ($tiers as $i => $tier) {
                $tierPrice = $tier['price'] ?? 0;
                $pricing[] = [
                    'groupSize' => $tier['label'] ?? 'Tier ' . ($i + 1),
                    'perPerson' => '$' . number_format($tierPrice),
                    'total' => '$' . number_format($tierPrice * 2),
                    'savings' => $i > 0 ? '' : '—',
                    'bestValue' => $i === 0,
                ];
            }
        }

        return [
            'id'               => $this->id,
            'slug'             => $this->slug,
            'name'             => $this->name,
            'type'             => $this->type ?? '',
            'typeBadge'        => $typeBadge,
            'tagline'          => $this->short_description ?? '',
            'duration'         => $durationStr,
            'days'             => $days,
            'destinations'     => $destinations,
            'destinationsStr'  => $destinationsStr,
            'price'            => $price,
            'priceFrom'        => $priceFormatted,
            'image'            => $this->image,
            'heroImages'       => $this->hero_images ?? [],
            'category'         => $this->category ?? [],
            'description'      => $this->overview ?? '',
            'shortDescription' => $this->short_description ?? '',
            'highlights'       => $this->highlights ?? [],
            'inclusions'       => $this->inclusions ?? [],
            'exclusions'       => $this->exclusions ?? [],
            'priceTiers'       => $tiers,
            'wildlife'         => $this->whenLoaded('wildlifeAnimals',
                fn () => WildlifeResource::collection($this->wildlifeAnimals),
                $this->wildlife ?? []
            ),
            'faqs'             => $this->faqs ?? [],
            'safariAddOns'     => $this->safari_add_ons ?? [],
            'relatedSlugs'     => $this->related_slugs ?? [],
            'itinerary'        => $this->itinerary ?? [],
            'overviewProse'    => $this->overview_prose ?? [],
            'overview'         => $this->overview ?? '',
            'groupSize'        => $groupSize ?? 'Small group',
            'difficulty'       => $this->difficulty ?? '',
            'bestSeason'       => $bestSeason ?? '',
            'bestSeasonMonths' => $this->best_season_months ?? [],
            'maxGroupSize'     => $this->max_group_size,
            'status'           => $this->status,
            'featured'         => $this->featured,
            'bookingsCount'    => $this->bookings_count ?? 0,
            'bookings'         => $this->bookings_count ?? 0,
            'pricing'          => $pricing,
            'addOns'           => $this->safari_add_ons ?? [],
            'itineraryDays'    => ItineraryDayResource::collection($this->whenLoaded('itineraryDays')),
            'accommodations'   => $this->whenLoaded('accommodationsList',
                fn () => $this->accommodationsList->map(fn ($a) => [
                    'id'          => $a->id,
                    'name'        => $a->name,
                    'slug'        => $a->slug,
                    'location'    => $a->location,
                    'tier'        => $a->tier,
                    'stars'       => $a->stars,
                    'description' => $a->description,
                    'image'       => $a->image,
                    'website'     => $a->website,
                    'amenities'   => $a->amenities ?? [],
                    'nights'      => $a->pivot->nights ?? 1,
                    'sort_order'  => $a->pivot->sort_order ?? 0,
                ]),
                SafariAccommodationResource::collection($this->whenLoaded('accommodations'))
            ),
            'departures'       => DepartureResource::collection($this->whenLoaded('departures')),
            'reviews'          => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
