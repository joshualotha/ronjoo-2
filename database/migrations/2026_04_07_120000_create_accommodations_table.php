<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('location')->nullable();           // e.g. "Central Serengeti", "Karatu"
            $table->string('tier')->default('Standard');       // Premium, Superior, Standard, Budget
            $table->integer('stars')->nullable();               // 1-5
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('website')->nullable();
            $table->json('amenities')->nullable();
            $table->timestamps();
        });

        Schema::create('accommodation_destination', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accommodation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['accommodation_id', 'destination_id']);
        });

        Schema::create('accommodation_safari', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accommodation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('safari_id')->constrained()->cascadeOnDelete();
            $table->integer('nights')->default(1);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['accommodation_id', 'safari_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodation_safari');
        Schema::dropIfExists('accommodation_destination');
        Schema::dropIfExists('accommodations');
    }
};
