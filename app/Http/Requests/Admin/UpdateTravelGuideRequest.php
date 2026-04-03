<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTravelGuideRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->has('checklist_items')) {
            $items = array_filter($this->input('checklist_items', []), fn ($v) => $v !== null && trim((string) $v) !== '');
            $this->merge(['checklist_items' => array_values($items)]);
        }

        if ($this->has('content')) {
            $content = $this->input('content');
            if (is_string($content)) {
                $parts = preg_split("/\n\s*\n/", trim($content)) ?: [];
                $blocks = [];
                foreach ($parts as $p) {
                    $p = trim($p);
                    if ($p === '') continue;
                    $blocks[] = ['type' => 'text', 'body' => $p];
                }
                $this->merge(['content' => $blocks]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'title'            => 'sometimes|string|max:255',
            'slug'             => 'sometimes|string|max:255|unique:travel_guides,slug,' . $this->route('travel_guide')?->id,
            'category'         => 'sometimes|string|max:100',
            'guide_type'       => 'sometimes|string|max:50',
            'read_time'        => 'nullable|string|max:20',
            'status'           => 'sometimes|in:published,draft',
            'content'          => 'nullable|array|max:2000',
            'content.*.type'   => 'nullable|string|max:50',
            'content.*.body'   => 'nullable|string|max:20000',
            'content.*.text'   => 'nullable|string|max:20000',
            'content.*.items'  => 'nullable|array',
            'excerpt'          => 'nullable|string|max:500',
            'meta_title'       => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'checklist_items'  => 'nullable|array',
            'checklist_items.*'=> 'string|max:500',
        ];
    }
}
