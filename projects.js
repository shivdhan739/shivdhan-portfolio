/* Projects page: loads admin-added projects from Firestore */
(function(){
var FB=window.FB,esc=FB.esc,safeUrl=FB.safeUrl,$=FB.$;
function projCard(p){
  var tech=(p.tech||[]).map(function(t){return "<span>"+esc(t)+"</span>"}).join("");
  var l=safeUrl(p.link);
  return '<div class="glass p tilt px"><div class="t"><span class="e">'+esc(p.emoji||"🚀")+'</span><span class="tag">'+esc(p.tag||"New")+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p>'+(tech?'<div class="ch">'+tech+'</div>':'')+(l?'<a class="l" style="margin-top:16px" href="'+esc(l)+'" target="_blank" rel="noopener">Live Demo ↗</a>':'')+'</div>';
}
FB.loadProjects().then(function(list){var g=$("pgx");if(!g)return;g.querySelectorAll(".px").forEach(function(n){n.remove()});g.insertAdjacentHTML("beforeend",list.map(projCard).join(""))});
})();
