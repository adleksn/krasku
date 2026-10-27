import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage, header, partner CTA and product CTA reflect the requested contact flow', async () => {
  const [home, about, layout, ui, product] = await Promise.all([
    read('index.html'), read('about.html'), read('js/layout.js'), read('js/ui.js'), read('js/product.js')
  ]);

  assert.doesNotMatch(home, /Выбрать с технологом/);
  assert.match(about, /data-cta="partner-request">Стать партнёром/);
  assert.match(layout, /data-cta="partner-request"/);
  assert.match(ui, /ns\.partnerRequestModal = function \(\)/);
  const partnerModal = ui.slice(ui.indexOf('ns.partnerRequestModal'), ui.indexOf('/* ---------- Краткая заявка'));
  assert.match(partnerModal, /ns\.field\('Телефон', 'phone', 'tel', true\)/);
  assert.match(partnerModal, /ns\.field\('Email', 'email', 'email', true\)/);
  assert.match(partnerModal, /ns\.field\('Комментарий', 'comment', 'textarea'\)/);
  assert.doesNotMatch(partnerModal, /ФИО|Организация/);
  assert.match(layout, /8 800 100 11 99/);
  assert.match(layout, /8 920 127 71 77/);
  const buyBox = product.slice(product.indexOf('function buyBoxHtml'), product.indexOf('/* ---------- Расчёт ---------- */'));
  assert.doesNotMatch(buyBox, /Индивидуальный заказ/);
  assert.doesNotMatch(buyBox, /Получить консультацию/);
  assert.match(buyBox, /data-cta="product-fast-order">Быстрый заказ/);
});

test('contacts, requisites and tinting form use the supplied details', async () => {
  const [contacts, tinting] = await Promise.all([read('contacts.html'), read('tinting.html')]);

  for (const detail of [
    '39.854036%2C57.650411',
    'Общество с ограниченной ответственностью «КРАСКУ.РУ»',
    '7606114640/ 760601001',
    '1177627028248',
    '40702810801290000043',
    '30101810200000000593',
    '044525593',
    'АО "АЛЬФА-БАНК" г. Москва',
    'Гасилов Евгений Аркадьевич'
  ]) assert.ok(contacts.includes(detail), `missing contact detail: ${detail}`);

  assert.match(tinting, /for="tin-product">Марка или тип материала <span class="req">\*<\/span><\/label>/);
  assert.match(tinting, /<input id="tin-product" name="product" type="text" placeholder="Например: Фасадная краска" required>/);
  assert.doesNotMatch(tinting, /<select id="tin-product"/);
});
