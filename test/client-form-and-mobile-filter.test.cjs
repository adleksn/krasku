const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (file) => fs.readFileSync(file, 'utf8');

test('home request forms collect the requested product type and package selection', () => {
  const page = read('index.html');
  const shortForm = page.match(/<form id="requestShort"[\s\S]*?<\/form>/)[0];
  const fullForm = page.match(/<form id="requestFull"[\s\S]*?<\/form>/)[0];

  assert.match(shortForm, /for="req-product-type">Марка или тип материала <span class="req">\*<\/span><\/label>\s*<input id="req-product-type" name="productType" type="text" required>/);
  assert.match(fullForm, /for="full-package">Выберите комплектацию<\/label>[\s\S]*?<option>Самостоятельный товар<\/option>[\s\S]*?<option>Эмаль \+ Грунт<\/option>[\s\S]*?<option>Краска \+ Грунтовка<\/option>/);
  assert.match(fullForm, /for="full-city">Место получения<\/label>\s*<input id="full-city" name="city" type="text" placeholder="Адрес терминала ТК или адрес курьеру">/);
});

test('delivery controls consistently describe the pickup location and fast order does not ask for a product type', () => {
  const ui = read('js/ui.js');
  const product = read('js/product.js');

  assert.doesNotMatch(ui, /Адрес доставки/);
  assert.match(ui, /Место получения/);
  assert.match(ui, /Адрес терминала ТК или адрес курьеру/);
  const fastOrder = product.slice(product.indexOf("title: 'Быстрый заказ'"), product.indexOf('/* ---------- Табы'));
  assert.match(fastOrder, /includeDelivery: true/);
  assert.match(fastOrder, /includeProductType: false/);
});

test('mobile layout has a separate floating filter entry point while preserving the request button', () => {
  const layout = read('js/layout.js');
  const css = read('css/components.css');
  const filters = read('js/filters.js');

  assert.match(layout, /floating-catalog-filter/);
  assert.match(layout, /catalog\.html\?filters=1/);
  assert.match(css, /\.floating-catalog-filter/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(filters, /get\('filters'\) === '1' && isMobile\(\)\) openDrawer\(\)/);
});
