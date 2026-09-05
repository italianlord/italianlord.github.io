const K='tpf-v6-real';
const SEED=[
{id:'marco',cat:'power',name:'Marco Negri',age:34,city:'Sondrio',h:188,build:'atletico',cm:19,spec:['power fuck','standing','throat'],photo:'marco',rating:0},
{id:'diego',cat:'power',name:'Diego Pedrini',age:31,city:'Chiesa in Valmalenco',h:182,build:'muscolare',cm:20,spec:['marathon','prone bone','creampie'],photo:'diego',rating:0},
{id:'luca',cat:'power',name:'Luca Della Cuna',age:38,city:'Caspoggio',h:190,build:'slanciato',cm:21,spec:['dirty talk','hair pull','overstim'],photo:'luca',rating:0},
{id:'andrei',cat:'power',name:'Andrea Bormolini',age:36,city:'Lanzada',h:193,build:'powerlifter',cm:22,spec:['mating press','deep','holding down'],photo:'andrei',rating:0},
{id:'jamal',cat:'black',name:'Jamal Keita',age:32,city:'Sondrio',h:186,build:'cut',cm:21,spec:['black bull','power fuck','ritmo'],photo:'jamal',rating:0},
{id:'khalid',cat:'black',name:'Khalid Touré',age:29,city:'Chiesa in Valmalenco',h:184,build:'atletico',cm:20,spec:['stamina','wall','deep'],photo:'khalid',rating:0},
{id:'darius',cat:'black',name:'Darius Mensah',age:36,city:'Torre di Santa Maria',h:188,build:'elegante',cm:22,spec:['slow then wreck','controllo','notte'],photo:'darius',rating:0},
{id:'lucan',cat:'sondrio',name:'Riccardo Saligari',age:33,city:'Sondrio',h:183,build:'slick',cm:19,spec:['arrogante','seducente','power fuck'],photo:'lucan',rating:0},
{id:'matteo',cat:'sondrio',name:'Matteo Rizzi',age:35,city:'Chiesa in Valmalenco',h:181,build:'alpino',cm:18,spec:['valmalenco','presa','notte'],photo:'matteo',rating:0},
{id:'stefano',cat:'sondrio',name:'Stefano Del Prato',age:38,city:'Caspoggio',h:185,build:'orgoglioso',cm:19,spec:['comandare','hotel Sondrio','limitrofi'],photo:'stefano',rating:0},
{id:'paolo',cat:'separati',name:'Paolo Conti',age:44,city:'Sondrio',h:178,build:'dad-bod',cm:18,spec:['separato','pussy focus','casa'],photo:'paolo',rating:0},
{id:'riccardo',cat:'separati',name:'Riccardo Fumagalli',age:47,city:'Lanzada',h:182,build:'silver',cm:18,spec:['divorziato','lento poi duro','weekend'],photo:'riccardo',rating:0},
{id:'gianluca',cat:'separati',name:'Gianluca Rossi',age:42,city:'Spriana',h:180,build:'barba',cm:17,spec:['padre separato','aftercare','notte intera'],photo:'gianluca',rating:0}
];
let db; try{db=JSON.parse(localStorage.getItem(K))}catch(e){}
if(!db||!db.bulls) db={bulls:SEED.map(b=>Object.assign({},b)),appts:[]};
else {
  const byId=Object.fromEntries(db.bulls.map(b=>[b.id,b]));
  db.bulls=SEED.map(s=>Object.assign({},s,{rating:(byId[s.id]||{}).rating||0}));
}
const save=()=>localStorage.setItem(K,JSON.stringify({bulls:db.bulls.map(b=>({id:b.id,rating:b.rating})),appts:db.appts}));
let cat='power', view=new Date();
const TITOLI={power:'Selezione · Power Fuck · Sondrio e Valmalenco',black:'Selezione · Black Bull · Sondrio e Valmalenco',sondrio:'Selezione · Sondrio arrogante',separati:'Selezione · Separati · Sondrio e Valmalenco'};
function toast(t){const el=document.getElementById('msg');el.textContent=t;el.className='banner on';clearTimeout(toast._t);toast._t=setTimeout(()=>el.className='banner',3000)}
function list(){
 document.getElementById('sub').textContent=TITOLI[cat];
 document.getElementById('bulls').innerHTML=db.bulls.filter(b=>b.cat===cat).map(b=>`
  <div class="card"><div class="row">
   <img src="${PHOTOS[b.photo]}" alt="${b.name}"/>
   <div><b>${b.name}</b>
   <div class="meta">${b.age} · ${b.city} · ${b.h}cm · ${b.build} · ${b.cm}cm</div>
   <div>${(b.spec||[]).map(s=>'<span class="chip">'+s+'</span>').join('')}</div>
   <div class="stars">${[1,2,3,4,5].map(n=>'<button class="'+(n<=b.rating?'on':'')+'" onclick="rate(\''+b.id+'\','+n+')">★</button>').join('')}</div>
   </div></div>
   <div class="book">
    <input type="datetime-local" id="when-'+b.id+'"/>
    <select id="dur-'+b.id+'"><option value="60">60 min</option><option value="90" selected>90 min</option><option value="120">2 ore</option></select>
    <input id="place-'+b.id+'" placeholder="casa / Chiesa / Sondrio"/>
    <button class="btn" onclick="book(\''+b.id+'\')">Prenota</button>
   </div></div>`).join('');
}
function rate(id,n){const b=db.bulls.find(x=>x.id===id);if(!b)return;b.rating=n;save();list()}
function overlap(s,e){return db.appts.find(a=>s<a.end&&a.start<e)}
function book(id){
 const when=document.getElementById('when-'+id).value; if(!when) return toast('Scegli data e ora');
 const start=new Date(when).getTime(), end=start+(+document.getElementById('dur-'+id).value)*60000;
 const hit=overlap(start,end);
 if(hit){const o=db.bulls.find(b=>b.id===hit.bullId); return toast('Occupata: '+(o?o.name:'altro')+' '+fmt(hit.start));}
 db.appts.push({id:'a'+Date.now(),bullId:id,start,end,place:document.getElementById('place-'+id).value.trim()||'Sondrio'});
 save(); toast('Prenotato'); renderCal();
}
function fmt(t){return new Date(t).toLocaleString('it-IT',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function renderCal(){
 const y=view.getFullYear(), m=view.getMonth();
 document.getElementById('mtitle').textContent=view.toLocaleString('it-IT',{month:'long',year:'numeric'});
 const off=(new Date(y,m,1).getDay()+6)%7, days=new Date(y,m+1,0).getDate();
 let html=['L','M','M','G','V','S','D'].map(n=>'<b>'+n+'</b>').join('');
 for(let i=0;i<off;i++) html+='<i></i>';
 for(let d=1;d<=days;d++){
  const day=new Date(y,m,d).getTime(), next=day+86400000;
  html+="<span class='"+(db.appts.some(a=>a.start<next&&a.end>day)?'busy':'')+"'>"+d+"</span>";
 }
 document.getElementById('grid').innerHTML=html;
 document.getElementById('agenda').innerHTML=db.appts.slice().sort((a,b)=>a.start-b.start).map(a=>{
  const b=db.bulls.find(x=>x.id===a.bullId);
  return "<div class='card'><div class='row'><div><b>"+(b?b.name:'?')+"</b><div class='meta'>"+fmt(a.start)+" → "+fmt(a.end)+" · "+(a.place||'')+"</div></div></div></div>";
 }).join('')||"<p class='meta' style='padding:16px'>Nessuno slot.</p>";
}
document.getElementById('logoGate').src=LOGO;
document.getElementById('logoApp').src=LOGO;
document.getElementById('enter').onclick=()=>{document.getElementById('gate').style.display='none';document.getElementById('app').style.display='block';list();renderCal();};
document.querySelectorAll('#cats button').forEach(b=>b.onclick=()=>{cat=b.dataset.cat;document.querySelectorAll('#cats button').forEach(x=>x.classList.toggle('on',x===b));list();});
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id===b.dataset.tab));
 if(b.dataset.tab==='cal') renderCal();
});
document.getElementById('prev').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);renderCal();};
document.getElementById('next').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);renderCal();};
