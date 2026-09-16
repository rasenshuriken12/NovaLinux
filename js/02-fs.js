'use strict';
/* ---- js/02-fs.js (load order 02) ---- */
/* ============================================================
   VIRTUAL FILE SYSTEM
   ============================================================ */
var HOME = '/home/tux';
function defaultFS(){
  function dir(children){ return {type:'dir', children:children||{}, mtime:Date.now()}; }
  function file(content){ return {type:'file', content:content, mtime:Date.now()}; }
  return dir({
    bin: dir(['bash','ls','cat','grep','echo','mkdir','rm','cp','mv','ps','top','df','free','date','cal','man','nano','vim','sudo','find','tree','wc','head','tail','sort','uniq','whoami','uname','hostname','neofetch','cowsay','open','stat','env','id','which','arch','lscpu','history','uptime','pwd','cd','exit','clear','help','reboot','shutdown','ping','apt','rmdir','ln','whereis','locate','wget','nova-ai'].map(function(n){ return [n, file('')]; }).reduce(function(o,p){o[p[0]]=p[1];return o;},{})),
    etc: dir({
      'os-release': file('NAME="Nova Linux"\nVERSION="1.0 (Webbed)"\nID=nova\nPRETTY_NAME="Nova Linux 1.0 (Webbed)"\nHOME_URL="https://nova.example"\n'),
      'hostname': file('nova\n'),
      'fstab': file('# <device>  <mount>  <type>  <options>  <dump>  <pass>\n/dev/sda1  /        ext4    defaults   0  1\n/dev/sda2  /home    ext4    defaults   0  2\ntmpfs     /dev/shm tmpfs   defaults   0  0\n'),
      'passwd': file('root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\ntux:x:1000:1000:Tux Penguin:/home/tux:/bin/bash\n')
    }),
    home: dir({
      tux: dir({
        'welcome.txt': file('Welcome to Nova Linux!\n\nThis whole computer is simulated inside a single HTML file,\nbut the terminal behaves like a real Linux shell.\n\nThings to try:\n  ls -l          list files the long way\n  cat /etc/os-release\n  cd projects && tree\n  grep -n kernel notes/kernel-diary.txt\n  man ls         short manual pages\n  neofetch       system info with Tux\n  cowsay hello\n\nYour files persist between sessions (localStorage).\n'),
        'todo.txt': file('[ ] practice ls, cd, pwd\n[ ] read /etc/os-release with cat\n[ ] create a directory and remove it\n[ ] run neofetch\n[x] boot the machine\n'),
        Documents: dir({'goals.txt': file('1. Get comfortable with the terminal\n2. Learn pipes: ls | wc -l\n3. Read logs in /var/log\n')}),
        Downloads: dir(),
        'notes-diary.md': file('# Diary\n\n- The shell is just a program that reads lines and runs programs.\n- Everything is a file.\n- Pipes connect programs: cat file | grep word | wc -l\n'),
        projects: dir({
          'hello.py': file('def main():\n    print("Hello from Nova Linux!")\n\nif __name__ == "__main__":\n    main()\n'),
          'server.js': file('const http = require("http");\n\nhttp.createServer((req, res) => {\n  res.writeHead(200, {"Content-Type": "text/plain"});\n  res.end("nova server running\\n");\n}).listen(8080);\n'),
          README: file('A place to experiment.\nTry: cat hello.py | grep print\n')
        })
      })
    }),
    var: dir({
      log: dir({
        'syslog': file('Sep 16 09:12:01 nova systemd[1]: Started Daily apt download activities.\nSep 16 09:12:02 nova kernel: [    0.000000] Linux version 6.8.0-45-generic\nSep 16 09:12:04 nova NetworkManager[812]: <info>  manager: NetworkManager state is now CONNECTED_GLOBAL\nSep 16 09:13:11 nova gnome-shell[1401]: Window manager warning: last_focus_time is greater than comparison timestamp\nSep 16 09:14:02 nova CRON[3521]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)\nSep 16 10:02:41 nova kernel: [ 3012.556] usb 1-4: new high-speed USB device number 3 using xhci_hcd\n'),
        'boot.log': file('Loading Nova Linux 1.0 ...\n[ OK ] Started Session 1 of user tux.\n[ OK ] Reached target Graphical Interface.\n')
      })
    }),
    usr: dir({ share: dir({ doc: dir({ 'COPYING': file('Nova Linux Simulator — free to practice on.\n') }) }) }),
    opt: dir(),
    tmp: dir()
  });
}
var FS = lsGet('nova-fs', null) || defaultFS();
function saveFS(){ lsSet('nova-fs', FS); }

function resolvePath(input, cwd){
  var p = input ? String(input) : '';
  p = p.replace(/^~(?=$|\/)/, HOME);
  var parts = p.length && p.charAt(0)==='/' ? [] : cwd.slice();
  var segs = p.split('/');
  for (var i=0;i<segs.length;i++){
    var s = segs[i];
    if (s===''||s==='.') continue;
    if (s==='..'){ parts.pop(); continue; }
    parts.push(s);
  }
  return parts;
}
function getNode(parts, depth){
  depth = depth||0;
  var node = FS, path = parts.slice(), i = 0;
  while (i < path.length){
    if (!node || node.type!=='dir' || !(path[i] in node.children)) return null;
    node = node.children[path[i]];
    if (node.type==='link'){
      if (depth>8) return null;
      var base = path.slice(0,i);
      var rest = path.slice(i+1);
      path = resolvePath(node.target, base).concat(rest);
      node = FS; i = 0; depth++;
      continue;
    }
    i++;
  }
  return node;
}
function pathStr(parts){ return '/' + parts.join('/'); }
function parentDirOf(parts){ return parts.slice(0, parts.length-1); }
function baseName(parts){ return parts.length ? parts[parts.length-1] : '/'; }
function dirEntries(node){ return Object.keys(node.children).sort(function(a,b){ return a.localeCompare(b); }); }
function isExec(name){ return name.indexOf('.')<0 || /\.sh$|\.py$|\.js$/.test(name); }
