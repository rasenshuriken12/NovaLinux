'use strict';
/* ---- js/04-window-manager.js (load order 04) ---- */
/* ============================================================
   WINDOW MANAGER
   ============================================================ */
var openWindows = {};
var zTop = 10, activeWin = null, cascade = 0;
function defaultWindowRect(app){
  var desk = $('#desktop');
  var idx = Math.max(0, APP_ORDER.indexOf(app.id));
  var W = Math.min(app.w||720, Math.max(300, desk.clientWidth-30));
  var H = Math.min(app.h||520, Math.max(220, desk.clientHeight-24));
  var off = idx*34;
  return { w:W, h:H,
    left: Math.max(8, Math.round((desk.clientWidth-W)/2) - 80 + off),
    top:  Math.max(8, Math.round((desk.clientHeight-H)/2) - 40 + Math.round(off*0.8)) };
}
function resetWindowLayout(){
  Object.keys(openWindows).forEach(function(id){
    var w = openWindows[id], r = defaultWindowRect(w.app);
    w.min = false; w.el.classList.remove('min');
    w.el.style.width = r.w+'px'; w.el.style.height = r.h+'px';
    w.el.style.left = r.left+'px'; w.el.style.top = r.top+'px';
  });
  updateDock();
}
function isMobile(){ return !!(window.matchMedia && window.matchMedia('(max-width: 700px)').matches); }
function applyWindowLayout(w){
  if (isMobile()){ w.el.style.width='100%'; w.el.style.height='100%'; w.el.style.left='0px'; w.el.style.top='0px'; }
  else { var r = defaultWindowRect(w.app); w.el.style.width=r.w+'px'; w.el.style.height=r.h+'px'; w.el.style.left=r.left+'px'; w.el.style.top=r.top+'px'; }
}
window.addEventListener('resize', function(){
  Object.keys(openWindows).forEach(function(id){ applyWindowLayout(openWindows[id]); });
});

function makeWindow(app){
  var desk = $('#desktop');
  var el = document.createElement('div');
  el.className='win';
  if (isMobile()){ el.style.width='100%'; el.style.height='100%'; el.style.left='0px'; el.style.top='0px'; }
  else { var r = defaultWindowRect(app);
    el.style.width = r.w+'px'; el.style.height = r.h+'px';
    el.style.left = r.left+'px'; el.style.top = r.top+'px'; }
  el.style.zIndex = ++zTop;
  el.innerHTML =
    '<div class="win-header">'+
      '<span class="win-ic">'+app.icon+'</span>'+
      '<div class="win-title">'+esc(app.name)+'</div>'+
      '<div class="win-btns">'+
        '<button class="win-btn minb" title="Minimise"></button>'+
        '<button class="win-btn closeb" title="Close"></button>'+
      '</div>'+
    '</div>'+
    '<div class="win-body"></div>';
  desk.appendChild(el);

  var win = {
    el: el, appId: app.id, app: app, min: false, pid: 1000+Math.floor(Math.random()*8999),
    body: el.querySelector('.win-body'),
    close: function(){ if (win._clockTimer) clearInterval(win._clockTimer); el.remove(); delete openWindows[app.id]; app.win=null; updateDock(); },
    minimize: function(){ win.min=true; el.classList.add('min'); updateDock(); },
    restore: function(){ win.min=false; el.classList.remove('min'); focusWin(win); },
    focus: function(){ focusWin(win); }
  };

  /* drag (desktop only - phones get full-screen apps) */
  var header = el.querySelector('.win-header');
  if (!isMobile()) header.addEventListener('pointerdown', function(ev){
    if (ev.target.closest('.win-btn')) return;
    focusWin(win);
    var sx=ev.clientX, sy=ev.clientY;
    var ox=el.offsetLeft, oy=el.offsetTop;
    function move(e){
      var nx = ox + e.clientX - sx, ny = oy + e.clientY - sy;
      nx = Math.max(-el.offsetWidth+90, Math.min(desk.clientWidth-60, nx));
      ny = Math.max(0, Math.min(desk.clientHeight-40, ny));
      el.style.left = nx+'px'; el.style.top = ny+'px';
    }
    function up(){
      try{ if (header.hasPointerCapture && header.hasPointerCapture(ev.pointerId)) header.releasePointerCapture(ev.pointerId); }catch(e2){}
      header.removeEventListener('pointermove', move);
      header.removeEventListener('pointerup', up);
      header.removeEventListener('pointercancel', up);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    try{ if (header.setPointerCapture) header.setPointerCapture(ev.pointerId); }catch(e2){}
    header.addEventListener('pointermove', move);
    header.addEventListener('pointerup', up);
    header.addEventListener('pointercancel', up);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    ev.preventDefault();
  });
  header.querySelector('.minb').addEventListener('click', function(){ win.minimize(); });
  header.querySelector('.closeb').addEventListener('click', function(){ win.close(); });
  el.addEventListener('pointerdown', function(){ focusWin(win); });
  focusWin(win);
  return win;
}
function focusWin(win){
  activeWin = win;
  Object.keys(openWindows).forEach(function(k){ openWindows[k].el.classList.remove('focused'); });
  win.el.classList.add('focused');
  win.el.style.zIndex = ++zTop;
  updateDock();
}
function openApp(id){
  var app = APPS[id];
  if (!app) return;
  if (app.win){ if (app.win.min) app.win.restore(); else focusWin(app.win); return; }
  var win = makeWindow(app);
  openWindows[id] = win; app.win = win;
  app.mount(win.body, win);
  updateDock();
}
function updateDock(){
  document.querySelectorAll('#dock-apps .dock-item').forEach(function(it){
    var id = it.getAttribute('data-app');
    it.classList.toggle('running', !!openWindows[id] && !openWindows[id].min);
  });
  var tasks = $('#dock-tasks');
  if (!tasks) return;
  tasks.innerHTML='';
  APP_ORDER.forEach(function(id){
    var w = openWindows[id];
    if (!w) return;
    var t = document.createElement('div');
    t.className = 'task-item'+(activeWin===w&&!w.min?' active':'')+(w.min?' minned':'');
    t.title = APP_LABEL[id];
    t.innerHTML = '<span class="ti-ic">'+APPS[id].icon+'</span><span class="ti-label">'+APP_LABEL[id]+
      '</span><button class="ti-close" title="Close window">&times;</button>';
    t.addEventListener('click', function(e){
      if (e.target.closest('.ti-close')){ w.close(); return; }
      if (w.min) w.restore();
      else if (activeWin===w) w.minimize();
      else focusWin(w);
    });
    tasks.appendChild(t);
  });
}
