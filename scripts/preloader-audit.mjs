import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4173/portfolio-site/';
const checks=[],errors=[],failures=[];
await mkdir('audit-artifacts',{recursive:true});
const browser=await chromium.launch();
async function check(name,fn){try{await fn();checks.push({name,result:'PASS'});console.log(`PASS ${name}`);}catch(e){checks.push({name,result:'FAIL',error:e.stack});console.error(`FAIL ${name}: ${e.message}`);}finally{await Promise.allSettled(browser.contexts().map(context=>context.close()));}}
function watch(page){page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});}
async function instrument(page){await page.addInitScript(()=>{
  window.__loader={shown:null,exiting:null,hidden:null,hero:null,complete:false,overflow:[],cls:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__loader.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  const sample=()=>{const x=window.__loader,loader=document.querySelector('.logo-preloader');
    if(loader&&x.shown===null)x.shown=performance.now();
    if(loader?.dataset.phase==='exiting'&&x.exiting===null)x.exiting=performance.now();
    if(!loader&&x.shown!==null&&x.hidden===null)x.hidden=performance.now();
    if(document.querySelector('#home')?.dataset.heroReady==='true'&&x.hero===null)x.hero=performance.now();
    if(document.querySelector('[data-loading-percentage]')?.textContent==='100')x.complete=true;
    if(document.body)x.overflow.push(document.body.style.overflow);
  };
  new MutationObserver(sample).observe(document,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-phase','data-hero-ready']});
});}
await check('logo files are exact copies of the existing complete PNG',async()=>{
  const original=await readFile('public/assets/logo1.png');
  assert.deepEqual(await readFile('src/assets/logo.png'),original);assert.deepEqual(await readFile('public/logo.png'),original);
  assert.deepEqual(await readFile('dist/logo.png'),original);
});
for(const width of [320,375,390,430,768,1024,1440,1920]){
  await check(`first-visit loader, timing, responsive logo and hero coordination ${width}px`,async()=>{
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'no-preference',isMobile:width<768,hasTouch:width<768});
    const page=await context.newPage();watch(page);await instrument(page);
    await page.goto(base,{waitUntil:'domcontentloaded'});
    const loader=page.getByRole('status',{name:'Loading portfolio',exact:true});await loader.waitFor();
    assert.equal(await loader.getAttribute('aria-live'),'polite');assert.equal(await page.locator('.page-intro').count(),0);
    await page.locator('.preloader-logo').evaluate(img=>img.decode());await page.waitForTimeout(1150);
    assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'false');
    assert.equal(await page.locator('.hero-eyebrow').evaluate(e=>getComputedStyle(e).opacity),'0');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
    const metrics=await page.evaluate(()=>{const img=document.querySelector('.preloader-logo'),r=img.getBoundingClientRect(),loader=document.querySelector('.logo-preloader').getBoundingClientRect(),track=document.querySelector('.preloader-progress-track').getBoundingClientRect();return {width:r.width,height:r.height,natural:[img.naturalWidth,img.naturalHeight],fit:getComputedStyle(img).objectFit,loaderHeight:loader.height,viewportHeight:innerHeight,overflow:document.documentElement.scrollWidth,viewport:innerWidth,track:[track.width,track.height]};});
    assert.ok(Math.abs(metrics.width-(width<768?280:420))<1,JSON.stringify(metrics));
    assert.ok(Math.abs(metrics.width/metrics.height-748/323)<0.01);assert.deepEqual(metrics.natural,[748,323]);assert.equal(metrics.fit,'contain');
    assert.equal(metrics.loaderHeight,metrics.viewportHeight);assert.ok(metrics.overflow<=metrics.viewport);assert.deepEqual(metrics.track,[160,3]);
    if([320,390,768,1440].includes(width))await page.screenshot({path:`audit-artifacts/preloader-${width}.png`});
    await loader.waitFor({state:'detached',timeout:5500});
    const timing=await page.evaluate(()=>window.__loader);
    assert.ok(timing.exiting-timing.shown>=2150,JSON.stringify(timing));
    assert.ok(timing.hidden-timing.shown<=5200,JSON.stringify(timing));
    assert.ok(timing.hero>=timing.hidden,JSON.stringify(timing));assert.equal(timing.complete,true);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'');
    assert.ok(timing.cls<0.01,`CLS ${timing.cls}`);
    if(width===1440){
      await page.waitForTimeout(1400);assert.equal(await page.locator('.hero-portrait-stage').evaluate(e=>getComputedStyle(e).opacity),'1');
      await page.screenshot({path:'audit-artifacts/preloader-finished-hero.png'});
      console.log(`Normal loader: ${Math.round(timing.hidden-timing.shown)}ms, exit starts ${Math.round(timing.exiting-timing.shown)}ms, CLS ${timing.cls}`);
    }
    await context.close();
  });
}
for(const width of [390,1440]) await check(`every refresh replays the loader despite old session flags; in-page navigation stays ready ${width}px`,async()=>{
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'no-preference',hasTouch:width<768});
  const page=await context.newPage();watch(page);await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.logo-preloader').waitFor({state:'detached',timeout:5500});
  await page.evaluate(()=>sessionStorage.setItem('portfolio:logo-preloader:v1','1'));
  for(let refresh=0;refresh<2;refresh++){
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('.logo-preloader').waitFor({state:'visible'});
    assert.equal(await page.locator('.logo-preloader').getAttribute('data-phase'),'loading');
    assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'false');
    await page.locator('.logo-preloader').waitFor({state:'detached',timeout:5500});
    assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'true');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  }
  const budget=page.locator('#services').getByRole('heading',{name:'Budget-Friendly Development',exact:true});
  assert.equal(await budget.count(),1);
  assert.ok((await budget.locator('..').textContent()).includes('Professional websites and e-commerce solutions built with practical scope, clean development and cost-conscious implementation.'));
  await page.evaluate(()=>{history.pushState({},'','/portfolio-site/not-a-real-route');dispatchEvent(new PopStateEvent('popstate'));});
  await page.getByRole('heading',{name:'404'}).waitFor();assert.equal(await page.locator('.logo-preloader').count(),0);
  await page.getByRole('link',{name:'Return to Home'}).click();assert.equal(await page.locator('.logo-preloader').count(),0);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');await context.close();
});
await check('delayed hero image holds the loader until the critical image is ready',async()=>{
  const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();watch(page);await instrument(page);
  let release;await context.route('**/images/vasanthakumar-profile.jpg',async route=>{await new Promise(resolve=>{release=resolve;});await route.continue();});
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForTimeout(2600);
  assert.equal(await page.locator('.logo-preloader').getAttribute('data-phase'),'loading');assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'false');
  const releasedAt=await page.evaluate(()=>performance.now());
  release();await page.locator('.logo-preloader').waitFor({state:'detached',timeout:3000});
  assert.ok((await page.evaluate(()=>window.__loader.exiting))>=releasedAt);await context.close();
});
await check('font readiness gates loading without waiting for below-the-fold images or the map',async()=>{
  const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();watch(page);
  await page.addInitScript(()=>{Object.defineProperty(document.fonts,'ready',{configurable:true,value:new Promise(resolve=>setTimeout(resolve,3000))});});
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForTimeout(2400);
  assert.equal(await page.locator('.logo-preloader').getAttribute('data-phase'),'loading');
  await page.locator('.logo-preloader').waitFor({state:'detached',timeout:2500});await context.close();
});
await check('hung image cannot hold the loader or scroll lock beyond the five-second safety deadline',async()=>{
  const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();watch(page);await instrument(page);
  let release;await context.route('**/images/vasanthakumar-profile.jpg',async route=>{await new Promise(resolve=>{release=resolve;});await route.continue().catch(()=>{});});
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.logo-preloader').waitFor({state:'detached',timeout:5500});
  const timing=await page.evaluate(()=>window.__loader);assert.ok(timing.hidden-timing.shown<=5200,JSON.stringify(timing));
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'true');
  console.log(`Safety loader: ${Math.round(timing.hidden-timing.shown)}ms`);release();await context.close();
});
await check('blocked storage degrades safely and previous overflow values are restored exactly',async()=>{
  const context=await browser.newContext({reducedMotion:'no-preference'});const page=await context.newPage();watch(page);
  await page.addInitScript(()=>{
    Storage.prototype.getItem=()=>{throw new DOMException('Blocked','SecurityError');};Storage.prototype.setItem=()=>{throw new DOMException('Blocked','SecurityError');};
    document.addEventListener('DOMContentLoaded',()=>{document.body.style.overflow='auto';document.documentElement.style.overflow='scroll';document.documentElement.style.scrollbarGutter='auto';},{once:true});
  });
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('.logo-preloader').waitFor({state:'detached',timeout:5500});
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'auto');assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'scroll');
  assert.equal(await page.evaluate(()=>document.documentElement.style.scrollbarGutter),'auto');await context.close();
});
await check('reduced motion uses only a short fade and never locks scrolling or keyboard interaction',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();watch(page);await instrument(page);
  await page.goto(base,{waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.equal(await page.locator('#home').getAttribute('data-hero-ready'),'true');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'A');
  await page.locator('.logo-preloader').waitFor({state:'detached',timeout:1200});const timing=await page.evaluate(()=>window.__loader);
  assert.ok(timing.hidden-timing.shown<=700,JSON.stringify(timing));assert.ok(timing.overflow.every(v=>v!=='hidden'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.logo-preloader').waitFor({state:'attached'});
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  await page.locator('.logo-preloader').waitFor({state:'detached',timeout:1200});
  assert.ok((await page.evaluate(()=>window.__loader)).overflow.every(v=>v!=='hidden'));
  await context.close();
});
await check('production preload and theme metadata use the GitHub Pages base',async()=>{
  const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();watch(page);await page.goto(base);
  assert.equal(await page.locator('link[rel="preload"][as="image"][href$="/logo.png"]').getAttribute('href'),'/portfolio-site/logo.png');
  assert.equal(await page.locator('link[rel="preload"][as="image"][href$="/vasanthakumar-profile.jpg"]').getAttribute('href'),'/portfolio-site/images/vasanthakumar-profile.jpg');
  assert.equal(await page.locator('header img').getAttribute('src'),'/portfolio-site/logo.png');
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#1a6b5a');
  const response=await page.request.get(base+'logo.png');assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/image\/png/);
  const requestCount=await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>e.name.endsWith('/logo.png')).length);assert.equal(requestCount,1);
  await context.close();
});
await check('no runtime, console or failed local assets',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);});
await browser.close();await writeFile('audit-artifacts/preloader-audit.json',JSON.stringify({checks,errors,failures},null,2));
if(checks.some(c=>c.result==='FAIL'))process.exitCode=1;
