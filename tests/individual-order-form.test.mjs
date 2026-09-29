import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('individual order has a dedicated contextual configuration form while fast order remains generic', async () => {
  const ui = await readFile(new URL('../js/ui.js', import.meta.url), 'utf8');
  const product = await readFile(new URL('../js/product.js', import.meta.url), 'utf8');

  assert.match(ui, /productConfigurationModal/);
  assert.match(ui, /Комплектация/);
  assert.match(ui, /Контакты/);
  assert.match(product, /Марка:/);
  assert.match(ui, /configuration/);
  assert.match(product, /productConfigurationModal/);
  assert.match(product, /openProductRequest\('Быстрый заказ'\)/);
});

test('individual order has compact client-approved options for water and organic products', async () => {
  const ui = await readFile(new URL('../js/ui.js', import.meta.url), 'utf8');

  for (const label of [
    'Самостоятельный товар',
    'Выбрать комплект + (отвердитель, растворитель)',
    'Выбрать комплекс + (комплект + совместимый грунт)',
    'Выбрать комплекс + (краска-эмаль + грунт)',
    'Эконом',
    'Мастер',
    'Профи',
    'Прикрепить файл / ТЗ / реквизиты'
  ]) {
    assert.ok(ui.includes(label), 'missing option: ' + label);
  }
  assert.match(ui, /Заполните параметры — менеджер рассчитает стоимость и выставит счёт с НДС\./);
  assert.match(ui, /акрил/i);
  assert.match(ui, /Самовывоз/);
  assert.match(ui, /Доставка/);
  assert.match(ui, /Адрес доставки/);
  assert.match(ui, /Грунт-эмаль/);
  assert.match(ui, /Шпатлёвка/);
  assert.match(ui, /Ржавчина/);
  assert.match(ui, /configurationDelivery/);
  assert.match(ui, /configurationAddress/);
});

test('product page no longer renders hard-coded kit and compatibility side cards', async () => {
  const product = await readFile(new URL('../js/product.js', import.meta.url), 'utf8');
  const rendered = product.slice(product.indexOf("root.innerHTML = '<div class=\"product-layout\">'"), product.indexOf('/* Галерея */'));

  assert.doesNotMatch(rendered, /kitUsageHtml\(\)/);
  assert.doesNotMatch(rendered, /compatHtml\(\)/);
  assert.doesNotMatch(rendered, /kitsHtml\(\)/);
});

test('site exposes separate technologist and VAT invoice forms outside a product card', async () => {
  const ui = await readFile(new URL('../js/ui.js', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../js/layout.js', import.meta.url), 'utf8');

  assert.match(ui, /technologistModal/);
  assert.match(ui, /invoiceModal/);
  assert.match(ui, /Подберём краску под вашу задачу/);
  assert.match(ui, /Запросить счёт с НДС/);
  assert.match(ui, /Указать марку/);
  assert.match(layout, /technologistModal/);
  assert.match(layout, /invoiceModal/);
});
