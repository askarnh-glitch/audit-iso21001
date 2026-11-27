/* =====================================================================
   APLIKASI AUDIT ISO 21001:2018 / 2025 — logika aplikasi
   ===================================================================== */
'use strict';

const LS_KEY = 'iso21001_audit_app_v1';
const EV_LABEL = { u:'Umum', tk:'PAUD/TK', sek:'Sekolah', smk:'SMK', mad:'Madrasah', pt:'Perguruan Tinggi', vok:'PT Vokasi', ked:'PT Kedinasan', kag:'PT/Rumpun Keagamaan', bh:'PTN-BH',
  isl:'Rumpun Ilmu Agama Islam', kes:'Rumpun Kesehatan', fak:'Site Fakultas/Jurusan', prodi:'Site Program Studi', pasca:'Site Pascasarjana' };
const TAG_RE = /^(tk|sek|smk|mad|pt|vok|ked|kag|bh|isl|kes|fak|prodi|pasca):/;
const UI_KEY = 'iso21001_audit_ui_v1';
let UI = { gdDoc:true, gdTek:true, gdOps:true, critOpen:true };
try { const u = JSON.parse(localStorage.getItem(UI_KEY) || 'null'); if (u) UI = Object.assign(UI, u); } catch (e) { /* abaikan */ }
function saveUI(){ try { localStorage.setItem(UI_KEY, JSON.stringify(UI)); } catch (e) { /* abaikan */ } }
const CAT = Object.fromEntries(KATEGORI.map(k => [k.id, k]));
const SEV = { MAJ:0, MIN:1, OBS:2, OFI:3 };

let DB = { audits:{}, current:null };
let VIEW = 'home';
let CUR_CLAUSE = null;
let NAV_FILTER = 'all';

/* ---------------- util ---------------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nl2br = s => esc(s).replace(/\n/g, '<br>');
const uid = () => 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmtDate = d => { if (!d) return ''; const x = new Date(d + 'T00:00:00'); if (isNaN(x)) return d; return x.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }); };
/* ---------------- singkatan ---------------- */
const GL = {};
GLOSSARY.forEach(g => g.items.forEach(([s, l, d]) => { GL[s] = { l, d, cat:g.cat }; }));
const GL_RE = new RegExp('(^|[^A-Za-z0-9\\-])(' + Object.keys(GL).sort((x, y) => y.length - x.length)
  .map(s => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')).join('|') + ')(?![A-Za-z0-9\\-])', 'g');
/** Bungkus singkatan pada teks yang SUDAH di-escape dengan <abbr title> */
function abbrify(html){
  return html.replace(GL_RE, (m, pre, s) => `${pre}<abbr title="${esc(GL[s].l + (GL[s].d ? ' — ' + GL[s].d : ''))}">${s}</abbr>`);
}
const ea = s => abbrify(esc(s));
function usedAbbr(text){
  const set = new Set(); let m; GL_RE.lastIndex = 0;
  while ((m = GL_RE.exec(text))) set.add(m[2]);
  return [...set].sort((x, y) => x.localeCompare(y, 'id'));
}

function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2200); }

function loadDB(){
  try { const raw = localStorage.getItem(LS_KEY); if (raw) { const d = JSON.parse(raw); if (d && d.audits) DB = d; } } catch (e) { /* storage unavailable */ }
}
let saveTimer;
function persist(){
  try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); if (cloudOn()) clShow(); else setSaved('Tersimpan otomatis'); }
  catch (e) { setSaved('⚠ Tidak dapat menyimpan di browser — gunakan “Simpan File”'); }
}
function save(){ const a = A(); if (a) { a.updated = new Date().toISOString(); cloudMarkDirty(a.id); } setSaved('Menyimpan…'); clearTimeout(saveTimer); saveTimer = setTimeout(persist, 350); }
function setSaved(t){ const el = $('#saved'); if (el) el.textContent = t; }

function ensure(a){
  if (!a) return a;
  const p = a.profil;
  if (!Array.isArray(p.sites) || !p.sites.length) p.sites = [{ type:'institusi', nama:'', jenjang:'' }];
  if (!Array.isArray(p.rumpunList)) p.rumpunList = [];
  if (!Array.isArray(p.lam)) p.lam = [];
  if (typeof p.iso9001 !== 'boolean') p.iso9001 = false;
  const k = a.kesimpulan || (a.kesimpulan = {});
  ['pelapor', 'catatanLead', 'deviasi'].forEach(f => { if (typeof k[f] !== 'string') k[f] = ''; });
  return a;
}
const A = () => DB.current ? ensure(DB.audits[DB.current]) : null;

function newAudit(){
  const id = uid();
  DB.audits[id] = {
    id, created:new Date().toISOString(), updated:new Date().toISOString(),
    versi:'25',
    profil:{ nama:'', alamat:'', kode:'', jenjang:'', madrasah:false, ptBentuk:'', ptPenyelenggara:'', rumpun:'',
             abk:false, paud:false, lingkup:'', jenisAudit:'Audit Internal', noLaporan:'', tglMulai:'', tglSelesai:'', lokasi:'',
             lead:'', auditors:'', pimpinan:'', jabatanPimpinan:'', wakil:'', tujuan:'', kriteria:'',
             justAbk:'', justPaud:'', iso9001:false, sites:[{ type:'institusi', nama:'', jenjang:'' }], rumpunList:[], lam:[] },
    res:{},
    kesimpulan:{ kekuatan:'', ringkasan:'', rek:'auto', catatanRek:'', tempat:'', tglLaporan:'' }
  };
  DB.current = id; save();
  return DB.audits[id];
}

/* ---------------- model helpers ---------------- */
function parseItem(s){
  const m = s.match(/^(18|25)?(S)?\|/);
  if (!m) return { v:null, should:false, text:s };
  return { v:m[1] || null, should:!!m[2], text:s.slice(m[0].length) };
}
/** Butir aktif satu klausul untuk audit a. Butir tambahan ISO 9001 (mode terintegrasi) berindeks 'q0', 'q1', … */
function itemsFor(cl, a){
  let list = cl.items.map((s, i) => ({ ...parseItem(s), i }));
  if (isQ9(a) && cl.q9items) list = list.concat(cl.q9items.map((s, n) => ({ ...parseItem(s), i:'q' + n, q9:true })));
  return list.filter(it => !it.v || it.v === a.versi);
}
const isQIdx = i => /^q\d+$/.test(String(i));
/** Indeks butir dari atribut data-*: angka untuk butir ISO 21001, 'qN' untuk butir tambahan ISO 9001 */
const ixOf = s => isQIdx(s) ? String(s) : +s;
function itemAt(cl, i){
  const s = isQIdx(i) ? (cl.q9items || [])[+String(i).slice(1)] : cl.items[+i];
  return s == null ? null : { ...parseItem(s), i:ixOf(i), q9:isQIdx(i) };
}
function condOn(a, cond){
  if (cond === 'q9') return isQ9(a);
  if (cond === 'abk') return !!a.profil.abk;
  if (cond === 'paud') return a.profil.jenjang === 'tk' || !!a.profil.paud;
  return true;
}
function clauseOrder(a){
  let list = CLAUSES.slice();
  if (a.versi === '18') { // 2018: 10.1 = NC, 10.2 = CI
    const i = list.findIndex(c => c.k === '10.CI'), j = list.findIndex(c => c.k === '10.NC');
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
function activeClauses(a){ return clauseOrder(a).filter(c => condOn(a, c.cond)); }
function excludedClauses(a){ return clauseOrder(a).filter(c => c.cond !== 'q9' && !condOn(a, c.cond)); }
function cno(a, cl){ return cl.no[a.versi]; }
function verLabel(v){ return v === '18' ? 'ISO 21001:2018' : 'ISO 21001:2025'; }
function verLong(v){ return v === '18' ? 'ISO 21001:2018' : 'ISO 21001:2025 (SNI ISO 21001:2025)'; }
/* ---- audit terintegrasi ISO 9001:2015 ---- */
const Q9_LABEL = 'ISO 9001:2015', Q9_LONG = 'ISO 9001:2015 (SNI ISO 9001:2015)';
function isQ9(a){ return !!(a && a.profil && a.profil.iso9001); }
/** Label standar audit: "ISO 21001:2018" atau "ISO 9001:2015 & ISO 21001:2018" */
function stdLabel(a){ return isQ9(a) ? Q9_LABEL + ' & ' + verLabel(a.versi) : verLabel(a.versi); }
function stdLong(a){ return isQ9(a) ? Q9_LONG + ' dan ' + verLong(a.versi) : verLong(a.versi); }
/** Nama sistem: SMOP, atau "SMM dan SMOP" pada audit terintegrasi */
function sysName(a){ return isQ9(a) ? 'SMM dan SMOP' : 'SMOP'; }
/** Nomor klausul ISO 9001 padanan, mis. "8.2.2, 8.2.3" ('' bila khusus ISO 21001) */
function q9no(cl){ return (Q9_OF[cl.k] || []).map(q => q.n).join(', '); }
function q9text(cl){ return (Q9_OF[cl.k] || []).map(q => q.n + ' ' + q.t).join('; '); }
function getR(a, k, i){ a.res[k] = a.res[k] || { items:{}, unit:'' }; a.res[k].items[i] = a.res[k].items[i] || {}; return a.res[k].items[i]; }
function peekR(a, k, i){ return (a.res[k] && a.res[k].items[i]) || {}; }

function jenjangText(a){
  const p = a.profil; const j = JENJANG.find(x => x.id === p.jenjang);
  if (!j) return '—';
  if (p.jenjang === 'pt') {
    const b = BENTUK_PT.find(x => x.id === p.ptBentuk), s = PENYELENGGARA_PT.find(x => x.id === p.ptPenyelenggara);
    return 'Perguruan Tinggi' + (b ? ' — ' + b.t : '') + (s ? ' (' + s.t + ')' : '');
  }
  return j.t + (p.madrasah ? ' — Madrasah (Kemenag)' : '');
}
function profileKeys(a){
  const p = a.profil, keys = ['u'];
  const j = JENJANG.find(x => x.id === p.jenjang);
  if (j) keys.push(j.g);
  if (j && j.extra) keys.push(j.extra);
  if (p.madrasah && p.jenjang !== 'pt') keys.push('mad');
  if (p.jenjang === 'pt') {
    const b = BENTUK_PT.find(x => x.id === p.ptBentuk); if (b && b.vok) keys.push('vok');
    const s = PENYELENGGARA_PT.find(x => x.id === p.ptPenyelenggara); if (s && s.x) keys.push(s.x);
    const rl = p.rumpunList || [];
    if (rl.some(r => RUMPUN[0].c.includes(r))) keys.push('kag');
    if (rl.includes('Ilmu Agama Islam')) keys.push('isl');
    if (rl.includes('Kesehatan')) keys.push('kes');
    for (const s2 of (p.sites || [])) { const m = { fakultas:'fak', prodi:'prodi', pasca:'pasca' }[s2.type]; if (m) keys.push(m); }
  }
  return [...new Set(keys)];
}
function evKeys(a, cl){
  if (cl.g === 'A') return ['u', 'tk'];
  return profileKeys(a);
}
function evOf(cl){ return Object.assign({}, cl.ev || {}, EV_EXTRA[cl.k] || {}); }
/* ---------------- panduan penilaian (kriteria kategori) ---------------- */
const CRIT_GEN = {
  NA:'Persyaratan ini berlaku umum; pilih N/A hanya bila dikecualikan secara sah dalam ruang lingkup (klausul 4.3) dengan justifikasi tertulis.',
  MAJ:'Umumnya cukup KTS Minor. Nilai KTS Mayor hanya bila kegagalan bersifat sistemik/menyeluruh, berulang dari audit sebelumnya tanpa tindakan, atau berdampak langsung pada peserta didik.',
  SHOULD:'Butir anjuran ("should") — tidak dapat dinilai KTS. Gunakan Observasi atau OFI.'
};
const CRIT_ORDER = ['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA'];
/** Kriteria per kategori untuk satu butir: {C, OBS, OFI, MIN, MAJ, NA} */
/** Ambil entri panduan/kriteria butir i (angka = ISO 21001, 'qN' = butir tambahan ISO 9001) */
function guideEntry(base, extra, cl, i){
  const q = isQIdx(i), src = q ? (typeof extra !== 'undefined' ? extra : null) : base;
  const g = src && src[cl.k]; if (!g) return null;
  let e = g[q ? +String(i).slice(1) : i]; if (typeof e === 'number') e = g[e];
  return e;
}
function critFor(cl, it){
  const e = guideEntry(typeof CRIT !== 'undefined' ? CRIT : null, typeof CRIT9 !== 'undefined' ? CRIT9 : undefined, cl, it.i);
  if (!Array.isArray(e)) return null;
  const pick = (v, def) => (v && v !== '—') ? v : def;
  return {
    C: e[0], OBS: e[1], OFI: e[2],
    MIN: it.should ? CRIT_GEN.SHOULD : pick(e[3], CRIT_GEN.MAJ),
    MAJ: it.should ? CRIT_GEN.SHOULD : pick(e[4], CRIT_GEN.MAJ),
    NA: pick(e[5], CRIT_GEN.NA)
  };
}
function guideFor(cl, i){
  const e = guideEntry(typeof GUIDE !== 'undefined' ? GUIDE : null, typeof GUIDE9 !== 'undefined' ? GUIDE9 : undefined, cl, i);
  return Array.isArray(e) ? e : null;
}
function filterTagged(list, keys){
  const out = [];
  for (const s of list || []) {
    const m = s.match(TAG_RE);
    if (!m) out.push({ t:s, tag:null });
    else if (keys.includes(m[1])) out.push({ t:s.slice(m[0].length), tag:m[1] });
  }
  return out;
}
function siteText(a){
  const p = a.profil; if (p.jenjang !== 'pt') return '';
  return (p.sites || []).map(s => {
    const t = (SITE_PT.find(x => x.id === s.type) || {}).t || '';
    return t + (s.nama ? ': ' + s.nama : '') + (s.type === 'prodi' && s.jenjang ? ' (' + s.jenjang + ')' : '');
  }).join('; ');
}
function rumpunText(a){
  const rl = a.profil.rumpunList || []; if (!rl.length) return '';
  return RUMPUN.map(g => { const c = g.c.filter(x => rl.includes(x)); return c.length ? g.t + ': ' + c.join(', ') : ''; }).filter(Boolean).join('; ');
}

function stats(a){
  const per = {}, tot = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:0 };
  for (const cl of activeClauses(a)) {
    const s = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:0 };
    for (const it of itemsFor(cl, a)) {
      const c = peekR(a, cl.k, it.i).cat; s.total++; tot.total++;
      if (c && s[c] !== undefined) { s[c]++; tot[c]++; } else { s.none++; tot.none++; }
    }
    per[cl.k] = s;
  }
  return { per, tot };
}
function pct(s){ const den = s.total - s.NA - s.none; return den > 0 ? Math.round((s.C + s.OBS + s.OFI) / den * 100) : null; }
function progress(a){
  // Audit dengan rencana per site: progres dihitung dari pertanyaan per site (tanpa potensi temuan situs).
  const sb = siteBlocks(a).filter(b => !b.cl.ind);
  if (sb.length) { let T = 0, D = 0; sb.forEach(b => b.its.forEach(it => { T++; if (peekR(a, b.cl.k, it.i).cat) D++; })); return T ? Math.round(D / T * 100) : 0; }
  const { tot } = stats(a); return tot.total ? Math.round((tot.total - tot.none) / tot.total * 100) : 0;
}

/* ---------------- rencana audit per site (opsional, disimpan di data audit: a.rencana) ----------------
   a.rencana = { petunjuk, sites:[{ id, no, nama, waktu, info, rows:[{ k, q, b }] }], indikasi:{ intro, rows:[{ site, t, k, v, kat }] } }
   Hasil disimpan di a.res['S:<id site>'] dan a.res['S:ind'] dengan struktur yang sama seperti butir checklist. */
