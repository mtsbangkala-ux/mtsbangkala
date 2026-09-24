import { LPJFullData } from '../types/lpj';
import { formatRupiah, terbilang, formatDateIndo } from './numberToWords';

export type PaperSize = 'A4' | 'F4';

export function exportLPJToWord(data: LPJFullData, paperSize: PaperSize = 'A4') {
  const isF4 = paperSize === 'F4';
  const totalPenerimaan = data.sumberDana.reduce((acc, curr) => acc + (Number(curr.diterima) || 0), 0);
  const totalPagu = data.sumberDana.reduce((acc, curr) => acc + (Number(curr.alokasiPagu ?? curr.diterima) || 0), 0);
  const totalRealisasi = data.realisasiKegiatan.reduce((acc, curr) => acc + (Number(curr.realisasi) || 0), 0);
  const totalAnggaran = data.realisasiKegiatan.reduce((acc, curr) => acc + (Number(curr.anggaran) || 0), 0);
  const totalPengeluaran = data.buktiPengeluaran.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const totalPajak = data.rekapPajak.reduce((acc, curr) => acc + (Number(curr.jumlahPajak) || 0), 0);
  const sisaKas = totalPenerimaan - totalPengeluaran;

  const pageSizeCss = isF4 ? '21.5cm 33.0cm' : '21.0cm 29.7cm';
  const coverMinHeight = isF4 ? '920pt' : '820pt';

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Microsoft Word 15">
  <meta name="Originator" content="Microsoft Word 15">
  <title>LPJ BOS - ${data.profile.namaMadrasah} - ${data.periode.tahunAnggaran} (${paperSize})</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
      <w:Compatibility>
        <w:BreakWrappedTables/>
        <w:SnapToGridInCell/>
        <w:WrapTextWithPunct/>
        <w:UseAsianBreakRules/>
        <w:DontGrowAutofit/>
      </w:Compatibility>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    /* ========================================================== */
    /* STANDAR UKURAN KERTAS ${paperSize} PORTRAIT RESMI KEMENAG RI        */
    /* Ukuran: ${pageSizeCss}, Margin: Atas 2.5, Kiri 2.5, Kanan 2.0, Bawah 2.0 */
    /* ========================================================== */
    @page WordSection1 {
      size: ${pageSizeCss};
      margin: 2.5cm 2.0cm 2.0cm 2.5cm;
      mso-page-orientation: portrait;
      mso-header-margin: 36.0pt;
      mso-footer-margin: 36.0pt;
      mso-paper-source: 0;
    }
    div.WordSection1 {
      page: WordSection1;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.25;
      color: #000000;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    p, div, li, td, th {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.25;
    }

    h1, h2, h3, h4, h5 {
      font-family: 'Times New Roman', Times, serif;
      color: #000000;
      margin: 2pt 0;
      text-align: center;
    }

    .cover-title {
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 1.3;
    }

    .doc-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      text-align: center;
      margin-top: 10pt;
      margin-bottom: 2pt;
    }

    .doc-subtitle {
      font-size: 11pt;
      text-align: center;
      margin-top: 0;
      margin-bottom: 12pt;
    }

    /* KOP SURAT */
    .kop-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      margin-bottom: 0;
    }
    .kop-table td {
      border: none;
      padding: 0;
      vertical-align: middle;
    }
    .kop-line {
      border-top: 1.5pt solid #000000;
      border-bottom: 3.5pt double #000000;
      height: 2pt;
      margin-top: 4pt;
      margin-bottom: 12pt;
    }

    /* TABEL DATA STANDAR LPJ */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1pt solid #000000;
      margin-top: 8pt;
      margin-bottom: 12pt;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    table.data-table th {
      border: 1pt solid #000000;
      background-color: #E8EEF5;
      color: #000000;
      font-weight: bold;
      font-size: 10pt;
      text-align: center;
      vertical-align: middle;
      padding: 5pt 4pt;
    }
    table.data-table td {
      border: 1pt solid #000000;
      font-size: 9.5pt;
      padding: 4pt 5pt;
      vertical-align: top;
    }
    table.data-table tr.total-row td {
      background-color: #F0F4F8;
      font-weight: bold;
      font-size: 10pt;
    }

    /* ALIGNMENT UTILITIES */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .text-bold { font-weight: bold; }
    .nowrap { white-space: nowrap; }

    /* PAGE BREAK RESMI MS WORD */
    .page-break {
      page-break-before: always;
      mso-break-type: section-break;
      clear: both;
    }

    /* COVER BORDER FRAME */
    .cover-frame {
      border: 3.5pt double #000000;
      padding: 24pt 18pt;
      min-height: ${coverMinHeight};
      text-align: center;
      box-sizing: border-box;
    }

    /* TABEL TANDA TANGAN */
    table.signature-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }
    table.signature-table td {
      border: none;
      padding: 0 8pt;
      vertical-align: top;
      font-size: 10.5pt;
      line-height: 1.25;
    }

    ol.sptjb-list {
      margin-top: 4pt;
      margin-bottom: 8pt;
      padding-left: 20pt;
      text-align: justify;
      line-height: 1.35;
    }
    ol.sptjb-list li {
      margin-bottom: 6pt;
    }
  </style>
