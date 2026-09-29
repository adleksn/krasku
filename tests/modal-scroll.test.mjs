import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('modal backdrop stays fixed while a long configuration form scrolls', async () => {
  const styles = await readFile(new URL('../css/components.css', import.meta.url), 'utf8');
  const backdrop = styles.slice(styles.indexOf('.modal-backdrop'), styles.indexOf('.modal-dialog'));

  assert.match(backdrop, /position:\s*fixed/);
  assert.match(backdrop, /inset:\s*0/);
});
