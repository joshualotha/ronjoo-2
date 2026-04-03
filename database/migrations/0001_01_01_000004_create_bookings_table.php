<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->string('guest_name');
            $table->string('email');
            $table->string('whatsapp')->nullable();
            $table->string('country')->nullable();
            $table->foreignId('safari_id')->nullable()->constrained()->nullOnDelete();
            $table->string('safari_name')->nullable();
            $table->date('departure_date')->nullable();
            $table->date('return_date')->nullable();
            $table->integer('pax')->default(1);
            $table->integer('children')->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('deposit_paid', 10, 2)->default(0);
            $table->decimal('balance_due', 10, 2)->default(0);
            $table->string('status')->default('pending');
            $table->string('payment_status')->default('unpaid');
            $table->string('group_type')->nullable();
            $table->string('guide')->nullable();
            $table->json('notes')->nullable();
            $table->string('accommodation_tier')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
