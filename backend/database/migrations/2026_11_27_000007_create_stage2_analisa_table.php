<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tidak unik per sesi: analisa boleh dipanggil ulang jika pengguna
     * mengoreksi identitas makanan.
     */
    public function up(): void
    {
        Schema::create('stage2_analisa', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('chat_sesi_id')->constrained('chat_sesi')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nama_makanan');                       // hanya untuk tampilan
            $table->unsignedSmallInteger('porsi_orang')->default(1);
            $table->json('json_mentah');                          // hasil analisa, konteks, pertanyaan
            $table->string('nama_model');
            $table->string('versi_prompt');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stage2_analisa');
    }
};
