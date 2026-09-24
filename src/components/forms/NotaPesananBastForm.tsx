import React, { useState } from 'react';
import { 
  BuktiPengeluaranItem, 
  ItemPesananBarang, 
  MadrasahProfile, 
  NotaPesananBastItem, 
  PejabatPenandatangan, 
  PeriodeLaporan 
} from '../../types/lpj';
import { formatRupiah } from '../../utils/numberToWords';
import { 
  generateAutoNotaPesananBast, 
  generateNotaPesananBastFromSelectedSpj,
  isBelanjaTokoAtauPenyedia,
  getNamaHariIndo, 
  DEFAULT_KODE_SATKER,
} from '../../utils/notaPesananBastGenerator';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Sparkles, 
  Store, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Building2, 
  Ban, 
  ShieldCheck,
  Edit3,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square,
  Check,
  Search,
  ArrowRight,
  Sliders,
  X
} from 'lucide-react';

interface NotaPesananBastFormProps {
  items: NotaPesananBastItem[];
  buktiPengeluaran: BuktiPengeluaranItem[];
  profile: MadrasahProfile;
  pejabat: PejabatPenandatangan;
  periode?: PeriodeLaporan;
  onChange: (items: NotaPesananBastItem[]) => void;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToSpj?: () => void;
}

