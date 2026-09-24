import React, { useState } from 'react';
import { RealisasiKegiatanItem } from '../../types/lpj';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle,
  BarChart3,
  Sparkles,
  Search,
  BookOpen,
  Layers,
  ArrowRight,
  Zap,
  CheckCheck,
  RotateCcw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { formatRupiah } from '../../utils/numberToWords';
import {
  SNP_STANDAR_LIST,
  ERKAM_KEGIATAN_DATABASE,
  getErkamKegiatanByStandar,
  getDefaultErkamKegiatan,
  ErkamKegiatanOption
} from '../../utils/erkamKegiatanData';

interface RealisasiKegiatanFormProps {
  items: RealisasiKegiatanItem[];
  onChange: (items: RealisasiKegiatanItem[]) => void;
}

export const RealisasiKegiatanForm: React.FC<RealisasiKegiatanFormProps> = ({ items = [], onChange }) => {
  const [autoSyncRealisasi, setAutoSyncRealisasi] = useState<boolean>(true);
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [modalTargetItemId, setModalTargetItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilterStandar, setSelectedFilterStandar] = useState<string>('Semua');

  // Tambah Kegiatan Baru dengan Nilai Default e-RKAM
  const handleAdd = () => {
    const defaultSNP = '3. Standar Proses';
    const defKegiatan = getDefaultErkamKegiatan(defaultSNP);
    const newItem: RealisasiKegiatanItem = {
      id: `rk-${Date.now()}`,
      standarSNP: defaultSNP,
      kodeKegiatan: defKegiatan.kode,
      namaKegiatan: defKegiatan.nama,
      anggaran: 5000000,
      realisasi: 5000000, // Otomatis sesuai anggaran
      volume: '1',
      satuan: defKegiatan.satuanDefault || 'Paket',
      keterangan: defKegiatan.keteranganDefault || 'Realisasi belanja sesuai e-RKAM',
    };
    onChange([...items, newItem]);
  };

  // Update Field Kegiatan
  const handleUpdate = (id: string, field: keyof RealisasiKegiatanItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;

      // Jika yang diubah adalah 'standarSNP', sesuaikan pilihan kegiatan default
      if (field === 'standarSNP') {
        const def = getDefaultErkamKegiatan(value);
        return {
          ...item,
          standarSNP: value,
          kodeKegiatan: def.kode,
          namaKegiatan: def.nama,
          satuan: item.satuan || def.satuanDefault,
          keterangan: item.keterangan || def.keteranganDefault,
        };
      }

      // Jika yang diubah adalah 'anggaran' dan autoSyncRealisasi aktif,
      // otomatis samakan nilai 'realisasi' dengan 'anggaran'
      if (field === 'anggaran') {
        const numVal = Number(value) || 0;
        if (autoSyncRealisasi) {
          return {
            ...item,
            anggaran: numVal,
            realisasi: numVal, // Otomatis sama dengan anggaran
          };
        }
        return { ...item, anggaran: numVal };
      }

      if (field === 'realisasi') {
        return { ...item, realisasi: Number(value) || 0 };
      }

      return { ...item, [field]: value };
    });
    onChange(updated);
  };

  // Pilih Kegiatan dari Dropdown / Bank Kegiatan e-RKAM
  const handleSelectErkamKegiatan = (id: string, option: ErkamKegiatanOption) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        standarSNP: option.standarSNP,
        kodeKegiatan: option.kode,
        namaKegiatan: option.nama,
        satuan: option.satuanDefault || item.satuan || 'Paket',
        keterangan: option.keteranganDefault || item.keterangan || 'Realisasi sesuai e-RKAM',
      };
    });
    onChange(updated);
  };

  // Buka Modal Pemilihan Bank Kegiatan untuk baris tertentu
  const openBankForNewOrItem = (itemId?: string) => {
    if (itemId) {
      setModalTargetItemId(itemId);
    } else {
      setModalTargetItemId(null); // mode buat baru
    }
    setShowBankModal(true);
  };

  // Handle pilih dari modal
  const handlePickFromModal = (option: ErkamKegiatanOption) => {
    if (modalTargetItemId) {
      handleSelectErkamKegiatan(modalTargetItemId, option);
    } else {
      // Buat item baru dari pilihan modal
      const newItem: RealisasiKegiatanItem = {
        id: `rk-${Date.now()}`,
        standarSNP: option.standarSNP,
        kodeKegiatan: option.kode,
        namaKegiatan: option.nama,
        anggaran: 5000000,
        realisasi: 5000000,
        volume: '1',
        satuan: option.satuanDefault || 'Paket',
        keterangan: option.keteranganDefault || 'Realisasi sesuai e-RKAM',
      };
      onChange([...items, newItem]);
    }
    setShowBankModal(false);
  };

  // Sinkronkan Semua Realisasi = Anggaran (100% serapan)
  const handleSyncAllRealisasiToAnggaran = () => {
    const updated = items.map((item) => ({
      ...item,
      realisasi: item.anggaran,
    }));
    onChange(updated);
  };

  // Susun Otomatis Paket 8 SNP Standar e-RKAM Lengkap
  const handleGenerate8SNPDefaults = () => {
    if (items.length > 0) {
      const confirmReset = window.confirm(
        'Apakah Anda yakin ingin menyusun ulang daftar kegiatan menjadi 8 Standar SNP e-RKAM standar? Data kegiatan saat ini akan diperbarui.'
      );
      if (!confirmReset) return;
    }

    const defaultItems: RealisasiKegiatanItem[] = [
      {
        id: `rk-1-${Date.now()}`,
        standarSNP: '1. Standar Kompetensi Lulusan',
        kodeKegiatan: '01.01.04',
        namaKegiatan: 'Pelaksanaan Asesmen Madrasah (AM) & Pengayaan Materi Kelulusan',
        anggaran: 8500000,
        realisasi: 8500000,
        volume: '1',
        satuan: 'Paket',
        keterangan: 'Penggandaan naskah AM, konsumsi pengawas, & proktor',
      },
      {
        id: `rk-2-${Date.now()}`,
        standarSNP: '2. Standar Isi',
        kodeKegiatan: '02.01.02',
        namaKegiatan: 'Penyusunan Kurikulum Operasional Madrasah (KOM) & Modul Ajar',
        anggaran: 4200000,
        realisasi: 4200000,
        volume: '1',
        satuan: 'Kegiatan',
        keterangan: 'Workshop pengembangan modul ajar IKM & P5RA',
      },
      {
        id: `rk-3-${Date.now()}`,
        standarSNP: '3. Standar Proses',
        kodeKegiatan: '03.02.01',
        namaKegiatan: 'Pengadaan Alat Peraga Pembelajaran & Kegiatan Ekstrakurikuler Keagamaan',
        anggaran: 12800000,
        realisasi: 12800000,
        volume: '6',
        satuan: 'Bulan',
        keterangan: 'Pembinaan Tahfidz, Pramuka, Hadrah & ATK Pembelajaran',
      },
      {
        id: `rk-4-${Date.now()}`,
        standarSNP: '4. Standar Pendidik dan Tenaga Kependidikan',
        kodeKegiatan: '04.01.03',
        namaKegiatan: 'Peningkatan Kompetensi Guru melalui MGMP dan Pelatihan PKB',
        anggaran: 6500000,
        realisasi: 6500000,
        volume: '12',
        satuan: 'Orang',
        keterangan: 'Transport & pendaftaran pelatihan guru madrasah',
      },
      {
        id: `rk-5-${Date.now()}`,
        standarSNP: '5. Standar Sarana dan Prasarana',
        kodeKegiatan: '05.02.05',
        namaKegiatan: 'Pemeliharaan Ringan Gedung, Sanitasi & Pengadaan Buku Teks Utama',
        anggaran: 21500000,
        realisasi: 21500000,
        volume: '1',
        satuan: 'Paket',
        keterangan: 'Pengecatan kelas, perbaikan kran/sanitasi, pembelian buku teks Kemenag',
      },
      {
        id: `rk-6-${Date.now()}`,
        standarSNP: '6. Standar Pengelolaan',
        kodeKegiatan: '06.01.01',
        namaKegiatan: 'Langganan Daya dan Jasa (Listrik PLN, Internet Madrasah, Aplikasi SIMPATIKA/EMIS)',
        anggaran: 10500000,
        realisasi: 10500000,
        volume: '6',
        satuan: 'Bulan',
        keterangan: 'Pembayaran tagihan rutin Indihome & token listrik',
      },
      {
        id: `rk-7-${Date.now()}`,
        standarSNP: '7. Standar Pembiayaan',
        kodeKegiatan: '07.03.01',
        namaKegiatan: 'Honorarium Guru Non-PNS (GTT/PTT) dan Tenaga Kependidikan',
        anggaran: 32000000,
        realisasi: 32000000,
        volume: '6',
        satuan: 'Bulan',
        keterangan: 'Penyaluran honorarium guru non-ASN dan operator madrasah',
      },
      {
        id: `rk-8-${Date.now()}`,
        standarSNP: '8. Standar Penilaian Pendidikan',
        kodeKegiatan: '08.01.01',
        namaKegiatan: 'Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) & Gladi Bersih',
        anggaran: 7000000,
        realisasi: 7000000,
        volume: '1',
        satuan: 'Paket',
        keterangan: 'Honor proktor, teknisi, pengawas, & konsumsi ANBK',
      },
    ];
    onChange(defaultItems);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const totalAnggaran = items.reduce((acc, curr) => acc + (Number(curr.anggaran) || 0), 0);
  const totalRealisasi = items.reduce((acc, curr) => acc + (Number(curr.realisasi) || 0), 0);
  const persenTotal = totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : '0';

  // Filtered Kegiatan untuk Modal
  const filteredModalKegiatan = ERKAM_KEGIATAN_DATABASE.filter((k) => {
    const matchSearch =
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.kode.includes(searchTerm) ||
      k.standarSNP.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStandar =
      selectedFilterStandar === 'Semua' || k.standarSNP === selectedFilterStandar;
    return matchSearch && matchStandar;
  });

  return (
    <div className="space-y-4">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">4. Laporan Realisasi per Kegiatan (e-RKAM)</h4>
            <p className="text-xs text-slate-500">
              Kode RKAM otomatis sesuai standar 8 SNP & realisasi otomatis sama dengan anggaran
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => openBankForNewOrItem()}
            className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Buka Bank Daftar Kegiatan Resmi e-RKAM Kemenag"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bank e-RKAM</span>
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Kegiatan</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Auto-Sync Realisasi & Quick Actions */}
      <div className="p-3 bg-gradient-to-r from-indigo-50/90 to-blue-50/80 border border-indigo-200 rounded-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Auto-Sync Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoSyncRealisasi(!autoSyncRealisasi)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoSyncRealisasi ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={autoSyncRealisasi}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  autoSyncRealisasi ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>Otomatisasi Realisasi = Anggaran (100%)</span>
                {autoSyncRealisasi && (
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded-full font-bold">
                    Aktif
                  </span>
                )}
              </span>
              <p className="text-[10px] text-slate-600">
                Saat mengisi angka Anggaran, kolom Realisasi otomatis tersinkronisasi 100%
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleSyncAllRealisasiToAnggaran}
              className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Samakan semua nilai realisasi dengan anggaran saat ini"
            >
              <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Samakan Semua (100%)</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate8SNPDefaults}
              className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Susun otomatis 8 paket standar kegiatan SNP e-RKAM"
            >
              <Sparkles className="w-3 h-3 text-indigo-700" />
              <span>Paket 8 SNP Lengkap</span>
            </button>
          </div>
        </div>

        {/* Summary Metric */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-200/60 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Pagu Anggaran:</span>
            <span className="text-sm font-black text-slate-900">{formatRupiah(totalAnggaran)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-900 uppercase block">
              Total Realisasi ({persenTotal}%):
            </span>
            <span className="text-sm font-black text-indigo-700">{formatRupiah(totalRealisasi)}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end">
            <span className="text-[11px] text-indigo-950 font-semibold bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200">
              {items.length} Rincian Kegiatan
            </span>
          </div>
        </div>
      </div>

      {/* Item Cards List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const persen = item.anggaran > 0 ? ((item.realisasi / item.anggaran) * 100).toFixed(0) : '0';
          const erkamOptionsForStandard = getErkamKegiatanByStandar(item.standarSNP);

          return (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-2xs transition-all hover:border-indigo-300"
            >
              {/* Card Top: Number, Status & Remove */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200">
                    Kegiatan #{index + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    Number(persen) >= 100
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    Serapan: {persen}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openBankForNewOrItem(item.id)}
                    className="text-[11px] text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Pilih dari Bank Kegiatan e-RKAM"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Cari e-RKAM</span>
                  </button>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Kegiatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Standar SNP (1 s.d 8) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  1. Standar Nasional Pendidikan (SNP)
                </label>
                <select
                  value={item.standarSNP}
                  onChange={(e) => handleUpdate(item.id, 'standarSNP', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:border-indigo-500 outline-none"
                >
                  {SNP_STANDAR_LIST.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Pilihan Otomatis Kegiatan e-RKAM Resmi */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-indigo-900 uppercase">
                    2. Pilihan Cepat Kegiatan e-RKAM (Otomatisasi Kode & Uraian)
                  </label>
                  <span className="text-[10px] text-slate-500 italic">
                    {erkamOptionsForStandard.length} Pilihan Standar
                  </span>
                </div>
                <select
                  value={item.kodeKegiatan}
                  onChange={(e) => {
                    const selectedKode = e.target.value;
                    const opt = ERKAM_KEGIATAN_DATABASE.find((k) => k.kode === selectedKode);
                    if (opt) {
                      handleSelectErkamKegiatan(item.id, opt);
                    } else {
                      handleUpdate(item.id, 'kodeKegiatan', selectedKode);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-950 focus:border-indigo-500 outline-none"
                >
                  <option value={item.kodeKegiatan}>
                    [Kode: {item.kodeKegiatan}] {item.namaKegiatan} (Pilihan Saat Ini)
                  </option>
                  <optgroup label={`Daftar Standar: ${item.standarSNP}`}>
                    {erkamOptionsForStandard.map((opt) => (
                      <option key={opt.kode} value={opt.kode}>
                        [{opt.kode}] {opt.nama}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 3. Detail Kode RKAM & Uraian Manual (Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Kode e-RKAM
                  </label>
                  <input
                    type="text"
                    value={item.kodeKegiatan}
                    onChange={(e) => handleUpdate(item.id, 'kodeKegiatan', e.target.value)}
                    placeholder="01.01.01"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-900 focus:border-indigo-500 outline-none text-center"
                  />
                </div>
                <div className="sm:col-span-9">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Uraian Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    value={item.namaKegiatan}
                    onChange={(e) => handleUpdate(item.id, 'namaKegiatan', e.target.value)}
                    placeholder="Nama kegiatan operasional / pembelajaran"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* 4. Volume, Satuan, Anggaran, Realisasi */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-slate-200/80">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Target Volume & Satuan
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={item.volume}
                      onChange={(e) => handleUpdate(item.id, 'volume', e.target.value)}
                      placeholder="1"
                      className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold text-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) => handleUpdate(item.id, 'satuan', e.target.value)}
                      placeholder="Paket"
                      className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">
                      Anggaran (Rp)
                    </label>
                    {autoSyncRealisasi && (
                      <span className="text-[9px] text-indigo-700 font-bold bg-indigo-50 px-1 rounded">
                        ⚡ Otomatis Realisasi
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={item.anggaran}
                    onChange={(e) => handleUpdate(item.id, 'anggaran', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs text-slate-900 font-bold outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                    {formatRupiah(item.anggaran)}
                  </span>
                </div>

                <div className="sm:col-span-4">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[10px] font-bold text-indigo-900 uppercase">
                      Realisasi (Rp)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id, 'realisasi', item.anggaran)}
                      className="text-[9px] text-indigo-600 hover:text-indigo-800 underline font-semibold cursor-pointer"
                      title="Setel realisasi persis sama dengan anggaran"
                    >
                      Samakan
                    </button>
                  </div>
                  <input
                    type="number"
                    value={item.realisasi}
                    onChange={(e) => handleUpdate(item.id, 'realisasi', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-indigo-300 rounded-lg text-xs text-indigo-700 font-bold outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-indigo-700 font-sans block mt-0.5">
                    {formatRupiah(item.realisasi)}
                  </span>
                </div>
              </div>

              {/* 5. Keterangan Realisasi */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                  Keterangan / Output Kegiatan
                </label>
                <input
                  type="text"
                  value={item.keterangan}
                  onChange={(e) => handleUpdate(item.id, 'keterangan', e.target.value)}
                  placeholder="Keterangan pelaksanaan output kegiatan e-RKAM"
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL / DIALOG BANK KEGIATAN e-RKAM KEMENAG */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-200" />
                <div>
                  <h3 className="text-sm font-bold">Bank Daftar Kegiatan Resmi e-RKAM</h3>
                  <p className="text-[11px] text-indigo-200">
                    {modalTargetItemId
                      ? 'Pilih kegiatan untuk mengganti kode dan uraian baris yang dipilih'
                      : 'Pilih kegiatan untuk ditambahkan ke daftar realisasi'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kode (01.01), nama kegiatan, atau kata kunci..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              {/* Standar Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedFilterStandar('Semua')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer transition-colors ${
                    selectedFilterStandar === 'Semua'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Semua (8 Standar)
                </button>
                {SNP_STANDAR_LIST.map((snp, idx) => (
                  <button
                    key={snp}
                    type="button"
                    onClick={() => setSelectedFilterStandar(snp)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium shrink-0 cursor-pointer transition-colors ${
                      selectedFilterStandar === snp
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    SNP {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: List of Kegiatan */}
            <div className="p-3 overflow-y-auto flex-1 space-y-2 divide-y divide-slate-100">
              {filteredModalKegiatan.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs">Tidak ditemukan kegiatan e-RKAM yang sesuai.</p>
                </div>
              ) : (
                filteredModalKegiatan.map((opt) => (
                  <div
                    key={opt.kode}
                    onClick={() => handlePickFromModal(opt)}
                    className="p-2.5 rounded-xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                          {opt.kode}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {opt.standarSNP}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-950">
                        {opt.nama}
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        {opt.keteranganDefault} • Satuan default: <b>{opt.satuanDefault}</b>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-2.5 py-1 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 mt-1"
                    >
                      <span>Pilih</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Menampilkan {filteredModalKegiatan.length} kegiatan e-RKAM resmi
              </span>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

