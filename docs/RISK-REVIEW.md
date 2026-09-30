# WEAR Initial Risk and Scope Review

Reviewed: 2026-10-01. Review ini sudah dimasukkan ke PRD, architecture, essentials, dan scaffold. Tidak ada klaim bahwa risiko fitur sudah diuji karena fitur belum diimplementasikan.

## What can break and what was changed

1. **Topi menempel di wajah tetapi tidak di kepala.** Face landmarks tidak mencakup tengkorak penuh. Architecture mensyaratkan canonical-to-scene adapter, visual calibration, dan head proxy terpisah. PRD tidak menjanjikan physical size.
2. **Topi bergerak ke arah salah atau logo tercermin dua kali.** Mirror/crop/axis conventions tidak konsisten. Architecture menetapkan input unmirrored, satu wrapper mirror, koordinat renderer, dan alignment tests.
3. **Tracking tampak lancar tetapi tertinggal.** Render FPS tinggi dapat menyembunyikan inference rendah atau frame queue. Architecture memakai latest frame, satu inference aktif, timestamp/sequence, dan metrics terpisah.
4. **Topi membeku ketika wajah hilang.** Pose terakhir tetap digunakan. PRD mensyaratkan hide-on-invalid, dan architecture menambahkan stale timeout awal 150 ms.
5. **Topi terlihat di depan bagian kepala yang seharusnya menutupinya.** Face mesh terlalu sempit atau occluder salah. Architecture meminta approximate full-head proxy dan evaluasi clipping, bukan face mesh saja.
6. **Rambut atau tangan salah urutan.** Segmentation mask tidak memberi depth. Segmentation ditunda sampai kegagalan konkret, tetapi kebutuhan occlusion tetap menjadi gate realism sebelum klaim marketplace.
7. **Model atau aset gagal dimuat.** Npm package tidak membawa seluruh model task, asset path rusak, WASM tidak match. Scaffold menyatakan file belum ada; architecture mewajibkan local versioned assets, checksum, status loading/error, dan retry.
8. **Browser menjadi lambat atau hang.** Inference sync, asset berat, DPR tinggi. Start dengan baseline kecil, batasi budget, profil; worker hanya bila perlu. Tidak menganggap semua laptop memiliki GPU yang cukup.
9. **Stream atau GPU resource bocor.** Start berulang, tab hidden, context lost, atau async load terlambat. Architecture menetapkan resource ownership, generation invalidation, cleanup, dan lifecycle tests.
10. **Aset tampak realistic tetapi produk salah.** Logo, shape, material, atau warna berubah. PRD menuntut product fidelity. Generative try-on tidak menjadi default.
11. **Pengguna mengira visual fit berarti ukuran pas.** Scene meters bukan pengukuran physical head. PRD dan UI harus membedakan preview dari fit prediction.
12. **Desain topi mengunci perluasan baju.** Face tracker tidak memberi pose torso. Architecture memisahkan kebutuhan anchors tiap kategori dan menunda generic product framework sampai ada kategori kedua.

## Edge cases that must not be forgotten

- Permission denied, dismissed, atau masih menunggu; camera missing, busy, disconnected; video autoplay/play rejected.
- Video dimension nol saat metadata belum siap; resolution berubah; camera switching; browser background throttling.
- Dua orang masuk gambar, identity switch, partial face, profile view, glasses, bangs, hands, existing real hat, kepala terlalu dekat atau terpotong viewport.
- Cahaya belakang, webcam noise, motion blur, exposure/white balance berubah, dark hair/background, dan wajah terlalu kecil.
- Resize, fullscreen, zoom browser, DPR besar, viewport letterbox/crop, dan front/back camera mirror differences.
- Slow download, offline setup, corrupt model, GPU delegate gagal, CPU fallback lambat, unsupported WebGL2, context lost.
- Produk diganti saat GLB masih loading, loader selesai setelah stop, texture disposal pada shared resource, duplicate ids, unsupported manifest version.
- Kalung tertutup dagu/rambut, topeng menembus hidung, baju terpotong batas kamera, bahu/lengan di luar frame. These are future-category requirements, not current implemented support.

## What was over-engineered and removed from the plan

- Training pipeline: tidak diperlukan untuk baseline pretrained tracking.
- Backend/database/auth: tidak diperlukan untuk local visual preview.
- React/Next.js dan monorepo: tidak diperlukan untuk scaffold satu halaman.
- Universal category plugin system dan renderer inheritance: belum ada dua kategori konkret.
- Worker-by-default, segmentation-by-default, physics engine, dan service worker: biaya complexity belum didukung evidence.
- Persisted calibration profiles, recording, sharing, seller dashboard: belum diminta.
- Runtime JSON schema duplicate: static TypeScript catalog cukup untuk sekarang; runtime validation ditambahkan ketika data eksternal benar-benar masuk.

Folder fitur dan exported data types yang belum dipakai di runtime dipertahankan sebagai scaffold yang secara eksplisit diminta pengguna. Tidak ada unused runtime implementation atau fake camera behavior. Jangan mempertahankan placeholder implementation setelah feature nyata tersedia.

## Residual risks and next evidence

Belum diketahui: hardware pengguna, kualitas aset yang dapat dibuat, model/WASM version behavior, camera intrinsics, rentang pose yang lulus, dan subjective realism threshold.

Langkah berikutnya yang memberi evidence adalah camera lifecycle, lalu coordinate/projection spike dengan satu aset topi. Jangan menambah segmentation atau mengganti model sebelum kegagalan baseline tercatat. Bila occlusion atau lighting tetap tidak memenuhi gate, catat keterbatasan dan lakukan spike terkait sebelum menyebut siap marketplace.
