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
    const localPhotos = item.localPhotos || [];
    const gallery = localPhotos.map((photo, index) => ({
      src: photo.path,
      alt: `${item.name} · 实拍视角 ${index + 1}`,
      caption: `${photoProvider} · 实拍视角 ${index + 1}`
    }));
    return {id, area, category, name:item.name, address:item.address, image:localPhotos[0]?.path || '', imageAlt:`${item.name} · ${photoProvider}`, photoLabel:photoProvider, gallery, reviews:item.reviews || [], summary, dishes, pair, tip, source:id === 'yanyu' ? 'https://www.sohu.com/a/278969973_100287523' : item.source, sourceLabel:'查看门店相册与食客点评 ↗', showPhotoLink:true};
  };
  window.XiamenExtraFoods = [
    food('yuehua','中山路','厦门小吃','镇邦路上的沙茶面小店，适合中山路散步前后补一顿热食。浓香汤底配自己选的料，点一碗就能吃得满足。',['沙茶面：选豆干、鱼丸，再加一种喜欢的荤料。','炸五香：两人分一份，趁热吃。','烧肉粽：想换主食时可与面二选一。'],'两人各一碗少量加料的面，五香卷共享即可。','适合简餐；加料前看价签，饭点留出等位时间。'),
    food('huangzehe','中山路','甜汤饮品','逛中山路时的一站甜口休息。花生汤偏甜，喜欢软糯口感可以试试，正餐后两人分着尝更轻松。',['花生汤：先选原味或加蛋。','五香卷：配甜汤的小份咸口。','面线糊：想吃热主食时再加。'],'一份花生汤加一份小吃先尝，觉得合口味再追加。','中山路22—24号；口味偏甜，不喜欢加蛋可点单时说明。'),
    food('minhenan','万象城','闽南正餐','适合想坐下来好好吃一顿、又想避开户外炎热的时段。以闽南风味组合一餐，可作为雨天或文灶附近活动后的备选。',['侨乡葱茸包：带甜咸风味的小点。','花雕酒醉河田鸡：按人数选合适份量。','白萝卜饭：与主菜搭配，少点一份其他主食。'],'鸡肉主菜、一道蔬菜和萝卜饭，葱茸包少量尝鲜。','万象城3楼328；从文灶前往可考虑打车或地铁至湖滨东路站。热门饭点提前取号。'),
    food('yanyu','万象城','闽南正餐','福建菜配现代餐厅环境，适合留一段完整晚餐时间。相比边走边吃，这里更适合两人坐下来分享菜品。',['葱油肉汁焗荔浦芋头：软糯口感的招牌选择。','泉州牛排：想吃肉菜时可选。','大红袍鲜奶布丁：留一点胃口给茶味甜点。'],'一道肉菜、一份芋头或青菜，再配主食；甜点共享。','万象城L3-27。菜单会更新，点单前看看当前供应和份量。'),
    food('wutang','沙坡尾','厦门小吃','民族路上的沙茶面选择，适合把午餐安排在厦港一带时顺路去。汤底浓，海鲜和豆干可按口味搭配。',['沙茶面配鱿鱼：先确认当日加料价格。','海蛎与豆干：鲜味与吸汤口感搭配。','米血或鱼丸：按食量选一两样即可。'],'每人一碗面、每碗两三种料，避免一次加太多。','民族路76号，距沙坡尾需再步行一段；更适合早餐或午餐，勿默认晚间营业。'),
    food('yubao','沙坡尾','厦门小吃','大学路上可以轻量尝鲜的一站。芋包的芋香外皮配咸口内馅，适合逛沙坡尾中途垫垫肚子。',['芋包：先点一份，两人分着尝。','海蛎汤：配芋包作为轻食。','鱼丸汤：不吃海蛎时可换这一碗。'],'一份芋包加两碗汤，或每人一份芋包；吃完再决定是否加餐。','大学路91号，适合沙坡尾散步中途停留；芋包较顶饱，正餐前少量尝鲜。'),
  ];
  const yuehua = window.XiamenExtraFoods.find(item => item.id === 'yuehua');
  if (yuehua) {
    yuehua.gallery.push({src:'https://www.woshiji.cn/uploadfile/2023/0905/20230905013442743.jpg',alt:'蜗食记食客拍摄的月华沙茶面镇邦路门店',caption:'蜗食记食客实拍 · 镇邦路门店'});
    yuehua.reviews = [...(yuehua.reviews || []),
      {source:'携程食客点评',date:'2022-02-05',rating:'4/5',title:'海鲜沙茶面用料丰富',summary:'食客觉得沙茶面种类多、海鲜口味更好，环境和服务也不错；这是中山路店的旧评价，价格不作当前参考。',url:'https://you.ctrip.com/food/xiamen21/5158527-dianpingCategory5.html'},
      {source:'携程食客点评',date:'2022-01-15',rating:'5/5',title:'老字号与新鲜选料',summary:'另一位食客称招牌沙茶面好吃、选料新鲜。不同食客对汤底浓淡感受不同，建议先按个人口味选择加料。',url:'https://you.ctrip.com/food/xiamen21/5158527-dianpingCategory5.html'}
    ];
  }
  const huangzehe = window.XiamenExtraFoods.find(item => item.id === 'huangzehe');
  if (huangzehe) {
    huangzehe.gallery.push(
      {src:'https://ak-d.tripcdn.com/images/1mi1p12000h2xwjdhD036.jpg?proc=source%2Ftrip',alt:'Trip.com旅行者实拍黄则和中山路店内柜台',caption:'Trip.com旅行者实拍 · 中山路店'},
      {src:'https://ak-d.tripcdn.com/images/1mi5r224x955i1ydk6509.jpg?proc=source%2Ftrip',alt:'Trip.com旅行者实拍黄则和花生汤',caption:'Trip.com旅行者实拍 · 花生汤'}
    );
    huangzehe.reviews = [...(huangzehe.reviews || []),
      {source:'携程食客点评',date:'2024-05-26',rating:'5/5',title:'花生汤和海蛎羹',summary:'食客觉得花生汤软糯，另外点了海蛎羹，评价鲜嫩；同一餐也尝了姜母鸭。单次体验不代表每道菜都适合所有人口味。',url:'https://you.ctrip.com/food/xiamen21/319796.html'},
      {source:'携程食客点评',date:'2023-09-01',rating:'4/5',title:'甜汤适合喜欢软糯口感的人',summary:'食客喜欢热花生汤，也提到店内生意忙时服务一般；另一位评价认为花生汤偏甜、烧卖偏油，说明甜度和炸物油感的接受度有差异。',url:'https://you.ctrip.com/food/xiamen21/319796.html'}
    ];
  }
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
      gallery:[
        {src:'assets/gallery/food-qingjun-bao-3.jpg',alt:'庆君汤包店铺相册中的汤包与汤品',caption:'现有庆君汤包实拍'},
        {src:'https://ak-d.tripcdn.com/images/1mh1b12000c812am65F36_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'Trip.com食客上传的庆君汤包实拍',caption:'Trip.com食客实拍 · 庆君汤包'},
        {src:'https://ak-d.tripcdn.com/images/0104f120009kxzqr9D9BE_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'Trip.com食客上传的庆君汤包第二张实拍',caption:'Trip.com食客相册 · 庆君汤包'}
      ],
      summary:'文灶附近的汤包和拌面选择，适合抵达夜或返程前吃一顿热乎的简餐。',
      dishes:['原香味或蟹黄汤包：先点一笼，留意汤汁烫口。','拌面或酸笋豆腐汤：两人择一搭配。'],
      pair:'一笼汤包配一份拌面或汤共享，按当天胃口加点。',
      tip:'店铺页面列出的汤包、拌面与酸笋汤可作点单参考；节日期间营业以门店为准。',
      reviews:[
        {source:'携程食客评价',date:'2023-09-23',rating:'4/5',title:'蟹黄汤包、拌面与酸笋豆腐汤',summary:'食客评价店内整洁、上菜快；蟹黄汤包皮薄汤足，花生酱拌面香，酸笋豆腐汤够味。评论也提醒汤包刚上桌时很烫。',url:'https://you.ctrip.com/food/21/7105787.html'},
        {source:'携程食客评价',date:'2021-11-12',rating:'5/5',title:'晚餐时段人气较高',summary:'一位回访食客推荐原味与蟹黄汤包、酸笋豆腐汤和自制辣酱，并提到饭点常排队；节假日建议留出等候时间。',url:'https://you.ctrip.com/food/21/7105787.html'}
      ],
      source:'https://you.ctrip.com/food/21/7105787.html', sourceLabel:'查看门店相册与食客点评 ↗', showPhotoLink:true
    },
    {
      id:'xiaoyanjing', area:'文灶', category:'海鲜大餐', name:'小眼镜大排档（湖滨中路店）', address:'厦门市思明区湖滨中路7号',
      image:'assets/gallery/food-xiaoyanjing-1.jpg', imageAlt:'小眼镜大排档湖滨中路店门面实拍', photoLabel:'湖滨中路店实拍',
      gallery:[
        {src:'assets/gallery/food-xiaoyanjing-1.jpg',alt:'小眼镜大排档湖滨中路店门面实拍',caption:'现有湖滨中路店门面实拍'},
        {src:'https://ak-d.tripcdn.com/images/100r050000000m8x7C7A8.jpg?proc=source%2Ftrip',alt:'Trip.com旅客上传的小眼镜大排档汇成总店门面照片',caption:'Trip.com旅客实拍 · 汇成总店门面'}
      ],
      summary:'文灶附近的海鲜大排档备选，适合想坐下来吃酱油水海鲜和炒面线的晚上。',
      dishes:['酱油水海鲜：按当天鲜货选鱼或鱿鱼。','炒面线与时蔬：给海鲜配一份主食和青菜。'],
      pair:'两人选一道海鲜主菜、一份青菜和炒面线；点单前看清重量、加工方式和总价。',
      tip:'照片是湖滨中路门面旧照，招牌与现场可能变化；营业和鲜货以当日为准。',
      reviews:[
        {source:'大众点评门店评分',date:'2026-09-28',rating:'4.5/5 · 21,621条评价',title:'门店综合评分参考',summary:'大众点评当前检索到湖滨中路汇成总店评分4.5/5。这里展示平台汇总分，不把它当作单条食客评语。',url:'https://www.dianping.com/shop/k1E5jbsQYdlETttn'},
        {source:'Tripadvisor食客评价',date:'2018',title:'排队与点菜体验',summary:'一位周日晚到访者称两人约等半小时，认为海鲜值得尝、菜单标价清楚；同时觉得饮品选择少、茶味淡。该评论较旧，节假日等位可能更久。',url:'https://cn.tripadvisor.com/Restaurant_Review-g297407-d3494940-Reviews-XiaoYan_Jing_DaPai_Dang_HuBin_Middle_Road-Xiamen_Fujian.html'},
        {source:'高德地图用户评价',date:'2016-05-03',rating:'4.4/5',title:'较早的到店反馈',summary:'早期评论提到菜品味道不错、两人消费约180元；年代较久，价格信息不作当前参考。',url:'https://www.amap.com/place/B025003TAE'}
      ],
      source:'https://4travel.jp/os_shisetsu/10440355', sourceLabel:'查看到店照片与点评 ↗', showPhotoLink:true
    },
    {
      id:'yishuyiye', area:'中山路', category:'甜汤饮品', name:'一树一叶（思北店）', address:'厦门市思明区厦禾路296-135-1号',
      image:'assets/gallery/food-yishuyiye-1.jpg', imageAlt:'一树一叶福建鲜奶茶品牌门店实拍', photoLabel:'品牌门店实拍 · 非思北店',
      gallery:[
        {src:'assets/gallery/food-yishuyiye-1.jpg',alt:'一树一叶同品牌门店环境实拍（非思北店）',caption:'品牌门店环境 · 非思北店'},
        {src:'assets/gallery/food-yishuyiye-xhs-2026.jpg',alt:'小红书实拍：一树一叶茉莉野山楂饮品',caption:'小红书实拍 · 沙坡尾笔记记录的品牌饮品'}
      ],
      summary:'以福建茶做鲜奶茶和果茶，八市与中山路之间想喝一杯时可作为顺路备选。',
      dishes:['茉莉青乌龙：偏清爽的茶香选择。','闽南茶底鲜奶茶：想喝奶香时先选低糖。'],
      pair:'两人各点一杯不同茶底，少糖更容易尝出茶味。',
      tip:'配图包括同品牌门店环境和一篇沙坡尾笔记中的饮品，均不能当作思北分店实景；出发前按店名和厦禾路门牌核实营业。',
      reviews:[{source:'小红书 · 豆本豆',date:'2026-09-06',title:'茉莉野山楂饮品实喝',summary:'作者写到在沙坡尾喝到茉莉野山楂，觉得山楂酸感、淡淡茉莉香与咸奶盖搭配清爽，杯底有阿达子；这是单次口味体验，具体配方和门店分店未核对。',url:'https://www.xiaohongshu.com/explore/6a9cfec9000000002900c0a7?xsec_token=ABExRroS6EBOzKMCt1JVcO48chrMOGTB8x5t4TOex1eug='}],
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
      dianpingUrl:'https://m.dianping.com/shop/705493270?msource=applemaps',
      reviews:[
        {source:'小红书 · 知食分子',date:'2026-09-15',title:'姜母鸭与闽菜实吃记录',summary:'作者把这家列作自己偏爱的姜母鸭之一，提到鸭肉入味、姜香明显，并推荐香煎膏蟹、焗鳗鱼等菜。评论区有人认同，也有食客反馈外带品质不稳、出现酸味；口味和体验分歧较大，建议堂食并先确认份量。',url:'https://www.xiaohongshu.com/search_result/6aa916f60000000026021c1f?xsec_token=AB-CXzSJcbaqzEyBKjMx13yYqCkouxaez8AcNBMSGk0Dk=&xsec_source='}
      ]
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
    },
    {
      id:'zhengyoucai-casserole-congee', area:'中山路', category:'海鲜大餐', name:'郑有财海鲜砂锅粥（中山路店）',
      address:'厦门市思明区镇邦路28号',
      image:'assets/gallery/food-zhengyoucai-xhs-1.jpg', imageAlt:'小红书实拍：郑有财海鲜砂锅粥及多道菜品', photoLabel:'小红书食客实拍 · 海鲜与砂锅粥',
      gallery:[
        {src:'assets/gallery/food-zhengyoucai-xhs-1.jpg',alt:'郑有财海鲜砂锅粥一桌菜品实拍',caption:'小红书实拍 · 一桌菜品'},
        {src:'assets/gallery/food-zhengyoucai-xhs-2.jpg',alt:'郑有财豆豉焗海鲜菜品实拍',caption:'小红书实拍 · 豆豉焗海鲜'},
        {src:'assets/gallery/food-zhengyoucai-xhs-3.jpg',alt:'郑有财海鲜粥锅内实拍',caption:'小红书实拍 · 砂锅海鲜粥'},
        {src:'assets/gallery/food-zhengyoucai-xhs-4.jpg',alt:'郑有财海鲜与闽南菜实拍，画面含门店点菜单',caption:'小红书实拍 · 海鲜与小炒'}
      ],
      summary:'镇邦路上的砂锅粥与闽南海鲜餐馆。笔记作者称自己多次回访，也带父母到店；适合把它作为中山路晚餐或多人分享的一餐。',
      dishes:['海鲜砂锅粥：现熬等待较久，点单时确认份量。','豆豉焗鳗鱼：近期笔记多次提到。','海蛎煎、干煎鸡：可按人数加一道小菜。'],
      pair:'两人先点一锅粥和一道小菜；海鲜按当日菜单确认品种、重量与价格，避免按照片估份量。',
      tip:'两篇近期笔记都指向镇邦路这家店；评论有“好吃”和对打包费用、口味的不同反馈。照片来自单次食客记录，不代表当前菜价或平台评分。',
      source:'https://www.xiaohongshu.com/search_result/69fb2b7e0000000038036c71?xsec_token=ABl10pt4hSUL3RM9HaaKmH9MMfOOop3jSd6KjM5SJCzIY=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=郑有财海鲜砂锅粥镇邦路28号&city=厦门',
      reviews:[
        {source:'小红书 · 饼子',date:'2026-05-06',title:'多次回访的海鲜与砂锅粥',summary:'作者说多次到店并带朋友来，记录了豆豉焗鳗鱼、干煎鸡、海蛎煎和虾粥等菜。评论区有人反馈晚上到店好吃，也有人不喜欢打包收费；食材和计价以现场为准。',url:'https://www.xiaohongshu.com/search_result/69fb2b7e0000000038036c71?xsec_token=ABl10pt4hSUL3RM9HaaKmH9MMfOOop3jSd6KjM5SJCzIY=&xsec_source='},
        {source:'小红书 · 无语的果冻',date:'2026-07-10',title:'中山路砂锅粥回访',summary:'作者写到这家粥店已来回吃过五六次，提到螃蟹、虾粥和砂锅小炒；评论里也有读者表示到店后觉得不错。属于个人回访体验，不是平台评分。',url:'https://www.xiaohongshu.com/search_result/6a50f57f000000001c024887?xsec_token=ABrxMINFaGxx-gHk_Vk1Erckl76OM3wYqIpWFOCL7pMoI=&xsec_source='}
      ]
    },
    {
      id:'thickbinyou-braised-rice', area:'沙坡尾', category:'台式小吃', name:'厚彬友·台湾卤肉饭',
      address:'厦门市思明区沙坡尾交叉口附近（按地图搜索店名核对入口）',
      image:'assets/gallery/food-thickbinyou-xhs-1.jpg', imageAlt:'小红书实拍：厚彬友卤肉饭门头与台式小吃', photoLabel:'小红书食客实拍 · 门店与菜品',
      gallery:[
        {src:'assets/gallery/food-thickbinyou-xhs-1.jpg',alt:'厚彬友卤肉饭门头实拍',caption:'小红书实拍 · 门头'},
        {src:'assets/gallery/food-thickbinyou-xhs-2.jpg',alt:'厚彬友卤肉饭实物近景',caption:'小红书实拍 · 卤肉饭'},
        {src:'assets/gallery/food-thickbinyou-xhs-3.jpg',alt:'厚彬友台式香肠实拍',caption:'小红书实拍 · 台式香肠'}
      ],
      summary:'沙坡尾交叉口一带的台式小吃店，适合在厦港散步时吃简餐。近期探店笔记对卤肉饭和刈包评价较好，对汤、臭豆腐和鸭血评价普通。',
      dishes:['卤肉饭：作者反馈咸甜口，适合配米饭。','刈包：笔记评价较好，可与卤肉饭二选一。','台式香肠：适合加作小份分享。'],
      pair:'两人可各选卤肉饭或刈包，再加一份小吃；店内桌位不多，遇排队可打包。',
      tip:'探店笔记记录约4张桌、用餐空间紧凑；价格和营业时段会变化，地址入口请按地图店名复核。',
      source:'https://www.xiaohongshu.com/search_result/69fe131c000000003502a603?xsec_token=ABn7ASltxMykLvu9NMUQ9plTHH0RG-NWj_SfPVSolF_-c=&xsec_source=',
      mapUrl:'https://uri.amap.com/search?keyword=厚彬友台湾卤肉饭&city=厦门',
      reviews:[{source:'小红书 · 阿文未完成的世界旅行',date:'2026-05-09',title:'台式卤肉饭实吃反馈',summary:'作者觉得卤肉饭和刈包值得点，卤肉偏咸甜；汤品普通，臭豆腐和鸭血的味道不够突出，四神汤带一点苦味。店里座位较少，笔记称沙坡尾交叉口附近，属于一篇个人实吃评价。',url:'https://www.xiaohongshu.com/search_result/69fe131c000000003502a603?xsec_token=ABn7ASltxMykLvu9NMUQ9plTHH0RG-NWj_SfPVSolF_-c=&xsec_source='}]
    }
  );
  window.XiamenExtraFoods.push({
    id:'menglinxi-shaojiu', area:'文灶', category:'闽南正餐', name:'梦林夕烧酒档',
    address:'厦门市思明区后埭溪路105号附近（各平台门牌标注有差异）',
    image:'https://ak-d.tripcdn.com/images/1mi1w224x8w4h2t380A85_R_600_400_R5_Q90.jpg?proc=source%2Ftrip',
    imageAlt:'Trip.com旅行者实拍的文灶林夕烧酒档门头', photoLabel:'Trip.com旅行者实拍 · 文灶店',
    gallery:[
      {src:'https://ak-d.tripcdn.com/images/1mi1w224x8w4h2t380A85_R_600_400_R5_Q90.jpg?proc=source%2Ftrip',alt:'Trip.com旅行者实拍的林夕烧酒档门头',caption:'Trip.com旅行者实拍 · 林夕烧酒档门头'},
      {src:'https://ak-d.tripcdn.com/images/1mi0p224x8w4f0c4c4E8F_W_200_0_R5_Q50.jpg?proc=source%2Ftrip',alt:'Trip.com旅行者相册中的林夕烧酒档照片',caption:'Trip.com旅行者相册实拍'},
      {src:'https://ak-d.tripcdn.com/images/1mi54224x8w4hhpy06AF4_W_200_0_R5_Q50.jpg?proc=source%2Ftrip',alt:'Trip.com旅行者相册中的林夕烧酒档第二张照片',caption:'Trip.com旅行者相册实拍'}
    ],
    summary:'文灶后埭溪路的闽南烧酒档，离住宿片区近，适合晚餐吃海鲜和家常热菜。近期小红书仍有店名明确的探店笔记；可读取的食客评论推荐皮皮虾与炸鳗鱼。',
    dishes:['皮皮虾：旅行者实评提到虾肉鲜甜，按当天鲜货和价格确认。','炸鳗鱼：评论者喜欢酥脆口感，趁热分享。','其他海鲜与闽南菜：看当日水牌，点单前确认重量和总价。'],
    pair:'两人先选一道海鲜主菜，再搭配炸鳗鱼或青菜与米饭；海鲜先让店员报重量和总价。',
    tip:'大众点评、高德与携程对门牌分别标作后埭溪路105-101、105-104、105-108附近，写法不一致；地图搜“梦林夕烧酒档”并现场核对。小红书9月24日、27日仍有新笔记，但详情页暂无法读取，未据标题扩写菜品评价。',
    source:'https://www.xiaohongshu.com/search_result/6ab8010a000000001b02c2b8?xsec_token=ABe_xEllw8dMu28xxcYSEddFEEnvESKP6lNGm55FzwDpk=&xsec_source=',
    mapUrl:'https://uri.amap.com/search?keyword=梦林夕烧酒档后埭溪路105号&city=厦门',
    dianpingUrl:'https://www.dianping.com/shop/l5la92Ek3ZooBixA',
    reviews:[
      {source:'大众点评门店评分',date:'2026-09-28',rating:'4.5/5 · 8,109条评价',title:'文灶店综合口碑参考',summary:'大众点评按“梦林夕烧酒档”检索到后埭溪路门店，当前评分4.5/5。此为平台汇总分，不代表每位食客的个人留言。',url:'https://www.dianping.com/shop/l5la92Ek3ZooBixA'},
      {source:'Trip.com旅行者实评',date:'2024-08-29',title:'皮皮虾、炸鳗鱼与排队号',summary:'作者由当地朋友带路，推荐皮皮虾和炸鳗鱼，喜欢后者酥脆的口感；饭点现场取号且排队较多，建议早点到。',url:'https://tw.trip.com/moments/detail/xiamen-21-124020997/'}
    ]
  });

  const foodById = id => window.XiamenExtraFoods.find(food => food.id === id);
  function appendReviews(id, reviews) {
    const food = foodById(id);
    if (food) food.reviews = [...(food.reviews || []), ...reviews];
  }
  function appendPhotos(id, photos) {
    const food = foodById(id);
    if (!food) return;
    if (!Array.isArray(food.gallery)) {
      food.gallery = food.image ? [{
        src: food.image,
        alt: food.imageAlt || food.name,
        caption: food.photoNote || food.photoLabel || `${food.name} · 现有首图`
      }] : [];
    } else if (food.image && !food.gallery.some(photo => photo.src === food.image)) {
      food.gallery.unshift({
        src: food.image,
        alt: food.imageAlt || food.name,
        caption: food.photoNote || food.photoLabel || `${food.name} · 现有首图`
      });
    }
    const known = new Set(food.gallery.map(photo => photo.src));
    for (const photo of photos) {
      if (!known.has(photo.src)) {
        food.gallery.push(photo);
        known.add(photo.src);
      }
    }
  }

  appendReviews('minhenan', [
    {source:'携程食客点评',date:'携程点评页收录',title:'侨乡葱茸包与闽南萝卜饭',rating:'4.7/5 · 12条点评',summary:'万象城店食客喜欢侨乡葱茸包的甜咸口和湿润嚼劲，也称赞花雕酒醉河田鸡、萝卜饭；另一位食客提到招牌包子有售罄情况，并觉得脆肚海鱼羹略腥。',url:'https://gs.ctrip.com/html5/you/foods/fooddetail/2016005/24684224.html'}
  ]);
  appendReviews('yanyu', [
    {source:'携程食客点评',date:'2022-12-31',title:'鹅肝虾仁炒饭与芝麻汤圆',rating:'4/5',summary:'食客觉得万象城店环境复古、服务热情，鹅肝虾仁炒饭分量比预期大、米粒分明，但口味稍咸；茉莉花黑芝麻汤圆香甜软糯。',url:'https://you.ctrip.com/food/xiamen21/22596335-dianping174433899.html'},
    {source:'携程旅行者实评',date:'2020-05-24',title:'海虎虾与胡椒猪肚肉骨茶',rating:'5/5',summary:'食客评价工作日高峰仍接近满座，服务态度好；避风塘黑醋海虎虾肉质弹，胡椒猪肚肉骨茶的胡椒味不重。菜品会随季节调整。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/restaurant-57273917/'}
  ]);
  appendReviews('wutang', [
    {source:'携程食客点评',date:'携程点评页收录',title:'配料充足，但价格和汤底口味有分歧',rating:'4.6/5 · 703条点评',summary:'有食客提到一早排队、配料足，认为是自己尝过几家里最好的一碗；也有食客觉得价格偏高、汤底偏甜而面味清淡。想吃建议早点到，按喜好少量选料。',url:'https://gs.ctrip.com/html5/you/foods/Xiamen21/317925.html'}
  ]);
  appendReviews('yubao', [
    {source:'Trip.com旅行者实评',date:'2022-04-01',title:'芋包咸甜软糯，鱼丸汤适合搭配',rating:'4/5',summary:'食客沿沙坡尾逛到大学路店，觉得芋包口感特别，芋泥香、馅料丰富，蘸酱后咸甜交织；配鱼丸汤吃比较舒服。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/yubaosao-22767561/'}
  ]);
  appendReviews('haodelai', [
    {source:'Trip.com食客点评',date:'2021-05-05',title:'姜母鸭香浓下饭，街边环境较简朴',rating:'4/5',summary:'食客称姜母鸭开锅香气浓，姜片能缓和油腻，鸭肉大多肥瘦适中、配饭合适；评论也明确提到店外小桌和街边环境比较简朴。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/bai-jia-chun-hao-de-lai-jiang-mu-ya-11309499/'},
    {source:'Trip.com食客点评',date:'2023-09-29',title:'姜味比鸭肉更突出',rating:'4/5',summary:'另一位食客的反馈较保留，觉得姜比鸭肉更有味道；口味偏好不同，点单前可先确认份量。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/bai-jia-chun-hao-de-lai-jiang-mu-ya-11309499/'}
  ]);
  appendReviews('tusun', [
    {source:'携程食客点评',date:'携程点评页收录',title:'土笋冻口感评价不一',rating:'4.8/5 · 192条点评',summary:'有食客喜欢店里透明胶质的土笋冻和新鲜选料，也有游客觉得土笋冻脆感一般、章鱼价格偏高；初次尝试可先点小份，并现场看价牌。',url:'https://gs.ctrip.com/html5/you/foods/GuanxunTown2099212/4926278.html'},
    {source:'高德地图用户评价',date:'2017-06-23',title:'有食客觉得味道偏淡',rating:'1/5',summary:'一条较早的高德评价认为土笋冻味道偏淡。年代较久，仅作口味分歧参考，不代表当前出品。',url:'https://www.amap.com/place/B025001MZM'}
  ]);
  appendReviews('ajie-wuxiang', [
    {source:'去哪儿旅行者食记',date:'2021-02-20',title:'现炸五香卷外酥里软',summary:'作者把八市开禾路111号的阿杰五香列为自己喜欢的五香店，提到现炸外皮酥脆、内馅软糯有肉粒；原帖也介绍了生五香可买回家再炸。价格为旧帖信息，不沿用。',url:'https://touch.travel.qunar.com/poi/7841457'}
  ]);
  appendReviews('huiyuan-bread', [
    {source:'十六番食客分享',date:'2020-02-06',title:'老式面包便宜亲切，热门时段会排队',summary:'作者把惠源称作八市菜市场口的老式面包店，觉得价格实惠、带怀旧味道，也坦言口感不算特别惊艳；店面较旧，排队时常能看到人流。',url:'https://live.16fan.com/info/154487.html'},
    {source:'高德地图用户评价',date:'2022-06-13',title:'便宜好吃，服务亲切',rating:'5/5',summary:'开禾路22号门店的高德用户评价称面包便宜好吃、物有所值，并表扬老板服务态度好。',url:'https://www.amap.com/place/B0FFG0388Z'}
  ]);
  appendReviews('yousheng', [
    {source:'Trip.com食客点评',date:'2020-04-07',title:'配料新鲜足量，沙茶味偏浓',rating:'4/5',summary:'食客在营平市场入口的小店点了猪脚面、沙茶面和卤面，觉得猪脚有嚼劲、配料新鲜足量；同时认为沙茶的花生味较浓、卤面带辣，未必合每个人口味。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/restaurant-11309262/'},
    {source:'Trip.com食客点评',date:'2020-01-04',title:'街边小摊的浓汤与鲜配料',rating:'4/5',summary:'另一位食客提到沙茶汤浓郁，鸭血、猪肝细嫩，海蛎新鲜、豆干入味；觉得面条韧度普通。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/restaurant-11309262/'}
  ]);
  appendReviews('baicheng-duck-porridge', [
    {source:'携程食客点评',date:'携程点评页收录',title:'鸭粥绵密，热天凉天都有人点',rating:'4.6/5 · 117条点评',summary:'食客称鸭肉粥口味不错、入口绵密，鸭腿和油条也受好评；另有评价提到店内干净、服务热情。',url:'https://gs.ctrip.com/html5/you/foods/fooddetail/21/5159093.html'}
  ]);
  appendReviews('linsixi', [
    {source:'Trip.com旅行者实评',date:'2022-08-08',title:'鼓浪屿正餐热门，午饭需留意候位',rating:'5/5',summary:'旅行者喜欢店内复古建筑氛围，认为菜品和服务不错；中午客人较多，入座需要等候，鼓浪屿热门时段建议预留排队时间。',url:'https://jp.trip.com/restaurant/china/xiamen/detail/lim-suhi-73142261/'}
  ]);
  appendReviews('sibei-bread', [
    {source:'美篇食客分享',date:'2023-03-20',title:'特香包扎实有奶香，甜口略干',summary:'作者在思北店排队买到特香包，觉得面包扎实、奶香足，复烤后外脆里嫩；甜口比咸口干一些，也提醒不必为了它排很久。',url:'https://www.meipian.cn/4oat191l'}
  ]);
  appendReviews('xinaqiang', [
    {source:'去哪儿旅行者点评',date:'2019-12-29',title:'海鲜池醒目，芒果汁受到好评',summary:'食客记录思明东路78号门店有海鲜池，上菜快、服务态度不错，喜欢海鲜炒饭和酸甜芒果汁；这次没有点姜母鸭，原帖表示下次再试。',url:'https://touch.travel.qunar.com/comment/10162469847'},
    {source:'携程食客点评',date:'2023-09-24',title:'姜母鸭与海鲜体验有好有坏',summary:'一位食客觉得姜母鸭姜香明显、海鲜新鲜，但嫌鸭肉偏油；另有同行体验提到煎蟹蟹脚不完整，店家提供了处理。点海鲜前应确认份量和做法。',url:'https://you.ctrip.com/food/xiamen21/15475179-dianping159521412.html'}
  ]);
  appendReviews('taoxi', [
    {source:'Apple Maps用户评价',date:'平台评论汇总',rating:'4.7/5 · 5,829条',title:'新鲜海鲜与个别菜品意见不一',summary:'该店汇总评价较高；可见评论中有人称海鲜、竹笋和米饭表现好，也有食客不喜欢当次螃蟹的苦味、鱿鱼的咸腥。海鲜和时令菜最好先看当天鲜货。',url:'https://maps.apple.com/place?_provider=57879&place-id=H2710I3F97D1544514C'}
  ]);
  appendReviews('huangji-siguo', [
    {source:'携程食客点评',date:'2020-10-30',title:'手工配料多，刨冰清凉解暑',rating:'5/5',summary:'食客提到红豆、仙草、凉粉、阿达子和手工汤圆等配料，觉得四果汤正宗、价格亲民，适合在附近逛吃时消暑。',url:'https://you.ctrip.com/food/21/12548005.html'},
    {source:'携程食客点评',date:'2020-12-18',title:'一碗份量足，适合九中附近顺路尝',rating:'5/5',summary:'另一位食客写到店面不大、座位有限，但配料丰富、份量足，刨冰淋菠萝糖水后清凉开胃。原帖价格不作为当前参考。',url:'https://you.ctrip.com/food/21/12548005.html'}
  ]);
  appendReviews('bapopo', [
    {source:'Trip.com食客点评',date:'2022-05-23',title:'烧仙草配料足，蜂蜜和奶茶口味都有人喜欢',summary:'中山路店食客觉得一杯价格实惠、底料丰富；其他游客喜欢蜂蜜和奶茶两种口味，提醒用勺子吃更方便。此处展示个人体验，不代表每家分店的配方完全相同。',url:'https://tw.trip.com/restaurant/china/xiamen/detail/bapopo-11308557/'}
  ]);
  appendReviews('diaoyuchuan-shapowei', [
    {source:'Trip.com旅行者实评',date:'Trip Moment（页面显示1月6日）',title:'姜母鸭、沙茶锅和海蛎捞饭',summary:'作者称由本地朋友带路，喜欢炒年糕蟹捞面、海蛎捞饭和咸甜葱茸包，也推荐姜母鸭与沙茶锅；这是单次探店体验，不能代表每桌出品。',url:'https://hk.trip.com/moments/detail/xiamen-21-140202476/'}
  ]);

  appendPhotos('minhenan', [
    {src:'https://dimg04.c-ctrip.com/images/0105c1200084oq5nz4FCF_D_180_180.jpg?proc=autoorient',alt:'携程食客上传的闽和南万象城店菜品照片',caption:'携程食客实拍 · 闽和南菜品'},
    {src:'https://dimg04.c-ctrip.com/images/0104g1200084oq5ny6C83_D_180_180.jpg?proc=autoorient',alt:'携程食客上传的闽和南万象城店第二张菜品照片',caption:'携程食客实拍 · 万象城店菜品'}
  ]);
  appendPhotos('yanyu', [
    {src:'https://ak-d.tripcdn.com/images/0106h12000acrudukA106_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'宴遇万象城店食客上传的菜品实拍',caption:'Trip.com食客实拍 · 万象城店菜品'},
    {src:'https://ak-d.tripcdn.com/images/0102912000acruq3l8226_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'宴遇万象城店食客上传的第二张菜品实拍',caption:'Trip.com食客实拍 · 福建菜'}
  ]);
  appendPhotos('yubao', [
    {src:'https://ak-d.tripcdn.com/images/01029120009e2gyva9623_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'芋包嫂大学路店食客上传的菜品照片',caption:'Trip.com食客实拍 · 芋包嫂菜品'},
    {src:'https://ak-d.tripcdn.com/images/01044120009e2irlg4621_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'芋包嫂大学路店食客上传的第二张照片',caption:'Trip.com食客实拍 · 大学路店'}
  ]);
  appendPhotos('haodelai', [
    {src:'https://ak-d.tripcdn.com/images/0103s120008n09b7q9BE1_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'百家春好德来姜母鸭食客上传的菜品实拍',caption:'Trip.com食客实拍 · 百家村好德来'},
    {src:'https://ak-d.tripcdn.com/images/0104o120008n0azpb7DDE_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'百家春好德来姜母鸭食客上传的第二张照片',caption:'Trip.com食客实拍 · 姜母鸭'}
  ]);
  appendPhotos('linsixi', [
    {src:'https://ak-d.tripcdn.com/images/0100p120009sihx5tFAEF_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'林四喜鼓浪屿店旅行者上传的菜品照片',caption:'Trip.com旅行者实拍 · 林四喜菜品'},
    {src:'https://ak-d.tripcdn.com/images/0100n120009sijwzt1600_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'林四喜鼓浪屿店旅行者上传的第二张照片',caption:'Trip.com旅行者实拍 · 鼓浪屿店'}
  ]);
  appendPhotos('ajie-wuxiang', [
    {src:'https://tr-osdcp.qunarzz.com/tr-osd-tr-mapi/img/214ab2a8771058d746cb00ee0edf9cc1.jpg_600x600x70_c3f8bca3.jpg',alt:'去哪儿食客上传的八市阿杰五香照片',caption:'去哪儿食客实拍 · 阿杰五香'}
  ]);
  appendPhotos('bapopo', [
    {src:'https://ak-d.tripcdn.com/images/0104i120009ha83cx1CF1_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'八婆婆中山路店旅行者上传的烧仙草实拍',caption:'Trip.com旅行者实拍 · 烧仙草'},
    {src:'https://ak-d.tripcdn.com/images/01025120009ha8rqg6687_C_340_230_R5_Q70.jpg?proc=source%2Ftrip',alt:'八婆婆中山路店旅行者上传的第二张实拍',caption:'Trip.com旅行者实拍 · 中山路店'}
  ]);
  appendPhotos('yousheng', [
    {src:'https://ak-d.tripcdn.com/images/0100k1200084l7xae3710_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'友生风味小吃营平市场店食客上传的沙茶面照片',caption:'Trip.com食客实拍 · 友生沙茶面'},
    {src:'https://ak-d.tripcdn.com/images/0100z1200084l9ffr030B_C_340_230_R5.jpg?proc=source%2Ftrip',alt:'友生风味小吃营平市场店食客上传的第二张照片',caption:'Trip.com食客实拍 · 营平市场店'}
  ]);
})();
