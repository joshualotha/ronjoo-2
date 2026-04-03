<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::published()
            ->orderBy('name')
            ->get();

        return DestinationResource::collection($destinations);
    }

    public function show(Destination $destination)
    {
        $destination->load(['accommodations', 'faqs']);

        return new DestinationResource($destination);
    }
}
