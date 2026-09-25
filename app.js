const A = "assets/";

const days = [
  {
    date: "9.30", weekday: "周三", short: "抵达文灶", detail: "晚抵达，少折腾", label: "DAY 0 / 抵达",
    title: "厦门站落地，把第一晚留给休息", summary: "19:49 到厦门站后前往文灶酒店。吃一顿热食即可，不为打卡跨城。",
    badge: "晚间轻量", route: [
      {time:"15:55",place:"深圳北",hint:"D672 出发",leg:"动车 3时54分"},
      {time:"19:49",place:"厦门站",hint:"出站后按平台指引乘车",leg:"短程车 / 步行"},
      {time:"20:20",place:"文灶酒店",hint:"办理入住、放下行李",leg:"街区内"},
      {time:"20:45",place:"附近晚餐",hint:"沙茶面或肉粽，按体力选择"}
    ], schedule:[
      ["19:49","到达厦门站","国庆前夜出站与叫车可能较慢，跟随正规网约车指引。"],
      ["20:20","抵达文灶","住宿：夏商·怡翔酒店（厦门中山路文灶地铁站店）。"],
      ["20:45","就近晚餐","可去金榜一带吃沙茶面；如果排队太长，以酒店周边热食为主。"],
      ["22:00","整理登岛随身物品","身份证、船票信息、充电宝、防晒、水和轻便雨具。"]
    ], photos:[
      ["zhongshan_road.jpg","厦门老城夜色 · 中山路实拍"]
    ], note:"首晚以入住和休息为主。动车票原图放在当天行程里，出站后从厦门站前往文灶片区。",
    transport:{kind:"rail",title:"D672 · 深圳北 → 厦门站",detail:"9月30日 15:55 发车，19:49 抵达。",ticket:"train-outbound-original.jpg",caption:"去程动车票原图",alt:"9月30日D672深圳北15:55发车、厦门站19:49抵达的动车票原图"}
  },
  {
    date: "10.01", weekday: "周四", short: "鼓浪屿", detail: "东渡 10:30 开船", label: "DAY 1 / 海岛",
    title: "鼓浪屿白天慢走，返岛后按码头安排晚间", summary: "三丘田码头上岛后，沿北侧街巷向南走，到菽庄花园与日光岩，再回码头。返厦码头与班次按返程票确认；若抵达厦门轮渡码头，可顺路接中山路夜景。",
    badge: "10:30 开船", route:[
      {time:"09:35",place:"东渡码头",hint:"提前安检、候船",leg:"轮渡约 20 分"},
      {time:"10:50",place:"三丘田码头",hint:"从北侧登岛",leg:"步行 10 分"},
      {time:"11:05",place:"最美转角",hint:"排长队直接跳过",leg:"步行 15 分"},
      {time:"11:40",place:"龙头路",hint:"鱼丸汤与午餐",leg:"步行约 20 分"},
      {time:"13:20",place:"菽庄花园",hint:"四十四桥与海景",leg:"步行约 15 分"},
      {time:"15:15",place:"日光岩",hint:"登高看海岛",leg:"回三丘田码头"},
      {time:"19:00",place:"中山路",hint:"返岛晚餐与夜逛"}
    ], schedule:[
      ["09:05","从文灶出发","国庆路况有不确定性，目标约09:35到东渡客运码头。"],
      ["10:30","东渡 → 三丘田码头","按订单所示码头和登船时段乘船，随身携带身份证。"],
      ["11:00","最美转角—建筑街巷","从三丘田码头向南走，热门拍照点排队长就跳过。"],
      ["12:00","龙头路附近午餐","鱼丸汤、麻糍或简餐，先补水休息，不为单店久排。"],
      ["13:20","菽庄花园","走四十四桥、看海景，留约60—75分钟。"],
      ["15:15","日光岩","避开正午曝晒；登顶队伍太长就改成海边慢走。"],
      ["17:20","回到返程码头候船","按返程票面核对码头与班次，预留排队时间。"],
      ["19:00","晚餐与夜间安排","若抵达厦门轮渡码头，可逛中山路；其他码头则就近吃饭或回文灶休息。"]
    ], photos:[
      ["sunlight_rock.jpg","日光岩 · 鼓浪屿地标实拍"],
      ["shuzhuang.jpg","菽庄花园 · 藏海园林"],
      ["new_gulangyu_houses.jpg","鼓浪屿建筑街景实拍"]
    ], note:"轻量走法：只走建筑街巷、菽庄和海边，日光岩按体力决定。晚上根据返厦码头调整；鹭江夜游安排在10月2日，不与鼓浪屿客运混作一条船线。",
    transport:{kind:"ferry",title:"东渡客运码头 → 三丘田码头",detail:"10月1日 10:30 出发。建议09:35左右到东渡，预留安检与候船时间；返程码头和班次以返程票为准。"}
  },
  {
    date: "10.02", weekday: "周五", short: "人文海岸", detail: "南普陀 → 沙坡尾", label: "DAY 2 / 人文海岸",
    title: "南普陀与海岸线，晚上从海上看厦门", summary: "厦大能否入校决定白天的走法；无论是否入校，下午都在白城—演武—沙坡尾收尾，晚餐后去和平码头夜游鹭江。",
    badge: "约 5—7 km", route:[
      {time:"08:30",place:"南普陀",hint:"寺院与山门",leg:"步行"},
      {time:"10:00",place:"厦大思明",hint:"按入校时段调整",leg:"步行"},
      {time:"13:30",place:"白城沙滩",hint:"海边慢走",leg:"步行"},
      {time:"15:00",place:"演武观景台",hint:"看双子塔和桥",leg:"步行"},
      {time:"16:00",place:"沙坡尾",hint:"避风坞与大学路晚餐",leg:"短程车 / 步行"},
      {time:"19:30",place:"和平码头",hint:"鹭江夜游，航班以订单为准"}
    ], schedule:[
      ["08:20","酒店 → 南普陀","早点到寺院，避开人流和正午热度。"],
      ["10:00","厦大思明校区（视摇号）","入校成功且时段合适再进校；未成功就直接走白城—演武—沙坡尾，不在校门口等待。"],
      ["12:30","大学路周边午餐","芋包、海蛎汤或清淡简餐，稍作休息。"],
      ["13:40","白城沙滩","沿海散步，注意防晒；天气炎热时可以缩短停留。"],
      ["15:00","演武大桥观景平台","桥下拍海面和双子塔，留约30分钟。"],
      ["16:00","沙坡尾避风坞","看老港与新街，晚餐放在大学路一带。"],
      ["19:00","前往和平码头","若预订鹭江夜游，按订单码头与开航时间提前到场，夜航受天气影响。"]
    ], photos:[
      ["nanputuo.jpg","南普陀寺实拍"],
      ["xmu_west_gate.jpg","厦门大学思明校区西门实拍"],
      ["new_baicheng.jpg","白城沙滩 · 实拍旧照"],
      ["shapowei.jpg","沙坡尾避风坞 · 历史影像"]
    ], note:"厦大没入校资格也不用等：南普陀 → 大学路午餐 → 白城 → 演武观景台 → 沙坡尾。若厦大入校时段在下午，白城或演武二选一即可。鹭江夜游走和平码头一带，与鼓浪屿客运轮渡不同，码头与开航时间按订单确认。",
    transport:{kind:"cruise",title:"鹭江夜游 · 和平码头片区",detail:"安排在沙坡尾晚餐后。登船位置、开航时间及天气影响以游船当日信息为准。"}
  },
  {
    date: "10.03", weekday: "周六", short: "山海绿意", detail: "植物园 + 钟鼓索道", label: "DAY 3 / 山海绿意",
    title: "植物园先看雨林，16:00—17:00 乘钟鼓索道", summary: "植物园西门与索道下站相邻。上午走雨林和多肉，午后在附近休息，再回同一片区乘索道，不跨城折返。",
    badge: "早进园", route:[
      {time:"08:30",place:"植物园西门",hint:"沿主路入园",leg:"园内步行"},
      {time:"09:30",place:"雨林世界",hint:"雾森与栈道",leg:"园内步行"},
      {time:"10:45",place:"多肉区",hint:"巨型仙人掌",leg:"出园 + 午休"},
      {time:"15:40",place:"钟鼓索道",hint:"16:00—17:00 入场时段",leg:"短程车"},
      {time:"18:00",place:"八市周边",hint:"五香 / 满煎糕 / 晚餐"}
    ], schedule:[
      ["08:00","从文灶出发","植物园西门入园更顺。园区坡道多，鞋要舒适。"],
      ["09:30","雨林世界雾森","喷雾时段可能随季节和节日调整，出发前看园区当日公告；木栈道湿滑，镜头注意防潮。"],
      ["10:45","多肉植物区","遮阴较少，拍照后及时补水，返回西门。"],
      ["12:15","西门附近午餐与休息","植物园和索道下站就在同一片区，下午不要安排远处景点。"],
      ["15:40","回钟鼓索道入口","持16:00—17:00时段票，给检票和排队留余量；雷雨、大风可能停运。"],
      ["16:00","钟鼓索道往返","10月3日日落约17:53，乘坐时更可能看到傍晚柔光，不能保证看到太阳落下。"],
      ["18:00","八市 / 中山路晚餐","市场摊位可能早收，晚餐以周边仍营业的门店为主。"]
    ], photos:[
      ["rainforest_commons.jpg","植物园雨林世界实拍"],
      ["cacti_commons.jpg","植物园多肉植物区实拍"]
    ], note:"西门进园、西门出园，雨林世界与多肉区连走。索道16:00—17:00是入场时段，不代表17:00以后仍在缆车上；是否遇上日落光线受排队与天气影响。",
    transport:{kind:"cable",title:"钟鼓索道 · 16:00—17:00时段",detail:"建议15:40左右回到索道入口。日落景色受排队、天气与运营影响；雷雨和大风时留意当日通知。"}
  },
  {
    date: "10.04", weekday: "周日", short: "老城返程", detail: "华新路 → 厦门站", label: "DAY 4 / 老城返程",
    title: "幸福路与华新路慢走，留足返程缓冲", summary: "半日 Citywalk 不跨远距离，午后回文灶取行李，建议15:00左右抵达厦门站。",
    badge: "16:33 返程", route:[
      {time:"09:30",place:"文灶酒店",hint:"退房、寄存行李",leg:"短程车 / 步行"},
      {time:"10:00",place:"百家村",hint:"老街与街角",leg:"步行"},
      {time:"10:45",place:"幸福路",hint:"慢走居民街区",leg:"步行"},
      {time:"11:30",place:"华新路",hint:"红砖别墅与花鸟市场",leg:"回酒店"},
      {time:"15:00",place:"厦门站",hint:"候乘 D2387"}
    ], schedule:[
      ["09:30","退房、寄存行李","贵重物品随身。先向酒店确认寄存安排。"],
      ["10:00","百家村—幸福路","以老城街巷为主，不把最后半天排成远郊行程。"],
      ["11:30","华新路","看红砖别墅与花鸟市场；居民街区请轻声、不占道拍照。"],
      ["12:20","午餐","烧肉粽、沙茶面或轻食，选不需要久排的店。"],
      ["13:30","回酒店取行李","核对身份证、车票、充电宝、伴手礼。"],
      ["14:30","前往厦门站","节日交通与进站队列留弹性；建议15:00左右到站。"],
      ["16:33","D2387 返深","19:55 到深圳北。"]
    ], photos:[
      ["new_baijia_village.jpg","百家村老宅实拍"],
      ["zhongshan_road.jpg","厦门老城骑楼夜景实拍"]
    ], note:"若雨大或前几天体力不足，取消 Citywalk；在文灶附近吃午餐、休息后直接去厦门站。返程动车票原图放在当天行程里。",
    transport:{kind:"rail",title:"D2387 · 厦门站 → 深圳北",detail:"10月4日 16:33 发车，19:55 抵达。建议约15:00到厦门站，节假日给进站留缓冲。",ticket:"train-return-original.jpg",caption:"返程动车票原图",alt:"10月4日D2387厦门站16:33发车、深圳北19:55抵达的动车票原图"}
  }
];

