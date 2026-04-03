<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationAccommodation extends Model
{
    protected $fillable = [
        'destination_id', 'name', 'tier', 'stars', 'description',
        'amenities', 'image',
    ];

    protected function casts(): array
    {
        return [
            'amenities' => 'array',
        ];
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}
