<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;

class BlogPostController extends Controller
{
    public function index()
    {
        return BlogPostResource::collection(
            BlogPost::published()->orderByDesc('published_date')->get()
        );
    }

    public function show(BlogPost $blogPost)
    {
        return new BlogPostResource($blogPost);
    }
}
