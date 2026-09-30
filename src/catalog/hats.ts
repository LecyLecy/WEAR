import type { HatProduct } from '../domain/product';

export const hats = [
  {
    schemaVersion: 1,
    id: 'baseball-cap-demo',
    category: 'hat',
    name: 'First baseball cap',
    description: 'The 3D asset and calibration are not ready yet. This product cannot be tried on.',
    status: 'draft',
    assetPath: null,
    placement: null,
    provenance: {
      creator: 'Not specified yet',
      sourceUrl: null,
      license: 'Not specified yet',
      commercialUseReviewed: false,
    },
  },
] as const satisfies readonly HatProduct[];
