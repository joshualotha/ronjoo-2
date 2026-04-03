<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Waitlist extends Model
{
    protected $fillable = [
        'guest_name',
        'email',
        'phone',
        'departure_id',
        'pax',
        'notes',
        'status',
    ];

    public function departure()
    {
        return $this->belongsTo(Departure::class);
    }
}
