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
        Schema::create('due_payments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('due_type_id')->unsigned();
            $table->foreign('due_type_id')->references('id')->on('due_types')->onDelete('cascade');

            $table->bigInteger('resident_id')->unsigned();
            $table->foreign('resident_id')->references('id')->on('residents')->onDelete('cascade');

            $table->date('date')->useCurrent();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('due_payments');
    }
};
