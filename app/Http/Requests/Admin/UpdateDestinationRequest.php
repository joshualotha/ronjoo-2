<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDestinationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Frontend uses camelCase (DestinationResource output); backend validates snake_case.
        $map = [
            'areaStat'        => 'area_stat',
            'areaLabel'       => 'area_label',
            'heroImage'       => 'hero_image',
            'portraitImage'   => 'portrait_image',
            'pullQuote'       => 'pull_quote',
            'quickFacts'      => 'quick_facts',
            'travelInfo'      => 'travel_info',
            'relatedSlugs'    => 'related_slugs',
            'metaTitle'       => 'meta_title',
            'metaDescription' => 'meta_description',
        ];

        $merged = [];
        foreach ($map as $camel => $snake) {
            if ($this->has($camel) && !$this->has($snake)) {
                $merged[$snake] = $this->input($camel);
            }
        }
        if (!empty($merged)) {
            $this->merge($merged);
        }

        // Mirror StoreDestinationRequest behavior: filter out empty placeholder entries
        if ($this->has('quick_facts')) {
            $facts = array_filter($this->input('quick_facts', []), fn($f) => !empty($f['label']) && !empty($f['value']));
            $this->merge(['quick_facts' => array_values($facts)]);
        }

        if ($this->has('wildlife')) {
            $wildlife = array_filter($this->input('wildlife', []), fn($w) => !empty($w['name']));
            $this->merge(['wildlife' => array_values($wildlife)]);
        }

        if ($this->has('experiences')) {
            $exps = array_filter($this->input('experiences', []), fn($e) => !empty($e['title']));
            $this->merge(['experiences' => array_values($exps)]);
        }

        if ($this->has('faqs')) {
            $faqs = array_filter($this->input('faqs', []), fn($f) => !empty($f['question']));
            $this->merge(['faqs' => array_values($faqs)]);
        }

        if ($this->has('accommodations')) {
            $accs = array_filter($this->input('accommodations', []), fn($a) => !empty($a['name']));
            $this->merge(['accommodations' => array_values($accs)]);
        }
    }

    public function rules(): array
    {
        return [
            'name'           => 'sometimes|string|max:255',
            'slug'           => 'sometimes|string|max:255|unique:destinations,slug,' . $this->route('destination')?->id,
            'region'         => 'sometimes|string|max:100',
            'tagline'        => 'nullable|string|max:500',
            'status'         => 'sometimes|in:published,draft',
            'overview'       => 'nullable|array',
            'quick_facts'    => 'nullable|array',
            'quick_facts.*.label'   => 'sometimes|string|max:100',
            'quick_facts.*.value'   => 'sometimes|string|max:100',
            'quick_facts.*.icon'    => 'nullable|string|max:50',
            'wildlife'       => 'nullable|array',
            'wildlife.*.name'       => 'sometimes|string|max:255',
            'wildlife.*.likelihood' => 'sometimes|string|max:100',
            'wildlife.*.fact'       => 'nullable|string|max:500',
            'wildlife.*.image'      => 'nullable|string|max:500',
            'experiences'    => 'nullable|array',
            'experiences.*.title'       => 'required|string|max:255',
            'experiences.*.description' => 'nullable|string|max:5000',
            'experiences.*.tags'        => 'nullable|string|max:500',
            'faqs'           => 'nullable|array',
            'accommodations' => 'nullable|array',
            'accommodations.*.name'        => 'sometimes|string|max:255',
            'accommodations.*.tier'        => 'sometimes|string|max:50',
            'accommodations.*.stars'       => 'nullable|integer|min:1|max:5',
            'accommodations.*.amenities'   => 'nullable|array',
            'accommodations.*.description' => 'nullable|string|max:2000',
            'accommodations.*.image'       => 'nullable|string|max:500',
            'hero_image'     => 'nullable|string|max:500',
            'portrait_image' => 'nullable|string|max:500',
            'gallery'        => 'nullable|array',
            'gallery.*'      => 'required|string|max:500',
            'meta_title'     => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
        ];
    }
}
