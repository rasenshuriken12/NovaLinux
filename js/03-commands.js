'use strict';
/* ---- js/03-commands.js (load order 03) ---- */
/* ============================================================
   SHELL COMMANDS
   ============================================================ */
function ShellError(msg){ this.msg = msg; }
ShellError.prototype = Object.create(Error.prototype);
var sessionStart = new Date();

var DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var MONF = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function pad(n,w){ n=String(n); while(n.length<(w||2)) n='0'+n; return n; }
function spad(n,w){ n=String(n); while(n.length<(w||2)) n=' '+n; return n; }
function tzShort(){
  try{
    var parts = new Intl.DateTimeFormat('en-US',{timeZoneName:'short'}).formatToParts(new Date());
    for (var i=0;i<parts.length;i++) if (parts[i].type==='timeZoneName') return parts[i].value;
  }catch(e){}
  return 'UTC';
}
function dateStr(d){
  d = d || new Date();
  return DOW[d.getDay()]+' '+MON[d.getMonth()]+' '+d.getDate()+' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds())+' '+tzShort()+' '+d.getFullYear();
}
function uptimeStr(){
  var ms = Date.now()-sessionStart.getTime();
  var s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  var hhmm = h>0 ? (h+' hour'+(h>1?'s':'')+', '+m+' min') : (m+' min'+(m===1?'':'s'));
  var now = new Date();
  return pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds())+' up '+hhmm+',  1 user,  load average: 0.42, 0.35, 0.31';
}
function mtimeStr(t){ var d=new Date(t); return MON[d.getMonth()]+' '+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes()); }
function homeRel(p){ var s=pathStr(p); return s===HOME?'~':(s.indexOf(HOME+'/')===0? '~'+s.slice(HOME.length):s); }

/* fake stable pids for system daemons */
var SYS_PIDS = {};
(function(){ var p=700; ['systemd','gnome-shell','NetworkManager','pulseaudio','dbus-daemon','polkitd','cron','cupsd'].forEach(function(n){ SYS_PIDS[n]=p; p+=83; }); })();

var MANPAGES = {
  ls:'NAME\n     ls - list directory contents\nSYNOPSIS\n     ls [-l] [-a] [path ...]\nDESCRIPTION\n     Lists files. -l long format, -a includes dot files.\n     Dirs are shown in blue, executables in green.',
  cd:'NAME\n     cd - change the working directory\nSYNOPSIS\n     cd [dir]\nDESCRIPTION\n     Changes directory. cd with no args goes home, cd .. goes up.',
  cat:'NAME\n     cat - concatenate files and print to stdout\nSYNOPSIS\n     cat [file ...]\nDESCRIPTION\n     Prints file contents. Often used with pipes: cat f | grep word',
  grep:'NAME\n     grep - print lines matching a pattern\nSYNOPSIS\n     grep [-i] [-n] [-v] [-c] pattern [file ...]\nDESCRIPTION\n     -i ignore case, -n line numbers, -v invert, -c count only.',
  man:'MAN(1)  Manual pager utils  MAN(1)\n\nNAME\n     man - an interface to the system reference manuals\n\nSYNOPSIS\n     man [command]\n\nDESCRIPTION\n     Shows the manual page for a command (short pages here).',
  pwd:'NAME\n     pwd - print name of working directory',
  echo:'NAME\n     echo - display a line of text\nSYnOPSIS\n     echo [-n] [string ...]\nDESCRIPTION\n     -n suppress trailing newline.',
  rm:'NAME\n     rm - remove files or directories\nSYNOPSIS\n     rm [-r] file ...\nDESCRIPTION\n     -r removes directories recursively. There is no trash can — be careful.',
  mkdir:'NAME\n     mkdir - make directories\nSYNOPSIS\n     mkdir [-p] dir ...',
  cp:'NAME\n     cp - copy files\nSYNOPSIS\n     cp [-r] source target',
  mv:'NAME\n     mv - move (rename) files\nSYNOPSIS\n     mv source target',
  touch:'NAME\n     touch - change file timestamps / create empty file\nSYNOPSIS\n     touch file ...',
  wc:'NAME\n     wc - print newline, word and byte counts\nSYNOPSIS\n     wc [file ...]',
  head:'NAME\n     head - output the first part of files\nSYNOPSIS\n     head [-n N] [file ...]',
  tail:'NAME\n     tail - output the last part of files\nSYNOPSIS\n     tail [-n N] [file ...]',
  tree:'NAME\n     tree - list contents of directories in a tree-like format',
  ps:'NAME\n     ps - report a snapshot of current processes\nSYNOPSIS\n     ps aux',
  top:'NAME\n     top - display Linux processes (one snapshot here)',
  df:'NAME\n     df - report file system disk space usage\nSYNOPSIS\n     df -h',
  free:'NAME\n     free - display amount of free and used memory\nSYNOPSIS\n     free -h',
  find:'NAME\n     find - search for files in a directory hierarchy\nSYNOPSIS\n     find [path] [-name pattern]',
  uname:'NAME\n     uname - print system information\nSYnOPSIS\n     uname [-a]',
  nano:'NAME\n     nano - small, friendly text editor (not in this simulator — try: open notes)',
  history:'NAME\n     history - display the command history',
  rmdir:'NAME\n     rmdir - remove empty directories\nDESCRIPTION\n     Removes a directory only if it is empty. Use rm -r for non-empty ones.',
  ln:'NAME\n     ln - make links between files\nSYNOPSIS\n     ln -s TARGET LINK_NAME\nDESCRIPTION\n     Creates a symbolic link (shortcut). The link points at TARGET.',
  locate:'NAME\n     locate - find files by name\nDESCRIPTION\n     Quickly lists files whose name contains the pattern, using a database of the filesystem.',
  whereis:'NAME\n     whereis - locate the binary and manual page of a command\nSYNOPSIS\n     whereis command',
  wget:'NAME\n     wget - network downloader (simulated here)\nSYNOPSIS\n     wget [-O file] URL\nDESCRIPTION\n     Downloads a file. This simulator fakes the download and saves a placeholder.'
};

var COMMANDS = {};

