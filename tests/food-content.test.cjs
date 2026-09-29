const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadExtraFoods(researchOverrides = {}) {
  const item = { name: '测试门店', address: '测试地址', localPhotos: [], source: 'https://example.test' };
  const window = { XiamenPhotoResearch: Object.fromEntries(
    ['yuehua', 'huangzehe', 'minhenan', 'yanyu', 'wutang', 'yubao'].map(id => [id, { ...item, ...researchOverrides[id] }])
  ) };
  const source = fs.readFileSync(path.join(root, 'travel-enrichment.js'), 'utf8');
  vm.runInNewContext(source, { window, URL });
  return window.XiamenExtraFoods;
}

function loadFoodCatalog() {
  const context = { window: {} };
  for (const file of ['place-photo-data.js', 'place-photo-additions.js', 'travel-enrichment.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const start = app.indexOf('const foods = [');
  const end = app.indexOf('const officialSources =', start);
  vm.runInNewContext(`${app.slice(start, end)}\nthis.foodCatalog = foods;`, context);
  return context.foodCatalog;
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

test('Jinhaiwan is featured second after the Shapowei ginger duck guide', () => {
  const foods = loadExtraFoods();
  const jinhaiwan = foods.find(item => item.id === 'jinhaiwan-shapowei');
  const diaoyuchuan = foods.find(item => item.id === 'diaoyuchuan-shapowei');

  assert.equal(jinhaiwan?.featuredRank, 2);
  assert.equal(diaoyuchuan?.featuredRank, 1);
  assert.ok(jinhaiwan.reviews.some(review => review.url.includes('/explore/6aadea1b0000000026021a3f')));
  assert.ok(diaoyuchuan.reviews.some(review => review.url.includes('/explore/6ab0f2060000000036017667')));
  assert.equal(diaoyuchuan.image, 'assets/gallery/food-diaoyuchuan-xhs-2026.jpg');
});

test('Jinhaiwan adds the four supplied local photos to its real-photo gallery', () => {
  const foods = loadExtraFoods();
  const jinhaiwan = foods.find(item => item.id === 'jinhaiwan-shapowei');
  const expected = [
    'assets/gallery/food-jinhaiwan-user-01.png',
    'assets/gallery/food-jinhaiwan-user-02.png',
    'assets/gallery/food-jinhaiwan-user-03.png',
    'assets/gallery/food-jinhaiwan-user-04.png'
  ];

  assert.equal(jinhaiwan?.image, expected[0]);
  assert.equal(jinhaiwan?.photoLabel, '用户提供实拍');
  assert.deepEqual(Array.from(jinhaiwan.gallery, photo => photo.src), expected);
  for (const image of expected) assert.ok(fs.existsSync(path.join(root, image)), `missing local photo ${image}`);
});

test('new route-area food cards have distinct sourced reviews and matching real photos', () => {
  const foods = loadExtraFoods();
  const expected = [
    ['zhengbaishun-gulangyu', '鼓浪屿', '闽南正餐'],
    ['adai-datong', '中山路', '闽南正餐'],
    ['linjinji-fishball', '鼓浪屿', '厦门小吃'],
    ['luama-dessert', '鼓浪屿', '甜汤饮品']
  ];
  const noteIds = new Set();
  for (const [id, area, category] of expected) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing ${id}`);
    assert.equal(food.area, area);
    assert.equal(food.category, category);
    assert.match(food.image, /^assets\/gallery\/food-.*-xhs-01\.jpg$/);
    assert.match(food.photoLabel, /小红书.*实拍/);
    assert.ok(food.gallery?.length >= 2, `${id} needs more than one matching photo`);
    assert.equal(food.gallery[0].src, food.image);
    for (const photo of food.gallery) assert.ok(fs.existsSync(path.join(root, photo.src)), `missing ${photo.src}`);
    assert.match(food.mapUrl, /^https:\/\/(?:uri|ditu)\.amap\.com\//);
    assert.ok(food.reviews?.length, `${id} needs a first-hand review`);
    for (const review of food.reviews) {
      assert.ok(review.summary);
      const noteId = /\/search_result\/([a-f0-9]+)/.exec(review.url)?.[1];
      assert.ok(noteId, `${id} needs a direct XHS note`);
      assert.ok(!noteIds.has(noteId), `${id} repeats note ${noteId}`);
      noteIds.add(noteId);
    }
  }
});

test('cards without a matching photo do not promise one in their fallback copy', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const details = fs.readFileSync(path.join(root, 'food-details.js'), 'utf8');
  assert.doesNotMatch(app, /暂无匹配的店内实拍图<br>点卡片查看近期照片/);
  assert.match(app, /暂无匹配的店内实拍图<br>点卡片看食客评测/);
  assert.match(details, /暂无匹配的店内实拍/);
  assert.match(details, /images\.length === 1 \? '单张实拍照片' : '暂无匹配的店内实拍照片'/);
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

test('legacy food cards expose every researched local photo and any supplied reviews', () => {
  const foods = loadExtraFoods({
    yuehua: {
      localPhotos: [
        { path: 'assets/gallery/yuehua-1.jpg', source: 'https://www.xiaohongshu.com/explore/post-1' },
        { path: 'assets/gallery/yuehua-2.jpg', source: 'https://www.xiaohongshu.com/explore/post-2' }
      ],
      reviews: [{ source: '小红书', title: '近期探店', summary: '汤底浓，料可自选。', url: 'https://www.xiaohongshu.com/explore/post-1' }]
    }
  });
  const yuehua = foods.find(item => item.id === 'yuehua');

  assert.equal(yuehua.gallery.length, 3);
  assert.match(yuehua.gallery[1].src, /yuehua-2\.jpg$/);
  assert.equal(yuehua.gallery[2].src, 'assets/gallery/food-yuehua-remote-01.jpg');
  assert.ok(fs.existsSync(path.join(root, yuehua.gallery[2].src)));
  assert.equal(yuehua.reviews[0].source, '小红书');
  assert.equal(yuehua.reviews.length, 3);
  assert.match(yuehua.reviews[0].summary, /汤底浓/);
});

test('new XHS discoveries add a seafood rice meal and a Shapowei Taiwanese snack with review galleries', () => {
  const foods = loadExtraFoods();
  const expected = [
    ['zhengyoucai-casserole-congee', '中山路', '海鲜大餐', 4],
    ['thickbinyou-braised-rice', '沙坡尾', '台式小吃', 3]
  ];

  for (const [id, area, category, minimumPhotos] of expected) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing food entry ${id}`);
    assert.equal(food.area, area);
    assert.equal(food.category, category);
    assert.ok(food.gallery.length >= minimumPhotos, `${id} needs multiple matching photos`);
    assert.ok(food.reviews.length, `${id} needs a sourced evaluation`);
    assert.match(food.source, /^https:\/\/www\.xiaohongshu\.com\//);
    for (const photo of food.gallery) assert.ok(fs.existsSync(path.join(root, photo.src)), `missing photo ${photo.src}`);
    for (const review of food.reviews) assert.match(review.url, /^https:\/\//);
  }
});

test('food detail gallery and evaluation markup scales to photo count and escapes review text', () => {
  const window = {};
  const source = fs.readFileSync(path.join(root, 'food-details.js'), 'utf8');
  vm.runInNewContext(source, { window, URL });
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

test('Xiaohongshu review links use the app deep link without exposing a broken web fallback', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'food-details.js'), 'utf8'), { window, URL });
  const markup = window.XiamenFoodDetails.reviewsMarkup([{
    source: '小红书 · 食客', title: '到店记录', summary: '现场体验摘要',
    url: 'https://www.xiaohongshu.com/search_result/66ab1234567890ab?xsec_token=volatile-token&xsec_source='
  }]);

  assert.match(markup, /href="xhsdiscover:\/\/item\/66ab1234567890ab"/);
  assert.match(markup, /打开小红书App查看这条笔记/);
  assert.doesNotMatch(markup, /href="https:\/\/www\.xiaohongshu\.com|网页查看原帖/);
  assert.doesNotMatch(markup, /volatile-token|search_result/);
});

test('every Xiaohongshu review card links to the note ID carried by its source URL', () => {
  const foods = loadFoodCatalog();
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'food-details.js'), 'utf8'), { window, URL });
  const helper = window.XiamenFoodDetails;
  const xhsReviews = foods.flatMap(food => (food.reviews || [])
    .filter(review => /小红书/.test(review.source || ''))
    .map(review => ({ food: food.name, review })));

  assert.ok(xhsReviews.length >= 10, 'expected the current XHS review cards to be audited');
  for (const { food, review } of xhsReviews) {
    const sourceUrl = new URL(review.url);
    const noteId = sourceUrl.pathname.match(/^\/(?:search_result|explore)\/([\w-]+)\/?$/)?.[1];
    assert.ok(noteId, `${food}: XHS source URL must contain a note ID`);
    const markup = helper.reviewsMarkup([review]);
    assert.match(markup, new RegExp(`href="xhsdiscover:\\/\\/item\\/${noteId}"`), `${food}: app destination must match source note`);
    assert.doesNotMatch(markup, /网页查看原帖|https:\/\/www\.xiaohongshu\.com/);
  }
});

