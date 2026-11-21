/**
 * Backend penyimpanan Aplikasi Audit ISO 21001 di Google Drive.
 *
 * Setiap audit disimpan sebagai satu file JSON (audit_<id>.json) di folder Drive.
 * Ringkasan audit (nama, versi, revisi, waktu simpan) disimpan di deskripsi file
 * agar daftar audit bisa dimuat tanpa membuka isi setiap file.
 *
 * Login: "Masuk dengan Google". Aplikasi mengirim ID token Google (aksi "login"),
 * backend memeriksanya ke Google dan hanya menerima akun PEMILIK folder database
 * (akun yang memiliki aplikasi ini). Setelah itu backend memberi token sesi
 * 90 hari yang disimpan di browser. Tidak ada kode akses lagi.
 *
 * Cara pasang (ringkas):
 *  1. Tempel seluruh isi file ini di project Apps Script.
 *  2. Properti skrip FOLDER_ID sudah ada (folder database). Tidak perlu diubah.
 *  3. Jalankan fungsi izinkanAkses() sekali dan setujui izin (Drive + akses internet).
 *  4. Terapkan > Kelola deployment > Edit > Versi baru > Terapkan
 *     (Jalankan sebagai "Saya", Akses "Siapa saja").
 */

/* Client ID OAuth (Google Cloud Console > Klien > Aplikasi web). Bukan rahasia. */
var GOOGLE_CLIENT_ID = '236145262919-mgu0dpco58uc2esi5766cavo7mesh6rb.apps.googleusercontent.com';
var SESI_HARI = 90;

function izinkanAkses() {
  var folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('FOLDER_ID'));
  UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=cek', { muteHttpExceptions: true });
  Logger.log('Izin lengkap. Folder database: ' + folder.getName() + '. Pemilik: ' + pemilik_(PropertiesService.getScriptProperties()));
}

function doGet() {
  return out_({ ok: true, app: 'audit-iso21001', login: 'google', pesan: 'Backend aktif. Gunakan dari aplikasi audit.' });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad_request' }); }
  var props = PropertiesService.getScriptProperties();

  try {
    if (req.action === 'login') return out_(login_(props, req.idToken));
    var sesi = sesi_(props, req.session);
    if (!sesi) return out_({ ok: false, error: 'unauthorized' });
    if (req.action === 'logout') { props.deleteProperty('S_' + hash_(req.session)); return out_({ ok: true }); }

    var folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));
    switch (req.action) {
      case 'ping': return out_({ ok: true, folder: folder.getName(), email: sesi.email, name: sesi.name });
      case 'list': return out_({ ok: true, items: list_(folder) });
      case 'get': return out_(get_(folder, req.id));
      case 'save': return withLock_(function () { return save_(folder, req); });
      case 'delete': return withLock_(function () { return del_(folder, req.id); });
      default: return out_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    return out_({ ok: false, error: 'server', detail: String(err && err.message || err) });
  }
}

/* ---------------- login & sesi ---------------- */
function login_(props, idToken) {
  if (!idToken || typeof idToken !== 'string' || idToken.length > 4096) return { ok: false, error: 'unauthorized' };
  var r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return { ok: false, error: 'unauthorized' };
  var t = JSON.parse(r.getContentText());
  var pemilik = pemilik_(props);
  var email = String(t.email || '').toLowerCase();
  var sah = t.aud === GOOGLE_CLIENT_ID &&
    (t.iss === 'accounts.google.com' || t.iss === 'https://accounts.google.com') &&
    String(t.email_verified) === 'true' && Number(t.exp) * 1000 > Date.now();
  if (!sah) return { ok: false, error: 'unauthorized' };
  if (!pemilik || email !== pemilik) return { ok: false, error: 'not_owner', email: email };

  bersihkanSesi_(props);
  var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  var exp = Date.now() + SESI_HARI * 86400000;
  var name = String(t.name || t.given_name || '').slice(0, 60);
  props.setProperty('S_' + hash_(token), JSON.stringify({ email: email, name: name, exp: exp }));
  return { ok: true, session: token, email: email, name: name, exp: exp };
}

