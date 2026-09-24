import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  Lock, 
  User, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Award,
  Eye,
  EyeOff,
  FileCheck2,
  Receipt
} from 'lucide-react';
import { KemenagLogo } from './KemenagLogo';

interface LoginPageProps {
  onLoginSuccess: (namaLengkap: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!namaLengkap.trim()) {
      setErrorMsg('Silakan masukkan Nama Lengkap Guru / Bendahara.');
      return;
    }

    if (!password) {
      setErrorMsg('Silakan masukkan password.');
      return;
    }

    if (password !== '123456') {
      setErrorMsg('Password salah! Gunakan password resmi: 123456');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(namaLengkap.trim());
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#140e02] via-[#0d0a02] to-[#171004] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Dynamic Mesh & Golden Ambient Glow Background */}
      <div className="absolute -top-40 -right-40 w-[680px] h-[680px] bg-gradient-to-br from-amber-500/30 via-yellow-500/20 to-amber-700/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[680px] h-[680px] bg-gradient-to-tr from-yellow-500/25 via-amber-600/30 to-amber-800/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] bg-amber-400/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-yellow-300/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Golden Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Top Header Bar */}
      <header className="w-full border-b border-amber-500/30 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between z-20 shadow-lg shadow-black/30">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-b from-amber-950/80 via-yellow-950/40 to-slate-900 rounded-xl border border-amber-400/50 shadow-md shadow-amber-950/50">
            <KemenagLogo size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent uppercase">
                KEMENTERIAN AGAMA RI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.2 bg-amber-950/90 border border-amber-400/50 text-amber-300 rounded-full">
                Pendis
              </span>
            </div>
            <p className="text-[11px] text-amber-100/80 font-medium">
              Direktorat Jenderal Pendidikan Islam • Portal LPJ BOS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-400/40 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Juknis Resmi BOS Kemenag</span>
            <span className="sm:hidden">Resmi</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10 my-auto">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero & Key Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            {/* Tag Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/25 text-amber-300 border border-amber-400/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> STANDAR RKAM 2025 / 2026
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/50 text-amber-200 border border-amber-500/30">
                MI • MTs • MA • RA
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                GENERATOR LPJ <br />
                <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
                  BENDAHARA BOS
                </span> <br />
                <span className="text-amber-100/90">MADRASAH</span>
              </h1>
              <p className="text-amber-100/85 text-sm sm:text-base leading-relaxed font-normal max-w-lg">
                Solusi cerdas penyusunan Laporan Pertanggungjawaban (LPJ) Keuangan BOS Madrasah secara otomatis, presisi, dan sesuai Juknis Kemenag RI.
              </p>
            </div>

            {/* Feature Highlights Bento */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900/95 transition-all group shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white">Form BOS K1 - K7</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">SPTJB, BKU, BKP, BKT & Bank</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900/95 transition-all group shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white">Kwitansi & Pajak</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">PPh 21, 22, 23, PPN & NTPN</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900/95 transition-all group shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white">8 Standar RKAM</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">Realisasi & Pembukuan Kas</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900/95 transition-all group shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white">Export Lengkap</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">Cetak & Word (.doc)</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Contrast Luxury Gold Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative">
              {/* Card Golden Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative bg-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border-2 border-amber-400/50 shadow-2xl shadow-black/90">
                {/* Top Center Logo & Title */}
                <div className="text-center mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center justify-center p-3 bg-gradient-to-b from-amber-950/90 via-slate-900 to-yellow-950/80 rounded-2xl mb-3 border-2 border-amber-400/60 shadow-xl shadow-amber-950/60"
                  >
                    <KemenagLogo size={58} />
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Masuk Akun Pengelola BOS
                  </h3>
                  <p className="text-xs text-amber-100/70 mt-1">
                    Silakan isi identitas bendahara / guru untuk mulai menyusun LPJ
                  </p>
                </div>

                {/* Error Alert */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl flex items-center gap-2.5 text-rose-200 text-xs font-medium shadow-lg"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama Lengkap Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                      Nama Lengkap Guru / Bendahara <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/95 border border-amber-500/40 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-200">
                        Password Verifikasi <span className="text-amber-400">*</span>
                      </label>
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-md border border-amber-400/60 shadow-xs">
                        PIN: 123456
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-800/95 border border-amber-500/40 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-300 cursor-pointer transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button with Vibrant Gold Gradient */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        <span>Masuk ke Generator LPJ</span>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Developer Credit Line */}
                <div className="mt-6 pt-5 border-t border-amber-500/30 text-center">
                  <p className="text-xs sm:text-sm font-black text-amber-300 tracking-wide">
                    Aplikasi ini dikembangkan oleh : <span className="text-yellow-300 font-extrabold uppercase drop-shadow-sm">JEMI ARIFIN, ST</span>
                  </p>
                  <p className="text-[11px] text-amber-100/70 mt-1">
                    Versi 2.5 • Dirjen Pendis Kementerian Agama RI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="w-full border-t border-amber-500/30 bg-slate-950/90 px-6 py-3 text-center text-xs text-amber-100/70 z-10 backdrop-blur-md">
        <p>
          © 2025 - 2026 Sistem Otomasi LPJ Bendahara BOS Madrasah • Sesuai Juknis BOS Kementerian Agama Republik Indonesia
        </p>
      </footer>
    </div>
  );
};
