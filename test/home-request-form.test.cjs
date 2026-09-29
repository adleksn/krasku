const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const home = fs.readFileSync('index.html', 'utf8');

test('подробная заявка отмечает Email обязательным и поясняет ИНН и город', () => {
  assert.match(home, /for="full-email">Email <span class="req">\*<\/span><\/label>\s*<input id="full-email" name="email" type="email" required>/);
  assert.match(home, /id="full-inn" name="inn" type="text" placeholder="Заполните, если нужен счет"/);
  assert.match(home, /id="full-city" name="city" type="text" placeholder="Заполните, если нужен счет с доставкой"/);
});
