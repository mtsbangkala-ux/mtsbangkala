/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { TopHorizontalMenu } from './components/TopHorizontalMenu';
import { DashboardView } from './components/DashboardView';
import { NavigationMenu, PageMenuId, getPageList } from './components/NavigationMenu';
import { ProfileForm } from './components/forms/ProfileForm';
import { PeriodeForm } from './components/forms/PeriodeForm';
import { SumberDanaForm } from './components/forms/SumberDanaForm';
import { RealisasiKegiatanForm } from './components/forms/RealisasiKegiatanForm';
import { BuktiPengeluaranForm } from './components/forms/BuktiPengeluaranForm';
import { RekapPajakForm } from './components/forms/RekapPajakForm';
import { NotaPesananBastForm } from './components/forms/NotaPesananBastForm';
import { DokumentasiForm } from './components/forms/DokumentasiForm';
import { SptjbAndPejabatForm } from './components/forms/SptjbAndPejabatForm';
import { DocumentViewer } from './components/preview/DocumentViewer';
import { HistoryModal } from './components/HistoryModal';
import { LPJFullData } from './types/lpj';
import { initialSampleData } from './utils/sampleData';
import { exportLPJToWord, PaperSize } from './utils/exportDoc';
import { exportLPJToPdf, setPrintPaperSize, FontSizeScale, MarginPreset } from './utils/exportPdf';
import { formatRupiah } from './utils/numberToWords';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Wallet,
  Target,
  Receipt,
  Landmark,
  Image as ImageIcon,
  FileBadge2,
  Sparkles,
  Save,
  ShoppingBag,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Layers,
} from 'lucide-react';

const STORAGE_KEY_CURRENT = 'lpj_bos_current_v2';
const STORAGE_KEY_HISTORY = 'lpj_bos_history_v2';
const STORAGE_KEY_AUTH = 'lpj_bos_auth_v2';
const STORAGE_KEY_ACTIVE_PAGE = 'lpj_bos_active_page_v2';

