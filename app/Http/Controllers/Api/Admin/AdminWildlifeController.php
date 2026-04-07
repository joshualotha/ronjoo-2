<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WildlifeResource;
use App\Models\Wildlife;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminWildlifeController extends Controller
{
    public function index(Request $request)
    {
        $query = Wildlife::withCount(['destinations', 'safaris']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return WildlifeResource::collection(
            $query->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                => 'required|string|max:255|unique:wildlife,name',
            'category'            => 'nullable|string|max:100',
            'image'               => 'nullable|string|max:2048',
            'fact'                => 'nullable|string',
            'description'         => 'nullable|string',
            'conservation_status' => 'nullable|string|max:100',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $wildlife = Wildlife::create($data);

        return (new WildlifeResource($wildlife->loadCount(['destinations', 'safaris'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Wildlife $wildlife)
    {
        $wildlife->loadCount(['destinations', 'safaris']);
        $wildlife->load(['destinations:id,name,slug', 'safaris:id,name,slug']);

        return new WildlifeResource($wildlife);
    }

    public function update(Request $request, Wildlife $wildlife)
    {
        $data = $request->validate([
            'name'                => 'sometimes|string|max:255|unique:wildlife,name,' . $wildlife->id,
            'category'            => 'nullable|string|max:100',
            'image'               => 'nullable|string|max:2048',
            'fact'                => 'nullable|string',
            'description'         => 'nullable|string',
            'conservation_status' => 'nullable|string|max:100',
        ]);

        if (isset($data['name']) && $data['name'] !== $wildlife->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        $wildlife->update($data);

        return new WildlifeResource($wildlife->loadCount(['destinations', 'safaris']));
    }

    public function destroy(Wildlife $wildlife)
    {
        $destinationsCount = $wildlife->destinations()->count();
        $safarisCount = $wildlife->safaris()->count();

        if ($destinationsCount > 0 || $safarisCount > 0) {
            return response()->json([
                'message' => "Cannot delete '{$wildlife->name}' — it is linked to {$destinationsCount} destination(s) and {$safarisCount} safari(s). Remove the associations first.",
            ], 422);
        }

        $wildlife->delete();

        return response()->json(null, 204);
    }
}
