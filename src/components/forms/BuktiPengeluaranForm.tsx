import React, { useState } from 'react';
import { BuktiPengeluaranItem } from '../../types/lpj';
import { Receipt, Plus, Trash2, CheckSquare, Tag, Info, Edit3, ListFilter } from 'lucide-react';
import { formatRupiah } from '../../utils/numberToWords';
import { BAGAN_AKUN_STANDAR_BOS, getAkunDetail } from '../../utils/baganAkunStandar';

interface BuktiPengeluaranFormProps {
  items: BuktiPengeluaranItem[];
  onChange: (items: BuktiPengeluaranItem[]) => void;
}

const KELENGKAPAN_DEFAULTS = [
  'Kwitansi Asli',
  'Faktur / Nota Toko',
  'Berita Acara Serah Terima',
  'Daftar Hadir / Tanda Terima',
  'Foto Fisik / Dokumentasi',
];

export const BuktiPengeluaranForm: React.FC<BuktiPengeluaranFormProps> = ({ items, onChange }) => {
  const [manualInputIds, setManualInputIds] = useState<string[]>([]);

  const toggleManualInput = (id: string) => {
    setManualInputIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const nextIdx = items.length + 1;
    const defaultAkun = BAGAN_AKUN_STANDAR_BOS[1].items[0].nama; // 521211 - Belanja Bahan
    const newItem: BuktiPengeluaranItem = {
      id: `bp-${Date.now()}`,
      noBukti: `KW-${nextIdx.toString().padStart(2, '0')}/BOS/MTS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      tanggal: new Date().toISOString().split('T')[0],
      kodeAkun: defaultAkun,
      penerima: 'Toko / Rekanan Baru',
      uraian: 'Pembelian perlengkapan operasional madrasah',
      nominal: 2500000,
      jenisBukti: 'Kwitansi',
      kelengkapan: ['Kwitansi Asli', 'Faktur / Nota Toko'],
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, field: keyof BuktiPengeluaranItem, value: any) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleToggleKelengkapan = (id: string, docName: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const exists = target.kelengkapan.includes(docName);
    const updatedDocs = exists
      ? target.kelengkapan.filter((d) => d !== docName)
      : [...target.kelengkapan, docName];
    handleUpdate(id, 'kelengkapan', updatedDocs);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const totalPengeluaran = items.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">5. Bukti Pengeluaran & Kwitansi SPJ</h4>
            <p className="text-xs text-slate-500">Daftar transaksi, faktur belanja & kode akun standar (BAS Kemenag)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-2.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kwitansi</span>
        </button>
      </div>

      {/* Total Belanja */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-950 uppercase block">Total Pengeluaran / Kwitansi SPJ:</span>
          <span className="text-[11px] text-amber-800">{items.length} Bukti Transaksi Terdata</span>
        </div>
        <span className="text-base font-black text-amber-900">{formatRupiah(totalPengeluaran)}</span>
      </div>

      {/* Kwitansi Items */}
      <div className="space-y-3.5">
        {items.map((item, index) => {
          const isManual = manualInputIds.includes(item.id);
          const akunDetail = getAkunDetail(item.kodeAkun);

          return (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                    SPJ #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {item.noBukti}
                  </span>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded cursor-pointer"
                    title="Hapus Kwitansi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Nomor Bukti & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nomor Bukti / Kuitansi
                  </label>
                  <input
                    type="text"
                    value={item.noBukti}
                    onChange={(e) => handleUpdate(item.id, 'noBukti', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    value={item.tanggal}
                    onChange={(e) => handleUpdate(item.id, 'tanggal', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Kode Akun Belanja (Dropdown Bagan Akun Standar) */}
              <div className="p-2.5 bg-white border border-amber-200/80 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-amber-950 uppercase flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kode Akun Belanja (Bagan Akun Standar / BAS)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleManualInput(item.id)}
                    className="text-[10.5px] font-medium text-amber-700 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    {isManual ? (
                      <>
                        <ListFilter className="w-3 h-3" />
                        <span>Pilih dari Dropdown BAS</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3 h-3" />
                        <span>Tulis Manual</span>
                      </>
                    )}
                  </button>
                </div>

                {isManual ? (
                  <input
                    type="text"
                    value={item.kodeAkun}
                    onChange={(e) => handleUpdate(item.id, 'kodeAkun', e.target.value)}
                    placeholder="Contoh: 521211 - Belanja Bahan"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                  />
                ) : (
                  <select
                    value={item.kodeAkun}
                    onChange={(e) => handleUpdate(item.id, 'kodeAkun', e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-amber-500 transition-colors"
                  >
                    {BAGAN_AKUN_STANDAR_BOS.map((group) => (
                      <optgroup key={group.kodePrefix} label={`📁 ${group.groupName}`}>
                        {group.items.map((akun) => (
                          <option key={akun.kode} value={akun.nama}>
                            {akun.nama}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    {/* Fallback option if custom value exists */}
                    {!akunDetail && item.kodeAkun && (
                      <option value={item.kodeAkun}>Kustom: {item.kodeAkun}</option>
                    )}
                  </select>
                )}

                {/* Deskripsi & Peruntukan Akun */}
                {akunDetail?.deskripsi && (
                  <div className="flex items-start gap-1.5 text-[10.5px] text-amber-800/90 bg-amber-50/60 p-1.5 rounded border border-amber-100">
                    <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span><b>Peruntukan Akun:</b> {akunDetail.deskripsi}</span>
                  </div>
                )}
              </div>

              {/* Jenis Bukti & Penerima */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Jenis Dokumen SPJ
                  </label>
                  <select
                    value={item.jenisBukti}
                    onChange={(e) => handleUpdate(item.id, 'jenisBukti', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="Kwitansi">Kwitansi</option>
                    <option value="Faktur / Nota">Faktur / Nota Toko</option>
                    <option value="SPJ / Honor">SPJ / Daftar Honor</option>
                    <option value="Kuitansi Dinas">Kuitansi Dinas</option>
                  </select>
                </div>
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nama Penerima / Toko / Penyedia
                  </label>
                  <input
                    type="text"
                    value={item.penerima}
                    onChange={(e) => handleUpdate(item.id, 'penerima', e.target.value)}
                    placeholder="Nama toko / rekanan / nama guru penerima"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Nominal Pembayaran */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nominal Pembayaran (Rp)
                </label>
                <input
                  type="number"
                  value={item.nominal}
                  onChange={(e) => handleUpdate(item.id, 'nominal', Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-amber-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Uraian */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Uraian Pembayaran
                </label>
                <textarea
                  rows={2}
                  value={item.uraian}
                  onChange={(e) => handleUpdate(item.id, 'uraian', e.target.value)}
                  placeholder="Rincian peruntukan barang/jasa"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              {/* Checklist Kelengkapan Dokumen SPJ */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">
                  Kelengkapan Lampiran SPJ:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {KELENGKAPAN_DEFAULTS.map((doc) => {
                    const active = item.kelengkapan.includes(doc);
                    return (
                      <button
                        key={doc}
                        type="button"
                        onClick={() => handleToggleKelengkapan(item.id, doc)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {doc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

