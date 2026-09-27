const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadExtraFoods() {
  const item = { name: '测试门店', address: '测试地址', localPhotos: [], source: 'https://example.test' };
  const window = { XiamenPhotoResearch: Object.fromEntries(
    ['yuehua', 'huangzehe', 'minhenan', 'yanyu', 'wutang', 'yubao'].map(id => [id, item])
  ) };
  const source = fs.readFileSync(path.join(root, 'travel-enrichment.js'), 'utf8');
  vm.runInNewContext(source, { window });
  return window.XiamenExtraFoods;
}

test('Xiaohongshu-matched ginger duck shops have Dianping destinations and bundled real photos', () => {
  const foods = loadExtraFoods();
  const expected = [
    ['diaoyuchuan-shapowei', '沙坡尾', 'assets/gallery/food-diaoyuchuan-xhs-2026.jpg'],
    ['xinwutang-gingerduck', '中山路', 'assets/gallery/food-xinwutang-xhs-2026.jpg']
  ];

  for (const [id, area, image] of expected) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing food entry ${id}`);
    assert.equal(food.area, area);
    assert.match(food.source, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.match(food.dianpingUrl, /^https:\/\/(www\.|m\.)?dianping\.com\/shop\//);
    assert.match(food.photoLabel, /小红书.*实拍/);
    assert.ok(fs.existsSync(path.join(root, image)), `missing local photo ${image}`);
  }
});

test('food details render a direct Dianping destination while keeping existing Meituan links', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /food\.meituanUrl[\s\S]{0,240}在美团查看这家门店/);
  assert.match(app, /food\.dianpingUrl[\s\S]{0,240}在大众点评查看这家门店/);
  assert.match(app, /在大众点评查看这家门店/);
  assert.match(app, /target="_blank" rel="noopener noreferrer"/);
});
