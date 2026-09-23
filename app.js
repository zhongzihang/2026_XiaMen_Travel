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
    ], note:"首晚不用追中山路夜景。10月1日返岛后接中山路与轮渡一带更顺路。"
  },
  {
    date: "10.01", weekday: "周四", short: "鼓浪屿", detail: "东渡 10:30 开船", label: "DAY 1 / 海岛",
    title: "鼓浪屿：看建筑、园林与海，不追满联票", summary: "三丘田上岛后，以最美转角、菽庄花园、日光岩为骨架。全岛步行为主，遇到长队就删减。",
    badge: "10:30 开船", route:[
      {time:"09:35",place:"东渡码头",hint:"提前安检、候船",leg:"轮渡约 20 分"},
      {time:"10:50",place:"三丘田",hint:"从北侧登岛",leg:"步行 10 分"},
      {time:"11:05",place:"最美转角",hint:"排长队直接跳过",leg:"步行 15 分"},
      {time:"11:35",place:"八卦楼周边",hint:"看建筑，择一入内",leg:"步行 + 午餐"},
      {time:"13:45",place:"菽庄花园",hint:"四十四桥与海景",leg:"步行 10 分"},
      {time:"15:30",place:"日光岩",hint:"登高俯瞰双岛",leg:"回三丘田"}
    ], schedule:[
      ["09:05","从文灶出发","国庆路况有不确定性，目标约09:35到东渡客运码头。"],
      ["10:30","东渡 → 三丘田","按订单所示码头和登船时段乘船，随身携带身份证。"],
      ["11:00","最美转角 / 八卦楼","先感受万国建筑；最美转角如果排长队，只看街景即可。"],
      ["12:15","龙头路周边午餐","鱼丸汤、蛋满灌或简餐，别为单店久排。"],
      ["13:45","菽庄花园","走四十四桥、钢琴博物馆，留约70分钟。"],
      ["15:30","日光岩","避开正午曝晒。登顶区域较窄，排队超出预期就改为海边慢走。"],
      ["17:30","往三丘田回撤","返航前留排队时间；晚间返程停靠码头以现场牌示为准。"]
    ], photos:[
      ["sunlight_rock.jpg","日光岩 · 鼓浪屿地标实拍"],
      ["shuzhuang.jpg","菽庄花园 · 藏海园林"],
      ["new_gulangyu_houses.jpg","鼓浪屿建筑街景实拍"]
    ], note:"轻量备选：去掉八卦楼入内与日光岩，只保留菽庄、老建筑街巷和海边。转角排队较长时直接继续走，给花园和海边多留一点时间。"
  },
  {
    date: "10.02", weekday: "周五", short: "人文海岸", detail: "南普陀 → 沙坡尾", label: "DAY 2 / 人文海岸",
    title: "南普陀—厦大—白城—沙坡尾，顺着海岸走", summary: "厦大入校时段是当天唯一需要灵活调整的环节。无入校时段也有完整的沿海走法。",
    badge: "约 5—7 km", route:[
      {time:"08:30",place:"南普陀",hint:"寺院与山门",leg:"步行"},
      {time:"10:00",place:"厦大思明",hint:"按入校时段调整",leg:"步行"},
      {time:"13:30",place:"白城沙滩",hint:"海边慢走",leg:"步行"},
      {time:"15:00",place:"演武观景台",hint:"看双子塔和桥",leg:"步行"},
      {time:"16:00",place:"沙坡尾",hint:"避风坞与大学路晚餐"}
    ], schedule:[
      ["08:20","酒店 → 南普陀","早点到寺院，避开人流和正午热度。"],
      ["10:00","厦大思明校区","按预约时段入校；校内路线和可开放区域以学校当天提示为准。"],
      ["12:30","大学路周边午餐","芋包、海蛎汤或清淡简餐，稍作休息。"],
      ["13:40","白城沙滩","沿海散步，注意防晒；天气炎热时可以缩短停留。"],
      ["15:00","演武大桥观景平台","桥下拍海面和双子塔，留约30分钟。"],
      ["16:00","沙坡尾避风坞","看老港与新街，晚餐放在大学路一带。"]
    ], photos:[
      ["nanputuo.jpg","南普陀寺实拍"],
      ["xmu_west_gate.jpg","厦门大学思明校区西门实拍"],
      ["new_baicheng.jpg","白城沙滩 · 实拍旧照"],
      ["shapowei.jpg","沙坡尾避风坞 · 历史影像"]
    ], note:"厦大2026年起改为线上登记与随机摇号；10月2日参观，按官方规则9月29日登记。未入校时：南普陀 → 大学路午餐 → 白城 → 演武 → 沙坡尾。"
  },
  {
    date: "10.03", weekday: "周六", short: "山海绿意", detail: "植物园 + 钟鼓索道", label: "DAY 3 / 山海绿意",
    title: "植物园先看雨林，再乘索道俯瞰鹭岛", summary: "雨林世界和多肉植物区在植物园内连走，午间休息后上钟鼓索道，傍晚转向八市周边。",
    badge: "早进园", route:[
      {time:"08:30",place:"植物园西门",hint:"沿主路入园",leg:"园内步行"},
      {time:"09:30",place:"雨林世界",hint:"雾森与栈道",leg:"园内步行"},
      {time:"10:45",place:"多肉区",hint:"巨型仙人掌",leg:"出园 + 午休"},
      {time:"15:30",place:"钟鼓索道",hint:"分时段乘坐",leg:"短程车"},
      {time:"17:00",place:"八市周边",hint:"五香 / 满煎糕 / 晚餐"}
    ], schedule:[
      ["08:00","从文灶出发","植物园西门入园更顺。园区坡道多，鞋要舒适。"],
      ["09:30","雨林世界雾森","官方目前公布国庆时段09:30—11:30；木栈道湿滑，镜头注意防潮。"],
      ["10:45","多肉植物区","遮阴较少，拍照后及时补水，返回西门。"],
      ["12:15","午餐与休息","不要把索道接在最晒的正午，下午更舒适。"],
      ["15:30","钟鼓索道","预留签到与排队；雷雨、大风可能停运。"],
      ["17:00","八市周边觅食","先逛仍在营业的摊店，再转开禾路/中山路吃晚餐；市场本体可能较早收摊。"]
    ], photos:[
      ["rainforest_commons.jpg","植物园雨林世界实拍"],
      ["cacti_commons.jpg","植物园多肉植物区实拍"]
    ], note:"雨林雾森拍照后再去多肉区，中午及时休息。索道停运或排队太久，就直接去八市周边逛吃。"
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
    ], note:"若雨大或前几天体力不足，取消 Citywalk；在文灶附近吃午餐、休息后直接去厦门站。"
  }
];

