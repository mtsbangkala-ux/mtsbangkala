import { BuktiPengeluaranItem, ItemPesananBarang, MadrasahProfile, NotaPesananBastItem, PejabatPenandatangan, PeriodeLaporan } from '../types/lpj';

export const NAMA_HARI_INDO: Record<number, string> = {
  0: 'Minggu',
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

export const NAMA_BULAN_INDO: string[] = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function getNamaHariIndo(dateStr: string): string {
  if (!dateStr) return 'Senin';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Senin';
    return NAMA_HARI_INDO[d.getDay()] || 'Senin';
  } catch {
    return 'Senin';
  }
}

export function getRomawiBulan(bulanNumber: number): string {
  const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romawi[Math.max(0, Math.min(11, bulanNumber - 1))] || 'I';
}

export interface NomorSuratOptions {
  kodeSatker?: string; // Default: 'MTs.21.07.03'
  formatBulan?: 'romawi' | 'angka' | 'nama'; // Default: 'romawi'
  digitCount?: number; // Default: 3 (e.g. B.001)
  tahun?: string; // Default: '2026'
}

export const DEFAULT_KODE_SATKER = 'MTs.21.07.03';
export const DEFAULT_TAHUN_SURAT = '2026';

/**
 * Format nomor urut surat dengan prefiks B. (contoh: B.001, B.002, dst.)
 */
export function formatNomorUrutSurat(index: number, digitCount: number = 3): string {
  const numStr = (index + 1).toString().padStart(digitCount, '0');
  return `B.${numStr}`;
}

/**
 * Format bulan laporan sesuai opsi (Romawi, Angka 2 digit, atau Nama Bulan)
 */
export function formatBulanLaporan(dateStr: string, format: 'romawi' | 'angka' | 'nama' = 'romawi'): string {
  if (!dateStr) return format === 'romawi' ? 'I' : format === 'angka' ? '01' : 'Januari';
  try {
    const d = new Date(dateStr);
    const month = isNaN(d.getMonth()) ? 0 : d.getMonth();
    if (format === 'angka') {
      return (month + 1).toString().padStart(2, '0');
    }
    if (format === 'nama') {
      return NAMA_BULAN_INDO[month] || 'Januari';
    }
    return getRomawiBulan(month + 1);
  } catch {
    return 'I';
  }
}

/**
 * Menghasilkan Nomor Surat Pesanan Otomatis:
 * Format: B.{xxx}/SP-BOS/{Kode Satker}/{Bulan Laporan}/{Tahun}
 * Contoh: B.001/SP-BOS/MTs.21.07.03/VI/2026
 */
export function generateNomorSuratPesanan(
  index: number,
  tanggal: string,
  options?: NomorSuratOptions
): string {
  const digits = options?.digitCount ?? 3;
  const noUrut = formatNomorUrutSurat(index, digits);
  const kodeSatker = options?.kodeSatker?.trim() || DEFAULT_KODE_SATKER;
  const formatBln = options?.formatBulan || 'romawi';
  const bulanStr = formatBulanLaporan(tanggal, formatBln);
  const tahunStr = options?.tahun || (tanggal ? new Date(tanggal).getFullYear().toString() : DEFAULT_TAHUN_SURAT);

  return `${noUrut}/SP-BOS/${kodeSatker}/${bulanStr}/${tahunStr}`;
}

/**
 * Menghasilkan Nomor BAST Otomatis:
 * Format: B.{xxx}/BAST-BOS/{Kode Satker}/{Bulan Laporan}/{Tahun}
 * Contoh: B.001/BAST-BOS/MTs.21.07.03/VI/2026
 */
export function generateNomorBast(
  index: number,
  tanggal: string,
  options?: NomorSuratOptions
): string {
  const digits = options?.digitCount ?? 3;
  const noUrut = formatNomorUrutSurat(index, digits);
  const kodeSatker = options?.kodeSatker?.trim() || DEFAULT_KODE_SATKER;
  const formatBln = options?.formatBulan || 'romawi';
  const bulanStr = formatBulanLaporan(tanggal, formatBln);
  const tahunStr = options?.tahun || (tanggal ? new Date(tanggal).getFullYear().toString() : DEFAULT_TAHUN_SURAT);

  return `${noUrut}/BAST-BOS/${kodeSatker}/${bulanStr}/${tahunStr}`;
}

/**
 * Memeriksa apakah sebuah bukti pengeluaran merupakan belanja barang/jasa dari toko/penyedia
 */
