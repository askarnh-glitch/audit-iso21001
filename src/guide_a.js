/* =====================================================================
   PANDUAN PEMERIKSAAN PER BUTIR — Klausul 4–6
   Struktur: G(kunciKlausul, [ [dokumen[], teknis[], operasional[]], ... ])
   - urutan entri = urutan butir pada data.js (termasuk butir khusus versi)
   - angka n = gunakan panduan butir ke-n pada klausul yang sama
   - dokumen boleh diberi awalan tag jenjang: tk: sek: smk: pt: vok: ked: kag: bh: mad:
   Pertanyaan TEKNIS  -> kepada pemilik proses / pengelola mutu / pimpinan (cara penetapan, metode, kriteria)
   Pertanyaan OPERASIONAL -> kepada pelaksana / staf / peserta didik (penerapan nyata, sampel, observasi)
   ===================================================================== */
const GUIDE = {};
function G(k, arr){ GUIDE[k] = arr; }

/* ---------------- 4.1 ---------------- */
G('4.1', [
 [['Dokumen analisis konteks organisasi (SWOT/PESTEL/daftar isu internal–eksternal)','Pernyataan visi, misi, tujuan, dan arah strategis','tk:KOSP PAUD bagian analisis konteks','sek:KOSP bagian analisis karakteristik satuan pendidikan; RKJM/RKS','pt:Renstra bagian analisis lingkungan strategis; LED akreditasi (analisis SWOT)'],
  ['Metode apa yang digunakan untuk mengidentifikasi isu internal dan eksternal, dan siapa saja yang dilibatkan?','Bagaimana isu-isu tersebut dikaitkan dengan arah strategis dan hasil yang diharapkan dari SMOP?','Kapan daftar isu terakhir diperbarui dan apa pemicunya?'],
  ['Sebutkan tiga isu eksternal dan tiga isu internal yang paling berpengaruh saat ini beserta dampaknya bagi layanan pendidikan.','Tunjukkan contoh keputusan atau program yang diambil sebagai respons atas salah satu isu tersebut.']],
 [['Kebijakan/program tanggung jawab sosial','Dokumen arah strategis (Renstra/RKJM)','Notulen pembahasan isu strategis'],
  ['Bagaimana aspek tanggung jawab sosial dipertimbangkan saat menetapkan isu?','Bagaimana arah strategis memengaruhi prioritas isu yang ditangani?'],
  ['Contohkan program yang lahir dari pertimbangan tanggung jawab sosial (mis. layanan masyarakat, afirmasi peserta didik kurang mampu).','Apakah personel kunci dapat menjelaskan arah strategis organisasi?']],
 [['Catatan penilaian relevansi perubahan iklim (hasil dan dasar pertimbangannya)','Daftar isu yang memuat isu iklim/lingkungan (banjir, panas ekstrem, kualitas udara, energi, air)','Program sekolah/kampus hijau, Adiwiyata, atau Satuan Pendidikan Aman Bencana','pt:Kebijakan kampus berkelanjutan (green campus) dan laporan keberlanjutan'],
  ['Bagaimana organisasi memutuskan apakah perubahan iklim relevan? Siapa yang memutuskan dan kapan?','Bila relevan, risiko dan peluang apa yang teridentifikasi (gangguan pembelajaran, kesehatan, biaya energi, muatan kurikulum)?','Bila dinilai tidak relevan, apa justifikasinya dan kapan akan ditinjau ulang?'],
  ['Pernahkah kegiatan belajar terganggu oleh kondisi cuaca/iklim (banjir, panas, asap)? Bagaimana penanganannya?','Adakah kegiatan pembelajaran atau program yang terkait isu iklim dan lingkungan?']],
 [['Jadwal/prosedur tinjauan konteks','Notulen RTM atau rapat strategis yang membahas perubahan isu','Daftar isu dengan riwayat revisi'],
  ['Seberapa sering isu dipantau dan ditinjau, dan siapa penanggung jawabnya?','Sumber informasi apa yang dipakai untuk memantau isu (regulasi, data kinerja, survei, media)?'],
  ['Tunjukkan bukti tinjauan isu terakhir dan perubahan yang dihasilkannya.','Bagaimana perubahan regulasi terbaru diketahui dan ditindaklanjuti di unit Anda?']]
]);

