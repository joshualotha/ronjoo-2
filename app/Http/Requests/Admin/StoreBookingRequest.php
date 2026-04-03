<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Frontend uses camelCase (BookingResource output); backend validates snake_case.
        $map = [
            'guestName'         => 'guest_name',
            'safariName'        => 'safari_name',
            'departureDate'     => 'departure_date',
            'returnDate'        => 'return_date',
            'totalAmount'       => 'total_amount',
            'depositPaid'       => 'deposit_paid',
            'balanceDue'        => 'balance_due',
            'paymentStatus'     => 'payment_status',
            'groupType'         => 'group_type',
            'accommodationTier' => 'accommodation_tier',
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
    }

    public function rules(): array
    {
        return [
            'ref'                => 'required|string|max:20|unique:bookings,ref',
            'guest_name'         => 'required|string|max:255',
            'email'              => 'required|email|max:255',
            'whatsapp'           => 'nullable|string|max:30',
            'country'            => 'nullable|string|max:100',
            'safari_name'        => 'nullable|string|max:255',
            'departure_date'     => 'nullable|date',
            'return_date'        => 'nullable|date|after_or_equal:departure_date',
            'pax'                => 'required|integer|min:1|max:20',
            'children'           => 'integer|min:0|max:10',
            'total_amount'       => 'required|integer|min:0',
            'deposit_paid'       => 'integer|min:0',
            'balance_due'        => 'integer|min:0',
            'status'             => 'required|in:confirmed,pending,cancelled,completed,deposit-paid,fully-paid',
            'payment_status'     => 'required|in:pending,deposit-paid,fully-paid',
            'group_type'         => 'required|in:private,group',
            'guide'              => 'nullable|string|max:255',
            'notes'              => 'nullable|array',
            'notes.*'            => 'string|max:500',
            'accommodation_tier' => 'nullable|string|max:50',
        ];
    }
}
