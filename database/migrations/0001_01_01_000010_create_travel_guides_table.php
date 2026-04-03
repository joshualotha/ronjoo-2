<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_guides', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category')->nullable();
            $table->string('guide_type')->nullable();
            $table->text('description')->nullable();
            $table->string('read_time')->nullable();
            $table->string('updated_date')->nullable();
            $table->string('hero_image')->nullable();
            $table->boolean('popular')->default(false);
            $table->json('toc')->nullable();
            $table->json('content')->nullable();
            $table->json('related_slugs')->nullable();
            $table->string('status')->default('draft');
            $table->text('excerpt')->nullable();
            $table->json('checklist_items')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_guides');
    }
};
