const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'image-previews.js'), 'utf8'), context);

test('every listed photo preview exists, is WebP, and transfers fewer bytes', () => {
  const previews = Object.entries(context.window.XiamenImagePreviews);
  assert.ok(previews.length >= 70);
  for (const [original, preview] of previews) {
    const source = fs.readFileSync(path.join(root, original));
    const small = fs.readFileSync(path.join(root, preview));
    assert.equal(small.toString('ascii', 0, 4), 'RIFF', preview);
    assert.equal(small.toString('ascii', 8, 12), 'WEBP', preview);
    assert.ok(small.length < source.length, `${preview} should be smaller than ${original}`);
  }
});

test('map artwork previews are present and total less than one megabyte', () => {
  const names = [
    'xiamen-overview-watercolor-v2', 'xiamen-landmarks-v2',
    'xiamen-hotel-watercolor-v1', 'xiamen-station-watercolor-v1',
    'xiamen-zhongshan-watercolor-v1', 'xiamen-yujian-watercolor-v1',
  ];
  const total = names.reduce((size, name) => size + fs.statSync(path.join(root, `assets/preview/${name}.webp`)).size, 0);
  assert.ok(total < 1_000_000, `map artwork is ${total} bytes`);
});