</head>
<body>
<div class="WordSection1">

  <!-- ============================================================== -->
  <!-- 1. HALAMAN SAMPUL / COVER RESMI LPJ BOS                        -->
  <!-- ============================================================== -->
  <div class="cover-frame">
    <h3 style="font-size: 13pt; font-weight: bold; margin: 0;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
    <h4 style="font-size: 11pt; font-weight: bold; margin: 2pt 0;">DIREKTORAT JENDERAL PENDIDIKAN ISLAM</h4>
    <p style="font-size: 10.5pt; margin: 2pt 0;">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</p>
    
    <div style="margin: 28pt 0 20pt 0;">
      <!-- Vector-like Emblem Badge in Word -->
      <table align="center" style="border: none; border-collapse: collapse; margin: 0 auto;">
        <tr>
          <td align="center" style="border: none;">
            <div style="width: 100pt; height: 100pt; border: 2pt solid #007138; background-color: #F0FDF4; border-radius: 12pt; text-align: center; padding: 12pt 6pt; box-sizing: border-box;">
              <div style="font-size: 24pt; color: #FFB600; line-height: 1;">★</div>
              <div style="font-size: 11pt; font-weight: bold; color: #007138; margin-top: 4pt;">KEMENAG RI</div>
              <div style="font-size: 8.5pt; font-weight: bold; color: #166534; border-top: 1pt solid #007138; margin-top: 4pt; padding-top: 2pt;">IKHLAS BERAMAL</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div style="border-top: 1.5pt solid #000000; border-bottom: 1.5pt solid #000000; padding: 8pt 0; margin: 15pt 0;">
      <div class="cover-title">
        LAPORAN PERTANGGUNGJAWABAN (LPJ)<br>
        BENDAHARA BANTUAN OPERASIONAL SEKOLAH (BOS)
      </div>
      <p style="font-size: 12pt; font-weight: bold; margin: 6pt 0 0 0; color: #000000;">
        PERIODE: ${data.periode.tahap.toUpperCase()} TAHUN ANGGARAN ${data.periode.tahunAnggaran}
      </p>
    </div>

    <div style="margin: 20pt auto; text-align: center;">
      <p style="font-size: 10pt; font-weight: bold; margin: 0 0 4pt 0; text-transform: uppercase; color: #4B5563;">
        Disusun Oleh:
      </p>
      <h2 style="font-size: 14pt; font-weight: bold; margin: 0; text-transform: uppercase;">
        ${data.profile.namaMadrasah}
      </h2>
      <p style="font-size: 10.5pt; font-weight: bold; margin: 4pt 0;">
        NSM: ${data.profile.nsm} &nbsp;|&nbsp; NPSN: ${data.profile.npsn}
      </p>
      <p style="font-size: 9.5pt; margin: 4pt 0 0 0; color: #374151;">
        ${data.profile.alamat ? `${data.profile.alamat}, ` : ''}Kec. ${data.profile.kecamatan}<br>
        Kab./Kota ${data.profile.kabupaten}, Provinsi ${data.profile.provinsi}
      </p>
    </div>

    <div style="margin-top: 35pt; font-size: 10.5pt;">
      <p style="font-weight: bold; margin: 0;">KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</p>
      <p style="font-weight: bold; margin: 2pt 0;">PROVINSI ${data.profile.provinsi.toUpperCase()}</p>
      <p style="margin: 4pt 0 0 0; font-size: 9.5pt; color: #4B5563;">
        Tahun Anggaran ${data.periode.tahunAnggaran}
      </p>
    </div>
  </div>

  <br clear="all" class="page-break">

  <!-- ============================================================== -->
  <!-- 2. LEMBAR PENGESAHAN LPJ BOS MADRASAH                          -->
  <!-- ============================================================== -->
  <!-- Kop Surat -->
  <table class="kop-table">
    <tr>
      <td style="width: 15%; text-align: center;">
        <div style="font-size: 26pt; font-weight: bold; color: #007138;">★</div>
      </td>
      <td style="width: 85%; text-align: center;">
        <div style="font-size: 12pt; font-weight: bold;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
        <div style="font-size: 11pt; font-weight: bold;">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</div>
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">${data.profile.namaMadrasah}</div>
        <div style="font-size: 9pt;">${data.profile.alamat}, Kec. ${data.profile.kecamatan}, Kab. ${data.profile.kabupaten} • Telp: ${data.profile.telepon || '-'}, Email: ${data.profile.email || '-'}</div>
      </td>
    </tr>
  </table>
  <div class="kop-line"></div>

  <div class="doc-title">LEMBAR PENGESAHAN LAPORAN PERTANGGUNGJAWABAN</div>
  <div class="doc-subtitle">BANTUAN OPERASIONAL SEKOLAH (BOS) TAHUN ANGGARAN ${data.periode.tahunAnggaran}</div>

  <p style="text-align: justify; text-indent: 24pt; margin-top: 12pt;">
    Laporan Pertanggungjawaban (LPJ) Penggunaan Dana Bantuan Operasional Sekolah (BOS) pada <b>${data.profile.namaMadrasah}</b> Periode <b>${data.periode.tahap}</b> Tahun Anggaran <b>${data.periode.tahunAnggaran}</b> telah diperiksa, diverifikasi, dan disetujui sesuai dengan Petunjuk Teknis Pengelolaan Dana BOS Madrasah Kementerian Agama Republik Indonesia.
  </p>

  <table style="width: 100%; border-collapse: collapse; border: none; margin: 14pt 0; font-size: 10.5pt;">
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">1. Nama Madrasah</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${data.profile.namaMadrasah}</b></td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">2. Nomor Statistik Madrasah (NSM)</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${data.profile.nsm || '-'}</b></td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">3. Nomor Pokok Sekolah Nasional (NPSN)</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${data.profile.npsn || '-'}</b></td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">4. Jenjang & Status Madrasah</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;">${data.profile.jenjang} / ${data.profile.status.toUpperCase()}</td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">5. Total Dana BOS Diterima</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${formatRupiah(totalPenerimaan)}</b></td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">6. Total Belanja / Pengeluaran (SPJ)</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${formatRupiah(totalPengeluaran)}</b></td>
    </tr>
    <tr>
      <td style="width: 210pt; border: none; padding: 2.5pt 0; vertical-align: top;">7. Sisa Kas / Saldo Bank</td>
      <td style="width: 15pt; border: none; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2.5pt 0; vertical-align: top;"><b>${formatRupiah(sisaKas)}</b></td>
    </tr>
  </table>

  <p style="text-align: justify; text-indent: 24pt;">
    Demikian lembar pengesahan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
  </p>

  <table class="signature-table" style="margin-top: 30pt;">
    <tr>
      <td style="width: 50%; text-align: center;">
        Mengetahui,<br>
        <b>Ketua Komite Madrasah</b><br><br><br><br><br>
        <u><b>${data.pejabat.namaKetuaKomite || 'H. Daeng Rahman, S.Sos'}</b></u>
      </td>
      <td style="width: 50%; text-align: center;">
        ${data.pejabat.tempatPembuatan}, ${formatDateIndo(data.pejabat.tanggalPengesahan)}<br>
        <b>Kepala ${data.profile.namaMadrasah}</b><br><br><br><br><br>
        <u><b>${data.pejabat.namaKepala}</b></u><br>
        NIP. ${data.pejabat.nipKepala || '-'}
      </td>
    </tr>
  </table>

  <br clear="all" class="page-break">

  <!-- ============================================================== -->
  <!-- 3. SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJB)             -->
  <!-- ============================================================== -->
  <table class="kop-table">
    <tr>
      <td style="width: 15%; text-align: center;">
        <div style="font-size: 26pt; font-weight: bold; color: #007138;">★</div>
      </td>
      <td style="width: 85%; text-align: center;">
        <div style="font-size: 12pt; font-weight: bold;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
        <div style="font-size: 11pt; font-weight: bold;">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</div>
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">${data.profile.namaMadrasah}</div>
        <div style="font-size: 9pt;">${data.profile.alamat}, Kec. ${data.profile.kecamatan}, Kab. ${data.profile.kabupaten} • Telp: ${data.profile.telepon || '-'}, Email: ${data.profile.email || '-'}</div>
      </td>
    </tr>
  </table>
  <div class="kop-line"></div>

  <div class="doc-title">SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJB)</div>
  <div class="doc-subtitle">Nomor: ${data.sptjb.noSurat}</div>

  <p>Yang bertanda tangan di bawah ini:</p>
  <table style="width: 100%; border-collapse: collapse; border: none; margin: 8pt 0 12pt 0; font-size: 10.5pt;">
    <tr>
      <td style="width: 190pt; border: none; padding: 2pt 0; vertical-align: top;">1. Nama Kepala Madrasah</td>
      <td style="width: 15pt; border: none; padding: 2pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2pt 0; vertical-align: top;"><b>${data.pejabat.namaKepala}</b></td>
    </tr>
    <tr>
      <td style="width: 190pt; border: none; padding: 2pt 0; vertical-align: top;">2. NIP / NPK</td>
      <td style="width: 15pt; border: none; padding: 2pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2pt 0; vertical-align: top;">${data.pejabat.nipKepala || '-'}</td>
    </tr>
    <tr>
      <td style="width: 190pt; border: none; padding: 2pt 0; vertical-align: top;">3. Jabatan</td>
      <td style="width: 15pt; border: none; padding: 2pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2pt 0; vertical-align: top;">Kepala ${data.profile.namaMadrasah}</td>
    </tr>
    <tr>
      <td style="width: 190pt; border: none; padding: 2pt 0; vertical-align: top;">4. Alamat Madrasah</td>
      <td style="width: 15pt; border: none; padding: 2pt 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none; padding: 2pt 0; vertical-align: top;">${data.profile.alamat}, Kec. ${data.profile.kecamatan}, Kab. ${data.profile.kabupaten}</td>
    </tr>
  </table>

  <p style="margin-top: 8pt;">Dengan ini menyatakan dengan sesungguhnya bahwa:</p>
  <ol class="sptjb-list">
    <li>
      Bertanggung jawab penuh atas penggunaan dana Bantuan Operasional Sekolah (BOS) Periode <b>${data.periode.tahap}</b> Tahun Anggaran <b>${data.periode.tahunAnggaran}</b> sebesar <b>${formatRupiah(totalPenerimaan)}</b> (<i>${terbilang(totalPenerimaan)}</i>).
    </li>
    <li>
      Realisasi belanja yang telah dibayarkan sebesar <b>${formatRupiah(totalPengeluaran)}</b> (<i>${terbilang(totalPengeluaran)}</i>) telah dilaksanakan sesuai dengan Rencana Kerja dan Anggaran Madrasah (RKAM) serta petunjuk teknis yang berlaku.
    </li>
    <li>
      Seluruh bukti-bukti pengeluaran berupa kwitansi, faktur/nota, daftar honor, dan bukti fisik pengadaan barang/jasa yang sah dan lengkap telah diperiksa dan disimpan dengan aman di madrasah untuk keperluan pemeriksaan/audit.
    </li>
    <li>
      Kewajiban perpajakan atas transaksi pengeluaran dana BOS sebesar <b>${formatRupiah(totalPajak)}</b> telah dipungut dan disetorkan ke Kas Negara sesuai ketentuan perundang-undangan perpajakan yang berlaku.
    </li>
    <li>
      Apabila di kemudian hari terdapat kekeliruan, kelebihan pembayaran, atau penyimpangan atas penggunaan dana BOS tersebut, saya bersedia bertanggung jawab secara hukum dan mengembalikan kerugian negara ke Kas Negara.
    </li>
  </ol>

  <p style="text-align: justify; margin-top: 6pt;">
    Demikian Surat Pernyataan Tanggung Jawab Belanja ini dibuat dengan sadar dan penuh rasa tanggung jawab.
  </p>

  <table class="signature-table" style="margin-top: 18pt;">
    <tr>
      <td style="width: 50%; text-align: center;">
        Mengetahui,<br>
        <b>Ketua Komite Madrasah</b><br><br><br><br><br>
        <u><b>${data.pejabat.namaKetuaKomite || 'H. Daeng Rahman, S.Sos'}</b></u>
      </td>
      <td style="width: 50%; text-align: center;">
        ${data.pejabat.tempatPembuatan}, ${formatDateIndo(data.sptjb.tanggalSurat)}<br>
        <b>Kepala ${data.profile.namaMadrasah}</b><br>
        <span style="font-size: 8.5pt; color: #4B5563;">(Materai Rp 10.000)</span><br><br><br><br>
        <u><b>${data.pejabat.namaKepala}</b></u><br>
        NIP. ${data.pejabat.nipKepala || '-'}
      </td>
    </tr>
  </table>

  <br clear="all" class="page-break">

  <!-- ============================================================== -->
  <!-- 4. FORM BOS K-1: LAPORAN PENERIMAAN PER SUMBER DANA            -->
  <!-- ============================================================== -->
  <div class="text-center">
    <h3 style="font-size: 12pt; font-weight: bold; margin: 0;">FORM BOS K-1</h3>
    <h2 style="font-size: 13pt; font-weight: bold; margin: 2pt 0;">LAPORAN PENGGUNAAN DANA PER SUMBER DANA</h2>
    <p style="font-size: 10.5pt; margin: 0 0 10pt 0;">Periode: ${data.periode.tahap} • Tahun Anggaran ${data.periode.tahunAnggaran}</p>
  </div>

  <table class="data-table" border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th style="width: 6%;">No</th>
        <th style="width: 32%;">Sumber Penerimaan Dana</th>
        <th style="width: 22%;">No. Rekening / Bank</th>
        <th style="width: 20%;">Pagu Alokasi (Rp)</th>
        <th style="width: 20%;">Jumlah Diterima (Rp)</th>
      </tr>
    </thead>
    <tbody>
      ${data.sumberDana.map((item, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-left"><b>${item.namaSumber}</b><br><span style="font-size: 8.5pt; color: #4B5563;">${item.keterangan || ''}</span></td>
          <td class="text-left">${item.noRekening}</td>
          <td class="text-right nowrap">${formatRupiah(item.alokasiPagu ?? item.diterima)}</td>
          <td class="text-right nowrap text-bold">${formatRupiah(item.diterima)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3" class="text-right text-bold">TOTAL PENERIMAAN DANA BOS:</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalPagu)}</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalPenerimaan)}</td>
      </tr>
    </tbody>
  </table>

  <!-- ============================================================== -->
  <!-- 5. FORM BOS K-2: LAPORAN REALISASI 8 STANDAR RKAM               -->
  <!-- ============================================================== -->
  <br>
  <div class="text-center">
    <h3 style="font-size: 12pt; font-weight: bold; margin: 0;">FORM BOS K-2</h3>
    <h2 style="font-size: 13pt; font-weight: bold; margin: 2pt 0;">LAPORAN REALISASI PENGGUNAAN DANA PER KEGIATAN</h2>
    <p style="font-size: 10pt; margin: 0 0 8pt 0;">Rekapitulasi Serapan Anggaran Berdasarkan 8 Standar Nasional Pendidikan (RKAM)</p>
  </div>

  <table class="data-table" border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 25%;">Standar SNP / RKAM</th>
        <th style="width: 10%;">Kode</th>
        <th style="width: 26%;">Uraian Nama Kegiatan</th>
        <th style="width: 9%;">Vol</th>
        <th style="width: 13%;">Anggaran (Rp)</th>
        <th style="width: 13%;">Realisasi (Rp)</th>
        <th style="width: 7%;">%</th>
      </tr>
    </thead>
    <tbody>
      ${data.realisasiKegiatan.map((item, idx) => {
        const pct = item.anggaran > 0 ? ((item.realisasi / item.anggaran) * 100).toFixed(0) : 0;
        return `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="text-left">${item.standarSNP}</td>
            <td class="text-center font-mono" style="font-size: 8.5pt;">${item.kodeKegiatan}</td>
            <td class="text-left">${item.namaKegiatan}</td>
            <td class="text-center nowrap">${item.volume} ${item.satuan}</td>
            <td class="text-right nowrap">${formatRupiah(item.anggaran)}</td>
            <td class="text-right nowrap text-bold">${formatRupiah(item.realisasi)}</td>
            <td class="text-center text-bold">${pct}%</td>
          </tr>
        `;
      }).join('')}
      <tr class="total-row">
        <td colspan="5" class="text-right text-bold">TOTAL REALISASI KEGIATAN RKAM:</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalAnggaran)}</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalRealisasi)}</td>
        <td class="text-center text-bold">100%</td>
      </tr>
    </tbody>
  </table>

  <br clear="all" class="page-break">

  <!-- ============================================================== -->
  <!-- 6. FORM BOS K-3: REKAPITULASI BUKTI PENGELUARAN & KWITANSI     -->
  <!-- ============================================================== -->
  <div class="text-center">
    <h3 style="font-size: 12pt; font-weight: bold; margin: 0;">FORM BOS K-3</h3>
    <h2 style="font-size: 13pt; font-weight: bold; margin: 2pt 0;">REKAPITULASI BUKTI PENGELUARAN & KWITANSI (SPJ)</h2>
    <p style="font-size: 10.5pt; margin: 0 0 10pt 0;">Rincian Bukti Transaksi, Faktur Belanja, dan Surat Pertanggungjawaban Sah</p>
  </div>

  <table class="data-table" border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 14%;">No. Bukti / SPJ</th>
        <th style="width: 11%;">Tanggal</th>
        <th style="width: 12%;">Kode Akun</th>
        <th style="width: 20%;">Penerima / Rekanan</th>
        <th style="width: 23%;">Uraian Pembelanjaan</th>
        <th style="width: 15%;">Nominal (Rp)</th>
      </tr>
    </thead>
    <tbody>
      ${data.buktiPengeluaran.map((item, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-center font-mono text-bold" style="font-size: 8.5pt;">${item.noBukti}</td>
          <td class="text-center nowrap">${item.tanggal}</td>
          <td class="text-center" style="font-size: 8.5pt;">${item.kodeAkun}</td>
          <td class="text-left"><b>${item.penerima}</b></td>
          <td class="text-left">${item.uraian}</td>
          <td class="text-right nowrap text-bold">${formatRupiah(item.nominal)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="6" class="text-right text-bold">TOTAL PENGELUARAN BELANJA (SPJ):</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalPengeluaran)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Ringkasan Saldo Kas -->
  <table style="width: 100%; border: 1pt solid #000000; border-collapse: collapse; margin-top: 6pt; background-color: #F9FAFB;">
    <tr>
      <td style="padding: 6pt; border: 1pt solid #000000; text-align: center; width: 33.3%;">
        <span style="font-size: 9pt; color: #4B5563; display: block;">Total Penerimaan Dana BOS:</span>
        <b style="font-size: 10.5pt; color: #047857;">${formatRupiah(totalPenerimaan)}</b>
      </td>
      <td style="padding: 6pt; border: 1pt solid #000000; text-align: center; width: 33.3%;">
        <span style="font-size: 9pt; color: #4B5563; display: block;">Total Realisasi Belanja:</span>
        <b style="font-size: 10.5pt; color: #B45309;">${formatRupiah(totalPengeluaran)}</b>
      </td>
      <td style="padding: 6pt; border: 1pt solid #000000; text-align: center; width: 33.3%;">
        <span style="font-size: 9pt; color: #4B5563; display: block;">Sisa Saldo Kas / Bank:</span>
        <b style="font-size: 10.5pt; color: #1D4ED8;">${formatRupiah(sisaKas)}</b>
      </td>
    </tr>
  </table>

  <!-- ============================================================== -->
  <!-- 7. FORM BOS K-6: REKAPITULASI PAJAK (PPh & PPN)                -->
  <!-- ============================================================== -->
  <br>
  <div class="text-center">
    <h3 style="font-size: 12pt; font-weight: bold; margin: 0;">FORM BOS K-6</h3>
    <h2 style="font-size: 13pt; font-weight: bold; margin: 2pt 0;">REKAPITULASI PEMOTONGAN DAN PENYETORAN PAJAK</h2>
    <p style="font-size: 10.5pt; margin: 0 0 10pt 0;">Daftar Pungutan PPh Pasal 21, 22, 23, PPN dan Nomor Transaksi Penerimaan Negara (NTPN)</p>
  </div>

  <table class="data-table" border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 15%;">No. Bukti</th>
        <th style="width: 12%;">Jenis Pajak</th>
        <th style="width: 16%;">Dasar Pajak (DPP)</th>
        <th style="width: 8%;">Tarif</th>
        <th style="width: 16%;">Jumlah Pajak (Rp)</th>
        <th style="width: 16%;">NTPN / Kode Billing</th>
        <th style="width: 12%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${data.rekapPajak.length === 0 ? `
        <tr>
          <td colspan="8" class="text-center" style="padding: 10pt; font-style: italic; color: #4B5563;">
            - NIHIL (Tidak Ada Pemotongan dan Penyetoran Pajak pada Periode Ini) -
          </td>
        </tr>
      ` : data.rekapPajak.map((item, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-center font-mono" style="font-size: 8.5pt;">${item.noBukti}</td>
          <td class="text-center text-bold">${item.jenisPajak}</td>
          <td class="text-right nowrap">${formatRupiah(item.dpp)}</td>
          <td class="text-center">${item.tarif}%</td>
          <td class="text-right nowrap text-bold">${formatRupiah(item.jumlahPajak)}</td>
          <td class="text-center font-mono" style="font-size: 8.5pt;">${item.ntpn || '-'}</td>
          <td class="text-center text-bold">${item.statusSetor}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="5" class="text-right text-bold">TOTAL PAJAK DISETORKAN:</td>
        <td class="text-right nowrap text-bold">${formatRupiah(totalPajak)}</td>
        <td colspan="2" class="text-center">-</td>
      </tr>
    </tbody>
  </table>

  <!-- Tanda Tangan Dokumen Keuangan -->
  <table class="signature-table" style="margin-top: 25pt;">
    <tr>
      <td style="width: 50%; text-align: center;">
        Mengetahui,<br>
        <b>Kepala ${data.profile.namaMadrasah}</b><br><br><br><br><br>
        <u><b>${data.pejabat.namaKepala}</b></u><br>
        NIP. ${data.pejabat.nipKepala || '-'}
      </td>
      <td style="width: 50%; text-align: center;">
        ${data.pejabat.tempatPembuatan}, ${formatDateIndo(data.pejabat.tanggalPengesahan)}<br>
        <b>Bendahara Dana BOS</b><br><br><br><br><br>
        <u><b>${data.pejabat.namaBendahara}</b></u><br>
        NIP. ${data.pejabat.nipBendahara || '-'}
      </td>
    </tr>
  </table>

  ${data.notaPesananBast && data.notaPesananBast.length > 0 ? `
    ${data.notaPesananBast.map((sp, idx) => `
      <br clear="all" class="page-break">
      <!-- ============================================================== -->
      <!-- SURAT PESANAN (SP) / NOTA PESANAN BARANG                       -->
      <!-- ============================================================== -->
      <table class="kop-table">
        <tr>
          <td class="kop-logo-cell">
            <span style="font-size: 26pt; color: #15803d; font-family: Arial, sans-serif;">★</span>
          </td>
          <td class="kop-text-cell">
            <span class="kop-instansi">KEMENTERIAN AGAMA REPUBLIK INDONESIA</span><br>
            <span class="kop-kabupaten">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</span><br>
            <span class="kop-madrasah">${data.profile.namaMadrasah}</span><br>
            <span class="kop-alamat">${data.profile.alamat}, Kec. ${data.profile.kecamatan}, Kab. ${data.profile.kabupaten} • Telp: ${data.profile.telepon || '-'}</span>
          </td>
        </tr>
      </table>
      <div class="kop-border-thick"></div>
      <div class="kop-border-thin"></div>

      <div class="doc-title" style="margin-top: 10pt;">SURAT PESANAN (SP) / NOTA PESANAN BARANG</div>
      <div class="doc-subtitle">Nomor: <b>${sp.noSuratPesanan}</b></div>

      <table class="no-border" style="margin-bottom: 8pt;">
        <tr>
          <td style="width: 80pt;">Kepada Yth.</td>
          <td>: <b>${sp.namaPenyedia}</b></td>
        </tr>
        <tr>
          <td>Nama Toko</td>
          <td>: <b>${sp.namaToko}</b></td>
        </tr>
        <tr>
          <td>Alamat</td>
          <td>: ${sp.alamatToko}</td>
        </tr>
        ${sp.teleponToko ? `<tr><td>Telepon/HP</td><td>: ${sp.teleponToko}</td></tr>` : ''}
      </table>

      <p style="text-align: justify; margin-bottom: 8pt;">
        Dengan hormat, sehubungan dengan pelaksanaan program Bantuan Operasional Sekolah (BOS) Tahap <b>${data.periode.tahap}</b> Tahun Anggaran <b>${data.periode.tahunAnggaran}</b> pada <b>${data.profile.namaMadrasah}</b>, dengan ini kami mengajukan pesanan barang/jasa sebagai berikut:
      </p>

      <table class="content-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 25pt;">No</th>
            <th>Nama Barang / Uraian</th>
            <th>Spesifikasi / Merk</th>
            <th class="text-center" style="width: 40pt;">Jumlah</th>
            <th class="text-center" style="width: 45pt;">Satuan</th>
            <th class="text-right" style="width: 75pt;">Harga Satuan</th>
            <th class="text-right" style="width: 85pt;">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          ${sp.itemsBarang.map((item, bIdx) => `
            <tr>
              <td class="text-center">${bIdx + 1}</td>
              <td class="text-bold">${item.namaBarang}</td>
              <td>${item.spesifikasi || '-'}</td>
              <td class="text-center">${item.volume}</td>
              <td class="text-center">${item.satuan}</td>
              <td class="text-right nowrap">${formatRupiah(item.hargaSatuan)}</td>
              <td class="text-right nowrap text-bold">${formatRupiah(item.totalHarga)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="6" class="text-right text-bold">TOTAL NILAI PESANAN:</td>
            <td class="text-right nowrap text-bold">${formatRupiah(sp.totalNominal)}</td>
          </tr>
        </tbody>
      </table>

      <div class="terbilang-box" style="margin: 8pt 0;">
        <b>Terbilang:</b> <i>${terbilang(sp.totalNominal).toUpperCase()} RUPIAH</i>
      </div>

      <div style="font-size: 10pt; line-height: 1.3; margin: 8pt 0;">
        <b>Ketentuan dan Syarat Pemesanan:</b>
        <ol style="margin-top: 2pt; margin-bottom: 4pt; padding-left: 15pt;">
          <li>Waktu penyerahan barang: <b>${sp.waktuPenyerahan}</b>.</li>
          <li>Tempat penyerahan barang: <b>${sp.tempatPenyerahan}</b>.</li>
          <li>Barang yang dikirim harus dalam kondisi 100% baru, berkualitas baik, dan sesuai dengan spesifikasi yang dipesan.</li>
          <li>Pembayaran dilakukan secara penuh setelah barang diperiksa dan dinyatakan lengkap melalui Berita Acara Serah Terima (BAST).</li>
        </ol>
      </div>

      <table class="signature-table" style="margin-top: 15pt;">
        <tr>
          <td style="width: 50%; text-align: center;">
            Menerima & Menyetujui Pesanan,<br>
            <b>${sp.namaToko}</b><br><br><br><br><br>
            <u><b>${sp.namaPenyedia}</b></u><br>
            ${sp.jabatanPenyedia || 'Pimpinan / Pemilik'}
          </td>
          <td style="width: 50%; text-align: center;">
            ${data.pejabat.tempatPembuatan}, ${formatDateIndo(sp.tanggalPesanan)}<br>
            <b>Pejabat Pemesan / Kepala Madrasah</b><br><br><br><br><br>
            <u><b>${sp.namaPemesan || data.pejabat.namaKepala}</b></u><br>
            NIP. ${sp.nipPemesan || data.pejabat.nipKepala || '-'}
          </td>
        </tr>
      </table>

      <br clear="all" class="page-break">
      <!-- ============================================================== -->
      <!-- BERITA ACARA SERAH TERIMA (BAST) BARANG / JASA                 -->
      <!-- ============================================================== -->
      <table class="kop-table">
        <tr>
          <td class="kop-logo-cell">
            <span style="font-size: 26pt; color: #15803d; font-family: Arial, sans-serif;">★</span>
          </td>
          <td class="kop-text-cell">
            <span class="kop-instansi">KEMENTERIAN AGAMA REPUBLIK INDONESIA</span><br>
            <span class="kop-kabupaten">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${data.profile.kabupaten.toUpperCase()}</span><br>
            <span class="kop-madrasah">${data.profile.namaMadrasah}</span><br>
            <span class="kop-alamat">${data.profile.alamat}, Kec. ${data.profile.kecamatan}, Kab. ${data.profile.kabupaten} • Telp: ${data.profile.telepon || '-'}</span>
          </td>
        </tr>
      </table>
      <div class="kop-border-thick"></div>
      <div class="kop-border-thin"></div>

      <div class="doc-title" style="margin-top: 10pt;">BERITA ACARA SERAH TERIMA (BAST) BARANG / JASA</div>
      <div class="doc-subtitle">Nomor: <b>${sp.noBast}</b></div>

      <p style="text-align: justify; margin-bottom: 6pt;">
        Pada hari ini <b>${sp.hariBast || 'Senin'}</b>, tanggal <b>${formatDateIndo(sp.tanggalBast)}</b>, bertempat di <b>${sp.tempatPenyerahan}</b>, kami yang bertanda tangan di bawah ini:
      </p>

      <table class="no-border" style="margin-bottom: 6pt;">
        <tr>
          <td style="width: 20pt; vertical-align: top;"><b>I.</b></td>
          <td style="width: 70pt; vertical-align: top;"><b>Nama</b></td>
          <td style="vertical-align: top;">: <b>${sp.namaPenyedia}</b></td>
        </tr>
        <tr>
          <td></td>
          <td>Jabatan</td>
          <td>: ${sp.jabatanPenyedia || 'Pimpinan / Pemilik'} (${sp.namaToko})</td>
        </tr>
        <tr>
          <td></td>
          <td>Alamat</td>
          <td>: ${sp.alamatToko}</td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2"><i>Selanjutnya disebut sebagai <b>PIHAK PERTAMA (Yang Menyerahkan)</b>.</i></td>
        </tr>
        <tr><td colspan="3" style="height: 4pt;"></td></tr>
        <tr>
          <td style="vertical-align: top;"><b>II.</b></td>
          <td style="vertical-align: top;"><b>Nama</b></td>
          <td style="vertical-align: top;">: <b>${sp.namaPemesan || data.pejabat.namaKepala}</b></td>
        </tr>
        <tr>
          <td></td>
          <td>NIP</td>
          <td>: ${sp.nipPemesan || data.pejabat.nipKepala || '-'}</td>
        </tr>
        <tr>
          <td></td>
          <td>Jabatan</td>
          <td>: ${sp.jabatanPemesan || `Kepala ${data.profile.namaMadrasah} / PPK`}</td>
        </tr>
        <tr>
          <td></td>
          <td>Unit Kerja</td>
          <td>: ${data.profile.namaMadrasah}</td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2"><i>Selanjutnya disebut sebagai <b>PIHAK KEDUA (Yang Menerima)</b>.</i></td>
        </tr>
      </table>

      <p style="text-align: justify; margin-bottom: 6pt;">
        Berdasarkan Surat Pesanan Nomor: <b>${sp.noSuratPesanan}</b> tanggal <b>${formatDateIndo(sp.tanggalPesanan)}</b>, kedua belah pihak menyatakan bahwa PIHAK PERTAMA telah menyerahkan barang/hasil pekerjaan kepada PIHAK KEDUA dan PIHAK KEDUA telah memeriksa dan menerima barang tersebut dalam keadaan 100% baik, lengkap, dan sesuai pesanan:
      </p>

      <table class="content-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 25pt;">No</th>
            <th>Nama Barang / Pekerjaan</th>
            <th>Spesifikasi</th>
            <th class="text-center" style="width: 35pt;">Qty</th>
            <th class="text-center" style="width: 40pt;">Satuan</th>
            <th class="text-right" style="width: 70pt;">Harga Satuan</th>
            <th class="text-right" style="width: 80pt;">Total Harga</th>
            <th class="text-center" style="width: 50pt;">Kondisi</th>
          </tr>
        </thead>
        <tbody>
          ${sp.itemsBarang.map((item, bIdx) => `
            <tr>
              <td class="text-center">${bIdx + 1}</td>
              <td class="text-bold">${item.namaBarang}</td>
              <td>${item.spesifikasi || '-'}</td>
              <td class="text-center">${item.volume}</td>
              <td class="text-center">${item.satuan}</td>
              <td class="text-right nowrap">${formatRupiah(item.hargaSatuan)}</td>
              <td class="text-right nowrap text-bold">${formatRupiah(item.totalHarga)}</td>
              <td class="text-center text-bold">${item.kondisi || 'Baik'}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="6" class="text-right text-bold">TOTAL NILAI BAST:</td>
            <td class="text-right nowrap text-bold">${formatRupiah(sp.totalNominal)}</td>
            <td class="text-center text-bold">100% Sesuai</td>
          </tr>
        </tbody>
      </table>

      <p style="text-align: justify; margin: 6pt 0;">
        ${sp.keteranganPemeriksaan || 'Demikian Berita Acara Serah Terima Barang/Jasa ini dibuat dengan sebenarnya dalam rangkap secukupnya untuk dipergunakan sebagaimana mestinya.'}
      </p>

      <table class="signature-table" style="margin-top: 15pt;">
        <tr>
          <td style="width: 50%; text-align: center;">
            <b>PIHAK PERTAMA</b><br>
            Yang Menyerahkan,<br>
            <b>${sp.namaToko}</b><br><br><br><br><br>
            <u><b>${sp.namaPenyedia}</b></u><br>
            ${sp.jabatanPenyedia || 'Pimpinan / Pemilik'}
          </td>
          <td style="width: 50%; text-align: center;">
            <b>PIHAK KEDUA</b><br>
            Yang Menerima,<br>
            <b>Kepala ${data.profile.namaMadrasah}</b><br><br><br><br><br>
            <u><b>${sp.namaPemesan || data.pejabat.namaKepala}</b></u><br>
            NIP. ${sp.nipPemesan || data.pejabat.nipKepala || '-'}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; padding-top: 15pt;">
            Mengetahui / Memverifikasi,<br>
            <b>Bendahara Dana BOS</b><br><br><br><br><br>
            <u><b>${data.pejabat.namaBendahara}</b></u><br>
            NIP. ${data.pejabat.nipBendahara || '-'}
          </td>
        </tr>
      </table>
    `).join('')}
  ` : ''}

  ${data.dokumentasi.length > 0 ? `
    <br clear="all" class="page-break">
    <!-- ============================================================== -->
    <!-- 8. LAMPIRAN DOKUMENTASI KEGIATAN & FISIK                       -->
    <!-- ============================================================== -->
    <div class="text-center">
      <h3 style="font-size: 12pt; font-weight: bold; margin: 0;">LAMPIRAN LPJ</h3>
      <h2 style="font-size: 13pt; font-weight: bold; margin: 2pt 0;">DOKUMENTASI KEGIATAN DAN BUKTI FISIK PELAKSANAAN</h2>
      <p style="font-size: 10.5pt; margin: 0 0 14pt 0;">Foto Kegiatan, Notulen, dan Berkas Pendukung LPJ BOS ${data.periode.tahunAnggaran}</p>
    </div>

    <table style="width: 100%; border: none; border-collapse: collapse;">
      ${data.dokumentasi.map((item, idx) => `
        <tr>
          <td style="padding: 10pt; border: 1pt solid #D1D5DB; background-color: #F9FAFB; margin-bottom: 10pt;">
            <div style="font-weight: bold; font-size: 11pt; border-bottom: 1pt solid #E5E7EB; padding-bottom: 4pt; margin-bottom: 6pt;">
              ${idx + 1}. [${item.kategori.toUpperCase()}] ${item.judul}
              <span style="float: right; font-weight: normal; font-size: 9.5pt; color: #4B5563;">Tanggal: ${item.tanggal}</span>
            </div>
            ${item.fileData && item.fileType === 'image' ? `
              <div style="text-align: center; margin: 8pt 0;">
                <img src="${item.fileData}" alt="${item.judul}" style="max-width: 480pt; max-height: 260pt; border: 1pt solid #9CA3AF;">
              </div>
            ` : ''}
            <div style="font-size: 10pt; color: #374151; margin-top: 4pt;">
              <b>Keterangan:</b> ${item.keterangan || '-'}
            </div>
          </td>
        </tr>
        <tr><td style="height: 10pt; border: none;"></td></tr>
      `).join('')}
    </table>
  ` : ''}

</div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanName = data.profile.namaMadrasah.replace(/[^a-zA-Z0-9]/g, '_') || 'Madrasah';
  link.download = `LPJ_BOS_${cleanName}_${data.periode.tahunAnggaran}_${paperSize}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