export function isBelanjaTokoAtauPenyedia(item: BuktiPengeluaranItem): boolean {
  if (!item) return false;
  const p = (item.penerima || '').toLowerCase();
  const u = (item.uraian || '').toLowerCase();
  const k = (item.kodeAkun || '').toLowerCase();
  const j = (item.jenisBukti || '').toLowerCase();

  // Exclude honor guru murni jika tanpa pengadaan barang
  if (p.includes('guru') && (p.includes('honor') || p.includes('gtt') || p.includes('ptt')) && !u.includes('pengadaan') && !u.includes('atk')) {
    return false;
  }
  // Exclude daya dan jasa murni telkom/pln jika tidak perlu BAST barang
  if (p.includes('telkom') || p.includes('pln (persero)') || p.includes('token listrik')) {
    return false;
  }

  // Faktur / Nota toko always qualifies
  if (j.includes('faktur') || j.includes('nota')) {
    return true;
  }

  // Keywords that qualify for Surat Pesanan & BAST
  const matchKeywords = [
    'toko', 'cv', 'pt', 'ud', 'fa', 'penerbit', 'rekanan', 'stationery', 'komputer', 
    'mandiri', 'berkah', 'bina', 'karya', 'fotocopy', 'fotokopi', 'percetakan', 
    'atk', 'bahan', 'buku', 'pemeliharaan', 'perbaikan', 'servis', 'mebel', 'elektronik', 
    'alat', 'belanja', 'pembelian', 'pengadaan', 'konsumsi', 'catering', 'katering', 
    'spidol', 'kertas', 'tinta', 'printer', 'spanduk', 'banner', 'seragam', 'olahraga', 
    'lab', 'laboratorium', 'obat', 'uks', 'kebersihan', 'sapu', 'cat', 'semen', 'bangunan'
  ];

  return (
    matchKeywords.some((kw) => p.includes(kw) || u.includes(kw)) ||
    k.startsWith('521211') || // Belanja Bahan
    k.startsWith('5218') ||   // Barang Persediaan
    k.startsWith('5231') ||   // Pemeliharaan
    k.startsWith('53') ||     // Belanja Modal
    k.startsWith('52')        // Belanja Barang/Jasa
  );
}

/**
 * Membuat breakdown item barang default dari uraian belanja
 */