const foods = [
  {
    id:"alian",area:"八市",category:"海鲜大餐",name:"阿莲海鲜加工（八市海鲜地标店）",address:"厦门市思明区开禾路46-101号（八市中段）",
    image:"https://ak-d.tripcdn.com/images/1mi0h12000rgysghlBB69_W_640_0_R5_Q80.jpg?proc=source%2Ftrip",imageAlt:"阿莲海鲜加工游客近期到店菜品实拍",photoLabel:"近期到店菜式实拍",
    summary:"现挑现做的海鲜排档，适合把逛八市和晚餐排在一起。热门时段人多，早些去更从容。",
    dishes:["蒜蓉粉丝蒸波龙：蒜汁和虾汁浸入粉丝，主菜与主食一次兼顾。","姜葱炒蟹：姜葱香提鲜，适合两人分食。","避风塘富贵虾 / 清蒸石斑：按当天鲜货与价签挑一份。"],
    pair:"两人点单：波龙或螃蟹二选一，再加青菜/炒面线；先确认按只、按斤还是套餐，以及加工费。",
    tip:"这是八市内的现做海鲜店，饭点容易等位；吃完可接中山路夜逛。海鲜品种与价格以当日水牌为准。",
    source:"https://hk.trip.com/moments/detail/xiamen-21-141678916/"
  },
  {
    id:"ayu",area:"八市",category:"海鲜大餐",name:"阿玉海鲜加工（八市店）",address:"厦门市思明区开禾路73号（八市中段）",
    image:"https://ak-d.tripcdn.com/images/1mi4m12000fw09o9391F3.jpg?proc=source%2Ftrip",imageAlt:"八市游客实拍蒜蓉粉丝蒸扇贝，供阿玉菜式参考；非阿玉门店照片",photoLabel:"八市游客实拍参考 · 阿玉原帖可看店图",
    summary:"近期食客记录了小青龙、皮皮虾与梭子蟹，适合先逛八市，再按当日鲜货选一份主菜共享。",
    dishes:["小青龙：食客提到现场挑选，具体规格和做法到店看当天鲜货。","梭子蟹：先确认品种、重量、总价与做法，再决定是否点。","皮皮虾：作为第二道海鲜份量较合适，价格以现场价牌为准。"],
    pair:"两人点单：龙虾与蟹先二选一，称重确认总价；再补一份贝类或青菜和主食。",
    tip:"照片是八市海鲜菜式参考图，不冒充阿玉门店照片。海鲜规格和价格每天变化，现场看鲜货与价牌后再下单。",
    source:"https://www.xiaohongshu.com/search_result/6ab389e7000000000a024489?xsec_token=ABEJO8fLKVIV5m9SwRTh2zfxQf2Zxg147PHaTS2iCetLc=&xsec_source=",sourceLabel:"打开近期到店实拍图 ↗",showPhotoLink:true
  },
  {
    id:"aming",area:"八市",category:"海鲜大餐",name:"阿明海鲜加工（八市中段）",address:"厦门市思明区开禾路71号（八市中段）",
    image:"https://p8.itc.cn/images01/20210726/4d6eea8f048942078ff788a15a53fe09.jpeg",imageAlt:"阿明海鲜加工蒜蓉粉丝小青龙探店实拍",photoLabel:"店内探店 · 小青龙",
    summary:"八市中段的海鲜加工老店，食客实拍记录了蒜蓉小青龙、膏蟹、椒盐皮皮虾等，适合想看着鲜货选、两人共享几道菜。",
    dishes:["蒜蓉粉丝小青龙：粉丝吸足虾汁，适合做两人主菜。","姜葱炒膏蟹：鲜甜下饭，点前问当天规格与重量。","椒盐皮皮虾 / 糖醋话梅鱼：二选一做第二道，避免点多吃不完。"],
    pair:"两人点单：小青龙或膏蟹选一份主菜，再配一份时蔬和主食；先问清称重、做法、加工费。",
    tip:"开禾路71号，位于八市中段。图文探店内容较早，菜价与供应不沿用旧帖；到店看活鲜和当日价牌再决定。",
    source:"https://www.sohu.com/a/479637056_100302455",sourceLabel:"查看海鲜实拍与门店介绍 ↗"
  },
  {
    id:"shangqing",area:"八市",category:"海鲜大餐",name:"尚青海鲜加工（八市店）",address:"厦门市思明区开禾路117号",
    image:"https://p1-tt.byteimg.com/origin/tos-cn-i-qvj2lq49k0/36e2413d235e430592daf01bb6fb85c0.jpg",imageAlt:"尚青海鲜加工实拍海鲜拼盘",photoLabel:"门店游客实拍",
    summary:"八市里做蒸汽海鲜与闽南菜的选择，菜单里有龙虾和炒蟹；适合不想自己买海鲜再找加工店的走法。",
    dishes:["清蒸龙虾：做法简单，重点看当天鲜度。","爆炒蟹：适合两人配米饭分享。","椒盐皮皮虾、白灼虾或闽南海鲜粥：可按口味补一份。"],
    pair:"两人点单：先问龙虾或蟹的当天规格与总价，再配一份青菜和主食；不要只看每斤单价。",
    tip:"地址位于开禾路主街一带。八市市场地面湿滑、通道拥挤，进店前先看展示价签与加工规则。",
    source:"https://gs.ctrip.com/html5/you/foods/Xiamen21/11389102.html"
  },
  {
    id:"wuhongying",area:"沙坡尾",category:"海鲜大餐",name:"吴红英海鲜砂锅粥（沙坡尾店）",address:"厦门市思明区大学路177号恒达大厦101室",
    image:"https://ak-d.tripcdn.com/images/1mi5b12000qttg5vy748B_W_640_0_R5_Q80.jpg?proc=source%2Ftrip",imageAlt:"吴红英海鲜砂锅粥店内砂锅粥与海鲜菜实拍",photoLabel:"店内实拍",
    summary:"适合逛沙坡尾后坐下来吃热粥，砂锅现煮；比海鲜大排档更适合想吃得暖和、节奏慢一点的两人。",
    dishes:["膏蟹鲜虾砂锅粥：蟹鲜和虾甜融进绵稠粥底。","捞汁花蛤 / 螺类：酸辣开胃，适合作为小菜。","时蔬或炸物：和砂锅粥搭配分享。"],
    pair:"两人点单：先问砂锅粥最小份量，粥通常很顶饱；再加一份小海鲜或青菜即可。",
    tip:"高德地图门店点位为大学路177号；不同平台对楼层/铺号写法略有差异，到店以现场招牌为准。",
    source:"https://www.amap.com/place/B0LRU7DKQ1"
  },
  {
    id:"caomei",area:"沙坡尾",category:"海鲜大餐",name:"草莓夫妇｜厦门菜（厦大沙坡尾店）",address:"厦门市思明区大学路129-115室（沿巷内招牌找店）",
    image:"https://ak-d.tripcdn.com/images/1mi4t12000gqiitg65668.jpg?proc=source%2Ftrip",imageAlt:"草莓夫妇厦门菜沙坡尾门店海鲜合菜实拍",photoLabel:"门店游客实拍",
    summary:"沙坡尾一带的闽南海鲜正餐，海鲜面与多人分享菜更出片；去之前建议先核对当天营业状态。",
    dishes:["饭盒波龙拌面：龙虾与拌面搭配，主食感更足。","蟹黄拌面：蟹黄酱汁裹面，适合两人分着尝。","闽派佛跳墙：料足汤浓，适合偏爱汤菜的食客。"],
    pair:"两人点单：波龙拌面与蟹黄拌面选其一，再搭一份青菜；若点佛跳墙，先问小份规格。",
    tip:"位置在大学路巷内，门牌容易被街景挡住；按店名与129-115室找，不要只凭门头照片认路。",
    source:"https://tw.trip.com/moments/detail/xiamen-21-126362216/"
  },
  {
    id:"aqing",area:"文灶",category:"小龙虾夜宵",name:"阿青龙虾（文灶店）",address:"厦门市思明区湖滨中路10号附楼1层A区（碧宫酒店旁）",
    image:"https://p7.itc.cn/images01/20230412/2f8a51a19d5c4984b9a04be8fc3ba25a.jpeg",imageAlt:"阿青龙虾品牌探店实拍多口味小龙虾拼盘",photoLabel:"阿青品牌探店实拍",
    summary:"离文灶住宿片区近的小龙虾夜宵选项，报道中的门店图可看到一桌多口味龙虾与烧烤。",
    dishes:["蒜香小龙虾：蒜香浓、辣度较轻。","十三香 / 油焖小龙虾：香料感更足，可按辣度选择。","海鲜大咖、烤生蚝和烤串：适合想多尝几样时加点。"],
    pair:"两人点单：先问小份或最小规格，选一个口味；如果再加烧烤，点少量串即可。",
    tip:"这张拼盘照来自阿青品牌探店报道，不保证拍摄于文灶分店。地址按文灶店信息列出；同品牌分店不少，出发前确认门店与当日营业。",
    source:"https://tw.trip.com/restaurant/china/xiamen/detail/aqinglongxia-wenzao-34549671"
  },
  {
    id:"lailai",area:"文灶",category:"海鲜大餐",name:"来来海鲜大排档（果壳街区店）",address:"厦门市思明区后埭溪路22-4号（果壳街区）",
    image:"https://p3.itc.cn/q_70%2Ca_auto%2Cc_cut%2Cx_1%2Cy_0%2Cw_1021%2Ch_681/images01/20220127/6df0299545d847febeeea1174d0dcd55.jpeg",imageAlt:"来来海鲜大排档食客实拍冬蟹菜式",photoLabel:"来来海鲜实拍菜式",
    summary:"靠近文灶住宿片区的海鲜大排档，适合不想跑八市、想在酒店周边吃龙虾和螃蟹的晚上。",
    dishes:["小青龙：蒜蓉粉丝蒸或清蒸，先问当天规格。","姜葱红花蟹 / 冬蟹：按季节和鲜度选，当天供应为准。","富贵虾：两人可分享一份，搭配时蔬与主食。"],
    pair:"两人点单：龙虾或蟹选一道做主菜，再加一份青菜、一份主食；大规格海鲜先让店员报总价。",
    tip:"位置在后埭溪路果壳街区，离文灶住宿片区较近。门店图片和菜品记录来自食客探店，营业与海鲜供应以当天为准。",
    source:"https://www.sohu.com/a/903528161_118628",sourceLabel:"打开近期到店探店图文 ↗"
  },
  {
    id:"wufanpo",area:"文灶",category:"厦门小吃",name:"吴番婆沙茶面（金榜店）",address:"厦门市思明区厦禾路879号114",
    image:"assets/food_shacha.jpg",imageAlt:"海鲜沙茶面菜式实拍参考图",photoLabel:"沙茶面菜式实拍",
    summary:"适合抵达当晚就近吃一碗热汤面，不用再跨去热门街区排队。",
    dishes:["沙茶面：汤底浓香，可加豆腐、虾仁或海蛎。","加料先少量：先问单项价格，再选两三样喜欢的配料。"],
    pair:"两人点单：一人一碗或一碗加料共享，再配一份小吃。",
    tip:"照片为沙茶面菜式参考图，不代表该门店出品；门店是否营业以当天为准。"
  },
  {
    id:"ye",area:"鼓浪屿",category:"厦门小吃",name:"叶氏麻糍",address:"厦门市思明区鼓浪屿龙头路145号",
    image:"https://dimg04.c-ctrip.com/images/01065120009qrs0xf7FEC_D_750_450_Q90.jpg?proc=autoorient",imageAlt:"携程旅行者实拍的叶氏麻糍芝麻糯米团",photoLabel:"叶氏麻糍 · 游客菜品实拍",photoNote:"携程旅行者实拍 · 龙头路叶氏麻糍菜品",
    summary:"鼓浪屿步行途中方便尝一份的小甜点；与鱼丸汤错开吃，不必为排队绕路。",
    dishes:["现包麻糍：外层糯、内馅香，常见花生芝麻口味。"],
    pair:"两人点单：先买一份分着尝，岛上还要留肚子吃鱼丸或午餐。",
    tip:"配图为该店麻糍菜品游客实拍，并非摊位街景。队伍明显变长就先继续走；还可打开近期小红书实拍页查看当日排队与出品。",
    source:"https://www.xiaohongshu.com/search_result/6aa0c5d70000000029013ab7?xsec_token=ABdjVfqtn5waelZwjQuI5oSIpteBwgml3tTKEyTv3dY8M=&xsec_source=",sourceLabel:"查看近期麻糍实拍图 ↗",showPhotoLink:true
  },
  {
    id:"huanghai",area:"中山路",category:"厦门小吃",name:"莲欢海蛎煎",address:"厦门市思明区局口横巷6号",
    image:"assets/food_oyster.jpg",imageAlt:"厦门海蛎煎菜式实拍参考图",photoLabel:"海蛎煎菜式实拍",
    summary:"中山路与八市之间可安排的小份热食，适合逛街时两人分食。",
    dishes:["海蛎煎：外缘煎香，海蛎与鸡蛋带出鲜味。","可搭鱼丸汤或花生汤：按当天胃口加，不必都点。"],
    pair:"两人点单：先点一份海蛎煎共享；若后面还有正餐，汤品可免。",
    tip:"照片为厦门海蛎煎菜式参考，不代表莲欢门店出品。"
  },
  {
    id:"1980",area:"中山路",category:"厦门小吃",name:"1980烧肉粽（中山路店）",address:"厦门市思明区中山路353号",
    image:"https://ak-d.tripcdn.com/images/10050z000000o11lzC23C.jpg?proc=source%2Ftrip%3Bnamelogo%2Fd_5",imageAlt:"1980烧肉粽店内食客实拍肉粽",photoLabel:"1980烧肉粽食客实拍",
    summary:"鼓浪屿返岛后或返程日前的老城简餐选择，吃完顺着骑楼慢慢逛。",
    dishes:["烧肉粽：糯米、肉馅与配料扎实。","扁食汤：适合两人配粽子分食。"],
    pair:"两人点单：一份烧肉粽加一碗汤共享，晚餐前不容易过饱。",
    tip:"店址与分店写法偶有差异，按中山路353号附近门店确认；饭点以当日营业信息为准。"
  }
];

