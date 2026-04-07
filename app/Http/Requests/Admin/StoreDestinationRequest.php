<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDestinationRequest extends FormRequest
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

        // Filter out empty placeholder entries from nested arrays
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

        // Normalize experiences tags to arrays
        if ($this->has('experiences')) {
            $exps = $this->input('experiences', []);
            foreach ($exps as &$exp) {
                if (isset($exp['tags']) && is_string($exp['tags'])) {
                    $exp['tags'] = array_values(array_filter(array_map('trim', explode(',', $exp['tags']))));
                }
            }
            $this->merge(['experiences' => $exps]);
        }
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:destinations,slug',
            'region'         => 'required|string|max:100',
            'tagline'        => 'nullable|string|max:500',
            'status'         => 'required|in:published,draft',
            'overview'       => 'nullable|array',
            'pull_quote'     => 'nullable|string|max:500',
            'quick_facts'    => 'nullable|array',
            'quick_facts.*.label'   => 'required|string|max:100',
            'quick_facts.*.value'   => 'required|string|max:100',
            'quick_facts.*.icon'    => 'nullable|string|max:50',
            'wildlife'       => 'nullable|array',
            'wildlife.*.name'       => 'required|string|max:255',
            'wildlife.*.likelihood' => 'required|string|max:100',
            'wildlife.*.fact'       => 'nullable|string|max:500',
            'wildlife.*.image'      => 'nullable|string|max:500',
            'experiences'    => 'nullable|array',
            'experiences.*.title'       => 'required|string|max:255',
            'experiences.*.description' => 'nullable|string|max:5000',
            'experiences.*.tags'        => 'nullable|array',
            'experiences.*.tags.*'       => 'string|max:100',
            'faqs'           => 'nullable|array',
            'faqs.*.question' => 'required|string|max:500',
            'faqs.*.answer'   => 'required|string|max:5000',
            'accommodations' => 'nullable|array',
            'accommodations.*.name'        => 'required|string|max:255',
            'accommodations.*.tier'        => 'required|string|max:50',
            'accommodations.*.stars'       => 'nullable|integer|min:1|max:5',
            'accommodations.*.amenities'   => 'nullable|array',
            'accommodations.*.description' => 'nullable|string|max:2000',
            'accommodations.*.image'       => 'nullable|string|max:500',
            'hero_image'     => 'nullable|string|max:500',
            'portrait_image' => 'nullable|string|max:500',
            'gallery'        => 'nullable|array',
            'gallery.*'      => 'required|string|max:500',
            'wildlife_ids'   => 'nullable|array',
            'wildlife_ids.*.id'         => 'required|integer|exists:wildlife,id',
            'wildlife_ids.*.likelihood' => 'nullable|string|max:100',
            'wildlife_ids.*.custom_fact'=> 'nullable|string|max:1000',
            'wildlife_ids.*.sort_order' => 'nullable|integer',
            'accommodation_ids'   => 'nullable|array',
            'accommodation_ids.*.id'         => 'required|integer|exists:accommodations,id',
            'accommodation_ids.*.sort_order' => 'nullable|integer',
            'meta_title'     => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
        ];
    }
}
