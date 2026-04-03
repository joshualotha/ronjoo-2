<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqCategoryResource;
use App\Models\FaqCategory;

class FaqController extends Controller
{
    public function index()
    {
        $categories = FaqCategory::with(['faqs' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->get();

        return FaqCategoryResource::collection($categories);
    }
}
