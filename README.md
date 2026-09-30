# WEAR

WEAR adalah personal project virtual try-on melalui kamera secara real time. Fokus pertama adalah menampilkan topi 3D yang mengikuti kepala, dengan target visual realistis dan bentuk produk yang tetap akurat.

Pengembangan berikutnya membuka kemungkinan varian topi, topeng, kalung, dan pakaian yang terlihat hanya sampai bagian atas dada.

## Pendekatan

Pemrosesan kamera direncanakan berjalan lokal di browser, memakai computer vision pretrained dan rendering 3D. Stack awal adalah TypeScript, Vite, Three.js, dan MediaPipe. Tidak memerlukan API berbayar atau backend pada tahap awal.

WEAR menyediakan preview penampilan. Ukuran visual tidak membuktikan ukuran fisik atau menjamin produk akan pas.

## Status

Fondasi project dan dokumentasi sudah tersedia. Kamera, tracking, model inference, aset topi 3D, dan renderer try-on belum diimplementasikan. Project belum dinyatakan siap untuk marketplace.

## Branch

- `main` hanya memuat overview ini.
- [`production`](https://github.com/LecyLecy/WEAR/tree/production) memuat source code, dokumentasi teknis, dan petunjuk menjalankan project. Nama branch tidak berarti aplikasi sudah dideploy.