export function createDefaultItemsFromUraian(uraian: string, nominal: number): ItemPesananBarang[] {
  const u = uraian.toLowerCase();

  if (u.includes('kertas') || u.includes('atk') || u.includes('tinta') || u.includes('spidol')) {
    const part = Math.floor(nominal / 4);
    const rem = nominal - part * 3;
    return [
      {
        id: `it-${Date.now()}-1`,
        namaBarang: 'Kertas HVS A4 & F4 75/80 gr',
        spesifikasi: 'PaperOne / Sinar Dunia (Sidu) 75-80 gsm',
        volume: 20,
        satuan: 'Rim',
        hargaSatuan: Math.round(part / 20),
        totalHarga: part,
        kondisi: 'Baik',
      },
      {
        id: `it-${Date.now()}-2`,
        namaBarang: 'Tinta Printer Botol (Hitam & Warna)',
        spesifikasi: 'Epson 003 / 664 Original Black & Cyan/Magenta/Yellow',
        volume: 8,
        satuan: 'Botol',
        hargaSatuan: Math.round(part / 8),
        totalHarga: part,
        kondisi: 'Baik',
      },
      {
        id: `it-${Date.now()}-3`,
        namaBarang: 'Spidol Whiteboard & Tinta Isi Ulang',
        spesifikasi: 'Snowman Boardmarker Hitam/Biru & Refill Ink',
        volume: 30,
        satuan: 'Buah',
        hargaSatuan: Math.round(part / 30),
        totalHarga: part,
        kondisi: 'Baik',
      },
      {
        id: `it-${Date.now()}-4`,
        namaBarang: 'Perlengkapan Administrasi Kantor (Map, Binder Clip, Ballpoint)',
        spesifikasi: 'Joyko / Bantex Folio & Box File Plastik',
        volume: 1,
        satuan: 'Paket',
        hargaSatuan: rem,
        totalHarga: rem,
        kondisi: 'Lengkap & Sesuai',
      },
    ];
  }

  if (u.includes('buku') || u.includes('teks') || u.includes('kurikulum')) {
    const half = Math.floor(nominal / 2);
    const rem = nominal - half;
    return [
      {
        id: `it-${Date.now()}-1`,
        namaBarang: 'Buku Teks Utama Siswa Kurikulum Merdeka Madrasah (Semua Mapel)',
        spesifikasi: 'Kementerian Agama RI / Kemendikbudristek Kelas 7 & 8',
        volume: 75,
        satuan: 'Eksemplar',
        hargaSatuan: Math.round(half / 75),
        totalHarga: half,
        kondisi: 'Sangat Baik',
      },
      {
        id: `it-${Date.now()}-2`,
        namaBarang: 'Buku Panduan Guru & Perangkat Asesmen Pembelajaran',
        spesifikasi: 'Penerbit Resmi Ber-ISBN Edisi Revisi',
        volume: 25,
        satuan: 'Eksemplar',
        hargaSatuan: Math.round(rem / 25),
        totalHarga: rem,
        kondisi: 'Lengkap & Sesuai',
      },
    ];
  }

  if (u.includes('pengecatan') || u.includes('pemeliharaan') || u.includes('sanitasi') || u.includes('gedung')) {
    const part1 = Math.floor(nominal * 0.6);
    const part2 = nominal - part1;
    return [
      {
        id: `it-${Date.now()}-1`,
        namaBarang: 'Material Cat Tembok, Kuas, Roll, Dempul & Perlengkapan Finishing',
        spesifikasi: 'Cat Tembok Eksterior/Interior Dulux/Avitex & Perlengkapan Tukang',
        volume: 1,
        satuan: 'Paket',
        hargaSatuan: part1,
        totalHarga: part1,
        kondisi: 'Baik',
      },
      {
        id: `it-${Date.now()}-2`,
        namaBarang: 'Bahan Perbaikan Pipa Sanitasi, Keran Air & Tempat Wudhu Siswa',
        spesifikasi: 'Pipa PVC Rucika, Kran Stainless Steel & Aksesoris Plumbing',
        volume: 1,
        satuan: 'Paket',
        hargaSatuan: part2,
        totalHarga: part2,
        kondisi: 'Lengkap & Sesuai',
      },
    ];
  }

  if (u.includes('asesmen') || u.includes('soal') || u.includes('naskah') || u.includes('penggandaan')) {
    return [
      {
        id: `it-${Date.now()}-1`,
        namaBarang: 'Penggandaan / Percetakan Naskah Asesmen & Lembar Jawaban',
        spesifikasi: 'Kertas HVS Folio 70gr Cetak Dua Sisi Rapih & Teramplop',
        volume: 1,
        satuan: 'Paket',
        hargaSatuan: nominal,
        totalHarga: nominal,
        kondisi: 'Lengkap & Sesuai',
      },
    ];
  }

  // Default fallback 1 item matching uraian
  return [
    {
      id: `it-${Date.now()}-1`,
      namaBarang: uraian,
      spesifikasi: 'Sesuai spesifikasi dan standar operasional madrasah',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: nominal,
      totalHarga: nominal,
      kondisi: 'Baik',
    },
  ];
}

/**
 * Menghasilkan data Nota Pesanan dan BAST otomatis dari daftar Bukti Pengeluaran (SPJ)
 */
export function generateAutoNotaPesananBast(
  buktiPengeluaran: BuktiPengeluaranItem[],
  profile: MadrasahProfile,
  pejabat: PejabatPenandatangan,
  existingItems?: NotaPesananBastItem[],
  periode?: PeriodeLaporan,
  options?: NomorSuratOptions,
  forceRegenerate: boolean = false
): NotaPesananBastItem[] {
  if (!buktiPengeluaran || buktiPengeluaran.length === 0) {
    return [];
  }

  let qualifyingSpj = buktiPengeluaran.filter(isBelanjaTokoAtauPenyedia);

  // Fallback: jika tidak ada kwitansi yang lolos filter keyword, gunakan semua kwitansi selain honor murni
  if (qualifyingSpj.length === 0 && buktiPengeluaran.length > 0) {
    qualifyingSpj = buktiPengeluaran.filter((b) => {
      const p = (b.penerima || '').toLowerCase();
      const u = (b.uraian || '').toLowerCase();
      return !p.includes('guru') || u.includes('pengadaan') || u.includes('atk');
    });
  }

  // Jika tetap kosong, gunakan semua kwitansi yang ada
  if (qualifyingSpj.length === 0) {
    qualifyingSpj = [...buktiPengeluaran];
  }

  return generateNotaPesananBastFromSelectedSpj(
    qualifyingSpj,
    profile,
    pejabat,
    existingItems,
    periode,
    options,
    forceRegenerate
  );
}

