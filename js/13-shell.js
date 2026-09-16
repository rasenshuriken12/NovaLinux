'use strict';
/* ---- js/13-shell.js (load order 13) ---- */
/* ============================================================
   SHELL: DOCK / TOPBAR / LAUNCHER / BOOT
   ============================================================ */
var APP_ORDER = ['terminal','files','calendar','clock','notes','ai','help','settings'];
var APP_LABEL = { terminal:'Terminal', files:'Files', calendar:'Calendar', clock:'Clock', notes:'Notes', ai:'Nova AI', help:'Help', settings:'Settings' };

/* desktop icons */
(function(){
  var wrap = $('#desktop-icons');
  APP_ORDER.forEach(function(id){
    var d = document.createElement('div');
    d.className='dicon';
    d.innerHTML = APPS[id].icon+'<span>'+APP_LABEL[id]+'</span>';
    d.addEventListener('click', function(){ openApp(id); });
    wrap.appendChild(d);
  });
})();
/* dock: launcher section + running tasks section */
(function(){
  var dock = $('#dock');
  var apps = document.createElement('div'); apps.id='dock-apps';
  APP_ORDER.forEach(function(id){
    var d = document.createElement('div');
    d.className='dock-item'; d.setAttribute('data-app',id); d.title=APP_LABEL[id];
    d.innerHTML = APPS[id].icon+'<div class="dot"></div>';
    d.addEventListener('click', function(){
      var w = openWindows[id];
      if (!w) openApp(id);
      else if (w.min) w.restore();
      else if (activeWin===w) w.minimize();
      else focusWin(w);
      updateDock();
    });
    apps.appendChild(d);
  });
  var sep = document.createElement('div'); sep.id='dock-sep';
  var tasks = document.createElement('div'); tasks.id='dock-tasks';
  dock.appendChild(apps); dock.appendChild(sep); dock.appendChild(tasks);
})();
/* launcher */
(function(){
  var l = $('#launcher');
  var grid = l.querySelector('.lg-grid');
  APP_ORDER.forEach(function(id){
    var d = document.createElement('div');
    d.className='lg-item';
    d.innerHTML = '<div class="lg-ic">'+APPS[id].icon+'</div><span>'+APP_LABEL[id]+'</span>';
    d.addEventListener('click', function(){ l.classList.remove('open'); $('#tb-activities').classList.remove('active'); openApp(id); });
    grid.appendChild(d);
  });
  $('#tb-activities').addEventListener('click', function(e){
    e.stopPropagation();
    l.classList.toggle('open');
    this.classList.toggle('active');
  });
  l.addEventListener('click', function(e){ if (e.target===l){ l.classList.remove('open'); $('#tb-activities').classList.remove('active'); } });
})();
/* quick settings */
var QS = lsGet('nova-qs', {vol:65, bright:100, wifi:true, bt:false, pm:'balanced', air:false});
function saveQS(){ lsSet('nova-qs', QS); }
var battery = 87;
function renderBattery(){ $('#qs-batt-pct').textContent = battery+'%'; $('#tb-batt').textContent = battery+'%'; }
setInterval(function(){ battery = Math.max(5, battery-1); renderBattery(); }, 240000);
function fillSlider(el, v){
  el.style.background = 'linear-gradient(to right, var(--accent-bright) 0%, var(--accent-bright) '+v+'%, var(--surface-3) '+v+'%)';
}
function applyQS(){
  var vol = $('#qs-vol'), bri = $('#qs-bright');
  vol.value = QS.vol; fillSlider(vol, QS.vol);
  bri.value = QS.bright; fillSlider(bri, QS.bright);
  $('#dimmer').style.opacity = ((100-QS.bright)/100*0.72).toFixed(3);
  $('#qs-wifi').classList.toggle('active', QS.wifi && !QS.air);
  $('#qs-wifi-sub').textContent = QS.air ? 'Off' : (QS.wifi ? 'Nova-Home' : 'Off');
  $('#qs-bt').classList.toggle('active', QS.bt && !QS.air);
  $('#qs-pm-sub').textContent = QS.pm.charAt(0).toUpperCase()+QS.pm.slice(1);
  $('#qs-air').classList.toggle('active', QS.air);
}
(function(){
  var panel = $('#qs-panel');
  $('#tb-qs').addEventListener('click', function(e){ e.stopPropagation(); panel.classList.toggle('open'); $('#qs-power-sub').classList.remove('open'); });
  panel.addEventListener('click', function(e){ e.stopPropagation(); });
  document.addEventListener('click', function(){ panel.classList.remove('open'); $('#qs-power-sub').classList.remove('open'); });
  $('#qs-vol').addEventListener('input', function(){ QS.vol = parseInt(this.value,10)||0; fillSlider(this, QS.vol); saveQS(); });
  $('#qs-bright').addEventListener('input', function(){ QS.bright = parseInt(this.value,10)||100; fillSlider(this, QS.bright); $('#dimmer').style.opacity = ((100-QS.bright)/100*0.72).toFixed(3); saveQS(); });
  $('#qs-wifi').addEventListener('click', function(){ QS.wifi = !QS.wifi; if (QS.wifi) QS.air = false; saveQS(); applyQS(); });
  $('#qs-bt').addEventListener('click', function(){ QS.bt = !QS.bt; if (QS.bt) QS.air = false; saveQS(); applyQS(); });
  $('#qs-pm').addEventListener('click', function(){ QS.pm = QS.pm==='balanced' ? 'performance' : (QS.pm==='performance' ? 'power saver' : 'balanced'); saveQS(); applyQS(); });
  $('#qs-air').addEventListener('click', function(){ QS.air = !QS.air; if (QS.air){ QS.wifi = false; QS.bt = false; } saveQS(); applyQS(); });
  $('#qs-power').addEventListener('click', function(){ $('#qs-power-sub').classList.toggle('open'); });
  $('#qs-reboot').addEventListener('click', function(){ location.reload(); });
  $('#qs-off').addEventListener('click', function(){ showHalt(); });
  renderBattery();
  applyQS();
})();
function showHalt(){ $('#haltscreen').classList.add('open'); }

/* topbar clock */
function tickTopbar(){
  var d = new Date();
  var t = settings.clock24 ? pad(d.getHours())+':'+pad(d.getMinutes()) : (function(){var h=d.getHours()%12||12; return h+':'+pad(d.getMinutes())+' '+(d.getHours()<12?'AM':'PM');})();
  $('#tb-clock').textContent = DOW[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]+'  ·  '+t;
}
setInterval(tickTopbar, 1000);

/* keyboard: Escape closes launcher */
document.addEventListener('keydown', function(e){
  if (e.key==='Escape'){ $('#launcher').classList.remove('open'); $('#tb-activities').classList.remove('active'); }
});
