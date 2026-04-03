<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryImageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->has('tags')) {
            $tags = array_filter($this->input('tags', []), fn ($t) => $t !== null && trim((string) $t) !== '');
            $this->merge(['tags' => array_values($tags)]);
        }
    }

    public function rules(): array
    {
        return [
            'src'         => 'sometimes|string|max:2000',
            'alt'         => 'nullable|string|max:255',
            'caption'     => 'nullable|string|max:5000',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
            'category'    => 'nullable|string|max:100',
            'destination' => 'nullable|string|max:255',
            'safari'      => 'nullable|string|max:255',
        ];
    }
}

