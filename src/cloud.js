/* =====================================================================
   PENYIMPANAN ONLINE — Google Drive melalui Google Apps Script
   Data tetap disimpan di browser (cadangan offline); setiap perubahan
   dikirim ke Drive beberapa detik kemudian. Bentrok antar-auditor dideteksi
   dengan nomor revisi per audit.
   ===================================================================== */
const CLOUD_LS = 'iso21001_cloud_v1';
/* Login: "Masuk dengan Google". Backend memeriksa akun Google lalu memberi token sesi
   (90 hari) yang disimpan di browser ini. Tidak ada kode akses. */
let CL = { url:'', session:'', email:'', who:'', on:false, rev:{}, dirty:[], meta:{} };
const CLS = { busy:false, err:'', conflict:null, timer:null, loading:false, listAt:0 };
try { const c = JSON.parse(localStorage.getItem(CLOUD_LS) || 'null'); if (c) CL = Object.assign(CL, c); } catch (e) { /* abaikan */ }
if (typeof CLOUD_URL_DEFAULT !== 'undefined' && CLOUD_URL_DEFAULT) CL.url = CLOUD_URL_DEFAULT;
delete CL.key; // kode akses lama tidak dipakai lagi

function clSave(){ try { localStorage.setItem(CLOUD_LS, JSON.stringify(CL)); } catch (e) { /* abaikan */ } }
function cloudOn(){ return !!(CL.on && CL.url && CL.session); }
const CL_ONLINE = 'https://askarnh-glitch.github.io/audit-iso21001/';
function clCanGoogle(){ return /^https?:$/.test(location.protocol) && typeof GOOGLE_CLIENT_ID !== 'undefined' && !!GOOGLE_CLIENT_ID; }

