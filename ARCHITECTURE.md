# WEAR Architecture

Status: technical plan plus runnable scaffold, not an implemented try-on system. Updated: 2026-10-01.

## 1. Constraints and design goals

WEAR memproses webcam di perangkat pengguna dan merender produk 3D di browser. Milestone pertama hanya satu topi. Tidak ada backend, penyimpanan video, model training pipeline, atau biaya API. Runtime target awal adalah Chrome atau Edge desktop; hardware dan browser lain memerlukan validasi terpisah.

Arsitektur harus menjaga jalur sederhana untuk topi sekaligus tidak mengunci seluruh produk masa depan pada landmark wajah. Model data awal hanya mengimplementasikan produk topi. Kemungkinan kategori lain dicatat sebagai desain masa depan, bukan plugin system yang belum punya pengguna konkret.

## 2. Stack and versions

- TypeScript 7.0.2, strict mode, untuk aplikasi dan kontrak data.
- Vite 8.3.1, untuk development server lokal dan static production build.
- Three.js 0.186.1 dan @types/three 0.186.0, untuk GLB, transform, depth, dan material PBR.
- @mediapipe/tasks-vision 0.10.35, untuk Face Landmarker pretrained. Package diinstal tetapi belum diinisialisasi.
- Browser getUserMedia, HTMLVideoElement, requestAnimationFrame, performance timestamps, dan WebGL2.
- Blender sebagai external authoring tool opsional; tidak diinstal atau diotomatisasi oleh scaffold.
- Node.js minimal 22.12 untuk tooling, dengan setup diverifikasi di 24.16.0. Versi dependency langsung exact dan dependency transitive terkunci oleh package-lock.json.

Tidak menggunakan React pada scaffold karena belum ada kebutuhan state UI kompleks. Tidak menggunakan Next.js, database, ORM, dependency injection, event bus, generic product renderer, atau layanan cloud. Worker dan segmentation ditambahkan berdasarkan profiling atau kebutuhan correctness, bukan sebagai default.

## 3. Current implementation versus planned implementation

Sudah ada: halaman status, katalog draft, data model TypeScript, batas direktori fitur, pemeriksaan dokumen, dan build tooling.

Belum ada: akses kamera, model task/WASM lokal, inference, filter pose, Three.js scene, GLB topi, occluder, asset runtime validation, performance collector, dan automated feature tests. Kehadiran dependency atau interface tidak berarti fitur selesai.

## 4. Runtime boundaries

`main.ts` menjadi composition root kecil. Saat fitur ada, ia menghubungkan empat boundary:

1. Camera memiliki izin, stream, video element, dimension readiness, dan cleanup.
2. Tracking memiliki model, scheduling inference, coordinate adapter, validity, dan smoothing.
3. Hat memiliki selection, asset provenance, loading, placement, dan occluder yang relevan.
4. Rendering memiliki video/overlay alignment, scene, projection, material, draw loop, resize, dan GPU cleanup.

UI hanya meminta tindakan dan menampilkan status. Tidak boleh membuat stream atau loop kedua. Tracking tidak bergantung pada DOM UI. Data produk tidak mengimpor renderer. Rendering menerima hasil tracking yang telah dinormalisasi; ia tidak membaca matriks native MediaPipe secara langsung.

Data flow yang direncanakan: kamera menyediakan frame terbaru; tracking menghasilkan HeadPose atau unavailable; state aplikasi memilih produk ready; renderer menggabungkan pose dan placement produk lalu menggambar overlay di atas video. Diagnostics mencatat angka performa, bukan frame.

## 5. Coordinates, projection, and mirroring

Renderer memakai sistem right-handed: +X ke kanan, +Y ke atas, kamera menghadap -Z. Translation HeadPose menggunakan meter dalam ruang scene, quaternion berurutan x,y,z,w, dan scale visual bersifat dimensionless. Aset GLB menggunakan meter.

MediaPipe mengeluarkan landmark normalized dan transformation matrix dalam konvensi upstream. Adapter wajib memverifikasi urutan matriks, handedness, arah sumbu, canonical units, dan hubungan kamera dengan versi yang dipin. Jangan menyalin matriks ke Three.js tanpa verifikasi. Landmark depth tidak boleh dianggap sebagai kedalaman fisik hasil sensor.

Untuk v1, estimasi perspective projection dan depth diselaraskan dengan ukuran wajah dan canonical model. Posisi dalam meter merupakan representasi scene yang terkalibrasi secara visual, bukan ukuran kepala aktual. Intrinsics webcam belum terkalibrasi; distorsi lensa dan field of view bisa menghasilkan kesalahan. Jika diperlukan, buat calibration flow atau documented approximate projection, lalu uji dekat/jauh.

