'use strict';
/* ---- js/apps/08-nova-ai.js (load order 08) ---- */
/* ---------- NOVA AI (offline command-explainer assistant) ---------- */
var CMD_KB = {
  ls:['List files and folders in a directory','ls [-l] [-a] [path]',['ls -l','ls -la /etc'],'cd find','-l shows the long format with permissions, size and date; -a reveals hidden dot-files.'],
  cd:['Change the current working directory','cd [dir]',['cd /etc','cd ..','cd'],'pwd ls','cd with no argument takes you home. cd .. moves up one level; cd - goes to the previous directory.'],
  pwd:['Print the full path of the directory you are currently in','pwd',['pwd'],'cd ls','Takes no options — it simply answers "where am I?".'],
  cat:['Print the contents of a file','cat [file ...]',['cat /etc/os-release'],'less head tail','Often combined with pipes: cat file | grep word. Also joins several files together.'],
  echo:['Print text, or write it into a file','echo text > file',['echo hello','echo "line" >> notes.txt'],'cat','The > operator writes to a file (overwriting it); >> appends instead.'],
  touch:['Create an empty file, or update a file timestamp','touch file',['touch newfile.txt'],'mkdir rm','If the file exists nothing is lost — only its modification time changes.'],
  mkdir:['Create a directory','mkdir [-p] dir',['mkdir projects','mkdir -p a/b/c'],'rmdir rm','Use -p to create nested directories in one go; it also silences "already exists".'],
  rmdir:['Remove an empty directory','rmdir dir',['rmdir emptydir'],'rm mkdir','Safer than rm -r: it refuses to delete a directory that still contains anything.'],
  rm:['Remove files or directories','rm [-r] [-f] target',['rm old.txt','rm -r olddir'],'rmdir cp','-r is required for directories. There is no trash can — deleted files do not come back.'],
  cp:['Copy files or directories','cp [-r] source target',['cp notes.txt backup.txt','cp -r dir1 dir2'],'mv ln','-r copies whole directory trees. If the target is an existing directory, the copy lands inside it.'],
  mv:['Move or rename a file','mv source target',['mv draft.txt final.txt'],'cp rm','The same command renames (when the target is a new name) and moves (when the target is a directory).'],
  ln:['Make a link to a file','ln -s TARGET LINK_NAME',['ln -s /etc/os-release rel'],'cp','ln -s creates a symbolic link (a shortcut). cat, ls and cd all follow it.'],
  head:['Show the first lines of a file','head [-n N] [file]',['head -n 5 /var/log/syslog'],'tail cat','Defaults to 10 lines; use -n to change the count.'],
  tail:['Show the last lines of a file','tail [-n N] [file]',['tail -n 3 syslog'],'head cat','On a real system tail -f follows a growing log file live.'],
  wc:['Count lines, words and characters','wc [file]',['wc -l todo.txt'],'grep sort','-l counts lines only, -w words, -c bytes. Great at the end of a pipe.'],
  grep:['Search text for lines matching a pattern','grep [-i] [-n] [-v] pattern [file]',['grep -n kernel syslog','ls /etc | grep conf'],'find locate sed','-i ignores case, -n shows line numbers, -v inverts the match, -c counts matches.'],
  find:['Search the filesystem by name','find [path] -name pattern',['find . -name "*.py"'],'locate grep','Walks directories in real time. Quote wildcards so the shell does not eat them.'],
  locate:['Find files by name using a database','locate pattern',['locate passwd'],'find whereis','Much faster than find because it looks in a pre-built index (updated by updatedb on real systems).'],
  whereis:['Locate a command binary and its manual page','whereis command',['whereis ls'],'which man','Prints the paths of the executable and documentation for a command.'],
  which:['Show which program a command runs','which command',['which grep'],'whereis type','Prints the full path of the executable the shell would run.'],
  tree:['Show a directory as an indented tree','tree [path]',['tree projects'],'ls find','Directories first, with box-drawing lines. A quick way to see structure.'],
  stat:['Display detailed information about a file','stat file',['stat /etc/os-release'],'ls file','Shows size, permissions, inode and modification times in one block.'],
  sort:['Sort lines of text','sort [file]',['sort words.txt | uniq'],'uniq wc','Usually fed by a pipe and followed by uniq to remove duplicates.'],
  uniq:['Remove or report duplicate adjacent lines','uniq [file]',['sort list | uniq'],'sort wc','Only collapses duplicates that are next to each other — sort first.'],
  diff:['Compare two files line by line','diff file1 file2',['diff old.txt new.txt'],'sort','Shows what changed between two versions of a text file.'],
  sed:['Stream editor for find-and-replace','sed s/old/new/g file',['sed s/cat/dog/g story.txt'],'grep awk','Replaces text as it flows through. s/old/new/g replaces every occurrence on a line.'],
  awk:['Pattern scanning and processing language','awk \'{print $1}\' file',['awk \'{print $2}\' data.txt'],'grep sed','Prints columns: $1 is the first field, $2 the second, $0 the whole line.'],
  cut:['Extract columns or characters from text','cut -d, -f2 file',['cut -d, -f1 data.csv'],'awk tr','-d sets the delimiter (like a comma) and -f picks the field number.'],
  nano:['Small friendly terminal text editor','nano file',['nano todo.txt'],'vim cat','Not included in this simulator — use the Notes app instead (open notes).'],
  vim:['Powerful modal text editor','vim file',['vim main.py'],'nano cat','Not included in this simulator — use the Notes app instead (open notes).'],
  less:['View a file one screen at a time','less file',['less /var/log/syslog'],'cat head','Scrolls with arrows, q quits. Not needed here: the terminal scrolls by itself.'],
  chmod:['Change file permissions','chmod mode file',['chmod +x script.sh','chmod 644 notes.txt'],'ls stat','+x makes a file executable. Numbers like 644 set read/write permissions for owner, group and others.'],
  chown:['Change file ownership','chown user:group file',['chown tux file.txt'],'chmod ls','Needs sudo on real systems — files belong to their creator by default.'],
  ps:['Snapshot of running processes','ps aux',['ps aux | grep bash'],'top kill','aux shows every process for every user. Pipe through grep to find one.'],
  top:['Live view of processes and resource usage','top',['top'],'ps free','Updates continuously on a real system; here it prints one snapshot. Press q to quit there.'],
  kill:['Send a signal to a process, usually to stop it','kill [-9] PID',['kill 3580','kill -9 3580'],'ps top','Find the PID with ps or top. -9 is the force-kill — try a normal kill first.'],
  df:['Report free disk space per filesystem','df -h',['df -h'],'du free','-h prints human-readable sizes (G, M). Watch the Use% column.'],
  du:['Estimate the size of directories','du -sh dir',['du -sh ~'],'df ls','-s gives just the total, -h makes it readable. Answers "what is eating my disk?".'],
  free:['Show memory and swap usage','free -h',['free -h'],'df top','buff/cache counts as available memory on Linux — that is normal, not a leak.'],
  uname:['Print system information','uname [-a]',['uname -a'],'hostnamectl lscpu','-a gives kernel name, hostname, kernel version and architecture.'],
  uptime:['How long the system has been running, with load','uptime',['uptime'],'top free','The three load averages tell you how busy the CPU was over 1, 5 and 15 minutes.'],
  date:['Print or set the system date and time','date',['date','date +%Y-%m-%d'],'cal uptime','Supports format codes like %H (hour) and %Y (year). Try: date +%F.'],
  cal:['Show a calendar in the terminal','cal [[month] year]',['cal','cal 12 2026'],'date','With no arguments it prints the current month.'],
  whoami:['Print the current username','whoami',['whoami'],'id hostname','Equivalent to id -un. Useful in scripts and prompts.'],
  id:['Print user and group IDs','id',['id'],'whoami su','Shows your uid, gid and every group you belong to.'],
  env:['Print environment variables','env',['env | grep PATH'],'export echo','PATH decides where the shell looks for commands. PWD is the current directory.'],
  export:['Set an environment variable for new programs','export VAR=value',['export EDITOR=nano'],'env echo','Children of the shell inherit it. env lists what is currently set.'],
  alias:['Create a shortcut for a command','alias ll="ls -l"',['alias ll="ls -l"'],'unalias history','This simulator has ll (ls -l) and la (ls -a) built in.'],
  history:['List previously typed commands','history',['history | tail -5'],'clear','Up/Down arrows also walk through history; Ctrl+R searches it on real shells.'],
  man:['Read the manual page of a command','man command',['man ls','man grep'],'help whereis','q quits on real systems. This simulator ships short pages for common commands.'],
  clear:['Clear the terminal screen','clear',['clear'],'history exit','Ctrl+L does the same thing here.'],
  ssh:['Log in to a remote machine','ssh user@host',['ssh tux@10.0.0.5'],'scp wget','Runs a shell on another computer over an encrypted connection. No network in this simulator.'],
  scp:['Copy files to or from a remote machine','scp file user@host:/path',['scp data.txt tux@server:/tmp'],'ssh wget','Works like cp but across machines via ssh.'],
  ping:['Check whether a host is reachable','ping host',['ping example.com'],'ssh wget','Sends echo packets and measures latency. Blocked here — the simulator has no network.'],
  wget:['Download a file from the web','wget [-O name] URL',['wget https://example.com/data.txt'],'curl scp','In this simulator the download is faked and a placeholder file is created.'],
  curl:['Transfer data from a URL','curl URL',['curl example.com'],'wget ping','Like wget but also speaks POST, headers and many protocols. Not implemented here.'],
  ip:['Show or configure network interfaces','ip a',['ip a','ip route'],'ping ssh','ip a lists addresses (the modern ifconfig).'],
  apt:['Install, remove and update packages (Debian/Ubuntu)','apt install pkg',['apt update','apt install tree'],'sudo yum','Needs sudo and internet. Disabled in this simulator.'],
  systemctl:['Control system services (systemd)','systemctl status svc',['systemctl status ssh'],'service ps','start, stop, restart, enable and disable services.'],
  crontab:['Schedule commands to run automatically','crontab -e',['crontab -l'],'date','Entries run minute hour day month weekday. -e edits, -l lists.'],
  sudo:['Run a command as another user, usually root','sudo command',['sudo apt update'],'su chmod','Asks for your password, then runs with elevated rights. This simulator reports you instead.'],
  su:['Switch to another user','su [user]',['su root'],'sudo id','Without a name it targets root. sudo is preferred for single commands.'],
  tar:['Bundle (archive) files','tar -cvf out.tar dir / tar -xvf in.tar',['tar -cvf backup.tar projects','tar -xvf backup.tar'],'gzip zip','c creates, x extracts, v is verbose, f names the file. Add z for .tar.gz.'],
  gzip:['Compress a file','gzip file',['gzip big.log'],'gunzip tar','Replaces the file with a .gz version. gunzip (or gzip -d) reverses it.'],
  zip:['Create a zip archive','zip out.zip files',['zip backup.zip notes/'],'unzip tar','unzip extracts; unzip -l lists the contents first.'],
  neofetch:['Pretty system information with a logo','neofetch',['neofetch'],'uname lscpu','Shows OS, kernel, uptime, CPU and memory beside an ASCII mascot.'],
  open:['Open an app in this simulator','open app',['open files','open ai','open settings'],'help','Valid apps: terminal, files, calendar, clock, notes, ai, help, settings.']
};

