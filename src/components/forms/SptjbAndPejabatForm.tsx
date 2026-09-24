import React from 'react';
import { SptjbData, PejabatPenandatangan } from '../../types/lpj';
import { FileBadge2, Users, UserCheck, ShieldCheck } from 'lucide-react';

interface SptjbFormProps {
  sptjb: SptjbData;
  pejabat: PejabatPenandatangan;
  onSptjbChange: (sptjb: SptjbData) => void;
  onPejabatChange: (pejabat: PejabatPenandatangan) => void;
}

export const SptjbAndPejabatForm: React.FC<SptjbFormProps> = ({
  sptjb,
  pejabat,
  onSptjbChange,
  onPejabatChange,
}) => {
  const updateSptjb = (field: keyof SptjbData, value: string) => {
    onSptjbChange({ ...sptjb, [field]: value });
  };

  const updatePejabat = (field: keyof PejabatPenandatangan, value: string) => {
    onPejabatChange({ ...pejabat, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 8. SPTJB Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileBadge2 className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">8. Surat Pernyataan Tanggung Jawab Belanja (SPTJB)</h4>
            <p className="text-xs text-slate-500">Pernyataan mutlak keabsahan laporan oleh Kepala Madrasah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nomor Surat SPTJB
            </label>
            <input
              type="text"
              value={sptjb.noSurat}
              onChange={(e) => updateSptjb('noSurat', e.target.value)}
              placeholder="045/SPTJB-BOS/MTS/2025"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tanggal Surat SPTJB
            </label>
            <input
              type="date"
              value={sptjb.tanggalSurat}
              onChange={(e) => updateSptjb('tanggalSurat', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Isi Pernyataan Tanggung Jawab
          </label>
          <textarea
            rows={3}
            value={sptjb.pernyataan}
            onChange={(e) => updateSptjb('pernyataan', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* 9 & 15. Pengaturan Penandatangan (Kepala Madrasah & Bendahara) */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Users className="w-5 h-5 text-indigo-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">9 & 15. Pengaturan Pejabat Penandatangan</h4>
            <p className="text-xs text-slate-500">Nama dan NIP Kepala Madrasah, Bendahara BOS, & Komite</p>
          </div>
        </div>

        {/* Kepala Madrasah */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Kepala Madrasah / Penanggung Jawab</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Nama Lengkap Kepala Madrasah & Gelar
              </label>
              <input
                type="text"
                value={pejabat.namaKepala}
                onChange={(e) => updatePejabat('namaKepala', e.target.value)}
                placeholder="Drs. H. Muhammad Idris, M.Pd.I"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                NIP / NPK Kepala Madrasah
              </label>
              <input
                type="text"
                value={pejabat.nipKepala}
                onChange={(e) => updatePejabat('nipKepala', e.target.value)}
                placeholder="19750812 200212 1 004 atau (-)"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bendahara BOS */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bendahara BOS Madrasah</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Nama Lengkap Bendahara & Gelar
              </label>
              <input
                type="text"
                value={pejabat.namaBendahara}
                onChange={(e) => updatePejabat('namaBendahara', e.target.value)}
                placeholder="Nurul Hidayati, S.Pd"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                NIP / NPK Bendahara
              </label>
              <input
                type="text"
                value={pejabat.nipBendahara}
                onChange={(e) => updatePejabat('nipBendahara', e.target.value)}
                placeholder="19880415 201403 2 002 atau (-)"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Komite, Tempat & Tgl Pengesahan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
              Ketua Komite Madrasah
            </label>
            <input
              type="text"
              value={pejabat.namaKetuaKomite || ''}
              onChange={(e) => updatePejabat('namaKetuaKomite', e.target.value)}
              placeholder="Nama Ketua Komite"
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
              Tempat / Kota Pembuatan
            </label>
            <input
              type="text"
              value={pejabat.tempatPembuatan}
              onChange={(e) => updatePejabat('tempatPembuatan', e.target.value)}
              placeholder="Contoh: Jeneponto"
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
              Tanggal Pengesahan
            </label>
            <input
              type="date"
              value={pejabat.tanggalPengesahan}
              onChange={(e) => updatePejabat('tanggalPengesahan', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
