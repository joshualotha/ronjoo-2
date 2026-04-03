<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartureRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'safari_name'       => 'sometimes|string|max:255',
            'start_date'        => 'sometimes|date',
            'end_date'          => 'sometimes|date|after:start_date',
            'total_seats'       => 'sometimes|integer|min:1|max:50',
            'booked_seats'      => 'integer|min:0',
            'status'            => 'sometimes|in:open,full,closed,cancelled,completed',
            'revenue'           => 'integer|min:0',
            'projected_revenue' => 'integer|min:0',
            'guide'             => 'nullable|string|max:255',
            'guests'            => 'nullable|array',
            'waitlist'          => 'nullable|array',
        ];
    }
}
