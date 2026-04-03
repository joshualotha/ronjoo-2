<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TravelGuideResource;
use App\Models\TravelGuide;

class TravelGuideController extends Controller
{
    public function index()
    {
        return TravelGuideResource::collection(TravelGuide::orderBy('title')->get());
    }

    public function show(TravelGuide $travelGuide)
    {
        return new TravelGuideResource($travelGuide);
    }
}
