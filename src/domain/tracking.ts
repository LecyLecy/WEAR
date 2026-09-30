import type { Vec3 } from './product';

/** Quaternion order matches Three.js: x, y, z, w. */
export type Quaternion = readonly [number, number, number, number];

/** Renderer coordinates: right-handed, +X right, +Y up, camera looks toward -Z. */
export interface HeadPose {
  readonly translationMeters: Vec3;
  readonly rotation: Quaternion;
  /** Dimensionless visual calibration multiplier. Not a measurement of physical head size. */
  readonly visualScale: number;
}

export interface FrameContext {
  /** Monotonic milliseconds, same performance time origin as inference and rendering. */
  readonly capturedAtMs: number;
  readonly sequence: number;
  readonly width: number;
  readonly height: number;
}

export type TrackingResult =
  | { readonly status: 'tracked'; readonly frame: FrameContext; readonly headPose: HeadPose }
  | {
      readonly status: 'unavailable';
      readonly frame: FrameContext;
      readonly reason: 'no-face' | 'unsupported-pose' | 'stale-frame' | 'model-error';
    };