Transform produk disusun sebagai transform kepala, local translation placement, rotation placement dengan Euler XYZ radians, kemudian local scale. Placement adalah per-produk, bukan angka hardcoded global untuk semua topi. `visualScale` berasal dari kalibrasi visual kepala, bukan prediksi lingkar kepala.

Inference menerima frame kamera asli tanpa mirror. Preview video dan overlay dimirror bersama pada satu wrapper. Jangan mirror landmark lagi. Orientasi logo akan mengikuti satu transform tampilan yang konsisten. Jika nantinya ada output unmirrored atau screenshot, tentukan kontrak output terlebih dahulu.

Video dan canvas harus berbagi rect tampilan. Mulai dengan object-fit contain dan area letterbox yang sama. Jika memakai cover, hitung crop offset pada kedua lapisan. Resize viewport, rotasi device, resolusi stream berubah, dan DPR harus memperbarui projection serta ukuran canvas. Batasi DPR awal pada 1.5 dan ukur dampaknya.

## 6. Tracking and scheduling

Mulai dengan Face Landmarker `VIDEO`, satu target wajah, dan facial transformation output yang dibutuhkan. Detection/tracking threshold dikonfigurasi berdasarkan dokumentasi versi dan hasil pengujian, bukan confidence score sintetis yang tidak disediakan API.

Sediakan satu render loop dan maksimal satu inference aktif. Inferensi memakai frame terbaru dan monotonic timestamp. Sequence number dan timestamp mencegah hasil lama diterapkan setelah reset, stop, product switch, atau camera restart. Tidak ada queue frame yang tumbuh.

Main-thread inference adalah baseline pengukuran. MediaPipe video inference sinkron dapat memblokir UI. Jika profil menunjukkan budget gagal, pindahkan tracking ke satu dedicated worker. Evaluasi transfer ImageBitmap/VideoFrame, fallback browser, close resource, dan timestamp dengan time origin yang sama. Jangan menambah worker untuk rendering sebelum ada bukti kebutuhan.

Filter translation dan rotation dengan metode kecil yang dapat diukur, misalnya EMA berbasis delta time dan quaternion slerp. Reset filter saat stream atau target berganti. Hindari smoothing matriks atau Euler angles mentah. One Euro filter boleh dievaluasi bila EMA tidak memenuhi tradeoff jitter/latency.

`tracked` berarti hasil lolos validity internal, bukan janji pose fisik akurat. Reject nonfinite values, pose di luar rentang supported, frame terlalu tua, dan hasil model gagal. Ambang stale awal 150 ms. Pada unavailable, sembunyikan topi tanpa mempertahankan pose palsu. Petunjuk UI dapat memiliki hysteresis agar pesan tidak berkedip, tetapi visibility produk mengikuti validity.

Face Landmarker satu-face tidak membuktikan hanya satu orang ada dalam gambar dan tidak menjamin identity lock. Baseline memakai instruksi satu pengguna. Jika pengujian menunjukkan target berganti ke orang lain, reset tracking dan evaluasi multi-face detection atau selection sebelum mengklaim proteksi yang lebih kuat.

## 7. Camera and session lifecycle

`idle` tidak memiliki camera stream. Aksi eksplisit masuk `starting`. Setelah video ready, model ready, dan produk ready, masuk `active`; wajah hilang adalah tracking status tersendiri dan tidak perlu menghentikan stream. `error` menyimpan pesan yang aman dan dapat diberi retry.

Permintaan awal mengutamakan front camera dan ideal 640x480. `ideal` tidak menjamin resolusi; gunakan videoWidth/videoHeight aktual. Constraint gagal dapat diulang dengan constraint lebih sederhana. Tunggu metadata, readyState yang benar, dimensi nonzero, dan video play berhasil sebelum inference.

Permission denied, permission dismissal, perangkat tidak ditemukan, resource kamera sibuk, model gagal, dan WebGL gagal adalah kondisi berbeda. Browser dapat memetakan nama error secara tidak seragam; pesan harus sesuai bukti, bukan menebak.

Pada stop, navigation teardown, camera switch, atau error fatal: cancel loop, invalidate generation, stop semua MediaStreamTrack, kosongkan video srcObject, tutup model ketika tidak dipakai, dan dispose geometry/material/texture/renderer yang dimiliki. Async loader yang selesai setelah stop wajib dibuang, bukan ditampilkan.

