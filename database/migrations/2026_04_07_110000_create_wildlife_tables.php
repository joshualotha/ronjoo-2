<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wildlife', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('category')->nullable();          // Big Five, Predator, Primate, Bird, Marine, Herbivore
            $table->string('image')->nullable();              // Primary photo URL
            $table->text('fact')->nullable();                  // Default interesting fact
            $table->text('description')->nullable();           // Longer description
            $table->string('conservation_status')->nullable(); // Least Concern, Vulnerable, Endangered, etc.
            $table->timestamps();
        });

        Schema::create('destination_wildlife', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->foreignId('wildlife_id')->constrained('wildlife')->cascadeOnDelete();
            $table->string('likelihood')->default('Common');   // Very Common, Common, Uncommon, Rare, Seasonal
            $table->text('custom_fact')->nullable();            // Override the default fact for this destination
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['destination_id', 'wildlife_id']);
        });

        Schema::create('safari_wildlife', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safari_id')->constrained()->cascadeOnDelete();
            $table->foreignId('wildlife_id')->constrained('wildlife')->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['safari_id', 'wildlife_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safari_wildlife');
        Schema::dropIfExists('destination_wildlife');
        Schema::dropIfExists('wildlife');
    }
};
