<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    protected $fillable = [
        'email', 'name', 'country', 'source', 'status', 'date_subscribed',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
