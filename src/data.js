/* =====================================================================
   DATA CHECKLIST AUDIT ISO 21001:2018 & ISO 21001:2025 (SNI ISO 21001:2025)
   Butir pertanyaan disusun ulang (parafrase) dalam Bahasa Indonesia oleh
   penyusun aplikasi berdasarkan struktur klausul standar. Teks standar asli
   TIDAK direproduksi. Rujuk dokumen standar resmi untuk bunyi persyaratan.

   Format butir (string):
     "teks"        -> berlaku di kedua versi
     "18|teks"     -> hanya ISO 21001:2018
     "25|teks"     -> hanya ISO 21001:2025
     "S|teks"      -> anjuran ("should"), bukan keharusan
     kombinasi: "25S|teks", "18S|teks"
   no:   nomor klausul per versi {18:'..', 25:'..'}
   cond: 'abk' (pendidikan kebutuhan khusus) | 'paud' (Lampiran A)
   ev:   contoh bukti objektif per kelompok:
         u=umum, tk=PAUD/TK, sek=SD/SMP/SMA/SMK, smk=tambahan SMK,
         pt=perguruan tinggi, vok=PT vokasi, ked=PT kedinasan,
         kag=PT keagamaan, bh=PTN-BH
   chg:  ringkasan perbedaan 2018 vs 2025
   ===================================================================== */

const GROUPS = [
  { id: '4', t: 'Konteks Organisasi' },
  { id: '5', t: 'Kepemimpinan' },
  { id: '6', t: 'Perencanaan' },
  { id: '7', t: 'Dukungan' },
  { id: '8', t: 'Operasi' },
  { id: '9', t: 'Evaluasi Kinerja' },
  { id: '10', t: 'Peningkatan' },
  { id: 'A', t: 'Lampiran A — Pendidikan Anak Usia Dini (normatif)' }
];

