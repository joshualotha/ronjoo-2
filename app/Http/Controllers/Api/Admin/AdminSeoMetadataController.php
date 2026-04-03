<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use App\Http\Resources\SeoMetadataResource;
use Illuminate\Http\Request;

class AdminSeoMetadataController extends Controller
{
    public function index()
    {
        return SeoMetadataResource::collection(SeoMetadata::query()->latest()->paginate(50));
    }

    public function show(SeoMetadata $seoMetadata)
    {
        return new SeoMetadataResource($seoMetadata);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'path' => 'required|string|max:255|unique:seo_metadata,path',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'keywords' => 'nullable|string|max:255',
            'og_image' => 'nullable|string|max:255',
        ]);
        $instance = SeoMetadata::create($data);
        return (new SeoMetadataResource($instance))->response()->setStatusCode(201);
    }

    public function update(Request $request, SeoMetadata $seoMetadata)
    {
        $data = $request->validate([
            'path' => 'sometimes|string|max:255|unique:seo_metadata,path,' . $seoMetadata->id,
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:255',
            'keywords' => 'nullable|string|max:255',
            'og_image' => 'nullable|string|max:255',
        ]);
        $seoMetadata->update($data);
        return new SeoMetadataResource($seoMetadata);
    }

    public function destroy(SeoMetadata $seoMetadata)
    {
        $seoMetadata->delete();
        return response()->json(null, 204);
    }
}