COMMANDS.help = function(){ 
  var out = 'Nova Linux shell — available commands:\n\n' +
'  file ops    ls  cd  pwd  cat  echo  touch  mkdir  rm  cp  mv  ln  head  tail\n' +
'              wc  grep  find  locate  tree  stat  sort  uniq  rev\n' +
'  system      uname  whoami  id  hostname  hostnamectl  arch  lscpu  env\n' +
'              date  cal  uptime  df  free  ps  top  history  which  whereis\n' +
'  extras      neofetch  cowsay  man  open  clear  exit\n' +
'  power       reboot  shutdown\n\n' +
'Tips:  Tab completes commands and paths.  Up/Down walks history.\n' +
'      Pipes work:  ls /etc | grep conf | wc -l\n' +
'      Redirection works:  echo hello > file.txt\n' +
'      Try:  man ls    neofetch    cowsay practice makes perfect\n' +
      '      Apps:  open files   open help   open ai   (a command-explainer assistant)\n';
  return {out:out};
};

COMMANDS.pwd = function(a,stdin,ctx){ return {out:pathStr(ctx.cwd)+'\n'}; };

COMMANDS.cd = function(a,stdin,ctx){
  var target = a[0];
  if (!target || target==='~'){ ctx.cwd = resolvePath(HOME, ctx.cwd); return {out:''}; }
  if (target==='-'){ return {err:'bash: cd: OLDPWD is not supported in this simulator\n'}; }
  var parts = resolvePath(target, ctx.cwd);
  var node = getNode(parts);
  if (!node) return {err:'bash: cd: '+target+': No such file or directory\n'};
  if (node.type!=='dir') return {err:'bash: cd: '+target+': Not a directory\n'};
  ctx.cwd = parts;
  return {out:''};
};

function fmtLsLong(entries, parentNode, all){
  var lines = ['total '+(entries.length*4)];
  entries.forEach(function(name){
    var node = parentNode.children[name];
    var isDir = node.type==='dir', isLink = node.type==='link';
    var perms = isDir ? 'drwxr-xr-x' : (isLink ? 'lrwxrwxrwx' : (isExec(name) ? '-rwxr-xr-x' : '-rw-r--r--'));
    var size = isDir ? 4096 : String(isLink ? node.target.length : (node.content||'').length);
    lines.push(perms+'  '+((isDir||isLink)?2:1)+' '+settings.user+' '+settings.user+' '+spad(size,6)+' '+mtimeStr(node.mtime)+' '+name+(isLink?' -> '+node.target:''));
  });
  return lines.join('\n')+'\n';
}
function lsHtml(entries, parentNode){
  return entries.map(function(name){
    var node = parentNode.children[name];
    if (node.type==='link') return '<span class="tlnk">'+esc(name)+'</span> <span class="tdim">-> '+esc(node.target)+'</span>';
    var cls = node.type==='dir' ? 'td' : (isExec(name) ? 'tx' : '');
    return cls ? '<span class="'+cls+'">'+esc(name)+'</span>' : esc(name);
  }).join('  ');
}
COMMANDS.ls = function(a,stdin,ctx){
  var long=false, all=false, targets=[];
  a.forEach(function(x){ if(x==='-l'||x==='-la'||x==='-al') long=true; if(x.charAt(0)==='-'&&x!=='-l') all=true; if(x.indexOf('a')>0&&x.charAt(0)==='-') all=true; if(x.charAt(0)!=='-') targets.push(x); });
  if (!targets.length) targets=['.'];
  var outText='', outHtml='';
  targets.forEach(function(t,i){
    var parts = resolvePath(t, ctx.cwd);
    var node = getNode(parts);
    if (!node){ outText += "ls: cannot access '"+t+"': No such file or directory\n"; outHtml += '<span class="t-err">ls: cannot access \''+esc(t)+'\': No such file or directory</span>\n'; return; }
    if (node.type==='file'){
      outText += baseName(parts)+'\n'; outHtml += esc(baseName(parts))+'\n'; return;
    }
    var entries = dirEntries(node).filter(function(n){ return all || n.charAt(0)!=='.'; });
    if (targets.length>1){ outText += t+':\n'; outHtml += '<span class="tdim">'+esc(t)+':</span>\n'; }
    if (long){
      outText += fmtLsLong(entries, node, all);
      outHtml += esc(fmtLsLong(entries, node, all));
    } else {
      var disp = entries.map(function(n){ var c=node.children[n]; return c.type==='link' ? n+' -> '+c.target : n; });
      var w = 2; disp.forEach(function(d){ w=Math.max(w,d.length+2); });
      var txt = disp.map(function(d){ return d + Array(Math.max(1,w-d.length+1)).join(' '); }).join('');
      outText += txt.replace(/\s+$/,'')+'\n';
      outHtml += lsHtml(entries, node)+'\n';
    }
    if (targets.length>1 && i<targets.length-1){ outText+='\n'; outHtml+='\n'; }
  });
  return {out:outText, html:outHtml};
};

COMMANDS.cat = function(a,stdin,ctx){
  if (!a.length) return {out: stdin||''};
  var out='', err='';
  a.forEach(function(f){
    var node = getNode(resolvePath(f, ctx.cwd));
    if (!node){ err += "cat: "+f+": No such file or directory\n"; return; }
    if (node.type==='dir'){ err += "cat: "+f+": Is a directory\n"; return; }
    out += node.content;
  });
  return {out:out, err:err};
};

COMMANDS.echo = function(a){
  var nFlag=false;
  if (a[0]==='-n'){ nFlag=true; a=a.slice(1); }
  return {out:a.join(' ')+(nFlag?'':'\n')};
};

COMMANDS.touch = function(a,stdin,ctx){
  if(!a.length) return {err:'touch: missing file operand\n'};
  a.forEach(function(f){
    var parts = resolvePath(f, ctx.cwd);
    var parent = getNode(parentDirOf(parts));
    var name = baseName(parts);
    if (!parent || parent.type!=='dir'){ return; } /* silently like touch */
    if (parent.children[name] && parent.children[name].type==='file'){ parent.children[name].mtime = Date.now(); }
    else if (!parent.children[name]){ parent.children[name] = {type:'file', content:'', mtime:Date.now()}; }
  });
  saveFS(); return {out:''};
};

