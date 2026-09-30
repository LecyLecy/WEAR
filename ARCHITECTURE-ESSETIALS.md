# WEAR Architecture Essentials

Ringkasan outline dari [ARCHITECTURE.md](ARCHITECTURE.md). Filename mengikuti ejaan yang diminta. Updated: 2026-10-01.

## Product and implementation boundary

- WEAR: local camera virtual preview, satu topi dahulu.
- Masa depan: varian topi, topeng, kalung, dan pakaian atas dada.
- Saat ini hanya scaffold, data model, katalog draft, dan halaman status. Kamera, model, GLB, dan renderer belum ada.
- Visual preview tidak membuktikan ukuran fisik atau fit.

## Stack

- TypeScript strict, Vite, Three.js, MediaPipe Face Landmarker pretrained.
- Node.js 22.12+, package-lock.json dan dependency exact.
- Browser desktop Chrome/Edge sebagai baseline; target hardware belum ditentukan.
- Tanpa backend, database, akun, React, paid API, atau training pipeline awal.

## Ownership

- Camera memiliki stream dan cleanup.
- Tracking memiliki model, scheduling, adapter, validity, dan filter.
- Hat memiliki selection, aset, placement, dan occluder.
- Rendering memiliki scene, alignment, projection, dan GPU resources.
- main.ts menghubungkan fitur. Satu stream, satu inference aktif, satu render loop.

## Critical contracts

- Renderer right-handed, +X kanan, +Y atas, kamera menuju -Z.
- Translation scene dalam meter, quaternion x/y/z/w, scale visual tanpa klaim ukuran fisik.
- MediaPipe native coordinates harus dikonversi dan diuji, bukan disalin langsung.
- Inference unmirrored; video dan overlay dimirror bersama sekali.
- Frame terbaru saja. Timestamp monotonic, sequence, dan session generation mencegah hasil lama.
- Hide topi pada tracking unavailable atau stale. Stale target awal 150 ms.
- Stop/hidden/teardown menghentikan track serta loop; resume melalui tindakan pengguna.

## Data and assets

- src/domain adalah kontrak actual: HatProduct, HatPlacement, TrackingResult, TryOnSession, PerformanceSample.
- Draft memiliki null asset/placement dan tidak selectable.
- Katalog statis TypeScript awal. Data eksternal kelak wajib runtime validation.
- Model task, version-matched WASM, dan GLB belum disertakan; simpan lokal dengan provenance.
- Tidak menyimpan frame, biometrik, atau session ke database/localStorage.

## Realism and future expansion

- GLB faithful, placement, head occlusion, stable tracking, dan lighting menentukan realism.
- Face mesh bukan full-head scan. Hair mask bukan depth atau kompresi rambut.
- Topeng perlu face anchors; kalung perlu neck/torso; baju perlu pose tubuh dan garment deformation.
- Worker, segmentation, dan kategori generic hanya setelah kebutuhan terbukti.

## Validation and change routing

- S0: npm run check dan browser smoke check; bukan evidence kualitas try-on.
- Fitur: lifecycle, alignment, race, tracking validity, dan visual evaluation.
- Target awal: 30 render FPS, 15 tracking FPS, P95 inference frame age <=120 ms pada kondisi terdokumentasi.
- Detail produk di PRD.md; teknik di ARCHITECTURE.md; risiko dan protocol di docs/.
- Perubahan keputusan wajib memperbarui outline ini, dokumen utama, dan model/kode terkait.
