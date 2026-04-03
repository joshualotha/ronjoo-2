<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'question'        => 'sometimes|string|max:500',
            'answer'          => 'sometimes|string|max:10000',
            'faq_category_id' => 'sometimes|exists:faq_categories,id',
            'related_guide'   => 'nullable',
            'related_safari'  => 'nullable',
            'tags'            => 'nullable|array',
            'tags.*'          => 'string|max:50',
            'status'          => 'sometimes|in:published,hidden',
            'sort_order'      => 'nullable|integer|min:0',
        ];
    }
}
