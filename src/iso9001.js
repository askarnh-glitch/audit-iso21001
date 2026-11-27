/* =====================================================================
   AUDIT TERINTEGRASI ISO 9001:2015 + ISO 21001
   Dimuat setelah data.js, guide_*.js, dan crit_*.js.

   - ISO9001: daftar klausul ISO 9001:2015 (judul diringkas) dan klausul
     checklist ISO 21001 yang menjadi padanannya (kunci `k` di data.js).
     `it` (opsional) membatasi butir yang dihitung pada matriks hasil bila
     satu klausul checklist dipetakan ke beberapa klausul ISO 9001.
   - Butir tambahan ISO 9001 (cl.q9items) hanya tampil bila profil audit
     mencentang "Audit terintegrasi dengan ISO 9001:2015". Butir ini
     disimpan dengan indeks tetap 'q0', 'q1', … sehingga tidak menggeser
     nomor urut butir ISO 21001 yang sudah tersimpan.
   - Klausul 'Q8.5.5' (kegiatan pascapenyerahan) hanya ada di ISO 9001.
   - Semua butir adalah PARAFRASE berbahasa Indonesia, bukan kutipan
     SNI ISO 9001:2015. Rujuk dokumen standar resmi untuk bunyi persyaratan.
   - Format butir sama dengan data.js: "18|…", "25|…", "S|…".
     Di sini "18" berarti butir tambahan hanya perlu bila ISO 21001 yang
     dipakai edisi 2018 (karena edisi 2025 sudah memuatnya).
   ===================================================================== */

const ISO9001 = [
  { n:'4.1',   t:'Memahami organisasi dan konteksnya', k:['4.1'] },
  { n:'4.2',   t:'Memahami kebutuhan dan harapan pihak berkepentingan', k:['4.2'] },
  { n:'4.3',   t:'Menentukan ruang lingkup sistem manajemen mutu', k:['4.3'] },
  { n:'4.4',   t:'Sistem manajemen mutu dan prosesnya', k:['4.4'] },
  { n:'5.1.1', t:'Kepemimpinan dan komitmen — umum', k:['5.1.1'] },
  { n:'5.1.2', t:'Fokus pada pelanggan', k:['5.1.2'] },
  { n:'5.2',   t:'Kebijakan mutu (penetapan dan komunikasi)', k:['5.2'] },
  { n:'5.3',   t:'Peran, tanggung jawab, dan wewenang', k:['5.3'] },
  { n:'6.1',   t:'Tindakan untuk menangani risiko dan peluang', k:['6.1'] },
  { n:'6.2',   t:'Sasaran mutu dan perencanaan pencapaiannya', k:['6.2'] },
  { n:'6.3',   t:'Perencanaan perubahan', k:['6.3'] },
  { n:'7.1.1', t:'Sumber daya — umum', k:['7.1.1'] },
  { n:'7.1.2', t:'Orang (sumber daya manusia)', k:['7.1.2'] },
  { n:'7.1.3', t:'Infrastruktur', k:['7.1.3'] },
  { n:'7.1.4', t:'Lingkungan untuk operasi proses', k:['7.1.4'] },
  { n:'7.1.5', t:'Sumber daya pemantauan dan pengukuran (termasuk ketertelusuran pengukuran)', k:['7.1.5'] },
  { n:'7.1.6', t:'Pengetahuan organisasi', k:['7.1.6'] },
  { n:'7.2',   t:'Kompetensi', k:['7.2.1'] },
  { n:'7.3',   t:'Kesadaran', k:['7.3'] },
  { n:'7.4',   t:'Komunikasi', k:['7.4.1', '7.4.2', '7.4.3'] },
  { n:'7.5.1', t:'Informasi terdokumentasi — umum', k:['7.5.1'] },
  { n:'7.5.2', t:'Pembuatan dan pemutakhiran informasi terdokumentasi', k:['7.5.2'] },
  { n:'7.5.3', t:'Pengendalian informasi terdokumentasi', k:['7.5.3'] },
  { n:'8.1',   t:'Perencanaan dan pengendalian operasional', k:['8.1.1', '8.1.2'] },
  { n:'8.2.1', t:'Komunikasi dengan pelanggan', k:['8.2.2'] },
  { n:'8.2.2', t:'Penentuan persyaratan produk dan jasa', k:['8.2.1'], it:{ '8.2.1':[0, 1, 2, 3, 4, 'q0'] } },
  { n:'8.2.3', t:'Tinjauan persyaratan produk dan jasa', k:['8.2.1'], it:{ '8.2.1':['q1', 'q2', 'q3'] } },
  { n:'8.2.4', t:'Perubahan persyaratan produk dan jasa', k:['8.2.3'] },
  { n:'8.3.1', t:'Desain dan pengembangan — umum', k:['8.3.1'] },
  { n:'8.3.2', t:'Perencanaan desain dan pengembangan', k:['8.3.2'] },
  { n:'8.3.3', t:'Input desain dan pengembangan', k:['8.3.3'] },
  { n:'8.3.4', t:'Pengendalian desain dan pengembangan', k:['8.3.4.1', '8.3.4.2', '8.3.4.3', '8.3.4.4'] },
  { n:'8.3.5', t:'Output desain dan pengembangan', k:['8.3.5'] },
  { n:'8.3.6', t:'Perubahan desain dan pengembangan', k:['8.3.6'] },
  { n:'8.4.1', t:'Pengendalian penyedia eksternal — umum', k:['8.4.1'] },
  { n:'8.4.2', t:'Jenis dan tingkat pengendalian', k:['8.4.2'] },
  { n:'8.4.3', t:'Informasi untuk penyedia eksternal', k:['8.4.3'] },
  { n:'8.5.1', t:'Pengendalian produksi dan penyediaan jasa', k:['8.5.1.1', '8.5.1.2', '8.5.1.3', '8.5.1.4', '8.5.1.5'] },
  { n:'8.5.2', t:'Identifikasi dan ketertelusuran', k:['8.5.2'] },
  { n:'8.5.3', t:'Properti milik pelanggan atau penyedia eksternal', k:['8.5.3'] },
  { n:'8.5.4', t:'Preservasi', k:['8.5.4'] },
  { n:'8.5.5', t:'Kegiatan pascapenyerahan', k:['Q8.5.5'] },
  { n:'8.5.6', t:'Pengendalian perubahan', k:['8.5.6'] },
  { n:'8.6',   t:'Pelepasan produk dan jasa', k:['8.6'] },
  { n:'8.7',   t:'Pengendalian output yang tidak sesuai', k:['8.7'] },
  { n:'9.1.1', t:'Pemantauan, pengukuran, analisis, dan evaluasi — umum', k:['9.1.1', '9.1.3', '9.1.4'] },
  { n:'9.1.2', t:'Kepuasan pelanggan', k:['9.1.2'] },
  { n:'9.1.3', t:'Analisis dan evaluasi', k:['9.1.5'] },
  { n:'9.2',   t:'Audit internal', k:['9.2.1', '9.2.2'] },
  { n:'9.3.1', t:'Tinjauan manajemen — umum', k:['9.3.1'] },
  { n:'9.3.2', t:'Input tinjauan manajemen', k:['9.3.2'] },
  { n:'9.3.3', t:'Output tinjauan manajemen', k:['9.3.3'] },
  { n:'10.1',  t:'Peningkatan — umum', k:['10.3'] },
  { n:'10.2',  t:'Ketidaksesuaian dan tindakan korektif', k:['10.NC'] },
  { n:'10.3',  t:'Peningkatan berkelanjutan', k:['10.CI'] }
];

