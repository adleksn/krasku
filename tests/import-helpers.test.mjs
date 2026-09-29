import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeProduct, renderSnapshotModule, sitemapProducts } from '../scripts/import-helpers.mjs';

test('sitemapProducts keeps product URLs with an image and removes duplicates', () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>https://krasku.ru/ak-503</loc><image:image><image:loc>https://krasku.ru/image/ak.jpg</image:loc></image:image></url>
    <url><loc>https://krasku.ru/ak-503</loc><image:image><image:loc>https://krasku.ru/image/ak.jpg</image:loc></image:image></url>
    <url><loc>https://krasku.ru/about_us</loc></url>
  </urlset>`;

  assert.deepEqual(sitemapProducts(xml), [{
    sourceUrl: 'https://krasku.ru/ak-503',
    imageUrl: 'https://krasku.ru/image/ak.jpg',
    slug: 'ak-503'
  }]);
});

test('normalizeProduct maps a product page into the static catalogue contract', () => {
  const html = `
    <h1>АК-503</h1><div class="price">145р.</div><span>Есть в наличии</span>
    <div>Назначение</div><div>Внутренние, Наружные, Универсальная</div>
    <div>Основа</div><div>Органорастворимая</div>
    <div>*Фасовка: 1 кг 15 кг 30 кг</div>
    <div>*Цвет: Белый, Желтый, Красный</div>
    <h2>Дорожная краска АК-503</h2><p>Краска для разметки дорог.</p>
  `;
  const product = normalizeProduct({ sourceUrl: 'https://krasku.ru/ak-503', imageUrl: 'https://krasku.ru/image/ak.jpg', slug: 'ak-503' }, html, 1146);

  assert.equal(product.id, 1146);
  assert.equal(product.slug, 'ak-503');
  assert.equal(product.name, 'АК-503');
  assert.equal(product.pricePerKg, 145);
  assert.deepEqual(product.packaging, [1, 15, 30]);
  assert.equal(product.stock, true);
  assert.equal(product.solubility, 'Органорастворимая');
  assert.equal(product.image, 'assets/products/ak-503.jpg');
  assert.deepEqual(product.surfaces, []);
});

test('normalizeProduct moves surface-type names out of the brand field', () => {
  const product = normalizeProduct(
    { sourceUrl: 'https://krasku.ru/kraska-dlya-potolka', imageUrl: 'https://krasku.ru/image/potolok.jpg', slug: 'kraska-dlya-potolka' },
    '<h1>Краска для потолка</h1>',
    1147
  );

  assert.equal(product.brand, '');
  assert.equal(product.substrate, 'для потолка');
});

test('renderSnapshotModule exposes an immutable browser catalogue snapshot', () => {
  const source = renderSnapshotModule({ importedAt: '2026-08-31T00:00:00.000Z', categories: [], products: [] });
  assert.match(source, /window\.KRASKU\.catalogSnapshot/);
  assert.match(source, /Object\.freeze/);
  assert.match(source, /2026-08-31T00:00:00\.000Z/);
});
