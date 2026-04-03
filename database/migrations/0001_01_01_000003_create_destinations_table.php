<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('region')->nullable();
            $table->string('tagline')->nullable();
            $table->string('area_stat')->nullable();
            $table->string('area_label')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('portrait_image')->nullable();
            $table->text('pull_quote')->nullable();
            $table->string('status')->default('draft');
            $table->json('quick_facts')->nullable();
            $table->text('overview')->nullable();
            $table->json('wildlife')->nullable();
            $table->json('months')->nullable();
            $table->json('seasons')->nullable();
            $table->json('experiences')->nullable();
            $table->json('gallery')->nullable();
            $table->json('travel_info')->nullable();
            $table->json('related_slugs')->nullable();
            $table->timestamps();
        });

        Schema::create('destination_accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('tier')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('destination_faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('question');
            $table->text('answer');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destination_faqs');
        Schema::dropIfExists('destination_accommodations');
        Schema::dropIfExists('destinations');
    }
};