var AI_INTENTS = [
  {keys:['search for','find a file','find files','find all','look for','locate a file','search file'], title:'Searching for files', cmds:['find','locate','grep'], note:'find walks the filesystem by name, locate checks a pre-built index, and grep searches inside file contents.'},
  {keys:['delete','remove','erase','get rid of'], title:'Deleting things', cmds:['rm','rmdir'], note:'rm removes files (add -r for folders). rmdir only removes empty folders — the safer choice.'},
  {keys:['copy','duplicate'], title:'Copying', cmds:['cp','ln'], note:'cp makes a copy (add -r for folders); ln -s creates a shortcut instead of a second copy.'},
  {keys:['move','rename'], title:'Moving and renaming', cmds:['mv'], note:'mv does both jobs: same directory plus new name = rename; different directory = move.'},
  {keys:['permission','permissions','executable','make it run','chmod'], title:'Permissions', cmds:['chmod','stat'], note:'chmod +x makes a script runnable; stat shows the current permission bits.'},
  {keys:['process','kill','running program','background','frozen','hang'], title:'Processes', cmds:['ps','top','kill'], note:'See what is running with ps aux or top, then end a process with kill PID (kill -9 only as a last resort).'},
  {keys:['disk','space','storage','full'], title:'Disk space', cmds:['df','du'], note:'df -h shows per-filesystem free space; du -sh dir finds which folder is big.'},
  {keys:['memory','ram','swap'], title:'Memory', cmds:['free','top'], note:'free -h shows RAM and swap. Remember: buff/cache memory is effectively free.'},
  {keys:['network','internet','download','remote','server'], title:'Networking', cmds:['ping','wget','ssh'], note:'ping tests reachability, wget downloads files, ssh opens a shell on a remote machine. This simulator has no real network — wget is faked.'},
  {keys:['install','package','software'], title:'Installing software', cmds:['apt'], note:'apt update refreshes the package list; apt install adds software. Disabled in this simulator (no network).'},
  {keys:['compress','archive','extract','unzip','tar'], title:'Archives', cmds:['tar','gzip','zip'], note:'tar bundles many files into one (add z to also gzip it); unzip extracts .zip archives.'},
  {keys:['edit','editor','write a file','modify a file'], title:'Editing files', cmds:['nano','vim'], note:'Real systems use nano or vim. In this simulator, write in the Notes app (open notes) or use echo text > file.'},
  {keys:['read','view','open a file','see what'], title:'Reading files', cmds:['cat','less','head','tail'], note:'cat prints everything, head/tail show just the ends, less pages through long files.'},
  {keys:['shutdown','restart','reboot','turn off','power'], title:'Power', cmds:['shutdown','reboot'], note:'shutdown now halts, reboot restarts. Both work in this simulator.'},
  {keys:['where am i','current directory','working directory','current folder'], title:'Where am I', cmds:['pwd'], note:'pwd prints the current directory; the prompt shows a short version (~ means home).'},
  {keys:['who am i','which user','current user'], title:'Who am I', cmds:['whoami','id'], note:'whoami prints your username; id adds your user and group numbers.'}
];