export const NotaPesananBastForm: React.FC<NotaPesananBastFormProps> = ({
  items = [],
  buktiPengeluaran = [],
  profile,
  pejabat,
  periode,
  onChange,
  onToast,
  onNavigateToSpj,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'toko'>('toko');
  const [selectedSpjIds, setSelectedSpjIds] = useState<string[]>([]);
  const [forceOverwrite, setForceOverwrite] = useState<boolean>(false);
  const [customKodeSatker] = useState<string>(DEFAULT_KODE_SATKER);

  // Initialize selected IDs when modal opens
  const openImportModal = () => {
    // Default select qualifying receipts (or all if none qualify)
    const qualifying = buktiPengeluaran.filter(isBelanjaTokoAtauPenyedia);
    const initialSelection = (qualifying.length > 0 ? qualifying : buktiPengeluaran).map((b) => b.id);
    setSelectedSpjIds(initialSelection);
    setSearchQuery('');
    setFilterType(qualifying.length > 0 ? 'toko' : 'all');
    setIsImportModalOpen(true);
  };

  const handleSetTidakAda = () => {
    onChange([]);
    setExpandedId(null);
    if (onToast) onToast('Status Nota Pesanan & BAST disetel NIHIL (Tidak Ada)', 'info');
  };

  // Quick auto-generate all matching or available receipts
  const handleQuickAutoGenerate = (force: boolean = false) => {
    if (!buktiPengeluaran || buktiPengeluaran.length === 0) {
      if (onToast) {
        onToast('Belum ada data Kwitansi SPJ. Silakan input Bukti Pengeluaran di Menu IV terlebih dahulu.', 'error');
      }
      return;
    }

    const generated = generateAutoNotaPesananBast(
      buktiPengeluaran, 
      profile, 
      pejabat, 
      items, 
      periode,
      { kodeSatker: customKodeSatker },
      force
    );

    if (generated.length === 0) {
      if (onToast) {
        onToast('Tidak ditemukan kwitansi yang sesuai untuk diimpor. Silakan buka menu "Pilih Kwitansi".', 'error');
      }
      return;
    }

    onChange(generated);
    setExpandedId(generated[0].id);
    if (onToast) {
      onToast(`Berhasil menyinkronkan ${generated.length} data Nota Pesanan Toko & BAST dari Kwitansi SPJ!`, 'success');
    }
  };

  // Import selected receipts from modal
  const handleApplySelectedImport = () => {
    const selectedSpjItems = buktiPengeluaran.filter((b) => selectedSpjIds.includes(b.id));

    if (selectedSpjItems.length === 0) {
      if (onToast) onToast('Silakan pilih minimal satu Kwitansi SPJ untuk diimpor.', 'error');
      return;
    }

    const generated = generateNotaPesananBastFromSelectedSpj(
      selectedSpjItems,
      profile,
      pejabat,
      items,
      periode,
      { kodeSatker: customKodeSatker },
      forceOverwrite
    );

    onChange(generated);
    setIsImportModalOpen(false);
    if (generated.length > 0) {
      setExpandedId(generated[0].id);
    }
    if (onToast) {
      onToast(`Berhasil mengimpor ${generated.length} Nota Pesanan & BAST dari Kwitansi terpilih!`, 'success');
    }
  };

  const toggleSelectSpj = (id: string) => {
    if (selectedSpjIds.includes(id)) {
      setSelectedSpjIds(selectedSpjIds.filter((item) => item !== id));
    } else {
      setSelectedSpjIds([...selectedSpjIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedSpjIds(buktiPengeluaran.map((b) => b.id));
  };

  const handleDeselectAll = () => {
    setSelectedSpjIds([]);
  };

  const handleSelectTokoOnly = () => {
    const tokoOnly = buktiPengeluaran.filter(isBelanjaTokoAtauPenyedia).map((b) => b.id);
    setSelectedSpjIds(tokoOnly);
  };

  const handleAddManual = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const newItem: NotaPesananBastItem = {
      id: `npb-${Date.now()}`,
      noSuratPesanan: '',
      tanggalPesanan: dateStr,
      noBast: '',
      tanggalBast: dateStr,
      hariBast: getNamaHariIndo(dateStr),
      namaToko: 'Toko / Rekanan Baru',
      namaPenyedia: 'Pimpinan / Pemilik Toko',
      jabatanPenyedia: 'Pimpinan / Pemilik',
      alamatToko: `Jl. Poros ${profile.kecamatan || 'Kecamatan'}, Kab. ${profile.kabupaten || 'Jeneponto'}`,
      teleponToko: '0812-XXXX-XXXX',
      namaPemesan: pejabat.namaKepala || 'Kepala Madrasah',
      nipPemesan: pejabat.nipKepala || '-',
      jabatanPemesan: `Kepala ${profile.namaMadrasah || 'Madrasah'} / PPK`,
      keperluan: 'Pengadaan barang/jasa kebutuhan operasional madrasah',
      waktuPenyerahan: '3 (tiga) hari kalender setelah surat pesanan diterima',
      tempatPenyerahan: `Kantor ${profile.namaMadrasah || 'Madrasah'}`,
      keteranganPemeriksaan: 'Barang telah diperiksa secara fisik dan diterima dalam keadaan 100% lengkap dan baik.',
      totalNominal: 1000000,
      itemsBarang: [
        {
          id: `it-${Date.now()}-1`,
          namaBarang: 'Pengadaan ATK / Barang Operasional',
          spesifikasi: 'Standar operasional madrasah',
          volume: 1,
          satuan: 'Paket',
          hargaSatuan: 1000000,
          totalHarga: 1000000,
          kondisi: 'Baik',
        },
      ],
    };

    const updated = [...items, newItem];
    onChange(updated);
    setExpandedId(newItem.id);
    if (onToast) onToast('Nota Pesanan Toko baru berhasil ditambahkan.', 'info');
  };

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onChange(updated);
    if (expandedId === id) {
      setExpandedId(updated[0]?.id || null);
    }
    if (onToast) onToast('Item Nota Pesanan & BAST berhasil dihapus.', 'info');
  };

  const handleUpdate = <K extends keyof NotaPesananBastItem>(
    id: string,
    field: K,
    val: NotaPesananBastItem[K]
  ) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextItem = { ...item, [field]: val };
        // If tanggalBast changed, auto calculate hariBast
        if (field === 'tanggalBast' && typeof val === 'string') {
          nextItem.hariBast = getNamaHariIndo(val);
        }
        return nextItem;
      }
      return item;
    });
    onChange(updated);
  };

  // Sub-items barang management
  const handleAddItemBarang = (parentId: string) => {
    const updated = items.map((item) => {
      if (item.id === parentId) {
        const newItem: ItemPesananBarang = {
          id: `it-${Date.now()}`,
          namaBarang: 'Nama Barang Baru',
          spesifikasi: 'Merk / Spesifikasi',
          volume: 1,
          satuan: 'Buah',
          hargaSatuan: 100000,
          totalHarga: 100000,
          kondisi: 'Baik',
        };
        const newItems = [...item.itemsBarang, newItem];
        const newTotal = newItems.reduce((acc, curr) => acc + (Number(curr.totalHarga) || 0), 0);
        return {
          ...item,
          itemsBarang: newItems,
          totalNominal: newTotal,
        };
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemoveItemBarang = (parentId: string, itemId: string) => {
    const updated = items.map((item) => {
      if (item.id === parentId) {
        const newItems = item.itemsBarang.filter((i) => i.id !== itemId);
        const newTotal = newItems.reduce((acc, curr) => acc + (Number(curr.totalHarga) || 0), 0);
        return {
          ...item,
          itemsBarang: newItems,
          totalNominal: newTotal,
        };
      }
      return item;
    });
    onChange(updated);
  };

  const handleUpdateItemBarang = <K extends keyof ItemPesananBarang>(
    parentId: string,
    itemId: string,
    field: K,
    val: ItemPesananBarang[K]
  ) => {
    const updated = items.map((item) => {
      if (item.id === parentId) {
        const newItems = item.itemsBarang.map((i) => {
          if (i.id === itemId) {
            const next = { ...i, [field]: val };
            if (field === 'volume' || field === 'hargaSatuan') {
              const v = field === 'volume' ? Number(val) : Number(i.volume);
              const h = field === 'hargaSatuan' ? Number(val) : Number(i.hargaSatuan);
              next.totalHarga = (v || 0) * (h || 0);
            }
            return next;
          }
          return i;
        });
        const newTotal = newItems.reduce((acc, curr) => acc + (Number(curr.totalHarga) || 0), 0);
        return {
          ...item,
          itemsBarang: newItems,
          totalNominal: newTotal,
        };
      }
      return item;
    });
    onChange(updated);
  };

  // Filtered SPJ for modal
  const filteredModalSpj = buktiPengeluaran.filter((b) => {
    const matchesSearch = 
      b.noBukti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.penerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.uraian.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'toko') return isBelanjaTokoAtauPenyedia(b);
    return true;
  });

  const totalSelectedNominal = buktiPengeluaran
    .filter((b) => selectedSpjIds.includes(b.id))
    .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header Info & Action Toolbar */}
      <div className="p-3.5 bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border border-teal-200 rounded-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-teal-700 text-white rounded-lg mt-0.5 shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-teal-950">
                  Nota Pesanan Toko & Berita Acara (BAST)
                </h4>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-amber-700" />
                  <span>Input Nomor Surat Manual / Otomatis</span>
                </span>
              </div>
              <p className="text-[11px] text-teal-800 leading-tight mt-0.5">
                Surat Pesanan (SP) dan Berita Acara Serah Terima (BAST) dapat disinkronkan langsung dari Kwitansi SPJ atau diedit bebas sesuai kebutuhan madrasah.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Quick Sync Button */}
          <button
            type="button"
            onClick={() => handleQuickAutoGenerate(false)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
            title="Sinkronkan otomatis semua Kwitansi Belanja Barang Toko (SPJ)"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>⚡ Sinkron Otomatis dari Kwitansi SPJ</span>
          </button>

          {/* Open Import Selector Modal */}
          <button
            type="button"
            onClick={openImportModal}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-900 border border-teal-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Pilih spesifik kwitansi mana saja yang akan dibuatkan Surat Pesanan & BAST"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            <span>📋 Pilih Kwitansi untuk Diimpor ({buktiPengeluaran.length} Tersedia)</span>
          </button>

          {/* Add Manual */}
          <button
            type="button"
            onClick={handleAddManual}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>+ Tambah Manual</span>
          </button>

          {/* Set Status Nihil */}
          <button
            type="button"
            onClick={handleSetTidakAda}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              items.length === 0
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300'
            }`}
            title="Setel status Nota Pesanan & BAST menjadi Tidak Ada (Nihil)"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Setel Nihil (Tidak Ada)</span>
          </button>
        </div>
      </div>

      {/* Kwitansi Status Banner if empty */}
      {buktiPengeluaran.length === 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-bold">Perhatian: Data Kwitansi SPJ (Menu IV) masih kosong.</p>
            <p className="mt-0.5">
              Untuk menyinkronkan Nota Pesanan Toko secara otomatis, Anda disarankan menginput bukti pengeluaran terlebih dahulu di <b>Menu IV. Bukti Pengeluaran (Kwitansi)</b>.
            </p>
            {onNavigateToSpj && (
              <button
                type="button"
                onClick={onNavigateToSpj}
                className="mt-2 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Menu IV (Bukti Pengeluaran)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State / Status Nihil */}
      {items.length === 0 && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2.5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-emerald-950">
                  Status: NIHIL / Tidak Ada Surat Pesanan & BAST
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Tidak Ada Pengadaan Toko Khusus
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Madrasah tidak menerbitkan Surat Pesanan Toko maupun Berita Acara Serah Terima (BAST) untuk periode ini. Dokumen Nota Pesanan & BAST tidak akan disertakan pada buku LPJ.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-emerald-800">
              Ingin membuat data Nota Pesanan Toko & BAST dari data Kwitansi SPJ?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickAutoGenerate(true)}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded border border-emerald-300"
              >
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>⚡ Sinkron Otomatis ({buktiPengeluaran.length} Kwitansi)</span>
              </button>
              <button
                type="button"
                onClick={openImportModal}
                className="text-xs font-bold text-teal-900 hover:text-teal-950 underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded border border-teal-300"
              >
                <Sliders className="w-3 h-3 text-teal-700" />
                <span>Pilih Kwitansi Tertentu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accordion List of Nota Pesanan & BAST Items */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold">
            <span>Menampilkan {items.length} Nota Pesanan & BAST</span>
            <span>Total Nilai: <strong className="text-slate-800 font-bold">{formatRupiah(items.reduce((acc, curr) => acc + (curr.totalNominal || 0), 0))}</strong></span>
          </div>

          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const hasEmptyNumbers = !item.noSuratPesanan?.trim() || !item.noBast?.trim();

            return (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
              >
                {/* Header Accordion Item */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full px-3.5 py-2.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer border-b border-slate-200 select-none"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-[10px] font-black uppercase bg-teal-100 text-teal-900 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                      SP & BAST #{index + 1}
                    </span>
                    <div className="truncate text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.namaToko || 'Toko / Rekanan'}
                        </p>
                        {hasEmptyNumbers && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                            Perlu No. Surat
                          </span>
                        )}
                        {item.noBuktiSpj && (
                          <span className="text-[9px] bg-teal-50 text-teal-800 border border-teal-200 font-mono px-1.5 py-0.2 rounded shrink-0">
                            {item.noBuktiSpj}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        SP: <span className={item.noSuratPesanan ? 'text-teal-900 font-semibold' : 'text-amber-700 italic'}>{item.noSuratPesanan || '(Ketik Manual)'}</span> | BAST: <span className={item.noBast ? 'text-emerald-900 font-semibold' : 'text-amber-700 italic'}>{item.noBast || '(Ketik Manual)'}</span> • Nilai: {formatRupiah(item.totalNominal)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Form Content */}
                {isExpanded && (
                  <div className="p-3.5 space-y-3 bg-slate-50/50">
                    {/* Linked SPJ if any */}
                    {item.noBuktiSpj && (
                      <div className="flex items-center justify-between text-[11px] text-teal-800 bg-teal-50/80 px-2.5 py-1.5 rounded-md border border-teal-200 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>Terhubung ke Kuitansi SPJ: <b>{item.noBuktiSpj}</b> ({formatRupiah(item.totalNominal)})</span>
                        </div>
                        <span className="text-[10px] text-teal-700">Tersinkronisasi dengan Bukti Pengeluaran</span>
                      </div>
                    )}

                    {/* Section A: Nomor & Tanggal Surat Pesanan & BAST (Manual Input) */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>1. Penomoran Surat Pesanan (SP) & Berita Acara (BAST)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          ✍️ Input Manual Bebas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        {/* Nomor Surat Pesanan (SP) */}
                        <div className="sm:col-span-7">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              Nomor Surat Pesanan (SP) <span className="text-rose-600 font-normal">*manual</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            value={item.noSuratPesanan}
                            onChange={(e) => handleUpdate(item.id, 'noSuratPesanan', e.target.value)}
                            placeholder="Ketik nomor SP (misal: B.001/SP-BOS/MTs.21.07.03/II/2026)"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-teal-950 focus:border-teal-500 focus:bg-white outline-none"
                          />
                          <span className="text-[9px] text-slate-500 mt-0.5 block">
                            Nomor surat pesanan ke pihak toko/rekanan
                          </span>
                        </div>

                        {/* Tanggal Surat Pesanan */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                            Tanggal Surat Pesanan
                          </label>
                          <input
                            type="date"
                            value={item.tanggalPesanan}
                            onChange={(e) => handleUpdate(item.id, 'tanggalPesanan', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:border-teal-500 focus:bg-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 border-t border-slate-100">
                        {/* Nomor BAST */}
                        <div className="sm:col-span-7">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              Nomor Surat BAST <span className="text-rose-600 font-normal">*manual</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            value={item.noBast}
                            onChange={(e) => handleUpdate(item.id, 'noBast', e.target.value)}
                            placeholder="Ketik nomor BAST (misal: B.001/BAST-BOS/MTs.21.07.03/II/2026)"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-emerald-950 focus:border-teal-500 focus:bg-white outline-none"
                          />
                          <span className="text-[9px] text-slate-500 mt-0.5 block">
                            Nomor Berita Acara Serah Terima barang
                          </span>
                        </div>

                        {/* Tanggal BAST */}
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                            Tanggal BAST
                          </label>
                          <input
                            type="date"
                            value={item.tanggalBast}
                            onChange={(e) => handleUpdate(item.id, 'tanggalBast', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:border-teal-500 focus:bg-white outline-none"
                          />
                        </div>

                        {/* Hari BAST */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                            Hari
                          </label>
                          <input
                            type="text"
                            value={item.hariBast || 'Senin'}
                            onChange={(e) => handleUpdate(item.id, 'hariBast', e.target.value)}
                            placeholder="Senin"
                            className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-800 focus:border-teal-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section B: Data Pihak Pertama (Penyedia / Toko) & Pihak Kedua (Pemesan / PPK) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Pihak Penyedia / Toko */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1">
                          <Store className="w-3.5 h-3.5 text-teal-600" />
                          <span>2. Data Toko / Rekanan (Pihak Pertama)</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Nama Toko / Perusahaan
                          </label>
                          <input
                            type="text"
                            value={item.namaToko}
                            onChange={(e) => handleUpdate(item.id, 'namaToko', e.target.value)}
                            placeholder="Contoh: Toko Madani Stationery"
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              Nama Pimpinan Toko
                            </label>
                            <input
                              type="text"
                              value={item.namaPenyedia}
                              onChange={(e) => handleUpdate(item.id, 'namaPenyedia', e.target.value)}
                              placeholder="Nama Pemilik Toko"
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              Jabatan Penyedia
                            </label>
                            <input
                              type="text"
                              value={item.jabatanPenyedia || 'Pimpinan / Pemilik'}
                              onChange={(e) => handleUpdate(item.id, 'jabatanPenyedia', e.target.value)}
                              placeholder="Pimpinan / Pemilik"
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Alamat Toko
                          </label>
                          <input
                            type="text"
                            value={item.alamatToko}
                            onChange={(e) => handleUpdate(item.id, 'alamatToko', e.target.value)}
                            placeholder="Alamat lengkap toko / rekanan"
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Nomor Telepon Toko
                          </label>
                          <input
                            type="text"
                            value={item.teleponToko || ''}
                            onChange={(e) => handleUpdate(item.id, 'teleponToko', e.target.value)}
                            placeholder="0812-XXXX-XXXX"
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Pihak Pemesan / Madrasah */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>3. Pejabat Pemesan / Madrasah (Pihak Kedua)</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Nama Pejabat Pemesan (Kepala Madrasah)
                          </label>
                          <input
                            type="text"
                            value={item.namaPemesan || pejabat.namaKepala}
                            onChange={(e) => handleUpdate(item.id, 'namaPemesan', e.target.value)}
                            placeholder="Nama Kepala Madrasah"
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              NIP Pemesan
                            </label>
                            <input
                              type="text"
                              value={item.nipPemesan || pejabat.nipKepala || '-'}
                              onChange={(e) => handleUpdate(item.id, 'nipPemesan', e.target.value)}
                              placeholder="NIP Kepala Madrasah"
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">
                              Jabatan Pemesan
                            </label>
                            <input
                              type="text"
                              value={item.jabatanPemesan || `Kepala ${profile.namaMadrasah || 'Madrasah'} / PPK`}
                              onChange={(e) => handleUpdate(item.id, 'jabatanPemesan', e.target.value)}
                              placeholder="Kepala Madrasah / PPK"
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Waktu & Ketentuan Penyerahan
                          </label>
                          <input
                            type="text"
                            value={item.waktuPenyerahan || '3 (tiga) hari kalender setelah surat pesanan diterima'}
                            onChange={(e) => handleUpdate(item.id, 'waktuPenyerahan', e.target.value)}
                            placeholder="3 hari kalender setelah pesanan"
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase">
                            Tempat Penyerahan Barang
                          </label>
                          <input
                            type="text"
                            value={item.tempatPenyerahan || `Kantor ${profile.namaMadrasah}`}
                            onChange={(e) => handleUpdate(item.id, 'tempatPenyerahan', e.target.value)}
                            placeholder={`Kantor ${profile.namaMadrasah}`}
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section C: Daftar Rincian Barang Pesanan & BAST */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Package className="w-3.5 h-3.5 text-teal-600" />
                          <span>4. Rincian Barang yang Dipesan & Diserahterimakan</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddItemBarang(item.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-teal-700" />
                          <span>Tambah Baris Barang</span>
                        </button>
                      </div>

                      {/* Sub-items Table / Cards */}
                      <div className="space-y-2">
                        {item.itemsBarang.map((b, bIdx) => (
                          <div
                            key={b.id}
                            className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700 text-[10px] uppercase">
                                Item #{bIdx + 1}
                              </span>
                              {item.itemsBarang.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemBarang(item.id, b.id)}
                                  className="text-rose-600 hover:text-rose-800 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Hapus</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <div className="sm:col-span-7">
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Nama Barang / Pekerjaan
                                </label>
                                <input
                                  type="text"
                                  value={b.namaBarang}
                                  onChange={(e) =>
                                    handleUpdateItemBarang(item.id, b.id, 'namaBarang', e.target.value)
                                  }
                                  placeholder="Nama barang..."
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500 font-semibold"
                                />
                              </div>

                              <div className="sm:col-span-5">
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Spesifikasi / Merk
                                </label>
                                <input
                                  type="text"
                                  value={b.spesifikasi || ''}
                                  onChange={(e) =>
                                    handleUpdateItemBarang(item.id, b.id, 'spesifikasi', e.target.value)
                                  }
                                  placeholder="Merk, tipe, ukuran, dll."
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Volume / Jumlah
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={b.volume}
                                  onChange={(e) =>
                                    handleUpdateItemBarang(
                                      item.id,
                                      b.id,
                                      'volume',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Satuan
                                </label>
                                <input
                                  type="text"
                                  value={b.satuan}
                                  onChange={(e) =>
                                    handleUpdateItemBarang(item.id, b.id, 'satuan', e.target.value)
                                  }
                                  placeholder="Rim / Buah / Paket"
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Harga Satuan (Rp)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  value={b.hargaSatuan}
                                  onChange={(e) =>
                                    handleUpdateItemBarang(
                                      item.id,
                                      b.id,
                                      'hargaSatuan',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:border-teal-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-600 uppercase">
                                  Total Harga
                                </label>
                                <div className="w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-teal-900 truncate">
                                  {formatRupiah(b.totalHarga)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal Footer */}
                      <div className="p-2.5 bg-teal-50/70 rounded-lg border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-teal-950 uppercase">
                          Total Nilai Pesanan & BAST:
                        </span>
                        <span className="text-sm font-black text-teal-900">
                          {formatRupiah(item.totalNominal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL / DIALOG PEMILIH KWITANSI SPJ INTERAKTIF */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 to-emerald-900 text-white flex items-start justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sliders className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black leading-tight">
                    Impor & Sinkronkan Kwitansi SPJ ke Nota Pesanan & BAST
                  </h3>
                  <p className="text-xs text-teal-200 mt-0.5">
                    Pilih kwitansi belanja barang/toko yang akan dibuatkan Surat Pesanan (SP) dan Berita Acara (BAST)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Filter & Selection Toolbar */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nomor kwitansi, nama toko, atau uraian belanja..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-teal-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setFilterType('toko')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      filterType === 'toko'
                        ? 'bg-white text-teal-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hanya Belanja Toko / Barang
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-white text-teal-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua Kwitansi ({buktiPengeluaran.length})
                  </button>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Pilih Semua ({buktiPengeluaran.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectTokoOnly}
                    className="px-2 py-0.5 bg-teal-50 border border-teal-300 hover:bg-teal-100 rounded text-[11px] font-semibold text-teal-900 cursor-pointer"
                  >
                    Pilih Belanja Toko Saja
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Batal Pilih
                  </button>
                </div>

                <div className="text-[11px] font-bold text-teal-950">
                  Terpilih: <span className="text-teal-700">{selectedSpjIds.length} kwitansi</span> • Total: <span className="text-emerald-700">{formatRupiah(totalSelectedNominal)}</span>
                </div>
              </div>
            </div>

            {/* Modal Body: Kwitansi List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2 divide-y divide-slate-100">
              {filteredModalSpj.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">Tidak ada kwitansi yang cocok dengan filter pencarian.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="text-xs text-teal-700 font-bold underline cursor-pointer"
                  >
                    Tampilkan Semua Kwitansi
                  </button>
                </div>
              ) : (
                filteredModalSpj.map((spj, idx) => {
                  const isChecked = selectedSpjIds.includes(spj.id);
                  const isToko = isBelanjaTokoAtauPenyedia(spj);

                  return (
                    <div
                      key={spj.id}
                      onClick={() => toggleSelectSpj(spj.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer border flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-teal-50/70 border-teal-300 shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-teal-700 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-slate-900">
                              {spj.noBukti || `Kwitansi #${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {spj.tanggal}
                            </span>
                            {isToko ? (
                              <span className="text-[9px] font-bold bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded border border-teal-200">
                                Rekomendasi Toko
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                Non-Barang
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-xs text-emerald-950 font-mono">
                            {formatRupiah(spj.nominal)}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 truncate">
                          Penerima: {spj.penerima || 'Toko / Rekanan'}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {spj.uraian}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={forceOverwrite}
                  onChange={(e) => setForceOverwrite(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Perbarui dan buat ulang rincian barang dari nominal kwitansi</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplySelectedImport}
                  disabled={selectedSpjIds.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Impor {selectedSpjIds.length} Kwitansi Terpilih</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
