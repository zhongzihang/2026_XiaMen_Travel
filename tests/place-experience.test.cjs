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
  assert.match(markup, /在小红书搜索这条笔记/);
  assert.match(markup, /网页端小红书/);
});
