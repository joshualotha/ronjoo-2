<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('safaris', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->nullable();
            $table->integer('duration')->nullable();
            $table->integer('days')->nullable();
            $table->json('destinations')->nullable();
            $table->integer('price')->nullable();
            $table->string('image')->nullable();
            $table->json('hero_images')->nullable();
            $table->json('category')->nullable();
            $table->text('description')->nullable();
            $table->json('highlights')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('price_tiers')->nullable();
            $table->json('wildlife')->nullable();
            $table->json('faqs')->nullable();
            $table->json('safari_add_ons')->nullable();
            $table->json('related_slugs')->nullable();
            $table->json('itinerary')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('focus_keyword')->nullable();
            $table->string('group_size')->nullable();
            $table->string('difficulty')->nullable();
            $table->string('best_season')->nullable();
            $table->json('best_season_months')->nullable();
            $table->integer('max_group_size')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->text('overview')->nullable();
            $table->json('overview_prose')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('featured')->default(false);
            $table->integer('bookings_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safaris');
    }
};
