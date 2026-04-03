<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    protected $fillable = [
        'slug', 'name', 'region', 'tagline', 'area_stat', 'area_label',
        'hero_image', 'portrait_image', 'pull_quote', 'status',
        'quick_facts', 'overview', 'wildlife', 'months', 'seasons',
        'experiences', 'gallery', 'travel_info', 'related_slugs',
    ];

    protected function casts(): array
    {
        return [
            'quick_facts'   => 'array',
            'overview'      => 'array',
            'wildlife'      => 'array',
            'months'        => 'array',
            'seasons'       => 'array',
            'experiences'   => 'array',
            'gallery'       => 'array',
            'travel_info'   => 'array',
            'related_slugs' => 'array',
        ];
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(DestinationAccommodation::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(DestinationFaq::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
