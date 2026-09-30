# WEAR

WEAR is a personal project for real-time, camera-based virtual try-on. Its first goal is a 3D hat that follows the user's head, with realistic visuals and faithful product geometry.

Future development leaves room for hat variants, masks, necklaces, and clothing visible only above the chest.

## Approach

Camera processing is planned to run locally in the browser, using pretrained computer vision and 3D rendering. The initial stack is TypeScript, Vite, Three.js, and MediaPipe. The first stage requires no paid API or application backend.

WEAR provides a visual preview. Visual sizing does not establish physical measurements or guarantee that a product will fit.

## Status

The project foundation and documentation are available. Camera access, tracking, inference model assets, the 3D hat asset, and the try-on renderer are not implemented yet. The project is not declared marketplace-ready.

## Branches

- `main` contains only this project overview.
- [`production`](https://github.com/LecyLecy/WEAR/tree/production) contains source code, technical documentation, and local setup instructions. The branch name does not mean the application is deployed.

Software and repository content are maintained in English.
