export interface AkunBelanjaGroup {
  groupName: string;
  kodePrefix: string;
  items: {
    kode: string;
    nama: string;
    deskripsi?: string;
  }[];
}

export const BAGAN_AKUN_STANDAR_BOS: AkunBelanjaGroup[] = [
  {
    groupName: '5211 - Belanja Barang Operasional & Perkantoran',
    kodePrefix: '5211',
    items: [
      {
        kode: '521111',
        nama: '521111 - Belanja Keperluan Sehari-hari Perkantoran',
        deskripsi: 'Alat kebersihan, perlengkapan kantor sehari-hari, konsumsi piket harian',
      },
      {
        kode: '521115',
        nama: '521115 - Belanja Honor Operasional Satuan Kerja (GTT / PTT)',
        deskripsi: 'Honorarium Guru Tidak Tetap (GTT) & Pegawai Tidak Tetap (PTT) / Tenaga Kependidikan',
      },
      {
        kode: '521119',
        nama: '521119 - Belanja Barang Operasional Lainnya',
        deskripsi: 'Pengeluaran operasional madrasah lainnya yang tidak tercover akun lain',
      },
    ],
  },
  {
    groupName: '5212 - Belanja Barang Non-Operasional (Bahan, ATK, Honor, Konsumsi)',
    kodePrefix: '5212',
    items: [
      {
        kode: '521211',
        nama: '521211 - Belanja Bahan (ATK, Kertas, Tinta, Penggandaan & Bahan Ajar)',
        deskripsi: 'Kertas HVS, ATK kantor, tinta printer, fotocopy/penggandaan modul & naskah ujian',
      },
      {
        kode: '521213',
        nama: '521213 - Belanja Honorarium Output Kegiatan (Narasumber / Panitia / Pengawas)',
        deskripsi: 'Honor panitia ujian/asesmen, narasumber workshop, proktor/teknisi ANBK, pengawas',
      },
      {
        kode: '521219',
        nama: '521219 - Belanja Non Operasional Lainnya (Konsumsi Kegiatan & Spanduk)',
        deskripsi: 'Konsumsi rapat/kegiatan, banner, spanduk, dokumentasi, publikasi PPDB & AM',
      },
    ],
  },
  {
    groupName: '5218 - Belanja Barang Persediaan (Konsumsi & Praktikum)',
    kodePrefix: '5218',
    items: [
      {
        kode: '521811',
        nama: '521811 - Belanja Barang Persediaan Konsumsi (Bahan Praktik & Obat UKS)',
        deskripsi: 'Bahan praktikum sains/komputer, perlengkapan P3K / UKS siswa, masker',
      },
      {
        kode: '521813',
        nama: '521813 - Belanja Barang Persediaan Pemeliharaan',
        deskripsi: 'Persediaan bohlam lampu, kran, cat cadangan, suku cadang ringan',
      },
    ],
  },
  {
    groupName: '5221 - Belanja Langganan Daya & Jasa',
    kodePrefix: '5221',
    items: [
      {
        kode: '522111',
        nama: '522111 - Belanja Langganan Daya dan Jasa - Listrik PLN / Token',
        deskripsi: 'Tagihan rekening listrik bulanan atau pembelian pulsa token listrik PLN',
      },
      {
        kode: '522112',
        nama: '522112 - Belanja Langganan Daya dan Jasa - Telepon / Pulsa Komunikasi',
        deskripsi: 'Pulsa komunikasi dinas madrasah / telepon kabel PT Telkom',
      },
      {
        kode: '522113',
        nama: '522113 - Belanja Langganan Daya dan Jasa - Air Bersih (PDAM)',
        deskripsi: 'Tagihan air PDAM untuk kebutuhan sanitasi dan wudhu madrasah',
      },
      {
        kode: '522119',
        nama: '522119 - Belanja Langganan Daya dan Jasa Lainnya (Internet / WiFi / Cloud SIMPATIKA/EMIS)',
        deskripsi: 'Langganan internet IndiHome/Biznet, kuota CBT, domain/hosting, aplikasi RDM/SIMPATIKA',
      },
      {
        kode: '522121',
        nama: '522121 - Belanja Jasa Pos dan Giro / Kurir Pengiriman',
        deskripsi: 'Ongkos kirim berkas dinas, POS/JNE/J&T laporan BOS ke Kankemenag',
      },
      {
        kode: '522131',
        nama: '522131 - Belanja Jasa Konsultan / Tenaga Ahli IT',
        deskripsi: 'Jasa maintenance sistem jaringan, instalasi lab komputer, pembuatan web madrasah',
      },
      {
        kode: '522141',
        nama: '522141 - Belanja Sewa Gedung / Sarana Pertemuan',
        deskripsi: 'Sewa aula, sound system acara wisuda/perpisahan/workshop',
      },
      {
        kode: '522151',
        nama: '522151 - Belanja Jasa Profesi',
        deskripsi: 'Jasa profesional keahlian khusus',
      },
      {
        kode: '522191',
        nama: '522191 - Belanja Jasa Lainnya (Kebersihan / Keamanan / Sampah)',
        deskripsi: 'Iuran angkutan sampah lingkungan madrasah, jasa keamanan/satpam',
      },
    ],
  },
  {
    groupName: '5231 - Belanja Pemeliharaan Sarana & Prasarana',
    kodePrefix: '5231',
    items: [
      {
        kode: '523111',
        nama: '523111 - Belanja Pemeliharaan Gedung dan Bangunan',
        deskripsi: 'Pengecatan ruang kelas, perbaikan atap bocor, pintu, jendela, instalasi sanitasi/toilet',
      },
      {
        kode: '523121',
        nama: '523121 - Belanja Pemeliharaan Peralatan dan Mesin',
        deskripsi: 'Servis komputer/laptop, isi ulang toner/tinta printer, servis AC, pompa air madrasah',
      },
    ],
  },
  {
    groupName: '5241 - Belanja Perjalanan Dinas & Transport',
    kodePrefix: '5241',
    items: [
      {
        kode: '524111',
        nama: '524111 - Belanja Perjalanan Dinas Biasa (Luar Kota / Kemenag Pusat/Kanwil)',
        deskripsi: 'Transport dinas luar kota, tiket, uang harian rapat koordinasi Kanwil/Pusat',
      },
      {
        kode: '524113',
        nama: '524113 - Belanja Perjalanan Dinas Dalam Kota (KKM / MGMP / Kankemenag)',
        deskripsi: 'Uang transport guru/kepala madrasah menghadiri kegiatan KKM, MGMP, rapat di Kemenag',
      },
      {
        kode: '524114',
        nama: '524114 - Belanja Perjalanan Dinas Paket Meeting Dalam Kota',
        deskripsi: 'Paket pertemuan/meeting resmi madrasah dalam wilayah kabupaten/kota',
      },
    ],
  },
  {
    groupName: '5321 / 5361 - Belanja Modal (Peralatan, Mesin & Buku Perpustakaan)',
    kodePrefix: '53',
    items: [
      {
        kode: '532111',
        nama: '532111 - Belanja Modal Peralatan dan Mesin (Komputer / Laptop / Proyektor)',
        deskripsi: 'Pengadaan PC All-in-One, laptop CBT/ANBK, LCD proyektor kelas, printer, sound system',
      },
      {
        kode: '533111',
        nama: '533111 - Belanja Modal Gedung dan Bangunan (Renovasi Berat / Tambah Ruang)',
        deskripsi: 'Pengembangan fisik aset tetap madrasah sesuai regulasi modal',
      },
      {
        kode: '536111',
        nama: '536111 - Belanja Modal Lainnya - Buku Teks Utama / Perpustakaan',
        deskripsi: 'Pengadaan buku teks siswa Kurikulum Merdeka, buku panduan guru, koleksi perpustakaan',
      },
      {
        kode: '536112',
        nama: '536112 - Belanja Modal Lainnya - Alat Peraga Pendidikan / Multimedia',
        deskripsi: 'Alat peraga IPA/Matematika, globe, peta, mikroskop, smart TV pembelajaran',
      },
    ],
  },
];

// Helper to find account details
export function getAkunDetail(kodeOrNama: string) {
  for (const group of BAGAN_AKUN_STANDAR_BOS) {
    for (const item of group.items) {
      if (item.kode === kodeOrNama || item.nama === kodeOrNama || kodeOrNama.startsWith(item.kode)) {
        return item;
      }
    }
  }
  return null;
}