/** Klausul ISO 9001 padanan untuk satu kunci klausul checklist: [{n, t}, …] */
const Q9_OF = {};
ISO9001.forEach(q => q.k.forEach(k => { (Q9_OF[k] = Q9_OF[k] || []).push(q); }));

const GUIDE9 = {}, CRIT9 = {};
/** Tambahkan butir ISO 9001 ke klausul k beserta panduan pemeriksaan & penilaiannya (urutan harus sejajar). */
function Q9(k, items, guides, crits){
  const cl = CLAUSES.find(c => c.k === k);
  if (!cl) throw new Error('Klausul tidak dikenal: ' + k);
  cl.q9items = items; GUIDE9[k] = guides; CRIT9[k] = crits;
}

/* ---------------- klausul khusus ISO 9001: 8.5.5 kegiatan pascapenyerahan ---------------- */
CLAUSES.splice(CLAUSES.findIndex(c => c.k === '8.5.5') + 1, 0,
{ k:'Q8.5.5', g:'8', cond:'q9', no:{18:'8.5.5 (9001)',25:'8.5.5 (9001)'}, t:'Kegiatan pascapenyerahan (khusus ISO 9001)',
  items:[
    'Apakah persyaratan kegiatan setelah layanan diserahkan telah ditentukan dan dipenuhi (mis. legalisasi ijazah/transkrip, surat keterangan alumni, layanan karier, pembinaan alumni, tindak lanjut keluhan setelah lulus)?',
    'Dalam menentukan cakupan kegiatan pascapenyerahan, apakah organisasi mempertimbangkan persyaratan peraturan, kemungkinan akibat yang tidak diinginkan, sifat dan masa manfaat layanan, serta persyaratan dan umpan balik pelanggan?'
  ],
  ev:{ u:'Daftar layanan pascapenyerahan; SOP & register legalisasi; rekaman layanan alumni',
       sek:'Legalisasi ijazah; penelusuran lulusan; layanan surat keterangan',
       smk:'Layanan BKK bagi tamatan',
       pt:'SOP legalisasi ijazah/transkrip & SKPI; pusat karier; ikatan alumni; tracer study & survei pengguna lulusan; penanganan keluhan alumni',
       kag:'Layanan legalisasi dan verifikasi ijazah sesuai ketentuan Kemenag' },
  chg:'Substansi sama.' });

