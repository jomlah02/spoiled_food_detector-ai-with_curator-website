<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Semua kolom wajib terisi. Satu kombinasi = satu baris = satu klaim berumber.
     * nama, kondisi, dan teknik divalidasi terhadap opsi_atribut di kode
     * (tidak bisa foreign key karena kuncinya gabungan jenis + kode).
     */
    public function up(): void
    {
        Schema::create('aturan_komponen', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 50);
            $table->string('kondisi', 50);
            $table->string('teknik', 50);
            $table->enum('suhu', ['ruang', 'dingin']);
            $table->unsignedInteger('batas_menit');
            $table->boolean('peringatan_patogen');
            $table->text('teks_edukasi');
            $table->foreignId('sumber_id')->constrained('sumber_referensi')->restrictOnDelete();
            $table->timestamps();

            $table->unique(['nama', 'kondisi', 'teknik', 'suhu']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aturan_komponen');
    }
};