const CLAUSES = [
/* ---------------------------------------------------------------- 4 */
{ k:'4.1', g:'4', no:{18:'4.1',25:'4.1'}, t:'Memahami organisasi dan konteksnya',
  items:[
    'Apakah organisasi telah menetapkan isu eksternal dan internal yang relevan dengan tujuannya dan yang memengaruhi kemampuan mencapai hasil yang diharapkan dari SMOP?',
    '18|Apakah penetapan isu tersebut juga mempertimbangkan tanggung jawab sosial dan arah strategis organisasi?',
    '25|Apakah organisasi telah menentukan apakah perubahan iklim merupakan isu yang relevan (beserta dasar pertimbangannya)?',
    'Apakah informasi tentang isu eksternal dan internal tersebut dipantau dan ditinjau secara berkala?'
  ],
  ev:{ u:'Daftar isu internal–eksternal (SWOT/PESTEL); notulen tinjauan konteks; pernyataan visi–misi',
       tk:'Analisis konteks dalam KOSP PAUD; data Rapor Pendidikan PAUD; profil lembaga',
       sek:'Analisis konteks pada KOSP; Rapor Pendidikan & Perencanaan Berbasis Data (PBD); RKJM/RKS; RKAS',
       pt:'Renstra & Renop; analisis SWOT dalam LED akreditasi; laporan kinerja tahunan',
       bh:'Rencana strategis yang disahkan MWA', kag:'Renstra yang selaras dengan Renstra Kemenag' },
  chg:'2025 menambahkan keharusan menentukan relevansi isu perubahan iklim (dari Amandemen 1:2024). Rumusan 2018 menyebut tanggung jawab sosial dan arah strategis secara eksplisit.' },

{ k:'4.2', g:'4', no:{18:'4.2',25:'4.2'}, t:'Memahami kebutuhan dan harapan pihak berkepentingan',
  items:[
    'Apakah pihak berkepentingan yang relevan dengan SMOP telah diidentifikasi, sekurang-kurangnya peserta didik, penerima manfaat lain, dan staf organisasi?',
    'Apakah persyaratan yang relevan dari setiap pihak berkepentingan tersebut telah ditentukan?',
    '25|Apakah telah ditetapkan persyaratan mana saja yang akan dipenuhi melalui SMOP?',
    'Apakah informasi tentang pihak berkepentingan dan persyaratannya dipantau dan ditinjau secara berkala?',
    '25S|(Catatan standar) Apakah persyaratan pihak berkepentingan yang terkait perubahan iklim ikut dipertimbangkan?'
  ],
  ev:{ u:'Matriks pihak berkepentingan & persyaratannya; hasil survei/forum pemangku kepentingan',
       tk:'Orang tua/wali, komite, dinas pendidikan/Kemenag, BSANP (akreditasi), organisasi mitra (Himpaudi/IGTKI), puskesmas/posyandu',
       sek:'Orang tua, komite sekolah, dinas pendidikan/Kemenag, BSANP (akreditasi), Pokja Budaya Sekolah Aman dan Nyaman, alumni, masyarakat sekitar',
       smk:'DUDI mitra, LSP, BKK',
       pt:'Mahasiswa, orang tua, alumni, pengguna lulusan, kementerian/LLDIKTI, BAN-PT/LAM, organisasi profesi, mitra',
       vok:'Mitra industri (link & match), asosiasi profesi', ked:'Kementerian/Lembaga pembina, instansi pengguna lulusan',
       kag:'Kemenag, ormas keagamaan/yayasan' },
  chg:'2025 menambahkan keharusan menentukan persyaratan mana yang akan dipenuhi melalui SMOP, dan catatan terkait perubahan iklim.' },

{ k:'4.3', g:'4', no:{18:'4.3',25:'4.3'}, t:'Menentukan ruang lingkup SMOP',
  items:[
    'Apakah batas dan penerapan SMOP telah ditetapkan dengan mempertimbangkan isu (4.1), persyaratan pihak berkepentingan (4.2), serta produk dan layanan pendidikan?',
    'Apakah ruang lingkup tersedia sebagai informasi terdokumentasi dan menyebutkan jenis produk dan layanan yang dicakup?',
    'Apakah setiap persyaratan yang dinyatakan tidak berlaku disertai justifikasi, dan tidak memengaruhi kemampuan menjamin kesesuaian layanan serta kepuasan peserta didik?',
    'Apakah seluruh produk dan layanan yang diberikan kepada peserta didik sudah tercakup dalam ruang lingkup SMOP?'
  ],
  ev:{ u:'Manual mutu / dokumen ruang lingkup; daftar layanan; justifikasi pengecualian',
       tk:'Daftar layanan (TK/KB/TPA/day care)', sek:'Daftar rombel, program reguler/inklusi/ekstrakurikuler',
       pt:'Daftar fakultas/prodi/jenjang (D3, D4, S1, profesi, S2, S3) dan layanan pendukung' },
  chg:'Substansi relatif sama; 2025 merapikan rumusan.' },

{ k:'4.4', g:'4', no:{18:'4.4.1–4.4.2',25:'4.4.1–4.4.2'}, t:'Sistem manajemen organisasi pendidikan (SMOP) dan prosesnya',
  items:[
    'Apakah SMOP telah ditetapkan, diterapkan, dipelihara, dan ditingkatkan secara berkelanjutan, termasuk proses yang diperlukan beserta interaksinya?',
    'Apakah input dan output yang diharapkan dari setiap proses telah ditentukan, termasuk urutan dan interaksinya (peta proses)?',
    'Apakah kriteria, metode, dan indikator kinerja proses telah ditetapkan dan diterapkan untuk memastikan proses berjalan efektif?',
    'Apakah sumber daya, tanggung jawab, dan wewenang setiap proses telah ditentukan dan tersedia?',
    'Apakah risiko dan peluang proses ditangani, proses dievaluasi, serta perubahan dan perbaikan dilakukan bila diperlukan?',
    'Apakah informasi terdokumentasi yang mendukung operasi proses dipelihara, dan rekaman pelaksanaan proses disimpan?'
  ],
  ev:{ u:'Peta proses / bisnis proses; SOP; matriks indikator kinerja; manual mutu',
       sek:'SOP sekolah; tata tertib; dokumen SPMI sekolah (siklus PBD)',
       pt:'Dokumen SPMI (kebijakan, manual, standar, formulir); SOP akademik & non-akademik' },
  chg:'Substansi sama.' },

/* ---------------------------------------------------------------- 5 */
{ k:'5.1.1', g:'5', no:{18:'5.1.1',25:'5.1.1'}, t:'Kepemimpinan dan komitmen — umum',
  items:[
    'Apakah pimpinan puncak akuntabel atas efektivitas SMOP dan memastikan kebijakan serta sasaran mutu ditetapkan selaras dengan arah strategis?',
    'Apakah persyaratan SMOP terintegrasi ke dalam proses inti organisasi, dan sumber daya yang diperlukan tersedia?',
    'Apakah pimpinan mengomunikasikan pentingnya manajemen yang efektif dan kepatuhan pada SMOP, serta memastikan SMOP mencapai hasil yang diharapkan?',
    'Apakah pimpinan mengarahkan dan mendukung personel serta peran manajerial lain untuk berkontribusi pada efektivitas SMOP?',
    'Apakah pimpinan mempromosikan pendekatan proses, pemikiran berbasis risiko, dan perbaikan berkelanjutan?',
    'Apakah pimpinan menetapkan, mengembangkan, dan memelihara rencana strategis serta mendukung implementasi visi pendidikan secara berkelanjutan?',
    'Apakah pimpinan memastikan kebutuhan pendidikan peserta didik, termasuk kebutuhan khusus, teridentifikasi dan ditangani?',
    'Apakah prinsip tanggung jawab sosial dipertimbangkan oleh pimpinan?',
    '25|Apakah pimpinan memastikan pendidik dan staf memelihara, memperbarui, dan meningkatkan kompetensinya?',
    '25|Apakah pimpinan mendorong keadilan, transparansi, dan perilaku etis di semua tingkat organisasi?'
  ],
  ev:{ u:'Wawancara pimpinan; SK kebijakan; rencana strategis; notulen rapat pimpinan; alokasi anggaran mutu',
       tk:'Kepala TK/PAUD & yayasan', sek:'Kepala sekolah/madrasah; RKS/RKJM; RKAS (alokasi BOS/BOP)',
       pt:'Rektor/Direktur/Ketua & pimpinan unit; Renstra; Perjanjian Kinerja', bh:'Peran MWA/Senat Akademik' },
  chg:'2025 menambahkan: memastikan pendidik & staf menjaga kompetensi, serta mendorong keadilan, transparansi dan perilaku etis.' },

{ k:'5.1.2', g:'5', no:{18:'5.1.2',25:'5.1.2'}, t:'Fokus pada peserta didik dan penerima manfaat lain',
  items:[
    'Apakah kebutuhan dan harapan peserta didik serta penerima manfaat lain ditentukan, dipahami, dan dipenuhi secara konsisten?',
    'Apakah pemenuhan tersebut dibuktikan melalui pemantauan kepuasan dan kemajuan pendidikan peserta didik?',
    'Apakah risiko dan peluang yang dapat memengaruhi kesesuaian layanan dan peningkatan kepuasan telah ditentukan dan ditangani?'
  ],
  ev:{ u:'Hasil survei kepuasan; data kemajuan belajar; tindak lanjut keluhan',
       tk:'Laporan perkembangan anak; pertemuan orang tua', sek:'Rapor; hasil asesmen; Rapor Pendidikan',
       pt:'IPK, masa studi, tingkat kelulusan tepat waktu, survei kepuasan mahasiswa' },
  chg:'Substansi sama.' },

{ k:'5.1.3', g:'5', cond:'abk', no:{18:'5.1.3',25:'5.1.3'}, t:'Persyaratan tambahan pendidikan kebutuhan khusus — kepemimpinan',
  items:[
    'Apakah pimpinan memastikan tersedianya sumber daya aksesibilitas (sarana, alat bantu, anggaran, pendamping) serta pelatihan bagi pemberi layanan — pendidik, tenaga kependidikan, dan staf layanan — untuk mendukung aksesibilitas lingkungan belajar? (Peserta didik berkebutuhan khusus adalah penerima manfaat, bukan peserta pelatihan.)',
    'Apakah akomodasi yang layak disediakan bagi peserta didik berkebutuhan khusus sehingga memperoleh akses setara terhadap fasilitas dan lingkungan pendidikan?'
  ],
  ev:{ u:'Kebijakan pendidikan inklusif; data peserta didik berkebutuhan khusus; anggaran aksesibilitas; program pelatihan bagi pendidik, tenaga kependidikan, dan staf layanan. Catatan: klausul ini menilai komitmen pimpinan; kecukupan kompetensi tiap personel diperiksa di 7.2.2',
       sek:'Guru Pendamping Khusus (GPK); program sekolah inklusi; akomodasi yang layak',
       pt:'Unit Layanan Disabilitas (ULD); kebijakan akomodasi yang layak bagi mahasiswa penyandang disabilitas' },
  chg:'2018 memuat penjelasan definisi peserta didik berkebutuhan khusus; keharusan intinya sama.' },

{ k:'5.2', g:'5', no:{18:'5.2.1–5.2.2',25:'5.2'}, t:'Kebijakan organisasi pendidikan',
  items:[
    'Apakah kebijakan sesuai dengan tujuan organisasi serta mendukung misi dan visi pendidikan?',
    'Apakah kebijakan memberikan kerangka penetapan sasaran dan memuat komitmen memenuhi persyaratan yang berlaku serta komitmen perbaikan berkelanjutan SMOP?',
    'Apakah kebijakan mempertimbangkan perkembangan pendidikan, ilmiah, dan teknis yang relevan?',
    'Apakah kebijakan memuat komitmen terhadap tanggung jawab sosial dan pengelolaan kekayaan intelektual?',
    'Apakah kebijakan mempertimbangkan kebutuhan dan harapan pihak berkepentingan yang relevan?',
    '18|Apakah kebijakan ditinjau dan dipelihara secara berkala oleh pimpinan puncak?',
    'Apakah kebijakan tersedia sebagai informasi terdokumentasi dan dikomunikasikan di dalam organisasi?',
    '18|Apakah kebijakan dipahami dan diterapkan di dalam organisasi (dibuktikan dengan wawancara personel)?',
    'Apakah kebijakan tersedia bagi pihak berkepentingan, sesuai kebutuhan?'
  ],
  ev:{ u:'SK/dokumen kebijakan mutu; publikasi di website/papan informasi; kebijakan kekayaan intelektual',
       sek:'Kebijakan mutu sekolah ditandatangani kepala sekolah & komite', pt:'Kebijakan SPMI; standar pendidikan tinggi yang ditetapkan pimpinan (PTN: pertimbangan senat; PTS: pertimbangan senat dan persetujuan badan penyelenggara); kebijakan HKI; statuta' },
  chg:'2018 memisahkan 5.2.1 (pengembangan) dan 5.2.2 (komunikasi); 2025 menggabungkannya menjadi 5.2. Pada 2018 kebijakan juga harus “dipahami dan diterapkan”.' },

{ k:'5.3', g:'5', no:{18:'5.3',25:'5.3'}, t:'Peran, tanggung jawab, dan wewenang',
  items:[
    'Apakah tanggung jawab dan wewenang untuk peran yang relevan telah ditetapkan dan dikomunikasikan di dalam organisasi?',
    'Apakah telah ditunjuk pihak yang bertanggung jawab memastikan SMOP sesuai dengan standar dan prosesnya menghasilkan output yang diharapkan?',
    'Apakah ada penanggung jawab pelaporan kinerja SMOP dan peluang perbaikan kepada pimpinan puncak?',
    'Apakah ada penanggung jawab untuk memastikan kebijakan dipahami, fokus pada peserta didik dipromosikan, dan integritas SMOP terjaga saat terjadi perubahan?',
    'Apakah ada penanggung jawab pengelolaan komunikasi (7.4), pengendalian informasi terdokumentasi (7.5), dan integrasi seluruh proses pembelajaran apa pun metode penyampaiannya?',
    'Apakah ada penanggung jawab pengelolaan persyaratan peserta didik berkebutuhan khusus (bila relevan)?'
  ],
  ev:{ u:'Struktur organisasi; uraian tugas; SK penunjukan wakil manajemen/tim mutu',
       sek:'SK Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS); pembagian tugas guru & tendik',
       pt:'SK LPM/LPMPP, Gugus Penjaminan Mutu fakultas, Unit Penjaminan Mutu prodi; OTK' },
  chg:'2025 memisahkan pelaporan kinerja dan pelaporan peluang perbaikan; pengelolaan peserta didik berkebutuhan khusus diberi frasa “bila relevan”.' },

/* ---------------------------------------------------------------- 6 */
{ k:'6.1', g:'6', no:{18:'6.1.1–6.1.2',25:'6.1'}, t:'Tindakan untuk menangani risiko dan peluang',
  items:[
    'Apakah dalam perencanaan SMOP, isu (4.1) dan persyaratan (4.2, 4.4) dipertimbangkan untuk menentukan risiko dan peluang?',
    'Apakah risiko dan peluang ditentukan untuk menjamin SMOP mencapai hasilnya, meningkatkan efek yang diinginkan, mencegah/mengurangi efek yang tidak diinginkan, dan mencapai perbaikan berkelanjutan?',
    'Apakah tindakan untuk menangani risiko dan peluang telah direncanakan dan diintegrasikan ke dalam proses SMOP?',
    'Apakah efektivitas tindakan tersebut dievaluasi?',
    'Apakah tindakan yang diambil proporsional terhadap kemungkinan terjadinya dan dampak potensial pada kesesuaian layanan?'
  ],
  ev:{ u:'Register/profil risiko & peluang; rencana mitigasi; laporan pemantauan risiko',
       tk:'Risiko keselamatan anak, kesehatan, bencana', sek:'Program Satuan Pendidikan Aman Bencana (SPAB); risiko perundungan/kekerasan (program Budaya Sekolah Aman dan Nyaman); risiko penurunan capaian AN/TKA',
       pt:'Manajemen risiko institusi; risiko akreditasi, keuangan, penerimaan mahasiswa', ked:'Manajemen risiko sesuai ketentuan K/L dan SPIP' },
  chg:'2018 memecah menjadi 6.1.1 dan 6.1.2; 2025 menggabungkan menjadi 6.1 dengan substansi serupa.' },

{ k:'6.2', g:'6', no:{18:'6.2.1–6.2.2',25:'6.2'}, t:'Sasaran organisasi pendidikan dan perencanaan pencapaiannya',
  items:[
    'Apakah sasaran ditetapkan pada fungsi dan tingkat yang relevan (2018: juga proses yang diperlukan SMOP)?',
    '25|Apakah sasaran juga ditetapkan untuk proses yang memerlukan pengelolaan mutu aktif dalam periode waktu tertentu?',
    'Apakah sasaran konsisten dengan kebijakan, terukur (bila memungkinkan), dan mempertimbangkan persyaratan yang berlaku?',
    'Apakah sasaran dipantau, dikomunikasikan, dan dimutakhirkan sesuai kebutuhan?',
    'Apakah sasaran relevan dengan kesesuaian layanan dan peningkatan kepuasan peserta didik, staf (2025: juga pendidik dan tenaga administrasi akademik), serta penerima manfaat lain?',
    'Apakah sasaran dan capaiannya tersedia sebagai informasi terdokumentasi?',
    'Apakah perencanaan pencapaian sasaran menetapkan apa yang dilakukan, sumber daya, penanggung jawab, waktu penyelesaian, dan cara evaluasi hasil?',
    '18|Apakah rencana pencapaian sasaran tersebut dituangkan dalam rencana strategis?'
  ],
  ev:{ u:'Dokumen sasaran mutu & program kerja; laporan capaian sasaran',
       tk:'Program tahunan lembaga dengan indikator', sek:'RKS/RKT dengan indikator Rapor Pendidikan; target capaian; RKAS',
       pt:'IKU/IKT; Perjanjian Kinerja; Renop; dashboard capaian; laporan kinerja' },
  chg:'2018: 6.2.1 dan 6.2.2, rencana dituangkan dalam rencana strategis. 2025: digabung menjadi 6.2 dan menambah sasaran untuk proses yang memerlukan pengelolaan mutu aktif.' },

{ k:'6.3', g:'6', no:{18:'6.3',25:'6.3'}, t:'Perencanaan perubahan',
  items:[
    'Apakah perubahan pada SMOP dilakukan secara terencana?',
    'Apakah perencanaan perubahan mempertimbangkan tujuan dan konsekuensi perubahan serta integritas SMOP?',
    'Apakah ketersediaan sumber daya internal, alokasi tanggung jawab/wewenang, serta kesiapan penyedia eksternal dipertimbangkan?'
  ],
  ev:{ u:'Rencana perubahan (mis. perubahan kurikulum, struktur organisasi, sistem informasi) dan analisis dampaknya',
       sek:'Transisi implementasi kurikulum; perubahan sistem SPMB', pt:'Perubahan statuta/OTK, pembukaan/penutupan prodi, migrasi SIAKAD' },
  chg:'Substansi sama.' },

/* ---------------------------------------------------------------- 7 */
{ k:'7.1.1', g:'7', no:{18:'7.1.1',25:'7.1.1'}, t:'Sumber daya — umum',
  items:[
    'Apakah sumber daya untuk penetapan, penerapan, pemeliharaan, dan perbaikan SMOP telah ditentukan dan disediakan?',
    'Apakah sumber daya secara berkelanjutan meningkatkan keterlibatan & kepuasan peserta didik, keterlibatan & kepuasan staf, serta kepuasan penerima manfaat lain?',
    'Apakah telah ditentukan dan dipantau sumber daya mana yang disediakan organisasi dan mana yang oleh penyedia eksternal?',
    'Apakah kebutuhan peserta didik berkebutuhan khusus dan berbagai persyaratan aksesibilitas telah diantisipasi (bila relevan)?'
  ],
  ev:{ u:'Rencana anggaran; analisis kebutuhan sumber daya; daftar layanan alih daya',
       sek:'RKAS/ARKAS; laporan penggunaan BOS/BOP', pt:'RKAT/RBA; laporan realisasi anggaran' },
  chg:'Substansi sama; 2025 menambahkan frasa “bila relevan” untuk kebutuhan khusus.' },

{ k:'7.1.2', g:'7', no:{18:'7.1.2',25:'7.1.2'}, t:'Sumber daya manusia',
  items:[
    'Apakah SDM yang diperlukan (staf, relawan/magang, staf penyedia eksternal) telah ditentukan dan disediakan untuk operasi dan pengendalian proses?',
    'Apakah kriteria rekrutmen/seleksi telah ditetapkan, diterapkan, dan dipublikasikan kepada pihak berkepentingan yang relevan?',
    'Apakah proses rekrutmen/seleksi didokumentasikan dan hasil rekrutmen direkam?'
  ],
  ev:{ u:'Analisis kebutuhan pegawai; pengumuman & kriteria rekrutmen; berkas hasil seleksi',
       tk:'Kualifikasi pendidik PAUD; data GTK', sek:'Data GTK di Dapodik/EMIS; kualifikasi & sertifikasi pendidik; rasio guru-rombel',
       pt:'Rasio dosen–mahasiswa; data dosen di PDDikti; rekrutmen dosen & tendik; kriteria (pengalaman mengajar, riset, publikasi)',
       ked:'Formasi ASN/PPPK & ketentuan K/L', vok:'Rekrutmen dosen praktisi/industri' },
  chg:'Substansi sama.' },

{ k:'7.1.3', g:'7', no:{18:'7.1.3',25:'7.1.3'}, t:'Fasilitas',
  items:[
    'Apakah fasilitas (bangunan & lahan, peralatan termasuk perangkat keras & lunak, utilitas) memenuhi persyaratan peserta didik?',
    'Apakah fasilitas aman, sesuai bagi SDM untuk mendukung pengembangan kompetensi peserta didik, dan dipelihara?',
    'Apakah dimensi/kapasitas fasilitas memadai bagi penggunanya?',
    'Apakah tersedia fasilitas untuk pengajaran, belajar mandiri, penerapan pengetahuan, istirahat & rekreasi, serta kebutuhan hidup (makan, kesehatan, keselamatan), sesuai kebutuhan?',
    '25S|(Catatan standar) Apakah ruang digital dan fasilitas luar ruang ikut diperhitungkan?'
  ],
  ev:{ u:'Daftar inventaris; jadwal & rekaman pemeliharaan; observasi lapangan',
       tk:'Ruang bermain, APE, toilet ramah anak, area istirahat', sek:'Ruang kelas, laboratorium, perpustakaan, UKS, kantin sehat, data sarpras Dapodik',
       smk:'Bengkel/workshop, teaching factory, K3 bengkel', pt:'Laboratorium, perpustakaan, LMS & jaringan, asrama, klinik, fasilitas olahraga',
       vok:'Laboratorium/bengkel praktik sesuai standar industri' },
  chg:'2025 menambahkan catatan bahwa fasilitas dapat berupa ruang digital dan luar ruang.' },

{ k:'7.1.4', g:'7', no:{18:'7.1.4',25:'7.1.4'}, t:'Lingkungan untuk operasi proses pendidikan',
  items:[
    'Apakah lingkungan yang sesuai untuk mendukung kesejahteraan pihak berkepentingan telah ditentukan, disediakan, dan dipelihara?',
    'Apakah faktor psikososial (mis. beban kerja, kejelasan peran, dukungan sosial, stres, perundungan) dipertimbangkan?',
    'Apakah faktor fisik (suhu, kelembaban, cahaya, sirkulasi udara, kebersihan, kebisingan, ergonomi) dipertimbangkan?'
  ],
  ev:{ u:'Survei iklim kerja/belajar; rekaman kebersihan; pengukuran kondisi ruang; layanan konseling',
       tk:'Kebijakan pencegahan kekerasan; lingkungan bersih & aman', sek:'Program Budaya Sekolah Aman dan Nyaman (BSAN): tata tertib, kode etik, SOP, deteksi dini, dan kanal pengaduan yang ditetapkan kepala sekolah; data iklim keamanan & kebinekaan di Rapor Pendidikan; layanan BK',
       pt:'Satgas Pencegahan dan Penanganan Kekerasan di PT (PPKPT); layanan konseling mahasiswa; survei iklim akademik' },
  chg:'Substansi sama.' },

{ k:'7.1.5', g:'7', no:{18:'7.1.5',25:'7.1.5'}, t:'Sumber daya pemantauan dan pengukuran (termasuk ketertelusuran pengukuran)',
  items:[
    'Apakah sumber daya untuk memastikan hasil pemantauan/pengukuran yang valid dan reliabel telah ditentukan dan disediakan (mis. instrumen asesmen, rubrik, kuesioner, sistem ujian)?',
    'Apakah sumber daya tersebut sesuai dengan sasaran, jenis, metode penyampaian, dan durasi layanan pendidikan, serta dipelihara agar tetap layak?',
    'Apakah tersedia rekaman yang membuktikan kelayakan sumber daya pemantauan/pengukuran (mis. validasi instrumen, analisis butir soal)?',
    'Bila ketertelusuran pengukuran dipersyaratkan: apakah alat ukur diverifikasi/dikalibrasi, diidentifikasi statusnya, dan dilindungi dari kerusakan atau penyetelan yang tidak sah?',
    'Bila alat ukur ditemukan tidak layak: apakah dampaknya terhadap validitas hasil pengukuran sebelumnya dievaluasi dan ditindaklanjuti?'
  ],
  ev:{ u:'Kisi-kisi & validasi instrumen; analisis butir soal; uji validitas–reliabilitas kuesioner; sertifikat kalibrasi',
       tk:'Instrumen asesmen perkembangan anak; alat ukur antropometri (timbangan, pengukur tinggi)',
       sek:'Validasi soal asesmen sumatif; kriteria ketercapaian tujuan pembelajaran; sistem CBT', smk:'Kalibrasi alat ukur bengkel/laboratorium',
       pt:'Validasi soal & rubrik; sistem ujian daring; kalibrasi alat laboratorium', vok:'Kalibrasi peralatan praktik & uji kompetensi' },
  chg:'Substansi sama.' },

{ k:'7.1.6', g:'7', no:{18:'7.1.6',25:'7.1.6'}, t:'Pengetahuan organisasi dan sumber belajar',
  items:[
    'Apakah pengetahuan yang diperlukan untuk operasi proses telah ditentukan, dipelihara, dan tersedia sejauh diperlukan?',
    'Apakah organisasi mempertimbangkan pengetahuan saat ini dan cara memperoleh pengetahuan tambahan saat menghadapi perubahan kebutuhan dan tren?',
    'Apakah pertukaran pengetahuan antar pendidik dan staf, terutama antar sejawat, didorong?',
    'Apakah sumber belajar disediakan dan tersedia di mana dan kapan diperlukan?',
    'Apakah sumber belajar mencerminkan kebutuhan peserta didik, penerima manfaat lain, dan pendidik, ditinjau berkala agar mutakhir, serta dikatalogkan dan dirujuk?',
    'Apakah persyaratan kekayaan intelektual dihormati?',
    'S|Apakah penggunaan ulang (reusability) sumber belajar didorong?'
  ],
  ev:{ u:'Repositori pengetahuan; dokumentasi lesson learned; katalog perpustakaan; kebijakan HKI',
       tk:'Komunitas belajar guru PAUD; KKG/gugus PAUD', sek:'Komunitas belajar, KKG/MGMP, Platform pembelajaran guru; katalog perpustakaan',
       pt:'Repositori institusi; perpustakaan & e-journal; LMS; kebijakan HKI; alat cek kemiripan' },
  chg:'Substansi sama.' },

{ k:'7.2.1', g:'7', no:{18:'7.2.1',25:'7.2.1'}, t:'Kompetensi — umum',
  items:[
    'Apakah kompetensi yang diperlukan bagi personel yang pekerjaannya memengaruhi kinerja organisasi telah ditentukan?',
    'Apakah personel kompeten berdasarkan pendidikan, pelatihan, atau pengalaman yang sesuai?',
    'Bila diperlukan, apakah tindakan untuk memperoleh kompetensi (pelatihan, mentoring, penugasan ulang, rekrutmen) dilakukan dan efektivitasnya dievaluasi?',
    'Apakah metode evaluasi kinerja staf telah ditetapkan dan diterapkan?',
    '18|Apakah ada tindakan untuk mendukung dan memastikan pengembangan kompetensi staf secara berkelanjutan?',
    'Apakah tersedia informasi terdokumentasi sebagai bukti kompetensi?'
  ],
  ev:{ u:'Matriks kompetensi; rekaman pelatihan & evaluasinya; penilaian kinerja',
       tk:'Kualifikasi & diklat guru PAUD', sek:'Sertifikat pendidik; pengelolaan kinerja guru; program PKB; supervisi akademik',
       pt:'Sertifikat pendidik dosen; jabatan fungsional; BKD/LKD; SKP; pelatihan Pekerti/AA',
       vok:'Sertifikat kompetensi dosen; magang dosen di industri', ked:'Penilaian kinerja ASN (SKP)' },
  chg:'2018 secara eksplisit menuntut tindakan untuk pengembangan kompetensi staf berkelanjutan; 2025 memindahkan aspek ini ke komitmen pimpinan (5.1.1).' },

{ k:'7.2.2', g:'7', cond:'abk', no:{18:'7.2.2',25:'7.2.2'}, t:'Kompetensi — tambahan pendidikan kebutuhan khusus',
  items:[
    'Apakah semua pendidik dan staf yang berinteraksi dengan peserta didik berkebutuhan khusus mendapat pelatihan khusus yang sesuai (mis. pembelajaran berdiferensiasi, asesmen, scaffolding)?',
    'Apakah pendidik memiliki akses ke jaringan spesialis (psikolog, terapis wicara, ahli pengembangan belajar, dsb.)?'
  ],
  ev:{ u:'Sertifikat pelatihan pendidikan inklusif; MoU dengan psikolog/terapis/pusat layanan disabilitas',
       sek:'Pelatihan GPK; kerja sama dengan SLB/Pusat Sumber', pt:'Pelatihan staf ULD; jejaring layanan disabilitas' },
  chg:'Substansi sama.' },

{ k:'7.3', g:'7', no:{18:'7.3',25:'7.3'}, t:'Kesadaran',
  items:[
    'Apakah personel menyadari kebijakan organisasi pendidikan?',
    'Apakah personel menyadari kontribusinya terhadap efektivitas SMOP dan manfaat peningkatan kinerja?',
    'Apakah personel menyadari implikasi bila tidak memenuhi persyaratan SMOP?',
    'Apakah personel menyadari strategi organisasi dan sasaran SMOP yang relevan?'
  ],
  ev:{ u:'Wawancara sampel personel; materi sosialisasi/induksi; daftar hadir sosialisasi' },
  chg:'Substansi sama; 2025 memisahkan butir strategi & sasaran menjadi butir tersendiri.' },

{ k:'7.4.1', g:'7', no:{18:'7.4.1',25:'7.4.1'}, t:'Komunikasi — umum',
  items:[
    'Apakah komunikasi internal dan eksternal yang relevan telah ditentukan: apa, kapan, dengan siapa, bagaimana, mengapa, dan siapa yang berkomunikasi?'
  ],
  ev:{ u:'Matriks/rencana komunikasi; SOP kehumasan' },
  chg:'Substansi sama.' },

{ k:'7.4.2', g:'7', no:{18:'7.4.2',25:'7.4.2'}, t:'Tujuan komunikasi',
  items:[
    'Apakah komunikasi digunakan untuk meminta pendapat atau persetujuan pihak berkepentingan yang relevan?',
    'Apakah informasi yang disampaikan relevan, akurat, tepat waktu, dan konsisten dengan misi, visi, strategi, dan kebijakan?',
    'Apakah komunikasi digunakan untuk kolaborasi dan koordinasi kegiatan dengan pihak berkepentingan di dalam organisasi?'
  ],
  ev:{ u:'Notulen rapat koordinasi; publikasi informasi; formulir persetujuan',
       tk:'Buku penghubung; grup komunikasi orang tua', sek:'Rapat komite & orang tua; website sekolah', pt:'Portal informasi; forum mahasiswa & dosen' },
  chg:'Substansi sama.' },

{ k:'7.4.3', g:'7', no:{18:'7.4.3',25:'7.4.3'}, t:'Pengaturan komunikasi',
  items:[
    'Apakah ada pengaturan komunikasi yang efektif dengan peserta didik dan pihak lain terkait kebijakan dan rencana strategis?',
    'Apakah ada pengaturan komunikasi terkait desain, isi, dan penyampaian layanan pendidikan?',
    'Apakah ada pengaturan komunikasi terkait pertanyaan, pendaftaran, dan penerimaan?',
    'Apakah data kinerja peserta didik, termasuk hasil asesmen formatif dan sumatif, dikomunikasikan?',
    'Apakah umpan balik, termasuk keluhan dan hasil survei kepuasan, dikomunikasikan?',
    'Apakah peserta didik dan penerima manfaat lain diberi informasi tentang titik kontak eksternal bila masalah tidak terselesaikan?',
    'Apakah pelaksanaan komunikasi dipantau secara berkala, dan rencana komunikasi dianalisis serta diperbaiki?',
    'Apakah rekaman proses komunikasi disimpan?'
  ],
  ev:{ u:'Rencana komunikasi & evaluasinya; arsip pengumuman; kanal pengaduan',
       tk:'Laporan perkembangan anak kepada orang tua; pertemuan berkala', sek:'Rapor; pertemuan orang tua; website/media sosial; informasi kanal pengaduan dinas/Kemenag/Ombudsman',
       pt:'SIAKAD/portal; KHS; pengumuman akademik; informasi kanal pengaduan LLDIKTI/kementerian/Ombudsman' },
  chg:'Substansi sama.' },

{ k:'7.5.1', g:'7', no:{18:'7.5.1',25:'7.5.1'}, t:'Informasi terdokumentasi — umum',
  items:[
    'Apakah SMOP mencakup informasi terdokumentasi yang dipersyaratkan standar?',
    'Apakah SMOP mencakup informasi terdokumentasi yang ditetapkan organisasi sebagai perlu bagi efektivitas SMOP (mis. kalender akademik, kurikulum inti, katalog, penilaian, kode etik)?'
  ],
  ev:{ u:'Daftar induk dokumen; manual mutu; kode etik', sek:'Kalender pendidikan; KOSP; tata tertib', pt:'Kalender akademik; pedoman akademik; katalog prodi; kode etik dosen & mahasiswa' },
  chg:'Substansi sama.' },

{ k:'7.5.2', g:'7', no:{18:'7.5.2',25:'7.5.2'}, t:'Pembuatan dan pemutakhiran informasi terdokumentasi',
  items:[
    'Apakah dokumen memiliki identifikasi dan deskripsi yang sesuai (judul, tanggal, penyusun, nomor)?',
    'Apakah format (bahasa, versi perangkat lunak, grafik) dan media (kertas/elektronik) sesuai?',
    'Apakah dokumen ditinjau dan disahkan kesesuaian dan kecukupannya?'
  ],
  ev:{ u:'Sampel dokumen (kop, nomor, revisi, pengesahan); SOP penyusunan dokumen' },
  chg:'Substansi sama.' },

{ k:'7.5.3', g:'7', no:{18:'7.5.3',25:'7.5.3'}, t:'Pengendalian informasi terdokumentasi',
  items:[
    'Apakah dokumen tersedia dan sesuai untuk digunakan di mana dan kapan diperlukan?',
    'Apakah dokumen terlindungi secara memadai (kerahasiaan, penggunaan tidak tepat, integritas)?',
    'Apakah distribusi, akses, pengambilan, dan penggunaan dokumen dikendalikan?',
    'Apakah penyimpanan dan preservasi (termasuk keterbacaan), pengendalian perubahan (versi), serta retensi dan disposisi dikendalikan?',
    'Apakah pelindungan dan keamanan, termasuk redundansi (cadangan/backup) dan kerahasiaan, dipastikan?',
    'Apakah penggunaan dokumen kedaluwarsa yang tidak disengaja dicegah?',
    'Apakah dokumen eksternal (regulasi, standar) yang diperlukan diidentifikasi dan dikendalikan?',
    'Apakah pengendalian yang ditetapkan dipelihara sebagai informasi terdokumentasi?'
  ],
  ev:{ u:'SOP pengendalian dokumen; daftar induk dokumen & rekaman; jadwal retensi arsip; bukti backup; daftar regulasi eksternal',
       sek:'Daftar regulasi (Kemendikdasmen/Kemenag, dinas); arsip buku induk', pt:'Daftar regulasi (Kemdiktisaintek, SN-Dikti, LAM); sistem e-office/arsip' },
  chg:'Substansi sama (urutan butir berbeda).' },

/* ---------------------------------------------------------------- 8 */
{ k:'8.1.1', g:'8', no:{18:'8.1.1',25:'8.1.1'}, t:'Perencanaan dan pengendalian operasional — umum',
  items:[
    'Apakah proses untuk memenuhi persyaratan layanan pendidikan dan melaksanakan tindakan dari klausul 6 direncanakan, diterapkan, dan dikendalikan?',
    'Apakah kriteria proses ditetapkan dan pengendalian dilakukan sesuai kriteria tersebut?',
    'Apakah persyaratan layanan pendidikan dan sumber daya untuk mencapainya ditentukan?',
    'Apakah informasi terdokumentasi disimpan untuk menunjukkan proses dilaksanakan sesuai rencana dan layanan memenuhi persyaratan?',
    '25|Apakah perubahan terencana dikendalikan dan konsekuensi perubahan yang tidak diinginkan ditinjau serta dimitigasi?',
    '25|Apakah proses yang disediakan pihak eksternal dan relevan dengan SMOP dikendalikan (lihat 8.4)?'
  ],
  ev:{ u:'Rencana operasional; SOP layanan; jadwal & rekaman pelaksanaan', sek:'Kalender pendidikan; jadwal pelajaran; program kerja wakil kepala', pt:'Kalender akademik; jadwal kuliah; rencana operasional unit' },
  chg:'2025 secara eksplisit menambahkan pengendalian perubahan dan pengendalian proses eksternal dalam 8.1.1.' },

{ k:'8.1.2', g:'8', no:{18:'8.1.2',25:'8.1.2'}, t:'Perencanaan dan pengendalian spesifik produk dan layanan pendidikan',
  items:[
    'Apakah capaian pembelajaran (learning outcomes) direncanakan?',
    'Apakah metode pengajaran dan lingkungan belajar yang sesuai dan aksesibel dipastikan?',
    '25|Apakah pelaksanaan pembelajaran direncanakan?',
    'Apakah kriteria asesmen ditetapkan dan pelaksanaan asesmen direncanakan?',
    'Apakah metode perbaikan ditetapkan dan dilaksanakan?',
    'Apakah layanan pendukung (bimbingan, konseling, administrasi, dsb.) direncanakan?',
    'Bila menyelenggarakan PAUD: apakah persyaratan tambahan Lampiran A diterapkan?'
  ],
  ev:{ tk:'KOSP PAUD; program semester; modul ajar/rencana harian', sek:'KOSP; ATP; modul ajar; program BK; jadwal asesmen',
       smk:'Kurikulum yang diselaraskan dengan DUDI; jadwal PKL', pt:'Kurikulum OBE; RPS; pedoman akademik; layanan kemahasiswaan & bimbingan akademik',
       vok:'Rencana praktik/magang industri' },
  chg:'2025 menambahkan “pelaksanaan pembelajaran” dan menyebut “asesmen” (2018: asesmen pembelajaran).' },

{ k:'8.1.3', g:'8', cond:'abk', no:{18:'8.1.3',25:'8.1.3'}, t:'Persyaratan tambahan peserta didik berkebutuhan khusus — operasional (anjuran)',
  items:[
    'S|Apakah ada fleksibilitas agar peserta didik ikut menyusun proses belajarnya (pembelajaran adaptif, materi akselerasi/pengayaan, pendaftaran ganda, tindakan individual, modifikasi kurikulum, rekognisi pembelajaran lampau)?',
    'S|Apakah tersedia lingkungan tim dengan sumber daya memadai untuk membantu peserta didik mencapai potensi optimal?',
    'S|Apakah tersedia keterhubungan dengan peluang dunia kerja?',
    'S|Apakah tersedia makanan sehat dan bergizi bila diperlukan?'
  ],
  ev:{ u:'Program Pembelajaran Individual (PPI); profil peserta didik; dokumen modifikasi kurikulum',
       sek:'PPI bagi ABK; program akselerasi/pengayaan bagi peserta didik cerdas istimewa', pt:'RPL; layanan ULD; program magang inklusif' },
  chg:'Judul 2025: “learners with special needs”; isi sama (bersifat anjuran).' },

{ k:'8.2.1', g:'8', no:{18:'8.2.1',25:'8.2.1'}, t:'Penentuan persyaratan produk dan layanan pendidikan',
  items:[
    'Apakah persyaratan layanan ditetapkan, termasuk yang berasal dari kebijakan dan rencana strategis organisasi?',
    'Apakah persyaratan berasal dari analisis kebutuhan peserta didik (saat ini dan potensial), khususnya yang berkebutuhan khusus?',
    'Apakah persyaratan mempertimbangkan perkembangan internasional, pasar kerja, dan hasil riset?',
    'Apakah persyaratan kesehatan dan keselamatan yang berlaku dipertimbangkan?',
    'Apakah organisasi mampu memenuhi klaim yang dibuat atas layanan yang ditawarkan?'
  ],
  ev:{ tk:'Asesmen awal perkembangan anak; data kesehatan anak', sek:'Asesmen diagnostik awal; analisis kebutuhan peserta didik; regulasi kurikulum nasional',
       smk:'Sinkronisasi kurikulum dengan DUDI; analisis kebutuhan pasar kerja', pt:'Profil lulusan; tracer study; survei pengguna lulusan; SN-Dikti & level KKNI; masukan asosiasi prodi',
       vok:'Analisis kebutuhan industri & standar kompetensi kerja (SKKNI)', ked:'Kebutuhan formasi/kompetensi dari K/L pembina' },
  chg:'Substansi sama.' },

{ k:'8.2.2', g:'8', no:{18:'8.2.2',25:'8.2.2'}, t:'Komunikasi persyaratan produk dan layanan pendidikan',
  items:[
    'Apakah sebelum/awal layanan, peserta didik dan pihak terkait diberi informasi tujuan, format, dan isi layanan, termasuk instrumen dan kriteria evaluasi — dan pemahamannya dicek bila perlu?',
    'Apakah komitmen, tanggung jawab, dan harapan terhadap peserta didik dikomunikasikan?',
    'Apakah cara pengakuan dan perekaman hasil belajar dikomunikasikan?',
    'Apakah mekanisme bila terjadi ketidakpuasan atau perselisihan dikomunikasikan?',
    'Apakah pihak yang mendukung pembelajaran & evaluasi serta caranya dikomunikasikan?',
    'Apakah seluruh biaya (biaya pendidikan, ujian, bahan belajar) dan prasyarat (keterampilan termasuk TIK, kualifikasi, pengalaman) dikomunikasikan?'
  ],
  ev:{ tk:'Pertemuan awal orang tua; informasi biaya & program', sek:'MPLS; sosialisasi KOSP ke orang tua; rincian biaya/sumbangan komite',
       pt:'PKKMB; pedoman akademik; kontrak kuliah; RPS di LMS; informasi UKT/biaya', vok:'Informasi prasyarat praktik & sertifikasi' },
  chg:'Substansi sama.' },

{ k:'8.2.3', g:'8', no:{18:'8.2.3',25:'8.2.3'}, t:'Perubahan persyaratan produk dan layanan pendidikan',
  items:[
    'Saat persyaratan layanan berubah, apakah informasi terdokumentasi terkait diubah dan pihak berkepentingan yang relevan diberi tahu?'
  ],
  ev:{ u:'Revisi kurikulum/kalender beserta bukti sosialisasinya' },
  chg:'Substansi sama.' },

{ k:'8.3.1', g:'8', no:{18:'8.3.1',25:'8.3.1'}, t:'Desain dan pengembangan — umum',
  items:[
    'Apakah proses desain dan pengembangan layanan pendidikan telah ditetapkan, diterapkan, dan dipelihara?'
  ],
  ev:{ tk:'Prosedur penyusunan KOSP PAUD', sek:'Prosedur penyusunan/peninjauan KOSP & modul ajar', pt:'Pedoman pengembangan kurikulum; SOP penyusunan RPS' },
  chg:'Substansi sama.' },

{ k:'8.3.2', g:'8', no:{18:'8.3.2',25:'8.3.2'}, t:'Perencanaan desain dan pengembangan',
  items:[
    'Apakah perencanaan desain mempertimbangkan persyaratan 8.2, sifat, durasi, dan kompleksitas kegiatan desain?',
    'Apakah tahapan proses, tinjauan, verifikasi, dan validasi desain direncanakan?',
    'Apakah tanggung jawab, wewenang, kebutuhan sumber daya internal/eksternal, dan antarmuka antar personel desain ditetapkan?',
    'Apakah keterlibatan peserta didik dan penerima manfaat lain dalam desain dipertimbangkan, termasuk tingkat kendali yang mereka harapkan?',
    'Apakah persyaratan penyampaian layanan selanjutnya dan informasi terdokumentasi yang diperlukan dipertimbangkan?',
    'Apakah pendekatan berbasis bukti, jalur belajar individual, serta aspek reusability, aksesibilitas, interoperabilitas, dan daya tahan alat penyusunan materi dipertimbangkan?'
  ],
  ev:{ u:'Rencana/jadwal pengembangan kurikulum; SK tim pengembang', sek:'Jadwal & tim penyusun KOSP; keterlibatan komite/orang tua',
       pt:'Rencana peninjauan kurikulum; lokakarya kurikulum dengan stakeholder; SK tim kurikulum' },
  chg:'Substansi sama.' },

{ k:'8.3.3', g:'8', no:{18:'8.3.3',25:'8.3.3'}, t:'Input desain dan pengembangan',
  items:[
    'Apakah persyaratan esensial untuk jenis layanan yang didesain telah ditentukan (fungsional dan kinerja)?',
    'Apakah informasi dari desain serupa sebelumnya, standar/kode praktik yang dianut, dan potensi konsekuensi kegagalan dipertimbangkan?',
    'Apakah input lengkap, tidak ambigu, memadai, dan input yang bertentangan diselesaikan?',
    'Apakah rekaman input desain disimpan?'
  ],
  ev:{ sek:'Capaian Pembelajaran nasional; hasil evaluasi kurikulum tahun lalu; analisis Rapor Pendidikan',
       pt:'SN-Dikti; KKNI; standar kompetensi profesi; hasil evaluasi kurikulum sebelumnya; masukan pengguna lulusan', vok:'SKKNI/standar industri' },
  chg:'Substansi sama.' },

{ k:'8.3.4.1', g:'8', no:{18:'8.3.4.1',25:'8.3.4.1'}, t:'Pengendalian desain dan pengembangan — umum',
  items:[
    'Apakah hasil yang hendak dicapai dari desain telah ditetapkan?',
    'Apakah tinjauan dilakukan untuk mengevaluasi kemampuan hasil desain memenuhi persyaratan?',
    'Apakah verifikasi dan validasi dilakukan untuk memastikan layanan hasil desain memenuhi persyaratan penggunaan?',
    'Apakah tindakan diambil atas masalah yang ditemukan saat tinjauan/verifikasi/validasi?',
    'Apakah rekaman hasil tinjauan, verifikasi, validasi, dan persyaratan baru disimpan?'
  ],
  ev:{ u:'Berita acara tinjauan & validasi kurikulum', sek:'Validasi KOSP oleh dinas/pengawas; rekaman reviu modul ajar', pt:'Berita acara validasi kurikulum oleh senat/stakeholder; reviu RPS' },
  chg:'Substansi sama.' },

{ k:'8.3.4.2', g:'8', no:{18:'8.3.4.2',25:'8.3.4.2'}, t:'Pengendalian desain layanan pendidikan',
  items:[
    'Apakah tujuan dan ruang lingkup program/mata pelajaran/mata kuliah ditetapkan dengan memperhatikan kebutuhan studi lanjut atau kerja?',
    'Apakah prasyarat (bila ada) dan karakteristik peserta didik ditetapkan?',
    'Apakah persyaratan studi lanjut atau dunia kerja diketahui, dan layanan mampu memenuhinya sesuai karakteristik peserta didik?',
    'Apakah karakteristik profil lulusan ditetapkan?'
  ],
  ev:{ tk:'Profil anak/kesiapan transisi PAUD–SD', sek:'Profil lulusan (dimensi profil lulusan); tujuan pembelajaran per fase', smk:'Profil lulusan sesuai kebutuhan DUDI',
       pt:'Profil lulusan; deskripsi program; prasyarat mata kuliah', vok:'Profil lulusan vokasi & okupasi sasaran' },
  chg:'Substansi sama.' },

{ k:'8.3.4.3', g:'8', no:{18:'8.3.4.3',25:'8.3.4.3'}, t:'Pengendalian desain kurikulum',
  items:[
    'Apakah capaian pembelajaran konsisten dengan ruang lingkup program dan dinyatakan sebagai kompetensi yang harus dikuasai peserta didik?',
    'Apakah capaian pembelajaran menyebutkan tingkat penguasaan dan bersifat SMART (spesifik, terukur, dapat dicapai, relevan, berbatas waktu)?',
    'Apakah kegiatan belajar sesuai metode penyampaian, tepat untuk mencapai capaian pembelajaran, dan bersifat SMART?',
    'Apakah seluruh sumber daya untuk menyelesaikan kegiatan belajar ditetapkan?',
    'Apakah desain memberi kesempatan peserta didik berperan aktif dan memuat asesmen formatif serta umpan balik?'
  ],
  ev:{ tk:'Tujuan pembelajaran fase fondasi; rencana kegiatan bermain', sek:'Capaian Pembelajaran → Tujuan Pembelajaran → ATP; modul ajar; asesmen formatif',
       pt:'CPL → CPMK → Sub-CPMK; peta kurikulum; RPS; metode pembelajaran berpusat pada mahasiswa', vok:'Proporsi praktik; pembelajaran berbasis proyek/industri' },
  chg:'Substansi sama.' },

{ k:'8.3.4.4', g:'8', no:{18:'8.3.4.4',25:'8.3.4.4'}, t:'Pengendalian desain asesmen sumatif',
  items:[
    'Apakah ada keterkaitan yang jelas antara desain asesmen dan capaian pembelajaran (serta kegiatan belajar, bila relevan)?',
    'Apakah asesmen dirancang dengan prinsip transparansi, aksesibilitas, penghormatan pada peserta didik, dan keadilan — khususnya dalam pemberian nilai?',
    'Apakah sistem penilaian/grading ditetapkan dan divalidasi?'
  ],
  ev:{ tk:'Instrumen asesmen perkembangan', sek:'Kisi-kisi asesmen sumatif; KKTP; pedoman penilaian & kenaikan kelas',
       pt:'Blueprint ujian; rubrik; pedoman penilaian (konversi nilai huruf); validasi soal', ked:'Blueprint uji kompetensi (bila ada)' },
  chg:'Substansi sama; 2025 menambah rujukan ISO 29992.' },

{ k:'8.3.5', g:'8', no:{18:'8.3.5',25:'8.3.5'}, t:'Output desain dan pengembangan',
  items:[
    'Apakah output desain memenuhi persyaratan input dan memadai untuk proses penyampaian layanan?',
    'Apakah output memuat/merujuk persyaratan pemantauan & pengukuran serta kriteria penerimaan?',
    'Apakah output menetapkan karakteristik esensial layanan untuk tujuan dan penyampaian yang aman?',
    'Apakah output disimpan sebagai informasi terdokumentasi?'
  ],
  ev:{ sek:'KOSP yang disahkan; modul ajar final', pt:'Dokumen kurikulum yang disahkan; RPS final; bahan ajar' },
  chg:'Substansi sama.' },

{ k:'8.3.6', g:'8', no:{18:'8.3.6',25:'8.3.6'}, t:'Perubahan desain dan pengembangan',
  items:[
    'Apakah perubahan selama atau setelah desain diidentifikasi, ditinjau, dan dikendalikan agar tidak berdampak buruk?',
    'Apakah rekaman perubahan, hasil tinjauan, otorisasi, dan tindakan pencegahan dampak buruk disimpan?'
  ],
  ev:{ u:'Riwayat revisi kurikulum/modul/RPS beserta pengesahan' },
  chg:'Substansi sama.' },

{ k:'8.4.1', g:'8', no:{18:'8.4.1',25:'8.4.1'}, t:'Pengendalian proses, produk, dan layanan dari penyedia eksternal — umum',
  items:[
    'Apakah organisasi memastikan proses, produk, dan layanan dari penyedia eksternal memenuhi persyaratan?',
    'Apakah pengendalian ditetapkan untuk produk/layanan eksternal yang diintegrasikan, yang diberikan langsung kepada peserta didik, atau proses yang dialihdayakan?',
    'Apakah kriteria evaluasi, seleksi, pemantauan kinerja, dan evaluasi ulang penyedia eksternal ditetapkan dan diterapkan?',
    'Apakah rekaman kegiatan tersebut dan tindak lanjut hasil evaluasi disimpan?'
  ],
  ev:{ u:'Daftar penyedia; kriteria & hasil evaluasi penyedia; kontrak/MoU',
       tk:'Katering, antar-jemput, penyedia APE', sek:'Katering/kantin, transportasi, pelatih ekstrakurikuler, pengadaan melalui SIPLah, kebersihan/keamanan', smk:'Mitra PKL/DUDI; LSP',
       pt:'Mitra magang; lahan praktik; penyedia SIAKAD/LMS; dosen tamu/praktisi; penerbit', vok:'Mitra industri tempat praktik/magang',
       ked:'Lahan praktik (mis. rumah sakit/puskesmas bagi PT kesehatan) dan pembimbing lapangan' },
  chg:'Substansi sama.' },

{ k:'8.4.2', g:'8', no:{18:'8.4.2',25:'8.4.2'}, t:'Jenis dan tingkat pengendalian',
  items:[
    'Apakah proses eksternal tetap berada dalam kendali SMOP?',
    'Apakah pengendalian terhadap penyedia eksternal dan terhadap output-nya ditetapkan?',
    'Apakah dampak potensial dan efektivitas pengendalian penyedia dipertimbangkan?',
    'Apakah verifikasi atau kegiatan lain untuk memastikan pemenuhan persyaratan ditetapkan?'
  ],
  ev:{ u:'Rencana pemantauan penyedia; laporan monitoring; berita acara serah terima', pt:'Monev pembelajaran di lahan praktik/mitra magang' },
  chg:'Substansi sama.' },

{ k:'8.4.3', g:'8', no:{18:'8.4.3',25:'8.4.3'}, t:'Informasi untuk penyedia eksternal',
  items:[
    'Apakah kecukupan persyaratan dipastikan sebelum dikomunikasikan ke penyedia eksternal?',
    'Apakah persyaratan terkait proses/produk/layanan, persetujuan (produk, metode, peralatan, pelepasan), dan kompetensi personel penyedia dikomunikasikan?',
    'Apakah interaksi, pengendalian & pemantauan kinerja, serta verifikasi/validasi di lokasi penyedia dikomunikasikan?'
  ],
  ev:{ u:'Kontrak/MoU/PKS dan lampiran spesifikasi; kerangka acuan kerja', pt:'PKS dengan mitra magang/lahan praktik memuat kompetensi pembimbing' },
  chg:'Substansi sama.' },

{ k:'8.5.1.1', g:'8', no:{18:'8.5.1.1',25:'8.5.1.1'}, t:'Pengendalian penyampaian layanan — umum',
  items:[
    'Apakah tersedia informasi terdokumentasi tentang karakteristik layanan dan hasil yang hendak dicapai?',
    'Apakah sumber daya pemantauan & pengukuran yang sesuai dan tervalidasi tersedia dan digunakan?',
    'Apakah pemantauan dan pengukuran (termasuk keluhan, umpan balik, dan hasil asesmen) dilakukan pada tahapan yang tepat?',
    'Apakah infrastruktur dan lingkungan yang sesuai digunakan, dan personel kompeten ditunjuk?',
    'Apakah validasi (dan revalidasi berkala) dilakukan bila output tidak dapat diverifikasi kemudian?',
    'Apakah tindakan pencegahan kesalahan manusia diterapkan?',
    'Apakah kegiatan pelepasan, penyampaian, dan pasca-penyampaian dilaksanakan?'
  ],
  ev:{ sek:'Jadwal; jurnal mengajar; supervisi akademik; rekap asesmen', pt:'BAP perkuliahan; monev pembelajaran; evaluasi dosen oleh mahasiswa (EDOM)' },
  chg:'2025 merumuskan ulang “hasil asesmen formatif” menjadi “hasil asesmen”.' },

{ k:'8.5.1.2', g:'8', no:{18:'8.5.1.2',25:'8.5.1.2'}, t:'Penerimaan peserta didik',
  items:[
    'Apakah sebelum diterima, calon peserta didik memperoleh informasi memadai (persyaratan organisasi & profesi, komitmen tanggung jawab sosial)?',
    'Apakah informasi capaian pembelajaran, prospek karier, pendekatan pendidikan, partisipasi peserta didik, kriteria penerimaan, dan biaya disampaikan secara jelas?',
    'Apakah proses penerimaan ditetapkan dengan kriteria yang sesuai persyaratan organisasi, bidang profesi, dan isi program/pendekatan pedagogis?',
    'Apakah kriteria dan proses penerimaan diterapkan seragam untuk semua calon peserta didik?',
    'Apakah proses penerimaan didokumentasikan dan tersedia untuk publik?',
    'Apakah setiap keputusan penerimaan mampu telusur dan rekamannya disimpan?'
  ],
  ev:{ tk:'Informasi pendaftaran; kriteria usia; berkas pendaftaran', sek:'Juknis SPMB/PPDB (jalur domisili, afirmasi, prestasi, mutasi); pengumuman hasil; berkas seleksi',
       pt:'Pedoman PMB (jalur nasional & mandiri); brosur/website; berita acara & SK penetapan kelulusan seleksi', ked:'Ketentuan seleksi dari K/L pembina' },
  chg:'Substansi sama.' },

{ k:'8.5.1.3', g:'8', no:{18:'8.5.1.3',25:'8.5.1.3'}, t:'Penyampaian produk dan layanan pendidikan',
  items:[
    'Apakah proses pengajaran telah ditetapkan?',
    'Apakah proses fasilitasi pembelajaran telah ditetapkan?',
    'Apakah proses dukungan administrasi pembelajaran telah ditetapkan?'
  ],
  ev:{ tk:'Rencana kegiatan harian; presensi anak', sek:'Jadwal pelajaran; jurnal kelas; presensi; layanan tata usaha', pt:'Jadwal kuliah; presensi; LMS; perwalian/dosen PA; layanan administrasi akademik' },
  chg:'Substansi sama.' },

{ k:'8.5.1.4', g:'8', no:{18:'8.5.1.4',25:'8.5.1.4'}, t:'Asesmen sumatif',
  items:[
    '18|Apakah metode untuk mendeteksi plagiarisme dan malpraktik lain tersedia dan dikomunikasikan kepada peserta didik?',
    '25|Apakah langkah pengamanan asesmen untuk mencegah dan mendeteksi plagiarisme dan malpraktik lain diterapkan dan dikomunikasikan kepada peserta didik, pengawas ujian, dan pihak terkait?',
    'Apakah nilai mampu telusur, sehingga ada hubungan objektif antara hasil asesmen peserta didik dan nilai yang diberikan?',
    'Apakah rekaman asesmen disimpan sebagai bukti nilai yang diberikan?',
    'Apakah masa retensi rekaman asesmen diumumkan kepada publik?'
  ],
  ev:{ sek:'Tata tertib ujian; berita acara & daftar hadir ujian; bank soal; rekap nilai/e-Rapor; jadwal retensi arsip',
       pt:'Tata tertib ujian; pengawas; alat cek kemiripan (tugas akhir/skripsi); rekap nilai di SIAKAD; kebijakan retensi', vok:'Uji kompetensi/sertifikasi' },
  chg:'2025 menekankan langkah pengamanan untuk MENCEGAH dan mendeteksi malpraktik, dan komunikasinya juga kepada pengawas ujian.' },

{ k:'8.5.1.5', g:'8', no:{18:'8.5.1.5',25:'8.5.1.5'}, t:'Pengakuan hasil belajar yang dinilai',
  items:[
    'Setelah asesmen sumatif, apakah peserta didik diberi tahu skor dan nilainya?',
    'Apakah peserta didik diberi kesempatan mengajukan banding atau perbaikan nilai?',
    'Apakah peserta didik memiliki akses penuh ke hasil kerjanya beserta rincian skor dan kesempatan umpan balik?',
    'Apakah bukti skor diterbitkan kepada peserta didik sebagai informasi terdokumentasi?',
    'Apakah alasan keputusan penilaian dan skor akhir disimpan untuk masa retensi tertentu yang diumumkan kepada publik?'
  ],
  ev:{ tk:'Laporan perkembangan anak', sek:'Rapor; mekanisme konfirmasi nilai; ijazah/SKL', pt:'KHS/transkrip; prosedur banding/koreksi nilai; ijazah & SKPI' },
  chg:'2025 menggunakan istilah “skor dan nilai asesmen” (2018: “hasil asesmen”).' },

{ k:'8.5.1.6', g:'8', cond:'abk', no:{18:'8.5.1.6',25:'8.5.1.6'}, t:'Penyampaian & asesmen — tambahan pendidikan kebutuhan khusus',
  items:[
    'S|Apakah, dengan masukan peserta didik dan pihak lain, langkah peningkatan aksesibilitas layanan diidentifikasi?',
    'S|Apakah strategi pembelajaran berdiferensiasi dan pendekatan untuk kesadaran diri, regulasi diri, dan metakognisi digunakan?',
    'S|Apakah tindakan individual (modifikasi kurikulum, kemandirian, tutor & mentor) diterapkan secara fleksibel?',
    'S|Apakah asesmen menyediakan banyak dan beragam kesempatan menunjukkan penguasaan, dengan scaffolding dan metode evaluasi yang sesuai?',
    'Apakah peserta didik yang memerlukan bantuan khusus diakomodasi dengan menyeimbangkan kebutuhannya, integritas capaian pembelajaran, dan kapasitas organisasi?'
  ],
  ev:{ u:'PPI; modifikasi asesmen; rekaman akomodasi', sek:'Pendampingan GPK; asesmen yang diadaptasi', pt:'Layanan ULD (pendamping, waktu ujian tambahan, format alternatif)' },
  chg:'Substansi sama.' },

{ k:'8.5.2', g:'8', no:{18:'8.5.2',25:'8.5.2'}, t:'Identifikasi dan ketertelusuran',
  items:[
    'Apakah kemajuan peserta didik selama di organisasi dapat diidentifikasi dan ditelusuri?',
    'Apakah jalur studi lanjut dan pekerjaan lulusan ditelusuri (bila relevan)?',
    'Apakah output pekerjaan staf dapat ditelusuri: apa yang dilakukan, kapan, dan oleh siapa?'
  ],
  ev:{ tk:'Buku induk anak; catatan perkembangan', sek:'Buku induk; Dapodik/EMIS; rapor; data kelanjutan studi lulusan', smk:'Penelusuran tamatan oleh BKK',
       pt:'Data PDDikti; KHS/transkrip; tracer study; rekam jejak kinerja dosen (BKD)' },
  chg:'Substansi sama.' },

{ k:'8.5.3', g:'8', no:{18:'8.5.3',25:'8.5.3'}, t:'Properti milik pihak berkepentingan',
  items:[
    'Apakah properti milik pihak berkepentingan (materi, peralatan, kekayaan intelektual, data pribadi, nilai, sertifikat, ijazah) dijaga selama di bawah kendali organisasi?',
    'Apakah properti tersebut diidentifikasi, diverifikasi, dilindungi, dan persetujuan diperoleh bila dimasukkan ke dalam layanan?',
    'Bila properti hilang/rusak/tidak layak, apakah hal itu dilaporkan kepada pemiliknya, ditindaklanjuti, dan direkam?'
  ],
  ev:{ u:'Prosedur penitipan dokumen/ijazah; izin publikasi karya; laporan kehilangan', pt:'Izin penggunaan karya mahasiswa; penyimpanan ijazah; data penelitian' },
  chg:'Substansi sama.' },

{ k:'8.5.4', g:'8', no:{18:'8.5.4',25:'8.5.4'}, t:'Preservasi',
  items:[
    'Apakah output selama penyampaian layanan dipreservasi sejauh diperlukan untuk menjamin kesesuaian (mis. lembar jawaban, karya, portofolio, rekaman nilai)?'
  ],
  ev:{ u:'Penyimpanan lembar jawaban, portofolio, dan arsip nilai; backup sistem' },
  chg:'Substansi sama.' },

{ k:'8.5.5', g:'8', no:{18:'8.5.5',25:'8.5.5'}, t:'Pelindungan dan transparansi data peserta didik',
  items:[
    'Apakah metode pelindungan dan transparansi data peserta didik ditetapkan dan didokumentasikan: data apa yang dikumpulkan, cara/tempat pemrosesan dan penyimpanan, siapa yang berhak akses, syarat berbagi ke pihak ketiga, dan lama penyimpanan?',
    'Apakah data peserta didik hanya dikumpulkan dan dibagikan dengan persetujuan eksplisit?',
    'Apakah data hanya dapat diakses oleh pihak berwenang, dan langkah pelindungan teknologi divalidasi?',
    'Apakah peserta didik dan pihak berkepentingan diberi akses ke datanya sendiri?',
    'S|Apakah peserta didik dapat memperbaiki/memperbarui datanya sendiri?'
  ],
  ev:{ u:'Kebijakan pelindungan data pribadi (selaras UU 27/2022 PDP); formulir persetujuan; matriks hak akses; log akses; uji keamanan sistem',
       tk:'Persetujuan orang tua atas dokumentasi/foto anak', sek:'Hak akses Dapodik/EMIS & e-Rapor; persetujuan publikasi foto', pt:'Hak akses SIAKAD/PDDikti; kebijakan keamanan TI' },
  chg:'Substansi sama.' },

{ k:'8.5.6', g:'8', no:{18:'8.5.6',25:'8.5.6'}, t:'Pengendalian perubahan dalam produk dan layanan pendidikan',
  items:[
    'Apakah perubahan dalam penyampaian layanan ditinjau dan dikendalikan agar kesesuaian tetap terjaga?',
    'Apakah rekaman hasil tinjauan perubahan, pihak yang mengotorisasi, dan tindakan yang diperlukan disimpan?'
  ],
  ev:{ u:'Rekaman perubahan jadwal/pengajar/metode beserta persetujuan', pt:'Perubahan jadwal kuliah & kuliah pengganti; pergantian dosen pengampu' },
  chg:'Substansi sama.' },

{ k:'8.6', g:'8', no:{18:'8.6',25:'8.6'}, t:'Pelepasan produk dan layanan pendidikan',
  items:[
    'Apakah pelepasan layanan (mis. nilai, rapor, kelulusan, ijazah, bahan ajar) tidak dilakukan sebelum pengaturan yang direncanakan selesai, kecuali disetujui pihak berwenang?',
    'Apakah rekaman pelepasan memuat bukti kesesuaian dengan kriteria penerimaan dan ketertelusuran kepada pihak yang mengotorisasi?'
  ],
  ev:{ tk:'Pengesahan laporan perkembangan', sek:'Rapat dewan guru kenaikan kelas/kelulusan; pengesahan rapor & ijazah oleh kepala sekolah',
       pt:'Yudisium; SK kelulusan; pengesahan ijazah/transkrip; verifikasi bahan ajar' },
  chg:'Substansi sama.' },

{ k:'8.7', g:'8', no:{18:'8.7',25:'8.7'}, t:'Pengendalian output pendidikan yang tidak sesuai',
  items:[
    'Apakah output yang tidak sesuai diidentifikasi dan dikendalikan untuk mencegah penggunaan/penyampaian yang tidak diinginkan, termasuk yang terdeteksi setelah layanan diberikan?',
    'Apakah tindakan disesuaikan dengan sifat dan dampak ketidaksesuaian (koreksi; pemisahan/penghentian sementara layanan; pemberitahuan ke peserta didik; konsesi)?',
    'Apakah kesesuaian diverifikasi ulang setelah dikoreksi?',
    'Apakah rekaman memuat ketidaksesuaian, tindakan, konsesi, dan pihak berwenang yang memutuskan?'
  ],
  ev:{ u:'Log ketidaksesuaian layanan; rekaman koreksi', sek:'Remedial; ralat nilai/rapor; pembelajaran pengganti',
       pt:'Kuliah pengganti; ralat nilai/ijazah; pembatalan ujian bermasalah' },
  chg:'Substansi sama.' },

/* ---------------------------------------------------------------- 9 */
{ k:'9.1.1', g:'9', no:{18:'9.1.1',25:'9.1.1'}, t:'Pemantauan, pengukuran, analisis, dan evaluasi — umum',
  items:[
    'Apakah telah ditetapkan apa yang dipantau dan diukur, metodenya, waktunya, kapan dianalisis, dan kriteria penerimaannya?',
    'Apakah rekaman hasil pemantauan dan pengukuran tersedia?',
    'Apakah kinerja dan efektivitas SMOP dievaluasi?',
    '18S|Apakah personel diberi kesempatan meninjau pekerjaannya sendiri secara reflektif dan konstruktif?',
    '25|Apakah staf diberi kesempatan meninjau pekerjaannya sendiri secara reflektif dan konstruktif sebagai kontribusi perbaikan?'
  ],
  ev:{ u:'Matriks indikator & jadwal monev; laporan monev', sek:'Refleksi guru; supervisi; Rapor Pendidikan; monev Budaya Sekolah Aman dan Nyaman (paling sedikit setahun sekali) dan laporannya ke Pokja', pt:'Laporan monev SPMI; refleksi dosen (portofolio mengajar)' },
  chg:'Refleksi diri staf menjadi keharusan (“shall”) di 2025; di 2018 bersifat anjuran.' },

{ k:'9.1.2', g:'9', no:{18:'9.1.2',25:'9.1.2'}, t:'Kepuasan peserta didik, penerima manfaat lain, dan staf; penanganan keluhan & banding',
  items:[
    'Apakah kepuasan peserta didik, penerima manfaat lain, dan staf, serta persepsi pemenuhan kebutuhan mereka, dipantau dengan metode yang ditetapkan?',
    'Apakah metode penanganan keluhan dan banding ditetapkan, didokumentasikan, dan diketahui oleh pihak berkepentingan?',
    'Apakah metode mencakup penerimaan, pelacakan, pemberitahuan penerimaan, penilaian awal, investigasi, tanggapan, komunikasi keputusan, dan penutupan keluhan/banding?',
    'Apakah kerahasiaan pengadu dan objektivitas investigator dijamin?',
    'Apakah rekaman keluhan/banding yang diterima dan penyelesaiannya disimpan?'
  ],
  ev:{ u:'Kuesioner & laporan survei kepuasan; SOP & log pengaduan',
       tk:'Survei kepuasan orang tua', sek:'Survei kepuasan peserta didik, orang tua, guru; kotak saran; kanal pengaduan kekerasan/perundungan',
       pt:'Survei kepuasan mahasiswa, dosen, tendik, mitra, pengguna lulusan; unit layanan pengaduan; tindak lanjut hasil survei' },
  chg:'Substansi sama.' },

{ k:'9.1.3', g:'9', no:{18:'9.1.3',25:'9.1.3'}, t:'Kebutuhan pemantauan dan pengukuran lain',
  items:[
    'Apakah umpan balik tentang layanan pendidikan diminta dari pihak berkepentingan dan dibagikan kepada mereka sesuai kebutuhan?',
    'Apakah umpan balik tentang efektivitas pencapaian capaian pembelajaran yang disepakati diminta?',
    'Apakah umpan balik tentang pengaruh organisasi terhadap masyarakat diminta?',
    'Apakah tingkat respons umpan balik dipantau dan ditingkatkan bila belum memadai?'
  ],
  ev:{ u:'Rekap tingkat respons survei; tindak lanjut peningkatan partisipasi', pt:'Response rate tracer study & EDOM; survei dampak pengabdian masyarakat' },
  chg:'Substansi sama.' },

{ k:'9.1.4', g:'9', no:{18:'9.1.4',25:'9.1.4'}, t:'Metode pemantauan, pengukuran, analisis, dan evaluasi',
  items:[
    'Apakah metode memperoleh, memantau, dan meninjau informasi kinerja serta target kinerja (KPI) ditetapkan?',
    'Apakah pihak yang terlibat atau terdampak evaluasi diidentifikasi?',
    'Apakah evaluator kompeten dan objektif?',
    'Apakah laporan evaluasi transparan, menjelaskan layanan dan tujuannya, temuan, serta perspektif, metode, dan dasar interpretasi?',
    'Apakah konteks penyampaian layanan (mis. lingkungan belajar) dikaji cukup rinci untuk mengidentifikasi pengaruhnya?'
  ],
  ev:{ u:'Pedoman monev; daftar KPI & target; laporan evaluasi', pt:'Pedoman monev SPMI; laporan evaluasi diri prodi' },
  chg:'Substansi sama.' },

{ k:'9.1.5', g:'9', no:{18:'9.1.5',25:'9.1.5'}, t:'Analisis dan evaluasi',
  items:[
    'Apakah data hasil pemantauan dan pengukuran dianalisis dan dievaluasi?',
    'Apakah hasil analisis digunakan untuk mengevaluasi kesesuaian layanan serta kepuasan penerima manfaat dan staf?',
    'Apakah hasil analisis digunakan untuk mengevaluasi kinerja & efektivitas SMOP dan efektivitas pelaksanaan perencanaan?',
    'Apakah hasil analisis digunakan untuk mengevaluasi efektivitas penanganan risiko & peluang, kinerja penyedia eksternal, dan kebutuhan perbaikan?'
  ],
  ev:{ u:'Laporan analisis data mutu (kuantitatif/kualitatif); bahan RTM', sek:'Analisis Rapor Pendidikan & hasil asesmen', pt:'Laporan analisis capaian IKU/standar SPMI' },
  chg:'Substansi sama.' },

{ k:'9.2.1', g:'9', no:{18:'9.2.1',25:'9.2.1'}, t:'Audit internal — umum',
  items:[
    'Apakah audit internal dilaksanakan pada selang waktu terencana?',
    'Apakah audit memberi informasi tentang kesesuaian SMOP terhadap persyaratan organisasi sendiri dan persyaratan standar?',
    'Apakah audit memberi informasi apakah SMOP diterapkan dan dipelihara secara efektif?'
  ],
  ev:{ u:'Jadwal & laporan audit internal', sek:'Laporan audit mutu internal sekolah; Evaluasi Diri Sekolah', pt:'Laporan Audit Mutu Internal (AMI)' },
  chg:'2025 memberi subjudul “General”; substansi sama.' },

{ k:'9.2.2', g:'9', no:{18:'9.2.2',25:'9.2.2'}, t:'Program audit internal',
  items:[
    'Apakah program audit ditetapkan (frekuensi, metode, tanggung jawab, persyaratan perencanaan, pelaporan) dengan mempertimbangkan pentingnya proses, hasil audit sebelumnya, sasaran SMOP, dan umpan balik pihak berkepentingan?',
    '25|Apakah tujuan audit ditetapkan untuk setiap audit?',
    'Apakah kriteria dan ruang lingkup ditetapkan untuk setiap audit?',
    'Apakah auditor dipilih dan audit dilaksanakan secara objektif dan imparsial, serta auditor tidak mengaudit pekerjaannya sendiri?',
    'Apakah hasil audit dilaporkan kepada manajemen terkait dan peluang perbaikan diidentifikasi?',
    'Apakah koreksi dan tindakan korektif dilakukan tanpa penundaan yang tidak perlu?',
    'Apakah rekaman pelaksanaan program audit dan hasil audit tersedia?'
  ],
  ev:{ u:'Program audit tahunan; rencana audit; SK & kompetensi auditor; daftar periksa; laporan; PTK (permintaan tindakan koreksi) & verifikasinya',
       pt:'SK penugasan auditor AMI oleh pimpinan; bukti pelatihan auditor; laporan AMI & tindak lanjut' },
  chg:'2025 menambahkan penetapan TUJUAN audit untuk setiap audit dan memisahkan subjudul “Internal audit programme”.' },

{ k:'9.3.1', g:'9', no:{18:'9.3.1',25:'9.3.1'}, t:'Tinjauan manajemen — umum',
  items:[
    'Apakah pimpinan puncak meninjau SMOP pada selang waktu terencana, sekurang-kurangnya satu kali setahun?',
    'Apakah tinjauan memastikan kesesuaian, kecukupan, dan efektivitas SMOP?',
    'Apakah strategi dan SMOP dimutakhirkan sesuai hasil tinjauan?'
  ],
  ev:{ u:'Undangan, daftar hadir, dan notulen Rapat Tinjauan Manajemen (RTM)', sek:'Rapat evaluasi akhir tahun pelajaran bersama komite', pt:'RTM tingkat institusi/fakultas/prodi' },
  chg:'Substansi sama (minimal sekali setahun).' },

{ k:'9.3.2', g:'9', no:{18:'9.3.2',25:'9.3.2'}, t:'Input tinjauan manajemen',
  items:[
    'Apakah RTM mencakup status tindak lanjut RTM sebelumnya dan perubahan isu internal/eksternal?',
    '25|Apakah RTM mencakup perubahan kebutuhan dan harapan pihak berkepentingan yang relevan?',
    'Apakah RTM mencakup tren kepuasan & umpan balik, capaian sasaran, kinerja proses & kesesuaian layanan?',
    'Apakah RTM mencakup tren ketidaksesuaian & tindakan korektif, hasil pemantauan & pengukuran, hasil audit, dan kinerja penyedia eksternal?',
    'Apakah RTM mencakup hasil asesmen formatif dan sumatif?',
    'Apakah RTM mencakup kecukupan sumber daya, efektivitas penanganan risiko & peluang, dan peluang perbaikan?',
    'Apakah RTM mencakup umpan balik staf terkait kegiatan peningkatan kompetensinya?'
  ],
  ev:{ u:'Bahan/materi RTM dan notulen yang membahas setiap input' },
  chg:'2025 menambahkan input “perubahan kebutuhan dan harapan pihak berkepentingan”.' },

{ k:'9.3.3', g:'9', no:{18:'9.3.3',25:'9.3.3'}, t:'Output/hasil tinjauan manajemen',
  items:[
    'Apakah hasil RTM memuat keputusan terkait peluang perbaikan berkelanjutan?',
    'Apakah hasil RTM memuat keputusan tentang kebutuhan perubahan SMOP?',
    '18|Apakah hasil RTM memuat keputusan tentang kebutuhan sumber daya?',
    'Apakah rekaman hasil RTM tersedia sebagai bukti?'
  ],
  ev:{ u:'Notulen RTM berisi keputusan, PIC, tenggat; bukti tindak lanjut' },
  chg:'2018 menyebut “outputs” termasuk kebutuhan sumber daya; 2025 menyebut “results” tanpa butir sumber daya.' },

/* ---------------------------------------------------------------- 10 */
{ k:'10.CI', g:'10', no:{18:'10.2',25:'10.1'}, t:'Peningkatan berkelanjutan',
  items:[
    'Apakah kesesuaian, kecukupan, dan efektivitas SMOP ditingkatkan secara berkelanjutan?',
    'Apakah riset dan praktik terbaik yang relevan dipertimbangkan?',
    'Apakah hasil analisis & evaluasi serta output RTM dipertimbangkan untuk menentukan kebutuhan/peluang perbaikan?'
  ],
  ev:{ u:'Program perbaikan; bukti perbaikan dari hasil RTM/audit; studi banding/benchmarking', pt:'Siklus PPEPP SPMI' },
  chg:'Nomor klausul berubah: 2018 = 10.2, 2025 = 10.1.' },

{ k:'10.NC', g:'10', no:{18:'10.1',25:'10.2'}, t:'Ketidaksesuaian dan tindakan korektif',
  items:[
    'Saat terjadi ketidaksesuaian, apakah organisasi bereaksi: mengendalikan, mengoreksi, dan menangani konsekuensinya?',
    'Apakah kebutuhan tindakan untuk menghilangkan penyebab dievaluasi (meninjau ketidaksesuaian, menentukan akar masalah, memeriksa ketidaksesuaian serupa)?',
    'Apakah tindakan yang diperlukan dilaksanakan dan efektivitasnya ditinjau?',
    'Apakah perubahan SMOP dilakukan bila perlu, dan tindakan korektif sepadan dengan dampaknya?',
    'Apakah rekaman sifat ketidaksesuaian, tindakan, dan hasil tindakan korektif tersedia?'
  ],
  ev:{ u:'Formulir PTK/CAR; analisis akar masalah (5 Why/fishbone); verifikasi efektivitas' },
  chg:'Nomor klausul berubah: 2018 = 10.1 (dengan 10.1.1 & 10.1.2), 2025 = 10.2.' },

{ k:'10.3', g:'10', no:{18:'10.3',25:'10.3'}, t:'Peluang perbaikan',
  items:[
    'Apakah peluang perbaikan ditentukan dan dipilih untuk memenuhi persyaratan dan meningkatkan kepuasan peserta didik, penerima manfaat, staf, dan pihak lain termasuk penyedia eksternal?',
    'Apakah perbaikan mencakup peningkatan layanan untuk kebutuhan saat ini dan masa depan?',
    'Apakah perbaikan mencakup koreksi, pencegahan, atau pengurangan efek yang tidak diinginkan?',
    'Apakah perbaikan mencakup peningkatan kinerja dan efektivitas SMOP?'
  ],
  ev:{ u:'Daftar inovasi/perbaikan; laporan tindak lanjut OFI' },
  chg:'Substansi sama.' },

/* ---------------------------------------------------------------- A */
{ k:'A.1', g:'A', cond:'paud', no:{18:'A.1',25:'A.1'}, t:'Umum (PAUD — ISCED 0)',
  items:[
    'Apakah layanan PAUD diperlakukan sebagai jenjang dengan identitasnya sendiri, dengan tujuan mendukung perkembangan fisik, emosional, sosial, dan intelektual anak?'
  ],
  ev:{ tk:'KOSP PAUD; visi–misi lembaga' }, chg:'Substansi sama.' },

{ k:'A.2', g:'A', cond:'paud', no:{18:'A.2',25:'A.2'}, t:'Prinsip',
  items:[
    'S|Apakah hak-hak anak dihormati sesuai Konvensi Hak Anak PBB?',
    'Apakah lembaga menumbuhkan bermain, kemandirian, kasih sayang, kerja sama, kreativitas, kegembiraan, dan kepercayaan diri anak?'
  ],
  ev:{ tk:'Observasi kegiatan bermain; kebijakan perlindungan anak' }, chg:'Substansi sama.' },

{ k:'A.3', g:'A', cond:'paud', no:{18:'A.3',25:'A.3'}, t:'Fasilitas PAUD',
  items:[
    'Apakah tersedia sumber belajar PAUD, fasilitas bermain, dan fasilitas pengasuhan (day care)?',
    '18S|Bila juga menyelenggarakan jenjang ISCED 1 ke atas: apakah tersedia ruang terpisah, pendidik khusus, dan sumber belajar khusus PAUD?',
    '25|Bila juga menyelenggarakan jenjang ISCED 1 ke atas: apakah tersedia ruang terpisah, pendidik khusus, dan sumber belajar khusus PAUD?'
  ],
  ev:{ tk:'Observasi ruang bermain, area tidur/istirahat; daftar APE' },
  chg:'Pemisahan ruang/pendidik PAUD bila satu lembaga dengan jenjang lebih tinggi menjadi KEHARUSAN di 2025 (2018: anjuran).' },

{ k:'A.4', g:'A', cond:'paud', no:{18:'A.4',25:'A.4'}, t:'Kompetensi pendidik PAUD',
  items:['Apakah pendidik mendapat pelatihan khusus PAUD sesuai kebutuhan?'],
  ev:{ tk:'Sertifikat diklat PAUD; kualifikasi pendidik' }, chg:'Substansi sama.' },

{ k:'A.5', g:'A', cond:'paud', no:{18:'A.5',25:'A.5'}, t:'Komunikasi dengan orang tua/wali',
  items:['Apakah ada metode komunikasi dengan orang tua, pendidik, dan wali yang menjamin alur informasi dan pengendalian keselamatan anak?'],
  ev:{ tk:'Buku penghubung; grup komunikasi orang tua; prosedur informasi darurat' }, chg:'Substansi sama.' },

{ k:'A.6', g:'A', cond:'paud', no:{18:'A.6',25:'A.6'}, t:'Rencana belajar individual',
  items:[
    'Apakah rencana individual disusun berdasarkan evaluasi kebutuhan & harapan anak dan keluarganya, mempertimbangkan kelompok anak, secara berkala, dan didokumentasikan?',
    'Apakah ditunjuk penanggung jawab penyusunan, pelaksanaan, koordinasi, evaluasi, dan peninjauan rencana individual?',
    'Apakah rencana memuat tujuan & indikator, kegiatan/strategi/sumber daya, peran setiap pihak, tenggat, risiko & tindakannya, serta jadwal evaluasi?',
    'Apakah anak dan keluarganya dilibatkan dalam penyusunan rencana individual?',
    'Apakah hasil evaluasi dan peninjauan rencana individual disimpan?'
  ],
  ev:{ tk:'Dokumen rencana individual anak; catatan anekdot; hasil karya; laporan perkembangan' }, chg:'Substansi sama.' },

{ k:'A.7', g:'A', cond:'paud', no:{18:'A.7–A.7.2',25:'A.7.1–A.7.3'}, t:'Penerimaan dan penyerahan (penjemputan) anak',
  items:[
    'Apakah proses penerimaan dan penyerahan anak ditetapkan, diterapkan, dan direkam?',
    'Apakah ditunjuk petugas dan lokasi untuk penerimaan anak, serta pertukaran informasi dengan keluarga?',
    'Apakah ditunjuk petugas dan lokasi untuk penyerahan anak, serta pertukaran informasi dengan keluarga?',
    'Apakah anak hanya diserahkan kepada orang yang berwenang (sesuai berkas individual anak), dan ada aturan untuk situasi pengecualian?',
    'Apakah kondisi kebersihan saat anak diserahkan ditetapkan?'
  ],
  ev:{ tk:'Daftar penjemput resmi; buku serah terima anak; SOP penjemputan' },
  chg:'Penomoran berubah: 2018 A.7 (umum), A.7.1 penerimaan, A.7.2 penyerahan; 2025 A.7.1 umum, A.7.2 penerimaan, A.7.3 penyerahan. Kondisi kebersihan saat penyerahan menjadi keharusan di 2025.' },

{ k:'A.8', g:'A', cond:'paud', no:{18:'A.8',25:'A.8'}, t:'Perawatan kebersihan',
  items:[
    'Apakah perawatan kebersihan sesuai kebutuhan individual setiap anak ditetapkan?',
    'Apakah kemandirian anak dalam kebersihan diri didorong secara bertahap?',
    'Apakah setiap anak memiliki perlengkapan kebersihan pribadi?',
    'Apakah rekaman kegiatan kebersihan dan perawatan setiap anak disimpan?'
  ],
  ev:{ tk:'Jadwal & catatan perawatan; perlengkapan pribadi berlabel' }, chg:'Substansi sama.' },

{ k:'A.9', g:'A', cond:'paud', no:{18:'A.9',25:'A.9'}, t:'Penanganan anak sakit atau kecelakaan',
  items:[
    'Apakah cara bertindak saat anak sakit atau mengalami kecelakaan ditetapkan dan kejadiannya direkam?',
    'Apakah aturan pemberian obat ditetapkan, didukung surat kuasa orang tua/wali dan resep dokter bila diperlukan?',
    'Apakah obat diidentifikasi, ditangani, dan disimpan dengan aman?',
    'Apakah rekaman pemberian obat (dosis, bentuk, rute, waktu) disimpan?'
  ],
  ev:{ tk:'SOP P3K; kotak P3K; formulir izin pemberian obat; log pemberian obat; kerja sama puskesmas' }, chg:'Substansi sama.' },

{ k:'A.10', g:'A', cond:'paud', no:{18:'A.10',25:'A.10'}, t:'Materi, peralatan, dan ruang pedagogis-bermain',
  items:[
    'Apakah materi, peralatan, dan ruang sesuai dengan usia dan situasi anak?',
    'Apakah frekuensi, metode, dan petugas kebersihan setiap materi/peralatan/ruang ditetapkan?',
    'Apakah rekaman kegiatan kebersihan materi, peralatan, dan ruang dipelihara?'
  ],
  ev:{ tk:'Jadwal & checklist kebersihan APE dan ruang' }, chg:'Substansi sama.' },

{ k:'A.11', g:'A', cond:'paud', no:{18:'A.11',25:'A.11'}, t:'Pengelolaan perilaku dan pencegahan kekerasan/penelantaran anak',
  items:[
    'Apakah ada informasi terdokumentasi tentang pengelolaan perilaku anak dan peningkatan kesejahteraannya?',
    'Apakah ada tindakan pencegahan kekerasan dan penelantaran anak, baik oleh staf maupun sesama anak?',
    'Apakah isu kekerasan/penelantaran dapat diidentifikasi, ditangani (di lembaga atau di rumah), dan dilaporkan kepada otoritas terkait?'
  ],
  ev:{ tk:'Kebijakan perlindungan anak; program Budaya Sekolah Aman dan Nyaman; alur pelaporan ke dinas/Pokja daerah/UPTD PPA' }, chg:'Substansi sama.' }
];

