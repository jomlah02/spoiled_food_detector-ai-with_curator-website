<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Memakai UUID agar ID sesi tidak bisa ditebak berurutan dari frontend.
     * Membutuhkan tabel users bawaan Laravel.
     */
    public function up(): void
    {
        Schema::create('chat_sesi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['berjalan', 'menunggu_keputusan', 'ditolak_aturan', 'selesai'])
                ->default('berjalan');
            $table->timestamps(); // created_at = DibuatPada
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_sesi');
    }
};
