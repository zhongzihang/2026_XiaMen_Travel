const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadRanking() {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'food-ranking.js'), 'utf8'), { window, Date, Math });
  return window.XiamenFoodRanking;
}

test('ranking reads only platform aggregate ratings and review counts, not individual 5/5 comments', () => {
  const ranking = loadRanking();
  assert.deepEqual({ ...ranking.aggregate({ reviews: [{ rating: '5/5' }] }) }, { rating: 0, count: 0, source: '' });
  assert.deepEqual({ ...ranking.aggregate({ reviews: [{ source: '大众点评', rating: '4.5/5 · 21,621条评价' }] }) }, {
    rating: 4.5, count: 21621, source: '大众点评'
  });
});

test('recommendation order balances aggregate rating, review volume, recency and card completeness', () => {
  const ranking = loadRanking();
  const foods = [
    { id: 'thin', name: '少量评价店', area: '片区', category: '小吃', address: '地址', summary: '推荐摘要', dishes: ['招牌'], image: 'dish.jpg', reviews: [{ source: '平台', date: '2026-09-29', rating: '4.8/5 · 12条评价', summary: '评价' }] },
    { id: 'popular', name: '评价多的店', area: '片区', category: '小吃', address: '地址', summary: '推荐摘要', dishes: ['招牌'], image: 'dish.jpg', reviews: [{ source: '大众点评', date: '2026-09-28', rating: '4.5/5 · 21,621条评价', summary: '评价' }] },
    { id: 'individual', name: '单条高分店', area: '片区', category: '小吃', address: '地址', summary: '推荐摘要', dishes: ['招牌'], image: 'dish.jpg', reviews: [{ source: '游客实评', date: '2026-09-29', rating: '5/5', summary: '评价' }] }
  ];
  const sorted = ranking.sort(foods);
  assert.deepEqual(sorted.map(food => food.id), ['popular', 'thin', 'individual']);
  assert.match(ranking.badgeMarkup(foods[1]), /4\.5分.*21,621评/);
  assert.equal(ranking.badgeMarkup(foods[2]), '');
});

test('explicit featured order stays ahead of the score-based recommendation order', () => {
  const ranking = loadRanking();
  const foods = [
    { id: 'score-winner', reviews: [{ source: '大众点评', rating: '5/5 · 100,000条评价', date: '2026-09-29' }] },
    { id: 'featured-second', featuredRank: 2, reviews: [] },
    { id: 'featured-first', featuredRank: 1, reviews: [] }
  ];
  assert.deepEqual(ranking.sort(foods, Date.UTC(2026, 8, 29)).map(food => food.id), [
    'featured-first', 'featured-second', 'score-winner'
  ]);
});