G('Q8.5.5', [
 [['Daftar layanan pascapenyerahan yang ditetapkan beserta standar layanannya','SOP legalisasi ijazah/transkrip dan register permohonannya','pt:SOP dan rekaman layanan pusat karier/alumni','pt:Laporan tracer study dan survei pengguna lulusan','sek:Rekaman legalisasi ijazah dan surat keterangan'],
  ['Layanan apa saja yang tetap diberikan kepada lulusan setelah mereka lulus, dan siapa penanggung jawabnya?','Berapa standar waktu layanan legalisasi dan bagaimana pemenuhannya dipantau?'],
  ['Ambil sampel 3–5 permohonan legalisasi atau surat keterangan: apakah diselesaikan sesuai standar waktu?','(Alumni/petugas) Bagaimana alumni mengajukan permohonan layanan dan memperoleh hasilnya?']],
 [['Analisis kebutuhan layanan pascapenyerahan (regulasi, keluhan alumni, masukan pengguna lulusan)','Rekap umpan balik dan keluhan alumni beserta tindak lanjutnya','pt:Rekomendasi hasil tracer study yang ditindaklanjuti'],
  ['Pertimbangan apa yang dipakai untuk menentukan layanan pascapenyerahan: regulasi, risiko (mis. pemalsuan ijazah), masa berlaku dokumen, dan umpan balik pelanggan?','Bagaimana umpan balik alumni dan pengguna lulusan digunakan untuk memperbaiki layanan ini?'],
  ['Tunjukkan contoh perubahan layanan pascapenyerahan yang dipicu oleh umpan balik atau keluhan alumni.']]
]);
K('Q8.5.5', [
 ['Layanan pascapenyerahan ditetapkan, penanggung jawab jelas, dan sampel permohonan diselesaikan sesuai standar layanan.',
  'Layanan berjalan tetapi standar waktu belum ditetapkan atau rekaman permohonan tidak lengkap.',
  'Layanan sudah baik; dapat dipermudah dengan layanan daring atau verifikasi ijazah elektronik.',
  'Sebagian layanan pascapenyerahan yang diperlukan tidak dipenuhi, atau sampel menunjukkan keterlambatan berulang tanpa tindakan.',
  'Organisasi tidak menyediakan kegiatan pascapenyerahan yang dipersyaratkan peraturan sehingga lulusan dirugikan secara luas.',
  'Hanya bila tidak ada kegiatan pascapenyerahan yang relevan dengan ruang lingkup, dengan justifikasi tertulis.'],
 ['Cakupan layanan ditetapkan berdasarkan regulasi, risiko, sifat layanan, dan umpan balik pelanggan, serta ditinjau berkala.',
  'Cakupan ditetapkan tetapi belum mempertimbangkan umpan balik pelanggan atau risiko secara eksplisit.',
  'Manfaatkan data tracer study dan survei pengguna lulusan untuk memperluas layanan.',
  'Cakupan ditetapkan tanpa mempertimbangkan persyaratan peraturan atau umpan balik pelanggan.',
  '—']
]);

/* ---------------- butir tambahan ISO 9001 pada klausul padanan ---------------- */
Q9('4.1', [
  '18|(ISO 9001:2015 Amd 1:2024) Apakah organisasi telah menentukan apakah perubahan iklim merupakan isu yang relevan bagi sistem manajemen mutu, beserta dasar pertimbangannya?'
], [
 [['Catatan penilaian relevansi perubahan iklim dan dasar pertimbangannya','Daftar isu internal–eksternal yang memuat isu iklim/lingkungan','pt:Kebijakan kampus berkelanjutan (green campus) atau program adaptasi bencana'],
  ['Kapan dan oleh siapa relevansi perubahan iklim dinilai, dan apa kesimpulannya?','Bila relevan, bagaimana isu ini ditindaklanjuti dalam risiko dan peluang (6.1)?'],
  ['Contohkan dampak iklim yang pernah dialami (banjir, panas ekstrem, gangguan listrik) dan respons organisasi.']]
], [
 ['Ada keputusan terdokumentasi tentang relevansi perubahan iklim beserta dasarnya; bila relevan, ditindaklanjuti dalam register risiko.',
  'Isu iklim disebut tetapi tanpa dasar pertimbangan atau tanpa tindak lanjut.',
  'Kembangkan menjadi program adaptasi/mitigasi yang terukur.',
  'Relevansi hanya dinyatakan lisan atau tidak dapat dibuktikan.',
  'Organisasi belum pernah menentukan relevansi perubahan iklim walaupun disertifikasi ISO 9001 setelah Amandemen 1:2024 berlaku.']
]);

Q9('4.2', [
  '18S|(Catatan Amd 1:2024) Apakah persyaratan pihak berkepentingan yang terkait perubahan iklim ikut dipertimbangkan?'
], [
 [['Matriks pihak berkepentingan yang memuat persyaratan terkait iklim/lingkungan (bila ada)'],
  ['Adakah pihak berkepentingan (kementerian, pemda, mitra, mahasiswa) yang memiliki tuntutan terkait perubahan iklim?'],
  ['Contohkan tuntutan terkait lingkungan yang pernah disampaikan pihak berkepentingan.']]
], [
 ['Persyaratan terkait iklim dipertimbangkan dalam matriks pihak berkepentingan.',
  'Belum dipertimbangkan secara sistematis.',
  'Tambahkan kolom isu iklim pada matriks pihak berkepentingan.']
]);

