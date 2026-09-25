(function () {
  'use strict';

  const data = window.XiamenMapData;
  const dataTools = window.XiamenMapDataTools;
  const points = new Map(data.points.map(point => [point.id, point]));
  const days = [
    { key: '2026-09-30', date: '9.30', title: '抵达文灶', color: '#648d80' },
    { key: '2026-10-01', date: '10.01', title: '鼓浪屿', color: '#d66f56' },
    { key: '2026-10-02', date: '10.02', title: '人文海岸', color: '#348b98' },
    { key: '2026-10-03', date: '10.03', title: '山海绿意', color: '#718f4d' },
    { key: '2026-10-04', date: '10.04', title: '老城返程', color: '#8a72a2' }
  ];
  const base = 'assets/xiamen-overview-watercolor-v2.png';
  const sprite = 'assets/xiamen-landmarks-v2.png';
  const hotelArt = 'assets/xiamen-hotel-watercolor-v1.png';
  const stationArt = 'assets/xiamen-station-watercolor-v1.png';
  const W = 1536, H = 1024;

  // Positions are calibrated on the new watercolor map using the current Amap
  // POI coordinates. The artwork is a travel illustration, never a road map.
  const anchors = {
    hotel: [1025, 355], station: [1200, 350], dongdu: [520, 185],
    sanqiutian: [510, 540], longtou: [440, 595], shuzhuang: [425, 712], rock: [348, 637],
    nanputuo: [1050, 645], xmu: [990, 715], baicheng: [1100, 778],
    shapowei: [790, 666], heping: [680, 555], botanic: [1020, 535],
    cable: [1050, 575], bashi: [745, 465], baijia: [865, 444]
  };
  // Sprite indices are row-major. Small overview offsets keep nearby landmarks readable.
  const cards = {
    dongdu: { icon: 0, name: '东渡码头' },
    sanqiutian: { icon: 1, name: '三丘田码头', dx: 38, dy: 28 },
    longtou: { icon: 2, name: '龙头路' },
    shuzhuang: { icon: 3, name: '菽庄花园' },
    rock: { icon: 4, name: '日光岩' },
    nanputuo: { icon: 5, name: '南普陀寺', dx: -28, dy: -14, textDx: 62 },
    xmu: { icon: 6, name: '厦大西门', dy: 15 },
    baicheng: { icon: 7, name: '白城沙滩' },
    shapowei: { icon: 8, name: '沙坡尾' },
    heping: { icon: 9, name: '和平码头' },
    botanic: { icon: 10, name: '园林植物园', dx: -28, dy: -10 },
    cable: { icon: 11, name: '钟鼓索道', dx: 56, dy: -15 },
    bashi: { icon: 12, name: '八市' },
    baijia: { icon: 13, name: '百家村' }
  };
  const dayLabel = {
    dongdu: '东渡码头', sanqiutian: '三丘田码头', longtou: '龙头路',
    shuzhuang: '菽庄花园', rock: '日光岩', nanputuo: '南普陀寺',
    xmu: '厦大西门', baicheng: '白城沙滩', shapowei: '沙坡尾',
    heping: '和平码头', botanic: '植物园西门', cable: '钟鼓索道',
    bashi: '八市', baijia: '百家村', hotel: '文灶住宿', station: '厦门站'
  };
  const labelSide = {
    dongdu: ['right', 16, -12], sanqiutian: ['right', 16, -18],
    longtou: ['right', 16, 8], shuzhuang: ['right', 16, 25], rock: ['left', -16, -12],
    nanputuo: ['right', 17, -18], xmu: ['left', -17, 24], baicheng: ['right', 17, 22],
    shapowei: ['left', -17, -17], heping: ['left', -17, 22],
    botanic: ['left', -17, -15], cable: ['right', 17, 20],
    bashi: ['left', -17, -13], baijia: ['right', 17, -15],
    hotel: ['right', 19, -14], station: ['right', 19, 22]
  };
  let activeDay = 1;
  let skipXmu = false;
  let activePointIds = new Set();
  let selectedOverviewPoint = null;

  function esc(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function xy(pointOrId) { return anchors[typeof pointOrId === 'string' ? pointOrId : pointOrId.id]; }
  function isSpecial(point) { return point.locationType === 'hotel' || point.locationType === 'station'; }
  function route(dayIndex) {
    return dataTools.routeForDay(data, days[dayIndex].key, { skipXmu: skipXmu && dayIndex === 2 });
  }
  function dayForPoint(pointId) {
    return days.findIndex((_, index) => dataTools.routePointIds(route(index)).includes(pointId));
  }
  function baseImage() {
    return `<image href="${base}" width="${W}" height="${H}" preserveAspectRatio="none"/>`;
  }
  function specialIcon(point, x, y, large) {
    const hotel = point.locationType === 'hotel';
    const r = large ? 24 : 21;
    const symbol = hotel
      ? '<path d="M-12-1 0-12 12-1v14H-12Z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M-4 13V3H4v10" fill="none" stroke="#fff" stroke-width="3"/>'
      : '<rect x="-11" y="-11" width="22" height="19" rx="4" fill="none" stroke="#fff" stroke-width="3"/><path d="M-7-4H7M-7 13l4-5m10 5L3 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
    return `<g class="atlas-special ${hotel ? 'is-hotel' : 'is-station'}" transform="translate(${x} ${y})"><circle r="${r}"/>${symbol}</g>`;
  }
  function cardMarkup(point, color) {
    const card = cards[point.id];
    const [px, py] = xy(point);
    const cx = px + (card.dx || 0), cy = py + 6 + (card.dy || 0);
    const textX = cx + (card.textDx || 0), textY = cy + 27 + (card.textDy || 0);
    const bw = 82, bh = 82;
    const tx = (card.icon % 4) * bw, ty = Math.floor(card.icon / 4) * bh;
    const selected = selectedOverviewPoint === point.id ? ' is-selected' : '';
    return `<g class="atlas-overview-node${selected}">` +
      `<ellipse class="atlas-landmark-halo" cx="${cx}" cy="${cy - 49}" rx="53" ry="44"/>` +
      `<ellipse class="atlas-landmark-shadow" cx="${cx + 3}" cy="${cy - 8}" rx="37" ry="11"/>` +
      `<svg class="atlas-landmark-art" x="${cx - bw / 2}" y="${cy - bh - 9}" width="${bw}" height="${bh}" overflow="hidden"><image href="${sprite}" x="${-tx}" y="${-ty}" width="${bw * 4}" height="${bh * 4}"/></svg>` +
      `<circle class="atlas-anchor" cx="${cx}" cy="${cy}" r="5" fill="${color}"/>` +
      `<text class="atlas-node-name" x="${textX}" y="${textY}" text-anchor="middle">${esc(card.name)}</text>` +
      `<rect class="atlas-node-hit" x="${cx - bw / 2 - 3}" y="${cy - bh - 12}" width="${bw + 6}" height="${bh + 48}" rx="12" data-overview-point="${esc(point.id)}" role="button" tabindex="0" aria-label="查看${esc(point.name)}详情"/>` +
      (card.textDx ? `<rect class="atlas-node-hit" x="${textX - 54}" y="${textY - 19}" width="108" height="26" data-overview-point="${esc(point.id)}"/>` : '') + `</g>`;
  }
  function islandLabel() {
    return `<text class="atlas-island-label" x="352" y="790" text-anchor="middle">鼓浪屿景区</text>`;
  }
  function specialMarkup(point) {
    const [x, y] = xy(point);
    const hotel = point.locationType === 'hotel';
    const art = hotel
      ? `<image class="atlas-special-art" href="${hotelArt}" x="${x - 50}" y="${y - 105}" width="100" height="100"/>`
      : `<svg class="atlas-special-art atlas-station-art" x="${x - 75}" y="${y - 69}" width="150" height="66" overflow="hidden"><image href="${stationArt}" x="0" y="-47" width="150" height="150"/></svg>`;
    return `<g class="atlas-overview-node atlas-special-node">` +
      `<ellipse class="atlas-landmark-halo" cx="${x}" cy="${y - 55}" rx="${hotel ? 58 : 83}" ry="43"/>` +
      `<ellipse class="atlas-landmark-shadow" cx="${x + 3}" cy="${y - 9}" rx="${hotel ? 38 : 68}" ry="11"/>` +
      art + `<circle class="atlas-special-anchor ${hotel ? 'is-hotel' : 'is-station'}" cx="${x}" cy="${y}" r="6"/>` +
      `<text class="atlas-special-name" x="${x}" y="${y + 30}" text-anchor="middle">${esc(dayLabel[point.id])}</text>` +
      `<rect class="atlas-special-hit" x="${x - (hotel ? 54 : 80)}" y="${y - (hotel ? 109 : 74)}" width="${hotel ? 108 : 160}" height="${hotel ? 148 : 116}" rx="16" data-overview-point="${point.id}" role="button" tabindex="0" aria-label="查看${esc(point.name)}详情"/></g>`;
  }
  function routePaths(edges, color, prefix, emphasize) {
    return edges.map((edge, index) => {
      const a = xy(edge.from), b = xy(edge.to);
      if (!a || !b) return '';
      const bend = edge.type === 'ferry' ? -72 : (index % 2 ? 15 : -15);
      const cx = (a[0] + b[0]) / 2 + bend;
      const cy = (a[1] + b[1]) / 2 - bend;
      const path = `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
      const cls = edge.type === 'ferry' ? ' is-ferry' : '';
      return `<path class="${prefix}-route-under${cls}" d="${path}"/><path class="${prefix}-route${cls}${emphasize ? ' is-active' : ''}" d="${path}" stroke="${color}" marker-end="url(#${prefix}-arrow-${color.slice(1)})"/>`;
    }).join('');
  }
  function arrowDefs(prefix) {
    return days.map(day => `<marker id="${prefix}-arrow-${day.color.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="${day.color}"/></marker>`).join('');
  }
  function dateBubbles() {
    return days.map((day, index) => {
      const x = 84 + index * 105;
      return `<g class="atlas-date-bubble${index === activeDay ? ' is-current' : ''}" style="--day-color:${day.color}" data-overview-day="${index}" role="button" tabindex="0" aria-label="查看${day.date}${esc(day.title)}每日行程" transform="translate(${x} 78)">` +
        `<circle r="39"/><text text-anchor="middle" y="6">${day.date}</text><circle class="atlas-date-hit" r="45"/></g>`;
    }).join('');
  }
  function allOverviewPoints() {
    const unique = new Map();
    days.forEach((_, index) => dataTools.pointsForRoute(data, route(index)).forEach(point => {
      if (!unique.has(point.id)) unique.set(point.id, { point, color: days[index].color });
    }));
    return Array.from(unique.values());
  }
  function renderOverviewDetail(pointId) {
    const target = document.getElementById('overviewPointDetail');
    const point = points.get(pointId);
    if (!target || !point) return;
    selectedOverviewPoint = pointId;
    const dateIndex = dayForPoint(pointId);
    const date = dateIndex >= 0 ? days[dateIndex].date : '';
    const image = isSpecial(point) ?
      `<figure class="atlas-special-detail"><img src="${point.locationType === 'hotel' ? hotelArt : stationArt}" alt="${esc(point.name)}手绘地标插画" loading="lazy"><figcaption>手绘地标 · 非建筑实景照片</figcaption></figure>` :
      `<figure><img src="${esc(window.SiteImages.resolveImagePath(point.photo))}" alt="${esc(point.name)}实景照片" loading="lazy"><figcaption>景点实景照片 · 上方地图为手绘插画</figcaption></figure>`;
    target.innerHTML = `${image}<div class="atlas-detail-copy"><span class="atlas-detail-kicker">${date} · ${isSpecial(point) ? '交通与住宿' : '地图景点详情'}</span><h3>${esc(point.name)}</h3><p>${esc(point.address)}</p><p>${esc(point.note)}</p><div class="atlas-detail-actions"><span>游玩示意图 · 位置${point.precision === 'approx' ? '近似' : '按地图点位'}标注</span>${dateIndex >= 0 ? `<button type="button" data-overview-goto="${dateIndex}" data-overview-select="${point.id}">查看当日行程 ↗</button>` : ''}</div></div>`;
    const img = target.querySelector('img');
    if (img) img.addEventListener('error', () => {
      img.replaceWith(Object.assign(document.createElement('div'), { className: 'atlas-detail-symbol', textContent: '图片暂不可用' }));
    }, { once: true });
    document.querySelectorAll('.atlas-overview-node').forEach(node => node.classList.toggle('is-selected', node.querySelector('[data-overview-point]')?.dataset.overviewPoint === pointId));
  }
  function jumpToDay(index, pointId) {
    window.dispatchEvent(new CustomEvent('xiamen:map-daychange', { detail: { dayIndex: index, scrollIntoView: true } }));
    if (pointId && !isSpecial(points.get(pointId))) selectPoint(pointId);
  }
  function renderOverview() {
    const target = document.getElementById('routeOverview');
    const dialog = document.getElementById('overviewMapDialog');
    const canvas = document.getElementById('overviewMapZoomCanvas');
    if (!target) return;
    const all = allOverviewPoints();
    const markers = all.map(({ point, color }) => isSpecial(point) ? specialMarkup(point) : cardMarkup(point, color)).join('');
    target.innerHTML = `<div class="atlas-overview-toolbar"><span>五日地图 · 点击手绘地标看详情</span><div class="atlas-day-links">${days.map((day, index) => `<button type="button" class="${index === activeDay ? 'is-current' : ''}" data-overview-day="${index}" style="--day-color:${day.color}" aria-label="查看${day.date}${esc(day.title)}每日行程">${day.date}</button>`).join('')}</div></div>` +
      `<svg class="overview-map atlas-overview-map" viewBox="0 0 ${W} ${H}" role="group" aria-label="厦门五日游手绘地图，点选地标查看详情。位置为游玩示意，不作导航">` +
      baseImage() +
      `<rect class="atlas-map-wash" width="${W}" height="${H}"/>` +
      islandLabel() + `<g class="atlas-marker-layer">${markers}</g>` +
      `<g class="atlas-date-layer">${dateBubbles()}</g>` +
      `<g class="atlas-compass" transform="translate(1438 85)"><circle r="33"/><path d="M0-21 7 6 0 1-7 6Z"/><text y="-39" text-anchor="middle">N</text></g>` +
      `<text class="atlas-map-caption" x="1390" y="990" text-anchor="end">手绘游玩示意 · 非导航图</text></svg>` +
      `<button class="overview-map-zoom-button" type="button">放大查看完整地图 ↗</button>`;
    if (!document.getElementById('overviewPointDetail')) {
      target.insertAdjacentHTML('afterend', '<div class="atlas-overview-detail" id="overviewPointDetail" aria-live="polite"><p>点击地图上的手绘地标，查看点位信息与对应实景照片。</p></div>');
    }
    if (selectedOverviewPoint && all.some(item => item.point.id === selectedOverviewPoint)) {
      renderOverviewDetail(selectedOverviewPoint);
    } else if (selectedOverviewPoint) {
      selectedOverviewPoint = null;
      document.getElementById('overviewPointDetail').innerHTML = '<p>点击地图上的手绘地标，查看点位信息与对应实景照片。</p>';
    }
    const map = target.querySelector('svg');
    function closeMap() {
      if (canvas && canvas.contains(map)) target.insertBefore(map, target.querySelector('.overview-map-zoom-button'));
      if (dialog && dialog.open) dialog.close();
    }
    target.querySelector('.overview-map-zoom-button').addEventListener('click', () => {
      canvas.append(map);
      dialog.showModal();
      canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) * .32);
      canvas.scrollTop = Math.max(0, (canvas.scrollHeight - canvas.clientHeight) * .24);
    });
    document.getElementById('overviewMapClose').onclick = closeMap;
    dialog.onclose = () => {
      if (canvas.contains(map)) target.insertBefore(map, target.querySelector('.overview-map-zoom-button'));
    };
    function activateNode(node) {
      if (node.dataset.overviewDay !== undefined) {
        closeMap();
        jumpToDay(Number(node.dataset.overviewDay));
      } else if (node.dataset.overviewPoint) {
        const pointId = node.dataset.overviewPoint;
        closeMap();
        renderOverviewDetail(pointId);
        document.getElementById('overviewPointDetail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    [map, target.querySelector('.atlas-overview-toolbar')].forEach(surface => {
      surface.addEventListener('click', event => {
        const node = event.target.closest('[data-overview-point],[data-overview-day]');
        if (node) activateNode(node);
      });
      surface.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const node = event.target.closest('[data-overview-point],[data-overview-day]');
        if (node) { event.preventDefault(); activateNode(node); }
      });
    });
  }
  function dailyCrop(localPoints) {
    const coords = localPoints.map(xy);
    const xs = coords.map(p => p[0]), ys = coords.map(p => p[1]);
    let width = Math.max(520, Math.max(...xs) - Math.min(...xs) + 230);
    let height = Math.max(350, Math.max(...ys) - Math.min(...ys) + 185);
    if (width / height < 1.55) width = height * 1.55;
    else height = width / 1.55;
    width = Math.min(W, width); height = Math.min(H, height);
    const mx = (Math.max(...xs) + Math.min(...xs)) / 2;
    const my = (Math.max(...ys) + Math.min(...ys)) / 2;
    const x = Math.max(0, Math.min(W - width, mx - width / 2));
    const y = Math.max(0, Math.min(H - height, my - height / 2));
    return { x, y, width, height };
  }
  function dailyMarker(point, order, color) {
    const [x, y] = xy(point), [side, dx, dy] = labelSide[point.id];
    const align = side === 'left' ? 'end' : 'start';
    const symbol = isSpecial(point) ? specialIcon(point, x, y, false) :
      `<g transform="translate(${x} ${y})"><circle class="atlas-daily-pin" r="19" fill="${color}"/><text class="atlas-daily-number" y="6" text-anchor="middle">${String(order).padStart(2, '0')}</text></g>`;
    const interactive = !isSpecial(point);
    return `<g class="atlas-daily-node${interactive ? ' is-viewable' : ''}" data-day-point-id="${point.id}" ${interactive ? `role="button" tabindex="0" aria-label="查看${esc(point.name)}实景照片与详情"` : `aria-label="${esc(point.name)}位置"`}>` +
      symbol + `<text class="atlas-daily-name" x="${x + dx}" y="${y + dy}" text-anchor="${align}">${esc(dayLabel[point.id])}</text><circle class="atlas-daily-hit" cx="${x}" cy="${y}" r="30"/></g>`;
  }
  function dailyMap(viewName, edges, allPoints, dayIndex) {
    const local = allPoints.filter(point => point.view === viewName);
    if (!local.length) return '';
    const crop = dailyCrop(local);
    const order = new Map(dataTools.routePointIds(edges).map((id, index) => [id, index + 1]));
    const localEdges = edges.filter(edge => points.get(edge.from)?.view === viewName && points.get(edge.to)?.view === viewName && edge.type === 'visit');
    const markers = local.map(point => dailyMarker(point, order.get(point.id), days[dayIndex].color)).join('');
    const label = viewName === 'island' ? '鼓浪屿岛上步行' : '厦门岛当日路线';
    return `<svg class="day-map-svg atlas-daily-map" viewBox="${crop.x} ${crop.y} ${crop.width} ${crop.height}" role="group" aria-label="${days[dayIndex].date}${label}，按数字顺序浏览。手绘游玩示意图">` +
      `<defs>${arrowDefs('atlas-daily')}</defs>${baseImage()}<rect class="atlas-day-wash" width="${W}" height="${H}"/>` +
      `<g class="atlas-daily-routes">${routePaths(localEdges, days[dayIndex].color, 'atlas-daily', true)}</g>` +
      `<g class="atlas-daily-points">${markers}</g>` +
      `<g class="atlas-daily-title" transform="translate(${crop.x + 23} ${crop.y + 26})"><rect x="-10" y="-22" width="${viewName === 'island' ? 178 : 190}" height="36" rx="17"/><text y="3">${days[dayIndex].date} · ${label}</text></g>` +
      `<text class="atlas-daily-note" x="${crop.x + crop.width - 18}" y="${crop.y + crop.height - 19}" text-anchor="end">游玩示意 · 非导航</text></svg>`;
  }
  function bindDailyNodes(container) {
    container.querySelectorAll('.atlas-daily-node.is-viewable').forEach(node => {
      node.addEventListener('click', () => selectPoint(node.dataset.dayPointId));
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); selectPoint(node.dataset.dayPointId);
        }
      });
    });
  }
  function selectPoint(pointId) {
    if (!activePointIds.has(pointId)) return false;
    const point = points.get(pointId);
    if (!point || isSpecial(point)) return false;
    const target = document.getElementById(`day-map-detail-${activeDay}`);
    if (!target) return false;
    const photo = window.SiteImages.resolveImagePath(point.photo);
    target.innerHTML = `<figure class="map-detail-photo"><img src="${esc(photo)}" alt="${esc(point.name)}实景照片" loading="lazy"><span class="photo-unavailable" hidden>这张实景照片暂不可用</span><figcaption>${esc(point.name)} · 实景照片 · 点图放大</figcaption></figure>` +
      `<div class="map-detail-copy"><span class="section-kicker">${days[activeDay].date} · 当日路线点</span><h3>${esc(point.name)}</h3><p class="map-detail-address">${esc(point.address)}</p><span class="map-location-quality">${point.precision === 'approx' ? '位置近似标注' : '地图点位'}</span><p>${esc(point.note)}</p><span class="map-detail-hint">手绘图仅表示游玩先后和大致方位，不代表步行导航轨迹。</span></div>`;
    target.querySelector('img').addEventListener('error', () => {
      target.querySelector('img').hidden = true;
      target.querySelector('.photo-unavailable').hidden = false;
    }, { once: true });
    const image = target.querySelector('img');
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `放大查看：${point.name}实景照片`);
    function openPhoto() {
      const dialog = document.getElementById('photoDialog');
      document.getElementById('largePhoto').src = image.src;
      document.getElementById('largePhoto').alt = image.alt;
      document.getElementById('largeCaption').textContent = point.name + ' · 实景照片';
      dialog.showModal();
    }
    image.addEventListener('click', openPhoto);
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPhoto(); }
    });
    document.querySelectorAll('.atlas-daily-node').forEach(node => node.classList.toggle('is-selected', node.dataset.dayPointId === pointId));
    return true;
  }
  function renderDay(index) {
    activeDay = Math.max(0, Math.min(days.length - 1, index));
    const edges = route(activeDay);
    const ids = dataTools.routePointIds(edges);
    activePointIds = new Set(ids);
    const localPoints = ids.map(id => points.get(id)).filter(Boolean);
    const main = document.getElementById(`day-map-${activeDay}`);
    const island = document.getElementById(`day-island-map-${activeDay}`);
    const ferry = document.getElementById(`day-ferry-${activeDay}`);
    const detail = document.getElementById(`day-map-detail-${activeDay}`);
    if (main) { main.innerHTML = dailyMap('main', edges, localPoints, activeDay); bindDailyNodes(main); }
    if (island) {
      island.hidden = !localPoints.some(point => point.view === 'island');
      island.innerHTML = island.hidden ? '' : dailyMap('island', edges, localPoints, activeDay);
      bindDailyNodes(island);
    }
    const ferryEdge = edges.find(edge => edge.type === 'ferry');
    if (ferry) {
      ferry.hidden = !ferryEdge;
      ferry.innerHTML = ferryEdge ? '<span class="map-ferry-label">海上接驳 · 不是陆路</span><strong>东渡客运码头</strong><b class="map-ferry-time">10:30 开船</b><span class="map-ferry-arrow" aria-hidden="true">→</span><strong>三丘田码头</strong>' : '';
    }
    const first = localPoints.find(point => !isSpecial(point));
    if (first) selectPoint(first.id);
    else if (detail) detail.innerHTML = `<div class="map-detail-empty"><span class="section-kicker">${days[activeDay].date} · 当日路线</span><h3>到站与入住</h3><p>此日以交通和休息为主，没有安排景点打卡。</p></div>`;
    return { edges, points: localPoints };
  }
  window.XiamenMapUI = {
    renderOverview, renderDay, selectPoint,
    setSkipXmu(value) { skipXmu = Boolean(value); renderOverview(); if (activeDay === 2) renderDay(2); }
  };
  document.getElementById('map')?.addEventListener('click', event => {
    const button = event.target.closest('[data-overview-goto]');
    if (button) jumpToDay(Number(button.dataset.overviewGoto), button.dataset.overviewSelect);
  });
  window.addEventListener('xiamen:daychange', event => {
    if (Number.isInteger(event.detail?.dayIndex)) {
      activeDay = event.detail.dayIndex;
      renderOverview(); renderDay(activeDay);
    }
  });
  window.addEventListener('xiamen:xmu-toggle', event => {
    skipXmu = Boolean(event.detail?.skipXmu);
    renderOverview(); if (activeDay === 2) renderDay(activeDay);
  });
  renderOverview(); renderDay(activeDay);
})();
