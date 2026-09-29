/* ============================================================
   KRASKU.RU — data.js
   Mock data: категории, товары, статьи, FAQ, документы.
   SVG-хелперы для иконок и изображений (WebP-аналог, без внешних файлов).
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

/* ---------- Иконки (inline SVG, stroke = currentColor) ---------- */
KRASKU.ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 2-2.9 2-4.5A4.5 4.5 0 0 0 16.5 5c-1.5 0-2.8.7-4.5 2.5C10.3 5.7 9 5 7.5 5A4.5 4.5 0 0 0 3 9.5c0 1.6.5 3 2 4.5l7 7Z"/></svg>',
  compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/><path d="M16 3h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 14H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"/><path d="M16 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/></svg>',
  sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 4-4 4 4M7 4v16M21 16l-4 4-4-4M17 20V4"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  factory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h-5M16 8h3l4 5v4a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.6 2.93 21.07 11.4a2 2 0 0 1 0 2.83l-6.84 6.84a2 2 0 0 1-2.83 0L3.93 12.6A2 2 0 0 1 3.4 11.2V4.6A2 2 0 0 1 5.4 2.6h6.2a2 2 0 0 1 1 .33Z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>',
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.53a2 2 0 0 1-.4 1.2L3.3 20.1A2 2 0 0 0 5 23h14a2 2 0 0 0 1.7-2.9l-6.3-9.37a2 2 0 0 1-.4-1.2V2"/><path d="M8.5 2h7"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.45-.94.9-1.77-.34-.52-.16-1.28.37-1.58.77-.43 1.13-1.34 1.13-2.18 0-1.97 1.6-3.57 3.57-3.57h1.3C21.13 12.9 22 12 22 11.06 22 6.05 17.51 2 12 2Z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17.3l-5.6 3.3 1.5-6.4L3 9.8l6.5-.6L12 3l2.5 6.2 6.5.6-4.9 4.4 1.5 6.4Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  geo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7 6 11 6 11s6-4 6-11Z"/><circle cx="12" cy="8" r="2"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>'
};

/* ---------- Форматирование ---------- */
KRASKU.formatPrice = function (n) {
  if (n === null || n === undefined || Number.isNaN(n)) return 'Цена по запросу';
  return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
};

KRASKU.formatKg = function (n) {
  if (!n) return '0 кг';
  return new Intl.NumberFormat('ru-RU').format(n) + ' кг';
};

KRASKU.categoryArt = {
  'Грунтовки': 'assets/categories/primers.png',
  'Эмали': 'assets/categories/enamels.png',
  'Грунт-эмали': 'assets/categories/primer-enamels.png',
  'Краски': 'assets/categories/paints.png',
  'Лаки': 'assets/categories/varnishes.png',
  'Отвердители': 'assets/categories/hardeners.png',
  'Растворители': 'assets/categories/solvents.png',
  'Разбавители': 'assets/categories/thinners.png'
};

KRASKU.surfaceCategoryArt = {
  'Металл': 'assets/categories/surface-metal.png',
  'Дерево': 'assets/categories/surface-wood.png',
  'Бетон': 'assets/categories/surface-concrete.png',
  'Дорожная': 'assets/categories/surface-road.png',
  'Интерьерная': 'assets/categories/surface-interior.png',
  'Фасадная': 'assets/categories/surface-facade.png'
};

/* В production эти значения передаются из WordPress вместе с каталогом.
   В статической сборке режим включается только после разметки товаров. */
KRASKU.catalogConfig = {
  surfaceCatalogueEnabled: true,
  seedSurfacesFromText: true
};

KRASKU.articleArt = {
  1: 'assets/editorial/article-enamel-metal.png',
  2: 'assets/editorial/article-primer-enamel.png',
  3: 'assets/editorial/article-tinting.png',
  4: 'assets/editorial/article-enamel-metal.png',
  5: 'assets/editorial/article-primer-enamel.png',
  6: 'assets/editorial/laboratory.png'
};

/* ---------- SVG-изображение продукта (промышленная банка) ---------- */
KRASKU.productSvg = function (p, label, tone) {
  const colors = ['#e9ebed', '#dfe2e5', '#d4d8dc', '#eceeef'];
  const bg = tone !== undefined ? colors[tone % colors.length] : colors[(p.id || 0) % colors.length];
  const title = label || p.name || '';
  return '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + title + '">'
    + '<rect width="400" height="300" fill="' + bg + '"/>'
    + '<rect x="30" y="24" width="340" height="252" fill="none" stroke="#2a2d31" stroke-opacity="0.14" stroke-width="2"/>'
    + '<rect x="152" y="52" width="96" height="146" rx="10" fill="#2a2d31"/>'
    + '<rect x="152" y="52" width="96" height="34" rx="10" fill="#3a3e44"/>'
    + '<rect x="140" y="40" width="120" height="18" rx="6" fill="#202327"/>'
    + '<rect x="172" y="104" width="56" height="56" rx="8" fill="#fff" fill-opacity="0.1"/>'
    + '<rect x="140" y="200" width="120" height="14" rx="7" fill="#1b1d20"/>'
    + '<text x="200" y="252" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#3a3e44">' + esc(title) + '</text>'
    + '<text x="200" y="272" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#787f88">KRASKU.RU</text>'
    + '</svg>';
};

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------- SVG-изображение категории ---------- */
KRASKU.categorySvg = function (name, iconLabel) {
  return '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(name) + '">'
    + '<rect width="400" height="240" fill="#e3e5e8"/>'
    + '<rect x="24" y="20" width="352" height="200" fill="none" stroke="#2a2d31" stroke-opacity="0.12" stroke-width="2"/>'
    + '<rect x="150" y="52" width="100" height="120" rx="12" fill="#2a2d31"/>'
    + '<rect x="150" y="52" width="100" height="30" rx="12" fill="#3a3e44"/>'
    + '<rect x="140" y="42" width="120" height="16" rx="6" fill="#1b1d20"/>'
    + '<text x="200" y="198" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#43464c">' + esc(iconLabel || name) + '</text>'
    + '</svg>';
};

