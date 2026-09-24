import React, { useState } from 'react';
import { SumberDanaItem } from '../../types/lpj';
import {
  Wallet,
  Plus,
  Trash2,
  ArrowDownLeft,
  DollarSign,
  Sparkles,
  CheckCheck,
  Building,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatRupiah } from '../../utils/numberToWords';

interface SumberDanaFormProps {
  items: SumberDanaItem[];
  onChange: (items: SumberDanaItem[]) => void;
}

const SUMBER_DANA_PRESETS = [
  'BOS Reguler Madrasah Tahap I',
  'BOS Reguler Madrasah Tahap II',
  'BOS Afirmasi Kemenag',
  'BOS Kinerja Kemenag',
  'Bantuan Operasional Pendidikan (BOP)',
  'Dana Sumbangan Komite Madrasah / Yayasan',
  'Bantuan Khusus Madrasah (BKM)',
];

export const SumberDanaForm: React.FC<SumberDanaFormProps> = ({ items = [], onChange }) => {
  const [autoSyncPagu, setAutoSyncPagu] = useState<boolean>(true);

  // Tambah Sumber Dana Baru
  const handleAdd = () => {
    const newItem: SumberDanaItem = {
      id: `sd-${Date.now()}`,
      namaSumber: 'BOS Reguler Madrasah Tahap II',
      alokasiPagu: 75000000,
      diterima: 75000000,
      tanggalTerima: new Date().toISOString().split('T')[0],
      noRekening: '0451-01-002345-50-8 (Bank Syariah Indonesia)',
      keterangan: 'Pencairan dana BOS Kemenag',
    };
    onChange([...items, newItem]);
  };

  // Update Field dengan Dukungan Auto-Sync Pagu & Diterima
  const handleUpdate = (id: string, field: keyof SumberDanaItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;

      // Jika mengubah 'alokasiPagu'
      if (field === 'alokasiPagu') {
        const numVal = Number(value) || 0;
        if (autoSyncPagu) {
          return {
            ...item,
            alokasiPagu: numVal,
            diterima: numVal, // Otomatis disamakan jika auto-sync aktif
          };
        }
        return { ...item, alokasiPagu: numVal };
      }

      // Jika mengubah 'diterima'
      if (field === 'diterima') {
        const numVal = Number(value) || 0;
        if (autoSyncPagu) {
          return {
            ...item,
            diterima: numVal,
            alokasiPagu: numVal, // Otomatis disamakan jika auto-sync aktif
          };
        }
        return { ...item, diterima: numVal };
      }

      return { ...item, [field]: value };
    });
    onChange(updated);
  };

  // Samakan semua Pagu dan Diterima (100% Pencairan)
  const handleSyncAll = () => {
    const updated = items.map((item) => {
      const val = item.alokasiPagu || item.diterima || 0;
      return {
        ...item,
        alokasiPagu: val,
        diterima: val,
      };
    });
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const totalPagu = items.reduce((acc, curr) => acc + (Number(curr.alokasiPagu || curr.diterima) || 0), 0);
  const totalDiterima = items.reduce((acc, curr) => acc + (Number(curr.diterima) || 0), 0);
  const persenDiterima = totalPagu > 0 ? ((totalDiterima / totalPagu) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-4">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">3. Laporan Penggunaan Dana per Sumber (FORM BOS K-1)</h4>
            <p className="text-xs text-slate-500">Pagu alokasi RKAM dan rincian penerimaan dana BOS madrasah</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Sumber Dana</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Auto-Sync Pagu & Diterima */}
      <div className="p-3 bg-gradient-to-r from-emerald-50/90 to-teal-50/80 border border-emerald-200 rounded-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Auto-Sync Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoSyncPagu(!autoSyncPagu)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoSyncPagu ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={autoSyncPagu}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  autoSyncPagu ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>Otomatisasi Pagu Anggaran = Dana Diterima (100%)</span>
                {autoSyncPagu && (
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold">
                    Aktif
                  </span>
                )}
              </span>
              <p className="text-[10px] text-slate-600">
                Mengisi Pagu Alokasi otomatis mengisi Dana Diterima pada FORM BOS K-1
              </p>
            </div>
          </div>

          {/* Quick Button */}
          <button
            type="button"
            onClick={handleSyncAll}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs self-end sm:self-auto"
            title="Samakan semua nilai Pagu dengan Dana Diterima"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Samakan Semua Pagu (100%)</span>
          </button>
        </div>

        {/* Summary Metric */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Pagu Anggaran:</span>
            <span className="text-sm font-black text-slate-900">{formatRupiah(totalPagu)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-900 uppercase block">
              Total Dana Diterima ({persenDiterima}%):
            </span>
            <span className="text-sm font-black text-emerald-700">{formatRupiah(totalDiterima)}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end">
            <span className="text-[11px] text-emerald-950 font-semibold bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
              {items.length} Sumber Penerimaan
            </span>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group transition-all hover:border-emerald-300 shadow-2xs"
          >
            {/* Header Item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Sumber #{index + 1}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {formatRupiah(item.diterima)}
                </span>
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  title="Hapus Sumber"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Nama Sumber Dana & Pilihan Cepat */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Nama Sumber Dana BOS
                </label>
                <span className="text-[10px] text-slate-500 italic">Pilihan Cepat:</span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  value={item.namaSumber}
                  onChange={(e) => handleUpdate(item.id, 'namaSumber', e.target.value)}
                  placeholder="Contoh: BOS Reguler Madrasah Tahap I"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:border-emerald-500 outline-none"
                />

                {/* Preset Chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10.5px]">
                  {SUMBER_DANA_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleUpdate(item.id, 'namaSumber', preset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 cursor-pointer transition-colors ${
                        item.namaSumber === preset
                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagu Anggaran (Alokasi) vs Jumlah Dana Diterima */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/80">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Pagu Alokasi Anggaran (Rp)
                  </label>
                  {autoSyncPagu && (
                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      ⚡ Otomatis
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  value={item.alokasiPagu ?? item.diterima}
                  onChange={(e) => handleUpdate(item.id, 'alokasiPagu', e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                  {formatRupiah(item.alokasiPagu ?? item.diterima)}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11px] font-bold text-emerald-900 uppercase">
                    Jumlah Dana Diterima (Rp)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleUpdate(item.id, 'diterima', item.alokasiPagu ?? item.diterima)}
                    className="text-[9px] text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
                    title="Samakan penerimaan dengan pagu alokasi"
                  >
                    Samakan Pagu
                  </button>
                </div>
                <input
                  type="number"
                  value={item.diterima}
                  onChange={(e) => handleUpdate(item.id, 'diterima', e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-700 focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-emerald-700 font-sans block mt-0.5">
                  {formatRupiah(item.diterima)}
                </span>
              </div>
            </div>

            {/* Tanggal & Rekening */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Tanggal Masuk / Cair
                </label>
                <input
                  type="date"
                  value={item.tanggalTerima}
                  onChange={(e) => handleUpdate(item.id, 'tanggalTerima', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-emerald-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Rekening / Bank Penampung
                </label>
                <input
                  type="text"
                  value={item.noRekening}
                  onChange={(e) => handleUpdate(item.id, 'noRekening', e.target.value)}
                  placeholder="Contoh: 0451-01-002345-50-8 (BSI)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Keterangan / Rincian Penyaluran
              </label>
              <input
                type="text"
                value={item.keterangan}
                onChange={(e) => handleUpdate(item.id, 'keterangan', e.target.value)}
                placeholder="Contoh: Pencairan BOS Kemenag Tahap 1 untuk 78 Siswa"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
