<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelGuide extends Model
{
    protected $fillable = [
        'slug', 'title', 'category', 'guide_type', 'description', 'read_time',
        'updated_date', 'hero_image', 'popular', 'toc', 'content',
        'related_slugs', 'status', 'excerpt', 'checklist_items',
        'meta_title', 'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'toc'             => 'array',
            'content'         => 'array',
            'related_slugs'   => 'array',
            'checklist_items' => 'array',
            'popular'         => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
