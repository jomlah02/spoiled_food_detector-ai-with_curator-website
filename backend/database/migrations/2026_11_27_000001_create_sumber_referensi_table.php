<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sumber_referensi', function (Blueprint $table) {
            $table->id();
            $table->string('lembaga');
            $table->string('judul');
            $table->string('url', 2048);
            $table->date('tanggal_akses');
            $table->text('ringkasan_klaim');
            $table->enum('status_verifikasi', ['draf', 'sudah_dicek', 'direview_ahli'])->default('draf');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sumber_referensi');
    }
};
