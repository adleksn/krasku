const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('АК-503 has the requested product presentation before packaging', () => {
  const data = fs.readFileSync('js/catalog-data.js', 'utf8');
  const context = { window: {} };
  vm.runInNewContext(data, context);
  const product = context.window.KRASKU.catalogSnapshot.products.find((item) => item.slug === 'ак-503');

  assert.equal(product.name, 'АК-503 Дорожная краска');
  assert.equal(product.type, 'Краска - Алкидная');
  assert.equal(product.purpose, 'Фасадная - Водостойкая');
  assert.equal(product.substrate, 'Бетон - металл');
  assert.equal(product.color, 'Белая - Матовая');
  assert.equal(product.applicationTemperature, 'от +5°С до +30°С');
  assert.equal(product.consumption, '120-150 г/м²');
  assert.match(product.description, /^Дорожная алкидная краска/);
});

test('АК-503 uses its concise description without generated filler', () => {
  const source = fs.readFileSync('js/data.js', 'utf8');
  const context = { KRASKU: {} };
  context.window = context;
  vm.runInNewContext(source, context);
  const product = {
    slug: 'ак-503',
    name: 'АК-503 Дорожная краска',
    description: 'Дорожная алкидная краска. Образует матовое покрытие.'
  };

  assert.equal(context.KRASKU.productDescription(product).text, product.description);
});
