/* Read the same data and render the same maps as the website, without changing it. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.cache', 'pdf');
fs.mkdirSync(out, {recursive:true});
let playwright;
try { playwright = require('playwright'); }
catch {
  const modules = process.env.NODE_PATH || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  playwright = createRequire(path.join(modules, '_pdf.cjs'))('playwright');
}
const box = {}; box.window = box; vm.createContext(box);
for (const file of ['image-path.js','image-previews.js','map-data.js','map-transit.js','place-photo-data.js','place-photo-additions.js','travel-enrichment.js','food-details.js','food-ranking.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file});
}
const source = fs.readFileSync(path.join(root,'app.js'),'utf8');
const end = source.indexOf('function safe(');
if (end < 0) throw Error('Website data boundary changed');
vm.runInContext(source.slice(0,end)+'\nthis.data={days,foods,officialSources,socialSources,imageCredits,storeSources};',box);
const data = {...box.data, foods:box.XiamenFoodRanking.sort(box.data.foods), map:box.XiamenMapData,
  transit:box.XiamenTransit, stories:box.XiamenPlaceStories, experiences:box.XiamenPlaceExperiences,
  research:box.XiamenPhotoResearch, maps:{}, routes:[]};
for (const food of data.foods) food.pdfPhotos = box.XiamenFoodDetails.photos(food);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const server = http.createServer((req,res)=>{
  const filename = path.resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/\/$/,'/index.html'));
  if (!filename.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(filename,(err,body)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');res.end(body);});
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await playwright.chromium.launch({channel:process.env.PDF_BROWSER_CHANNEL||'msedge',headless:true});
    const page = await browser.newPage({viewport:{width:1440,height:1100}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base); await page.evaluate(()=>document.fonts.ready);
    const capture = await browser.newPage({viewport:{width:1536,height:1200},deviceScaleFactor:1.5});
    async function mapImage(selector,name){
      const svg=await page.locator(selector).evaluate(el=>el.outerHTML);
      await capture.setContent(`<html><head><base href="${base}"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="map-atlas-v2.css"><style>html,body{margin:0;padding:0;background:#faf8f1}body>svg{display:block!important;width:1536px!important;height:auto!important;max-width:none!important;min-width:0!important;border:0!important;border-radius:0!important}</style></head><body>${svg}</body></html>`);
      await capture.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.querySelectorAll('image')].map(el=>new Promise((ok,fail)=>{let im=new Image();im.onload=ok;im.onerror=()=>fail(Error(el.getAttribute('href')));im.src=el.getAttribute('href');})));});
      const dest=path.join(out,name+'.png');await capture.locator('body > svg').screenshot({path:dest});return dest;
    }
    data.maps.overview = await mapImage('svg.atlas-overview-map','overview');
    data.pageCopy = await page.evaluate(()=>({intro:document.querySelector('.masthead-copy>p').textContent,
      facts:[...document.querySelectorAll('.masthead-facts>div')].map(e=>e.innerText),
      foodIntro:document.querySelector('.food-intro>p').textContent,
      foodNote:document.querySelector('.food-note').textContent,
      tips:[...document.querySelectorAll('.practical-grid article')].map(e=>({title:e.querySelector('h3').textContent,text:e.querySelector('p').textContent}))}));
    for(let i=0;i<5;i++){
      await page.locator('#tab-'+i).click();
      data.routes.push(await page.evaluate(i=>window.XiamenMapUI.renderDay(i).edges,i));
      data.maps[i]=[];
      for(const selector of [`#day-map-${i} svg.atlas-daily-map`,`#day-island-map-${i} svg.atlas-daily-map`]){
        if(await page.locator(selector).count())data.maps[i].push(await mapImage(selector,`day-${i}-${data.maps[i].length}`));
      }
    }
    await page.locator('#tab-2').click();
    await page.locator('[data-xmu-toggle]').click();
    data.skipRoute=await page.evaluate(()=>window.XiamenMapUI.renderDay(2).edges);
    data.maps.skip=await mapImage('#day-map-2 svg.atlas-daily-map','day-2-skip');
    await page.locator('[data-rain-toggle]').click();
    data.maps.rain=await mapImage('#day-map-2 svg.atlas-daily-map','day-2-rain');
    await page.goto(base+'credits.html');
    data.credits=await page.locator('main li').evaluateAll(els=>els.map(e=>({text:e.textContent,links:[...e.querySelectorAll('a')].map(a=>({label:a.textContent,url:a.href}))})));
    if(errors.length)throw Error(errors.join('\n'));
    fs.writeFileSync(path.join(out,'data.json'),JSON.stringify(data,null,2));
    console.log(JSON.stringify({foods:data.foods.length,foodReviews:data.foods.reduce((s,f)=>s+(f.reviews||[]).length,0),points:data.map.points.length,maps:data.maps}));
  } finally {if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
