<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Daftar nilai sah satu-satunya untuk nama, kondisi, teknik, dan suhu.
     * Dipakai untuk prompt, validasi JSON dari AI, dan pengisian aturan.
     */
    public function up(): void
    {
        Schema::create('opsi_atribut', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis', ['nama', 'kondisi', 'teknik', 'suhu']);
            $table->string('kode', 50);
            $table->string('label');
            $table->text('definisi');
            $table->text('contoh')->nullable();
            $table->timestamps();

            $table->unique(['jenis', 'kode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opsi_atribut');
    }
};
