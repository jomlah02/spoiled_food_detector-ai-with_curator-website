<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Disimpan per user. Saat sesi dihapus, chat_sesi_id menjadi NULL
     * dan hasil tetap ada (kecuali pengguna menghapusnya sendiri).
     */
    public function up(): void
    {
        Schema::create('hasil_akhir', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('chat_sesi_id')->nullable()->constrained('chat_sesi')->nullOnDelete();
            $table->text('estimasi_kondisi');
            $table->json('json_hasil');
            $table->timestamp('dinilai_pada');
            $table->timestamp('ingatkan_pada')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hasil_akhir');
    }
};
