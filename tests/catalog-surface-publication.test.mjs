import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function apiWith(config) {
  const window = { KRASKU: { catalogSnapshot: { categories: [], products: [], catalogConfig: config } } };
  const context = { window };
  vm.runInNewContext(await readFile(new URL('../js/catalog-navigation.js', import.meta.url), 'utf8'), context);
  vm.runInNewContext(await readFile(new URL('../js/api.js', import.meta.url), 'utf8'), context);
  return window.KRASKU.api;
}

async function apiWithSnapshotConfig(config) {
  const window = {
    KRASKU: {
      catalogConfig: { surfaceCatalogueEnabled: true, seedSurfacesFromText: true },
      catalogSnapshot: {
        categories: [{ slug: 'gruntovki', name: 'Грунтовки' }],
        products: [{ id: 1, name: 'Грунтовка по металлу', category: 'Грунтовки', paintFor: 'Для металла' }],
        catalogConfig: config
      }
    }
  };
  const context = { window, KRASKU: window.KRASKU };
  vm.runInNewContext(await readFile(new URL('../js/catalog-surface-seed.js', import.meta.url), 'utf8'), context);
  vm.runInNewContext(await readFile(new URL('../js/catalog-navigation.js', import.meta.url), 'utf8'), context);
  vm.runInNewContext(await readFile(new URL('../js/api.js', import.meta.url), 'utf8'), context);
  return window.KRASKU.api;
}

async function apiWithUnannotatedSnapshot() {
  const window = {
    KRASKU: {
      catalogConfig: { surfaceCatalogueEnabled: true, seedSurfacesFromText: true },
      catalogSnapshot: {
        categories: [
          { slug: 'gruntovki', name: 'Грунтовки' },
          { slug: 'kraski', name: 'Краски' }
        ],
        products: [
          { id: 1, name: 'Грунтовка', category: 'Грунтовки' },
          { id: 2, name: 'Краска', category: 'Краски' }
        ],
        catalogConfig: { surfaceCatalogueEnabled: true }
      }
    }
  };
  const context = { window, KRASKU: window.KRASKU };
  vm.runInNewContext(await readFile(new URL('../js/catalog-surface-seed.js', import.meta.url), 'utf8'), context);
  vm.runInNewContext(await readFile(new URL('../js/catalog-navigation.js', import.meta.url), 'utf8'), context);
  vm.runInNewContext(await readFile(new URL('../js/api.js', import.meta.url), 'utf8'), context);
  return window.KRASKU.api;
}

test('published surface catalogue exposes its navigation before products are fully indexed', async () => {
  const api = await apiWith({ surfaceCatalogueEnabled: true });

  assert.equal(api.surfaceCatalogueEnabled(), true);
});

test('published WordPress snapshot retains the static surface seed setting', async () => {
  const api = await apiWithSnapshotConfig({ surfaceCatalogueEnabled: true });

  assert.deepEqual(
    JSON.parse(JSON.stringify(api.getAvailableCategoriesForSurface('metal'))),
    [{ name: 'Грунтовки', count: 1 }]
  );
});

test('surface second level stays navigable while imported products await annotation', async () => {
  const api = await apiWithUnannotatedSnapshot();

  assert.deepEqual(
    JSON.parse(JSON.stringify(api.getAvailableCategoriesForSurface('metal'))),
    [
      { name: 'Грунтовки', count: 1 },
      { name: 'Краски', count: 1 }
    ]
  );
  assert.deepEqual(
    api.getProductsByCategoryAndSurface('Грунтовки', 'metal').map(function (product) { return product.id; }),
    [1]
  );
});
