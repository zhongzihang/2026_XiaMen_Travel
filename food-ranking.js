(function () {
  'use strict';

  function aggregate(food) {
    const candidates = (food?.reviews || []).map(review => {
      const match = String(review?.rating || '').match(/(\d(?:\.\d+)?)\s*\/\s*5\s*[·•]\s*([\d,]+)\s*条(?:评价|点评)?/);
      if (!match) return null;
      const rating = Number(match[1]);
      const count = Number(match[2].replace(/,/g, ''));
      if (!Number.isFinite(rating) || rating < 0 || rating > 5 || !Number.isFinite(count) || count < 1) return null;
      return { rating, count, source: String(review.source || '').replace(/(?:门店评分|平台评分|用户评价|综合评分).*$/, '').trim() };
    }).filter(Boolean);
    return candidates.sort((a, b) => b.count - a.count)[0] || { rating: 0, count: 0, source: '' };
  }

  function newestReviewTime(food) {
    const times = (food?.reviews || []).map(review => {
      const value = String(review?.date || '');
      const match = value.match(/^(20\d{2})(?:-(\d{2})(?:-(\d{2}))?)?/);
      if (!match) return 0;
      return Date.UTC(Number(match[1]), Number(match[2] || 1) - 1, Number(match[3] || 1));
    }).filter(Boolean);
    return times.length ? Math.max(...times) : 0;
  }

  function score(food, now = Date.now()) {
    const stats = aggregate(food);
    const ratingScore = stats.rating ? (stats.rating / 5) * 48 : 0;
    const volumeScore = stats.count ? Math.log1p(Math.min(stats.count, 100000)) / Math.log1p(100000) * 22 : 0;
    const updatedAt = newestReviewTime(food);
    const ageDays = updatedAt ? Math.max(0, (now - updatedAt) / 86400000) : Infinity;
    const freshnessScore = Number.isFinite(ageDays) ? 15 * Math.pow(0.5, ageDays / 365) : 0;
    const completeFields = [food?.name, food?.area, food?.category, food?.address, food?.summary,
      Array.isArray(food?.dishes) && food.dishes.length, Array.isArray(food?.gallery) && food.gallery.length,
      Array.isArray(food?.reviews) && food.reviews.some(review => review?.summary)].filter(Boolean).length;
    const completenessScore = (completeFields / 8) * 15;
    return ratingScore + volumeScore + freshnessScore + completenessScore;
  }

  function sort(foods, now = Date.now()) {
    return foods.map((food, index) => ({ food, index, score: score(food, now) }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(item => item.food);
  }

  function badgeMarkup(food) {
    const stats = aggregate(food);
    if (!stats.count) return '';
    const label = `${stats.rating.toFixed(1)}分 · ${stats.count.toLocaleString('en-US')}评`;
    const sourceLabel = /大众点评/.test(stats.source) ? '点评' : /携程|Trip/i.test(stats.source) ? 'Trip' : /Apple|地图/.test(stats.source) ? '地图' : stats.source || '平台';
    return `<span class="food-ranking-badge" title="${sourceLabel}平台综合评分与评价量">★ ${sourceLabel} ${label}</span>`;
  }

  window.XiamenFoodRanking = { aggregate, newestReviewTime, score, sort, badgeMarkup };
})();
