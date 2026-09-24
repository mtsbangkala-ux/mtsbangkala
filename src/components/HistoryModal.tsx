import React, { useState } from 'react';
import { LPJFullData } from '../types/lpj';
import { formatRupiah, formatDateIndo } from '../utils/numberToWords';
import {
  History,
  X,
  Trash2,
  FolderOpen,
  Copy,
  Calendar,
  School,
  Search,
  Download,
  Upload,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';

export interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList?: LPJFullData[];
  savedList?: LPJFullData[];
  onSelectHistory?: (item: LPJFullData) => void;
  onLoad?: (item: LPJFullData) => void;
  onDeleteHistory?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (item: LPJFullData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  savedList,
  onSelectHistory,
  onLoad,
  onDeleteHistory,
  onDelete,
  onDuplicate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Resolve array safely with fallback
  const rawList: LPJFullData[] = Array.isArray(historyList)
    ? historyList
    : Array.isArray(savedList)
    ? savedList
    : [];

  const handleSelect = (item: LPJFullData) => {
    if (onSelectHistory) {
      onSelectHistory(item);
    } else if (onLoad) {
      onLoad(item);
    }
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus berkas LPJ ini dari riwayat?')) {
      if (onDeleteHistory) {
        onDeleteHistory(id);
      } else if (onDelete) {
        onDelete(id);
      }
    }
  };

  const handleDuplicate = (item: LPJFullData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(item);
    }
  };

  // Filter list by search query
  const filteredList = rawList.filter((item) => {
    if (!item) return false;
    const name = item.profile?.namaMadrasah?.toLowerCase() || '';
    const nsm = item.profile?.nsm?.toLowerCase() || '';
    const year = item.periode?.tahunAnggaran?.toString() || '';
    const tahap = item.periode?.tahap?.toLowerCase() || '';
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return name.includes(q) || nsm.includes(q) || year.includes(q) || tahap.includes(q);
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg ring-2 ring-emerald-400/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Riwayat & Arsip LPJ BOS</h3>
                <span className="text-[10px] font-bold bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  {rawList.length} Berkas
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pilih draf atau berkas LPJ yang pernah Anda simpan untuk dibuka kembali
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title="Tutup Modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        {rawList.length > 0 && (
          <div className="px-5 sm:px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama madrasah, NSM, tahun anggaran, atau tahap..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-1 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {rawList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                <History className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Belum Ada Riwayat LPJ Tersimpan</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Saat Anda mengisi formulir dan menekan tombol <b>"Simpan Draf"</b> di bagian atas, berkas laporan Anda akan otomatis diarsipkan di sini.
                </p>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Tidak ada riwayat yang cocok dengan "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Hapus pencarian
              </button>
            </div>
          ) : (
            filteredList.map((item, idx) => {
              const totalPenerimaan = Array.isArray(item.sumberDana)
                ? item.sumberDana.reduce((a, c) => a + (Number(c?.diterima) || 0), 0)
                : 0;
              const totalPengeluaran = Array.isArray(item.buktiPengeluaran)
                ? item.buktiPengeluaran.reduce((a, c) => a + (Number(c?.nominal) || 0), 0)
                : 0;
              const namaMadrasah = item.profile?.namaMadrasah || 'Madrasah Belum Bernama';
              const tahap = item.periode?.tahap || 'Tahap I';
              const tahun = item.periode?.tahunAnggaran || new Date().getFullYear();
              const dateStr = item.updatedAt || item.createdAt || new Date().toISOString();

              return (
                <div
                  key={item.id || `hist-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                        <School className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                        {namaMadrasah}
                      </h4>
                      <span className="text-[10.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                        {tahap}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Tahun Anggaran: <b className="text-slate-800">{tahun}</b></span>
                      <span>Total BOS: <b className="text-emerald-700">{formatRupiah(totalPenerimaan)}</b></span>
                      <span>Realisasi SPJ: <b className="text-slate-800">{formatRupiah(totalPengeluaran)}</b></span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDateIndo(dateStr)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                      title="Buka dan sunting laporan ini"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Buka</span>
                    </button>

                    {onDuplicate && (
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(item, e)}
                        className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
                        title="Duplikasi laporan ini"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
                      title="Hapus berkas dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">
            Menampilkan {filteredList.length} dari {rawList.length} berkas tersimpan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