Saat document hidden: masuk paused, hentikan stream, batalkan inference dan render, dan simpan productId saja. Saat kembali visible, tampilkan tindakan lanjutkan; jangan mengaktifkan kamera otomatis. `paused` berarti tidak ada kamera aktif. Tangani track ended, perangkat dicabut, dan WebGL context lost. Resume harus membangun ulang resource yang diperlukan tanpa menduplikasi loop.

Browser webcam membutuhkan secure context. Localhost didukung, tetapi membuka alamat IP LAN melalui HTTP belum tentu mendapat akses kamera. Integrasi marketplace kelak membutuhkan HTTPS dan, bila embedded, konfigurasi iframe permissions yang eksplisit.

## 8. Rendering and realistic hat limitations

Mulai dengan satu GLB, MeshStandardMaterial atau material glTF yang setara, color management yang benar, lighting sederhana, dan renderer transparan di atas video. Base-color/emissive textures berada di sRGB; normal/roughness data tidak diperlakukan sebagai warna. Pilih tone mapping dan exposure secara konsisten agar warna produk tidak berubah sembarangan.

Asset preparation harus mencatat ukuran, origin attachment, forward axis, placement, texture budget, dan provenance. Initial asset budget: maksimal 100k triangles, texture terpanjang maksimal 2048px, total download GLB target maksimal 10MB. Ini target awal, bukan validator yang sudah ada. Optimalkan berdasarkan profiling dan fidelity; jangan merusak logo untuk mengejar budget.

Head occluder berupa approximate head volume dan/atau face mesh dirender depth-only dengan colorWrite=false. Face mesh saja tidak mewakili puncak dan belakang kepala. Perlu bentuk proxy serta kalibrasi. Uji z-fighting, clipping brim, dan kesalahan saat menoleh. Occluder tidak boleh mengganti wajah kamera dengan wajah synthetic.

Hair segmentation atau hand segmentation hanya memberi mask 2D. Tidak otomatis memberi hubungan depth dengan topi. Tangan yang lewat di depan topi, rambut yang berada di luar brim, serta rambut yang seharusnya tertekan memerlukan desain compositing terpisah dan pengujian. Jangan meletakkan seluruh rambut selalu di depan seluruh topi.

Lighting baseline tidak mengukur pencahayaan fisik ruangan. Topi dapat tampak palsu ketika arah cahaya, exposure webcam, blur, atau white balance berubah. Contact shadow pada kepala proxy dapat membantu, tetapi bayangan pada wajah video membutuhkan compositing dan tidak langsung muncul dari Three.js shadow map. Fitur tersebut memerlukan spike, bukan klaim otomatis PBR.

## 9. Data models and source of truth

Kontrak aktual ada di `src/domain`:

- `HatProduct`: schemaVersion, id stabil, category hat, name, description, provenance, dan status draft/ready.
- `DraftHatProduct`: assetPath dan placement null. Tidak selectable.
- `ReadyHatProduct`: assetPath lokal dan placement terkalibrasi. Ready di manifest adalah readiness aset, bukan jaminan tracking quality atau persetujuan komersial.
- `AssetProvenance`: creator, sourceUrl opsional melalui null, license, dan commercialUseReviewed.
- `HatPlacement`: positionMeters, rotationRadians, dan scale. Nilai scale harus positif dan finite ketika validator runtime ditambahkan.
- `FrameContext`: capturedAtMs, sequence, width, height aktual.
- `HeadPose`: translationMeters, quaternion normalized, visualScale.
- `TrackingResult`: discriminated union tracked atau unavailable dengan alasan.
- `TryOnSession`: idle, starting, active, paused, atau error.
- `PerformanceSample`: renderFps, trackingFps, inferenceMs, dan frameAgeMs pada waktu sampling.

Katalog v1 berupa TypeScript statis dengan `satisfies`. Tidak ada database dan tidak ada HTTP API. Saat katalog berasal dari JSON, upload seller, atau jaringan, validasi runtime harus ditambahkan pada boundary tersebut. TypeScript tidak memvalidasi data eksternal. Periksa schemaVersion, id unik, path relatif lokal yang diizinkan, angka finite, GLB/resource limits, dan license status. Jangan membuat schema kedua sekarang yang menduplikasi tipe untuk katalog statis.

Tidak menyimpan wajah, landmark history, raw frame, ukuran biometrik, atau identitas orang. Session dan kalibrasi awal berada di memori dan hilang saat reload. Tidak ada localStorage otomatis.

## 10. Assets, models, security, and offline behavior

