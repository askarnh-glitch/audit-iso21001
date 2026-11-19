/* =====================================================================
   PENYIMPANAN ONLINE — Google Drive melalui Google Apps Script
   Data tetap disimpan di browser (cadangan offline); setiap perubahan
   dikirim ke Drive beberapa detik kemudian. Bentrok antar-auditor dideteksi
   dengan nomor revisi per audit.
   ===================================================================== */
const CLOUD_LS = 'iso21001_cloud_v1';
let CL = { url:'', key:'', who:'', on:false, rev:{}, dirty:[], meta:{} };
const CLS = { busy:false, err:'', conflict:null, timer:null, loading:false, listAt:0 };
try { const c = JSON.parse(localStorage.getItem(CLOUD_LS) || 'null'); if (c) CL = Object.assign(CL, c); } catch (e) { /* abaikan */ }
if (!CL.url && typeof CLOUD_URL_DEFAULT !== 'undefined') CL.url = CLOUD_URL_DEFAULT;

function clSave(){ try { localStorage.setItem(CLOUD_LS, JSON.stringify(CL)); } catch (e) { /* abaikan */ } }
function cloudOn(){ return !!(CL.on && CL.url && CL.key); }

async function clApi(action, payload){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 45000);
  let r;
  try {
    r = await fetch(CL.url, { method:'POST', body:JSON.stringify(Object.assign({ action, key:CL.key }, payload || {})), signal:ctl.signal });
  } catch (e) { throw Object.assign(new Error('network'), { code:'network' }); }
  finally { clearTimeout(t); }
  if (!r.ok) throw Object.assign(new Error('http'), { code:'http' });
  let j; try { j = await r.json(); } catch (e) { throw Object.assign(new Error('parse'), { code:'parse' }); }
  if (!j.ok) throw Object.assign(new Error(j.error || 'error'), { code:j.error || 'error', res:j });
  return j;
}
function clErrText(e){
  return ({
    network:'Tidak dapat terhubung ke Drive (periksa internet)',
    unauthorized:'Kode akses salah',
    parse:'URL bukan backend aplikasi ini, atau aksesnya belum "Siapa saja"',
    http:'Server Drive menolak permintaan',
    busy:'Server sedang sibuk, dicoba lagi',
    not_found:'Audit tidak ditemukan di Drive'
  })[e.code] || ('Galat: ' + (e.message || e.code));
}

/* ---------------- status ---------------- */
function clStatusText(){
  if (CLS.conflict) return '⚠ Bentrok data — lihat pemberitahuan';
  if (CLS.busy) return '☁ Menyimpan ke Drive…';
  if (CLS.err) return '⚠ ' + CLS.err + ' — tersimpan di browser';
  if (CL.dirty.length) return '☁ Menunggu sinkron ke Drive…';
  return '☁ Tersimpan di Drive';
}
function clShow(){ if (cloudOn()) setSaved(clStatusText()); }

/* ---------------- kirim perubahan ---------------- */
function cloudMarkDirty(id){
  if (!cloudOn() || !id) return;
  if (!CL.dirty.includes(id)) CL.dirty.push(id);
  clSave(); clSchedule(2500);
}
function clSchedule(ms){ clearTimeout(CLS.timer); CLS.timer = setTimeout(clPush, ms); }

async function clPush(){
  if (!cloudOn() || CLS.conflict) return;
  if (CLS.busy) { clSchedule(1500); return; }
  CLS.busy = true; clShow();
  let retry = false;
  for (const id of CL.dirty.slice()) {
    const a = DB.audits[id];
    if (!a) { CL.dirty = CL.dirty.filter(x => x !== id); continue; }
    const sentAt = a.updated;
    try {
      const j = await clApi('save', { audit:a, baseRev:CL.rev[id] || 0, who:CL.who, jenjang:jenjangText(a), progress:progress(a) });
      CL.rev[id] = j.rev; CL.meta[id] = j.meta; CLS.err = '';
      if (!DB.audits[id] || DB.audits[id].updated === sentAt) CL.dirty = CL.dirty.filter(x => x !== id);
      else retry = true;
    } catch (e) {
      if (e.code === 'conflict') { CLS.conflict = { id, meta:(e.res && e.res.meta) || null }; break; }
      CLS.err = clErrText(e); retry = true; break;
    }
  }
  CLS.busy = false; clSave(); clShow();
  if (CLS.conflict) render();
  else if (retry) clSchedule(CLS.err ? 30000 : 1000);
}

