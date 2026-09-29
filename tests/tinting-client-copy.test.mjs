import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('tinting page contains the client-approved production and payment copy', async () => {
  const page = await readFile(new URL('../tinting.html', import.meta.url), 'utf8');

  for (const copy of [
    'или описанием оттенка, эталона.',
    'Оплата заказа',
    'Клиент согласовывает и оплачивает счёт.',
    'Заказ ставится в производство, проверяется лабораторией цвета и отгружается.',
    'Отгружается краска, эмаль из наличия на складе.',
    'Производство и колеровка эмали из картотеки ГОСТ по эталону.',
    'Консультация технолога и согласование цвета.',
    'Производим эмали цветом картотеки ГОСТ по эталонам цвета заказчика.'
  ]) {
    assert.ok(page.includes(copy), 'missing client copy: ' + copy);
  }
});

test('home hero uses the updated production proposition and statistics', async () => {
  const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  for (const copy of [
    'Лакокрасочные материалы по ГОСТ&nbsp;/&nbsp;ТУ&nbsp;/&nbsp;ТЗ — с паспортом качества.',
    'Производство, комплектация по ценам завода, прямая поставка по России.',
    'с 2004 года'
  ]) {
    assert.ok(page.includes(copy), 'missing client copy: ' + copy);
  }
});