async function clApi(action, payload){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 45000);
  let r;
  try {
    r = await fetch(CL.url, { method:'POST', body:JSON.stringify(Object.assign({ action, session:CL.session }, payload || {})), signal:ctl.signal });
  } catch (e) { throw Object.assign(new Error('network'), { code:'network' }); }
  finally { clearTimeout(t); }
  if (!r.ok) throw Object.assign(new Error('http'), { code:'http' });
  let j; try { j = await r.json(); } catch (e) { throw Object.assign(new Error('parse'), { code:'parse' }); }
  if (!j.ok) {
    if (j.error === 'unauthorized' && action !== 'login' && CL.session) {
      CL.session = ''; clSave(); setTimeout(() => { clShow(); if (VIEW === 'home') render(); }, 0);
    }
    throw Object.assign(new Error(j.error || 'error'), { code:j.error || 'error', res:j });
  }
  return j;
}
function clErrText(e){
  return ({
    network:'Tidak dapat terhubung ke Drive (periksa internet)',
    unauthorized:'Sesi berakhir, silakan masuk lagi dengan Google',
    not_owner:'Akun Google ' + ((e.res && e.res.email) || 'ini') + ' tidak diizinkan. Masuk dengan akun pemilik aplikasi',
    parse:'Backend Drive belum diperbarui atau aksesnya belum "Siapa saja"',
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
function clShow(){
  if (cloudOn()) setSaved(clStatusText());
  else if (CL.on) setSaved('⚠ Belum masuk Google — tersimpan di browser');
}

/* ---------------- kirim perubahan ---------------- */
function cloudMarkDirty(id){
  if (!CL.on || !id) return; // tetap dicatat walau sesi berakhir; terkirim setelah masuk lagi
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
      const j = await clApi('save', { audit:a, baseRev:CL.rev[id] || 0, who:CL.who, jenjang:jenjangText(a) + (isQ9(a) ? ' · + ' + Q9_LABEL : ''), progress:progress(a) });
      CL.rev[id] = j.rev; CL.meta[id] = j.meta; CLS.err = '';
      if (!DB.audits[id] || DB.audits[id].updated === sentAt) CL.dirty = CL.dirty.filter(x => x !== id);
      else retry = true;
    } catch (e) {
      if (e.code === 'conflict') { CLS.conflict = { id, meta:(e.res && e.res.meta) || null }; break; }
      CLS.err = clErrText(e); retry = e.code !== 'unauthorized'; break;
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
      const j = await clApi('save', { audit:a, force:true, who:CL.who, jenjang:jenjangText(a) + (isQ9(a) ? ' · + ' + Q9_LABEL : ''), progress:progress(a) });
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

/* ---------------- masuk / keluar (Google) ---------------- */
let GSI_READY = false;
function clLoadGsi(){
  if (window.google && google.accounts && google.accounts.id) { clInitGsi(); return; }
  if (document.getElementById('gsiScript')) return;
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.id = 'gsiScript';
  s.onload = clInitGsi;
  s.onerror = () => { const el = document.getElementById('gsiBtn'); if (el) el.textContent = 'Layanan login Google tidak dapat dimuat (periksa internet).'; };
  document.head.appendChild(s);
}
function clInitGsi(){
  if (!GSI_READY) {
    google.accounts.id.initialize({ client_id:GOOGLE_CLIENT_ID, callback:clOnCredential, auto_select:true,
      cancel_on_tap_outside:true, use_fedcm_for_prompt:true, context:'signin' });
    GSI_READY = true;
    if (!cloudOn()) { try { google.accounts.id.prompt(); } catch (e) { /* abaikan */ } }
  }
  clRenderGsi();
}
function clRenderGsi(){
  const el = document.getElementById('gsiBtn');
  if (!el || !GSI_READY || el.dataset.done) return;
  el.dataset.done = '1';
  google.accounts.id.renderButton(el, { theme:'outline', size:'large', text:'signin_with', shape:'pill', locale:'id' });
}
async function clOnCredential(resp){
  if (!resp || !resp.credential) return;
  if (typeof CLOUD_URL_DEFAULT !== 'undefined' && CLOUD_URL_DEFAULT) CL.url = CLOUD_URL_DEFAULT;
  toast('Memeriksa akun Google…');
  try {
    const j = await clApi('login', { idToken:resp.credential });
    CL.session = j.session; CL.email = j.email || ''; if (!CL.who) CL.who = j.name || '';
    CL.on = true; CLS.err = ''; clSave();
    toast('Masuk sebagai ' + (j.email || 'pemilik'));
    await cloudRefresh(true);
    if (CL.dirty.length) clSchedule(800);
    const y = window.scrollY; render(); window.scrollTo(0, y);
  } catch (e) {
    alert('Gagal masuk.\n' + clErrText(e));
  }
}
async function cloudLogout(){
  if (CL.dirty.length && !confirm('Masih ada perubahan yang belum terkirim ke Drive. Keluar juga? Perubahan tetap tersimpan di browser ini.')) return;
  // Audit yang sudah aman di Drive (tanpa perubahan tertunda) boleh dihapus dari browser ini.
  const diDrive = Object.keys(DB.audits).filter(id => CL.meta[id] && !CL.dirty.includes(id));
  const hapusLokal = diDrive.length > 0 && confirm('Hapus juga salinan ' + diDrive.length + ' audit dari browser ini?\n\n' +
    'Disarankan bila komputer ini dipakai orang lain. Audit tetap aman di Google Drive dan muncul lagi setelah Anda login.\n\n' +
    'OK = hapus dari browser ini · Batal = biarkan tersimpan di browser');
  try { await clApi('logout'); } catch (e) { /* sesi mungkin sudah berakhir */ }
  if (hapusLokal) {
    diDrive.forEach(id => { delete DB.audits[id]; delete CL.rev[id]; });
    if (DB.current && !DB.audits[DB.current]) DB.current = null;
    persist();
  }
  CL.session = ''; CL.on = false; CL.meta = {}; CLS.err = ''; CLS.conflict = null; clSave();
  try { google.accounts.id.disableAutoSelect(); } catch (e) { /* abaikan */ }
  setSaved('Tersimpan di browser'); go('home');
  toast(hapusLokal ? 'Anda sudah keluar; salinan audit di browser ini dihapus' : 'Anda sudah keluar dari Drive');
}
function cloudUpload(ids){
  ids.forEach(id => { if (DB.audits[id] && !CL.dirty.includes(id)) CL.dirty.push(id); });
  clSave(); clSchedule(100); render(); toast('Mengunggah ' + ids.length + ' audit ke Drive…');
}
function clLocalOnly(){ return Object.keys(DB.audits).filter(id => !CL.meta[id] && !CL.dirty.includes(id)); }

/* ---------------- tampilan di Beranda ---------------- */
function clCardHTML(){
  if (!cloudOn()) {
    if (!clCanGoogle()) {
      return `<div class="card"><h3>☁ Penyimpanan Online (Google Drive)</h3>
        <p class="sub">Login Google hanya tersedia di versi online: <a href="${CL_ONLINE}" target="_blank" rel="noopener">${CL_ONLINE}</a>. Di file offline ini audit tetap tersimpan otomatis di browser; gunakan <b>Simpan File</b> untuk cadangan.</p></div>`;
    }
    const habis = CL.on && !CL.session;
    return `<div class="card"><h3>☁ Penyimpanan Online (Google Drive)</h3>
      <p class="sub">${habis ? '<b>Sesi Drive Anda berakhir.</b> Perubahan tetap aman di browser ini dan akan dikirim setelah Anda masuk lagi.' : 'Masuk dengan akun Google pemilik aplikasi agar audit tersimpan di Drive dan semua riwayat audit dari perangkat lain muncul di sini.'}</p>
      <div class="row" style="gap:10px;margin-top:8px"><div id="gsiBtn" style="min-height:44px">Memuat tombol login Google…</div></div>
      <p class="note" style="margin-top:6px">Hanya akun pemilik yang diterima. Setelah masuk, perangkat ini diingat selama 90 hari.</p></div>`;
  }
  const lo = clLocalOnly().length;
  return `<div class="card"><div class="row"><h3 style="margin:0">☁ Penyimpanan Online — terhubung</h3><span class="spacer"></span>
      <button class="btn sm" data-act="clRefresh">${CLS.loading ? 'Memuat…' : '↻ Muat ulang daftar'}</button>
      <button class="btn sm" data-act="clLogout">Keluar</button></div>
    <p class="note" style="margin-top:6px">Masuk sebagai <b>${esc(CL.email || '(akun Google)')}</b> · Status: <b>${esc(clStatusText())}</b>. Perubahan dikirim otomatis ke Drive beberapa detik setelah mengetik; salinan juga disimpan di browser untuk dipakai saat offline.</p>
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
    case 'clLogout': cloudLogout(); break;
    case 'clRefresh': cloudRefresh(true); break;
    case 'clUpload': cloudUpload([b.dataset.id]); break;
    case 'clUploadAll': cloudUpload(clLocalOnly()); break;
    case 'clRes': cloudResolve(b.dataset.v); break;
  }
});
window.addEventListener('online', () => { if (cloudOn()) { CLS.err = ''; clSchedule(500); } });

/* tombol login Google digambar ulang setiap kali Beranda dirender */
new MutationObserver(() => { if (GSI_READY) clRenderGsi(); }).observe(document.documentElement, { childList:true, subtree:true });

function cloudInit(){
  if (/^#masuk=/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* abaikan */ } }
  if (clCanGoogle()) clLoadGsi();
  if (!cloudOn()) { clShow(); return; }
  clShow(); cloudRefresh(true);
  if (CL.dirty.length) clSchedule(1500);
}
