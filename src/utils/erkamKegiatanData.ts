export interface ErkamKegiatanOption {
  standarId: number;
  standarSNP: string;
  kode: string;
  nama: string;
  satuanDefault: string;
  keteranganDefault: string;
}

export const SNP_STANDAR_LIST = [
  '1. Standar Kompetensi Lulusan',
  '2. Standar Isi',
  '3. Standar Proses',
  '4. Standar Pendidik dan Tenaga Kependidikan',
  '5. Standar Sarana dan Prasarana',
  '6. Standar Pengelolaan',
  '7. Standar Pembiayaan',
  '8. Standar Penilaian Pendidikan',
];

export const ERKAM_KEGIATAN_DATABASE: ErkamKegiatanOption[] = [
  // 1. STANDAR KOMPETENSI LULUSAN
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.01.01',
    nama: 'Penyusunan Kriteria dan Standar Kelulusan Siswa',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Rapat penentuan kriteria kelulusan & kenaikan kelas',
  },
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.01.02',
    nama: 'Pelaksanaan Uji Coba (Try Out) Asesmen Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Penggandaan soal & pelaksanaan try out AM',
  },
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.01.03',
    nama: 'Pelaksanaan Program Pengayaan dan Remedial Kelulusan',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Bimbingan intensif dan pengayaan materi ujian',
  },
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.01.04',
    nama: 'Pelaksanaan Asesmen Madrasah (AM) & Pengayaan Materi Kelulusan',
    satuanDefault: 'Paket',
    keteranganDefault: 'Penggandaan naskah AM, konsumsi pengawas, & proktor',
  },
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.01.05',
    nama: 'Penulisan, Pengelolaan, dan Pengesahan Blanko Ijazah Siswa',
    satuanDefault: 'Siswa',
    keteranganDefault: 'Administrasi penulisan blanko ijazah & transkrip nilai',
  },
  {
    standarId: 1,
    standarSNP: '1. Standar Kompetensi Lulusan',
    kode: '01.02.01',
    nama: 'Kegiatan Pelepasan / Wisuda dan Penyerahan Dokumen Kelulusan Siswa',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Pelepasan siswa kelas akhir madrasah',
  },

  // 2. STANDAR ISI
  {
    standarId: 2,
    standarSNP: '2. Standar Isi',
    kode: '02.01.01',
    nama: 'Penyusunan Kurikulum Tingkat Satuan Pendidikan (KTSP) / KOSP',
    satuanDefault: 'Dokumen',
    keteranganDefault: 'Penyusunan dan review dokumen kurikulum madrasah',
  },
  {
    standarId: 2,
    standarSNP: '2. Standar Isi',
    kode: '02.01.02',
    nama: 'Penyusunan Kurikulum Operasional Madrasah (KOM) & Modul Ajar',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Workshop pengembangan modul ajar IKM & P5RA',
  },
  {
    standarId: 2,
    standarSNP: '2. Standar Isi',
    kode: '02.01.03',
    nama: 'Workshop Pengembangan Silabus, RPP, dan Prota/Promes',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Penyusunan perangkat pembelajaran guru awal tahun',
  },
  {
    standarId: 2,
    standarSNP: '2. Standar Isi',
    kode: '02.02.01',
    nama: 'Rapat Kerja Pembagian Tugas Mengajar Guru & Jadwal Pelajaran',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Rapat kerja awal semester dan penetapan jadwal',
  },
  {
    standarId: 2,
    standarSNP: '2. Standar Isi',
    kode: '02.02.02',
    nama: 'Penyusunan Modul Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin (P5RA)',
    satuanDefault: 'Modul',
    keteranganDefault: 'Penyusunan tema & modul projek tema keagamaan/kebangsaan',
  },

  // 3. STANDAR PROSES
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.01.01',
    nama: 'Pengadaan / Pembelian Buku Teks Utama & Buku Pendamping Kurikulum Siswa',
    satuanDefault: 'Eksemplar',
    keteranganDefault: 'Pembelian buku teks utama Kemenag & referensi',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.01.02',
    nama: 'Penyediaan Buku Pegangan Guru dan Pengayaan Perpustakaan Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Buku panduan guru & pengadaan koleksi perpustakaan',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.02.01',
    nama: 'Pengadaan Alat Peraga Pembelajaran & Kegiatan Ekstrakurikuler Keagamaan',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Pembinaan Tahfidz, Pramuka, Hadrah & ATK Pembelajaran',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.02.02',
    nama: 'Pengadaan Bahan Praktikum Sains (IPA), Komputer, dan Bahasa',
    satuanDefault: 'Paket',
    keteranganDefault: 'Bahan laboratorium IPA & praktikum multimedia',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.03.01',
    nama: 'Pembinaan Kegiatan Ekstrakurikuler Kepramukaan Gugus Depan Madrasah',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Honor pelatih, perlengkapan latihan, & perkemahan',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.03.02',
    nama: 'Pembinaan Ekstrakurikuler Olahraga, Seni Budaya & KSM/OSN/Aksioma',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Persiapan & keikutsertaan lomba minat bakat siswa',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.03.03',
    nama: 'Pembinaan Usaha Kesehatan Sekolah (UKS), PMR, dan KKR Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Penyuluhan kesehatan siswa & perlengkapan UKS',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.04.01',
    nama: 'Penyelenggaraan Penerimaan Peserta Didik Baru (PPDB / SPMB Madrasah)',
    satuanDefault: 'Paket',
    keteranganDefault: 'Brosur, formulir, spanduk, konsumsi panitia, & seleksi',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.04.02',
    nama: 'Pelaksanaan Masa Ta\'aruf Siswa Madrasah (MATSAMA)',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Kegiatan orientasi santri/siswa baru madrasah',
  },
  {
    standarId: 3,
    standarSNP: '3. Standar Proses',
    kode: '03.05.01',
    nama: 'Peringatan Hari Besar Islam (PHBI) dan Hari Besar Nasional (PHBN)',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Peringatan Maulid Nabi, Isra Mi\'raj, Hari Santri & 17 Agustus',
  },

  // 4. STANDAR PENDIDIK DAN TENAGA KEPENDIDIKAN
  {
    standarId: 4,
    standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
    kode: '04.01.01',
    nama: 'Peningkatan Kompetensi Guru melalui KKG / MGMP Madrasah',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Partisipasi & kontribusi pertemuan MGMP/KKG berkala',
  },
  {
    standarId: 4,
    standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
    kode: '04.01.02',
    nama: 'Workshop Penerapan Pembelajaran Berbasis IT / AI & Media Digital',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Pelatihan pembuatan media pembelajaran interaktif',
  },
  {
    standarId: 4,
    standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
    kode: '04.01.03',
    nama: 'Peningkatan Kompetensi Guru melalui MGMP dan Pelatihan PKB',
    satuanDefault: 'Orang',
    keteranganDefault: 'Transport & pendaftaran pelatihan guru madrasah',
  },
  {
    standarId: 4,
    standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
    kode: '04.02.01',
    nama: 'Bimtek Pengelolaan Administrasi & Tata Usaha Tenaga Kependidikan',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Pelatihan tenaga perpustakaan, lab, & administrasi TU',
  },
  {
    standarId: 4,
    standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
    kode: '04.02.02',
    nama: 'Peningkatan Kompetensi Kepala Madrasah melalui Forum KKM / MKKS',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Rapat koordinasi dan workshop manajerial kepala',
  },

  // 5. STANDAR SARANA DAN PRASARANA
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.01.01',
    nama: 'Pemeliharaan Ringan Ruang Kelas, Ruang Guru, dan Gedung Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Perbaikan plafon, dinding, pintu, dan jendela kelas',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.01.02',
    nama: 'Perbaikan dan Perawatan Instalasi Listrik, Air Bersih, dan Tempat Wudhu',
    satuanDefault: 'Paket',
    keteranganDefault: 'Penggantian stop kontak, kran air, pipa, dan saklar',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.02.01',
    nama: 'Pengadaan Alat Kebersihan, Sabun Cuci, Tempat Sampah & Sanitasi',
    satuanDefault: 'Paket',
    keteranganDefault: 'Sapu, pel, karbol, tempat cuci tangan & kantong sampah',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.02.02',
    nama: 'Pengadaan & Perbaikan Meja, Kursi Siswa/Guru dan Lemari Dokumen',
    satuanDefault: 'Unit',
    keteranganDefault: 'Penyediaan sarana meubelair pembelajaran',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.02.05',
    nama: 'Pemeliharaan Ringan Gedung, Sanitasi & Pengadaan Buku Teks Utama',
    satuanDefault: 'Paket',
    keteranganDefault: 'Pengecatan kelas, perbaikan kran/sanitasi, pembelian buku teks Kemenag',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.03.01',
    nama: 'Pengadaan dan Servis Perangkat Komputer / Laptop Lab CBT dan Proyektor',
    satuanDefault: 'Unit',
    keteranganDefault: 'Maintenance PC laboratorium, printer, & infocus LCD',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.04.01',
    nama: 'Pembelian Alat Tulis Kantor (ATK) dan Kebutuhan Pembelajaran',
    satuanDefault: 'Paket',
    keteranganDefault: 'Spidol whiteboard, penghapus, map arsip, buku agenda',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.04.02',
    nama: 'Pembelian Kertas HVS, Tinta Printer, dan Penggandaan Administrasi',
    satuanDefault: 'Rim/Botol',
    keteranganDefault: 'Kertas HVS F4/A4, ribbon, dan tinta botol printer',
  },
  {
    standarId: 5,
    standarSNP: '5. Standar Sarana dan Prasarana',
    kode: '05.05.01',
    nama: 'Pengadaan Perlengkapan UKS, Kotak P3K, dan Obat-obatan Dasar Santri',
    satuanDefault: 'Paket',
    keteranganDefault: 'Minyak kayu putih, betadine, perban, paracetamol, kapas',
  },

  // 6. STANDAR PENGELOLAAN
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.01.01',
    nama: 'Langganan Daya dan Jasa (Listrik PLN, Internet Madrasah, Aplikasi SIMPATIKA/EMIS)',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Pembayaran tagihan rutin Indihome & token listrik',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.01.02',
    nama: 'Penyusunan Evaluasi Diri Madrasah (EDM) dan e-RKAM Madrasah',
    satuanDefault: 'Dokumen',
    keteranganDefault: 'Rapat kerja EDM, penetapan pagu e-RKAM tahun berjalan',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.01.03',
    nama: 'Pembayaran Tagihan Rekening Air Bersih (PDAM) Madrasah',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Langganan air bersih untuk wudhu dan toilet madrasah',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.02.01',
    nama: 'Rapat Koordinasi Dinas dan Pertemuan Bersama Komite Madrasah',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Musyawarah komite, wali murid, dan sosialisasi program BOS',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.03.01',
    nama: 'Pengelolaan Aplikasi EMIS 4.0, SIMPATIKA, SIAP BOS, dan RDM',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Verifikasi validasi data kelembagaan & guru madrasah',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.03.02',
    nama: 'Penggandaan, Penjilidan, dan Pengiriman Laporan Pertanggungjawaban (LPJ) BOS',
    satuanDefault: 'Buku',
    keteranganDefault: 'Cetak dan jilid buku LPJ BOS ke Kemenag Kabupaten/Kota',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.04.01',
    nama: 'Konsumsi Rapat Dinas dan Operasional Harian Kantor Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Konsumsi rapat rutin bulanan dewan guru & tamu dinas',
  },
  {
    standarId: 6,
    standarSNP: '6. Standar Pengelolaan',
    kode: '06.04.02',
    nama: 'Transportasi dan Perjalanan Dinas Resmi Koordinasi Kemenag / KKM',
    satuanDefault: 'Kali',
    keteranganDefault: 'Perjalanan dinas koordinasi ke Kantor Kemenag / KKM',
  },

  // 7. STANDAR PEMBIAYAAN
  {
    standarId: 7,
    standarSNP: '7. Standar Pembiayaan',
    kode: '07.01.01',
    nama: 'Honorarium Guru Tidak Tetap (GTT) / Guru Non-ASN Madrasah',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Penyaluran honor bulanan guru honorer non-sertifikasi',
  },
  {
    standarId: 7,
    standarSNP: '7. Standar Pembiayaan',
    kode: '07.01.02',
    nama: 'Honorarium Pegawai Tidak Tetap (PTT) / Tenaga Administrasi Madrasah',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Honorarium staf tata usaha, perpustakaan, & operator',
  },
  {
    standarId: 7,
    standarSNP: '7. Standar Pembiayaan',
    kode: '07.01.03',
    nama: 'Honorarium Petugas Keamanan (Satpam) dan Petugas Kebersihan Madrasah',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Honor penjaga madrasah dan kebersihan lingkungan',
  },
  {
    standarId: 7,
    standarSNP: '7. Standar Pembiayaan',
    kode: '07.02.01',
    nama: 'Biaya Bea Meterai dan Administrasi Transaksi Perbankan Dana BOS',
    satuanDefault: 'Paket',
    keteranganDefault: 'Meterai 10.000 untuk SPJ dan biaya admin rekening giro',
  },
  {
    standarId: 7,
    standarSNP: '7. Standar Pembiayaan',
    kode: '07.03.01',
    nama: 'Honorarium Guru Non-PNS (GTT/PTT) dan Tenaga Kependidikan',
    satuanDefault: 'Bulan',
    keteranganDefault: 'Penyaluran honorarium guru non-ASN dan operator madrasah',
  },

  // 8. STANDAR PENILAIAN PENDIDIKAN
  {
    standarId: 8,
    standarSNP: '8. Standar Penilaian Pendidikan',
    kode: '08.01.01',
    nama: 'Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) & Gladi Bersih',
    satuanDefault: 'Paket',
    keteranganDefault: 'Honor proktor, teknisi, pengawas, & konsumsi ANBK',
  },
  {
    standarId: 8,
    standarSNP: '8. Standar Penilaian Pendidikan',
    kode: '08.02.01',
    nama: 'Pelaksanaan Asesmen Kompetensi Madrasah Indonesia (AKMI)',
    satuanDefault: 'Paket',
    keteranganDefault: 'Penyelenggaraan AKMI online/semi-online madrasah',
  },
  {
    standarId: 8,
    standarSNP: '8. Standar Penilaian Pendidikan',
    kode: '08.03.01',
    nama: 'Pelaksanaan Asesmen Sumatif Tengah Semester (ASTS / PTS)',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Penggandaan naskah soal asesmen & konsumsi panitia',
  },
  {
    standarId: 8,
    standarSNP: '8. Standar Penilaian Pendidikan',
    kode: '08.03.02',
    nama: 'Pelaksanaan Asesmen Sumatif Akhir Semester (ASAS / PAS / PAT)',
    satuanDefault: 'Kegiatan',
    keteranganDefault: 'Naskah ujian semester ganjil/genap dan lembar kerja',
  },
  {
    standarId: 8,
    standarSNP: '8. Standar Penilaian Pendidikan',
    kode: '08.04.01',
    nama: 'Pengelolaan dan Pencetakan Buku Rapor Digital Madrasah (RDM)',
    satuanDefault: 'Siswa',
    keteranganDefault: 'Kertas raport, tinta warna, & sampul map raport RDM',
  },
];

