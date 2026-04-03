<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::whereIn('status', ['published', 'featured'])
            ->orderByDesc('submitted_date')
            ->get();

        return ReviewResource::collection($reviews);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name'       => 'required|string|max:255',
            'country'          => 'nullable|string|max:100',
            'country_flag'     => 'nullable|string|max:10',
            'rating'           => 'required|integer|min:1|max:5',
            'safari_name'      => 'nullable|string|max:255',
            'safari_date'      => 'nullable|date',
            'full_text'        => 'required|string|max:10000',
            'category_ratings' => 'nullable|array',
            'category_ratings.guide'         => 'integer|min:1|max:5',
            'category_ratings.wildlife'      => 'integer|min:1|max:5',
            'category_ratings.accommodation' => 'integer|min:1|max:5',
            'category_ratings.value'         => 'integer|min:1|max:5',
        ]);

        $data['status'] = 'pending';
        $data['submitted_date'] = now()->toDateString();
        $data['excerpt'] = mb_substr($data['full_text'], 0, 300);

        $review = Review::create($data);

        // Return the created review (still pending); the public list endpoint won't show it.
        return (new ReviewResource($review))
            ->response()
            ->setStatusCode(201);
    }
}
