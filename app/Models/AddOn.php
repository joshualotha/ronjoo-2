<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddOn extends Model
{
    protected $fillable = [
        'slug', 'name', 'category', 'filter_category', 'price',
        'price_numeric', 'price_suffix', 'duration', 'location',
        'best_season', 'group_size', 'start_time', 'tagline',
        'hero_images', 'overview_prose', 'pull_quote', 'included',
        'not_included', 'timeline', 'faqs', 'practical_info',
        'related_slugs',
    ];

    protected function casts(): array
    {
        return [
            'filter_category' => 'array',
            'hero_images'     => 'array',
            'overview_prose'  => 'array',
            'included'        => 'array',
            'not_included'    => 'array',
            'timeline'        => 'array',
            'faqs'            => 'array',
            'practical_info'  => 'array',
            'related_slugs'   => 'array',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
