<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stage3_jawaban', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('chat_sesi_id')->unique()->constrained('chat_sesi')->cascadeOnDelete(); // satu baris per sesi
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('json_jawaban'); // contoh: {"1": "a", "2": "tidak_yakin"}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stage3_jawaban');
    }
};
