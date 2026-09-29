import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function navigation() {
  const source = await readFile(new URL('../js/catalog-navigation.js', import.meta.url), 'utf8');
  const window = { KRASKU: {} };
  vm.runInNewContext(source, { window });
  return window.KRASKU.catalogNavigation;
}

const products = [
  { id: 1, category: 'Грунтовки', surfaces: ['Металл', 'Дерево'] },
  { id: 2, category: 'Эмали', surfaces: ['Металл'] },
  { id: 3, category: 'Лаки', surfaces: ['Дерево'] },
  { id: 4, category: 'Краски', surfaces: ['Бетон'] },
  { id: 5, category: 'Растворители', surfaces: [] }
];

test('surface catalogue exposes only configured surfaces with products', async () => {
  const catalogue = await navigation();

  assert.deepEqual(
    JSON.parse(JSON.stringify(catalogue.availableSurfaces(products))),
    [
      { slug: 'metal', name: 'Металл', count: 2 },
      { slug: 'wood', name: 'Дерево', count: 2 },
      { slug: 'concrete', name: 'Бетон', count: 1 }
    ]
  );
});

test('second catalogue level keeps only categories matching the selected surface', async () => {
  const catalogue = await navigation();

  assert.deepEqual(
    JSON.parse(JSON.stringify(catalogue.availableCategories(products, 'wood'))),
    [
      { name: 'Грунтовки', count: 1 },
      { name: 'Лаки', count: 1 }
    ]
  );
});

test('final catalogue listing intersects selected category and surface', async () => {
  const catalogue = await navigation();

  assert.deepEqual(
    catalogue.filterProducts(products, 'Грунтовки', 'wood').map(function (product) { return product.id; }),
    [1]
  );
});

test('browse links preserve the first catalogue choice', async () => {
  const catalogue = await navigation();

  assert.equal(catalogue.browseUrl('surface', { type: 'gruntovki' }), 'catalog.html?by=surface&type=gruntovki');
  assert.equal(catalogue.browseUrl('type', { surface: 'wood' }), 'catalog.html?by=type&surface=wood');
  assert.equal(catalogue.resultUrl('gruntovki', 'wood'), 'category.html?cat=gruntovki&surface=wood');
});

test('catalogue entry keeps all products separate from two-stage selection URLs', async () => {
  const catalogue = await navigation();

  assert.equal(catalogue.isChooserUrl(''), false);
  assert.equal(catalogue.isChooserUrl('?by=surface&type=gruntovki'), true);
  assert.equal(catalogue.isChooserUrl('?by=type&surface=metal'), true);
});

test('result link records the chosen catalogue order for breadcrumbs', async () => {
  const catalogue = await navigation();

  assert.equal(catalogue.resultUrl('gruntovki', 'wood', 'type'), 'category.html?cat=gruntovki&surface=wood&from=type');
  assert.equal(catalogue.resultUrl('gruntovki', 'wood', 'surface'), 'category.html?cat=gruntovki&surface=wood&from=surface');
});

test('result link accepts a selected surface object from the second catalogue level', async () => {
  const catalogue = await navigation();

  assert.equal(
    catalogue.resultUrl('gruntovki', { slug: 'metal', name: 'Металл' }, 'type'),
    'category.html?cat=gruntovki&surface=metal&from=type'
  );
});
