const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function viewBoxWidth(file) {
  const svg = fs.readFileSync(file, 'utf8');
  return Number(svg.match(/viewBox="0 0 (\d+) \d+"/)[1]);
}

test('wide partner wordmarks have enough SVG canvas to avoid clipping', () => {
  assert.ok(viewBoxWidth('assets/partners/lemana-pro.svg') >= 270);
  assert.ok(viewBoxWidth('assets/partners/vseinstrumenti.svg') >= 350);
});
