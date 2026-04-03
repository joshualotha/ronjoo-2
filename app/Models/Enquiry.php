<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $fillable = [
        'guest_name', 'email', 'whatsapp', 'country', 'country_flag',
        'safari_interest', 'preferred_dates', 'travelers', 'budget',
        'message', 'status', 'is_read', 'received_at', 'source', 'replies', 'tags',
    ];

    protected function casts(): array
    {
        return [
            'replies'     => 'array',
            'tags'        => 'array',
            'is_read'     => 'boolean',
            'received_at' => 'datetime',
        ];
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}
