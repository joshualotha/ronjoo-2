<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Safari extends Model
{
    protected $fillable = [
        'name', 'slug', 'type', 'duration', 'days', 'destinations', 'price',
        'image', 'hero_images', 'category', 'description', 'highlights',
        'inclusions', 'exclusions', 'price_tiers', 'wildlife', 'faqs',
        'safari_add_ons', 'related_slugs', 'itinerary', 'meta_title',
        'meta_description', 'focus_keyword', 'group_size', 'difficulty',
        'best_season', 'best_season_months', 'max_group_size',
        'short_description', 'overview', 'overview_prose', 'status',
        'featured',
    ];

    protected function casts(): array
    {
        return [
            'destinations'      => 'array',
            'hero_images'       => 'array',
            'category'          => 'array',
            'highlights'        => 'array',
            'inclusions'        => 'array',
            'exclusions'        => 'array',
            'price_tiers'       => 'array',
            'wildlife'          => 'array',
            'faqs'              => 'array',
            'safari_add_ons'    => 'array',
            'related_slugs'     => 'array',
            'itinerary'         => 'array',
            'best_season'       => 'array',
            'best_season_months'=> 'array',
            'overview_prose'    => 'array',
            'featured'          => 'boolean',
            'price'             => 'integer',
        ];
    }

    public function itineraryDays(): HasMany
    {
        return $this->hasMany(ItineraryDay::class)->orderBy('day');
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(SafariAccommodation::class);
    }

    public function accommodationsList(): BelongsToMany
    {
        return $this->belongsToMany(Accommodation::class, 'accommodation_safari')
            ->withPivot('nights', 'sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function departures(): HasMany
    {
        return $this->hasMany(Departure::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'safari_name', 'name');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function wildlifeAnimals(): BelongsToMany
    {
        return $this->belongsToMany(Wildlife::class, 'safari_wildlife')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
