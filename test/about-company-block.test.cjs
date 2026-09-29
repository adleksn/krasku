const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const home = fs.readFileSync('index.html', 'utf8');

test('блок о компании отражает обновлённое позиционирование и документы', () => {
  assert.match(home, /<h2>Производитель ООО «КРАСКУ\.РУ»<\/h2>/);
  assert.match(home, /адресная доставка на склад, объект заказчика в минимальный срок/);
  assert.match(home, /Ваш производственный партнёр\. Обеспечим дистрибьюторов конкурентными условиями и ценами, стабильным качеством и поддержкой на всех этапах\./);
  assert.match(home, /<b>Документы в комплекте<\/b><span>Паспорт качества ГОСТ\/ТУ<\/span>/);
});