/* ---------------- 4.2 ---------------- */
G('4.2', [
 [['Matriks/daftar pihak berkepentingan','Peta pemangku kepentingan (stakeholder mapping)','sek:Daftar pengurus komite, paguyuban orang tua, mitra','pt:Daftar mitra kerja sama, asosiasi profesi, pengguna lulusan'],
  ['Bagaimana organisasi menentukan pihak berkepentingan mana yang relevan bagi SMOP?','Apakah peserta didik, penerima manfaat lain (orang tua, pengguna lulusan, masyarakat), dan staf sudah tercakup?'],
  ['Siapa saja pihak di luar organisasi yang paling sering Anda layani atau ajak koordinasi?','Tunjukkan contoh komunikasi dengan salah satu pihak berkepentingan tersebut.']],
 [['Matriks kebutuhan dan harapan setiap pihak berkepentingan','Hasil survei kebutuhan, forum/FGD pemangku kepentingan','Regulasi yang menjadi persyaratan pihak berwenang','smk:Masukan DUDI dalam sinkronisasi kurikulum','pt:Hasil survei pengguna lulusan dan masukan mitra'],
  ['Dengan cara apa persyaratan setiap pihak dikumpulkan (survei, rapat, regulasi, kontrak)?','Bagaimana persyaratan yang saling bertentangan antarpihak diselesaikan?'],
  ['Apa harapan utama orang tua/peserta didik/pengguna lulusan yang Anda ketahui?','Tunjukkan contoh harapan pihak berkepentingan yang sudah diakomodasi dalam layanan.']],
 [['Matriks persyaratan pihak berkepentingan dengan kolom "ditangani melalui SMOP (ya/tidak)" dan alasannya','Notulen keputusan penetapan persyaratan yang dipenuhi'],
  ['Kriteria apa yang digunakan untuk memutuskan persyaratan mana yang akan dipenuhi melalui SMOP?','Bagaimana persyaratan yang tidak ditangani dikomunikasikan atau dijelaskan kepada pihak terkait?'],
  ['Pilih satu persyaratan pihak berkepentingan: di proses mana persyaratan itu dipenuhi?','Adakah persyaratan yang sengaja tidak dipenuhi? Bagaimana keputusan itu diambil?']],
 [['Jadwal pemutakhiran matriks pihak berkepentingan','Notulen RTM yang membahas perubahan kebutuhan pihak berkepentingan','Riwayat revisi matriks'],
  ['Seberapa sering informasi pihak berkepentingan dan persyaratannya ditinjau?','Apa yang memicu pemutakhiran di luar jadwal (mis. regulasi baru, keluhan, kerja sama baru)?'],
  ['Tunjukkan perubahan terakhir pada daftar pihak berkepentingan/persyaratannya.','Bagaimana Anda mengetahui bila harapan orang tua/mitra berubah?']],
 [['Catatan persyaratan terkait iklim/lingkungan dari pihak berkepentingan (mis. regulasi lingkungan, permintaan mitra/donor)'],
  ['Adakah pihak berkepentingan yang menyampaikan persyaratan terkait iklim/lingkungan? Bagaimana ditanggapi?'],
  ['Adakah permintaan orang tua/mitra/pemerintah terkait program lingkungan yang sedang dijalankan?']]
]);

