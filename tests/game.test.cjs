const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
// Minimal DOM harness: exercises shipped game logic and rendered markup without a browser.
function game(saved='{}'){
  const elements=new Map(),timers=[];
  class Element{
    constructor(id=''){this.id=id;this.innerHTML='';this.textContent='';this.className='';this.hidden=false;this.dataset={};this.scrollLeft=0;this.value='';this.attrs={};this.listeners={};this.small={textContent:''};
      this.classList={add:c=>this.toggle(c,true),remove:c=>this.toggle(c,false),toggle:(c,v)=>this.toggle(c,v)};
    }
    toggle(c,v){const set=new Set(this.className.split(/\s+/).filter(Boolean));if(v===undefined)v=!set.has(c);v?set.add(c):set.delete(c);this.className=[...set].join(' ');return v}
    setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}
    addEventListener(k,v){this.listeners[k]=v}focus(){}querySelector(s){if(s==='small')return this.small;return null}
  }
  for(const [,id] of html.matchAll(/\bid="([^"]+)"/g))elements.set(id,new Element(id));
  const groups={};
  for(const id of ['modeOpts','levelOpts','targetOpts']){
    const block=html.split(`id="${id}"`)[1].split('</div>')[0];
    groups[id]=[...block.matchAll(/data-v="([^"]+)"/g)].map(([,v])=>{const e=new Element();e.dataset.v=v;e.parentElement=elements.get(id);return e});
  }
  const screens=['home','quick','duel','gallery'].map(id=>elements.get(id));
  const document={getElementById:id=>{assert(elements.has(id),`Unknown element ${id}`);return elements.get(id)},querySelectorAll:s=>{
    if(s==='.screen')return screens;if(s==='[data-menu]')return[];
    return s.split(',').flatMap(part=>groups[part.trim().match(/^#(\w+) \.opt$/)?.[1]]||[]);
  }};
  let seed=20261016;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const math=Object.create(Math);math.random=random;
  const context=vm.createContext({console,document,window:{scrollTo(){}},localStorage:{getItem:()=>saved,setItem(){}},navigator:{},location:{protocol:'file:'},setTimeout:fn=>{timers.push(fn);return timers.length},Math:math});
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
  return{run:s=>vm.runInContext(s,context),el:id=>elements.get(id),flush:()=>{let n=0;while(timers.length){assert(++n<100);timers.shift()()}}};
}
test('settings migration keeps valid mode and target and removes the old pilot restriction',()=>{
  const g=game('{"mode":"duel","level":"hard","target":7,"deck":"pilot"}');
  assert.equal(g.run('S.mode'),'duel');assert.equal(g.run('S.level'),'hard');assert.equal(g.run('S.target'),7);
  assert.equal(g.run('activeDeck().length'),178);assert.equal(g.run('S.deck'),undefined);assert.equal(g.el('countPill').textContent,'178 bikes');
  const bad=game('{"mode":"bad","level":"bad","target":99}');assert.equal(bad.run('S.mode'),'quick');assert.equal(bad.run('S.target'),5);
  assert.equal(game('{broken').run('S.level'),'easy');assert.equal(game('null').run('S.mode'),'quick');
});
test('all 178 cards have artwork mappings and full galleries can be searched',()=>{
  const g=game();assert.equal(g.run('BIKES.length'),178);assert.equal(g.run('Object.keys(ART).length'),178);
  assert(g.run('BIKES.every(b=>ART[b.id])'));g.run("$('viewDeck').onclick()");
  assert.equal((g.el('deckGallery').innerHTML.match(/<figure/g)||[]).length,178);
  g.el('deckSearch').value='BMW';g.run('renderGallery()');assert.equal((g.el('deckGallery').innerHTML.match(/<figure/g)||[]).length,18);
  g.el('deckSearch').value='no-such-motorcycle';g.run('renderGallery()');assert.equal(g.el('deckGallery').innerHTML,'');assert.match(g.el('galleryCount').textContent,/No bikes found/);
});
for(const level of ['easy','medium','hard']){
 for(const target of [3,5,7])test(`Quick Match full/${level}/first-to-${target}: 30 completed matches and score lock`,()=>{
  const g=game();g.run(`S.level='${level}';S.target=${target}`);
  for(let match=0;match<30;match++){
   g.run('qStart()');let n=0;
   while(!g.run('Q.over')){
    assert(++n<150);assert(g.run('Q.player&&Q.hand.length===AI_HAND[S.level]'));
    assert(g.run('new Set([Q.player.id,...Q.hand.map(b=>b.id)]).size===Q.hand.length+1'));
    assert(!g.el('qAi').innerHTML.includes('<img'));assert.equal((g.el('qPlayer').innerHTML.match(/data-stat=/g)||[]).length,5);
    g.run('qPlay(STATS[Math.floor(RNG()*STATS.length)])');const score=g.run('Q.score.p+Q.score.a');g.run("qPlay('power')");assert.equal(g.run('Q.score.p+Q.score.a'),score);
    assert(g.el('qAi').innerHTML.includes('<img'));if(!g.run('Q.over'))g.run('qNext()');
   }
   assert(g.run(`Math.max(Q.score.p,Q.score.a)===${target}`));g.run('qEnd()');assert.equal(g.el('end').hidden,false);g.run('toMenu()');
  }
 });
 test(`Duel full/${level}: 30 completed matches, attacks, defence and revealed artwork`,()=>{
  const g=game();g.run(`S.level='${level}'`);
  for(let match=0;match<30;match++){
   g.run('dStart()');g.flush();assert(g.run('new Set([...D.hands.p,...D.hands.a,...(D.aCard?[D.aCard]:[])].map(b=>b.id)).size===10'));
   let n=0;
   while(!g.run('D.over')){
    assert(++n<100);const phase=g.run('D.phase');if(phase==='reveal'){g.run('dContinue()');g.flush();continue}
    assert(['pAttack','pDefend'].includes(phase));assert(!g.el('dFoe').innerHTML.includes('<img'));
    if(phase==='pAttack')g.run('D.sel={i:Math.floor(RNG()*D.hands.p.length),k:STATS[Math.floor(RNG()*5)]}');else g.run('D.sel={i:Math.floor(RNG()*D.hands.p.length)}');
    g.run('dConfirm()');g.flush();assert.equal(g.run('D.phase'),'reveal');assert(g.run('D.pCard&&D.aCard'));assert(g.el('dFoe').innerHTML.includes('<img'));
    if(!g.run('D.over')){g.run('dContinue()');g.flush()}
   }
   g.run('dEnd()');assert.equal(g.el('end').hidden,false);g.run('toMenu()');g.flush();
  }
 });
}
test('repeated sudden-death ties replenish the full reserve and never deal an undefined/duplicate pair',()=>{
 const g=game();g.run('BIKES.forEach(b=>b.stats={topSpeed:50,power:50,engine:50,economy:50,value:50});dStart()');g.flush();
 for(let round=0;round<100;round++){
  if(g.run("D.phase==='pAttack'"))g.run("D.sel={i:0,k:'power'}");else g.run('D.sel={i:0}');g.run('dConfirm()');g.flush();
  assert.equal(g.run('D.outcome'),'draw');assert.equal(g.run('D.over'),false);assert(g.run('D.pCard&&D.aCard&&D.pCard.id!==D.aCard.id'));g.run('dContinue()');g.flush();
 }
 assert.equal(g.run('D.sudden'),true);
});
test('menu exit invalidates pending AI callbacks and rapid continue cannot skip a round',()=>{
 const g=game();g.run("RNG=()=>.8;dStart();toMenu()");g.flush();assert.equal(g.run('D'),null);
 g.run('dStart()');const round=g.run('D.round');g.run('dContinue();dContinue()');assert.equal(g.run('D.round'),round);
});
test('original dataset checksum and hero asset are preserved; every card renders one illustration and five stats',()=>{
 const g=game();const crypto=require('node:crypto');assert.equal(crypto.createHash('sha256').update(html.match(/const BIKES=(\[.*?\]);/s)[1]).digest('hex'),'d7bba1df21aa868111b833caf292538d0cb6605d7af251198cec10e62cc2e87a');
 assert(html.includes('assets/motocardz-hero1-v006.avif'));
 assert(g.run("BIKES.every(b=>(cardHTML(b).match(/<img/g)||[]).length===1&&(cardHTML(b).match(/data-stat=/g)||[]).length===5)"));
});
test('all 178 art mappings point to compact valid WebP files, with only the two documented duplicate models sharing art',()=>{
 const g=game();const art=JSON.parse(g.run('JSON.stringify(ART)'));assert.equal(Object.keys(art).length,178);assert.equal(new Set(Object.values(art)).size,176);
 let total=0;for(const asset of new Set(Object.values(art))){const bytes=fs.readFileSync(path.join(root,asset));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert(bytes.length>1000&&bytes.length<100000);total+=bytes.length}
 assert(total<12000000);
});
test('every offline shell resource, all artwork and manifest icons exist',()=>{
 const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');const shell=worker.match(/const SHELL = \[([\s\S]*?)\];/)[1];
 const cached=[...shell.matchAll(/'([^']+)'/g)].map(x=>x[1]);for(const asset of cached)assert(fs.existsSync(path.join(root,asset)),`Missing offline asset: ${asset}`);
 const g=game();const images=JSON.parse(g.run('JSON.stringify(Object.values(ART))'));for(const asset of images)assert(cached.includes('./'+asset),`Artwork not cached: ${asset}`);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const icon of manifest.icons)assert(fs.existsSync(path.join(root,icon.src)));
});
test('artwork provenance covers the complete deck and matches every reviewed release file',()=>{
 const crypto=require('node:crypto');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/deck-v009/manifest.json'),'utf8'));
 assert.equal(JSON.stringify(manifest).includes('/workspace/'),false,'Release provenance must not expose scratch paths');
 assert.equal(manifest.card_count,178);assert.equal(manifest.unique_images,176);
 assert.equal(manifest.cards.length,178);assert.equal(manifest.images.length,176);
 const g=game();const art=JSON.parse(g.run('JSON.stringify(ART)'));
 for(const card of manifest.cards)assert.equal(card.asset,art[card.id]);
 for(const image of manifest.images){
  assert.equal(image.reviewed,true,image.id);assert(image.prompt&&image.prompt.length>50,image.id);
  const bytes=fs.readFileSync(path.join(root,image.asset));
  assert.equal(bytes.length,image.bytes,image.id);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),image.sha256,image.id);
  assert.equal(image.width,600);assert.equal(image.height,400);
 }
});
