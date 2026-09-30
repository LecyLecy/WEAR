# WEAR

WEAR is a personal virtual try-on project that processes camera input locally. The first milestone is one 3D hat that follows the user's head. Future development leaves room for masks, necklaces, and clothing visible only above the chest.

## Current status

The scaffold runs as a browser application. Its catalog contains one draft without an asset. Camera access, model tracking, 3D rendering, occlusion, and realism evaluation are not implemented yet. The try-on button is deliberately disabled. There is no application backend, user account system, database, or paid service.

## Running locally

Source code and full documentation live on the `production` branch of the [WEAR repository](https://github.com/LecyLecy/WEAR/tree/production). The `main` branch contains only the project overview. The production branch name does not mean the application is deployed.

Use Node.js 22.12 or newer; this setup was verified with Node.js 24.16.0.

```powershell
Set-Location E:\Projects\WEAR
npm ci
npm run dev
```

Open the localhost URL printed by Vite. These commands start only a local development server. To verify the scaffold:

```powershell
npm run check
npm run preview
```

`preview` requires a completed `build`. No environment variables or API keys are needed. The first `npm ci` needs internet; after dependencies are available, the scaffold can run locally. Future inference requires local model and WASM assets that are not included yet.

## Documents

- [PRD.md](PRD.md): product goals, users, scope, requirements, and acceptance criteria.
- [ARCHITECTURE.md](ARCHITECTURE.md): the primary technical design and data models.
- [ARCHITECTURE-ESSETIALS.md](ARCHITECTURE-ESSETIALS.md): an outline of critical decisions. The filename preserves the spelling requested initially.
- [ARCHIRECTURE.md](ARCHIRECTURE.md): a pointer for the alternative spelling in the initial request, not a second technical document.
- [AGENTS.md](AGENTS.md): working rules and document-update guidance.
- [docs/RISK-REVIEW.md](docs/RISK-REVIEW.md): failure modes, edge cases, and simplification decisions.
- [docs/VALIDATION.md](docs/VALIDATION.md): how to demonstrate performance and visual quality.
- [docs/SKILLS.md](docs/SKILLS.md): discovered skills, applicability, and installation status.
- [docs/SETUP-VERIFICATION.md](docs/SETUP-VERIFICATION.md): scaffold verification results and the limits of completion claims.

## Structure

```text
src/
  main.ts                  scaffold status page
  styles.css               page styling
  catalog/hats.ts          local draft catalog
  domain/                  product, tracking, and session contracts
  features/camera/         planned camera boundary
  features/tracking/       planned inference boundary
  features/hat/            planned hat boundary
  features/rendering/      planned renderer boundary
public/
  assets/hats/             future 3D product assets
  models/                  future inference model and WASM assets
docs/                      risks, validation, and skill catalog
scripts/                   document checks
tests/                     future feature-testing guidance
```

Next milestones: camera permission and correct lifecycle, then one detected head, then a calibrated hat GLB. Do not call a milestone complete merely because a hat appears in one frame.

Software text and repository documentation use English.
