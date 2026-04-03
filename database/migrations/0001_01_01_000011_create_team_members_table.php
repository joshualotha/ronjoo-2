<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('experience')->nullable();
            $table->json('languages')->nullable();
            $table->json('specializations')->nullable();
            $table->boolean('show_on_website')->default(true);
            $table->string('photo')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });

        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('country')->nullable();
            $table->string('source')->nullable();
            $table->string('status')->default('active');
            $table->date('date_subscribed')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscribers');
        Schema::dropIfExists('team_members');
    }
};
