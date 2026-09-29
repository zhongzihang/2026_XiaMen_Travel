(function () {
  'use strict';

  const data = window.XiamenMapData;
  const dataTools = window.XiamenMapDataTools;
  const points = new Map(data.points.map(point => [point.id, point]));
  const days = [
    { key: '2026-09-30', date: '9.30', title: '抵达文灶', color: '#648d80' },
    { key: '2026-10-01', date: '10.01', title: '鼓浪屿', color: '#d66f56' },
    { key: '2026-10-02', date: '10.02', title: '人文海岸', color: '#1767bf' },
    { key: '2026-10-03', date: '10.03', title: '山海绿意', color: '#4b8031' },
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
    cable: [1050, 575], bashi: [640, 380], baijia: [865, 444],
    zhongshan: [745, 465], yujian: [700, 185]
  };
  // Sprite indices are row-major. Small overview offsets keep nearby landmarks readable.
  const cards = {
    dongdu: { icon: 0, name: '东渡码头' },
    sanqiutian: { icon: 1, name: '三丘田码头', dx: 38, dy: 28 },
    longtou: { icon: 2, name: '龙头路' },
    shuzhuang: { icon: 3, name: '菽庄花园' },
    rock: { icon: 4, name: '日光岩' },
    nanputuo: { icon: 5, name: '南普陀寺', dx: -28, dy: -14, textDx: 62 },
    xmu: { icon: 6, name: '厦门大学', dy: 15 },
    baicheng: { icon: 7, name: '白城沙滩' },
    shapowei: { icon: 8, name: '沙坡尾' },
    heping: { icon: 9, name: '和平码头' },
    botanic: { icon: 10, name: '园林植物园', dx: -28, dy: -10 },
    cable: { icon: 11, name: '钟鼓索道', dx: 56, dy: -15 },
    bashi: { icon: 12, name: '八市' },
    baijia: { icon: 13, name: '百家村' },
    zhongshan: { art: 'assets/xiamen-zhongshan-watercolor-v1.png', name: '中山路步行街', textDy: -18 },
    yujian: { art: 'assets/xiamen-yujian-watercolor-v1.png', name: '屿见闽南' }
  };
  const dayLabel = {
    dongdu: '东渡码头', sanqiutian: '三丘田码头', longtou: '龙头路',
    shuzhuang: '菽庄花园', rock: '日光岩', nanputuo: '南普陀寺',
    xmu: '厦门大学', baicheng: '白城沙滩', shapowei: '沙坡尾',
    heping: '和平码头', botanic: '植物园西门', cable: '钟鼓索道',
    bashi: '八市', baijia: '百家村', zhongshan: '中山路步行街', yujian: '屿见闽南', hotel: '文灶住宿', station: '厦门站'
  };
  // Each cubic has hand-placed control points. Shared masks protect the artwork
  // and labels, and the same geometry is used in overview and daily crops.
  const routeControls = {
    'station-hotel': [1145, 392, 1080, 392],
    'hotel-station': [1080, 435, 1165, 435],
    'hotel-dongdu': [892, 246, 635, 228],
    'dongdu-sanqiutian': [414, 310, 458, 451],
    'sanqiutian-longtou': [528, 619, 478, 631],
    'longtou-shuzhuang': [475, 645, 492, 705],
    'shuzhuang-rock': [338, 755, 303, 718],
    'rock-sanqiutian': [405, 699, 581, 684],
    'sanqiutian-bashi': [555, 520, 615, 446],
    'hotel-nanputuo': [1280, 400, 1265, 649],
    'nanputuo-xmu': [871, 648, 870, 773],
    'xmu-baicheng': [1012, 810, 1077, 841],
    'nanputuo-baicheng': [1230, 650, 1235, 829],
    'baicheng-shapowei': [978, 879, 835, 790],
    'shapowei-heping': [710, 700, 622, 637],
    'heping-hotel': [825, 579, 929, 458],
    'hotel-yujian': [924, 195, 790, 165],
    'yujian-heping': [614, 260, 617, 425],
    'hotel-botanic': [1024, 420, 940, 473],
    'botanic-cable': [1034, 606, 1076, 610],
    'cable-bashi': [1076, 636, 694, 564],
    'bashi-zhongshan': [660, 340, 725, 410],
    'hotel-baijia': [957, 388, 925, 417],
    'baijia-station': [830, 545, 1110, 545]
  };
  let activeDay = 1;
  let skipXmu = false;
  let rainDay2 = false;
  let activePointIds = new Set();
  let selectedOverviewPoint = null;

  function esc(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function xy(pointOrId) { return anchors[typeof pointOrId === 'string' ? pointOrId : pointOrId.id]; }
  function isSpecial(point) { return point.locationType === 'hotel' || point.locationType === 'station'; }
  function route(dayIndex) {
    if (dayIndex === 2 && rainDay2) return data.rainRoutes[days[dayIndex].key];
    const edges = dataTools.routeForDay(data, days[dayIndex].key, { skipXmu: skipXmu && dayIndex === 2 });
    return edges.filter((edge, index) => !(dayIndex > 0 && index === edges.length - 1 && edge.to === "hotel"));
  }
  function dayForPoint(pointId) {
    if (pointId === 'yujian') return 2;
    return days.findIndex((_, index) => dataTools.routePointIds(route(index)).includes(pointId));
  }
  function baseImage() {
    return `<image href="${base}" width="${W}" height="${H}" preserveAspectRatio="none"/>`;
  }
  function markerPosition(point) {
    const [x, y] = xy(point), card = cards[point.id];
    return card ? [x + (card.dx || 0), y + 6 + (card.dy || 0)] : [x, y];
  }
  function sequenceBadge(x, y, order, color) {
    const width = order.length > 2 ? 63 : 30;
    return `<g class="atlas-sequence" transform="translate(${x} ${y})"><rect x="${-width / 2}" y="-13" width="${width}" height="26" rx="13" fill="${color}"/><text y="5" text-anchor="middle">${esc(order)}</text></g>`;
  }
  function nodeAttributes(point, daily) {
    return daily ? `data-day-point-id="${point.id}" role="button" tabindex="0" aria-label="查看${esc(point.name)}详情"` : '';
  }
  function hitAttributes(point, daily) {
    return daily ? '' : `data-overview-point="${point.id}" role="button" tabindex="0" aria-label="查看${esc(point.name)}详情"`;
  }
  function cardMarkup(point, color, order = '') {
    const daily = Boolean(order);
    const card = cards[point.id];
    const [cx, cy] = markerPosition(point);
    const textX = cx + (card.textDx || 0), textY = cy + 27 + (card.textDy || 0);
    const bw = 82, bh = 82;
    const tx = (card.icon % 4) * bw, ty = Math.floor(card.icon / 4) * bh;
    const selected = selectedOverviewPoint === point.id ? ' is-selected' : '';
    return `<g class="${daily ? 'atlas-daily-node is-viewable' : 'atlas-overview-node'}${selected}" ${nodeAttributes(point, daily)}>` +
      `<ellipse class="atlas-landmark-halo" cx="${cx}" cy="${cy - 49}" rx="53" ry="44"/>` +
      `<ellipse class="atlas-landmark-shadow" cx="${cx + 3}" cy="${cy - 8}" rx="37" ry="11"/>` +
      (card.art ? `<image class="atlas-landmark-art atlas-new-art" href="${card.art}" x="${cx - bw / 2}" y="${cy - bh - (daily ? 18 : 9)}" width="${bw}" height="${bh}"/>` : `<svg class="atlas-landmark-art" x="${cx - bw / 2}" y="${cy - bh - (daily ? 18 : 9)}" width="${bw}" height="${bh}" overflow="hidden"><image href="${sprite}" x="${-tx}" y="${-ty}" width="${bw * 4}" height="${bh * 4}"/></svg>`) +
      (daily ? sequenceBadge(cx, cy, order, color) : `<circle class="atlas-anchor" cx="${cx}" cy="${cy}" r="5" fill="${color}"/>`) +
      `<text class="atlas-node-name" x="${textX}" y="${textY}" text-anchor="middle">${esc(card.name)}</text>` +
      `<rect class="atlas-node-hit" x="${cx - bw / 2 - 3}" y="${cy - bh - 20}" width="${bw + 6}" height="${bh + 56}" rx="12" ${hitAttributes(point, daily)}/>` +
      (card.textDx ? `<rect class="atlas-node-hit" x="${textX - 54}" y="${textY - 19}" width="108" height="26" ${daily ? '' : `data-overview-point="${point.id}"`}/>` : '') + `</g>`;
  }
  function islandLabel() {
    return `<text class="atlas-island-label" x="352" y="790" text-anchor="middle">鼓浪屿景区</text>`;
  }
  function specialMarkup(point, color, order = '') {
    const daily = Boolean(order);
    const [x, y] = xy(point);
    const hotel = point.locationType === 'hotel';
    const art = hotel
      ? `<image class="atlas-special-art" href="${hotelArt}" x="${x - 50}" y="${y - 105}" width="100" height="100"/>`
      : `<svg class="atlas-special-art atlas-station-art" x="${x - 75}" y="${y - 69}" width="150" height="66" overflow="hidden"><image href="${stationArt}" x="0" y="-47" width="150" height="150"/></svg>`;
    return `<g class="${daily ? 'atlas-daily-node is-viewable' : 'atlas-overview-node'} atlas-special-node" ${nodeAttributes(point, daily)}>` +
      `<ellipse class="atlas-landmark-halo" cx="${x}" cy="${y - 55}" rx="${hotel ? 58 : 83}" ry="43"/>` +
      `<ellipse class="atlas-landmark-shadow" cx="${x + 3}" cy="${y - 9}" rx="${hotel ? 38 : 68}" ry="11"/>` +
      `<g transform="translate(0 ${daily ? -10 : 0})">${art}</g>` + (daily ? sequenceBadge(x, y, order, color) : `<circle class="atlas-special-anchor ${hotel ? 'is-hotel' : 'is-station'}" cx="${x}" cy="${y}" r="6"/>`) +
      `<text class="atlas-special-name" x="${x}" y="${y + 30}" text-anchor="middle">${esc(dayLabel[point.id])}</text>` +
      `<rect class="atlas-special-hit" x="${x - (hotel ? 54 : 80)}" y="${y - (hotel ? 119 : 84)}" width="${hotel ? 108 : 160}" height="${hotel ? 158 : 126}" rx="16" ${hitAttributes(point, daily)}/></g>`;
  }
  function routeMask(localPoints, id, daily = false) {
    const cutouts = localPoints.map(point => {
      const [x, y] = markerPosition(point), card = cards[point.id];
      const hotel = point.locationType === 'hotel';
      const width = card ? 98 : hotel ? 112 : 166;
      const top = card ? 105 : hotel ? 120 : 84;
      const name = card ? card.name : dayLabel[point.id];
      const tx = x + (card?.textDx || 0), ty = y + (card ? 27 + (card.textDy || 0) : 30);
      const textWidth = name.length * (card ? 17 : 19) + 16;
      return `<rect x="${x - width / 2}" y="${y - top}" width="${width}" height="${top - (daily ? 16 : 10)}" rx="18" fill="black"/>` +
        `<rect x="${tx - textWidth / 2}" y="${ty - 19}" width="${textWidth}" height="26" rx="8" fill="black"/>`;
    }).join('');
    return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" style="mask-type:luminance"><rect width="${W}" height="${H}" fill="white"/>${cutouts}</mask>`;
  }
  function routePaths(edges, color, daily = false) {
    return edges.filter(edge => edge.to !== "hotel" || edge.from === "station").map(edge => {
      const a = markerPosition(points.get(edge.from)), b = markerPosition(points.get(edge.to));
      const controls = routeControls[`${edge.from}-${edge.to}`];
      if (!controls) return '';
      const c = controls.slice(0, 2), d = controls.slice(2);
      function inset(p, toward) {
        const distance = Math.hypot(toward[0] - p[0], toward[1] - p[1]);
        const gap = daily ? 19 : 9;
        return [p[0] + (toward[0] - p[0]) / distance * gap, p[1] + (toward[1] - p[1]) / distance * gap];
      }
      const start = inset(a, c), end = inset(b, d);
      const path = `M${start} C${c} ${d} ${end}`;
      // A small arrow midway along the cubic leaves the landmark itself clear.
      const t = .55, u = 1 - t;
      const arrow = [0, 1].map(i => u ** 3 * start[i] + 3 * u * u * t * c[i] + 3 * u * t * t * d[i] + t ** 3 * end[i]);
      const tangent = [0, 1].map(i => 3 * u * u * (c[i] - start[i]) + 6 * u * t * (d[i] - c[i]) + 3 * t * t * (end[i] - d[i]));
      const angle = Math.atan2(tangent[1], tangent[0]) * 180 / Math.PI;
      const cls = edge.type === 'ferry' ? ' is-ferry' : '';
      return `<g class="atlas-route-segment${cls}" style="--route-color:${color}"><path class="atlas-route-under" d="${path}"/><path class="atlas-route-line" d="${path}"/><path class="atlas-route-direction" d="M-6-4 0 0-6 4" transform="translate(${arrow}) rotate(${angle})"/></g>`;
    }).join('');
  }
  function allOverviewPoints() {
    const unique = new Map();
    days.forEach((_, index) => dataTools.pointsForRoute(data, dataTools.routeForDay(data, days[index].key, { skipXmu: skipXmu && index === 2 })).forEach(point => {
      if (!unique.has(point.id)) unique.set(point.id, { point, color: days[index].color });
    }));
    unique.set('yujian', { point: points.get('yujian'), color: days[2].color });
    return Array.from(unique.values());
  }
  function renderOverviewDetail(pointId) {
    const target = document.getElementById('overviewPointDetail');
    const point = points.get(pointId);
    if (!target || !point) return;
    selectedOverviewPoint = pointId;
    const dateIndex = dayForPoint(pointId);
    const date = dateIndex >= 0 ? days[dateIndex].date : '';
    const gallery = window.XiamenPlaceGallery;
    target.innerHTML = `${gallery.markup(point)}<div class="atlas-detail-copy"><span class="atlas-detail-kicker">${date} · ${isSpecial(point) ? '交通与住宿' : '沿途风景'}</span><h3>${esc(point.name)}</h3><p>${esc(point.address)}</p>${gallery.guide(point)}<div class="atlas-detail-actions">${dateIndex >= 0 ? `<button type="button" data-overview-goto="${dateIndex}" data-overview-select="${point.id}">查看当日行程 ↗</button>` : ''}</div></div>`;
    gallery.bind(target);
    document.querySelectorAll('.atlas-overview-node').forEach(node => node.classList.toggle('is-selected', node.querySelector('[data-overview-point]')?.dataset.overviewPoint === pointId));
  }
  function jumpToDay(index, pointId) {
    if (index === 2 && pointId === 'yujian' && !rainDay2) window.dispatchEvent(new CustomEvent('xiamen:rain-toggle', { detail: { rain: true } }));
    window.dispatchEvent(new CustomEvent('xiamen:map-daychange', { detail: { dayIndex: index, scrollIntoView: true } }));
    if (pointId) selectPoint(pointId);
  }
  function bindMapZoom(scroller, svg, preferredWidth) {
    if (!scroller || !svg) return;
    const controls = scroller.parentElement.querySelector(`[data-zoom-controls="${scroller.id}"]`);
    controls?._zoomAbort?.abort();
    const zoomAbort = new AbortController();
    if (controls) controls._zoomAbort = zoomAbort;
    const output = controls?.querySelector('output');
    let baseWidth = Math.max(scroller.clientWidth, preferredWidth);
    function setWidth(value, focalX = scroller.clientWidth / 2, focalY = scroller.clientHeight / 2) {
      const oldWidth = svg.getBoundingClientRect().width || baseWidth;
      const width = Math.max(scroller.clientWidth, Math.min(2600, Math.round(value)));
      const ratio = width / oldWidth;
      const left = (scroller.scrollLeft + focalX) * ratio - focalX;
      const top = (scroller.scrollTop + focalY) * ratio - focalY;
      svg.style.width = `${width}px`;
      scroller.scrollLeft = left;
      scroller.scrollTop = top;
      if (output) output.textContent = `${Math.round(width / baseWidth * 100)}%`;
    }
    setWidth(baseWidth, 0, 0);
    controls?.addEventListener('click', event => {
      const button = event.target.closest('[data-map-zoom]');
      if (!button) return;
      const action = button.dataset.mapZoom;
      if (action === 'reset') setWidth(scroller.clientWidth);
      else setWidth(svg.getBoundingClientRect().width * (action === 'in' ? 1.25 : .8));
    }, { signal: zoomAbort.signal });
    let gesture = null;
    const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    scroller.addEventListener('touchstart', event => {
      if (event.touches.length === 2) gesture = { distance: distance(event.touches), width: svg.getBoundingClientRect().width };
    }, { passive: true, signal: zoomAbort.signal });
    scroller.addEventListener('touchmove', event => {
      if (!gesture || event.touches.length !== 2) return;
      event.preventDefault();
      const bounds = scroller.getBoundingClientRect();
      const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - bounds.left;
      const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - bounds.top;
      setWidth(gesture.width * distance(event.touches) / gesture.distance, centerX, centerY);
    }, { passive: false, signal: zoomAbort.signal });
    scroller.addEventListener('touchend', event => { if (event.touches.length < 2) gesture = null; }, { passive: true, signal: zoomAbort.signal });
  }
  function renderOverview() {
    const target = document.getElementById('routeOverview');
    const dialog = document.getElementById('overviewMapDialog');
    const canvas = document.getElementById('overviewMapZoomCanvas');
    if (!target) return;
    const all = allOverviewPoints();
    const markers = all.map(({ point, color }) => isSpecial(point) ? specialMarkup(point, color) : cardMarkup(point, color)).join('');
    const routes = days.map((day, index) => `<g class="atlas-overview-route-day${index === activeDay ? ' is-current' : ''}">${routePaths(dataTools.routeForDay(data, day.key, { skipXmu: skipXmu && index === 2 }).filter((edge, i, edges) => !(index > 0 && i === edges.length - 1 && edge.to === 'hotel')), day.color)}</g>`).join('');
    target.innerHTML = `<div class="atlas-overview-toolbar"><div class="atlas-overview-toolbar-main"><span>五日路线 · 同色连线为同一天 · 点击地标看详情</span><div class="map-zoom-controls atlas-inline-zoom" data-zoom-controls="overviewMapInlineScroll" aria-label="总览地图缩放"><button type="button" data-map-zoom="out" aria-label="缩小总览地图">−</button><output aria-live="polite">100%</output><button type="button" data-map-zoom="in" aria-label="放大总览地图">＋</button><button type="button" data-map-zoom="reset" aria-label="总览地图适应屏幕">适应</button></div></div><div class="atlas-day-links">${days.map((day, index) => `<button type="button" class="${index === activeDay ? 'is-current' : ''}" data-overview-day="${index}" style="--day-color:${day.color}" aria-label="查看${day.date}${esc(day.title)}每日行程">${day.date}</button>`).join('')}</div></div>` +
      `<div class="overview-map-scroll" id="overviewMapInlineScroll"><svg class="overview-map atlas-overview-map" viewBox="0 0 ${W} ${H}" role="group" aria-label="厦门五日游手绘路线图，点选地标查看详情">` +
      `<defs>${routeMask(all.map(item => item.point), 'atlas-overview-clear')}</defs>` +
      baseImage() +
      `<rect class="atlas-map-wash" width="${W}" height="${H}"/>` +
      `<g class="atlas-overview-routes" mask="url(#atlas-overview-clear)">${routes}</g>` +
      islandLabel() + `<g class="atlas-marker-layer">${markers}</g>` +
      `<g class="atlas-compass" transform="translate(1438 85)"><circle r="33"/><path d="M0-21 7 6 0 1-7 6Z"/><text y="-39" text-anchor="middle">N</text></g>` +
      `</svg></div>` +
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
    const inlineScroll = target.querySelector('.overview-map-scroll');
    const toolbar = target.querySelector('.atlas-overview-toolbar');
    const dialogLinks = document.getElementById('overviewMapDialogLinks');
    bindMapZoom(inlineScroll, map, inlineScroll.clientWidth);
    function restoreMap() {
      if (dialogLinks.contains(toolbar)) target.prepend(toolbar);
      if (canvas.contains(map)) {
        inlineScroll.append(map);
        bindMapZoom(inlineScroll, map, inlineScroll.clientWidth);
        inlineScroll.scrollLeft = 0;
        inlineScroll.scrollTop = 0;
      }
    }
    function closeMap() {
      restoreMap();
      if (dialog && dialog.open) dialog.close();
    }
    target.querySelector('.overview-map-zoom-button').addEventListener('click', () => {
      dialogLinks.append(toolbar);
      canvas.append(map);
      dialog.showModal();
      bindMapZoom(canvas, map, 1100);
      canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) * .32);
      canvas.scrollTop = Math.max(0, (canvas.scrollHeight - canvas.clientHeight) * .24);
    });
    document.getElementById('overviewMapClose').onclick = closeMap;
    dialog.onclose = restoreMap;
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
  function dailyCrop(localPoints, edges) {
    const coords = localPoints.map(markerPosition);
    // Include route control points so a return loop never disappears at a crop edge.
    edges.forEach(edge => {
      const controls = routeControls[`${edge.from}-${edge.to}`];
      if (controls) coords.push(controls.slice(0, 2), controls.slice(2));
    });
    const xs = coords.map(p => p[0]), ys = coords.map(p => p[1]);
    let width = Math.max(480, Math.max(...xs) - Math.min(...xs) + 160);
    let height = Math.max(325, Math.max(...ys) - Math.min(...ys) + 185);
    if (width / height < 1.55) width = height * 1.55;
    else height = width / 1.55;
    width = Math.min(W, width); height = Math.min(H, height);
    const mx = (Math.max(...xs) + Math.min(...xs)) / 2;
    const my = (Math.max(...ys) + Math.min(...ys)) / 2 - 35;
    const x = Math.max(0, Math.min(W - width, mx - width / 2));
    const y = Math.max(0, Math.min(H - height, my - height / 2));
    return { x, y, width, height };
  }
  function dailyMap(viewName, edges, allPoints, dayIndex) {
    const local = allPoints.filter(point => point.view === viewName);
    if (!local.length) return '';
    const localEdges = edges.filter(edge => points.get(edge.from)?.view === viewName && points.get(edge.to)?.view === viewName && edge.type === 'visit' && (edge.to !== 'hotel' || edge.from === 'station'));
    const crop = dailyCrop(local, localEdges);
    const sequence = [edges[0].from, ...edges.map(edge => edge.to)];
    const markers = local.map(point => {
      const orderStart = dataTools.routeOrderStart(data, edges);
      const order = sequence.flatMap((id, index) => id === point.id ? [String(index + orderStart).padStart(2, '0')] : []).join('/');
      return isSpecial(point) ? specialMarkup(point, days[dayIndex].color, order) : cardMarkup(point, days[dayIndex].color, order);
    }).join('');
    const label = viewName === 'island' ? '鼓浪屿岛上步行' : '厦门岛当日路线';
    const maskId = `atlas-day-clear-${dayIndex}-${viewName}`;
    const scrollId = `atlas-scroll-${dayIndex}-${viewName}`;
    return `<div class="atlas-daily-map-heading"><div class="atlas-daily-heading-copy"><strong>${days[dayIndex].date} · ${label}</strong><span>按编号游览 · 点击手绘地标</span></div><div class="map-zoom-controls atlas-daily-zoom" data-zoom-controls="${scrollId}" aria-label="当天地图缩放"><button type="button" data-map-zoom="out" aria-label="缩小地图">−</button><output aria-live="polite">100%</output><button type="button" data-map-zoom="in" aria-label="放大地图">＋</button><button type="button" data-map-zoom="reset" aria-label="适应屏幕">适应</button></div></div><div class="atlas-daily-scroll" id="${scrollId}"><svg class="day-map-svg atlas-daily-map" viewBox="${crop.x} ${crop.y} ${crop.width} ${crop.height}" role="group" aria-label="${days[dayIndex].date}${label}，按数字顺序浏览的手绘路线图">` +
      `<defs>${routeMask(local, maskId, true)}</defs>${baseImage()}<rect class="atlas-day-wash" width="${W}" height="${H}"/>` +
      `<g class="atlas-daily-routes" mask="url(#${maskId})">${routePaths(localEdges, days[dayIndex].color, true)}</g>` +
      `<g class="atlas-daily-points">${markers}</g>` +
      `</svg></div><div class="atlas-daily-map-foot"><span>数字对应下方交通段；双编号表示同一点的两次到访。</span><span class="atlas-pan-hint">默认显示完整路线 · 放大后滑动细看</span></div>`;
  }
  function transitIcon(mode) {
    const shapes = {
      walk: '<circle cx="14" cy="4" r="2"/><path d="m10 20 3-7-3-4 3-3 3 4 4 1M10 9l-4 3m7 1 4 7"/>',
      taxi: '<path d="m4 10 2-5h12l2 5M3 10h18v8H3zm4 8v2m10-2v2M7 13h2m6 0h2"/>',
      metro: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M8 18l-2 3m10-3 2 3M9 14h.1m6 0h.1"/>',
      ferry: '<path d="M4 13 12 10l8 3-3 6H7Zm3-2V6h10v5M10 6V3h4v3M3 21l3-1 3 1 3-1 3 1 3-1 3 1"/>',
      train: '<rect x="4" y="3" width="16" height="15" rx="4"/><path d="M4 11h16M8 18l-2 3m10-3 2 3M8 15h.1m8 0h.1"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${shapes[mode]}</svg>`;
  }
  function renderTransit(edges, index) {
    const target = document.getElementById(`day-transit-${index}`);
    if (!target) return;
    const transit = window.XiamenTransit;
    target.style.setProperty('--day-color', days[index].color);
    const arrivalTrain = index === 0 ? `<li><div class="atlas-leg-title"><span class="atlas-leg-index">00 <b>→</b> 01</span><h5>深圳北 <span>→</span> 厦门站</h5></div><div class="atlas-leg-mode">${transitIcon('train')}<strong>动车 D672</strong><b>3 小时 54 分钟</b></div><p>15:55 从深圳北站发车，19:49 抵达厦门站。按车票车厢号上车，到站后沿出站指引进入站前交通区。</p><p class="atlas-leg-alternative">当天实景图展示深圳北、厦门站与文灶入夜街景。</p></li>` : '';
    target.innerHTML = `<div class="atlas-transit-heading"><div><span class="section-kicker">STEP BY STEP</span><h4>这一段，怎么走</h4></div><span>${edges.length + (index === 0 ? 1 : 0)} 段接驳${index === 0 ? ' · 列车段仅见详情' : ' · 与地图编号对应'}</span></div>` +
      `<ol class="atlas-transit-list">${arrivalTrain}${edges.map((edge, i) => {
        const leg = transit.legs[`${edge.from}-${edge.to}`];
        const destination = points.get(edge.to);
        const orderStart = dataTools.routeOrderStart(data, edges);
        return `<li><div class="atlas-leg-title"><span class="atlas-leg-index">${String(i + orderStart).padStart(2, '0')} <b>→</b> ${String(i + orderStart + 1).padStart(2, '0')}</span><h5>${esc(dayLabel[edge.from])} <span>→</span> ${esc(dayLabel[edge.to])}</h5></div><div class="atlas-leg-mode">${transitIcon(leg.mode)}<strong>${esc(transit.modes[leg.mode])}</strong><b>约 ${esc(leg.time.replace(/^约 /, ''))}</b></div><p>${esc(leg.path)}</p>${leg.alternative ? `<p class="atlas-leg-alternative">${esc(leg.alternative)}</p>` : ''}<a class="atlas-destination-link" href="${esc(dataTools.amapDestinationUrl(destination))}" target="_blank" rel="noopener noreferrer" aria-label="在高德地图打开终点${esc(destination.name)}">在高德打开终点 · ${esc(destination.name)} ↗</a></li>`;
      }).join('')}</ol><p class="atlas-transit-day-note">${esc(transit.notes[index])}</p>`;
  }
  function bindDailyNodes(container) {
    const scroll = container.querySelector('.atlas-daily-scroll');
    if (scroll) {
      bindMapZoom(scroll, scroll.querySelector('svg'), scroll.clientWidth);
      scroll.scrollLeft = 0;
      scroll.scrollTop = 0;
    }
    container.querySelectorAll('.atlas-daily-node.is-viewable').forEach(node => {
      node.addEventListener('click', () => selectPoint(node.dataset.dayPointId, { scroll: true }));
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); selectPoint(node.dataset.dayPointId, { scroll: true });
        }
      });
    });
  }
  function placeDetailCard(item, dayIndex, { hidden = false } = {}) {
    const { point, orders } = item;
    const gallery = window.XiamenPlaceGallery;
    const kind = isSpecial(point) ? '交通与住宿' : '当日路线点';
    const hiddenAttribute = hidden ? ' hidden' : '';
    return `<article id="day-place-${dayIndex}-${esc(point.id)}" class="map-detail day-place-card${isSpecial(point) ? ' is-special' : ''}" data-day-place-detail="${esc(point.id)}" tabindex="-1" style="--day-color:${days[dayIndex].color}"${hiddenAttribute}>` +
      `${gallery.markup(point)}<div class="map-detail-copy"><span class="section-kicker">${days[dayIndex].date} · ${kind}</span><div class="day-place-title"><h3>${esc(point.name)}</h3><div class="day-place-order"><span class="day-place-order-number">${esc(orders.map(order => String(order).padStart(2, '0')).join(' / '))}</span><span class="day-place-order-label">游览顺序</span></div></div><p class="map-detail-address">${esc(point.address)}</p>${gallery.guide(point)}${gallery.experience(point)}</div></article>`;
  }
  function placeDetailsMarkup(details, dayIndex) {
    const cards = details.places.map(item => placeDetailCard(item, dayIndex)).join('');
    const startHotel = details.startHotel ? placeDetailCard(details.startHotel, dayIndex, { hidden: true }) : '';
    return `<div class="day-place-list-heading"><span class="section-kicker">VISIT NOTES</span><h4>当天地点 · 按游玩顺序</h4></div><div class="day-place-stack">${startHotel}${cards}</div>`;
  }
  function selectPoint(pointId, { scroll = false } = {}) {
    if (!activePointIds.has(pointId)) return false;
    const point = points.get(pointId);
    if (!point) return false;
    const target = document.getElementById(`day-map-detail-${activeDay}`);
    if (!target) return false;
    const card = [...target.querySelectorAll('[data-day-place-detail]')]
      .find(item => item.dataset.dayPlaceDetail === pointId);
    if (!card) return false;
    card.hidden = false;
    target.querySelectorAll('.day-place-card').forEach(item => item.classList.toggle('is-selected', item === card));
    document.querySelectorAll('.atlas-daily-node').forEach(node => node.classList.toggle('is-selected', node.dataset.dayPointId === pointId));
    if (scroll) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    const placeDetails = dataTools.routePlaceDetails(data, edges);
    if (detail) {
      detail.innerHTML = placeDetailsMarkup(placeDetails, activeDay);
      window.XiamenPlaceGallery.bind(detail);
    }
    if (main) { main.innerHTML = dailyMap('main', edges, localPoints, activeDay); bindDailyNodes(main); }
    if (island) {
      island.hidden = !localPoints.some(point => point.view === 'island');
      island.innerHTML = island.hidden ? '' : dailyMap('island', edges, localPoints, activeDay);
      bindDailyNodes(island);
    }
    const ferryEdge = edges.find(edge => edge.type === 'ferry');
    if (ferry) {
      ferry.hidden = !ferryEdge;
      ferry.innerHTML = ferryEdge ? '<span class="map-ferry-label">01 → 02 · 去程轮渡约 20 分钟</span><strong>东渡客运码头</strong><b class="map-ferry-time">10:30 开船</b><span class="map-ferry-arrow" aria-hidden="true">→</span><strong>三丘田码头</strong><span class="map-ferry-label">返厦后按船票上岸码头接八市晚餐</span>' : '';
    }
    renderTransit(edges, activeDay);
    const first = placeDetails.places.find(item => !isSpecial(item.point)) || placeDetails.places[0] || placeDetails.startHotel;
    if (first) selectPoint(first.point.id);
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
  window.addEventListener('xiamen:rain-toggle', event => {
    rainDay2 = Boolean(event.detail?.rain);
    renderOverview(); if (activeDay === 2) renderDay(2);
  });
  renderOverview(); renderDay(activeDay);
})();
