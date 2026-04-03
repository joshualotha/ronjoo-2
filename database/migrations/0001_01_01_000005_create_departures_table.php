<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safari_id')->nullable()->constrained()->nullOnDelete();
            $table->string('safari_name')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_seats')->default(0);
            $table->integer('booked_seats')->default(0);
            $table->string('status')->default('open');
            $table->decimal('revenue', 10, 2)->default(0);
            $table->decimal('projected_revenue', 10, 2)->default(0);
            $table->string('guide')->nullable();
            $table->json('guests')->nullable();
            $table->json('waitlist')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departures');
    }
};