/* Pemilik aplikasi = pemilik folder database (tidak butuh izin tambahan selain Drive). */
function pemilik_(props) {
  var p = props.getProperty('PEMILIK');
  if (!p) {
    var o = DriveApp.getFolderById(props.getProperty('FOLDER_ID')).getOwner();
    p = String(o ? o.getEmail() : '').toLowerCase();
    if (p) props.setProperty('PEMILIK', p);
  }
  return p;
}

function sesi_(props, token) {
  if (!token || typeof token !== 'string' || token.length > 200) return null;
  var raw = props.getProperty('S_' + hash_(token));
  if (!raw) return null;
  var s = JSON.parse(raw);
  if (!s.exp || s.exp < Date.now()) { props.deleteProperty('S_' + hash_(token)); return null; }
  return s;
}

function bersihkanSesi_(props) {
  var all = props.getProperties(), now = Date.now();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('S_') !== 0) return;
    try { if (JSON.parse(all[k]).exp < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
}

function hash_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)).replace(/=+$/, '');
}

/* ---------------- operasi ---------------- */
function list_(folder) {
  var items = [], it = folder.getFiles();
  while (it.hasNext()) {
    var f = it.next();
    if (f.isTrashed() || !/^audit_[A-Za-z0-9]+\.json$/.test(f.getName())) continue;
    var m = meta_(f);
    if (m) items.push(m);
  }
  return items;
}

function get_(folder, id) {
  var f = find_(folder, id);
  if (!f) return { ok: false, error: 'not_found' };
  var d = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
  return { ok: true, rev: d.rev || 0, audit: d.audit, meta: meta_(f) };
}

function save_(folder, req) {
  var a = req.audit;
  if (!a || !a.id || !validId_(a.id) || !a.profil || !a.res) return { ok: false, error: 'bad_audit' };
  var f = find_(folder, a.id);
  var cur = f ? meta_(f) : null, curRev = cur ? (cur.rev || 0) : 0;
  if (f && !req.force && (req.baseRev || 0) !== curRev) return { ok: false, error: 'conflict', rev: curRev, meta: cur };
  var rev = curRev + 1, now = new Date().toISOString();
  var m = {
    id: a.id, rev: rev, nama: String(a.profil.nama || '').slice(0, 150), versi: a.versi || '',
    jenjang: String(req.jenjang || '').slice(0, 120), tglMulai: a.profil.tglMulai || '',
    progress: Number(req.progress) || 0, updated: a.updated || now, savedAt: now,
    savedBy: String(req.who || '').slice(0, 60)
  };
  var content = JSON.stringify({ app: 'audit-iso21001', format: 1, rev: rev, audit: a });
  if (f) f.setContent(content);
  else f = folder.createFile('audit_' + a.id + '.json', content, 'application/json');
  f.setDescription(JSON.stringify(m));
  return { ok: true, rev: rev, meta: m };
}

function del_(folder, id) {
  var f = find_(folder, id);
  if (!f) return { ok: true, missing: true };
  f.setTrashed(true); // masuk Sampah Drive, masih bisa dipulihkan
  return { ok: true };
}

/* ---------------- bantu ---------------- */
function validId_(id) { return typeof id === 'string' && /^[A-Za-z0-9]{1,64}$/.test(id); }

function find_(folder, id) {
  if (!validId_(id)) return null;
  var it = folder.getFilesByName('audit_' + id + '.json');
  while (it.hasNext()) { var f = it.next(); if (!f.isTrashed()) return f; }
  return null;
}

function meta_(f) {
  try { return JSON.parse(f.getDescription() || 'null'); } catch (e) { return null; }
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out_({ ok: false, error: 'busy' });
  try { return out_(fn()); } finally { lock.releaseLock(); }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
