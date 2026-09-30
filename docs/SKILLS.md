# WEAR Skill Research

Verified source discovery: 2026-10-01, through GitHub API and raw SKILL.md reads. No external skill was installed globally or copied into this project. The user requested discovery of suitable skills; installation is a separate optional next step. Existing globally available skills remain usable.

## Already available in this session

- **Ponytail:** required before implementation and during review. Used for this scaffold: no backend, generic renderer hierarchy, or speculative runtime modules.
- **Caveman:** required at full level for assistant chat only.
- **MarkItDown:** required before supported document extraction. No binary source document was supplied for this setup; Markdown sources do not need reconversion.
- **Headroom integration:** verify with headroom doctor. At setup, persistent localhost proxy on port 8787 and Codex routing passed. Do not infer ongoing health from this historical record.
- **vercel:agent-browser / agent-browser-verify:** browser interaction and local-server verification, already in the global skill catalog. They do not require deploying to Vercel. Read the relevant SKILL.md before applying.

## External candidates from OpenAI

Source: [openai/skills](https://github.com/openai/skills), inspected revision `49f948faa9258a0c61caceaf225e179651397431`.

1. [playwright](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright/SKILL.md): suitable for camera UI lifecycle flows, browser errors, snapshots, and screenshots. Uses Playwright CLI, not mandatory test-file generation. Requires npx. Bundled wrapper is shell-oriented; on Windows validate shell availability or use direct CLI/tool fallback. Fake camera input helps regression checks but does not prove visual realism.
2. [security-best-practices](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-best-practices/SKILL.md): useful when explicitly reviewing camera privacy, external asset boundaries, and frontend security. Its declared trigger is explicit security guidance/review, not every generic code change. Load TypeScript/JavaScript frontend references when used.

Use the globally available skill-installer helper if installation is requested. Pin a reviewed ref and inspect source/license before installation. These skills were not installed as a side effect of research.

## Three.js-specific candidates

Source: [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills), inspected revision `b1c623076c661fc9b03dac19292e825a5d106823`. GitHub metadata did not report a recognized SPDX license during discovery; do not assume copying or redistribution is authorized. Review repository licensing before vendoring or installing.

1. [threejs-fundamentals](https://github.com/CloudAI-X/threejs-skills/blob/b1c623076c661fc9b03dac19292e825a5d106823/skills/threejs-fundamentals/SKILL.md): scene, camera, renderer, Object3D hierarchy, and coordinates. Relevant to the first hat transform spike.
2. [threejs-loaders](https://github.com/CloudAI-X/threejs-skills/blob/b1c623076c661fc9b03dac19292e825a5d106823/skills/threejs-loaders/SKILL.md): GLTFLoader, textures, and asset loading. Relevant to model loading, cleanup, and failed asset UX.
3. [threejs-materials](https://github.com/CloudAI-X/threejs-skills/blob/b1c623076c661fc9b03dac19292e825a5d106823/skills/threejs-materials/SKILL.md): PBR material and shader concepts. Relevant to cloth appearance and texture handling.
4. [threejs-lighting](https://github.com/CloudAI-X/threejs-skills/blob/b1c623076c661fc9b03dac19292e825a5d106823/skills/threejs-lighting/SKILL.md): lights, shadows, and image-based lighting. Relevant to controlled-light baseline, but not proof that real room light is estimated.

Discovery inspected front matter and introductory content, not a full dependency/security audit. These are candidates, not activated skills. Re-read the entire selected skill and verify examples against the pinned Three.js version before use. General-purpose rendering advice does not replace WEAR camera, coordinate, and privacy contracts.

## MediaPipe references, not agent skills

- [Face Landmarker documentation](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js): initialization, output, running mode, and browser inference behavior.
- [Three.js documentation](https://threejs.org/docs/): API authority for the pinned rendering version.
- [Blender manual](https://docs.blender.org/manual/en/latest/): authoring and glTF export workflow.

No specialized MediaPipe virtual-try-on skill was verified in this research. Do not invent a skill name or claim a renderer skill solves head pose or garment deformation.

## Suggested adoption order

Use existing Ponytail and browser tooling first. Add Playwright if repeated UI/lifecycle regression work warrants it. Review Three.js fundamentals/loaders/materials during the first renderer implementation, subject to licensing and compatibility. Lighting follows an asset-and-placement baseline. Security skill is used when its explicit review trigger applies. Do not install a large bundle just because it contains relevant keywords.