export default function App() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });
  const [guruName, setGuruName] = useState<string>(() => {
    return localStorage.getItem('lpj_bos_guru_name') || 'Dra. Hj. Siti Aminah, M.Pd';
  });

  // LPJ Data state
  const [lpjData, setLpjData] = useState<LPJFullData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored LPJ data', e);
      }
    }
    return initialSampleData;
  });

  // History state
  const [historyList, setHistoryList] = useState<LPJFullData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored history', e);
      }
    }
    return [initialSampleData];
  });

  // Active page state (dashboard + 10 pages)
  const [activePage, setActivePage] = useState<PageMenuId>(() => {
    const savedPage = localStorage.getItem(STORAGE_KEY_ACTIVE_PAGE) as PageMenuId;
    const validPages: PageMenuId[] = [
      'dashboard',
      'profile',
      'periode',
      'sumber',
      'realisasi',
      'bukti',
      'pajak',
      'pesanan',
      'dokumentasi',
      'sptjb',
      'preview',
    ];
    return validPages.includes(savedPage) ? savedPage : 'dashboard';
  });

  // UI States
  const [isGenerated, setIsGenerated] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Sidebar Open/Close & Compact State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lpj_bos_sidebar_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isCompact, setIsCompact] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lpj_bos_sidebar_compact');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Paper Size state (A4 or F4 / Folio)
  const [paperSize, setPaperSize] = useState<PaperSize>(() => {
    return (localStorage.getItem('lpj_bos_paper_size') as PaperSize) || 'F4';
  });

  // Font Size Scale state for print/preview (compact, normal, large, extra)
  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>(() => {
    return (localStorage.getItem('lpj_bos_font_size_scale') as FontSizeScale) || 'large';
  });

  // Margin Preset state (standard, tight, spacious)
  const [marginPreset, setMarginPreset] = useState<MarginPreset>(() => {
    return (localStorage.getItem('lpj_bos_margin_preset') as MarginPreset) || 'standard';
  });

  // Save print/preview preferences
  useEffect(() => {
    localStorage.setItem('lpj_bos_paper_size', paperSize);
  }, [paperSize]);

  useEffect(() => {
    localStorage.setItem('lpj_bos_font_size_scale', fontSizeScale);
  }, [fontSizeScale]);

  useEffect(() => {
    localStorage.setItem('lpj_bos_margin_preset', marginPreset);
  }, [marginPreset]);

  // Save sidebar preferences
  useEffect(() => {
    localStorage.setItem('lpj_bos_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('lpj_bos_sidebar_compact', JSON.stringify(isCompact));
  }, [isCompact]);

  // Keyboard shortcut: Alt+M or [ to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if ((e.altKey && e.key.toLowerCase() === 'm') || e.key === '[') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save current data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(lpjData));
  }, [lpjData]);

  // Save history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyList));
  }, [historyList]);

  // Save active page
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PAGE, activePage);
  }, [activePage]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setGuruName(name);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    localStorage.setItem('lpj_bos_guru_name', name);
    showToast(`Selamat datang, ${name}! Siap menyusun LPJ BOS.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    showToast('Anda telah keluar dari aplikasi.', 'info');
  };

  const handleGenerate = () => {
    setIsGenerated(true);
    showToast('Laporan Pertanggungjawaban (LPJ) Berhasil Dibuat!');
  };

  const handleSaveDraft = () => {
    const updatedData = {
      ...lpjData,
      updatedAt: new Date().toISOString(),
    };
    setLpjData(updatedData);

    // Update in history or add new
    const existingIndex = historyList.findIndex((item) => item.id === lpjData.id);
    if (existingIndex >= 0) {
      const updatedList = [...historyList];
      updatedList[existingIndex] = updatedData;
      setHistoryList(updatedList);
    } else {
      setHistoryList([updatedData, ...historyList]);
    }

    showToast('Draf Laporan LPJ berhasil disimpan ke Riwayat!');
  };

  const handleDuplicateHistory = (item: LPJFullData) => {
    const duplicated: LPJFullData = {
      ...JSON.parse(JSON.stringify(item)),
      id: `lpj-${Date.now()}`,
      profile: {
        ...item.profile,
        namaMadrasah: `${item.profile?.namaMadrasah || 'Madrasah'} (Salinan)`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHistoryList([duplicated, ...historyList]);
    showToast(`Salinan LPJ "${duplicated.profile.namaMadrasah}" berhasil dibuat!`);
  };

  const handleLoadSample = () => {
    const sampleCopy = JSON.parse(JSON.stringify(initialSampleData));
    sampleCopy.id = `lpj-${Date.now()}`;
    sampleCopy.updatedAt = new Date().toISOString();
    setLpjData(sampleCopy);
    setIsGenerated(true);
    showToast('Data Contoh BOS Madrasah berhasil dimuat!');
  };

  const handleResetForm = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan formulir untuk membuat LPJ baru?')) {
      const emptyData: LPJFullData = {
        id: `lpj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          namaMadrasah: '',
          nsm: '',
          npsn: '',
          jenjang: 'MTs',
          status: 'Swasta',
          alamat: '',
          desa: '',
          kecamatan: '',
          kabupaten: '',
          provinsi: '',
          kodePos: '',
          telepon: '',
          email: '',
        },
        periode: {
          tahunAnggaran: new Date().getFullYear().toString(),
          tahap: 'Tahap I (Januari - Juni)',
          semester: 'Genap',
          tanggalAwal: `${new Date().getFullYear()}-01-02`,
          tanggalAkhir: `${new Date().getFullYear()}-06-30`,
        },
        sumberDana: [
          {
            id: `sd-${Date.now()}`,
            namaSumber: 'BOS Reguler Madrasah',
            alokasiPagu: 0,
            diterima: 0,
            tanggalTerima: new Date().toISOString().split('T')[0],
            noRekening: '',
            keterangan: '',
          },
        ],
        realisasiKegiatan: [
          {
            id: `rk-${Date.now()}`,
            standarSNP: '1. Standar Kompetensi Lulusan',
            kodeKegiatan: '01.01.01',
            namaKegiatan: '',
            anggaran: 0,
            realisasi: 0,
            volume: '1',
            satuan: 'Paket',
            keterangan: '',
          },
        ],
        buktiPengeluaran: [
          {
            id: `bp-${Date.now()}`,
            noBukti: 'KW-01/BOS/2025',
            tanggal: new Date().toISOString().split('T')[0],
            kodeAkun: '521211 - Belanja Bahan',
            penerima: '',
            uraian: '',
            nominal: 0,
            jenisBukti: 'Kwitansi',
            kelengkapan: ['Kwitansi Asli'],
          },
        ],
        rekapPajak: [],
        notaPesananBast: [],
        dokumentasi: [],
        sptjb: {
          noSurat: `001/SPTJB-BOS/${new Date().getFullYear()}`,
          tanggalSurat: new Date().toISOString().split('T')[0],
          pernyataan:
            'Menyatakan bahwa Laporan Pertanggungjawaban Penggunaan Dana Bantuan Operasional Sekolah (BOS) Periode ini telah dilaksanakan dengan sebenarnya.',
        },
        pejabat: {
          namaKepala: '',
          nipKepala: '',
          namaBendahara: guruName,
          nipBendahara: '',
          tempatPembuatan: '',
          tanggalPengesahan: new Date().toISOString().split('T')[0],
        },
      };
      setLpjData(emptyData);
      setIsGenerated(false);
      setActivePage('profile');
      showToast('Formulir berhasil dikosongkan untuk laporan baru.', 'info');
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handlePrint = () => {
    if (!isGenerated) setIsGenerated(true);
    setPrintPaperSize(paperSize, fontSizeScale, marginPreset);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleDownloadPdf = async () => {
    if (!isGenerated) setIsGenerated(true);
    setIsExportingPdf(true);
    showToast('Sedang membuat berkas PDF resmi bersih...', 'info');
    try {
      await exportLPJToPdf(lpjData, {
        paperSize,
        onProgress: (_step, _total, message) => {
          showToast(message, 'info');
        },
      });
      showToast('Berkas PDF resmi (.pdf) tanpa header & footer berhasil diunduh!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Gagal membuat PDF otomatis. Anda dapat menggunakan tombol Cetak lalu pilih "Simpan sebagai PDF".', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadWord = () => {
    exportLPJToWord(lpjData, paperSize);
    showToast('Dokumen Word resmi (.doc) berhasil diunduh!');
  };

  // If not logged in, show Login Page
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Summary Metrics
  const totalPenerimaan = lpjData.sumberDana.reduce((acc, curr) => acc + (Number(curr.diterima) || 0), 0);
  const totalPagu = lpjData.sumberDana.reduce((acc, curr) => acc + (Number(curr.alokasiPagu ?? curr.diterima) || 0), 0);
  const totalPengeluaran = lpjData.buktiPengeluaran.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);

  const pageList = getPageList(lpjData, totalPenerimaan, totalPengeluaran);
  const currentIndex = pageList.findIndex((p) => p.id === activePage);
  const prevPage = currentIndex > 0 ? pageList[currentIndex - 1] : null;
  const nextPage = currentIndex < pageList.length - 1 ? pageList[currentIndex + 1] : null;

  const goToPage = (pageId: PageMenuId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoNext = () => {
    if (nextPage) {
      if (nextPage.id === 'preview') {
        handleGenerate();
      }
      goToPage(nextPage.id);
    }
  };

  const handleGoPrev = () => {
    if (prevPage) {
      goToPage(prevPage.id);
    }
  };

  return (
    <div className="min-h-screen golden-bg-pattern text-slate-800 flex flex-col font-sans relative selection:bg-amber-200 selection:text-amber-950">
      {/* Golden ambient background lighting overlay */}
      <div className="no-print fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-yellow-400/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl" />
      </div>
      {/* Top Header */}
      <Header
        guruName={guruName}
        historyCount={historyList.length}
        onGoDashboard={() => goToPage('dashboard')}
        onSaveDraft={handleSaveDraft}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadSample={handleLoadSample}
        onReset={handleResetForm}
        onLogout={handleLogout}
      />

      {/* Top Horizontal Menu Bar (Menu I s/d IX) */}
      <TopHorizontalMenu
        activePage={activePage}
        onSelectPage={goToPage}
        data={lpjData}
        totalPenerimaan={totalPenerimaan}
        totalPengeluaran={totalPengeluaran}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact((prev) => !prev)}
      />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : toastMessage.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-blue-600 text-white border-blue-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Page Navigation Quick Bar */}
      <div className="no-print lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Mobile Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>Buka Daftar Menu</span>
          </button>

          <div className="flex-1 min-w-0">
            <select
              id="mobile-page-select"
              value={activePage}
              onChange={(e) => goToPage(e.target.value as PageMenuId)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden truncate"
            >
              {pageList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={!prevPage}
              onClick={handleGoPrev}
              className="p-1.5 bg-slate-100 disabled:opacity-30 rounded-lg text-slate-700 text-xs font-bold border border-slate-200"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!nextPage}
              onClick={handleGoNext}
              className="p-1.5 bg-emerald-600 disabled:opacity-30 rounded-lg text-white text-xs font-bold shadow-xs"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="no-print fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Slide Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-slate-50 h-full overflow-y-auto shadow-2xl p-4 flex flex-col gap-3 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs text-slate-900">Menu Halaman LPJ</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <NavigationMenu
                activePage={activePage}
                onSelectPage={(id) => {
                  goToPage(id);
                  setIsMobileMenuOpen(false);
                }}
                data={lpjData}
                totalPenerimaan={totalPenerimaan}
                totalPengeluaran={totalPengeluaran}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button when Sidebar is Closed on Desktop */}
      {!isSidebarOpen && (
        <aside aria-label="Menu Toggle Samping" className="no-print hidden lg:flex fixed left-4 bottom-6 z-40">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white hover:text-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-700/60 hover:border-emerald-500 transition-all cursor-pointer ring-2 ring-emerald-500/20"
            title="Buka Menu Halaman (Shortcut: Alt+M atau [)"
          >
            <PanelLeftOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black tracking-wide">Buka Menu Halaman</span>
            <span className="text-[10px] font-mono bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-700">
              Alt+M
            </span>
          </button>
        </aside>
      )}

      {/* Main Page-by-Page Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT SIDEBAR: MENU DAFTAR HALAMAN (Bisa Buka / Tutup / Compact) */}
        {isSidebarOpen && (
          <div
            className={`no-print transition-all duration-300 ${
              isCompact
                ? 'lg:col-span-1 xl:col-span-1 flex flex-col gap-4'
                : 'lg:col-span-4 xl:col-span-4 flex flex-col gap-4'
            }`}
          >
            <NavigationMenu
              activePage={activePage}
              onSelectPage={goToPage}
              data={lpjData}
              totalPenerimaan={totalPenerimaan}
              totalPengeluaran={totalPengeluaran}
              isCollapsed={!isSidebarOpen}
              onToggleCollapse={() => setIsSidebarOpen((prev) => !prev)}
              isCompact={isCompact}
              onToggleCompact={() => setIsCompact((prev) => !prev)}
            />
          </div>
        )}

        {/* RIGHT MAIN AREA: HALAMAN AKTIF */}
        <div
          className={`transition-all duration-300 flex flex-col gap-4 ${
            !isSidebarOpen
              ? 'lg:col-span-12 xl:col-span-12'
              : isCompact
              ? 'lg:col-span-11 xl:col-span-11'
              : 'lg:col-span-8 xl:col-span-8'
          }`}
        >
          
          {/* ======================================================== */}
          {/* HALAMAN 0: DASHBOARD UTAMA & RINGKASAN */}
          {/* ======================================================== */}
          {activePage === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <DashboardView
                data={lpjData}
                guruName={guruName}
                onNavigate={goToPage}
                onGenerate={handleGenerate}
                onDownloadWord={handleDownloadWord}
                onPrint={handlePrint}
                onSaveDraft={handleSaveDraft}
                onLoadSample={handleLoadSample}
              />
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 1: IDENTITAS MADRASAH & SAMPUL */}
          {/* ======================================================== */}
          {activePage === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Page Title Card */}
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block mb-1">
                      HALAMAN 1 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Identitas Madrasah & Sampul Dokumen
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lengkapi data pokok madrasah, nomor NSM, NPSN, serta alamat lembaga
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  title="Langsung lihat pratinjau dokumen"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              {/* Form Container */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <ProfileForm
                  data={lpjData.profile}
                  onChange={(profile) => setLpjData({ ...lpjData, profile })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: TAHUN ANGGARAN & PERIODE TAHAP */}
          {/* ======================================================== */}
          {activePage === 'periode' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 inline-block mb-1">
                      HALAMAN 2 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Tahun Anggaran & Periode Tahap
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tentukan tahun anggaran pelaporan dan rentang tanggal pelaksanaan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <PeriodeForm
                  data={lpjData.periode}
                  onChange={(periode) => setLpjData({ ...lpjData, periode })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: SUMBER DANA & PAGU ANGGARAN (FORM K-1) */}
          {/* ======================================================== */}
          {activePage === 'sumber' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
                      HALAMAN 3 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Sumber Dana & Pagu Anggaran (FORM K-1)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Input rincian alokasi pagu dana BOS dan penerimaan rekening madrasah
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <SumberDanaForm
                  items={lpjData.sumberDana}
                  onChange={(sumberDana) => setLpjData({ ...lpjData, sumberDana })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 4: REALISASI KEGIATAN (e-RKAM 8 SNP) */}
          {/* ======================================================== */}
          {activePage === 'realisasi' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 inline-block mb-1">
                      HALAMAN 4 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Realisasi per Kegiatan (8 Standar SNP / e-RKAM)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Catat realisasi anggaran berdasarkan 8 Standar Nasional Pendidikan (FORM K-2)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <RealisasiKegiatanForm
                  items={lpjData.realisasiKegiatan}
                  onChange={(realisasiKegiatan) => setLpjData({ ...lpjData, realisasiKegiatan })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 5: BUKTI PENGELUARAN & KWITANSI SPJ */}
          {/* ======================================================== */}
          {activePage === 'bukti' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mb-1">
                      HALAMAN 5 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Bukti Pengeluaran & Kwitansi Belanja (FORM K-3/K-7)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Input rincian transaksi belanja, nomor bukti, penerima, dan kode akun
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <BuktiPengeluaranForm
                  items={lpjData.buktiPengeluaran}
                  onChange={(buktiPengeluaran) => setLpjData({ ...lpjData, buktiPengeluaran })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 6: REKAPITULASI PAJAK (PPh & PPN) */}
          {/* ======================================================== */}
          {activePage === 'pajak' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 inline-block mb-1">
                      HALAMAN 6 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Rekapitulasi Pajak Belanja (PPh 21, PPh 22, PPh 23 & PPN)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Catat bukti pemotongan pajak atau tetapkan status NIHIL jika tidak kena pajak
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <RekapPajakForm
                  items={lpjData.rekapPajak}
                  onChange={(rekapPajak) => setLpjData({ ...lpjData, rekapPajak })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 7: NOTA PESANAN TOKO & BAST OTOMATIS */}
          {/* ======================================================== */}
          {activePage === 'pesanan' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 inline-block mb-1">
                      HALAMAN 7 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Nota Pesanan Toko & BAST Otomatis
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Surat Pesanan Barang/Jasa & Berita Acara Serah Terima Pengadaan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <NotaPesananBastForm
                  items={lpjData.notaPesananBast || []}
                  buktiPengeluaran={lpjData.buktiPengeluaran}
                  profile={lpjData.profile}
                  pejabat={lpjData.pejabat}
                  periode={lpjData.periode}
                  onChange={(notaPesananBast) => setLpjData({ ...lpjData, notaPesananBast })}
                  onToast={showToast}
                  onNavigateToSpj={() => goToPage('bukti')}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 8: DOKUMENTASI KEGIATAN & BERITA ACARA */}
          {/* ======================================================== */}
          {activePage === 'dokumentasi' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 inline-block mb-1">
                      HALAMAN 8 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Dokumentasi Foto Kegiatan & Berita Acara
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unggah foto fisik sarana prasarana, ATK, honorarium, dan bukti kegiatan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage('preview')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <DokumentasiForm
                  items={lpjData.dokumentasi}
                  onChange={(dokumentasi) => setLpjData({ ...lpjData, dokumentasi })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 9: SPTJB & PENGATURAN PEJABAT PENANDATANGAN */}
          {/* ======================================================== */}
          {activePage === 'sptjb' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shrink-0">
                    <FileBadge2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block mb-1">
                      HALAMAN 9 DARI 10
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Surat Pernyataan (SPTJB) & Pejabat Penandatangan
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atur nomor SPTJB, nama & NIP Kepala Madrasah, Bendahara, dan tanggal pengesahan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleGenerate();
                    goToPage('preview');
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate LPJ</span>
                </button>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <SptjbAndPejabatForm
                  sptjb={lpjData.sptjb}
                  pejabat={lpjData.pejabat}
                  onSptjbChange={(sptjb) => setLpjData({ ...lpjData, sptjb })}
                  onPejabatChange={(pejabat) => setLpjData({ ...lpjData, pejabat })}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 10: GENERATE LPJ & PRATINJAU DOKUMEN */}
          {/* ======================================================== */}
          {activePage === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              id="preview-container"
              className="flex flex-col gap-4"
            >
              {/* Main Action Top Card with BIG GREEN BUTTON */}
              <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1">
                    HALAMAN 10: HASIL AKHIR & CETAK
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    GENERATE LPJ BENDAHARA BOS
                  </h2>
                  <p className="text-xs text-slate-500">
                    Klik tombol hijau untuk merefleksikan seluruh perubahan data terbaru
                  </p>
                </div>

                {/* BIG GREEN BUTTON */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>BUAT / PERBARUI LPJ</span>
                </button>
              </div>

              {/* Quick Action Bar (Unduh Word & Cetak) */}
              <div className="no-print bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      Opsi Unduh LPJ
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Format resmi BOS Kemenag (PDF & Word) siap digunakan
                    </p>
                  </div>
                </div>

                {/* Export & Download Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Download PDF (.pdf) */}
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isExportingPdf}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Unduh berkas PDF (.pdf) resmi tanpa header & footer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExportingPdf ? 'Membuat PDF...' : 'Unduh PDF'}</span>
                  </button>

                  {/* Download Word (.doc) */}
                  <button
                    type="button"
                    onClick={() => handleDownloadWord()}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Unduh file Microsoft Word (.doc) resmi dan rapi"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Word</span>
                  </button>
                </div>
              </div>

              {/* Document Viewer Container */}
              <div className="flex-1">
                <DocumentViewer
                  data={lpjData}
                  isGenerated={isGenerated}
                  onGenerate={handleGenerate}
                  paperSize={paperSize}
                  onPaperSizeChange={setPaperSize}
                  fontSizeScale={fontSizeScale}
                  onFontSizeScaleChange={setFontSizeScale}
                  marginPreset={marginPreset}
                  onMarginPresetChange={setMarginPreset}
                  onDownloadPdf={handleDownloadPdf}
                  onDownloadWord={handleDownloadWord}
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* BOTTOM STEP NAVIGATION FOOTER (ANTAR HALAMAN) */}
          {/* ======================================================== */}
          <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
            {/* Tombol Sebelumnya */}
            <button
              type="button"
              disabled={!prevPage}
              onClick={handleGoPrev}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {prevPage ? `Sebelumnya: ${prevPage.shortTitle}` : 'Halaman Pertama'}
              </span>
            </button>

            {/* Quick Center Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Simpan perubahan formulir saat ini"
              >
                <Save className="w-3.5 h-3.5 text-blue-600" />
                <span>Simpan Draf</span>
              </button>

              {activePage !== 'preview' && (
                <button
                  type="button"
                  onClick={() => {
                    handleGenerate();
                    goToPage('preview');
                  }}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Lihat Pratinjau Dokumen"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lihat Dokumen</span>
                </button>
              )}
            </div>

            {/* Tombol Selanjutnya */}
            {nextPage ? (
              <button
                type="button"
                onClick={handleGoNext}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  nextPage.id === 'preview'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>
                  {nextPage.id === 'preview'
                    ? '✨ Lanjut ke Generate LPJ'
                    : `Lanjut: ${nextPage.shortTitle}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen Sekarang</span>
              </button>
            )}
          </div>

        </div>

      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        savedList={historyList}
        onSelectHistory={(selected) => {
          setLpjData(selected);
          setIsGenerated(true);
          setIsHistoryOpen(false);
          showToast(`Laporan "${selected.profile?.namaMadrasah || 'Madrasah'}" berhasil dimuat!`);
        }}
        onDeleteHistory={(id) => {
          const updated = historyList.filter((item) => item.id !== id);
          setHistoryList(updated);
          showToast('Riwayat berhasil dihapus.', 'info');
        }}
        onDuplicate={handleDuplicateHistory}
      />
    </div>
  );
}