/* ---------- SVG: производственный фон (Hero / О компании) ---------- */
KRASKU.industrySvg = function (alt, variant) {
  return '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(alt || 'Производство ЛКМ') + '">'
    + '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#2e3136"/><stop offset="1" stop-color="#1b1d20"/></linearGradient></defs>'
    + '<rect width="800" height="600" fill="url(#sky)"/>'
    /* пол */
    + '<rect y="470" width="800" height="130" fill="#15171a"/>'
    /* центральный резервуар */
    + '<rect x="330" y="150" width="140" height="320" rx="8" fill="#3a3e44"/>'
    + '<rect x="330" y="150" width="140" height="60" rx="8" fill="#4a4f55"/>'
    + '<rect x="318" y="130" width="164" height="26" rx="6" fill="#555b62"/>'
    + '<circle cx="400" cy="240" r="34" fill="#4a4f55"/><circle cx="400" cy="240" r="22" fill="#3a3e44"/><circle cx="400" cy="240" r="9" fill="#2a2d31"/>'
    /* большой резервуар слева */
    + '<rect x="120" y="220" width="120" height="250" rx="10" fill="#35383d"/>'
    + '<rect x="120" y="220" width="120" height="46" rx="10" fill="#43474d"/>'
    + '<path d="M180 130v70M180 130l-34 10M180 130l34 10" stroke="#43474d" stroke-width="10" fill="none" stroke-linecap="round"/>'
    /* трубы */
    + '<rect x="240" y="330" width="90" height="14" fill="#555b62"/>'
    + '<rect x="470" y="360" width="80" height="14" fill="#555b62"/>'
    + '<rect x="530" y="360" width="14" height="70" fill="#555b62"/>'
    + '<rect x="530" y="410" width="90" height="14" fill="#555b62"/>'
    /* колонна справа */
    + '<rect x="620" y="200" width="70" height="270" rx="6" fill="#3a3e44"/>'
    + '<rect x="608" y="180" width="94" height="26" rx="6" fill="#555b62"/>'
    + '<rect x="632" y="230" width="46" height="12" fill="#43474d"/>'
    + '<rect x="632" y="260" width="46" height="12" fill="#43474d"/>'
    /* дым */
    + '<circle cx="660" cy="130" r="26" fill="#43474d"/><circle cx="690" cy="100" r="20" fill="#4a4f55"/><circle cx="672" cy="72" r="16" fill="#555b62"/>'
    /* человек-фигура */
    + '<circle cx="520" cy="392" r="12" fill="#c9cdd2"/><rect x="508" y="404" width="24" height="52" rx="8" fill="#4a4f55"/>'
    /* подсветка */
    + '<circle cx="400" cy="452" r="3" fill="#8a8f96"/><circle cx="380" cy="452" r="3" fill="#8a8f96"/><circle cx="420" cy="452" r="3" fill="#8a8f96"/>'
    + '</svg>';
};

/* ---------- Категории ---------- */
KRASKU.categories = [
  { slug: 'emaili', name: 'Эмали', desc: 'Плёнкообразующие эмали для защиты и декора металлических, деревянных и бетонных поверхностей.' },
  { slug: 'gruntovki', name: 'Грунтовки', desc: 'Антикоррозионные и адгезионные грунтовки для подготовки основания под финишное покрытие.' },
  { slug: 'grunt-emali', name: 'Грунт-эмали', desc: 'Составы «3 в 1»: грунт, антикоррозионная защита и эмаль в одном слое. Работают по ржавчине.' },
  { slug: 'kraski', name: 'Краски', desc: 'Водоэмульсионные и органорастворимые краски для внутренних и наружных работ.' },
  { slug: 'laki', name: 'Лаки', desc: 'Защитно-декоративные лаки для дерева, металла и минеральных поверхностей.' },
  { slug: 'rastvoriteli', name: 'Растворители', desc: 'Универсальные и специализированные растворители для доведения состава до рабочей вязкости.' },
  { slug: 'razbaviteli', name: 'Разбавители', desc: 'Разбавители для полиуретановых, эпоксидных и других двухкомпонентных систем.' },
  { slug: 'otverditel-2', name: 'Отвердители', desc: 'Отвердители для полиуретановых и эпоксидных ЛКМ в заводских дозировках.' },
  { slug: 'termostoykie', name: 'Термостойкие покрытия', desc: 'Кремнийорганические составы для поверхностей с высокотемпературным нагревом.' },
  { slug: 'specialnye', name: 'Специальные покрытия', desc: 'Резиновые, дорожные и другие покрытия специального назначения.' }
];

KRASKU.categoryBySlug = function (slug) {
  return KRASKU.categories.find(function (c) { return c.slug === slug; });
};

