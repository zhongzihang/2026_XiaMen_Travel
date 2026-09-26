(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.XiamenMapDataTools = api;
  root.XiamenMapData = api.data;
})(globalThis, function () {
  function validateMapData(data) {
    if (!data || !Array.isArray(data.points) || !data.routes || typeof data.routes !== 'object') {
      throw new TypeError('Map dataset must include points and routes');
    }
    const ids = new Set();
    for (const point of data.points) {
      if (!point.id || ids.has(point.id) || !point.name || !point.address || !point.mapUrl ||
          !Number.isFinite(point.lat) || !Number.isFinite(point.lng) ||
          !['entrance', 'pier', 'station', 'hotel', 'area'].includes(point.locationType) ||
          !['exact', 'approx'].includes(point.precision) || !['main', 'island'].includes(point.view)) {
        throw new TypeError('Map POI data is missing a field or contains a duplicate id');
      }
      ids.add(point.id);
    }
    for (const edges of Object.values(data.routes)) {
      if (!Array.isArray(edges)) throw new TypeError('Map routes must be arrays of typed edges');
      for (const edge of edges) {
        if (!ids.has(edge.from) || !ids.has(edge.to) || !['visit', 'ferry'].includes(edge.type)) {
          throw new TypeError('Map route references an unknown POI or route type');
        }
      }
    }
    return data;
  }

  function routePointIds(edges) {
    if (!Array.isArray(edges) || edges.length === 0) return [];
    return [...new Set([edges[0].from, ...edges.map(edge => edge.to)])];
  }

  function pointsForRoute(data, edges) {
    const ids = new Set(routePointIds(edges));
    return data.points.filter(point => ids.has(point.id));
  }

  function routeForDay(data, dayKey, { skipXmu = false } = {}) {
    const edges = [...(data.routes[dayKey] || [])];
    if (!skipXmu) return edges;
    const closesAtStart = edges.length > 0 && edges[edges.length - 1].to === edges[0].from;
    const ids = routePointIds(edges).filter(id => id !== 'xmu');
    if (closesAtStart && ids.length > 1) ids.push(ids[0]);
    return ids.slice(1).map((to, index) => ({ from: ids[index], to, type: 'visit' }));
  }

  function overviewRoutes(data, { skipXmuDayKey = null } = {}) {
    return Object.entries(data.routes).map(([dayKey]) => {
      const edges = routeForDay(data, dayKey, { skipXmu: dayKey === skipXmuDayKey });
      return { dayKey, edges, points: pointsForRoute(data, edges) };
    });
  }

  const days = {
    arrival: '2026-09-30', island: '2026-10-01', coast: '2026-10-02', green: '2026-10-03', return: '2026-10-04'
  };
  const data = {
    mainBounds: { north: 24.49, south: 24.42, east: 118.125, west: 118.065 },
    islandBounds: { north: 24.452, south: 24.435, east: 118.075, west: 118.064 },
    points: [
      { id: 'hotel', name: '文灶住宿', lat: 24.467405, lng: 118.103464, address: '厦门市思明区湖滨中路7号', mapUrl: 'https://ditu.amap.com/place/B025003TAE', locationType: 'hotel', precision: 'approx', days: [days.arrival, days.island, days.coast, days.green, days.return], photo: 'assets/gallery/hotel-2.jpg', note: '夏商·怡翔酒店（厦门中山路文灶地铁站店）。10月4日退房时带上行李，游览后直接前往厦门站。', view: 'main' },
      { id: 'station', name: '厦门站', lat: 24.467462, lng: 118.115895, address: '厦门市思明区厦禾路900号', mapUrl: 'https://ditu.amap.com/place/B0250043J1', locationType: 'station', precision: 'exact', days: [days.arrival, days.return], photo: 'assets/gallery/station-exterior-new.jpg', note: '进站口以车票和现场指引为准。10月4日建议约15:00到站。', view: 'main' },
      { id: 'dongdu', name: '东渡客运码头', lat: 24.481389, lng: 118.076198, address: '厦门市湖里区东港路2号厦门国际邮轮中心', mapUrl: 'https://ditu.amap.com/place/B02500QI9H', locationType: 'pier', precision: 'approx', days: [days.island], photo: 'assets/gallery/dongdu-1.jpg', note: '从国际邮轮中心游客候船厅乘船，入口请以船票及现场标识为准。', fallbackPhoto: '', view: 'main' },
      { id: 'sanqiutian', name: '三丘田码头', lat: 24.449775, lng: 118.069014, address: '厦门市思明区延平路199号', mapUrl: 'https://ditu.amap.com/place/B02500T5B2', locationType: 'pier', precision: 'exact', days: [days.island], photo: 'assets/gallery/sanqiutian-official.jpg', note: '10月1日10:30船票的抵达码头。', fallbackPhoto: '', view: 'island' },
      { id: 'longtou', name: '龙头路', lat: 24.444692, lng: 118.070331, address: '厦门市思明区鼓浪屿晃岩路35-6号一带', mapUrl: 'https://ditu.amap.com/place/B0FFIPTZG7', locationType: 'area', precision: 'approx', days: [days.island], photo: 'new_gulangyu_houses.jpg', note: '高德小吃街点位附近的街区代表点，巷内店铺分布较密。', view: 'island' },
      { id: 'shuzhuang', name: '菽庄花园', lat: 24.439035, lng: 118.06952, address: '厦门市思明区晃岩路35-6号', mapUrl: 'https://ditu.amap.com/place/B0250043TN', locationType: 'entrance', precision: 'exact', days: [days.island], photo: 'shuzhuang.jpg', note: '四十四桥与海边园林适合慢走拍照。', view: 'island' },
      { id: 'rock', name: '日光岩', lat: 24.44227, lng: 118.06847, address: '厦门市思明区鼓浪屿晃岩路62-64号', mapUrl: 'https://ditu.amap.com/place/B0FFFRKMS0', locationType: 'entrance', precision: 'exact', days: [days.island], photo: 'sunlight_rock.jpg', note: '高处视野开阔；登顶排队较长时可改为海边慢走。', view: 'island' },
      { id: 'zhongshan', name: '中山路步行街', lat: 24.455453, lng: 118.079259, address: '厦门市思明区中山路56号一带', mapUrl: 'https://ditu.amap.com/place/B025003IUP', locationType: 'area', precision: 'exact', days: [days.green], photo: 'zhongshan_road.jpg', note: '10月3日晚餐与骑楼街区夜逛。', view: 'main' },
      { id: 'yujian', name: '屿见闽南主题景区', lat: 24.4865, lng: 118.079, address: '厦门市湖里区东港北路15、17—19号', mapUrl: 'https://ditu.amap.com/search?query=%E5%B1%BF%E8%A7%81%E9%97%BD%E5%8D%97%E4%B8%BB%E9%A2%98%E6%99%AF%E5%8C%BA', locationType: 'area', precision: 'approx', days: [days.coast], photo: 'assets/gallery/yujian-1.jpg', note: '10月2日雨天室内备选，演出与营业时段请按当日景区信息安排。', view: 'main' },
      { id: 'nanputuo', name: '南普陀寺', lat: 24.442641, lng: 118.097143, address: '厦门市思明区思明南路515号', mapUrl: 'https://ditu.amap.com/place/B025003QZU', locationType: 'entrance', precision: 'exact', days: [days.coast], photo: 'assets/gallery/nanputuo-1.jpg', note: '上午优先入寺，入寺礼仪与开放安排以现场为准。', view: 'main' },
      { id: 'xmu', name: '厦门大学', lat: 24.43713, lng: 118.09351, address: '厦门市思明区思明南路422号（西门附近）', mapUrl: 'https://ditu.amap.com/place/B025001G0C', locationType: 'entrance', precision: 'exact', days: [days.coast], photo: 'xmu_west_gate.jpg', note: '只有摇号/预约成功且入校时段合适才入校；否则走白城—演武—沙坡尾备选线。', view: 'main' },
      { id: 'baicheng', name: '白城沙滩', lat: 24.432281, lng: 118.100875, address: '厦门市思明区大学路', mapUrl: 'https://ditu.amap.com/place/B0FFF0DUAW', locationType: 'area', precision: 'exact', days: [days.coast], photo: 'new_baicheng.jpg', note: '南普陀与厦大之后沿海岸走，注意防晒与潮水。', view: 'main' },
      { id: 'shapowei', name: '沙坡尾避风坞', lat: 24.437578, lng: 118.087596, address: '厦门市思明区沙坡尾艺术西区东侧', mapUrl: 'https://ditu.amap.com/place/B0HK94XSHB', locationType: 'area', precision: 'exact', days: [days.coast], photo: 'shapowei.jpg', note: '避风坞与大学路街区；部分素材为历史影像，照片说明会注明。', view: 'main' },
      { id: 'heping', name: '和平码头（夜游）', lat: 24.449651, lng: 118.07805, address: '厦门市思明区鹭江道3号', mapUrl: 'https://ditu.amap.com/place/B02500QK38', locationType: 'pier', precision: 'approx', days: [days.coast], photo: 'assets/gallery/heping-cruise-1.jpg', note: '约20:05到码头附近看夜景，约20:20进入检票区候船；具体登船口和20:50班次以订单为准。', view: 'main' },
      { id: 'botanic', name: '园林植物园西门片区', lat: 24.4508, lng: 118.0938, address: '厦门市思明区虎园路25号西门', mapUrl: 'https://ditu.amap.com/place/B025003OPX', locationType: 'entrance', precision: 'approx', days: [days.green], photo: 'rainforest_commons.jpg', note: '西门入口约标在植物园官方方位与高德园区点附近；当日按西门入园。', view: 'main' },
      { id: 'cable', name: '钟鼓索道', lat: 24.452775, lng: 118.094162, address: '厦门市思明区虎园路25-110号', mapUrl: 'https://ditu.amap.com/place/B02500SK4B', locationType: 'entrance', precision: 'exact', days: [days.green], photo: 'https://dimg04.c-ctrip.com/images/1mh3912000igwjddsF020_W_640_10000.jpg?proc=autoorient', note: '16:00—17:00入场时段；天气和排队会影响实际乘坐与观景。', fallbackPhoto: '', view: 'main' },
      { id: 'bashi', name: '第八市场（八市）', lat: 24.457902, lng: 118.075017, address: '厦门市思明区开禾路44号', mapUrl: 'https://ditu.amap.com/place/B0JG9C6ZWG', locationType: 'area', precision: 'exact', days: [days.island, days.green], photo: 'assets/gallery/bashi-night-new.jpg', note: '10月1日晚餐与10月3日沿途逛吃；市场消费先确认计价单位和加工费。', fallbackPhoto: '', view: 'main' },
      { id: 'baijia', name: '百家村 / 华新路', lat: 24.459, lng: 118.0886, address: '厦门市思明区光荣路18号一带', mapUrl: 'https://ditu.amap.com/search?query=%E5%8E%A6%E9%97%A8%E5%B8%82%E6%80%9D%E6%98%8E%E5%8C%BA%E7%99%BE%E5%AE%B6%E6%9D%91', locationType: 'area', precision: 'approx', days: [days.return], photo: 'new_baijia_village.jpg', note: '老城步行片区约标在街区附近，不代表某幢住宅或唯一入口。', view: 'main' }
    ],
    routes: {
      [days.arrival]: [{ from: 'station', to: 'hotel', type: 'visit' }],
      [days.island]: [
        { from: 'hotel', to: 'dongdu', type: 'visit' }, { from: 'dongdu', to: 'sanqiutian', type: 'ferry' },
        { from: 'sanqiutian', to: 'longtou', type: 'visit' }, { from: 'longtou', to: 'shuzhuang', type: 'visit' },
        { from: 'shuzhuang', to: 'rock', type: 'visit' }, { from: 'rock', to: 'sanqiutian', type: 'visit' },
        { from: 'sanqiutian', to: 'bashi', type: 'ferry' }
      ],
      [days.coast]: [
        { from: 'hotel', to: 'nanputuo', type: 'visit' }, { from: 'nanputuo', to: 'xmu', type: 'visit' },
        { from: 'xmu', to: 'baicheng', type: 'visit' }, { from: 'baicheng', to: 'shapowei', type: 'visit' },
        { from: 'shapowei', to: 'heping', type: 'visit' }, { from: 'heping', to: 'hotel', type: 'visit' }
      ],
      [days.green]: [
        { from: 'hotel', to: 'botanic', type: 'visit' }, { from: 'botanic', to: 'cable', type: 'visit' },
        { from: 'cable', to: 'bashi', type: 'visit' }, { from: 'bashi', to: 'zhongshan', type: 'visit' },
        { from: 'zhongshan', to: 'hotel', type: 'visit' }
      ],
      [days.return]: [
        { from: 'hotel', to: 'baijia', type: 'visit' },
        { from: 'baijia', to: 'station', type: 'visit' }
      ]
    },
    rainRoutes: {
      [days.coast]: [
        { from: 'hotel', to: 'yujian', type: 'visit' },
        { from: 'yujian', to: 'heping', type: 'visit' }
      ]
    }
  };
  validateMapData(data);
  return { validateMapData, routeForDay, routePointIds, pointsForRoute, overviewRoutes, data };
});
