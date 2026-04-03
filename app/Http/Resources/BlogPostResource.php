<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'slug'               => $this->slug,
            'title'              => $this->title,
            'category'           => $this->category,
            'author'             => $this->author,
            'publishedDate'      => $this->published_date?->toDateString(),
            'status'             => $this->status,
            'views'              => $this->views ?? 0,
            'body'               => $this->body,
            'content'            => $this->body ?? $this->content,
            'featuredImage'      => $this->featured_image,
            'excerpt'            => $this->excerpt,
            'tags'               => $this->tags,
            'metaTitle'          => $this->meta_title,
            'metaDescription'    => $this->meta_description,
            'relatedSafari'      => $this->related_safari,
            'relatedDestination' => $this->related_destination,
            'showCta'            => $this->show_cta,
        ];
    }
}
