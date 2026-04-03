<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicDepartureResource;
use App\Models\Departure;

class DepartureController extends Controller
{
    public function index()
    {
        $departures = Departure::with('safari:id,slug,name,destinations')
            ->where('status', 'open')
            ->orderBy('start_date')
            ->get();

        return PublicDepartureResource::collection($departures);
    }
}
