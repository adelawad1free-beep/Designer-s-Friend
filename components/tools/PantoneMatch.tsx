import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context';
import { SwatchIcon, BackIcon, EyeDropperIcon } from '../Icons';

interface PantoneMatchProps {
  onClose?: () => void;
}

type GuideType = 'C' | 'U';

// --- Color Math Helpers (CIELAB Conversion) ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToXyz = (r: number, g: number, b: number) => {
  let r_ = r / 255; let g_ = g / 255; let b_ = b / 255;
  r_ = r_ > 0.04045 ? Math.pow((r_ + 0.055) / 1.055, 2.4) : r_ / 12.92;
  g_ = g_ > 0.04045 ? Math.pow((g_ + 0.055) / 1.055, 2.4) : g_ / 12.92;
  b_ = b_ > 0.04045 ? Math.pow((b_ + 0.055) / 1.055, 2.4) : b_ / 12.92;
  r_ *= 100; g_ *= 100; b_ *= 100;
  return {
    x: r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805,
    y: r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722,
    z: r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505
  };
};

const xyzToLab = (x: number, y: number, z: number) => {
  const refX = 95.047; const refY = 100.000; const refZ = 108.883;
  let x_ = x / refX; let y_ = y / refY; let z_ = z / refZ;
  x_ = x_ > 0.008856 ? Math.pow(x_, 1/3) : (7.787 * x_) + (16 / 116);
  y_ = y_ > 0.008856 ? Math.pow(y_, 1/3) : (7.787 * y_) + (16 / 116);
  z_ = z_ > 0.008856 ? Math.pow(z_, 1/3) : (7.787 * z_) + (16 / 116);
  return { l: (116 * y_) - 16, a: 500 * (x_ - y_), b: 200 * (y_ - z_) };
};

const hexToLab = (hex: string) => {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
};