const officialSources = [
  ["厦门轮渡｜游客航线与票价","https://m.xmferry.com/hxjpj/yk/index.htm","船线、码头与票价；船班当日以公告为准"],
  ["厦门轮渡｜乘船检票说明","https://m.xmferry.com/xwdt/wshlk/chch/","进站、检票与返航安排"],
  ["厦门大学｜2026参观预约规则","https://news.xmu.edu.cn/info/1025/516042.htm","2026年1月发布的登记+摇号新规"],
  ["厦门园林植物园｜入园与雾森时段","https://www.xiamenbg.com/Home/yyzn2","国庆时段优先采用园区官网"],
  ["厦门广电网｜雨林世界焕新","https://www.xmtv.cn/xmtv/2026-01-26/33a848d95c38b55c.html","2026年1月报道"],
  ["中新网福建｜2026中秋国庆厦门活动","https://www.fj.chinanews.com.cn/news/2026/2026-09-16/590805.html","2026年9月16日报道"]
];

const socialSources = [
  ["小红书 · 小魚冻干《鼓浪屿一日环岛路线（步行版）》","https://www.xiaohongshu.com/search_result/6a8484f50000000008011746?xsec_token=ABJyB59RAXGnluyAXWBWMWfe069p9LIMei6SD29qss0Sg=&xsec_source=","2026-08-19 · 登岛后全步行的排队与体力体验"],
  ["小红书 · 马铃薯大王《记录在鼓浪屿半天的超详细攻略》","https://www.xiaohongshu.com/search_result/6aa3b5bd000000002603b195?xsec_token=AB-wadG5JAT9WradJaBUFSdeFKCytzJ533PuqrbgZElgs=&xsec_source=","2026-09-11 · 轻量街巷和园林走法"],
  ["小红书 · 偶尔暴躁的汤圆麻麻《厦门幸福路Citywalk》","https://www.xiaohongshu.com/search_result/6a828a6800000000270237c4?xsec_token=AB7iSQGLTIm0j0vLl10zHWfZSzjsmy2TP42vlS46IrQRE=&xsec_source=","2026-08-17 · 百家村—幸福路—华新路步行"],
  ["小红书 · 小小旅行家Mama《厦门三天两夜逛吃攻略｜不绕路版》","https://www.xiaohongshu.com/search_result/6a3a3aa2000000001702eac1?xsec_token=ABmXa5cXIyYtjMlAY5gFhtxdl1MmsQT8Z1Pj3t0JFJOiE=&xsec_source=","2026-06-23 · 按片区组合景点；其雾森时间未采用"],
  ["小红书 · 一只白白《厦门吃逛日记》","https://www.xiaohongshu.com/search_result/6ab0c6ad000000003400059e?xsec_token=ABsFXiatFLXc4WmYEM1JHPVoVrGReJWhLeSYhlvLgrJXM=&xsec_source=","2026-09-21 · 近期餐饮个人口味记录"],
  ["小红书 · 一杯冰美式《八市逛吃地图》","https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=","2026-02-13 · 八市开禾路小吃动线"],
  ["小红书 · 明天吃什么《鼓浪屿一上岛直奔这些店》","https://www.xiaohongshu.com/search_result/6a3a529c00000000220090e6?xsec_token=ABmXa5cXIyYtjMlAY5gFhtxeK5_h_HSE7PkJUs3NKk2xc=&xsec_source=","2026-06-23 · 龙头路小吃参考"],
  ["B站 · 阿眯sn《厦门详细到离谱的旅行攻略》","https://www.bilibili.com/video/BV1UCrVBRELu","2026-01-13 · 引用公开简介中的分区走法"],
  ["B站 · 花二腻《30家厦门特色美食！无广实拍耗时7天》","https://www.bilibili.com/video/BV1V5j96nESh","2026-06-24 · 视频观看参考；未据此提取具体店名"]
];

