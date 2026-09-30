/** Product contracts for the hat milestone. Other categories have no runtime implementation yet. */
export type Vec3 = readonly [number, number, number];

export interface AssetProvenance {
  readonly creator: string;
  readonly sourceUrl: string | null;
  readonly license: string;
  readonly commercialUseReviewed: boolean;
}

/** Applied after the tracked head transform. Units are meters; rotations are radians, XYZ order. */
export interface HatPlacement {
  readonly positionMeters: Vec3;
  readonly rotationRadians: Vec3;
  readonly scale: Vec3;
}

interface HatProductBase {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly category: 'hat';
  readonly name: string;
  readonly description: string;
  readonly provenance: AssetProvenance;
}

export interface DraftHatProduct extends HatProductBase {
  readonly status: 'draft';
  readonly assetPath: null;
  readonly placement: null;
}

export interface ReadyHatProduct extends HatProductBase {
  readonly status: 'ready';
  readonly assetPath: string;
  readonly placement: HatPlacement;
}

export type HatProduct = DraftHatProduct | ReadyHatProduct;