Q9('4.3', [
  'Bila ada persyaratan ISO 9001:2015 yang dinyatakan tidak berlaku (mis. 7.1.5.2 ketertelusuran pengukuran, 8.3 desain), apakah justifikasinya tercantum dalam ruang lingkup dan tidak memengaruhi kemampuan menjamin kesesuaian layanan serta kepuasan pelanggan?'
], [
 [['Dokumen ruang lingkup SMM/SMOP yang memuat persyaratan ISO 9001 yang tidak berlaku beserta justifikasinya','Manual mutu atau matriks pemetaan persyaratan ISO 9001 dan ISO 21001'],
  ['Persyaratan ISO 9001 mana yang dinyatakan tidak berlaku, dan apa alasannya?','Bagaimana dipastikan pengecualian itu tidak memengaruhi kesesuaian layanan atau kepuasan pelanggan?'],
  ['Cocokkan pengecualian dengan kenyataan lapangan: misalnya, bila 8.3 dikecualikan, apakah organisasi benar-benar tidak merancang kurikulum sendiri?']]
], [
 ['Tidak ada pengecualian, atau setiap pengecualian berjustifikasi dan sesuai kenyataan.',
  'Justifikasi ada tetapi terlalu umum.',
  'Lengkapi dengan matriks pemetaan persyaratan ISO 9001–ISO 21001.',
  'Pengecualian tidak berjustifikasi, atau persyaratan yang dikecualikan ternyata diterapkan dalam kegiatan organisasi.',
  'Pengecualian dipakai untuk menghindari persyaratan inti (mis. desain kurikulum) sehingga kesesuaian layanan tidak terjamin.',
  'Jangan pilih N/A. Bila tidak ada persyaratan yang dikecualikan, nilai butir ini Sesuai.']
]);

Q9('5.1.2', [
  'Apakah persyaratan pelanggan serta persyaratan peraturan perundang-undangan yang berlaku ditentukan, dipahami, dan dipenuhi secara konsisten?',
  'Apakah pimpinan memelihara fokus pada peningkatan kepuasan pelanggan (peserta didik dan penerima manfaat lain)?'
], [
 [['Daftar peraturan perundang-undangan yang berlaku (register regulasi) dan evaluasi pemenuhannya','pt:SN-Dikti dan ketentuan akreditasi BAN-PT/LAM','kag:Regulasi Kemenag untuk PTKIN','Matriks persyaratan pelanggan'],
  ['Bagaimana pimpinan memastikan persyaratan pelanggan dan regulasi diketahui serta dipenuhi?','Siapa yang memantau perubahan regulasi dan bagaimana dikomunikasikan?'],
  ['Pilih dua regulasi kunci: tunjukkan bukti pemenuhannya di unit yang diaudit.']],
 [['Sasaran/IKU terkait kepuasan pelanggan','Notulen rapat pimpinan yang membahas kepuasan pelanggan','Tindak lanjut hasil survei kepuasan'],
  ['Keputusan apa yang diambil pimpinan dalam setahun terakhir untuk meningkatkan kepuasan pelanggan?'],
  ['(Unit layanan) Bagaimana arahan pimpinan tentang kepuasan pelanggan diterjemahkan dalam pekerjaan Anda?']]
], [
 ['Persyaratan pelanggan dan regulasi teridentifikasi, mutakhir, dan bukti pemenuhannya tersedia.',
  'Register regulasi ada tetapi belum mutakhir atau belum ada evaluasi pemenuhan.',
  'Lengkapi register dengan evaluasi pemenuhan berkala.',
  'Ada regulasi yang berlaku tetapi tidak diketahui atau tidak dipenuhi pada sebagian proses.',
  'Pelanggaran regulasi yang berdampak luas (mis. penyelenggaraan prodi tanpa izin/akreditasi yang berlaku).'],
 ['Ada bukti pimpinan memantau dan menindaklanjuti kepuasan pelanggan secara berkala.',
  'Kepuasan dipantau tetapi jarang dibahas pimpinan.',
  'Jadikan kepuasan pelanggan agenda tetap rapat pimpinan dan RTM.',
  'Tidak ada bukti perhatian pimpinan terhadap peningkatan kepuasan pelanggan.',
  '—']
]);

Q9('5.2', [
  '25|Apakah kebijakan mutu dipahami dan diterapkan di dalam organisasi (dibuktikan dengan wawancara personel)?'
], [
 [['Bukti sosialisasi kebijakan mutu','Contoh penerapan kebijakan dalam program kerja unit'],
  ['Bagaimana organisasi memastikan kebijakan mutu dipahami di semua unit?'],
  ['(Wawancara 3–5 personel lintas unit) Apa makna kebijakan mutu bagi pekerjaan Anda sehari-hari?']]
], [
 ['Personel yang diwawancarai dapat menjelaskan kebijakan mutu dan kaitannya dengan pekerjaannya.',
  'Sebagian personel hanya hafal teks tanpa memahami maknanya.',
  'Perkuat sosialisasi melalui contoh penerapan per unit.',
  'Mayoritas personel sampel tidak mengetahui kebijakan mutu.',
  '—']
]);