const RC = a => (a && a.rencana && Array.isArray(a.rencana.sites) && a.rencana.sites.length) ? a.rencana : null;
function siteBlocks(a){
  const r = RC(a); if (!r) return [];
  const out = r.sites.map((st, si) => ({ src:st, cl:{ k:'S:' + st.id, t:st.no + ' — ' + st.nama, no:{ 18:st.no, 25:st.no }, site:true, si },
    its:(st.rows || []).map((x, n) => ({ i:n, text:x.q, ref:x.k, v:null, should:false })) }));
  const ind = r.indikasi && Array.isArray(r.indikasi.rows) ? r.indikasi.rows : [];
  if (ind.length) out.push({ src:r.indikasi, cl:{ k:'S:ind', t:'Potensi temuan dari situs resmi', no:{ 18:'Situs', 25:'Situs' }, site:true, ind:true, si:out.length },
    its:ind.map((x, n) => ({ i:n, text:x.t, ref:x.k, v:null, should:false, siteName:x.site })) });
  return out;
}
/** Teks Markdown sederhana (tebal, tautan, daftar butir) → HTML aman */
function mdInline(t){
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, x, u) => `<a href="${u}" target="_blank" rel="noopener">${x}</a>`);
}
function mdLite(s){
  let h = '', list = false;
  for (const ln of String(s || '').split('\n')) {
    if (/^\s*-\s+/.test(ln)) { if (!list) { h += '<ul>'; list = true; } h += '<li>' + mdInline(ln.replace(/^\s*-\s+/, '')) + '</li>'; continue; }
    if (list) { h += '</ul>'; list = false; }
    if (ln.trim()) h += '<p>' + mdInline(ln) + '</p>';
  }
  return h + (list ? '</ul>' : '');
}
const mdPlain = t => String(t || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1 ($2)');

function findings(a){
  const out = [];
  activeClauses(a).forEach((cl, ci) => {
    itemsFor(cl, a).forEach((it, idx) => {
      const r = peekR(a, cl.k, it.i);
      if (r.cat && SEV[r.cat] !== undefined) out.push({ cl, it, idx, r, ci });
    });
  });
  siteBlocks(a).forEach((b, bi) => b.its.forEach((it, idx) => {
    const r = peekR(a, b.cl.k, it.i);
    if (r.cat && SEV[r.cat] !== undefined) out.push({ cl:b.cl, it, idx, r, ci:10000 + bi });
  }));
  out.sort((x, y) => SEV[x.r.cat] - SEV[y.r.cat] || x.ci - y.ci || x.idx - y.idx);
  const n = { KTS:0, OBS:0, OFI:0 };
  for (const f of out) {
    const t = (f.r.cat === 'MAJ' || f.r.cat === 'MIN') ? 'KTS' : f.r.cat;
    n[t]++; f.id = t + '-' + String(n[t]).padStart(2, '0');
  }
  return out;
}

function autoRek(a){
  // dihitung dari daftar temuan agar KTS dari pertanyaan per site ikut diperhitungkan
  const tot = { MAJ:0, MIN:0 }; findings(a).forEach(f => { if (tot[f.r.cat] !== undefined) tot[f.r.cat]++; });
  if (tot.MAJ > 0) return 'Belum direkomendasikan — terdapat ' + tot.MAJ + ' KTS Mayor yang harus ditutup dan diverifikasi sebelum rekomendasi dapat diberikan.';
  if (tot.MIN > 0) return 'Direkomendasikan dengan syarat — ' + tot.MIN + ' KTS Minor harus ditindaklanjuti dengan rencana tindakan korektif yang disetujui dalam batas waktu yang disepakati.';
  return 'Direkomendasikan — ' + sysName(a) + ' dinilai telah sesuai dengan persyaratan ' + stdLabel(a) + ' dan diterapkan secara efektif.';
}
const REK_OPTS = {
  auto:'Otomatis (berdasarkan temuan)',
  r1:'Direkomendasikan',
  r2:'Direkomendasikan dengan syarat (tindak lanjut KTS)',
  r3:'Belum direkomendasikan',
  r4:'Kesimpulan audit internal (tanpa rekomendasi sertifikasi)'
};
function rekText(a){
  const k = a.kesimpulan.rek;
  if (k === 'auto') return autoRek(a);
  if (k === 'r1') return 'Direkomendasikan — ' + sysName(a) + ' dinilai telah sesuai dengan persyaratan ' + stdLabel(a) + ' dan diterapkan secara efektif.';
  if (k === 'r2') return 'Direkomendasikan dengan syarat — seluruh KTS harus ditindaklanjuti dengan tindakan korektif yang disetujui dalam batas waktu yang disepakati.';
  if (k === 'r3') return 'Belum direkomendasikan — terdapat ketidaksesuaian yang harus diselesaikan dan diverifikasi terlebih dahulu.';
  return 'Audit internal telah dilaksanakan. Auditee diminta menindaklanjuti seluruh KTS, Observasi, dan Peluang Peningkatan sesuai jadwal yang disepakati.';
}
const defTujuan = a => 'Menilai kesesuaian dan efektivitas penerapan ' + (isQ9(a) ? 'Sistem Manajemen Mutu (SMM) dan Sistem Manajemen Organisasi Pendidikan (SMOP) secara terintegrasi' : 'Sistem Manajemen Organisasi Pendidikan (SMOP)') + ' terhadap persyaratan ' + stdLabel(a) + ' serta persyaratan organisasi, dan mengidentifikasi peluang peningkatan.';
const defKriteria = a => stdLong(a) + '; peraturan perundang-undangan yang berlaku bagi satuan/organisasi pendidikan; kebijakan, prosedur, dan dokumen ' + sysName(a) + ' organisasi.';
const defJustAbk = 'Organisasi tidak menyelenggarakan layanan khusus bagi peserta didik berkebutuhan khusus pada ruang lingkup audit ini.';
const defJustPaud = 'Organisasi tidak menyelenggarakan pendidikan anak usia dini (ISCED 0) sehingga Lampiran A tidak berlaku.';

/* ---------------- rendering: shell ---------------- */
function render(){
  const a = A();
  $('#cur').innerHTML = a ? esc(a.profil.nama || '(Audit tanpa nama)') + '<span class="pill">' + stdLabel(a) + '</span>' : 'Belum ada audit dipilih';
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('on', t.dataset.view === VIEW);
    t.disabled = !FREE_VIEWS.includes(t.dataset.view) && !a;
    if (t.dataset.view === 'site') t.hidden = !RC(a);
  });
  if (VIEW === 'site' && !RC(a)) VIEW = a ? 'checklist' : 'home';
  const m = $('#main');
  if (VIEW === 'beda') m.innerHTML = vBeda();
  else if (VIEW === 'singkatan') m.innerHTML = vSingkatan();
  else if (VIEW === 'home' || !a) m.innerHTML = vHome();
  else if (VIEW === 'profil') m.innerHTML = vProfil(a);
  else if (VIEW === 'checklist') { const oldNav = m.querySelector('.nav'), navY = oldNav ? oldNav.scrollTop : 0; m.innerHTML = vChecklist(a); keepNavPos(m, navY); }
  else if (VIEW === 'site') { const oldNav = m.querySelector('.nav'), navY = oldNav ? oldNav.scrollTop : 0; m.innerHTML = vSite(a); keepNavPos(m, navY); }
  else if (VIEW === 'temuan') m.innerHTML = vTemuan(a);
  else if (VIEW === 'laporan') m.innerHTML = vLaporan(a);
  const bn = clBannerHTML(); if (bn) m.insertAdjacentHTML('afterbegin', bn);
}
/* Daftar klausul di kiri: pertahankan posisi gulir setelah render, lalu pastikan klausul yang terbuka terlihat (di tengah bila sebelumnya di luar layar). */
function keepNavPos(m, navY){
  const nav = m.querySelector('.nav'); if (!nav) return;
  nav.scrollTop = navY;
  const on = nav.querySelector('button.on'); if (!on) return;
  const nr = nav.getBoundingClientRect(), br = on.getBoundingClientRect();
  const tools = nav.querySelector('.navtools'), topPad = tools ? tools.offsetHeight : 0;
  if (br.top < nr.top + topPad || br.bottom > nr.bottom)
    nav.scrollTop += (br.top - nr.top) - (nav.clientHeight - br.height) / 2;
}
const FREE_VIEWS = ['home', 'beda', 'singkatan'];
let GL_Q = '', GL_CAT = '';

