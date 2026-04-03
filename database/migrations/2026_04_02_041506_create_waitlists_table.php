<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("waitlists", function (Blueprint $table) {
            $table->id();

            $table->string("guest_name");
            $table->string("email");
            $table->string("phone")->nullable();
            $table->foreignId("departure_id")->constrained()->cascadeOnDelete();
            $table->integer("pax")->default(1);
            $table->text("notes")->nullable();
            $table->string("status")->default("waiting");

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("waitlists");
    }
};
