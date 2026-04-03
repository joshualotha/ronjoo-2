<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItineraryDayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'day'               => $this->day,
            'title'             => $this->title,
            'location'          => $this->location,
            'description'       => $this->description,
            'activities'        => $this->activities,
            'meals'             => $this->meals,
            'mealsJson'         => $this->meals_json,
            'accommodation'     => $this->accommodation,
            'driveTime'         => $this->drive_time,
            'accommodationTier' => $this->accommodation_tier,
            'activityTags'      => $this->activity_tags,
            'notes'             => $this->notes,
        ];
    }
}
