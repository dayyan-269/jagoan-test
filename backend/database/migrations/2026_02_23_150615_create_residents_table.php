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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('photo', 150)->nullable();
            $table->enum('marital_status', ['Menikah', 'Lajang'])->nullable()->default('Lajang');
            $table->enum('occupant_status', ['Tetap', 'Kontrak']);
            $table->string('mobile_number', 100)->nullable();

            $table->index('name');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
