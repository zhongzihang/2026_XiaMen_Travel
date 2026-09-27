(function () {
  'use strict';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  function photos(food) {
    const gallery = Array.isArray(food.gallery) ? food.gallery.filter(photo => photo && photo.src) : [];
    if (gallery.length) return gallery;
    return food.image ? [{ src: food.image, alt: food.imageAlt || food.name, caption: food.photoNote || food.photoLabel || '实拍图' }] : [];
  }

  function galleryMarkup(food, resolveImagePath = value => value) {
    const images = photos(food);
    const current = images[0];
    const controls = images.length > 1
      ? `<div class="food-gallery-controls" aria-label="切换实拍照片"><button type="button" data-gallery-step="-1" aria-label="上一张照片" disabled>‹</button><output data-gallery-count aria-live="polite">1 / ${images.length}</output><button type="button" data-gallery-step="1" aria-label="下一张照片">›</button></div>`
      : '';
    const imageMarkup = current
      ? `<img src="${escapeHtml(resolveImagePath(current.src))}" alt="${escapeHtml(current.alt || current.caption || food.name)}" data-gallery-image><span class="photo-unavailable" data-gallery-unavailable hidden>照片暂时无法载入</span>`
      : `<span class="photo-unavailable food-photo-empty">暂无匹配的店内实拍照片</span>`;
    const caption = current?.caption || current?.alt || food.photoNote || food.photoLabel || '实拍图';
    return `<figure class="food-detail-photo${images.length > 1 ? ' food-gallery-active' : ''}" data-food-carousel data-gallery-length="${images.length}" tabindex="0" aria-label="${escapeHtml(food.name)}实拍照片，${images.length > 1 ? '可左右切换' : '单张照片'}">${imageMarkup}${controls}<figcaption data-gallery-caption>${escapeHtml(caption)}</figcaption></figure>`;
  }

  function reviewsMarkup(reviews) {
    if (!Array.isArray(reviews) || !reviews.length) return '';
    const cards = reviews.map(review => `<article class="food-review-card"><div class="food-review-meta"><strong>${escapeHtml(review.source || '食客评测')}</strong>${review.date ? `<time>${escapeHtml(review.date)}</time>` : ''}${review.rating ? `<span class="food-review-rating">${escapeHtml(review.rating)}</span>` : ''}</div><h4>${escapeHtml(review.title || '到店体验')}</h4><p>${escapeHtml(review.summary)}</p>${review.url ? `<a href="${escapeHtml(review.url)}" target="_blank" rel="noopener noreferrer">查看评测原帖 ↗</a>` : ''}</article>`).join('');
    return `<section class="food-reviews" aria-label="食客评测"><h3>食客评测</h3><div class="food-review-list">${cards}</div><p class="food-review-note">个人体验与平台评分分开展示；实际口味、排队与营业情况以到店为准。</p></section>`;
  }

  function bind(root, food, resolveImagePath = value => value) {
    const gallery = root.querySelector('[data-food-carousel]');
    if (!gallery) return;
    const images = photos(food).map(photo => ({ ...photo, resolvedSrc: resolveImagePath(photo.src) }));
    const image = gallery.querySelector('[data-gallery-image]');
    if (!image || images.length < 2) {
      image?.addEventListener('error', () => gallery.querySelector('[data-gallery-unavailable]')?.removeAttribute('hidden'), { once: true });
      return;
    }

    const previous = gallery.querySelector('[data-gallery-step="-1"]');
    const next = gallery.querySelector('[data-gallery-step="1"]');
    const counter = gallery.querySelector('[data-gallery-count]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    let index = 0;
    let touchStart = null;
    function update(step) {
      index = (index + step + images.length) % images.length;
      const item = images[index];
      image.hidden = false;
      image.src = item.resolvedSrc || item.src;
      image.alt = item.alt || item.caption || '';
      caption.textContent = item.caption || item.alt || '';
      counter.textContent = `${index + 1} / ${images.length}`;
      previous.disabled = index === 0;
      next.disabled = index === images.length - 1;
      gallery.querySelector('[data-gallery-unavailable]')?.setAttribute('hidden', '');
    }
    previous.addEventListener('click', () => update(-1));
    next.addEventListener('click', () => update(1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); update(-1); }
      if (event.key === 'ArrowRight' && index < images.length - 1) { event.preventDefault(); update(1); }
    });
    image.addEventListener('touchstart', event => { touchStart = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
    image.addEventListener('touchend', event => {
      if (touchStart === null) return;
      const delta = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 42) {
        if (delta < 0 && index < images.length - 1) update(1);
        if (delta > 0 && index > 0) update(-1);
        event.preventDefault();
      }
      touchStart = null;
    }, { passive: false });
    image.addEventListener('error', () => gallery.querySelector('[data-gallery-unavailable]')?.removeAttribute('hidden'));
  }

  window.XiamenFoodDetails = { photos, galleryMarkup, reviewsMarkup, bind };
})();
