<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Accommodation extends Model
{
    protected $fillable = [
        'name', 'slug', 'location', 'tier', 'stars',
        'description', 'image', 'website', 'amenities',
    ];

    protected function casts(): array
    {
        return [
            'amenities' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Accommodation $accommodation) {
            if (empty($accommodation->slug)) {
                $accommodation->slug = Str::slug($accommodation->name);
            }
        });
    }

    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class, 'accommodation_destination')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function safaris(): BelongsToMany
    {
        return $this->belongsToMany(Safari::class, 'accommodation_safari')
            ->withPivot('nights', 'sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }
}