COMMANDS.mkdir = function(a,stdin,ctx){
  var pflag=false;
  a = a.filter(function(x){ if(x==='-p'){pflag=true;return false;} return x.charAt(0)!=='-'; });
  if(!a.length) return {err:'mkdir: missing operand\n'};
  var err='';
  a.forEach(function(d){
    var parts = resolvePath(d, ctx.cwd);
    var cur = FS, ok=true;
    for (var i=0;i<parts.length;i++){
      var seg=parts[i];
      if (!(seg in cur.children)){
        if (!pflag && i<parts.length-1){ err += "mkdir: cannot create directory '"+d+"': No such file or directory\n"; ok=false; break; }
        if (cur.type!=='dir'){ err += "mkdir: cannot create directory '"+d+"': Not a directory\n"; ok=false; break; }
        cur.children[seg] = {type:'dir', children:{}, mtime:Date.now()};
        if (!pflag) break;
      }
      cur = cur.children[seg];
      if (cur.type!=='dir'){ err += "mkdir: cannot create directory '"+d+"': File exists\n"; ok=false; break; }
    }
  });
  saveFS(); return {err:err};
};

COMMANDS.rm = function(a,stdin,ctx){
  var rec=false;
  a = a.filter(function(x){ if(x==='-r'||x==='-rf'||x==='-fr'){rec=true;return false;} if(x.charAt(0)==='-')return false; return true; });
  if(!a.length) return {err:'rm: missing operand\n'};
  var err='';
  a.forEach(function(f){
    var parts = resolvePath(f, ctx.cwd);
    if (parts.length===0){ err += "rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override, or better: don't.\n"; return; }
    var parent = getNode(parentDirOf(parts));
    var name = baseName(parts);
    if (!parent || parent.type!=='dir' || !(name in parent.children)){ err += "rm: cannot remove '"+f+"': No such file or directory\n"; return; }
    var node = parent.children[name];
    if (node.type==='dir' && !rec){ err += "rm: cannot remove '"+f+"': Is a directory\n"; return; }
    delete parent.children[name];
  });
  saveFS(); return {err:err};
};

function cloneNode(node){
  if (node.type==='file') return {type:'file', content:node.content, mtime:Date.now()};
  var c = {type:'dir', children:{}, mtime:Date.now()};
  Object.keys(node.children).forEach(function(k){ c.children[k]=cloneNode(node.children[k]); });
  return c;
}
COMMANDS.cp = function(a,stdin,ctx){
  var rec=false;
  a = a.filter(function(x){ if(x==='-r'){rec=true;return false;} if(x.charAt(0)==='-')return false; return true; });
  if (a.length<2) return {err:'cp: missing destination file operand\n'};
  var src = a[0], dst = a[1];
  var sNode = getNode(resolvePath(src, ctx.cwd));
  if (!sNode) return {err:"cp: cannot stat '"+src+"': No such file or directory\n"};
  if (sNode.type==='dir' && !rec) return {err:"cp: -r not specified; omitting directory '"+src+"'\n"};
  var dParts = resolvePath(dst, ctx.cwd);
  var dNode = getNode(dParts);
  var targetParts, parent;
  if (dNode && dNode.type==='dir'){ targetParts = dParts.concat([baseName(resolvePath(src,ctx.cwd))]); parent = dNode; }
  else { targetParts = dParts; parent = getNode(parentDirOf(dParts)); }
  if (!parent || parent.type!=='dir') return {err:"cp: cannot create '"+dst+"': No such file or directory\n"};
  parent.children[baseName(targetParts)] = cloneNode(sNode);
  saveFS(); return {out:''};
};

COMMANDS.mv = function(a,stdin,ctx){
  if (a.length<2) return {err:'mv: missing destination file operand\n'};
  var src=a[0], dst=a[1];
  var sParts = resolvePath(src, ctx.cwd);
  var sParent = getNode(parentDirOf(sParts));
  var sName = baseName(sParts);
  if (!sParent || !(sName in sParent.children)) return {err:"mv: cannot stat '"+src+"': No such file or directory\n"};
  var dParts = resolvePath(dst, ctx.cwd);
  var dNode = getNode(dParts);
  var node = sParent.children[sName];
  if (dNode && dNode.type==='dir'){ dNode.children[sName]=node; }
  else {
    var dParent = getNode(parentDirOf(dParts));
    if (!dParent || dParent.type!=='dir') return {err:"mv: cannot move to '"+dst+"': No such file or directory\n"};
    dParent.children[baseName(dParts)] = node;
  }
  delete sParent.children[sName];
  saveFS(); return {out:''};
};

COMMANDS.head = function(a,stdin,ctx){
  var n=10, files=[];
  for (var i=0;i<a.length;i++){
    if (a[i]==='-n'){ n=parseInt(a[i+1],10)||10; i++; continue; }
    if (a[i].slice(0,2)==='-n'){ n=parseInt(a[i].slice(2),10)||10; continue; }
    if (a[i].charAt(0)!=='-') files.push(a[i]);
  }
  var text = files.length ? '' : (stdin||'');
  var err='';
  files.forEach(function(f){
    var node = getNode(resolvePath(f,ctx.cwd));
    if (!node){ err += "head: cannot open '"+f+"' for reading: No such file or directory\n"; return; }
    text += node.content;
  });
  return {out: text.split('\n').slice(0,n).join('\n')+(text?'\n':''), err:err};
};
COMMANDS.tail = function(a,stdin,ctx){
  var n=10, files=[];
  for (var i=0;i<a.length;i++){
    if (a[i]==='-n'){ n=parseInt(a[i+1],10)||10; i++; continue; }
    if (a[i].slice(0,2)==='-n'){ n=parseInt(a[i].slice(2),10)||10; continue; }
    if (a[i].charAt(0)!=='-') files.push(a[i]);
  }
  var text = files.length ? '' : (stdin||'');
  var err='';
  files.forEach(function(f){
    var node = getNode(resolvePath(f,ctx.cwd));
    if (!node){ err += "tail: cannot open '"+f+"' for reading: No such file or directory\n"; return; }
    text += node.content;
  });
  var lines = text.replace(/\n$/,'').split('\n');
  return {out: lines.slice(Math.max(0,lines.length-n)).join('\n')+(text?'\n':''), err:err};
};

