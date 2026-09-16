'use strict';
/* ---- js/apps/06-files.js (load order 06) ---- */
/* ---------- FILES ---------- */
APPS.files = {
  id:'files', name:'Files', icon:ICONS.folder, w:900, h:540,
  mount: function(body, win){
    var cwd = resolvePath(HOME, []);
    var sel = null, delArmed = false;
    var backStack = [], fwdStack = [];
    function disarm(){ delArmed = false; }
    function navTo(parts){ backStack.push(cwd.slice()); fwdStack = []; cwd = parts; sel = null; disarm(); render(); }
    function goBack(){ if (!backStack.length) return; fwdStack.push(cwd.slice()); cwd = backStack.pop(); sel=null; disarm(); render(); }
    function goFwd(){ if (!fwdStack.length) return; backStack.push(cwd.slice()); cwd = fwdStack.pop(); sel=null; disarm(); render(); }
    var PLACES = [
      ['Home', HOME], ['Documents', HOME+'/Documents'], ['Downloads', HOME+'/Downloads'],
      ['projects', HOME+'/projects'], ['System (/etc)', '/etc'], ['Logs (/var/log)', '/var/log']
    ];
    function typeOf(n){ return n.type==='dir' ? 'Folder' : (n.type==='link' ? 'Symbolic link' : 'Text file'); }
    function fmtSize(n){ return n.type==='dir' || n.type==='link' ? '\u2014' : ((n.content||'').length+' bytes'); }
    function render(){
      var node = getNode(cwd);
      if (!node || node.type!=='dir'){ cwd = resolvePath(HOME, []); node = getNode(cwd); }
      var crumbs = '<span class="fm-crumb" data-p="/">/</span>';
      var acc = '';
      cwd.forEach(function(seg){ acc += '/'+seg; crumbs += '<span class="fm-crumb" data-p="'+acc+'">'+esc(seg)+'</span>'; });
      var rows = '', count = 0;
      dirEntries(node).forEach(function(name){
        var child = node.children[name];
        count++;
        rows += '<div class="fm-row'+(sel===name?' sel':'')+'" data-name="'+esc(name)+'">'+
          '<span class="fm-ic">'+(child.type==='dir'?ICONS.folder:ICONS.file)+'</span>'+
          '<span class="fm-name">'+esc(name)+'</span>'+
          '<span class="fm-type">'+typeOf(child)+'</span>'+
          '<span class="fm-size">'+fmtSize(child)+'</span>'+
          '<span class="fm-mtime">'+mtimeStr(child.mtime)+'</span></div>';
      });
      if (!count) rows = '<div class="fm-empty">This folder is empty</div>';
      var selNode = sel && node.children[sel] ? node.children[sel] : null;
      var preview = '<div class="fm-preview-empty">Select a file to see its contents here.<br><br>Double-click a folder to open it.</div>';
      if (selNode && selNode.type==='file'){
        preview = '<div class="fm-preview-name">'+esc(sel)+'</div><div class="fm-preview-meta">'+typeOf(selNode)+' &middot; '+
          (selNode.content||'').length+' bytes</div><pre class="fm-preview-body">'+esc(selNode.content||'')+'</pre>';
      } else if (selNode){
        preview = '<div class="fm-preview-name">'+esc(sel)+'</div><div class="fm-preview-meta">Folder &middot; '+
          Object.keys(selNode.children).length+' items &middot; double-click to open</div>';
      }
      body.innerHTML =
        '<div class="fm-wrap">'+
          '<div class="fm-side"><div class="fm-side-title">Places</div>'+
            PLACES.map(function(p){ return '<div class="fm-side-item" data-pl="'+p[1]+'">'+esc(p[0])+'</div>'; }).join('')+
          '</div>'+
          '<div class="fm-main">'+
            '<div class="fm-bar">'+
              '<button class="btn" id="fm-back" title="Back"'+(backStack.length?'':' disabled')+'><</button>'+
              '<button class="btn" id="fm-fwd" title="Forward"'+(fwdStack.length?'':' disabled')+'>></button>'+
              '<div class="fm-crumbs">'+crumbs+'</div>'+
              '<button class="btn" id="fm-newdir">New folder</button>'+
              '<button class="btn danger'+(delArmed?' armed':'')+'" id="fm-del">'+(delArmed?'Confirm':'Delete')+'</button>'+
            '</div>'+
            '<div class="fm-row head"><span class="fm-ic"></span><span class="fm-name">Name</span><span class="fm-type">Type</span><span class="fm-size">Size</span><span class="fm-mtime">Modified</span></div>'+
            '<div class="fm-list">'+rows+'</div>'+
          '</div>'+
          '<div class="fm-preview">'+preview+'</div>'+
        '</div>';
      body.querySelectorAll('.fm-crumb').forEach(function(c){
        c.addEventListener('click', function(){ navTo(resolvePath(c.getAttribute('data-p'), [])); });
      });
      body.querySelectorAll('.fm-side-item').forEach(function(p){
        p.addEventListener('click', function(){ navTo(resolvePath(p.getAttribute('data-pl'), [])); });
      });
      body.querySelector('#fm-back').addEventListener('click', goBack);
      body.querySelector('#fm-fwd').addEventListener('click', goFwd);
      body.querySelector('#fm-newdir').addEventListener('click', function(){
        var name = 'New Folder', n = 2;
        while (node.children[name]) name = 'New Folder '+(n++);
        node.children[name] = {type:'dir', children:{}, mtime:Date.now()};
        sel = name; saveFS(); disarm(); render();
      });
      var delBtn = body.querySelector('#fm-del');
      delBtn.addEventListener('click', function(){
        if (!sel) return;
        if (!delArmed){ delArmed = true; render(); setTimeout(disarm, 2600); return; }
        var cur = getNode(cwd);
        if (cur && cur.type==='dir' && cur.children[sel]){ delete cur.children[sel]; }
        sel = null; disarm(); saveFS(); render();
      });
      body.querySelectorAll('.fm-row:not(.head)').forEach(function(rowEl){
        var name = rowEl.getAttribute('data-name');
        rowEl.addEventListener('click', function(){ sel = (sel===name?null:name); disarm(); render(); });
        rowEl.addEventListener('dblclick', function(){
          var child = getNode(cwd.concat([name]));
          if (child && child.type==='dir'){ navTo(cwd.concat([name])); }
          else { sel = name; disarm(); render(); }
        });
      });
    }
    render();
  }
};
