import React, { useState } from 'react';
import { LPJFullData } from '../../types/lpj';
import { formatRupiah, terbilang, formatDateIndo } from '../../utils/numberToWords';
import { PaperSize } from '../../utils/exportDoc';
import { FontSizeScale, MarginPreset } from '../../utils/exportPdf';
import { KemenagLogo } from '../KemenagLogo';
import { 
  FileText, 
  ShieldCheck, 
  Table, 
  Receipt, 
  Landmark, 
  Image, 
  BookOpen, 
  CheckCircle2, 
  FileCheck,
  Award,
  ShoppingBag,
  FileCheck2,
  PackageCheck,
  Type,
  Maximize2,
  Printer,
  Download,
  Sliders
} from 'lucide-react';

interface DocumentViewerProps {
  data: LPJFullData;
  isGenerated: boolean;
  onGenerate: () => void;
  paperSize?: PaperSize;
  onPaperSizeChange?: (size: PaperSize) => void;
  fontSizeScale?: FontSizeScale;
  onFontSizeScaleChange?: (scale: FontSizeScale) => void;
  marginPreset?: MarginPreset;
  onMarginPresetChange?: (margin: MarginPreset) => void;
  onPrint?: () => void;
  onDownloadPdf?: () => void;
  onDownloadWord?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  data,
  isGenerated,
  onGenerate,
  paperSize = 'A4',
  onPaperSizeChange,
  fontSizeScale = 'large',
  onFontSizeScaleChange,
  marginPreset = 'standard',
  onMarginPresetChange,
  onPrint,
  onDownloadPdf,
  onDownloadWord,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'cover' | 'pengesahan' | 'sptjb' | 'sumber' | 'rkam' | 'bku' | 'pajak' | 'pesanan' | 'bast' | 'dok'>('all');

  const totalPenerimaan = data.sumberDana.reduce((acc, curr) => acc + (Number(curr.diterima) || 0), 0);
  const totalPagu = data.sumberDana.reduce((acc, curr) => acc + (Number(curr.alokasiPagu ?? curr.diterima) || 0), 0);
  const totalRealisasi = data.realisasiKegiatan.reduce((acc, curr) => acc + (Number(curr.realisasi) || 0), 0);
  const totalAnggaran = data.realisasiKegiatan.reduce((acc, curr) => acc + (Number(curr.anggaran) || 0), 0);
  const totalPengeluaran = data.buktiPengeluaran.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const totalPajak = data.rekapPajak.reduce((acc, curr) => acc + (Number(curr.jumlahPajak) || 0), 0);
  const sisaSaldo = totalPenerimaan - totalPengeluaran;

  if (!isGenerated) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-5 border border-emerald-100 shadow-inner">
          <FileText className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Area Pratinjau Dokumen LPJ</h3>
        <p className="text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">
          Silakan lengkapi atau periksa formulir di sebelah kiri, kemudian klik tombol hijau besar di atas untuk menghasilkan Laporan Pertanggungjawaban (LPJ) resmi.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          className="mt-6 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-base rounded-xl shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>BUAT LPJ SEKARANG</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pengaturan Cetak & Skala Tulisan (Print Control Toolbar) */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-inner shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Pengaturan Cetak & Tampilan Penuh
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-mono">
                Penuh Batas Kertas
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Sesuaikan ukuran huruf cetakan dan batas tepi halaman agar pas dan jelas dibaca
            </p>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Ukuran Huruf / Skala Teks */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 pl-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tulisan:</span>
            </span>
            <select
              value={fontSizeScale}
              onChange={(e) => onFontSizeScaleChange?.(e.target.value as FontSizeScale)}
              className="bg-slate-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="large">Besar / Jelas (12pt / 110% - Direkomendasikan)</option>
              <option value="extra">Ekstra Besar (13pt / 125% - Penuh)</option>
              <option value="normal">Standar (11pt / 100%)</option>
              <option value="compact">Kompak (10pt / 90%)</option>
            </select>
          </div>

