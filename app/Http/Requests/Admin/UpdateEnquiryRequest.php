<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnquiryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'guest_name'      => 'sometimes|string|max:255',
            'email'           => 'sometimes|email|max:255',
            'whatsapp'        => 'nullable|string|max:30',
            'country'         => 'nullable|string|max:100',
            'country_flag'    => 'nullable|string|max:10',
            'safari_interest' => 'nullable|string|max:255',
            'preferred_dates' => 'nullable|string|max:100',
            'travelers'       => 'nullable|integer|min:1|max:50',
            'budget'          => 'nullable|string|max:100',
            'message'         => 'sometimes|string|max:5000',
            'status'          => 'sometimes|in:new,in-progress,awaiting-guest,converted,archived',
            'is_read'         => 'sometimes|boolean',
            'source'          => 'nullable|string|max:50',
            'tags'            => 'nullable|array',
            'tags.*'          => 'string|max:50',
        ];
    }
}