/* ---------- Применение / назначение / поверхность (главная) ---------- */
KRASKU.applications = [
  { slug: 'kraski', name: 'Краска для стен', desc: 'Водоэмульсионные краски для внутренней отделки стен по бетону, штукатурке и гипсокартону.' },
  { slug: 'laki', name: 'Покрытия по дереву', desc: 'Лаки и краски для защиты и декора деревянных поверхностей, паркета и мебели.' },
  { slug: 'emaili', name: 'Краска по металлу', desc: 'Эмали для защиты и окрашивания металлоконструкций, труб, резервуаров и оборудования.' },
  { slug: 'gruntovki', name: 'Грунтовка по металлу', desc: 'Антикоррозионные грунтовки для подготовки стальных поверхностей под финишное покрытие.' },
  { slug: 'grunt-emali', name: 'Краска по ржавчине', desc: 'Грунт-эмали «3 в 1»: защита и окрашивание за один слой, работают по плотной ржавчине.' },
  { slug: 'termostoykie', name: 'Термостойкие покрытия', desc: 'Кремнийорганические эмали для поверхностей, работающих при температуре до 600 °C.' },
  { slug: 'specialnye', name: 'Краска для дорожной размётки', desc: 'Дорожные, резиновые и другие покрытия специального назначения.' },
  { slug: 'otverditel-2', name: 'Двухкомпонентные системы', desc: 'Отвердители для полиуретановых и эпоксидных составов в заводских дозировках.' }
];