/* ---------- Jenjang & jenis perguruan tinggi ---------- */
const JENJANG = [
  { id:'tk',  t:'TK / RA / KB / TPA (PAUD)', g:'tk' },
  { id:'sd',  t:'SD / MI', g:'sek' },
  { id:'smp', t:'SMP / MTs', g:'sek' },
  { id:'sma', t:'SMA / MA', g:'sek' },
  { id:'smk', t:'SMK / MAK', g:'sek', extra:'smk' },
  { id:'pt',  t:'Perguruan Tinggi', g:'pt' }
];

const BENTUK_PT = [
  { id:'universitas', t:'Universitas', d:'Menyelenggarakan pendidikan akademik dan dapat menyelenggarakan pendidikan vokasi dalam berbagai rumpun ilmu; dapat juga pendidikan profesi.' },
  { id:'institut', t:'Institut', d:'Menyelenggarakan pendidikan akademik (dan dapat vokasi) dalam sejumlah rumpun ilmu tertentu.' },
  { id:'sekolah_tinggi', t:'Sekolah Tinggi', d:'Menyelenggarakan pendidikan akademik (dan dapat vokasi) dalam satu rumpun ilmu tertentu.' },
  { id:'politeknik', t:'Politeknik', d:'Menyelenggarakan pendidikan vokasi dalam berbagai rumpun ilmu; dapat pendidikan profesi.', vok:true },
  { id:'akademi', t:'Akademi', d:'Menyelenggarakan pendidikan vokasi dalam satu/beberapa cabang ilmu.', vok:true },
  { id:'akademi_komunitas', t:'Akademi Komunitas', d:'Pendidikan vokasi setingkat D1/D2 berbasis keunggulan lokal.', vok:true }
];