COMMANDS.wc = function(a,stdin,ctx){
  var files = a.filter(function(x){ return x.charAt(0)!=='-'; });
  var results=[], err='';
  function countOf(text){
    var lines = text ? text.split('\n') : [];
    if (lines.length && lines[lines.length-1]==='') lines.pop();
    var words = text ? (text.replace(/\n/g,' ').split(/\s+/).filter(Boolean)) : [];
    return {l:lines.length, w:words.length, c:text.length};
  }
  if (files.length){
    files.forEach(function(f){
      var node = getNode(resolvePath(f,ctx.cwd));
      if (!node){ err += "wc: "+f+": No such file or directory\n"; return; }
      var c = countOf(node.type==='file'?node.content:'');
      results.push({name:f, c:c});
    });
  } else results.push({name:'', c:countOf(stdin||'')});
  var out = results.map(function(r){
    return spad(r.c.l,4)+' '+spad(r.c.w,4)+' '+spad(r.c.c,4)+(r.name?' '+r.name:'');
  }).join('\n');
  return {out: out+(out?'\n':''), err:err};
};

COMMANDS.grep = function(a,stdin,ctx){
  var icase=false, num=false, inv=false, cnt=false, args=[];
  a.forEach(function(x){
    if (x==='-i'||x==='-in'||x==='-ni') { icase=true; num=true; }
    else if (x==='-n'){ num=true; }
    else if (x==='-v'){ inv=true; }
    else if (x==='-c'){ cnt=true; }
    else if (x.charAt(0)==='-'&&x.length>1&&/^[invc]+$/.test(x.slice(1))){ var f=x.slice(1); if(f.indexOf('i')>=0)icase=true; if(f.indexOf('n')>=0)num=true; if(f.indexOf('v')>=0)inv=true; if(f.indexOf('c')>=0)cnt=true; }
    else args.push(x);
  });
  if (!args.length) return {err:'Usage: grep [-inv] PATTERN [FILE...]\n'};
  var pattern = args.shift();
  var files = args;
  var sources = [];
  if (files.length){
    files.forEach(function(f){
      var node = getNode(resolvePath(f,ctx.cwd));
      if (!node) sources.push({name:f, text:null});
      else sources.push({name:f, text: node.type==='file' ? node.content : ''});
    });
  } else sources.push({name:'', text:stdin||''});
  var out='', err='';
  sources.forEach(function(src){
    if (src.text===null){ err += "grep: "+src.name+": No such file or directory\n"; return; }
    var lines = src.text.split('\n');
    if (lines.length && lines[lines.length-1]==='') lines.pop();
    var matches=[];
    lines.forEach(function(line,i){
      var hit = icase ? line.toLowerCase().indexOf(pattern.toLowerCase())>=0 : line.indexOf(pattern)>=0;
      if (inv) hit = !hit;
      if (hit) matches.push({i:i+1, line:line});
    });
    if (cnt){ out += matches.length+(files.length>1&&src.name?' '+src.name:'')+'\n'; return; }
    matches.forEach(function(m){
      var prefix = files.length>1 ? src.name+':' : '';
      var numPrefix = num ? m.i+':' : '';
      out += prefix+numPrefix+m.line+'\n';
    });
  });
  return {out:out, err:err};
};

COMMANDS.find = function(a,stdin,ctx){
  var args=a.slice(), namePat=null, start='.';
  if (args.length && args[0].charAt(0)!=='-'){ start = args.shift(); }
  var i=args.indexOf('-name');
  if (i>=0 && i<args.length-1){ namePat = args[i+1]; }
  var rootParts = resolvePath(start, ctx.cwd);
  var root = getNode(rootParts);
  if (!root) return {err:"find: '"+start+"': No such file or directory\n"};
  var out=[];
  function walk(parts,node){
    dirEntries(node).forEach(function(name){
      var child = node.children[name];
      var p = parts.concat([name]);
      var show = true;
      if (namePat){
        var rx = new RegExp('^'+namePat.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$');
        show = rx.test(name);
      }
      if (show) out.push(pathStr(p));
      if (child.type==='dir') walk(p, child);
    });
  }
  out.push(pathStr(rootParts));
  if (root.type==='dir') walk(rootParts, root);
  return {out: out.join('\n')+'\n'};
};

COMMANDS.tree = function(a,stdin,ctx){
  var start = a.filter(function(x){return x.charAt(0)!=='-';})[0] || '.';
  var parts = resolvePath(start, ctx.cwd);
  var node = getNode(parts);
  if (!node) return {err:"tree: "+start+": No such file or directory\n"};
  if (node.type==='file') return {out: pathStr(parts)+'\n'};
  var out = [pathStr(parts)];
  var dirs=0, files=0;
  function walk(parts,node,prefix){
    var entries = dirEntries(node);
    entries.forEach(function(name,idx){
      var last = idx===entries.length-1;
      var branch = last ? '└── ' : '├── ';
      var child = node.children[name];
      if (child.type==='dir'){ dirs++; out.push(prefix+branch+'<span class="td">'+esc(name)+'</span>'); walk(parts.concat([name]), child, prefix+(last?'    ':'│   ')); }
      else { files++; out.push(prefix+branch+esc(name)+(child.type==='link'?' <span class="tdim">-> '+esc(child.target)+'</span>':'')); }
    });
  }
  walk(parts, node, '');
  var plain = out.map(function(l){ return l.replace(/<[^>]+>/g,''); });
  return {out: plain.join('\n')+'\n\n'+dirs+' directories, '+files+' files\n', html: out.join('\n')+'\n\n'+dirs+' directories, '+files+' files\n'};
};

COMMANDS.stat = function(a,stdin,ctx){
  if (!a.length) return {err:'stat: missing operand\n'};
  var parts = resolvePath(a[0],ctx.cwd), node = getNode(parts);
  if (!node) return {err:"stat: cannot statx '"+a[0]+"': No such file or directory\n"};
  var name = pathStr(parts);
  var statParent = getNode(parentDirOf(parts));
  var direct = statParent && statParent.children ? statParent.children[baseName(parts)] : null;
  if (direct && direct.type==='link'){
    return {out:'  File: '+name+' -> '+direct.target+'\n  Size: '+direct.target.length+'         Blocks: 8          IO Block: 4096   symbolic link\nDevice: 802h/2050d  Inode: '+(12000+hashStr(name))+'   Links: 1\nAccess: (0777/lrwxrwxrwx)  Uid: ( 1000/'+settings.user+')   Gid: ( 1000/'+settings.user+')\nModify: '+mtimeStr(direct.mtime)+'\n'};
  }
  if (node.type==='dir'){
    return {out:'  File: '+name+'\n  Size: 4096        Blocks: 8          IO Block: 4096   directory\nDevice: 802h/2050d  Inode: '+(12000+hashStr(name))+'   Links: 2\nAccess: (0755/drwxr-xr-x)  Uid: ( 1000/'+settings.user+')   Gid: ( 1000/'+settings.user+')\nModify: '+mtimeStr(node.mtime)+'\n'};
  }
  return {out:'  File: '+name+'\n  Size: '+(node.content||'').length+'         Blocks: 8          IO Block: 4096   regular file\nDevice: 802h/2050d  Inode: '+(12000+hashStr(name))+'   Links: 1\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/'+settings.user+')   Gid: ( 1000/'+settings.user+')\nModify: '+mtimeStr(node.mtime)+'\n'};
};
function hashStr(s){ var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))%99991; } return h; }