/* ---------------- 4.3 ---------------- */
G('4.3', [
 [['Dokumen ruang lingkup SMOP (manual mutu/kebijakan)','Peta lokasi/unit yang tercakup','Keterkaitan lingkup dengan analisis isu (4.1) dan persyaratan (4.2)'],
  ['Bagaimana batas organisasi (unit, lokasi, program) ditentukan dalam ruang lingkup?','Bagaimana isu dan persyaratan pihak berkepentingan memengaruhi penetapan ruang lingkup?'],
  ['Apakah unit Anda termasuk dalam ruang lingkup SMOP? Bagaimana Anda mengetahuinya?','Adakah lokasi atau kelas jauh/PJJ yang belum tercakup?']],
 [['Pernyataan ruang lingkup terdokumentasi dan disahkan','tk:Daftar layanan (TK/KB/TPA/day care)','sek:Daftar jenjang/kelas/program (reguler, inklusi, ekstrakurikuler, asrama)','pt:Daftar fakultas/prodi/jenjang dan layanan pendukung yang tercakup'],
  ['Di mana ruang lingkup didokumentasikan dan siapa yang mengesahkannya?','Apakah jenis produk dan layanan pendidikan disebutkan secara jelas?'],
  ['Tunjukkan dokumen ruang lingkup yang berlaku saat ini.','Apakah ruang lingkup yang tertulis sesuai dengan layanan yang benar-benar diselenggarakan?']],
 [['Daftar persyaratan yang dinyatakan tidak berlaku beserta justifikasinya','Bukti bahwa pengecualian tidak memengaruhi kesesuaian layanan'],
  ['Persyaratan mana yang dinyatakan tidak berlaku dan apa alasannya?','Bagaimana Anda memastikan pengecualian itu tidak mengurangi kemampuan menjamin mutu layanan?'],
  ['(Verifikasi lapangan) Apakah ada praktik yang ternyata berlaku walaupun dinyatakan dikecualikan, mis. pengembangan modul ajar/RPS sendiri padahal 8.3 dikecualikan?']],
 [['Daftar seluruh layanan yang diberikan kepada peserta didik (akademik, non-akademik, layanan pendukung)','Perbandingan daftar layanan dengan ruang lingkup'],
  ['Apakah semua layanan kepada peserta didik — termasuk yang dialihdayakan (katering, transportasi, asrama, LMS) — tercakup?'],
  ['Layanan apa saja yang Anda terima sebagai peserta didik/orang tua? (bandingkan dengan ruang lingkup)']]
]);

/* ---------------- 4.4 ---------------- */
G('4.4', [
 [['Manual mutu / dokumen sistem','Daftar proses SMOP','sek:Dokumen SPMI sekolah / siklus Perencanaan Berbasis Data','pt:Dokumen SPMI: kebijakan, manual, standar, formulir'],
  ['Bagaimana SMOP ditetapkan dan proses apa saja yang dicakup?','Bagaimana SMOP dipelihara dan ditingkatkan dari tahun ke tahun?'],
  ['Proses apa yang menjadi tanggung jawab unit Anda dalam SMOP?','Apa perubahan terakhir pada sistem mutu yang Anda rasakan dalam pekerjaan sehari-hari?']],
 [['Peta proses / diagram interaksi proses','SOP yang memuat input, output, dan urutan kegiatan','Matriks hubungan proses inti dan pendukung'],
  ['Apa input dan output utama dari proses inti (penerimaan, pembelajaran, asesmen, kelulusan)?','Bagaimana interaksi antarproses digambarkan dan dikendalikan?'],
  ['Dari mana Anda menerima input pekerjaan dan kepada siapa output diserahkan?','Tunjukkan SOP yang Anda gunakan dan jelaskan langkahnya.']],
 [['Matriks indikator kinerja proses dan target','Laporan pemantauan indikator','pt:Standar SPMI dan indikator capaiannya'],
  ['Apa kriteria dan indikator kinerja setiap proses? Bagaimana metode pengukurannya?','Bagaimana bila indikator tidak tercapai?'],
  ['Indikator apa yang digunakan untuk menilai keberhasilan pekerjaan Anda? Berapa capaiannya saat ini?']],
 [['Struktur organisasi dan uraian tugas pemilik proses','Rencana kebutuhan sumber daya per proses'],
  ['Siapa pemilik setiap proses dan apa wewenangnya?','Bagaimana kebutuhan sumber daya setiap proses ditentukan dan dipenuhi?'],
  ['Siapa atasan/pemilik proses Anda? Sumber daya apa yang masih kurang untuk menjalankan proses?']],
 [['Register risiko per proses','Laporan evaluasi proses dan catatan perubahan proses'],
  ['Bagaimana risiko proses diidentifikasi dan dikaitkan dengan 6.1?','Bagaimana hasil evaluasi proses mendorong perubahan dan perbaikan?'],
  ['Contohkan perubahan prosedur kerja yang dilakukan setelah evaluasi.']],
 [['Daftar induk dokumen dan rekaman','Contoh rekaman pelaksanaan proses'],
  ['Dokumen apa yang dipelihara untuk mendukung proses dan rekaman apa yang disimpan sebagai bukti?'],
  ['Tunjukkan dokumen yang Anda pakai dan rekaman hasil kerja satu bulan terakhir.']]
]);

