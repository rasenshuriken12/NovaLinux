'use strict';
/* ---- js/apps/05-terminal.js (load order 05) ---- */
/* ============================================================
   APPS
   ============================================================ */
var APPS = {};
/* ---------- TERMINAL ---------- */
APPS.terminal = {
  id:'terminal', name:'Terminal — tux@'+settings.host, icon:ICONS.terminal, w:780, h:480,
  mount: function(body, win){
    body.innerHTML =
      '<div class="term" id="term">'+
        '<div class="term-out"></div>'+
        '<div class="term-inline"><span class="prompt-html"></span><span class="term-viewwrap"><span class="term-view"><span class="tv-b"></span><span class="tv-sel"></span><span class="tv-c"></span><span class="tv-a"></span></span><input id="term-real" class="term-live" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Terminal input"></span></div>'+
      '</div>';
    var outEl = body.querySelector('.term-out');
    var termEl = body.querySelector('.term');
    var promptEl = body.querySelector('.prompt-html');
    var real = body.querySelector('#term-real');
    var tvB = body.querySelector('.tv-b'), tvSel = body.querySelector('.tv-sel'),
        tvA = body.querySelector('.tv-a'), tvView = body.querySelector('.term-view');
    function renderTermLine(){
      var v = real.value;
      var s = (real.selectionStart===null||real.selectionStart===undefined) ? v.length : real.selectionStart;
      var e2 = (real.selectionEnd===null||real.selectionEnd===undefined) ? s : real.selectionEnd;
      tvB.textContent = v.slice(0,s);
      tvSel.textContent = v.slice(s,e2);
      tvA.textContent = v.slice(e2);
      if (tvView) tvView.style.transform = 'translateX(-'+(real.scrollLeft||0)+'px)';
    }
    var ctx = {
      cwd: resolvePath(HOME, []),
      history: lsGet('nova-hist', []),
      close: function(){ win.close(); }
    };
    ctx.cwd = resolvePath(HOME, []);
    termState = { ctx:ctx, outEl:outEl, termEl:termEl, promptEl:promptEl, real:real, histIdx:null };

    print(termWelcome(), null, true);
    renderPrompt();
    real.addEventListener('keydown', onTermKey);
    ['input','keyup','click','focus'].forEach(function(ev){ real.addEventListener(ev, renderTermLine); });
    if (window._novaTermSel){ document.removeEventListener('selectionchange', window._novaTermSel); }
    window._novaTermSel = function(){ if (document.activeElement===real) renderTermLine(); };
    document.addEventListener('selectionchange', window._novaTermSel);
    renderTermLine();
    termEl.addEventListener('mouseup', function(){ if(!window.getSelection().toString()) real.focus(); });
    setTimeout(function(){ real.focus(); }, 50);

    function termWelcome(){
      return 'Nova Linux 1.0 (Webbed)  —  '+dateStr()+'\n\nType \x60help\x60 to see what works. Try \x60neofetch\x60.\n\n';
    }
    function renderPrompt(){
      promptEl.innerHTML = '<span class="p-user">'+esc(settings.user)+'@'+esc(settings.host)+'</span><span class="p-sep">:</span><span class="p-path">'+esc(homeRel(ctx.cwd))+'</span><span class="p-sep">$ </span>';
    }
    function print(text, errText, plainEcho){
      var div = document.createElement('div');
      div.className='t-pre';
      if (errText){ var e=document.createElement('div'); e.className='t-pre t-err'; e.textContent=errText; outEl.appendChild(e); }
      if (text!==null && text!==undefined && text!==''){ div.textContent=text; outEl.appendChild(div); }
      termEl.scrollTop = termEl.scrollHeight;
    }
    function printHtml(html){
      var div=document.createElement('div'); div.className='t-pre'; div.innerHTML=html;
      outEl.appendChild(div); termEl.scrollTop = termEl.scrollHeight;
    }
    termState.print = print; termState.printHtml = printHtml; termState.renderPrompt = renderPrompt;

    function onTermKey(e){
      if (e.key==='Enter'){
        var line = real.value;
        real.value=''; renderTermLine();
        /* echo */
        var echo = document.createElement('div'); echo.className='t-pre';
        echo.innerHTML = promptEl.innerHTML + esc(line);
        outEl.appendChild(echo);
        if (line.trim()){ ctx.history.push(line); if (ctx.history.length>300) ctx.history.shift(); lsSet('nova-hist', ctx.history); }
        termState.histIdx = null;
        execLine(line);
        renderPrompt();
        termEl.scrollTop = termEl.scrollHeight;
      } else if (e.key==='ArrowUp'){
        e.preventDefault();
        if (!ctx.history.length) return;
        if (termState.histIdx===null) termState.histIdx = ctx.history.length-1;
        else if (termState.histIdx>0) termState.histIdx--;
        real.value = ctx.history[termState.histIdx]||''; renderTermLine();
      } else if (e.key==='ArrowDown'){
        e.preventDefault();
        if (termState.histIdx===null) return;
        termState.histIdx++;
        if (termState.histIdx>=ctx.history.length){ termState.histIdx=null; real.value=''; }
        else real.value = ctx.history[termState.histIdx];
        renderTermLine();
      } else if (e.key==='Tab'){
        e.preventDefault();
        var val = real.value;
        var m = val.match(/(\S*)$/);
        var token = m[1];
        var before = val.slice(0, val.length-token.length);
        var cands;
        if (!/\s/.test(val)){ /* first word -> commands */
          cands = Object.keys(COMMANDS).filter(function(c){ return c.indexOf(token)===0; }).sort();
          if (cands.length===1) { real.value = cands[0]+' '; renderTermLine(); }
          else if (cands.length>1){
            print(cands.join('  '), null, false);
            renderPrompt();
          }
        } else {
          var slash = token.lastIndexOf('/');
          var dirPart = slash>=0 ? token.slice(0,slash+1) : '';
          var base = slash>=0 ? token.slice(slash+1) : token;
          var dirNode = getNode(resolvePath(dirPart||'.', ctx.cwd));
          cands = dirNode && dirNode.type==='dir' ? dirEntries(dirNode).filter(function(n){ return n.indexOf(base)===0; }) : [];
          if (cands.length===1){
            var nn = cands[0];
            var isDir = dirNode.children[nn].type==='dir';
            real.value = before + dirPart + nn + (isDir?'/':' '); renderTermLine();
          } else if (cands.length>1){
            print(cands.join('  '), null, false);
            renderPrompt();
          }
        }
      } else if (e.key==='l' && e.ctrlKey){
        e.preventDefault(); outEl.innerHTML='';
      } else if (e.key==='c' && e.ctrlKey && !window.getSelection().toString()){
        var echo = document.createElement('div'); echo.className='t-pre';
        echo.innerHTML = promptEl.innerHTML + esc(real.value) + '^C';
        outEl.appendChild(echo);
        real.value=''; renderTermLine();
        renderPrompt(); termEl.scrollTop = termEl.scrollHeight;
      }
    }

    function execLine(line){
      var trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed==='clear'){ outEl.innerHTML=''; return; }
      var tokens;
      try{ tokens = tokenize(trimmed); }
      catch(e){ printHtml('<span class="t-err">bash: syntax error</span>'); return; }
      var res = runPipeline(tokens, ctx);
      if (!res) return;
      if (res.err) printHtml('<span class="t-err">'+esc(res.err)+'</span>');
      if (res.html!==null && res.html!==undefined && res.html!==''){ printHtml(res.html); }
      else if (res.out){ print(res.out, null, false); }
      termEl.scrollTop = termEl.scrollHeight;
    }
    termState.execLine = execLine;
  },
  onClose: function(){
    if (window._novaTermSel){ document.removeEventListener('selectionchange', window._novaTermSel); window._novaTermSel = null; }
    termState = null;
  }
};
var termState = null;
