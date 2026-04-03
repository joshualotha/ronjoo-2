<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name', 'role', 'experience', 'languages', 'specializations',
        'show_on_website', 'photo', 'bio',
    ];

    protected function casts(): array
    {
        return [
            'languages'       => 'array',
            'specializations' => 'array',
            'show_on_website' => 'boolean',
        ];
    }

    public function scopeVisible($query)
    {
        return $query->where('show_on_website', true);
    }
}
