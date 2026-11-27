<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komponen_makanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stage2_id')->constrained('stage2_analisa')->cascadeOnDelete();
            $table->foreignUuid('chat_sesi_id')->constrained('chat_sesi')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Kode baku dari opsi_atribut (divalidasi di kode)
            $table->string('nama', 50);
            $table->string('kondisi', 50);
            $table->string('teknik', 50);

            $table->enum('hasil_cek', ['lolos', 'melewati_batas', 'tanpa_aturan']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komponen_makanan');
    }
};
