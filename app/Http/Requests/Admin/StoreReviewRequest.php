<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'guest_name'                    => 'required|string|max:255',
            'country'                       => 'nullable|string|max:100',
            'country_flag'                  => 'nullable|string|max:10',
            'rating'                        => 'required|integer|min:1|max:5',
            'safari_name'                   => 'required|string|max:255',
            'safari_date'                   => 'nullable|date',
            'full_text'                     => 'required|string|max:10000',
            'excerpt'                       => 'nullable|string|max:300',
            'status'                        => 'required|in:pending,published,hidden,featured',
            'category_ratings'              => 'nullable|array',
            'category_ratings.guide'        => 'integer|min:1|max:5',
            'category_ratings.wildlife'     => 'integer|min:1|max:5',
            'category_ratings.accommodation'=> 'integer|min:1|max:5',
            'category_ratings.value'        => 'integer|min:1|max:5',
            'owner_response'               => 'nullable|string|max:5000',
        ];
    }
}