/* ---------------- 5.1.1 ---------------- */
G('5.1.1', [
 [['SK penetapan kebijakan dan sasaran mutu','Rencana strategis','Laporan kinerja pimpinan','sek:RKS/RKJM','pt:Renstra, Perjanjian Kinerja pimpinan'],
  ['Bagaimana pimpinan memastikan kebijakan dan sasaran mutu selaras dengan arah strategis?','Bagaimana pimpinan mempertanggungjawabkan efektivitas SMOP?'],
  ['Menurut Anda, apa prioritas utama pimpinan tahun ini? Apakah terkait dengan sasaran mutu?']],
 [['Program kerja tahunan yang memuat kegiatan mutu','Rencana anggaran yang mengalokasikan dana mutu','sek:RKAS (alokasi BOS/BOP untuk mutu)','pt:RKAT/RBA'],
  ['Bagaimana persyaratan SMOP diintegrasikan ke perencanaan, penganggaran, dan proses inti?','Bagaimana pimpinan memastikan sumber daya SMOP tersedia?'],
  ['Apakah kegiatan mutu dianggap pekerjaan rutin atau tambahan? Beri contoh.','Pernahkah kebutuhan sumber daya untuk mutu ditolak? Bagaimana penyelesaiannya?']],
 [['Notulen rapat pimpinan/rapat dinas yang membahas mutu','Bahan sosialisasi SMOP oleh pimpinan','Laporan capaian SMOP'],
  ['Melalui forum apa pimpinan mengomunikasikan pentingnya SMOP?','Bagaimana pimpinan memastikan SMOP mencapai hasil yang diharapkan?'],
  ['Kapan terakhir pimpinan menyampaikan hal terkait mutu kepada Anda? Apa isinya?']],
 [['Notulen rapat koordinasi','Rekaman pembinaan/supervisi oleh pimpinan','Pendelegasian wewenang kepada pimpinan unit'],
  ['Bagaimana pimpinan mengarahkan dan mendukung personel serta pimpinan unit dalam penerapan SMOP?'],
  ['Dukungan apa yang Anda terima dari pimpinan dalam menjalankan tugas mutu?']],
 [['Peta proses','Register risiko','Program perbaikan berkelanjutan'],
  ['Bagaimana pimpinan mendorong pendekatan proses dan pemikiran berbasis risiko di setiap unit?','Contohkan perbaikan yang diinisiasi pimpinan.'],
  ['Apakah unit Anda mengidentifikasi risiko kerja? Siapa yang mendorongnya?']],
 [['Rencana strategis yang disahkan dan bukti pemantauannya','Dokumen visi pendidikan dan konsep pendidikan organisasi'],
  ['Bagaimana rencana strategis disusun, dipantau, dan dimutakhirkan?','Bagaimana implementasi visi pendidikan dijamin berkelanjutan meskipun terjadi pergantian pimpinan?'],
  ['Apakah Anda dapat menyebutkan visi organisasi dan bagaimana pekerjaan Anda berkontribusi?']],
 [['Data identifikasi kebutuhan pendidikan peserta didik','Program layanan kebutuhan khusus/inklusi','sek:Hasil asesmen diagnostik awal','pt:Layanan bimbingan akademik dan ULD'],
  ['Bagaimana pimpinan memastikan kebutuhan pendidikan peserta didik, termasuk kebutuhan khusus, diidentifikasi dan ditangani?'],
  ['Bagaimana Anda mengetahui kebutuhan belajar setiap peserta didik? Contohkan tindak lanjutnya.']],
 [['Kebijakan/program tanggung jawab sosial','Laporan kegiatan pengabdian/bakti sosial','Program afirmasi atau beasiswa'],
  ['Bagaimana prinsip tanggung jawab sosial (akuntabilitas, transparansi, etika, hak asasi, lingkungan) dipertimbangkan dalam keputusan pimpinan?'],
  ['Kegiatan sosial apa yang dilakukan organisasi dalam setahun terakhir?']],
 [['Program pengembangan kompetensi pendidik dan staf','Anggaran pelatihan','Rekap pelatihan/PKB yang diikuti'],
  ['Bagaimana pimpinan memastikan pendidik dan staf memelihara dan meningkatkan kompetensinya?','Bagaimana kebutuhan pengembangan kompetensi diidentifikasi?'],
  ['Pelatihan apa yang Anda ikuti dalam setahun terakhir? Siapa yang memfasilitasi?']],
 [['Kode etik pendidik, staf, dan peserta didik','Kebijakan antikorupsi/benturan kepentingan/gratifikasi','Kebijakan transparansi informasi publik','tk:Kebijakan pencegahan kekerasan (Budaya Sekolah Aman dan Nyaman)','sek:Tata tertib, kode etik, dan SOP Budaya Sekolah Aman dan Nyaman yang ditetapkan kepala sekolah','pt:Satgas PPKPT; komisi etik'],
  ['Bagaimana pimpinan mendorong keadilan, transparansi, dan perilaku etis di semua tingkatan?','Bagaimana pelanggaran etika dilaporkan dan ditangani?'],
  ['Bila menemukan perilaku tidak etis, ke mana Anda melapor? Apakah merasa aman untuk melapor?']]
]);

