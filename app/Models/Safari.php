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

    /**
     * Calculate price per person based on group size
     *
     * @param int $groupSize Number of people (1-6)
     * @return int Price per person, or 0 if not found
     */
    public function calculateTieredPrice(int $groupSize): int
    {
        $priceTiers = $this->price_tiers ?? [];
        
        if (empty($priceTiers)) {
            // Fallback to base price
            return $this->price ?? 0;
        }

        // Handle different price_tiers formats
        // Format 1: Array of objects with label and price (current format)
        if (isset($priceTiers[0]) && is_array($priceTiers[0]) && isset($priceTiers[0]['label'])) {
            // Parse label to extract group size
            foreach ($priceTiers as $tier) {
                $label = strtolower($tier['label'] ?? '');
                $price = $tier['price'] ?? 0;
                
                // Check if label contains the group size
                // Examples: "1 person", "2 persons", "3 persons"
                if (preg_match('/^(\d+)\s*person/', $label, $matches)) {
                    $tierGroupSize = (int) $matches[1];
                    if ($tierGroupSize === $groupSize) {
                        return (int) $price;
                    }
                }
            }
            
            // If exact match not found, find the closest group size
            $closestPrice = 0;
            $closestDiff = PHP_INT_MAX;
            
            foreach ($priceTiers as $tier) {
                $label = strtolower($tier['label'] ?? '');
                $price = $tier['price'] ?? 0;
                
                if (preg_match('/^(\d+)\s*person/', $label, $matches)) {
                    $tierGroupSize = (int) $matches[1];
                    $diff = abs($tierGroupSize - $groupSize);
                    
                    // Prefer exact or smaller group sizes for pricing
                    if ($diff < $closestDiff || ($diff === $closestDiff && $tierGroupSize <= $groupSize)) {
                        $closestDiff = $diff;
                        $closestPrice = (int) $price;
                    }
                }
            }
            
            if ($closestPrice > 0) {
                return $closestPrice;
            }
        }
        
        // Format 2: Nested array with tier and season (legacy format from seeder)
        // Check if it's the nested format
        if (isset($priceTiers['Premium']) || isset($priceTiers['Superior']) || isset($priceTiers['Standard'])) {
            // Use Premium tier by default for group departures
            $tier = 'Premium';
            $season = 'High'; // Default to High season
            
            if (isset($priceTiers[$tier][$season])) {
                $seasonPrices = $priceTiers[$tier][$season];
                
                // Clamp group size to available price points (1-6)
                $clampedSize = max(1, min(6, $groupSize));
                
                // Try to get price for exact group size
                if (isset($seasonPrices[(string) $clampedSize])) {
                    return (int) $seasonPrices[(string) $clampedSize];
                }
                
                // Fallback: get the closest available size
                for ($i = $clampedSize; $i >= 1; $i--) {
                    if (isset($seasonPrices[(string) $i])) {
                        return (int) $seasonPrices[(string) $i];
                    }
                }
                
                for ($i = $clampedSize + 1; $i <= 6; $i++) {
                    if (isset($seasonPrices[(string) $i])) {
                        return (int) $seasonPrices[(string) $i];
                    }
                }
            }
        }
        
        // Fallback to base price
        return $this->price ?? 0;
    }

    /**
     * Determine season based on month
     *
     * @param \DateTimeInterface|string|null $date
     * @return string 'High' or 'Low'
     */
    public function determineSeason($date = null): string
    {
        if (!$date) {
            $date = now();
        } elseif (is_string($date)) {
            $date = \Carbon\Carbon::parse($date);
        }
        
        $month = $date instanceof \DateTimeInterface ? $date->format('n') : (int) date('n', strtotime($date));
        
        // High season: June-October & December-January
        // Low season: February-May & November
        $highSeasonMonths = [6, 7, 8, 9, 10, 12, 1]; // June-October, December-January
        
        return in_array($month, $highSeasonMonths) ? 'High' : 'Low';
    }
}
