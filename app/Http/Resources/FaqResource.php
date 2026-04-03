<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'question'       => $this->question,
            'answer'         => $this->answer,
            'tags'           => $this->tags,
            'status'         => $this->status,
            'relatedGuide'   => $this->related_guide,
            'relatedSafari'  => $this->related_safari,
            'sortOrder'      => $this->sort_order,
            'faqCategoryId'  => $this->faq_category_id,
            'category'       => $this->whenLoaded('category', function () {
                return new FaqCategoryResource($this->category);
            }),
            'categoryName'   => $this->category?->name,
        ];
    }
}