/* ---------------- 5.1.2 ---------------- */
G('5.1.2', [
 [['Matriks kebutuhan dan harapan peserta didik/penerima manfaat','Hasil survei kebutuhan','Notulen pertemuan dengan peserta didik/orang tua'],
  ['Bagaimana pimpinan memastikan kebutuhan dan harapan peserta didik dipahami di semua unit?'],
  ['Apa harapan utama peserta didik/orang tua yang Anda ketahui dan bagaimana Anda memenuhinya?']],
 [['Laporan survei kepuasan dan tindak lanjutnya','Data kemajuan belajar (nilai, kelulusan, retensi)','tk:Laporan perkembangan anak','sek:Rapor dan Rapor Pendidikan','pt:IPK rata-rata, masa studi, kelulusan tepat waktu'],
  ['Indikator apa yang digunakan pimpinan untuk menilai pemenuhan kebutuhan peserta didik?','Bagaimana pimpinan menindaklanjuti tren kepuasan atau kemajuan belajar yang menurun?'],
  ['Tunjukkan data kemajuan belajar kelas/prodi Anda dan tindak lanjut atas hasil yang rendah.']],
 [['Register risiko terkait layanan dan kepuasan','Rencana tindak lanjut risiko'],
  ['Risiko apa yang paling berpengaruh pada kesesuaian layanan dan kepuasan peserta didik? Bagaimana ditangani?'],
  ['Masalah apa yang paling sering membuat peserta didik/orang tua tidak puas?']]
]);

/* ---------------- 5.1.3 ---------------- */
G('5.1.3', [
 [['Kebijakan pendidikan inklusif/layanan disabilitas','Anggaran aksesibilitas (sarana, alat bantu, pendamping) dan anggaran pelatihan personel','Program/rencana pelatihan aksesibilitas bagi pendidik, tenaga kependidikan, dan staf layanan (mis. pustakawan, laboran, staf TI, satpam)','Daftar sarana aksesibel (ramp, toilet aksesibel, perangkat bantu)','sek:SK Guru Pendamping Khusus','pt:SK Unit Layanan Disabilitas (ULD)'],
  ['Sumber daya aksesibilitas apa yang disediakan pimpinan, dan bagaimana kebutuhannya diidentifikasi serta dianggarkan?','Program pelatihan apa yang disiapkan pimpinan bagi pendidik, tenaga kependidikan, dan staf layanan? Siapa saja sasaran pelatihannya?','Bagaimana pimpinan memastikan pelatihan tersebut benar-benar terlaksana dan menjangkau personel yang berinteraksi dengan peserta didik berkebutuhan khusus?'],
  ['(Observasi) Apakah ruang kelas, toilet, perpustakaan, dan jalur evakuasi dapat diakses pengguna kursi roda?','(Wawancara pendidik/staf layanan) Pernahkah Anda mendapat pelatihan melayani peserta didik berkebutuhan khusus? Siapa yang menyelenggarakan?','(Wawancara staf non-pendidik, mis. satpam/pustakawan) Apa yang Anda lakukan bila ada peserta didik pengguna kursi roda atau tunanetra yang memerlukan bantuan?']],
 [['Daftar peserta didik berkebutuhan khusus dan bentuk akomodasinya','Prosedur pengajuan akomodasi yang layak','Rekaman akomodasi (waktu ujian tambahan, format alternatif, pendamping)'],
  ['Bagaimana proses penetapan akomodasi yang layak bagi setiap peserta didik berkebutuhan khusus?','Bagaimana memastikan akses setara terhadap fasilitas dan lingkungan pendidikan?'],
  ['(Wawancara peserta didik/orang tua) Akomodasi apa yang Anda terima? Apakah memadai?']]
]);

