'use strict';
/* ---- js/01-core.js (load order 01) ---- */
/* ============================================================
   Nova Linux 1.0 — a simulated desktop in a single file
   ============================================================ */
var $ = function(s){ return document.querySelector(s); };
var esc = function(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&'+'amp;','<':'&'+'lt;','>':'&'+'gt;'}[c];}); };

function lsGet(k,d){ try{ var v=localStorage.getItem(k); return v===null?d:JSON.parse(v);}catch(e){ return d; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* ---------------- SETTINGS ---------------- */
var DEFAULT_SETTINGS = { user:'tux', host:'nova', theme:'dark', accent:'teal', wallpaper:'aurora', clock24:true };
function defaultSettings(){ return JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); }
var settings = (function(){ var s = lsGet('nova-settings', null); return s ? JSON.parse(JSON.stringify(s)) : defaultSettings(); })();
var ACCENTS = {
  teal:  {base:'#0d9488', bright:'#2dd4bf', dim:'rgba(13,148,136,.18)'},
  amber: {base:'#d97706', bright:'#f5b544', dim:'rgba(217,119,6,.2)'},
  rose:  {base:'#be123c', bright:'#f2758c', dim:'rgba(190,18,60,.16)'},
  sage:  {base:'#4d7c0f', bright:'#a3c64f', dim:'rgba(77,124,15,.18)'}
};
function applySettings(){
  document.documentElement.setAttribute('data-theme', settings.theme);
  var a = ACCENTS[settings.accent] || ACCENTS.teal;
  document.documentElement.style.setProperty('--accent', a.base);
  document.documentElement.style.setProperty('--accent-bright', a.bright);
  document.documentElement.style.setProperty('--accent-dim', a.dim);
  var desk = $('#desktop');
  desk.className = 'wp-'+settings.wallpaper;
  tickTopbar();
}

/* ---------------- ICONS ---------------- */
var ICONS = {
  terminal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.5" width="20" height="17" rx="2.5"/><polyline points="6.5 9 9.5 12 6.5 15"/><line x1="12.5" y1="15.5" x2="17.5" y2="15.5"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><line x1="3" y1="9.5" x2="21" y2="9.5"/><line x1="8" y1="2.5" x2="8" y2="6.5"/><line x1="16" y1="2.5" x2="16" y2="6.5"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 6.5 12 12 15.8 14.2"/></svg>',
  notes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h11l3.5 3.5v13.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z"/><path d="M15.5 3.5V7.5h4"/><line x1="8" y1="11" x2="15" y2="11"/><line x1="8" y1="14.5" x2="15" y2="14.5"/><line x1="8" y1="18" x2="12.5" y2="18"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="2.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="7.5" cy="17" r="2.2" fill="currentColor" stroke="none"/></svg>',
  folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5a2 2 0 0 1 2-2h4.2l2 2.5H19a2 2 0 0 1 2 2V17.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h11l3.5 3.5v13a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19.8V5A1.5 1.5 0 0 1 5 3.5z"/><path d="M15.5 3.5V7.5h4"/><line x1="8" y1="13" x2="15" y2="13"/></svg>',
  help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 1 1 4.1 2.9c-.9.5-1.3 1-1.3 2"/><line x1="12" y1="17" x2="12" y2="17.01"/></svg>',
  ai:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M5 15l.6 1.7 1.7.6-1.7.6L5 19.6l-.6-1.7-1.7-.6 1.7-.6z"/></svg>'
};