Q9('7.1.1', [
  'Apakah kemampuan dan keterbatasan sumber daya internal yang ada saat ini telah dipertimbangkan dalam menentukan sumber daya?'
], [
 [['Analisis kebutuhan dan kapasitas sumber daya (SDM, anggaran, sarana)','pt:RKAT/RBA dan analisis beban kerja'],
  ['Bagaimana keterbatasan sumber daya internal diidentifikasi dan diatasi (mis. alih daya, kerja sama, penjadwalan ulang)?'],
  ['Contohkan keterbatasan sumber daya yang dialami unit dan cara penanganannya.']]
], [
 ['Kemampuan dan keterbatasan sumber daya dianalisis dan menjadi dasar perencanaan.',
  'Analisis ada tetapi tidak dimutakhirkan.',
  'Gunakan analisis beban kerja dan data utilisasi sarana.',
  'Keterbatasan sumber daya diketahui tetapi tidak dipertimbangkan dalam perencanaan.',
  '—']
]);

Q9('7.1.3', [
  'Apakah infrastruktur yang diperlukan untuk operasi proses — termasuk teknologi informasi dan komunikasi serta sarana transportasi, bila relevan — ditentukan, disediakan, dan dipelihara?'
], [
 [['Daftar infrastruktur kritis dan jadwal pemeliharaannya','Rekaman pemeliharaan jaringan, server, dan aplikasi','pt:SLA layanan TIK (SIAKAD, LMS, e-mail); rencana pemulihan bencana TIK','Daftar dan rekaman pemeliharaan kendaraan operasional (bila ada)'],
  ['Infrastruktur apa yang paling kritis bagi layanan dan bagaimana ketersediaannya dijaga?','Bagaimana gangguan TIK dicatat, ditangani, dan dianalisis?'],
  ['Periksa log gangguan TIK tiga bulan terakhir dan waktu pemulihannya.','(Mahasiswa/staf) Seberapa sering layanan daring terganggu?']]
], [
 ['Infrastruktur kritis teridentifikasi, terpelihara sesuai jadwal, dan gangguan ditangani tepat waktu.',
  'Pemeliharaan berjalan tetapi tidak terjadwal atau rekamannya tidak lengkap.',
  'Susun rencana pemulihan bencana TIK dan uji berkala.',
  'Infrastruktur kritis tidak dipelihara sehingga terjadi gangguan berulang.',
  'Kegagalan infrastruktur menghentikan layanan inti dalam waktu lama tanpa tindakan.']
]);

Q9('7.1.5', [
  'Bila tidak tersedia standar pengukuran internasional atau nasional, apakah dasar yang digunakan untuk kalibrasi atau verifikasi alat ukur disimpan sebagai informasi terdokumentasi?'
], [
 [['Prosedur verifikasi internal alat ukur','Rekaman dasar verifikasi (mis. pembanding, metode)','pt:Verifikasi alat laboratorium yang tidak memiliki standar nasional'],
  ['Alat ukur mana yang diverifikasi tanpa standar nasional/internasional, dan apa dasar verifikasinya?'],
  ['Tunjukkan rekaman verifikasi salah satu alat tersebut.']]
], [
 ['Dasar kalibrasi/verifikasi terdokumentasi untuk alat ukur tanpa standar acuan.',
  'Dasar verifikasi ada tetapi belum terdokumentasi lengkap.',
  'Susun prosedur verifikasi internal yang baku.',
  'Alat ukur diverifikasi tanpa dasar yang dapat ditunjukkan.',
  '—',
  'Bila tidak ada alat ukur yang memerlukan ketertelusuran pengukuran (dinyatakan di ruang lingkup).']
]);

Q9('8.1.1', [
  '18|Apakah perubahan terencana dikendalikan, dan akibat perubahan yang tidak diinginkan ditinjau serta ditindaklanjuti untuk mengurangi dampak buruknya?',
  '18|Apakah proses yang dialihdayakan dikendalikan (lihat 8.4)?'
], [
 [['Rekaman perubahan operasional (jadwal, metode, sistem) beserta tinjauan dampaknya','Rekaman tindak lanjut perubahan yang tidak direncanakan'],
  ['Bagaimana perubahan operasional disetujui dan dampaknya ditinjau?','Bila terjadi perubahan mendadak (mis. gangguan sistem, bencana), bagaimana dampaknya dikendalikan?'],
  ['Contohkan perubahan operasional terakhir dan bagaimana dampaknya ditangani.']],
 [['Daftar proses yang dialihdayakan dan bentuk pengendaliannya','Kontrak/PKS dan laporan pemantauan penyedia'],
  ['Proses apa saja yang dialihdayakan dan bagaimana pengendaliannya ditetapkan?'],
  ['Tunjukkan bukti pemantauan salah satu proses alih daya.']]
], [
 ['Perubahan dikendalikan dan dampak perubahan tak terencana ditinjau serta ditindaklanjuti.',
  'Perubahan dikendalikan tetapi tinjauan dampaknya tidak terdokumentasi.',
  'Gunakan formulir permintaan perubahan yang memuat analisis dampak.',
  'Perubahan dilakukan tanpa pengendalian sehingga menimbulkan masalah layanan.',
  'Perubahan tanpa kendali berdampak luas pada peserta didik.'],
 ['Proses alih daya teridentifikasi dan dikendalikan.',
  'Pengendalian ada tetapi belum mencakup semua proses alih daya.',
  'Lengkapi daftar proses alih daya dengan indikator pemantauan.',
  'Ada proses alih daya yang tidak dikendalikan sama sekali.',
  '—',
  'Bila organisasi tidak mengalihdayakan proses apa pun.']
]);

