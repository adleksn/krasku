import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('header catalogue link opens the all-products catalogue', async () => {
  const [layout, routes, filters] = await Promise.all([
    readFile(new URL('../js/layout.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/url.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/filters.js', import.meta.url), 'utf8')
  ]);

  assert.match(layout, /\{ id: 'catalog', route: 'catalog', label: 'Каталог' \}/);
  assert.match(routes, /catalog: 'catalog\.html'/);
  assert.doesNotMatch(routes, /catalogAll:/);
  assert.match(filters, /var isAllCatalogue = document\.body\.getAttribute\('data-page'\) === 'catalog';/);
  assert.match(filters, /var all = isAllCatalogue \? ns\.api\.getProducts\(\)/);
});