const PENYELENGGARA_PT = [
  { id:'ptn', t:'PTN Satker' },
  { id:'ptn_blu', t:'PTN BLU' },
  { id:'ptnbh', t:'PTN Badan Hukum (PTN-BH)', x:'bh' },
  { id:'pts', t:'PTS (Yayasan/Badan Penyelenggara)' },
  { id:'ptkn', t:'PT Keagamaan Negeri (UIN/IAIN/STAIN, dll.)', x:'kag' },
  { id:'ptks', t:'PT Keagamaan Swasta', x:'kag' },
  { id:'kedinasan', t:'PT Kedinasan / di bawah Kementerian–Lembaga (mis. Poltekkes Kemenkes)', x:'ked' }
];

/* Site audit perguruan tinggi */
const SITE_PT = [
  { id:'institusi', t:'Institusi (tingkat perguruan tinggi)' },
  { id:'fakultas', t:'Fakultas / Jurusan' },
  { id:'prodi', t:'Program Studi' },
  { id:'pasca', t:'Pascasarjana' }
];
const JENJANG_PRODI = ['D1','D2','D3','D4 / Sarjana Terapan','S1 / Sarjana','Profesi','Spesialis','S2 / Magister','S2 Terapan / Magister Terapan','S3 / Doktor','S3 Terapan / Doktor Terapan'];

