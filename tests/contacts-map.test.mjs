import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('contacts page embeds an accessible map for the Yaroslavl address', async () => {
  const page = await readFile(new URL('../contacts.html', import.meta.url), 'utf8');

  assert.match(page, /class="map-frame"/);
  assert.match(page, /<iframe[^>]+title="Карта проезда к KRASKU.RU в Ярославле"/);
  assert.match(page, /https:\/\/yandex\.ru\/map-widget\/v1\//);
  assert.match(page, /pt=39\.813459,57\.591695,pm2rdm/);
  assert.match(page, /Ярославль/);
  assert.match(page, /Октября проспект 78, строение 5, офис 11/);
  assert.doesNotMatch(page, /Заводская/);
  assert.match(page, /loading="lazy"/);
  assert.doesNotMatch(page, /map-frame__link/);
});
