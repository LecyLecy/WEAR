# WEAR Architecture

Status: technical plan plus runnable scaffold, not an implemented try-on system. Updated: 2026-10-01.

## 1. Constraints and design goals

WEAR processes webcam input on the user's device and renders 3D products in the browser. The first milestone covers one hat only. There is no backend, video storage, model-training pipeline, or paid API. The initial runtime target is desktop Chrome or Edge; other hardware and browsers require separate validation.

The architecture must keep the hat path simple without tying all future products to face landmarks. The initial data model implements hats only. Other categories are documented as future designs rather than a plugin system with no concrete users.

## 2. Stack and versions

- TypeScript 7.0.2, strict mode, for the application and data contracts.
- Vite 8.3.1 for the local development server and static production build.
- Three.js 0.186.1 and @types/three 0.186.0 for GLB assets, transforms, depth, and PBR materials.
- @mediapipe/tasks-vision 0.10.35 for pretrained Face Landmarker. The package is installed but not initialized.
- Browser getUserMedia, HTMLVideoElement, requestAnimationFrame, performance timestamps, and WebGL2.
- Blender as an optional external authoring tool; the scaffold does not install or automate it.
- Node.js 22.12 or newer for tooling, with this setup verified on 24.16.0. Direct dependency versions are exact; package-lock.json locks transitive dependencies.

The scaffold does not use React because complex UI state is not needed yet. It does not use Next.js, a database, ORM, dependency injection, event bus, generic product renderer, or cloud services. Add workers and segmentation based on profiling or correctness needs, not by default.

## 3. Current implementation versus planned implementation

Implemented: a status page, draft catalog, TypeScript data models, feature-directory boundaries, document checks, and build tooling.

Not implemented: camera access, local model task/WASM files, inference, pose filtering, a Three.js scene, hat GLB, occluder, runtime asset validation, performance collection, and automated feature tests. A dependency or interface does not make a feature complete.

Software UI, product text, HTML metadata, and repository documentation use English. Changing the language does not change feature scope, data identifiers, or runtime behavior.

## 4. Runtime boundaries

`main.ts` is a small composition root. Once features exist, it connects four boundaries:

1. Camera owns permission, stream, video element, dimension readiness, and cleanup.
2. Tracking owns the model, inference scheduling, coordinate adapter, validity, and smoothing.
3. Hat owns selection, asset provenance, loading, placement, and relevant occluders.
4. Rendering owns video-overlay alignment, scene, projection, materials, draw loop, resizing, and GPU cleanup.

The UI requests actions and displays state only. It must not create a second stream or loop. Tracking does not depend on the UI DOM. Product data does not import the renderer. Rendering receives normalized tracking results and does not read native MediaPipe matrices directly.

Planned data flow: the camera provides the latest frame; tracking produces HeadPose or unavailable; application state selects a ready product; the renderer combines pose with product placement and draws the overlay above the video. Diagnostics record performance numbers, not frames.

## 5. Coordinates, projection, and mirroring

The renderer uses a right-handed system: +X points right, +Y points up, and the camera looks toward -Z. HeadPose translation uses meters in scene space, quaternion order is x,y,z,w, and visual scale is dimensionless. GLB assets use meters.

MediaPipe outputs normalized landmarks and transformation matrices using upstream conventions. The adapter must verify matrix order, handedness, axis directions, canonical units, and camera relationships for the pinned version. Do not copy matrices into Three.js without verification. Landmark depth must not be treated as sensor-measured physical depth.

For v1, approximate perspective projection and depth are aligned with face size and the canonical model. Positions in meters are a visually calibrated scene representation, not actual head measurements. Webcam intrinsics are not calibrated; lens distortion and field of view can introduce errors. If needed, implement a calibration flow or document the approximate projection, then test near and far distances.

Compose the product transform from the head transform, local placement translation, placement rotation in Euler XYZ radians, and local scale. Placement is product-specific, not one hardcoded value for every hat. `visualScale` comes from visual head calibration, not head-circumference prediction.

Inference receives the original camera frame without mirroring. Mirror the preview video and overlay together in one wrapper. Do not mirror landmarks again. Logo orientation follows one consistent display transform. Define the output contract before adding unmirrored output or screenshots.

Video and canvas must share a display rectangle. Start with object-fit contain and identical letterboxing. If using cover, calculate crop offsets for both layers. Viewport resizing, device rotation, stream resolution changes, and DPR changes must update projection and canvas dimensions. Initially cap DPR at 1.5 and measure its impact.

## 6. Tracking and scheduling

Start with Face Landmarker `VIDEO`, one target face, and the required facial transformation output. Configure detection/tracking thresholds using version documentation and test results, not synthetic confidence scores absent from the API.