/* Rumpun ilmu (UU No. 12 Tahun 2012 Pasal 10 beserta penjelasannya) */
const RUMPUN = [
  { id:'agama', t:'Rumpun Ilmu Agama', c:['Ilmu Agama Islam','Ilmu Agama Kristen','Ilmu Agama Katolik','Ilmu Agama Hindu','Ilmu Agama Buddha','Ilmu Agama Khonghucu'] },
  { id:'humaniora', t:'Rumpun Ilmu Humaniora', c:['Filsafat','Sejarah','Bahasa','Sastra','Seni Pertunjukan','Seni Rupa'] },
  { id:'sosial', t:'Rumpun Ilmu Sosial', c:['Sosiologi','Psikologi','Antropologi','Ilmu Politik','Arkeologi','Kajian Wilayah','Kajian Budaya','Ekonomi','Geografi'] },
  { id:'alam', t:'Rumpun Ilmu Alam', c:['Ilmu Angkasa','Ilmu Kebumian','Ilmu Kelautan','Biologi','Kimia','Fisika'] },
  { id:'formal', t:'Rumpun Ilmu Formal', c:['Ilmu Komputer','Logika','Matematika','Statistika','Sistem'] },
  { id:'terapan', t:'Rumpun Ilmu Terapan', c:['Pertanian','Arsitektur dan Perencanaan','Bisnis','Pendidikan','Teknik','Kehutanan dan Lingkungan','Keluarga dan Konsumen','Kesehatan','Olahraga','Jurnalistik, Media Massa, dan Komunikasi','Hukum','Perpustakaan dan Permuseuman','Militer','Administrasi Publik','Pekerja Sosial','Transportasi'] }
];
const LAM = ['BAN-PT','LAMDIK (Kependidikan)','LAMEMBA (Ekonomi, Manajemen, Bisnis, Akuntansi)','LAM-PTKes (Kesehatan)','LAMTEK (Teknik)','LAMINFOKOM (Informatika & Komputer)','LAMSAMA (Sains Alam & Ilmu Formal)','LAMSPAK (Sosial, Politik, Administrasi, Komunikasi)','LAM PTIP (Ilmu Pertanian)','Akreditasi internasional'];

