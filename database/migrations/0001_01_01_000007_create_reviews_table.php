<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('guest_name');
            $table->string('country')->nullable();
            $table->string('country_flag')->nullable();
            $table->integer('rating');
            $table->string('safari_name')->nullable();
            $table->date('safari_date')->nullable();
            $table->date('submitted_date')->nullable();
            $table->string('status')->default('pending');
            $table->string('excerpt', 500)->nullable();
            $table->text('full_text');
            $table->text('owner_response')->nullable();
            $table->json('category_ratings')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