/* ---------- Товары ---------- */
KRASKU.products = [
  { id: 1, name: 'Эмаль ПФ-115', sku: 'KRK-ПФ-115', category: 'Эмали', brand: 'ПФ-115', type: 'Эмаль', coating: 'ПФ', substrate: 'Металл', purpose: 'Наружная', solubility: 'Органорастворимая', pricePerKg: 520, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'металлических, деревянных и оштукатуренных поверхностей' },
  { id: 2, name: 'Эмаль АК-511', sku: 'KRK-АК-511', category: 'Эмали', brand: 'АК-511', type: 'Эмаль', coating: 'АК', substrate: 'Ржавчина', purpose: 'Наружная', solubility: 'Органорастворимая', pricePerKg: 460, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'защиты поверхностей с остатками плотной ржавчины' },
  { id: 3, name: 'Грунтовка ЭП-0199', sku: 'KRK-ЭП-0199', category: 'Грунтовки', brand: 'ЭП-0199', type: 'Грунтовка', coating: 'ЭП', substrate: 'Металл', purpose: 'Внутренняя', solubility: 'Органорастворимая', pricePerKg: 380, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'эпоксидной защиты металлоконструкций' },
  { id: 4, name: 'Грунт-эмаль 3 в 1', sku: 'KRK-ГЭ-3в1', category: 'Грунт-эмали', brand: 'ГЭ-3в1', type: 'Грунт-эмаль', coating: 'Универсальная', substrate: 'Ржавчина', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 640, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'неочищенной от ржавчины поверхности' },
  { id: 5, name: 'Краска ВД-АК 111', sku: 'KRK-ВД-АК-111', category: 'Краски', brand: 'ВД-АК 111', type: 'Краска', coating: 'Водоэмульсионная', substrate: 'Минеральные основания', purpose: 'Внутренняя', solubility: 'Водорастворимая', pricePerKg: 210, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'внутренних отделочных работ по бетону, штукатурке и гипсокартону' },
  { id: 6, name: 'Полиуретановая эмаль ПУ-150', sku: 'KRK-ПУ-150', category: 'Эмали', brand: 'ПУ-150', type: 'Эмаль', coating: 'ПУ', substrate: 'Металл', purpose: 'Наружная', solubility: 'Органорастворимая', pricePerKg: 1250, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'атмосферостойкой защиты металлоконструкций, резервуаров и трубопроводов' },
  { id: 7, name: 'Эмаль МЛ-12', sku: 'KRK-МЛ-12', category: 'Эмали', brand: 'МЛ-12', type: 'Эмаль', coating: 'МЛ', substrate: 'Металл', purpose: 'Внутренняя', solubility: 'Органорастворимая', pricePerKg: 490, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'окрашивания оборудования и приборов в закрытых помещениях' },
  { id: 8, name: 'Лак ПФ-283', sku: 'KRK-ПФ-283', category: 'Лаки', brand: 'ПФ-283', type: 'Лак', coating: 'ПФ', substrate: 'Дерево', purpose: 'Внутренняя', solubility: 'Органорастворимая', pricePerKg: 340, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'финишной отделки деревянных поверхностей и паркета' },
  { id: 9, name: 'Растворитель 646', sku: 'KRK-РС-646', category: 'Растворители', brand: 'РС-646', type: 'Растворитель', coating: 'Универсальная', substrate: 'Универсальная', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 150, stock: true, packaging: [1, 10, 15, 30], colorSystems: [], paintFor: 'разбавления и доведения до рабочей вязкости пентафталевых и нитроцеллюлозных составов' },
  { id: 10, name: 'Разбавитель Р-4', sku: 'KRK-Р-4', category: 'Разбавители', brand: 'Р-4', type: 'Разбавитель', coating: 'Универсальная', substrate: 'Универсальная', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 180, stock: true, packaging: [1, 10, 15, 30], colorSystems: [], paintFor: 'разбавления перхлорвиниловых и других лакокрасочных материалов' },
  { id: 11, name: 'Отвердитель УР-1', sku: 'KRK-УР-1', category: 'Отвердители', brand: 'УР-1', type: 'Отвердитель', coating: 'ПУ', substrate: 'Универсальная', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 420, stock: true, packaging: [1, 10, 15, 30], colorSystems: [], paintFor: 'отверждения полиуретановых эмалей и грунтовок' },
  { id: 12, name: 'Грунтовка ГФ-021', sku: 'KRK-ГФ-021', category: 'Грунтовки', brand: 'ГФ-021', type: 'Грунтовка', coating: 'ГФ', substrate: 'Металл', purpose: 'Внутренняя', solubility: 'Органорастворимая', pricePerKg: 260, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'подготовки стальных поверхностей под эмали и лаки' },
  { id: 13, name: 'Резиновая краска', sku: 'KRK-РК-М', category: 'Специальные покрытия', brand: 'РК-М', type: 'Краска', coating: 'Резиновая', substrate: 'Металл', purpose: 'Наружная', solubility: 'Водорастворимая', pricePerKg: 720, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'эластичной защиты металла, кровель и резервуаров' },
  { id: 14, name: 'Краска дорожная разметочная', sku: 'KRK-ДР-1', category: 'Специальные покрытия', brand: 'ДР-1', type: 'Краска', coating: 'Дорожная', substrate: 'Бетон', purpose: 'Наружная', solubility: 'Водорастворимая', pricePerKg: 560, stock: false, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'нанесения горизонтальной дорожной разметки' },
  { id: 15, name: 'Эмаль термостойкая КО-811', sku: 'KRK-КО-811', category: 'Термостойкие покрытия', brand: 'КО-811', type: 'Эмаль', coating: 'КО', substrate: 'Металл', purpose: 'Наружная', solubility: 'Органорастворимая', pricePerKg: 1380, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'поверхностей, работающих при температуре до 600 °C' },
  { id: 16, name: 'Эмаль ЭП-140', sku: 'KRK-ЭП-140', category: 'Эмали', brand: 'ЭП-140', type: 'Эмаль', coating: 'ЭП', substrate: 'Металл', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 890, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'химически стойкой защиты оборудования и ёмкостей' },
  { id: 17, name: 'Грунт-эмаль ПФ-0142', sku: 'KRK-ПФ-0142', category: 'Грунт-эмали', brand: 'ПФ-0142', type: 'Грунт-эмаль', coating: 'ПФ', substrate: 'Металл', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 310, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'быстрой защиты металлоконструкций одним слоем' },
  { id: 18, name: 'Краска ВД-АК для дерева', sku: 'KRK-ВД-Д', category: 'Краски', brand: 'ВД-АК 111', type: 'Краска', coating: 'Водоэмульсионная', substrate: 'Дерево', purpose: 'Внутренняя', solubility: 'Водорастворимая', pricePerKg: 240, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ', 'NCS'], paintFor: 'окрашивания деревянных поверхностей внутри помещений' },
  { id: 19, name: 'Лак ЯН-153', sku: 'KRK-ЯН-153', category: 'Лаки', brand: 'ЯН-153', type: 'Лак', coating: 'Универсальная', substrate: 'Дерево', purpose: 'Внутренняя', solubility: 'Органорастворимая', pricePerKg: 300, stock: true, packaging: [1, 10, 15, 30], colorSystems: ['RAL', 'ГОСТ'], paintFor: 'масляной защиты деревянных поверхностей и металла' },
  { id: 20, name: 'Разбавитель Р-6', sku: 'KRK-Р-6', category: 'Разбавители', brand: 'Р-6', type: 'Разбавитель', coating: 'Универсальная', substrate: 'Универсальная', purpose: 'Универсальная', solubility: 'Органорастворимая', pricePerKg: 200, stock: true, packaging: [1, 10, 15, 30], colorSystems: [], paintFor: 'разбавления глифталевых и пентафталевых материалов' }
];

KRASKU.productById = function (id) {
  return KRASKU.products.find(function (p) { return String(p.id) === String(id); });
};

KRASKU.productsByCategory = function (catName) {
  return KRASKU.products.filter(function (p) { return p.category === catName; });
};

/* ---------- Спецификации товара (генерируются) ---------- */
KRASKU.specs = function (p) {
  if (/^ПФ-115 черная$/i.test(p.brand || '')) {
    return {
      'Тип продукта': p.type,
      'Марка': p.brand,
      'Цвет покрытия': 'Соответствует',
      'Внешний вид покрытия': 'Соответствует',
      'Блеск покрытия, %, не менее 50': '60',
      'Условная вязкость ВЗ-246 при 20 °C, с': '68',
      'Массовая доля нелетучих веществ, %': '49,1',
      'Степень разбавления до вязкости 28–30 с, %, не более 20': '20',
      'Степень перетира, мкм, не более 25': '25',
      'Укрывистость высушенного покрытия, г/м², не более 30': '30',
      'Время высыхания до степени 3 при 20 °C, ч, не более 24': '24',
      'Эластичность пленки при изгибе, мм, не более 1': '1',
      'Прочность покрытия при ударе, см, не менее 40': '40',
      'Твёрдость покрытия, не менее': 'ТМЛ — 0,13; М-3 — 0,24',
      'Адгезия покрытия, баллы, не более 1': '1',
      'Стойкость покрытия к статическому воздействию, не менее': 'воды — 2 ч; 0,5%-ного раствора моющего средства — 15 мин; трансформаторного масла — 24 ч'
    };
  }
  return {
    'Тип продукта': p.type,
    'Марка': p.brand,
    'Класс покрытия': p.coating,
    'Подложка': p.substrate,
    'Назначение': p.purpose,
    'Растворимость': p.solubility,
    'Цветовые системы': p.colorSystems.length ? p.colorSystems.join(', ') : 'Не колеруется',
    'Расход (1 слой, г/м²)': p.type === 'Эмаль' || p.type === 'Грунт-эмаль' ? '120–160' : (p.type === 'Грунтовка' ? '90–140' : '140–200'),
    'Время высыхания до степени 3, ч': '24',
    'Температура нанесения, °C': p.solubility === 'Водорастворимая' ? 'от +5 до +35' : 'от −10 до +35',
    'Температура эксплуатации, °C': p.category === 'Термостойкие покрытия' ? 'до +600' : 'от −40 до +80',
    'Массовая доля нелетучих веществ, %': p.solubility === 'Водорастворимая' ? '50 ± 2' : '65 ± 2',
    'Условная вязкость, сек': 'по ГОСТ 8420',
    'Гарантийный срок хранения, мес': '12'
  };
};

/* ---------- Описание товара (3 блока: текст, преимущества, доп.) ---------- */
KRASKU.productDescription = function (p) {
  if (p.slug === 'ак-503' && p.description) {
    return {
      text: p.description,
      benefits: [
        'Водостойкое матовое покрытие для дорожной разметки',
        'Подходит для бетонных и металлических поверхностей'
      ],
      extra: 'Наносите при температуре от +5°С до +30°С согласно инструкции по применению.'
    };
  }
  var lowerName = p.name.toLowerCase();
  return {
    text: p.name + ' предназначена для ' + (p.paintFor || 'промышленного окрашивания') + '. '
      + 'Состав разработан на собственном производстве и обеспечивает равномерное нанесение, '
      + 'хорошую укрывистость и стабильные характеристики плёнки при соблюдении технологии нанесения. '
      + 'Рекомендуется использовать в рамках системы покрытия, подобранной технологом.'
      + (p.solubility === 'Водорастворимая'
        ? ' Не содержит органических растворителей в опасной концентрации, пожаро- и экологически безопасна.'
        : ' Отличается повышенной стойкостью к атмосферным воздействиям и механическим нагрузкам.'),
    benefits: [
      'Произведено по ГОСТ и собственным ТУ с контролем на каждом этапе',
      'Стабильное качество партии — лабораторные испытания каждого выпуска',
      'Возможность колеровки по системам RAL, ГОСТ и NCS',
      'Доставка от 1 дня по России, фасовка от 1 кг до 30 кг'
    ],
    extra: 'Для гарантии совместимости покрытий рекомендуется применять грунтовки и отвердители производства KRASKU. '
      + 'Перед применением ознакомьтесь с инструкцией по применению и техническим паспортом. '
      + 'Подбор системы покрытия под ваши условия эксплуатации может выполнить технолог — бесплатно.'
  };
};

KRASKU.deliveryInfo = {
  'Самовывоз': 'Адрес отгрузки: г. Ярославль, Октября проспект 78, строение 5, офис 11. Отгрузку в нерабочее время необходимо согласовать.',
  'Доставка от производителя': 'Доставка по России и ЦФО от 1 дня собственной службой или транспортными компаниями. Срок и стоимость согласует менеджер.',
  'Доставка сторонним сервисом': 'Доставка любой транспортной компанией по договору. Менеджер подберёт оптимальный тариф и передаст трек-номер после отправки.'
};

KRASKU.packages = [
  { name: '1 кг', multiplier: 1 },
  { name: '10 кг', multiplier: 10 },
  { name: '15 кг', multiplier: 15 },
  { name: '30 кг', multiplier: 30 }
];

KRASKU.packageSets = [
  {
    id: 'kit-1',
    name: 'Эмаль + растворитель + разбавитель',
    desc: 'Полный набор для разовой покраски: эмаль, растворитель для доведения до рабочей вязкости и разбавитель для промывки инструмента.',
    include: ['Эмаль выбранной марки', 'Растворитель совместимый', 'Разбавитель совместимый', 'Инструкция по применению'],
    extra: 'Совместимость грунт + эмаль подтверждена производителем и проверена в лаборатории.',
    use: [
      'Подготовьте поверхность: удалите рыхлую ржавчину, масла и загрязнения, обезжирьте.',
      'Доведите эмаль до рабочей вязкости растворителем по паспорту качества.',
      'Нанесите эмаль кистью, валиком или распылением в 1–2 слоя с межслойной сушкой.',
      'Промойте инструмент разбавителем сразу после окончания работ.'
    ]
  },
  {
    id: 'kit-2',
    name: 'Эмаль + отвердитель',
    desc: 'Система для требовательных условий: эмаль с отвердителем даёт химически стойкое, износостойкое покрытие с увеличенным сроком службы.',
    include: ['Эмаль выбранной марки', 'Отвердитель в заводской дозировке', 'Инструкция по смешиванию', 'Совместимые грунтовки по согласованию'],
    extra: 'Совместимость грунт + эмаль подтверждена производителем и проверена в лаборатории.',
    use: [
      'Подготовьте поверхность и обезжирьте её перед нанесением.',
      'Смешайте эмаль с отвердителем в заводской дозировке и тщательно перемешайте.',
      'Нанесите состав в течение времени жизнеспособности смеси, указанного в паспорте.',
      'Промойте инструмент до начала отверждения смеси.'
    ]
  }
];

/* ---------- Статьи ---------- */
KRASKU.articleCats = ['Советы', 'Технологии', 'Новости', 'Производство'];

KRASKU.articles = [
  {
    id: 1, title: 'Как выбрать эмаль для металлических конструкций', category: 'Советы', date: '2026-07-28',
    excerpt: 'Назначение, подложка, условия эксплуатации: разбираем, от чего зависит выбор эмали и как не переплатить за «универсальные» составы.',
    content: [
      { title: 'С чего начать выбор', paragraphs: ['Выбор эмали для металла начинается не с цвета, а с условий эксплуатации. Именно от температуры, агрессивности среды и способа подготовки поверхности зависит тип плёнкообразующего вещества.', 'Сформулируйте задачу заранее: срок службы, атмосферные нагрузки, наличие химически агрессивной среды и требования к внешнему виду.' ] },
      { title: 'Тип плёнкообразующего вещества', paragraphs: ['Пентафталевые (ПФ) эмали подходят для умеренного климата и внутренних работ. Акриловые (АК) — для атмосферостойкой защиты. Эпоксидные (ЭП) и полиуретановые (ПУ) применяют там, где нужна химическая стойкость.', 'Чем сложнее условия, тем более ответственный состав требуется. Для простых задач «универсальная» эмаль часто выгоднее, чем дорогая система из нескольких слоёв.'] },
      { title: 'Учитывайте подложку', paragraphs: ['Обратите внимание на подложку. Для поверхности с остатками плотной ржавчины существуют грунт-эмали «3 в 1», которые не требуют полной зачистки до металла.', 'Для новых конструкций достаточно стандартной подготовки: обезжиривание, удаление рыхлой ржавчины и грунтование по необходимости.'] },
      { title: 'Расход и запас', paragraphs: ['Правильно оценивайте расход: он указывается для одного слоя. Для двухслойной защиты закладывайте запас 10–15%.', 'Не забывайте про растворитель для доведения состава до рабочей вязкости и средства для очистки инструмента.'] }
    ]
  },
  {
    id: 2, title: 'Грунт-эмаль 3 в 1: мифы и реальность', category: 'Технологии', date: '2026-07-14',
    excerpt: 'Один слой вместо трёх? Рассказываем, когда грунт-эмаль действительно экономит бюджет, а когда — нет.',
    content: [
      { title: 'Что такое грунт-эмаль', paragraphs: ['Грунт-эмаль совмещает грунтовочные, антикоррозионные и декоративные функции. Это экономит время и трудозатраты, но не отменяет подготовки поверхности.', 'Состав работает по плотной ржавчине, формируя адгезионный и антикоррозионный барьер одновременно с декоративным слоем.'] },
      { title: 'Где работает, а где — нет', paragraphs: ['Рыхлую ржавчину и окалину необходимо удалять механически. Только тогда покрытие «держит» на подложке.', 'Для конструкций с умеренными требованиями по долговечности грунт-эмаль — разумная экономия. В агрессивных промышленных средах однокомпонентного состава может не хватить.'] },
      { title: 'Когда выбирать систему «грунт + эмаль»', paragraphs: ['Для ответственных объектов, химически стойких покрытий и максимального срока службы выбирайте полноценную систему: грунт + эмаль (+ отвердитель при необходимости).', 'Технолог поможет оценить соотношение стоимости и долговечности для конкретной задачи — подбор системы бесплатный.'] }
    ]
  },
  {
    id: 3, title: 'Запущена новая линия колеровки', category: 'Новости', date: '2026-06-30',
    excerpt: 'На производстве KRASKU введена в строй автоматизированная линия колеровки по каталогам RAL, ГОСТ и NCS.',
    content: [
      { title: 'Что умеет новая линия', paragraphs: ['Новая линия позволяет колеровать продукцию по любым цветам каталогов RAL, ГОСТ и NCS с точностью дозировки пигмента до 0,1 г.', 'Автоматизация исключает влияние человеческого фактора и обеспечивает воспроизводимость оттенка от партии к партии.'] },
      { title: 'Условия заказа', paragraphs: ['Колеровка выполняется как для стандартной продукции, так и под индивидуальный заказ. Минимальный объём — одна фасовка.', 'Срок изготовления колерованной продукции — от одного рабочего дня в зависимости от объёма заказа.'] },
      { title: 'Согласование цвета', paragraphs: ['Цвет согласовывается с менеджером до начала производства, образец цвета предоставляется по запросу.', 'Для ответственных проектов возможно изготовление выкраса и утверждение эталона заказчиком.'] }
    ]
  },
  {
    id: 4, title: 'Водоэмульсионные и органорастворимые составы: что выбрать', category: 'Технологии', date: '2026-06-12',
    excerpt: 'Сравниваем два класса ЛКМ по стойкости, запаху, требованиям к основанию и стоимости владения.',
    content: [
      { title: 'Водоэмульсионные материалы', paragraphs: ['Водоэмульсионные материалы экологичнее, быстрее сохнут и не имеют резкого запаха. Их применение — стандарт для внутренних отделочных работ.', 'Составы на водной основе легко наносятся, инструмент промывается водой, а помещение можно эксплуатировать уже через несколько часов.'] },
      { title: 'Органорастворимые составы', paragraphs: ['Органорастворимые составы формируют более плотную и химически стойкую плёнку, работают при отрицательных температурах и пригодны для металла.', 'Они требуют применения растворителя для доведения вязкости и очистки инструмента, а при нанесении — средств защиты органов дыхания.'] },
      { title: 'Что выбрать', paragraphs: ['Выбор определяется задачей: «атмосферостойкая защита металла» и «декоративная отделка помещения» — это разные системы с разным бюджетом.', 'Для наружной защиты металла предпочтительны органорастворимые эмали, для внутренней отделки — водоэмульсионные краски.'] }
    ]
  },
  {
    id: 5, title: 'Термостойкие покрытия: когда они нужны', category: 'Советы', date: '2026-05-21',
    excerpt: 'Печи, дымоходы, выхлопные системы: разбираем классы термостойких эмалей и предельные температуры.',
    content: [
      { title: 'Где нужны термостойкие эмали', paragraphs: ['Термостойкие кремнийорганические эмали выдерживают нагрев до 600 °C и выше. Они незаменимы для печей, котлов, выхлопных труб.', 'Обычные эмали при высокотемпературном нагреве темнеют, растрескиваются и теряют защитные свойства.'] },
      { title: 'Ключевые параметры', paragraphs: ['Ключевой параметр — не только пиковая температура, но и продолжительность воздействия, а также термоциклирование.', 'При подборе состава укажите максимальную температуру поверхности и режим работы: постоянный нагрев или циклы нагрева и остывания.'] },
      { title: 'Особенности нанесения', paragraphs: ['Термостойкие покрытия требуют полного отверждения по инструкции, иначе плёнка может не набрать заявленную прочность.', 'Первый нагрев рекомендуется проводить постепенно — это помогает плёнке окончательно сформироваться.'] }
    ]
  },
  {
    id: 6, title: 'Контроль качества: от лаборатории до склада', category: 'Производство', date: '2026-04-30',
    excerpt: 'Как устроен контроль качества на производстве KRASKU: входной контроль сырья, лабораторные испытания и архивные образцы.',
    content: [
      { title: 'Входной контроль сырья', paragraphs: ['Каждая партия сырья проходит входной контроль в заводской лаборатории. Показатели вязкости, плотности и цвета фиксируются в электронном журнале.', 'Несоответствующее сырьё возвращается поставщику — в производство поступают только подтверждённые материалы.'] },
      { title: 'Испытания готовой партии', paragraphs: ['После выпуска партия тестируется по основным показателям: укрывистость, время высыхания, адгезия, массовая доля нелетучих веществ.', 'Результаты испытаний заносятся в паспорт качества, который прилагается к каждой отгрузке.'] },
      { title: 'Архивные образцы', paragraphs: ['Архивные образцы каждой партии хранятся 24 месяца — при любом обращении клиента мы можем подтвердить состав и качество поставки.', 'Это позволяет быстро разбирать рекламации и объективно оценивать поведение материала в эксплуатации.'] }
    ]
  }
];

KRASKU.articleById = function (id) {
  return KRASKU.articles.find(function (a) { return String(a.id) === String(id); });
};

KRASKU.formatDate = function (iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

KRASKU.todayISO = function () {
  return new Date().toISOString().slice(0, 10);
};

/* ---------- FAQ ---------- */
KRASKU.faq = [
  { q: 'Как выбрать цвет?', a: 'Продукция колеруется по системам RAL, ГОСТ и NCS. Выберите систему в карточке товара, а конкретный номер цвета согласуйте с менеджером — он уточнит оттенок и подготовит образец при необходимости.' },
  { q: 'Какие фасовки доступны?', a: 'Основные фасовки — 1 кг, 10 кг, 15 кг и 30 кг. Одну фасовку можно добавить несколько раз, сайт автоматически рассчитает общий вес и предварительную стоимость.' },
  { q: 'Можно ли заказать нестандартный цвет?', a: 'Да. Колеровка выполняется по любому образцу в рамках систем RAL, ГОСТ и NCS. Точный оттенок согласовывается с технологом, цвет может быть подтверждён выкрасом.' },
  { q: 'Как рассчитывается стоимость?', a: 'Цена указывается за 1 кг. Вы добавляете нужные фасовки — сайт считает общий вес и предварительную стоимость. Итоговая цена фиксируется в заявке после подтверждения менеджером.' },
  { q: 'Можно ли заказать доставку?', a: 'Да. Доступны самовывоз в Ярославле, доставка по России и ЦФО от производителя, а также отправка транспортными компаниями.' },
  { q: 'Нужна ли предоплата?', a: 'Для физических лиц возможна оплата при получении по согласованию. Для юридических лиц действует оплата по счёту после выставления. Условия фиксируются в заявке.' }
];

/* ---------- Документация ---------- */
KRASKU.docs = [
  { id: 1, name: 'Паспорт качества — Эмаль ПФ-115', cat: 'Паспорта качества', format: 'PDF', size: '0,4 МБ', date: '2026-07-20' },
  { id: 2, name: 'Паспорт качества — Грунт-эмаль 3 в 1', cat: 'Паспорта качества', format: 'PDF', size: '0,4 МБ', date: '2026-07-15' },
  { id: 3, name: 'Сертификат соответствия на эмали', cat: 'Сертификаты', format: 'PDF', size: '0,9 МБ', date: '2026-03-02' },
  { id: 4, name: 'Сертификат соответствия на грунтовки', cat: 'Сертификаты', format: 'PDF', size: '0,8 МБ', date: '2026-03-02' },
  { id: 5, name: 'Инструкция по применению — ПФ-115', cat: 'Инструкции', format: 'PDF', size: '0,3 МБ', date: '2026-06-10' },
  { id: 6, name: 'Инструкция по применению — ПУ-150', cat: 'Инструкции', format: 'PDF', size: '0,3 МБ', date: '2026-06-10' },
  { id: 7, name: 'ТУ 2312-001-XXХХХХ-2026 «Эмали»', cat: 'Техническая документация', format: 'PDF', size: '2,1 МБ', date: '2026-01-15' },
  { id: 8, name: 'ТУ 2312-002-XXХХХХ-2026 «Грунтовки»', cat: 'Техническая документация', format: 'PDF', size: '1,8 МБ', date: '2026-01-15' },
  { id: 9, name: 'ГОСТ 6465-76 — Эмали ПФ', cat: 'ГОСТ', format: 'PDF', size: '1,2 МБ', date: '2025-12-01' },
  { id: 10, name: 'ГОСТ 9.402 — Подготовка поверхности', cat: 'ГОСТ', format: 'PDF', size: '1,4 МБ', date: '2025-12-01' },
  { id: 11, name: 'ТУ на грунт-эмали «3 в 1»', cat: 'ТУ', format: 'PDF', size: '1,6 МБ', date: '2026-02-10' },
  { id: 12, name: 'ТУ на термостойкие эмали', cat: 'ТУ', format: 'PDF', size: '1,5 МБ', date: '2026-02-10' }
];

KRASKU.docCats = ['Паспорта качества', 'Сертификаты', 'Инструкции', 'Техническая документация', 'ГОСТ', 'ТУ'];

/* ---------- Партнёры ---------- */
KRASKU.partners = [
  { name: 'Лемана ПРО', logo: 'assets/partners/lemana-pro.svg' },
  { name: 'Ozon', logo: 'assets/partners/ozon.svg' },
  { name: 'Wildberries', logo: 'assets/partners/wildberries.svg' },
  { name: 'Комус', logo: 'assets/partners/komus.svg' },
  { name: 'ВсеИнструменты.ру', logo: 'assets/partners/vseinstrumenti.svg' },
  { name: 'Газпром', logo: 'assets/partners/gazprom.svg' },
  { name: 'Славнефть', logo: 'assets/partners/slavneft.svg' },
  { name: 'РЖД', logo: 'assets/partners/rzd.svg' }
];

/* ---------- Заявки (mock для ЛК) ---------- */
KRASKU.requests = [
  { id: 'ЗК-2026-0142', date: '2026-08-05', product: 'Эмаль ПФ-115', sku: 'KRK-ПФ-115', total: '240 кг', price: '124 800 ₽', status: 'work', statusText: 'Согласование с технологом' },
  { id: 'ЗК-2026-0108', date: '2026-07-19', product: 'Грунт-эмаль 3 в 1', sku: 'KRK-ГЭ-3в1', total: '60 кг', price: '38 400 ₽', status: 'done', statusText: 'Отправлено в производство' },
  { id: 'ЗК-2026-0071', date: '2026-07-02', product: 'Краска ВД-АК 111', sku: 'KRK-ВД-АК-111', total: '120 кг', price: '25 200 ₽', status: 'new', statusText: 'Новая заявка' }
];

/* ---------- Сообщения чата (mock) ---------- */
KRASKU.chatMessages = [
  { from: 'manager', text: 'Здравствуйте! Чем могу помочь? Подберу покрытие и подготовлю КП в течение рабочего дня.', time: '10:02' },
  { from: 'client', text: 'Мне нужна эмаль для металлических конструкций на открытом воздухе.', time: '10:05' },
  { from: 'manager', text: 'Для наружной эксплуатации рекомендую полиуретановую эмаль ПУ-150 или грунт-эмаль 3 в 1, если поверхность с остатками ржавчины. Могу подготовить расчёт по фасовкам.', time: '10:07' }
];

/* ---------- Входящие сообщения (mock для ЛК) ---------- */
KRASKU.seedMessages = [
  { id: 'm1', from: 'manager', author: 'Менеджер KRASKU', subject: 'Заявка ЗК-2026-0142 согласована', text: 'Здравствуйте! Заявка на эмаль ПФ-115 (240 кг) согласована с технологом. Срок производства — 3 рабочих дня, отгрузка от 1 дня по готовности.', date: '2026-08-06', read: false },
  { id: 'm2', from: 'manager', author: 'Менеджер KRASKU', subject: 'КП по грунт-эмали 3 в 1', text: 'Подготовили коммерческое предложение на грунт-эмаль 3 в 1. При объёме от 100 кг скидка 7%. Готовы обсудить фасовки и доставку.', date: '2026-07-21', read: true },
  { id: 'm3', from: 'system', author: 'Служба поддержки', subject: 'Новая возможность — колеровка NCS', text: 'Теперь колеруем продукцию по каталогу NCS. Подробности — в разделе «Колеровка».', date: '2026-07-01', read: true }
];