/* Contoh bukti tambahan berdasarkan site audit dan rumpun ilmu PT */
const EV_EXTRA = {
  '4.1':     { fak:'Renstra fakultas yang selaras dengan Renstra institusi', prodi:'Analisis SWOT prodi dalam LED akreditasi prodi', pasca:'Renstra pascasarjana; analisis daya saing program magister/doktor', isl:'Analisis konteks yang memuat visi integrasi keilmuan dan moderasi beragama' },
  '5.3':     { fak:'SK Gugus Penjaminan Mutu (GPM) fakultas; uraian tugas dekan, wakil dekan, ketua jurusan', prodi:'SK Unit Penjaminan Mutu (UPM) prodi; uraian tugas koordinator/ketua prodi', pasca:'SK direktur pascasarjana dan GPM pascasarjana' },
  '6.2':     { fak:'Sasaran mutu & IKU fakultas', prodi:'Sasaran mutu prodi & indikator akreditasi prodi', pasca:'Sasaran kelulusan tepat waktu & publikasi mahasiswa pascasarjana' },
  '7.1.2':   { prodi:'Jumlah & kualifikasi dosen tetap prodi; rasio dosen–mahasiswa prodi', pasca:'Dosen pembimbing berkualifikasi doktor/guru besar sesuai ketentuan', kes:'Dosen dan pembimbing klinik dengan STR yang berlaku', isl:'Dosen berkualifikasi bidang keislaman sesuai prodi' },
  '7.1.3':   { kes:'Skills lab/laboratorium klinik dan lahan praktik', isl:"Masjid/musala, Ma'had al-Jami'ah, laboratorium keagamaan (praktik ibadah, microteaching, peradilan semu)" },
  '7.1.6':   { isl:'Koleksi literatur keislaman (kitab klasik, jurnal studi Islam)', pasca:'Akses basis data jurnal internasional untuk riset tesis/disertasi' },
  '7.2.1':   { kes:'STR/SIP dosen klinik & pembimbing lapangan', pasca:'Kualifikasi promotor/pembimbing tesis-disertasi' },
  '8.1.2':   { isl:'Kurikulum yang memuat integrasi keilmuan dan mata kuliah keislaman institusional', prodi:'Kurikulum OBE prodi; RPS seluruh mata kuliah', pasca:'Kurikulum magister/doktor; peta jalan penelitian' },
  '8.2.1':   { isl:'Ketentuan Kementerian Agama tentang capaian pembelajaran/standar kompetensi lulusan prodi PTKI', kes:'Standar kompetensi profesi & ketentuan uji kompetensi', prodi:'Kesepakatan asosiasi prodi tentang profil lulusan & CPL' },
  '8.3.4.3': { prodi:'Peta kurikulum dan matriks CPL–mata kuliah prodi', pasca:'Struktur kurikulum berbasis riset (coursework/by research)' },
  '8.3.4.4': { kes:'Blueprint uji kompetensi nasional', pasca:'Pedoman ujian proposal, seminar hasil, ujian tesis/disertasi', isl:"Ujian kompetensi keagamaan (mis. baca tulis Al-Qur'an, praktik ibadah) bila dipersyaratkan" },
  '8.4.1':   { kes:'MoU RS/puskesmas lahan praktik; kualifikasi pembimbing klinik (clinical instructor)', isl:'Mitra praktik sesuai prodi (KUA, pengadilan agama, madrasah, lembaga keuangan syariah)' },
  '8.5.1.2': { isl:'Jalur seleksi PTKIN (SPAN-PTKIN/UM-PTKIN) atau seleksi mandiri', pasca:'Seleksi pascasarjana: tes potensi akademik, kemampuan bahasa, proposal penelitian' },
  '8.5.1.4': { pasca:'Cek kemiripan tesis/disertasi; publikasi sebagai syarat kelulusan' },
  '8.5.2':   { pasca:'Pemantauan masa studi & kemajuan tesis/disertasi' },
  '9.1.2':   { prodi:'Survei kepuasan mahasiswa & pengguna lulusan tingkat prodi' },
  '9.2.2':   { fak:'Audit Mutu Internal tingkat fakultas', prodi:'Audit Mutu Internal tingkat prodi & tindak lanjut UPM', pasca:'Audit Mutu Internal pascasarjana' },
  '9.3.1':   { fak:'RTM fakultas', prodi:'RTM prodi', pasca:'RTM pascasarjana' }
};

const KATEGORI = [
  { id:'C',   t:'Sesuai', s:'Sesuai', cls:'c' },
  { id:'OBS', t:'Observasi', s:'Obs', cls:'obs' },
  { id:'OFI', t:'Peluang Peningkatan (OFI)', s:'OFI', cls:'ofi' },
  { id:'MIN', t:'KTS Minor', s:'Minor', cls:'min' },
  { id:'MAJ', t:'KTS Mayor', s:'Mayor', cls:'maj' },
  { id:'NA',  t:'Tidak Berlaku (N/A)', s:'N/A', cls:'na' }
];

const JENIS_AUDIT = ['Audit Internal','Audit Pihak Kedua','Audit Sertifikasi Tahap 1','Audit Sertifikasi Tahap 2','Audit Surveilen','Audit Resertifikasi','Audit Transisi 2018 → 2025','Audit Khusus/Tindak Lanjut'];