/* ---------------- 5.2 ---------------- */
G('5.2', [
 [['Dokumen kebijakan mutu/kebijakan organisasi pendidikan yang disahkan','Visi, misi, tujuan organisasi'],
  ['Bagaimana kebijakan disusun agar sesuai dengan tujuan organisasi serta mendukung visi dan misi?'],
  ['Apa isi pokok kebijakan mutu organisasi menurut Anda?']],
 [['Kebijakan mutu','Dokumen sasaran mutu yang diturunkan dari kebijakan'],
  ['Bagaimana kebijakan menjadi kerangka penetapan sasaran?','Di bagian mana kebijakan memuat komitmen memenuhi persyaratan dan perbaikan berkelanjutan?'],
  ['Tunjukkan sasaran unit Anda yang terkait dengan kebijakan mutu.']],
 [['Kebijakan mutu','Bukti kajian perkembangan pendidikan/ilmiah/teknologi saat penyusunan kebijakan'],
  ['Bagaimana perkembangan pendidikan, ilmiah, dan teknis (mis. kurikulum baru, digitalisasi) dipertimbangkan dalam kebijakan?'],
  ['Perkembangan pendidikan terbaru apa yang sudah diterapkan di unit Anda?']],
 [['Kebijakan mutu','Kebijakan kekayaan intelektual (HKI)','Kebijakan/program tanggung jawab sosial','pt:Pedoman HKI, sentra HKI, perjanjian HKI dengan dosen/mahasiswa'],
  ['Bagaimana komitmen tanggung jawab sosial dan pengelolaan kekayaan intelektual dituangkan dalam kebijakan?','Bagaimana kepemilikan karya pendidik/peserta didik (modul, bahan ajar, karya ilmiah) diatur?'],
  ['Siapa pemilik hak atas bahan ajar/karya yang Anda buat? Apakah ada ketentuan tertulisnya?']],
 [['Matriks pihak berkepentingan','Notulen penyusunan kebijakan yang melibatkan pemangku kepentingan'],
  ['Bagaimana kebutuhan dan harapan pihak berkepentingan dipertimbangkan saat menyusun kebijakan?'],
  ['Apakah Anda atau perwakilan pihak berkepentingan dilibatkan dalam penyusunan kebijakan?']],
 [['Riwayat revisi kebijakan','Notulen RTM yang meninjau kebijakan'],
  ['Kapan kebijakan terakhir ditinjau dan apa hasilnya?'],
  ['Apakah kebijakan yang Anda ketahui adalah versi terbaru?']],
 [['Kebijakan terdokumentasi','Bukti sosialisasi (daftar hadir, materi, poster, intranet)'],
  ['Melalui media apa kebijakan dikomunikasikan ke seluruh personel?'],
  ['Di mana Anda dapat menemukan kebijakan mutu? (Verifikasi: poster, website, intranet)']],
 [['Hasil wawancara sampel personel','Materi induksi/orientasi pegawai baru'],
  ['Bagaimana Anda memastikan kebijakan dipahami dan diterapkan, bukan sekadar dipajang?'],
  ['Jelaskan dengan kata-kata Anda sendiri apa arti kebijakan mutu bagi pekerjaan Anda.']],
 [['Publikasi kebijakan di website/papan informasi/brosur','Bukti penyampaian kepada orang tua/mitra'],
  ['Kepada pihak berkepentingan mana kebijakan disampaikan dan melalui media apa?'],
  ['(Wawancara orang tua/mitra/peserta didik) Pernahkah Anda melihat atau mendengar kebijakan mutu organisasi ini?']]
]);

