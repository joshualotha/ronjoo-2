<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title', 'slug', 'category', 'author', 'published_date', 'status',
        'views', 'body', 'content', 'featured_image', 'excerpt', 'tags',
        'meta_title', 'meta_description', 'related_safari',
        'related_destination', 'show_cta',
    ];

    protected function casts(): array
    {
        return [
            'published_date' => 'date',
            'show_cta'       => 'boolean',
        ];
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
