# WEAR Product Requirements

Status: approved direction, pre-feature scaffold. Updated: 2026-10-01.

## 1. Product definition

WEAR adalah aplikasi virtual try-on melalui kamera. Pengguna melihat dirinya dengan produk virtual yang bergerak mengikuti tubuh, dimulai dengan satu baseball cap 3D. Tujuan jangka panjang adalah pengalaman preview produk untuk marketplace, dengan kemungkinan varian topi, topeng, kalung, dan pakaian yang terlihat sampai bagian atas dada.

Project saat ini bersifat personal, berjalan lokal, dan tidak membutuhkan layanan berbayar. Standar kualitas diarahkan pada kebutuhan marketplace, tetapi scaffold atau demo awal tidak boleh diklaim sudah memenuhi standar tersebut.

## 2. Users and needs

- Calon pembeli ingin melihat penampilan produk pada dirinya tanpa mengunggah foto atau memasang aplikasi khusus.
- Pemilik project ingin membangun dan mengukur virtual try-on realistis dengan perangkat yang sudah dimiliki.
- Penjual pada tahap berikutnya membutuhkan aset yang mempertahankan bentuk, warna, jahitan, dan logo produk aslinya.

Pengguna utama milestone awal adalah satu orang di depan webcam laptop atau desktop. Seller onboarding, katalog marketplace, checkout, dan pengelolaan akun belum termasuk scope.

## 3. Product principles

1. Nama produk selalu `WEAR`, seluruhnya kapital pada UI dan dokumentasi.
2. Preview harus mempertahankan identitas produk; jangan mengganti detail produk demi gambar yang lebih meyakinkan.
3. Pengguna memulai kamera secara eksplisit dan dapat menghentikannya.
4. Video dan hasil tracking diproses lokal. Tidak ada upload, penyimpanan biometrik, atau analytics jaringan secara default.
5. Ketika tracking tidak valid, produk virtual disembunyikan dan UI memberi petunjuk. Topi tidak boleh membeku seolah tracking masih benar.
6. Ukuran visual tidak berarti ukuran fisik cocok. WEAR tidak menjanjikan fit atau ukuran kepala dalam sentimeter.
7. Keterbatasan ditampilkan dalam bahasa yang dipahami pengguna, tanpa memaparkan detail implementation yang tidak berguna.

## 4. Scope and stages

### S0: foundation, current request

Dokumen produk dan teknis, data model, folder fitur, dependency terkunci, halaman status yang berjalan, daftar skill, dan protokol validasi. Belum ada kamera aktif, model inference, topi GLB, atau klaim realism. S0 selesai ketika dokumen konsisten dan scaffold lolos build serta smoke check browser.

### S1: one-hat functional try-on

- Kamera dapat dimulai dan dihentikan, dengan error yang dapat dipahami.
- Satu wajah menjadi target. Model awal bukan multi-user.
- Satu topi berstatus ready ditampilkan mengikuti posisi dan rotasi kepala.
- Produk disembunyikan saat wajah hilang atau pose di luar kondisi yang didukung.
- Tersedia reset dan kalibrasi visual sederhana untuk posisi atau skala jika dibutuhkan.
- Mirror preview tidak menyebabkan topi atau logo terbalik relatif terhadap pengguna.
- Status loading model dan aset terpisah dari status kamera.

### S2: realism and reliability

- Placement terkalibrasi pada aset produk yang benar.
- Head occlusion mencegah bagian belakang topi tampil di depan wajah.
- Tracking stabil tanpa latensi smoothing berlebihan.
- Material PBR dan lighting baseline cocok untuk kondisi evaluasi yang ditetapkan.
- Rambut dan tangan ditangani sesuai kegagalan nyata yang ditemukan; segmentation tidak dianggap sudah menyelesaikan kedalaman atau deformasi rambut.
- Penggantian topi tidak meninggalkan aset lama atau menyebabkan race condition.
- Performa dan kualitas visual diuji pada beberapa pengguna dan perangkat.

### S3: future upper-body products

Varian topi berbagi jalur head tracking. Topeng memerlukan face attachment atau face mesh, kalung memerlukan neck dan upper-torso pose, dan pakaian atas dada memerlukan pose tubuh, occlusion, fitting visual, serta pendekatan deformasi kain. Setiap kategori memerlukan spike dan acceptance criteria sendiri sebelum diimplementasikan.

Kamera yang hanya memperlihatkan atas dada tidak memberikan bentuk tubuh lengkap. Tepi bawah pakaian harus terpotong wajar di batas viewport. Jangan mengklaim full-body try-on, simulasi drape kain, atau ukuran baju akurat.

## 5. User flow for S1

1. Pengguna membuka WEAR dan membaca fungsi preview serta batasnya.
2. Pengguna memilih topi yang sudah siap. Produk draft tidak dapat dipilih.
3. Pengguna menekan mulai kamera dan memberi izin browser.
4. Aplikasi memuat aset lokal dan meminta pengguna menempatkan satu wajah di kamera.
5. Topi muncul ketika pose valid. Petunjuk tersedia saat wajah hilang, terlalu dekat, atau menoleh terlalu jauh.
6. Pengguna dapat reset kalibrasi, mengganti produk siap, atau menghentikan kamera.