test('researched reviews and append-only photo galleries preserve existing Wenzao hero photos', () => {
  const foods = loadFoodCatalog();
  const expectedImages = {
    qingjun: 'assets/gallery/food-qingjun-bao-3.jpg',
    xiaoyanjing: 'assets/gallery/food-xiaoyanjing-1.jpg',
    wufanpo: 'assets/food_shacha.jpg',
    lailai: 'assets/gallery/food-lailai.jpg',
    alian: 'assets/gallery/food-alian.jpg',
    aming: 'assets/gallery/food-aming.jpg',
    shangqing: 'assets/gallery/food-shangqing.jpg',
    huanghai: 'assets/food_oyster.jpg',
    '1980': 'assets/gallery/food-1980.jpg',
    'longtou-fishball': 'assets/gallery/food-longtou-fishball-new.jpg'
  };

  for (const [id, originalImage] of Object.entries(expectedImages)) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing food entry ${id}`);
    assert.equal(food.image, originalImage, `${id} primary photo must stay unchanged`);
    assert.ok(food.reviews?.length, `${id} needs researched comments`);
    assert.ok(food.reviews.every(review => /^https:\/\//.test(review.url)), `${id} reviews need source links`);
  }

  const galleryIds = ['qingjun', 'xiaoyanjing', 'lailai', 'alian', 'aming', 'shangqing', 'huanghai', '1980', 'longtou-fishball'];
  for (const id of galleryIds) {
    const food = foods.find(item => item.id === id);
    assert.equal(food.gallery?.[0]?.src, expectedImages[id], `${id} carousel must start with its original photo`);
    assert.ok(food.gallery.length > 1, `${id} needs appended real photos for swiping`);
  }

  const linxi = foods.find(item => item.id === 'menglinxi-shaojiu');
  assert.ok(linxi, 'missing Wenzao recommendation 梦林夕烧酒档');
  assert.equal(linxi.area, '文灶');
  assert.ok(linxi.gallery.length >= 2, '梦林夕 needs multiple real photos');
  assert.ok(linxi.reviews.length, '梦林夕 needs sourced diner feedback');
  assert.match(linxi.dianpingUrl, /^https:\/\/www\.dianping\.com\/shop\//);

  const researchedIds = ['alian', 'aming', 'shangqing', 'wuhongying', 'aqing', 'lailai', 'wufanpo', 'ye', 'huanghai', '1980', 'yuehua', 'huangzehe', 'longtou-fishball'];
  for (const id of researchedIds) {
    const food = foods.find(item => item.id === id);
    assert.ok(food?.reviews?.length, `${id} needs a researched evaluation`);
    assert.ok(food.reviews.every(review => /^https:\/\//.test(review.url)), `${id} reviews need source links`);
  }
});

test('unreviewed destination cards gain sourced diner notes and append-only photo galleries', () => {
  const foods = loadFoodCatalog();
  const researchedReviewIds = [
    'caomei', 'minhenan', 'yanyu', 'wutang', 'yubao', 'haodelai', 'tusun', 'ajie-wuxiang',
    'huiyuan-bread', 'yousheng', 'baicheng-duck-porridge', 'linsixi', 'sibei-bread', 'xinaqiang',
    'taoxi', 'huangji-siguo', 'bapopo', 'diaoyuchuan-shapowei', 'gongtang'
  ];

  for (const id of researchedReviewIds) {
    const food = foods.find(item => item.id === id);
    assert.ok(food?.reviews?.length, `${id} needs researched diner feedback`);
    assert.ok(food.reviews.every(review => /^https:\/\//.test(review.url)), `${id} reviews need source links`);
    assert.ok(food.reviews.every(review => review.summary), `${id} reviews need a useful summary`);
  }

  const photoIds = ['minhenan', 'yanyu', 'yubao', 'haodelai', 'linsixi', 'ajie-wuxiang', 'bapopo', 'yousheng', 'gongtang'];
  for (const id of photoIds) {
    const food = foods.find(item => item.id === id);
    assert.equal(food.gallery?.[0]?.src, food.image, `${id} original photo must remain first`);
    assert.ok(food.gallery.length > 1, `${id} needs additional swipeable real photos`);
    assert.ok(food.gallery.slice(1).every(photo => photo.src.startsWith('assets/')), `${id} appended photos need local assets`);
    for (const photo of food.gallery.slice(1)) {
      assert.ok(fs.existsSync(path.join(root, photo.src)), `missing bundled photo ${photo.src}`);
    }
  }

  const remainingWithoutVerifiedReviews = Array.from(foods.filter(item => !item.reviews?.length), item => item.id).sort();
  assert.deepEqual(remainingWithoutVerifiedReviews, []);
});

test('newly researched food photos are bundled locally and do not depend on remote image hosts', () => {
  const foods = loadFoodCatalog();
  const localPhotoIds = [
    'alian', 'aming', 'shangqing', 'lailai', 'huanghai', '1980', 'gongtang', 'longtou-fishball',
    'yuehua', 'huangzehe', 'qingjun', 'xiaoyanjing', 'menglinxi-shaojiu', 'minhenan', 'yanyu',
    'yubao', 'haodelai', 'linsixi', 'ajie-wuxiang', 'bapopo', 'yousheng'
  ];

  for (const id of localPhotoIds) {
    const food = foods.find(item => item.id === id);
    assert.ok(food, `missing food entry ${id}`);
    assert.ok(food.gallery?.length, `${id} needs its photo gallery`);
    assert.ok(!/^https?:\/\//.test(food.image || ''), `${id} hero photo must be local`);
    for (const photo of food.gallery) {
      assert.ok(photo.src.startsWith('assets/'), `${id} photo should use an assets path: ${photo.src}`);
      assert.ok(fs.existsSync(path.join(root, photo.src)), `missing bundled photo ${photo.src}`);
    }
  }
});
