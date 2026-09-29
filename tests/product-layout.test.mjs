import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('product page keeps its product layout inside the site container', async () => {
  const html = await readFile(new URL('../product.html', import.meta.url), 'utf8');
  assert.match(html, /<section class="section container" id="productRoot"/);
});