const imageCredits = [
  ["日光岩 / 鼓浪屿","Rolfmueller · CC BY-SA 3.0","https://commons.wikimedia.org/wiki/File:Gulangyu_sunlight_rock_2011_12.jpg"],
  ["菽庄花园","Siyuwj · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/File:Shuzhuang_Garden,_2019-09-26_16.jpg"],
  ["南普陀寺","Popolon · CC BY-SA 3.0","https://commons.wikimedia.org/wiki/File:Xiamen-Nanputuo_temple-2012.JPG"],
  ["厦门大学西门","S5A-0043 · CC BY 4.0","https://commons.wikimedia.org/wiki/File:(CHN-Fujian)_Xiamen_University_Siming_Campus_West_Gate_2025-03-20.jpg"],
  ["沙坡尾旧照","mojojo.cn · CC BY-SA 2.0","https://commons.wikimedia.org/wiki/File:Fishing_boats_in_Shapowei,_Xiamen.jpg"],
  ["中山路夜景","Slyronit · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/File:Zhongshan_Road,_Xiamen_2.jpg"],
  ["雨林世界","Metacladistics · CC BY 4.0","https://commons.wikimedia.org/wiki/Special:Search?search=Metacladistics+Xiamen+rainforest"],
  ["多肉植物区","Slyronit · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/Special:Search?search=Slyronit+Xiamen+Botanical+Garden"],
  ["白城沙滩","Tiger@西北 · CC BY-SA 3.0","https://commons.wikimedia.org/wiki/File:%E5%8E%A6%E9%97%A8%E7%99%BD%E5%9F%8E%E6%B5%B7%E6%BB%A9_-_panoramio.jpg"],
  ["百家村58号","Augustohai · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/Special:Search?search=Baijia+Village+58+Xiamen+Augustohai"],
  ["沙茶面","Windmemories · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/File:20230131_Seafood_Shacha_Noodle.jpg"],
  ["土笋冻","Hhaithait · CC BY-SA 3.0","https://commons.wikimedia.org/wiki/File:Tusundong_Xiamen.jpg"],
  ["姜母鸭","fullfen666 · CC BY-SA 2.0","https://commons.wikimedia.org/wiki/File:%E5%98%89%E5%91%B3%E8%96%91%E6%AF%8D%E9%B4%A8_(30998743825).jpg"],
  ["花生汤","HualinXMN · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/File:Huang_Zehe_peanut_soup.jpg"],
  ["叶氏麻糍 / 龙头路145号","携程旅行者麻糍菜品实拍","https://gs.ctrip.com/html5/you/foods/fooddetail/120058/319760.html"]
];