/**
 * Mencari kegiatan e-RKAM berdasarkan standar SNP
 */
export function getErkamKegiatanByStandar(standarSNP: string): ErkamKegiatanOption[] {
  return ERKAM_KEGIATAN_DATABASE.filter(
    (item) => item.standarSNP.toLowerCase() === standarSNP.toLowerCase() ||
              item.standarSNP.startsWith(standarSNP.slice(0, 2))
  );
}

/**
 * Mencari kegiatan e-RKAM berdasarkan kode
 */
export function findErkamKegiatanByKode(kode: string): ErkamKegiatanOption | undefined {
  return ERKAM_KEGIATAN_DATABASE.find(
    (item) => item.kode.trim() === kode.trim()
  );
}

/**
 * Mendapatkan kegiatan default pertama untuk suatu Standar SNP
 */
export function getDefaultErkamKegiatan(standarSNP: string): ErkamKegiatanOption {
  const items = getErkamKegiatanByStandar(standarSNP);
  if (items.length > 0) {
    return items[0];
  }
  return {
    standarId: 1,
    standarSNP: standarSNP || SNP_STANDAR_LIST[0],
    kode: '01.01.01',
    nama: 'Kegiatan Operasional Madrasah',
    satuanDefault: 'Paket',
    keteranganDefault: 'Realisasi sesuai e-RKAM',
  };
}
