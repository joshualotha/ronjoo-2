<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("promotions", function (Blueprint $table) {
            $table->id();

            $table->string("code")->unique();
            $table->string("name");
            $table->text("description")->nullable();
            $table->enum("discount_type", ["percentage", "fixed"]);
            $table->decimal("discount_value", 10, 2);
            $table->date("valid_from")->nullable();
            $table->date("valid_until")->nullable();
            $table->integer("usage_limit")->nullable();
            $table->integer("times_used")->default(0);
            $table->string("status")->default("active");

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("promotions");
    }
};