/* ---------------- ambil daftar & buka ---------------- */
async function cloudRefresh(force){
  if (!cloudOn() || CLS.loading) return;
  if (!force && Date.now() - CLS.listAt < 20000) return;
  CLS.loading = true;
  try {
    const j = await clApi('list');
    CL.meta = {}; (j.items || []).forEach(m => { if (m && m.id) CL.meta[m.id] = m; });
    CLS.listAt = Date.now(); if (CLS.err && !CL.dirty.length) CLS.err = ''; clSave();
  } catch (e) { CLS.err = clErrText(e); }
  finally { CLS.loading = false; CLS.listAt = Date.now(); clShow(); if (VIEW === 'home') { const y = window.scrollY; render(); window.scrollTo(0, y); } }
}

async function openAudit(id){
  if (cloudOn()) {
    const m = CL.meta[id], local = DB.audits[id];
    const stale = m && m.rev > (CL.rev[id] || 0);
    if (!local || (stale && !CL.dirty.includes(id))) {
      toast('Mengambil data dari Drive…');
      try {
        const j = await clApi('get', { id });
        DB.audits[id] = j.audit; CL.rev[id] = j.rev; if (j.meta) CL.meta[id] = j.meta; clSave(); persist();
      } catch (e) {
        if (!local) { alert('Audit tidak dapat diambil dari Drive.\n' + clErrText(e)); return; }
        toast('Gagal mengambil versi terbaru — membuka salinan di browser');
      }
    } else if (stale) toast('Versi di Drive lebih baru, tetapi ada perubahan Anda yang belum terkirim');
  }
  if (!DB.audits[id]) return;
  DB.current = id; CUR_CLAUSE = null; persist();
  go(DB.audits[id].profil.jenjang ? 'checklist' : 'profil');
}

async function deleteAudit(id){
  const local = DB.audits[id], m = CL.meta[id];
  const nama = (local && local.profil.nama) || (m && m.nama) || '(tanpa nama)';
  const onDrive = cloudOn() && !!m;
  const msg = 'Hapus audit “' + nama + '”?\n\n' + (onDrive
    ? 'Audit akan dihapus dari daftar semua auditor. File di Google Drive dipindahkan ke Sampah dan masih dapat dipulihkan pemilik folder selama 30 hari.'
    : 'Data yang dihapus tidak dapat dikembalikan, kecuali Anda punya file .json cadangannya.');
  if (!confirm(msg)) return;
  if (onDrive) {
    try { await clApi('delete', { id }); }
    catch (e) { alert('Gagal menghapus di Drive. Audit tidak dihapus.\n' + clErrText(e)); return; }
    delete CL.meta[id];
  }
  delete DB.audits[id]; delete CL.rev[id]; CL.dirty = CL.dirty.filter(x => x !== id);
  if (DB.current === id) DB.current = null;
  clSave(); persist(); render(); toast('Audit dihapus');
}

