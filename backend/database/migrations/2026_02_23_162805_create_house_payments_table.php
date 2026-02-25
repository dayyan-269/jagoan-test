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
        Schema::create('house_payments', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('occupant_history_id')->unsigned();
            $table->foreign('occupant_history_id')->references('id')->on('occupant_histories')->onDelete('cascade');

            $table->date('payment_date')->nullable()->useCurrent();
            $table->decimal('payment_amount', 20, 2);
            $table->enum('payment_status', ['Lunas', 'Belum Lunas'])->default('Lunas');
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('house_payments');
    }
};
