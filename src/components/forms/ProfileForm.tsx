import React from 'react';
import { MadrasahProfile } from '../../types/lpj';
import { Building2, MapPin, Phone, Mail, Hash, Layers } from 'lucide-react';

interface ProfileFormProps {
  data: MadrasahProfile;
  onChange: (data: MadrasahProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof MadrasahProfile, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Building2 className="w-5 h-5 text-blue-600" />
        <div>
          <h4 className="text-sm font-bold text-slate-800">1. Identitas Madrasah / Sekolah</h4>
          <p className="text-xs text-slate-500">Data identitas resmi untuk sampul dan kop surat LPJ</p>
        </div>
      </div>

      {/* Nama Madrasah */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Nama Madrasah / Sekolah <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={data.namaMadrasah}
          onChange={(e) => updateField('namaMadrasah', e.target.value)}
          placeholder="Contoh: MTs BANGKALA ISLAMIC SCHOOL"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      {/* Jenjang & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Jenjang Pendidikan
          </label>
          <select
            value={data.jenjang}
            onChange={(e) => updateField('jenjang', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          >
            <option value="RA">RA (Raudhatul Athfal)</option>
            <option value="MI">MI (Madrasah Ibtidaiyah)</option>
            <option value="MTs">MTs (Madrasah Tsanawiyah)</option>
            <option value="MA">MA (Madrasah Aliyah)</option>
            <option value="MAK">MAK (Kejuruan)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Status Kelembagaan
          </label>
          <select
            value={data.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          >
            <option value="Swasta">Swasta</option>
            <option value="Negeri">Negeri</option>
          </select>
        </div>
      </div>

      {/* NSM & NPSN */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Nomor Statistik Madrasah (NSM)
          </label>
          <input
            type="text"
            value={data.nsm}
            onChange={(e) => updateField('nsm', e.target.value)}
            placeholder="12 digit NSM"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            NPSN
          </label>
          <input
            type="text"
            value={data.npsn}
            onChange={(e) => updateField('npsn', e.target.value)}
            placeholder="8 digit NPSN"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Alamat Lengkap */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Alamat Jalan / Kompleks
        </label>
        <input
          type="text"
          value={data.alamat}
          onChange={(e) => updateField('alamat', e.target.value)}
          placeholder="Jl. Poros No..."
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
        />
      </div>

      {/* Kecamatan, Kabupaten, Provinsi */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Kecamatan
          </label>
          <input
            type="text"
            value={data.kecamatan}
            onChange={(e) => updateField('kecamatan', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Kabupaten/Kota
          </label>
          <input
            type="text"
            value={data.kabupaten}
            onChange={(e) => updateField('kabupaten', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Provinsi
          </label>
          <input
            type="text"
            value={data.provinsi}
            onChange={(e) => updateField('provinsi', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Kontak & Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Nomor Telepon / WA
          </label>
          <input
            type="text"
            value={data.telepon}
            onChange={(e) => updateField('telepon', e.target.value)}
            placeholder="0812-..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Email Madrasah
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="madrasah@kemenag.go.id"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
