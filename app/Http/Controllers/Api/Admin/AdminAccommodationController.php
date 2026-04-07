<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminAccommodationController extends Controller
{
    public function index()
    {
        $accommodations = Accommodation::withCount(['destinations', 'safaris'])
            ->orderBy('name')
            ->get();

        return response()->json($accommodations);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:accommodations,name',
            'location'    => 'nullable|string|max:255',
            'tier'        => 'nullable|string|max:50',
            'stars'       => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string|max:5000',
            'image'       => 'nullable|string|max:500',
            'website'     => 'nullable|string|max:500',
            'amenities'   => 'nullable|array',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $accommodation = Accommodation::create($data);

        return response()->json($accommodation->loadCount(['destinations', 'safaris']), 201);
    }

    public function show(Accommodation $accommodation)
    {
        return response()->json($accommodation->loadCount(['destinations', 'safaris']));
    }

    public function update(Request $request, Accommodation $accommodation)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255|unique:accommodations,name,' . $accommodation->id,
            'location'    => 'nullable|string|max:255',
            'tier'        => 'nullable|string|max:50',
            'stars'       => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string|max:5000',
            'image'       => 'nullable|string|max:500',
            'website'     => 'nullable|string|max:500',
            'amenities'   => 'nullable|array',
        ]);

        if (isset($data['name']) && $data['name'] !== $accommodation->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        $accommodation->update($data);

        return response()->json($accommodation->loadCount(['destinations', 'safaris']));
    }

    public function destroy(Accommodation $accommodation)
    {
        $destCount = $accommodation->destinations()->count();
        $safCount  = $accommodation->safaris()->count();

        if ($destCount > 0 || $safCount > 0) {
            return response()->json([
                'message' => "Cannot delete \"{$accommodation->name}\" — linked to {$destCount} destination(s) and {$safCount} safari(s). Remove associations first.",
            ], 422);
        }

        $accommodation->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
