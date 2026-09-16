'use strict';
/* ---- js/apps/12-settings.js (load order 12) ---- */
/* ---------- SETTINGS ---------- */
APPS.settings = {
  id:'settings', name:'Settings', icon:ICONS.settings, w:620, h:560,
  mount: function(body, win){
    function render(){
      var wallpapers = {
        aurora:['Aurora','linear-gradient(160deg,#0f2027,#203a43,#2c5364)'],
        dusk:['Dusk','radial-gradient(300px 120px at 70% 20%,rgba(13,148,136,.5),transparent),linear-gradient(180deg,#10141f,#1b2434)'],
        carbon:['Carbon','linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),#14171d'],
        paper:['Paper','linear-gradient(150deg,#f2ede3,#dfd6c4)']
      };
      var html = '<div class="app-pad">';
      html += '<div class="app-label" style="margin-bottom:6px">System</div>';
      html += '<div class="set-row"><div><div class="set-name">Username</div><div class="set-hint">Shown in the shell prompt, whoami, ps</div></div>'+
        '<input class="set-input" id="s-user" maxlength="12" value="'+esc(settings.user)+'"></div>';
      html += '<div class="set-row"><div><div class="set-name">Hostname</div><div class="set-hint">uname -n, hostname</div></div>'+
        '<input class="set-input" id="s-host" maxlength="16" value="'+esc(settings.host)+'"></div>';
      html += '<div class="set-row"><div><div class="set-name">Appearance</div><div class="set-hint">Dark or light surfaces</div></div>'+
        '<div class="seg" id="s-theme"><button data-v="dark"'+(settings.theme==='dark'?' class="sel"':'')+'>Dark</button><button data-v="light"'+(settings.theme==='light'?' class="sel"':'')+'>Light</button></div></div>';
      html += '<div class="set-row"><div><div class="set-name">Accent colour</div></div><div class="swatches">'+
        Object.keys(ACCENTS).map(function(k){ return '<div class="swatch'+(settings.accent===k?' sel':'')+'" data-accent="'+k+'" style="background:'+ACCENTS[k].base+'" title="'+k+'"></div>'; }).join('')+'</div></div>';
      html += '<div class="set-row"><div><div class="set-name">Wallpaper</div></div><div class="wp-opts">'+
        Object.keys(wallpapers).map(function(k){ return '<div class="wp-th'+(settings.wallpaper===k?' sel':'')+'" data-wp="'+k+'" style="background:'+wallpapers[k][1]+';background-size:cover" title="'+wallpapers[k][0]+'"></div>'; }).join('')+'</div></div>';
      html += '<div class="set-row"><div><div class="set-name">24-hour clock</div><div class="set-hint">Top bar and Clock app</div></div>'+
        '<div class="toggle'+(settings.clock24?' on':'')+'" id="s-clock"><i></i></div></div>';
      html += '<div class="set-row"><div><div class="set-name">Reset settings and layout</div><div class="set-hint">Restores the default settings and moves every open window back to its default position</div></div>'+
        '<button class="btn primary" id="s-reset">Reset</button></div>';
      html += '<div class="set-row"><div><div class="set-name">Erase everything</div><div class="set-hint">Factory reset &mdash; wipes the filesystem, notes, history and settings</div></div>'+
        '<button class="btn danger" id="s-erase">Erase</button></div>';
      html += '</div>';
      body.innerHTML = html;

      body.querySelector('#s-user').addEventListener('change', function(){
        settings.user = (this.value.replace(/[^a-zA-Z0-9_-]/g,'')||'tux').slice(0,12); this.value=settings.user; save();
      });
      body.querySelector('#s-host').addEventListener('change', function(){
        settings.host = (this.value.replace(/[^a-zA-Z0-9-]/g,'')||'nova').slice(0,16); this.value=settings.host; save();
      });
      body.querySelectorAll('#s-theme button').forEach(function(b){
        b.addEventListener('click', function(){ settings.theme=b.getAttribute('data-v'); save(); render(); });
      });
      body.querySelectorAll('.swatch').forEach(function(s){
        s.addEventListener('click', function(){ settings.accent=s.getAttribute('data-accent'); save(); render(); });
      });
      body.querySelectorAll('.wp-th').forEach(function(t){
        t.addEventListener('click', function(){ settings.wallpaper=t.getAttribute('data-wp'); save(); render(); });
      });
      body.querySelector('#s-clock').addEventListener('click', function(){ settings.clock24=!settings.clock24; save(); render(); });
      body.querySelector('#s-reset').addEventListener('click', function(){
        settings = defaultSettings();
        lsSet('nova-settings', settings);
        applySettings();
        resetWindowLayout();
        render();
      });
      body.querySelector('#s-erase').addEventListener('click', function(){
        if (confirm('Erase everything? All files, notes and history in the simulator will be lost.')){
          ['nova-fs','nova-notes','nova-settings','nova-hist'].forEach(function(k){ try{localStorage.removeItem(k);}catch(e){} });
          location.reload();
        }
      });
      function save(){ lsSet('nova-settings', settings); applySettings(); }
    }
    render();
  }
};