          {/* Margin Batas Halaman */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 pl-2 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Margin:</span>
            </span>
            <select
              value={marginPreset}
              onChange={(e) => onMarginPresetChange?.(e.target.value as MarginPreset)}
              className="bg-slate-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="standard">Standar Penuh (Kiri 2cm, Kanan/Atas 1.5cm)</option>
              <option value="tight">Margin Rapat (1cm - Maksimal Penuh)</option>
              <option value="spacious">Standar Jilid (Kiri 2.5cm, Kanan 2cm)</option>
            </select>
          </div>

          {/* Ukuran Kertas */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 pl-2">Kertas:</span>
            <button
              type="button"
              onClick={() => onPaperSizeChange?.('A4')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                paperSize === 'A4'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              A4
            </button>
            <button
              type="button"
              onClick={() => onPaperSizeChange?.('F4')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                paperSize === 'F4'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              F4 / Folio
            </button>
          </div>

          {/* Quick PDF Direct Button */}
          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
              title="Unduh Berkas PDF Resmi (.pdf) Tanpa Header & Footer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
          )}

          {/* Quick Word Button */}
          {onDownloadWord && (
            <button
              type="button"
              onClick={onDownloadWord}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
              title="Unduh File Microsoft Word (.doc)"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Word</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation for Document Pages - Modern Glass UI/UX */}
      <div className="no-print bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-700/30 ring-1 ring-emerald-500'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Semua Dokumen (Buku LPJ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cover')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'cover'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sampul</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pengesahan')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'pengesahan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Pengesahan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sptjb')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'sptjb'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SPTJB</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sumber')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'sumber'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Sumber Dana (K-1)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rkam')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'rkam'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Realisasi (K-2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bku')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'bku'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>SPJ (K-3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pajak')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'pajak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Rekap Pajak (K-6)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pesanan')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'pesanan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Nota Pesanan ({data.notaPesananBast?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bast')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'bast'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>BAST ({data.notaPesananBast?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dok')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'dok'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Lampiran Foto ({data.dokumentasi.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-emerald-900 bg-emerald-50/90 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{activeTab === 'all' ? 'Format Cetak: 1 Halaman Per Dokumen / Menu' : `Pratinjau: ${activeTab.toUpperCase()}`}</span>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div id="lpj-print-container" className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm text-slate-900 font-serif-official doc-scale-${fontSizeScale}`}>
        
        {/* ======================================================== */}
        {/* 1. COVER / SAMPUL RESMI (Pas 1 Halaman A4)               */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'cover') && (
          <div className="print-sheet">
            <div className="border-4 border-double border-slate-900 p-6 sm:p-10 text-center flex flex-col justify-between print-cover-frame min-h-[750px] sm:min-h-[820px] box-border">
              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase text-slate-900">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h3>
                <h4 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-700 mt-0.5">
                  DIREKTORAT JENDERAL PENDIDIKAN ISLAM
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}
                </p>
              </div>

              {/* Logo Kemenag Center */}
              <div className="my-5 flex justify-center">
                <KemenagLogo size={92} />
              </div>

              <div>
                <div className="border-t-2 border-b-2 border-slate-900 py-3 my-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                    LAPORAN PERTANGGUNGJAWABAN (LPJ)
                  </h1>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase mt-1">
                    BENDAHARA BANTUAN OPERASIONAL SEKOLAH (BOS)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-2 uppercase tracking-wide">
                  PERIODE: {data.periode.tahap} TAHUN ANGGARAN {data.periode.tahunAnggaran}
                </p>
              </div>

              {/* Identitas Madrasah (Disederhanakan & Tanpa Desa) */}
              <div className="my-4 py-2 text-center">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wider uppercase mb-1">
                  Disusun Oleh:
                </p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                  {data.profile.namaMadrasah}
                </h2>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1">
                  NSM: {data.profile.nsm} &nbsp;|&nbsp; NPSN: {data.profile.npsn}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {data.profile.alamat ? `${data.profile.alamat}, ` : ''}Kec. {data.profile.kecamatan}, Kab. {data.profile.kabupaten}
                </p>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-700 pt-3 border-t border-slate-300">
                <p className="font-bold tracking-wide uppercase">KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}</p>
                <p className="font-semibold tracking-wide uppercase">PROVINSI {data.profile.provinsi.toUpperCase()}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Tahun Anggaran {data.periode.tahunAnggaran}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 2. LEMBAR PENGESAHAN LPJ BOS                              */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'pengesahan') && (
          <div className="print-sheet my-4">
            {/* Kop Surat */}
            <table className="no-border-table w-full mb-2">
              <tbody>
                <tr>
                  <td className="w-16 text-center align-middle border-0 p-0">
                    <KemenagLogo size={55} />
                  </td>
                  <td className="text-center align-middle border-0 px-2 py-0">
                    <div className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                      KEMENTERIAN AGAMA REPUBLIK INDONESIA
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-700">
                      KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}
                    </div>
                    <div className="text-sm sm:text-base font-black uppercase text-slate-950">
                      {data.profile.namaMadrasah}
                    </div>
                    <div className="text-[10px] text-slate-600 font-sans">
                      {data.profile.alamat}, Kec. {data.profile.kecamatan}, Kab. {data.profile.kabupaten} • Telp: {data.profile.telepon || '-'}, Email: {data.profile.email || '-'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t-2 border-b-4 border-slate-900 h-1 mb-5" />

            <div className="text-center mb-5">
              <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wide">
                LEMBAR PENGESAHAN LAPORAN PERTANGGUNGJAWABAN
              </h3>
              <p className="text-xs font-semibold text-slate-600 font-sans mt-0.5">
                BANTUAN OPERASIONAL SEKOLAH (BOS) TAHUN ANGGARAN {data.periode.tahunAnggaran}
              </p>
            </div>

            <div className="text-xs sm:text-sm space-y-3 leading-relaxed text-slate-800 text-justify">
              <p className="indent-6">
                Laporan Pertanggungjawaban (LPJ) Penggunaan Dana Bantuan Operasional Sekolah (BOS) pada <b>{data.profile.namaMadrasah}</b> Periode <b>{data.periode.tahap}</b> Tahun Anggaran <b>{data.periode.tahunAnggaran}</b> telah diperiksa, diverifikasi, dan disetujui sesuai dengan Petunjuk Teknis Pengelolaan Dana BOS Madrasah Kementerian Agama Republik Indonesia.
              </p>

              <table className="no-border-table w-full text-xs sm:text-sm my-3 border-collapse">
                <tbody>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">1. Nama Madrasah</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-bold text-slate-900">{data.profile.namaMadrasah}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">2. Nomor Statistik Madrasah (NSM)</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-semibold text-slate-900 tracking-wide font-sans">{data.profile.nsm || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">3. Nomor Pokok Sekolah Nasional (NPSN)</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-semibold text-slate-900 tracking-wide font-sans">{data.profile.npsn || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">4. Jenjang & Status Madrasah</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top">{data.profile.jenjang} / {data.profile.status.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">5. Total Dana BOS Diterima</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-bold text-emerald-800 font-sans">{formatRupiah(totalPenerimaan)}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">6. Total Belanja / Pengeluaran (SPJ)</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-bold text-amber-800 font-sans">{formatRupiah(totalPengeluaran)}</td>
                  </tr>
                  <tr>
                    <td className="w-[280px] border-0 py-1 font-semibold align-top whitespace-nowrap">7. Sisa Saldo Kas / Bank</td>
                    <td className="w-4 border-0 py-1 text-center align-top">:</td>
                    <td className="border-0 py-1 align-top font-bold text-blue-800 font-sans">{formatRupiah(sisaSaldo)}</td>
                  </tr>
                </tbody>
              </table>

              <p className="indent-6">
                Demikian lembar pengesahan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
              </p>
            </div>

            {/* Tanda Tangan Pengesahan */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-8 pt-4 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Ketua Komite Madrasah</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKetuaKomite || 'H. Daeng Rahman, S.Sos'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.pejabat.tanggalPengesahan)}</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 3. SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJB)        */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'sptjb') && (
          <div className="print-sheet my-4">
            {/* Kop Surat Madrasah */}
            <table className="no-border-table w-full mb-2">
              <tbody>
                <tr>
                  <td className="w-16 text-center align-middle border-0 p-0">
                    <KemenagLogo size={55} />
                  </td>
                  <td className="text-center align-middle border-0 px-2 py-0">
                    <div className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                      KEMENTERIAN AGAMA REPUBLIK INDONESIA
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-700">
                      KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}
                    </div>
                    <div className="text-sm sm:text-base font-black uppercase text-slate-950">
                      {data.profile.namaMadrasah}
                    </div>
                    <div className="text-[10px] text-slate-600 font-sans">
                      {data.profile.alamat} - Telp: {data.profile.telepon || '-'}, Email: {data.profile.email || '-'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t-2 border-b-4 border-slate-900 h-1 mb-5" />

            <div className="text-center mb-5">
              <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wide">
                SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJB)
              </h3>
              <p className="text-xs font-semibold text-slate-600 font-sans mt-0.5">
                Nomor: {data.sptjb.noSurat}
              </p>
            </div>

            <div className="text-xs sm:text-sm space-y-2.5 leading-relaxed text-slate-800">
              <p>Yang bertanda tangan di bawah ini:</p>
              
              <table className="no-border-table w-full text-xs sm:text-sm my-2 border-collapse">
                <tbody>
                  <tr>
                    <td className="w-52 border-0 py-0.5 font-semibold align-top whitespace-nowrap">1. Nama Kepala Madrasah</td>
                    <td className="w-4 border-0 py-0.5 text-center align-top">:</td>
                    <td className="border-0 py-0.5 align-top font-bold text-slate-900">{data.pejabat.namaKepala}</td>
                  </tr>
                  <tr>
                    <td className="w-52 border-0 py-0.5 font-semibold align-top whitespace-nowrap">2. NIP / NPK</td>
                    <td className="w-4 border-0 py-0.5 text-center align-top">:</td>
                    <td className="border-0 py-0.5 align-top font-sans">{data.pejabat.nipKepala || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-52 border-0 py-0.5 font-semibold align-top whitespace-nowrap">3. Jabatan</td>
                    <td className="w-4 border-0 py-0.5 text-center align-top">:</td>
                    <td className="border-0 py-0.5 align-top">Kepala {data.profile.namaMadrasah}</td>
                  </tr>
                  <tr>
                    <td className="w-52 border-0 py-0.5 font-semibold align-top whitespace-nowrap">4. Alamat Madrasah</td>
                    <td className="w-4 border-0 py-0.5 text-center align-top">:</td>
                    <td className="border-0 py-0.5 align-top">{data.profile.alamat}, Kec. {data.profile.kecamatan}, Kab. {data.profile.kabupaten}</td>
                  </tr>
                </tbody>
              </table>

              <p className="pt-1">Dengan ini menyatakan dengan sesungguhnya bahwa:</p>
              <ol className="list-decimal ml-6 space-y-1.5 text-justify">
                <li>
                  Bertanggung jawab penuh atas penggunaan dana Bantuan Operasional Sekolah (BOS) Periode <b>{data.periode.tahap}</b> Tahun Anggaran <b>{data.periode.tahunAnggaran}</b> sebesar <b>{formatRupiah(totalPenerimaan)}</b> (<i>{terbilang(totalPenerimaan)}</i>).
                </li>
                <li>
                  Realisasi belanja yang telah dibayarkan sebesar <b>{formatRupiah(totalPengeluaran)}</b> (<i>{terbilang(totalPengeluaran)}</i>) telah dilaksanakan sesuai dengan Rencana Kerja dan Anggaran Madrasah (RKAM) serta petunjuk teknis yang berlaku.
                </li>
                <li>
                  Seluruh bukti-bukti pengeluaran berupa kwitansi, faktur/nota, daftar honor, dan bukti fisik pengadaan barang/jasa yang sah dan lengkap telah diperiksa dan disimpan dengan aman di madrasah untuk keperluan pemeriksaan/audit.
                </li>
                <li>
                  Kewajiban perpajakan atas transaksi pengeluaran dana BOS sebesar <b>{formatRupiah(totalPajak)}</b> telah dipungut dan disetorkan ke Kas Negara sesuai perundang-undangan perpajakan.
                </li>
                <li>
                  Apabila di kemudian hari terdapat kekeliruan atau ketidaksesuaian atas penggunaan dana BOS tersebut, saya bersedia bertanggung jawab secara hukum dan mengembalikan kerugian ke Kas Negara.
                </li>
              </ol>

              <p className="pt-1">
                Demikian Surat Pernyataan Tanggung Jawab Belanja ini dibuat dengan sadar dan penuh rasa tanggung jawab.
              </p>
            </div>

            {/* Tanda Tangan SPTJB */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-6 pt-3 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Ketua Komite Madrasah</p>
                <div className="h-16" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKetuaKomite || 'H. Daeng Rahman, S.Sos'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.sptjb.tanggalSurat)}</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <p className="text-[10px] text-slate-400 font-sans">(Materai Rp 10.000)</p>
                <div className="h-12" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 4. FORM BOS K-1 (LAPORAN SUMBER DANA - 1 HALAMAN PAS)     */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'sumber') && (
          <div className="print-sheet my-4">
            <div className="text-center mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                FORM BOS K-1
              </h3>
              <h2 className="text-sm sm:text-base font-bold uppercase">
                LAPORAN PENGGUNAAN DANA PER SUMBER DANA
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Periode: {data.periode.tahap} • Tahun Anggaran {data.periode.tahunAnggaran}
              </p>
            </div>

            <table className="w-full text-xs border-collapse border border-slate-800 text-left">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-2 w-10">No</th>
                  <th className="border border-slate-800 p-2">Sumber Penerimaan Dana BOS</th>
                  <th className="border border-slate-800 p-2">No. Rekening / Bank</th>
                  <th className="border border-slate-800 p-2 text-right">Pagu Anggaran</th>
                  <th className="border border-slate-800 p-2 text-right">Jumlah Diterima</th>
                  <th className="border border-slate-800 p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data.sumberDana.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-300">
                    <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-800 p-2 font-bold">{item.namaSumber}</td>
                    <td className="border border-slate-800 p-2 text-slate-600 font-sans">{item.noRekening}</td>
                    <td className="border border-slate-800 p-2 text-right font-sans">{formatRupiah(item.alokasiPagu ?? item.diterima)}</td>
                    <td className="border border-slate-800 p-2 text-right font-bold text-emerald-800 font-sans">{formatRupiah(item.diterima)}</td>
                    <td className="border border-slate-800 p-2 text-slate-600">{item.keterangan}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <td colSpan={3} className="border border-slate-800 p-2 text-right uppercase">
                    TOTAL PENERIMAAN DANA BOS:
                  </td>
                  <td className="border border-slate-800 p-2 text-right font-sans">
                    {formatRupiah(totalPagu)}
                  </td>
                  <td className="border border-slate-800 p-2 text-right text-emerald-900 font-sans">
                    {formatRupiah(totalPenerimaan)}
                  </td>
                  <td className="border border-slate-800 p-2">-</td>
                </tr>
              </tbody>
            </table>

            {/* Tanda Tangan Form K-1 */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-8 pt-4 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.pejabat.tanggalPengesahan)}</p>
                <p className="font-bold">Bendahara Dana BOS</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaBendahara}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipBendahara || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 5. FORM BOS K-2 (REALISASI 8 STANDAR RKAM - 1 HALAMAN PAS)*/}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'rkam') && (
          <div className="print-sheet my-4">
            <div className="text-center mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                FORM BOS K-2
              </h3>
              <h2 className="text-sm sm:text-base font-bold uppercase">
                LAPORAN REALISASI PENGGUNAAN DANA PER KEGIATAN (8 STANDAR RKAM)
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Rekapitulasi Serapan Anggaran Berdasarkan Standar Nasional Pendidikan
              </p>
            </div>

            <table className="w-full text-xs border-collapse border border-slate-800 text-left">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-2 w-8">No</th>
                  <th className="border border-slate-800 p-2">Standar SNP / RKAM</th>
                  <th className="border border-slate-800 p-2 w-16">Kode</th>
                  <th className="border border-slate-800 p-2">Uraian Nama Kegiatan</th>
                  <th className="border border-slate-800 p-2 text-center w-14">Vol</th>
                  <th className="border border-slate-800 p-2 text-right">Anggaran</th>
                  <th className="border border-slate-800 p-2 text-right">Realisasi</th>
                  <th className="border border-slate-800 p-2 text-center w-12">%</th>
                </tr>
              </thead>
              <tbody>
                {data.realisasiKegiatan.map((item, idx) => {
                  const pct = item.anggaran > 0 ? ((item.realisasi / item.anggaran) * 100).toFixed(0) : 0;
                  return (
                    <tr key={item.id} className="border-b border-slate-300">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-medium">{item.standarSNP}</td>
                      <td className="border border-slate-800 p-2 text-center font-mono text-[11px]">{item.kodeKegiatan}</td>
                      <td className="border border-slate-800 p-2">{item.namaKegiatan}</td>
                      <td className="border border-slate-800 p-2 text-center font-sans">{item.volume} {item.satuan}</td>
                      <td className="border border-slate-800 p-2 text-right font-sans">{formatRupiah(item.anggaran)}</td>
                      <td className="border border-slate-800 p-2 text-right font-bold font-sans text-indigo-900">{formatRupiah(item.realisasi)}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold font-sans">{pct}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <td colSpan={5} className="border border-slate-800 p-2 text-right uppercase">
                    TOTAL REALISASI KEGIATAN RKAM:
                  </td>
                  <td className="border border-slate-800 p-2 text-right font-sans">
                    {formatRupiah(totalAnggaran)}
                  </td>
                  <td className="border border-slate-800 p-2 text-right text-indigo-950 font-sans">
                    {formatRupiah(totalRealisasi)}
                  </td>
                  <td className="border border-slate-800 p-2 text-center font-sans">100%</td>
                </tr>
              </tbody>
            </table>

            {/* Tanda Tangan Form K-2 */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-8 pt-4 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.pejabat.tanggalPengesahan)}</p>
                <p className="font-bold">Bendahara Dana BOS</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaBendahara}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipBendahara || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 6. FORM BOS K-3: REKAPITULASI BUKTI PENGELUARAN (SPJ)    */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'bku') && (
          <div className="print-sheet my-4">
            <div className="text-center mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                FORM BOS K-3
              </h3>
              <h2 className="text-sm sm:text-base font-bold uppercase">
                REKAPITULASI BUKTI PENGELUARAN & KWITANSI (SPJ)
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Rincian Bukti Transaksi, Faktur Belanja, dan Surat Pertanggungjawaban Sah
              </p>
            </div>

            <table className="w-full text-xs border-collapse border border-slate-800 text-left">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-2 w-8">No</th>
                  <th className="border border-slate-800 p-2">No. Bukti / SPJ</th>
                  <th className="border border-slate-800 p-2 w-20">Tanggal</th>
                  <th className="border border-slate-800 p-2">Kode Akun</th>
                  <th className="border border-slate-800 p-2">Penerima / Rekanan</th>
                  <th className="border border-slate-800 p-2">Uraian Pembayaran</th>
                  <th className="border border-slate-800 p-2 text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {data.buktiPengeluaran.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-300">
                    <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-800 p-2 font-mono font-bold text-[11px]">{item.noBukti}</td>
                    <td className="border border-slate-800 p-2 text-center font-sans">{item.tanggal}</td>
                    <td className="border border-slate-800 p-2 font-sans text-slate-700">{item.kodeAkun}</td>
                    <td className="border border-slate-800 p-2 font-semibold">{item.penerima}</td>
                    <td className="border border-slate-800 p-2 text-slate-800">{item.uraian}</td>
                    <td className="border border-slate-800 p-2 text-right font-bold font-sans text-amber-900">
                      {formatRupiah(item.nominal)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <td colSpan={6} className="border border-slate-800 p-2 text-right uppercase">
                    TOTAL BELANJA / PENGELUARAN (SPJ):
                  </td>
                  <td className="border border-slate-800 p-2 text-right text-amber-950 font-sans">
                    {formatRupiah(totalPengeluaran)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Saldo Kas Ringkasan */}
            <table className="w-full mt-3 border border-slate-800 text-xs font-sans text-center bg-slate-50">
              <tbody>
                <tr>
                  <td className="border border-slate-800 p-2.5 w-1/3">
                    <span className="text-slate-500 block text-[11px]">Total Penerimaan Dana BOS:</span>
                    <b className="text-emerald-800 text-sm">{formatRupiah(totalPenerimaan)}</b>
                  </td>
                  <td className="border border-slate-800 p-2.5 w-1/3">
                    <span className="text-slate-500 block text-[11px]">Total Realisasi Belanja (SPJ):</span>
                    <b className="text-amber-800 text-sm">{formatRupiah(totalPengeluaran)}</b>
                  </td>
                  <td className="border border-slate-800 p-2.5 w-1/3">
                    <span className="text-slate-500 block text-[11px]">Sisa Saldo Kas / Bank:</span>
                    <b className="text-blue-800 text-sm">{formatRupiah(sisaSaldo)}</b>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tanda Tangan Form K-3 */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-8 pt-4 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.pejabat.tanggalPengesahan)}</p>
                <p className="font-bold">Bendahara Dana BOS</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaBendahara}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipBendahara || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 7. FORM BOS K-6: REKAPITULASI PAJAK (PPh & PPN)           */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'pajak') && (
          <div className="print-sheet my-4">
            <div className="text-center mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                FORM BOS K-6
              </h3>
              <h2 className="text-sm sm:text-base font-bold uppercase">
                REKAPITULASI PEMOTONGAN DAN PENYETORAN PAJAK
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Daftar Pemotongan PPh Pasal 21, 22, 23 dan PPN Beserta Bukti Setor NTPN
              </p>
            </div>

            <table className="w-full text-xs border-collapse border border-slate-800 text-left">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-2 w-8">No</th>
                  <th className="border border-slate-800 p-2">No. Bukti Transaksi</th>
                  <th className="border border-slate-800 p-2">Jenis Pajak</th>
                  <th className="border border-slate-800 p-2 text-right">Dasar Pajak (DPP)</th>
                  <th className="border border-slate-800 p-2 text-center w-12">Tarif</th>
                  <th className="border border-slate-800 p-2 text-right">Jumlah Pajak (Rp)</th>
                  <th className="border border-slate-800 p-2">NTPN / Kode Billing</th>
                  <th className="border border-slate-800 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.rekapPajak.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-slate-800 p-4 text-center text-slate-600 italic font-sans">
                      - NIHIL (Tidak Ada Pemotongan dan Penyetoran Pajak pada Periode Ini) -
                    </td>
                  </tr>
                ) : (
                  data.rekapPajak.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-300">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-mono text-[11px]">{item.noBukti}</td>
                      <td className="border border-slate-800 p-2 font-bold">{item.jenisPajak}</td>
                      <td className="border border-slate-800 p-2 text-right font-sans">{formatRupiah(item.dpp)}</td>
                      <td className="border border-slate-800 p-2 text-center font-sans">{item.tarif}%</td>
                      <td className="border border-slate-800 p-2 text-right font-bold font-sans text-rose-900">
                        {formatRupiah(item.jumlahPajak)}
                      </td>
                      <td className="border border-slate-800 p-2 font-mono text-[11px]">{item.ntpn || '-'}</td>
                      <td className="border border-slate-800 p-2 text-center font-sans text-emerald-800 font-semibold">
                        {item.statusSetor}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <td colSpan={5} className="border border-slate-800 p-2 text-right uppercase">
                    TOTAL PAJAK TERSETOREKAN:
                  </td>
                  <td className="border border-slate-800 p-2 text-right text-rose-950 font-sans">
                    {formatRupiah(totalPajak)}
                  </td>
                  <td colSpan={2} className="border border-slate-800 p-2 text-center">-</td>
                </tr>
              </tbody>
            </table>

            {/* Lembar Tanda Tangan Laporan Realisasi & Pajak */}
            <div className="signature-block grid grid-cols-2 gap-4 mt-8 pt-4 text-xs sm:text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {data.profile.namaMadrasah}</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaKepala}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipKepala || '-'}</p>
              </div>

              <div className="text-center">
                <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(data.pejabat.tanggalPengesahan)}</p>
                <p className="font-bold">Bendahara Dana BOS</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pejabat.namaBendahara}</p>
                <p className="font-sans text-xs">NIP. {data.pejabat.nipBendahara || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && (data.notaPesananBast?.length || 0) > 0 && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 7. SURAT / NOTA PESANAN BARANG KE TOKO                   */}
        {/* ======================================================== */}
        {((activeTab === 'all' && (data.notaPesananBast?.length || 0) > 0) || activeTab === 'pesanan') && (
          <div>
            {(!data.notaPesananBast || data.notaPesananBast.length === 0) ? (
              <div className="print-sheet my-4 p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Status: Tidak Ada Surat / Nota Pesanan Toko (Nihil)</p>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan menu <b>7. Nota Pesanan Toko & BAST</b> untuk membuat atau menghasilkan Surat Pesanan otomatis jika diperlukan.
                </p>
              </div>
            ) : (
              data.notaPesananBast.map((sp, idx) => (
                <div key={`sp-doc-${sp.id}`} className="print-sheet my-4 avoid-break">
                  {/* Kop Surat Madrasah */}
                  <table className="no-border-table w-full mb-2">
                    <tbody>
                      <tr>
                        <td className="w-16 text-center align-middle border-0 p-0">
                          <KemenagLogo size={55} />
                        </td>
                        <td className="text-center align-middle border-0 px-2 py-0">
                          <div className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                            KEMENTERIAN AGAMA REPUBLIK INDONESIA
                          </div>
                          <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-700">
                            KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}
                          </div>
                          <div className="text-sm sm:text-base font-black uppercase text-slate-950">
                            {data.profile.namaMadrasah}
                          </div>
                          <div className="text-[10px] text-slate-600 font-sans">
                            {data.profile.alamat}, Kec. {data.profile.kecamatan}, Kab. {data.profile.kabupaten} • Telp: {data.profile.telepon || '-'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="border-t-2 border-b-4 border-slate-900 h-1 mb-4" />

                  {/* Header Judul Surat Pesanan */}
                  <div className="text-center mb-4">
                    <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wide">
                      SURAT PESANAN (SP) / NOTA PESANAN BARANG
                    </h3>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                      Nomor: {sp.noSuratPesanan}
                    </p>
                  </div>

                  <div className="text-xs sm:text-sm space-y-3 leading-relaxed text-slate-800">
                    <p>Kepada Yth.</p>
                    <div className="pl-4 -mt-2">
                      <p className="font-bold">{sp.namaPenyedia || sp.namaToko}</p>
                      <p className="font-semibold text-slate-700">{sp.namaToko}</p>
                      <p className="text-slate-600">{sp.alamatToko}</p>
                      {sp.teleponToko && <p className="text-slate-600">Telp/HP: {sp.teleponToko}</p>}
                    </div>

                    <p className="text-justify">
                      Dengan hormat, sehubungan dengan pelaksanaan kegiatan Bantuan Operasional Sekolah (BOS) Tahap <b>{data.periode.tahap}</b> Tahun Anggaran <b>{data.periode.tahunAnggaran}</b> pada <b>{data.profile.namaMadrasah}</b>, bersama ini kami mengajukan pesanan barang/pekerjaan dengan rincian sebagai berikut:
                    </p>

                    {/* Tabel Daftar Barang Pesanan */}
                    <table className="w-full text-xs sm:text-sm border-collapse border border-slate-800 my-2">
                      <thead>
                        <tr className="bg-slate-100 font-bold">
                          <th className="border border-slate-800 p-2 text-center w-10">No</th>
                          <th className="border border-slate-800 p-2 text-left">Nama Barang / Uraian</th>
                          <th className="border border-slate-800 p-2 text-left">Spesifikasi / Merk</th>
                          <th className="border border-slate-800 p-2 text-center w-16">Jumlah</th>
                          <th className="border border-slate-800 p-2 text-center w-20">Satuan</th>
                          <th className="border border-slate-800 p-2 text-right w-28">Harga Satuan (Rp)</th>
                          <th className="border border-slate-800 p-2 text-right w-32">Total Harga (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sp.itemsBarang.map((item, bIdx) => (
                          <tr key={item.id} className="border-b border-slate-300">
                            <td className="border border-slate-800 p-2 text-center">{bIdx + 1}</td>
                            <td className="border border-slate-800 p-2 font-semibold">{item.namaBarang}</td>
                            <td className="border border-slate-800 p-2 text-slate-600">{item.spesifikasi || '-'}</td>
                            <td className="border border-slate-800 p-2 text-center font-sans">{item.volume}</td>
                            <td className="border border-slate-800 p-2 text-center font-sans">{item.satuan}</td>
                            <td className="border border-slate-800 p-2 text-right font-sans">{formatRupiah(item.hargaSatuan)}</td>
                            <td className="border border-slate-800 p-2 text-right font-sans font-bold">{formatRupiah(item.totalHarga)}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                          <td colSpan={6} className="border border-slate-800 p-2 text-right uppercase">
                            TOTAL NILAI PESANAN:
                          </td>
                          <td className="border border-slate-800 p-2 text-right font-bold font-sans text-emerald-950">
                            {formatRupiah(sp.totalNominal)}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-xs">
                      <p className="font-semibold text-slate-900">
                        Terbilang: <span className="font-bold italic uppercase">{terbilang(sp.totalNominal)} RUPIAH</span>
                      </p>
                    </div>

                    {/* Ketentuan Pemesanan */}
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="font-bold">Ketentuan & Syarat Pemesanan:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Waktu Penyerahan Barang: <b>{sp.waktuPenyerahan}</b>.</li>
                        <li>Tempat Penyerahan Barang: <b>{sp.tempatPenyerahan}</b>.</li>
                        <li>Barang yang dikirim harus dalam keadaan 100% baru, berkualitas baik, dan sesuai dengan spesifikasi di atas.</li>
                        <li>Pembayaran akan dilakukan setelah barang diperiksa dan dituangkan dalam Berita Acara Serah Terima (BAST) serta kuitansi resmi Dana BOS.</li>
                      </ol>
                    </div>

                    {/* Tanda Tangan SP */}
                    <div className="signature-block grid grid-cols-2 gap-4 mt-6 pt-4 text-xs sm:text-sm">
                      <div className="text-center">
                        <p>Menerima dan Menyetujui,</p>
                        <p className="font-bold">{sp.namaToko}</p>
                        <div className="h-20" />
                        <p className="font-bold underline uppercase">{sp.namaPenyedia}</p>
                        <p className="font-sans text-xs">{sp.jabatanPenyedia || 'Pimpinan / Pemilik'}</p>
                      </div>

                      <div className="text-center">
                        <p>{data.pejabat.tempatPembuatan}, {formatDateIndo(sp.tanggalPesanan)}</p>
                        <p className="font-bold">Pejabat Pemesan / Kepala Madrasah</p>
                        <div className="h-20" />
                        <p className="font-bold underline uppercase">{sp.namaPemesan || data.pejabat.namaKepala}</p>
                        <p className="font-sans text-xs">NIP. {sp.nipPemesan || data.pejabat.nipKepala || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {idx < (data.notaPesananBast?.length || 0) - 1 && (
                    <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && (data.notaPesananBast?.length || 0) > 0 && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 8. BERITA ACARA SERAH TERIMA (BAST) HASIL PEKERJAAN/BARANG */}
        {/* ======================================================== */}
        {((activeTab === 'all' && (data.notaPesananBast?.length || 0) > 0) || activeTab === 'bast') && (
          <div>
            {(!data.notaPesananBast || data.notaPesananBast.length === 0) ? (
              <div className="print-sheet my-4 p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
                <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Status: Tidak Ada Berita Acara Serah Terima / BAST (Nihil)</p>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan menu <b>7. Nota Pesanan Toko & BAST</b> untuk membuat atau menghasilkan BAST otomatis jika diperlukan.
                </p>
              </div>
            ) : (
              data.notaPesananBast.map((bast, idx) => (
                <div key={`bast-doc-${bast.id}`} className="print-sheet my-4 avoid-break">
                  {/* Kop Surat Madrasah */}
                  <table className="no-border-table w-full mb-2">
                    <tbody>
                      <tr>
                        <td className="w-16 text-center align-middle border-0 p-0">
                          <KemenagLogo size={55} />
                        </td>
                        <td className="text-center align-middle border-0 px-2 py-0">
                          <div className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                            KEMENTERIAN AGAMA REPUBLIK INDONESIA
                          </div>
                          <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-700">
                            KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA {data.profile.kabupaten.toUpperCase()}
                          </div>
                          <div className="text-sm sm:text-base font-black uppercase text-slate-950">
                            {data.profile.namaMadrasah}
                          </div>
                          <div className="text-[10px] text-slate-600 font-sans">
                            {data.profile.alamat}, Kec. {data.profile.kecamatan}, Kab. {data.profile.kabupaten} • Telp: {data.profile.telepon || '-'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="border-t-2 border-b-4 border-slate-900 h-1 mb-4" />

                  {/* Header Judul BAST */}
                  <div className="text-center mb-4">
                    <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wide">
                      BERITA ACARA SERAH TERIMA (BAST) BARANG / JASA
                    </h3>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                      Nomor: {bast.noBast}
                    </p>
                  </div>

                  <div className="text-xs sm:text-sm space-y-3 leading-relaxed text-slate-800 text-justify">
                    <p className="indent-6">
                      Pada hari ini <b>{bast.hariBast || 'Senin'}</b>, tanggal <b>{formatDateIndo(bast.tanggalBast)}</b>, bertempat di <b>{bast.tempatPenyerahan || data.profile.namaMadrasah}</b>, kami yang bertanda tangan di bawah ini:
                    </p>

                    {/* Identitas Para Pihak */}
                    <table className="no-border-table w-full text-xs sm:text-sm my-2">
                      <tbody>
                        <tr>
                          <td className="w-6 border-0 py-0.5 font-bold align-top">I.</td>
                          <td className="w-36 border-0 py-0.5 font-bold align-top">Nama</td>
                          <td className="border-0 py-0.5 align-top">: <b>{bast.namaPenyedia}</b></td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td className="border-0 py-0.5 text-slate-600">Jabatan</td>
                          <td className="border-0 py-0.5">: {bast.jabatanPenyedia || 'Pimpinan / Pemilik'} ({bast.namaToko})</td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td className="border-0 py-0.5 text-slate-600">Alamat</td>
                          <td className="border-0 py-0.5">: {bast.alamatToko}</td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td colSpan={2} className="border-0 py-0.5 font-semibold text-slate-700 italic">
                            Selanjutnya disebut sebagai <b>PIHAK PERTAMA (Yang Menyerahkan)</b>.
                          </td>
                        </tr>

                        <tr><td colSpan={3} className="border-0 py-1"></td></tr>

                        <tr>
                          <td className="w-6 border-0 py-0.5 font-bold align-top">II.</td>
                          <td className="w-36 border-0 py-0.5 font-bold align-top">Nama</td>
                          <td className="border-0 py-0.5 align-top">: <b>{bast.namaPemesan || data.pejabat.namaKepala}</b></td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td className="border-0 py-0.5 text-slate-600">NIP</td>
                          <td className="border-0 py-0.5">: {bast.nipPemesan || data.pejabat.nipKepala || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td className="border-0 py-0.5 text-slate-600">Jabatan</td>
                          <td className="border-0 py-0.5">: {bast.jabatanPemesan || `Kepala ${data.profile.namaMadrasah} / PPK`}</td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td className="border-0 py-0.5 text-slate-600">Unit Kerja</td>
                          <td className="border-0 py-0.5">: {data.profile.namaMadrasah}</td>
                        </tr>
                        <tr>
                          <td className="border-0 py-0.5"></td>
                          <td colSpan={2} className="border-0 py-0.5 font-semibold text-slate-700 italic">
                            Selanjutnya disebut sebagai <b>PIHAK KEDUA (Yang Menerima)</b>.
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="indent-6">
                      Berdasarkan Surat Pesanan Nomor: <b>{bast.noSuratPesanan}</b> tanggal <b>{formatDateIndo(bast.tanggalPesanan)}</b>, kedua belah pihak menyatakan bahwa:
                    </p>

                    <ol className="list-decimal pl-6 space-y-1.5">
                      <li>
                        <b>PIHAK PERTAMA</b> telah menyerahkan barang/hasil pekerjaan kepada <b>PIHAK KEDUA</b> dan <b>PIHAK KEDUA</b> telah menerima penyerahan barang tersebut dalam keadaan 100% lengkap, baru, dan berfungsi dengan baik.
                      </li>
                      <li>
                        Rincian jenis, jumlah, dan kondisi barang yang diserahterimakan adalah sebagai berikut:
                      </li>
                    </ol>

                    {/* Tabel Rincian BAST */}
                    <table className="w-full text-xs sm:text-sm border-collapse border border-slate-800 my-2">
                      <thead>
                        <tr className="bg-slate-100 font-bold">
                          <th className="border border-slate-800 p-2 text-center w-10">No</th>
                          <th className="border border-slate-800 p-2 text-left">Nama Barang / Pekerjaan</th>
                          <th className="border border-slate-800 p-2 text-left">Spesifikasi</th>
                          <th className="border border-slate-800 p-2 text-center w-14">Qty</th>
                          <th className="border border-slate-800 p-2 text-center w-16">Satuan</th>
                          <th className="border border-slate-800 p-2 text-right w-28">Harga (Rp)</th>
                          <th className="border border-slate-800 p-2 text-right w-32">Total (Rp)</th>
                          <th className="border border-slate-800 p-2 text-center w-24">Kondisi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bast.itemsBarang.map((b, bIdx) => (
                          <tr key={b.id} className="border-b border-slate-300">
                            <td className="border border-slate-800 p-2 text-center">{bIdx + 1}</td>
                            <td className="border border-slate-800 p-2 font-semibold">{b.namaBarang}</td>
                            <td className="border border-slate-800 p-2 text-slate-600">{b.spesifikasi || '-'}</td>
                            <td className="border border-slate-800 p-2 text-center font-sans">{b.volume}</td>
                            <td className="border border-slate-800 p-2 text-center font-sans">{b.satuan}</td>
                            <td className="border border-slate-800 p-2 text-right font-sans">{formatRupiah(b.hargaSatuan)}</td>
                            <td className="border border-slate-800 p-2 text-right font-sans font-bold">{formatRupiah(b.totalHarga)}</td>
                            <td className="border border-slate-800 p-2 text-center font-semibold text-emerald-800">
                              {b.kondisi || 'Baik'}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                          <td colSpan={6} className="border border-slate-800 p-2 text-right uppercase">
                            TOTAL NILAI BAST:
                          </td>
                          <td className="border border-slate-800 p-2 text-right font-bold font-sans text-emerald-950">
                            {formatRupiah(bast.totalNominal)}
                          </td>
                          <td className="border border-slate-800 p-2 text-center text-emerald-800">100% Sesuai</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="indent-6">
                      {bast.keteranganPemeriksaan || 'Demikian Berita Acara Serah Terima Barang/Jasa ini dibuat dengan sebenarnya dalam rangkap secukupnya untuk dipergunakan sebagaimana mestinya.'}
                    </p>

                    {/* Tanda Tangan 3 Pihak BAST */}
                    <div className="signature-block mt-6 pt-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="font-bold">PIHAK PERTAMA</p>
                          <p>Yang Menyerahkan,</p>
                          <p className="font-semibold text-slate-700">{bast.namaToko}</p>
                          <div className="h-20" />
                          <p className="font-bold underline uppercase">{bast.namaPenyedia}</p>
                          <p className="font-sans text-xs">{bast.jabatanPenyedia || 'Pimpinan / Pemilik'}</p>
                        </div>

                        <div className="text-center">
                          <p className="font-bold">PIHAK KEDUA</p>
                          <p>Yang Menerima,</p>
                          <p className="font-semibold text-slate-700">Kepala {data.profile.namaMadrasah}</p>
                          <div className="h-20" />
                          <p className="font-bold underline uppercase">{bast.namaPemesan || data.pejabat.namaKepala}</p>
                          <p className="font-sans text-xs">NIP. {bast.nipPemesan || data.pejabat.nipKepala || '-'}</p>
                        </div>
                      </div>

                      {/* Mengetahui Bendahara */}
                      <div className="text-center mt-6 pt-2">
                        <p>Mengetahui / Memverifikasi,</p>
                        <p className="font-bold">Bendahara Dana BOS</p>
                        <div className="h-16" />
                        <p className="font-bold underline uppercase">{data.pejabat.namaBendahara}</p>
                        <p className="font-sans text-xs">NIP. {data.pejabat.nipBendahara || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {idx < (data.notaPesananBast?.length || 0) - 1 && (
                    <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Visual on-screen separator */}
        {activeTab === 'all' && data.dokumentasi.length > 0 && <div className="no-print my-8 border-b-2 border-dashed border-slate-200" />}

        {/* ======================================================== */}
        {/* 9. DOKUMENTASI KEGIATAN & BERITA ACARA (HALAMAN TERPISAH) */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'dok') && data.dokumentasi.length > 0 && (
          <div className="print-sheet lampiran-foto-sheet my-4" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
            <div className="text-center mb-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                LAMPIRAN LPJ
              </h3>
              <h2 className="text-sm sm:text-base font-bold uppercase">
                DOKUMENTASI KEGIATAN & BUKTI FISIK PELAKSANAAN
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Foto Kegiatan, Daftar Hadir, dan Berkas Pendukung LPJ BOS {data.periode.tahunAnggaran}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.dokumentasi.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2 text-xs avoid-break"
                >
                  <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-1">
                    <span>Dokumen #{idx + 1} ({item.kategori})</span>
                    <span className="font-sans text-slate-500 font-normal">{item.tanggal}</span>
                  </div>

                  {/* Image if available */}
                  {item.fileData && item.fileType === 'image' && (
                    <div className="h-40 bg-white rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      <img
                        src={item.fileData}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {(!item.fileData || item.fileType !== 'image') && (
                    <div className="h-24 bg-white rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center text-slate-400">
                      <Image className="w-6 h-6 text-slate-300 mb-1" />
                      <span className="text-[11px] font-sans font-medium text-slate-600">{item.judul}</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-slate-900">{item.judul}</h4>
                    <p className="text-slate-600 font-sans text-[11px] mt-0.5">{item.keterangan}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 text-center text-xs text-slate-500 font-sans border-t border-slate-200">
              <p>Laporan Pertanggungjawaban ini telah diperiksa dan disetujui sesuai Ketentuan Juknis BOS Madrasah RI.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
