import React, { useState, useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';
import { useAppContext } from '../../context';
import { BarcodeIcon, BackIcon } from '../Icons';

interface BarcodeGeneratorProps {
  onClose?: () => void;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [symbology, setSymbology] = useState('code128');
  const [text, setText] = useState('12345678');
  const [includeText, setIncludeText] = useState(true);
  const [barColor, setBarColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [scale, setScale] = useState(3);
  const [rotate, setRotate] = useState<'N'|'R'|'L'|'I'>('N');
  const [fileFormat, setFileFormat] = useState<'png' | 'svg'>('png');
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const symbologies = [
    { id: 'code128', label: 'Code 128' },
    { id: 'ean13', label: 'EAN-13' },
    { id: 'ean8', label: 'EAN-8' },
    { id: 'upca', label: 'UPC-A' },
    { id: 'upce', label: 'UPC-E' },
    { id: 'code39', label: 'Code 39' },
    { id: 'code93', label: 'Code 93' },
    { id: 'itf14', label: 'ITF-14' },
    { id: 'gs1-128', label: 'GS1-128' },
    { id: 'gs1databar', label: 'GS1 DataBar' },
    { id: 'qrcode', label: 'QR Code' },
    { id: 'datamatrix', label: 'Data Matrix' },
    { id: 'pdf417', label: 'PDF417' },
    { id: 'azteccode', label: 'Aztec Code' },
    { id: 'codabar', label: 'Codabar' },
    { id: 'pharmacode', label: 'Pharmacode' },
    { id: 'msi', label: 'MSI' },
    { id: 'telepen', label: 'Telepen' },
  ];

  useEffect(() => {
    renderBarcode();
  }, [symbology, text, includeText, barColor, bgColor, scale, rotate]);

  const renderBarcode = () => {
    if (!canvasRef.current || !text) return;

    try {
      // Clear previous error
      setError(null);

      bwipjs.toCanvas(canvasRef.current, {
        bcid: symbology,       // Barcode type
        text: text,            // Text to encode
        scale: scale,          // 3x scaling factor
        height: 10,            // Bar height, in millimeters
        includetext: includeText, // Show human-readable text
        textxalign: 'center',  // Always good to align center
        barcolor: barColor,
        backgroundcolor: bgColor.replace('#', ''),
        rotate: rotate,
      });
    } catch (e: any) {
      setError(e.message || t.bcError);
    }
  };

  const handleDownload = () => {
    if (fileFormat === 'png') {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `barcode-${symbology}-${text}.png`;
            link.href = canvasRef.current.toDataURL('image/png');
            link.click();
        }
    } else {
        try {
            // Using toSVG
            const svg = bwipjs.toSVG({
                bcid: symbology,
                text: text,
                scale: scale,
                height: 10,
                includetext: includeText,
                textxalign: 'center',
                barcolor: barColor,
                backgroundcolor: bgColor.replace('#', ''),
                rotate: rotate,
            });
            
            const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `barcode-${symbology}-${text}.svg`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (e: any) {
            setError(e.message || t.bcError);
        }
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-indigo-600 dark:text-indigo-400 p-1.5 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-lg">
            <BarcodeIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.bcTitle}
          </h2>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all"
            aria-label="Close"
          >
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Preview Section */}
        <div className="w-full lg:w-5/12 p-8 bg-slate-100 dark:bg-[#0B1120] flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800">
          <div className="relative group w-full flex flex-col items-center bg-white dark:bg-white rounded-xl p-8 shadow-lg min-h-[300px] justify-center">
            
            <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto"
            />
            
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 rounded-xl p-4 text-center">
                    <p className="text-red-500 font-bold">{error}</p>
                </div>
            )}
          </div>
          <p className="mt-8 text-xs font-mono text-slate-400 opacity-60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE PREVIEW
          </p>
        </div>

        {/* Controls Section */}
        <div className="w-full lg:w-7/12 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-[800px] bg-white dark:bg-[#0F172A]">
          
          <div className="space-y-6">
            
            {/* Input Content */}
            <div>
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t.bcContent}</label>
               <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white"
               />
            </div>

            {/* Symbology Selector */}
            <div>
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t.bcType}</label>
               <select
                 value={symbology}
                 onChange={(e) => setSymbology(e.target.value)}
                 className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white cursor-pointer"
               >
                 {symbologies.map(s => (
                   <option key={s.id} value={s.id}>{s.label}</option>
                 ))}
               </select>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-8"></div>

            {/* Customization */}
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span>⚙️</span> {t.bcOptions}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                   <input 
                    type="checkbox"
                    checked={includeText}
                    onChange={e => setIncludeText(e.target.checked)}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                   />
                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.bcShowText}</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.bcScale}: {scale}x</span>
                   <input 
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={scale}
                    onChange={e => setScale(Number(e.target.value))}
                    className="w-20 accent-indigo-600"
                   />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t.qrColorFg}</span>
                <div className="relative">
                   <input 
                    type="color" 
                    value={barColor} 
                    onChange={e => setBarColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-white dark:border-slate-700 shadow-sm p-0 overflow-hidden"
                   />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t.qrColorBg}</span>
                <div className="relative">
                   <input 
                    type="color" 
                    value={bgColor} 
                    onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-white dark:border-slate-700 shadow-sm p-0 overflow-hidden"
                   />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.bcFormat || "File Format"}</span>
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setFileFormat('png')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${fileFormat === 'png' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        PNG
                    </button>
                    <button 
                        onClick={() => setFileFormat('svg')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${fileFormat === 'svg' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        SVG
                    </button>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleDownload}
                    disabled={!!error}
                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                    ${error ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
                >
                    <span>📥</span> {t.bcDownload} ({fileFormat.toUpperCase()})
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};