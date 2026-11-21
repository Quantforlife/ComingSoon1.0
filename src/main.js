import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/global.css';
import { VYRON } from './config/vyron.js';

/* ============ CONTENT CONFIG — edit here, no animation code changes needed ============ */
const ST={confirmed:"Confirmed",proposed:"Proposed",awaiting:"Awaiting approval",tba:"To be announced"};
const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const MOB=matchMedia('(max-width:760px)').matches;
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V=VYRON,tba=v=>v?E(v):'<dd class="tba">';

/* ============ RENDER CONTENT ============ */
$('#theme').textContent=V.brand.theme;
$('#desc').textContent=V.event.description+" AI Hackathon and Knowledge Sessions.";
$('#inst').innerHTML=`<div id="logoSlot"><img src="${E(V.institution.logo)}" alt="${E(V.institution.college)} logo" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'lock-fb',innerHTML:'S.S. Dempo College<small>Commerce and Economics (Autonomous), Goa</small>'}))"></div><p>Presented by ${E(V.institution.school)} and ${E(V.institution.college)}.</p>`;
$('#meta').innerHTML=`<div><span>Where</span><b>${E(V.event.location)}</b></div><div><span>When</span><b>${E(V.event.date||'Date to be announced')}</b></div><div><span>Venue</span><b>${E(V.event.venue||'To be announced')}</b></div>`;
$('#aboutP').textContent=V.about;
$('#aud').innerHTML=V.audience.map(a=>`<div><h3>${E(a.t)}</h3><p>${E(a.d)}</p></div>`).join('');
$('#speakers').innerHTML=V.speakers.length?V.speakers.map(s=>`<div><h3>${E(s.name)}</h3><p>${E(s.role||'')} ${E(s.org||'')}</p></div>`).join(''):`<div><span class="st">${ST.tba}</span><h3>Speakers</h3><p>No speakers are confirmed yet.</p></div><div><span class="st">${ST.tba}</span><h3>Session schedule</h3><p>Topics and timings will follow.</p></div>`;
$('#hackP').textContent=V.hackathon.description;
$('#hackF').innerHTML=Object.entries(V.hackathon.fields).map(([k,v])=>`<div><dt>${E(k)}</dt>${v?`<dd>${E(v)}</dd>`:`<dd class="tba">To be announced</dd>`}</div>`).join('');
$('#prog').innerHTML=V.programme.map(p=>`<div><span class="st ${p.status==='confirmed'?'c':''}">${ST[p.status]}</span><h3>${E(p.name)}</h3><p>${E(p.description)}</p></div>`).join('');
$('#partnerList').innerHTML=V.partners.length?V.partners.map(p=>`<div><span class="st c">${E(p.type||'')}</span><h3>${E(p.name)}</h3></div>`).join(''):`<div><span class="st c">Institutional</span><h3>${E(V.institution.school)}</h3></div><div><span class="st c">Institutional</span><h3>S.S. Dempo College of Commerce and Economics (Autonomous)</h3></div><div><span class="st">${ST.tba}</span><h3>Technology, knowledge and sponsorship partners</h3></div>`;
const R=V.registration;
$('#ways').innerHTML=[["General participants",R.general],["Hackathon teams",R.hackathon],["Competitions",R.competitions],["Partnerships",R.partnerships]].map(([l,u])=>u?`<a class="btn" href="${E(u)}" target="_blank" rel="noopener">${l} <span>→</span></a>`:`<span class="btn" role="link" aria-disabled="true">${l}<small class="mono">Link to be announced</small></span>`).join('');
$('#fInst').innerHTML=`Presented by<br>${E(V.institution.school)}<br>${E(V.institution.college)}`;
$('#fNav').innerHTML=['about:Summit','knowledge:Knowledge','hackathon:Hackathon','programme:Programme','register:Participate'].map(s=>{const[a,b]=s.split(':');return`<li><a href="#${a}">${b}</a></li>`}).join('')+Object.entries(V.social).map(([k,u])=>`<li><a href="${E(u)}" target="_blank" rel="noopener">${E(k)}</a></li>`).join('');
$('#fContact').innerHTML=R.contact?`Contact<br><a href="${R.contact.includes('@')?'mailto:'+E(R.contact):E(R.contact)}">${E(R.contact)}</a>`:'Contact details to be announced';
$('#yr').textContent=new Date().getFullYear();