/* ---------------- bentrok ---------------- */
async function cloudResolve(mode){
  const c = CLS.conflict; if (!c) return;
  const id = c.id;
  try {
    if (mode === 'mine') {
      const a = DB.audits[id];
      const j = await clApi('save', { audit:a, force:true, who:CL.who, jenjang:jenjangText(a), progress:progress(a) });
      CL.rev[id] = j.rev; CL.meta[id] = j.meta; CL.dirty = CL.dirty.filter(x => x !== id);
    } else {
      if (mode === 'copy') {
        const cp = JSON.parse(JSON.stringify(DB.audits[id])); cp.id = uid();
        cp.profil.nama = (cp.profil.nama || 'Audit') + ' (salinan saya)'; cp.created = cp.updated = new Date().toISOString();
        DB.audits[cp.id] = cp; CL.dirty.push(cp.id);
      }
      const j = await clApi('get', { id });
      DB.audits[id] = j.audit; CL.rev[id] = j.rev; if (j.meta) CL.meta[id] = j.meta;
      CL.dirty = CL.dirty.filter(x => x !== id);
    }
    CLS.conflict = null; CLS.err = ''; clSave(); persist();
    const y = window.scrollY; render(); window.scrollTo(0, y);
    toast(mode === 'mine' ? 'Versi Anda disimpan ke Drive' : mode === 'copy' ? 'Versi Drive dimuat; versi Anda disimpan sebagai salinan' : 'Versi Drive dimuat');
    if (CL.dirty.length) clSchedule(500);
  } catch (e) { alert('Gagal menyelesaikan bentrok.\n' + clErrText(e)); }
}
function clBannerHTML(){
  const c = CLS.conflict; if (!c) return '';
  const a = DB.audits[c.id], m = c.meta || {};
  const siapa = m.savedBy ? ' oleh <b>' + esc(m.savedBy) + '</b>' : '';
  const kapan = m.savedAt ? ' pada ' + esc(new Date(m.savedAt).toLocaleString('id-ID')) : '';
  return `<div class="card clbanner"><h3>⚠ Bentrok data audit “${esc((a && a.profil.nama) || m.nama || '(tanpa nama)')}”</h3>
    <p class="sub">Audit ini sudah diubah di Drive${siapa}${kapan} setelah terakhir Anda sinkron. Perubahan Anda masih aman di browser ini. Pilih salah satu:</p>
    <div class="row" style="gap:6px">
      <button class="btn pri" data-act="clRes" data-v="copy">Muat versi Drive, simpan versi saya sebagai salinan</button>
      <button class="btn" data-act="clRes" data-v="server">Muat versi Drive (buang perubahan saya)</button>
      <button class="btn danger" data-act="clRes" data-v="mine">Timpa Drive dengan versi saya</button></div></div>`;
}

/* ---------------- hubungkan / putuskan ---------------- */
async function cloudConnect(){
  const url = ($('#clUrl').value || '').trim(), key = ($('#clKey').value || '').trim(), who = ($('#clWho').value || '').trim();
  if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) { alert('Isi URL aplikasi web Apps Script (diawali https://script.google.com/…).'); return; }
  if (!key) { alert('Isi kode akses.'); return; }
  const old = { url:CL.url, key:CL.key };
  CL.url = url; CL.key = key; CL.who = who;
  toast('Menghubungkan ke Drive…');
  try {
    const j = await clApi('ping');
    CL.on = true; CLS.err = ''; clSave(); toast('Terhubung ke folder Drive “' + (j.folder || '') + '”');
    await cloudRefresh(true);
  } catch (e) { CL.url = old.url; CL.key = old.key; clSave(); alert('Gagal terhubung.\n' + clErrText(e)); }
}
function cloudDisconnect(){
  if (CL.dirty.length && !confirm('Masih ada perubahan yang belum terkirim ke Drive. Putuskan juga? Perubahan tetap tersimpan di browser ini.')) return;
  CL.on = false; CL.key = ''; CLS.err = ''; CLS.conflict = null; clSave();
  setSaved('Tersimpan di browser'); render(); toast('Penyimpanan online diputuskan');
}
function cloudUpload(ids){
  ids.forEach(id => { if (DB.audits[id] && !CL.dirty.includes(id)) CL.dirty.push(id); });
  clSave(); clSchedule(100); render(); toast('Mengunggah ' + ids.length + ' audit ke Drive…');
}
function clLocalOnly(){ return Object.keys(DB.audits).filter(id => !CL.meta[id] && !CL.dirty.includes(id)); }

