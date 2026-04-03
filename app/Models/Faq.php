<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faq extends Model
{
    protected $fillable = [
        'faq_category_id', 'question', 'answer', 'tags', 'status',
        'related_guide', 'related_safari', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tags'           => 'array',
            'related_guide'  => 'array',
            'related_safari' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FaqCategory::class, 'faq_category_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
