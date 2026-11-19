/**
 * Backend penyimpanan Aplikasi Audit ISO 21001 di Google Drive.
 *
 * Setiap audit disimpan sebagai satu file JSON (audit_<id>.json) di folder Drive.
 * Ringkasan audit (nama, versi, revisi, waktu simpan) disimpan di deskripsi file
 * agar daftar audit bisa dimuat tanpa membuka isi setiap file.
 *
 * Cara pasang (ringkas):
 *  1. Buat project baru di https://script.google.com, tempel seluruh isi file ini.
 *  2. Isi FOLDER_ID dan ACCESS_KEY pada fungsi aturKonfigurasi(), lalu jalankan sekali.
 *  3. Deploy > Deployment baru > Aplikasi web: Jalankan sebagai "Saya", Akses "Siapa saja".
 *  4. Salin URL aplikasi web ke aplikasi audit (kartu Penyimpanan Online).
 */

function aturKonfigurasi() {
  var FOLDER_ID = 'ISI_ID_FOLDER_DRIVE';
  var ACCESS_KEY = 'ISI_KODE_AKSES';
  var folder = DriveApp.getFolderById(FOLDER_ID); // sekaligus meminta izin akses Drive
  PropertiesService.getScriptProperties().setProperties({ FOLDER_ID: FOLDER_ID, ACCESS_KEY: ACCESS_KEY });
  Logger.log('Konfigurasi tersimpan. Folder database: ' + folder.getName());
}

function doGet() {
  return out_({ ok: true, app: 'audit-iso21001', pesan: 'Backend aktif. Gunakan dari aplikasi audit.' });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad_request' }); }
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('ACCESS_KEY');
  if (!key || req.key !== key) return out_({ ok: false, error: 'unauthorized' });
  var folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));

  try {
    switch (req.action) {
      case 'ping': return out_({ ok: true, folder: folder.getName() });
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
