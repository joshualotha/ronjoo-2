<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SafariResource;
use App\Models\Safari;

class SafariController extends Controller
{
    public function index()
    {
        $safaris = Safari::published()
            ->orderByDesc('featured')
            ->orderBy('name')
            ->get();

        return SafariResource::collection($safaris);
    }

    public function show(Safari $safari)
    {
        $safari->load([
            'itineraryDays',
            'accommodations',
            'departures' => fn ($q) => $q->where('status', 'open'),
            'reviews' => fn ($q) => $q->where('status', 'approved'),
        ]);

        return new SafariResource($safari);
    }
}
