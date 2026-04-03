<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'guestName'      => $this->guest_name,
            'email'          => $this->email,
            'whatsapp'       => $this->whatsapp,
            'country'        => $this->country,
            'countryFlag'    => $this->country_flag,
            'safariInterest' => $this->safari_interest,
            'preferredDates' => $this->preferred_dates,
            'travelers'      => $this->travelers,
            'budget'         => $this->budget,
            'message'        => $this->message,
            'status'         => $this->status,
            'isRead'         => $this->is_read,
            'source'         => $this->source,
            'replies'        => $this->replies,
            'tags'           => $this->tags,
            'receivedAt'     => $this->received_at?->toIso8601String() ?? $this->created_at?->toIso8601String(),
            'createdAt'      => $this->created_at?->toIso8601String(),
        ];
    }
}