Q9('8.2.1', [
  'Apakah persyaratan peraturan perundang-undangan yang berlaku atas layanan (mis. SN-Dikti, ketentuan akreditasi, regulasi kementerian pembina) ditetapkan sebagai bagian dari persyaratan layanan?',
  'Sebelum berkomitmen memberikan layanan (mis. menerima mahasiswa baru, membuka prodi/kelas, menandatangani kerja sama), apakah organisasi meninjau kemampuannya memenuhi persyaratan: yang dinyatakan pelanggan termasuk kegiatan pascapenyerahan, yang tidak dinyatakan tetapi diperlukan, yang ditetapkan organisasi, dan peraturan yang berlaku?',
  'Apakah perbedaan antara persyaratan kontrak/permintaan dan yang sebelumnya dinyatakan diselesaikan, dan persyaratan pelanggan dikonfirmasi sebelum diterima bila pelanggan tidak memberikan pernyataan tertulis?',
  'Apakah hasil tinjauan persyaratan dan setiap persyaratan baru atas layanan disimpan sebagai informasi terdokumentasi?'
], [
 [['Register regulasi yang berlaku atas layanan pendidikan','pt:SN-Dikti; peraturan akreditasi BAN-PT/LAM; izin penyelenggaraan prodi','kag:Regulasi Kemenag tentang PTKIN dan prodi keagamaan'],
  ['Bagaimana regulasi yang berlaku diterjemahkan menjadi persyaratan layanan (standar SPMI, SOP)?'],
  ['Pilih satu standar SPMI: tunjukkan regulasi yang menjadi acuannya.']],
 [['Rekaman tinjauan kapasitas sebelum penetapan daya tampung mahasiswa baru','Kajian kelayakan pembukaan prodi/kelas baru','Rekaman tinjauan rancangan kerja sama (MoU/PKS) sebelum ditandatangani'],
  ['Bagaimana organisasi memastikan mampu memenuhi persyaratan sebelum menetapkan daya tampung atau menerima kerja sama?','Siapa yang meninjau dan menyetujui?'],
  ['Ambil sampel penetapan daya tampung atau satu PKS: tunjukkan bukti tinjauan kemampuan sebelum komitmen dibuat.']],
 [['Rekaman konfirmasi persyaratan dengan pelanggan/mitra','Notulen penyelesaian perbedaan isi kerja sama'],
  ['Bila ada perbedaan antara permintaan mitra dan kesepakatan awal, bagaimana diselesaikan?'],
  ['Contohkan permintaan lisan dari mitra/pelanggan dan bagaimana dikonfirmasi sebelum dilaksanakan.']],
 [['Arsip hasil tinjauan persyaratan (berita acara, lembar persetujuan)','Rekaman persyaratan baru (adendum kerja sama, perubahan ketentuan layanan)'],
  ['Di mana hasil tinjauan persyaratan disimpan?'],
  ['Telusuri satu kerja sama aktif: apakah rekaman tinjauannya ada?']]
], [
 ['Regulasi yang berlaku teridentifikasi dan tercermin dalam persyaratan layanan.',
  'Sebagian regulasi belum diterjemahkan menjadi persyaratan layanan.',
  'Pelihara matriks regulasi–standar layanan.',
  'Regulasi penting yang berlaku tidak dijadikan persyaratan layanan.',
  'Layanan diselenggarakan bertentangan dengan regulasi yang berlaku.'],
 ['Tinjauan kemampuan dilakukan dan terekam sebelum komitmen layanan dibuat.',
  'Tinjauan dilakukan secara informal tanpa rekaman yang memadai.',
  'Gunakan daftar periksa tinjauan persyaratan yang baku.',
  'Komitmen layanan dibuat tanpa tinjauan kemampuan pada sebagian kasus.',
  'Komitmen dibuat melebihi kemampuan sehingga layanan gagal dipenuhi (mis. daya tampung melampaui kapasitas dosen/ruang).'],
 ['Perbedaan persyaratan diselesaikan dan persyaratan dikonfirmasi sebelum diterima.',
  'Konfirmasi dilakukan tetapi tidak selalu terekam.',
  'Biasakan konfirmasi tertulis atas permintaan lisan.',
  'Ada perbedaan persyaratan yang tidak diselesaikan sebelum layanan diberikan.',
  '—'],
 ['Hasil tinjauan dan persyaratan baru terekam dan mudah ditelusuri.',
  'Rekaman ada tetapi tidak lengkap.',
  'Simpan rekaman tinjauan bersama dokumen kerja sama/keputusan.',
  'Rekaman tinjauan persyaratan tidak tersedia.',
  '—']
]);

