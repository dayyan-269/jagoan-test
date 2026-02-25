<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('occupant_histories', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('house_id')->unsigned();
            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');

            $table->bigInteger('resident_id')->unsigned();
            $table->foreign('resident_id')->references('id')->on('residents')->onDelete('cascade');

            $table->date('start_date')->useCurrent();
            $table->date('end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('occupant_histories');
    }
};