/* ---------------- tampilan di Beranda ---------------- */
function clCardHTML(){
  if (!cloudOn()) {
    return `<div class="card"><h3>☁ Penyimpanan Online (Google Drive)</h3>
      <p class="sub">Hubungkan agar audit tersimpan di folder Drive bersama dan dapat dibuka auditor lain dari komputer mana pun. Minta URL dan kode akses kepada pengelola aplikasi.</p>
      <div class="grid g2">
        <div><label class="f">URL aplikasi web (Apps Script)</label><input class="inp" id="clUrl" value="${esc(CL.url)}" placeholder="https://script.google.com/macros/s/…/exec"></div>
        <div><label class="f">Kode akses</label><input class="inp" id="clKey" type="password" autocomplete="off" placeholder="diberikan pengelola"></div>
        <div><label class="f">Nama Anda (tercatat sebagai penyimpan terakhir)</label><input class="inp" id="clWho" value="${esc(CL.who)}" placeholder="mis. Auditor Ketua"></div>
        <div style="align-self:end"><button class="btn pri" data-act="clConnect">Hubungkan</button></div></div></div>`;
  }
  const lo = clLocalOnly().length;
  return `<div class="card"><div class="row"><h3 style="margin:0">☁ Penyimpanan Online — terhubung</h3><span class="spacer"></span>
      <button class="btn sm" data-act="clRefresh">${CLS.loading ? 'Memuat…' : '↻ Muat ulang daftar'}</button>
      <button class="btn sm" data-act="clDisconnect">Putuskan</button></div>
    <p class="note" style="margin-top:6px">Status: <b>${esc(clStatusText())}</b>${CL.who ? ' · Anda tercatat sebagai <b>' + esc(CL.who) + '</b>' : ''}. Perubahan dikirim otomatis ke Drive beberapa detik setelah mengetik; salinan juga disimpan di browser untuk dipakai saat offline.</p>
    ${lo ? `<div class="row" style="margin-top:8px"><span class="note">${lo} audit hanya ada di browser ini (belum di Drive).</span><button class="btn sm" data-act="clUploadAll">Unggah semuanya ke Drive</button></div>` : ''}</div>`;
}
function clBadge(id){
  if (!cloudOn()) return '';
  if (CL.dirty.includes(id)) return '<span class="b ofi" title="Ada perubahan yang belum terkirim">⬆ menunggu sinkron</span>';
  const m = CL.meta[id];
  if (!m) return `<span class="b none" title="Hanya tersimpan di browser ini">💻 hanya di browser</span> <button class="btn sm" data-act="clUpload" data-id="${id}">Unggah</button>`;
  if (m.rev > (CL.rev[id] || 0)) return '<span class="b obs" title="Ada versi lebih baru di Drive">☁ versi baru di Drive</span>';
  return '<span class="b c">☁ di Drive</span>';
}
function clServerOnlyRows(){
  if (!cloudOn()) return [];
  return Object.values(CL.meta).filter(m => !DB.audits[m.id]).map(m => ({
    id:m.id, nama:m.nama, jenjang:m.jenjang, versi:m.versi, tglMulai:m.tglMulai, progress:m.progress, updated:m.updated || m.savedAt, savedBy:m.savedBy
  }));
}

/* ---------------- event ---------------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  switch (b.dataset.act) {
    case 'clConnect': cloudConnect(); break;
    case 'clDisconnect': cloudDisconnect(); break;
    case 'clRefresh': cloudRefresh(true); break;
    case 'clUpload': cloudUpload([b.dataset.id]); break;
    case 'clUploadAll': cloudUpload(clLocalOnly()); break;
    case 'clRes': cloudResolve(b.dataset.v); break;
  }
});
window.addEventListener('online', () => { if (cloudOn()) { CLS.err = ''; clSchedule(500); } });

function cloudInit(){
  if (!cloudOn()) return;
  clShow(); cloudRefresh(true);
  if (CL.dirty.length) clSchedule(1500);
}
