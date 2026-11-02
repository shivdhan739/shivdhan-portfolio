/* AI Lab: one shared section, injected on every page */
(function(){var r=document.getElementById("lab-root");if(r)r.innerHTML="<section id=\"lab\"><div class=\"w\"><div class=\"lab\">\n<div>\n<div class=\"sh\" style=\"margin:0\"><h2>AI writes Django code, live</h2><p style=\"margin:0\">Give it a prompt and the agent plans the app, writes the Python, runs the tests and ships it. Watch the whole automation loop in 3D.</p></div>\n<ul class=\"flow\" id=\"labSteps\"><li>Prompt received</li><li>Models designed</li><li>Views generated</li><li>Routes connected</li><li>Tests run and deployed</li></ul>\n<p class=\"simnote\">Demo animation of an AI coding workflow.</p>\n</div>\n<div class=\"stage\" id=\"labStage\"><div class=\"ide\">\n<div class=\"win\">\n<div class=\"bar\"><i></i><i></i><i></i><div class=\"tabs\" id=\"labTabs\"><span>models.py</span><span>views.py</span><span>urls.py</span></div></div>\n<div class=\"pr\" id=\"labPrompt\"></div>\n<pre id=\"labCode\" aria-label=\"Django code being written by AI\"></pre>\n</div>\n<div class=\"term\"><div class=\"bar\" style=\"padding:8px 12px\"><i></i><i></i><i></i></div><pre id=\"labTerm\"></pre></div>\n<span class=\"chip ai\" id=\"labBadge\">AI agent: idle</span><span class=\"chip dj\">Django</span><span class=\"chip py\">Python 3</span>\n</div></div>\n</div></div></section>";})();
(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var code=document.getElementById('labCode'),term=document.getElementById('labTerm'),pr=document.getElementById('labPrompt'),badge=document.getElementById('labBadge'),stage=document.getElementById('labStage'),ide=stage.firstElementChild;
var tabs=[].slice.call(document.querySelectorAll('#labTabs span')),steps=[].slice.call(document.querySelectorAll('#labSteps li'));
var vis=true;try{new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.05}).observe(stage)}catch(e){}
stage.addEventListener('pointermove',function(e){if(reduce||e.pointerType==='touch')return;var r=stage.getBoundingClientRect();ide.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*14+'deg');ide.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*10+'deg')});
stage.addEventListener('pointerleave',function(){ide.style.setProperty('--ry','0deg');ide.style.setProperty('--rx','0deg')});
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function hl(t){var re=/("[^"\n]*"?)|\b(from|import|class|def|return|True|False)\b|\b(models|Job|JsonResponse|path|views)\b|(\b\d+\b)/g,o='',last=0,m;
while((m=re.exec(t))){o+=esc(t.slice(last,m.index));o+='<i class="'+(m[1]?'s':m[2]?'k':m[3]?'f':'n')+'">'+esc(m[0])+'</i>';last=re.lastIndex}
return o+esc(t.slice(last))}
var CUR='<span class="cu"></span>';
var files=[
"from django.db import models\n\nclass Job(models.Model):\n    title = models.CharField(max_length=120)\n    company = models.CharField(max_length=80)\n    posted = models.DateTimeField(auto_now_add=True)\n",
"from django.http import JsonResponse\nfrom .models import Job\n\ndef job_list(request):\n    jobs = Job.objects.values(\"title\", \"company\")\n    return JsonResponse(list(jobs), safe=False)\n",
"from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path(\"jobs/\", views.job_list),\n]\n"];
var cmds=[["$ python manage.py makemigrations",0],["Migrations for 'jobs' created",1],["$ python manage.py test",0],["12 tests passed",1],["$ git push origin main",0],["Deployed and live",1]];
var prompt="Build a job portal API with Django";
function sleep(ms){return new Promise(function(r){setTimeout(r,reduce?0:ms)})}
async function gate(){while(!vis&&!reduce)await new Promise(function(r){setTimeout(r,300)})}
function setStep(i){steps.forEach(function(s,k){s.className=k<i?'done':k===i?'on':''})}
function setTab(i){tabs.forEach(function(t,k){t.className=k===i?'on':''})}
function termHTML(lines,cur){return lines.map(function(l){return l[1]?'<span class="ok">✓ '+esc(l[0])+'</span>':esc(l[0])}).join('\n')+(cur?CUR:'')}
async function run(){
while(true){
code.innerHTML='';term.innerHTML='';pr.innerHTML='<b>prompt&gt;</b> ';setTab(-1);setStep(0);badge.textContent='AI agent: reading prompt';
for(var i=1;i<=prompt.length;i++){await gate();pr.innerHTML='<b>prompt&gt;</b> '+esc(prompt.slice(0,i))+CUR;await sleep(38)}
pr.innerHTML='<b>prompt&gt;</b> '+esc(prompt);await sleep(500);
var names=['designing models','writing views','connecting routes'];
for(var f=0;f<files.length;f++){setStep(f+1);setTab(f);badge.textContent='AI agent: '+names[f];var t=files[f];
 for(var c=1;c<=t.length;c+=2){await gate();code.innerHTML=hl(t.slice(0,c))+CUR;await sleep(22)}
 code.innerHTML=hl(t);await sleep(700)}
setStep(4);badge.textContent='AI agent: testing and deploying';
var shown=[];for(var k=0;k<cmds.length;k++){var ln=cmds[k];
 if(!ln[1]){for(var c2=1;c2<=ln[0].length;c2++){await gate();term.innerHTML=termHTML(shown.concat([[ln[0].slice(0,c2),0]]),true);await sleep(30)}}
 shown.push(ln);term.innerHTML=termHTML(shown,true);await sleep(ln[1]?650:250)}
setStep(5);badge.textContent='AI agent: done';
if(reduce)return;await sleep(4500)}}
run();
})();
