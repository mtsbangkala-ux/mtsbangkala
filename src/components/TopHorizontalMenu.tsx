import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  Target,
  Receipt,
  Landmark,
  ShoppingBag,
  Image as ImageIcon,
  FileBadge2,
  Sparkles,
  ChevronDown,
  Building2,
  Calendar,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { PageMenuId } from './NavigationMenu';
import { LPJFullData } from '../types/lpj';

interface TopHorizontalMenuProps {
  activePage: PageMenuId;
  onSelectPage: (pageId: PageMenuId) => void;
  data: LPJFullData;
  totalPenerimaan: number;
  totalPengeluaran: number;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isCompact?: boolean;
  onToggleCompact?: () => void;
}

export interface TopMenuItem {
  roman: string;
  id: PageMenuId;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { id: PageMenuId; title: string; icon: React.ComponentType<{ className?: string }> }[];
  inactiveClass: string;
  activeClass: string;
  romanInactiveClass: string;
  romanActiveClass: string;
  iconColor: string;
}

export const TopHorizontalMenu: React.FC<TopHorizontalMenuProps> = ({
  activePage,
  onSelectPage,
  data,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems: TopMenuItem[] = [
    {
      roman: 'I',
      id: 'dashboard',
      title: 'Dashboard',
      shortTitle: 'I. Dashboard',
      subtitle: 'Identitas & Periode',
      icon: LayoutDashboard,
      inactiveClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border-emerald-200/80',
      activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20 ring-1 ring-emerald-400/50',
      romanInactiveClass: 'bg-emerald-200/80 text-emerald-950 font-black',
      romanActiveClass: 'bg-black/20 text-emerald-100 font-black',
      iconColor: 'text-emerald-700',
      subItems: [
        { id: 'dashboard', title: 'Ringkasan & Status', icon: LayoutDashboard },
        { id: 'profile', title: 'Identitas Madrasah & Sampul', icon: Building2 },
        { id: 'periode', title: 'Tahun Anggaran & Periode', icon: Calendar },
      ],
    },
    {
      roman: 'II',
      id: 'sumber',
      title: 'Sumber Dana',
      shortTitle: 'II. Sumber Dana',
      subtitle: 'Form K-1',
      icon: Wallet,
      inactiveClass: 'bg-green-50/70 hover:bg-green-100/80 text-green-900 border-green-200/80',
      activeClass: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-md shadow-green-700/20 ring-1 ring-green-400/50',
      romanInactiveClass: 'bg-green-200/80 text-green-950 font-black',
      romanActiveClass: 'bg-black/20 text-green-100 font-black',
      iconColor: 'text-green-700',
    },
    {
      roman: 'III',
      id: 'realisasi',
      title: 'Realisasi SNP',
      shortTitle: 'III. Realisasi RKAM',
      subtitle: '8 Standar SNP',
      icon: Target,
      inactiveClass: 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 border-purple-200/80',
      activeClass: 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white border-purple-600 shadow-md shadow-purple-700/20 ring-1 ring-purple-400/50',
      romanInactiveClass: 'bg-purple-200/80 text-purple-950 font-black',
      romanActiveClass: 'bg-black/20 text-purple-100 font-black',
      iconColor: 'text-purple-700',
    },
    {
      roman: 'IV',
      id: 'bukti',
      title: 'Bukti SPJ',
      shortTitle: 'IV. SPJ & Kwitansi',
      subtitle: 'Form K-3 / SPJ',
      icon: Receipt,
      inactiveClass: 'bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 border-amber-200/80',
      activeClass: 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 text-white border-amber-600 shadow-md shadow-orange-700/20 ring-1 ring-amber-400/50',
      romanInactiveClass: 'bg-amber-200/80 text-amber-950 font-black',
      romanActiveClass: 'bg-black/20 text-amber-100 font-black',
      iconColor: 'text-amber-700',
    },
    {
      roman: 'V',
      id: 'pajak',
      title: 'Rekap Pajak',
      shortTitle: 'V. Rekap Pajak',
      subtitle: 'PPh & PPN (K-6)',
      icon: Landmark,
      inactiveClass: 'bg-rose-50/70 hover:bg-rose-100/80 text-rose-900 border-rose-200/80',
      activeClass: 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-600 shadow-md shadow-rose-700/20 ring-1 ring-rose-400/50',
      romanInactiveClass: 'bg-rose-200/80 text-rose-950 font-black',
      romanActiveClass: 'bg-black/20 text-rose-100 font-black',
      iconColor: 'text-rose-700',
    },
    {
      roman: 'VI',
      id: 'pesanan',
      title: 'Nota & BAST',
      shortTitle: 'VI. Pesanan & BAST',
      subtitle: 'Surat Pesanan',
      icon: ShoppingBag,
      inactiveClass: 'bg-teal-50/70 hover:bg-teal-100/80 text-teal-900 border-teal-200/80',
      activeClass: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-md shadow-teal-700/20 ring-1 ring-teal-400/50',
      romanInactiveClass: 'bg-teal-200/80 text-teal-950 font-black',
      romanActiveClass: 'bg-black/20 text-teal-100 font-black',
      iconColor: 'text-teal-700',
    },
    {
      roman: 'VII',
      id: 'dokumentasi',
      title: 'Foto Kegiatan',
      shortTitle: 'VII. Dokumentasi Foto',
      subtitle: 'Lampiran LPJ',
      icon: ImageIcon,
      inactiveClass: 'bg-fuchsia-50/70 hover:bg-fuchsia-100/80 text-fuchsia-900 border-fuchsia-200/80',
      activeClass: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-fuchsia-600 shadow-md shadow-fuchsia-700/20 ring-1 ring-fuchsia-400/50',
      romanInactiveClass: 'bg-fuchsia-200/80 text-fuchsia-950 font-black',
      romanActiveClass: 'bg-black/20 text-fuchsia-100 font-black',
      iconColor: 'text-fuchsia-700',
    },
    {
      roman: 'VIII',
      id: 'sptjb',
      title: 'SPTJB',
      shortTitle: 'VIII. SPTJB & Pejabat',
      subtitle: 'Legalitas & TTD',
      icon: FileBadge2,
      inactiveClass: 'bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-900 border-indigo-200/80',
      activeClass: 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white border-indigo-600 shadow-md shadow-indigo-700/20 ring-1 ring-indigo-400/50',
      romanInactiveClass: 'bg-indigo-200/80 text-indigo-950 font-black',
      romanActiveClass: 'bg-black/20 text-indigo-100 font-black',
      iconColor: 'text-indigo-700',
    },
    {
      roman: 'IX',
      id: 'preview',
      title: 'Generate LPJ',
      shortTitle: 'IX. Unduh LPJ',
      subtitle: 'Output PDF & Word',
      icon: Sparkles,
      inactiveClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 border-amber-300 font-black',
      activeClass: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-emerald-600 text-white border-amber-500 shadow-md shadow-amber-900/30 ring-1 ring-amber-400/50',
      romanInactiveClass: 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-black shadow-2xs',
      romanActiveClass: 'bg-black/30 text-amber-200 font-black',
      iconColor: 'text-amber-800',
    },
  ];

  const isDashboardActive = ['dashboard', 'profile', 'periode'].includes(activePage);

  // Active step index
  const activeIdx = menuItems.findIndex((m) =>
    m.id === 'dashboard' ? isDashboardActive : m.id === activePage
  );
  const activeStepNum = activeIdx >= 0 ? activeIdx + 1 : 1;
  const progressPercent = Math.round((activeStepNum / menuItems.length) * 100);

  return (
    <div className="no-print w-full bg-white/90 backdrop-blur-xl border-b border-amber-200/70 sticky top-[57px] z-20 shadow-xs shadow-amber-900/5">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-2">
        {/* Toggle Sidebar Button with Modern UX */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border shrink-0 cursor-pointer ${
              isSidebarOpen
                ? 'bg-slate-100/90 hover:bg-slate-200 text-slate-700 border-slate-200/90 shadow-xs'
                : 'bg-gradient-to-r from-slate-900 to-slate-800 text-emerald-300 border-slate-700 shadow-sm hover:from-slate-850 hover:to-slate-750'
            }`}
            title={isSidebarOpen ? 'Sembunyikan Menu Samping (Layar Kerja Luas)' : 'Tampilkan Menu Samping'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold">Tutup Menu</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">Buka Menu</span>
              </>
            )}
          </button>
        )}

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-6 bg-slate-200 shrink-0" />

        {/* Horizontal Scrollable Menu Tabs */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 scrollbar-none"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isMenuDashboard = item.id === 'dashboard';
            const isActive = isMenuDashboard ? isDashboardActive : activePage === item.id;
            const isGenerate = item.id === 'preview';

            // Menu I (Dashboard) with sub-items
            if (isMenuDashboard) {
              return (
                <div key={item.id} className="relative shrink-0 flex items-center" ref={dropdownRef}>
                  <div
                    className={`flex items-center rounded-xl transition-all duration-200 border ${
                      isActive ? item.activeClass : item.inactiveClass
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPage('dashboard');
                        setDropdownOpen(false);
                      }}
                      className="px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap cursor-pointer"
                      title="Menu I: Dashboard (Identitas & Periode)"
                    >
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                          isActive ? item.romanActiveClass : item.romanInactiveClass
                        }`}
                      >
                        {item.roman}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${!isActive ? item.iconColor : ''}`} />
                      <span className="font-extrabold">{item.title}</span>
                    </button>

                    {/* Dropdown Toggle for Sub-pages */}
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className={`px-1.5 py-1.5 border-l transition-colors cursor-pointer rounded-r-xl ${
                        isActive
                          ? 'border-emerald-500/50 hover:bg-emerald-700/60 text-emerald-100'
                          : 'border-emerald-200/80 hover:bg-emerald-200/60 text-emerald-800'
                      }`}
                      title="Pilihan Sub-menu: Identitas Madrasah & Periode"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dropdown Menu for Dashboard Sub-pages */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md">
                      <div className="px-3 py-1.5 mb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Sub-Menu Dashboard (Menu I):
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPage('dashboard');
                          setDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          activePage === 'dashboard'
                            ? 'bg-emerald-50 text-emerald-900 font-black ring-1 ring-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                            <LayoutDashboard className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-extrabold">Ringkasan & KPI</div>
                            <div className="text-[10.5px] text-slate-400 font-normal">Status Penganggaran & Realisasi</div>
                          </div>
                        </div>
                        {activePage === 'dashboard' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectPage('profile');
                          setDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          activePage === 'profile'
                            ? 'bg-blue-50 text-blue-900 font-black ring-1 ring-blue-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="font-extrabold">Identitas & Sampul LPJ</div>
                            <div className="text-[10.5px] text-slate-400 font-normal truncate">
                              {data.profile.namaMadrasah || 'Belum diisi'}
                            </div>
                          </div>
                        </div>
                        {activePage === 'profile' && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectPage('periode');
                          setDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          activePage === 'periode'
                            ? 'bg-sky-50 text-sky-900 font-black ring-1 ring-sky-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="font-extrabold">Tahun Anggaran & Periode</div>
                            <div className="text-[10.5px] text-slate-400 font-normal truncate">
                              Tahun {data.periode.tahunAnggaran} • {data.periode.tahap}
                            </div>
                          </div>
                        </div>
                        {activePage === 'periode' && (
                          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            // Normal Menu Items (II - IX) with distinct colorful theme
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPage(item.id)}
                className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isActive ? item.activeClass : item.inactiveClass
                }`}
                title={`${item.shortTitle} - ${item.subtitle}`}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? item.romanActiveClass : item.romanInactiveClass
                  }`}
                >
                  {item.roman}
                </span>
                <Icon className={`w-3.5 h-3.5 ${!isActive ? item.iconColor : ''}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Mini Step Counter on the right */}
        <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-200 shrink-0">
          <span className="text-[11px] font-bold text-slate-500">
            Modul <b className="text-slate-800">{activeStepNum}</b>/9
          </span>
        </div>
      </div>

      {/* Modern Progress Line Indicator under the horizontal menu */}
      <div className="w-full h-0.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Sub-pill breadcrumb for Menu I (Dashboard) */}
      {isDashboardActive && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 text-[11px] overflow-x-auto">
          <span className="font-extrabold text-emerald-800 flex items-center gap-1 shrink-0">
            <LayoutDashboard className="w-3 h-3 text-emerald-600" />
            Menu I (Dashboard):
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPage('dashboard')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activePage === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              1. Ringkasan & Status
            </button>
            <button
              type="button"
              onClick={() => onSelectPage('profile')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activePage === 'profile'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              2. Identitas Madrasah & Sampul
            </button>
            <button
              type="button"
              onClick={() => onSelectPage('periode')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activePage === 'periode'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              3. Tahun Anggaran & Periode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
