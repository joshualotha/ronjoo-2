<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    protected $fillable = [
        'type',
        'message',
        'is_read',
        'related_id',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }
}
