<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->string('author')->nullable();
            $table->date('published_date')->nullable();
            $table->string('status')->default('draft');
            $table->integer('views')->default(0);
            $table->text('body')->nullable();
            $table->text('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('excerpt', 500)->nullable();
            $table->string('tags')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('related_safari')->nullable();
            $table->string('related_destination')->nullable();
            $table->boolean('show_cta')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
