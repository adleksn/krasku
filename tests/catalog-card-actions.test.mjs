import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('catalog product cards retain favourites and comparison, but not the red remove action', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');
  const card = source.slice(source.indexOf('ns.productCard'), source.indexOf('/* ---------- Делегирование'));

  assert.match(card, /data-compare/);
  assert.match(card, /data-fav/);
  assert.doesNotMatch(card, /card-remove/);
  assert.match(card, /data-preview-product/);
});

test('catalog product cards prepare a delayed hover preview without blocking actions', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../css/components.css', import.meta.url), 'utf8');

  assert.match(source, /setTimeout\(function \(\) \{[\s\S]*?\}, 1000\)/);
  assert.match(source, /pointerover/);
  assert.match(source, /pointerout/);
  assert.match(styles, /\.product-hover-preview/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /\.product-hover-preview\.is-visible/);
});
