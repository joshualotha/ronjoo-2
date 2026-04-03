<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destination_accommodations', function (Blueprint $table) {
            if (!Schema::hasColumn('destination_accommodations', 'stars')) {
                $table->unsignedTinyInteger('stars')->nullable()->after('tier');
            }
            if (!Schema::hasColumn('destination_accommodations', 'amenities')) {
                $table->json('amenities')->nullable()->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('destination_accommodations', function (Blueprint $table) {
            if (Schema::hasColumn('destination_accommodations', 'amenities')) {
                $table->dropColumn('amenities');
            }
            if (Schema::hasColumn('destination_accommodations', 'stars')) {
                $table->dropColumn('stars');
            }
        });
    }
};

