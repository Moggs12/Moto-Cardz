const { test } = require('node:test');
const assert = require('node:assert/strict');
const XP = require('../progression.js');

function storage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: key => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, value),
    dump: () => map.get(XP.STORAGE_KEY)
  };
}
const sample = (id, mode, difficulty, won) => ({ id, mode, difficulty, won });

test('Build 011: completion and difficulty victory values are exactly as agreed', () => {
  for (const [difficulty, winXP] of Object.entries({ easy: 40, medium: 50, hard: 70 })) {
    assert.equal(XP.xpForMatch(difficulty, true), winXP);
    assert.equal(XP.xpForMatch(difficulty, false), 20);
    for (const mode of ['quick', 'duel']) {
      const store = XP.createStore(storage());
      assert.equal(store.awardMatch(sample('a', mode, difficulty, true)).addedXP, winXP);
      assert.equal(store.awardMatch(sample('b', mode, difficulty, false)).addedXP, 20);
      assert.equal(store.snapshot().totalXP, winXP + 20);
      assert.equal(store.snapshot().matches, 2);
      assert.equal(store.snapshot().wins, 1);
      assert.equal(store.snapshot().losses, 1);
    }
  }
});
test('Build 011: one match only grants XP once, even after storage reload', () => {
  const s = storage(), store = XP.createStore(s);
  const win = sample('match-001', 'quick', 'hard', true);
  assert.equal(store.awardMatch(win).addedXP, 70);
  const repeat = store.awardMatch(win);
  assert.equal(repeat.awarded, false);
  assert.equal(repeat.addedXP, 0);
  assert.equal(store.snapshot().matches, 1);
  const afterReload = XP.createStore(s);
  assert.equal(afterReload.snapshot().totalXP, 70);
  assert.equal(afterReload.awardMatch(win).awarded, false);
  assert.equal(afterReload.snapshot().matches, 1);
  assert.equal(afterReload.awardMatch(sample('match-002','duel','easy',false)).addedXP, 20);
  assert.equal(store.snapshot().matches, 1); // earlier snapshot doesn't silently mutate
  assert.equal(XP.createStore(s).snapshot().totalXP, 90);
});
test('Build 011: 50 levels, increasing thresholds, no prestige or XP loss at the cap', () => {
  assert.equal(XP.MAX_LEVEL, 50);
  assert.deepEqual([1,2,3,4,5].map(XP.requiredXP), [0,100,250,450,700]);
  for (let level=1;level<50;level++) {
    assert(XP.requiredXP(level+1)>XP.requiredXP(level));
    assert.equal(XP.riderLevel(XP.requiredXP(level)), level);
    assert.equal(XP.riderLevel(XP.requiredXP(level+1)-1), level);
  }
  assert.equal(XP.riderLevel(XP.requiredXP(50)),50);
  assert.equal(XP.riderLevel(Number.MAX_SAFE_INTEGER),50);
  assert.equal(XP.riderRank(1),'Rookie Rider');
  assert.equal(XP.riderRank(50),'Moto Legend');
  const capped=XP.createStore(storage({[XP.STORAGE_KEY]:JSON.stringify({
    version:1,totalXP:XP.requiredXP(50),matches:0,wins:0,losses:0,awardedIds:[]
  })}));
  assert.equal(capped.snapshot().isMaxLevel,true);
  assert.equal(capped.snapshot().percent,100);
  assert.equal(capped.snapshot().xpUntilNext,0);
  const award=capped.awardMatch(sample('after-cap','duel','hard',true));
  assert.equal(award.profile.level,50);
  assert.equal(award.profile.totalXP,XP.requiredXP(50)+70);
});
test('Build 011: crossing a level boundary refreshes next level and percentage', () => {
  const s=XP.createStore(storage());
  assert.equal(s.snapshot().level,1);
  assert.equal(s.awardMatch(sample('1','quick','hard',true)).profile.xpInLevel,70);
  const second=s.awardMatch(sample('2','quick','easy',true));
  assert.equal(second.previousLevel,1);
  assert.equal(second.profile.level,2);
  assert.equal(second.profile.xpInLevel,10);
  assert.equal(second.profile.xpForNextLevel,150);
  assert.equal(second.profile.xpUntilNext,140);
});
test('Build 011: corrupted storage, blocked storage and unrelated settings are safe', () => {
  assert.equal(XP.createStore(storage({[XP.STORAGE_KEY]:'not json'})).snapshot().totalXP,0);
  assert.equal(XP.createStore(storage({[XP.STORAGE_KEY]:JSON.stringify({version:1,totalXP:-9,matches:0,wins:0,losses:0})})).snapshot().totalXP,0);
  assert.equal(XP.createStore(storage({[XP.STORAGE_KEY]:JSON.stringify({version:1,totalXP:900,matches:1,wins:2,losses:0})})).snapshot().totalXP,0);
  const blocked={getItem(){throw Error('privacy')},setItem(){throw Error('privacy')}};
  const s=XP.createStore(blocked);
  assert.equal(s.awardMatch(sample('1','quick','easy',false)).addedXP,20);
  assert.equal(s.snapshot().totalXP,20);
});
test('Build 011: invalid modes, difficulties and result types cannot grant XP', () => {
  const s=XP.createStore(storage());
  for (const bad of [
    sample('bad','quick','legend',true),sample('bad','pilot','hard',true),
    sample('bad','duel','hard','true'),sample('','quick','easy',true),
    sample('bad','quick','hard',null)
  ]) assert.throws(()=>s.awardMatch(bad),TypeError);
  assert.equal(s.snapshot().totalXP,0);
  assert.equal(s.snapshot().matches,0);
});
test('Build 011: new match identifiers differ; snapshots remain immutable', () => {
  const s=XP.createStore(storage());
  const a=s.newMatchId(),b=s.newMatchId();
  assert.notEqual(a,b);
  assert(Object.isFrozen(s.snapshot()));
  assert.equal(s.awardMatch(sample(a,'quick','medium',true)).addedXP,50);
  assert.equal(s.awardMatch(sample(b,'duel','easy',false)).addedXP,20);
});
test('Build 011: saved awarded-id ledger stays bounded and prevents replay of recent matches', () => {
  const s=XP.createStore(storage());
  for(let i=0;i<520;i++)s.awardMatch(sample('m-'+i,'quick','easy',false));
  assert.equal(s.snapshot().matches,520);
  assert.equal(s.awardMatch(sample('m-519','quick','easy',false)).awarded,false);
});
