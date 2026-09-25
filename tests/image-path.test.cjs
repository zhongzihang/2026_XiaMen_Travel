const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveImagePath } = require('../image-path.js');

test('adds the asset prefix only to bare local file names', () => {
  assert.equal(resolveImagePath('food_shacha.jpg'), 'assets/food_shacha.jpg');
  assert.equal(resolveImagePath('assets/food_shacha.jpg'), 'assets/food_shacha.jpg');
  assert.equal(resolveImagePath('https://example.test/photo.jpg'), 'https://example.test/photo.jpg');
  assert.equal(resolveImagePath('/images/photo.jpg'), '/images/photo.jpg');
  assert.equal(resolveImagePath('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
  assert.equal(resolveImagePath('  '), '');
});
