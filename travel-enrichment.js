(function () {
  'use strict';
  const research = window.XiamenPhotoResearch || {};
  const stories = {
    dongdu: { intro: '这一站是登岛的起点。穿过候船大厅，海港与客轮慢慢展开；把上岛的节奏放慢，先确认船票上的航线和检票口。', time: '提前 45—60 分钟到码头', focus: '10:30 开船 · 随身带身份证', captions: ['国际邮轮中心与客轮侧景'] },
    sanqiutian: { intro: '从三丘田上岸，沿海边走几步就进入鼓浪屿的街巷。这里适合作为一天步行的起点，也方便游玩结束后回到码头。', time: '停留 10—15 分钟', focus: '先认清返程候船区，再开始逛岛', originalCaption: '三丘田码头正面 · 厦门轮渡资料图', captions: ['从三丘田海边望向厦门本岛', '鼓浪屿沿岸与红瓦建筑'] },
    zhongshan: { intro: '10月3日从八市慢慢转到中山路的骑楼街区。先沿步行街看夜景，再按排队和口味选一家小吃或闽南餐馆。', time: '19:00起晚餐与散步约 90 分钟', focus: '10月3日晚餐 · 骑楼夜景', captions: ['中山路骑楼夜景'] },
    longtou: { intro: '龙头路的乐趣在小巷与小店之间。看橱窗、尝一份小吃，再拐进安静一些的支巷，比一路追着热门店排队更轻松。', time: '慢逛 45—60 分钟', focus: '鱼丸汤、麻糍少量分享，给午后留体力', captions: ['龙头路沿街店铺'] },
    shuzhuang: { intro: '这座海边花园最妙的是“藏海”：先隔着墙看园景，转过门洞，海面才突然展开。沿四十四桥慢走，体会园林如何把大海借进庭院。', time: '建议 60—90 分钟', focus: '四十四桥看海 · 十二洞天寻生肖', captions: ['海滨园林俯瞰', '四十四桥与园中巨石'] },
    rock: { intro: '登上日光岩，鼓浪屿的红瓦屋顶和厦门岛的天际线会一起铺开。最后一段台阶较集中，不必赶路，在观景台短暂停留后把位置让给后面的人。', time: '建议 45—60 分钟', focus: '红瓦与海湾全景 · 岩顶排队长时灵活放弃', captions: ['岩顶与海岛全景', '暮色中的日光岩'] },
    nanputuo: { intro: '五老峰下的南普陀寺，可以从寺前池畔开始看：水面倒影、闽南屋脊与层层殿宇连成一幅画。沿中轴线慢走，比匆忙爬山更适合这一天的节奏。', time: '10:00左右入寺 · 不登后山约 45—60 分钟', focus: '池畔倒影 · 殿宇飞檐 · 安静参观', originalCaption: '南普陀寺殿宇与山门实拍', captions: ['殿宇与闽南建筑细节', '天王殿与放生池', '大悲殿飞檐'] },
    xmu: { intro: '厦大这一站先看校门与建筑气质。成功预约入校后，再按允许路线参观；没有预约也可以把时间留给白城海岸，不影响当天的山海漫步。', time: '校门外短停 10—20 分钟', focus: '仅预约成功且时段合适时入校', captions: ['厦大校园与海湾俯瞰', '芙蓉湖畔嘉庚楼', '芙蓉湖建筑倒影'] },
    baicheng: { intro: '从城市街巷走到白城，视野一下子打开。海浪、沙滩、演武大桥和双子塔是这里最直观的风景，沿岸走一段就能收获不同构图。', time: '建议 30—45 分钟', focus: '海岸散步 · 桥与双子塔同框', captions: ['沿沙滩望向双子塔', '演武大桥与海岸'] },
    shapowei: { intro: '沙坡尾把老渔港的生活气息与年轻店铺放在了一起。先沿避风坞看两岸街屋的倒影，再去大学路和艺术西区逛小店，傍晚尤其适合停下来。', time: '建议 60—90 分钟', focus: '避风坞倒影 · 街巷与艺术西区', captions: ['避风坞街屋与倒影', '街区彩色标识'] },
    heping: { intro: '晚餐后走到和平码头附近，沿鹭江道看海湾夜景。约20:20进入检票区候船，20:50乘鹭江夜游；照片呈现码头和游船实景，实际船型以订单为准。', time: '20:05看夜景 · 20:20候船 · 20:50开航', focus: '核对船名与检票口；恶劣天气留意停航通知', originalCaption: '和平码头及鹭江夜游夜景实拍', captions: ['鹭江夜游游船实拍 · 实际船型以订单为准', '船上看鹭江夜色', '夜游船体与灯光'] },
    yujian: { intro: '雨天把海岸漫步改成室内的闽南主题街区与演艺。先看当天表演表，再决定参观顺序；景区位于东渡附近，晚餐后去和平码头乘夜游。', time: '雨天建议停留 4—6 小时', focus: '室内演艺 · 10月2日雨天备选', captions: ['景区实景演出与闽南舞台', '闽南主题演艺现场', '景区特色舞台场景'] },
    botanic: { intro: '从雨林的浓绿走到多肉区的开阔，植物园的景色变化很鲜明。西门入园后优先安排感兴趣的园区，坡路较多，坐园内交通能给下午索道留些体力。', time: '建议 2—3 小时', focus: '雨林光束 · 多肉植物区 · 万石湖', captions: ['雨林区的雾与光', '多肉植物区俯瞰'] },
    cable: { intro: '索道的看点在视角变化：先掠过树冠，随后城市楼宇和海湾渐渐出现。不必一直举着手机，留一段时间看脚下的山林和远处的海。', time: '往返约 40 分钟，另留排队时间', focus: '按已选 16:00—17:00 时段入场', captions: ['缆车与城市楼宇', '晚霞中的索道', '缆车穿过城市景观', '索道越过山林的视角'] },
    bashi: { intro: '八市适合边走边看：海鲜摊、熟食铺和买菜的人，构成厦门日常生活的热闹一面。先逛一圈再点餐，能更从容地选到合胃口的小吃。', time: '逛吃约 60—90 分钟', focus: '开禾路慢逛 · 海鲜先问清总价', originalCaption: '八市附近夜间街景', captions: ['开禾路市场街景'] },
    baijia: { intro: '返程前把脚步放轻，看看百家村的老街生活，再按体力延伸到华新路的老宅与绿荫。带着行李时只走一段好走的街巷，午餐后直达厦门站。', time: '建议 45—75 分钟', focus: '退房带行李 · 午餐后直达车站', captions: ['百家村老宅细节'] },
    hotel: { intro: '这几天住在文灶的夏商·怡翔酒店。相册展示酒店外景、街区入夜和店内走廊；客房照片待核实对应房型后补入，入住以订单为准。返程当天退房时带齐行李。', time: '10月4日 10:00—11:00 退房', focus: '湖滨中路7号 · 文灶片区', originalCaption: '酒店外景 · 首选视角', captions: ['酒店另一外观视角', '文灶街区入夜与酒店外观', '酒店客房走廊实景'] },
    station: { intro: '厦门站既是到达点，也是返程起点。9月30日按出站通道指引前往站前交通区；10月4日从百家村午餐后直接前往，预留节日路况、安检和找进站口的时间。', time: '10月4日建议约15:00到站', focus: '16:33 D2387 返程 · 核对进站口', originalCaption: '厦门站南广场外景与站名', captions: ['厦门站候车大厅', '厦门站北出站通道与指示牌'] }
  };
  window.XiamenPlaceStories = stories;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function photos(point) {
    const story = stories[point.id] || {}, item = research[point.id];
    const original = { src: window.SiteImages.resolveImagePath(point.photo), caption: story.originalCaption || `${point.name} · 实景照片`, source: item?.originalSource || item?.source };
    return [original, ...(item?.localPhotos || []).map((photo, i) => ({ src: photo.path, caption: story.captions?.[i] || `${point.name} · 实景视角 ${i + 1}`, source: photo.source || item.source }))];
  }
  window.XiamenPlaceGallery = {
    markup(point) {
      const items = photos(point);
      return `<section class="place-gallery" aria-label="${esc(point.name)}照片相册"><div class="place-gallery-track" tabindex="0" aria-label="景点照片，左右滑动查看">${items.map((photo, i) => `<figure class="place-gallery-slide"><button class="place-gallery-photo" type="button" data-gallery-zoom aria-label="放大${esc(photo.caption)}"><img src="${esc(photo.src)}" alt="${esc(photo.caption)}" loading="lazy"><span class="gallery-unavailable" hidden>照片暂不可用</span></button><figcaption>${esc(photo.caption)}</figcaption></figure>`).join('')}</div><div class="place-gallery-controls"><span>${items.length > 1 ? '左右滑动 · 点图放大' : '点图放大'}</span><div><button type="button" data-gallery-step="-1" aria-label="上一张照片" disabled>←</button><output aria-live="polite">1 / ${items.length}</output><button type="button" data-gallery-step="1" aria-label="下一张照片" ${items.length < 2 ? 'disabled' : ''}>→</button></div></div></section>`;
    },
    guide(point) {
      const story = stories[point.id];
      return story ? `<div class="place-guide"><span class="place-guide-label">沿途听一段</span><p>${esc(story.intro)}</p><div class="place-guide-time">◷ ${esc(story.time)}</div><p class="place-guide-focus">${esc(story.focus)}</p></div>` : `<p>${esc(point.note)}</p>`;
    },
    bind(root) {
      root.querySelectorAll('.place-gallery').forEach(gallery => {
        const track = gallery.querySelector('.place-gallery-track'), slides = [...gallery.querySelectorAll('.place-gallery-slide')];
        const previous = gallery.querySelector('[data-gallery-step="-1"]'), next = gallery.querySelector('[data-gallery-step="1"]');
        let index = 0;
        function update() {
          index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
          gallery.querySelector('output').textContent = `${index + 1} / ${slides.length}`;
          previous.disabled = index === 0; next.disabled = index === slides.length - 1;
        }
        function move(step) { track.scrollTo({left: Math.max(0, Math.min(slides.length - 1, index + step)) * track.clientWidth, behavior: 'smooth'}); }
        gallery.querySelectorAll('[data-gallery-step]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.galleryStep))));
        track.addEventListener('scroll', update, {passive:true});
        track.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);} });
        gallery.querySelectorAll('[data-gallery-zoom]').forEach(button => {
          const img = button.querySelector('img');
          img.addEventListener('error', () => {img.hidden = true;button.querySelector('.gallery-unavailable').hidden = false;button.disabled = true;}, {once:true});
          button.addEventListener('click', () => {
            document.getElementById('largePhoto').src = img.src;
            document.getElementById('largePhoto').alt = img.alt;
            document.getElementById('largeCaption').textContent = img.alt;
            document.getElementById('photoDialog').showModal();
          });
        });
      });
    }
  };
  const food = (id, area, category, summary, dishes, pair, tip) => {
    const item = research[id];
    const photoProvider = id === 'yanyu' ? '搜狐餐厅实拍' : '携程店铺相册';
    return {id, area, category, name:item.name, address:item.address, image:item.localPhotos[0]?.path || '', imageAlt:`${item.name} · ${photoProvider}`, photoLabel:photoProvider, summary, dishes, pair, tip, source:id === 'yanyu' ? 'https://www.sohu.com/a/278969973_100287523' : item.source, sourceLabel:'查看门店相册与食客点评 ↗', showPhotoLink:true};
  };
  window.XiamenExtraFoods = [
    food('yuehua','中山路','厦门小吃','镇邦路上的沙茶面小店，适合中山路散步前后补一顿热食。浓香汤底配自己选的料，点一碗就能吃得满足。',['沙茶面：选豆干、鱼丸，再加一种喜欢的荤料。','炸五香：两人分一份，趁热吃。','烧肉粽：想换主食时可与面二选一。'],'两人各一碗少量加料的面，五香卷共享即可。','适合简餐；加料前看价签，饭点留出等位时间。'),
    food('huangzehe','中山路','甜汤饮品','逛中山路时的一站甜口休息。花生汤偏甜，喜欢软糯口感可以试试，正餐后两人分着尝更轻松。',['花生汤：先选原味或加蛋。','五香卷：配甜汤的小份咸口。','面线糊：想吃热主食时再加。'],'一份花生汤加一份小吃先尝，觉得合口味再追加。','中山路22—24号；口味偏甜，不喜欢加蛋可点单时说明。'),
    food('minhenan','万象城','闽南正餐','适合想坐下来好好吃一顿、又想避开户外炎热的时段。以闽南风味组合一餐，可作为雨天或文灶附近活动后的备选。',['侨乡葱茸包：带甜咸风味的小点。','花雕酒醉河田鸡：按人数选合适份量。','白萝卜饭：与主菜搭配，少点一份其他主食。'],'鸡肉主菜、一道蔬菜和萝卜饭，葱茸包少量尝鲜。','万象城3楼328；从文灶前往可考虑打车或地铁至湖滨东路站。热门饭点提前取号。'),
    food('yanyu','万象城','闽南正餐','福建菜配现代餐厅环境，适合留一段完整晚餐时间。相比边走边吃，这里更适合两人坐下来分享菜品。',['葱油肉汁焗荔浦芋头：软糯口感的招牌选择。','泉州牛排：想吃肉菜时可选。','大红袍鲜奶布丁：留一点胃口给茶味甜点。'],'一道肉菜、一份芋头或青菜，再配主食；甜点共享。','万象城L3-27。菜单会更新，点单前看看当前供应和份量。'),
    food('wutang','沙坡尾','厦门小吃','民族路上的沙茶面选择，适合把午餐安排在厦港一带时顺路去。汤底浓，海鲜和豆干可按口味搭配。',['沙茶面配鱿鱼：先确认当日加料价格。','海蛎与豆干：鲜味与吸汤口感搭配。','米血或鱼丸：按食量选一两样即可。'],'每人一碗面、每碗两三种料，避免一次加太多。','民族路76号，距沙坡尾需再步行一段；更适合早餐或午餐，勿默认晚间营业。'),
    food('yubao','沙坡尾','厦门小吃','大学路上可以轻量尝鲜的一站。芋包的芋香外皮配咸口内馅，适合逛沙坡尾中途垫垫肚子。',['芋包：先点一份，两人分着尝。','海蛎汤：配芋包作为轻食。','鱼丸汤：不吃海蛎时可换这一碗。'],'一份芋包加两碗汤，或每人一份芋包；吃完再决定是否加餐。','大学路91号，适合沙坡尾散步中途停留；芋包较顶饱，正餐前少量尝鲜。'),
  ];
  window.XiamenExtraFoods.push(
    {
      id:'haodelai', area:'百家村', category:'闽南正餐', name:'百家春好德来姜母鸭', address:'厦门市思明区中兴路40号',
      image:'assets/gallery/food-haodelai-1.jpg', imageAlt:'百家春好德来姜母鸭门店实拍', photoLabel:'门店实拍',
      summary:'百家村街巷里的姜母鸭小店，姜香浓、口味偏重，适合10月4日午餐或带走一小份。',
      dishes:['姜母鸭：先问半份、鸭腿或当日最小份量。','米饭与烫青菜：配鸭肉解腻。'],
      pair:'两人先问最小份姜母鸭，再配米饭和一道青菜；带行李时优先选择打包。',
      tip:'店面朴素，食客评价有分歧；姜味和咸度较突出，按口味决定。',
      source:'https://tw.trip.com/restaurant/china/xiamen/detail/restaurant-11309499', meituanUrl:'https://dpurl.cn/r9smU4jz'
    },
    {
      id:'shangguan', area:'中山路', category:'甜汤饮品', name:'上官栗子·四果汤（厦禾路店）', address:'厦门市思明区厦禾路296-108号',
      image:'assets/gallery/food-shangguan-1.jpeg', imageAlt:'上官栗子四果汤品牌菜品展示图', photoLabel:'品牌菜品图 · 非分店实拍',
      summary:'四果汤用冰、仙草、豆类与水果调成清爽甜口，适合八市或骑楼夜逛时两人分一碗。',
      dishes:['招牌四果汤：先问甜度与冰量。','栗子：想带一份路上吃时可少量买。'],
      pair:'两人先点一小碗分着尝，正餐后无需再多点甜食。',
      tip:'配图是品牌菜品图，不是厦禾路分店出品照；门店当日供应与营业请现场确认。',
      source:'https://you.ctrip.com/food/xiamen21/122826201.html', sourceLabel:'查看门店与近期点评 ↗', showPhotoLink:true
    },
    {
      id:'qingjun', area:'文灶', category:'厦门小吃', name:'庆君汤包·沙茶面（文灶店）', address:'厦门市思明区厦禾路873号1-2-3',
      image:'assets/gallery/food-qingjun-bao-3.jpg', imageAlt:'庆君汤包店铺相册中的汤包与汤品', photoLabel:'店铺相册 · 汤包实拍',
      summary:'文灶附近的汤包和拌面选择，适合抵达夜或返程前吃一顿热乎的简餐。',
      dishes:['原香味或蟹黄汤包：先点一笼，留意汤汁烫口。','拌面或酸笋豆腐汤：两人择一搭配。'],
      pair:'一笼汤包配一份拌面或汤共享，按当天胃口加点。',
      tip:'店铺页面列出的汤包、拌面与酸笋汤可作点单参考；节日期间营业以门店为准。',
      source:'https://you.ctrip.com/food/21/7105787.html', sourceLabel:'查看门店相册与食客点评 ↗', showPhotoLink:true
    },
    {
      id:'xiaoyanjing', area:'文灶', category:'海鲜大餐', name:'小眼镜大排档（湖滨中路店）', address:'厦门市思明区湖滨中路7号',
      image:'assets/gallery/food-xiaoyanjing-1.jpg', imageAlt:'小眼镜大排档湖滨中路店门面实拍', photoLabel:'湖滨中路店实拍',
      summary:'文灶附近的海鲜大排档备选，适合想坐下来吃酱油水海鲜和炒面线的晚上。',
      dishes:['酱油水海鲜：按当天鲜货选鱼或鱿鱼。','炒面线与时蔬：给海鲜配一份主食和青菜。'],
      pair:'两人选一道海鲜主菜、一份青菜和炒面线；点单前看清重量、加工方式和总价。',
      tip:'照片是湖滨中路门面旧照，招牌与现场可能变化；营业和鲜货以当日为准。',
      source:'https://4travel.jp/os_shisetsu/10440355', sourceLabel:'查看到店照片与点评 ↗', showPhotoLink:true
    },
    {
      id:'yishuyiye', area:'中山路', category:'甜汤饮品', name:'一树一叶（思北店）', address:'厦门市思明区厦禾路296-135-1号',
      image:'assets/gallery/food-yishuyiye-1.jpg', imageAlt:'一树一叶福建鲜奶茶品牌门店实拍', photoLabel:'品牌门店实拍 · 非思北店',
      summary:'以福建茶做鲜奶茶和果茶，八市与中山路之间想喝一杯时可作为顺路备选。',
      dishes:['茉莉青乌龙：偏清爽的茶香选择。','闽南茶底鲜奶茶：想喝奶香时先选低糖。'],
      pair:'两人各点一杯不同茶底，少糖更容易尝出茶味。',
      tip:'配图为同品牌门店，并非思北店；出发前按店名和厦禾路门牌核实营业。',
      source:'https://my.trip.com/moments/detail/xiamen-21-128769307', sourceLabel:'查看品牌门店实拍 ↗', showPhotoLink:true
    },
    {
      id:'tusun', area:'百家村', category:'厦门小吃', name:'天河西门土笋冻', address:'厦门市思明区斗西路33号',
      image:'assets/gallery/food-tusun-1.jpg', imageAlt:'天河西门土笋冻斗西路门面实拍', photoLabel:'高德门店实拍',
      summary:'闽南特色凉菜，用海产土笋熬出的胶质冷凝成冻；路过斗西路可少量尝鲜。',
      dishes:['土笋冻：先点小份，蒜蓉、酱油和芥末按口味添加。','不吃这类海产时，可直接略过这一站。'],
      pair:'两人先点一小份分享，不必为尝鲜打乱正餐。',
      tip:'图为该店门面，非菜品图；冷食注意个人口味和当天保存条件。',
      source:'https://www.amap.com/place/B025001MZM', sourceLabel:'查看门店位置与实拍 ↗', showPhotoLink:true
    },
    {
      id:'ajie-wuxiang', area:'八市', category:'厦门小吃', name:'八市阿杰五香（开禾路店）', address:'厦门市思明区开禾路111号',
      image:'assets/gallery/food-ajie-2026.jpg', imageAlt:'阿杰五香现炸五香卷的食客照片', photoLabel:'携程门店相册 · 现炸实拍',
      summary:'在八市边走边吃的一站。豆皮裹肉馅炸成五香卷，趁热吃更能尝到外皮的酥脆。',
      dishes:['现炸五香卷：先点少量，两人分着吃。','沙茶面或鱼丸汤：想坐下来吃时再选一份。'],
      pair:'逛市场时先买一两条五香卷尝味；后面还要吃海鲜就别一次点满。',
      tip:'开禾路与担水巷交口；八市也有其他同名点位，按开禾路111号找这家。',
      source:'https://tw.trip.com/restaurant/china/xiamen/detail/ba-shi-a-jie-11312796/'
    },
    {
      id:'huiyuan-bread', area:'八市', category:'厦门小吃', name:'惠源面包店（开禾路店）', address:'厦门市思明区开禾路22号',
      image:'assets/gallery/food-huiyuan-2026.jpg', imageAlt:'惠源面包店招牌与食客购买的面包拼图', photoLabel:'携程旅行者实拍 · 门店与面包',
      summary:'八市里的一口古早味。炸面包有咸香内馅，适合逛市场时买一份路上分享。',
      dishes:['炸面包：问问是否刚出锅，热着吃口感更好。','火腿面包或手指面包：想带走时可挑一种。'],
      pair:'两人先买一份炸面包分享，再按胃口决定要不要带普通面包。',
      tip:'位于开禾路市场段；这张图是食客的门店与面包拼图，节日当天供应以现场为准。',
      source:'https://www.trip.com/moments/theme/poi-eighth-market-10530087-store-993139/',
      mapSource:'https://www.amap.com/place/B0FFG0388Z'
    },
    {
      id:'yousheng', area:'八市', category:'厦门小吃', name:'友生风味小吃（营平市场店）', address:'厦门市思明区开元路147号夏商营平农产品市场',
      image:'assets/gallery/food-yousheng-2026.jpg', imageAlt:'友生风味小吃门店相册里的沙茶面', photoLabel:'携程门店相册 · 菜品实拍',
      summary:'从八市往营平市场走可顺路吃一碗沙茶面。市场里的小店适合想吃热食、又不想安排正式餐厅的一站。',
      dishes:['沙茶面：豆腐泡与喜欢的荤料选两三样即可。','卤面：想换汤底时可问当天是否有供应。'],
      pair:'两人各点一碗面，少量加料；后面还想吃海鲜就把这站当轻午餐。',
      tip:'店在营平农产品市场内，别与八市开禾路上的沙茶面店混淆。',
      source:'https://tw.trip.com/restaurant/china/xiamen/detail/restaurant-11309262/',
      mapSource:'https://www.amap.com/place/B02500S1OP'
    },
    {
      id:'baicheng-duck-porridge', area:'中山路', category:'厦门小吃', name:'百成大同鸭肉粥（大同路总店）', address:'厦门市思明区大同路128—130号',
      image:'assets/gallery/food-baicheng-2026.jpg', imageAlt:'百成大同鸭肉粥食客拍摄的粥档和配料', photoLabel:'去哪儿食客实拍 · 粥档',
      summary:'中山路街区附近的热粥选择。鸭肉、油条和卤味可以按食量配，适合逛街后吃一顿简单的夜宵。',
      dishes:['鸭肉粥：先选小碗，再看鸭肉和内脏配料。','油条：掰进粥里，适合两人分一根。'],
      pair:'两人各一碗粥，鸭肉与油条少量加；若刚吃过晚餐，可只分一碗。',
      tip:'这是大同路的“百成大同”，不要误导航到小学路的“浮屿大同”。照片为食客旧照，现场陈设可能变化。',
      source:'https://touch.travel.qunar.com/comment/10138575479',
      mapSource:'https://www.amap.com/place/B025002H44'
    },
    {
      id:'linsixi', area:'鼓浪屿', category:'闽南正餐', name:'林四喜·闽南传家菜（鼓浪屿店）', address:'厦门市思明区鼓浪屿龙头路300号',
      image:'assets/gallery/food-linsixi-2026.jpg', imageAlt:'林四喜鼓浪屿店门面实拍', photoLabel:'大众点评门店图 · 外景',
      summary:'龙头路上的坐席正餐备选。想在岛上停下来吃闽南菜，可以用沙茶锅和薄饼搭一顿，不必只靠沿街小吃。',
      dishes:['四喜沙茶锅：两人先问份量，适合配面或主食共享。','林家薄饼：想尝闽南薄饼时选一份。'],
      pair:'先选一份沙茶锅，再配薄饼或一道蔬菜；午后还要爬日光岩，避免点得过饱。',
      tip:'小红书评价有好有坏；国庆热门时段可先看候位和菜单，再决定是否入座。',
      source:'https://m.dianping.com/shop/131589144?msource=applemaps',
      mapSource:'https://www.amap.com/place/B0FFLBC538'
    },
    {
      id:'sibei-bread', area:'中山路', category:'厦门小吃', name:'思北特香包（第四市场店）', address:'厦门市思明区思明北路第四市场20之3号',
      image:'assets/gallery/food-sibei-bread-2026.jpg', imageAlt:'思北特香包门店夜间外景与顾客实拍', photoLabel:'旅行者实拍 · 门店外景',
      summary:'骑楼夜逛时可顺路买一只古早味大面包。刚出炉的特香包偏松软，适合两人分着尝或带回酒店。',
      dishes:['甜特香包：先问刚出炉时间，买一只分享。','其他糕点：现场看当天品项，不用为了凑单多买。'],
      pair:'两人买一只特香包即可；若晚餐已吃饱，可留到次日早餐。',
      tip:'第四市场20之3号，与思明北路同名分店核对后再导航；排队长就不必专程等。',
      source:'https://classic-blog.udn.com/visa520infinite/181727915',
      mapSource:'https://www.amap.com/place/B025003BWX'
    },
    {
      id:'sili-jinbang', area:'文灶', category:'厦门小吃', name:'四里沙茶面（金榜店）', address:'厦门市思明区金榜路151-2号',
      image:'assets/gallery/food-sili-jinbang-2026.jpg', imageAlt:'四里沙茶面金榜店门面及招牌实拍', photoLabel:'携程门店相册 · 金榜店外景',
      summary:'文灶以北的一碗沙茶面备选，适合想比较不同汤底的早午餐。店面照片上可见金榜店招牌。',
      dishes:['沙茶面：虾仁、豆腐或猪肝按口味少量加。','猪脚面：想换口味时先问当天供应。'],
      pair:'两人各点一碗面，各选两三种配料；下单前看加料价格。',
      tip:'金榜路151-2号，距文灶酒店仍需一段接驳；与湖滨四里老店不是同一地址。',
      source:'https://gs.ctrip.com/html5/you/foods/fooddetail/21/70454890.html',
      mapSource:'https://www.amap.com/place/B0HB6SMR7O'
    },
    {
      id:'xinaqiang', area:'中山路', category:'闽南正餐', name:'鑫阿强·姜母鸭阿强煎蟹（中山路总店）', address:'厦门市思明区思明东路78号',
      image:'assets/gallery/food-xinaqiang-2026.jpg', imageAlt:'鑫阿强思明东路78号门店夜间外景', photoLabel:'门店外景旧照',
      summary:'中山路往思明东路步行可到的闽南正餐。姜母鸭与煎蟹是招牌，更适合坐下来吃一顿完整晚餐。',
      dishes:['姜母鸭：先问半份和咸度。','阿强煎蟹：点前确认蟹的计价与重量。'],
      pair:'两人可选姜母鸭或煎蟹其中一道主菜，搭配青菜和主食；食量足再加菜。',
      tip:'配图是该址旧照，招牌可能变化；海鲜需先确认时价、重量和加工费。',
      source:'https://tw.trip.com/restaurant/china/xiamen/detail/ginger-duck-aqiang-fried-crabxinaqiang-30970890/', mapSource:'https://www.amap.com/place/B0FFGPFIHW'
    },
    {
      id:'taoxi', area:'中山路', category:'闽南正餐', name:'桃喜·老厦门私厨（中山路店）', address:'厦门市思明区思明南路118号',
      image:'assets/gallery/food-taoxi-2026.jpg', imageAlt:'桃喜老厦门私厨中山路店门口实拍', photoLabel:'旅行者实拍 · 门店外景',
      summary:'思明南路小巷里的闽南菜备选。姜母鸭之外还可点海鲜与清口小菜，适合想坐下来慢慢吃的晚上。',
      dishes:['姜母鸭：问清份量后再点。','白灼虾或时令海鲜：先确认当日价格。','水晶萝卜：搭配浓口主菜。'],
      pair:'两人一份姜母鸭、一道小菜和主食即可；如加海鲜，先看重量与总价。',
      tip:'门店外景为旅行者拍摄；从中山路主街拐入思明南路，按118号核对入口。',
      source:'https://m.dianping.com/discovery/2332508866', mapSource:'https://m.dianping.com/discovery/2332508866'
    },
    {
      id:'huangji-siguo', area:'文灶', category:'甜汤饮品', name:'黄记漳州四果汤（九中店）', address:'厦门市思明区后埭溪路84-117号',
      image:'assets/gallery/food-huangji-2026.jpg', imageAlt:'黄记漳州四果汤九中店招牌外景', photoLabel:'探店实拍 · 九中店外景',
      summary:'文灶一带的冰甜汤备选。刨冰上可配仙草、石花、豆类与手工丸子，适合午后消暑。',
      dishes:['漳州四果汤：先选喜欢的配料。','石花冻或仙草：想要清爽口感可加入。'],
      pair:'两人先分一碗，喜欢再加；正餐前少放糯米类配料。',
      tip:'九中店在后埭溪路，和中山路四果汤店不是同一处；节日营业以现场为准。',
      source:'https://www.sohu.com/a/560783260_411869', mapSource:'https://map.360.cn/shenghuo/detail?pguid=b580b3236e1669b6&src=pc_shenbian'
    },
    {
      id:'bapopo', area:'中山路', category:'甜汤饮品', name:'八婆婆烧仙草（中山路店）', address:'厦门市思明区太平路1-2-183号',
      image:'assets/gallery/food-bapopo-2026.jpg', imageAlt:'八婆婆烧仙草中山路店内饮品展示与点单区', photoLabel:'旅行者实拍 · 店内',
      summary:'逛骑楼时可外带一杯仙草饮。蜂蜜版偏清爽，奶茶版更浓郁，是当地常见的甜品饮品。',
      dishes:['蜂蜜烧仙草：适合想喝清爽甜口。','奶茶烧仙草：喜欢奶香可选，先问甜度。'],
      pair:'两人各选一个口味，先喝再决定是否加其他小吃。',
      tip:'烧仙草含多种配料，点单时可问冰量、甜度与坚果配料。',
      source:'https://tw.trip.com/restaurant/china/xiamen/detail/bapopo-11308557/'
    },
    {
      id:'diaoyuchuan-shapowei', area:'沙坡尾', category:'海鲜大餐', name:'打渔船厦门菜·正宗姜母鸭（沙坡尾店）',
      address:'沙坡尾片区（以大众点评门店定位为准；小红书笔记称“打渔船·老厦门本地菜·姜母鸭”）',
      image:'assets/gallery/food-diaoyuchuan-xhs-2026.jpg', imageAlt:'小红书探店实拍：打渔船的海鲜沙茶面与小菜', photoLabel:'小红书探店实拍 · 海鲜沙茶面',
      photoNote:'小红书探店实拍 · 海鲜沙茶面（笔记作者：糯米就是Nommy）',
      summary:'厦大、沙坡尾片区的海鲜与闽南菜备选。2026年9月的探店笔记记录了海鲜沙茶面；评论回复写出“打渔船·老厦门本地菜·姜母鸭”，大众点评检索到沙坡尾同品牌门店。',
      dishes:['海鲜沙茶面：虾、鲍鱼、鱿鱼等加料前先看价目。','姜母鸭：点前确认份量和套餐价。','清蒸波龙或酱油水海鲜：鲜货先称重，问清加工费。'],
      pair:'两人先分享一份海鲜沙茶面，再从姜母鸭或一道海鲜中选一份主菜；加菜前先问清计价方式。',
      tip:'核对时大众点评沙坡尾门店页显示约13,953条评价、人均约¥90；评分未能稳定确认，因此列作热门备选，不标为高分店。小红书互动热度不等于门店评分。',
      source:'https://www.xiaohongshu.com/search_result/6aaa0f5e000000001001e4fb?xsec_token=ABsbaxOhZ6BsCrmVOxFCCrhEnHvC0s5xAhasjh-OGLhd4=&xsec_source=',
      dianpingUrl:'https://www.dianping.com/shop/jDgraZ2KYLC8zGnk'
    },
    {
      id:'xinwutang-gingerduck', area:'中山路', category:'闽南正餐', name:'鑫坞堂姜母鸭·海鲜热炒（中山路总店）',
      address:'中山路镇邦路片区（以大众点评门店定位为准；小红书笔记称“鑫坞堂姜母鸭·闽菜香煎蟹”）',
      image:'assets/gallery/food-xinwutang-xhs-2026.jpg', imageAlt:'小红书探店实拍：鑫坞堂招牌姜母鸭', photoLabel:'小红书探店实拍 · 姜母鸭',
      photoNote:'小红书探店实拍 · 姜母鸭（笔记作者：吃不饱的苏大强）',
      summary:'中山路附近的姜母鸭备选。小红书探店笔记和评论讨论了门店、份量与菜品；大众点评检索到同一中山路总店。',
      dishes:['招牌姜母鸭：先问半份或最小份量。','香煎蟹：按当天价牌确认品种、重量和总价。','砂锅葱姜焗海鲜：与姜母鸭二选一，避免点多。'],
      pair:'两人先问姜母鸭最小份量，配米饭或一道青菜；如加海鲜，先确认时价、重量与加工费。',
      tip:'核对时大众点评约4.0分、人均约¥76，作为中山路备选更合适。小红书评论提到约68元的姜母鸭，并讨论对应半只还是整只；点单前先问清份量和价格，建议堂食。',
      source:'https://www.xiaohongshu.com/search_result/6a7b0980000000002500b3c3?xsec_token=ABcHs0C8VeVtY6P0DiaxI1Crx-YJSeC3UbNlkvFe43pCY=&xsec_source=',
      dianpingUrl:'https://m.dianping.com/shop/705493270?msource=applemaps'
    },
    {
      id:'chaisu-tusun-dong', area:'八市', category:'厦门小吃', name:'柴叔土笋冻（八市）',
      address:'八市开禾路片区，认“柴叔土笋冻”招牌；巷口摊位，以地图搜索结果为准',
      image:'assets/gallery/food-chaisu-xhs-1.jpg', imageAlt:'小红书实拍：柴叔土笋冻门店与土笋冻', photoLabel:'小红书实拍 · 土笋冻',
      photoNote:'小红书实拍 · 一杯冰美式、咩咩小探长',
      gallery:[
        {src:'assets/gallery/food-chaisu-xhs-1.jpg',alt:'柴叔土笋冻门店招牌与实物',caption:'小红书实拍 · 一杯冰美式'},
        {src:'assets/gallery/food-chaisu-xhs-2.jpg',alt:'柴叔土笋冻门店与双拼实物',caption:'小红书实拍 · 咩咩小探长'}
      ],
      summary:'八市里的闽南凉菜小吃。土笋冻口感爽弹，蒜蓉、醋汁与香菜可按喜好搭配；第一次尝试建议先买小份。',
      dishes:['土笋冻：先点小份，蒜蓉和醋汁按口味加。','海蜇皮或海蛎等其他凉菜：先看当日价签。'],
      pair:'两人分一小盒尝味即可，留胃口给后续热食。',
      tip:'两篇攻略都标出这家摊位；摊位营业、售罄时间和价格会变，早市信息以当天现场为准。',
      source:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=柴叔土笋冻&city=厦门',
      reviews:[
        {source:'小红书 · 一杯冰美式',date:'2026-02-13',title:'八市逛吃实地记录',summary:'笔记记录了摊位招牌、土笋冻实物和搭配方式；作者把它列作八市传统小吃，建议按个人接受度先少量尝。',url:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source='},
        {source:'小红书 · 咩咩小探长',date:'2026-01-30',title:'近期八市攻略补充',summary:'另一篇逛吃笔记也拍到同一招牌，并提到口感弹、酱汁和香菜搭配；属于个人体验，不代表平台评分。',url:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source='}
      ]
    },
    {
      id:'zhonglijun-manjian', area:'八市', category:'厦门小吃', name:'钟丽君满煎糕（八市）',
      address:'厦门市思明区开禾路30号附近',
      image:'assets/gallery/food-zhonglijun-xhs.jpg', imageAlt:'小红书实拍：钟丽君满煎糕', photoLabel:'小红书实拍 · 满煎糕',
      photoNote:'小红书实拍 · 一杯冰美式',
      gallery:[{src:'assets/gallery/food-zhonglijun-xhs.jpg',alt:'钟丽君满煎糕切面与馅料',caption:'小红书实拍 · 一杯冰美式'}],
      summary:'八市附近的闽南传统点心，现切的满煎糕外层松软，内馅带红糖与花生香。适合当作逛市场时的小份甜口。',
      dishes:['满煎糕：可选红糖、花生等口味，先买小块。','八市其他咸口小吃：建议与甜点错开吃。'],
      pair:'两人买一块分食，趁新鲜吃口感更好。',
      tip:'具体口味与出炉批次以当日柜台为准；平台评价样本有限，不用单篇高热度笔记代替门店评分。',
      source:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=钟丽君满煎糕&city=厦门',
      reviews:[{source:'小红书 · 一杯冰美式',date:'2026-02-13',title:'八市甜点实吃记录',summary:'作者描述糕体松软、红糖味明显，内馅存在感足；适合喜欢软糯甜口的人，甜度偏好不同可先买小份。',url:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source='}]
    },
    {
      id:'chenjia-dessert', area:'中山路', category:'甜汤饮品', name:'陈佳甜品（镇邦路店）',
      address:'厦门市思明区镇邦路65号',
      image:'assets/gallery/food-chenjia-xhs-1.jpg', imageAlt:'小红书实拍：陈佳甜品糖水与西多士', photoLabel:'小红书实拍 · 糖水',
      photoNote:'小红书实拍 · 一杯冰美式、今天也吃撑了捏',
      gallery:[
        {src:'assets/gallery/food-chenjia-xhs-1.jpg',alt:'陈佳甜品龟苓膏与西多士组合',caption:'小红书实拍 · 一杯冰美式'},
        {src:'assets/gallery/food-chenjia-xhs-2.jpg',alt:'陈佳甜品西多士近景',caption:'小红书实拍 · 今天也吃撑了捏'}
      ],
      summary:'镇邦路老甜品店，适合中山路逛街后坐下来歇一会。龟苓膏药苦回甘，西多士趁热更香；组合偏甜腻，适合分食。',
      dishes:['龟苓膏：苦味较明显，可按喜好加糖水或淡奶。','西多士：现炸趁热吃，建议一人半份。','杨枝甘露：想喝清爽甜汤时可先问当日供应。'],
      pair:'一份龟苓膏配一份西多士，两人分着吃；不嗜甜可只点龟苓膏。',
      tip:'个人反馈有口味差异；苦味较重的龟苓膏不一定适合所有人。',
      source:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=',
      dianpingUrl:'https://www.dianping.com/shop/546992',
      reviews:[
        {source:'小红书 · 一杯冰美式',date:'2026-02-13',title:'八市—中山路甜品体验',summary:'笔记中的糖水与炸西多士评价偏正面，描述口感顺滑、甜而不腻；可作为常规甜品口味参考。',url:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source='},
        {source:'小红书 · 今天也吃撑了捏',date:'2026-09-12',title:'龟苓膏与西多士实吃',summary:'近期体验认为西多士热吃更合适，龟苓膏保留明显苦味和回甘；喜欢清苦口感的人更容易接受。',url:'https://www.xiaohongshu.com/search_result/6aa552f10000000026016149?xsec_token=ABa8aqyAoplOLQ1oGslWCHKymN2bdhNFtdjlAvPWNcJmk=&xsec_source='}
      ]
    },
    {
      id:'haoxiang-pork-skewer', area:'中山路', category:'厦门小吃', name:'豪香里脊肉串（大中路店）',
      address:'厦门市思明区大中路1-2号附近',
      image:'assets/gallery/food-haoxiang-xhs.jpg', imageAlt:'小红书实拍：豪香里脊肉串', photoLabel:'小红书实拍 · 里脊肉串',
      photoNote:'小红书实拍 · 一杯冰美式',
      gallery:[{src:'assets/gallery/food-haoxiang-xhs.jpg',alt:'豪香里脊肉串现烤实物',caption:'小红书实拍 · 一杯冰美式'}],
      summary:'适合在中山路与八市之间买一份现烤肉串边走边吃。近期攻略提到肉串入味、外焦里嫩，适合作为路上加餐。',
      dishes:['里脊肉串：现烤趁热吃。','按食量少量购买，避免影响后续正餐。'],
      pair:'两人先买一份分食；如遇排队，附近替代小吃很多，不必久等。',
      tip:'Trip.com评价约4.5/5，但样本约15条，参考价值有限；门店座位和营业以現場为准。',
      source:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=豪香里脊肉串大中路店&city=厦门',
      reviews:[{source:'小红书 · 一杯冰美式',date:'2026-02-13',title:'八市沿线街头小吃',summary:'笔记拍到现烤里脊肉串，食客反馈腌制入味、烤后外焦里嫩；属于边走边吃的加餐型小吃。',url:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source='}]
    },
    {
      id:'jukou-noodles', area:'中山路', category:'厦门小吃', name:'局口拌面（思明南路店）',
      address:'厦门市思明区思明南路28号102',
      image:'assets/gallery/food-jukou-xhs.jpg', imageAlt:'小红书实拍：局口拌面与猪杂汤', photoLabel:'小红书实拍 · 拌面猪杂汤',
      photoNote:'小红书实拍 · 一杯冰美式',
      gallery:[{src:'assets/gallery/food-jukou-xhs.jpg',alt:'局口拌面与猪杂汤实拍',caption:'小红书实拍 · 一杯冰美式'}],
      summary:'思明南路上的拌面小店，常见搭配是花生酱拌面与猪杂汤。味道偏浓，适合需要正经吃一顿的中午。',
      dishes:['花生酱拌面：酱香较浓，趁热拌匀。','猪杂汤：与面搭配，先确认当日供应。'],
      pair:'两人点一份拌面、一碗汤共享；更饿时再加主食。',
      tip:'点评与地图评价数量和分店标注可能变化；定位前核对“思明南路店”，到店看菜单和卫生情况。',
      source:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=局口拌面思明南路店&city=厦门',
      reviews:[{source:'小红书 · 一杯冰美式',date:'2026-02-13',title:'经典面汤组合',summary:'食客把花生酱拌面和猪杂汤作为一组推荐，反馈面条有嚼劲、汤味鲜；适合喜欢浓酱和内脏汤的人。',url:'https://www.xiaohongshu.com/search_result/698f2152000000000d00b35c?xsec_token=ABwj1b33SJJeXiHVtZQN2giIdzDIIlyodMCFC7yZh0xUU=&xsec_source='}]
    },
    {
      id:'laosixi-egg-burger', area:'中山路', category:'厦门小吃', name:'林记老思西鸡蛋汉堡',
      address:'思明西路山仔顶巷内；地图平台门牌号不一致，按店名定位后核对',
      image:'assets/gallery/food-laosixi-xhs-1.jpg', imageAlt:'小红书实拍：老思西鸡蛋汉堡现煎过程', photoLabel:'小红书实拍 · 鸡蛋汉堡',
      photoNote:'小红书实拍 · 老思西鸡蛋汉堡',
      gallery:[
        {src:'assets/gallery/food-laosixi-xhs-1.jpg',alt:'老思西鸡蛋汉堡打包实物',caption:'小红书实拍 · 鸡蛋汉堡到手实物'},
        {src:'assets/gallery/food-laosixi-xhs-2.jpg',alt:'老思西鸡蛋汉堡现煎过程',caption:'小红书实拍 · 现煎过程'}
      ],
      summary:'老巷里的现煎鸡蛋汉堡，鸡蛋、肉馅与酱料叠在一起，适合当作轻食或路上加餐。摊位位置不显眼，店名搜索结果可能指向不同门牌。',
      dishes:['鸡蛋汉堡：现做趁热吃，可按喜好选酱。','先买一个尝味，再决定是否加量。'],
      pair:'一人一个即可，附近巷道狭窄，建议打包后在不挡路处食用。',
      tip:'Trip.com约4.0/5、仅5条评价；地址在平台间存在差异，出发前再次核对定位。',
      source:'https://www.xiaohongshu.com/search_result/6ab0b1f7000000000d027875?xsec_token=ABsFXiatFLXc4WmYEM1JHPVp2J-cxwE61Lsw-rTVdfhe0=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=林记老思西鸡蛋汉堡&city=厦门',
      reviews:[
        {source:'小红书 · 近期探店',date:'2026-09-21',title:'老巷现煎小吃体验',summary:'笔记记录了现煎过程与打包实物，作者把它作为小时候风味的街头小吃；门店环境和座位较简单。',url:'https://www.xiaohongshu.com/search_result/6ab0b1f7000000000d027875?xsec_token=ABsFXiatFLXc4WmYEM1JHPVp2J-cxwE61Lsw-rTVdfhe0=&xsec_source='},
        {source:'Trip.com食客评价',date:'近期评价汇总',title:'少量点评参考',rating:'约4.0/5 · 5条',summary:'少量评价提到现做、肉馅足和外酥内软，也有人觉得外壳偏硬；样本很小，仅作口味参考。',url:'https://us.trip.com/restaurant/china/xiamen/detail/restaurant-31213424/'}
      ]
    },
    {
      id:'daixifu-gingerduck', area:'八市', category:'闽南正餐', name:'戴熹福厦门菜·姜母鸭（八市店）',
      address:'八市开禾路片区；地图搜索门店名确认具体入口',
      image:'assets/gallery/food-daixifu-xhs.jpg', imageAlt:'小红书实拍：戴熹福八市店姜母鸭与厦门菜', photoLabel:'小红书实拍 · 姜母鸭',
      photoNote:'小红书实拍 · 咩咩小探长',
      gallery:[{src:'assets/gallery/food-daixifu-xhs.jpg',alt:'戴熹福姜母鸭、煎蟹和五香酥拼图',caption:'小红书实拍 · 咩咩小探长'}],
      summary:'八市里的姜母鸭与闽南菜选择。攻略同时记录了姜母鸭、煎蟹和五香酥，适合想坐下来吃热菜的一餐。',
      dishes:['姜母鸭：先问人数对应份量与价格。','煎蟹：按时价确认品种、重量和加工费。','五香酥：可作为共享小菜。'],
      pair:'两人先选姜母鸭或煎蟹作主菜，再加一份五香酥和米饭；海鲜先问清总价。',
      tip:'笔记称该店为八市老店，但营业年限未独立核实；不展示平台高分，国庆到店前请核对营业和点单价格。',
      source:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=戴熹福厦门菜姜母鸭八市店&city=厦门',
      reviews:[{source:'小红书 · 咩咩小探长',date:'2026-01-30',title:'八市姜母鸭与闽南菜实吃',summary:'攻略记录姜母鸭、煎蟹和五香酥，作者认为价格与口味适合本地家常菜一餐；点海鲜时建议现场确认时价。',url:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source='}]
    },
    {
      id:'laobashi-fried', area:'八市', category:'厦门小吃', name:'老八市手作炸货铺',
      address:'八市开禾路市场片区，招牌写“老八市手作炸货铺”',
      image:'assets/gallery/food-laobashi-fried-xhs.jpg', imageAlt:'小红书实拍：老八市手作炸货铺门店与炸物', photoLabel:'小红书实拍 · 闽南炸货',
      photoNote:'小红书实拍 · 咩咩小探长',
      gallery:[{src:'assets/gallery/food-laobashi-fried-xhs.jpg',alt:'老八市手作炸货铺门面与炸货',caption:'小红书实拍 · 咩咩小探长'}],
      summary:'八市现场制作的闽南炸物摊，适合逛市场途中买一盒分享。攻略提到沙茶里脊串、炸醋肉和蒜香排骨。',
      dishes:['沙茶里脊串：趁热吃，按辣度选调味。','炸醋肉：酸香咸口。','蒜香排骨：建议与同伴分享一份。'],
      pair:'两人选两种炸物分着尝，刚出锅较烫，先稍放凉。',
      tip:'定位以现场招牌为准，路边摊营业时段与菜单可能调整；攻略是单次到访体验。',
      source:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=老八市手作炸货铺&city=厦门',
      reviews:[{source:'小红书 · 咩咩小探长',date:'2026-01-30',title:'八市现炸小吃记录',summary:'作者在摊位现场拍到炸制过程，推荐沙茶里脊串、炸醋肉和蒜香排骨；适合偏爱热炸物的人。',url:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source='}]
    },
    {
      id:'hengzhu-steamed-bun', area:'八市', category:'厦门小吃', name:'横竹路小笼包（无名摊）',
      address:'厦门市思明区横竹路35号附近，摊位无明显店名',
      image:'assets/gallery/food-hengzhu-buns-xhs.jpg', imageAlt:'小红书实拍：横竹路无名小笼包摊位与汤包', photoLabel:'小红书实拍 · 小笼包',
      photoNote:'小红书实拍 · 咩咩小探长',
      gallery:[{src:'assets/gallery/food-hengzhu-buns-xhs.jpg',alt:'横竹路小笼包摊位与现蒸汤包',caption:'小红书实拍 · 咩咩小探长'}],
      summary:'八市横竹路入口附近的街坊小摊，现蒸小笼包配猪心汤，适合想简单吃点早餐的人。店面朴素，按街道地址寻找。',
      dishes:['小笼包：现蒸出笼时小心汤汁烫口。','猪心汤：笔记记录为常见搭配，供应以现场为准。'],
      pair:'两人先点一笼包子和一碗汤共享，再按食量加点。',
      tip:'没有确认到正式店名或平台评分；帖子描述环境简单、价格亲民，适合把街坊小摊当作轻量备选。',
      source:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=横竹路35号小笼包&city=厦门',
      reviews:[{source:'小红书 · 咩咩小探长',date:'2026-01-30',title:'街坊小摊实吃记录',summary:'作者在横竹路入口拍到摊位和包子，评价现蒸口感不错、猪心汤可搭配；同时提醒摊位环境简陋，没有网络店名。',url:'https://www.xiaohongshu.com/search_result/697c793d0000000022039a0f?xsec_token=AB_yT2-08-ioEDhBorAr5b60IBMIya9p_T9r93umOTwpc=&xsec_source='}]
    },
    {
      id:'danmanguan-gulangyu', area:'鼓浪屿', category:'厦门小吃', name:'蛋满灌·非遗手工灌蛋（龙头路店）',
      address:'厦门市思明区鼓浪屿龙头路175号',
      image:'assets/gallery/food-danmanguan-xhs.jpg', imageAlt:'小红书实拍：鼓浪屿蛋满灌手工灌蛋', photoLabel:'小红书实拍 · 手工灌蛋',
      photoNote:'小红书实拍 · 明天吃什么',
      gallery:[{src:'assets/gallery/food-danmanguan-xhs.jpg',alt:'鼓浪屿蛋满灌与汤品实拍',caption:'小红书实拍 · 明天吃什么'}],
      summary:'龙头路的闽南手工灌蛋小吃，把肉馅灌入鸡蛋后煮成汤食。可作为鼓浪屿步行间隙的热食体验，份量不大。',
      dishes:['手工灌蛋：尝一碗原味汤，留意肉馅与蛋的口感。','鱼丸汤或其他小吃：先看当天菜单和价格。'],
      pair:'一碗灌蛋两人分着尝，想吃饱再搭配一份主食。',
      tip:'Trip.com约4.2/5、142条评价；属于游客集中街区，可能排队且座位有限。',
      source:'https://www.xiaohongshu.com/search_result/6a3a529c00000000220090e6?xsec_token=ABmXa5cXIyYtjMlAY5gFhtxeK5_h_HSE7PkJUs3NKk2xc=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=蛋满灌非遗手工灌蛋龙头路店&city=厦门',
      reviews:[
        {source:'小红书 · 明天吃什么',date:'2026-06-23',title:'鼓浪屿上岛逛吃记录',summary:'攻略照片标注了蛋满灌，展示灌蛋切面和汤品；适合想尝传统手艺小吃的游客，建议错开人多时段。',url:'https://www.xiaohongshu.com/search_result/6a3a529c00000000220090e6?xsec_token=ABmXa5cXIyYjMlAY5gFhtxeK5_h_HSE7PkJUs3NKk2xc=&xsec_source='},
        {source:'Trip.com食客评价',date:'近期评价汇总',title:'大众游客评价参考',rating:'约4.2/5 · 142条',summary:'评价中常见反馈是灌蛋制作有特色、汤底清淡；也有游客提到店内空间紧凑，适合把它作为小吃而非完整正餐。',url:'https://gs.ctrip.com/html5/you/foods/fooddetail/21/8638661.html'}
      ]
    }
  );
})();
