import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LPJFullData } from '../types/lpj';

export type PaperSize = 'A4' | 'F4';

export interface ExportPdfOptions {
  paperSize?: PaperSize;
  onProgress?: (step: number, total: number, message: string) => void;
}

/**
 * Standard W3C OKLab to sRGB converter
 */
function oklabToRgb(L: number, a: number, b: number, alpha = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767434770 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toSRGB = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? clamped * 12.92
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const r255 = Math.round(toSRGB(r) * 255);
  const g255 = Math.round(toSRGB(g) * 255);
  const b255 = Math.round(toSRGB(bl) * 255);

  if (alpha < 1) {
    return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
  }
  return `rgb(${r255}, ${g255}, ${b255})`;
}

/**
 * Standard W3C OKLCH to sRGB converter
 */
function oklchToRgb(L: number, C: number, H: number, alpha = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return oklabToRgb(L, a, b, alpha);
}

/**
 * Converts modern CSS color functions (oklab, oklch, lab, lch, color-mix)
 * to standard sRGB rgb/rgba strings so html2canvas color parser will not fail.
 */
function sanitizeColorString(colorStr: string): string {
  if (!colorStr || typeof colorStr !== 'string') return colorStr;
  if (!/(oklab|oklch|lab|lch|color-mix|color\()/i.test(colorStr)) {
    return colorStr;
  }

  // Parse OKLCH: oklch(L C H [/ alpha]) or oklch(L C H alpha)
  let result = colorStr.replace(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|grad|rad|turn)?)(?:\s*(?:\/|\s)\s*([\d.]+%?))?\s*\)/gi,
    (_match, lStr, cStr, hStr, aStr) => {
      let L = parseFloat(lStr);
      if (lStr.includes('%')) L = L / 100;

      let C = parseFloat(cStr);
      if (cStr.includes('%')) C = (C / 100) * 0.4;

      let H = parseFloat(hStr);
      if (hStr.includes('rad')) H = (H * 180) / Math.PI;
      else if (hStr.includes('turn')) H = H * 360;
      else if (hStr.includes('grad')) H = (H * 360) / 400;

      let alpha = 1;
      if (aStr) {
        alpha = parseFloat(aStr);
        if (aStr.includes('%')) alpha = alpha / 100;
      }

      return oklchToRgb(L, C, H, isNaN(alpha) ? 1 : alpha);
    }
  );

  // Parse OKLAB: oklab(L a b [/ alpha])
  result = result.replace(
    /oklab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)(?:\s*(?:\/|\s)\s*([\d.]+%?))?\s*\)/gi,
    (_match, lStr, aStr, bStr, alphaStr) => {
      let L = parseFloat(lStr);
      if (lStr.includes('%')) L = L / 100;

      let a = parseFloat(aStr);
      if (aStr.includes('%')) a = (a / 100) * 0.4;

      let b = parseFloat(bStr);
      if (bStr.includes('%')) b = (b / 100) * 0.4;

      let alpha = 1;
      if (alphaStr) {
        alpha = parseFloat(alphaStr);
        if (alphaStr.includes('%')) alpha = alpha / 100;
      }

      return oklabToRgb(L, a, b, isNaN(alpha) ? 1 : alpha);
    }
  );

  // Fallback for remaining lab / lch / color-mix
  result = result.replace(/(?:lab|lch|color-mix|color)\([^;})]+\)/gi, (m) => {
    const lower = m.toLowerCase();
    if (lower.includes('white') || lower.includes('0.9') || lower.includes('0.8')) return '#f8fafc';
    if (lower.includes('emerald') || lower.includes('green')) return '#047857';
    if (lower.includes('red') || lower.includes('rose')) return '#dc2626';
    if (lower.includes('blue')) return '#2563eb';
    return '#1e293b';
  });

  return result;
}

/**
 * Sanitizes the cloned document created by html2canvas:
 * 1. Overrides getComputedStyle to return standard RGB/Hex.
 * 2. Applies official Indonesian ministry margins (Left 2.4cm, Right 1.8cm, Top 2.2cm, Bottom 2.0cm).
 * 3. Applies explicit inline sRGB styles to all tables, headers, and colored elements.
 * 4. Injects high-priority explicit CSS rules.
 */
