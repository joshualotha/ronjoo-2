<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartureRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'safari_name'       => 'required|string|max:255',
            'start_date'        => 'required|date',
            'end_date'          => 'required|date|after:start_date',
            'total_seats'       => 'required|integer|min:1|max:50',
            'booked_seats'      => 'nullable|integer|min:0',
            'status'            => 'required|in:open,full,closed,cancelled,completed',
            'revenue'           => 'nullable|integer|min:0',
            'projected_revenue' => 'nullable|integer|min:0',
            'guide'             => 'nullable|string|max:255',
            'guests'            => 'nullable|array',
            'guests.*.name'         => 'required|string|max:255',
            'guests.*.country'      => 'nullable|string|max:10',
            'guests.*.booking_ref'  => 'nullable|string|max:20',
            'guests.*.amount_paid'  => 'nullable|integer|min:0',
            'guests.*.balance'      => 'nullable|integer|min:0',
            'waitlist'          => 'nullable|array',
            'waitlist.*.name'       => 'required|string|max:255',
            'waitlist.*.email'      => 'required|email',
            'waitlist.*.whatsapp'   => 'nullable|string|max:30',
        ];
    }
}
