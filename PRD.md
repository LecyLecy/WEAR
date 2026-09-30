# WEAR Product Requirements

Status: approved direction, pre-feature scaffold. Updated: 2026-10-01.

## 1. Product definition

WEAR is a camera-based virtual try-on application. Users see themselves wearing a virtual product that follows their movement, starting with one 3D baseball cap. The long-term goal is a product preview experience for marketplaces, with possible extensions to hat variants, masks, necklaces, and clothing visible only above the chest.

The current project is personal, runs locally, and requires no paid services. Quality goals reflect marketplace needs, but the scaffold or an early demo must not be claimed to meet those standards already.

## 2. Users and needs

- Prospective buyers want to preview a product on themselves without uploading photos or installing a dedicated application.
- The project owner wants to build and measure realistic virtual try-on using existing hardware.
- Sellers at a later stage need assets that preserve the original product's shape, color, stitching, and logos.

The primary user for the first milestone is one person in front of a laptop or desktop webcam. Seller onboarding, marketplace catalogs, checkout, and account management are not in scope yet.

## 3. Product principles

1. The product name is always `WEAR`, in uppercase throughout the UI and documentation.
2. Previews must preserve product identity; do not alter product details to produce a more convincing image.
3. Users explicitly start the camera and can stop it.
4. Video and tracking results are processed locally. Uploads, biometric storage, and network analytics are disabled by default.
5. Invalid tracking hides the virtual product and shows guidance. The hat must not freeze in place as if tracking were still valid.
6. Visual size does not establish physical fit. WEAR does not promise fit or head measurements in centimeters.
7. Explain limitations in language users understand, without exposing irrelevant implementation details.
8. Software UI, product text, repository documentation, and GitHub overview content are written in English.

## 4. Scope and stages

### S0: foundation, current request

Product and technical documents, data models, feature directories, locked dependencies, a runnable status page, a skill catalog, and a validation protocol. No active camera, inference model, hat GLB, or realism claims are included. S0 is complete when documents are consistent and the scaffold passes the build and browser smoke check.

### S1: one-hat functional try-on

- The camera can start and stop, with understandable errors.
- One face is the target. The initial model is not a multi-user system.
- One ready hat follows head position and rotation.
- The product is hidden when the face disappears or the pose is outside supported conditions.
- Reset and simple visual position or scale calibration are available when needed.
- The mirrored preview does not misalign the hat or logo relative to the user.
- Model and asset loading states are separate from camera state.

### S2: realism and reliability

- Placement is calibrated for the correct product asset.
- Head occlusion prevents the back of the hat from appearing in front of the face.
- Tracking is stable without excessive smoothing latency.
- PBR materials and baseline lighting suit the defined evaluation conditions.
- Hair and hands are handled based on observed failures; segmentation alone is not treated as a solution to depth or hair deformation.
- Switching hats does not leave old assets behind or introduce race conditions.
- Performance and visual quality are tested across multiple users and devices.

### S3: future upper-body products

Hat variants share the head-tracking path. Masks need face attachment or a face mesh, necklaces need neck and upper-torso pose, and clothing above the chest needs body pose, occlusion, visual fitting, and a fabric-deformation approach. Each category needs its own technical spike and acceptance criteria before implementation.

A camera view showing only the area above the chest does not reveal the full body shape. The garment's lower edge must crop naturally at the viewport boundary. Do not claim full-body try-on, cloth-drape simulation, or accurate clothing size.

## 5. User flow for S1

1. The user opens WEAR and reads what the preview does and its limitations.
2. The user selects a ready hat. Draft products cannot be selected.
3. The user starts the camera and grants browser permission.
4. The application loads local assets and asks the user to place one face in view.
5. The hat appears when the pose is valid. Guidance is shown when the face disappears, is too close, or turns too far.
6. The user can reset calibration, switch to another ready product, or stop the camera.

Screenshots, recording, sharing, and saved calibration profiles are not initial requirements. Adding them requires explicit product and data-policy decisions.

## 6. Functional requirements

- FR-01: do not request camera access before a user action.
- FR-02: start, stop, retry, and repeated start must maintain only one camera stream and one tracking loop.
- FR-03: denied permission, a missing or busy camera, and incompatible browsers must have understandable messages and recovery paths.
- FR-04: inference processes only the latest frame, without a growing queue.
- FR-05: stale or invalid results hide the hat before the next render after that status is established.
- FR-06: draft products, failed assets, and failed models must not produce fake previews or unexplained blank screens.
- FR-07: hiding the tab suspends loops and stops the stream according to the architecture's lifecycle contract.
- FR-08: resizing, aspect ratio, device pixel ratio, and mirroring must preserve video-overlay alignment.
- FR-09: users can stop; all camera tracks end and GPU resources are cleaned up.
- FR-10: manual calibration is a visual adjustment, not a physical measurement.
- FR-11: assets and models must have source, version, and license records before use.

## 7. Quality and release gates

The initial baseline is stable desktop Chrome or Edge, an RGB webcam, one face, sufficient lighting, and an unobstructed head. The user's laptop specifications are unknown; support and performance must be demonstrated rather than assumed.

S1/S2 targets to measure on a reference device:

- At least 30 render FPS and 15 tracking FPS at a 640x480 webcam viewport for 60 seconds after warmup.
- P95 inference-completion frame age at most 120 ms; report camera-to-display latency separately because application timestamps do not measure the full sensor and display latency.
- With the head still, P95 hat-anchor deviation from its median position at most 2% of face width during a 10-second clip.
- After stop, all MediaStreamTrack instances must be ended; 10 start/stop cycles must not add streams or loops.
- The hat must not remain visible after tracking becomes unavailable. Review the initial 150 ms stale timeout using evaluation results.
- Compare virtual footage with a real hat when available. Report placement, drift, product details, occlusion, and lighting separately.

These numbers are initial targets, not achieved results. Test pose ranges first, then record passing ranges as supported conditions. Human visual review remains necessary; FPS or landmark accuracy alone does not prove realism.

See [docs/VALIDATION.md](docs/VALIDATION.md) for methods, evidence limits, and evaluation coverage. S0 has no realism acceptance gate because the feature does not exist yet.

## 8. Data and assets

The initial stage uses a pretrained deep learning model, without training from scratch. Product data includes GLB files, textures, placement, and provenance. Create evaluation videos only with participant consent, store them locally outside the repository, and agree on a retention policy before collection.

A small debugging dataset does not prove broad population performance. Clothing datasets such as VITON do not automatically solve real-time hat AR. Consider custom training only when a measured baseline fails and relevant licensed data is available.

## 9. Out of scope and open questions

Excluded: production hosting, backend, database, accounts, checkout, multi-person tracking, guaranteed smartphone support, generated-video try-on, physical size prediction, and full cloth simulation.

Questions that do not block the scaffold: laptop/GPU specifications, access to a real hat, who will create the 3D asset, the final target browser, the next accessory priority, and the minimum quality prospective users accept. Do not fill these gaps with assumptions presented as approved decisions.

## 10. Risk review incorporated

The initial review identified webcam head-measurement limitations, lack of virtual hair compression, landmarks that are not a full-head scan, double mirroring, incorrect occlusion, and inference bottlenecks. The scope was refined to a single-hat visual preview, with explicit failure handling, measurable quality gates, and separate future-category designs. See [docs/RISK-REVIEW.md](docs/RISK-REVIEW.md) for decisions.
