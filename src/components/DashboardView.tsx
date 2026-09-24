import React from 'react';
import {
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
  Printer,
  Download,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Sparkle,
  PlusCircle,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { LPJFullData } from '../types/lpj';
import { formatRupiah } from '../utils/numberToWords';
import { PageMenuId } from './NavigationMenu';

interface DashboardViewProps {
  data: LPJFullData;
  guruName: string;
  onNavigate: (pageId: PageMenuId) => void;
  onGenerate: () => void;
  onDownloadWord: () => void;
  onPrint: () => void;
  onSaveDraft: () => void;
  onLoadSample: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  guruName,
  onNavigate,
  onGenerate,
  onDownloadWord,
  onPrint,
  onSaveDraft,
  onLoadSample,
}) => {
  // Calculations
  const totalPenerimaan = data.sumberDana.reduce(
    (acc, curr) => acc + (Number(curr.diterima) || 0),
    0
  );
  const totalPagu = data.sumberDana.reduce(
    (acc, curr) => acc + (Number(curr.alokasiPagu ?? curr.diterima) || 0),
    0
  );
  const totalPengeluaran = data.buktiPengeluaran.reduce(
    (acc, curr) => acc + (Number(curr.nominal) || 0),
    0
  );
  const totalPajak = data.rekapPajak.reduce(
    (acc, curr) =>
      acc +
      (Number(curr.pph21) || 0) +
      (Number(curr.pph22) || 0) +
      (Number(curr.pph23) || 0) +
      (Number(curr.ppn) || 0),
    0
  );
  const sisaKas = totalPenerimaan - totalPengeluaran;
  const persentaseSerapan =
    totalPenerimaan > 0 ? Math.min(100, Math.round((totalPengeluaran / totalPenerimaan) * 100)) : 0;

  // Realisasi per Standar SNP
  const snpList = [
    '1. Standar Kompetensi Lulusan',
    '2. Standar Isi',
    '3. Standar Proses',
    '4. Standar Penilaian Pendidikan',
    '5. Standar Pendidik dan Tenaga Kependidikan',
    '6. Standar Sarana dan Prasarana',
    '7. Standar Pengelolaan',
    '8. Standar Pembiayaan',
  ];

  const snpStats = snpList.map((standar, idx) => {
    const items = data.realisasiKegiatan.filter((k) =>
      k.standarSNP?.toLowerCase().includes(standar.toLowerCase().slice(3, 15))
    );
    const nominal = items.reduce((acc, curr) => acc + (Number(curr.realisasi) || 0), 0);
    return {
      name: standar,
      shortName: standar.replace(/^\d+\.\s*Standar\s*/i, ''),
      nominal,
      count: items.length,
      color: [
        'bg-blue-500',
        'bg-sky-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-amber-500',
        'bg-rose-500',
      ][idx % 8],
    };
  });

  const totalRealisasiSNP = snpStats.reduce((acc, curr) => acc + curr.nominal, 0);

  // Compliance Checks
  const checks = [
    {
      title: 'Identitas & Profil Madrasah',
      desc: data.profile.namaMadrasah ? `${data.profile.namaMadrasah} (NSM: ${data.profile.nsm || '-'})` : 'Belum diisi',
      status: !!(data.profile.namaMadrasah && data.profile.nsm),
      page: 'profile' as PageMenuId,
    },
    {
      title: 'Tahun Anggaran & Periode Tahap',
      desc: `Tahun ${data.periode.tahunAnggaran} • ${data.periode.tahap}`,
      status: !!(data.periode.tahunAnggaran && data.periode.tahap),
      page: 'periode' as PageMenuId,
    },
    {
      title: 'Sumber Dana (FORM K-1)',
      desc: `${data.sumberDana.length} Sumber • Diterima: ${formatRupiah(totalPenerimaan)}`,
      status: data.sumberDana.length > 0 && totalPenerimaan > 0,
      page: 'sumber' as PageMenuId,
    },
    {
      title: 'Realisasi Kegiatan 8 SNP (FORM K-2)',
      desc: `${data.realisasiKegiatan.length} Kegiatan Terprogram • Rp ${formatRupiah(totalRealisasiSNP)}`,
      status: data.realisasiKegiatan.length > 0,
      page: 'realisasi' as PageMenuId,
    },
    {
      title: 'Bukti Kwitansi SPJ (FORM K-3/K-7)',
      desc: `${data.buktiPengeluaran.length} Bukti Kwitansi • Total: ${formatRupiah(totalPengeluaran)}`,
      status: data.buktiPengeluaran.length > 0,
      page: 'bukti' as PageMenuId,
    },
    {
      title: 'Rekapitulasi Pajak & NTPN',
      desc: data.rekapPajak.length === 0 ? 'Status: NIHIL (Tidak Kena Pajak)' : `${data.rekapPajak.length} Setoran Pajak (${formatRupiah(totalPajak)})`,
      status: true,
      page: 'pajak' as PageMenuId,
    },
    {
      title: 'Nota Pesanan & BAST Pengadaan',
      desc: (data.notaPesananBast?.length || 0) === 0 ? 'Status: Standar Operasional' : `${data.notaPesananBast?.length} Surat BAST`,
      status: true,
      page: 'pesanan' as PageMenuId,
    },
    {
      title: 'Dokumentasi Foto Fisik Kegiatan',
      desc: `${data.dokumentasi.length} Foto Lampiran Dokumentasi`,
      status: data.dokumentasi.length > 0,
      page: 'dokumentasi' as PageMenuId,
    },
    {
      title: 'SPTJB & Pengesahan Pejabat',
      desc: `Kepala: ${data.pejabat.namaKepala || 'Belum diisi'} • Bendahara: ${data.pejabat.namaBendahara || 'Belum diisi'}`,
      status: !!(data.pejabat.namaKepala && data.pejabat.namaBendahara),
      page: 'sptjb' as PageMenuId,
    },
  ];

  const completedChecksCount = checks.filter((c) => c.status).length;
  const completenessPercent = Math.round((completedChecksCount / checks.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. HERO WELCOME BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-900/50">
        {/* Ambient background glows */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Sistem LPJ BOS Madrasah Digital
              </span>
              <span className="px-3 py-1 bg-white/10 text-slate-300 rounded-full text-xs font-semibold">
                T.A. {data.periode.tahunAnggaran} • {data.periode.tahap}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Selamat Datang, {guruName}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Dashboard terintegrasi untuk penyusunan, verifikasi, dan pencetakan{' '}
              <strong className="text-emerald-300 font-bold">Laporan Pertanggungjawaban (LPJ) BOS</strong> pada{' '}
              <span className="text-white font-bold">{data.profile.namaMadrasah || 'Madrasah Anda'}</span> sesuai standar Kemenag RI.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>NSM: <strong>{data.profile.nsm || '-'}</strong></span>
                <span className="text-slate-500">•</span>
                <span>NPSN: <strong>{data.profile.npsn || '-'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Status: <strong>{data.profile.jenjang} {data.profile.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                onGenerate();
                onNavigate('preview');
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>GENERATE & CETAK LPJ</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <span>Edit Formulir Mulai Hal. 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. KEY FINANCIAL KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Penerimaan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Dana Diterima
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatRupiah(totalPenerimaan)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Pagu: {formatRupiah(totalPagu)}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                100% Masuk
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full w-full rounded-full" />
          </div>
        </div>

        {/* Card 2: Pengeluaran SPJ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Realisasi Belanja (SPJ)
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-700">
              {formatRupiah(totalPengeluaran)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{data.buktiPengeluaran.length} Kwitansi Transaksi</span>
              <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                {persentaseSerapan}% Terserap
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${persentaseSerapan}%` }}
            />
          </div>
        </div>

        {/* Card 3: Sisa Saldo Kas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sisa Saldo Kas / Bank
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`text-xl sm:text-2xl font-black ${
                sisaKas < 0 ? 'text-rose-600' : 'text-blue-700'
              }`}
            >
              {formatRupiah(sisaKas)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{sisaKas === 0 ? 'Saldo Nihil (Habis)' : 'Sisa Kas Tunai/Bank'}</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${
                  sisaKas < 0
                    ? 'bg-rose-100 text-rose-800'
                    : sisaKas === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {sisaKas < 0 ? 'Defisit' : sisaKas === 0 ? 'Nihil' : 'Balance'}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full ${sisaKas < 0 ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.max(0, 100 - persentaseSerapan)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Pajak & NTPN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pajak Terpotong (NTPN)
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-rose-700">
              {formatRupiah(totalPajak)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>
                {data.rekapPajak.length === 0
                  ? 'Status: NIHIL'
                  : `${data.rekapPajak.length} Setoran Pajak`}
              </span>
              <span className="text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                PPh & PPN
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-rose-500 h-full w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. WORKFLOW MENU PER-HALAMAN GRID */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Struktur Menu & Alur Kerja Penyusunan LPJ (Menu I s/d IX)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik salah satu tahapan di bawah untuk langsung menuju formulir atau pratinjau
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              Progres: <strong className="text-emerald-700">{completenessPercent}% Lengkap</strong>
            </span>
          </div>
        </div>

        {/* Menu I Highlights banner */}
        <div className="mb-3.5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              I
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                Menu I: Dashboard Terdiri Dari Identitas Madrasah & Periode
              </h3>
              <p className="text-[11px] text-slate-600">
                Lengkapi identitas profil lembaga madrasah serta penetapan tahun anggaran & tahap BOS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              1. Identitas & Sampul
            </button>
            <button
              type="button"
              onClick={() => onNavigate('periode')}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              2. Tahun & Periode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Menu II */}
          <button
            type="button"
            onClick={() => onNavigate('sumber')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              II
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                II. Sumber Dana & Pagu (Form K-1)
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {data.sumberDana.length} Sumber Penerimaan
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-2">
                {formatRupiah(totalPenerimaan)}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu III */}
          <button
            type="button"
            onClick={() => onNavigate('realisasi')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              III
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                III. Realisasi Kegiatan (Erkam)
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {data.realisasiKegiatan.length} Kegiatan 8 Standar SNP
              </p>
              <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-2">
                {formatRupiah(totalRealisasiSNP)}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu IV */}
          <button
            type="button"
            onClick={() => onNavigate('bukti')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              IV
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 truncate">
                IV. Bukti Pengeluaran & SPJ
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {data.buktiPengeluaran.length} Bukti SPJ Belanja
              </p>
              <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-2">
                {formatRupiah(totalPengeluaran)}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu V */}
          <button
            type="button"
            onClick={() => onNavigate('pajak')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              V
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-700 truncate">
                V. Rekapitulasi Pajak
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                PPh 21, 22, 23 & PPN (NTPN)
              </p>
              <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-2">
                {data.rekapPajak.length === 0 ? 'Nihil' : `${data.rekapPajak.length} Setoran`}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu VI */}
          <button
            type="button"
            onClick={() => onNavigate('pesanan')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              VI
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 truncate">
                VI. Nota Pesanan Toko & BAST
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Surat Pesanan & Berita Acara
              </p>
              <span className="inline-block text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded mt-2">
                {(data.notaPesananBast?.length || 0) === 0 ? 'Nihil' : `${data.notaPesananBast?.length} BAST`}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu VII */}
          <button
            type="button"
            onClick={() => onNavigate('dokumentasi')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-300 bg-white hover:bg-cyan-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              VII
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 truncate">
                VII. Dokumentasi Kegiatan Foto
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Lampiran Fisik Foto Kegiatan
              </p>
              <span className="inline-block text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded mt-2">
                {data.dokumentasi.length} Foto Terlampir
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu VIII */}
          <button
            type="button"
            onClick={() => onNavigate('sptjb')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              VIII
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                VIII. SPTJB & Pejabat Penandatangan
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Kepala: {data.pejabat.namaKepala || 'Belum diisi'}
              </p>
              <span className="inline-block text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded mt-2">
                Legalitas Dokumen
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Menu IX: Generate LPJ Highlights Card */}
          <button
            type="button"
            onClick={() => {
              onGenerate();
              onNavigate('preview');
            }}
            className="sm:col-span-2 lg:col-span-2 p-4.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-left transition-all group flex items-center justify-between gap-4 cursor-pointer shadow-md hover:shadow-lg active:scale-99"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-base shrink-0 backdrop-blur-xs">
                IX
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black truncate">
                    IX. Generate LPJ & Pratinjau Dokumen
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-400/30 text-emerald-100 rounded-md text-[10px] font-bold">
                    Siap Cetak & Word
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5 truncate">
                  Klik untuk membuka pratinjau lengkap, cetak langsung atau unduh Microsoft Word (.doc)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-block text-xs font-black bg-white text-emerald-800 px-3.5 py-1.5 rounded-xl shadow-xs">
                Buka Pratinjau
              </span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. REALISASI SNP & VERIFIKASI DOKUMEN (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Realisasi 8 SNP Breakdown */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Distribusi Anggaran 8 Standar SNP (e-RKAM)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Realisasi belanja per Standar Nasional Pendidikan
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                {data.realisasiKegiatan.length} Kegiatan
              </span>
            </div>

            <div className="space-y-3 mt-2">
              {snpStats.map((item, idx) => {
                const percent =
                  totalPenerimaan > 0
                    ? Math.round((item.nominal / totalPenerimaan) * 100)
                    : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-semibold truncate max-w-[220px] sm:max-w-[280px]">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-900 font-bold">
                          {formatRupiah(item.nominal)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({percent}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Terverifikasi di e-RKAM</span>
            <span className="text-sm font-black text-indigo-900">
              {formatRupiah(totalRealisasiSNP)}
            </span>
          </div>
        </div>

        {/* Checklist Kelengkapan Dokumen */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Checklist Kelengkapan LPJ</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi syarat kepatuhan BOS Kemenag
                </p>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {completedChecksCount} / {checks.length}
              </span>
            </div>

            <div className="space-y-2 mt-2 divide-y divide-slate-100">
              {checks.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.page)}
                  className="pt-2 first:pt-0 flex items-start justify-between gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {item.status ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Simpan Draf</span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Muat Data Contoh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS PREVIEW (SPJ) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-600" />
              <span>Transaksi Pengeluaran & Kwitansi Terbaru (FORM K-3/K-7)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian kwitansi belanja yang tercatat dalam berkas SPJ
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('bukti')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Kelola Semua SPJ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3 rounded-l-xl">No. Bukti</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Penerima</th>
                <th className="py-2.5 px-3">Uraian Pembayaran</th>
                <th className="py-2.5 px-3">Kode Akun</th>
                <th className="py-2.5 px-3 text-right rounded-r-xl">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.buktiPengeluaran.slice(0, 5).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                    {item.noBukti || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{item.tanggal || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-semibold">{item.penerima || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                    {item.uraian || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">{item.kodeAkun || '-'}</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">
                    {formatRupiah(item.nominal)}
                  </td>
                </tr>
              ))}
              {data.buktiPengeluaran.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Belum ada bukti transaksi SPJ yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
