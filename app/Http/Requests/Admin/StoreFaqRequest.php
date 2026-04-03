<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'question'        => 'required|string|max:500',
            'answer'          => 'required|string|max:10000',
            'faq_category_id' => 'required|exists:faq_categories,id',
            'related_guide'   => 'nullable',
            'related_safari'  => 'nullable',
            'tags'            => 'nullable|array',
            'tags.*'          => 'string|max:50',
            'status'          => 'required|in:published,hidden',
            'sort_order'      => 'nullable|integer|min:0',
        ];
    }
}
