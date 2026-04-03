<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'email'     => $this->email,
            'name'      => $this->name,
            'country'   => $this->country,
            'source'    => $this->source,
            'status'    => $this->status,
            'dateSubscribed' => $this->date_subscribed ?? $this->created_at?->toDateString(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
