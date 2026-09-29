import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function seed() {
  const source = await readFile(new URL('../js/catalog-surface-seed.js', import.meta.url), 'utf8');
  const window = { KRASKU: {} };
  vm.runInNewContext(source, { window });
  return window.KRASKU.catalogSurfaceSeed;
}

test('seed adds every explicitly named compatible surface without replacing admin values', async () => {
  const apply = await seed();
  const products = [
    { id: 1, name: 'Грунтовка', paintFor: 'Для металлических и деревянных поверхностей.' },
    { id: 2, name: 'Краска для бетона', paintFor: '' },
    { id: 3, name: 'Лак', paintFor: 'Для металла', surfaces: ['Дерево'] },
    { id: 4, name: 'Отвердитель', paintFor: 'Для покрытия' }
  ];

  assert.deepEqual(
    JSON.parse(JSON.stringify(apply(products).map(function (product) { return product.surfaces; }))),
    [['Металл', 'Дерево'], ['Бетон'], ['Дерево'], []]
  );
});

test('seed classifies road, interior and facade materials from explicit use cases', async () => {
  const apply = await seed();
  const products = [
    { id: 1, name: 'Краска', paintFor: 'Для дорожной разметки.' },
    { id: 2, name: 'Эмаль', paintFor: 'Для внутренних работ в помещениях.' },
    { id: 3, name: 'Фасадная краска', paintFor: 'Покрытие для дома.' }
  ];

  assert.deepEqual(
    JSON.parse(JSON.stringify(apply(products).map(function (product) { return product.surfaces; }))),
    [['Дорожная'], ['Интерьерная'], ['Фасадная']]
  );
});