COMMANDS.sort = function(a,stdin,ctx){
  var text = stdin||'';
  var files = a.filter(function(x){return x.charAt(0)!=='-';});
  files.forEach(function(f){ var n=getNode(resolvePath(f,ctx.cwd)); if(n&&n.type==='file') text+=n.content; });
  var lines = text.replace(/\n$/,'').split('\n');
  return {out: lines.sort().join('\n')+'\n'};
};
COMMANDS.uniq = function(a,stdin,ctx){
  var text = stdin||'';
  var lines = text.replace(/\n$/,'').split('\n');
  var out=[], prev=null;
  lines.forEach(function(l){ if(l!==prev) out.push(l); prev=l; });
  return {out: out.join('\n')+'\n'};
};
COMMANDS.rev = function(a,stdin,ctx){
  var text = stdin||'';
  return {out: text.split('\n').map(function(l){ return l.split('').reverse().join(''); }).join('\n')};
};
COMMANDS.less = COMMANDS.more = function(a,stdin,ctx){ return COMMANDS.cat(a,stdin,ctx); };

COMMANDS.whoami = function(){ return {out: settings.user+'\n'}; };
COMMANDS.groups = function(){ return {out: settings.user+' sudo audio video\n'}; };
COMMANDS.id = function(){ return {out:'uid=1000('+settings.user+') gid=1000('+settings.user+') groups=1000('+settings.user+'),27(sudo),29(audio),44(video)\n'}; };
COMMANDS.hostname = function(){ return {out: settings.host+'\n'}; };
COMMANDS.arch = function(){ return {out:'x86_64\n'}; };
COMMANDS.uname = function(a,stdin,ctx){
  if (!a.length) return {out:'Linux\n'};
  if (a.indexOf('-a')>=0) return {out:'Linux '+settings.host+' 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC '+new Date().toString().slice(0,10)+' x86_64 x86_64 x86_64 GNU/Linux\n'};
  if (a.indexOf('-r')>=0) return {out:'6.8.0-45-generic\n'};
  if (a.indexOf('-s')>=0) return {out:'Linux\n'};
  if (a.indexOf('-n')>=0) return {out: settings.host+'\n'};
  if (a.indexOf('-m')>=0) return {out:'x86_64\n'};
  return {out:'Linux\n'};
};
COMMANDS.hostnamectl = function(){
  return {out:'Static hostname: '+settings.host+'\n      Icon name: computer-vm\n        Chassis: vm\n         Boot ID: 1a2b3c4d5e6f47a8b9c0d1e2f3a4b5c6\n    Machine ID: 9f8e7d6c5b4a39281706f5e4d3c2b1a0\n       Virtualization: browser\n Operating System: Nova Linux 1.0 (Webbed)\n       CPE OS Name: cpe:/o:nova:nova_linux:1.0\n            Kernel: Linux 6.8.0-45-generic x86_64\n      Architecture: x86-64\n'};
};
COMMANDS.date = function(){ return {out: dateStr()+'\n'}; };
COMMANDS.uptime = function(){ return {out: uptimeStr()+'\n'}; };

COMMANDS.cal = function(a){
  var d = new Date(), y=d.getFullYear(), m=d.getMonth();
  if (a.length===2){ m=parseInt(a[0],10)-1; y=parseInt(a[1],10); if(isNaN(m)||isNaN(y)) return {err:'cal: bad arguments\n'}; }
  var first = new Date(y,m,1), days = new Date(y,m+1,0).getDate();
  var head = MONF[m]+' '+y;
  var out = [ ' '.repeat(Math.max(0,(20-head.length)/2))+head, 'Su Mo Tu We Th Fr Sa' ];
  var row = ' '.repeat(3*first.getDay());
  for (var day=1; day<=days; day++){
    row += (day===d.getDate()&&m===d.getMonth()&&y===d.getFullYear() ? pad(day) : pad(day)) + ' ';
    if (new Date(y,m,day).getDay()===6){ out.push('  '+row.replace(/\s+$/,'')); row=''; }
  }
  if (row.trim()) out.push('  '+row.replace(/\s+$/,''));
  return {out: out.map(function(l){return l.replace(/\s+$/,'')+'  ';}).join('\n')+'\n'};
};

COMMANDS.env = function(a,stdin,ctx){
  return {out:
    'SHELL=/bin/bash\n'+
    'SESSION_MANAGER=local/'+settings.host+':@/tmp/.ICE-unix/1401\n'+
    'USER='+settings.user+'\n'+
    'PWD='+pathStr(ctx.cwd)+'\n'+
    'HOME='+HOME+'\n'+
    'XDG_SESSION_DESKTOP=gnome\n'+
    'LANG=en_IN.UTF-8\n'+
    'TERM=xterm-256color\n'+
    'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n'};
};
COMMANDS.which = function(a){
  if (!a.length) return {err:'which: missing operand\n'};
  var found = [];
  a.forEach(function(c){
    if (COMMANDS[c]) found.push('/usr/bin/'+c);
  });
  return {out: found.length? found.join('\n')+'\n' : ''};
};
COMMANDS.history = function(a,stdin,ctx){
  return {out: ctx.history.map(function(h,i){ return pad(i+1,3)+'  '+h; }).join('\n')+'\n'};
};

