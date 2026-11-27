<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * batas_menit kosong untuk freezer dan panas (hanya teks edukasi).
     * Untuk ruang dan dingin, diisi nilai konservatif sebagai cadangan.
     */
    public function up(): void
    {
        Schema::create('aturan_global_suhu', function (Blueprint $table) {
            $table->id();
            $table->enum('suhu', ['freezer', 'panas', 'ruang', 'dingin'])->unique();
            $table->unsignedInteger('batas_menit')->nullable();
            $table->text('teks_edukasi');
            $table->foreignId('sumber_id')->constrained('sumber_referensi')->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aturan_global_suhu');
    }
};
