/* Source explorer: shows the Django project files */
(function(){
var D=window.CX_DATA,files=D.files,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var $=function(i){return document.getElementById(i)};
var tree=$('cxTree'),code=$('cxCode'),gut=$('cxGut'),ed=$('cxEd'),edw=$('cxEdw'),pathEl=$('cxPath'),info=$('cxInfo'),btn=$('cxAuto'),badge=$('cxBadge'),stage=$('cxStage'),ide=$('cxIde');
$('cxSec').textContent='🔒 '+D.masked+' secrets masked';$('cxCount').textContent=files.length+' files';
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
var RD='(\\[\\[(?:SECRET MASKED|PRIVATE EMAIL)\\]\\])';
var L={
py:{re:RD+'|(#[^\\n]*)|("""[\\s\\S]*?(?:"""|$)|"[^"\\n]*"?|\'[^\'\\n]*\'?)|\\b(from|import|class|def|return|if|else|elif|for|in|not|and|or|try|except|raise|with|as|pass|None|True|False|self|lambda|yield|while|is|finally)\\b|(@\\w+)|(\\b\\d+\\b)',c:['rd','cm','s','k','f','n']},
html:{re:RD+'|(\\{#[\\s\\S]*?(?:#\\}|$))|(\\{%[\\s\\S]*?(?:%\\}|$))|(\\{\\{[\\s\\S]*?(?:\\}\\}|$))|(<!--[\\s\\S]*?(?:-->|$))|(<\\/?[a-zA-Z][^>]*>?)',c:['rd','cm','k','f','cm','n']},
js:{re:RD+'|(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$))|("[^"\\n]*"?|\'[^\'\\n]*\'?|`[^`]*`?)|\\b(const|let|var|function|return|if|else|for|of|in|new|document|window|this|true|false|null)\\b|(\\b\\d+\\b)',c:['rd','cm','s','k','n']},
css:{re:RD+'|(\\/\\*[\\s\\S]*?(?:\\*\\/|$))|("[^"\\n]*"?|\'[^\'\\n]*\'?)|(--[\\w-]+|[\\w-]+(?=\\s*:))|(#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|s|ms|vh|vw|deg)?\\b)',c:['rd','cm','s','f','n']},
txt:{re:RD+'|(#[^\\n]*)|("[^"\\n]*"?|\'[^\'\\n]*\'?)|\\b(pip|python|echo|set|install|true|false|True|False)\\b|(\\b\\d+\\b)',c:['rd','cm','s','k','n']}};
function lang(p){var e=p.split('.').pop();return e==='py'?'py':e==='html'?'html':e==='js'?'js':e==='css'?'css':'txt'}
function hl(t,lg){var cfg=L[lg]||L.txt,re=new RegExp(cfg.re,'g'),o='',last=0,m,g;
while((m=re.exec(t))){if(m[0]===''){re.lastIndex++;continue}
o+=esc(t.slice(last,m.index));for(g=1;g<m.length;g++)if(m[g]!==undefined)break;
o+='<i class="'+cfg.c[g-1]+'">'+esc(m[0])+'</i>';last=re.lastIndex}
return o+esc(t.slice(last))}
/* explorer tree */
var btns=[],lastDir=null;
files.forEach(function(f,i){var parts=f.p.split('/'),name=parts.pop(),dir=parts.join('/')||'project root';
if(dir!==lastDir){var s=document.createElement('span');s.className='dir';s.textContent=dir+'/';tree.appendChild(s);lastDir=dir}
var b=document.createElement('button');b.type='button';b.className='fl';b.textContent=name;b.addEventListener('click',function(){auto=false;label();idx=i;show(i)});tree.appendChild(b);btns.push(b)});
var CUR='<span class="cu"></span>',job=0,auto=!reduce,idx=0,cur=0,vis=true,lines=0;
try{new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.05}).observe(stage)}catch(e){}
stage.addEventListener('pointermove',function(e){if(reduce||e.pointerType==='touch')return;var r=stage.getBoundingClientRect();ide.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*10+'deg');ide.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});
stage.addEventListener('pointerleave',function(){ide.style.setProperty('--ry','0deg');ide.style.setProperty('--rx','0deg')});
function sleep(ms){return new Promise(function(r){setTimeout(r,reduce?0:ms)})}
async function gate(){while(!vis&&!reduce)await new Promise(function(r){setTimeout(r,300)})}
function label(){btn.textContent=auto?'Pause AI tour':'Resume AI tour'}
function gutter(t){var c=t.split('\n').length;if(c!==lines){lines=c;var a=[];for(var i=1;i<=c;i++)a.push(i);gut.textContent=a.join('\n')}}
async function show(i){
var my=++job,f=files[i],lg=lang(f.p),t=f.c,name=f.p.split('/').pop();cur=i;lines=0;
btns.forEach(function(b,k){b.classList.toggle('on',k===i)});
var b=btns[i];if(b.offsetTop<tree.scrollTop+20||b.offsetTop>tree.scrollTop+tree.clientHeight-40)tree.scrollTop=Math.max(0,b.offsetTop-tree.clientHeight/2);
pathEl.textContent=f.p;info.innerHTML='<b>AI agent</b> '+esc(f.d);badge.textContent=auto?'AI agent: writing '+name:'Viewing '+name;
edw.classList.remove('scan');code.innerHTML='';gut.textContent='';ed.scrollTop=0;
var step=reduce?t.length:Math.max(3,Math.ceil(t.length/80));
for(var c=step;c<t.length;c+=step){if(my!==job)return false;await gate();if(my!==job)return false;
 code.innerHTML=hl(t.slice(0,c),lg)+CUR;gutter(t.slice(0,c));ed.scrollTop=ed.scrollHeight;await sleep(28)}
if(my!==job)return false;
code.innerHTML=hl(t,lg);gutter(t);
if(t.indexOf('[[')>-1){void edw.offsetWidth;edw.classList.add('scan')}
badge.textContent=auto?'AI agent: reviewed '+name:'Viewing '+name;
await sleep(500);if(my===job)ed.scrollTop=0;
return my===job}
btn.addEventListener('click',function(){auto=!auto;label();if(auto){idx=(cur+1)%files.length}});
async function loop(){for(;;){
 if(!auto){await new Promise(function(r){setTimeout(r,300)});continue}
 var ok=await show(idx);if(!ok)continue;
 for(var w=0;w<16&&auto;w++){await gate();await sleep(100)}
 if(auto)idx=(idx+1)%files.length}}
label();
if(reduce){show(0)}else{loop()}
})();
