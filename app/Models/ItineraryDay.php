<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItineraryDay extends Model
{
    protected $fillable = [
        'safari_id', 'day', 'title', 'location', 'description',
        'activities', 'meals', 'meals_json', 'accommodation',
        'drive_time', 'accommodation_tier', 'activity_tags', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'activities'    => 'array',
            'meals_json'    => 'array',
            'activity_tags' => 'array',
        ];
    }

    public function safari(): BelongsTo
    {
        return $this->belongsTo(Safari::class);
    }
}
