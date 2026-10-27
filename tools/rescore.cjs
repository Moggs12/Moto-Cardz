// Rebuilds every card's 0–99 game scores from its printed real-world spec.
// Score = mid-rank percentile across the deck, so a better spec can never score lower,
// and equal specs always score the same. Value rewards a lower price.
// Usage: node tools/rescore.cjs   (rewrites the BIKES data in index.html)
const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'..','index.html');
const html=fs.readFileSync(file,'utf8');
const m=html.match(/const BIKES=(\[.*?\]);/s);
const bikes=JSON.parse(m[1]);
const SPEC={topSpeed:b=>b.topSpeed,power:b=>b.power,engine:b=>b.engineCC,economy:b=>b.mpg,value:b=>-b.price};
const n=bikes.length;
for(const [k,get] of Object.entries(SPEC)){
  const vals=bikes.map(get);
  bikes.forEach((b,i)=>{
    let lt=0,eq=0;for(const v of vals){if(v<vals[i])lt++;else if(v===vals[i])eq++}
    b.stats[k]=Math.round(1+98*(lt+(eq-1)/2)/(n-1));
  });
}
bikes.forEach(b=>{b.allRound=Math.round(Object.values(b.stats).reduce((a,c)=>a+c,0)/5)});
const json=JSON.stringify(bikes).replace(/[\u007f-\uffff]/g,c=>"\\u"+c.charCodeAt(0).toString(16).padStart(4,"0"));
fs.writeFileSync(file,html.replace(m[1],()=>json));
console.log('Rescored',n,'cards');