/* ---------------- 5.3 ---------------- */
G('5.3', [
 [['Struktur organisasi terkini','Uraian tugas/job description','SK pembagian tugas','sek:SK pembagian tugas guru & tendik','pt:OTK, SK pengangkatan pejabat'],
  ['Bagaimana tanggung jawab dan wewenang ditetapkan dan dikomunikasikan?','Bagaimana bila terjadi rangkap jabatan atau kekosongan jabatan?'],
  ['Apa tugas dan wewenang Anda? Di mana tertulis? Kepada siapa Anda bertanggung jawab?']],
 [['SK wakil manajemen/koordinator mutu','sek:SK Tim Penjaminan Mutu Pendidikan Sekolah','pt:SK LPM/LPMPP, GPM, UPM'],
  ['Siapa yang bertanggung jawab memastikan SMOP sesuai standar? Apa wewenangnya terhadap unit lain?'],
  ['Siapa koordinator mutu di organisasi ini? Kapan terakhir Anda berkoordinasi dengannya?']],
 [['Laporan kinerja SMOP kepada pimpinan','Bahan RTM','Laporan peluang perbaikan'],
  ['Bagaimana dan seberapa sering kinerja SMOP serta peluang perbaikan dilaporkan kepada pimpinan puncak?'],
  ['Tunjukkan laporan kinerja mutu terakhir yang disampaikan kepada pimpinan.']],
 [['Uraian tugas yang memuat promosi fokus peserta didik','Prosedur pengendalian perubahan SMOP'],
  ['Siapa yang bertanggung jawab memastikan kebijakan dipahami dan fokus pada peserta didik dipromosikan?','Bagaimana integritas SMOP dijaga saat restrukturisasi atau pergantian pimpinan?'],
  ['Pada perubahan organisasi terakhir, bagaimana penyesuaian dokumen dan tugas dilakukan?']],
 [['SK penanggung jawab humas/komunikasi','SK penanggung jawab pengendalian dokumen','SK koordinator pembelajaran daring/hibrida'],
  ['Siapa yang bertanggung jawab atas komunikasi, pengendalian dokumen, dan integrasi pembelajaran tatap muka–daring?'],
  ['Kepada siapa Anda meminta dokumen versi terbaru? Siapa yang mengelola informasi ke publik?']],
 [['SK penanggung jawab layanan kebutuhan khusus','sek:SK koordinator inklusi/GPK','pt:SK ULD'],
  ['Siapa yang bertanggung jawab mengelola persyaratan peserta didik berkebutuhan khusus?'],
  ['Kepada siapa Anda berkonsultasi bila ada peserta didik yang memerlukan akomodasi khusus?']]
]);

/* ---------------- 6.1 ---------------- */
G('6.1', [
 [['Register risiko dan peluang','Metodologi/pedoman manajemen risiko','Keterkaitan register risiko dengan analisis konteks (4.1) dan pihak berkepentingan (4.2)'],
  ['Bagaimana isu dan persyaratan pihak berkepentingan diterjemahkan menjadi risiko dan peluang?','Metode penilaian risiko apa yang digunakan (kemungkinan × dampak)?'],
  ['Risiko apa yang paling mungkin mengganggu pekerjaan unit Anda?']],
 [['Register risiko dengan kategori tujuan (jaminan hasil, efek yang diinginkan/tidak, perbaikan)','tk:Risiko keselamatan anak, kesehatan, bencana','sek:Risiko perundungan, keselamatan, penurunan capaian asesmen','pt:Risiko akreditasi, penerimaan mahasiswa, keuangan, keamanan siber'],
  ['Bagaimana memastikan risiko dan peluang mencakup aspek pencapaian hasil, pencegahan efek buruk, dan perbaikan?','Peluang apa yang telah diidentifikasi dan dimanfaatkan?'],
  ['Contohkan peluang yang dimanfaatkan unit Anda (kerja sama baru, teknologi baru, program baru).']],
 [['Rencana tindakan penanganan risiko dan peluang (PIC, waktu, sumber daya)','Bukti integrasi tindakan ke program kerja/SOP'],
  ['Bagaimana tindakan penanganan risiko diintegrasikan ke dalam proses dan program kerja?'],
  ['Tunjukkan satu tindakan mitigasi risiko yang sedang atau sudah dilaksanakan.']],
 [['Laporan pemantauan risiko','Evaluasi efektivitas tindakan (risiko residual)'],
  ['Bagaimana efektivitas tindakan penanganan risiko dievaluasi dan seberapa sering?'],
  ['Apakah risiko yang pernah ditangani benar-benar berkurang? Apa buktinya?']],
 [['Kriteria tingkat risiko dan respons','Register risiko (prioritas)'],
  ['Bagaimana memastikan besarnya tindakan sepadan dengan tingkat risiko?'],
  ['Adakah tindakan yang dirasa berlebihan atau kurang dibandingkan risikonya?']]
]);