const calculateDeltaE = (lab1: {l:number, a:number, b:number}, lab2: {l:number, a:number, b:number}) => {
  return Math.sqrt(Math.pow(lab1.l - lab2.l, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
};

/** 
 * Extended Dataset Simulation 
 * Representing the core spectrum of Pantone Formula Guide Coated (C) and Uncoated (U).
 */
const pantoneDataset = [
  // --- Formula Guide COATED (C) ---
  { code: 'PMS Yellow C', hex: '#FEDD00', guide: 'C' },
  { code: 'PMS Yellow 012 C', hex: '#FFD700', guide: 'C' },
  { code: 'PMS Orange 021 C', hex: '#FE5000', guide: 'C' },
  { code: 'PMS Warm Red C', hex: '#F9423A', guide: 'C' },
  { code: 'PMS Red 032 C', hex: '#EF3340', guide: 'C' },
  { code: 'PMS Rubine Red C', hex: '#CE0058', guide: 'C' },
  { code: 'PMS Rhodamine Red C', hex: '#E10098', guide: 'C' },
  { code: 'PMS Purple C', hex: '#BB29BB', guide: 'C' },
  { code: 'PMS Violet C', hex: '#440099', guide: 'C' },
  { code: 'PMS Blue 072 C', hex: '#10069F', guide: 'C' },
  { code: 'PMS Reflex Blue C', hex: '#001489', guide: 'C' },
  { code: 'PMS Process Blue C', hex: '#0085CA', guide: 'C' },
  { code: 'PMS Green C', hex: '#00AB84', guide: 'C' },
  { code: 'PMS Black C', hex: '#2D2926', guide: 'C' },
  { code: 'PMS 100 C', hex: '#F6E500', guide: 'C' },
  { code: 'PMS 101 C', hex: '#F7EA48', guide: 'C' },
  { code: 'PMS 102 C', hex: '#FDE400', guide: 'C' },
  { code: 'PMS 103 C', hex: '#CCB100', guide: 'C' },
  { code: 'PMS 116 C', hex: '#FFCD00', guide: 'C' },
  { code: 'PMS 123 C', hex: '#FFC82E', guide: 'C' },
  { code: 'PMS 130 C', hex: '#F2A900', guide: 'C' },
  { code: 'PMS 151 C', hex: '#FF8200', guide: 'C' },
  { code: 'PMS 165 C', hex: '#FF6720', guide: 'C' },
  { code: 'PMS 172 C', hex: '#FA4616', guide: 'C' },
  { code: 'PMS 179 C', hex: '#E44D2E', guide: 'C' },
  { code: 'PMS 185 C', hex: '#E4002B', guide: 'C' },
  { code: 'PMS 186 C', hex: '#C8102E', guide: 'C' },
  { code: 'PMS 192 C', hex: '#E40046', guide: 'C' },
  { code: 'PMS 200 C', hex: '#BA0C2F', guide: 'C' },
  { code: 'PMS 210 C', hex: '#F9A7B0', guide: 'C' },
  { code: 'PMS 219 C', hex: '#DA1884', guide: 'C' },
  { code: 'PMS 226 C', hex: '#D60270', guide: 'C' },
  { code: 'PMS 233 C', hex: '#AD0075', guide: 'C' },
  { code: 'PMS 247 C', hex: '#B6008B', guide: 'C' },
  { code: 'PMS 253 C', hex: '#9B26B6', guide: 'C' },
  { code: 'PMS 258 C', hex: '#8C4799', guide: 'C' },
  { code: 'PMS 266 C', hex: '#753BBD', guide: 'C' },
  { code: 'PMS 2726 C', hex: '#3E4EDE', guide: 'C' },
  { code: 'PMS 286 C', hex: '#0033A0', guide: 'C' },
  { code: 'PMS 287 C', hex: '#003087', guide: 'C' },
  { code: 'PMS 293 C', hex: '#003DA5', guide: 'C' },
  { code: 'PMS 300 C', hex: '#005EB8', guide: 'C' },
  { code: 'PMS 306 C', hex: '#00B5E2', guide: 'C' },
  { code: 'PMS 312 C', hex: '#00A9CE', guide: 'C' },
  { code: 'PMS 320 C', hex: '#009CA6', guide: 'C' },
  { code: 'PMS 327 C', hex: '#008675', guide: 'C' },
  { code: 'PMS 347 C', hex: '#009A44', guide: 'C' },
  { code: 'PMS 354 C', hex: '#00B140', guide: 'C' },
  { code: 'PMS 361 C', hex: '#43B02A', guide: 'C' },
  { code: 'PMS 368 C', hex: '#78BE20', guide: 'C' },
  { code: 'PMS 375 C', hex: '#97D700', guide: 'C' },
  { code: 'PMS 382 C', hex: '#C4D600', guide: 'C' },
  { code: 'PMS 485 C', hex: '#DA291C', guide: 'C' },
  { code: 'PMS 7462 C', hex: '#005F99', guide: 'C' },
  { code: 'PMS 7545 C', hex: '#425563', guide: 'C' },
  { code: 'PMS Cool Gray 1 C', hex: '#D9D9D6', guide: 'C' },
  { code: 'PMS Cool Gray 5 C', hex: '#97999B', guide: 'C' },
  { code: 'PMS Cool Gray 11 C', hex: '#53565A', guide: 'C' },

  // --- Formula Guide UNCOATED (U) ---
  { code: 'PMS Yellow U', hex: '#F6EB61', guide: 'U' },
  { code: 'PMS Yellow 012 U', hex: '#FFE000', guide: 'U' },
  { code: 'PMS Orange 021 U', hex: '#FF6D2F', guide: 'U' },
  { code: 'PMS Warm Red U', hex: '#F9635E', guide: 'U' },
  { code: 'PMS Red 032 U', hex: '#F9423A', guide: 'U' },
  { code: 'PMS Rubine Red U', hex: '#D10056', guide: 'U' },
  { code: 'PMS Purple U', hex: '#D689FF', guide: 'U' },
  { code: 'PMS Violet U', hex: '#6340B2', guide: 'U' },
  { code: 'PMS Blue 072 U', hex: '#2B3990', guide: 'U' },
  { code: 'PMS Reflex Blue U', hex: '#0054A6', guide: 'U' },
  { code: 'PMS Process Blue U', hex: '#0085AD', guide: 'U' },
  { code: 'PMS Green U', hex: '#00A94F', guide: 'U' },
  { code: 'PMS Black U', hex: '#313131', guide: 'U' },
  { code: 'PMS 100 U', hex: '#F9F1A5', guide: 'U' },
  { code: 'PMS 101 U', hex: '#F9F491', guide: 'U' },
  { code: 'PMS 102 U', hex: '#FFF200', guide: 'U' },
  { code: 'PMS 116 U', hex: '#FFD100', guide: 'U' },
  { code: 'PMS 123 U', hex: '#FFC72C', guide: 'U' },
  { code: 'PMS 130 U', hex: '#F0AB00', guide: 'U' },
  { code: 'PMS 151 U', hex: '#FF8200', guide: 'U' },
  { code: 'PMS 165 U', hex: '#FF671F', guide: 'U' },
  { code: 'PMS 185 U', hex: '#F9423A', guide: 'U' },
  { code: 'PMS 186 U', hex: '#CF102D', guide: 'U' },
  { code: 'PMS 200 U', hex: '#C6343F', guide: 'U' },
  { code: 'PMS 286 U', hex: '#005CAB', guide: 'U' },
  { code: 'PMS 287 U', hex: '#004A99', guide: 'U' },
  { code: 'PMS 293 U', hex: '#0061A8', guide: 'U' },
  { code: 'PMS 300 U', hex: '#0072C6', guide: 'U' },
  { code: 'PMS 306 U', hex: '#00B5E2', guide: 'U' },
  { code: 'PMS 347 U', hex: '#00A651', guide: 'U' },
  { code: 'PMS 354 U', hex: '#00B140', guide: 'U' },
  { code: 'PMS 361 U', hex: '#6CC24A', guide: 'U' },
  { code: 'PMS 485 U', hex: '#ED2E38', guide: 'U' },
  { code: 'PMS 7462 U', hex: '#0077C0', guide: 'U' },
  { code: 'PMS 7545 U', hex: '#586A78', guide: 'U' },
];

interface MatchResult {
  code: string;
  hex: string;
  distance: number;
  guide: string;
}

export const PantoneMatch: React.FC<PantoneMatchProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [inputColor, setInputColor] = useState('#3B82F6'); 
  const [activeGuide, setActiveGuide] = useState<GuideType>('C');
  const [searchCode, setSearchCode] = useState('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  useEffect(() => {
    if ('EyeDropper' in window) setEyeDropperSupported(true);
  }, []);

  const handleEyeDropper = async () => {
    if (!(window as any).EyeDropper) return;
    try {
      const result = await new (window as any).EyeDropper().open();
      setInputColor(result.sRGBHex);
      setSearchCode('');
    } catch (e) {
      console.debug('EyeDropper canceled');
    }
  };

  // Optimized Matching Logic - Limiting to Top 3 Matches
  useEffect(() => {
    let dataset = pantoneDataset.filter(p => p.guide === activeGuide);

    // Filter by search code if typing
    if (searchCode.trim()) {
      const filtered = dataset.filter(p => 
        p.code.toLowerCase().includes(searchCode.toLowerCase())
      ).map(p => ({ ...p, distance: 0 }));
      
      if (filtered.length > 0) {
        setMatches(filtered.slice(0, 3));
        return;
      }
    }

    // Match by color proximity (Delta E)
    if (!/^#[0-9A-F]{6}$/i.test(inputColor)) return;
    
    const inputLab = hexToLab(inputColor);
    const results = dataset
      .map(p => {
        const targetLab = hexToLab(p.hex);
        return { ...p, distance: calculateDeltaE(inputLab, targetLab) };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setMatches(results.slice(0, 3));
  }, [inputColor, activeGuide, searchCode]);

  const getAccuracyLabel = (deltaE: number) => {
    if (deltaE === 0) return { text: language === 'ar' ? "مطابقة مباشرة" : "Direct Match", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" };
    if (deltaE < 2.3) return { text: language === 'ar' ? "مطابق تماماً" : "Perfect Match", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" };
    if (deltaE < 5) return { text: language === 'ar' ? "مطابق جيداً" : "Good Match", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
    if (deltaE < 10) return { text: language === 'ar' ? "مطابق مقبول" : "Acceptable", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" };
    return { text: language === 'ar' ? "تقريبي" : "Approximate", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" };
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300">
      
      {/* Dynamic Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-cyan-600 dark:text-cyan-400 p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl shadow-inner">
            <SwatchIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
               {language === 'ar' ? 'مطابقة ألوان بانتون العالمية' : 'Global Pantone Matcher'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Formula Guide Coated & Uncoated</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Guide Switcher */}
      <div className="flex p-2 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => { setActiveGuide('C'); setSearchCode(''); }}
            className={`flex-1 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${activeGuide === 'C' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-md ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
              COATED (C)
          </button>
          <button 
            onClick={() => { setActiveGuide('U'); setSearchCode(''); }}
            className={`flex-1 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${activeGuide === 'U' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-md ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
              UNCOATED (U)
          </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[550px]">
        
        {/* Left Control Panel */}
        <div className="w-full lg:w-80 p-8 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-100 dark:border-slate-800 space-y-8 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/20">
           
           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.pmsInputLabel}</label>
              <div className="relative group overflow-hidden rounded-3xl shadow-xl h-40 border-4 border-white dark:border-slate-800 transition-transform hover:scale-[1.02]">
                  <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: inputColor }}></div>
                  <input 
                    type="color" 
                    value={inputColor} 
                    onChange={e => { setInputColor(e.target.value); setSearchCode(''); }} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-black bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">تغيير اللون</span>
                  </div>
              </div>

              {eyeDropperSupported && (
                  <button 
                    onClick={handleEyeDropper} 
                    className="w-full py-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-3 font-black text-xs shadow-sm"
                  >
                    <EyeDropperIcon className="w-4 h-4" />
                    <span>{language === 'ar' ? 'لقط اللون من الشاشة' : 'Pick from screen'}</span>
                  </button>
              )}
           </section>

           <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">البحث برقم بانتون</label>
              <div className="relative">
                  <input 
                      type="text" 
                      value={searchCode}
                      onChange={e => setSearchCode(e.target.value)}
                      placeholder="مثال: 185 أو Reflex Blue"
                      className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all pr-10 rtl:pl-10 rtl:pr-4 text-sm"
                  />
                  <span className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-lg">🔍</span>
              </div>
           </section>
           
           <div className="bg-cyan-50/50 dark:bg-cyan-900/10 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-900/20">
              <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold leading-relaxed text-center">
                {language === 'ar' 
                  ? 'يتم عرض أقرب 3 ألوان مطابقة لتسهيل عملية الاختيار وضمان أعلى دقة فنية.' 
                  : 'Displaying the top 3 closest matches to simplify selection and ensure technical accuracy.'}
              </p>
           </div>
        </div>

        {/* Results Focused View */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[800px] lg:max-h-none">
           {matches.length > 0 ? (
             <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Winner Result - Most Closest */}
                <div className="animate-fade-in">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.pmsBestMatch}</h3>
                      <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Recommended</span>
                   </div>
                   
                   <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:row-reverse xl:flex-row group transition-all ring-4 ring-cyan-500/10">
                      <div className="w-full xl:w-64 h-64 xl:h-auto shrink-0 relative shadow-inner overflow-hidden" style={{ backgroundColor: matches[0].hex }}>
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-[9px] font-black text-white text-center uppercase tracking-widest shadow-lg">
                            {activeGuide === 'C' ? 'Coated' : 'Uncoated'}
                         </div>
                      </div>
                      <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                         <div className="mb-6 md:mb-8">
                            <div className="flex items-center gap-3 mb-2">
                               <span className="w-2 h-10 bg-cyan-600 rounded-full"></span>
                               <h4 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white truncate">{matches[0].code}</h4>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap mt-4">
                               <p className="text-slate-500 font-mono text-base bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">{matches[0].hex}</p>
                               <span className={`text-[10px] font-black px-4 py-2 rounded-full border shadow-sm ${getAccuracyLabel(matches[0].distance).color} ${getAccuracyLabel(matches[0].distance).bg} border-current/10 uppercase tracking-wider`}>
                                  {getAccuracyLabel(matches[0].distance).text} 
                                  {matches[0].distance > 0 && <span className="mx-2 opacity-40">|</span>}
                                  {matches[0].distance > 0 && <span>ΔE {matches[0].distance.toFixed(2)}</span>}
                               </span>
                            </div>
                         </div>
                         
                         <div className="flex gap-4">
                            <button 
                                onClick={() => { navigator.clipboard.writeText(matches[0].code); }} 
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-cyan-600/20 active:scale-95 flex-1 md:flex-none"
                            >
                                {language === 'ar' ? 'نسخ الكود' : 'Copy PMS'}
                            </button>
                            <button 
                                onClick={() => { navigator.clipboard.writeText(matches[0].hex); }} 
                                className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 rounded-2xl font-black text-sm transition-all active:scale-95 flex-1 md:flex-none"
                            >
                                HEX
                            </button>
                         </div>

                         {matches[0].distance > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
                                    <span>دقة التطابق اللوني</span>
                                    <span className="text-cyan-600 font-mono">{Math.max(0, 100 - (matches[0].distance * 2.5)).toFixed(1)}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-[2px]">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(8,145,178,0.3)] ${matches[0].distance < 3 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : matches[0].distance < 7 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`} 
                                        style={{ width: `${Math.max(5, 100 - (matches[0].distance * 2.5))}%` }}
                                    ></div>
                                </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Alternatives Grid - Limiting to 2 remaining */}
                {matches.length > 1 && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-5">
                           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{t.pmsOtherMatches}</h3>
                           <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {matches.slice(1).map((match, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex items-center" onClick={() => { setInputColor(match.hex); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                                    <div className="h-40 w-32 shrink-0 relative transition-transform duration-500" style={{ backgroundColor: match.hex }}>
                                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                    </div>
                                    <div className="p-6 flex-1 overflow-hidden">
                                        <h5 className="font-black text-slate-800 dark:text-white mb-2 text-lg truncate">{match.code}</h5>
                                        <div className="flex flex-col gap-1 mb-6">
                                            <span className="text-[10px] font-mono text-slate-400">{match.hex}</span>
                                            {match.distance > 0 && <span className="text-[10px] font-black text-cyan-600">ΔE {match.distance.toFixed(1)}</span>}
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(match.code); }} 
                                            className="w-full text-[9px] bg-slate-50 dark:bg-slate-800 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-cyan-600 hover:text-white font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            نسخ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 py-32 space-y-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-6xl grayscale opacity-30">🎨</span>
                </div>
                <div className="text-center">
                    <p className="font-black text-lg text-slate-600 dark:text-slate-300">لا توجد نتائج مطابقة</p>
                    <p className="text-sm font-medium mt-1">جرب إدخال كود لون مختلف أو لقط لوناً من الشاشة</p>
                </div>
                <button onClick={() => setSearchCode('')} className="px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-white transition-all shadow-sm">إعادة ضبط البحث</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
