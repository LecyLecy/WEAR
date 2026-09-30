# WEAR

WEAR adalah personal project virtual try-on yang memproses kamera secara lokal. Milestone pertama adalah satu topi 3D yang mengikuti kepala. Pengembangan berikutnya membuka kemungkinan topeng, kalung, dan pakaian yang terlihat hanya sampai bagian atas dada.

## Status saat ini

Scaffold berjalan sebagai aplikasi browser. Katalog berisi satu draft tanpa aset. Kamera, model tracking, renderer 3D, occlusion, dan pengujian realism belum diimplementasikan. Tombol try-on sengaja nonaktif. Tidak ada server aplikasi, akun pengguna, database, atau layanan berbayar.

## Menjalankan

Source code dan dokumentasi lengkap berada pada branch `production` di [repository WEAR](https://github.com/LecyLecy/WEAR/tree/production). Branch `main` hanya berisi overview project. Nama branch production tidak berarti aplikasi sudah dideploy.

Gunakan Node.js 22.12 atau lebih baru; setup ini diverifikasi dengan Node.js 24.16.0.

```powershell
Set-Location E:\Projects\WEAR
npm ci
npm run dev
```

Buka URL localhost yang dicetak Vite. Perintah tersebut hanya menjalankan development server lokal. Untuk pemeriksaan:

```powershell
npm run check
npm run preview
```

`preview` membutuhkan hasil `build`. Tidak perlu environment variable atau API key. `npm ci` pertama membutuhkan internet; setelah dependency tersedia, scaffold dapat berjalan lokal. Fitur inference kelak memerlukan model dan WASM lokal yang belum disertakan.

## Dokumen

- [PRD.md](PRD.md): tujuan produk, pengguna, scope, kebutuhan, dan acceptance criteria.
- [ARCHITECTURE.md](ARCHITECTURE.md): sumber utama desain teknis dan data model.
- [ARCHITECTURE-ESSETIALS.md](ARCHITECTURE-ESSETIALS.md): ringkasan keputusan penting. Ejaan filename mengikuti permintaan awal.
- [ARCHIRECTURE.md](ARCHIRECTURE.md): pointer untuk ejaan alternatif dari permintaan awal, bukan dokumen teknis kedua.
- [AGENTS.md](AGENTS.md): aturan kerja dan cara memperbarui dokumen.
- [docs/RISK-REVIEW.md](docs/RISK-REVIEW.md): hal yang bisa rusak, edge cases, dan keputusan penyederhanaan.
- [docs/VALIDATION.md](docs/VALIDATION.md): cara membuktikan performa dan kualitas visual.
- [docs/SKILLS.md](docs/SKILLS.md): skill yang ditemukan, kegunaan, dan status instalasi.
- [docs/SETUP-VERIFICATION.md](docs/SETUP-VERIFICATION.md): hasil pemeriksaan scaffold dan batas klaim completion.

## Struktur

```text
src/
  main.ts                  halaman status scaffold
  styles.css               gaya halaman
  catalog/hats.ts          draft katalog lokal
  domain/                  kontrak produk, tracking, dan session
  features/camera/         batas fitur kamera, belum diimplementasikan
  features/tracking/       batas fitur inference, belum diimplementasikan
  features/hat/            batas fitur topi, belum diimplementasikan
  features/rendering/      batas fitur renderer, belum diimplementasikan
public/
  assets/hats/             aset produk 3D yang akan dibuat
  models/                  model inference dan WASM yang akan disiapkan
docs/                      risiko, validasi, dan katalog skill
scripts/                   pemeriksaan dokumen
tests/                     panduan pengujian fitur berikutnya
```

Milestone selanjutnya: permission kamera dan lifecycle yang benar, lalu satu kepala terdeteksi, lalu topi GLB terkalibrasi. Jangan menganggap milestone selesai hanya karena topi terlihat pada satu frame.
