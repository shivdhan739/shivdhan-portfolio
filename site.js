/* Shared on every page: header, footer, 3D background, menu, effects */
(function(){
var PAGES=[["index.html","Home"],["about.html","About"],["skills.html","Skills"],["experience.html","Experience"],["projects.html","Projects"],["education.html","Education"],["source.html","Source"],["contact.html","Contact"]];
var here=(location.pathname.split("/").pop()||"index.html").toLowerCase();
var links=PAGES.map(function(p){return '<a href="'+p[0]+'"'+(p[0]===here?' class="on" aria-current="page"':'')+'>'+p[1]+'</a>'}).join("");
document.body.insertAdjacentHTML("afterbegin",'<canvas id="bg" aria-hidden="true"></canvas><header><div class="w"><nav><a class="logo" href="index.html"><span class="lg">S</span>Shivdhan</a><div class="links" id="lk">'+links+'<a href="#lab">AI Lab</a><a href="admin.html" class="ml'+(here==="admin.html"?' on':'')+'">🔒 Admin</a></div><div class="nr"><a class="btn pri" href="contact.html">Let’s talk</a><button class="mt" id="mt" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="lk"><span></span><span></span><span></span></button></div></nav></div></header>');
document.body.insertAdjacentHTML("beforeend",'<footer><div class="w">© 2026 Shivdhan Shirgole. Built with HTML, CSS, JavaScript and Three.js. · <a href="admin.html" style="opacity:.55">Admin</a></div></footer>');
})();

/* mobile menu */
(function(){
var b=document.getElementById("mt"),m=document.getElementById("lk");
function set(o){m.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");b.setAttribute("aria-label",o?"Close menu":"Open menu")}
b.addEventListener("click",function(e){e.stopPropagation();set(!m.classList.contains("open"))});
m.addEventListener("click",function(e){if(e.target.closest("a"))set(false)});
document.addEventListener("click",function(e){if(!e.target.closest("header"))set(false)});
document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
addEventListener("resize",function(){if(innerWidth>900)set(false)});
})();

(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* typed role */
var roles=["Python Full Stack Developer","Django & Flask Engineer","Automation & AI Builder","SAP MM Data Specialist"],ri=0,ci=0,del=false,ty=document.getElementById('ty');
function type(){var r=roles[ri];if(reduce){ty.textContent=r;return}
ty.textContent=r.slice(0,ci);
if(!del&&ci<r.length){ci++;setTimeout(type,70)}else if(!del){del=true;setTimeout(type,1400)}else if(ci>0){ci--;setTimeout(type,35)}else{del=false;ri=(ri+1)%roles.length;setTimeout(type,300)}}
if(ty)type();
/* skills ring */
var sk=["Python","Django","Flask","Node.js","JavaScript","SQL","MySQL","MongoDB","Firebase","OpenCV","Pandas","Scikit-learn","SAP MM","Git"],ring=document.getElementById('ring');
var R=innerWidth<860?190:290;
if(ring)sk.forEach(function(n,i){var d=document.createElement('div');d.textContent=n;d.style.transform='rotateY('+(i*360/sk.length)+'deg) translateZ('+R+'px)';ring.appendChild(d)});
/* tilt cards (delegated, works for admin-added projects too) */
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.tilt');if(!c||reduce||e.pointerType==='touch')return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
c.style.transform='rotateY('+((x-.5)*16)+'deg) rotateX('+((.5-y)*16)+'deg)';c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%')});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''});
/* 3D automation network */
if(!window.THREE)return;
var cv=document.getElementById('bg'),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
ren.setPixelRatio(Math.min(devicePixelRatio,2));
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=15;
var g=new THREE.Group();scene.add(g);
var N=innerWidth<860?55:95,pts=[],rnd=Math.random;
for(var i=0;i<N;i++){var u=rnd()*2-1,t=rnd()*6.283,rad=5+rnd()*4,s=Math.sqrt(1-u*u);
pts.push(new THREE.Vector3(rad*s*Math.cos(t),rad*u*.8,rad*s*Math.sin(t)))}
var cols=[0x3de8ff,0x8b5cf6,0x4ff0b0],edges=[];
var sg=new THREE.SphereGeometry(.12,10,10);
pts.forEach(function(p,i){var m=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:cols[i%3]}));m.position.copy(p);g.add(m)});
var lp=[];for(i=0;i<N;i++)for(var j=i+1;j<N;j++)if(pts[i].distanceTo(pts[j])<3.4){lp.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z);edges.push([i,j])}
var lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));
g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x3d5bff,transparent:true,opacity:.28})));
var core=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,1),new THREE.MeshBasicMaterial({color:0x3de8ff,wireframe:true,transparent:true,opacity:.55}));g.add(core);
var core2=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,0),new THREE.MeshBasicMaterial({color:0xff6bd6,wireframe:true}));g.add(core2);
var pulses=[],pg=new THREE.SphereGeometry(.2,10,10);
for(i=0;i<22;i++){var pm=new THREE.Mesh(pg,new THREE.MeshBasicMaterial({color:0xffffff}));g.add(pm);pulses.push({m:pm,e:edges[Math.floor(rnd()*edges.length)]||[0,1],t:rnd(),v:.004+rnd()*.008})}
var mx=0,my=0;addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function size(){ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();g.position.x=innerWidth>860?4.5:0}
size();addEventListener('resize',size);
function frame(){
var sc=scrollY/Math.max(1,document.body.scrollHeight-innerHeight);
g.rotation.y+=.0022;g.rotation.x+=(my*.5+sc*1.2-g.rotation.x)*.04;
cam.position.x+=(mx*3-cam.position.x)*.05;cam.position.z=15-sc*5;cam.lookAt(0,0,0);
core.rotation.y-=.008;core.rotation.x+=.004;core2.rotation.y+=.012;core2.rotation.z+=.006;
var sp=1+Math.sin(Date.now()*.002)*.05;core.scale.set(sp,sp,sp);
pulses.forEach(function(p){p.t+=p.v;if(p.t>1){p.t=0;p.e=edges[Math.floor(rnd()*edges.length)]||[0,1]}
p.m.position.lerpVectors(pts[p.e[0]],pts[p.e[1]],p.t)});
ren.render(scene,cam);if(!reduce)requestAnimationFrame(frame)}
frame();
})();
