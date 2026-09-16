'use strict';
/* ---- js/apps/07-help.js (load order 07) ---- */
/* ---------- HELP ---------- */
APPS.help = {
  id:'help', name:'Help', icon:ICONS.help, w:780, h:560,
  mount: function(body, win){
    body.innerHTML = '<div class="help-wrap">'+
      '<div class="help-hero"><h2>Nova Linux 1.0 &mdash; Help</h2>'+
      '<p>A small simulated Linux desktop that lives in a single HTML file. Everything runs in your browser; your files and notes persist between sessions.</p></div>'+

      '<div class="help-sec">Desktop basics</div>'+
      '<div class="help-cards">'+
        '<div class="h-card"><b>Open apps</b><span>Use the launcher icons on the left of the bottom bar, the desktop icons, or the Apps button (top left). Or type <code>open files</code> in the terminal. On phones, apps open full-screen.</span></div>'+
        '<div class="h-card"><b>Switch apps</b><span>Open apps appear on the right side of the bottom bar. Click a task to focus it; click again to minimise it. On phones, tap the app icon in the bottom bar.</span></div>'+
        '<div class="h-card"><b>Move windows</b><span>Drag any window by its title bar. Click a window to bring it to the front.</span></div>'+
        '<div class="h-card"><b>Resize windows</b><span>Drag the striped grip in the bottom-right corner of any window.</span></div>'+
        '<div class="h-card"><b>Minimise / close</b><span>The amber dot minimises to the bottom bar; the red dot closes the window.</span></div>'+
        '<div class="h-card"><b>Quick settings</b><span>The battery icon (top right) opens quick settings: volume, brightness, Wi-Fi, Bluetooth, power mode, airplane mode and power.</span></div>'+
        '<div class="h-card"><b>Calendar events</b><span>Click a day in the Calendar app, type in the box and press Add. Days with events show a blue dot.</span></div>'+
      '</div>'+

      '<div class="help-sec">Terminal &mdash; commands</div>'+
      '<table class="help-tbl"><tr><th>Command</th><th>What it does</th></tr>'+
        '<tr><td>ls, ls -l, ls -a</td><td>List files (long format / including hidden)</td></tr>'+
        '<tr><td>cd, pwd</td><td>Change directory, print working directory</td></tr>'+
        '<tr><td>cat, head, tail, wc</td><td>Show files, first/last lines, count lines/words</td></tr>'+
        '<tr><td>grep [-inv]</td><td>Search text; combine with pipes</td></tr>'+
        '<tr><td>mkdir, touch, cp, mv, rm -r</td><td>Create, copy, move and delete files & folders</td></tr>'+
        '<tr><td>echo text > file</td><td>Write to a file (use >> to append)</td></tr>'+
        '<tr><td>find . -name "*.py"</td><td>Search the filesystem by name</td></tr>'+
        '<tr><td>tree</td><td>Show a directory as a tree</td></tr>'+
        '<tr><td>ps, top, df -h, free -h</td><td>Processes, disk space and memory (simulated, but realistic output)</td></tr>'+
        '<tr><td>uname -a, uptime, date, cal</td><td>System information, time and calendar</td></tr>'+
        '<tr><td>man <command></td><td>Short manual pages</td></tr>'+
        '<tr><td>neofetch, cowsay</td><td>System banner with Tux, and a talking cow</td></tr>'+
        '<tr><td>ln -s target link</td><td>Create a symbolic link (shortcut) to a file or folder</td></tr>'+
        '<tr><td>rmdir, locate, whereis</td><td>Remove empty dirs; fast filename search; find a command\'s binary and man page</td></tr>'+
        '<tr><td>wget [-O name] URL</td><td>Simulated download - creates the file locally</td></tr>'+
        '<tr><td>open <app></td><td>Open files, help, ai, calendar, clock, notes, settings or terminal</td></tr>'+
        '<tr><td>history, clear, exit</td><td>Command history, clear the screen, close the terminal</td></tr>'+
      '</table>'+

      '<div class="help-sec">Keyboard shortcuts</div>'+
      '<table class="help-tbl"><tr><th>Keys</th><th>Action</th></tr>'+
        '<tr><td>Tab</td><td>Complete commands and file paths</td></tr>'+
        '<tr><td>Up / Down arrows</td><td>Walk through command history</td></tr>'+
        '<tr><td>Ctrl+L</td><td>Clear the terminal</td></tr>'+
        '<tr><td>Ctrl+C</td><td>Cancel the current line</td></tr>'+
        '<tr><td>Esc</td><td>Close the Apps overview</td></tr>'+
      '</table>'+

      '<div class="help-sec">Tips</div>'+
      '<div class="h-tip">Pipes connect commands: <code>ls /etc | grep conf | wc -l</code></div>'+
      '<div class="h-tip">Files you create survive a reboot (stored in your browser). The <b>Files</b> app browses the same filesystem as the terminal.</div>'+
      '<div class="h-tip">Settings &rarr; Reset restores default settings and puts every open window back in its default spot.</div>'+
      '<div class="h-tip"><b>Nova AI</b> (the sparkle icon) answers questions about any Linux command - "what does chmod do", "how do I find a file". It runs fully offline.</div>'+
    '</div>';
  }
};
