<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stage1_input', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('chat_sesi_id')->unique()->constrained('chat_sesi')->cascadeOnDelete(); // satu input per sesi
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Wajib (dipakai hitungan manual)
            $table->string('jalur_foto');
            $table->unsignedInteger('waktu_menit');
            $table->enum('tempat_simpan', ['terbuka', 'tertutup']);
            $table->enum('suhu', ['freezer', 'dingin', 'ruang', 'panas']); // "hangat" di form disimpan sebagai ruang

            // Opsional (hanya konteks untuk AI)
            $table->date('tanggal_spesifik')->nullable();
            $table->text('tempat_detail')->nullable();
            $table->decimal('suhu_angka', 5, 1)->nullable();
            $table->enum('kelembaban_simpan', ['terlalu_kering', 'normal', 'terlalu_lembab'])->nullable();
            $table->decimal('kelembaban_angka', 5, 1)->nullable();
            $table->text('detail_tambahan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stage1_input');
    }
};
