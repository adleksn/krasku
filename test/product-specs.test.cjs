const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadData() {
  const context = { window: { KRASKU: {} } };
  context.KRASKU = context.window.KRASKU;
  vm.runInNewContext(fs.readFileSync('js/data.js', 'utf8'), context);
  return context.window.KRASKU;
}

test('ПФ-115 чёрная uses the 14 passport results after type and brand', () => {
  const ns = loadData();
  const specs = ns.specs({
    type: 'Эмаль',
    brand: 'ПФ-115 черная',
    solubility: 'Органорастворимая',
    colorSystems: []
  });
  const rows = Object.entries(specs);

  assert.deepEqual(rows.slice(0, 2), [
    ['Тип продукта', 'Эмаль'],
    ['Марка', 'ПФ-115 черная']
  ]);
  assert.equal(rows.length, 16);
  assert.deepEqual(rows.slice(2, 5), [
    ['Цвет покрытия', 'Соответствует'],
    ['Внешний вид покрытия', 'Соответствует'],
    ['Блеск покрытия, %, не менее 50', '60']
  ]);
  assert.equal(rows.at(-1)[0], 'Стойкость покрытия к статическому воздействию, не менее');
  assert.equal(rows.at(-1)[1], 'воды — 2 ч; 0,5%-ного раствора моющего средства — 15 мин; трансформаторного масла — 24 ч');
});
