<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TravelGuide;
use App\Http\Requests\Admin\StoreTravelGuideRequest;
use App\Http\Requests\Admin\UpdateTravelGuideRequest;
use App\Http\Resources\TravelGuideResource;
use Illuminate\Http\Request;

class AdminTravelGuideController extends Controller
{
    public function index(Request $request)
    {
        $query = TravelGuide::query()->orderByDesc('updated_at');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        return TravelGuideResource::collection($query->get());
    }

    public function show(TravelGuide $travelGuide)
    {
        return new TravelGuideResource($travelGuide);
    }

    public function store(StoreTravelGuideRequest $request)
    {
        $guide = TravelGuide::create($request->validated());
        return (new TravelGuideResource($guide))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTravelGuideRequest $request, TravelGuide $travelGuide)
    {
        $travelGuide->update($request->validated());
        return new TravelGuideResource($travelGuide);
    }

    public function destroy(TravelGuide $travelGuide)
    {
        $travelGuide->delete();
        return response()->json(null, 204);
    }
}
