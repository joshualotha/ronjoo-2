<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'guest_name'       => 'sometimes|string|max:255',
            'country'          => 'nullable|string|max:100',
            'country_flag'     => 'nullable|string|max:10',
            'rating'           => 'sometimes|integer|min:1|max:5',
            'safari_name'      => 'sometimes|string|max:255',
            'safari_date'      => 'nullable|date',
            'full_text'        => 'sometimes|string|max:10000',
            'excerpt'          => 'nullable|string|max:300',
            'status'           => 'sometimes|in:pending,published,hidden,featured',
            'category_ratings' => 'nullable|array',
            'owner_response'   => 'nullable|string|max:5000',
        ];
    }
}