/* ---------------- view: daftar singkatan ---------------- */
function glRows(){
  const q = GL_Q.trim().toLowerCase();
  const qre = q ? new RegExp('(^|[^a-z0-9])' + q.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')) : null;
  let out = '', n = 0;
  for (const g of GLOSSARY) {
    if (GL_CAT && g.cat !== GL_CAT) continue;
    const its = g.items.filter(([s, l, d]) => !qre || qre.test((s + ' ' + l + ' ' + d).toLowerCase()))
      .sort((x, y) => x[0].localeCompare(y[0], 'id'));
    if (!its.length) continue;
    n += its.length;
    out += `<tr><th colspan="3" class="glc">${esc(g.cat)} <span class="note">(${its.length})</span></th></tr>`
      + its.map(([s, l, d]) => `<tr><td class="gls">${esc(s)}</td><td>${esc(l)}</td><td class="note">${esc(d)}</td></tr>`).join('');
  }
  return n ? out : '<tr><td colspan="3" class="empty">Tidak ada singkatan yang cocok.</td></tr>';
}
function vSingkatan(){
  const total = GLOSSARY.reduce((n, g) => n + g.items.length, 0);
  return `<div class="card"><h2>Daftar Singkatan</h2>
    <p class="sub">${total} singkatan yang digunakan di checklist, panduan pemeriksaan, dan laporan. Di halaman checklist, arahkan kursor ke singkatan bergaris titik untuk melihat kepanjangannya.</p>
    <div class="row" style="margin-bottom:12px">
      <input class="inp" style="flex:1;min-width:200px" data-gl="q" value="${esc(GL_Q)}" placeholder="Cari singkatan atau kepanjangan, mis. UKT, kekerasan, akreditasi…">
      <select class="inp" style="width:auto" data-gl="cat"><option value="">Semua kategori</option>${GLOSSARY.map(g => `<option ${GL_CAT === g.cat ? 'selected' : ''}>${esc(g.cat)}</option>`).join('')}</select>
    </div>
    <div style="overflow-x:auto"><table class="tb gl"><thead><tr><th style="width:130px">Singkatan</th><th>Kepanjangan</th><th>Keterangan</th></tr></thead><tbody id="glBody">${glRows()}</tbody></table></div>
  </div>`;
}
function glossaryAppendixHTML(bodyHtml){
  const txt = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
  const used = usedAbbr(txt); if (!used.length) return '';
  return `<p style="${RS.h2}">Daftar Singkatan</p><table style="${RS.tb}"><thead><tr><th style="${RS.th};width:18%">Singkatan</th><th style="${RS.th}">Kepanjangan</th></tr></thead>`
    + used.map(s => `<tr><td style="${RS.td}"><b>${esc(s)}</b></td><td style="${RS.td}">${esc(GL[s].l)}${GL[s].d ? ' — <span style="color:#555">' + esc(GL[s].d) + '</span>' : ''}</td></tr>`).join('') + '</table>';
}
function go(v){ VIEW = v; render(); window.scrollTo(0, 0); }

/* ---------------- view: home ---------------- */
function vHome(){
  if (cloudOn()) setTimeout(() => cloudRefresh(false), 0);
  const local = Object.values(DB.audits).map(a => ({ id:a.id, nama:a.profil.nama, sub:a.profil.jenisAudit, jenjang:jenjangText(a), versi:a.versi, q9:isQ9(a), tglMulai:a.profil.tglMulai, progress:progress(a), updated:a.updated, local:true }));
  const list = local.concat(clServerOnlyRows()).sort((x, y) => (y.updated || '').localeCompare(x.updated || ''));
  const rows = list.map(r => {
    const p = r.progress || 0;
    return `<tr>
      <td><b>${esc(r.nama || '(tanpa nama)')}</b><div class="note">${r.local ? esc(r.sub || '') : 'Di Drive' + (r.savedBy ? ' · disimpan ' + esc(r.savedBy) : '')}</div><div style="margin-top:3px">${r.local ? clBadge(r.id) : '<span class="b c">☁ di Drive</span>'}</div></td>
      <td>${esc(r.jenjang || '')}</td>
      <td><span class="b ${r.versi === '18' ? 'ofi' : 'c'}">${verLabel(r.versi)}</span>${r.q9 ? '<div style="margin-top:3px"><span class="b q9">+ ' + Q9_LABEL + '</span></div>' : ''}</td>
      <td>${esc(fmtDate(r.tglMulai)) || '<span class="note">—</span>'}</td>
      <td style="min-width:110px"><div class="prog"><i style="width:${p}%"></i></div><div class="note">${p}% dinilai</div></td>
      <td><div class="row">
        <button class="btn sm pri" data-act="open" data-id="${r.id}">Buka</button>
        ${r.local ? `<button class="btn sm" data-act="dup" data-id="${r.id}">Duplikat</button>` : ''}
        <button class="btn sm danger" data-act="del" data-id="${r.id}">Hapus</button></div></td></tr>`;
  }).join('');
  return `
  <div class="card">
    <div class="row"><div><h2>Aplikasi Audit SMOP — ISO 21001</h2>
      <p class="sub" style="margin:2px 0 0">Checklist audit untuk TK/PAUD, SD, SMP, SMA, SMK, dan Perguruan Tinggi, dengan pilihan versi ISO 21001:2018 atau ISO 21001:2025, serta mode audit terintegrasi dengan ISO 9001:2015.</p></div>
      <span class="spacer"></span>
      <button class="btn" data-act="import">Buka File Audit (.json)</button>
      <button class="btn pri" data-act="new">+ Audit Baru</button></div>
  </div>
  ${clCardHTML()}
  <div class="card">
    <h3>Daftar Audit</h3>
    ${list.length ? `<div style="overflow-x:auto"><table class="list"><thead><tr><th>Organisasi</th><th>Jenjang / Jenis</th><th>Standar</th><th>Tanggal</th><th>Progres</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
      : `<div class="empty">Belum ada audit. Klik <b>+ Audit Baru</b> untuk memulai.</div>`}
    <p class="note" style="margin-top:12px">${cloudOn() ? 'Audit tersimpan di Google Drive bersama dan juga di browser ini (untuk dipakai saat offline).' : 'Data tersimpan otomatis di browser pada komputer ini. Untuk cadangan atau berpindah komputer, gunakan <b>Simpan File</b> di tab Laporan, atau hubungkan Penyimpanan Online.'}</p>
  </div>
  <div class="card"><h3>Alur penggunaan</h3>
    <ol style="margin:0;padding-left:20px">
      <li><b>Profil Audit</b> — pilih versi standar (centang ISO 9001:2015 untuk audit terintegrasi), jenjang (dan jenis PT), isi identitas organisasi & tim audit.</li>
      <li><b>Checklist</b> — nilai setiap butir: Sesuai, Observasi, OFI, KTS Minor, KTS Mayor, atau N/A; catat bukti objektif.</li>
      <li><b>Temuan</b> — lengkapi uraian temuan dan rencana tindakan korektif.</li>
      <li><b>Laporan</b> — tulis kesimpulan, lalu ekspor ke <b>Word</b> atau <b>PDF</b>.</li></ol>
    <p class="note" style="margin-top:10px">Butir checklist adalah parafrase berbahasa Indonesia dari persyaratan standar, bukan kutipan teks resmi. Gunakan dokumen standar resmi sebagai rujukan bunyi persyaratan.</p>
  </div>
  <p class="note" style="text-align:center;margin:4px 0 16px">Versi aplikasi: ${esc(appVersionText())}</p>`;
}
function appVersionText(){
  const m = document.querySelector('meta[name=build]'), s = m ? m.content : '';
  if (!/^\d{14}$/.test(s)) return '(belum ada penanda versi)';
  const d = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12));
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) + ', pukul ' + s.slice(8, 10) + '.' + s.slice(10, 12);
}

/* ---------------- view: profil ---------------- */
function inp(path, val, ph = '', type = 'text'){ return `<input class="inp" type="${type}" data-bind="${path}" value="${esc(val)}" placeholder="${esc(ph)}">`; }
function ta(path, val, ph = '', rows = 3){ return `<textarea class="inp" rows="${rows}" data-bind="${path}" placeholder="${esc(ph)}">${esc(val)}</textarea>`; }

function vProfil(a){
  const p = a.profil;
  const isPT = p.jenjang === 'pt';
  const verCards = ['18', '25'].map(v => `<button class="opt ${a.versi === v ? 'on' : ''}" data-act="ver" data-v="${v}">
      <b>${verLabel(v)}</b><span>${v === '18' ? 'Edisi pertama (2018). Gunakan bila organisasi masih disertifikasi terhadap edisi 2018.' : 'Edisi revisi 2025 — diadopsi identik sebagai SNI ISO 21001:2025. Memuat isu perubahan iklim (Amd 1:2024) dan revisi narasi asesmen.'}</span></button>`).join('');
  const jCards = JENJANG.map(j => `<button class="opt ${p.jenjang === j.id ? 'on' : ''}" data-act="jenjang" data-v="${j.id}"><b>${esc(j.t)}</b></button>`).join('');
  const bCards = BENTUK_PT.map(b => `<button class="opt ${p.ptBentuk === b.id ? 'on' : ''}" data-act="bentuk" data-v="${b.id}"><b>${esc(b.t)}</b><span>${esc(b.d)}</span></button>`).join('');
  const sOpts = PENYELENGGARA_PT.map(s => `<option value="${s.id}" ${p.ptPenyelenggara === s.id ? 'selected' : ''}>${esc(s.t)}</option>`).join('');
  const jaOpts = JENIS_AUDIT.map(s => `<option ${p.jenisAudit === s ? 'selected' : ''}>${esc(s)}</option>`).join('');
  return `
  <div class="card"><h2>1. Versi Standar</h2><p class="sub">Checklist, penomoran klausul, dan laporan akan menyesuaikan versi yang dipilih.</p>
    <div class="opts ver">${verCards}</div>
    <label class="chk q9chk" style="margin-top:14px"><input type="checkbox" data-bind="profil.iso9001" ${p.iso9001 ? 'checked' : ''}><span><b>Audit terintegrasi dengan ISO 9001:2015 (Sistem Manajemen Mutu)</b>
      <small>Untuk audit yang kriterianya ISO 9001:2015 dan ISO 21001 sekaligus. Setiap klausul menampilkan padanan klausul ISO 9001, butir tambahan khusus ISO 9001 ikut dinilai, klausul 8.5.5 ISO 9001 (kegiatan pascapenyerahan) ditambahkan, dan laporan memuat matriks hasil per klausul ISO 9001. Istilah <i>pelanggan</i> di ISO 9001 dipadankan dengan peserta didik dan penerima manfaat lain.</small></span></label></div>

  <div class="card"><h2>2. Jenjang / Jenis Organisasi Pendidikan</h2><p class="sub">Contoh bukti audit pada checklist disesuaikan dengan jenjang yang dipilih.</p>
    <div class="opts">${jCards}</div>
    ${isPT ? `
      <h3 style="margin-top:18px">Bentuk Perguruan Tinggi</h3>
      <div class="opts">${bCards}</div>
      <div class="grid g2" style="margin-top:14px">
        <div><label class="f">Penyelenggara / status PT</label><select class="inp" data-bind="profil.ptPenyelenggara"><option value="">— pilih —</option>${sOpts}</select></div>
        <div><label class="f">Catatan rumpun/akreditasi (opsional)</label>${inp('profil.rumpun', p.rumpun, 'mis. Prodi terakreditasi Unggul')}</div>
      </div>
      ${sitesHTML(p)}
      ${rumpunHTML(p)}
      <h3 style="margin-top:18px">Lembaga akreditasi</h3>
      <div class="chips">${LAM.map(l => `<button class="chip ${p.lam.includes(l) ? 'on' : ''}" data-act="lam" data-v="${esc(l)}">${esc(l)}</button>`).join('')}</div>` : ''}
    ${p.jenjang && !isPT && p.jenjang !== 'tk' ? `<label class="chk" style="margin-top:14px"><input type="checkbox" data-bind="profil.madrasah" ${p.madrasah ? 'checked' : ''}><span><b>Madrasah (di bawah Kementerian Agama)</b><small>Contoh bukti: Dapodik → EMIS, e-Rapor → RDM, Dinas Pendidikan → Kemenag Kab/Kota.</small></span></label>` : ''}
    <div class="grid g2" style="margin-top:14px">
      <label class="chk"><input type="checkbox" data-bind="profil.abk" ${p.abk ? 'checked' : ''}><span><b>Melayani peserta didik berkebutuhan khusus</b><small>Mengaktifkan klausul 5.1.3, 7.2.2, 8.1.3, dan 8.5.1.6 (inklusi/disabilitas/cerdas istimewa).</small></span></label>
      ${p.jenjang === 'tk' ? `<div class="chk" style="cursor:default"><span><b>Lampiran A (PAUD) otomatis berlaku</b><small>Persyaratan tambahan pendidikan anak usia dini.</small></span></div>`
        : `<label class="chk"><input type="checkbox" data-bind="profil.paud" ${p.paud ? 'checked' : ''}><span><b>Juga menyelenggarakan PAUD</b><small>Mengaktifkan Lampiran A (normatif) — persyaratan tambahan PAUD.</small></span></label>`}
    </div>
    ${!p.abk ? `<div style="margin-top:10px"><label class="f">Justifikasi tidak berlakunya klausul kebutuhan khusus (dicantumkan di laporan)</label>${inp('profil.justAbk', p.justAbk, defJustAbk)}</div>` : ''}
    ${!(p.jenjang === 'tk' || p.paud) ? `<div style="margin-top:10px"><label class="f">Justifikasi tidak berlakunya Lampiran A</label>${inp('profil.justPaud', p.justPaud, defJustPaud)}</div>` : ''}
  </div>

  <div class="card"><h2>3. Identitas Organisasi</h2>
    <div class="grid g2">
      <div><label class="f">Nama organisasi / satuan pendidikan</label>${inp('profil.nama', p.nama, isPT ? 'mis. Politeknik …' : 'mis. SD Negeri …')}</div>
      <div><label class="f">${isPT ? 'Kode PT (PDDikti)' : 'NPSN / NSM'}</label>${inp('profil.kode', p.kode)}</div>
      <div style="grid-column:1/-1"><label class="f">Alamat</label>${inp('profil.alamat', p.alamat)}</div>
      <div style="grid-column:1/-1"><label class="f">Ruang lingkup audit</label>${ta('profil.lingkup', p.lingkup, isPT ? 'mis. Penyelenggaraan pendidikan Program Studi D3 … dan layanan akademik pendukung' : 'mis. Penyelenggaraan pendidikan dasar kelas I–VI dan layanan pendukungnya', 2)}</div>
    </div></div>

  <div class="card"><h2>4. Pelaksanaan Audit</h2>
    <div class="grid g3">
      <div><label class="f">Jenis audit</label><select class="inp" data-bind="profil.jenisAudit">${jaOpts}</select></div>
      <div><label class="f">Tanggal mulai</label>${inp('profil.tglMulai', p.tglMulai, '', 'date')}</div>
      <div><label class="f">Tanggal selesai</label>${inp('profil.tglSelesai', p.tglSelesai, '', 'date')}</div>
      <div><label class="f">Nomor laporan</label>${inp('profil.noLaporan', p.noLaporan, 'mis. 001/AMI/2026')}</div>
      <div style="grid-column:span 2"><label class="f">Lokasi / metode (onsite, daring, hibrida)</label>${inp('profil.lokasi', p.lokasi)}</div>
      <div><label class="f">Ketua tim auditor (Lead Auditor)</label>${inp('profil.lead', p.lead)}</div>
      <div style="grid-column:span 2"><label class="f">Anggota tim auditor (satu nama per baris)</label>${ta('profil.auditors', p.auditors, '', 2)}</div>
      <div><label class="f">Pimpinan auditee</label>${inp('profil.pimpinan', p.pimpinan)}</div>
      <div><label class="f">Jabatan pimpinan</label>${inp('profil.jabatanPimpinan', p.jabatanPimpinan, isPT ? 'mis. Direktur / Rektor' : 'mis. Kepala Sekolah')}</div>
      <div><label class="f">Wakil manajemen / koordinator mutu</label>${inp('profil.wakil', p.wakil)}</div>
      <div style="grid-column:1/-1"><label class="f">Tujuan audit</label>${ta('profil.tujuan', p.tujuan, defTujuan(a), 2)}</div>
      <div style="grid-column:1/-1"><label class="f">Kriteria audit</label>${ta('profil.kriteria', p.kriteria, defKriteria(a), 2)}</div>
    </div>
    <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn pri" data-act="go" data-v="checklist">Lanjut ke Checklist →</button></div>
  </div>`;
}

function sitesHTML(p){
  const rows = p.sites.map((s, i) => `<div class="site-row">
      <select class="inp" data-site="${i}|type">${SITE_PT.map(x => `<option value="${x.id}" ${s.type === x.id ? 'selected' : ''}>${esc(x.t)}</option>`).join('')}</select>
      <input class="inp" data-site="${i}|nama" value="${esc(s.nama)}" placeholder="${s.type === 'institusi' ? 'Nama unit (opsional)' : s.type === 'fakultas' ? 'mis. Fakultas Syariah dan Hukum / Jurusan Keperawatan' : s.type === 'prodi' ? 'mis. Hukum Keluarga Islam' : 'mis. Program Pascasarjana'}">
      ${s.type === 'prodi' ? `<select class="inp" data-site="${i}|jenjang"><option value="">— jenjang —</option>${JENJANG_PRODI.map(j => `<option ${s.jenjang === j ? 'selected' : ''}>${esc(j)}</option>`).join('')}</select>` : '<span></span>'}
      <button class="btn sm danger" data-act="siteDel" data-i="${i}" ${p.sites.length < 2 ? 'disabled' : ''} title="Hapus site">✕</button>
    </div>`).join('');
  return `<h3 style="margin-top:18px">Site audit</h3>
    <p class="sub" style="margin-bottom:8px">Unit yang diaudit. Tambahkan lebih dari satu bila audit mencakup beberapa fakultas/prodi.</p>
    ${rows}<button class="btn sm" data-act="siteAdd" style="margin-top:6px">+ Tambah site</button>`;
}
function rumpunHTML(p){
  return `<h3 style="margin-top:18px">Rumpun ilmu</h3>
    <p class="sub" style="margin-bottom:8px">Sesuai UU No. 12 Tahun 2012 Pasal 10. Pilih satu atau lebih cabang ilmu yang diselenggarakan pada site audit.</p>
    ${RUMPUN.map(g => `<div class="rg"><div class="rg-t">${esc(g.t)}</div><div class="chips">${g.c.map(c => `<button class="chip ${p.rumpunList.includes(c) ? 'on' : ''}" data-act="rumpun" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`).join('')}`;
}

/* ---------------- view: checklist ---------------- */
function navHTML(a, st){
  let html = `<div class="navtools"><select class="inp" data-act="navfilter">
      <option value="all" ${NAV_FILTER === 'all' ? 'selected' : ''}>Semua klausul</option>
      <option value="todo" ${NAV_FILTER === 'todo' ? 'selected' : ''}>Belum selesai dinilai</option>
      <option value="find" ${NAV_FILTER === 'find' ? 'selected' : ''}>Ada temuan</option>
      <option value="chg" ${NAV_FILTER === 'chg' ? 'selected' : ''}>Berubah 2018 ↔ 2025</option>
      ${isQ9(a) ? `<option value="q9" ${NAV_FILTER === 'q9' ? 'selected' : ''}>Ada butir tambahan ISO 9001</option>` : ''}</select></div>`;
  for (const g of GROUPS) {
    const cls = activeClauses(a).filter(c => c.g === g.id).filter(c => {
      const s = st.per[c.k];
      if (NAV_FILTER === 'todo') return s.none > 0;
      if (NAV_FILTER === 'find') return s.MAJ + s.MIN + s.OBS + s.OFI > 0;
      if (NAV_FILTER === 'chg') return !/^Substansi sama/.test(c.chg || '');
      if (NAV_FILTER === 'q9') return !isQ9(a) || c.cond === 'q9' || itemsFor(c, a).some(it => it.q9);
      return true;
    });
    if (!cls.length) continue;
    html += `<div class="gh">${g.id === 'A' ? '' : g.id + '. '}${esc(g.t)}</div>`;
    for (const c of cls) {
      const s = st.per[c.k];
      const dot = s.MAJ ? 'maj' : s.MIN ? 'min' : s.OBS ? 'obs' : s.OFI ? 'ofi' : '';
      const done = s.none === 0;
      html += `<button class="${c.k === CUR_CLAUSE ? 'on' : ''}" data-act="clause" data-k="${c.k}" title="${esc(cno(a, c) + ' ' + c.t + (isQ9(a) && c.cond !== 'q9' ? ' — ISO 9001: ' + (q9no(c) || 'tidak ada padanan') : ''))}">
        <span class="no">${esc(cno(a, c))}</span><span class="tt">${esc(c.t)}</span><span class="dot ${dot}"></span>
        <span class="ct ${done ? 'done' : ''}">${done ? '✓' : (s.total - s.none) + '/' + s.total}</span></button>`;
    }
  }
  return html;
}
function guideHTML(a, cl, it){
  const g = guideFor(cl, it.i); if (!g) return '';
  const keys = evKeys(a, cl), ref = cl.k + '|' + it.i;
  const docs = filterTagged(g[0], keys);
  const li = (txt, kind) => `<li><span>${ea(txt)}</span><button class="add" data-act="addnote" data-ref="${ref}" data-kind="${kind}" data-v="${esc(txt)}" title="Salin ke catatan bukti">＋</button></li>`;
  const box = (cls, open, title, sub, list) => list.length ? `<details class="gd ${cls}" ${open ? 'open' : ''}><summary>${title} <small>${sub ? sub + ' · ' : ''}${list.length}</small></summary><ul>${list.join('')}</ul></details>` : '';
  return `<div class="gds">
    ${box('gd-doc', UI.gdDoc, '📄 Dokumen/bukti yang diperiksa', '', docs.map(d => `<li><span>${d.tag ? `<em class="tg">${esc(EV_LABEL[d.tag])}</em> ` : ''}${ea(d.t)}</span><button class="add" data-act="addnote" data-ref="${ref}" data-kind="doc" data-v="${esc(d.t)}" title="Tandai sudah diperiksa (salin ke catatan)">✓</button></li>`))}
    ${box('gd-tek', UI.gdTek, '🛠 Pertanyaan teknis', 'pemilik proses/pengelola', g[1].map(q => li(q, 'q')))}
    ${box('gd-ops', UI.gdOps, '👥 Pertanyaan operasional', 'pelaksana/peserta didik/verifikasi lapangan', g[2].map(q => li(q, 'q')))}
  </div>`;
}
function critHTML(cl, it, cur){
  const c = critFor(cl, it); if (!c) return '';
  const rows = CRIT_ORDER.map(k => {
    const blocked = it.should && (k === 'MIN' || k === 'MAJ');
    return `<div class="kr-row ${CAT[k].cls} ${cur === k ? 'on' : ''} ${blocked ? 'off' : ''}" ${blocked ? '' : `data-act="cat" data-k="${cl.k}" data-i="${it.i}" data-v="${k}" title="Klik untuk memilih ${esc(CAT[k].t)}"`}>
      <span class="b ${CAT[k].cls}">${esc(CAT[k].s)}</span><span>${ea(c[k])}</span></div>`;
  }).join('');
  return `<details class="kr" ${UI.critOpen ? 'open' : ''}><summary>Panduan penilaian — kapan memilih kategori${cur ? ` · terpilih: <b>${esc(CAT[cur].t)}</b>` : ''}</summary><div class="kr-b">${rows}</div></details>`;
}
/** Tinggi kotak catatan per pertanyaan: minimal 4 baris, bertambah 2 baris per baris teks (maks. 20) */
const noteRows = t => Math.min(20, Math.max(4, String(t || '').split('\n').length * 2));
function itemHTML(a, cl, it, n){
  const r = peekR(a, cl.k, it.i);
  const tags = (it.q9 ? '<span class="tag q9" title="Butir tambahan dari ISO 9001:2015">ISO 9001</span>' : '')
    + (it.v === '25' ? `<span class="tag v25">${it.q9 ? 'Bila ISO 21001:2025' : 'Khusus 2025'}</span>` : it.v === '18' ? `<span class="tag v18">${it.q9 ? 'Bila ISO 21001:2018' : 'Khusus 2018'}</span>` : '') + (it.should ? '<span class="tag s">Anjuran</span>' : '');
  const btns = KATEGORI.map(k => `<button class="cat ${k.cls} ${r.cat === k.id ? 'on' : ''}" data-act="cat" data-k="${cl.k}" data-i="${it.i}" data-v="${k.id}">${esc(k.t)}</button>`).join('');
  return `<div class="item ${r.cat ? CAT[r.cat].cls : ''}${it.q9 ? ' q9it' : ''}" id="it-${cl.k.replace(/\./g, '_')}-${it.i}">
    <div class="q"><span class="qn">${n}</span><div>${ea(it.text)}${tags}</div></div>
    ${guideHTML(a, cl, it)}
    <div class="cats">${btns}</div>
    ${critHTML(cl, it, r.cat)}
    <textarea class="inp" rows="${noteRows(r.bukti)}" data-item="${cl.k}|${it.i}|bukti" placeholder="Bukti objektif & catatan auditor (dokumen, rekaman, wawancara, observasi)…">${esc(r.bukti || '')}</textarea>
  </div>`;
}
/** Kotak padanan klausul ISO 9001 pada kepala klausul (mode terintegrasi) */
function q9MapHTML(cl){
  if (cl.cond === 'q9') return `<div class="q9map"><b>Khusus ISO 9001:2015.</b> Klausul ini tidak ada di ISO 21001. Pada layanan pendidikan, kegiatan pascapenyerahan meliputi layanan kepada lulusan setelah lulus.</div>`;
  const q = Q9_OF[cl.k];
  if (!q) return `<div class="q9map none"><b>Khusus ISO 21001.</b> Tidak ada padanan langsung di ISO 9001:2015; hasilnya dilaporkan sebagai bagian SMOP.</div>`;
  return `<div class="q9map"><b>Padanan ISO 9001:2015:</b> ${q.map(x => `<span class="q9n">${esc(x.n)}</span> ${esc(x.t)}`).join(' · ')}</div>`;
}
function vChecklist(a){
  const act = activeClauses(a);
  if (!a.profil.jenjang) return `<div class="card"><h2>Lengkapi profil terlebih dahulu</h2><p class="sub">Pilih jenjang/jenis organisasi pendidikan pada tab Profil Audit agar contoh bukti audit sesuai.</p><button class="btn pri" data-act="go" data-v="profil">Ke Profil Audit</button></div>`;
  if (!CUR_CLAUSE || !act.find(c => c.k === CUR_CLAUSE)) CUR_CLAUSE = act[0].k;
  const st = stats(a);
  const idx = act.findIndex(c => c.k === CUR_CLAUSE), cl = act[idx];
  const its = itemsFor(cl, a);
  const evs = evOf(cl);
  const ev = evKeys(a, cl).filter(k => evs[k]).map(k => `<li><span class="lb">${EV_LABEL[k]}:</span> ${ea(evs[k])}</li>`).join('');
  const s = st.per[cl.k];
  const prev = act[idx - 1], next = act[idx + 1];
  const unit = (a.res[cl.k] && a.res[cl.k].unit) || '';
  const otherV = a.versi === '18' ? '25' : '18';
  return `<div class="ck">
    <nav class="nav">${navHTML(a, st)}</nav>
    <section>
      <div class="card">
        <div class="chead"><span class="cno">${cl.cond === 'q9' ? esc(Q9_LABEL) + ' · ' + esc(cl.no[a.versi].replace(' (9001)', '')) : esc(verLabel(a.versi)) + ' · ' + esc(cno(a, cl))}</span>
          <div class="ctitle"><h2>${esc(cl.t)}</h2>
            <div class="note">${s.total - s.none}/${s.total} butir dinilai${cl.no[otherV] !== cl.no[a.versi] ? ' · di ' + verLabel(otherV) + ': klausul ' + esc(cl.no[otherV]) : ''}${cl.cond === 'abk' ? ' · klausul kebutuhan khusus' : ''}${its.some(it => it.q9) ? ' · ' + its.filter(it => it.q9).length + ' butir tambahan ISO 9001' : ''}</div></div>
          <div class="row" style="gap:6px">          <button class="btn sm" data-act="gdTgl" data-v="gdDoc" title="Buka/tutup semua kotak dokumen sekaligus">📄 ${UI.gdDoc ? 'Tutup' : 'Buka'} dokumen</button>
          <button class="btn sm" data-act="gdTgl" data-v="gdTek" title="Buka/tutup semua kotak pertanyaan teknis sekaligus">🛠 ${UI.gdTek ? 'Tutup' : 'Buka'} pertanyaan teknis</button>
          <button class="btn sm" data-act="gdTgl" data-v="gdOps" title="Buka/tutup semua kotak pertanyaan operasional sekaligus">👥 ${UI.gdOps ? 'Tutup' : 'Buka'} pertanyaan operasional</button>
          <button class="btn sm" data-act="critAll">${UI.critOpen ? 'Tutup' : 'Buka'} panduan penilaian</button>
          <button class="btn sm" data-act="allc" data-k="${cl.k}" title="Isi semua butir yang belum dinilai dengan Sesuai">Belum dinilai → Sesuai</button></div></div>
        ${cl.chg && !/^Substansi sama/.test(cl.chg) ? `<div class="chg"><b>Perbedaan 2018 ↔ 2025:</b> ${ea(cl.chg)}</div>` : ''}
        ${isQ9(a) ? q9MapHTML(cl) : ''}
        ${ev ? `<div class="evid"><h4>Contoh bukti objektif — ${esc(jenjangText(a))}${siteText(a) ? ' · ' + esc(siteText(a)) : ''}</h4><ul>${ev}</ul>${a.profil.madrasah && cl.g !== 'A' ? '<div class="note" style="margin-top:4px">Madrasah: sesuaikan Dapodik → EMIS, e-Rapor → RDM, Dinas → Kemenag.</div>' : ''}</div>` : ''}
        <div style="margin-top:12px"><label class="f">Unit / auditee / personel yang diwawancarai pada klausul ini</label>
          <input class="inp" data-unit="${cl.k}" value="${esc(unit)}" placeholder="mis. Wakasek Kurikulum; Kaprodi; Bagian Akademik"></div>
        ${its.map((it, n) => itemHTML(a, cl, it, n + 1)).join('')}
        <div class="pager">
          ${prev ? `<button class="btn" data-act="clause" data-k="${prev.k}">← ${esc(cno(a, prev))} ${esc(prev.t)}</button>` : '<span></span>'}
          ${next ? `<button class="btn pri" data-act="clause" data-k="${next.k}">${esc(cno(a, next))} ${esc(next.t)} →</button>` : `<button class="btn pri" data-act="go" data-v="temuan">Ke Daftar Temuan →</button>`}
        </div>
      </div>
    </section></div>`;
}

/* ---------------- view: per site ---------------- */
let CUR_SITE = null;
function siteCount(a, b){
  const s = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:b.its.length };
  b.its.forEach(it => { const c = peekR(a, b.cl.k, it.i).cat; if (c && s[c] !== undefined) s[c]++; else s.none++; });
  return s;
}
function vSite(a){
  const r = RC(a), blocks = siteBlocks(a);
  if (!CUR_SITE || !blocks.find(b => b.cl.k === CUR_SITE)) CUR_SITE = blocks[0].cl.k;
  const bi = blocks.findIndex(b => b.cl.k === CUR_SITE), b = blocks[bi], st = b.src;
  const nav = `<div class="gh">Rencana audit per site</div>` + blocks.map(bb => {
    const s = siteCount(a, bb), dot = s.MAJ ? 'maj' : s.MIN ? 'min' : s.OBS ? 'obs' : s.OFI ? 'ofi' : '', done = s.none === 0;
    return `<button class="${bb.cl.k === CUR_SITE ? 'on' : ''}" data-act="site" data-k="${esc(bb.cl.k)}" title="${esc(bb.cl.t)}">
      <span class="no">${esc(bb.cl.ind ? 'Situs' : bb.src.no.replace(/^Site\s*/i, 'S'))}</span><span class="tt">${esc(bb.cl.ind ? 'Potensi temuan situs' : bb.src.nama)}</span><span class="dot ${dot}"></span>
      <span class="ct ${done ? 'done' : ''}">${done ? '✓' : (s.total - s.none) + '/' + s.total}</span></button>`;
  }).join('');
  const s = siteCount(a, b);
  const rows = b.its.map((it, n) => {
    const x = b.cl.ind ? r.indikasi.rows[n] : st.rows[n], rr = peekR(a, b.cl.k, it.i);
    const q9 = !b.cl.ind && /\[9001\]/.test(x.q);
    const qText = b.cl.ind ? mdInline(x.t) : ea(String(x.q).replace(/\[9001\]\s*/g, ''));
    const meta = b.cl.ind
      ? `<div class="smeta"><b>Site:</b> ${esc(x.site || '—')} · <b>Perkiraan kategori:</b> ${esc(x.kat || '—')}</div><div class="smeta"><b>Verifikasi saat audit:</b> ${esc(x.v || '—')}</div>`
      : `<div class="smeta"><b>Bukti / sampel yang diminta:</b> ${ea(x.b || '—')}</div>`;
    const btns = KATEGORI.map(k => `<button class="cat ${k.cls} ${rr.cat === k.id ? 'on' : ''}" data-act="cat" data-k="${esc(b.cl.k)}" data-i="${it.i}" data-v="${k.id}">${esc(k.t)}</button>`).join('');
    return `<div class="item ${rr.cat ? CAT[rr.cat].cls : ''}" id="it-${esc(b.cl.k.replace(/\./g, '_'))}-${it.i}">
      <div class="q"><span class="qn">${n + 1}</span><div><span class="sref">${esc(x.k)}</span>${q9 ? '<span class="tag q9">ISO 9001</span>' : ''}<div style="margin-top:4px">${qText}</div></div></div>
      ${meta}
      ${siteGuideHTML(b.cl.k, it.i, x)}
      <div class="cats">${btns}</div>
      ${siteCritHTML(b.cl.k, it.i, x, rr.cat)}
      <textarea class="inp" rows="${noteRows(rr.bukti)}" data-item="${esc(b.cl.k)}|${it.i}|bukti" placeholder="Catatan auditor: bukti objektif, dokumen & nomor, personel yang diwawancarai…">${esc(rr.bukti || '')}</textarea>
    </div>`;
  }).join('');
  const hasGuide = (b.cl.ind ? r.indikasi.rows : st.rows).some(x => (x.tek && x.tek.length) || (x.ops && x.ops.length) || x.kr);
  const tools = hasGuide ? `<div class="row" style="gap:6px;margin-top:10px">      <button class="btn sm" data-act="gdTgl" data-v="gdTek" title="Buka/tutup semua kotak pertanyaan teknis sekaligus">🛠 ${UI.gdTek ? 'Tutup' : 'Buka'} pertanyaan teknis</button>
      <button class="btn sm" data-act="gdTgl" data-v="gdOps" title="Buka/tutup semua kotak pertanyaan operasional sekaligus">👥 ${UI.gdOps ? 'Tutup' : 'Buka'} pertanyaan operasional</button>
      <button class="btn sm" data-act="critAll">${UI.critOpen ? 'Tutup' : 'Buka'} panduan penilaian</button></div>` : '';
  const prev = blocks[bi - 1], next = blocks[bi + 1];
  const info = b.cl.ind ? r.indikasi.intro : st.info;
  return `<div class="ck">
    <nav class="nav">${nav}</nav>
    <section><div class="card">
      <div class="chead"><span class="cno">${esc(b.cl.ind ? 'Ditelusuri dari situs' : st.no + (st.waktu ? ' · ' + st.waktu : ''))}</span>
        <div class="ctitle"><h2>${esc(b.cl.ind ? 'Potensi temuan dari situs resmi' : st.nama)}</h2>
          <div class="note">${s.total - s.none}/${s.total} ${b.cl.ind ? 'indikasi diverifikasi' : 'pertanyaan dinilai'} · ${esc(stdLabel(a))}</div></div></div>
      ${tools}
      ${r.petunjuk && bi === 0 ? `<details class="sinfo"><summary>Cara memakai pertanyaan per site</summary>${mdLite(r.petunjuk)}</details>` : ''}
      ${info ? `<div class="sinfo">${mdLite(info)}</div>` : ''}
      ${rows}
      ${b.cl.ind ? '' : siteNotesHTML(a, b.cl.k)}
      <div class="pager">
        ${prev ? `<button class="btn" data-act="site" data-k="${esc(prev.cl.k)}">← ${esc(prev.cl.t)}</button>` : '<span></span>'}
        ${next ? `<button class="btn pri" data-act="site" data-k="${esc(next.cl.k)}">${esc(next.cl.t)} →</button>` : `<button class="btn pri" data-act="go" data-v="temuan">Ke Daftar Temuan →</button>`}
      </div>
    </div></section></div>`;
}
/** Kotak pertanyaan teknis & operasional untuk satu pertanyaan per site (x.tek, x.ops) */
function siteGuideHTML(k, i, x){
  const ref = esc(k) + '|' + i;
  const li = q => `<li><span>${ea(q)}</span><button class="add" data-act="addnote" data-ref="${ref}" data-kind="q" data-v="${esc(q)}" title="Salin ke catatan">＋</button></li>`;
  const box = (cls, open, title, sub, list) => list && list.length ? `<details class="gd ${cls}" ${open ? 'open' : ''}><summary>${title} <small>${sub} · ${list.length}</small></summary><ul>${list.map(li).join('')}</ul></details>` : '';
  const h = box('gd-tek', UI.gdTek, '🛠 Pertanyaan teknis', 'pimpinan unit/pemilik proses', x.tek) + box('gd-ops', UI.gdOps, '👥 Pertanyaan operasional', 'staf/dosen/mahasiswa/cek lapangan', x.ops);
  return h ? `<div class="gds">${h}</div>` : '';
}
/** Panduan kapan memilih tiap kategori (x.kr = {C, OBS, OFI, MIN, MAJ, NA}); baris bisa diklik untuk memilih */
function siteKr(x){
  const kr = x.kr || {}, pick = (v, d) => (v && v !== '—') ? v : d;
  return { C:kr.C, OBS:kr.OBS, OFI:kr.OFI, MIN:pick(kr.MIN, CRIT_GEN.MAJ), MAJ:pick(kr.MAJ, CRIT_GEN.MAJ), NA:pick(kr.NA, CRIT_GEN.NA) };
}
function siteCritHTML(k, i, x, cur){
  if (!x.kr) return '';
  const c = siteKr(x);
  const rows = CRIT_ORDER.filter(t => c[t]).map(t => `<div class="kr-row ${CAT[t].cls} ${cur === t ? 'on' : ''}" data-act="cat" data-k="${esc(k)}" data-i="${i}" data-v="${t}" title="Klik untuk memilih ${esc(CAT[t].t)}">
      <span class="b ${CAT[t].cls}">${esc(CAT[t].s)}</span><span>${ea(c[t])}</span></div>`).join('');
  return `<details class="kr" ${UI.critOpen ? 'open' : ''}><summary>Panduan penilaian — kapan memilih kategori${cur ? ` · terpilih: <b>${esc(CAT[cur].t)}</b>` : ''}</summary><div class="kr-b">${rows}</div></details>`;
}
/* ---------------- laporan anggota tim untuk Lead Auditor ---------------- */
const SITE_NOTES = [['unit', 'Auditee / personel yang diwawancarai', 'mis. Ketua LPPM (Dr. …); Kepala Pusat Penelitian; 2 staf; 1 dosen penerima hibah', 2],
  ['baik', 'Praktik baik / kekuatan', 'Satu poin per baris', 2],
  ['kendala', 'Kendala atau keterbatasan audit', 'mis. dokumen X belum tersedia; auditee utama berhalangan; waktu kurang', 2],
  ['simpul', 'Kesimpulan auditor untuk site ini', 'mis. Sistem diterapkan, tetapi pemantauan sasaran belum efektif', 2],
  ['catatan', 'Catatan auditor lainnya (hal yang belum masuk ke pertanyaan mana pun)', 'mis. indikasi dari situs resmi yang perlu diverifikasi', 3]];
function siteNotesHTML(a, k){
  const r = a.res[k] || {};
  return `<div class="sinfo" style="margin-top:14px"><b>Catatan site (masuk ke laporan untuk Lead Auditor)</b>
    <div class="grid g2" style="margin-top:8px">${SITE_NOTES.map(([f, l, ph, n]) => `<div><label class="f">${l}</label><textarea class="inp" rows="${Math.max(n, Math.min(14, String(r[f] || '').split('\n').length * 2))}" data-snote="${esc(k)}|${f}" placeholder="${esc(ph)}">${esc(r[f] || '')}</textarea></div>`).join('')}</div></div>`;
}
/** Teks panduan kategori terpilih untuk satu temuan (dasar penetapan kategori) */
function findingCrit(a, f){
  if (f.cl.site) {
    const r = RC(a); if (!r) return '';
    const x = f.cl.ind ? r.indikasi.rows[f.it.i] : r.sites[f.cl.si].rows[f.it.i];
    return x && x.kr ? (siteKr(x)[f.r.cat] || '') : '';
  }
  const c = critFor(f.cl, f.it); return c ? (c[f.r.cat] || '') : '';
}
/** Contoh arah perbaikan (dari panduan OFI) sebagai petunjuk isian */
function findingHint(a, f){
  if (f.cl.site) {
    const r = RC(a); if (!r) return '';
    const x = f.cl.ind ? r.indikasi.rows[f.it.i] : r.sites[f.cl.si].rows[f.it.i];
    return x && x.kr && x.kr.OFI ? 'Contoh arah perbaikan: ' + x.kr.OFI : '';
  }
  const c = critFor(f.cl, f.it); return c && c.OFI ? 'Contoh arah perbaikan: ' + c.OFI : '';
}
const isKTSf = f => f.r.cat === 'MAJ' || f.r.cat === 'MIN';
const masukanOf = f => isKTSf(f) ? (f.r.masukan || '') : (f.r.tindakan || '');
function leadDefaultPelapor(a){
  const lines = (a.profil.auditors || '').split('\n').map(x => x.trim()).filter(Boolean);
  return lines.find(l => /\(B\)/.test(l)) || lines[lines.length - 1] || '';
}
function leadFileBase(a){ return ('Laporan Auditor ' + (a.kesimpulan.pelapor || leadDefaultPelapor(a) || '') + ' untuk Lead - ' + (a.profil.nama || 'Audit')).replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim(); }
function leadCardHTML(a){
  const k = a.kesimpulan, fs = findings(a);
  const blank = fs.filter(f => !masukanOf(f)).length, unconf = fs.filter(f => !f.r.konfirmasi).length;
  return `<div class="card"><h2>Laporan Anggota Tim untuk Lead Auditor</h2>
    <p class="sub">Laporan ringkas dari auditor anggota tim: site yang diaudit, kriteria, temuan beserta dasar kategori dan masukan perbaikan, praktik baik, cakupan klausul, dan hal yang perlu diteruskan ke Lead.</p>
    <div class="grid g2">
      <div><label class="f">Nama auditor pelapor</label>${inp('kesimpulan.pelapor', k.pelapor, leadDefaultPelapor(a) || 'Nama Anda')}</div>
      <div><label class="f">Penyimpangan dari rencana audit (jadwal, site, auditee)</label>${ta('kesimpulan.deviasi', k.deviasi, 'mis. Audit Fakultas Syariah dimulai 09.00 karena Dekan rapat; tidak ada perubahan lain', 2)}</div>
      <div style="grid-column:1/-1"><label class="f">Catatan untuk Lead Auditor (hal lintas site, pola sistemik, usulan untuk rapat penutupan)</label>${ta('kesimpulan.catatanLead', k.catatanLead, 'mis. Pola sasaran unit tanpa data capaian muncul di 4 site — usul dijadikan satu temuan sistemik 6.2', 3)}</div>
    </div>
    ${fs.length && (blank || unconf) ? `<p class="note" style="margin-top:8px">Belum lengkap: ${blank ? blank + ' temuan tanpa masukan perbaikan' : ''}${blank && unconf ? ' · ' : ''}${unconf ? unconf + ' temuan belum dicatat konfirmasinya' : ''} (isi di tab Temuan).</p>` : ''}
    <div class="row" style="margin-top:12px">
      <button class="btn pri" data-act="leadword">⬇ Laporan untuk Lead (Word)</button>
      <button class="btn" data-act="leadpdf">⎙ Cetak / PDF</button></div></div>`;
}
/** Kelompokkan temuan per site (site rencana, temuan situs per site, Lead/lainnya, checklist klausul) */
function leadGroups(a){
  const r = RC(a), fs = findings(a), groups = [];
  const sites = r ? r.sites : [];
  sites.forEach((st, si) => groups.push({ key:'S:' + st.id, title:st.no + ' — ' + st.nama, waktu:st.waktu, site:st, items:[] }));
  const lead = { key:'lead', title:'Untuk diteruskan ke Lead Auditor / auditor lain', items:[] };
  const kl = { key:'klausul', title:'Temuan dari checklist per klausul', items:[] };
  for (const f of fs) {
    if (f.cl.site && !f.cl.ind) { groups[f.cl.si].items.push(f); continue; }
    if (f.cl.ind) {
      const m = String(f.it.siteName || '').match(/^(\d+)/), g = m && groups[+m[1] - 1];
      (g || lead).items.push(f); continue;
    }
    kl.items.push(f);
  }
  return { groups, lead, kl };
}
/** Cakupan klausul ISO 9001:2015 dari pertanyaan per site yang sudah dinilai */
function leadCoverage(a){
  const r = RC(a); if (!r) return [];
  const hits = {};
  r.sites.forEach(st => st.rows.forEach((x, i) => {
    const c = peekR(a, 'S:' + st.id, i).cat; if (!c) return;
    const m = String(x.k || '').match(/9001\s+([0-9.,\s]+)/); if (!m) return;
    m[1].split(',').map(t => t.trim()).filter(Boolean).forEach(ref => { (hits[ref] = hits[ref] || new Set()).add(st.no.replace(/^Site\s*/i, 'S')); });
  }));
  return ISO9001.map(q => {
    const s = new Set();
    Object.keys(hits).forEach(ref => { if (ref === q.n || ref.startsWith(q.n + '.') || q.n.startsWith(ref + '.')) hits[ref].forEach(x => s.add(x)); });
    return { q, sites:[...s].sort() };
  });
}
function leadReportHTML(a, word){
  const p = a.profil, k = a.kesimpulan, fs = findings(a), r = RC(a);
  const pel = k.pelapor || leadDefaultPelapor(a);
  const kv = (l, v) => `<tr><td style="${RS.kv}">${l}</td><td style="${RS.kv2}">${v || '—'}</td></tr>`;
  const tgl = p.tglMulai ? fmtDate(p.tglMulai) + (p.tglSelesai && p.tglSelesai !== p.tglMulai ? ' s.d. ' + fmtDate(p.tglSelesai) : '') : '';
  const cnt = { MAJ:0, MIN:0, OBS:0, OFI:0 }; fs.forEach(f => { if (cnt[f.r.cat] !== undefined) cnt[f.r.cat]++; });
  const { groups, lead, kl } = leadGroups(a);
  let h = `<p style="${RS.h1}">LAPORAN HASIL AUDIT ANGGOTA TIM</p>
    <p style="text-align:center;font-size:11pt;margin:0">disampaikan kepada Ketua Tim Auditor (Lead Auditor)</p>
    <p style="text-align:center;font-size:11pt;margin:2pt 0 10pt">${esc(stdLong(a))}</p>`;
  h += `<p style="${RS.h2}">1. Informasi Audit</p><table style="${RS.tb}">
    ${kv('Organisasi', esc(p.nama))}${kv('Jenis audit', esc(p.jenisAudit))}${kv('Tanggal audit', esc(tgl))}
    ${kv('Kriteria audit', nl2br(p.kriteria || defKriteria(a)))}${kv('Ruang lingkup', nl2br(p.lingkup))}
    ${kv('Ketua tim auditor', esc(p.lead))}${kv('Auditor pelapor', esc(pel))}
    ${kv('Site yang diaudit pelapor', r ? r.sites.map(st => esc(st.no + ' — ' + st.nama + (st.waktu ? ' (' + st.waktu + ')' : ''))).join('<br>') : esc(siteText(a)))}</table>`;
  // ringkasan
  const sb = siteBlocks(a).filter(b => !b.cl.ind);
  let T = 0, D = 0; sb.forEach(b => b.its.forEach(it => { T++; if (peekR(a, b.cl.k, it.i).cat) D++; }));
  h += `<p style="${RS.h2}">2. Ringkasan</p>
    <table style="${RS.tb}"><tr>${['KTS Mayor', 'KTS Minor', 'Observasi', 'OFI', 'Pertanyaan dinilai'].map(x => `<th style="${RS.th};text-align:center">${x}</th>`).join('')}</tr>
    <tr>${['MAJ', 'MIN', 'OBS', 'OFI'].map(x => `<td style="${RS.tdc}"><b>${cnt[x]}</b></td>`).join('')}<td style="${RS.tdc}">${T ? D + ' dari ' + T + ' (' + Math.round(D / T * 100) + '%)' : '—'}</td></tr></table>`;
  if (sb.length) {
    h += `<table style="${RS.tb}"><thead><tr><th style="${RS.th}">Site</th><th style="${RS.th}">Auditee / personel diwawancarai</th>${['Dinilai', 'C', 'Obs', 'OFI', 'Mi', 'Ma', 'NA'].map(x => `<th style="${RS.th};text-align:center">${x}</th>`).join('')}</tr></thead>`;
    sb.forEach(b => { const s = siteCount(a, b), n = a.res[b.cl.k] || {};
      h += `<tr><td style="${RS.td}">${esc(b.cl.t)}</td><td style="${RS.td}">${nl2br(n.unit) || '—'}</td><td style="${RS.tdc}">${s.total - s.none}/${s.total}</td>${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA'].map(x => `<td style="${RS.tdc}">${s[x] || ''}</td>`).join('')}</tr>`; });
    h += `</table>`;
  }
  // temuan per site
  const fRow = f => {
    const crit = findingCrit(a, f), mas = masukanOf(f);
    return `<tr><td nowrap style="${RS.td};white-space:nowrap"><b>${f.id}</b><br>${catCell(f.r.cat)}</td>
      <td style="${RS.td}">${clauseRefHTML(a, f.cl, f.it)}</td>
      <td style="${RS.td}"><span style="font-size:8.5pt;color:#555">${f.cl.ind ? 'Indikasi di situs' : 'Persyaratan yang diperiksa'}: ${esc(mdPlain(f.it.text))}</span><br>${f.r.uraian ? nl2br(f.r.uraian) : '<i>Pernyataan temuan belum diisi.</i>'}${crit ? `<br><span style="font-size:8.5pt;color:#555"><b>Dasar kategori:</b> ${esc(crit)}</span>` : ''}${f.r.konfirmasi ? `<br><span style="font-size:8.5pt;color:#555"><b>Dikonfirmasi kepada:</b> ${esc(f.r.konfirmasi)}</span>` : ''}</td>
      <td style="${RS.td}">${nl2br(f.r.bukti) || '—'}</td>
      <td style="${RS.td}">${mas ? nl2br(mas) : '<i>—</i>'}</td></tr>`;
  };
  const fTable = items => `<table style="${RS.tb}"><thead><tr><th style="${RS.th};width:10%">No.</th><th style="${RS.th};width:13%">Klausul</th><th style="${RS.th};width:33%">Temuan</th><th style="${RS.th};width:22%">Bukti objektif</th><th style="${RS.th}">Masukan perbaikan</th></tr></thead>${items.map(fRow).join('')}</table>`;
  h += `<p style="${RS.h2}">3. Temuan dan Masukan Perbaikan per Site</p>`;
  if (!fs.length) h += `<p style="${RS.p}">Tidak ada temuan (KTS, Observasi, atau OFI) pada site yang diaudit.</p>`;
  groups.forEach(g => {
    const n = a.res[g.key] || {};
    h += `<p style="${RS.h3}">${esc(g.title)}${g.waktu ? ' <span style="font-weight:normal">— ' + esc(g.waktu) + '</span>' : ''}</p>`;
    h += g.items.length ? fTable(g.items) : `<p style="${RS.p}">Tidak ada temuan.</p>`;
    const bl = String(n.baik || '').split('\n').map(x => x.trim()).filter(Boolean);
    if (bl.length) h += `<p style="${RS.p}"><b>Praktik baik:</b></p><ul style="margin:0 0 6pt">${bl.map(x => `<li>${esc(x.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>`;
    if (n.kendala) h += `<p style="${RS.p}"><b>Kendala/keterbatasan audit:</b> ${nl2br(n.kendala)}</p>`;
    if (n.simpul) h += `<p style="${RS.p}"><b>Kesimpulan site:</b> ${nl2br(n.simpul)}</p>`;
    if (n.catatan) h += `<p style="${RS.p}"><b>Catatan auditor:</b> ${nl2br(n.catatan)}</p>`;
  });
  if (kl.items.length) h += `<p style="${RS.h3}">${esc(kl.title)}</p>` + fTable(kl.items);
  // diteruskan ke lead
  const leadInd = r && r.indikasi ? r.indikasi.rows.map((x, i) => ({ x, i, c:peekR(a, 'S:ind', i) })).filter(o => !/^\d/.test(String(o.x.site || ''))) : [];
  h += `<p style="${RS.h2}">4. Hal yang Perlu Diteruskan ke Lead Auditor</p>`;
  if (k.catatanLead) h += `<p style="${RS.p}">${nl2br(k.catatanLead)}</p>`;
  if (lead.items.length) h += fTable(lead.items);
  if (leadInd.length) {
    h += `<p style="${RS.p}">Indikasi dari penelusuran situs resmi yang berada di luar site pelapor (perlu diverifikasi auditor terkait):</p><table style="${RS.tb}"><thead><tr><th style="${RS.th};width:5%">No</th><th style="${RS.th}">Indikasi</th><th style="${RS.th};width:17%">Klausul</th><th style="${RS.th};width:20%">Verifikasi yang disarankan</th><th style="${RS.th};width:10%">Status</th></tr></thead>`;
    leadInd.forEach((o, n) => { h += `<tr><td style="${RS.tdc}">${n + 1}</td><td style="${RS.td}">${esc(mdPlain(o.x.t))}</td><td style="${RS.td}">${esc(o.x.k)}</td><td style="${RS.td}">${esc(o.x.v)}</td><td style="${RS.tdc}">${o.c.cat ? catCell(o.c.cat) : 'Belum diverifikasi'}</td></tr>`; });
    h += `</table>`;
  }
  if (!k.catatanLead && !lead.items.length && !leadInd.length) h += `<p style="${RS.p}">—</p>`;
  // cakupan klausul
  const cov = leadCoverage(a);
  if (cov.length && isQ9(a)) {
    const miss = cov.filter(c => !c.sites.length).map(c => c.q.n);
    h += `<p style="${RS.h2}">5. Cakupan Klausul ISO 9001:2015 yang Diperiksa Pelapor</p>
      <p style="${RS.p}">Dihitung dari pertanyaan per site yang sudah dinilai. Klausul yang tidak diperiksa pelapor perlu dipastikan tercakup oleh auditor lain: ${miss.length ? esc(miss.join(', ')) : 'semua klausul tercakup'}.</p>
      <table style="${RS.tb}"><thead><tr><th style="${RS.th};width:45%">Klausul ISO 9001:2015</th><th style="${RS.th}">Site pelapor yang memeriksa</th></tr></thead>
      ${cov.map(c => `<tr><td style="${RS.td}"><b>${esc(c.q.n)}</b> ${esc(c.q.t)}</td><td style="${RS.td}">${c.sites.length ? esc(c.sites.join(', ')) : '<i>tidak diperiksa</i>'}</td></tr>`).join('')}</table>`;
  }
  // penyimpangan & catatan
  h += `<p style="${RS.h2}">${cov.length && isQ9(a) ? 6 : 5}. Penyimpangan dari Rencana Audit</p><p style="${RS.p}">${k.deviasi ? nl2br(k.deviasi) : 'Tidak ada penyimpangan dari rencana audit.'}</p>
    <p style="font-size:8.5pt;color:#555;margin:6pt 0">Catatan: KTS Mayor umumnya harus dikoreksi dan diverifikasi sebelum rekomendasi sertifikasi diberikan; KTS Minor memerlukan rencana tindakan korektif yang diterima dalam batas waktu yang ditetapkan lembaga sertifikasi. Observasi dan OFI tidak wajib ditindaklanjuti tetapi dianjurkan. Kategori akhir ditetapkan Lead Auditor.</p>`;
  const tglLap = k.tglLaporan ? fmtDate(k.tglLaporan) : (p.tglSelesai ? fmtDate(p.tglSelesai) : '');
  h += `<table style="width:100%;border-collapse:collapse;margin-top:14pt"><tr><td style="width:50%"></td>
    <td style="width:50%;text-align:center;vertical-align:top;padding:4pt">${esc(k.tempat || '…………')}, ${esc(tglLap || '…………………')}<br>Auditor pelapor<br><br><br><br><b><u>${esc(pel || '……………………………')}</u></b></td></tr></table>`;
  return h + glossaryAppendixHTML(h);
}
function siteSummaryCard(a){
  const rows = siteBlocks(a).map(b => { const s = siteCount(a, b);
    return `<tr><td><b>${esc(b.cl.t)}</b></td>${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA', 'none'].map(x => `<td class="n">${s[x] || ''}</td>`).join('')}</tr>`; }).join('');
  return `<div class="card"><h2>Hasil per Site</h2><p class="sub">Penilaian pertanyaan per site (tab Per Site). Temuan dari tab itu ikut masuk Daftar Temuan dan laporan.</p>
    <div style="overflow-x:auto"><table class="tb"><thead><tr><th>Site</th><th>Sesuai</th><th>Obs</th><th>OFI</th><th>Minor</th><th>Mayor</th><th>N/A</th><th>Belum</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
/** Tabel pertanyaan per site untuk laporan (blank=false) atau checklist cetak (blank=true) */
function siteTablesHTML(a, blank){
  const r = RC(a); if (!r) return '';
  let h = `<p style="${RS.h2}">${blank ? 'Pertanyaan audit per site' : 'Lampiran. Hasil audit per site'}</p>`;
  siteBlocks(a).forEach(b => {
    const st = b.src;
    h += `<table style="${RS.tb}"><thead><tr><th style="${RS.th}" colspan="5">${esc(b.cl.t)}${!b.cl.ind && st.waktu ? ' <span style="font-weight:normal">— ' + esc(st.waktu) + '</span>' : ''}</th></tr>
      <tr><th style="${RS.th};width:5%">No</th><th style="${RS.th};width:15%">Klausul</th><th style="${RS.th};width:42%">${b.cl.ind ? 'Indikasi di situs' : 'Pertanyaan audit'}</th><th style="${RS.th};width:${blank ? 14 : 9}%">Hasil</th><th style="${RS.th}">Catatan / bukti objektif</th></tr></thead>`;
    b.its.forEach((it, n) => {
      const x = b.cl.ind ? r.indikasi.rows[n] : st.rows[n], rr = peekR(a, b.cl.k, it.i);
      const sub = b.cl.ind ? (x.site ? 'Site: ' + x.site + '. ' : '') + (x.v ? 'Verifikasi: ' + x.v : '') : (x.b ? 'Bukti/sampel: ' + x.b : '');
      h += `<tr><td style="${RS.tdc}">${n + 1}</td><td style="${RS.td}">${esc(x.k)}</td><td style="${RS.td}">${esc(mdPlain(b.cl.ind ? x.t : x.q))}${sub ? '<br><span style="font-size:8.5pt;color:#555">' + esc(mdPlain(sub)) + '</span>' : ''}</td>
        <td style="${blank ? RS.td + ';font-size:8.5pt' : RS.tdc}">${blank ? '☐C ☐Obs ☐OFI<br>☐Mi ☐Ma ☐NA' : catCell(rr.cat)}</td><td style="${RS.td}">${blank ? '' : nl2br(rr.bukti)}</td></tr>`;
      if (blank) {
        const ul = arr => `<ul style="margin:0 0 3pt 14pt;padding:0">${arr.map(q => `<li style="margin:0">${esc(q)}</li>`).join('')}</ul>`;
        if (x.tek && x.tek.length) h += `<tr><td style="${RS.td}"></td><td style="${RS.td};font-size:8.5pt;background:#f4faf6" colspan="4"><b>Pertanyaan teknis</b> (pimpinan unit/pemilik proses):${ul(x.tek)}</td></tr>`;
        if (x.ops && x.ops.length) h += `<tr><td style="${RS.td}"></td><td style="${RS.td};font-size:8.5pt;background:#fdf8ef" colspan="4"><b>Pertanyaan operasional</b> (staf/dosen/mahasiswa/cek lapangan):${ul(x.ops)}</td></tr>`;
        if (x.kr) { const c = siteKr(x); h += `<tr><td style="${RS.td}"></td><td style="${RS.td};font-size:8.5pt;background:#fffdf5" colspan="4"><b>Panduan penilaian:</b><table style="width:100%;border-collapse:collapse;margin-top:2pt">${CRIT_ORDER.filter(t => c[t]).map(t =>
          `<tr><td style="border:0;padding:1pt 4pt 1pt 0;vertical-align:top;width:13%;font-size:8.5pt;color:${CAT_COLOR[t]}"><b>${esc(CAT[t].s)}</b></td><td style="border:0;padding:1pt 0;vertical-align:top;font-size:8.5pt">${esc(c[t])}</td></tr>`).join('')}</table></td></tr>`; }
      }
    });
    h += `</table>`;
  });
  return h;
}
function siteBlankHTML(a){
  const p = a.profil, r = RC(a);
  let h = `<p style="${RS.h1}">CHECKLIST AUDIT PER SITE</p><p style="text-align:center;margin:0 0 4pt">${esc(stdLong(a))}</p>
    <p style="text-align:center;margin:0 0 10pt"><b>${esc(p.nama || '')}</b> — ${esc(p.jenisAudit || '')}</p>
    <table style="${RS.tb}"><tr><td style="${RS.kv}">Tanggal audit</td><td style="${RS.kv2}">${esc(fmtDate(p.tglMulai))}${p.tglSelesai && p.tglSelesai !== p.tglMulai ? ' s.d. ' + esc(fmtDate(p.tglSelesai)) : ''}</td></tr>
    <tr><td style="${RS.kv}">Ketua tim auditor</td><td style="${RS.kv2}">${esc(p.lead)}</td></tr><tr><td style="${RS.kv}">Auditor</td><td style="${RS.kv2}">${nl2br(p.auditors)}</td></tr></table>
    <p style="font-size:9pt">Kategori: C = Sesuai, Obs = Observasi, OFI = Peluang Peningkatan, Mi = KTS Minor, Ma = KTS Mayor, NA = Tidak berlaku. [9001] = persyaratan khusus ISO 9001:2015.</p>`;
  if (r.petunjuk) h += `<p style="${RS.p};font-size:9.5pt">${nl2br(mdPlain(r.petunjuk))}</p>`;
  h += siteTablesHTML(a, true);
  return h + glossaryAppendixHTML(h);
}

/* ---------------- view: temuan ---------------- */
function vTemuan(a){
  const fs = findings(a);
  const { tot } = stats(a);
  if (!fs.length) return `<div class="card"><h2>Daftar Temuan</h2><p class="sub">Belum ada temuan (KTS Mayor, KTS Minor, Observasi, atau OFI). Temuan akan muncul otomatis dari hasil checklist.</p>
      <div class="stats">${statBoxes(tot)}</div></div>`;
  const cards = fs.map(f => {
    const r = f.r, k = f.cl.k, i = f.it.i, isKTS = r.cat === 'MAJ' || r.cat === 'MIN';
    const fld = (name, label, ph = '', rows = 2) => `<div><label class="f">${label}</label><textarea class="inp" rows="${rows}" data-item="${k}|${i}|${name}" placeholder="${esc(ph)}">${esc(r[name] || '')}</textarea></div>`;
    const fin = (name, label, type = 'text') => `<div><label class="f">${label}</label><input class="inp" type="${type}" data-item="${k}|${i}|${name}" value="${esc(r[name] || '')}"></div>`;
    return `<div class="fd">
      <div class="fd-h"><span class="id">${f.id}</span><span class="b ${CAT[r.cat].cls}">${esc(CAT[r.cat].t)}</span>
        <span class="note">${f.cl.site ? esc(f.cl.t) + (f.it.siteName ? ' (' + esc(f.it.siteName) + ')' : '') + ' — ' + esc(f.it.ref || '') : `Klausul ${esc(cno(a, f.cl))} — ${esc(f.cl.t)}${isQ9(a) && f.cl.cond !== 'q9' ? ' · ISO 9001: ' + esc(q9no(f.cl) || 'tidak ada padanan') : ''}${f.it.q9 ? ' · butir ISO 9001' : ''}`}</span><span class="spacer"></span>
        <button class="btn sm" data-act="jump" data-k="${esc(k)}" data-i="${i}">${f.cl.site ? "Lihat di Per Site" : "Lihat di checklist"}</button></div>
      <div class="q2">Butir: ${ea(f.it.text)}</div>
      <div class="grid g2">
        ${fld('uraian', 'Pernyataan temuan', 'Uraikan ketidaksesuaian/observasi secara jelas dan spesifik…', 3)}
        ${fld('bukti', 'Bukti objektif', '', 3)}
      </div>
      ${isKTS ? `<div class="grid g2" style="margin-top:10px">
        ${fld('masukan', 'Masukan perbaikan dari auditor (untuk laporan ke Lead)', findingHint(a, f) || 'Arah perbaikan yang disarankan auditor…')}
        ${fin('konfirmasi', 'Dikonfirmasi kepada auditee (nama/jabatan)')}
        ${fld('akar', 'Analisis akar masalah (diisi auditee)')}
        ${fld('koreksi', 'Koreksi (perbaikan segera)')}
        ${fld('tindakan', 'Tindakan korektif')}
        <div class="grid g3" style="gap:10px">${fin('pic', 'Penanggung jawab')}${fin('target', 'Target selesai', 'date')}
          <div><label class="f">Status</label><select class="inp" data-item="${k}|${i}|status">
            ${['Terbuka', 'Dalam proses', 'Selesai — menunggu verifikasi', 'Ditutup (terverifikasi)'].map(s => `<option ${r.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div>
      </div>` : `<div class="grid g2" style="margin-top:10px">${fld('tindakan', 'Saran / masukan perbaikan', findingHint(a, f), 2)}${fin('konfirmasi', 'Dikonfirmasi kepada auditee (nama/jabatan)')}</div>`}
    </div>`;
  }).join('');
  return `<div class="card"><h2>Daftar Temuan</h2><p class="sub">Temuan tersusun otomatis dari checklist, diurutkan dari KTS Mayor, KTS Minor, Observasi, lalu OFI.</p>
    <div class="stats">${statBoxes(tot)}</div></div>${cards}`;
}
function statBoxes(t){
  return [['C', 'Sesuai'], ['OBS', 'Observasi'], ['OFI', 'OFI'], ['MIN', 'KTS Minor'], ['MAJ', 'KTS Mayor'], ['NA', 'N/A']]
    .map(([k, l]) => `<div class="stat ${CAT[k].cls}"><div class="v">${t[k]}</div><div class="l">${l}</div></div>`).join('')
    + `<div class="stat"><div class="v">${t.none}</div><div class="l">Belum dinilai</div></div>`;
}

/* ---------------- view: laporan ---------------- */
/** Matriks hasil per klausul ISO 9001:2015 (gabungan hasil klausul checklist padanannya) */
function q9Matrix(a){
  const fs = findings(a), act = new Set(activeClauses(a).map(c => c.k));
  return ISO9001.map(q => {
    const ks = q.k.filter(k => act.has(k));
    const inRow = (k, i) => !q.it || !q.it[k] || q.it[k].some(x => String(x) === String(i));
    const s = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:0 };
    ks.forEach(k => itemsFor(CLAUSES.find(c => c.k === k), a).filter(it => inRow(k, it.i)).forEach(it => {
      const c = peekR(a, k, it.i).cat; s.total++;
      if (c && s[c] !== undefined) s[c]++; else s.none++;
    }));
    const ids = fs.filter(f => ks.includes(f.cl.k) && inRow(f.cl.k, f.it.i)).map(f => f.id);
    const cls = ks.map(k => CLAUSES.find(c => c.k === k)).map(c => c.cond === 'q9' ? '—' : cno(a, c));
    const status = !s.total ? 'Tidak dinilai' : s.MAJ ? 'KTS Mayor' : s.MIN ? 'KTS Minor' : s.none ? 'Belum lengkap' : s.OBS || s.OFI ? 'Sesuai, ada catatan' : s.NA === s.total ? 'N/A' : 'Sesuai';
    return { q, ks, s, ids, cls, status };
  });
}
const Q9_STATUS_CLS = { 'KTS Mayor':'maj', 'KTS Minor':'min', 'Belum lengkap':'na', 'Sesuai, ada catatan':'obs', 'Sesuai':'c', 'N/A':'na', 'Tidak dinilai':'na' };
function vLaporan(a){
  const st = stats(a), t = st.tot, k = a.kesimpulan;
  const p = pct(t);
  const rows = GROUPS.map(g => {
    const cls = activeClauses(a).filter(c => c.g === g.id); if (!cls.length) return '';
    const s = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:0 };
    cls.forEach(c => Object.keys(s).forEach(x => s[x] += st.per[c.k][x]));
    const pp = pct(s);
    const seg = ['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA'].map(x => s[x] ? `<i style="width:${s[x] / s.total * 100}%;background:var(--${CAT[x].cls})"></i>` : '').join('');
    return `<tr><td><b>${g.id === 'A' ? 'Lamp. A' : 'Klausul ' + g.id}</b> ${esc(g.t.replace(/^Lampiran A — /, ''))}</td>
      ${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA', 'none'].map(x => `<td class="n">${s[x] || ''}</td>`).join('')}
      <td class="n"><b>${pp === null ? '—' : pp + '%'}</b></td><td><div class="bar">${seg}</div></td></tr>`;
  }).join('');
  const rekOpts = Object.entries(REK_OPTS).map(([v, l]) => `<option value="${v}" ${k.rek === v ? 'selected' : ''}>${esc(l)}</option>`).join('');
  return `
  <div class="card"><div class="row"><div><h2>Ringkasan Hasil Audit</h2><p class="sub" style="margin:2px 0 0">${esc(a.profil.nama || '(tanpa nama)')} · ${esc(jenjangText(a))} · ${esc(stdLabel(a))}</p></div>
    <span class="spacer"></span><div style="text-align:right"><div style="font-size:28px;font-weight:800;color:var(--pri-ink)">${p === null ? '—' : p + '%'}</div><div class="note">tingkat kesesuaian*</div></div></div>
    <div class="stats" style="margin-top:12px">${statBoxes(t)}</div>
    <div style="overflow-x:auto;margin-top:14px"><table class="tb"><thead><tr><th>Klausul</th><th>Sesuai</th><th>Obs</th><th>OFI</th><th>Minor</th><th>Mayor</th><th>N/A</th><th>Belum</th><th>% Sesuai</th><th>Sebaran</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note" style="margin-top:8px">*% kesesuaian = (Sesuai + Observasi + OFI) ÷ (butir dinilai − N/A). ${t.none ? `<b style="color:var(--maj)">Masih ada ${t.none} butir belum dinilai.</b>` : ''}</p>
  </div>
  ${RC(a) ? siteSummaryCard(a) : ''}
  ${isQ9(a) ? `<div class="card"><h2>Matriks Hasil per Klausul ISO 9001:2015</h2>
    <p class="sub">Hasil butir checklist dikelompokkan menurut klausul ISO 9001:2015 padanannya. Matriks ini juga dicetak di laporan Word/PDF.</p>
    <div style="overflow-x:auto"><table class="tb"><thead><tr><th>ISO 9001</th><th>Klausul ISO 21001 di checklist</th><th>Sesuai</th><th>Obs</th><th>OFI</th><th>Minor</th><th>Mayor</th><th>Belum</th><th>Temuan</th><th>Status</th></tr></thead><tbody>
    ${q9Matrix(a).map(m => `<tr><td><b>${esc(m.q.n)}</b> ${esc(m.q.t)}</td><td>${esc(m.cls.join(', ') || '—')}</td>${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'none'].map(x => `<td class="n">${m.s[x] || ''}</td>`).join('')}<td>${esc(m.ids.join(', '))}</td><td style="white-space:nowrap"><span class="b ${Q9_STATUS_CLS[m.status]}">${esc(m.status)}</span></td></tr>`).join('')}
    </tbody></table></div></div>` : ''}

  <div class="card"><h2>Kesimpulan Audit</h2>
    <div class="grid">
      <div><label class="f">Ringkasan / kesimpulan umum</label>${ta('kesimpulan.ringkasan', k.ringkasan, 'mis. Secara umum SMOP telah ditetapkan dan diterapkan; komitmen pimpinan terlihat dari …', 3)}</div>
      <div><label class="f">Kekuatan / praktik baik yang ditemukan</label>${ta('kesimpulan.kekuatan', k.kekuatan, 'Satu poin per baris', 3)}</div>
      <div class="grid g2">
        <div><label class="f">Rekomendasi</label><select class="inp" data-bind="kesimpulan.rek">${rekOpts}</select>
          <div class="note" style="margin-top:6px" id="rekPrev">${esc(rekText(a))}</div></div>
        <div><label class="f">Catatan rekomendasi (opsional)</label>${ta('kesimpulan.catatanRek', k.catatanRek, 'mis. Tindakan korektif diserahkan paling lambat 30 hari setelah audit.', 3)}</div>
      </div>
      <div class="grid g2">
        <div><label class="f">Tempat penandatanganan laporan</label>${inp('kesimpulan.tempat', k.tempat, 'mis. Makassar')}</div>
        <div><label class="f">Tanggal laporan</label>${inp('kesimpulan.tglLaporan', k.tglLaporan, '', 'date')}</div>
      </div>
    </div></div>

  ${leadCardHTML(a)}
  <div class="card"><h2>Ekspor</h2>
    <div class="grid g2">
      <label class="chk"><input type="checkbox" id="optChecklist" checked><span><b>Lampirkan checklist lengkap</b><small>Seluruh butir beserta hasil penilaian dan bukti objektif.</small></span></label>
      <label class="chk"><input type="checkbox" id="optCAP" checked><span><b>Sertakan tabel rencana tindakan korektif</b><small>Akar masalah, koreksi, tindakan korektif, PIC, target, status.</small></span></label>
      <label class="chk"><input type="checkbox" id="optGuide" checked><span><b>Checklist kosong: sertakan panduan pemeriksaan</b><small>Dokumen yang diperiksa (dengan kotak centang), pertanyaan teknis, dan pertanyaan operasional di setiap butir.</small></span></label>
      <label class="chk"><input type="checkbox" id="optCrit" checked><span><b>Checklist kosong: sertakan panduan penilaian</b><small>Kriteria kapan memilih Sesuai, Observasi, OFI, KTS Minor, KTS Mayor, atau N/A di setiap butir.</small></span></label>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn pri" data-act="word">⬇ Unduh Laporan Word (.doc)</button>
      <button class="btn pri" data-act="pdf">⎙ Cetak / Simpan PDF</button>
      <button class="btn" data-act="blank">⬇ Checklist Kerja Kosong (Word)</button>
      ${RC(a) ? '<button class="btn" data-act="blanksite">⬇ Checklist per Site (Word)</button>' : ''}
      <span class="spacer"></span>
      <button class="btn" data-act="export">💾 Simpan File (.json)</button>
      <button class="btn" data-act="import">📂 Buka File (.json)</button>
    </div>
    <p class="note" style="margin-top:10px">PDF: pada dialog cetak pilih <b>Simpan sebagai PDF</b> / <b>Microsoft Print to PDF</b>. Word: file .doc dapat dibuka dan disunting di Microsoft Word, lalu disimpan sebagai .docx bila diperlukan.</p>
  </div>`;
}

/* ---------------- view: perbedaan versi ---------------- */
function vBeda(){
  const rows = CLAUSES.filter(c => c.chg && !/^Substansi sama/.test(c.chg)).map(c => {
    const add25 = c.items.map(parseItem).filter(x => x.v === '25').length, only18 = c.items.map(parseItem).filter(x => x.v === '18').length;
    return `<tr><td class="n">${esc(c.no['18'])}</td><td class="n">${esc(c.no['25'])}</td><td><b>${esc(c.t)}</b><div>${ea(c.chg)}</div></td>
      <td class="n">${add25 || ''}</td><td class="n">${only18 || ''}</td></tr>`;
  }).join('');
  return `<div class="card"><h2>Perbedaan ISO 21001:2018 dan ISO 21001:2025</h2>
    <p class="sub">Ringkasan perubahan yang tercermin pada butir checklist. Berguna untuk audit transisi. ISO 21001:2025 (diadopsi identik sebagai SNI ISO 21001:2025) merevisi edisi 2018 dan menggabungkan Amandemen 1:2024 tentang aksi perubahan iklim; perubahan utama lainnya adalah revisi narasi asesmen agar mencerminkan praktik terbaik asesmen pendidikan.</p>
    <div style="overflow-x:auto"><table class="tb"><thead><tr><th>2018</th><th>2025</th><th>Klausul & perubahan</th><th>Butir baru 2025</th><th>Butir khusus 2018</th></tr></thead><tbody>${rows}</tbody></table></div></div>
  <div class="card"><h2>Pemetaan ISO 9001:2015 ↔ ISO 21001</h2>
    <p class="sub">Dipakai pada audit terintegrasi (centang <b>ISO 9001:2015</b> di Profil Audit). ISO 21001 disusun di atas kerangka ISO 9001, sehingga sebagian besar persyaratan ISO 9001 sudah tercakup oleh butir ISO 21001. Persyaratan ISO 9001 yang belum tercakup ditambahkan sebagai <b>butir tambahan ISO 9001</b>. Istilah <i>pelanggan</i> di ISO 9001 dipadankan dengan peserta didik dan penerima manfaat lain; <i>produk dan jasa</i> dipadankan dengan produk dan layanan pendidikan.</p>
    <div style="overflow-x:auto"><table class="tb"><thead><tr><th>ISO 9001:2015</th><th>Klausul ISO 21001 (2018 / 2025)</th><th>Butir tambahan ISO 9001</th></tr></thead><tbody>
    ${ISO9001.map(q => {
      const cls = q.k.map(k => CLAUSES.find(c => c.k === k));
      const nAdd = cls.reduce((n, c) => n + (c.cond === 'q9' ? c.items.length : (c.q9items || []).length), 0);
      return `<tr><td><b>${esc(q.n)}</b> ${esc(q.t)}</td><td>${cls.map(c => c.cond === 'q9' ? '<i>tidak ada — klausul khusus ISO 9001</i>' : esc(c.no['18'] === c.no['25'] ? c.no['18'] : c.no['18'] + ' / ' + c.no['25']) + ' ' + esc(c.t)).join('<br>')}</td><td class="n">${nAdd || ''}</td></tr>`;
    }).join('')}
    </tbody></table></div>
    <p class="note" style="margin-top:8px">Klausul khusus ISO 21001 tanpa padanan langsung di ISO 9001: ${esc(CLAUSES.filter(c => c.cond !== 'q9' && !Q9_OF[c.k]).map(c => c.no['25']).join(', '))}.</p></div>`;
}

/* =====================================================================
   LAPORAN (Word & PDF)
   ===================================================================== */
const RS = {
  h1:'font-size:16pt;font-weight:bold;text-align:center;margin:0 0 4pt',
  h2:'font-size:12.5pt;font-weight:bold;margin:16pt 0 6pt;color:#1f4e79;border-bottom:1px solid #1f4e79;padding-bottom:2pt',
  h3:'font-size:11pt;font-weight:bold;margin:10pt 0 4pt',
  tb:'width:100%;border-collapse:collapse;margin:4pt 0 8pt',
  th:'border:1px solid #808080;padding:4pt 5pt;background:#dce6f1;font-weight:bold;text-align:left;vertical-align:top;font-size:9.5pt',
  td:'border:1px solid #808080;padding:4pt 5pt;vertical-align:top;font-size:9.5pt',
  tdc:'border:1px solid #808080;padding:4pt 5pt;vertical-align:top;text-align:center;font-size:9.5pt',
  kv:'border:1px solid #808080;padding:4pt 6pt;vertical-align:top;font-size:10pt;width:32%;background:#f2f2f2;font-weight:bold',
  kv2:'border:1px solid #808080;padding:4pt 6pt;vertical-align:top;font-size:10pt',
  p:'margin:0 0 6pt;text-align:justify'
};
const CAT_COLOR = { C:'#1e7f4f', OBS:'#9a6b00', OFI:'#2b6cb0', MIN:'#c25a12', MAJ:'#b42318', NA:'#667085' };
function catCell(c){ return c ? `<b style="color:${CAT_COLOR[c]}">${esc(CAT[c].s)}</b>` : '<span style="color:#999">—</span>'; }
function pageBreak(word){ return word ? '<br clear="all" style="page-break-before:always">' : '<div style="break-before:page;page-break-before:always"></div>'; }

function reportHTML(a, opt){
  const p = a.profil, st = stats(a), t = st.tot, fs = findings(a), k = a.kesimpulan;
  const auditors = (p.auditors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const kv = (l, v) => `<tr><td style="${RS.kv}">${l}</td><td style="${RS.kv2}">${v || '—'}</td></tr>`;
  const tgl = p.tglMulai ? fmtDate(p.tglMulai) + (p.tglSelesai && p.tglSelesai !== p.tglMulai ? ' s.d. ' + fmtDate(p.tglSelesai) : '') : '';
  let h = '';
  h += `<p style="${RS.h1}">${isQ9(a) ? 'LAPORAN AUDIT TERINTEGRASI' : 'LAPORAN AUDIT'}</p>
    <p style="text-align:center;font-size:12pt;font-weight:bold;margin:0">${isQ9(a) ? 'SISTEM MANAJEMEN MUTU (SMM) DAN<br>' : ''}SISTEM MANAJEMEN ORGANISASI PENDIDIKAN (SMOP)</p>
    <p style="text-align:center;font-size:11pt;margin:2pt 0 2pt">${esc(stdLong(a))}</p>
    <p style="text-align:center;font-size:12pt;font-weight:bold;margin:6pt 0 12pt">${esc(p.nama || '(Nama organisasi)')}</p>`;

  h += `<p style="${RS.h2}">1. Informasi Audit</p><table style="${RS.tb}">
    ${kv('Nomor laporan', esc(p.noLaporan))}
    ${kv('Organisasi / satuan pendidikan', esc(p.nama))}
    ${kv('Jenjang / jenis', esc(jenjangText(a)))}
    ${p.jenjang === 'pt' ? kv('Site audit', (p.sites || []).length ? siteText(a).split('; ').map(esc).join('<br>') : '') : ''}
    ${p.jenjang === 'pt' ? kv('Rumpun ilmu', rumpunText(a).split('; ').map(esc).join('<br>')) : ''}
    ${p.jenjang === 'pt' ? kv('Lembaga akreditasi', esc((p.lam || []).join(', ')) + (p.rumpun ? (p.lam && p.lam.length ? '<br>' : '') + esc(p.rumpun) : '')) : ''}
    ${kv(p.jenjang === 'pt' ? 'Kode PT' : 'NPSN / NSM', esc(p.kode))}
    ${kv('Alamat', esc(p.alamat))}
    ${kv('Standar acuan', esc(stdLong(a)))}
    ${kv('Jenis audit', esc(p.jenisAudit))}
    ${kv('Tanggal audit', esc(tgl))}
    ${kv('Lokasi / metode', esc(p.lokasi))}
    ${kv('Ketua tim auditor', esc(p.lead))}
    ${kv('Anggota tim auditor', auditors.map(esc).join('<br>'))}
    ${kv('Pimpinan auditee', esc(p.pimpinan) + (p.jabatanPimpinan ? ' (' + esc(p.jabatanPimpinan) + ')' : ''))}
    ${kv('Wakil manajemen / koordinator mutu', esc(p.wakil))}
  </table>`;

  h += `<p style="${RS.h2}">2. Tujuan, Kriteria, dan Ruang Lingkup</p>
    <p style="${RS.h3}">Tujuan audit</p><p style="${RS.p}">${nl2br(p.tujuan || defTujuan(a))}</p>
    <p style="${RS.h3}">Kriteria audit</p><p style="${RS.p}">${nl2br(p.kriteria || defKriteria(a))}</p>
    <p style="${RS.h3}">Ruang lingkup</p><p style="${RS.p}">${nl2br(p.lingkup) || '—'}</p>`;
  const exc = excludedClauses(a);
  if (exc.length) {
    const abk = exc.filter(c => c.cond === 'abk'), paud = exc.filter(c => c.cond === 'paud');
    h += `<p style="${RS.h3}">Persyaratan yang tidak diterapkan</p><table style="${RS.tb}"><tr><th style="${RS.th}">Klausul</th><th style="${RS.th}">Justifikasi</th></tr>`;
    if (abk.length) h += `<tr><td style="${RS.td}">${abk.map(c => esc(cno(a, c))).join(', ')}</td><td style="${RS.td}">${esc(p.justAbk || defJustAbk)}</td></tr>`;
    if (paud.length) h += `<tr><td style="${RS.td}">Lampiran A (${paud.map(c => esc(cno(a, c))).join(', ')})</td><td style="${RS.td}">${esc(p.justPaud || defJustPaud)}</td></tr>`;
    h += `</table>`;
  }

  // ringkasan
  const pp = pct(t);
  h += `<p style="${RS.h2}">3. Ringkasan Hasil</p>
    <table style="${RS.tb}"><tr>${['Sesuai', 'Observasi', 'OFI', 'KTS Minor', 'KTS Mayor', 'N/A', 'Belum dinilai', '% Kesesuaian'].map(x => `<th style="${RS.th};text-align:center">${x}</th>`).join('')}</tr>
    <tr>${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA', 'none'].map(x => `<td style="${RS.tdc}">${t[x]}</td>`).join('')}<td style="${RS.tdc}"><b>${pp === null ? '—' : pp + '%'}</b></td></tr></table>
    <table style="${RS.tb}"><tr><th style="${RS.th}">Klausul</th>${['Sesuai', 'Obs', 'OFI', 'Minor', 'Mayor', 'N/A', '% Sesuai'].map(x => `<th style="${RS.th};text-align:center">${x}</th>`).join('')}</tr>`;
  for (const g of GROUPS) {
    const cls = activeClauses(a).filter(c => c.g === g.id); if (!cls.length) continue;
    const s = { C:0, OBS:0, OFI:0, MIN:0, MAJ:0, NA:0, none:0, total:0 };
    cls.forEach(c => Object.keys(s).forEach(x => s[x] += st.per[c.k][x]));
    const q = pct(s);
    h += `<tr><td style="${RS.td}">${g.id === 'A' ? 'Lampiran A' : g.id + '. ' + esc(g.t)}</td>${['C', 'OBS', 'OFI', 'MIN', 'MAJ', 'NA'].map(x => `<td style="${RS.tdc}">${s[x] || ''}</td>`).join('')}<td style="${RS.tdc}">${q === null ? '—' : q + '%'}</td></tr>`;
  }
  h += `</table><p style="font-size:8.5pt;color:#555;margin:0 0 6pt">% kesesuaian = (Sesuai + Observasi + OFI) ÷ (butir dinilai − N/A).</p>`;
  if (isQ9(a)) {
    h += `<p style="${RS.h3}">Matriks hasil per klausul ISO 9001:2015</p><table style="${RS.tb}"><thead><tr><th style="${RS.th};width:34%">Klausul ISO 9001:2015</th><th style="${RS.th};width:17%">Klausul ISO 21001 (checklist)</th>${['C', 'Obs', 'OFI', 'Mi', 'Ma'].map(x => `<th style="${RS.th};text-align:center">${x}</th>`).join('')}<th style="${RS.th};width:14%">Temuan</th><th style="${RS.th};width:12%">Status</th></tr></thead>`;
    for (const m of q9Matrix(a)) h += `<tr><td style="${RS.td}"><b>${esc(m.q.n)}</b> ${esc(m.q.t)}</td><td style="${RS.td}">${esc(m.cls.join(', ') || '—')}</td>${['C', 'OBS', 'OFI', 'MIN', 'MAJ'].map(x => `<td style="${RS.tdc}">${m.s[x] || ''}</td>`).join('')}<td style="${RS.td}">${esc(m.ids.join(', '))}</td><td style="${RS.td}">${esc(m.status)}</td></tr>`;
    const only = activeClauses(a).filter(c => !Q9_OF[c.k]);
    h += `</table><p style="font-size:8.5pt;color:#555;margin:0 0 6pt">Klausul checklist tanpa padanan ISO 9001 (khusus ISO 21001): ${esc(only.map(c => cno(a, c)).join(', ') || '—')}. Hasilnya tercakup pada ringkasan per klausul di atas.</p>`;
  }

  // temuan
  h += `<p style="${RS.h2}">4. Daftar Temuan</p>`;
  if (!fs.length) h += `<p style="${RS.p}">Tidak terdapat temuan ketidaksesuaian, observasi, maupun peluang peningkatan.</p>`;
  else {
    h += `<table style="${RS.tb}"><thead><tr><th style="${RS.th};width:10%">No.</th><th style="${RS.th};width:10%">Kategori</th><th style="${RS.th};width:16%">Klausul</th><th style="${RS.th}">Pernyataan temuan</th><th style="${RS.th};width:28%">Bukti objektif</th></tr></thead>`;
    for (const f of fs) {
      h += `<tr><td nowrap style="${RS.td};white-space:nowrap"><b>${f.id}</b></td><td style="${RS.td}">${catCell(f.r.cat)}</td><td style="${RS.td}">${clauseRefHTML(a, f.cl, f.it)}<br><span style="font-size:8.5pt">${esc(f.cl.t)}${f.it.siteName ? ' (' + esc(f.it.siteName) + ')' : ''}</span>${f.it.q9 ? '<br><span style="font-size:8pt;color:#555">(butir ISO 9001)</span>' : ''}</td>
        <td style="${RS.td}">${f.r.uraian ? nl2br(f.r.uraian) : '<i>' + esc(f.it.text) + '</i>'}${f.r.cat === 'OBS' || f.r.cat === 'OFI' ? (f.r.tindakan ? '<br><b>Saran:</b> ' + nl2br(f.r.tindakan) : '') : ''}</td>
        <td style="${RS.td}">${nl2br(f.r.bukti) || '—'}</td></tr>`;
    }
    h += `</table>`;
    const kts = fs.filter(f => f.r.cat === 'MAJ' || f.r.cat === 'MIN');
    if (opt.cap && kts.length) {
      h += `<p style="${RS.h3}">Rencana tindakan korektif</p><table style="${RS.tb}"><thead><tr><th style="${RS.th};width:10%">No.</th><th style="${RS.th}">Akar masalah</th><th style="${RS.th}">Koreksi</th><th style="${RS.th}">Tindakan korektif</th><th style="${RS.th};width:12%">PIC</th><th style="${RS.th};width:12%">Target</th><th style="${RS.th};width:11%">Status</th></tr></thead>`;
      for (const f of kts) h += `<tr><td nowrap style="${RS.td};white-space:nowrap"><b>${f.id}</b></td><td style="${RS.td}">${nl2br(f.r.akar)}</td><td style="${RS.td}">${nl2br(f.r.koreksi)}</td><td style="${RS.td}">${nl2br(f.r.tindakan)}</td><td style="${RS.td}">${esc(f.r.pic)}</td><td style="${RS.td}">${esc(fmtDate(f.r.target))}</td><td style="${RS.td}">${esc(f.r.status || 'Terbuka')}</td></tr>`;
      h += `</table>`;
    }
  }

  // kekuatan & kesimpulan
  const kek = (k.kekuatan || '').split('\n').map(s => s.trim()).filter(Boolean);
  h += `<p style="${RS.h2}">5. Kekuatan dan Praktik Baik</p>` + (kek.length ? `<ul style="margin:0 0 6pt">${kek.map(x => `<li>${esc(x.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>` : `<p style="${RS.p}">—</p>`);
  h += `<p style="${RS.h2}">6. Kesimpulan dan Rekomendasi</p>
    ${k.ringkasan ? `<p style="${RS.p}">${nl2br(k.ringkasan)}</p>` : ''}
    <table style="${RS.tb}"><tr><td style="${RS.kv}">Rekomendasi</td><td style="${RS.kv2}"><b>${esc(rekText(a))}</b>${k.catatanRek ? '<br>' + nl2br(k.catatanRek) : ''}</td></tr></table>`;

  // pengesahan
  const tglLap = k.tglLaporan ? fmtDate(k.tglLaporan) : (p.tglSelesai ? fmtDate(p.tglSelesai) : '');
  h += `<p style="${RS.h2}">7. Pengesahan</p>
    <p style="${RS.p}">${esc(k.tempat || '…………')}, ${esc(tglLap || '…………………')}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:6pt"><tr>
      <td style="width:50%;text-align:center;vertical-align:top;padding:4pt">Ketua Tim Auditor<br><br><br><br><br><b><u>${esc(p.lead || '……………………………')}</u></b></td>
      <td style="width:50%;text-align:center;vertical-align:top;padding:4pt">${esc(p.jabatanPimpinan || 'Pimpinan Auditee')}<br><br><br><br><br><b><u>${esc(p.pimpinan || '……………………………')}</u></b></td>
    </tr></table>`;

  // lampiran checklist
  if (opt.checklist) {
    h += pageBreak(opt.word) + `<p style="${RS.h2}">Lampiran 1. Checklist Audit ${esc(stdLabel(a))}</p>`;
    for (const g of GROUPS) {
      const cls = activeClauses(a).filter(c => c.g === g.id); if (!cls.length) continue;
      h += `<p style="${RS.h3}">${g.id === 'A' ? '' : 'Klausul ' + g.id + ' — '}${esc(g.t)}</p>`;
      for (const cl of cls) {
        const unit = a.res[cl.k] && a.res[cl.k].unit;
        h += `<table style="${RS.tb}"><thead><tr><th style="${RS.th}" colspan="4">${esc(cno(a, cl))} ${esc(cl.t)}${q9HeadNote(a, cl)}${unit ? ' <span style="font-weight:normal">— Auditee: ' + esc(unit) + '</span>' : ''}</th></tr>
          <tr><th style="${RS.th};width:5%">No</th><th style="${RS.th};width:47%">Butir audit</th><th style="${RS.th};width:10%">Hasil</th><th style="${RS.th}">Bukti objektif / catatan</th></tr></thead>`;
        itemsFor(cl, a).forEach((it, n) => {
          const r = peekR(a, cl.k, it.i);
          h += `<tr><td style="${RS.tdc}">${n + 1}</td><td style="${RS.td}">${esc(it.text)}${it.should ? ' <i>(anjuran)</i>' : ''}${it.q9 ? ' <b style="color:#5b3cc4">[ISO 9001]</b>' : ''}</td><td style="${RS.tdc}">${catCell(r.cat)}</td><td style="${RS.td}">${nl2br(r.bukti)}</td></tr>`;
        });
        h += `</table>`;
      }
    }
  }
  if (RC(a)) h += pageBreak(opt.word) + siteTablesHTML(a, false);
  h += `<p style="${RS.h3}">Keterangan kategori</p><table style="${RS.tb}">
    ${[['Sesuai', 'Persyaratan dipenuhi dan diterapkan secara efektif, didukung bukti objektif.'],
       ['Observasi', 'Belum merupakan ketidaksesuaian, tetapi berpotensi menjadi ketidaksesuaian bila tidak ditangani.'],
       ['OFI', 'Peluang peningkatan: persyaratan telah dipenuhi, namun praktiknya dapat ditingkatkan.'],
       ['KTS Minor', 'Ketidakpenuhan sebagian/sesaat suatu persyaratan yang tidak mengganggu kemampuan SMOP mencapai hasil yang diharapkan.'],
       ['KTS Mayor', 'Tidak adanya atau gagalnya penerapan suatu persyaratan secara sistemik, atau ketidaksesuaian yang memengaruhi kemampuan SMOP mencapai hasil yang diharapkan.'],
       ['N/A', 'Persyaratan tidak berlaku pada ruang lingkup organisasi (dengan justifikasi).']]
      .map(([x, y]) => `<tr><td style="${RS.kv};width:18%">${x}</td><td style="${RS.kv2}">${y}</td></tr>`).join('')}</table>
    <p style="font-size:8.5pt;color:#555">Butir checklist merupakan parafrase persyaratan ${esc(stdLabel(a))}; bunyi persyaratan resmi merujuk pada dokumen standar.</p>`;
  return h + glossaryAppendixHTML(h);
}

/** Nomor klausul untuk laporan: "8.2.1" atau, pada audit terintegrasi, "ISO 21001: 8.2.1 / ISO 9001: 8.2.2, 8.2.3" */
function clauseRefHTML(a, cl, it){
  if (cl.site) return esc((it && it.ref) || '');
  if (!isQ9(a)) return esc(cno(a, cl));
  if (cl.cond === 'q9') return 'ISO 9001: ' + esc(cl.no[a.versi].replace(' (9001)', ''));
  return 'ISO 21001: ' + esc(cno(a, cl)) + '<br>ISO 9001: ' + esc(q9no(cl) || '—');
}
function q9HeadNote(a, cl){
  if (!isQ9(a) || cl.cond === 'q9') return '';
  return ' <span style="font-weight:normal;font-size:8.5pt">[ISO 9001: ' + (cl.cond === 'q9' ? 'khusus ISO 9001' : esc(q9no(cl) || 'tidak ada padanan')) + ']</span>';
}
function guideCellsHTML(a, cl, it){
  const g = guideFor(cl, it.i); if (!g) return [];
  const docs = filterTagged(g[0], evKeys(a, cl)).map(d => esc(d.t));
  const ul = arr => `<ul style="margin:0 0 3pt 14pt;padding:0">${arr.map(x => `<li style="margin:0">${x}</li>`).join('')}</ul>`;
  const box = arr => arr.map(x => `<p style="margin:0 0 0 14pt;text-indent:-11pt">☐ ${x}</p>`).join('');
  return [
    docs.length ? ['#f3f6fb', `<b>Dokumen/bukti yang diperiksa:</b>${box(docs)}`] : null,
    g[1].length ? ['#f4faf6', `<b>Pertanyaan teknis</b> (pemilik proses/pengelola):${ul(g[1].map(esc))}`] : null,
    g[2].length ? ['#fdf8ef', `<b>Pertanyaan operasional</b> (pelaksana/peserta didik/verifikasi lapangan):${ul(g[2].map(esc))}`] : null
  ].filter(Boolean);
}
function critCellHTML(cl, it){
  const c = critFor(cl, it); if (!c) return '';
  return `<b>Panduan penilaian:</b><table style="width:100%;border-collapse:collapse;margin-top:2pt">${CRIT_ORDER.map(k =>
    `<tr><td style="border:0;padding:1pt 4pt 1pt 0;vertical-align:top;width:13%;font-size:8.5pt;color:${CAT_COLOR[k]}"><b>${esc(CAT[k].s)}</b></td><td style="border:0;padding:1pt 0;vertical-align:top;font-size:8.5pt">${esc(c[k])}</td></tr>`).join('')}</table>`;
}
function blankChecklistHTML(a, withGuide, withCrit){
  let h = `<p style="${RS.h1}">CHECKLIST AUDIT ${esc(sysName(a))}</p><p style="text-align:center;margin:0 0 4pt">${esc(stdLong(a))}</p>
    <p style="text-align:center;margin:0 0 10pt"><b>${esc(a.profil.nama || '……………………………')}</b> — ${esc(jenjangText(a))}${siteText(a) ? '<br>Site: ' + esc(siteText(a)) : ''}</p>
    <table style="${RS.tb}"><tr><td style="${RS.kv}">Tanggal audit</td><td style="${RS.kv2}">${esc(fmtDate(a.profil.tglMulai)) || ''}</td></tr><tr><td style="${RS.kv}">Auditor</td><td style="${RS.kv2}">${esc(a.profil.lead)}</td></tr></table>
    <p style="font-size:9pt">Kategori: C = Sesuai, Obs = Observasi, OFI = Peluang Peningkatan, Mi = KTS Minor, Ma = KTS Mayor, NA = Tidak berlaku.</p>`;
  for (const g of GROUPS) {
    const cls = activeClauses(a).filter(c => c.g === g.id); if (!cls.length) continue;
    h += `<p style="${RS.h2}">${g.id === 'A' ? '' : g.id + '. '}${esc(g.t)}</p>`;
    for (const cl of cls) {
      const evs = evOf(cl);
      const ev = evKeys(a, cl).filter(x => evs[x]).map(x => EV_LABEL[x] + ': ' + esc(evs[x])).join('<br>');
      h += `<table style="${RS.tb}"><thead><tr><th style="${RS.th}" colspan="4">${esc(cno(a, cl))} ${esc(cl.t)}${q9HeadNote(a, cl)}</th></tr></thead>
        ${ev ? `<tr><td style="${RS.td};background:#f7f7f7;font-size:8.5pt" colspan="4"><b>Contoh bukti:</b><br>${ev}</td></tr>` : ''}
        <tr><td style="${RS.td}" colspan="4">Auditee/unit: </td></tr>
        <tr><th style="${RS.th};width:5%">No</th><th style="${RS.th};width:45%">Butir audit</th><th style="${RS.th};width:17%">Hasil</th><th style="${RS.th}">Bukti objektif / catatan</th></tr>`;
      itemsFor(cl, a).forEach((it, n) => {
        h += `<tr><td style="${RS.tdc}">${n + 1}</td><td style="${RS.td}">${esc(it.text)}${it.should ? ' <i>(anjuran)</i>' : ''}${it.q9 ? ' <b style="color:#5b3cc4">[ISO 9001]</b>' : ''}</td><td style="${RS.td};font-size:8.5pt">☐C ☐Obs ☐OFI<br>☐Mi ☐Ma ☐NA</td><td style="${RS.td}"></td></tr>`;
        if (withGuide) guideCellsHTML(a, cl, it).forEach(([bg, gc]) => { h += `<tr><td style="${RS.td}"></td><td style="${RS.td};font-size:8.5pt;background:${bg}" colspan="3">${gc}</td></tr>`; });
        if (withCrit) { const cc = critCellHTML(cl, it); if (cc) h += `<tr><td style="${RS.td}"></td><td style="${RS.td};font-size:8.5pt;background:#fffdf5" colspan="3">${cc}</td></tr>`; }
      });
      h += `</table>`;
    }
  }
  return h + glossaryAppendixHTML(h);
}

function fileBase(a, pre){ return (pre + ' ' + (a.profil.nama || 'Audit') + ' ' + stdLabel(a)).replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim(); }
function download(name, blob){
  const u = URL.createObjectURL(blob), l = document.createElement('a');
  l.href = u; l.download = name; document.body.appendChild(l); l.click();
  setTimeout(() => { URL.revokeObjectURL(u); l.remove(); }, 500);
}
function exportWord(a, body, base){
  // Word mengubah margin tabel menjadi spasi paragraf di setiap sel; jarak antartabel diganti paragraf pemisah.
  body = body.split('style="' + RS.tb + '"').join('style="width:100%;border-collapse:collapse;margin:0"')
    .replace(/<\/table>(?!\s*<\/td>)/g, '</table><p style="margin:0;font-size:6pt;line-height:8pt">&nbsp;</p>');
  const html =`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${esc(base)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page Section1{size:21.0cm 29.7cm;margin:2.0cm 2.0cm 2.0cm 2.0cm;mso-header-margin:1.0cm;mso-footer-margin:1.0cm}
div.Section1{page:Section1}
body{font-family:"Times New Roman",serif;font-size:11pt}
p.MsoNormal,li.MsoNormal,div.MsoNormal{margin:0cm;mso-para-margin:0cm;font-family:"Times New Roman",serif;font-size:11pt}
p{mso-margin-top-alt:0cm;mso-margin-bottom-alt:0cm}
li{margin-top:0cm;margin-bottom:0cm;mso-margin-top-alt:0cm;mso-margin-bottom-alt:0cm}
td p,th p{margin:0cm}
thead{display:table-header-group}
table{mso-table-layout-alt:fixed}
td,th{mso-border-alt:solid #808080 .5pt}
</style></head><body><div class="Section1">${body}</div></body></html>`;
  download(base + '.doc', new Blob(['﻿', html], { type:'application/msword' }));
  toast('Dokumen Word diunduh');
}
function printPDF(a, body, base){
  const pa = $('#printArea'); pa.innerHTML = body;
  const old = document.title; document.title = base;
  const done = () => { document.title = old; pa.innerHTML = ''; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => window.print(), 50);
}

/* ---------------- JSON simpan/buka ---------------- */
function exportJSON(a){
  download(fileBase(a, 'Data Audit') + '.json', new Blob([JSON.stringify({ app:'audit-iso21001', format:1, audit:a }, null, 1)], { type:'application/json' }));
  toast('File audit disimpan');
}
function importJSON(){
  const f = document.createElement('input'); f.type = 'file'; f.accept = '.json,application/json';
  f.onchange = () => {
    const file = f.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result); const au = d.audit || d;
        if (!au || !au.profil || !au.res) throw new Error('format');
        if (DB.audits[au.id] && !confirm('Audit dengan ID yang sama sudah ada. Timpa dengan isi file?')) au.id = uid();
        DB.audits[au.id] = au; DB.current = au.id; save(); VIEW = 'profil'; render(); toast('File audit dibuka');
      } catch (e) { alert('File tidak dapat dibaca sebagai data audit aplikasi ini.'); }
    };
    rd.readAsText(file);
  };
  f.click();
}

/* =====================================================================
   EVENT
   ===================================================================== */
function setPath(obj, path, val){ const ks = path.split('.'); let o = obj; while (ks.length > 1) o = o[ks.shift()]; o[ks[0]] = val; }

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT') return;
  const act = b.dataset.act, a = A();
  if (b.classList.contains('tab')) return;
  switch (act) {
    case 'new': newAudit(); CUR_CLAUSE = null; go('profil'); break;
    case 'open': openAudit(b.dataset.id); break;
    case 'dup': { const src = DB.audits[b.dataset.id]; const c = JSON.parse(JSON.stringify(src)); c.id = uid(); c.profil.nama = (c.profil.nama || 'Audit') + ' (salinan)'; c.created = c.updated = new Date().toISOString(); DB.audits[c.id] = c; persist(); cloudMarkDirty(c.id); render(); toast('Audit diduplikasi'); break; }
    case 'del': deleteAudit(b.dataset.id); break;
    case 'import': importJSON(); break;
    case 'go': go(b.dataset.v); break;
    case 'ver':
      if (a.versi !== b.dataset.v) {
        const has = Object.keys(a.res).length;
        if (has && !confirm('Ganti versi standar ke ' + verLabel(b.dataset.v) + '? Hasil butir yang sama tetap dipertahankan; butir khusus versi lain disembunyikan (tidak dihapus).')) break;
        a.versi = b.dataset.v; save(); render();
      } break;
    case 'jenjang': a.profil.jenjang = b.dataset.v; if (b.dataset.v !== 'pt') { a.profil.ptBentuk = ''; a.profil.ptPenyelenggara = ''; } if (b.dataset.v === 'tk' || b.dataset.v === 'pt') a.profil.madrasah = false; save(); render(); break;
    case 'bentuk': a.profil.ptBentuk = b.dataset.v; save(); render(); break;
    case 'clause': CUR_CLAUSE = b.dataset.k; render(); window.scrollTo(0, 0); break;
    case 'cat': {
      const clx = CLAUSES.find(c => c.k === b.dataset.k), itx = clx && itemAt(clx, b.dataset.i);
      if (itx && itx.should && (b.dataset.v === 'MIN' || b.dataset.v === 'MAJ')) { toast('Butir anjuran ("should") tidak dapat dinilai KTS — gunakan Observasi atau OFI'); break; }
      const r = getR(a, b.dataset.k, ixOf(b.dataset.i));
      r.cat = r.cat === b.dataset.v ? '' : b.dataset.v; save();
      const y = window.scrollY; render(); window.scrollTo(0, y); break;
    }
    case 'allc': {
      const cl = CLAUSES.find(c => c.k === b.dataset.k); let n = 0;
      itemsFor(cl, a).forEach(it => { const r = getR(a, cl.k, it.i); if (!r.cat) { r.cat = 'C'; n++; } });
      if (n) { save(); const y = window.scrollY; render(); window.scrollTo(0, y); toast(n + ' butir ditandai Sesuai'); } else toast('Semua butir sudah dinilai');
      break;
    }
    case 'jump': if (b.dataset.k.startsWith('S:')) { CUR_SITE = b.dataset.k; go('site'); } else { CUR_CLAUSE = b.dataset.k; go('checklist'); } setTimeout(() => { const el = document.getElementById('it-' + b.dataset.k.replace(/\./g, '_') + '-' + b.dataset.i); if (el) { el.scrollIntoView({ block:'center' }); el.style.boxShadow = '0 0 0 3px #ffd166'; } }, 30); break;
    case 'word': exportWord(a, reportHTML(a, { word:true, checklist:$('#optChecklist').checked, cap:$('#optCAP').checked }), fileBase(a, 'Laporan Audit')); break;
    case 'pdf': printPDF(a, reportHTML(a, { word:false, checklist:$('#optChecklist').checked, cap:$('#optCAP').checked }), fileBase(a, 'Laporan Audit')); break;
    case 'leadword': exportWord(a, leadReportHTML(a, true), leadFileBase(a)); break;
    case 'leadpdf': printPDF(a, leadReportHTML(a, false), leadFileBase(a)); break;
    case 'blanksite': exportWord(a, siteBlankHTML(a), fileBase(a, 'Checklist per Site')); break;
    case 'site': CUR_SITE = b.dataset.k; render(); window.scrollTo(0, 0); break;
    case 'blank': exportWord(a, blankChecklistHTML(a, $('#optGuide').checked, $('#optCrit').checked), fileBase(a, 'Checklist Audit')); break;
    case 'siteAdd': a.profil.sites.push({ type:'prodi', nama:'', jenjang:'' }); save(); { const y = window.scrollY; render(); window.scrollTo(0, y); } break;
    case 'siteDel': if (a.profil.sites.length > 1) { a.profil.sites.splice(+b.dataset.i, 1); save(); const y = window.scrollY; render(); window.scrollTo(0, y); } break;
    case 'rumpun': case 'lam': {
      const arr = act === 'rumpun' ? a.profil.rumpunList : a.profil.lam, v = b.dataset.v, ix = arr.indexOf(v);
      if (ix >= 0) arr.splice(ix, 1); else arr.push(v);
      b.classList.toggle('on', ix < 0); save(); break;
    }
    case 'gdTgl': UI[b.dataset.v] = !UI[b.dataset.v]; saveUI(); { const y = window.scrollY; render(); window.scrollTo(0, y); } break;
    case 'critAll': UI.critOpen = !UI.critOpen; saveUI(); { const y = window.scrollY; render(); window.scrollTo(0, y); } break;
    case 'addnote': {
      const [k, i] = b.dataset.ref.split('|'), r = getR(a, k, ixOf(i));
      const line = b.dataset.kind === 'doc' ? '✓ Diperiksa: ' + b.dataset.v : 'T: ' + b.dataset.v + '\nJ: ';
      r.bukti = (r.bukti ? r.bukti.replace(/\s+$/, '') + '\n' : '') + line; save();
      const tx = document.querySelector(`[data-item="${k}|${i}|bukti"]`);
      if (tx) { tx.value = r.bukti; tx.rows = noteRows(r.bukti); if (b.dataset.kind !== 'doc') { tx.focus(); tx.setSelectionRange(tx.value.length, tx.value.length); } }
      toast(b.dataset.kind === 'doc' ? 'Dokumen dicatat sebagai diperiksa' : 'Pertanyaan disalin ke catatan');
      break;
    }
    case 'export': exportJSON(a); break;
  }
});
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { if (!t.disabled) go(t.dataset.view); }));

function onField(e){
  const el = e.target;
  if (el.dataset.gl) {
    if (el.dataset.gl === 'q') GL_Q = el.value; else GL_CAT = el.value;
    const tb = $('#glBody'); if (tb) tb.innerHTML = glRows();
    return;
  }
  const a = A(); if (!a) return;
  if (el.dataset.bind) {
    const v = el.type === 'checkbox' ? el.checked : el.value;
    setPath(a, el.dataset.bind, v); save();
    if (el.type === 'checkbox' || el.tagName === 'SELECT') {
      if (el.dataset.bind === 'kesimpulan.rek') { const pv = $('#rekPrev'); if (pv) pv.textContent = rekText(a); }
      else { const y = window.scrollY; render(); window.scrollTo(0, y); }
    }
    if (el.dataset.bind === 'profil.nama') $('#cur').innerHTML = esc(a.profil.nama || '(Audit tanpa nama)') + '<span class="pill">' + stdLabel(a) + '</span>';
  } else if (el.dataset.item) {
    const [k, i, f] = el.dataset.item.split('|'); getR(a, k, ixOf(i))[f] = el.value; save();
  } else if (el.dataset.site) {
    const [i, f] = el.dataset.site.split('|'); a.profil.sites[+i][f] = el.value; save();
    if (f === 'type') { if (el.value !== 'prodi') a.profil.sites[+i].jenjang = ''; const y = window.scrollY; render(); window.scrollTo(0, y); }
  } else if (el.dataset.snote) {
    const [k, f] = el.dataset.snote.split('|'); a.res[k] = a.res[k] || { items:{}, unit:'' }; a.res[k][f] = el.value; save();
  } else if (el.dataset.unit) {
    a.res[el.dataset.unit] = a.res[el.dataset.unit] || { items:{}, unit:'' }; a.res[el.dataset.unit].unit = el.value; save();
  } else if (el.dataset.act === 'navfilter') {
    NAV_FILTER = el.value; render();
  }
}
document.addEventListener('input', e => { if (e.target.type !== 'checkbox' && e.target.tagName !== 'SELECT') onField(e); });
document.addEventListener('change', e => { if (e.target.type === 'checkbox' || e.target.tagName === 'SELECT' || e.target.type === 'date') onField(e); });

/* ---------------- tema ---------------- */
const ACCENTS = [
  { id:'navy', t:'Navy', c:'#1f4e79' }, { id:'toska', t:'Toska', c:'#0f766e' },
  { id:'hijau', t:'Hijau', c:'#2e7d32' }, { id:'ungu', t:'Ungu', c:'#5b3cc4' },
  { id:'marun', t:'Marun', c:'#8b1e3f' }, { id:'oranye', t:'Oranye', c:'#c2410c' },
  { id:'cokelat', t:'Cokelat', c:'#7c4a1e' }, { id:'grafit', t:'Grafit', c:'#374151' }
];
const MODES = [['light', '☀ Terang'], ['dark', '🌙 Gelap'], ['auto', '🖥 Sistem']];
const darkMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function applyTheme(){
  const m = UI.themeMode || 'light';
  const resolved = m === 'auto' ? (darkMQ && darkMQ.matches ? 'dark' : 'light') : m;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.setAttribute('data-accent', UI.accent || 'navy');
}
function renderThemePop(){
  const mode = UI.themeMode || 'light', acc = UI.accent || 'navy';
  $('#themePop').innerHTML = `<h4>Mode tampilan</h4>
    <div class="seg">${MODES.map(([v, l]) => `<button data-theme-mode="${v}" class="${mode === v ? 'on' : ''}">${l}</button>`).join('')}</div>
    <h4>Warna utama</h4>
    <div class="swatches">${ACCENTS.map(a => `<button class="sw ${acc === a.id ? 'on' : ''}" data-accent="${a.id}" title="${a.t}"><i style="background:${a.c}"></i>${a.t}</button>`).join('')}</div>
    <div class="note">Tema tersimpan di browser ini. Laporan Word/PDF tetap dicetak dengan warna standar.</div>`;
}
function toggleThemePop(open){
  const pop = $('#themePop'), btn = $('#themeBtn');
  const show = open === undefined ? pop.classList.contains('hidden') : open;
  if (show) renderThemePop();
  pop.classList.toggle('hidden', !show); btn.setAttribute('aria-expanded', String(show));
}
$('#themeBtn').addEventListener('click', e => { e.stopPropagation(); toggleThemePop(); });
$('#themePop').addEventListener('click', e => {
  e.stopPropagation();
  const m = e.target.closest('[data-theme-mode]'), s = e.target.closest('[data-accent]');
  if (m) UI.themeMode = m.dataset.themeMode;
  else if (s) UI.accent = s.dataset.accent;
  else return;
  saveUI(); applyTheme(); renderThemePop();
});
document.addEventListener('click', () => { if (!$('#themePop').classList.contains('hidden')) toggleThemePop(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleThemePop(false); });
if (darkMQ) { const f = () => { if ((UI.themeMode || 'light') === 'auto') applyTheme(); }; darkMQ.addEventListener ? darkMQ.addEventListener('change', f) : darkMQ.addListener(f); }
applyTheme();

/* ---------------- start ---------------- */
loadDB();
if (DB.current && !DB.audits[DB.current]) DB.current = null;
render();
setSaved(Object.keys(DB.audits).length ? 'Data dimuat dari browser' : '');
cloudInit();