Use one render loop and at most one active inference. Inference uses the latest frame and a monotonic timestamp. Sequence numbers and timestamps prevent old results from being applied after reset, stop, product switching, or camera restart. No growing frame queue is allowed.

Main-thread inference is the measurement baseline. Synchronous MediaPipe video inference can block the UI. If profiling shows budget failures, move tracking to one dedicated worker. Evaluate ImageBitmap/VideoFrame transfers, browser fallback, resource closure, and timestamps sharing the same time origin. Do not add a rendering worker without evidence of need.

Filter translation and rotation with a small measurable method, such as delta-time-based EMA and quaternion slerp. Reset filters when the stream or target changes. Avoid smoothing raw matrices or Euler angles. Evaluate a One Euro filter if EMA fails the jitter/latency tradeoff.

`tracked` means the result passed internal validity checks, not that physical pose accuracy is guaranteed. Reject nonfinite values, poses outside supported ranges, old frames, and failed model results. The initial stale threshold is 150 ms. On unavailable, hide the hat rather than retain a false pose. UI guidance may use hysteresis to avoid flickering messages, but product visibility follows validity.

Single-face Face Landmarker does not prove there is only one person in the image and does not guarantee identity lock. The baseline instructs one user to remain in view. If testing shows target switching, reset tracking and evaluate multi-face detection or selection before claiming stronger protection.

## 7. Camera and session lifecycle

`idle` has no camera stream. An explicit action enters `starting`. Once video, model, and product are ready, enter `active`; a missing face is a separate tracking state and need not stop the stream. `error` stores a safe message and may offer retry.

The initial request prefers the front camera and ideal 640x480. `ideal` does not guarantee resolution; use actual videoWidth/videoHeight. Retry failed constraints with simpler constraints when appropriate. Wait for metadata, the correct readyState, nonzero dimensions, and successful video playback before inference.

Denied permission, dismissed permission, missing devices, a busy camera, model failure, and WebGL failure are different conditions. Browsers may map error names differently; messages must follow evidence rather than guesses.

On stop, navigation teardown, camera switching, or fatal error: cancel loops, invalidate the generation, stop all MediaStreamTrack instances, clear video srcObject, close unused models, and dispose owned geometry/material/texture/renderer resources. Discard asynchronous loads that complete after stop rather than display them.

When the document becomes hidden, enter paused, stop the stream, cancel inference and rendering, and retain only productId. When visible again, offer an explicit resume action; do not reactivate the camera automatically. `paused` means no camera is active. Handle ended tracks, disconnected devices, and WebGL context loss. Resume must rebuild required resources without duplicating loops.

Browser webcam access requires a secure context. Localhost is supported, but a LAN IP opened over HTTP may not allow camera access. Future marketplace integration requires HTTPS and explicit iframe permissions when embedded.

## 8. Rendering and realistic hat limitations

Start with one GLB, MeshStandardMaterial or equivalent glTF materials, correct color management, simple lighting, and a transparent renderer above the video. Base-color/emissive textures use sRGB; normal/roughness data is not interpreted as color. Choose consistent tone mapping and exposure to avoid arbitrary product-color changes.

Asset preparation must record dimensions, attachment origin, forward axis, placement, texture budget, and provenance. Initial asset budget: at most 100k triangles, longest texture edge at most 2048px, and target total GLB download at most 10MB. These are initial targets, not an implemented validator. Optimize using profiling and fidelity; do not damage logos to meet the budget.

The head occluder is an approximate head volume and/or face mesh rendered depth-only with colorWrite=false. A face mesh alone does not cover the top or back of the head. A proxy shape and calibration are required. Test z-fighting, brim clipping, and errors during turns. The occluder must not replace the camera face with a synthetic face.

Hair or hand segmentation supplies only a 2D mask. It does not automatically establish depth relative to the hat. Hands passing in front, hair outside the brim, and hair that should be compressed need separate compositing design and testing. Do not place all hair in front of the entire hat at all times.

Baseline lighting does not measure physical room lighting. The hat may look artificial when light direction, webcam exposure, blur, or white balance changes. Contact shadows on a head proxy can help, but shadows on the video face require compositing and do not appear automatically from a Three.js shadow map. These features need a technical spike, not an automatic PBR claim.

## 9. Data models and source of truth

Actual contracts live in `src/domain`:

