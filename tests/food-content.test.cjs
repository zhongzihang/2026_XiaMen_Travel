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

test('at least ten destination-area discoveries include photo galleries and sourced food reviews', () => {
  const foods = loadExtraFoods();
  const expected = [
    'chaisu-tusun-dong', 'zhonglijun-manjian', 'chenjia-dessert', 'haoxiang-pork-skewer',
    'jukou-noodles', 'laosixi-egg-burger', 'daixifu-gingerduck', 'laobashi-fried',
    'hengzhu-steamed-bun', 'danmanguan-gulangyu'
  ];

  for (const id of expected) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing food entry ${id}`);
    assert.match(food.source, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.ok(food.gallery?.length, `${id} needs at least one real photo`);
    assert.ok(food.reviews?.length, `${id} needs a sourced evaluation`);
    for (const photo of food.gallery) {
      assert.ok(fs.existsSync(path.join(root, photo.src)), `missing photo ${photo.src}`);
    }
    for (const review of food.reviews) {
      assert.match(review.url, /^https:\/\//);
      assert.ok(review.summary, `${id} review needs a useful summary`);
    }
  }
  assert.ok(expected.filter(id => foods.find(item => item.id === id).gallery.length > 1).length >= 2,
    'at least two entries should demonstrate multi-photo switching');
});

test('food detail gallery and evaluation markup scales to photo count and escapes review text', () => {
  const window = {};
  const source = fs.readFileSync(path.join(root, 'food-details.js'), 'utf8');
  vm.runInNewContext(source, { window });
  const helper = window.XiamenFoodDetails;
  const multi = helper.galleryMarkup({
    name: '店名', gallery: [{ src: 'one.jpg', caption: '第一张' }, { src: 'two.jpg', caption: '第二张' }]
  });
  const single = helper.galleryMarkup({ name: '店名', image: 'one.jpg', imageAlt: '单张实拍' });
  const reviews = helper.reviewsMarkup([{ title: '食客体验', source: '小红书', date: '2026-09', summary: '<b>口感</b>不错', url: 'https://example.com/review' }]);

  assert.match(multi, /data-gallery-step="-1"/);
  assert.match(multi, /data-gallery-step="1"/);
  assert.match(multi, /1 \/ 2/);
  assert.doesNotMatch(single, /data-gallery-step/);
  assert.match(reviews, /食客评测/);
  assert.match(reviews, /&lt;b&gt;口感&lt;\/b&gt;不错/);
  assert.match(reviews, /https:\/\/example\.com\/review/);
});