/* stages */
const STAGES=[
 {k:"The signal",h:"The future doesn’t wait.",p:"Something is taking shape in the dark. It is not waiting for permission.",s:"L",d:"left"},
 {k:"The possibility",h:"It is built.",p:"VYRON SUMMIT is a meeting point for technology, ideas and ambition — where young people stop watching the future and start making it.",s:"R",d:"right"},
 {k:"Understand",h:"Know what you are building with.",p:"Knowledge Sessions on artificial intelligence, emerging technologies and what they mean for business and society.",s:"L",d:"mask"},
 {k:"Learn",h:"Learn from those closest to it.",p:"Expert sessions bringing research and industry into one room. Speakers will be announced once confirmed.",s:"R",d:"up"},
 {k:"Build",h:"The AI Hackathon.",p:"Form a team. Work together. Turn an idea into a working project. Challenge details, rules and dates will be published here when confirmed.",s:"L",d:"scale",big:1,btn:["#hackathon","Hackathon details"]},
 {k:"Connect",h:"Better in the same room.",p:"Students, builders, researchers, academics and industry professionals, together in Goa.",s:"R",d:"right"},
 {k:"The invitation",h:"VYRON",p:"Challenge what comes next.",s:"C",d:"scale",big:1,btn:["#register","Take part"]}];
$('#story').innerHTML=STAGES.map(s=>`<div class="stage ${s.s} ${s.big?'big':''}" data-d="${s.d}"><div class="tx"><span class="mono rv">${s.k}</span><h2 class="rv">${s.h}</h2><p class="rv">${s.p}</p>${s.btn?`<a class="btn rv" href="${s.btn[0]}">${s.btn[1]} <span>→</span></a>`:''}</div></div>`).join('');

