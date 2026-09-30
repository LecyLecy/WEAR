# WEAR Validation Protocol

Status: protocol for future features; scaffold checks are separate. Updated: 2026-10-01.

## Scaffold acceptance

1. `npm ci` berhasil memakai lockfile.
2. `npm run check` berhasil: dokumen wajib ada, Markdown tanpa em dash, strict typecheck dan production build sukses.
3. Browser menampilkan WEAR, status scaffold, satu produk draft, dan tombol disabled. Tidak ada camera permission request atau runtime console error.
4. Network runtime scaffold hanya memuat local app assets; tidak ada upload video atau model CDN.

Tidak satu pun langkah tersebut membuktikan try-on working. Catat camera, inference, model assets, rendering, dan realism sebagai not implemented sampai feature diuji.

## Feature verification layers

### Logic and lifecycle

Uji transform adapter dengan input known pose, translation, rotation, matrix layout, handedness, dan unit conversion. Uji mirror dan crop pada video/canvas berukuran sama serta perubahan aspect ratio. Uji invalid/nonfinite output, stale timestamp, monotonic sequence, dan result setelah session restart.

Uji start/stop 10 kali, stop saat loading, product switch saat loading, tab hidden/visible, track ended, camera disconnect, dan WebGL context lost. Pastikan tidak ada loop/stream duplicate, result lama, atau resource leak. Mock tidak menggantikan live camera test.

### Device record

Untuk setiap evaluasi, catat OS, browser version, CPU/GPU, display DPR, actual camera resolution/FPS, inference delegate, model/WASM version, GLB revision, dan application commit atau source snapshot. Spesifikasi laptop pengguna belum diketahui.

Baseline pengukuran awal: Chrome/Edge desktop, 640x480 jika webcam mendukung, cahaya cukup, satu pengguna. Target kategori mobile belum dinyatakan supported.

### Performance measurement

Warmup 10 detik lalu ukur 60 detik. Laporkan render FPS dan tracking FPS terpisah, median/P95 inference duration, P95 frame age saat inference complete, peak memory jika browser mendukung, dropped frames, serta stall UI.

Target awal: render >=30 FPS dan tracking >=15 FPS; P95 inference-completion frame age <=120 ms. Timestamp memakai time origin yang sama. Jangan menyebut angka frame age sebagai end-to-end camera-to-display latency. Untuk latency total, gunakan rekaman eksternal berkecepatan tinggi atau metode lain yang terdokumentasi.

### Stability and placement

Pada kepala diam, rekam 10 detik. Ukur deviasi posisi anchor topi dari median sebagai proporsi lebar wajah. Target P95 <=2%. Evaluasi rotation jitter terpisah; smoothing dapat mengurangi jitter sambil menambah lag.

Uji kepala menjauh/mendekat, yaw, pitch, dan roll secara bertahap. Laporkan angle/condition yang benar-benar lulus dan titik tracking gagal. Jangan menyebut angle yang belum diuji sebagai supported. Uji recover setelah wajah keluar frame.

### Visual fidelity

Jika topi asli tersedia, ambil footage real dan virtual dengan camera placement, pose, dan cahaya serupa, dengan persetujuan peserta. Landmark-to-hat placement pada footage real bukan label otomatis yang sempurna; anotasi harus ditinjau.

Review manual menilai shape/silhouette, logo/material/color fidelity, placement, temporal drift, head occlusion, hair/hand ordering, lighting, dan perceived realism. Pakai skala 1 sampai 5 dengan catatan konkret: 1 berarti jelas salah, 3 berarti usable demo dengan artefak terlihat, 5 berarti konsisten meyakinkan dalam kondisi diuji. Laporkan per dimensi, bukan satu skor yang menyembunyikan kegagalan.

Gate realism awal untuk kondisi supported: setiap dimensi minimal 4 dalam review yang terdokumentasi dan tidak ada clipping/occlusion failure yang merusak preview sepanjang klip yang lulus. Review ini masih subjektif. Sebelum klaim marketplace, perlu evaluasi pengguna yang lebih luas dan threshold yang disetujui pemilik produk.

## Evaluation coverage

Mulai dengan puluhan klip debugging yang mencakup variasi rambut, wajah, warna kulit, kacamata, cahaya, jarak, dan gerakan. Catat jumlah peserta, bukan hanya jumlah frame yang sangat berkorelasi. Laporkan failure rate per kondisi. Sample kecil bukan evidence performa populasi luas.

Uji kondisi adversarial praktis: existing real hat, tangan di depan brim, kepala terpotong, side profile, dua orang, backlight, rapid motion, dan low-resolution camera. Kegagalan boleh menjadi documented unsupported condition selama UI gagal secara jujur; tidak boleh disembunyikan demi demo.

## Consent and evidence handling

Tidak ada recording otomatis. Minta persetujuan peserta sebelum mengumpulkan footage. Simpan di lokasi lokal yang disepakati di luar Git, tentukan retensi dan penghapusan, dan jangan menaruh identitas di file report. Application diagnostics hanya angka, bukan frame atau biometric histories.

## Result template

```text
Date and source revision:
Milestone under test:
Device/browser and camera settings:
Model/WASM and product asset revisions:
Participants/consent and tested conditions:
Render FPS / tracking FPS:
Inference median/P95 and completion frame-age P95:
Anchor jitter P95 and observed supported pose range:
Lifecycle result:
Visual review per dimension:
Failures, unsupported conditions, and unresolved risks:
Conclusion and next action:
```

Never mark a gate passed merely because this template exists. It needs measured results and inspectable evidence.
