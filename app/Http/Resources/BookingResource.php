<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'ref'              => $this->ref,
            'guestName'        => $this->guest_name,
            'email'            => $this->email,
            'whatsapp'         => $this->whatsapp,
            'country'          => $this->country,
            'safariId'         => $this->safari_id,
            'safariName'       => $this->safari_name,
            'departureDate'    => $this->departure_date?->toDateString(),
            'returnDate'       => $this->return_date?->toDateString(),
            'pax'              => $this->pax ?? 0,
            'children'         => $this->children ?? 0,
            'totalAmount'      => $this->total_amount ?? 0,
            'depositPaid'      => $this->deposit_paid ?? 0,
            'balanceDue'       => $this->balance_due ?? 0,
            'status'           => $this->status,
            'paymentStatus'    => $this->payment_status,
            'groupType'        => $this->group_type,
            'guide'            => $this->guide,
            'notes'            => $this->notes,
            'accommodationTier'=> $this->accommodation_tier,
            'createdAt'        => $this->created_at?->toIso8601String(),
        ];
    }
}
