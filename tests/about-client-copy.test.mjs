import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('about page contains the client-approved equipment, certification, and delivery copy', async () => {
  const page = await readFile(new URL('../about.html', import.meta.url), 'utf8');

  for (const copy of [
    'Линии диссольверов и бисерных мельниц позволяют производить одновременно большой ассортимент продукции при высоком качестве.',
    'Высоко точное оборудование для дозирования компонентов по рецептуре на производстве - каждая партия воспроизводима.',
    'Продукция выпускается по ГОСТ и ТУ, подтверждена сертификатами соответствия.',
    'От 1 дня - по Ярославлю, Москве (МО) и областям ЦФО.'
  ]) {
    assert.ok(page.includes(copy), 'missing client copy: ' + copy);
  }

  assert.match(
    page,
    /<b>Соответствие ТУ \/ ГОСТ<\/b><span>техническому регламенту<\/span>/,
    'missing client compliance feature copy'
  );

  for (const removedCopy of [
    'Линии диссольверов, бисерные мельницы',
    'Дозирование компонентов автоматизировано',
    '40 т / сутки',
    'ГОСТ и собственным ТУ',
    'По России и ЦФО — от 1 дня собственной службой или транспортными компаниями.'
  ]) {
    assert.ok(!page.includes(removedCopy), 'outdated copy remains: ' + removedCopy);
  }
});