Scaffold belum menyertakan model task, WASM, maupun topi GLB. Package npm bukan pengganti model inference. Sebelum S1, model dan runtime harus disimpan lokal di public/models dengan catatan versi, upstream URL, SHA-256, dan lisensi. Jangan memakai CDN pihak ketiga saat runtime default.

GLB sebaiknya self-contained. External texture/model URLs, arbitrary remote scripts, dan aset terlalu besar harus ditolak pada boundary sebelum menerima aset penjual. Jangan memasukkan secret ke Vite client bundle. Gunakan textContent untuk teks produk, bukan HTML yang tidak dipercaya.

Runtime lokal tanpa internet baru bisa dibuktikan setelah seluruh aset model, WASM, dan produk tersedia. `npm ci` dan setup awal memerlukan internet. Tidak menambahkan service worker, CDN, atau telemetry hanya untuk menjanjikan offline sekarang.

Deployment kelak harus menetapkan CSP yang compatible dengan worker/WASM, HTTPS, permissions, cache versioning, asset license review, dan explicit privacy behavior. Ini bukan tugas deploy saat ini.

## 11. Extending above-chest products

Perluasan mengikuti kebutuhan kategori, bukan inheritance hierarchy spekulatif:

- Varian topi: reuse head pose, per-product placement, dan aset GLB berbeda.
- Topeng kaku: face attachment, wajah sebagai occluder, dan perhatian pada clipping hidung/mata. Topeng deformable memerlukan face-mesh deformation.
- Kalung: landmark leher dan torso, depth terhadap dagu/rambut/baju, serta kemungkinan chain deformation. Face Landmarker saja tidak cukup.
- Pakaian atas dada: Pose Landmarker atau pendekatan upper-body tracking, garment representation, shoulder/torso fitting, arm occlusion, dan handling torso terpotong. Realistic cloth deformation merupakan riset terpisah.

Setelah kategori kedua memiliki kebutuhan konkret, tambahkan union Product dan kontrak anchor yang benar-benar dipakai. Jangan membuat universal renderer, physics engine, atau loader plugin sebelum spike menunjukkan dua implementasi yang perlu berbagi boundary.

Generative image/video try-on boleh dievaluasi sebagai mode terpisah jika dibutuhkan. Ia tidak menjadi default karena latency, temporal consistency, dan product detail fidelity harus diuji. Jangan menganggap perubahan prompt cukup untuk mengubah hat AR menjadi clothing try-on.

## 12. Validation and observability

`npm run check` membuktikan dokumen wajib ada, Markdown tanpa em dash, tipe compile, dan static build sukses. Browser smoke check membuktikan halaman status tampil. Tidak ada pemeriksaan ini yang membuktikan model, camera lifecycle, placement, atau realism.

Feature tests nanti memeriksa coordinate conversion, mirror/crop alignment, stale frame, lifecycle ownership, loader races, dan manifest validation. Manual protocol serta quality targets ada di PRD dan docs/VALIDATION.md. Diagnostics lokal harus membedakan render FPS dan tracking FPS; scene dapat 60 FPS meskipun pose hanya diperbarui 5 FPS.

Catat perangkat, versi browser, resolution aktual, model/WASM version, aset, kondisi cahaya, dan rentang pose dalam setiap hasil. Ukur memory trend serta active track count dalam lifecycle tests. Jangan memperluas klaim kualitas ke hardware yang belum diuji.

## 13. Decisions and revisions

- D-01: client-side local processing, tanpa backend awal.
- D-02: pretrained tracking plus faithful 3D rendering, tanpa training dari nol.
- D-03: vanilla TypeScript single app, tanpa framework UI atau monorepo awal.
- D-04: single hat and single face as supported baseline.
- D-05: product draft berbeda secara tipe dari ready; tidak ada placeholder yang dianggap produk nyata.
- D-06: coordinate adapter wajib, visual scene units tidak diklaim sebagai physical measurements.
- D-07: single mirror wrapper, latest-frame scheduling, dan hide-on-invalid.
- D-08: worker, segmentation, cloth simulation, dan generic category framework menunggu evidence.
- D-09: future categories require different anchors and their own validation.
- D-10: model, WASM, dan GLB lokal serta provenance sebelum fitur aktif.

Review risiko awal sudah dimasukkan ke sections 5 sampai 11. Lihat docs/RISK-REVIEW.md untuk kegagalan dan mitigasi, serta ARCHITECTURE-ESSETIALS.md untuk outline cepat. Jika keputusan berubah, perbarui kedua dokumen dan tipe yang terkait dalam perubahan yang sama.