/* ---------------- 6.2 ---------------- */
G('6.2', [
 [['Dokumen sasaran mutu tingkat organisasi dan unit','sek:RKS/RKT dengan indikator','pt:IKU/IKT, Perjanjian Kinerja unit'],
  ['Di tingkat dan fungsi mana saja sasaran ditetapkan? Bagaimana penurunannya dari tingkat organisasi ke unit?'],
  ['Apa sasaran mutu unit Anda tahun ini?']],
 [['Daftar proses yang memerlukan pengelolaan mutu aktif beserta sasaran berjangka waktu','Rencana dan laporan pemantauan sasaran proses'],
  ['Proses mana yang dinilai memerlukan pengelolaan mutu aktif dan bagaimana sasaran berjangka waktunya ditetapkan?'],
  ['Untuk proses yang Anda tangani, apa target dan tenggat waktunya?']],
 [['Matriks sasaran: keterkaitan dengan kebijakan, indikator, formula, target','Regulasi yang menjadi acuan target'],
  ['Bagaimana memastikan sasaran konsisten dengan kebijakan, terukur, dan mempertimbangkan persyaratan yang berlaku?'],
  ['Bagaimana cara menghitung capaian sasaran Anda?']],
 [['Laporan pemantauan capaian sasaran (bulanan/semester/tahunan)','Bukti komunikasi sasaran','Riwayat revisi sasaran'],
  ['Seberapa sering sasaran dipantau? Bagaimana dikomunikasikan dan kapan dimutakhirkan?'],
  ['Berapa capaian sasaran Anda saat ini? Tunjukkan data pemantauannya.']],
 [['Matriks sasaran yang memuat aspek kesesuaian layanan dan kepuasan (peserta didik, pendidik, tenaga administrasi, penerima manfaat)'],
  ['Sasaran mana yang terkait langsung dengan kesesuaian layanan dan kepuasan peserta didik, pendidik, dan staf?'],
  ['Adakah sasaran yang terkait kepuasan peserta didik/staf di unit Anda?']],
 [['Dokumen sasaran yang disahkan','Laporan capaian sasaran periode lalu'],
  ['Di mana sasaran dan capaiannya didokumentasikan dan disimpan?'],
  ['Tunjukkan laporan capaian sasaran periode sebelumnya.']],
 [['Rencana aksi/program kerja per sasaran (kegiatan, sumber daya, PIC, waktu, cara evaluasi)','sek:RKAS','pt:Renop dan RKAT'],
  ['Bagaimana rencana pencapaian setiap sasaran disusun? Apakah memuat kegiatan, sumber daya, PIC, tenggat, dan cara evaluasi?'],
  ['Kegiatan apa yang Anda laksanakan untuk mencapai sasaran tersebut, dan kapan tenggatnya?']],
 [['Rencana strategis yang memuat rencana pencapaian sasaran'],
  ['Di bagian mana rencana strategis memuat rencana pencapaian sasaran?'],
  ['Apakah program kerja unit Anda merujuk ke rencana strategis?']]
]);

/* ---------------- 6.3 ---------------- */
G('6.3', [
 [['Prosedur manajemen perubahan','Rencana perubahan (mis. kurikulum, struktur, sistem informasi, lokasi)','Notulen keputusan perubahan'],
  ['Bagaimana perubahan pada SMOP direncanakan dan disetujui?','Contohkan perubahan signifikan setahun terakhir dan bagaimana direncanakan.'],
  ['Perubahan apa yang Anda alami dalam pekerjaan setahun terakhir? Apakah disosialisasikan sebelumnya?']],
 [['Analisis dampak perubahan','Daftar dokumen dan proses yang terdampak'],
  ['Bagaimana tujuan dan konsekuensi perubahan dianalisis? Bagaimana integritas SMOP dijaga selama transisi?'],
  ['Apakah ada dokumen/prosedur yang tertinggal (belum diperbarui) setelah perubahan?']],
 [['Rencana sumber daya perubahan','SK penugasan baru','Kesiapan penyedia eksternal (mis. vendor sistem informasi)'],
  ['Bagaimana ketersediaan sumber daya, alokasi ulang tanggung jawab, dan kesiapan penyedia eksternal dipastikan sebelum perubahan?'],
  ['Saat perubahan diterapkan, apakah sumber daya dan pelatihan yang Anda perlukan sudah tersedia?']]
]);
