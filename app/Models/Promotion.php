<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'valid_from',
        'valid_until',
        'usage_limit',
        'times_used',
        'status',
    ];
}
