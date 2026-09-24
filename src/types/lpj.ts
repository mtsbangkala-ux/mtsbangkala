export interface MadrasahProfile {
  namaMadrasah: string;
  nsm: string;
  npsn: string;
  jenjang: 'RA' | 'MI' | 'MTs' | 'MA' | 'MAK';
  status: 'Negeri' | 'Swasta';
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
}

export interface PeriodeAnggaran {
  tahunAnggaran: string;
  tahap: string; // e.g. 'Tahap I (Januari - Juni)', 'Bulan Januari', 'Bulan Februari', etc.
  bulan?: string;
  semester: 'Ganjil' | 'Genap' | 'Satu Tahun Penuh';
  tanggalAwal: string;
  tanggalAkhir: string;
}

export type PeriodeLaporan = PeriodeAnggaran;

export interface SumberDanaItem {
  id: string;
  namaSumber: string;
  alokasiPagu: number;
  diterima: number;
  tanggalTerima: string;
  noRekening: string;
  keterangan: string;
}

export interface RealisasiKegiatanItem {
  id: string;
  standarSNP: string; // 1 s.d. 8 Standar Nasional Pendidikan
  kodeKegiatan: string;
  namaKegiatan: string;
  anggaran: number;
  realisasi: number;
  volume: string;
  satuan: string;
  keterangan: string;
}

export interface BuktiPengeluaranItem {
  id: string;
  noBukti: string;
  tanggal: string;
  kodeAkun: string; // e.g. 521211 (Belanja Bahan), 521213 (Honor), 522111 (Langganan Daya/Jasa)
  penerima: string;
  uraian: string;
  nominal: number;
  jenisBukti: 'Kwitansi' | 'Faktur / Nota' | 'SPJ / Honor' | 'Kuitansi Dinas';
  kelengkapan: string[]; // ['Kwitansi Asli', 'Faktur Toko', 'Berita Acara', 'Daftar Hadir', 'Dokumentasi']
}

export interface RekapPajakItem {
  id: string;
  noBukti: string;
  jenisPajak: 'PPh 21' | 'PPh 22' | 'PPh 23' | 'PPN 11%';
  uraian: string;
  dpp: number; // Dasar Pengenaan Pajak
  tarif: number; // Persentase Pajak
  jumlahPajak: number;
  tanggalSetor: string;
  ntpn: string; // Nomor Transaksi Penerimaan Negara / Kode Billing
  statusSetor: 'Sudah Disetor' | 'Belum Disetor';
}

export interface DokumentasiItem {
  id: string;
  judul: string;
  tanggal: string;
  kategori: 'Foto Kegiatan' | 'Berita Acara' | 'Daftar Hadir' | 'Notulen Rapat' | 'Serah Terima Barang';
  fileData?: string; // Base64 data URL
  fileName?: string;
  fileType?: string; // 'image' | 'pdf'
  keterangan: string;
}

export interface ItemPesananBarang {
  id: string;
  namaBarang: string;
  spesifikasi?: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  totalHarga: number;
  kondisi?: 'Baik' | 'Sangat Baik' | 'Lengkap & Sesuai';
}

export interface NotaPesananBastItem {
  id: string;
  buktiPengeluaranId?: string; // Link ke id BuktiPengeluaranItem jika berasal dari SPJ
  noBuktiSpj?: string; // e.g. KW-02/BOS/MTS/II/2025
  noSuratPesanan: string; // e.g. 02/SP-BOS/MTS.BK/II/2025
  tanggalPesanan: string; // e.g. 2025-02-22
  noBast: string; // e.g. 02/BAST-BOS/MTS.BK/II/2025
  tanggalBast: string; // e.g. 2025-02-25
  hariBast?: string; // e.g. Selasa
  
  // Data Toko / Penyedia (Pihak Pertama)
  namaToko: string;
  namaPenyedia: string; // Pimpinan / Pemilik Toko
  jabatanPenyedia: string;
  alamatToko: string;
  teleponToko?: string;

  // Data Madrasah (Pihak Kedua / Pemesan)
  namaPemesan: string;
  nipPemesan?: string;
  jabatanPemesan: string;

  // Rincian Pembelian & Pekerjaan
  keperluan: string;
  waktuPenyerahan: string;
  tempatPenyerahan: string;
  keteranganPemeriksaan?: string;

  itemsBarang: ItemPesananBarang[];
  totalNominal: number;
}

export interface SptjbData {
  noSurat: string;
  tanggalSurat: string;
  pernyataan: string;
}

export interface PejabatPenandatangan {
  namaKepala: string;
  nipKepala: string;
  namaBendahara: string;
  nipBendahara: string;
  namaKetuaKomite?: string;
  tempatPembuatan: string;
  tanggalPengesahan: string;
}

export interface LPJFullData {
  id: string;
  createdAt: string;
  updatedAt: string;
  profile: MadrasahProfile;
  periode: PeriodeAnggaran;
  sumberDana: SumberDanaItem[];
  realisasiKegiatan: RealisasiKegiatanItem[];
  buktiPengeluaran: BuktiPengeluaranItem[];
  rekapPajak: RekapPajakItem[];
  dokumentasi: DokumentasiItem[];
  sptjb: SptjbData;
  notaPesananBast?: NotaPesananBastItem[];
  pejabat: PejabatPenandatangan;
  catatanTambahan?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  namaLengkap: string;
  role: string;
  loginTime: string;
}
