<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Wildlife extends Model
{
    protected $table = 'wildlife';

    protected $fillable = [
        'name', 'slug', 'category', 'image', 'fact',
        'description', 'conservation_status',
    ];

    protected static function booted(): void
    {
        static::creating(function (Wildlife $wildlife) {
            if (empty($wildlife->slug)) {
                $wildlife->slug = Str::slug($wildlife->name);
            }
        });

        static::updating(function (Wildlife $wildlife) {
            if ($wildlife->isDirty('name') && !$wildlife->isDirty('slug')) {
                $wildlife->slug = Str::slug($wildlife->name);
            }
        });
    }

    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class, 'destination_wildlife')
            ->withPivot('likelihood', 'custom_fact', 'sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function safaris(): BelongsToMany
    {
        return $this->belongsToMany(Safari::class, 'safari_wildlife')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
