import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function filterUtils() {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');
  const window = { KRASKU: {} };
  vm.runInNewContext(source, { window });
  return window.KRASKU.catalogFilterUtils;
}

test('catalog filter keeps only values available in the opened category', async () => {
  const utils = await filterUtils();
  const products = [
    { brand: 'АК-511', type: 'Эмаль', coating: 'АК' },
    { brand: 'ПФ-115', type: 'Эмаль', coating: 'ПФ' }
  ];

  assert.equal(
    JSON.stringify(utils.sanitizeFilters(products, { brand: ['АК-511', 'Не существует'], type: ['Краска'], coating: ['ПФ'] })),
    JSON.stringify({ brand: ['АК-511'], coating: ['ПФ'] })
  );
});

test('catalog filter combines selected values within a group and groups between themselves', async () => {
  const utils = await filterUtils();
  const products = [
    { id: 1, brand: 'АК-511', substrate: 'Металл' },
    { id: 2, brand: 'ПФ-115', substrate: 'Металл' },
    { id: 3, brand: 'ПФ-115', substrate: 'Дерево' }
  ];

  assert.deepEqual(
    utils.filterProducts(products, { brand: ['АК-511', 'ПФ-115'], substrate: ['Металл'] }).map(function (product) { return product.id; }),
    [1, 2]
  );
});

test('full catalogue and category surface results retain the same filter control', async () => {
  const page = await readFile(new URL('../catalog.html', import.meta.url), 'utf8');
  const category = await readFile(new URL('../category.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../css/pages.css', import.meta.url), 'utf8');

  assert.match(page, /id="filterCollapse"[\s\S]*?filter-restore-label/);
  assert.match(category, /id="filterDrawer" data-surface-filter/);
  assert.match(category, /id="filterBtn" data-surface-filter/);
  assert.match(source, /if \(!isAllCatalogue && !surface\) \{[\s\S]*?element\.remove\(\);/);
  assert.match(source, /surfaceFilterElements\.forEach\(function \(element\) \{ element\.hidden = false; \}\);/);
  assert.match(styles, /\.catalog-layout\.is-filter-collapsed \.filter-restore-label/);
});

test('desktop and tablet checkbox changes do not rebuild the visible filter panel', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.match(source, /function apply\(renderFilters\)[\s\S]*?if \(renderFilters !== false\) renderFilterGroups\(activeFilters\(\)\);/);
  assert.match(source, /if \(isMobile\(\)\) renderFilterGroups\(state\.pendingFilters\);\s*else apply\(false\);/);
});

test('filter facet values exclude placeholder punctuation', async () => {
  const utils = await filterUtils();

  assert.equal(
    JSON.stringify(utils.filterFacetValues([{ solubility: ':' }, { solubility: 'Органорастворимая' }, { solubility: '   ' }], 'solubility')),
    JSON.stringify(['Органорастворимая'])
  );
});

test('saved placeholder punctuation is discarded before filters are applied', async () => {
  const utils = await filterUtils();

  assert.equal(
    JSON.stringify(utils.sanitizeFilters([{ solubility: ':' }, { solubility: 'Органорастворимая' }], { solubility: [':'] })),
    '{}'
  );
});

test('filter group title click is contained within its own group', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.match(source, /var groupTitle = e\.target\.closest\('\[data-filter-group-toggle\]'\);/);
  assert.match(source, /e\.preventDefault\(\);\s*e\.stopPropagation\(\);[\s\S]*?groupTitle\.closest\('\.filter-group'\)/);
});

test('category filter does not expose a surface-type group', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /\{ key: 'substrate', label: 'Тип поверхности' \}/);
});

test('catalogue puts the two product-base choices directly under the Filters heading', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.match(source, /var FILTER_GROUPS = \[\s*\{ key: 'solubility', label: '' \}/);
  assert.match(source, /g\.label \? '<button type="button" class="filter-group-title"/);
});

test('catalog photo filter maps products to its five filter groups', async () => {
  const utils = await filterUtils();
  const product = {
    type: 'Лак', brand: 'ВД-АК 111', purpose: 'Для внутренних работ',
    name: 'Лак по дереву', substrate: 'Дерево', solubility: 'Акриловая водная основа'
  };

  assert.deepEqual(JSON.parse(JSON.stringify(utils.filterFacetValues([product], 'type'))), ['Лаки и пропитки']);
  assert.deepEqual(JSON.parse(JSON.stringify(utils.filterFacetValues([product], 'binder'))), ['ВД-АК']);
  assert.deepEqual(JSON.parse(JSON.stringify(utils.filterFacetValues([product], 'purpose'))), ['Внутренняя']);
  assert.deepEqual(JSON.parse(JSON.stringify(utils.filterFacetValues([product], 'application'))), ['Дерево']);
  assert.deepEqual(JSON.parse(JSON.stringify(utils.filterFacetValues([product], 'solubility'))), ['На водной основе']);
});

test('catalog photo filter matches multi-value applications', async () => {
  const utils = await filterUtils();
  const products = [
    { id: 1, name: 'Эмаль для металла и бетона', type: 'Эмаль', brand: 'ПФ-115', purpose: 'Универсальная', solubility: 'Органорастворимая' },
    { id: 2, name: 'Лак для дерева', type: 'Лак', brand: 'АК-113', purpose: 'Внутренняя', solubility: 'Органорастворимая' }
  ];

  assert.deepEqual(
    JSON.parse(JSON.stringify(utils.filterProducts(products, { application: ['Бетон'] }).map(function (product) { return product.id; }))),
    [1]
  );
});

test('full catalogue shows 50 products per page and renders pagination', async () => {
  const [source, page] = await Promise.all([
    readFile(new URL('../js/filters.js', import.meta.url), 'utf8'),
    readFile(new URL('../catalog.html', import.meta.url), 'utf8')
  ]);

  assert.match(source, /var PAGE_SIZE = 50;/);
  assert.match(source, /list\.slice\(\(state\.page - 1\) \* PAGE_SIZE, state\.page \* PAGE_SIZE\)/);
  assert.match(page, /id="catalogPagination"/);
});

test('catalogue pagination keeps a five-page sliding window and has navigation arrows', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.match(source, /var firstVisiblePage = Math\.min\(state\.page, Math\.max\(1, totalPages - 4\)\);/);
  assert.match(source, /var visiblePageCount = Math\.min\(5, totalPages\);/);
  assert.match(source, /var page = firstVisiblePage \+ index;/);
  assert.match(source, /aria-label="Предыдущая страница"/);
  assert.match(source, /aria-label="Следующая страница"/);
});

test('page change keeps pagination under the pointer while the product grid redraws', async () => {
  const source = await readFile(new URL('../js/filters.js', import.meta.url), 'utf8');

  assert.match(source, /function changePageKeepingPagination\(page, render\)/);
  assert.match(source, /var paginationTop = pagination \? pagination\.getBoundingClientRect\(\)\.top : null;/);
  assert.match(source, /window\.scrollBy\(0, shift\);/);
});
