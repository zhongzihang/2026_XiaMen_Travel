(function () {
  const data = window.XiamenMapData;
  const tools = window.XiamenMapDataTools;
  const geometry = window.XiamenMapGeometry;
  const dayList = [
    { key: '2026-09-30', label: '9.30', name: '抵达文灶', color: '#648d80' },
    { key: '2026-10-01', label: '10.01', name: '鼓浪屿', color: '#dc765c' },
    { key: '2026-10-02', label: '10.02', name: '人文海岸', color: '#408d97' },
    { key: '2026-10-03', label: '10.03', name: '山海绿意', color: '#748f4e' },
    { key: '2026-10-04', label: '10.04', name: '老城返程', color: '#9276a8' }
  ];
  const view = { width: 720, height: 900, padding: 56 };
  const points = new Map(data.points.map(function (point) { return [point.id, point]; }));
  const labelOffsets = {
    hotel: [16, -17, 'start'], station: [17, 21, 'start'], dongdu: [-12, -18, 'end'],
    sanqiutian: [-12, -19, 'end'], longtou: [15, 0, 'start'], shuzhuang: [-12, 20, 'end'],
    rock: [15, -16, 'start'], nanputuo: [-14, -17, 'end'], xmu: [15, 17, 'start'],
    baicheng: [16, 1, 'start'], shapowei: [-12, -18, 'end'], heping: [15, 18, 'start'],
    botanic: [-13, -16, 'end'], cable: [15, 17, 'start'], bashi: [-14, -16, 'end'],
    baijia: [15, -16, 'start']
  };
  let activeDay = 1;
  let skipXmu = false;

  function escapeHtml(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  function project(point) {
    return geometry.projectPoint(point, data.mainBounds, view);
  }

  function overlapsWithGap(a, b, gap) {
    return a.x < b.x + b.width + gap && b.x < a.x + a.width + gap &&
      a.y < b.y + b.height + gap && b.y < a.y + a.height + gap;
  }

  function placeOverviewLabel(ellipse, occupiedLabels, pointLabels) {
    const width = 100, height = 28, inset = 5;
    const minX = Math.max(12, ellipse.cx - ellipse.rx + inset);
    const maxX = Math.min(view.width - width - 12, ellipse.cx + ellipse.rx - width - inset);
    const minY = Math.max(32, ellipse.cy - ellipse.ry + inset);
    const maxY = Math.min(view.height - height - 12, ellipse.cy + ellipse.ry - height - inset);
    const candidates = [];
    const seen = new Set();
    function add(x, y) {
      const candidate = { x: x, y: y, width: width, height: height };
      const key = x.toFixed(1) + ':' + y.toFixed(1);
      const dx = (x + width / 2 - ellipse.cx) / ellipse.rx;
      const dy = (y + height / 2 - ellipse.cy) / ellipse.ry;
      if (!seen.has(key) && dx * dx + dy * dy <= 1.05) {
        seen.add(key);
        candidates.push(candidate);
      }
    }
    if (maxX >= minX && maxY >= minY) {
      add(minX, minY);
      add(maxX, minY);
      add(minX, maxY);
      add(maxX, maxY);
      for (let y = minY; y <= maxY; y += 8) {
        for (let x = minX; x <= maxX; x += 8) add(x, y);
        add(maxX, y);
      }
      add(minX, maxY);
      add(maxX, maxY);
    }
    const obstacles = (pointLabels || []).concat(occupiedLabels || []);
    const clear = candidates.find(function (candidate) {
      return !obstacles.some(function (other) {
        return overlapsWithGap(candidate, other, pointLabels && pointLabels.includes(other) ? 3 : 6);
      });
    });
    if (clear) return clear;
    const scored = candidates.map(function (candidate) {
      const score = obstacles.reduce(function (sum, other) {
        const overlapX = Math.max(0, Math.min(candidate.x + width, other.x + other.width) - Math.max(candidate.x, other.x));
        const overlapY = Math.max(0, Math.min(candidate.y + height, other.y + other.height) - Math.max(candidate.y, other.y));
        return sum + overlapX * overlapY;
      }, 0);
      return { label: candidate, score: score };
    }).sort(function (a, b) { return a.score - b.score; });
    return scored.length ? scored[0].label : { x: minX, y: minY, width: width, height: height };
  }

  function overviewPointLabelRects(groups) {
    const unique = new Map();
    groups.forEach(function (group) {
      group.points.forEach(function (point) { if (!unique.has(point.id)) unique.set(point.id, point); });
    });
    return Array.from(unique.values()).map(function (point) {
      const position = project(point);
      const offset = labelOffsets[point.id] || [15, -16, 'start'];
      const width = Array.from(point.name).reduce(function (sum, character) {
        return sum + (/[^\u0000-\u00ff]/.test(character) ? 11 : 6.5);
      }, 0);
      const x = position.x + offset[0] - (offset[2] === 'end' ? width : (offset[2] === 'middle' ? width / 2 : 0));
      return { x: x, y: position.y + offset[1] - 11, width: width, height: 14 };
    });
  }

  function overviewZone(group, dayIndex, viewName, occupiedLabels, pointLabels) {
    const members = group.points.filter(function (point) { return point.view === viewName; });
    if (!members.length) return '';
    const xy = members.map(project);
    const cx = xy.reduce(function (sum, point) { return sum + point.x; }, 0) / xy.length;
    const cy = xy.reduce(function (sum, point) { return sum + point.y; }, 0) / xy.length;
    const rx = Math.max(56, ...xy.map(function (point) { return Math.abs(point.x - cx) + 42; }));
    const ry = Math.max(52, ...xy.map(function (point) { return Math.abs(point.y - cy) + 38; }));
    const color = dayList[dayIndex].color;
    const label = placeOverviewLabel({ cx: cx, cy: cy, rx: rx, ry: ry }, occupiedLabels, pointLabels);
    occupiedLabels.push(label);
    const active = dayIndex === activeDay ? ' is-active' : '';
    return '<g class="overview-day-zone' + active + '" style="color:' + color + '" data-overview-day="' + dayIndex + '" data-view="' + viewName + '" role="button" tabindex="0" aria-label="查看' + dayList[dayIndex].label + ' ' + escapeHtml(dayList[dayIndex].name) + '当日路线">' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>' +
      '<g class="overview-zone-label" transform="translate(' + label.x + ' ' + label.y + ')"><rect width="' + label.width + '" height="' + label.height + '" rx="14"/><text x="50" y="19" text-anchor="middle">' + dayList[dayIndex].label + ' · D' + dayIndex + '</text></g></g>';
  }

  function nearestOverviewDay(zones, x, y) {
    let selectedDay = null;
    let closest = Infinity;
    zones.forEach(function (zone) {
      if (!(zone.rx > 0) || !(zone.ry > 0)) return;
      const dx = (x - zone.cx) / zone.rx;
      const dy = (y - zone.cy) / zone.ry;
      const distance = dx * dx + dy * dy;
      if (distance <= 1 && distance < closest) {
        selectedDay = zone.dayIndex;
        closest = distance;
      }
    });
    return selectedDay;
  }

  function overviewZoneMetrics(zone) {
    const rect = zone.querySelector('ellipse').getBoundingClientRect();
    return {
      dayIndex: Number(zone.dataset.overviewDay),
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      rx: rect.width / 2,
      ry: rect.height / 2
    };
  }

  function routeMarkup(groups) {
    return groups.map(function (group, dayIndex) {
      return group.edges.map(function (edge, edgeIndex) {
        const from = points.get(edge.from);
        const to = points.get(edge.to);
        if (!from || !to) return '';
        const a = project(from), b = project(to);
        const bend = edge.type === 'ferry' ? -40 : (edgeIndex % 2 ? 14 : -14);
        const controlX = (a.x + b.x) / 2 + bend;
        const controlY = (a.y + b.y) / 2 - bend;
        const ferry = edge.type === 'ferry' ? ' is-ferry' : '';
        return '<path class="overview-route-under' + ferry + '" d="M' + a.x + ' ' + a.y + ' Q' + controlX + ' ' + controlY + ' ' + b.x + ' ' + b.y + '"/>' +
          '<path class="overview-route' + ferry + '" d="M' + a.x + ' ' + a.y + ' Q' + controlX + ' ' + controlY + ' ' + b.x + ' ' + b.y + '" stroke="' + dayList[dayIndex].color + '" marker-end="url(#overview-arrow-' + dayIndex + ')"/>';
      }).join('');
    }).join('');
  }

  function markerMarkup(point, color) {
    const position = project(point);
    const offset = labelOffsets[point.id] || [15, -16, 'start'];
    let icon = '';
    if (point.locationType === 'hotel') {
      icon = '<circle class="overview-marker-icon is-hotel" r="15"/><path class="overview-house" d="M-8 0 0-7 8 0v8H3V2h-6v6h-5Z"/>';
    } else if (point.locationType === 'station') {
      icon = '<circle class="overview-marker-icon is-station" r="15"/><path class="overview-train" d="M-8-7h16v10a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5Zm3 3v5h10v-5Zm-1 14 3-5m8 5-3-5"/><circle class="overview-train-window" cx="-3" cy="-2" r="1"/><circle class="overview-train-window" cx="3" cy="-2" r="1"/>';
    } else {
      icon = '<path class="overview-marker-icon" fill="' + color + '" d="M0-14c-8 0-13 6-13 13 0 9 13 21 13 21S13 8 13-1c0-7-5-13-13-13Z"/><circle class="overview-marker-core" cy="-1" r="4"/>';
    }
    return '<g class="overview-point" data-point-id="' + escapeHtml(point.id) + '" transform="translate(' + position.x + ' ' + position.y + ')" aria-label="' + escapeHtml(point.name) + '"><circle class="overview-point-halo" r="20"/>' + icon +
      '<text class="overview-point-label" x="' + offset[0] + '" y="' + offset[1] + '" text-anchor="' + offset[2] + '">' + escapeHtml(point.name) + '</text></g>';
  }

  function cityLayers(scenicLayerMarkup) {
    return '<rect class="overview-water" width="720" height="900"/>' + paperTexture(720, 900) + '<path class="overview-water-lines" d="M18 175q32-14 64 0t64 0M18 495q32-14 64 0t64 0m430-282q32-14 64 0t64 0M26 818q32-14 64 0t64 0m402-4q32-14 64 0t64 0"/>' +
      '<path class="overview-island-shadow" d="M92 478c23-19 57-26 82-14 22 11 35 36 30 61-5 26-29 43-56 48-28 6-58-5-71-27-14-23-8-52 15-68Z"/>' +
      '<path class="overview-island-shape" d="M90 470c23-19 57-26 82-14 22 11 35 36 30 61-5 26-29 43-56 48-28 6-58-5-71-27-14-23-8-52 15-68Z"/><path class="overview-island-road" d="M91 504c28-16 58-23 91-23m-91 35c27 11 46 22 67 42m-35-102c0 24 7 47 21 66"/>' +
      '<text class="overview-island-label" x="123" y="526">鼓浪屿</text>' +
      '<path class="overview-land-shadow" d="M170 15H735V885H514c-37-34-33-69-65-94-30-22-76-39-91-78-18-49 8-73-20-111-23-32-68-44-81-83-12-38 10-67-9-101-19-34-58-61-55-105 3-38 43-69 38-112-4-38-37-62-38-100-1-27 16-55 38-86Z"/>' +
      '<path class="overview-land" d="M184 0H720V870H505c-37-34-33-69-65-94-30-22-76-39-91-78-18-49 8-73-20-111-23-32-68-44-81-83-12-38 10-67-9-101-19-34-58-61-55-105 3-38 43-69 38-112-4-38-37-62-38-100-1-27 16-55 38-86Z"/>' + (scenicLayerMarkup || '') +
      '<path class="overview-coastline" d="M184 0c-22 31-39 59-38 86 1 38 34 62 38 100 5 43-35 74-38 112-3 44 36 71 55 105 19 34-3 63 9 101 13 39 58 51 81 83 28 38 2 62 20 111 15 39 61 56 91 78 32 25 28 60 65 94"/>' +
      '<path class="overview-park" d="M357 464c35-28 85-28 112 0 22 22 12 48-15 58-38 14-94 6-108-21-7-13-3-27 11-37Zm46 131c29-18 61-15 73 6 12 19-2 36-27 39-29 3-59-16-56-32 1-5 4-10 10-13Zm42-303c28-20 60-16 75 6 11 18-2 35-26 37-31 3-59-15-58-29 0-5 3-10 9-14Z"/>' +
      '<path class="overview-roads-under" d="M170 133C284 121 305 187 422 171s166-47 281-17M153 280c109-18 173 30 267 16 112-16 169-19 267 11M163 437c101-23 165 27 254 22 118-7 192 12 268 43M190 590c105-20 148 17 238 22 105 5 164 38 224 76M266 742c69-16 120 2 177 33 45 25 80 48 135 50"/>' +
      '<path class="overview-roads" d="M170 133C284 121 305 187 422 171s166-47 281-17M153 280c109-18 173 30 267 16 112-16 169-19 267 11M163 437c101-23 165 27 254 22 118-7 192 12 268 43M190 590c105-20 148 17 238 22 105 5 164 38 224 76M266 742c69-16 120 2 177 33 45 25 80 48 135 50"/>' +
      '<path class="overview-small-roads" d="M222 43c28 66 1 112-21 155m121-178c-8 69 17 112 53 149m-186 150c41 30 75 58 72 112m122-175c34 44 48 82 37 124m118-203c-36 46-43 86-27 127m-60 35c43 46 59 86 46 132m116-54c-29 45-31 86-10 125m-204 13c18 47 17 96-8 134m136-82c27 38 41 79 35 124"/>' +
      '<g class="overview-blocks"><rect x="410" y="220" width="44" height="22" rx="6"/><rect x="465" y="206" width="54" height="26" rx="7"/><rect x="527" y="223" width="38" height="21" rx="6"/><rect x="342" y="353" width="53" height="23" rx="7"/><rect x="405" y="365" width="35" height="20" rx="6"/><rect x="478" y="328" width="50" height="23" rx="6"/><rect x="276" y="521" width="39" height="23" rx="6"/><rect x="325" y="535" width="48" height="21" rx="6"/><rect x="404" y="495" width="41" height="22" rx="6"/><rect x="349" y="665" width="39" height="22" rx="6"/><rect x="412" y="697" width="49" height="22" rx="6"/></g>' +
      '<text class="overview-water-label" x="73" y="722">鹭 江</text><text class="overview-district-label" x="450" y="111">厦门岛 · 思明区</text><text class="overview-place-label" x="34" y="385">西海域</text>' +
      '<g class="overview-compass" transform="translate(661 79)"><circle r="25"/><path d="M0-18 5 0 0 18-5 0Z"/><text x="0" y="-31">N</text></g>';
  }

  function paperTexture(width, height) {
    return '<image class="map-generated-base" href="assets/xiamen-map-base.png" x="0" y="0" width="' + width + '" height="' + height + '" opacity="0.24" preserveAspectRatio="xMidYMid slice"/>';
  }

  function scenicLayer(dayIndex, viewName, crop) {
    const assets = {
      '1:island': 'xiamen-gulangyu-scene.png',
      '2:main': 'xiamen-coast-scene.png',
      '3:main': 'xiamen-garden-cableway-scene.png',
      '4:main': 'xiamen-oldtown-scene.png'
    };
    const asset = assets[dayIndex + ':' + viewName];
    if (!asset) return '';
    return '<image class="map-generated-scenery" href="assets/' + asset + '" x="' + crop.x + '" y="' + crop.y + '" width="' + crop.width + '" height="' + crop.height + '" opacity="0.6" preserveAspectRatio="xMidYMid meet"/>';
  }

  // Hand-calibrated against the supplied watercolor basemap. It is an illustrated
  // orientation map, so these are approximate visual placements, not navigation coordinates.
  const overviewLocations = {
    hotel: [942, 508], station: [1118, 500], dongdu: [568, 370],
    sanqiutian: [365, 570], longtou: [379, 679], shuzhuang: [365, 756], rock: [304, 699],
    nanputuo: [900, 658], xmu: [851, 728], baicheng: [965, 780], shapowei: [740, 707],
    heping: [692, 570], botanic: [991, 563], cable: [951, 598], bashi: [771, 516],
    baijia: [840, 461]
  };
  const overviewThumbs = {
    dongdu: { name: '东渡码头', tile: [418, 902, 105, 51], dx: -87, dy: -113 },
    sanqiutian: { name: '三丘田码头', tile: [24, 724, 117, 67], dx: -140, dy: -129 },
    longtou: { name: '龙头路', tile: [226, 972, 153, 83], dx: 54, dy: -58 },
    shuzhuang: { name: '菽庄花园', tile: [20, 849, 150, 79], dx: -168, dy: -38 },
    rock: { name: '日光岩', tile: [166, 722, 89, 80], dx: -82, dy: -140 },
    nanputuo: { name: '南普陀寺', tile: [373, 639, 113, 75], dx: 1, dy: 38 },
    xmu: { name: '厦门大学', tile: [511, 663, 137, 79], dx: -48, dy: 71 },
    baicheng: { name: '白城沙滩', tile: [714, 644, 175, 79], dx: 13, dy: 20 },
    shapowei: { name: '沙坡尾', tile: [405, 775, 136, 80], dx: -152, dy: 47 },
    heping: { name: '鹭江夜游', tile: [417, 904, 112, 52], dx: -122, dy: 12 },
    botanic: { name: '园林植物园', tile: [560, 469, 155, 88], dx: 80, dy: -92 },
    cable: { name: '钟鼓索道', tile: [825, 519, 104, 87], dx: 93, dy: 25 },
    bashi: { name: '八市', tile: [541, 880, 117, 77], dx: -96, dy: -119 },
    baijia: { name: '百家村', tile: [718, 771, 135, 77], dx: 7, dy: -129 }
  };

  function overviewPosition(point) {
    const xy = overviewLocations[point.id];
    return { x: xy[0], y: xy[1] };
  }

  function illustratedOverviewRoute(groups) {
    return groups.map(function (group, dayIndex) {
      return group.edges.map(function (edge, edgeIndex) {
        const from = points.get(edge.from), to = points.get(edge.to);
        if (!from || !to) return '';
        const a = overviewPosition(from), b = overviewPosition(to);
        const bend = edge.type === 'ferry' ? -65 : (edgeIndex % 2 ? 18 : -18);
        const cx = (a.x + b.x) / 2 + bend;
        const cy = (a.y + b.y) / 2 - bend;
        const path = 'M' + a.x + ' ' + a.y + ' Q' + cx + ' ' + cy + ' ' + b.x + ' ' + b.y;
        const ferry = edge.type === 'ferry' ? ' is-ferry' : '';
        return '<path class="overview-route-under' + ferry + '" d="' + path + '"/>' +
          '<path class="overview-route' + ferry + '" d="' + path + '" stroke="' + dayList[dayIndex].color + '" marker-end="url(#overview-arrow-' + dayIndex + ')"/>';
      }).join('');
    }).join('');
  }

  function illustratedOverviewMarker(point, color) {
    const xy = overviewPosition(point);
    if (point.locationType === 'hotel' || point.locationType === 'station') {
      const station = point.locationType === 'station';
      const symbol = station
        ? '<rect x="-15" y="-12" width="30" height="24" rx="6" fill="#397c9b"/><path d="M-9-6h18v9H-9Zm1 24 5-6m11 6-5-6" fill="none" stroke="#fffaf0" stroke-width="3" stroke-linejoin="round"/>'
        : '<path d="M-19-1 0-18 19-1v20h-38Z" fill="#d57458" stroke="#fffaf0" stroke-width="3" stroke-linejoin="round"/><path d="M-6 19V4H6v15" fill="none" stroke="#fffaf0" stroke-width="3"/>';
      return '<g class="overview-illustrated-point overview-special-point" data-point-id="' + point.id + '" transform="translate(' + xy.x + ' ' + xy.y + ')" aria-label="' + escapeHtml(point.name) + '"><circle r="27" fill="#fffaf0" stroke="' + color + '" stroke-width="3"/>' + symbol +
        '<g transform="translate(-54 31)"><rect width="108" height="33" rx="16" class="overview-illustrated-label"/><text x="54" y="23" text-anchor="middle">' + escapeHtml(point.name) + '</text></g></g>';
    }
    const thumb = overviewThumbs[point.id];
    if (!thumb) return '';
    const tileX = xy.x + thumb.dx, tileY = xy.y + thumb.dy;
    const width = 105, height = 83;
    return '<g class="overview-illustrated-point" data-point-id="' + point.id + '" aria-label="' + escapeHtml(point.name) + '">' +
      '<path class="overview-thumbnail-leader" d="M' + xy.x + ' ' + xy.y + 'L' + (tileX + width / 2) + ' ' + (tileY + height / 2) + '"/>' +
      '<circle class="overview-thumbnail-anchor" cx="' + xy.x + '" cy="' + xy.y + '" r="8" fill="' + color + '"/>' +
      '<rect class="overview-thumbnail-card" x="' + (tileX - 5) + '" y="' + (tileY - 5) + '" width="' + (width + 10) + '" height="' + (height + 40) + '" rx="14"/>' +
      '<svg class="overview-landmark-thumb" x="' + tileX + '" y="' + tileY + '" width="' + width + '" height="' + height + '" viewBox="' + thumb.tile.join(' ') + '" preserveAspectRatio="xMidYMid slice">' +
      '<image href="assets/xiamen-landmark-reference.png" x="0" y="0" width="1080" height="1440"/></svg>' +
      '<text class="overview-thumbnail-name" x="' + (tileX + width / 2) + '" y="' + (tileY + height + 25) + '" text-anchor="middle">' + escapeHtml(thumb.name) + '</text></g>';
  }

  function illustratedOverviewZones() {
    const zones = [
      [0, 1030, 500, 175, 110, 1030, 386],
      [1, 345, 656, 280, 203, 170, 461],
      [2, 863, 730, 390, 212, 1160, 875],
      [3, 899, 561, 300, 169, 1120, 430],
      [4, 797, 496, 172, 111, 679, 385]
    ];
    return zones.map(function (zone) {
      const dayIndex = zone[0];
      return '<g class="overview-day-zone' + (dayIndex === activeDay ? ' is-active' : '') + '" style="color:' + dayList[dayIndex].color + '" data-overview-day="' + dayIndex + '" role="button" tabindex="0" aria-label="查看' + dayList[dayIndex].label + ' ' + escapeHtml(dayList[dayIndex].name) + '当日路线">' +
        '<ellipse cx="' + zone[1] + '" cy="' + zone[2] + '" rx="' + zone[3] + '" ry="' + zone[4] + '"/>' +
        '<g class="overview-zone-label" transform="translate(' + zone[5] + ' ' + zone[6] + ')"><rect x="-56" y="-17" width="112" height="34" rx="17"/><text y="6" text-anchor="middle">' + dayList[dayIndex].label + ' · D' + dayIndex + '</text></g></g>';
    }).join('');
  }

  function renderOverview() {
    const target = document.getElementById('routeOverview');
    if (!target) return;
    const zoomDialog = document.getElementById('overviewMapDialog');
    const zoomCanvas = document.getElementById('overviewMapZoomCanvas');
    const groups = tools.overviewRoutes(data, { skipXmuDayKey: skipXmu ? dayList[2].key : null });
    const unique = new Map();
    groups.forEach(function (group, dayIndex) {
      group.points.forEach(function (point) {
        if (!unique.has(point.id)) unique.set(point.id, { point: point, color: dayList[dayIndex].color });
      });
    });
    const arrows = dayList.map(function (day, index) {
      return '<marker id="overview-arrow-' + index + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="' + day.color + '"/></marker>';
    }).join('');
    const zones = illustratedOverviewZones();
    const routeLines = illustratedOverviewRoute(groups);
    const markers = Array.from(unique.values()).map(function (item) { return illustratedOverviewMarker(item.point, item.color); }).join('');
    target.innerHTML = '<svg class="overview-map" viewBox="0 0 1536 1024" role="img" aria-labelledby="overview-map-title overview-map-desc">' +
      '<title id="overview-map-title">厦门五日游路线总览</title><desc id="overview-map-desc">厦门站、文灶酒店、鼓浪屿与厦门岛景点的大致地理位置。点击彩色日期圈查看当天线路。</desc>' +
      '<defs>' + arrows + '</defs>' +
      '<image class="overview-illustrated-base" href="assets/xiamen-overview-watercolor.png" x="0" y="0" width="1536" height="1024" preserveAspectRatio="xMidYMid meet"/>' +
      '<g class="overview-zone-layer">' + zones + '</g><g class="overview-route-layer">' + routeLines + '</g><g class="overview-point-layer">' + markers + '</g></svg>';
    target.insertAdjacentHTML('beforeend', '<button class="overview-map-zoom-button" type="button">放大查看完整地图 ↗</button>');
    function restoreMap() {
      const map = zoomCanvas && zoomCanvas.querySelector('svg');
      if (map) target.prepend(map);
    }
    function closeZoom() {
      restoreMap();
      if (zoomDialog && zoomDialog.open) zoomDialog.close();
    }
    const zoomButton = target.querySelector('.overview-map-zoom-button');
    if (zoomButton && zoomDialog && zoomCanvas) {
      zoomButton.addEventListener('click', function () {
        const map = target.querySelector('svg');
        if (!map) return;
        zoomCanvas.appendChild(map);
        zoomDialog.showModal();
      });
      document.getElementById('overviewMapClose').onclick = closeZoom;
      zoomDialog.onclose = restoreMap;
    }
    const zoneElements = Array.from(target.querySelectorAll('[data-overview-day]'));
    function select(dayIndex) {
      closeZoom();
      window.dispatchEvent(new CustomEvent('xiamen:map-daychange', {
        detail: { dayIndex: dayIndex, scrollIntoView: true }
      }));
    }
    zoneElements.forEach(function (zone) {
      function selectByPointer(event) {
        const zoneMetrics = zoneElements.map(overviewZoneMetrics);
        const dayIndex = nearestOverviewDay(zoneMetrics, event.clientX, event.clientY);
        select(dayIndex === null ? Number(zone.dataset.overviewDay) : dayIndex);
      }
      function selectByKeyboard(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(Number(zone.dataset.overviewDay));
        }
      }
      zone.addEventListener('click', selectByPointer);
      zone.addEventListener('keydown', selectByKeyboard);
    });
  }

  function routeForActiveDay() {
    return tools.routeForDay(data, dayList[activeDay].key, { skipXmu: skipXmu && activeDay === 2 });
  }

  function dayMapBase(viewName, dayIndex, crop) {
    if (viewName === 'main') {
      return cityLayers(scenicLayer(dayIndex, viewName, crop)) + '<rect class="overview-grid" width="720" height="900" fill="url(#day-grid-' + dayIndex + '-main)"/>';
    }
    return '<rect class="overview-water" width="360" height="500"/>' + paperTexture(360, 500) + '<path class="overview-water-lines" d="M12 98q32-12 64 0t64 0m184 34q32-12 64 0t64 0M18 412q32-12 64 0t64 0m166 42q32-12 64 0t64 0"/>' +
      '<path class="day-island-shadow" d="M125 24c56-11 113 25 143 74 29 47 38 99 14 144-14 26-22 43-15 70 10 39-7 80-43 112-40 36-105 54-154 27-50-28-59-90-43-140 10-33 32-50 19-86-19-53-2-122 39-164 14-15 26-30 40-37Z"/>' +
      '<path class="day-island-shore" d="M125 24c56-11 113 25 143 74 29 47 38 99 14 144-14 26-22 43-15 70 10 39-7 80-43 112-40 36-105 54-154 27-50-28-59-90-43-140 10-33 32-50 19-86-19-53-2-122 39-164 14-15 26-30 40-37Z"/>' + scenicLayer(dayIndex, viewName, crop) +
      '<path class="day-island-path" d="M188 77c-32 33-47 76-38 112 9 35 38 55 35 88-3 34-33 53-35 87-2 38 25 68 63 88m28-338c-31 33-43 74-36 110 7 36 32 55 28 87-4 32-28 53-27 83"/>' +
      '<path class="day-island-green" d="M107 276c24-17 50-13 58 4 8 16-6 29-26 30-22 1-43-14-39-26 1-3 3-6 7-8Zm136-134c18-12 37-8 42 4 5 12-6 22-21 22-16 0-30-10-28-19 1-3 3-5 7-7Z"/><text class="day-island-name" x="177" y="254">鼓浪屿</text><text class="day-island-note" x="179" y="275">慢行 · 留白 · 看海</text>' +
      '<rect class="overview-grid" width="360" height="500" fill="url(#day-grid-' + dayIndex + '-island)"/>';
  }

  function dayRouteMarkup(edges, viewName, bounds, viewport, dayIndex, color) {
    return edges.filter(function (edge) {
      const from = points.get(edge.from), to = points.get(edge.to);
      return edge.type === 'visit' && from && to && from.view === viewName && to.view === viewName;
    }).map(function (edge, index) {
      const from = geometry.projectPoint(points.get(edge.from), bounds, viewport);
      const to = geometry.projectPoint(points.get(edge.to), bounds, viewport);
      const bend = index % 2 ? 10 : -10;
      const cx = (from.x + to.x) / 2 + bend;
      const cy = (from.y + to.y) / 2 - bend;
      const path = 'M' + from.x + ' ' + from.y + ' Q' + cx + ' ' + cy + ' ' + to.x + ' ' + to.y;
      return '<path class="day-route-under" d="' + path + '"/><path class="day-route-line" d="' + path + '" stroke="' + color + '" marker-end="url(#day-arrow-' + dayIndex + '-' + viewName + ')"/>';
    }).join('');
  }

  function dayPointMarkup(point, order, bounds, viewport, viewName, dayIndex, color) {
    const position = geometry.projectPoint(point, bounds, viewport);
    const offset = labelOffsets[point.id] || [15, -16, 'start'];
    const label = '<text class="day-map-point-label" x="' + offset[0] + '" y="' + offset[1] + '" text-anchor="' + offset[2] + '">' + escapeHtml(point.name) + '</text>';
    let icon;
    if (point.locationType === 'hotel') {
      icon = '<circle class="day-map-landmark is-hotel" r="17"/><path class="day-map-house" d="M-9 0 0-8 9 0v9H3V2h-6v7h-6Z"/>';
    } else if (point.locationType === 'station') {
      icon = '<circle class="day-map-landmark is-station" r="17"/><path class="day-map-train" d="M-9-8h18v11a5 5 0 0 1-5 5h-8a5 5 0 0 1-5-5Zm4 4v5h10v-5Zm-2 15 4-6m10 6-4-6"/><circle class="day-map-train-window" cx="-3" cy="-2" r="1"/><circle class="day-map-train-window" cx="3" cy="-2" r="1"/>';
    } else {
      icon = '<circle class="day-map-scenic-pin" r="16" fill="' + color + '"/><text class="day-map-sequence-no" x="0" y="4" text-anchor="middle">' + String(order).padStart(2, '0') + '</text>';
    }
    const scenic = point.locationType !== 'hotel' && point.locationType !== 'station';
    return '<g class="day-map-point' + (scenic ? ' is-viewable' : ' is-landmark') + '" data-day-point-id="' + escapeHtml(point.id) + '"' +
      (scenic ? ' tabindex="0" role="button" aria-label="查看' + escapeHtml(point.name) + '实拍与详情"' : ' aria-label="' + escapeHtml(point.name) + '位置"') +
      ' data-map-view="' + viewName + '" transform="translate(' + position.x + ' ' + position.y + ')"><circle class="day-map-hit-area" r="30"/>' + icon + label + '</g>';
  }

  function dayMapSvg(viewName, edges, routePoints, dayIndex) {
    const bounds = viewName === 'island' ? data.islandBounds : data.mainBounds;
    const viewport = viewName === 'island' ? { width: 360, height: 500, padding: 46 } : view;
    const localPoints = routePoints.filter(function (point) { return point.view === viewName; });
    const crop = geometry.fitViewBox(localPoints, bounds, viewport, viewName === 'island'
      ? { paddingPx: 42, minWidth: 150, minHeight: 180 }
      : { paddingPx: 56, minWidth: 220, minHeight: 180 });
    const ids = tools.routePointIds(edges);
    const order = new Map(ids.map(function (id, index) { return [id, index + 1]; }));
    const color = dayList[dayIndex].color;
    const arrow = 'day-arrow-' + dayIndex + '-' + viewName;
    const grid = 'day-grid-' + dayIndex + '-' + viewName;
    const markers = localPoints.map(function (point) {
      return dayPointMarkup(point, order.get(point.id), bounds, viewport, viewName, dayIndex, color);
    }).join('');
    const mapsize = viewName === 'island' ? { width: 360, height: 500 } : { width: 720, height: 900 };
    const accessibleName = viewName === 'island' ? '鼓浪屿当日步行地图' : dayList[dayIndex].label + ' 厦门岛当日游玩地图';
    return '<svg class="day-map-svg ' + (viewName === 'island' ? 'island-map-svg' : 'main-map-svg') + '" viewBox="' +
      crop.x + ' ' + crop.y + ' ' + crop.width + ' ' + crop.height + '" role="img" aria-label="' + accessibleName + '">' +
      '<defs><pattern id="' + grid + '" width="' + (viewName === 'island' ? 24 : 34) + '" height="' + (viewName === 'island' ? 24 : 34) + '" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#ffffff" stroke-width="1" opacity=".3"/></pattern>' +
      '<marker id="' + arrow + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="' + color + '"/></marker></defs>' +
      dayMapBase(viewName, dayIndex, crop) + '<g class="day-map-route-layer">' + dayRouteMarkup(edges, viewName, bounds, viewport, dayIndex, color) + '</g>' +
      '<g class="day-map-points-layer">' + markers + '</g><text class="day-map-date-tag" x="' + (crop.x + 15) + '" y="' + (crop.y + 26) + '">' + dayList[dayIndex].label + ' · ' + escapeHtml(dayList[dayIndex].name) + '</text></svg>';
  }

  function bindDayPointEvents(target) {
    if (!target || typeof target.querySelectorAll !== 'function') return;
    target.querySelectorAll('.day-map-point.is-viewable').forEach(function (marker) {
      function open() { selectPoint(marker.dataset.dayPointId); }
      marker.addEventListener('click', open);
      marker.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });
  }

  function bindDetailPhoto(detail, point, image) {
    if (!image) return;
    image.addEventListener('error', function () {
      image.hidden = true;
      const fallback = detail.querySelector('.photo-unavailable');
      if (fallback) fallback.hidden = false;
    }, { once: true });
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', '放大查看：' + point.name + '实拍');
    function openPhoto() {
      const dialog = document.getElementById('photoDialog');
      const large = document.getElementById('largePhoto');
      const caption = document.getElementById('largeCaption');
      if (!dialog || !large || typeof dialog.showModal !== 'function') return;
      large.src = image.src;
      large.alt = image.alt;
      caption.textContent = point.name + ' · 实景照片';
      dialog.showModal();
    }
    image.addEventListener('click', openPhoto);
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPhoto(); }
    });
  }

  let activeEdges = [];
  let activePointIds = new Set();

  function selectPoint(pointId) {
    if (!activePointIds.has(pointId)) return false;
    const point = points.get(pointId);
    if (!point || point.locationType === 'hotel' || point.locationType === 'station') return false;
    const detail = document.getElementById('day-map-detail-' + activeDay);
    if (!detail) return false;
    const day = dayList[activeDay];
    const imagePath = window.SiteImages.resolveImagePath(point.photo);
    const precision = point.precision === 'approx' ? '位置近似标注' : '地图点位';
    detail.innerHTML = '<figure class="map-detail-photo"><img src="' + escapeHtml(imagePath) + '" alt="' + escapeHtml(point.name) + '景点实拍" loading="lazy"><span class="photo-unavailable" hidden>这张实拍图暂不可用</span><figcaption>' + escapeHtml(point.name) + ' · 实景照片 · 点图放大</figcaption></figure>' +
      '<div class="map-detail-copy"><span class="section-kicker">' + day.label + ' · 当日路线点</span><h3>' + escapeHtml(point.name) + '</h3><p class="map-detail-address">' + escapeHtml(point.address) + '</p><span class="map-location-quality">' + precision + '</span><p>' + escapeHtml(point.note) + '</p><span class="map-detail-hint">路线表示游玩先后，不代表步行导航轨迹。</span></div>';
    document.querySelectorAll('.day-map-point.is-viewable').forEach(function (marker) {
      marker.classList.toggle('is-selected', marker.dataset.dayPointId === pointId);
    });
    bindDetailPhoto(detail, point, typeof detail.querySelector === 'function' ? detail.querySelector('img') : null);
    return true;
  }

  function renderDay(dayIndex) {
    activeDay = Math.max(0, Math.min(dayList.length - 1, dayIndex));
    const edges = routeForActiveDay();
    const routePoints = tools.pointsForRoute(data, edges);
    const routeOrder = new Map(tools.routePointIds(edges).map(function (id, index) { return [id, index]; }));
    routePoints.sort(function (a, b) { return routeOrder.get(a.id) - routeOrder.get(b.id); });
    activeEdges = edges;
    activePointIds = new Set(tools.routePointIds(edges));
    const mainPoints = routePoints.filter(function (point) { return point.view === 'main'; });
    const islandPoints = routePoints.filter(function (point) { return point.view === 'island'; });
    const mainTarget = document.getElementById('day-map-' + activeDay);
    const islandTarget = document.getElementById('day-island-map-' + activeDay);
    const ferryTarget = document.getElementById('day-ferry-' + activeDay);
    const detail = document.getElementById('day-map-detail-' + activeDay);
    if (mainTarget) {
      mainTarget.hidden = mainPoints.length === 0;
      mainTarget.innerHTML = mainPoints.length ? dayMapSvg('main', edges, routePoints, activeDay) : '';
      bindDayPointEvents(mainTarget);
    }
    if (islandTarget) {
      islandTarget.hidden = islandPoints.length === 0;
      islandTarget.innerHTML = islandPoints.length ? dayMapSvg('island', edges, routePoints, activeDay) : '';
      bindDayPointEvents(islandTarget);
    }
    const ferryEdges = edges.filter(function (edge) { return edge.type === 'ferry'; });
    if (ferryTarget) {
      ferryTarget.hidden = ferryEdges.length === 0;
      ferryTarget.innerHTML = ferryEdges.map(function (edge) {
        const from = points.get(edge.from), to = points.get(edge.to);
        return '<span class="map-ferry-label">海上接驳</span><strong>' + escapeHtml(from.name) + '</strong><b class="map-ferry-time">10:30 开船</b><span class="map-ferry-arrow" aria-hidden="true">→</span><strong>' + escapeHtml(to.name) + '</strong>';
      }).join('');
    }
    const firstViewable = routePoints.find(function (point) {
      return point.locationType !== 'hotel' && point.locationType !== 'station';
    });
    if (detail) {
      if (firstViewable) selectPoint(firstViewable.id);
      else detail.innerHTML = '<div class="map-detail-empty"><span class="section-kicker">' + dayList[activeDay].label + ' · 当日路线</span><h3>到站与入住</h3><p>此日以交通和休息为主，没有安排景点打卡。</p></div>';
    }
    return { edges: edges, points: routePoints };
  }

  window.XiamenMapUI = {
    renderOverview: renderOverview,
    renderDay: renderDay,
    selectPoint: selectPoint,
    nearestOverviewDay: nearestOverviewDay,
    placeOverviewLabel: placeOverviewLabel,
    setSkipXmu: function (value) {
      skipXmu = Boolean(value);
      renderOverview();
      if (activeDay === 2) renderDay(activeDay);
    }
  };
  window.addEventListener('xiamen:daychange', function (event) {
    if (Number.isInteger(event.detail.dayIndex)) {
      activeDay = Math.max(0, Math.min(dayList.length - 1, event.detail.dayIndex));
      renderOverview();
      renderDay(activeDay);
    }
  });
  window.addEventListener('xiamen:xmu-toggle', function (event) {
    skipXmu = Boolean(event.detail.skipXmu);
    renderOverview();
    if (activeDay === 2) renderDay(activeDay);
  });
  renderOverview();
  renderDay(1);
})();
