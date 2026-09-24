import React from 'react';
import { KemenagLogo } from './KemenagLogo';
import { 
  Save, 
  History, 
  Sparkles, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  FileText,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';

interface HeaderProps {
  guruName: string;
  historyCount: number;
  onGoDashboard?: () => void;
  onSaveDraft: () => void;
  onOpenHistory: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  guruName,
  historyCount,
  onGoDashboard,
  onSaveDraft,
  onOpenHistory,
  onLoadSample,
  onReset,
  onLogout,
}) => {
  return (
    <header className="no-print bg-white/90 backdrop-blur-xl border-b border-amber-200/70 sticky top-0 z-30 shadow-xs shadow-amber-900/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Branding */}
        <div 
          onClick={onGoDashboard}
          className={`flex items-center gap-3 ${onGoDashboard ? 'cursor-pointer group select-none' : ''}`}
          title={onGoDashboard ? "Kembali ke Dashboard Utama" : undefined}
        >
          <div className="p-1.5 bg-gradient-to-br from-amber-50 to-emerald-50 group-hover:from-amber-100 group-hover:to-emerald-100 rounded-2xl border border-amber-300/60 shadow-xs transition-all duration-200">
            <KemenagLogo size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-800 tracking-tight transition-colors">
                Generator LPJ BOS Madrasah
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-black bg-gradient-to-r from-amber-100 to-emerald-100 text-amber-900 rounded-full border border-amber-300/80">
                Kemenag RI
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Sistem Otomasi Laporan Keuangan Madrasah Sesuai Juknis BOS 2026
            </p>
          </div>
        </div>

        {/* Right Action Tools & User Profile */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Dashboard Button */}
          {onGoDashboard && (
            <button
              type="button"
              onClick={onGoDashboard}
              className="px-3 py-1.5 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-2xs"
              title="Ke Dashboard Ringkasan"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline font-black">Dashboard</span>
            </button>
          )}

          {/* Load Sample Button */}
          <button
            type="button"
            onClick={onLoadSample}
            className="px-3 py-1.5 bg-sky-50/90 hover:bg-sky-100 text-sky-900 border border-sky-200/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-2xs"
            title="Muat Data Contoh BOS Madrasah"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span className="hidden md:inline font-bold">Data Contoh</span>
          </button>

          {/* Simpan Draf Button */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all duration-150 cursor-pointer"
            title="Simpan Draf Laporan"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>

          {/* Riwayat Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer relative shadow-2xs"
            title="Lihat Riwayat Laporan Tersimpan"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Riwayat</span>
            {historyCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-xs">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Kosongkan / Reset Formulir"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Badge & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 truncate max-w-[130px]">{guruName}</span>
                <span className="text-[9.5px] text-emerald-700 font-bold uppercase tracking-wider">Bendahara BOS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
