<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'guest_name', 'country', 'country_flag', 'rating', 'safari_name',
        'safari_date', 'submitted_date', 'status', 'excerpt', 'full_text',
        'owner_response', 'category_ratings',
    ];

    protected function casts(): array
    {
        return [
            'category_ratings' => 'array',
            'safari_date'      => 'date',
            'submitted_date'   => 'date',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('status', 'featured');
    }
}