var AI_GREET = ['hi','hello','hey','namaste','good morning','good evening','hola'];
var AI_META = ['what can you do','who are you','help me','what do you do','how do you work'];

function aiCmdCard(k){
  var e = CMD_KB[k]; if (!e) return '';
  var ex = e[2].map(function(x){ return '<span class="ai-chip" data-q="'+esc(x)+'">'+esc(x)+'</span>'; }).join(' ');
  var rel = e[3]? e[3].split(' ').filter(Boolean).map(function(r){ return '<span class="ai-chip" data-q="'+esc(r)+'">'+esc(r)+'</span>'; }).join(' ') : '';
  return '<div class="ai-card"><div class="ai-cmd">'+esc(k)+'</div>'+
    '<div class="ai-purpose">'+esc(e[0])+'</div>'+
    '<div class="ai-syntax">'+esc(e[1])+'</div>'+
    (ex?'<div class="ai-ex">'+ex+'</div>':'')+
    (rel?'<div class="ai-rel">related '+rel+'</div>':'')+
    '<div class="ai-detail">'+esc(e[4])+'</div></div>';
}
function aiAnswer(q){
  var lower = ' '+q.toLowerCase().replace(/[.,!?;:]/g,' ')+' ';
  if (AI_GREET.some(function(g){ return lower.indexOf(' '+g)>=0; })){
    return 'Hi! I am <b>Nova AI</b> - a small offline assistant that only does one thing: <b>explain Linux commands</b>.<br><br>Ask me things like <span class="ai-chip" data-q="what does grep do">what does grep do</span> or <span class="ai-chip" data-q="how do I find a file">how do I find a file</span>.';
  }
  if (AI_META.some(function(g){ return lower.indexOf(g)>=0; })){
    return 'I explain what Linux commands do and which one to use for a task. I run completely offline - no data leaves this page. Try: <span class="ai-chip" data-q="chmod">chmod</span> <span class="ai-chip" data-q="tar">tar</span> <span class="ai-chip" data-q="explain the find command">explain the find command</span>';
  }
  var found = Object.keys(CMD_KB).filter(function(k){
    var re = new RegExp('(^|[^a-z0-9])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z0-9]|$)','i');
    return re.test(lower);
  }).sort(function(a,b){ return b.length-a.length; });
  if (found.length){
    var html = found.slice(0,3).map(aiCmdCard).join('');
    if (found.length>3) html += '<div class="ai-more">Also related: '+found.slice(3,8).join(', ')+'</div>';
    return html;
  }
  for (var i=0;i<AI_INTENTS.length;i++){
    var it = AI_INTENTS[i];
    for (var j=0;j<it.keys.length;j++){
      if (lower.indexOf(it.keys[j])>=0){
        return '<div class="ai-intent-title">'+esc(it.title)+'</div><div class="ai-note">'+esc(it.note)+'</div>'+it.cmds.map(aiCmdCard).join('');
      }
    }
  }
  return 'I only answer questions about Linux commands - what they do and which one to use for a job. Try asking about one of these:<br><br>'+
    ['ls','grep','find','chmod','tar','ssh','wget','ps'].map(function(k){ return '<span class="ai-chip" data-q="'+k+'">'+k+'</span>'; }).join(' ');
}
var aiChat = lsGet('nova-ai-chat', []) || [];
function saveAi(){ lsSet('nova-ai-chat', aiChat.slice(-80)); }