function cleanModernCssColorsInDocument(doc: Document, isF4 = false) {
  // 1. Monkey patch getComputedStyle on the cloned iframe window
  const win = doc.defaultView;
  if (win && win.getComputedStyle) {
    const originalGetComputedStyle = win.getComputedStyle.bind(win);
    win.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
      const styleDeclaration = originalGetComputedStyle(elt, pseudoElt);

      return new Proxy(styleDeclaration, {
        get(target, prop, receiver) {
          if (prop === 'getPropertyValue') {
            return (propertyName: string) => {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && /(oklab|oklch|lab|lch|color-mix|color\()/i.test(val)) {
                return sanitizeColorString(val);
              }
              return val;
            };
          }

          const val = Reflect.get(target, prop, receiver);
          if (typeof val === 'string' && /(oklab|oklch|lab|lch|color-mix|color\()/i.test(val)) {
            return sanitizeColorString(val);
          }
          if (typeof val === 'function') {
            return val.bind(target);
          }
          return val;
        },
      });
    };
  }

  // 2. Explicitly sanitize all tables and table headers to prevent black fills
  const tables = doc.querySelectorAll('table');
  tables.forEach((tbl) => {
    tbl.style.backgroundColor = '#ffffff';
    tbl.style.color = '#0f172a';
  });

  const theadRows = doc.querySelectorAll('thead tr, tr.bg-slate-100, tr.bg-slate-50');
  theadRows.forEach((row) => {
    (row as HTMLElement).style.backgroundColor = '#f1f5f9';
    (row as HTMLElement).style.color = '#0f172a';
  });

  const tableHeaders = doc.querySelectorAll('th');
  tableHeaders.forEach((th) => {
    th.style.backgroundColor = '#f1f5f9';
    th.style.color = '#0f172a';
    th.style.borderColor = '#1e293b';
  });

  const tableCells = doc.querySelectorAll('td');
  tableCells.forEach((td) => {
    const parentRow = td.parentElement;
    if (parentRow && (parentRow.classList.contains('bg-slate-100') || parentRow.classList.contains('bg-slate-50'))) {
      td.style.backgroundColor = '#f1f5f9';
    } else {
      td.style.backgroundColor = '#ffffff';
    }
    td.style.color = '#0f172a';
    td.style.borderColor = '#334155';
  });

  // 3. Clean specific background classes in cloned DOM
  const slate50Elements = doc.querySelectorAll('.bg-slate-50');
  slate50Elements.forEach((el) => {
    (el as HTMLElement).style.backgroundColor = '#f8fafc';
    (el as HTMLElement).style.color = '#0f172a';
  });

  const slate100Elements = doc.querySelectorAll('.bg-slate-100');
  slate100Elements.forEach((el) => {
    (el as HTMLElement).style.backgroundColor = '#f1f5f9';
    (el as HTMLElement).style.color = '#0f172a';
  });

  const emerald50Elements = doc.querySelectorAll('.bg-emerald-50, .bg-emerald-50\\/60');
  emerald50Elements.forEach((el) => {
    (el as HTMLElement).style.backgroundColor = '#ecfdf5';
    (el as HTMLElement).style.color = '#064e3b';
  });

  // 4. Clean all <style> tags in cloned document
  const styles = doc.querySelectorAll('style');
  styles.forEach((styleTag) => {
    if (styleTag.textContent && /(oklab|oklch|lab|lch|color-mix|color\()/i.test(styleTag.textContent)) {
      styleTag.textContent = sanitizeColorString(styleTag.textContent);
    }
  });

  // 5. Clean inline style attributes
  const styledElements = doc.querySelectorAll<HTMLElement>('[style]');
  styledElements.forEach((el) => {
    const styleAttr = el.getAttribute('style');
    if (styleAttr && /(oklab|oklch|lab|lch|color-mix|color\()/i.test(styleAttr)) {
      el.setAttribute('style', sanitizeColorString(styleAttr));
    }
  });

  // 6. Injected high-priority explicit CSS override for pure sRGB rendering + Standard Kemenag Margins
  const pageWidth = isF4 ? '215mm' : '210mm';
  const pageMinHeight = isF4 ? '330mm' : '297mm';
  const coverMinHeight = isF4 ? '282mm' : '250mm';

  const overrideStyle = doc.createElement('style');
  overrideStyle.id = 'html2canvas-srgb-overrides';
  overrideStyle.textContent = `
    * {
      color-scheme: light !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box !important;
    }
    body, #lpj-print-container {
      background-color: #ffffff !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
    .print-sheet {
      box-shadow: none !important;
      margin: 0 auto !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
      width: ${pageWidth} !important;
      max-width: ${pageWidth} !important;
      min-height: ${pageMinHeight} !important;
      /* Standar Margin Resmi Kemenag: Kiri 2.0cm (penjilidan), Kanan 1.2cm, Atas 1.5cm, Bawah 1.5cm */
      padding: 15mm 12mm 15mm 20mm !important;
      box-sizing: border-box !important;
      font-size: 11.5pt !important;
      line-height: 1.45 !important;
      position: relative !important;
    }
    .print-cover-frame {
      min-height: ${coverMinHeight} !important;
      padding: 8mm 8mm !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      border: 3.5pt double #0f172a !important;
      margin: 0 !important;
    }
    table {
      border-collapse: collapse !important;
      width: 100% !important;
      background-color: #ffffff !important;
      margin-top: 5pt !important;
      margin-bottom: 7pt !important;
      font-size: 10pt !important;
    }
    th {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      border: 1px solid #1e293b !important;
      padding: 4.5pt 5pt !important;
      font-weight: bold !important;
      font-size: 10pt !important;
    }
    td {
      background-color: #ffffff !important;
      color: #0f172a !important;
      border: 1px solid #334155 !important;
      padding: 4pt 5pt !important;
      font-size: 9.5pt !important;
    }
    tr.bg-slate-100, tr.bg-slate-50, tr.bg-slate-100 td, tr.bg-slate-50 td {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
    }
    .no-border-table,
    .no-border-table th, 
    .no-border-table td,
    table.no-border-table,
    table.no-border-table th,
    table.no-border-table td {
      border: none !important;
      background-color: transparent !important;
      padding: 2.5pt 3.5pt !important;
      font-size: 11.5pt !important;
    }
    .bg-slate-50 { background-color: #f8fafc !important; }
    .bg-slate-100 { background-color: #f1f5f9 !important; }
    .bg-emerald-50 { background-color: #ecfdf5 !important; }
    .text-slate-900 { color: #0f172a !important; }
    .text-slate-800 { color: #1e293b !important; }
    .text-slate-700 { color: #334155 !important; }
    .text-slate-600 { color: #475569 !important; }
    .text-emerald-900 { color: #064e3b !important; }
    .text-emerald-800 { color: #065f46 !important; }
    .border-slate-900 { border-color: #0f172a !important; }
    .border-slate-800 { border-color: #1e293b !important; }
    .border-slate-300 { border-color: #cbd5e1 !important; }
    .border-slate-200 { border-color: #e2e8f0 !important; }
  `;
  doc.head.appendChild(overrideStyle);
}

/**
 * Export LPJ to clean, multi-page vector-raster PDF directly into user's downloads.
 * Supports A4 (210x297mm) and F4/Folio (215x330mm) standards used in Kemenag Madrasah.
 */
export async function exportLPJToPdf(
  data: LPJFullData,
  options: ExportPdfOptions = {}
): Promise<void> {
  const paperSize = options.paperSize || 'A4';
  const isF4 = paperSize === 'F4';
  const onProgress = options.onProgress;

  // Dimensions in millimeters
  const pageWidthMm = isF4 ? 215 : 210;
  const pageHeightMm = isF4 ? 330 : 297;
  const format: [number, number] | 'a4' = isF4 ? [215, 330] : 'a4';

  onProgress?.(1, 5, 'Menyiapkan dokumen LPJ...');

  // Find print container
  const printContainer = document.getElementById('lpj-print-container');
  if (!printContainer) {
    throw new Error('Elemen pratinjau LPJ tidak ditemukan');
  }

  // Get all print sheets
  const sheets = Array.from(printContainer.querySelectorAll<HTMLElement>('.print-sheet'));
  
  if (sheets.length === 0) {
    throw new Error('Tidak ada lembar halaman yang dapat diekspor');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: format,
    compress: true,
  });

  const totalSheets = sheets.length;

  for (let i = 0; i < totalSheets; i++) {
    const sheet = sheets[i];
    onProgress?.(
      i + 1,
      totalSheets,
      `Mengonversi Halaman ${i + 1} dari ${totalSheets}...`
    );

    // Render HTML element to high-res canvas with robust color and margin normalization in onclone
    const canvas = await html2canvas(sheet, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: isF4 ? 860 : 820,
      onclone: (clonedDoc) => {
        cleanModernCssColorsInDocument(clonedDoc, isF4);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = pageWidthMm;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage(format, 'portrait');
    }

    if (imgHeight <= pageHeightMm + 2) {
      // Sheet fits in single page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Long sheet (e.g. large table in K-2 or K-3) splits across pages seamlessly
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeightMm;

      while (heightLeft > 2) {
        position -= pageHeightMm;
        pdf.addPage(format, 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeightMm;
      }
    }
  }

  onProgress?.(totalSheets, totalSheets, 'Menyimpan berkas PDF...');

  const cleanName = data.profile.namaMadrasah.replace(/[^a-zA-Z0-9]/g, '_') || 'Madrasah';
  const fileName = `LPJ_BOS_${cleanName}_${data.periode.tahunAnggaran}.pdf`;

  pdf.save(fileName);
}

export type FontSizeScale = 'compact' | 'normal' | 'large' | 'extra';
export type MarginPreset = 'standard' | 'tight' | 'spacious';

/**
 * Configure dynamic CSS @page size, margins, and font scaling for browser print dialog
 */
export function setPrintPaperSize(
  paperSize: PaperSize = 'A4',
  fontSizeScale: FontSizeScale = 'large',
  marginPreset: MarginPreset = 'standard'
) {
  const existingStyle = document.getElementById('dynamic-print-paper-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  const isF4 = paperSize === 'F4';

  let marginCss = '1.5cm 1.2cm 1.5cm 2.0cm'; // standard
  if (marginPreset === 'tight') {
    marginCss = '1.0cm 1.0cm 1.0cm 1.2cm';
  } else if (marginPreset === 'spacious') {
    marginCss = '2.0cm 1.8cm 2.0cm 2.5cm';
  }

  let bodyFontSize = '12pt';
  let tableFontSize = '10.5pt';
  let tableTdFontSize = '10pt';
  let lineHeight = '1.45';

  if (fontSizeScale === 'extra') {
    bodyFontSize = '13pt';
    tableFontSize = '11.5pt';
    tableTdFontSize = '11pt';
    lineHeight = '1.5';
  } else if (fontSizeScale === 'normal') {
    bodyFontSize = '11pt';
    tableFontSize = '10pt';
    tableTdFontSize = '9.5pt';
    lineHeight = '1.4';
  } else if (fontSizeScale === 'compact') {
    bodyFontSize = '10pt';
    tableFontSize = '9pt';
    tableTdFontSize = '8.5pt';
    lineHeight = '1.35';
  }

  const styleEl = document.createElement('style');
  styleEl.id = 'dynamic-print-paper-style';
  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${isF4 ? '215mm 330mm' : 'A4 portrait'} !important;
        margin: 0mm !important; /* Menghilangkan judul, URL, tanggal, dan nomor halaman browser */
      }
      @page :left {
        margin: 0mm !important;
      }
      @page :right {
        margin: 0mm !important;
      }
      @page :first {
        margin: 0mm !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        font-size: ${bodyFontSize} !important;
        line-height: ${lineHeight} !important;
      }
      #lpj-print-container {
        font-size: ${bodyFontSize} !important;
        line-height: ${lineHeight} !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .print-sheet {
        padding: ${marginCss} !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
      }
      #lpj-print-container p,
      #lpj-print-container li {
        font-size: ${bodyFontSize} !important;
      }
      table {
        font-size: ${tableFontSize} !important;
      }
      th {
        font-size: ${tableFontSize} !important;
      }
      td {
        font-size: ${tableTdFontSize} !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
