const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (file) => fs.readFileSync(file, 'utf8');

test('краткая заявка на главной запрашивает обязательные контакты и комментарий', () => {
  const page = read('index.html');
  const shortForm = page.match(/<form id="requestShort"[\s\S]*?<\/form>/)[0];

  assert.match(shortForm, /for="req-name">ФИО <span class="req">\*<\/span><\/label>\s*<input id="req-name" name="name" type="text" required>/);
  assert.match(shortForm, /for="req-phone">Телефон <span class="req">\*<\/span><\/label>\s*<input id="req-phone" name="phone" type="tel"[^>]*required>/);
  assert.match(shortForm, /for="req-email">Email <span class="req">\*<\/span><\/label>\s*<input id="req-email" name="email" type="email" required>/);
  assert.match(shortForm, /for="req-product-type">Марка или тип материала <span class="req">\*<\/span><\/label>\s*<input id="req-product-type" name="productType" type="text" placeholder="Например: Краска резиновая" required>/);
  assert.match(shortForm, /for="req-comment">Комментарий<\/label>\s*<textarea id="req-comment" name="comment"/);
  assert.doesNotMatch(shortForm, /req-org|req-inn/);
});

test('шапка и плавающая кнопка открывают краткую заявку с выбором типа клиента', () => {
  const layout = read('js/layout.js');
  const ui = read('js/ui.js');

  assert.match(layout, /btn-kp" data-cta="short-request">Запросить счёт с НДС/);
  assert.match(layout, /floating-request" data-cta="short-request">/);
  assert.match(layout, /\[data-cta="short-request"\][\s\S]*?ns\.shortRequestModal\(\)/);
  assert.match(ui, /ns\.shortRequestModal = function \(\)/);
  assert.match(ui, /Физическое лицо/);
  assert.match(ui, /Юридическое лицо/);
  assert.match(ui, /data-short-request-role/);
  const modal = ui.slice(ui.indexOf('ns.shortRequestModal'), ui.indexOf('/* ---------- Единая заявка по нескольким товарам ---------- */'));
  assert.doesNotMatch(modal, /Организация|ИНН/);
});

test('формы с ФИО и телефоном требуют Email', () => {
  const contact = read('contacts.html');
  const tinting = read('tinting.html');
  const ui = read('js/ui.js');
  const main = read('js/main.js');
  const compare = read('js/compare.js');
  const layout = read('js/layout.js');

  assert.match(contact, /for="c-email">Email <span class="req">\*<\/span><\/label>\s*<input id="c-email" name="email" type="email" required>/);
  assert.match(tinting, /for="tin-email">Email <span class="req">\*<\/span><\/label>\s*<input id="tin-email" name="email" type="email" required>/);
  [ui, main, compare, layout].forEach((source) => {
    assert.doesNotMatch(source, /ns\.field\('Email', 'email', 'email'\)(?!,)/);
  });
});

test('common contact data and labels use the requested spelling', () => {
  const layout = read('js/layout.js');
  const contacts = read('contacts.html');
  const tinting = read('tinting.html');
  const about = read('about.html');

  assert.match(layout, /8 800 100 1199/);
  assert.match(contacts, /8 800 100 11 99/);
  assert.match(contacts, /8 920 127 71 77/);
  assert.match(contacts, /ros-akva@yandex\.ru/);
  assert.match(contacts, /г\. Ярославль, Октября проспект 78, строение 5, офис 11/);
  assert.match(contacts, /Согласование заказов и отгрузки/);
  assert.match(contacts, /Пн–Пт 9:00–17:00 МСК/);
  assert.match(about, /г\. Ярославль, Октября проспект 78, строение 5, офис 11/);
  assert.doesNotMatch(about, /проспект Октября/);
  assert.match(tinting, /Колеровка/);
  assert.doesNotMatch(tinting, /Калеровка/);
});

test('every page uses the supplied SVG favicon', () => {
  const pages = fs.readdirSync('.').filter((name) => name.endsWith('.html'));
  const icon = read('assets/brand/favicon.svg');
  const suppliedIcon = read('/Users/nikitaalekseev/Downloads/KRASKU-RU_favicon_white.svg');

  assert.equal(icon.trim(), suppliedIcon.trim());
  pages.forEach((page) => {
    assert.match(read(page), /<link rel="icon" href="assets\/brand\/favicon\.svg" type="image\/svg\+xml">/);
  });
});