APPS.ai = {
  id:'ai', name:'Nova AI', icon:ICONS.ai, w:660, h:580,
  mount: function(body, win){
    if (!aiChat.length){
      aiChat.push({who:'bot', html:'<b>Nova AI</b> - offline assistant for Linux commands.<br>Ask "what does X do" or "how do I Y" and I will explain the right command.'});
      saveAi();
    }
    function render(){
      body.innerHTML =
        '<div class="ai-wrap">'+
          '<div class="ai-head">'+
            '<span class="ai-badge">'+ICONS.ai+'</span>'+
            '<div><div class="ai-name">Nova AI</div><div class="ai-sub">explains Linux commands - runs fully offline</div></div>'+
            '<button class="btn" id="ai-clear" style="margin-left:auto;padding:5px 10px">Clear</button>'+
          '</div>'+
          '<div class="ai-body" id="ai-body">'+
            aiChat.map(function(m){
              if (m.who==='user') return '<div class="ai-msg user"><div class="ai-bubble">'+esc(m.text)+'</div></div>';
              return '<div class="ai-msg bot"><div class="ai-bubble">'+m.html+'</div></div>';
            }).join('')+
          '</div>'+
          '<div class="ai-inputbar">'+
            '<input id="ai-input" class="set-input" style="flex:1;width:auto" placeholder="Ask about any Linux command..." autocomplete="off">'+
            '<button class="btn primary" id="ai-send">Ask</button>'+
          '</div>'+
        '</div>';
      body.querySelector('#ai-body').addEventListener('click', function(e){
        var chip = e.target.closest('.ai-chip');
        if (chip && chip.getAttribute('data-q')) ask(chip.getAttribute('data-q'));
      });
      body.querySelector('#ai-clear').addEventListener('click', function(){
        aiChat = [{who:'bot', html:'<b>Nova AI</b> - offline assistant for Linux commands.<br>Ask "what does X do" or "how do I Y" and I will explain the right command.'}];
        saveAi(); render();
      });
      body.querySelector('#ai-send').addEventListener('click', function(){
        var v = body.querySelector('#ai-input').value.trim();
        if (v) ask(v);
      });
      var inp = body.querySelector('#ai-input');
      inp.addEventListener('keydown', function(e){
        if (e.key==='Enter'){ e.preventDefault(); var v = inp.value.trim(); if (v) ask(v); }
      });
      var b = body.querySelector('#ai-body');
      b.scrollTop = b.scrollHeight;
      inp.focus();
    }
    function ask(text){
      aiChat.push({who:'user', text:text});
      saveAi(); render();
      var bodyEl = body.querySelector('#ai-body');
      var t = document.createElement('div');
      t.className = 'ai-msg bot';
      t.innerHTML = '<div class="ai-bubble ai-typing"><i></i><i></i><i></i></div>';
      bodyEl.appendChild(t);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      setTimeout(function(){
        aiChat.push({who:'bot', html: aiAnswer(text)});
        saveAi(); render();
      }, 480+Math.floor(Math.random()*420));
    }
    render();
  }
};
