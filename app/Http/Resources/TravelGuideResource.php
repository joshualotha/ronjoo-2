<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelGuideResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $apiContent = [];
        $rawContent = $this->content ?? [];
        
        foreach ($rawContent as $block) {
            $type = $block['type'] ?? 'paragraph';
            if ($type === 'text') $type = 'paragraph';

            $apiContent[] = [
                'type' => $type,
                'text' => $block['body'] ?? $block['text'] ?? '',
                'items' => $block['items'] ?? [],
            ];
        }

        if ($this->guide_type === 'checklist' && !empty($this->checklist_items)) {
            $apiContent[] = [
                'type' => 'checklist',
                'items' => $this->checklist_items,
            ];
        }

        return [
            'id'           => $this->id,
            'slug'         => $this->slug,
            'title'        => $this->title,
            'category'     => $this->category,
            'description'  => $this->description,
            'readTime'     => $this->read_time,
            'updatedDate'  => $this->updated_date,
            'heroImage'    => $this->hero_image,
            'popular'      => $this->popular,
            'toc'          => $this->toc ?? [],
            'content'      => $apiContent,
            'relatedSlugs' => $this->related_slugs ?? [],
            'guideType'    => $this->guide_type ?? 'standard',
            'checklistItems' => $this->checklist_items ?? [],
            'status'       => $this->status,
            'excerpt'      => $this->excerpt ?? '',
            'metaTitle'    => $this->meta_title,
            'metaDescription' => $this->meta_description,
        ];
    }
}
