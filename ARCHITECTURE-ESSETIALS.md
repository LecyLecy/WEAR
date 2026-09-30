# WEAR Architecture Essentials

An outline of [ARCHITECTURE.md](ARCHITECTURE.md). The filename preserves the requested spelling. Updated: 2026-10-01.

## Product and implementation boundary

- WEAR is a local camera-based visual preview, starting with one hat.
- Future categories: hat variants, masks, necklaces, and clothing above the chest.
- Currently only the scaffold, data models, draft catalog, and status page exist. Camera access, model assets, GLB, and renderer are not implemented.
- Visual preview does not prove physical size or fit.
- Software UI and repository content use English.

## Stack

- Strict TypeScript, Vite, Three.js, and pretrained MediaPipe Face Landmarker.
- Node.js 22.12+, package-lock.json, and exact dependency versions.
- Desktop Chrome/Edge baseline; reference hardware is not yet specified.
- No initial backend, database, accounts, React, paid API, or training pipeline.

## Ownership

- Camera owns the stream and cleanup.
- Tracking owns the model, scheduling, adapter, validity, and filter.
- Hat owns selection, assets, placement, and occluder.
- Rendering owns the scene, alignment, projection, and GPU resources.
- main.ts connects features. One stream, one active inference, one render loop.

## Critical contracts

- Right-handed renderer, +X right, +Y up, camera facing -Z.
- Scene translation in meters, quaternion x/y/z/w, visual scale without physical-size claims.
- Convert and test MediaPipe native coordinates; never copy them directly without verification.
- Unmirrored inference; mirror video and overlay together exactly once.
- Latest frame only. Monotonic timestamps, sequence, and session generation reject old results.
- Hide the hat when tracking is unavailable or stale. Initial stale target: 150 ms.
- Stop/hidden/teardown ends tracks and loops; resume requires user action.

## Data and assets

- src/domain holds actual contracts: HatProduct, HatPlacement, TrackingResult, TryOnSession, PerformanceSample.
- Draft products have null asset/placement and cannot be selected.
- Initial static TypeScript catalog; future external data requires runtime validation.
- Model task, version-matched WASM, and GLB are not included; store them locally with provenance.
- No frames, biometrics, or session persistence in a database/localStorage.

## Realism and future expansion

- Faithful GLB, placement, head occlusion, stable tracking, and lighting determine realism.
- A face mesh is not a full-head scan. A hair mask does not provide depth or hair compression.
- Masks need face anchors; necklaces need neck/torso anchors; clothing needs body pose and garment deformation.
- Workers, segmentation, and generic category contracts follow demonstrated needs.

## Validation and change routing

- S0: npm run check and a browser smoke check, not evidence of try-on quality.
- Features: lifecycle, alignment, races, tracking validity, and visual evaluation.
- Initial targets: 30 render FPS, 15 tracking FPS, P95 inference frame age <=120 ms under documented conditions.
- Product details in PRD.md; technical design in ARCHITECTURE.md; risks and protocol in docs/.
- Decision changes must update this outline, the primary document, and relevant models/code.
