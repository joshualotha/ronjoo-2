<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50);
            $table->string('message');
            $table->boolean('is_read')->default(false);
            $table->unsignedBigInteger('related_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
    }
};
