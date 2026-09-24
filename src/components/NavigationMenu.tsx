import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Wallet,
  Target,
  Receipt,
  Landmark,
  ShoppingBag,
  Image as ImageIcon,
  FileBadge2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
  Folder,
  Coins,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LPJFullData } from '../types/lpj';
import { formatRupiah } from '../utils/numberToWords';

export type PageMenuId =
  | 'dashboard'
  | 'profile'
  | 'periode'
  | 'sumber'
  | 'realisasi'
  | 'bukti'
  | 'pajak'
  | 'pesanan'
  | 'dokumentasi'
  | 'sptjb'
  | 'preview';

export interface PageMenuItem {
  id: PageMenuId;
  roman: string;
  pageNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgLightClass: string;
  badge?: string;
  badgeColor?: string;
  isSubItem?: boolean;
  groupId?: string;
  isComplete?: boolean;
  themeColor: string;
  iconBgClass: string;
  activeGradient: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  hoverBg: string;
  badgeClass: string;
}

export interface MenuGroup {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  headerActiveBg: string;
  headerActiveIconBg: string;
  headerDefaultIconBg: string;
  headerBadgeColor: string;
  itemIds: PageMenuId[];
}

interface NavigationMenuProps {
  activePage: PageMenuId;
  onSelectPage: (pageId: PageMenuId) => void;
  data: LPJFullData;
  totalPenerimaan: number;
  totalPengeluaran: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleCompact?: () => void;
  isCompact?: boolean;
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'group-profil',
    title: '1. Profil & Identitas Madrasah',
    shortTitle: 'Profil & Sampul',
    icon: Building2,
    color: 'emerald',
    headerActiveBg: 'from-emerald-50/90 via-teal-50/50 to-blue-50/30 text-emerald-950',
    headerActiveIconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    headerDefaultIconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    headerBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    itemIds: ['dashboard', 'profile', 'periode'],
  },
  {
    id: 'group-keuangan',
    title: '2. Penganggaran & Transaksi SPJ',
    shortTitle: 'Keuangan & SPJ',
    icon: Coins,
    color: 'purple',
    headerActiveBg: 'from-purple-50/90 via-indigo-50/50 to-amber-50/30 text-purple-950',
    headerActiveIconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    headerDefaultIconBg: 'bg-purple-100 text-purple-800 border border-purple-200',
    headerBadgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    itemIds: ['sumber', 'realisasi', 'bukti', 'pajak'],
  },
  {
    id: 'group-pengadaan',
    title: '3. Pengadaan Toko & Dokumentasi',
    shortTitle: 'Pengadaan & Foto',
    icon: ShoppingBag,
    color: 'teal',
    headerActiveBg: 'from-teal-50/90 via-cyan-50/50 to-fuchsia-50/30 text-teal-950',
    headerActiveIconBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
    headerDefaultIconBg: 'bg-teal-100 text-teal-800 border border-teal-200',
    headerBadgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    itemIds: ['pesanan', 'dokumentasi'],
  },
  {
    id: 'group-output',
    title: '4. Pengesahan & Output LPJ',
    shortTitle: 'SPTJB & Pratinjau',
    icon: Sparkles,
    color: 'amber',
    headerActiveBg: 'from-amber-50/90 via-yellow-50/50 to-emerald-50/30 text-amber-950',
    headerActiveIconBg: 'bg-gradient-to-br from-amber-600 to-emerald-600 text-white shadow-md shadow-amber-600/30',
    headerDefaultIconBg: 'bg-amber-100 text-amber-900 border border-amber-300',
    headerBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    itemIds: ['sptjb', 'preview'],
  },
];

