const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const product = fs.readFileSync('js/product.js', 'utf8');

test('преимущества в описании товара получают тематические иконки вместо галочек', () => {
  assert.match(product, /desc\.benefits\.map\(function \(b, index\)/);
  assert.match(product, /\[t\.factory, t\.flask, t\.palette, t\.truck\]/);
  assert.doesNotMatch(product, /desc\.benefits\.map\(function \(b\) \{ return '<li class="about-feature">' \+ ns\.ICONS\.check/);
});
