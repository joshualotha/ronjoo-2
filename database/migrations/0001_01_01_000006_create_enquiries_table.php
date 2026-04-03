<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('guest_name');
            $table->string('email');
            $table->string('whatsapp')->nullable();
            $table->string('country')->nullable();
            $table->string('country_flag')->nullable();
            $table->string('safari_interest')->nullable();
            $table->string('preferred_dates')->nullable();
            $table->string('travelers')->nullable();
            $table->string('budget')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new');
            $table->boolean('is_read')->default(false);
            $table->timestamp('received_at')->nullable();
            $table->string('source')->nullable();
            $table->json('replies')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
