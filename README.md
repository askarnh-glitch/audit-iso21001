# Aplikasi Audit SMOP — ISO 21001:2018 & 2025

Aplikasi web satu halaman untuk audit **Sistem Manajemen Organisasi Pendidikan (SMOP)** berdasarkan ISO 21001:2018 dan ISO 21001:2025 (SNI ISO 21001:2025). Aplikasi ini dipakai auditor di TK/PAUD, SD, SMP, SMA, SMK, dan Perguruan Tinggi, dan seluruhnya berbahasa Indonesia.

## Fitur
- Pilihan versi standar 2018 atau 2025, dengan tabel perbedaan antarversi.
- 345 butir checklist. Setiap butir dilengkapi panduan pemeriksaan (dokumen, pertanyaan teknis, pertanyaan operasional) dan panduan penilaian (Sesuai/Observasi/OFI/KTS Minor/KTS Mayor/N/A).
- Contoh bukti objektif yang menyesuaikan jenjang, bentuk dan penyelenggara PT, site audit, dan rumpun ilmu.
- Daftar temuan, rencana tindakan korektif, serta ekspor laporan ke Word dan PDF.
- **Penyimpanan online (opsional):** audit tersimpan di folder Google Drive bersama melalui Google Apps Script, dengan salinan di browser untuk dipakai saat offline.

## Hak cipta
Butir checklist merupakan **parafrase berbahasa Indonesia**, bukan kutipan teks standar. Teks resmi ISO 21001 dan SNI ISO 21001 dilindungi hak cipta dan **tidak** disertakan di repositori ini. Gunakan dokumen standar resmi sebagai rujukan bunyi persyaratan.

## Struktur
| Path | Isi |
|---|---|
| `index.html` | Aplikasi jadi (dibangun dari `src/`) |
| `src/` | Sumber: data checklist, panduan, logika aplikasi, gaya |
| `src/build.py` | Menggabungkan `src/` menjadi `index.html` |
| `src/config.json` | URL backend Apps Script (bukan kode akses) |
| `backend/Code.gs` | Kode backend Google Apps Script (templat tanpa rahasia) |

Membangun ulang setelah mengubah `src/`:
```
python src/build.py
```

## Memasang backend Google Drive
1. Buat folder di Google Drive untuk database, lalu salin ID foldernya dari URL.
2. Buka https://script.google.com dan buat project baru, lalu tempel isi `backend/Code.gs`.
3. Isi `FOLDER_ID` dan `ACCESS_KEY` di fungsi `aturKonfigurasi()`, jalankan fungsi itu sekali, lalu setujui izin aksesnya.
4. Pilih **Deploy → Deployment baru → Aplikasi web**: *Jalankan sebagai* "Saya", *Yang memiliki akses* "Siapa saja".
5. Salin URL aplikasi web ke `src/config.json`, lalu bangun ulang. Setiap auditor cukup memasukkan kode akses di kartu **Penyimpanan Online** pada Beranda.

Kode akses jangan pernah dimasukkan ke repositori.
