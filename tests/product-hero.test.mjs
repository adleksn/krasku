import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('product hero exposes the client-requested concise attributes and order actions', async () => {
  const source = await readFile(new URL('../js/product.js', import.meta.url), 'utf8');

  for (const label of ['Тип покрытия', 'Назначение', 'Область применения', 'Цвет', 'Расход и высыхание']) {
    assert.match(source, new RegExp(label));
  }
  assert.match(source, /product-highlight-grid/);
  assert.match(source, /Индивидуальный заказ/);
  assert.match(source, /Быстрый заказ/);
  assert.match(source, /package-qty-panel/);
  assert.doesNotMatch(source, /packagingHtml\(\)/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /buyPriceValue/);
  assert.match(source, /за выбранные фасовки/);
});

test('product styles keep the visual product layout within its container on narrow screens', async () => {
  const styles = await readFile(new URL('../css/pages.css', import.meta.url), 'utf8');

  assert.match(styles, /\.product-layout\s*\{[\s\S]*minmax\(0,/);
  assert.match(styles, /@media \(max-width: 1024px\)\s*\{[\s\S]*\.product-layout\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(styles, /\.product-highlight-grid/);
});
