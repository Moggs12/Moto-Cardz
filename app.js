const bikes=[
['BK-001','Aprilia','RSV4 Factory 1100','Hyper / Extreme',90,99,72,45,31,67,'#C8FF3D'],
['BK-002','Aprilia','Tuono V4 Factory','Sport',91,91,79,3,34,60,'#E46CFF'],
['BK-003','Aprilia','Tuono 660 Factory','Sport',55,47,24,40,38,41,'#E46CFF'],
['BK-009','BMW','R18 Classic','Classic',32,51,95,40,8,45,'#FC6C26'],
['BK-017','BMW','R12 nineT','Classic',77,69,84,79,71,76,'#FC6C26'],
['BK-019','BMW','M1000RR','Hyper / Extreme',97,96,55,11,8,53,'#C8FF3D'],
['BK-023','BMW','S1000R Sport','Sport',93,89,68,5,40,59,'#E46CFF'],
['BK-029','BSA','Bantam 350','Classic',10,8,2,89,95,41,'#FC6C26'],
['BK-033','CFMoto','450MT','Adventure',80,18,15,78,98,58,'#CFFF74'],
['BK-038','Ducati','Panigale V4 S','Hyper / Extreme',94,92,75,16,11,58,'#C8FF3D'],
['BK-039','Ducati','Streetfighter V4 S','Hyper / Extreme',99,81,75,3,14,54,'#C8FF3D'],
['BK-043','Ducati','Monster','Classic',66,70,57,75,73,68,'#FC6C26'],
['BK-050','Harley-Davidson','Pan America Special','Touring',64,84,86,21,37,58,'#B8F7E4'],
['BK-059','Honda','CBR1000RR-R Fireblade SP','Hyper / Extreme',87,97,65,32,25,61,'#C8FF3D'],
['BK-061','Honda','CB1000 Hornet SP','Naked / Street',88,87,71,4,91,68,'#5B3DF5'],
['BK-063','Honda','CB750 Hornet','Classic',77,51,40,79,97,69,'#FC6C26'],
['BK-088','Kawasaki','Z900','Sport',70,68,62,54,95,70,'#E46CFF'],
['BK-092','Kawasaki','Ninja 650','Sport',38,18,18,92,88,51,'#E46CFF'],
['BK-098','KTM','1390 Super Duke R Evo','Hyper / Extreme',77,79,91,32,52,66,'#C8FF3D'],
['BK-136','Suzuki','Hayabusa','Hyper / Extreme',90,83,88,32,59,70,'#C8FF3D'],
['BK-150','Triumph','Speed Triple 1200 RS','Sport',88,93,86,50,58,75,'#E46CFF'],
['BK-156','Triumph','Tiger Sport 800','Touring',45,58,32,63,74,54,'#B8F7E4'],
['BK-159','Triumph','Street Triple 765 RS','Sport',70,73,35,58,73,62,'#E46CFF'],
['BK-170','Yamaha','Tracer 9 GT+','Touring',57,64,46,37,24,46,'#B8F7E4'],
['BK-176','Yamaha','MT-09','Naked / Street',57,70,53,40,76,59,'#5B3DF5'],
['BK-179','Yamaha','Ténéré 700','Adventure',37,30,34,84,50,47,'#CFFF74']
].map(x=>({id:x[0],make:x[1],model:x[2],type:x[3],stats:{top:x[4],power:x[5],engine:x[6],economy:x[7],value:x[8],all:x[9]},accent:x[10]}));
const statDefs=[['top','TOP SPEED'],['power','POWER'],['engine','ENGINE'],['economy','ECONOMY'],['value','VALUE']];let deck=[],player,ai,ps=0,as=0,round=1,locked=false;
const $=id=>document.getElementById(id);function shuffle(a){return [...a].sort(()=>Math.random()-.5)}function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1500)}
function cardHTML(b){return `<div class="stripe" style="--accent:${b.accent}"></div><div class="class">${b.type}</div><div class="bike-name">${b.model}</div><div class="maker">${b.make} • ${b.id}</div><div class="sil">🏍️</div>${statDefs.map(([k,n])=>`<div class="statline"><span>${n}</span><b>${b.stats[k]}</b></div>`).join('')}`}
function deal(){if(deck.length<2)deck=shuffle(bikes);player=deck.pop();ai=deck.pop();locked=false;$('playerCard').innerHTML=cardHTML(player);$('aiCard').classList.add('face-down');$('aiCard').innerHTML='<div class="back-logo">M<br><small>CARDZ</small></div>';$('status').textContent='CHOOSE YOUR STAT';$('next').classList.add('hidden');renderStats();$('round').textContent=`ROUND ${round}`;$('playerScore').textContent=ps;$('aiScore').textContent=as}
function renderStats(){$('stats').innerHTML=statDefs.map(([k,n])=>`<button class="stat-btn" data-stat="${k}"><strong>${n}</strong><span>${player.stats[k]}</span></button>`).join('');document.querySelectorAll('.stat-btn').forEach(b=>b.onclick=()=>play(b.dataset.stat))}
function play(k){if(locked)return;locked=true;document.querySelectorAll('.stat-btn').forEach(b=>b.disabled=true);$('aiCard').classList.remove('face-down');$('aiCard').innerHTML=cardHTML(ai);const a=player.stats[k],b=ai.stats[k];let result=a>b?'WIN':a<b?'LOSE':'DRAW';if(result==='WIN')ps++;else if(result==='LOSE')as++;$('status').textContent=result==='DRAW'?'DRAW ROUND':result==='WIN'?'YOU WIN THE ROUND':'AI WINS THE ROUND';toast(result==='WIN'?'🔥 Nice one!':result==='LOSE'?'AI takes it.':'Dead heat!');$('next').classList.remove('hidden');$('playerScore').textContent=ps;$('aiScore').textContent=as}
$('start').onclick=()=>{$('home').classList.remove('active');$('game').classList.add('active');ps=as=0;round=1;deck=shuffle(bikes);deal()};$('next').onclick=()=>{round++;deal()};$('quit').onclick=()=>{$('game').classList.remove('active');$('home').classList.add('active')};
