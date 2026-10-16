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
    constructor(id=''){this.id=id;this.innerHTML='';this.textContent='';this.className='';this.hidden=false;this.dataset={};this.scrollLeft=0;this.attrs={};this.listeners={};this.small={textContent:''};
      this.classList={add:c=>this.toggle(c,true),remove:c=>this.toggle(c,false),toggle:(c,v)=>this.toggle(c,v)};
    }
    toggle(c,v){const set=new Set(this.className.split(/\s+/).filter(Boolean));if(v===undefined)v=!set.has(c);v?set.add(c):set.delete(c);this.className=[...set].join(' ');return v}
    setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}
    addEventListener(k,v){this.listeners[k]=v}focus(){}querySelector(s){if(s==='small')return this.small;return null}
  }
  for(const [,id] of html.matchAll(/\bid="([^"]+)"/g))elements.set(id,new Element(id));
  const groups={};
  for(const id of ['deckOpts','modeOpts','levelOpts','targetOpts']){
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
test('saved settings migration defaults to pilot and rejects invalid settings',()=>{
  const g=game('{"mode":"bad","level":"bad","target":99,"deck":"bad"}');
  assert.equal(g.run('S.deck'),'pilot');assert.equal(g.run('S.mode'),'quick');assert.equal(g.run('S.level'),'easy');assert.equal(g.run('S.target'),5);
  assert.equal(g.el('countPill').textContent,'10 bikes');
  assert.equal(game('{broken').run('S.deck'),'pilot');
});
test('exact ten unique pilot models; original 178-bike data retained; gallery renders all ten',()=>{
  const g=game();assert.equal(g.run('BIKES.length'),178);assert.equal(g.run('PILOT_BIKES.length'),10);assert.equal(g.run('new Set(PILOT_IDS).size'),10);
  assert(g.run('PILOT_BIKES.every(b=>b&&ART[b.id])'));
  g.run("$('viewPilot').onclick()");assert.equal((g.el('pilotGallery').innerHTML.match(/<figure/g)||[]).length,10);
  assert(g.el('pilotGallery').innerHTML.includes('Royal Enfield'));
});
for(const deck of ['pilot','full'])for(const level of ['easy','medium','hard']){
  test(`Quick Match ${deck}/${level}: full matches, no duplicate deal or hidden-bike leak, score lock`,()=>{
    const g=game();g.run(`S.deck='${deck}';S.level='${level}';S.target=3;syncSettings()`);
    for(let match=0;match<30;match++){
      g.run('qStart()');let n=0;
      while(!g.run('Q.over')){
        assert(++n<100);
        assert(g.run('Q.player&&Q.hand.length===AI_HAND[S.level]'));
        assert(g.run('new Set([Q.player.id,...Q.hand.map(b=>b.id)]).size===Q.hand.length+1'));
        if(deck==='pilot')assert(g.run('[Q.player,...Q.hand].every(b=>PILOT_IDS.includes(b.id))'));
        assert(!g.el('qAi').innerHTML.includes('<img'));
        assert.equal((g.el('qPlayer').innerHTML.match(/data-stat=/g)||[]).length,5);
        g.run('qPlay(STATS[Math.floor(RNG()*STATS.length)])');
        const score=g.run('Q.score.p+Q.score.a');g.run("qPlay('power')");assert.equal(g.run('Q.score.p+Q.score.a'),score);
        assert(g.el('qAi').innerHTML.includes('data-stat='));
        if(!g.run('Q.over'))g.run('qNext()');
      }
      g.run('qEnd()');assert.equal(g.el('end').hidden,false);g.run('toMenu()');
    }
  });
  test(`Duel ${deck}/${level}: attacks, defence, reveals and match completion`,()=>{
    const g=game();g.run(`S.deck='${deck}';S.level='${level}'`);
    for(let match=0;match<30;match++){
      g.run('dStart()');g.flush();assert(g.run('new Set([...D.hands.p,...D.hands.a,...(D.aCard?[D.aCard]:[])].map(b=>b.id)).size===10'));
      let n=0;
      while(!g.run('D.over')){
        assert(++n<100);
        const phase=g.run('D.phase');
        if(phase==='reveal'){g.run('dContinue()');g.flush();continue}
        assert(['pAttack','pDefend'].includes(phase));
        assert(!g.el('dFoe').innerHTML.includes('<img'));
        if(phase==='pAttack')g.run('D.sel={i:Math.floor(RNG()*D.hands.p.length),k:STATS[Math.floor(RNG()*5)]}');
        else g.run('D.sel={i:Math.floor(RNG()*D.hands.p.length)}');
        g.run('dConfirm()');g.flush();assert.equal(g.run('D.phase'),'reveal');assert(g.run('D.pCard&&D.aCard'));
        assert(g.el('dFoe').innerHTML.includes('data-stat='));
        if(!g.run('D.over')){g.run('dContinue()');g.flush()}
      }
      g.run('dEnd()');assert.equal(g.el('end').hidden,false);g.run('toMenu()');g.flush();
    }
  });
}
test('pilot Duel survives 25 repeated sudden-death ties with distinct valid bike pairs',()=>{
  const g=game();g.run("S.deck='pilot';PILOT_BIKES.forEach(b=>b.stats={topSpeed:50,power:50,engine:50,economy:50,value:50});dStart()");g.flush();
  for(let round=0;round<30;round++){
    if(g.run("D.phase==='pAttack'"))g.run("D.sel={i:0,k:'power'}");else g.run('D.sel={i:0}');
    g.run('dConfirm()');g.flush();
    assert.equal(g.run('D.outcome'),'draw');assert.equal(g.run('D.over'),false);
    assert(g.run('D.pCard&&D.aCard&&D.pCard.id!==D.aCard.id'));
    g.run('dContinue()');g.flush();
  }
  assert.equal(g.run('D.sudden'),true);
});
test('leaving Duel invalidates pending AI callbacks',()=>{
  const g=game();g.run("RNG=()=>.8;dStart();toMenu()");g.flush();assert.equal(g.run('D'),null);assert(g.el('home').className.includes('active'));
});
test('full deck without artwork reserves the same panel; supplied data and hero are unchanged',()=>{
  const g=game();const noArt=g.run('BIKES.find(b=>!ART[b.id])');
  assert(g.run(`cardHTML(BIKES.find(b=>b.id==='${noArt.id}')).includes('Artwork to follow')`));
  assert(html.includes('assets/motocardz-hero1-v006.avif'));
  const crypto=require('node:crypto');
  assert.equal(crypto.createHash('sha256').update(html.match(/const BIKES=(\[.*?\]);/s)[1]).digest('hex'),'d7bba1df21aa868111b833caf292538d0cb6605d7af251198cec10e62cc2e87a');
});

test('every offline shell resource and manifest icon exists',()=>{
  const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  const shell=worker.match(/const SHELL = \[([\s\S]*?)\];/)[1];
  for(const [,asset] of shell.matchAll(/'([^']+)'/g))assert(fs.existsSync(path.join(root,asset)),`Missing offline asset: ${asset}`);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  for(const icon of manifest.icons)assert(fs.existsSync(path.join(root,icon.src)),`Missing icon: ${icon.src}`);
});
test('ten pilot WebP assets are nonempty and compact',()=>{
  const g=game();const paths=JSON.parse(g.run('JSON.stringify(Object.values(ART))'));
  let total=0;
  for(const asset of paths){const bytes=fs.readFileSync(path.join(root,asset));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert(bytes.length>1000);assert(bytes.length<100000);total+=bytes.length}
  assert(total<700000,`Pilot images too large: ${total} bytes`);
});