/**
 * Menghasilkan data Nota Pesanan dan BAST dari daftar SPJ yang dipilih spesifik oleh pengguna
 */
export function generateNotaPesananBastFromSelectedSpj(
  selectedSpjList: BuktiPengeluaranItem[],
  profile: MadrasahProfile,
  pejabat: PejabatPenandatangan,
  existingItems?: NotaPesananBastItem[],
  periode?: PeriodeLaporan,
  options?: NomorSuratOptions,
  forceRegenerate: boolean = false
): NotaPesananBastItem[] {
  if (!selectedSpjList || selectedSpjList.length === 0) {
    return [];
  }

  const existingMap = new Map<string, NotaPesananBastItem>();
  if (existingItems && !forceRegenerate) {
    for (const item of existingItems) {
      if (item.buktiPengeluaranId) {
        existingMap.set(item.buktiPengeluaranId, item);
      }
    }
  }

  const defaultTahun = periode?.tahunAnggaran || DEFAULT_TAHUN_SURAT;
  const mergedOptions: NomorSuratOptions = {
    kodeSatker: options?.kodeSatker || DEFAULT_KODE_SATKER,
    formatBulan: options?.formatBulan || 'romawi',
    digitCount: options?.digitCount || 3,
    tahun: options?.tahun || defaultTahun,
  };

  const results: NotaPesananBastItem[] = [];

  selectedSpjList.forEach((spj, idx) => {
    const spjDate = spj.tanggal || new Date().toISOString().split('T')[0];
    const dateObj = new Date(spjDate);

    // SP date usually 2 days prior to SPJ or same date
    const dSp = new Date(dateObj);
    if (!isNaN(dSp.getTime())) {
      dSp.setDate(dSp.getDate() - 2);
    }
    const tanggalPesanan = !isNaN(dSp.getTime()) ? dSp.toISOString().split('T')[0] : spjDate;
    const tanggalBast = spjDate;
    const hariBast = getNamaHariIndo(tanggalBast);

    const noSuratPesanan = generateNomorSuratPesanan(idx, tanggalPesanan, mergedOptions);
    const noBast = generateNomorBast(idx, tanggalBast, mergedOptions);

    // If existing and not forced regenerate, keep customized fields
    const existing = existingMap.get(spj.id);
    if (existing && !forceRegenerate) {
      results.push({
        ...existing,
        noSuratPesanan: existing.noSuratPesanan || noSuratPesanan,
        noBast: existing.noBast || noBast,
        totalNominal: spj.nominal,
      });
      return;
    }

    const items = createDefaultItemsFromUraian(spj.uraian, spj.nominal);

    results.push({
      id: `npb-${Date.now()}-${idx}`,
      buktiPengeluaranId: spj.id,
      noBuktiSpj: spj.noBukti,
      noSuratPesanan,
      tanggalPesanan,
      noBast,
      tanggalBast,
      hariBast,

      namaToko: spj.penerima || 'Toko / Rekanan Madrasah',
      namaPenyedia: spj.penerima.includes('Toko') || spj.penerima.includes('CV') || spj.penerima.includes('PT') || spj.penerima.includes('UD')
        ? 'Pimpinan / Penanggung Jawab Toko'
        : spj.penerima,
      jabatanPenyedia: 'Pimpinan / Pemilik Rekanan',
      alamatToko: `Jl. Poros ${profile.kecamatan || 'Kecamatan'}, Kab. ${profile.kabupaten || 'Jeneponto'}`,
      teleponToko: '0812-XXXX-XXXX',

      namaPemesan: pejabat.namaKepala || 'Kepala Madrasah',
      nipPemesan: pejabat.nipKepala || '-',
      jabatanPemesan: `Kepala ${profile.namaMadrasah || 'Madrasah'} / PPK`,

      keperluan: spj.uraian,
      waktuPenyerahan: 'Segera / 3 (tiga) hari kalender setelah pesanan diterima',
      tempatPenyerahan: `Kantor ${profile.namaMadrasah || 'Madrasah'} (${profile.alamat || 'Alamat Madrasah'})`,
      keteranganPemeriksaan: 'Barang/pekerjaan telah diperiksa dan diterima dalam keadaan 100% lengkap, baik, baru, dan sesuai dengan surat pesanan.',

      itemsBarang: items,
      totalNominal: spj.nominal,
    });
  });

  return results;
}