/* ============ TEASER CONTROLLER ============ */
const teaser=$('#teaser'),vid=$('#vid'),poster=$('#poster');
let finished=false;
function finishTeaser(){
 if(finished)return;finished=true;
 document.body.classList.add('done');
 document.documentElement.classList.remove('lock');
 setTimeout(()=>ScrollTrigger.refresh(),100);
}
function fallback(){teaser.classList.add('fallback');if(!finished)setTimeout(finishTeaser,4500)}
function loadMedia(){
 return new Promise(res=>{
  let n=0;const done=()=>{if(++n===2)res()};
  poster.onload=()=>{teaser.classList.add('show-poster');done()};poster.onerror=done;poster.src=V.media.teaserPoster;
  const ok=()=>{vid.removeEventListener('canplay',ok);done()};
  vid.addEventListener('canplay',ok);
  vid.addEventListener('error',()=>{teaser.dataset.err=1;done()});
  vid.src=V.media.teaser;vid.load();
  setTimeout(res,8000); // never trap the visitor
 });
}
async function startOpening(){
 document.documentElement.classList.add('lock');
 await loadMedia();
 $('#loader').classList.add('out');document.body.classList.add('ready');
 setTimeout(()=>$('#loader').remove(),1100);
 if(teaser.dataset.err||vid.readyState<2){fallback();return}
 teaser.classList.add('play');
 vid.play().catch(()=>{fallback()});
 vid.addEventListener('ended',()=>setTimeout(finishTeaser,900));
 vid.addEventListener('error',fallback);
}
$('#skip').onclick=()=>{vid.pause();finishTeaser();$('#hero').scrollIntoView({behavior:RM?'auto':'smooth'})};
$('#snd').onclick=e=>{vid.muted=!vid.muted;e.currentTarget.textContent=vid.muted?'Sound off':'Sound on';e.currentTarget.setAttribute('aria-pressed',!vid.muted)};
$('#up').onclick=()=>scrollTo({top:0,behavior:RM?'auto':'smooth'});
$('#burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o);e.currentTarget.textContent=o?'Close':'Menu'};
$('#nav').addEventListener('click',e=>{if(e.target.closest('a')){$('#nav').classList.remove('open');$('#burger').textContent='Menu'}});

/* ============ THREE: OBSIDIAN MONOLITH ============ */
const S={x:0,y:-5,z:-5,rx:.2,ry:0,rz:0,s:1,cx:0,cz:8,r:0,k:0},P={...S}; // S = scroll targets, P = smoothed
let gl=true,renderer,scene,cam,monolith,mat,keyL,rimL,fillL,edges,active=false,mx=0,my=0;
try{
 renderer=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:!MOB,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,MOB?1.5:2));
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputEncoding=THREE.sRGBEncoding;
}catch(e){gl=false;document.body.classList.add('nogl')}
function hash(a,b,c){const s=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return s-Math.floor(s)}
function shardGeo(g,amt){
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=+p.getX(i).toFixed(3),y=+p.getY(i).toFixed(3),z=+p.getZ(i).toFixed(3);
  const k=(hash(x,y,z)-.5)*amt;
  p.setXYZ(i,x+k*1.1,y+(hash(z,x,y)-.5)*amt*.7,z+(hash(y,z,x)-.5)*amt);
 }
 g.computeVertexNormals();return g;
}
function surfaceTex(){
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
 g.fillStyle='#2a2a2a';g.fillRect(0,0,512,512);
 for(let i=0;i<2200;i++){const v=20+Math.random()*90|0;g.fillStyle=`rgba(${v},${v},${v},.35)`;const r=Math.random()*18+1;g.beginPath();g.arc(Math.random()*512,Math.random()*512,r,0,7);g.fill()}
 g.lineWidth=1;for(let i=0;i<90;i++){g.strokeStyle=`rgba(${Math.random()>.5?160:10},${Math.random()>.5?160:10},${Math.random()>.5?160:10},.4)`;g.beginPath();const x=Math.random()*512,y=Math.random()*512;g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*160,y+(Math.random()-.5)*160);g.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
function initScene(){
 scene=new THREE.Scene();
 cam=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,.1,60);
 // custom studio environment — softboxes + one vermillion strip
 const es=new THREE.Scene(),pm=new THREE.PMREMGenerator(renderer);
 es.add(new THREE.Mesh(new THREE.SphereGeometry(30,16,16),new THREE.MeshBasicMaterial({color:0x040405,side:THREE.BackSide})));
 const panel=(w,h,col,i,pos)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(col).multiplyScalar(i),side:2,toneMapped:false}));m.position.set(...pos);m.lookAt(0,0,0);es.add(m)};
 panel(9,6,0xffffff,5,[-9,8,7]);panel(1.6,14,0xE34234,6,[11,0,-5]);panel(12,1.8,0xaabbdd,1.6,[0,-9,8]);panel(8,1,0xffffff,3,[0,11,-8]);panel(1,8,0xA52624,3,[-11,-2,-6]);
 scene.environment=pm.fromScene(es,.02).texture;
 const tx=surfaceTex();
 mat=new THREE.MeshPhysicalMaterial({color:0x0b0b0c,metalness:.9,roughness:1,roughnessMap:tx,bumpMap:tx,bumpScale:1.2,clearcoat:1,clearcoatRoughness:.06,sheen:new THREE.Color(0x5a1612),envMapIntensity:1.5,flatShading:true});
 monolith=new THREE.Group();
 // main faceted monolith: hexagonal prism, tapered, fractured, slanted crown
 let g=new THREE.CylinderGeometry(.62,1.05,3.6,6,5,false).toNonIndexed();
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);if(y>1.7)p.setY(i,y-x*.42-.1);}
 g=shardGeo(g,MOB?.26:.3);
 const body=new THREE.Mesh(g,mat);body.rotation.y=.3;monolith.add(body);
 // fracture edges: dim vermillion, intensity driven by scroll
 edges=new THREE.LineSegments(new THREE.EdgesGeometry(g,28),new THREE.LineBasicMaterial({color:0xE34234,transparent:true,opacity:0}));edges.rotation.y=.3;edges.scale.setScalar(1.002);monolith.add(edges);
 // detached shards, same material
 const shards=[[1.7,.9,.5,.4],[-1.5,-.8,.7,.3],[1.2,-1.5,-.4,.26],[-1.1,1.6,-.3,.22],[.3,2.2,.8,.18]];
 shards.forEach(([x,y,z,s],i)=>{const m=new THREE.Mesh(shardGeo(new THREE.OctahedronGeometry(s,0).toNonIndexed(),.2),mat);m.position.set(x,y,z);m.scale.set(1,2.1,1);m.rotation.set(i,i*1.7,i*.6);monolith.add(m)});
 monolith.scale.setScalar(MOB?.8:1);
 scene.add(monolith);
 keyL=new THREE.DirectionalLight(0xfff2e4,0);keyL.position.set(-4,5,6);scene.add(keyL);
 fillL=new THREE.DirectionalLight(0x9db4d8,.0);fillL.position.set(5,-2,4);scene.add(fillL);
 rimL=new THREE.PointLight(0xE34234,0,14,1.6);rimL.position.set(3.5,1,-3);scene.add(rimL);
 scene.add(new THREE.AmbientLight(0x08080a,.5));
 scene.fog=new THREE.FogExp2(0x080809,.045); // restrained haze
 resize();
}
function resize(){if(!gl)return;renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
document.addEventListener('visibilitychange',()=>{if(document.hidden)active=false;else ScrollTrigger.update()});

// adaptive quality — drops pixel ratio if frames run slow
let q=0,last=performance.now(),slow=0;
function frame(t){
 requestAnimationFrame(frame);
 if(!gl||!active)return;
 const dt=t-last;last=t;slow=dt>28?slow+1:Math.max(0,slow-1);
 if(slow>40&&renderer.getPixelRatio()>1){renderer.setPixelRatio(Math.max(1,renderer.getPixelRatio()-.25));resize();slow=0}
 const k=RM?1:.075;
 for(const a in S)P[a]+=(S[a]-P[a])*k;
 monolith.position.set(P.x,P.y,P.z);
 monolith.rotation.set(P.rx+my*.12,P.ry+mx*.22,P.rz);
 monolith.scale.setScalar(P.s*(MOB?.8:1));
 cam.position.set(P.cx,0,P.cz);cam.lookAt(0,0,0);
 keyL.intensity=P.k*2.6;fillL.intensity=P.k*.45;rimL.intensity=P.r*70;
 edges.material.opacity=P.r*.42;
 mat.envMapIntensity=.25+P.k*1.3;
 renderer.render(scene,cam);
}

/* ============ SCROLL NARRATIVE — single timeline owns object + camera ============ */
const W=MOB?0.22:1,YO=MOB?1.5:0; // mobile: object centred up top, text below
const KF=[ // x,y,z,rx,ry,rz,s,cx,cz,r(red),k(key)
 {x:1.6*W,y:YO-.2,z:-1,rx:.15,ry:.5,rz:0,s:.95,cx:0,cz:8,r:.55,k:.35},          // 1 signal: emerges, first red highlight
 {x:-1.9*W,y:YO+.1,z:0,rx:-.25,ry:2.2,rz:.12,s:1.1,cx:1.2*W,cz:7.2,r:.8,k:.8},   // 2 possibility: moves aside, camera shifts
 {x:1.7*W,y:YO,z:.4,rx:.45,ry:3.8,rz:-.2,s:1.15,cx:-1,cz:6.8,r:.4,k:1.1},       // 3 understand
 {x:-1.8*W,y:YO-.3,z:0,rx:-.4,ry:5.4,rz:.3,s:1,cx:.8,cz:7.5,r:.65,k:.7},        // 4 learn
 {x:1.2*W,y:YO,z:2.6,rx:.2,ry:7.2,rz:-.4,s:1.5,cx:-.8,cz:5.2,r:1,k:.9},        // 5 build: camera closes in
 {x:-1.5*W,y:YO+.2,z:-.5,rx:-.3,ry:8.8,rz:.1,s:1.05,cx:0,cz:8.6,r:.6,k:1.2},    // 6 connect: opens up
 {x:0,y:YO-.4,z:-2.2,rx:.1,ry:Math.PI*2+9.4,rz:0,s:1.7,cx:0,cz:9,r:1,k:1}        // 7 invitation: monolith behind VYRON
];
function buildNarrative(){
 gsap.registerPlugin(ScrollTrigger);
 // video leaves with the page; slight parallax on the film
 gsap.to('#teaser video,#teaser .poster',{yPercent:18,ease:'none',scrollTrigger:{trigger:'#teaser',start:'top top',end:'bottom top',scrub:true}});
 if(gl){
  const tl=gsap.timeline({scrollTrigger:{trigger:'#story',start:'top bottom',end:'bottom bottom',scrub:RM?true:.8}});
  KF.forEach((f,i)=>tl.to(S,{...f,duration:1,ease:'power2.inOut'},i));
  ScrollTrigger.create({trigger:'#story',start:'top bottom',end:'bottom top',onToggle:s=>active=s.isActive});
 }
 // text choreography — direction per stage, fully reversible
 const from={left:{x:-140,autoAlpha:0},right:{x:140,autoAlpha:0},up:{y:90,autoAlpha:0},scale:{scale:.82,autoAlpha:0,transformOrigin:'50% 50%'},mask:{clipPath:'inset(0 0 100% 0)',y:30,autoAlpha:0}};
 document.querySelectorAll('.stage').forEach(st=>{
  const els=st.querySelectorAll('.rv');
  if(RM)return;
  gsap.from(els,{...from[st.dataset.d],duration:1.2,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:st,start:'top 55%',toggleActions:'play none none reverse'}});
  gsap.to(els,{autoAlpha:0,y:-40,ease:'none',scrollTrigger:{trigger:st,start:'bottom 55%',end:'bottom 15%',scrub:true}});
 });
}

/* cursor */
if(!RM&&matchMedia('(pointer:fine)').matches){
 document.body.classList.add('cur');const c=$('#cur');let cx=0,cy=0,tx=0,ty=0;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
 (function l(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px) rotate(45deg)`;requestAnimationFrame(l)})();
 document.addEventListener('pointerover',e=>c.classList.toggle('h',!!e.target.closest('a,button')));
}

/* ============ BOOT ============ */
if(gl){try{initScene()}catch(e){console.warn(e);gl=false;document.body.classList.add('nogl')}}
buildNarrative();
requestAnimationFrame(frame);
startOpening();
