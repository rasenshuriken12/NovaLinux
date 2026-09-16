'use strict';
/* ---- js/apps/10-clock.js (load order 10) ---- */
/* ---------- CLOCK ---------- */
APPS.clock = {
  id:'clock', name:'Clock', icon:ICONS.clock, w:400, h:540,
  mount: function(body, win){
    body.innerHTML =
      '<div class="clock-wrap">'+
        '<svg id="clock-face" viewBox="0 0 200 200" width="210" height="210">'+
          '<circle cx="100" cy="100" r="96" fill="var(--surface-2)" stroke="var(--border-strong)" stroke-width="2"/>'+
          '<g id="clock-ticks"></g>'+
          '<line id="ch" x1="100" y1="100" x2="100" y2="58" stroke="var(--text)" stroke-width="5" stroke-linecap="round"/>'+
          '<line id="cm" x1="100" y1="100" x2="100" y2="34" stroke="var(--text)" stroke-width="3.4" stroke-linecap="round"/>'+
          '<line id="cs" x1="100" y1="112" x2="100" y2="28" stroke="var(--accent-bright)" stroke-width="1.6" stroke-linecap="round"/>'+
          '<circle cx="100" cy="100" r="4" fill="var(--accent-bright)"/>'+
        '</svg>'+
        '<div class="clock-digital" id="cd">--:--:--</div>'+
        '<div class="clock-date" id="cdate"></div>'+
        '<div class="clock-tz" id="ctz"></div>'+
      '</div>';
    var ticks = body.querySelector('#clock-ticks');
    var html='';
    for (var i=0;i<60;i++){
      var a = i*6*Math.PI/180, big = i%5===0;
      var r1 = big?84:89, r2=93;
      html += '<line x1="'+(100+r1*Math.sin(a)).toFixed(2)+'" y1="'+(100-r1*Math.cos(a)).toFixed(2)+
              '" x2="'+(100+r2*Math.sin(a)).toFixed(2)+'" y2="'+(100-r2*Math.cos(a)).toFixed(2)+
              '" stroke="var(--text-dim)" stroke-width="'+(big?2.4:1)+'"/>';
    }
    for (var n=1;n<=12;n++){
      var ang = n*30*Math.PI/180;
      html += '<text x="'+(100+70*Math.sin(ang)).toFixed(2)+'" y="'+(100-70*Math.cos(ang)+4).toFixed(2)+
              '" text-anchor="middle" font-size="13" font-family="var(--font-mono)" fill="var(--text-dim)">'+n+'</text>';
    }
    ticks.innerHTML = html;
    function tick(){
      var d = new Date();
      var h = d.getHours(), m=d.getMinutes(), s=d.getSeconds();
      var hA = (h%12+m/60)*30, mA = m*6+s/10, sA = s*6;
      function set(id, ang){ var el=body.querySelector(id); el.setAttribute('transform','rotate('+ang+' 100 100)'); }
      set('#ch',hA); set('#cm',mA); set('#cs',sA);
      var t;
      if (settings.clock24){ t = pad(h)+':'+pad(m)+':'+pad(s); }
      else { var ap = h<12?'AM':'PM'; var h12 = h%12||12; t = h12+':'+pad(m)+':'+pad(s)+' '+ap; }
      body.querySelector('#cd').textContent = t;
      body.querySelector('#cdate').textContent = DOW[d.getDay()]+', '+d.getDate()+' '+MONF[d.getMonth()]+' '+d.getFullYear();
      var tz='';
      try{ tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }catch(e){}
      body.querySelector('#ctz').textContent = (tz+' — '+tzShort()).replace(/_/g,' ');
    }
    tick();
    win._clockTimer = setInterval(tick, 1000);
  },
  onClose: function(win){ if (this.win && this.win._clockTimer) clearInterval(this.win._clockTimer); }
};
