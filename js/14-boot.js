'use strict';
/* ---- js/14-boot.js (load order 14) ---- */
/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
var BOOT_LINES = [
  ['dim','GNU GRUB  version 2.12'],
  ['dim','Loading Nova Linux 1.0 ...'],
  ['','[    0.000000] Linux version 6.8.0-45-generic (nova@build) (gcc 13.2.0)'],
  ['','[    0.083114] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 quiet splash'],
  ['','[    0.214500] Memory: 7862MB available'],
  ['','[    0.398221] Initializing cgroup subsys cpuset'],
  ['','[    0.612410] ACPI: Core revision 20240322'],
  ['','[    0.881340] smpboot: CPU0: Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz'],
  ['','[    1.091772] smpboot: x86: Booted up 4 cores, 8 threads'],
  ['','[    1.384509] usb 1-4: new high-speed USB device number 3 using xhci_hcd'],
  ['','[    1.602311] nvme nvme0: 512 GB, PCIe 3.0 x4'],
  ['','[    1.877954] EXT4-fs (sda1): mounted filesystem with ordered data mode'],
  ['ok','[  OK  ] Started Journal Service.'],
  ['ok','[  OK  ] Started Network Manager.'],
  ['ok','[  OK  ] Reached target Sound Card.'],
  ['ok','[  OK  ] Started Nova Display Manager.'],
  ['ok','[  OK  ] Reached target Graphical Interface.'],
  ['dim',''],
  ['dim','nova login: tux (automatic login)']
];
function boot(){
  var box = $('#boot-lines'), bar = $('#boot-bar i');
  var i = 0;
  function next(){
    if (i>=BOOT_LINES.length){
      bar.style.width='100%';
      setTimeout(function(){
        $('#boot').classList.add('done');
        setTimeout(function(){ $('#boot').remove(); }, 700);
        openApp('terminal');
      }, 350);
      return;
    }
    var line = BOOT_LINES[i];
    var div = document.createElement('div');
    if (line[0]) div.className = line[0];
    div.textContent = line[1];
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    bar.style.width = Math.round((i+1)/BOOT_LINES.length*100)+'%';
    i++;
    setTimeout(next, line[1].indexOf('[  OK  ]')>=0||line[1]==='' ? 90 : 55+Math.random()*70);
  }
  next();
}
applySettings();
tickTopbar();
boot();
