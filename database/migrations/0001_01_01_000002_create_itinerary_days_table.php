<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itinerary_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safari_id')->constrained()->cascadeOnDelete();
            $table->integer('day');
            $table->string('title');
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->json('activities')->nullable();
            $table->string('meals')->nullable();
            $table->json('meals_json')->nullable();
            $table->string('accommodation')->nullable();
            $table->string('drive_time')->nullable();
            $table->string('accommodation_tier')->nullable();
            $table->json('activity_tags')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('safari_accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safari_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('nights')->default(1);
            $table->string('tier')->nullable();
            $table->string('image')->nullable();
            $table->integer('rating')->default(5);
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safari_accommodations');
        Schema::dropIfExists('itinerary_days');
    }
};
