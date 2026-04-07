<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryImageRequest;
use App\Http\Requests\Admin\UpdateGalleryImageRequest;
use App\Http\Resources\GalleryImageResource;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

class AdminGalleryImageController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::query()->orderByDesc('created_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('alt', 'like', "%{$search}%")
                  ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($request->is('api/kijani-desk/*')) {
            return GalleryImageResource::collection($query->paginate(60));
        }

        return GalleryImageResource::collection($query->get());
    }

    public function show(GalleryImage $galleryImage)
    {
        return new GalleryImageResource($galleryImage);
    }

    public function store(StoreGalleryImageRequest $request)
    {
        $img = GalleryImage::create($request->validated());
        return (new GalleryImageResource($img))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateGalleryImageRequest $request, GalleryImage $galleryImage)
    {
        $galleryImage->update($request->validated());
        return new GalleryImageResource($galleryImage);
    }

    public function destroy(GalleryImage $galleryImage)
    {
        $galleryImage->delete();
        return response()->json(null, 204);
    }
}

