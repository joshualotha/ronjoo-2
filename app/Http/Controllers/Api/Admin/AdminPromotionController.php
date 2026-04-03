<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Http\Resources\PromotionResource;
use Illuminate\Http\Request;

class AdminPromotionController extends Controller
{
    public function index()
    {
        return PromotionResource::collection(Promotion::latest()->paginate(50));
    }

    public function show(Promotion $promotion)
    {
        return new PromotionResource($promotion);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:100|unique:promotions,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
        ]);
        $instance = Promotion::create($data);
        return (new PromotionResource($instance))->response()->setStatusCode(201);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $data = $request->validate([
            'code' => 'sometimes|string|max:100|unique:promotions,code,' . $promotion->id,
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'sometimes|in:percentage,fixed',
            'discount_value' => 'sometimes|numeric|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
        ]);
        $promotion->update($data);
        return new PromotionResource($promotion);
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return response()->json(null, 204);
    }
}
