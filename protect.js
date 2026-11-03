/* protect.js: anti-copy protection for the whole site (every page, admin panel included).
   Self-contained: it injects its own CSS, so no other file needs to change.
   Blocks selecting, copying, cutting, dragging, right-click, view-source/save/print shortcuts,
   print-screen (blurs the page) and open developer tools. Form fields still work. */
(function(){
if(window.__protect)return;window.__protect=true;
var DEVTOOLS_GUARD=true; /* set to false to turn off the developer-tools overlay */
var d=document,de=d.documentElement;
var css='html.nocopy,html.nocopy *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'
+'html.nocopy input,html.nocopy textarea{-webkit-user-select:text;user-select:text}'
+'html.nocopy img,html.nocopy svg,html.nocopy a{-webkit-user-drag:none}'
+'html.nocopy ::selection{background:transparent;color:inherit}'
+'html.shot body{filter:blur(22px)}'
+'#guard{position:fixed;inset:0;z-index:2147483647;background:#05070f;color:#eef2ff;display:grid;place-items:center;text-align:center;padding:24px;font-family:sans-serif}'
+'#guard h2{margin:0 0 8px;font-size:28px}#guard p{margin:0;color:#9aa6cc}'
+'@media print{html.nocopy body>*{display:none!important}html.nocopy body:before{content:"Printing is disabled on this website.";display:block;padding:40px;font:20px sans-serif;color:#000}}';
var st=d.createElement("style");st.id="protect-css";st.textContent=css;(d.head||de).appendChild(st);
de.classList.add("nocopy");
function inField(t){return !!(t&&t.closest&&t.closest("input,textarea,[contenteditable='true']"))}
function stop(e){e.preventDefault();e.stopPropagation();return false}
/* copy / cut: nothing leaves the page (a short notice goes to the clipboard instead) */
["copy","cut"].forEach(function(n){d.addEventListener(n,function(e){if(inField(e.target))return;
 try{if(e.clipboardData)e.clipboardData.setData("text/plain","Copying is disabled on this website.")}catch(x){}stop(e)},true)});
d.addEventListener("contextmenu",function(e){if(!inField(e.target))stop(e)},true);
d.addEventListener("dragstart",stop,true);
d.addEventListener("selectstart",function(e){if(!inField(e.target))stop(e)},true);
d.addEventListener("keydown",function(e){
 var k=(e.key||"").toLowerCase(),c=e.ctrlKey||e.metaKey,f=inField(e.target);
 var bad=e.key==="F12"
  ||(c&&["s","u","p"].indexOf(k)>-1)
  ||(c&&!f&&["c","x","a"].indexOf(k)>-1)
  ||(c&&e.shiftKey&&["i","j","c","k"].indexOf(k)>-1)
  ||(e.metaKey&&e.altKey&&["i","j","u","c"].indexOf(k)>-1);
 if(bad)stop(e)},true);
/* print-screen: clear clipboard and blur the page for a moment */
d.addEventListener("keyup",function(e){if(e.key==="PrintScreen"){try{navigator.clipboard.writeText("Screenshots are disabled on this website.")}catch(x){}
 de.classList.add("shot");setTimeout(function(){de.classList.remove("shot")},1800)}},true);
/* developer tools: Chrome evaluates a logged element's getter only while the console is open */
if(DEVTOOLS_GUARD&&!("ontouchstart" in window)){
 var open=false,probe=new Image(),box=null;
 Object.defineProperty(probe,"id",{get:function(){open=true;return"x"}});
 setInterval(function(){open=false;console.log(probe);console.clear();
  if(open&&!box&&d.body){box=d.createElement("div");box.id="guard";box.innerHTML="<div><h2>Developer tools detected</h2><p>Please close developer tools to view this portfolio.</p></div>";d.body.appendChild(box)}
  else if(!open&&box){box.remove();box=null}},1000)}
})();
