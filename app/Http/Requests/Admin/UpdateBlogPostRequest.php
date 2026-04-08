<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogPostRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Frontend uses camelCase (BlogPostResource output); backend validates snake_case.
        $map = [
            'publishedDate'      => 'published_date',
            'metaTitle'          => 'meta_title',
            'metaDescription'    => 'meta_description',
            'relatedSafari'      => 'related_safari',
            'relatedDestination' => 'related_destination',
            'showCta'            => 'show_cta',
            'featuredImage'      => 'featured_image',
        ];

        $merged = [];
        foreach ($map as $camel => $snake) {
            if ($this->has($camel) && !$this->has($snake)) {
                $merged[$snake] = $this->input($camel);
            }
        }

        // The site historically reads from `body` (seeders + BlogPostResource prefers `body`).
        // Accept edits from `content` by mirroring into `body` when present.
        if ($this->has('content') && !$this->has('body')) {
            $merged['body'] = $this->input('content');
        }

        if (!empty($merged)) {
            $this->merge($merged);
        }
    }

    public function rules(): array
    {
        return [
            'title'               => 'sometimes|string|max:255',
            'slug'                => 'sometimes|string|max:255|unique:blog_posts,slug,' . $this->route('blog_post')?->id,
            'category'            => 'sometimes|string|max:100',
            'author'              => 'nullable|string|max:100',
            'published_date'      => 'nullable|date',
            'status'              => 'sometimes|in:published,draft,scheduled',
            'body'                => 'nullable|string|max:50000',
            'content'             => 'nullable|string|max:50000',
            'excerpt'             => 'nullable|string|max:500',
            'tags'                => 'nullable|string|max:500',
            'meta_title'          => 'nullable|string|max:60',
            'meta_description'    => 'nullable|string|max:160',
            'related_safari'      => 'nullable|string|max:255',
            'related_destination' => 'nullable|string|max:255',
            'show_cta'            => 'boolean',
            'featured_image'      => 'nullable|string|max:255',
        ];
    }
}
