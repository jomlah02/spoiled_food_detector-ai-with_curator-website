# React + Vite

## Backend analisa Sesi 1

Salin `.env.example` menjadi `.env`, lalu sesuaikan:

- `VITE_API_URL` — base URL backend (kosongkan jika satu origin dengan frontend).
- `VITE_ANALYZE_PATH` — endpoint analisa, default `/api/analyze`.

Request dikirim sebagai `multipart/form-data` dengan field:
`foto`, `nama`, `suhu_tempat`, `suhu_spesifik`, `waktu`, `waktu_spesifik`,
`detail_tambahan`. Response JSON dipakai untuk menampilkan hasil analisa awal
sebelum pertanyaan "Cium dulu. Ada yang aneh?".

### Pertanyaan lanjutan dari AI (Sesi 2)

Response analisa boleh menyertakan hasil analisis awal dan daftar pertanyaan
lanjutan. Format yang dipakai backend CuPI:

```json
{
  "hasil_analisis_awal": {
    "nama_makanan": "Opor ayam",
    "kategori_jenis": "Bersantan & olahan susu",
    "kondisi_visual": "Kuah masih kental, tidak terlihat berjamur."
  },
  "pertanyaan_dinamis": [
    {
      "id": "q1",
      "pertanyaan": "Opor ayamnya disimpan di mana?",
      "deskripsi": "Biar tahu seberapa cepat bakteri berkembang.",
      "pilihan": [
        {
          "label": "Kulkas, kurang dari 2 jam di luar",
          "sub_label": "Disimpan langsung setelah dingin",
          "value": "kulkas_cepat"
        },
        {
          "label": "Suhu ruang, lebih dari 4 jam",
          "sub_label": "Dibiarkan di meja",
          "value": "ruang_lama"
        }
      ]
    }
  ]
}
```

Frontend juga menerima nama field alternatif seperti `pertanyaan_lanjutan`,
`follow_up_questions`, `questions`, dan `pertanyaan`. Pilihan boleh berupa string,
object `{ id, label, sub_label, value }`, atau object map. `sub_label` otomatis
ditampilkan sebagai keterangan pilihan.

Setiap pertanyaan dirender sebagai satu langkah wizard dengan komponen pilihan
yang sama seperti step sebelumnya. Jawaban disimpan di state `followUps` dan
ikut disertakan pada record hasil sebagai `followUpAnswers` agar siap dikirim
kembali ke backend untuk hasil akhir.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
