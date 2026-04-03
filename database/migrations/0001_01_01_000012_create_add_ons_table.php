<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('add_ons', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category')->nullable();
            $table->json('filter_category')->nullable();
            $table->string('price')->nullable();
            $table->integer('price_numeric')->nullable();
            $table->string('price_suffix')->nullable();
            $table->string('duration')->nullable();
            $table->string('location')->nullable();
            $table->string('best_season')->nullable();
            $table->string('group_size')->nullable();
            $table->string('start_time')->nullable();
            $table->string('tagline')->nullable();
            $table->json('hero_images')->nullable();
            $table->json('overview_prose')->nullable();
            $table->text('pull_quote')->nullable();
            $table->json('included')->nullable();
            $table->json('not_included')->nullable();
            $table->json('timeline')->nullable();
            $table->json('faqs')->nullable();
            $table->json('practical_info')->nullable();
            $table->json('related_slugs')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('add_ons');
    }
};
