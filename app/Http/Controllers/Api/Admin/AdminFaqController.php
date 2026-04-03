<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\FaqCategory;
use App\Http\Requests\Admin\StoreFaqRequest;
use App\Http\Requests\Admin\UpdateFaqRequest;
use App\Http\Resources\FaqResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminFaqController extends Controller
{
    /**
     * Return all FAQs with their category relationship.
     */
    public function index()
    {
        $faqs = Faq::with('category')
            ->orderBy('sort_order')
            ->get();

        return FaqResource::collection($faqs);
    }

    public function show(Faq $faq)
    {
        $faq->load('category');
        return new FaqResource($faq);
    }

    public function store(StoreFaqRequest $request)
    {
        $data = $request->validated();

        // Auto sort_order to end of category
        if (!isset($data['sort_order'])) {
            $data['sort_order'] = Faq::where('faq_category_id', $data['faq_category_id'])->max('sort_order') + 1;
        }

        $faq = Faq::create($data);
        $faq->load('category');
        return (new FaqResource($faq))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $faq->update($request->validated());
        $faq->load('category');
        return new FaqResource($faq);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return response()->json(null, 204);
    }

    /**
     * Create a new FAQ category.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:faq_categories,name',
        ]);

        $category = FaqCategory::create([
            'name'       => $request->input('name'),
            'slug'       => Str::slug($request->input('name')),
            'sort_order' => FaqCategory::max('sort_order') + 1,
        ]);

        return response()->json($category, 201);
    }
}
