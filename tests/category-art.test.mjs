import assert from 'node:assert/strict';
import test from 'node:test';
import { access, readFile } from 'node:fs/promises';

const categoryArt = {
  'Грунт-эмали': 'assets/categories/primer-enamels.png',
  'Краски': 'assets/categories/paints.png',
  'Лаки': 'assets/categories/varnishes.png',
  'Разбавители': 'assets/categories/thinners.png'
};

const surfaceCategoryArt = {
  'Металл': 'assets/categories/surface-metal.png',
  'Дерево': 'assets/categories/surface-wood.png',
  'Бетон': 'assets/categories/surface-concrete.png',
  'Дорожная': 'assets/categories/surface-road.png',
  'Интерьерная': 'assets/categories/surface-interior.png',
  'Фасадная': 'assets/categories/surface-facade.png'
};

test('catalogue categories use dedicated generated cover images', async () => {
  const data = await readFile(new URL('../js/data.js', import.meta.url), 'utf8');

  await Promise.all(Object.entries(categoryArt).map(async ([category, asset]) => {
    assert.match(data, new RegExp("'" + category + "': '" + asset + "'"));
    await access(new URL('../' + asset, import.meta.url));
  }));
});

test('surface catalogue categories use dedicated generated cover images', async () => {
  const [data, main] = await Promise.all([
    readFile(new URL('../js/data.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/main.js', import.meta.url), 'utf8')
  ]);

  assert.match(data, /KRASKU\.surfaceCategoryArt/);
  assert.match(main, /ns\.surfaceCategoryArt\[c\.name\]/);

  await Promise.all(Object.entries(surfaceCategoryArt).map(async ([surface, asset]) => {
    assert.match(data, new RegExp("'" + surface + "': '" + asset + "'"));
    await access(new URL('../' + asset, import.meta.url));
  }));
});
