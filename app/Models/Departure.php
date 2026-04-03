<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Departure extends Model
{
    protected $fillable = [
        'safari_id',
        'safari_name',
        'start_date',
        'end_date',
        'total_seats',
        'booked_seats',
        'status',
        'revenue',
        'projected_revenue',
        'guide',
        'guests',
        'waitlist',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'guests' => 'array',
            'waitlist' => 'array',
        ];
    }

    protected $appends = [
        'date_range',
        'seats_taken',
        'price_per_person',
        'nationalities',
    ];

    public function safari(): BelongsTo
    {
        return $this->belongsTo(Safari::class);
    }

    public function getAvailableSeatsAttribute(): int
    {
        return $this->total_seats - $this->booked_seats;
    }

    public function getDateRangeAttribute(): string
    {
        $start = $this->start_date instanceof \DateTimeInterface
            ? $this->start_date->format('M d, Y')
            : \Carbon\Carbon::parse($this->start_date)->format('M d, Y');

        $end = $this->end_date instanceof \DateTimeInterface
            ? $this->end_date->format('M d, Y')
            : \Carbon\Carbon::parse($this->end_date)->format('M d, Y');

        return "{$start} – {$end}";
    }

    public function getSeatsTakenAttribute(): int
    {
        return $this->booked_seats;
    }

    public function getPricePerPersonAttribute(): int
    {
        if ($this->safari) {
            return $this->safari->price ?? 0;
        }
        // Fallback: calculate from revenue if safari not loaded
        if ($this->booked_seats > 0 && $this->revenue > 0) {
            return (int) round($this->revenue / $this->booked_seats);
        }
        return 0;
    }

    public function getNationalitiesAttribute(): array
    {
        if (empty($this->guests) || !is_array($this->guests)) {
            return [];
        }

        $nationalities = [];
        foreach ($this->guests as $guest) {
            if (isset($guest['country']) && !in_array($guest['country'], $nationalities)) {
                $nationalities[] = $guest['country'];
            }
        }

        return $nationalities;
    }
}
