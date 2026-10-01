import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('the request list keeps several product positions and is reachable from the site shell', async () => {
  const [store, routes, layout] = await Promise.all([
    readFile(new URL('../js/store.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/url.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/layout.js', import.meta.url), 'utf8')
  ]);

  assert.match(store, /krasku_request_list/);
  assert.match(store, /getRequestList/);
  assert.match(store, /addRequestItem/);
  assert.match(store, /clearRequestList/);
  assert.match(routes, /requestList:\s*['"]request-list\.html/);
  assert.match(layout, /ns\.url\('requestList'\)/);
  assert.match(layout, /Список заявки/);
});

test('catalogue and product page can add products, while the shared request form submits one list payload', async () => {
  const [filters, product, ui, listPage, main] = await Promise.all([
    readFile(new URL('../js/filters.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/product.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/ui.js', import.meta.url), 'utf8'),
    readFile(new URL('../request-list.html', import.meta.url), 'utf8'),
    readFile(new URL('../js/main.js', import.meta.url), 'utf8')
  ]);

  assert.match(filters, /data-add-request-item/);
  assert.match(product, /data-cta="product-add-request-item"/);
  assert.match(product, /ns\.store\.addRequestItem/);
  assert.match(ui, /requestListModal/);
  assert.match(ui, /items:/);
  assert.match(ui, /clearRequestList/);
  assert.match(listPage, /data-page="request-list"/);
  assert.match(main, /case 'request-list': initRequestList\(\);/);
});