Q9('8.2.2', [
  'Apakah komunikasi dengan pelanggan mencakup penanganan pertanyaan, kontrak atau permintaan layanan (termasuk perubahannya), serta perolehan umpan balik termasuk keluhan?',
  'Apakah komunikasi dengan pelanggan mencakup penanganan dan pengendalian properti milik pelanggan (mis. ijazah asli, berkas pendaftaran, karya)?',
  'Bila relevan, apakah persyaratan tindakan kontingensi (mis. perkuliahan saat bencana, gangguan sistem, atau keadaan darurat) ditetapkan dan dikomunikasikan kepada pelanggan?'
], [
 [['Kanal layanan informasi (helpdesk, website, media sosial) dan rekamannya','Prosedur penanganan pertanyaan dan permintaan','Kanal umpan balik dan keluhan'],
  ['Kanal apa saja yang tersedia bagi pelanggan untuk bertanya, meminta layanan, dan menyampaikan keluhan?','Bagaimana waktu respons dipantau?'],
  ['Uji coba: ajukan pertanyaan melalui salah satu kanal, atau periksa sampel pertanyaan dan waktu responsnya.']],
 [['Informasi kepada pelanggan tentang penanganan berkas/properti miliknya','Tanda terima penitipan dokumen asli'],
  ['Bagaimana pelanggan diberi tahu tentang perlakuan terhadap properti miliknya?'],
  ['(Mahasiswa/alumni) Apakah Anda menerima tanda terima saat menyerahkan dokumen asli?']],
 [['Rencana kontingensi layanan pendidikan (mis. pembelajaran daring darurat)','Pengumuman tindakan kontingensi kepada mahasiswa'],
  ['Skenario gangguan apa yang telah disiapkan rencana kontingensinya?','Bagaimana rencana itu dikomunikasikan kepada pelanggan?'],
  ['Contohkan gangguan nyata yang pernah terjadi dan bagaimana pelanggan diberi tahu.']]
], [
 ['Pertanyaan, permintaan, dan umpan balik pelanggan ditangani melalui kanal yang jelas dan terpantau.',
  'Kanal tersedia tetapi waktu respons tidak dipantau.',
  'Tetapkan standar waktu respons dan pantau capaiannya.',
  'Pertanyaan atau permintaan pelanggan tidak ditanggapi pada sebagian kasus.',
  '—'],
 ['Pelanggan diberi informasi dan tanda terima atas properti yang diserahkan.',
  'Informasi ada tetapi tidak konsisten.',
  'Baku-kan tanda terima dan informasi penanganan properti.',
  'Pelanggan tidak diberi informasi atau bukti penyerahan properti.',
  '—',
  'Bila organisasi tidak menerima properti milik pelanggan.'],
 ['Rencana kontingensi ditetapkan dan dikomunikasikan kepada pelanggan.',
  'Rencana ada tetapi belum dikomunikasikan.',
  'Uji rencana kontingensi melalui simulasi.',
  'Tidak ada rencana kontingensi untuk risiko gangguan yang relevan.',
  '—',
  'Bila tidak ada persyaratan kontingensi yang relevan, dengan alasan.']
]);

Q9('8.3.3', [
  'Apakah persyaratan peraturan perundang-undangan yang berlaku (mis. SN-Dikti, KKNI, ketentuan kurikulum kementerian) dipertimbangkan sebagai input desain?'
], [
 [['Dokumen kajian kurikulum yang merujuk regulasi','pt:SN-Dikti, KKNI/SKKNI, pedoman kurikulum kementerian','kag:Ketentuan kurikulum Kemenag untuk prodi keagamaan'],
  ['Regulasi apa saja yang dijadikan input dalam penyusunan kurikulum terakhir?'],
  ['Periksa kesesuaian beban SKS, CPL, atau masa studi dengan regulasi yang berlaku.']]
], [
 ['Regulasi yang berlaku tercantum dan tercermin dalam dokumen kurikulum.',
  'Regulasi dirujuk tetapi versi yang dipakai sudah tidak berlaku.',
  'Lakukan pemetaan kurikulum terhadap regulasi terbaru.',
  'Kurikulum tidak memenuhi sebagian ketentuan regulasi.',
  'Kurikulum bertentangan dengan regulasi sehingga mengancam keabsahan ijazah.']
]);

Q9('8.5.2', [
  'Apakah status output terhadap persyaratan pemantauan dan pengukuran dapat diidentifikasi selama penyampaian layanan (mis. status nilai sementara/final, status yudisium, status verifikasi berkas)?',
  'Bila ketertelusuran dipersyaratkan, apakah identifikasi unik output dikendalikan (mis. NIM, nomor ijazah nasional, nomor transkrip) dan informasinya disimpan?'
], [
 [['Tampilan status nilai/berkas di SIAKAD','Daftar status verifikasi dokumen'],
  ['Bagaimana status suatu output (mis. nilai) dibedakan antara belum diverifikasi, sementara, dan final?'],
  ['Periksa sampel nilai di SIAKAD: apakah statusnya jelas dan sesuai tahapan?']],
 [['Register penomoran ijazah dan transkrip','pt:Penomoran ijazah nasional (PIN) dan pelaporan PDDikti'],
  ['Bagaimana penomoran unik ijazah/transkrip dikendalikan dan dicegah dari duplikasi?'],
  ['Telusuri satu ijazah dari nomornya sampai rekaman kelulusan dan nilai.']]
], [
 ['Status output jelas pada setiap tahap.',
  'Status ada tetapi tidak konsisten antar-unit.',
  'Tampilkan status secara otomatis di sistem informasi.',
  'Status output tidak dapat diidentifikasi sehingga berisiko salah pakai.',
  '—'],
 ['Identifikasi unik terkendali dan dapat ditelusuri.',
  'Penomoran ada tetapi register tidak lengkap.',
  'Integrasikan register penomoran dengan sistem informasi.',
  'Ditemukan duplikasi atau nomor yang tidak dapat ditelusuri.',
  'Ketertelusuran ijazah/transkrip tidak dapat ditunjukkan secara luas.']
]);

