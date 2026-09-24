import React from 'react';
import { RekapPajakItem } from '../../types/lpj';
import { Landmark, Plus, Trash2, CheckCircle2, Ban, Info, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatRupiah } from '../../utils/numberToWords';

interface RekapPajakFormProps {
  items: RekapPajakItem[];
  onChange: (items: RekapPajakItem[]) => void;
}

export const RekapPajakForm: React.FC<RekapPajakFormProps> = ({ items = [], onChange }) => {
  const handleAdd = () => {
    const newItem: RekapPajakItem = {
      id: `pj-${Date.now()}`,
      noBukti: `KW-0${items.length + 1}/BOS/MTS/2025`,
      jenisPajak: 'PPh 21',
      uraian: 'Pemotongan Pajak Penghasilan Pasal 21',
      dpp: 5000000,
      tarif: 5,
      jumlahPajak: 250000,
      tanggalSetor: new Date().toISOString().split('T')[0],
      ntpn: '9827361928374650',
      statusSetor: 'Sudah Disetor',
    };
    onChange([...items, newItem]);
  };

  const handleSetTidakAdaPajak = () => {
    onChange([]);
  };

  const handleUpdate = (id: string, field: keyof RekapPajakItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const next = { ...item, [field]: value };
        // Auto calculate tax if dpp or tarif changed
        if (field === 'dpp' || field === 'tarif') {
          const dppVal = field === 'dpp' ? Number(value) || 0 : next.dpp;
          const tarifVal = field === 'tarif' ? Number(value) || 0 : next.tarif;
          next.jumlahPajak = Math.round((dppVal * tarifVal) / 100);
        }
        return next;
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const totalPajak = items.reduce((acc, curr) => acc + (Number(curr.jumlahPajak) || 0), 0);
  const isNihil = items.length === 0;

  return (
    <div className="space-y-4">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">6. Rekapitulasi Pajak (PPh & PPN)</h4>
            <p className="text-xs text-slate-500">Bukti setor pajak, NTPN / Kode Billing e-Billing Kas Negara</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleSetTidakAdaPajak}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isNihil
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200'
            }`}
            title="Setel status rekapitulasi pajak menjadi NIHIL / Tidak Ada Pajak"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Tidak Ada Pajak (Nihil)</span>
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Pajak</span>
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      {isNihil ? (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-emerald-950">
                  Status Pajak: NIHIL (Rp 0)
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Tidak Ada Pemotongan Pajak
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Madrasah tidak memiliki kewajiban pemotongan atau penyetoran pajak pada periode ini. Laporan resmi <b>FORM BOS K-6</b> pada dokumen cetak dan ekspor Word akan otomatis tertulis <b>NIHIL</b> dengan total <b>Rp 0</b>.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800">
              Perlu menambahkan rincian pajak kembali?
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className="text-xs font-bold text-emerald-900 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Rincian Pajak</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-950 uppercase block">Total Kewajiban Pajak:</span>
            <span className="text-[11px] text-rose-700">{items.length} Rincian Pemotongan Pajak</span>
          </div>
          <span className="text-base font-black text-rose-900">{formatRupiah(totalPajak)}</span>
        </div>
      )}

      {/* Tax Items List */}
      {!isNihil && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-200">
                  Pajak #{index + 1} • {item.jenisPajak} ({item.tarif}%)
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 rounded transition-colors cursor-pointer"
                  title="Hapus baris pajak"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* No Bukti & Jenis Pajak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nomor Bukti Transaksi
                  </label>
                  <input
                    type="text"
                    value={item.noBukti}
                    onChange={(e) => handleUpdate(item.id, 'noBukti', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Jenis Pajak
                  </label>
                  <select
                    value={item.jenisPajak}
                    onChange={(e) => {
                      const jp = e.target.value as any;
                      let defTarif = 5;
                      if (jp === 'PPh 22') defTarif = 1.5;
                      if (jp === 'PPh 23') defTarif = 2;
                      if (jp === 'PPN 11%') defTarif = 11;
                      handleUpdate(item.id, 'jenisPajak', jp);
                      handleUpdate(item.id, 'tarif', defTarif);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-rose-500"
                  >
                    <option value="PPh 21">PPh 21 (Honorarium / Gaji 5%)</option>
                    <option value="PPh 22">PPh 22 (Belanja Barang / ATK 1.5%)</option>
                    <option value="PPh 23">PPh 23 (Sewa / Jasa 2%)</option>
                    <option value="PPN 11%">PPN (Pajak Pertambahan Nilai 11%)</option>
                  </select>
                </div>
              </div>

              {/* DPP, Tarif, Total Pajak */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Dasar Pajak (DPP)
                  </label>
                  <input
                    type="number"
                    value={item.dpp}
                    onChange={(e) => handleUpdate(item.id, 'dpp', Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Tarif (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.tarif}
                    onChange={(e) => handleUpdate(item.id, 'tarif', Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 text-center outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Nilai Pajak (Rp)
                  </label>
                  <input
                    type="number"
                    value={item.jumlahPajak}
                    onChange={(e) => handleUpdate(item.id, 'jumlahPajak', Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-rose-700 font-bold outline-none"
                  />
                </div>
              </div>

              {/* NTPN / Kode Billing & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Tanggal Setor
                  </label>
                  <input
                    type="date"
                    value={item.tanggalSetor}
                    onChange={(e) => handleUpdate(item.id, 'tanggalSetor', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    NTPN / Kode Billing
                  </label>
                  <input
                    type="text"
                    value={item.ntpn}
                    onChange={(e) => handleUpdate(item.id, 'ntpn', e.target.value)}
                    placeholder="16 digit NTPN"
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Status Setor
                  </label>
                  <select
                    value={item.statusSetor}
                    onChange={(e) => handleUpdate(item.id, 'statusSetor', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-medium outline-none"
                  >
                    <option value="Sudah Disetor">Disetor ✓</option>
                    <option value="Belum Disetor">Belum</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