COMMANDS.df = function(a){
  return {out:
'Filesystem      Size  Used Avail Use% Mounted on\n'+
'/dev/sda1        30G   12G   16G  43% /\n'+
'tmpfs           3.9G  1.2M  3.9G   1% /dev/shm\n'+
'/dev/sda2        98G   41G   52G  45% /home\n'+
'tmpfs           786M   96K  786M   1% /run/user/1000\n'};
};
COMMANDS.free = function(a){
  return {out:
'               total        used        free      shared  buff/cache   available\n'+
'Mem:           7.7Gi       3.2Gi       2.1Gi       412Mi       2.4Gi       4.1Gi\n'+
'Swap:          2.0Gi          0B       2.0Gi\n'};
};
COMMANDS.lscpu = function(){
  return {out:
'Architecture:            x86_64\n  CPU op-mode(s):        32-bit, 64-bit\n  Address sizes:         39 bits physical, 48 bits virtual\nCPU(s):                  4\n  Model name:            Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz\n    CPU family:          6\n    Thread(s) per core:  2\n    Core(s) per socket: 2\n    CPU max MHz:         3400.0000\nVirtualization:          VT-x\nCaches (sum of all):     L3: 6 MiB\n'};
};

function sysProcesses(){
  var rows = [];
  rows.push(['root', SYS_PIDS.systemd, 0.1, 0.5, '/sbin/init']);
  rows.push(['root', SYS_PIDS['dbus-daemon'], 0.0, 0.1, '/usr/bin/dbus-daemon --system']);
  rows.push(['root', SYS_PIDS['NetworkManager'], 0.2, 0.6, '/usr/sbin/NetworkManager --no-daemon']);
  rows.push([settings.user, SYS_PIDS['gnome-shell'], 2.4, 3.8, '/usr/bin/gnome-shell']);
  rows.push([settings.user, SYS_PIDS['pulseaudio'], 0.3, 0.4, '/usr/bin/pulseaudio']);
  rows.push(['root', SYS_PIDS['cron'], 0.0, 0.1, '/usr/sbin/cron -f -P']);
  Object.keys(openWindows).forEach(function(appId){
    var w = openWindows[appId];
    if (w && !w.min) rows.push([settings.user, w.pid, (0.4+((w.pid*7)%23)/10).toFixed(1), (1+((w.pid*3)%30)/10).toFixed(1), '/usr/bin/nova-'+appId]);
  });
  return rows;
}
COMMANDS.ps = function(a){
  var rows = sysProcesses();
  var out = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n';
  rows.forEach(function(r){
    out += spad(r[0],8)+' '+spad(r[1],5)+' '+spad(r[2],4)+' '+spad(r[3],4)+' '+spad(20000+r[1]*37,6)+' '+spad(30000+r[1]*11,5)+' ?        Sl   09:12   0:'+pad(r[1]%60)+' '+r[4]+'\n';
  });
  return {out:out};
};
COMMANDS.top = function(){
  var rows = sysProcesses();
  var out = 'top - '+dateStr().slice(11,19)+' up '+(function(){var s=Math.floor((Date.now()-sessionStart.getTime())/1000);return Math.floor(s/60)+' min';})()+',  1 user,  load average: 0.52, 0.48, 0.45\n'+
  'Tasks: 187 total,   1 running, 186 sleeping,   0 stopped,   0 zombie\n'+
  '%Cpu(s):  6.2 us,  1.9 sy,  0.0 ni, 90.4 id,  1.3 wa,  0.2 hi,  0.0 si\n'+
  'MiB Mem :   7862.0 total,   3121.4 free,   2456.1 used,   2284.5 buff/cache\n'+
  'MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4121.9 avail Mem \n\n'+
  '    PID USER      PR  NI    VIRT    RES  %CPU  %MEM     TIME+ COMMAND\n';
  rows.forEach(function(r){
    out += ' '+spad(r[1],5)+' '+spad(r[0],9)+'  20   0 '+spad(200000+r[1]*500,7)+' '+spad(30000+r[1]*100,6)+'  '+r[2]+'  '+r[3]+'   0:'+pad(r[1]%60)+'.'+pad(r[1]%97)+' '+r[4].split('/').pop()+'\n';
  });
  return {out:out};
};

COMMANDS.man = function(a,stdin,ctx){
  if (!a.length) return {err:'What manual page do you want?\nFor example, try \'man man\'.\n'};
  var page = MANPAGES[a[0]];
  if (page) return {out:page+'\n'};
  if (COMMANDS[a[0]]) return {out:'No manual entry for '+a[0]+' (it exists, but its page is not installed in this simulator)\n'};
  return {err:'No manual entry for '+a[0]+'\n'};
};

