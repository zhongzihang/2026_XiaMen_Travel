(function () {
  'use strict';
  // Planning ranges, not live traffic ETAs. Walking excludes visits and stops;
  // taxi excludes waiting, and metro includes access/egress walking.
  const legs = {
    'station-hotel': { mode: 'taxi', time: '10–20 分钟', path: '厦门站出站后，按正规出租车 / 网约车指引前往湖滨中路文灶住宿。带行李时优先打车。', alternative: '轻装可沿厦禾路向文灶步行，约 25–35 分钟。' },
    'hotel-dongdu': { mode: 'taxi', time: '20–35 分钟', path: '上车目的地选“东渡客运码头（厦门国际邮轮中心）”，下车后按游客候船厅指引步行。', alternative: '目标 09:35 到码头；国庆叫车与堵车建议另留 20–30 分钟，10:30 开船。' },
    'dongdu-sanqiutian': { mode: 'ferry', time: '约 20 分钟', path: '东渡客运码头 → 鼓浪屿三丘田码头，乘坐已订的 10:30 航班。', alternative: '这里只计航行；安检、候船与下船另留时间。' },
    'sanqiutian-longtou': { mode: 'walk', time: '20–30 分钟', path: '从三丘田码头沿岛上路牌走向龙头路街区，可顺路经过建筑街巷。', alternative: '最美转角拍照、巷内闲逛和排队时间另算。' },
    'longtou-shuzhuang': { mode: 'walk', time: '15–20 分钟', path: '从龙头路沿街巷向南，按“菽庄花园 / 港仔后海滨浴场”指引走到花园入口。' },
    'shuzhuang-rock': { mode: 'walk', time: '10–15 分钟', path: '离开菽庄花园后沿晃岩路一带走到日光岩景区入口。', alternative: '步行时间到入口为止，登顶和景区排队另算。' },
    'rock-sanqiutian': { mode: 'walk', time: '25–35 分钟', path: '日光岩出园后向北返回三丘田码头，按现场返程航线指引候船。', alternative: '17:20 左右到码头，按返程船票核对目的地。' },
    'sanqiutian-bashi': { mode: 'ferry', time: '20–50 分钟', path: '按返程船票从三丘田乘船返厦，再去开禾路八市吃晚餐。地图把轮渡和岸上接驳合成一段。', alternative: '上岸厦门轮渡码头可步行或短程打车；若回东渡，再打车或地铁接驳。候船与国庆路况时间另计。' },
    'hotel-nanputuo': { mode: 'taxi', time: '20–35 分钟', path: '从文灶打车到南普陀寺附近允许上下客的位置，再步行到入口。', alternative: '思明南路国庆可能拥堵或限行，下车后按现场指引步行。' },
    'nanputuo-xmu': { mode: 'walk', time: '5–10 分钟', path: '从南普陀寺步行至相邻的厦大西门片区；实际入校口和入校时段按预约通知。', alternative: '未获准入校时，点击上方按钮切换为白城备选路线。' },
    'xmu-baicheng': { mode: 'walk', time: '30–45 分钟', path: '获准入校后按校方开放动线前往白城方向，出校后到白城沙滩。', alternative: '仅计移动；校园游览另留时间。无法穿校时走校外大学路，约 25–35 分钟。' },
    'nanputuo-baicheng': { mode: 'walk', time: '25–35 分钟', path: '不入校：从南普陀沿校外道路接大学路，到白城沙滩，不从校园穿行。', alternative: '天气热时可在允许停靠处短程打车，车程约 10–15 分钟，另加叫车与步行时间。' },
    'baicheng-shapowei': { mode: 'walk', time: '25–35 分钟', path: '沿白城—演武大桥观景平台—大学路方向走到沙坡尾避风坞。', alternative: '这是连续步行参考；演武观景平台拍照停留另加约 30 分钟。' },
    'shapowei-heping': { mode: 'walk', time: '20–30 分钟', path: '从沙坡尾沿大学路、民族路一带前往鹭江道和平码头片区。', alternative: '夜游登船口按订单核对；走累了可短程打车约 10–15 分钟，另计等车。' },
    'hotel-yujian': { mode: 'taxi', time: '20–35 分钟', path: '雨天从文灶住宿打车去东港北路的屿见闽南主题景区，室内看演艺与闽南街区。', alternative: '景区开放与演出时段以当日公告为准。' },
    'yujian-heping': { mode: 'taxi', time: '20–35 分钟', path: '从景区或海上世界片区吃过晚餐后，打车到和平码头附近，约20:05沿鹭江道看夜景。', alternative: '约20:20到检票区，20:50鹭江夜游；若天气导致停航，以游船通知为准。' },
    'heping-hotel': { mode: 'metro', time: '30–40 分钟', path: '步行到镇海路站 → 地铁 1 号线往岩内方向 → 文灶站 → 步行回住宿。', alternative: '夜游结束较晚时查当天末班车；改打车约 15–25 分钟。' },
    'hotel-botanic': { mode: 'metro', time: '20–30 分钟', path: '步行到文灶站 → 地铁 1 号线往镇海路方向 → 中山公园站 3B 口 → 步行约 500 米至植物园西门。', alternative: '不想步行接驳可打车，车程约 10–20 分钟。' },
    'botanic-cable': { mode: 'walk', time: '5–10 分钟', path: '植物园游览后从西门出园，步行到相邻的钟鼓索道下站。午休后仍在这片区等候入场。', alternative: '不含园内移动与游览；建议 16:00—16:30 到索道入口，使用 16:00—17:00 时段票。' },
    'cable-bashi': { mode: 'taxi', time: '15–25 分钟', path: '索道往返后回下站，打车到八市 / 开禾路附近允许停靠的位置，再步行入街。', alternative: '轻装可经老城街巷步行，约 35–45 分钟。' },
    'bashi-zhongshan': { mode: 'walk', time: '10–15 分钟', path: '逛完八市后沿老城街巷向南步行至中山路步行街，安排晚餐与夜逛。', alternative: '市场小巷内不便上车，步行到开禾路等外围道路再接驳。' },
    'hotel-baijia': { mode: 'taxi', time: '10–20 分钟', path: '约10:00—11:00退房并带齐行李，打车到百家村 / 华新路片区。', alternative: '行李较多时只选平缓的一段街巷散步，午餐后不回酒店。' },
    'baijia-station': { mode: 'taxi', time: '15–25 分钟', path: '百家村附近午餐后，约14:15打车直达厦门站，按车票选择进站口。', alternative: '目标约15:00到站；节日叫车、路况和安检留足缓冲。' },
    'hotel-station': { mode: 'taxi', time: '10–20 分钟', path: '取好行李后，打车到厦门站，按车票和现场标识选择进站口。', alternative: '14:30 左右出发，目标 15:00 到站；16:33 发车。' }
  };
  window.XiamenTransit = {
    legs,
    modes: { walk: '步行', taxi: '打车', metro: '地铁 + 步行', ferry: '轮渡' },
    notes: [
      '到站后先办理入住；首晚交通以少换乘、少搬行李为主。',
      '返厦后去八市晚餐；上岸码头和接驳方式按返程船票确认，轮渡、候船和路况耗时另算。',
      '09:30从文灶出发，11:00厦大以预约结果决定是否入校，12:30午餐。沙坡尾晚餐后约20:05到和平码头附近看夜景，约20:20候船，20:50参加已确定的鹭江夜游。',
      '植物园内按“西门 → 雨林世界 → 多肉区 → 西门”游览，乘索道后先逛八市，再去中山路晚餐；园内运营以园方为准。',
      '10:00—11:00睡到自然醒并退房，带行李去百家村；午餐后直接去厦门站。'
    ],
    rainNote: '雨天将海岸步行改为屿见闽南室内景区。晚餐后前往和平码头；若夜游因天气停航，按游船通知调整。',
    sources: [
      { title: '轮渡航线与返程安排', url: 'https://www.xmferry.com/chjdh/wshlk/' },
      { title: '东渡—三丘田航程', url: 'https://www.xmferry.com/hxjpj/yk/hx/21069.htm' },
      { title: '轮渡码头—三丘田夜间航程', url: 'https://xmferry.com/hxjpj/yk/hx/21036.htm' },
      { title: '植物园官方入口交通', url: 'https://www.xiamenbg.cn/Home/newsDetail?newsId=8763&typeId=0' }
    ]
  };
})();
