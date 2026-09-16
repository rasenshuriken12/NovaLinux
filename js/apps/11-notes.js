'use strict';
/* ---- js/apps/11-notes.js (load order 11) ---- */
/* ---------- NOTES ---------- */
var notes = lsGet('nova-notes', null);
if (!notes){
  notes = [{ id:1, body:'Welcome to Notes\n\nEverything you type here is saved in this browser (localStorage), so it survives a reboot.\n\nTry creating a file from the terminal too:\n  echo "hello" > ~/todo.txt\n', updated: Date.now() }];
  lsSet('nova-notes', notes);
}
APPS.notes = {
  id:'notes', name:'Notes', icon:ICONS.notes, w:840, h:540,
  mount: function(body, win){
    var sel = notes.length?notes[0].id:null;
    function noteTitle(n){ var l = (n.body||'').split('\n')[0]||'Untitled'; return l.slice(0,32); }
    function render(){
      body.innerHTML = '<div class="notes-wrap">'+
        '<div class="notes-side">'+
          '<div class="notes-new"><button class="btn primary" id="n-new" style="width:100%;justify-content:center">New note</button></div>'+
          '<div class="notes-list" id="n-list"></div>'+
        '</div>'+
        '<div class="notes-editor" id="n-editor"></div></div>';
      var list = body.querySelector('#n-list');
      notes.forEach(function(n){
        var d = new Date(n.updated);
        var it = document.createElement('div');
        it.className = 'note-item'+(n.id===sel?' sel':'');
        it.innerHTML = '<div class="ni-title">'+esc(noteTitle(n)||'Untitled')+'</div>'+
          '<div class="ni-date">'+DOW[d.getDay()]+' '+pad(d.getDate())+' '+MON[d.getMonth()]+', '+pad(d.getHours())+':'+pad(d.getMinutes())+'</div>';
        it.addEventListener('click', function(){ sel=n.id; render(); });
        list.appendChild(it);
      });
      var ed = body.querySelector('#n-editor');
      var n = notes.filter(function(x){return x.id===sel;})[0];
      if (!n){ ed.innerHTML='<div class="notes-empty">No note selected — create one.</div>'; }
      else {
        ed.innerHTML = '<textarea id="n-ta" placeholder="Start writing..."></textarea>';
        var ta = ed.querySelector('#n-ta');
        ta.value = n.body;
        var timer=null;
        ta.addEventListener('input', function(){
          clearTimeout(timer);
          timer = setTimeout(function(){
            n.body = ta.value; n.updated = Date.now(); lsSet('nova-notes', notes);
            var first = body.querySelector('.note-item.sel .ni-title'); if (first) first.textContent = noteTitle(n)||'Untitled';
          }, 300);
        });
        setTimeout(function(){ ta.focus(); }, 40);
      }
      body.querySelector('#n-new').addEventListener('click', function(){
        var n = { id: Date.now(), body:'', updated: Date.now() };
        notes.unshift(n); sel = n.id; lsSet('nova-notes', notes); render();
      });
    }
    render();
  }
};