Mode pengambilan screenshot, rekaman, share, dan penyimpanan calibration profile tidak termasuk kebutuhan awal. Menambahkannya memerlukan keputusan produk dan kebijakan data yang eksplisit.

## 6. Functional requirements

- FR-01: tidak meminta kamera sebelum tindakan pengguna.
- FR-02: start, stop, retry, dan repeated start harus menjaga satu camera stream dan satu loop tracking saja.
- FR-03: permission denied, kamera tidak ada atau sibuk, dan browser tidak kompatibel harus memiliki pesan serta jalan pemulihan.
- FR-04: inferensi hanya memproses frame terbaru, tanpa antrian yang tumbuh.
- FR-05: hasil stale atau tidak valid menyembunyikan topi sebelum render berikutnya setelah status ditetapkan.
- FR-06: produk draft, aset gagal, dan model gagal tidak boleh menjadi preview palsu atau layar kosong tanpa pesan.
- FR-07: saat tab disembunyikan, loop ditangguhkan; stream dihentikan sesuai kontrak lifecycle di arsitektur.
- FR-08: resize, aspek rasio, device pixel ratio, serta mirror harus menjaga alignment video dan overlay.
- FR-09: pengguna dapat memilih berhenti; seluruh track kamera berakhir dan resource GPU dibersihkan.
- FR-10: kalibrasi manual adalah penyesuaian visual, bukan pengukuran fisik.
- FR-11: aset dan model memiliki catatan sumber, versi, dan lisensi sebelum dipakai.

## 7. Quality and release gates

Baseline awal adalah desktop Chrome atau Edge stabil dengan webcam RGB, satu wajah, pencahayaan cukup, dan kepala tidak tertutup. Spesifikasi laptop pengguna belum diketahui; dukungan dan performa harus dibuktikan, bukan diasumsikan.

Target S1/S2 yang harus diukur pada perangkat referensi:

- Minimal 30 render FPS dan 15 tracking FPS pada viewport webcam 640x480 selama 60 detik setelah warmup.
- P95 inference-completion frame age maksimal 120 ms; camera-to-display latency dilaporkan terpisah karena timestamp aplikasi tidak mengukur seluruh latensi sensor dan display.
- Pada kepala diam, P95 deviasi anchor topi dari median posisi maksimal 2% lebar wajah selama klip 10 detik.
- Setelah stop, seluruh MediaStreamTrack harus berstatus ended; 10 siklus start/stop tidak menambah stream atau loop.
- Topi tidak tetap terlihat setelah status tracking menjadi unavailable. Timeout stale awal 150 ms ditinjau dari hasil evaluasi.
- Bandingkan rekaman virtual dan topi asli bila tersedia. Laporkan placement, drift, detail produk, occlusion, serta pencahayaan secara terpisah.

Angka ini adalah target awal, bukan hasil yang sudah tercapai. Rentang pose diuji dahulu, lalu rentang yang lulus dicatat sebagai kondisi supported. Review visual manusia tetap diperlukan; FPS atau landmark accuracy saja tidak membuktikan realism.

Lihat [docs/VALIDATION.md](docs/VALIDATION.md) untuk metode, batas evidence, dan matriks pengujian. Tidak ada acceptance gate realism untuk S0 karena fitur belum ada.

## 8. Data and assets

Tahap awal memakai model deep learning pretrained. Tidak melatih model dari nol. Data produk berupa GLB, tekstur, placement, dan provenance. Video pengujian dibuat hanya dengan persetujuan peserta, disimpan di lokasi lokal di luar repository, dan memiliki kebijakan retensi yang disepakati sebelum pengumpulan.

Dataset kecil untuk debugging tidak membuktikan performa populasi luas. Dataset pakaian seperti VITON tidak otomatis menyelesaikan topi AR real time. Training khusus baru dipertimbangkan jika baseline terukur gagal dan data berlisensi yang relevan tersedia.

## 9. Out of scope and open questions

Tidak termasuk: hosting produksi, backend, database, akun, checkout, multi-person tracking, smartphone support guarantee, generated-video try-on, physical size prediction, atau full cloth simulation.

Pertanyaan yang tidak menghalangi scaffold: spesifikasi laptop/GPU, akses ke topi asli, pembuat aset 3D, browser target final, prioritas aksesori berikutnya, serta kualitas minimum yang diterima calon pengguna. Jangan mengisi jawaban tersebut dengan asumsi seolah sudah disetujui.

## 10. Risk review incorporated

Review awal menemukan risiko kepala tidak terukur dari webcam, rambut tidak terkompresi secara virtual, landmark bukan full-head scan, mirroring ganda, occlusion salah, dan bottleneck inference. Scope diperbaiki menjadi visual preview satu topi, dengan penanganan kegagalan eksplisit, quality gate terukur, dan desain kategori masa depan yang terpisah. Rincian keputusan ada di [docs/RISK-REVIEW.md](docs/RISK-REVIEW.md).
