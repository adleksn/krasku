const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const css = fs.readFileSync('css/components.css', 'utf8');
const vseinstrumenti = fs.readFileSync('assets/partners/vseinstrumenti.svg', 'utf8');

test('Лемана ПРО и ВсеИнструменты получают увеличенный размер в сетке партнёров', () => {
  assert.match(css, /\.partner:nth-child\(1\) img \{ width: min\(190px, 92%\); \}/);
  assert.match(css, /\.partner:nth-child\(5\) img \{ width: min\(190px, 92%\); \}/);
});

test('слово ВсеИнструменты центрируется внутри широкого SVG-холста', () => {
  assert.match(vseinstrumenti, /x="200" text-anchor="middle"/);
});
