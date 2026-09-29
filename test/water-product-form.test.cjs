const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const ui = fs.readFileSync('js/ui.js', 'utf8');

test('водная товарная форма предлагает три типа водной краски', () => {
  assert.match(ui, /configGroup\('Тип водной продукции'/);
  assert.match(ui, /'Краска интерьерная'/);
  assert.match(ui, /'Краска фасадная'/);
  assert.match(ui, /'Краска для дерева'/);
  assert.match(ui, /waterProduct: data\.configurationWaterProduct/);
});
