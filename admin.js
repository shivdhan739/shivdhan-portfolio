/* Admin page: login, messages, projects (unchanged logic) */
(function(){
var FB=window.FB,db=FB.db,auth=FB.auth,$=FB.$,esc=FB.esc,fmt=FB.fmt,safeUrl=FB.safeUrl,MSG=FB.MSG,PRJ=FB.PRJ,ADM=FB.ADM;
var alog=$("alog"),apan=$("apan"),ast=$("ast");
function astat(t,c){ast.className=c||"";ast.textContent=t}
if(!auth){alog.insertAdjacentHTML("afterbegin",'<p class="er">Firebase could not load (offline or blocked).</p>')}
alog.addEventListener("submit",async function(e){
  e.preventDefault();if(!auth)return;
  astat("Signing in…");
  try{await auth.signInWithEmailAndPassword($("aem").value.trim(),$("apw").value);astat("")}
  catch(err){astat("Invalid email or password.","er")}
});
$("aout").addEventListener("click",function(){if(auth)auth.signOut()});
if(auth)auth.onAuthStateChanged(async function(u){
  if(!u){alog.hidden=false;apan.hidden=true;$("aout").hidden=true;return}
  var ok=false;
  try{var d=await db.collection(ADM).doc(u.uid).get();ok=d.exists}catch(e){ok=false}
  if(!ok){astat("This account is not an admin.","er");alog.hidden=false;apan.hidden=true;await auth.signOut();return}
  alog.hidden=true;apan.hidden=false;$("aout").hidden=false;astat("");
  loadMsgs();FB.loadProjects().then(renderAdminProjects);
});
/* tabs */
document.querySelectorAll(".atabs button").forEach(function(b){b.addEventListener("click",function(){
  document.querySelectorAll(".atabs button").forEach(function(x){x.classList.toggle("on",x===b)});
  $("tm").hidden=b.dataset.t!=="m";$("tp").hidden=b.dataset.t!=="p";
})});
/* messages */
async function loadMsgs(){
  var box=$("tm");box.innerHTML='<p class="note">Loading…</p>';
  try{
    var s=await db.collection(MSG).orderBy("createdAt","desc").limit(100).get();
    $("mc").textContent=s.size?"("+s.size+")":"";
    if(!s.size){box.innerHTML='<p class="note">No messages yet.</p>';return}
    box.innerHTML=s.docs.map(function(d){var m=d.data();
      return '<div class="mcard"><div class="mh"><b>'+esc(m.name)+'</b><span>'+esc(fmt(m.createdAt))+'</span></div>'
      +'<div class="mm"><a href="mailto:'+esc(m.email)+'?subject='+encodeURIComponent("Re: "+(m.subject||""))+'">'+esc(m.email)+'</a> · '+esc(m.subject||"")+'</div>'
      +'<p>'+esc(m.message)+'</p><div class="ma"><a class="mb" href="mailto:'+esc(m.email)+'?subject='+encodeURIComponent("Re: "+(m.subject||""))+'">Reply ✉</a><button class="mb dl" data-id="'+esc(d.id)+'">Delete</button></div></div>';
    }).join("");
  }catch(e){box.innerHTML='<p class="er">Could not load messages. Check Firestore rules and admin setup.</p>'}
}
$("tm").addEventListener("click",async function(e){
  var b=e.target.closest("button.dl");if(!b||!confirm("Delete this message?"))return;
  try{await db.collection(MSG).doc(b.dataset.id).delete();loadMsgs()}catch(err){alert("Delete failed.")}
});
/* projects */
function renderAdminProjects(){
  var box=$("pl");
  if(!FB.projs.length){box.innerHTML='<p class="note">No admin-added projects yet. Projects already written in the page HTML are not listed here.</p>';return}
  box.innerHTML=FB.projs.map(function(p){return '<div class="mcard"><div class="mh"><b>'+esc((p.emoji||"")+" "+p.title)+'</b><button class="mb dl" data-id="'+esc(p.id)+'">Delete</button></div><p>'+esc(p.desc)+'</p></div>'}).join("");
}
$("pl").addEventListener("click",async function(e){
  var b=e.target.closest("button.dl");if(!b||!confirm("Delete this project?"))return;
  try{await db.collection(PRJ).doc(b.dataset.id).delete();await FB.loadProjects();renderAdminProjects()}catch(err){alert("Delete failed.")}
});
$("pf").addEventListener("submit",async function(e){
  e.preventDefault();var fm=e.target,ps=$("pst");
  var title=fm.ptitle.value.trim(),desc=fm.pdesc.value.trim();
  if(!title||!desc){ps.className="er";ps.textContent="Title and description are required.";return}
  var link=fm.plink.value.trim();if(link&&!safeUrl(link)){ps.className="er";ps.textContent="Link must start with http:// or https://";return}
  ps.className="";ps.textContent="Saving…";
  try{
    await db.collection(PRJ).add({emoji:fm.pemoji.value.trim()||"🚀",tag:fm.ptag.value.trim()||"New",title:title,desc:desc,link:link,
      tech:fm.ptech.value.split(",").map(function(t){return t.trim()}).filter(Boolean).slice(0,10),createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    fm.reset();ps.className="ok";ps.textContent="Project added. It is now live on the Projects page.";
    await FB.loadProjects();renderAdminProjects();
  }catch(err){ps.className="er";ps.textContent="Could not save. Are you logged in as admin and are the rules published?"}
});
})();
