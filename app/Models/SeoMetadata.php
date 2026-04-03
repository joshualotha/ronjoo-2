<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    protected $fillable = [
        'path',
        'title',
        'description',
        'keywords',
        'og_image',
    ];
}
