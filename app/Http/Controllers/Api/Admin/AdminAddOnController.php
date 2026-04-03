<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AddOn;
use App\Http\Resources\AddOnResource;
use Illuminate\Http\Request;

class AdminAddOnController extends Controller
{
    public function index(Request $request)
    {
        $query = AddOn::query()->orderBy('name');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return AddOnResource::collection($query->get());
    }

    public function show(AddOn $addOn)
    {
        return new AddOnResource($addOn);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:add_ons,slug',
            'category'         => 'nullable|string|max:100',
            'filter_category'  => 'nullable|array',
            'price'            => 'nullable|string|max:100',
            'price_numeric'    => 'nullable|integer|min:0',
            'price_suffix'     => 'nullable|string|max:100',
            'duration'         => 'nullable|string|max:100',
            'location'         => 'nullable|string|max:255',
            'best_season'      => 'nullable|string|max:255',
            'group_size'       => 'nullable|string|max:100',
            'start_time'       => 'nullable|string|max:100',
            'tagline'          => 'nullable|string|max:500',
            'hero_images'      => 'nullable|array',
            'hero_images.*'    => 'string|url|max:1000',
            'overview_prose'   => 'nullable|array',
            'pull_quote'       => 'nullable|string|max:500',
            'included'         => 'nullable|array',
            'not_included'     => 'nullable|array',
            'timeline'         => 'nullable|array',
            'faqs'             => 'nullable|array',
            'practical_info'   => 'nullable|array',
            'related_slugs'    => 'nullable|array',
        ]);

        $addOn = AddOn::create($data);

        return (new AddOnResource($addOn))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, AddOn $addOn)
    {
        $data = $request->validate([
            'name'             => 'sometimes|required|string|max:255',
            'slug'             => 'sometimes|required|string|max:255|unique:add_ons,slug,' . $addOn->id,
            'category'         => 'nullable|string|max:100',
            'filter_category'  => 'nullable|array',
            'price'            => 'nullable|string|max:100',
            'price_numeric'    => 'nullable|integer|min:0',
            'price_suffix'     => 'nullable|string|max:100',
            'duration'         => 'nullable|string|max:100',
            'location'         => 'nullable|string|max:255',
            'best_season'      => 'nullable|string|max:255',
            'group_size'       => 'nullable|string|max:100',
            'start_time'       => 'nullable|string|max:100',
            'tagline'          => 'nullable|string|max:500',
            'hero_images'      => 'nullable|array',
            'hero_images.*'    => 'string|url|max:1000',
            'overview_prose'   => 'nullable|array',
            'pull_quote'       => 'nullable|string|max:500',
            'included'         => 'nullable|array',
            'not_included'     => 'nullable|array',
            'timeline'         => 'nullable|array',
            'faqs'             => 'nullable|array',
            'practical_info'   => 'nullable|array',
            'related_slugs'    => 'nullable|array',
        ]);

        $addOn->update($data);

        return new AddOnResource($addOn);
    }

    public function destroy(AddOn $addOn)
    {
        $addOn->delete();
        return response()->json(null, 204);
    }
}