const foodPhotos = [
  ["food_shacha.jpg","沙茶面","厦门菜品实拍"],
  ["food_tusundong.jpg","土笋冻","厦门菜品实拍"],
  ["food_gingerduck.jpg","姜母鸭","闽南干香做法 · 菜式示意"],
  ["food_oyster.jpg","海蛎煎","菜式实拍示意"]
];

const foods = [
  ["文灶 / 金榜","吴番婆沙茶面（金榜店）","沙茶面加豆腐、海蛎或虾仁；适合首晚或早午餐。","厦禾路879号114 · ¥20—40/人"],
  ["鼓浪屿","叶氏麻糍","龙头路顺路尝一份现包麻糍；队伍长就略过。","龙头路145号 · ¥10—20/人"],
  ["鼓浪屿","龙头鱼丸店","一碗热鱼丸汤给全天步行补充体力。","龙头路183号 · ¥15—30/人"],
  ["沙坡尾 / 大学路","芋包嫂","芋包与海蛎汤；午餐或傍晚顺路吃。","大学路91号 · ¥20—40/人"],
  ["八市 / 开禾路","阿杰五香","现炸五香卷；两人先分一份。","开禾路111号 · ¥10—20/人"],
  ["八市 / 开禾路","钟丽君满煎糕","花生或芝麻口味，适合作为路上甜点。","开禾路30号 · ¥10—20/人"],
  ["八市 / 开禾路","惠源面包店","传统面包与点心，买少量当次日车上小食。","开禾路22号 · ¥10—25/人"],
  ["中山路","1980烧肉粽","烧肉粽配扁食汤，适合返程日前午餐。","中山路353号 · ¥20—40/人"],
  ["八市 / 营平市场","友生风味小吃","沙茶面或猪脚面，汤底较浓郁。","开元路147号 · ¥20—40/人"],
  ["沙坡尾","吴红英海鲜砂锅粥","两人一锅鲜虾粥加1—2道小菜，先问份量。","大学路177号 · ¥60—100/人"],
  ["中山路 / 局口街","莲欢海蛎煎","海蛎煎配鱼丸汤，适合两人分着吃。","局口横巷6号 · ¥25—45/人"],
  ["老城 / 大同路","佳味再添","芋包、薄饼、烧肉粽，一次尝几种传统小吃。","大同路49号 · ¥20—40/人"],
  ["八市 / 大元路","阿吉仔","椰子饼、马蹄酥和馅饼，买少量做伴手礼。","大元路37号 · ¥20—50/人"],
  ["中山路","黄则和花生汤","一碗花生汤配传统点心，适合饭后甜口。","中山路店 · ¥15—30/人"]
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
  ["花生汤","HualinXMN · CC BY-SA 4.0","https://commons.wikimedia.org/wiki/File:Huang_Zehe_peanut_soup.jpg"]
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
  const tabs=document.getElementById("daySwitcher");
  const panels=document.getElementById("dayPanels");
  days.forEach((day,i)=>{
    const tab=document.createElement("button");tab.type="button";tab.className="day-tab";tab.id=`tab-${i}`;tab.setAttribute("role","tab");tab.setAttribute("aria-controls",`day-${i}`);tab.setAttribute("aria-selected",i===0?"true":"false");tab.tabIndex=i===0?0:-1;
    tab.innerHTML=`<span class="tab-date">${safe(day.date)} · ${safe(day.weekday)}</span><span class="tab-title">${safe(day.short)}</span><span class="tab-detail">${safe(day.detail)}</span>`;
    tab.addEventListener("click",()=>activateDay(i));
    tab.addEventListener("keydown",e=>{let next=null;if(e.key==="ArrowRight")next=(i+1)%days.length;if(e.key==="ArrowLeft")next=(i+days.length-1)%days.length;if(e.key==="Home")next=0;if(e.key==="End")next=days.length-1;if(next!==null){e.preventDefault();activateDay(next);document.getElementById(`tab-${next}`).focus()}});
    tabs.append(tab);
    const panel=document.createElement("section");panel.className=`day-pane${i===0?" active":""}`;panel.id=`day-${i}`;panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",`tab-${i}`);
    const route=day.route.map((stop,n)=>`${n?`<div class="route-leg" aria-label="${safe(day.route[n-1].leg)}"><span>${safe(day.route[n-1].leg)}</span><b aria-hidden="true"></b></div>`:""}<div class="route-stop"><span class="route-index">${String(n+1).padStart(2,"0")}</span><span class="route-time">${safe(stop.time)}</span><strong class="route-place">${safe(stop.place)}</strong><span class="route-hint">${safe(stop.hint)}</span></div>`).join("");
    const schedule=day.schedule.map(([time,title,detail])=>`<li><time>${safe(time)}</time><div class="schedule-body"><strong>${safe(title)}</strong><p>${safe(detail)}</p></div></li>`).join("");
    const photos=day.photos.map(([file,caption])=>`<figure><img src="${A+safe(file)}" alt="${safe(caption)}" loading="lazy"><figcaption>${safe(caption)}</figcaption></figure>`).join("");
    panel.innerHTML=`<div class="day-header"><div><small>${safe(day.label)} · ${safe(day.date)} ${safe(day.weekday)}</small><h3>${safe(day.title)}</h3><p>${safe(day.summary)}</p></div><span class="day-badge">${safe(day.badge)}</span></div><div class="mini-heading">路线图 · 按实际走法排列</div><div class="route-shell"><div class="route-track">${route}</div></div><p class="route-scroll-tip">手机上向右滑动，可看完整路线 →</p><div class="day-grid"><div><div class="mini-heading">时间安排</div><ol class="schedule">${schedule}</ol></div><div><div class="mini-heading">沿途实拍</div><div class="photo-grid ${day.photos.length===1?"single":day.photos.length===2?"two":""}">${photos}</div></div></div><aside class="day-note"><strong>当天提示</strong><p>${safe(day.note)}</p></aside>`;
    panels.append(panel);
  });
}
function activateDay(i){
  document.querySelectorAll(".day-tab").forEach((tab,n)=>{tab.setAttribute("aria-selected",n===i?"true":"false");tab.tabIndex=n===i?0:-1});
  document.querySelectorAll(".day-pane").forEach((p,n)=>p.classList.toggle("active",n===i));
}
function renderFood(){
  document.getElementById("foodGallery").innerHTML=foodPhotos.map(([file,title,sub])=>`<figure><img src="${A+file}" alt="${safe(title)}菜品实拍照片" loading="lazy"><figcaption>${safe(title)}<span>${safe(sub)}</span></figcaption></figure>`).join("");
  document.getElementById("foodPlaces").innerHTML=foods.map(([area,name,description,address])=>`<article class="food-place"><span class="area">${safe(area)}</span><h3>${safe(name)}</h3><p>${safe(description)}</p><span class="address">${safe(address)}</span></article>`).join("");
}
function renderSources(){
  const build=items=>items.map(([label,url,description])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)} ↗</a><span>${safe(description)}</span></li>`).join("");
  document.getElementById("officialSources").innerHTML=build(officialSources);
  document.getElementById("socialSources").innerHTML=build(socialSources);
  document.getElementById("storeSources").innerHTML=storeSources.map(([label,url])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)} · 门店页 ↗</a></li>`).join("");
  document.getElementById("imageCredits").innerHTML=imageCredits.map(([label,credit,url])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)}</a> · ${safe(credit)}</li>`).join("");
}
renderDays();renderFood();
document.getElementById("printButton").addEventListener("click",()=>window.print());
const photoDialog=document.getElementById("photoDialog");
document.querySelectorAll("main figure img").forEach(img=>{
  img.tabIndex=0;img.setAttribute("role","button");img.setAttribute("aria-label",`放大查看：${img.alt}`);
  const show=()=>{document.getElementById("largePhoto").src=img.src;document.getElementById("largePhoto").alt=img.alt;document.getElementById("largeCaption").textContent=img.alt;photoDialog.showModal()};
  img.addEventListener("click",show);img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();show()}});
});
document.querySelector(".photo-close").addEventListener("click",()=>photoDialog.close());
photoDialog.addEventListener("click",e=>{if(e.target===photoDialog)photoDialog.close()});
