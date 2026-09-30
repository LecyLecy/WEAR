import type { HatProduct } from '../domain/product';

export const hats = [
  {
    schemaVersion: 1,
    id: 'baseball-cap-demo',
    category: 'hat',
    name: 'Baseball cap pertama',
    description: 'Aset 3D dan kalibrasi belum tersedia. Produk ini belum dapat dicoba.',
    status: 'draft',
    assetPath: null,
    placement: null,
    provenance: {
      creator: 'Belum ditentukan',
      sourceUrl: null,
      license: 'Belum ditentukan',
      commercialUseReviewed: false,
    },
  },
] as const satisfies readonly HatProduct[];
