const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const expectedIds = [
  'hotel', 'station', 'dongdu', 'sanqiutian', 'longtou', 'shuzhuang', 'rock', 'zhongshan',
  'yujian', 'nanputuo', 'xmu', 'baicheng', 'shapowei', 'heping', 'botanic', 'cable', 'bashi', 'baijia'
];

function loadPlaceExperience() {
  const context = { window: {}, URL };
  for (const file of ['place-photo-data.js', 'place-photo-additions.js', 'food-details.js', 'travel-enrichment.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  return context.window;
}

test('every itinerary place has a sourced visitor experience and a matching original or search entry', () => {
  const window = loadPlaceExperience();
  const experiences = window.XiamenPlaceExperiences;

  assert.deepEqual(Object.keys(experiences).sort(), expectedIds.slice().sort());
  for (const id of expectedIds) {
    const review = experiences[id];
    assert.ok(review.source && review.date && review.title && review.summary, `${id} needs attributed experience text`);
    assert.ok(review.url || review.searchKeyword, `${id} needs an original-post or in-app search entry`);
    assert.match(window.XiamenPlaceGallery.experience({ id, name: id }), /place-experience/);
  }
});

test('unresolved XHS note IDs get the documented in-app search route without claiming a direct post link', () => {
  const window = loadPlaceExperience();
  const markup = window.XiamenFoodDetails.reviewLinkMarkup('', '厦门屿见闽南详细版游玩攻略 泥巴酱');

  assert.match(markup, /xhsdiscover:\/\/search\/result\?keyword=/);
  assert.match(markup, /在小红书 App 搜索这条攻略/);
  assert.doesNotMatch(markup, /网页端小红书|xiaohongshu\.com/);
});

test('selected attractions show related Xiaohongshu guides as vertically stacked app-only cards', () => {
  const window = loadPlaceExperience();
  const cases = [
    ['sanqiutian', '6a8484f50000000008011746'],
    ['longtou', '6aa3b5bd000000002603b195'],
    ['bashi', '697c793d0000000022039a0f']
  ];

  for (const [id, noteId] of cases) {
    const markup = window.XiamenPlaceGallery.experience({ id, name: id });
    assert.ok((markup.match(/class="place-experience"/g) || []).length >= 2, `${id} needs multiple guide cards`);
    assert.match(markup, new RegExp(`xhsdiscover:\/\/item\/${noteId}`), `${id} should link to the matching note`);
    assert.doesNotMatch(markup, /网页查看原帖|xiaohongshu\.com/);
  }
});
