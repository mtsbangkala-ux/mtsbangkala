import React, { useRef } from 'react';
import { DokumentasiItem } from '../../types/lpj';
import { Image, Upload, Plus, Trash2, FileText, FileCheck, Calendar, Eye } from 'lucide-react';

interface DokumentasiFormProps {
  items: DokumentasiItem[];
  onChange: (items: DokumentasiItem[]) => void;
}

export const DokumentasiForm: React.FC<DokumentasiFormProps> = ({ items, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddManual = () => {
    const newItem: DokumentasiItem = {
      id: `doc-${Date.now()}`,
      judul: 'Kegiatan Pembelajaran / Ujian Madrasah',
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Foto Kegiatan',
      keterangan: 'Dokumentasi pelaksanaan kegiatan dana BOS',
    };
    onChange([...items, newItem]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      reader.onload = (uploadEvent) => {
        const fileData = uploadEvent.target?.result as string;
        const newItem: DokumentasiItem = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          judul: file.name.replace(/\.[^/.]+$/, ''),
          tanggal: new Date().toISOString().split('T')[0],
          kategori: isImage ? 'Foto Kegiatan' : isPdf ? 'Berita Acara' : 'Daftar Hadir',
          fileData: fileData,
          fileName: file.name,
          fileType: isImage ? 'image' : 'pdf',
          keterangan: `Lampiran file ${file.name} (${(file.size / 1024).toFixed(0)} KB)`,
        };
        onChange([...items, newItem]);
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdate = (id: string, field: keyof DokumentasiItem, value: any) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-teal-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-800">7. Dokumentasi Kegiatan & Berita Acara</h4>
            <p className="text-xs text-slate-500">Foto fisik, berita acara, absensi & BAST</p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-4 bg-teal-50/60 border-2 border-dashed border-teal-200 rounded-xl text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-teal-950">
            Upload Foto Kegiatan, Berita Acara, atau Daftar Hadir
          </p>
          <p className="text-[11px] text-teal-700 mt-0.5">
            Mendukung format gambar (JPG, PNG, WebP) dan dokumen (PDF)
          </p>
        </div>
        
        <div className="flex justify-center gap-2 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Pilih File (JPG, PNG, PDF)</span>
          </button>
          
          <button
            type="button"
            onClick={handleAddManual}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Catatan Manual</span>
          </button>
        </div>
      </div>

      {/* List Dokumentasi */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  Dok #{index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {item.kategori}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-rose-500 hover:text-rose-700 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail Preview if available */}
            {item.fileData && item.fileType === 'image' && (
              <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src={item.fileData}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {item.fileData && item.fileType === 'pdf' && (
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-800 text-xs font-medium">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">{item.fileName || 'Dokumen PDF Terlampir'}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Judul Dokumentasi / Acara
                </label>
                <input
                  type="text"
                  value={item.judul}
                  onChange={(e) => handleUpdate(item.id, 'judul', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Kategori Dokumen
                </label>
                <select
                  value={item.kategori}
                  onChange={(e) => handleUpdate(item.id, 'kategori', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-teal-500"
                >
                  <option value="Foto Kegiatan">Foto Kegiatan</option>
                  <option value="Berita Acara">Berita Acara</option>
                  <option value="Daftar Hadir">Daftar Hadir</option>
                  <option value="Notulen Rapat">Notulen Rapat</option>
                  <option value="Serah Terima Barang">Serah Terima Barang (BAST)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  value={item.tanggal}
                  onChange={(e) => handleUpdate(item.id, 'tanggal', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                />
              </div>
              <div className="sm:col-span-8">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Keterangan / Rincian Singkat
                </label>
                <input
                  type="text"
                  value={item.keterangan}
                  onChange={(e) => handleUpdate(item.id, 'keterangan', e.target.value)}
                  placeholder="Keterangan singkat kegiatan..."
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