- `HatProduct`: schemaVersion, stable id, category hat, name, description, provenance, and draft/ready status.
- `DraftHatProduct`: null assetPath and placement; not selectable.
- `ReadyHatProduct`: local assetPath and calibrated placement. Ready in the manifest means asset readiness, not a guarantee of tracking quality or commercial approval.
- `AssetProvenance`: creator, nullable sourceUrl, license, and commercialUseReviewed.
- `HatPlacement`: positionMeters, rotationRadians, and scale. Scale values must be positive and finite when runtime validation is added.
- `FrameContext`: capturedAtMs, sequence, and actual width/height.
- `HeadPose`: translationMeters, normalized quaternion, and visualScale.
- `TrackingResult`: discriminated union of tracked or unavailable with a reason.
- `TryOnSession`: idle, starting, active, paused, or error.
- `PerformanceSample`: renderFps, trackingFps, inferenceMs, and frameAgeMs at sampling time.

The v1 catalog is static TypeScript using `satisfies`. There is no database or HTTP API. When catalogs come from JSON, seller uploads, or the network, add runtime validation at that boundary. TypeScript does not validate external data. Check schemaVersion, unique ids, allowed local relative paths, finite numbers, GLB/resource limits, and license status. Do not duplicate static catalog types in a second schema now.

Do not store faces, landmark history, raw frames, biometric measurements, or personal identities. Initial session state and calibration remain in memory and disappear on reload. There is no automatic localStorage persistence.

## 10. Assets, models, security, and offline behavior

The scaffold includes no model task, WASM, or hat GLB. An npm package does not replace an inference model. Before S1, store the model and runtime locally in public/models with version, upstream URL, SHA-256, and license records. Do not use third-party CDNs in the default runtime.

Prefer self-contained GLB files. Reject external texture/model URLs, arbitrary remote scripts, and oversized assets at the boundary before accepting seller assets. Do not put secrets in the Vite client bundle. Use textContent for product text, not untrusted HTML.

Offline local runtime can only be demonstrated after all model, WASM, and product assets are available. `npm ci` and initial setup need internet. Do not add a service worker, CDN, or telemetry merely to promise offline behavior now.

Future deployment must define a worker/WASM-compatible CSP, HTTPS, permissions, cache versioning, asset-license review, and explicit privacy behavior. Deployment is not part of the current task.

## 11. Extending above-chest products

Extensions follow category needs rather than a speculative inheritance hierarchy:

- Hat variants: reuse head pose with product-specific placement and different GLB assets.
- Rigid masks: face attachment, the face as an occluder, and attention to nose/eye clipping. Deformable masks require face-mesh deformation.
- Necklaces: neck and torso landmarks, depth relative to the chin/hair/clothing, and possible chain deformation. Face Landmarker alone is insufficient.
- Clothing above the chest: Pose Landmarker or another upper-body tracker, garment representation, shoulder/torso fitting, arm occlusion, and cropped-torso handling. Realistic cloth deformation is a separate research problem.

Once a second category has concrete requirements, add a Product union and anchor contracts that are actually used. Do not build a universal renderer, physics engine, or loader plugin before a spike demonstrates two implementations needing a shared boundary.

Generative image/video try-on may be evaluated as a separate mode if needed. It is not the default because latency, temporal consistency, and product-detail fidelity must be tested. Do not assume a prompt change is enough to turn hat AR into clothing try-on.

## 12. Validation and observability

`npm run check` proves required documents exist, Markdown has no em dashes, types compile, and the static build succeeds. A browser smoke check proves the status page renders. None of these checks proves model behavior, camera lifecycle, placement, or realism.

Future feature tests cover coordinate conversion, mirror/crop alignment, stale frames, lifecycle ownership, loader races, and manifest validation. The manual protocol and quality targets are in PRD and docs/VALIDATION.md. Local diagnostics must distinguish render FPS from tracking FPS; a scene can render at 60 FPS while updating pose only 5 times per second.

Record device, browser version, actual resolution, model/WASM version, assets, lighting, and pose ranges with every result. Measure memory trends and active-track counts in lifecycle tests. Do not extend quality claims to untested hardware.

## 13. Decisions and revisions

- D-01: client-side local processing, without an initial backend.
- D-02: pretrained tracking plus faithful 3D rendering, without training from scratch.
- D-03: one vanilla TypeScript app, without an initial UI framework or monorepo.
- D-04: one hat and one face as the supported baseline.
- D-05: draft and ready products have distinct types; no placeholder is treated as a real product.
- D-06: a coordinate adapter is mandatory; visual scene units are not claimed as physical measurements.
- D-07: one mirror wrapper, latest-frame scheduling, and hide-on-invalid behavior.
- D-08: workers, segmentation, cloth simulation, and generic category frameworks wait for evidence.
- D-09: future categories require different anchors and their own validation.
- D-10: local model, WASM, and GLB assets with provenance before enabling features.
- D-11: English software and repository content, including future additions.

The initial risk review is incorporated in sections 5 through 11. See docs/RISK-REVIEW.md for failures and mitigations, and ARCHITECTURE-ESSETIALS.md for a quick outline. When decisions change, update both documents and related types in the same change.