var TUX_ART = [
'   .--.      ',
'  |o_o |     ',
'  |:_/ |     ',
' //   \\ \\    ',
'/(|     |)\\  ',
"/'\\_   _/`\\  ".replace(/`/g,'\u0060'),
'\\___)=(___/  '
];

COMMANDS.neofetch = function(){
  var info = [
    ['<span class="p-user">'+esc(settings.user)+'@'+esc(settings.host)+'</span>', ''],
    ['-----------------', ''],
    ['<b>OS</b>', 'Nova Linux 1.0 x86_64'],
    ['<b>Host</b>', 'Browser Simulator'],
    ['<b>Kernel</b>', '6.8.0-45-generic'],
    ['<b>Uptime</b>', (function(){var s=Math.floor((Date.now()-sessionStart.getTime())/1000); var m=Math.floor(s/60); if(m<60)return m+' mins'; return Math.floor(m/60)+' hours, '+(m%60)+' mins';})()],
    ['<b>Packages</b>', '1873 (dpkg)'],
    ['<b>Shell</b>', 'bash 5.2.15'],
    ['<b>Terminal</b>', 'nova-term'],
    ['<b>CPU</b>', 'Intel i5-8250U (4) @ 3.40GHz'],
    ['<b>Memory</b>', (function(){var u=(Date.now()/30000)%4000+2500; return (u/1024).toFixed(1)+'GiB / 7.7GiB';})()]
  ];
  var html='';
  var maxInfo = info.length;
  for (var i=0;i<Math.max(TUX_ART.length,maxInfo);i++){
    var left = TUX_ART[i] ? esc(TUX_ART[i]) : ' '.repeat(13);
    var right = info[i] ? (info[i][0]+(info[i][1]?' '+info[i][1]:'')) : '';
    html += left+' '+right+'\n';
  }
  html += '\n';
  var colors = ['#e2695f','#e2a95f','#5ad48b','#5fa7e2','#b48ead','#4fd6a8'];
  html += ' '.repeat(14)+colors.map(function(c){return '<span style="color:'+c+'">███</span>';}).join('')+'\n';
  var plain = html.replace(/<[^>]+>/g,'');
  return {out:plain, html:html};
};

COMMANDS.cowsay = function(a,stdin,ctx){
  var text = a.length ? a.join(' ') : (stdin||'').replace(/\n$/,'');
  if (!text) text = 'moo';
  var lines = text.split('\n');
  var w = 0; lines.forEach(function(l){ w=Math.max(w,l.length); });
  var top = ' '+'_'.repeat(w+2), bot = ' '+'-'.repeat(w+2);
  var body = lines.map(function(l,i){
    var L=i===0?'/':(i===lines.length-1?'\\':'|'), R=i===0?'\\':(i===lines.length-1?'/':'|');
    return L+' '+l+' '.repeat(w-l.length)+' '+R;
  });
  var cow = [
'        \\   ^__^',
'         \\  (oo)\\_______',
'            (__)\\       )\\/\\',
'                ||----w |',
'                ||     ||'
  ];
  return {out: [top].concat(body,[bot],cow).join('\n')+'\n'};
};

COMMANDS.rmdir = function(a,stdin,ctx){
  if (!a.length) return {err:'rmdir: missing operand\n'};
  var err='';
  a.forEach(function(d){
    var parts = resolvePath(d, ctx.cwd);
    var parent = getNode(parentDirOf(parts));
    var name = baseName(parts);
    if (!parent || parent.type!=='dir' || !(name in parent.children)){ err += "rmdir: failed to remove '"+d+"': No such file or directory\n"; return; }
    var node = parent.children[name];
    if (node.type!=='dir'){ err += "rmdir: failed to remove '"+d+"': Not a directory\n"; return; }
    if (Object.keys(node.children).length){ err += "rmdir: failed to remove '"+d+"': Directory not empty\n"; return; }
    delete parent.children[name];
  });
  saveFS(); return {err:err};
};

COMMANDS.ln = function(a,stdin,ctx){
  var sflag = false, args = [];
  a.forEach(function(x){ if (x==='-s'||x==='-sf'){ sflag=true; return; } if (x.charAt(0)==='-') return; args.push(x); });
  if (!sflag) return {err:'ln: hard links are not supported in this simulator - try: ln -s TARGET LINK_NAME\n'};
  var t = args[0], l = args[1];
  if (!t) return {err:'ln: missing file operand\n'};
  if (!l) return {err:'ln: missing destination operand after \''+t+'\'\n'};
  var lParts = resolvePath(l, ctx.cwd);
  var parent = getNode(parentDirOf(lParts));
  var name = baseName(lParts);
  if (!parent || parent.type!=='dir') return {err:"ln: failed to create symbolic link '"+l+"': No such file or directory\n"};
  if (parent.children[name]) return {err:"ln: failed to create symbolic link '"+l+"': File exists\n"};
  parent.children[name] = {type:'link', target:t, mtime:Date.now()};
  saveFS(); return {out:''};
};

COMMANDS.whereis = function(a){
  if (!a.length) return {err:'whereis: too few arguments\n'};
  var out='';
  a.forEach(function(c){
    var line = c+':';
    if (COMMANDS[c]) line += ' /usr/bin/'+c;
    if (COMMANDS[c]||MANPAGES[c]) line += ' /usr/share/man/man1/'+c+'.1.gz';
    out += line+'\n';
  });
  return {out:out};
};

COMMANDS.locate = function(a){
  var pat = a.filter(function(x){ return x.charAt(0)!=='-'; })[0];
  if (!pat) return {err:'locate: no pattern specified\n'};
  var results = [];
  (function walk(parts,node){
    dirEntries(node).forEach(function(name){
      var child = node.children[name];
      var p = parts.concat([name]);
      if (name.toLowerCase().indexOf(pat.toLowerCase())>=0) results.push(pathStr(p));
      if (child.type==='dir') walk(p, child);
    });
  })([], FS);
  return {out: results.sort().join('\n')+(results.length?'\n':'')};
};

COMMANDS.wget = function(a,stdin,ctx){
  var ofile = null, args = [];
  for (var i=0;i<a.length;i++){
    if (a[i]==='-O'||a[i]==='-o'){ ofile=a[i+1]; i++; continue; }
    if (a[i].charAt(0)!=='-') args.push(a[i]);
  }
  var url = args[0];
  if (!url) return {err:'wget: missing URL\nUsage: wget [options] <URL>\n'};
  if (!/^[a-z]+:\/\//i.test(url)) url = 'http://'+url;
  var m = url.match(/^[a-z]+:\/\/([^\/]+)(\/.*)?$/i);
  var host = m?m[1]:'localhost';
  var pathPart = m&&m[2]?m[2]:'/';
  var base = (pathPart.split('?')[0].split('#')[0].split('/').filter(Boolean).pop()) || 'index.html';
  var name = ofile || base;
  var ip = (193+hashStr(host)%60)+'.'+(hashStr(host+'a')%256)+'.'+(hashStr(host+'b')%256)+'.'+(1+hashStr(host+'c')%254);
  var size = 512+hashStr(url)%8192;
  var now = dateStr().slice(0,24);
  var out = '--'+now+'--  '+url+'\n';
  out += 'Resolving '+host+'... '+ip+'\n';
  out += 'Connecting to '+host+'|'+ip+'|:80... connected.\n';
  out += 'HTTP request sent, awaiting response... 200 OK\n';
  out += 'Length: '+size+' [text/plain]\n';
  out += 'Saving to: \''+name+'\'\n\n';
  out += '     [  '+'='.repeat(12)+'  ] '+size+'  --.-K/s   in 0.01s\n\n';
  out += now+' ('+(size/10).toFixed(1)+' KB/s) - \''+name+'\' saved ['+size+']\n';
  var parts = resolvePath(name, ctx.cwd);
  var parent = getNode(parentDirOf(parts));
  if (!parent || parent.type!=='dir') return {out:out, err:'wget: '+name+': Cannot write file (No such directory)\n'};
  parent.children[baseName(parts)] = {type:'file',
    content:'Nova Linux wget - simulated download of '+url+'\nNo real network request was made; this file is a placeholder created by the simulator.\n',
    mtime:Date.now()};
  saveFS();
  return {out:out};
};

COMMANDS.sudo = function(a,stdin,ctx){
  if (a.join(' ').match(/rm\s+-rf\s+\/(\s|$)/)) return {out:'Nice try. This is a simulator — no real files were harmed.\n'};
  return {err:'[sudo] password for '+settings.user+': \nsudo: 1 incorrect password attempt\n'+settings.user+' is not in the sudoers file.  This incident will be reported.\n'};
};
COMMANDS.apt = function(a){
  return {err:'E: Could not get lock /var/lib/dpkg/lock-frontend — this simulator has no network stack.\n'};
};
COMMANDS.ping = function(a){
  return {err:'ping: '+((a.filter(function(x){return x.charAt(0)!=='-';})[0])||'localhost')+': Temporary failure in name resolution\n'};
};
COMMANDS.vim = COMMANDS.nano = COMMANDS.emacs = function(a){
  return {err:(a[0]==='vim'?'vim':'nano')+': no text editor in this simulator — your notes live in the Notes app (run: open notes)\n'};
};

COMMANDS.open = function(a){
  var valid = ['terminal','calendar','clock','notes','settings','files','help','ai'];
  var target = (a[0]||'').toLowerCase();
  if (valid.indexOf(target)<0) return {err:'open: unknown app \''+(a[0]||'')+'\' (try: '+valid.join(', ')+')\n'};
  openApp(target);
  return {out:''};
};
COMMANDS.exit = function(a,stdin,ctx){ ctx.close(); return {out:''}; };
COMMANDS.logout = COMMANDS.exit;
COMMANDS.reboot = function(){ location.reload(); return {out:''}; };
COMMANDS.shutdown = COMMANDS.poweroff = function(){ showHalt(); return {out:''}; };
COMMANDS.clear = function(){ return {out:''}; };

var ALIASES = { ll:'ls -l', la:'ls -a', '..':'cd ..' };
function isExecutableName(n){ return !!COMMANDS[n]; }

/* ---------------- SHELL PARSER / RUNNER ---------------- */
function tokenize(line){
  var out=[], cur='', q=null, hadQuote=false;
  var push=function(){ if(cur!=='' || hadQuote){ out.push(cur); cur=''; hadQuote=false; } };
  for (var i=0;i<line.length;i++){
    var c = line.charAt(i);
    if (q){ if (c===q){ q=null; hadQuote=true; } else cur+=c; continue; }
    if (c==="'"||c==='"'){ q=c; hadQuote=true; continue; }
    if (c==='|'){ push(); out.push('|'); continue; }
    if (c==='>'){ push(); if(line.charAt(i+1)==='>'){ out.push('>>'); i++; } else out.push('>'); continue; }
    if (c===' '||c==='\t'){ push(); continue; }
    cur+=c;
  }
  push(); return out;
}

function runPipeline(tokens, ctx){
  /* split on | */
  var segments=[[]];
  tokens.forEach(function(t){ if(t==='|') segments.push([]); else segments[segments.length-1].push(t); });
  var stdin='', finalOut=null, finalErr='', finalHtml=null;
  for (var si=0; si<segments.length; si++){
    var seg = segments[si].slice();
    /* redirection */
    var redirect=null, append=false;
    var ri = -1;
    for (var j=0;j<seg.length;j++){ if (seg[j]==='>'||seg[j]==='>>'){ ri=j; break; } }
    if (ri>=0){ append = seg[ri]==='>>'; redirect = seg[ri+1]; seg = seg.slice(0,ri); }
    var cmd = seg[0], args = seg.slice(1);
    if (!cmd){ if (si===0) return null; continue; }
    /* alias */
    if (ALIASES[cmd] && segments.length===1){
      var at = tokenize(ALIASES[cmd]);
      if (redirect!==null){ at.push(append?'>>':'>', redirect); }
      return runPipeline(at, ctx);
    }
    var fn = COMMANDS[cmd];
    if (!fn){
      finalOut = null; finalErr = 'bash: '+cmd+': command not found\n'; finalHtml=null; break;
    }
    var res;
    try{ res = fn(args, si===0?null:stdin, ctx); }
    catch(e){ if (e instanceof ShellError) res={err:e.msg}; else { finalErr='bash: internal error in '+cmd+': '+esc(e.message)+'\n'; break; } }
    if (redirect!==null){
      var rParts = resolvePath(redirect, ctx.cwd);
      var parent = getNode(parentDirOf(rParts));
      var rName = baseName(rParts);
      if (!parent || parent.type!=='dir'){ finalErr = "bash: "+redirect+": No such file or directory\n"; break; }
      if (append && parent.children[rName] && parent.children[rName].type==='file'){
        parent.children[rName].content += (res.out||'');
      } else {
        parent.children[rName] = {type:'file', content:(res.out||''), mtime:Date.now()};
      }
      saveFS();
      finalOut=''; finalHtml=''; finalErr=(res.err||'');
      stdin='';
    } else {
      stdin = res.out||'';
      finalOut = stdin; finalErr = res.err||'';
      finalHtml = res.html!==undefined ? res.html : null;
    }
  }
  return {out:finalOut||'', err:finalErr||'', html:finalHtml};
}
