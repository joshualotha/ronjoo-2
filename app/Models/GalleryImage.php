<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = [
        'src',
        'alt',
        'caption',
        'tags',
        'category',
        'destination',
        'safari',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }
}

