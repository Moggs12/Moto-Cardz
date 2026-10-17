const { test, expect } = require('@playwright/test');
const rewards = { easy:40, medium:50, hard:70 };
async function openHub(page) {
  await page.locator('#riderHubBtn').click();
  await expect(page.locator('#rider')).toHaveClass(/active/);
}
async function closeHub(page) {
  await page.locator('#rider [data-menu]').click();
  await expect(page.locator('#home')).toHaveClass(/active/);
}
async function begin(page, mode, difficulty, firstTo=3) {
  await page.goto('/');
  await page.locator('#modeOpts [data-v="'+mode+'"]').click();
  await page.locator('#levelOpts [data-v="'+difficulty+'"]').click();
  if(mode==='quick')await page.locator('#targetOpts [data-v="'+firstTo+'"]').click();
  await page.locator('#start').click();
}
test('Rider Hub: trophy navigation, 50-level foundation and clean initial progress', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#riderHubBtn')).toHaveAttribute('aria-label','Open Rider Hub');
  await openHub(page);
  await expect(page.locator('#riderLevel')).toHaveText('Level 1');
  await expect(page.locator('#riderRank')).toHaveText('Rookie Rider');
  await expect(page.locator('#riderXPLabel')).toHaveText('0 / 100 XP');
  await expect(page.locator('#riderMatches')).toHaveText('0');
  await expect(page.locator('#riderTotalXP')).toHaveText('0');
  await expect(page.locator('#rider')).toContainText('Daily & weekly challenges');
  await expect(page.locator('#rider')).toContainText('Lifetime trophies');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await closeHub(page);
});
test('Quick Match: exact win/loss XP matrix, one-time reward, save and reload', async ({page}) => {
  let total=0;
  for(const difficulty of ['easy','medium','hard']) for(const won of [true,false]) {
    await begin(page,'quick',difficulty);
    await page.evaluate(({won})=>{
      const arr=BIKES.slice().sort((a,b)=>a.stats.power-b.stats.power);
      Q.score.p=won?Q.target-1:0;Q.score.a=won?0:Q.target-1;
      Q.player=won?arr[arr.length-1]:arr[0];
      Q.hand=[won?arr[0]:arr[arr.length-1]];
      $('qPlayer').innerHTML=cardHTML(Q.player,{act:true});
    },{won});
    await page.locator('#qPlayer [data-stat="power"]').click();
    await expect(page.locator('#qNext')).toHaveText('See result');
    total+=won?rewards[difficulty]:20;
    await page.locator('#qNext').click();
    await expect(page.locator('#endXP')).toHaveText('+'+(won?rewards[difficulty]:20)+' XP earned');
    // Re-showing the same result cannot grant XP a second time.
    await page.evaluate(()=>qEnd());
    await page.locator('#endMenu').click();
    await openHub(page);
    await expect(page.locator('#riderTotalXP')).toHaveText(total.toLocaleString('en-GB'));
    await closeHub(page);
    await page.reload();
    await openHub(page);
    await expect(page.locator('#riderTotalXP')).toHaveText(total.toLocaleString('en-GB'));
    await closeHub(page);
  }
  await openHub(page);
  await expect(page.locator('#riderMatches')).toHaveText('6');
  await expect(page.locator('#riderWins')).toHaveText('3');
  await expect(page.locator('#riderLosses')).toHaveText('3');
});
test('Duel: rewards use actual terminal result and difficulty across both outcomes', async ({page}) => {
  let total=0;
  for(const difficulty of ['easy','medium','hard']) for(const won of [true,false]) {
    await begin(page,'duel',difficulty);
    await page.evaluate(({won})=>{
      // Close out a fully initiated Duel deterministically using the real resolution routine.
      // In-depth 5-round gameplay is separately covered by game.test.cjs and app.spec.cjs.
      SID++;D.sid=SID;
      const arr=BIKES.slice().sort((a,b)=>a.stats.power-b.stats.power);
      D.pCard=won?arr[arr.length-1]:arr[0];
      D.aCard=won?arr[0]:arr[arr.length-1];
      D.stat='power';D.phase='aDefend';
      D.score.p=won?2:0;D.score.a=won?0:2;
      dResolve();
    },{won});
    await expect(page.locator('#dNext')).toHaveText('See result');
    await page.locator('#dNext').click();
    const earned=won?rewards[difficulty]:20;total+=earned;
    await expect(page.locator('#endXP')).toHaveText('+'+earned+' XP earned');
    await page.locator('#endMenu').click();
    await openHub(page);
    await expect(page.locator('#riderTotalXP')).toHaveText(total.toLocaleString('en-GB'));
    await closeHub(page);
  }
  await openHub(page);
  await expect(page.locator('#riderMatches')).toHaveText('6');
});
test('Quit and reload mid-match do not award XP; AI difficulty is locked at start', async ({page}) => {
  await begin(page,'quick','hard',7);
  await page.locator('#qPlayer .stat').first().click();
  await page.locator('#quick [data-menu]').click();
  await openHub(page);
  await expect(page.locator('#riderTotalXP')).toHaveText('0');
  await closeHub(page);
  await begin(page,'quick','hard');
  await page.evaluate(()=>{
    const arr=BIKES.slice().sort((a,b)=>a.stats.power-b.stats.power);
    Q.score.p=Q.target-1; Q.player=arr[arr.length-1];Q.hand=[arr[0]];
    $('qPlayer').innerHTML=cardHTML(Q.player,{act:true});
    S.level='easy';S.target=7; // Attempt mid-match difficulty/target change.
  });
  await page.locator('#qPlayer [data-stat="power"]').click();
  await expect(page.locator('#qNext')).toHaveText('See result');
  await page.locator('#qNext').click();
  await expect(page.locator('#endXP')).toHaveText('+70 XP earned');
  await page.locator('#endMenu').click();
  await openHub(page);
  await expect(page.locator('#riderTotalXP')).toHaveText('70');
  await closeHub(page);
  await page.reload();
  await openHub(page);
  await expect(page.locator('#riderTotalXP')).toHaveText('70');
});
test('Level 50 keeps a full progress bar and continues adding lifetime XP', async ({page}) => {
  await page.goto('/');
  await page.evaluate(()=>{
    const max=MotoProgression.requiredXP(50);
    localStorage.setItem(MotoProgression.STORAGE_KEY,JSON.stringify({
      version:1,totalXP:max,matches:0,wins:0,losses:0,awardedIds:[]
    }));
  });
  await page.reload();
  await openHub(page);
  await expect(page.locator('#riderLevel')).toHaveText('Level 50');
  await expect(page.locator('#riderRank')).toHaveText('Moto Legend');
  await expect(page.locator('#riderXPLabel')).toHaveText('Level 50 / 50');
  await expect(page.locator('#riderMeter')).toHaveAttribute('aria-valuenow','100');
  await closeHub(page);
  await begin(page,'quick','easy');
  await page.evaluate(()=>{
    const arr=BIKES.slice().sort((a,b)=>a.stats.power-b.stats.power);
    Q.score.p=Q.target-1;Q.player=arr[arr.length-1];Q.hand=[arr[0]];
    $('qPlayer').innerHTML=cardHTML(Q.player,{act:true});
  });
  await page.locator('#qPlayer [data-stat="power"]').click();
  await page.locator('#qNext').click();
  await expect(page.locator('#endXP')).toHaveText('+40 XP earned');
  await page.locator('#endMenu').click();
  await openHub(page);
  await expect(page.locator('#riderLevel')).toHaveText('Level 50');
  await expect(page.locator('#riderTotalXP')).toHaveText('63,740');
});
