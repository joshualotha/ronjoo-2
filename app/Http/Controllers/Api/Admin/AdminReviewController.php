<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Requests\Admin\StoreReviewRequest;
use App\Http\Requests\Admin\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query()->orderByDesc('submitted_date');

        if ($tab = $request->input('tab')) {
            match ($tab) {
                'pending'   => $query->where('status', 'pending'),
                'published' => $query->where('status', 'published'),
                'hidden'    => $query->where('status', 'hidden'),
                'featured'  => $query->where('status', 'featured'),
                default     => null,
            };
        }

        return ReviewResource::collection($query->paginate(50));
    }

    public function show(Review $review)
    {
        return new ReviewResource($review);
    }

    public function store(StoreReviewRequest $request)
    {
        $data = $request->validated();
        $data['submitted_date'] = $data['submitted_date'] ?? now()->toDateString();
        if (empty($data['excerpt'])) {
            $data['excerpt'] = substr($data['full_text'], 0, 100);
        }

        $review = Review::create($data);
        return (new ReviewResource($review))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        $data = $request->validated();
        if (isset($data['full_text']) && empty($data['excerpt'])) {
            $data['excerpt'] = substr($data['full_text'], 0, 100);
        }

        $review->update($data);
        return new ReviewResource($review);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(null, 204);
    }

    /**
     * Quick status update (approve, feature, hide).
     */
    public function updateStatus(Request $request, Review $review)
    {
        $request->validate(['status' => 'required|in:pending,published,hidden,featured']);
        $review->update(['status' => $request->input('status')]);
        return new ReviewResource($review);
    }

    /**
     * Save owner response to a review.
     */
    public function saveResponse(Request $request, Review $review)
    {
        $request->validate(['owner_response' => 'required|string|max:5000']);
        $review->update(['owner_response' => $request->input('owner_response')]);
        return new ReviewResource($review);
    }
}
