<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tabel; // GANTI: nama model/tabel kamu
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $request->validate(['pesan' => 'required|string']);
        $pesan = $request->input('pesan');

        $jawaban = $this->tanyaAi($pesan, '[API KEY AI 1]');

        $data = Tabel::create([
            'input'  => $pesan,   // GANTI: nama kolom
            'output' => $jawaban, // GANTI: nama kolom
        ]);

        return $this->ok($data, $jawaban);
    }

    // POST/GET /api/ringkas -> param: teks
    public function ringkas(Request $request): JsonResponse
    {
        $request->validate(['teks' => 'required|string']);
        $teks = $request->input('teks');

        $jawaban = $this->tanyaAi("Ringkas teks ini dalam 3 kalimat:\n\n" . $teks, '[API KEY AI 1]');

        $data = Tabel::create([
            'input'  => $teks,
            'output' => $jawaban,
        ]);

        return $this->ok($data, $jawaban);
    }

    public function terjemah(Request $request): JsonResponse
    {
        $request->validate(['teks' => 'required|string']);
        $teks   = $request->input('teks');
        $bahasa = $request->input('bahasa', 'Inggris');

        $jawaban = $this->tanyaAi("Terjemahkan ke bahasa {$bahasa}:\n\n" . $teks, '[API KEY AI 2]');

        $data = Tabel::create([
            'input'  => $teks,
            'output' => $jawaban,
        ]);

        return $this->ok($data, $jawaban);
    }

    private function tanyaAi(string $prompt, string $apiKey): string
    {
        $res = Http::withToken($apiKey)
            ->timeout(60)
            ->post('[URL ENDPOINT AI]', [
                'model'    => '[NAMA MODEL AI]',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

        abort_if($res->failed(), 502, 'AI gagal merespons');

        return $res->json('choices.0.message.content', '');
    }

    private function ok($data, string $jawaban): JsonResponse
    {
        return response()->json([
            'success' => true,
            'jawaban' => $jawaban,
            'data'    => $data,
        ]);
    }
}
