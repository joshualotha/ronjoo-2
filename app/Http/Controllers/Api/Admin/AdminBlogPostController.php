<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Http\Resources\BlogPostResource;
use Illuminate\Http\Request;

class AdminBlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::query()->orderByDesc('created_at');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        return BlogPostResource::collection($query->get());
    }

    public function show(BlogPost $blogPost)
    {
        return new BlogPostResource($blogPost);
    }

    public function store(StoreBlogPostRequest $request)
    {
        $data = $request->validated();
        if (($data['status'] ?? null) === 'published' && empty($data['published_date'] ?? null)) {
            $data['published_date'] = now()->toDateString();
        }

        // Prefer storing editor content in `body` (used by seeders + resource).
        if (isset($data['content']) && (!isset($data['body']) || $data['body'] === null)) {
            $data['body'] = $data['content'];
        }

        $post = BlogPost::create($data);
        return (new BlogPostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost)
    {
        $data = $request->validated();
        if (isset($data['status']) && $data['status'] === 'published' && !$blogPost->published_date) {
            $data['published_date'] = now()->toDateString();
        }

        // Prefer storing editor content in `body` (used by seeders + resource).
        if (isset($data['content']) && (!isset($data['body']) || $data['body'] === null)) {
            $data['body'] = $data['content'];
        }

        $blogPost->update($data);
        return new BlogPostResource($blogPost);
    }

    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();
        return response()->json(null, 204);
    }
}
