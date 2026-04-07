<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSafariRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Frontend uses camelCase (SafariResource output); backend validates snake_case.
        $map = [
            'maxGroupSize'     => 'max_group_size',
            'bestSeason'       => 'best_season',
            'shortDescription' => 'short_description',
            'priceFrom'        => 'price_from',
            'priceTiers'       => 'price_tiers',
            'heroImages'       => 'hero_images',
            'metaTitle'        => 'meta_title',
            'metaDescription'  => 'meta_description',
            'focusKeyword'     => 'focus_keyword',
        ];

        $merged = [];
        foreach ($map as $camel => $snake) {
            if ($this->has($camel) && !$this->has($snake)) {
                $merged[$snake] = $this->input($camel);
            }
        }

        // Nested itinerary uses dayNumber from the SPA.
        if ($this->has('itinerary') && is_array($this->input('itinerary'))) {
            $it = $this->input('itinerary');
            foreach ($it as $i => $day) {
                if (is_array($day) && array_key_exists('dayNumber', $day) && !array_key_exists('day_number', $day)) {
                    $it[$i]['day_number'] = $day['dayNumber'];
                }
            }
            $merged['itinerary'] = $it;
        }

        if (!empty($merged)) {
            $this->merge($merged);
        }

        // Filter out empty/null placeholder items from arrays
        if ($this->has('highlights')) {
            $this->merge([
                'highlights' => array_values(array_filter($this->input('highlights', []), fn($v) => $v !== null && $v !== '')),
            ]);
        }

        if ($this->has('itinerary')) {
            $itinerary = array_filter($this->input('itinerary', []), fn($day) => !empty($day['title']));
            $this->merge(['itinerary' => array_values($itinerary)]);
        }

        if ($this->has('inclusions')) {
            $this->merge([
                'inclusions' => array_values(array_filter($this->input('inclusions', []), fn($v) => $v !== null && $v !== '')),
            ]);
        }

        if ($this->has('exclusions')) {
            $this->merge([
                'exclusions' => array_values(array_filter($this->input('exclusions', []), fn($v) => $v !== null && $v !== '')),
            ]);
        }

        if ($this->has('price_tiers')) {
            $tiers = array_filter($this->input('price_tiers', []), fn($t) => !empty($t['label']));
            $this->merge(['price_tiers' => array_values($tiers)]);
        }

        if ($this->has('accommodations') && is_array($this->input('accommodations'))) {
            $acc = $this->input('accommodations');
            foreach ($acc as $i => $item) {
                if (!empty($item['website']) && !preg_match('~^(?:f|ht)tps?://~i', $item['website'])) {
                    $acc[$i]['website'] = 'https://' . $item['website'];
                }
            }
            $this->merge(['accommodations' => $acc]);
        }
    }

    public function rules(): array
    {
        return [
            'name'              => 'required|string|max:255',
            'slug'              => 'required|string|max:255|unique:safaris,slug',
            'type'              => 'required|string|max:100',
            'duration'          => 'required|integer|min:1|max:60',
            'max_group_size'    => 'nullable|integer|min:1|max:50',
            'difficulty'        => 'nullable|in:Easy,Moderate,Challenging,Extreme',
            'best_season'       => 'nullable|array',
            'best_season.*'     => 'string|max:10',
            'short_description' => 'nullable|string|max:300',
            'overview'          => 'nullable|string|max:10000',
            'status'            => 'required|in:published,draft',
            'featured'          => 'boolean',
            'image'             => 'nullable|string|max:2000',
            'hero_images'       => 'nullable|array|max:10',
            'hero_images.*'     => 'string|max:2000',
            'price_from'        => 'nullable|integer|min:0',
            'highlights'        => 'nullable|array|max:8',
            'highlights.*'      => 'string|max:500',
            'itinerary'                      => 'nullable|array|max:30',
            'itinerary.*.day_number'         => 'required|integer|min:1',
            'itinerary.*.title'              => 'required|string|max:255',
            'itinerary.*.location'           => 'nullable|string|max:255',
            'itinerary.*.description'        => 'nullable|string|max:5000',
            'itinerary.*.activities'         => 'nullable|array',
            'itinerary.*.meals'              => 'nullable',
            'itinerary.*.accommodation'      => 'nullable|string|max:255',
            'itinerary.*.notes'              => 'nullable|string|max:1000',
            'inclusions'        => 'nullable|array',
            'inclusions.*'      => 'string|max:500',
            'exclusions'        => 'nullable|array',
            'exclusions.*'      => 'string|max:500',
            'price_tiers'               => 'nullable|array|max:10',
            'price_tiers.*.label'       => 'required|string|max:100',
            'price_tiers.*.price'       => 'required|integer|min:0',
            'meta_title'        => 'nullable|string|max:60',
            'meta_description'  => 'nullable|string|max:160',
            'focus_keyword'     => 'nullable|string|max:100',
            'accommodations'                => 'nullable|array|max:10',
            'accommodations.*.name'         => 'required|string|max:255',
            'accommodations.*.nights'       => 'nullable|integer|min:1',
            'accommodations.*.tier'         => 'nullable|string|max:100',
            'accommodations.*.image'        => 'nullable|string|max:2000',
            'accommodations.*.rating'       => 'nullable|integer|min:1|max:5',
            'accommodations.*.description'  => 'nullable|string|max:2000',
            'accommodations.*.website'      => 'nullable|string|max:500',
            'accommodations.*.amenities'    => 'nullable|array',
            'accommodation_ids'              => 'nullable|array',
            'accommodation_ids.*.id'         => 'required|integer|exists:accommodations,id',
            'accommodation_ids.*.nights'     => 'nullable|integer|min:1',
            'accommodation_ids.*.sort_order' => 'nullable|integer',
        ];
    }
}
