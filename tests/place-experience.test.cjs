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

test('selected attractions open distinct Xiaohongshu notes through app-only cards', () => {
  const window = loadPlaceExperience();
  const cases = [
    ['sanqiutian', '6a8484f50000000008011746'],
    ['longtou', '6a3a529c00000000220090e6'],
    ['shuzhuang', '6aa3b5bd000000002603b195'],
    ['rock', '68a2c3f7000000001b0228d0'],
    ['bashi', '697c793d0000000022039a0f']
  ];

  for (const [id, noteId] of cases) {
    const markup = window.XiamenPlaceGallery.experience({ id, name: id });
    assert.ok((markup.match(/class="place-experience"/g) || []).length >= 1, `${id} needs a guide card`);
    assert.match(markup, new RegExp(`xhsdiscover:\/\/item\/${noteId}`), `${id} should link to the matching note`);
    assert.doesNotMatch(markup, /网页查看原帖|xiaohongshu\.com/);
  }
});

test('daily attraction experiences do not reuse a Xiaohongshu post across places', () => {
  const experiences = loadPlaceExperience().XiamenPlaceExperiences;
  const seen = new Map();
  for (const [placeId, experience] of Object.entries(experiences)) {
    for (const entry of [experience, ...(experience.related || [])]) {
      if (!entry.url?.includes('xiaohongshu.com')) continue;
      const noteId = /\/(?:explore|search_result)\/([a-f0-9]+)/.exec(entry.url)?.[1];
      assert.ok(noteId, `${placeId} needs a note ID`);
      assert.ok(!seen.has(noteId), `${placeId} repeats ${seen.get(noteId)} via ${noteId}`);
      seen.set(noteId, placeId);
    }
  }
});
