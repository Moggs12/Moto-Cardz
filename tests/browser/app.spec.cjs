const {test,expect}=require('@playwright/test');
const path=require('node:path');
const pilot=['BK-014','BK-038','BK-054','BK-092','BK-122','BK-132','BK-136','BK-165','BK-181','BK-051'];
async function start(page,mode='quick',level='easy',target=3){
 await page.goto('/');
 await page.locator(`#modeOpts [data-v="${mode}"]`).click();
 await page.locator(`#levelOpts [data-v="${level}"]`).click();
 if(mode==='quick')await page.locator(`#targetOpts [data-v="${target}"]`).click();
 await page.locator('#start').click();
}
async function fit(page,selector){
 const r=await page.locator(selector).evaluateAll(nodes=>nodes.map(el=>{
  const b=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();
  return {width:b.width,height:b.height,inside:b.left>=p.left-1&&b.top>=p.top-1&&b.right<=p.right+1&&b.bottom<=p.bottom+1,fit:getComputedStyle(el).objectFit,loaded:el.complete&&el.naturalWidth>0};
 }));
 expect(r.length).toBeGreaterThan(0);for(const a of r){expect(a.inside).toBe(true);expect(a.fit).toBe('contain');expect(a.loaded).toBe(true)}
}
async function noOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true)}
async function photo(page,info,name){await page.screenshot({path:info.outputPath(name+'.png'),fullPage:true})}
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{let seed=123456;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}});
});
test('layout: all pilot artwork fits compact panels and search works',async({page},info)=>{
 await page.goto('/');await noOverflow(page);await photo(page,info,'home');await page.locator('#viewDeck').click();
 for(const id of pilot){await page.locator('#deckSearch').fill(id);await expect(page.locator('.deck-tile')).toHaveCount(1);await expect(page.locator('.deck-tile img')).toBeVisible();await page.locator('.deck-tile img').evaluate(im=>im.decode());await fit(page,'.deck-tile img');await noOverflow(page)}
 await photo(page,info,'gallery-harley');await page.locator('#deckSearch').fill('BMW');await expect(page.locator('.deck-tile')).toHaveCount(18);
 await page.locator('#deckSearch').fill('no-such-model');await expect(page.locator('#galleryCount')).toContainText('No bikes found');
});
test('layout: side-by-side cards, whole Harley image and readable aligned stats',async({page},info)=>{
 await start(page);
 await page.evaluate(()=>{Q.player=BIKES.find(b=>b.id==='BK-051');document.getElementById('qPlayer').innerHTML=cardHTML(Q.player,{act:true})});
 await page.locator('#qPlayer img').evaluate(im=>im.decode());await fit(page,'#qPlayer img');await noOverflow(page);
 const boxes=await page.locator('.battle>.card').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}}));
 expect(Math.abs(boxes[0].y-boxes[1].y)).toBeLessThan(2);expect(boxes[1].x).toBeGreaterThan(boxes[0].x+boxes[0].width);expect(boxes[0].width).toBeGreaterThan(130);
 await photo(page,info,'quick-before-reveal');
 await page.evaluate(()=>{Q.hand=[BIKES.find(b=>b.id==='BK-014')]});
 await page.locator('#qPlayer [data-stat="power"]').click();await page.locator('#qAi img').evaluate(im=>im.decode());await page.locator('#qAi').evaluate(n=>Promise.all(n.getAnimations().map(a=>a.finished)));await fit(page,'.battle .bike-art img');
 const rows=await page.locator('.battle>.card').evaluateAll(nodes=>nodes.map(n=>[...n.querySelectorAll('.stat')].map(e=>e.getBoundingClientRect().y)));
 rows[0].forEach((y,i)=>expect(Math.abs(y-rows[1][i])).toBeLessThan(2));await noOverflow(page);await photo(page,info,'quick-revealed');
});
test('full pack: every bike image decodes and every name stays inside its header',async({page},info)=>{
 await page.goto('/');
 const result=await page.evaluate(async()=>{
  const bad=[];
  for(const b of BIKES){const image=new Image();image.src=ART[b.id];try{await image.decode();if(image.naturalWidth!==600||image.naturalHeight!==400)bad.push(b.id+':dimensions')}catch{bad.push(b.id+':decode')};}
  return {count:BIKES.length,bad};
 });expect(result.count).toBe(178);expect(result.bad).toEqual([]);
 await start(page);
 const overflow=await page.evaluate(()=>{
  const card=document.getElementById('qPlayer'),bad=[];
  for(const b of BIKES){card.innerHTML=cardHTML(b,{act:true});const name=card.querySelector('.card-name'),head=card.querySelector('.card-head');if(name.getBoundingClientRect().bottom>head.getBoundingClientRect().bottom-3||name.scrollWidth>name.clientWidth+1)bad.push(b.id+' '+b.model)}
  return bad;
 });expect(overflow).toEqual([]);
});
for(const level of ['easy','medium','hard'])test(`Quick Match: ${level} can complete via visible controls`,async({page},info)=>{
 await start(page,'quick',level);
 for(let round=0;round<45;round++){
  const ended=await page.locator('#end').isVisible();if(ended)break;
  const best=await page.locator('#qPlayer .stat').evaluateAll(nodes=>nodes.reduce((a,n)=>+n.querySelector('.value').textContent>+a.querySelector('.value').textContent?n:a).dataset.stat);
  await page.locator(`#qPlayer [data-stat="${best}"]`).click();await expect(page.locator('#qResult')).toHaveClass(/show/);await expect(page.locator('#qAi img')).toBeVisible();await noOverflow(page);await page.locator('#qNext').click();
 }
 await expect(page.locator('#end')).toBeVisible();await photo(page,info,'quick-'+level+'-completed');
 await page.locator('#rematch').click();await expect(page.locator('#quick')).toHaveClass(/active/);await page.locator('#quick [data-menu]').click();await expect(page.locator('#home')).toHaveClass(/active/);
});
for(const level of ['easy','medium','hard'])test(`Duel: ${level} attack, defence, hand and completion via visible controls`,async({page},info)=>{
 await start(page,'duel',level);
 for(let round=0;round<30;round++){
  if(await page.locator('#end').isVisible())break;
  await expect.poll(()=>page.evaluate(()=>D.phase),{timeout:10000}).toMatch(/pAttack|pDefend|reveal/);
  const phase=await page.evaluate(()=>D.phase);
  if(phase==='pAttack'){await page.locator('#dHand .stat').first().click();await expect(page.locator('#dConfirm')).toBeVisible();await page.locator('#dGo').click()}
  else if(phase==='pDefend'){
   const defending=page.locator('#dHand .card.defendable');
   if(await defending.count()){await defending.first().click();await expect(page.locator('#dConfirm')).toBeVisible();await page.locator('#dGo').click()}
  }
  await expect(page.locator('#dResult')).toHaveClass(/show/,{timeout:10000});
  await page.locator('#dYou img').evaluate(im=>im.decode());await page.locator('#dFoe img').evaluate(im=>im.decode());await fit(page,'.arena .bike-art img');await noOverflow(page);
  if(round===0)await photo(page,info,'duel-'+level+'-revealed');
  if(page.viewportSize().width>=900){const horizontal=await page.locator('#dHand').evaluate(n=>n.scrollWidth<=n.clientWidth+1);expect(horizontal).toBe(true)}
  await page.locator('#dNext').click();
 }
 await expect(page.locator('#end')).toBeVisible();await page.locator('#endMenu').click();await expect(page.locator('#home')).toHaveClass(/active/);
});
test('offline: the complete pack and gameplay work with the origin disconnected',async({page})=>{
 await page.goto('/');await page.evaluate(async()=>{const reg=await navigator.serviceWorker.ready;if(reg.installing)await new Promise(resolve=>reg.installing.addEventListener('statechange',()=>reg.active&&resolve()));});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 const missing=await page.evaluate(async()=>{const cache=await caches.open('moto-cardz-v2.1.9-build010');const out=[];for(const path of new Set(Object.values(ART)))if(!await cache.match(new URL(path,location.href).href))out.push(path);return out});expect(missing).toEqual([]);
 // Real origin outage avoids Playwright WebKit's setOffline/service-worker bug (#42775).
 // The Node probe is a negative control: it has no service worker or browser cache.
 const off=await fetch('http://127.0.0.1:4174/offline',{method:'POST'});expect(off.ok).toBe(true);
 try{
  let networkFailed=false;try{await fetch('http://127.0.0.1:4173/index.html',{signal:AbortSignal.timeout(3000)})}catch{networkFailed=true}expect(networkFailed).toBe(true);
  const response=await page.reload();expect(response.status()).toBe(200);expect(response.fromServiceWorker()).toBe(true);
  await page.locator('#start').click();await page.locator('#qPlayer img').evaluate(im=>im.decode());await fit(page,'#qPlayer img');await page.locator('#qPlayer .stat').first().click();await expect(page.locator('#qResult')).toHaveClass(/show/);
 }finally{const on=await fetch('http://127.0.0.1:4174/online',{method:'POST'});expect(on.ok).toBe(true)}
});
test('release: install icons decode from versioned URLs and are cached offline',async({page})=>{
 await page.goto('/');await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 const result=await page.evaluate(async()=>{
  const manifest=await(await fetch('manifest.webmanifest')).json();
  const apple=document.querySelector('link[rel="apple-touch-icon"]').getAttribute('href');
  const paths=[...manifest.icons.map(x=>x.src),apple],bad=[];
  const cache=await caches.open('moto-cardz-v2.1.9-build010');
  for(const path of paths){
   if(!path.startsWith('assets/icons/build010/'))bad.push(path+':unversioned');
   const im=new Image();im.src=path;try{await im.decode();if(im.naturalWidth<180||im.naturalHeight!==im.naturalWidth)bad.push(path+':size')}catch{bad.push(path+':decode')}
   if(!await cache.match(new URL(path,location.href).href))bad.push(path+':not cached');
  }
  return{count:paths.length,bad};
 });expect(result.count).toBe(4);expect(result.bad).toEqual([]);
});
test('Quick Match: rapid Next round activation cannot skip a round',async({page})=>{
 await start(page);await page.locator('#qPlayer .stat').first().click();await expect(page.locator('#qResult')).toHaveClass(/show/);
 const before=await page.evaluate(()=>Q.round);
 await page.locator('#qNext').evaluate(n=>{n.click();n.click()});
 expect(await page.evaluate(()=>Q.round)).toBe(before+1);await expect(page.locator('#qResult')).not.toHaveClass(/show/);
});
