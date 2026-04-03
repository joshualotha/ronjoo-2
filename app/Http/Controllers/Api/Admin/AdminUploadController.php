<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminUploadController extends Controller
{
    /**
     * Upload one or more images.
     * Accepts multipart/form-data with field "images[]" (array of files).
     * Returns an array of public URLs.
     */
    public function store(Request $request)
    {
        $request->validate([
            'images'   => 'required|array|max:10',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:5120', // 5 MB
            'folder'   => 'nullable|string|max:100',
        ]);

        $folder = $request->input('folder', 'uploads');
        $urls = [];

        foreach ($request->file('images') as $file) {
            $path = $file->store($folder, 'public');
            $urls[] = asset('storage/' . $path);
        }

        return response()->json(['urls' => $urls], 201);
    }

    /**
     * Delete an uploaded image by its storage path.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string|max:500',
        ]);

        // Extract relative path from full URL
        $url = $request->input('path');
        $relative = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));

        if ($relative && Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
            return response()->json(['deleted' => true]);
        }

        return response()->json(['deleted' => false, 'message' => 'File not found'], 404);
    }
}