export const getPageList = (
  data: LPJFullData,
  totalPenerimaan: number,
  totalPengeluaran: number
): PageMenuItem[] => {
  const totalRealisasi = data.realisasiKegiatan.reduce(
    (acc, curr) => acc + (Number(curr.realisasi) || 0),
    0
  );

  return [
    {
      id: 'dashboard',
      roman: 'I',
      pageNumber: 1,
      title: 'I. Dashboard & Ringkasan Status',
      shortTitle: 'I. Dashboard',
      subtitle: `${data.profile.namaMadrasah || 'LPJ BOS Digital'}`,
      icon: LayoutDashboard,
      colorClass: 'text-emerald-600',
      bgLightClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Utama',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      groupId: 'group-profil',
      isComplete: true,
      themeColor: 'emerald',
      iconBgClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      activeGradient: 'from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-700/30 ring-emerald-400/40',
      activeBg: 'bg-emerald-50/90 border-l-4 border-emerald-600',
      activeBorder: 'border-emerald-500',
      activeText: 'text-emerald-950 font-black',
      hoverBg: 'hover:bg-emerald-50/70',
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    },
    {
      id: 'profile',
      roman: 'I.1',
      pageNumber: 1.1,
      title: '• Identitas Madrasah & Sampul',
      shortTitle: 'Identitas & Sampul',
      subtitle: data.profile.namaMadrasah || 'Belum diisi',
      icon: Building2,
      colorClass: 'text-blue-600',
      bgLightClass: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: data.profile.namaMadrasah ? 'Lengkap' : 'Wajib',
      badgeColor: data.profile.namaMadrasah
        ? 'bg-blue-100 text-blue-800'
        : 'bg-amber-100 text-amber-800',
      isSubItem: true,
      groupId: 'group-profil',
      isComplete: Boolean(data.profile.namaMadrasah && data.profile.nsm),
      themeColor: 'blue',
      iconBgClass: 'bg-blue-100 text-blue-800 border border-blue-300',
      activeGradient: 'from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-700/30 ring-blue-400/40',
      activeBg: 'bg-blue-50/90 border-l-4 border-blue-600',
      activeBorder: 'border-blue-500',
      activeText: 'text-blue-950 font-black',
      hoverBg: 'hover:bg-blue-50/70',
      badgeClass: 'bg-blue-100 text-blue-900 border border-blue-300',
    },
    {
      id: 'periode',
      roman: 'I.2',
      pageNumber: 1.2,
      title: '• Tahun Anggaran & Periode',
      shortTitle: 'Tahun & Periode',
      subtitle: `Tahun ${data.periode.tahunAnggaran} • ${data.periode.tahap.split(' ')[0]} ${data.periode.tahap.split(' ')[1] || ''}`,
      icon: Calendar,
      colorClass: 'text-sky-600',
      bgLightClass: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: data.periode.tahap.includes('Tahap I') ? 'Tahap 1' : 'Tahap 2',
      badgeColor: 'bg-sky-100 text-sky-800',
      isSubItem: true,
      groupId: 'group-profil',
      isComplete: true,
      themeColor: 'sky',
      iconBgClass: 'bg-sky-100 text-sky-800 border border-sky-300',
      activeGradient: 'from-sky-600 via-cyan-600 to-sky-700 text-white shadow-sky-700/30 ring-sky-400/40',
      activeBg: 'bg-sky-50/90 border-l-4 border-sky-600',
      activeBorder: 'border-sky-500',
      activeText: 'text-sky-950 font-black',
      hoverBg: 'hover:bg-sky-50/70',
      badgeClass: 'bg-sky-100 text-sky-900 border border-sky-300',
    },
    {
      id: 'sumber',
      roman: 'II',
      pageNumber: 2,
      title: 'II. Sumber Dana & Pagu (Form K-1)',
      shortTitle: 'II. Sumber Dana (K-1)',
      subtitle: `Terima: ${formatRupiah(totalPenerimaan)}`,
      icon: Wallet,
      colorClass: 'text-green-600',
      bgLightClass: 'bg-green-50 text-green-700 border-green-200',
      badge: `${data.sumberDana.length} Sumber`,
      badgeColor: 'bg-green-100 text-green-800',
      groupId: 'group-keuangan',
      isComplete: data.sumberDana.length > 0,
      themeColor: 'green',
      iconBgClass: 'bg-green-100 text-green-800 border border-green-300',
      activeGradient: 'from-green-600 via-emerald-600 to-green-700 text-white shadow-green-700/30 ring-green-400/40',
      activeBg: 'bg-green-50/90 border-l-4 border-green-600',
      activeBorder: 'border-green-500',
      activeText: 'text-green-950 font-black',
      hoverBg: 'hover:bg-green-50/70',
      badgeClass: 'bg-green-100 text-green-900 border border-green-300',
    },
    {
      id: 'realisasi',
      roman: 'III',
      pageNumber: 3,
      title: 'III. Realisasi Kegiatan (Erkam)',
      shortTitle: 'III. Realisasi (Erkam)',
      subtitle: `${data.realisasiKegiatan.length} Kegiatan SNP`,
      icon: Target,
      colorClass: 'text-purple-600',
      bgLightClass: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: formatRupiah(totalRealisasi),
      badgeColor: 'bg-purple-100 text-purple-800',
      groupId: 'group-keuangan',
      isComplete: data.realisasiKegiatan.length > 0,
      themeColor: 'purple',
      iconBgClass: 'bg-purple-100 text-purple-800 border border-purple-300',
      activeGradient: 'from-purple-600 via-violet-600 to-purple-700 text-white shadow-purple-700/30 ring-purple-400/40',
      activeBg: 'bg-purple-50/90 border-l-4 border-purple-600',
      activeBorder: 'border-purple-500',
      activeText: 'text-purple-950 font-black',
      hoverBg: 'hover:bg-purple-50/70',
      badgeClass: 'bg-purple-100 text-purple-900 border border-purple-300',
    },
    {
      id: 'bukti',
      roman: 'IV',
      pageNumber: 4,
      title: 'IV. Bukti Pengeluaran & SPJ',
      shortTitle: 'IV. Bukti & SPJ',
      subtitle: `Total: ${formatRupiah(totalPengeluaran)}`,
      icon: Receipt,
      colorClass: 'text-amber-600',
      bgLightClass: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: `${data.buktiPengeluaran.length} SPJ`,
      badgeColor: 'bg-amber-100 text-amber-800',
      groupId: 'group-keuangan',
      isComplete: data.buktiPengeluaran.length > 0,
      themeColor: 'amber',
      iconBgClass: 'bg-amber-100 text-amber-900 border border-amber-300',
      activeGradient: 'from-amber-500 via-orange-600 to-amber-700 text-white shadow-orange-700/30 ring-amber-400/40',
      activeBg: 'bg-amber-50/90 border-l-4 border-amber-600',
      activeBorder: 'border-amber-500',
      activeText: 'text-amber-950 font-black',
      hoverBg: 'hover:bg-amber-50/70',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
    },
    {
      id: 'pajak',
      roman: 'V',
      pageNumber: 5,
      title: 'V. Rekapitulasi Pajak',
      shortTitle: 'V. Rekap Pajak',
      subtitle:
        data.rekapPajak.length === 0
          ? 'Status: NIHIL'
          : `${data.rekapPajak.length} Pajak & NTPN`,
      icon: Landmark,
      colorClass: 'text-rose-600',
      bgLightClass: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: data.rekapPajak.length === 0 ? 'Nihil' : `${data.rekapPajak.length} Setoran`,
      badgeColor:
        data.rekapPajak.length === 0
          ? 'bg-slate-100 text-slate-700'
          : 'bg-rose-100 text-rose-800',
      groupId: 'group-keuangan',
      isComplete: true,
      themeColor: 'rose',
      iconBgClass: 'bg-rose-100 text-rose-800 border border-rose-300',
      activeGradient: 'from-rose-600 via-red-600 to-rose-700 text-white shadow-rose-700/30 ring-rose-400/40',
      activeBg: 'bg-rose-50/90 border-l-4 border-rose-600',
      activeBorder: 'border-rose-500',
      activeText: 'text-rose-950 font-black',
      hoverBg: 'hover:bg-rose-50/70',
      badgeClass: 'bg-rose-100 text-rose-900 border border-rose-300',
    },
    {
      id: 'pesanan',
      roman: 'VI',
      pageNumber: 6,
      title: 'VI. Nota Pesanan Toko & BAST',
      shortTitle: 'VI. Pesanan & BAST',
      subtitle:
        (data.notaPesananBast?.length || 0) === 0
          ? 'Status: NIHIL'
          : `${data.notaPesananBast?.length} Surat BAST`,
      icon: ShoppingBag,
      colorClass: 'text-teal-600',
      bgLightClass: 'bg-teal-50 text-teal-700 border-teal-200',
      badge:
        (data.notaPesananBast?.length || 0) === 0
          ? 'Nihil'
          : `${data.notaPesananBast?.length} BAST`,
      badgeColor:
        (data.notaPesananBast?.length || 0) === 0
          ? 'bg-slate-100 text-slate-700'
          : 'bg-teal-100 text-teal-800',
      groupId: 'group-pengadaan',
      isComplete: true,
      themeColor: 'teal',
      iconBgClass: 'bg-teal-100 text-teal-800 border border-teal-300',
      activeGradient: 'from-teal-600 via-cyan-600 to-teal-700 text-white shadow-teal-700/30 ring-teal-400/40',
      activeBg: 'bg-teal-50/90 border-l-4 border-teal-600',
      activeBorder: 'border-teal-500',
      activeText: 'text-teal-950 font-black',
      hoverBg: 'hover:bg-teal-50/70',
      badgeClass: 'bg-teal-100 text-teal-900 border border-teal-300',
    },
    {
      id: 'dokumentasi',
      roman: 'VII',
      pageNumber: 7,
      title: 'VII. Dokumentasi Kegiatan Foto Kegiatan',
      shortTitle: 'VII. Dokumentasi Foto',
      subtitle: `${data.dokumentasi.length} Berkas Lampiran`,
      icon: ImageIcon,
      colorClass: 'text-fuchsia-600',
      bgLightClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
      badge: `${data.dokumentasi.length} Foto`,
      badgeColor: 'bg-fuchsia-100 text-fuchsia-800',
      groupId: 'group-pengadaan',
      isComplete: data.dokumentasi.length > 0,
      themeColor: 'fuchsia',
      iconBgClass: 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300',
      activeGradient: 'from-fuchsia-600 via-pink-600 to-fuchsia-700 text-white shadow-fuchsia-700/30 ring-fuchsia-400/40',
      activeBg: 'bg-fuchsia-50/90 border-l-4 border-fuchsia-600',
      activeBorder: 'border-fuchsia-500',
      activeText: 'text-fuchsia-950 font-black',
      hoverBg: 'hover:bg-fuchsia-50/70',
      badgeClass: 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300',
    },
    {
      id: 'sptjb',
      roman: 'VIII',
      pageNumber: 8,
      title: 'VIII. SPTJB & Pejabat Penandatangan',
      shortTitle: 'VIII. SPTJB & Pejabat',
      subtitle: `Kepala: ${data.pejabat.namaKepala || 'Belum diisi'}`,
      icon: FileBadge2,
      colorClass: 'text-indigo-600',
      bgLightClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Legalitas',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      groupId: 'group-output',
      isComplete: Boolean(data.pejabat.namaKepala && data.pejabat.namaBendahara),
      themeColor: 'indigo',
      iconBgClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
      activeGradient: 'from-indigo-600 via-blue-700 to-indigo-700 text-white shadow-indigo-700/30 ring-indigo-400/40',
      activeBg: 'bg-indigo-50/90 border-l-4 border-indigo-600',
      activeBorder: 'border-indigo-500',
      activeText: 'text-indigo-950 font-black',
      hoverBg: 'hover:bg-indigo-50/70',
      badgeClass: 'bg-indigo-100 text-indigo-900 border border-indigo-300',
    },
    {
      id: 'preview',
      roman: 'IX',
      pageNumber: 9,
      title: 'IX. Generate LPJ & Pratinjau',
      shortTitle: 'IX. Generate & Unduh',
      subtitle: 'Siap Unduh PDF & Word',
      icon: Sparkles,
      colorClass: 'text-amber-700',
      bgLightClass: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'PDF & Word',
      badgeColor: 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-xs',
      groupId: 'group-output',
      isComplete: true,
      themeColor: 'gold',
      iconBgClass: 'bg-amber-100 text-amber-900 border border-amber-300',
      activeGradient: 'from-amber-600 via-yellow-600 to-emerald-600 text-white shadow-amber-900/40 ring-amber-400/40',
      activeBg: 'bg-amber-50/90 border-l-4 border-amber-600',
      activeBorder: 'border-amber-500',
      activeText: 'text-amber-950 font-black',
      hoverBg: 'hover:bg-amber-50/70',
      badgeClass: 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white border border-amber-400 shadow-2xs',
    },
  ];
};

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activePage,
  onSelectPage,
  data,
  totalPenerimaan,
  totalPengeluaran,
  isCollapsed = false,
  onToggleCollapse,
  onToggleCompact,
  isCompact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'group-profil': true,
    'group-keuangan': true,
    'group-pengadaan': true,
    'group-output': true,
  });

  const pages = useMemo(
    () => getPageList(data, totalPenerimaan, totalPengeluaran),
    [data, totalPenerimaan, totalPengeluaran]
  );

  const activePageIndex = pages.findIndex((p) => p.id === activePage);
  const activePageItem = pages[activePageIndex] || pages[0];
  const progressPercent = Math.round(((activePageIndex + 1) / pages.length) * 100);
  const sisaSaldo = totalPenerimaan - totalPengeluaran;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleExpandAll = (expanded: boolean) => {
    const next: Record<string, boolean> = {};
    MENU_GROUPS.forEach((g) => {
      next[g.id] = expanded;
    });
    setExpandedGroups(next);
  };

  // Filter pages by search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const q = searchQuery.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.roman.toLowerCase().includes(q)
    );
  }, [pages, searchQuery]);

  // Group pages for accordion view
  const groupedMenu = useMemo(() => {
    return MENU_GROUPS.map((group) => {
      const items = filteredPages.filter((p) => p.groupId === group.id);
      return {
        ...group,
        items,
      };
    }).filter((group) => group.items.length > 0);
  }, [filteredPages]);

  // COMPACT / MINI VIEW (Icons Ribbon)
  if (isCompact) {
    return (
      <aside className="no-print bg-slate-900/95 backdrop-blur-xl text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-2.5 flex flex-col items-center gap-2.5 sticky top-[108px] z-20">
        {/* Toggle Expand Button */}
        <button
          type="button"
          onClick={onToggleCompact}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-2xl transition-all cursor-pointer"
          title="Perbesar Menu Halaman (Sidebar Penuh)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-8 h-[1px] bg-slate-800 my-0.5" />

        {/* Compact Navigation Items */}
        <div className="flex flex-col gap-1.5 w-full">
          {pages.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPage(item.id)}
                className={`relative group w-10 h-10 mx-auto rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-tr ${item.activeGradient} ring-2`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/90'
                }`}
              >
                <Icon className="w-4 h-4" />

                {/* Floating Tooltip */}
                <div className="absolute left-full ml-3 px-3.5 py-2 bg-slate-950/95 backdrop-blur-md text-white text-xs font-bold rounded-2xl whitespace-nowrap shadow-2xl border border-slate-700/80 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 flex items-center gap-2">
                  <span className="font-mono font-black text-amber-300">{item.roman}</span>
                  <span>{item.shortTitle}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-8 h-[1px] bg-slate-800 my-0.5" />

        {/* Progress Mini Pill */}
        <div className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-1.5 py-0.5 rounded-lg">
          {progressPercent}%
        </div>
      </aside>
    );
  }

  return (
    <aside className="no-print w-full flex flex-col gap-3 sticky top-[108px]">
      {/* Sleek Gradient Header Card with Open/Close Actions */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-4 rounded-3xl border border-emerald-800/40 shadow-xl backdrop-blur-xl">
        {/* Glow background accent */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg ring-2 ring-emerald-400/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Daftar Menu LPJ
                </h2>
                <span className="text-[10px] font-bold bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  {pages.length} Modul
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Alur Kerja & Laporan Resmi BOS
              </p>
            </div>
          </div>

          {/* Quick Toolbar: Compact Toggle & Close/Open All */}
          <div className="flex items-center gap-1">
            {onToggleCompact && (
              <button
                type="button"
                onClick={onToggleCompact}
                className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title="Tampilan Ringkas (Mini Icon)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title={isCollapsed ? 'Buka Menu Samping' : 'Tutup Menu Samping'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                ) : (
                  <PanelLeftClose className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar with Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <span>Halaman Aktif:</span>
              <span className="text-white font-bold truncate max-w-[140px]">{activePageItem.shortTitle}</span>
            </span>
            <span className="font-mono font-black text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-700/40 text-[10.5px]">
              {progressPercent}% Selesai
            </span>
          </div>

          <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-[1px] border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search & Quick Accordion Trigger */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul / formulir..."
              className="w-full bg-slate-800/70 hover:bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl pl-8 pr-2.5 py-1.5 border border-slate-700 focus:border-emerald-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleExpandAll(Object.values(expandedGroups).some((v) => !v))}
            className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700 rounded-xl text-[10.5px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Buka / Tutup Semua Kategori"
          >
            {Object.values(expandedGroups).some((v) => !v) ? (
              <>
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Buka</span>
              </>
            ) : (
              <>
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Tutup</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion Categorized Navigation Menu List */}
      <nav aria-label="Menu Halaman LPJ" className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
        {groupedMenu.map((group) => {
          const isGroupExpanded = expandedGroups[group.id] ?? true;
          const GroupIcon = group.icon;
          const hasActiveChild = group.items.some((item) => item.id === activePage);

          return (
            <div
              key={group.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                hasActiveChild ? 'border-amber-300/90 ring-1 ring-amber-200/50 shadow-sm' : 'border-slate-200/90'
              }`}
            >
              {/* Category Header (Click to Open/Close Category) */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                  hasActiveChild
                    ? `bg-gradient-to-r ${group.headerActiveBg} font-black`
                    : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 font-bold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-xl text-xs transition-all ${
                      hasActiveChild
                        ? group.headerActiveIconBg
                        : group.headerDefaultIconBg
                    }`}
                  >
                    <GroupIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black tracking-tight">{group.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${group.headerBadgeColor}`}>
                    {group.items.length} Menu
                  </span>
                  <motion.div
                    animate={{ rotate: isGroupExpanded ? 0 : -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </div>
              </button>

              {/* Collapsible Menu Items */}
              <AnimatePresence initial={false}>
                {isGroupExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="divide-y divide-slate-100 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const isActive = activePage === item.id;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectPage(item.id)}
                          className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-all duration-150 cursor-pointer group relative ${
                            item.isSubItem ? 'pl-6 bg-slate-50/30' : ''
                          } ${
                            isActive
                              ? `${item.activeBg} ${item.activeText}`
                              : `${item.hoverBg} text-slate-700`
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {/* Number & Icon Badge with distinct colors */}
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                                isActive
                                  ? `bg-gradient-to-br ${item.activeGradient} shadow-md ring-2`
                                  : `${item.iconBgClass} group-hover:scale-105 shadow-2xs`
                              }`}
                            >
                              {item.isSubItem ? (
                                <Icon className="w-3.5 h-3.5" />
                              ) : isActive ? (
                                <Icon className="w-3.5 h-3.5" />
                              ) : (
                                <span className="font-black text-[11px] font-mono">
                                  {item.roman}
                                </span>
                              )}
                            </div>

                            {/* Text Labels */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs truncate ${
                                    isActive
                                      ? item.activeText
                                      : item.isSubItem
                                      ? 'text-slate-700 font-semibold'
                                      : 'text-slate-800 font-bold group-hover:text-slate-950'
                                  }`}
                                >
                                  {item.title}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Right Badges & Indicators */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                  item.badgeClass
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isActive
                                  ? 'text-slate-800 translate-x-0.5 font-bold'
                                  : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Quick Summary Card at bottom */}
      <div className="p-3.5 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
          <span>Ringkasan Saldo Kas</span>
          <span className="text-emerald-700 font-bold">BOS {data.periode.tahunAnggaran}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-500 font-medium block">Penerimaan:</span>
            <span className="text-xs font-black text-emerald-950 font-sans truncate block">
              {formatRupiah(totalPenerimaan)}
            </span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-medium block">Total SPJ:</span>
            <span className="text-xs font-black text-slate-900 font-sans truncate block">
              {formatRupiah(totalPengeluaran)}
            </span>
          </div>
        </div>

        {sisaSaldo !== 0 && (
          <div className={`p-2 rounded-xl border flex items-center justify-between text-[11px] font-bold ${
            sisaSaldo > 0 ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            <span>Sisa Saldo Kas:</span>
            <span className="font-mono">{formatRupiah(sisaSaldo)}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectPage('preview')}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pratinjau & Cetak Dokumen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
