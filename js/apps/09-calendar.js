'use strict';
/* ---- js/apps/09-calendar.js (load order 09) ---- */
/* ---------- CALENDAR ---------- */
var events = lsGet('nova-events', {}) || {};
APPS.calendar = {
  id:'calendar', name:'Calendar', icon:ICONS.calendar, w:620, h:640,
  mount: function(body, win){
    var today = new Date();
    var state = { y: today.getFullYear(), m: today.getMonth(), sel: today.getDate() };
    function dkey(y,m,d){ return y+'-'+pad(m+1)+'-'+pad(d); }
    function addEvent(){
      var inp = body.querySelector('#cal-new');
      if (!inp || !inp.value.trim()) return;
      var k = dkey(state.y, state.m, state.sel);
      if (!events[k]) events[k] = [];
      events[k].push(inp.value.trim());
      lsSet('nova-events', events);
      render();
    }
    function render(){
      var first = new Date(state.y, state.m, 1);
      var days = new Date(state.y, state.m+1, 0).getDate();
      var startDow = first.getDay();
      var prevDays = new Date(state.y, state.m, 0).getDate();
      var cells = [];
      for (var i=0;i<startDow;i++) cells.push({d:prevDays-startDow+1+i, dim:true});
      for (var d=1;d<=days;d++) cells.push({d:d});
      var total = cells.length; var nextD=1;
      while (total%7!==0 || total<35){ cells.push({d:nextD++, dim:true}); total++; }
      var html = '<div class="cal-head">'+
        '<div><div class="app-label">'+DOW[today.getDay()]+', '+MON[today.getMonth()]+' '+today.getDate()+'</div>'+
        '<div class="cal-title">'+MONF[state.m]+' '+state.y+'</div></div>'+
        '<div style="display:flex;gap:6px">'+
        '<button class="btn" data-nav="-1" style="padding:6px 12px">&lsaquo;</button>'+
        '<button class="btn" data-nav="0" style="padding:6px 12px">Today</button>'+
        '<button class="btn" data-nav="1" style="padding:6px 12px">&rsaquo;</button></div></div>';
      html += '<div class="cal-grid">';
      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(w){ html+='<div class="cal-dow">'+w+'</div>'; });
      cells.forEach(function(c){
        var isToday = !c.dim && c.d===today.getDate() && state.m===today.getMonth() && state.y===today.getFullYear();
        var k = dkey(state.y, state.m, c.d);
        var hasEv = !c.dim && events[k] && events[k].length;
        var isSel = !c.dim && c.d===state.sel;
        html += '<div class="cal-day'+(c.dim?' dim':'')+(isToday?' today':'')+(isSel?' sel':'')+'" data-day="'+(c.dim?'':c.d)+'">'+
          '<span>'+c.d+'</span><span class="cal-dot"'+(hasEv?'':' style="opacity:0"')+'></span></div>';
      });
      html += '</div>';
      var kk = dkey(state.y, state.m, state.sel);
      var evs = events[kk] || [];
      html += '<div class="cal-bottom">'+
        '<div class="cal-seldate">'+kk+'</div>'+
        '<div class="cal-events">'+
        (evs.length ? evs.map(function(t,i){ return '<div class="cal-event"><span>'+esc(t)+'</span><button class="ce-del" data-i="'+i+'" title="Remove">&times;</button></div>'; }).join('')
                     : '<div class="cal-noev">No events</div>')+
        '</div>'+
        '<div class="cal-addrow">'+
          '<input class="set-input" id="cal-new" placeholder="Add an event..." maxlength="60">'+
          '<button class="btn primary" id="cal-add">Add</button>'+
        '</div>'+
      '</div>';
      body.innerHTML = html;
      body.querySelectorAll('[data-nav]').forEach(function(b){
        b.addEventListener('click', function(){
          var n = parseInt(b.getAttribute('data-nav'),10);
          if (n===0){ state.y=today.getFullYear(); state.m=today.getMonth(); }
          else { state.m += n; if (state.m<0){state.m=11;state.y--;} if(state.m>11){state.m=0;state.y++;} }
          state.sel = (state.y===today.getFullYear()&&state.m===today.getMonth()) ? today.getDate() : 1;
          render();
        });
      });
      body.querySelectorAll('.cal-day[data-day]:not(.dim)').forEach(function(dayEl){
        dayEl.addEventListener('click', function(){ state.sel = parseInt(dayEl.getAttribute('data-day'),10); render(); });
      });
      body.querySelector('#cal-add').addEventListener('click', addEvent);
      body.querySelector('#cal-new').addEventListener('keydown', function(e){ if (e.key==='Enter') addEvent(); });
      body.querySelectorAll('.ce-del').forEach(function(del){
        del.addEventListener('click', function(){
          var k = dkey(state.y,state.m,state.sel);
          var i = parseInt(del.getAttribute('data-i'),10);
          if (events[k]){ events[k].splice(i,1); lsSet('nova-events', events); render(); }
        });
      });
    }
    render();
  }
};