const storeSources = [
  ["吴番婆沙茶面（金榜店）","https://gs.ctrip.com/html5/you/foods/fooddetail/21/17029361.html"],
  ["叶氏麻糍","https://gs.ctrip.com/html5/you/foods/Xiamen21/319760.html"],
  ["龙头鱼丸店","https://gs.ctrip.com/html5/you/foods/Gulangyu120058/320022.html"],
  ["芋包嫂","https://gs.ctrip.com/html5/you/foods/fooddetail/21/11561043.html"],
  ["阿杰五香","https://gs.ctrip.com/html5/you/foods/fooddetail/21/5163180.html"],
  ["钟丽君满煎糕","https://gs.ctrip.com/html5/you/foods/Xiamen21/5163496.html"],
  ["惠源面包店","https://www.amap.com/place/B0FFG0388Z"],
  ["1980烧肉粽（中山路店）","https://you.ctrip.com/yougourmet/restdetail/xiamen21/354171.html"]
];

function safe(str){return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function renderDays(){
  let skipXmuRoute=false;
  const tabs=document.getElementById("daySwitcher");
  const panels=document.getElementById("dayPanels");
  days.forEach((day,i)=>{
    const tab=document.createElement("button");tab.type="button";tab.className="day-tab";tab.id=`tab-${i}`;tab.setAttribute("role","tab");tab.setAttribute("aria-controls",`day-${i}`);tab.setAttribute("aria-selected",i===0?"true":"false");tab.tabIndex=i===0?0:-1;
    tab.innerHTML=`<span class="tab-date">${safe(day.date)} · ${safe(day.weekday)}</span><span class="tab-title">${safe(day.short)}</span><span class="tab-detail">${safe(day.detail)}</span>`;
    tab.addEventListener("click",()=>activateDay(i));
    tab.addEventListener("keydown",e=>{let next=null;if(e.key==="ArrowRight")next=(i+1)%days.length;if(e.key==="ArrowLeft")next=(i+days.length-1)%days.length;if(e.key==="Home")next=0;if(e.key==="End")next=days.length-1;if(next!==null){e.preventDefault();activateDay(next);document.getElementById(`tab-${next}`).focus()}});
    tabs.append(tab);
    const panel=document.createElement("section");panel.className=`day-pane${i===0?" active":""}`;panel.id=`day-${i}`;panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",`tab-${i}`);
    const schedule=day.schedule.map(([time,title,detail],n)=>`<li><time>${safe(time)}</time><div class="schedule-body"><span class="timeline-index">${String(n+1).padStart(2,"0")}</span><strong>${safe(title)}</strong><p>${safe(detail)}</p></div></li>`).join("");
    const mapTools=window.XiamenMapDataTools;
    const mapData=window.XiamenMapData;
    const mapKey=Object.keys(mapData.routes)[i];
    const dayRoute=mapTools.routeForDay(mapData,mapKey);
    const dayPoints=mapTools.pointsForRoute(mapData,dayRoute);
    const hasIsland=dayPoints.some(point=>point.view==='island');
    const mapHeading='<div class="day-map-heading"><div class="mini-heading">当天地图 · 点击点位查看实拍</div>'+(i===2?'<button type="button" class="xmu-map-toggle" data-xmu-toggle aria-pressed="false">切换为未入校备选路线</button>':'')+'</div>';
    const mapMarkup='<div class="day-map-layout"><div class="day-map-pair'+(hasIsland?' has-ferry-map':'')+'"><div id="day-map-'+i+'" class="day-route-map"></div><div id="day-ferry-'+i+'" class="map-ferry-connector" hidden></div><div id="day-island-map-'+i+'" class="day-route-map day-island-map" hidden></div></div><aside id="day-map-detail-'+i+'" class="map-detail" aria-live="polite"></aside></div>';
    const transport=day.transport?`<aside class="day-transport"><div class="day-transport-copy"><span class="day-transport-kicker">当天交通</span><h4>${safe(day.transport.title)}</h4><p>${safe(day.transport.detail)}</p></div>${day.transport.ticket?`<figure class="day-ticket"><img src="${safe(SiteImages.resolveImagePath(day.transport.ticket))}" alt="${safe(day.transport.alt)}" loading="lazy"><span class="photo-unavailable" hidden>票图暂不可用</span><figcaption>${safe(day.transport.caption)} · 点图放大</figcaption></figure>`:""}</aside>`:"";
    panel.innerHTML=`<div class="day-header"><div><small>${safe(day.label)} · ${safe(day.date)} ${safe(day.weekday)}</small><h3>${safe(day.title)}</h3><p>${safe(day.summary)}</p></div><span class="day-badge">${safe(day.badge)}</span></div><div class="day-grid"><div><div class="mini-heading">当天路线 · 纵向时间链</div><ol class="schedule">${schedule}</ol></div></div>${mapHeading}${mapMarkup}${transport}<aside class="day-note"><strong>当天提示</strong><p>${safe(day.note)}</p></aside>`;
    panels.append(panel);
    const xmuToggle=panel.querySelector("[data-xmu-toggle]");
    if(xmuToggle)xmuToggle.addEventListener("click",()=>{
      skipXmuRoute=!skipXmuRoute;
      xmuToggle.setAttribute("aria-pressed",String(skipXmuRoute));
      xmuToggle.textContent=skipXmuRoute?"恢复含厦大路线":"切换为未入校备选路线";
      window.dispatchEvent(new CustomEvent("xiamen:xmu-toggle",{detail:{skipXmu:skipXmuRoute}}));
    });
  });
}
function activateDay(i){
  document.querySelectorAll(".day-tab").forEach((tab,n)=>{tab.setAttribute("aria-selected",n===i?"true":"false");tab.tabIndex=n===i?0:-1});
  document.querySelectorAll(".day-pane").forEach((p,n)=>p.classList.toggle("active",n===i));
  window.dispatchEvent(new CustomEvent("xiamen:daychange",{detail:{dayIndex:i}}));
}
window.addEventListener("xiamen:map-daychange",event=>{
  const detail=event.detail||{};
  const dayIndex=Number(detail.dayIndex);
  if(!Number.isInteger(dayIndex)||dayIndex<0||dayIndex>=days.length)return;
  activateDay(dayIndex);
  if(detail.scrollIntoView)document.getElementById("day-"+dayIndex)?.scrollIntoView({behavior:"smooth",block:"start"});
});
const foodPhotoFallbacks={};
const failedFoodPhotos=new Set();
function fallbackFoodPhoto(id){return SiteImages.resolveImagePath(foodPhotoFallbacks[id])}
function foodPhoto(food){return SiteImages.resolveImagePath(food.image)}
function watchFoodImage(image,food){
  image.addEventListener("error",()=>{
    const fallback=foodPhotoFallbacks[food.id];
    if(fallback&&image.dataset.fallbackApplied!=="true"){
      image.dataset.fallbackApplied="true";
      image.src=fallbackFoodPhoto(food.id);
      return;
    }
    image.hidden=true;
    image.closest(".food-image-wrap,.food-detail-photo")?.querySelector(".photo-unavailable")?.removeAttribute("hidden");
  });
}
function matchesFoodFilter(food,filter){return filter==="全部"||food.category===filter||food.area===filter}
function renderFood(filter="全部"){
  const groups=["全部",...new Set(foods.map(food=>food.category)),...new Set(foods.map(food=>food.area))];
  const filters=document.getElementById("foodFilters");
  filters.innerHTML=groups.map(g=>`<button type="button" data-filter="${safe(g)}" class="food-filter${g===filter?" active":""}" aria-pressed="${g===filter}">${safe(g)}</button>`).join("");
  const shown=foods.filter(food=>matchesFoodFilter(food,filter));
  document.getElementById("foodPlaces").innerHTML=shown.map(f=>{const photo=foodPhoto(f);return `<button type="button" class="food-place${f.category==="海鲜大餐"?" food-place-seafood":""}" data-food-id="${safe(f.id)}" aria-haspopup="dialog"><span class="food-image-wrap">${photo?`<img src="${safe(photo)}" alt="${safe(f.imageAlt)}" loading="lazy" data-food-image="${safe(f.id)}"><span class="photo-unavailable food-photo-fallback" hidden>对应实拍图暂不可用<br>点卡片看图文攻略</span>`:`<span class="photo-unavailable food-photo-empty">暂无匹配的店内实拍图<br>点卡片查看近期照片</span>`}<span class="food-photo-label" data-photo-label="${safe(f.id)}">${safe(f.photoLabel)}</span></span><span class="food-place-copy"><span class="area">${safe(f.area)} · ${safe(f.category)}</span><strong class="food-card-title">${safe(f.name)}</strong><span class="food-dish-teaser">${safe(f.dishes[0]?.split("：")[0]||f.summary)}</span><span class="food-address">${safe(f.address)}</span><span class="food-card-cta">查看点单攻略 <b aria-hidden="true">↗</b></span></span></button>`}).join("");
  document.querySelectorAll("[data-food-image]").forEach(img=>watchFoodImage(img,foods.find(food=>food.id===img.dataset.foodImage)));
}
function showFoodDetail(id){
  const food=foods.find(f=>f.id===id);if(!food)return;
  const photo=foodPhoto(food);
  const photoNote=food.photoNote||food.photoLabel||"菜式照片";
  document.getElementById("foodDialogContent").innerHTML=`<div class="food-detail-layout"><figure class="food-detail-photo">${photo?`<img src="${safe(photo)}" alt="${safe(food.imageAlt)}" data-food-detail-image="${safe(food.id)}">`:`<span class="photo-unavailable food-photo-empty">暂无匹配的店内实拍照片</span>`}<span class="photo-unavailable" hidden>照片暂时无法载入</span><figcaption>${safe(photoNote)}</figcaption></figure><div class="food-detail-copy"><span class="food-detail-kicker">${safe(food.area)}　/　${safe(food.category)}</span><h2 id="foodDialogTitle">${safe(food.name)}</h2><p class="food-detail-address">${safe(food.address)}</p><p class="food-detail-summary">${safe(food.summary)}</p><h3>这几道值得看</h3><ul class="food-dish-list">${food.dishes.map(d=>`<li>${safe(d)}</li>`).join("")}</ul><aside class="food-order-tip"><strong>两人点单思路</strong><p>${safe(food.pair)}</p></aside><p class="food-detail-tip">${safe(food.tip)}</p>${food.showPhotoLink&&food.source?`<a class="food-source-link" href="${safe(food.source)}" target="_blank" rel="noopener noreferrer">${safe(food.sourceLabel)}</a>`:""}</div></div>`;
  const image=document.querySelector(".food-detail-photo img");
  if(image)watchFoodImage(image,food);
  document.getElementById("foodDialog").showModal();
}
document.getElementById("foodFilters").addEventListener("click",e=>{const button=e.target.closest("button[data-filter]");if(button)renderFood(button.dataset.filter)});
document.getElementById("foodPlaces").addEventListener("click",e=>{const card=e.target.closest("button[data-food-id]");if(card)showFoodDetail(card.dataset.foodId)});
document.querySelector(".food-close").addEventListener("click",()=>document.getElementById("foodDialog").close());
document.getElementById("foodDialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
function renderSources(){
  const build=items=>items.map(([label,url,description])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)} ↗</a><span>${safe(description)}</span></li>`).join("");
  document.getElementById("officialSources").innerHTML=build(officialSources);
  document.getElementById("socialSources").innerHTML=build(socialSources);
  document.getElementById("storeSources").innerHTML=storeSources.map(([label,url])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)} · 门店页 ↗</a></li>`).join("");
  document.getElementById("imageCredits").innerHTML=imageCredits.map(([label,credit,url])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)}</a> · ${safe(credit)}</li>`).join("");
}
renderDays();renderFood();activateDay(1);
document.getElementById("printButton").addEventListener("click",()=>window.print());
const photoDialog=document.getElementById("photoDialog");
function bindZoom(root){root.querySelectorAll("figure img").forEach(img=>{
  if(img.dataset.zoomBound)return;img.dataset.zoomBound="true";
  img.tabIndex=0;img.setAttribute("role","button");img.setAttribute("aria-label",`放大查看：${img.alt}`);
  const show=()=>{document.getElementById("largePhoto").src=img.src;document.getElementById("largePhoto").alt=img.alt;document.getElementById("largeCaption").textContent=img.alt;photoDialog.showModal()};
  img.addEventListener("click",show);img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();show()}});
})}
bindZoom(document.querySelector("main"));
document.querySelector("#photoDialog .photo-close").addEventListener("click",()=>photoDialog.close());
photoDialog.addEventListener("click",e=>{if(e.target===photoDialog)photoDialog.close()});
