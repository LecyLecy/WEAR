# WEAR Validation Protocol

Status: protocol for future features; scaffold checks are separate. Updated: 2026-10-01.

## Scaffold acceptance

1. `npm ci` succeeds using the lockfile.
2. `npm run check` succeeds: required documents exist, Markdown has no em dashes, strict typecheck and production build pass.
3. The browser shows WEAR, scaffold status, one draft product, and a disabled button. No camera permission request or runtime console error occurs.
4. Scaffold runtime loads only local application assets; no video upload or model CDN requests occur.

None of these steps proves working try-on. Record camera access, inference, model assets, rendering, and realism as not implemented until the features are tested.

## Feature verification layers

### Logic and lifecycle

Test the transform adapter with known pose, translation, rotation, matrix layout, handedness, and unit conversions. Test mirroring and cropping on equally sized video/canvas layers and changing aspect ratios. Test invalid/nonfinite output, stale timestamps, monotonic sequences, and results arriving after session restart.

Test 10 start/stop cycles, stop during loading, product switching during loading, hidden/visible tabs, ended tracks, camera disconnection, and WebGL context loss. Check for duplicate loops/streams, old results, and resource leaks. Mocks do not replace live camera tests.

### Device record

For every evaluation, record OS, browser version, CPU/GPU, display DPR, actual camera resolution/FPS, inference delegate, model/WASM version, GLB revision, and application commit or source snapshot. The user's laptop specifications are unknown.

Initial measurement baseline: desktop Chrome/Edge, 640x480 if supported by the webcam, sufficient light, and one user. Mobile devices are not declared supported yet.

### Performance measurement

Warm up for 10 seconds, then measure for 60 seconds. Report render FPS and tracking FPS separately, median/P95 inference duration, P95 frame age at inference completion, peak memory where supported, dropped frames, and UI stalls.

Initial targets: render >=30 FPS, tracking >=15 FPS, and P95 inference-completion frame age <=120 ms. Timestamps share one time origin. Do not label frame age as end-to-end camera-to-display latency. Measure total latency using external high-speed footage or another documented method.

### Stability and placement

With the head still, record 10 seconds. Measure hat-anchor deviation from its median position as a proportion of face width. Target P95 <=2%. Evaluate rotation jitter separately; smoothing can reduce jitter while adding lag.

Test moving closer/farther and increasing yaw, pitch, and roll gradually. Report angles/conditions that actually pass and where tracking fails. Do not label untested angles as supported. Test recovery after the face leaves the frame.

### Visual fidelity

If a real hat is available, capture real and virtual footage with similar camera placement, pose, and lighting, with participant consent. Landmark-to-hat placement in real footage is not a perfect automatic label; annotations need review.

Manual review assesses shape/silhouette, logo/material/color fidelity, placement, temporal drift, head occlusion, hair/hand ordering, lighting, and perceived realism. Use a 1-to-5 scale with concrete notes: 1 means clearly wrong, 3 means a usable demo with visible artifacts, and 5 means consistently convincing under tested conditions. Report each dimension rather than one score that hides failures.

Initial realism gate for supported conditions: every dimension scores at least 4 in documented review, with no clipping/occlusion failure that undermines the preview throughout passing clips. This review remains subjective. Marketplace claims require broader user evaluation and thresholds approved by the product owner.

## Evaluation coverage

Start with dozens of debugging clips covering hair, face shapes, skin tones, glasses, lighting, distance, and motion. Record participant counts, not only highly correlated frame counts. Report failure rates by condition. A small sample does not establish population-wide performance.

Test practical adverse conditions: existing real hats, hands in front of the brim, cropped heads, side profiles, two people, backlighting, rapid movement, and low-resolution cameras. A failure may become a documented unsupported condition if the UI fails honestly; do not hide it to improve a demo.

## Consent and evidence handling

There is no automatic recording. Obtain participant consent before collecting footage. Store it in an agreed local location outside Git, define retention/deletion, and exclude identities from reports. Application diagnostics contain numbers only, not frames or biometric histories.

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
