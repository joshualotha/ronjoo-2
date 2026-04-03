<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SafariAccommodation extends Model
{
    protected $fillable = [
        'safari_id', 'name', 'nights', 'tier', 'image',
        'rating', 'description', 'amenities', 'website',
    ];

    protected function casts(): array
    {
        return [
            'amenities' => 'array',
        ];
    }

    public function safari(): BelongsTo
    {
        return $this->belongsTo(Safari::class);
    }
}
