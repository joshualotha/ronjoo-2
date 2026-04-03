<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'ref', 'guest_name', 'email', 'whatsapp', 'country',
        'safari_id', 'safari_name', 'departure_date', 'return_date',
        'pax', 'children', 'total_amount', 'deposit_paid', 'balance_due',
        'status', 'payment_status', 'group_type', 'guide', 'notes',
        'accommodation_tier',
    ];

    protected function casts(): array
    {
        return [
            'departure_date' => 'date',
            'return_date'    => 'date',
            'notes'          => 'array',
        ];
    }

    public function safari(): BelongsTo
    {
        return $this->belongsTo(Safari::class);
    }
}
