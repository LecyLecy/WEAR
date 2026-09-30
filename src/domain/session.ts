export type CameraIssue =
  | 'permission-denied'
  | 'device-unavailable'
  | 'device-busy'
  | 'unsupported-browser'
  | 'insecure-context';

/** In-memory only. Error categories must be mapped from real browser errors, not guessed. */
export type TryOnSession =
  | { readonly status: 'idle' }
  | { readonly status: 'starting' }
  | { readonly status: 'active'; readonly productId: string }
  | { readonly status: 'paused'; readonly productId: string }
  | { readonly status: 'error'; readonly message: string; readonly cameraIssue: CameraIssue | null };

/** Future local diagnostics, never raw camera frames or biometric storage. */
export interface PerformanceSample {
  readonly sampledAtMs: number;
  readonly renderFps: number;
  readonly trackingFps: number;
  readonly inferenceMs: number;
  readonly frameAgeMs: number;
}