Q9('8.5.3', [
  'Apakah properti milik penyedia eksternal (mis. peralatan pinjaman mitra, lisensi perangkat lunak, data mitra kerja sama) juga dijaga, diidentifikasi, dan dilindungi selama berada di bawah kendali organisasi?'
], [
 [['Daftar properti milik mitra/penyedia eksternal','Perjanjian pinjam pakai atau lisensi','Rekaman kondisi dan pengembalian'],
  ['Properti milik penyedia eksternal apa yang dikelola organisasi dan siapa penanggung jawabnya?'],
  ['Periksa satu properti mitra: apakah teridentifikasi dan kondisinya terjaga?']]
], [
 ['Properti penyedia eksternal teridentifikasi, terjaga, dan terekam.',
  'Properti dikelola tetapi belum terdaftar.',
  'Buat register properti milik pihak lain.',
  'Properti penyedia eksternal hilang/rusak tanpa dilaporkan.',
  '—',
  'Bila tidak ada properti milik penyedia eksternal.']
]);

Q9('9.3.1', [
  'Apakah tinjauan manajemen juga menilai keselarasan sistem manajemen mutu dengan arah strategis organisasi?'
], [
 [['Notulen RTM yang membahas keterkaitan SMM dengan Renstra','Bahan RTM tentang capaian sasaran strategis'],
  ['Bagaimana RTM menilai apakah SMM mendukung pencapaian Renstra?'],
  ['Tunjukkan keputusan RTM yang terkait arah strategis.']]
], [
 ['RTM membahas keselarasan SMM dengan arah strategis dan menghasilkan keputusan.',
  'Dibahas sepintas tanpa kesimpulan.',
  'Tambahkan agenda khusus keselarasan SMM–Renstra.',
  'RTM tidak pernah membahas keselarasan dengan arah strategis.',
  '—']
]);

Q9('9.3.3', [
  '25|Apakah output tinjauan manajemen memuat keputusan dan tindakan terkait kebutuhan sumber daya?'
], [
 [['Notulen RTM bagian keputusan sumber daya','Bukti tindak lanjut (usulan anggaran, rekrutmen, pengadaan)'],
  ['Keputusan sumber daya apa yang dihasilkan RTM terakhir?'],
  ['Telusuri satu keputusan sumber daya sampai realisasinya.']]
], [
 ['Output RTM memuat keputusan sumber daya yang ditindaklanjuti.',
  'Keputusan ada tetapi tidak ditindaklanjuti.',
  'Pantau tindak lanjut keputusan RTM dalam rapat berikutnya.',
  'Output RTM tidak memuat keputusan sumber daya walaupun ada kebutuhan.',
  '—']
]);

Q9('10.NC', [
  'Apakah ketidaksesuaian yang berasal dari keluhan pelanggan juga ditangani melalui proses ketidaksesuaian dan tindakan korektif?',
  'Bila perlu, apakah risiko dan peluang yang ditetapkan saat perencanaan dimutakhirkan sebagai tindak lanjut ketidaksesuaian?'
], [
 [['Log keluhan yang ditautkan dengan formulir PTK/CAR','Analisis akar masalah atas keluhan'],
  ['Kriteria apa yang menentukan keluhan pelanggan ditindaklanjuti sebagai ketidaksesuaian?'],
  ['Telusuri satu keluhan yang sah: apakah diselidiki akar masalahnya dan dicegah terulang?']],
 [['Register risiko yang diperbarui setelah ketidaksesuaian','Formulir PTK yang memuat kolom pemutakhiran risiko'],
  ['Bagaimana hasil tindakan korektif dihubungkan dengan pemutakhiran register risiko?'],
  ['Tunjukkan contoh risiko yang ditambahkan atau dinilai ulang setelah ketidaksesuaian.']]
], [
 ['Keluhan yang sah diproses sebagai ketidaksesuaian sampai tindakan korektifnya efektif.',
  'Keluhan ditangani tetapi tidak dianalisis akar masalahnya.',
  'Tautkan sistem pengaduan dengan sistem PTK.',
  'Keluhan berulang tidak pernah ditangani sebagai ketidaksesuaian.',
  'Keluhan serius (mis. terkait keselamatan atau integritas nilai) diabaikan.'],
 ['Register risiko dimutakhirkan bila ketidaksesuaian menunjukkan risiko baru.',
  'Pemutakhiran dilakukan tetapi tidak konsisten.',
  'Tambahkan langkah pemutakhiran risiko pada formulir PTK.',
  'Risiko yang terbukti dari ketidaksesuaian tidak pernah dimasukkan ke register.',
  '—']
]);
