/* Firebase + EmailJS setup shared by the pages that need a backend */
(function(){
var CFG={apiKey:"AIzaSyAEZKS79i_gLJsa1dyUXaoqby4_Mmrvpuk",authDomain:"shivdhan-portfolio.firebaseapp.com",projectId:"shivdhan-portfolio",storageBucket:"shivdhan-portfolio.firebasestorage.app",messagingSenderId:"510150260474",appId:"1:510150260474:web:5150ba352b45053b1f3b43"};
var EJS={SERVICE_ID:"service_utiba9a",TEMPLATE_ID:"template_6tesf8r",PUBLIC_KEY:"ly0Z7_DwsSGmyS0l_"};
var MY_EMAIL="shivdhanshirgole085@gmail.com";
var MSG="portfolioMessages",LIM="portfolioLimits",PRJ="portfolioProjects",ADM="portfolioAdmins";
var LIMIT_MS=24*60*60*1000; /* one message per email every 24 hours (must match the Firestore rules) */
var db=null,auth=null;
try{if(window.firebase){firebase.initializeApp(CFG);db=firebase.firestore();if(firebase.auth)auth=firebase.auth();}}catch(e){console.warn("Firebase init failed",e)}
try{if(window.emailjs)emailjs.init({publicKey:EJS.PUBLIC_KEY})}catch(e){}
function $(i){return document.getElementById(i)}
function esc(t){var d=document.createElement("div");d.textContent=t==null?"":String(t);return d.innerHTML}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function fmt(ts){try{return ts&&ts.toDate?ts.toDate().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}):""}catch(e){return ""}}

function safeUrl(u){return /^https?:\/\//i.test(u||"")?u:""}

window.FB={CFG:CFG,EJS:EJS,MY_EMAIL:MY_EMAIL,MSG:MSG,LIM:LIM,PRJ:PRJ,ADM:ADM,LIMIT_MS:LIMIT_MS,db:db,auth:auth,projs:[],$:$,esc:esc,wait:wait,fmt:fmt,safeUrl:safeUrl,
 loadProjects:async function(){
  if(!db)return FB.projs;
  try{var s=await db.collection(PRJ).orderBy("createdAt","desc").get();
   FB.projs=s.docs.map(function(d){var x=d.data();x.id=d.id;return x})}catch(e){console.warn("Projects load failed",e)}
  return FB.projs}};
})();
