# WEAR Initial Risk and Scope Review

Reviewed: 2026-10-01. This review is incorporated in the PRD, architecture, essentials, and scaffold. Feature risks have not been tested because the features are not implemented yet.

## What can break and what was changed

1. **The hat attaches to the face rather than the head.** Face landmarks do not cover the full skull. Architecture requires a canonical-to-scene adapter, visual calibration, and a separate head proxy. The PRD does not promise physical size.
2. **The hat moves in the wrong direction or the logo is mirrored twice.** Mirror/crop/axis conventions are inconsistent. Architecture defines unmirrored input, one mirror wrapper, renderer coordinates, and alignment tests.
3. **Tracking looks smooth but lags.** High render FPS can hide slow inference or a frame queue. Architecture uses the latest frame, one active inference, timestamps/sequences, and separate metrics.
4. **The hat freezes when the face disappears.** The last pose remains in use. The PRD requires hide-on-invalid; architecture adds an initial 150 ms stale timeout.
5. **The hat appears in front of head parts that should hide it.** The face mesh is too small or the occluder is wrong. Architecture requires an approximate full-head proxy and clipping evaluation, not just a face mesh.
6. **Hair or hands have the wrong depth order.** Segmentation masks do not provide depth. Segmentation waits for concrete failures, but correct occlusion remains a realism gate before marketplace claims.
7. **Models or assets fail to load.** The npm package does not contain all model tasks, paths may be broken, or WASM versions may mismatch. The scaffold identifies missing files; architecture requires versioned local assets, checksums, loading/error states, and retry.
8. **The browser slows or hangs.** Synchronous inference, heavy assets, or high DPR can exceed budgets. Start with a small baseline, cap budgets, and profile; add a worker only when needed. Do not assume every laptop has a sufficient GPU.
9. **Streams or GPU resources leak.** Repeated starts, hidden tabs, context loss, or late asynchronous loads cause leaks. Architecture defines ownership, generation invalidation, cleanup, and lifecycle tests.
10. **The asset looks realistic but represents the wrong product.** Logos, shape, material, or colors change. The PRD requires product fidelity. Generative try-on is not the default.
11. **Users mistake visual fit for physical fit.** Scene meters are not physical head measurements. The PRD and UI must distinguish preview from fit prediction.
12. **The hat design blocks clothing expansion.** Face tracking does not provide torso pose. Architecture separates category anchor requirements and delays generic product frameworks until a second category exists.

## Edge cases that must not be forgotten

- Denied, dismissed, or pending permission; missing, busy, or disconnected cameras; rejected video autoplay/playback.
- Zero video dimensions before metadata readiness; changing resolution; camera switching; browser background throttling.
- Two people in view, identity switches, partial faces, profile views, glasses, bangs, hands, existing real hats, and heads too close or cropped by the viewport.
- Backlighting, webcam noise, motion blur, changing exposure/white balance, dark hair/backgrounds, and very small faces.
- Resize, fullscreen, browser zoom, high DPR, viewport letterboxing/cropping, and front/back camera mirroring differences.
- Slow downloads, offline setup, corrupt models, GPU delegate failures, slow CPU fallback, unsupported WebGL2, and context loss.
- Product switching during GLB loading, loads finishing after stop, shared-texture disposal, duplicate ids, and unsupported manifest versions.
- Necklaces hidden by the chin/hair, masks intersecting the nose, garments cropped at the camera boundary, and shoulders/arms outside the frame. These are future-category requirements, not current implemented support.

## What was over-engineered and removed from the plan

- Training pipeline: unnecessary for the pretrained tracking baseline.
- Backend/database/auth: unnecessary for a local visual preview.
- React/Next.js and a monorepo: unnecessary for a single-page scaffold.
- Universal category plugins and renderer inheritance: no two concrete categories exist yet.
- Default workers, default segmentation, a physics engine, and a service worker: complexity costs are not justified by evidence yet.
- Persisted calibration profiles, recording, sharing, and seller dashboards: not requested yet.
- Duplicate runtime JSON schema: a static TypeScript catalog is sufficient now; add runtime validation when external data enters the system.

Feature directories and exported data types not yet used at runtime are retained as the scaffold explicitly requested by the user. There is no unused runtime implementation or fake camera behavior. Remove placeholder implementations when real features replace them.

## Residual risks and next evidence

Unknowns: user hardware, achievable asset quality, model/WASM version behavior, camera intrinsics, passing pose ranges, and subjective realism thresholds.

The next evidence-producing steps are camera lifecycle work and a coordinate/projection spike with one hat asset. Do not add segmentation or replace the model before recording baseline failures. If occlusion or lighting still fails the gates, document limitations and run the relevant spike before claiming marketplace readiness.
