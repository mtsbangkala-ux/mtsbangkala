import React from 'react';
import { PeriodeAnggaran } from '../../types/lpj';
import { Calendar, Check, Sparkles, Clock } from 'lucide-react';

interface PeriodeFormProps {
  data: PeriodeAnggaran;
  onChange: (data: PeriodeAnggaran) => void;
}

const BULAN_LIST = [
  { no: '01', name: 'Januari', monthIndex: 1, days: 31, semester: 'Genap' },
  { no: '02', name: 'Februari', monthIndex: 2, days: 28, semester: 'Genap' },
  { no: '03', name: 'Maret', monthIndex: 3, days: 31, semester: 'Genap' },
  { no: '04', name: 'April', monthIndex: 4, days: 30, semester: 'Genap' },
  { no: '05', name: 'Mei', monthIndex: 5, days: 31, semester: 'Genap' },
  { no: '06', name: 'Juni', monthIndex: 6, days: 30, semester: 'Genap' },
  { no: '07', name: 'Juli', monthIndex: 7, days: 31, semester: 'Ganjil' },
  { no: '08', name: 'Agustus', monthIndex: 8, days: 31, semester: 'Ganjil' },
  { no: '09', name: 'September', monthIndex: 9, days: 30, semester: 'Ganjil' },
  { no: '10', name: 'Oktober', monthIndex: 10, days: 31, semester: 'Ganjil' },
  { no: '11', name: 'November', monthIndex: 11, days: 30, semester: 'Ganjil' },
  { no: '12', name: 'Desember', monthIndex: 12, days: 31, semester: 'Ganjil' },
];

export const PeriodeForm: React.FC<PeriodeFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof PeriodeAnggaran, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const getDaysInMonth = (yearStr: string, monthIndex: number) => {
    const year = parseInt(yearStr) || new Date().getFullYear();
    // monthIndex is 1-based (1..12). Day 0 of next month is last day of monthIndex.
    return new Date(year, monthIndex, 0).getDate();
  };

  const handleSelectMonth = (bulan: typeof BULAN_LIST[0]) => {
    const year = data.tahunAnggaran || new Date().getFullYear().toString();
    const padMonth = String(bulan.monthIndex).padStart(2, '0');
    const lastDay = getDaysInMonth(year, bulan.monthIndex);
    const padDay = String(lastDay).padStart(2, '0');

    onChange({
      ...data,
      tahap: `Bulan ${bulan.name}`,
      bulan: bulan.name,
      semester: bulan.semester as 'Ganjil' | 'Genap',
      tanggalAwal: `${year}-${padMonth}-01`,
      tanggalAkhir: `${year}-${padMonth}-${padDay}`,
    });
  };

  const handleSelectTahap = (tahapStr: string) => {
    const year = data.tahunAnggaran || new Date().getFullYear().toString();
    if (tahapStr.includes('Tahap I')) {
      onChange({
        ...data,
        tahap: 'Tahap I (Januari - Juni)',
        bulan: undefined,
        semester: 'Genap',
        tanggalAwal: `${year}-01-02`,
        tanggalAkhir: `${year}-06-30`,
      });
    } else if (tahapStr.includes('Tahap II')) {
      onChange({
        ...data,
        tahap: 'Tahap II (Juli - Desember)',
        bulan: undefined,
        semester: 'Ganjil',
        tanggalAwal: `${year}-07-01`,
        tanggalAkhir: `${year}-12-31`,
      });
    } else {
      onChange({
        ...data,
        tahap: 'Tahunan (Januari - Desember)',
        bulan: undefined,
        semester: 'Satu Tahun Penuh',
        tanggalAwal: `${year}-01-02`,
        tanggalAkhir: `${year}-12-31`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Calendar className="w-5 h-5 text-blue-600" />
        <div>
          <h4 className="text-sm font-bold text-slate-800">2. Tahun Anggaran & Periode Tahap</h4>
          <p className="text-xs text-slate-500">
            Pilih periode per semester/tahap atau per bulan (Januari - Desember)
          </p>
        </div>
      </div>

      {/* Tahun Anggaran & Semester */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tahun Anggaran */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Tahun Anggaran <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data.tahunAnggaran}
            onChange={(e) => updateField('tahunAnggaran', e.target.value)}
            placeholder="2025"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Semester
          </label>
          <select
            value={data.semester}
            onChange={(e) => updateField('semester', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          >
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
            <option value="Satu Tahun Penuh">Satu Tahun Penuh</option>
          </select>
        </div>
      </div>

      {/* Pilihan Periode Tahapan Resmi BOS */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
          <span>Pilihan Tahap BOS (Semester / Tahunan)</span>
          <span className="text-[10px] text-blue-600 font-semibold lowercase">klik untuk pilih</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectTahap('Tahap I')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
              data.tahap.includes('Tahap I')
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
            }`}
          >
            <div>
              <p>Tahap I</p>
              <p className={`text-[10px] ${data.tahap.includes('Tahap I') ? 'text-blue-100' : 'text-slate-500'}`}>
                Januari - Juni
              </p>
            </div>
            {data.tahap.includes('Tahap I') && <Check className="w-4 h-4 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTahap('Tahap II')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
              data.tahap.includes('Tahap II')
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
            }`}
          >
            <div>
              <p>Tahap II</p>
              <p className={`text-[10px] ${data.tahap.includes('Tahap II') ? 'text-blue-100' : 'text-slate-500'}`}>
                Juli - Desember
              </p>
            </div>
            {data.tahap.includes('Tahap II') && <Check className="w-4 h-4 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTahap('Tahunan')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
              data.tahap.includes('Tahunan')
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
            }`}
          >
            <div>
              <p>Tahunan</p>
              <p className={`text-[10px] ${data.tahap.includes('Tahunan') ? 'text-blue-100' : 'text-slate-500'}`}>
                Jan - Des (Penuh)
              </p>
            </div>
            {data.tahap.includes('Tahunan') && <Check className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Pilihan Periode Per Bulan (Januari s.d. Desember) */}
      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Pilihan Laporan Per Bulan (Januari - Desember)</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
            12 Bulan
          </span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {BULAN_LIST.map((bulan) => {
            const isSelected = data.tahap === `Bulan ${bulan.name}` || data.bulan === bulan.name;
            return (
              <button
                key={bulan.no}
                type="button"
                onClick={() => handleSelectMonth(bulan)}
                className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <span>{bulan.no}. {bulan.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown / Input Nama Tahap Terpilih */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Keterangan Periode / Tahap Terpilih <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={data.tahap}
          onChange={(e) => updateField('tahap', e.target.value)}
          placeholder="Contoh: Bulan Maret atau Tahap I (Januari - Juni)"
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-blue-900 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Rentang Tanggal Pelaksanaan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Tanggal Awal Periode
          </label>
          <input
            type="date"
            value={data.tanggalAwal}
            onChange={(e) => updateField('tanggalAwal', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Tanggal Akhir Periode
          </label>
          <input
            type="date"
            value={data.tanggalAkhir}
            onChange={(e) => updateField('tanggalAkhir', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
