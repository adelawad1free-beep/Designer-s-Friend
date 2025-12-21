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

// --- Universal Pantone Dataset Subset (Combined C and U) ---
// Note: In real production, this would be a much larger JSON file.
const pantoneDataset = [
  // COATED (C)
  { code: 'PMS Yellow C', hex: '#FEDD00', guide: 'C' }, { code: 'PMS Orange 021 C', hex: '#FE5000', guide: 'C' }, { code: 'PMS Warm Red C', hex: '#F9423A', guide: 'C' }, { code: 'PMS Red 032 C', hex: '#EF3340', guide: 'C' }, { code: 'PMS Rubine Red C', hex: '#CE0058', guide: 'C' }, { code: 'PMS Rhodamine Red C', hex: '#E10098', guide: 'C' }, { code: 'PMS Purple C', hex: '#BB29BB', guide: 'C' }, { code: 'PMS Violet C', hex: '#440099', guide: 'C' }, { code: 'PMS Reflex Blue C', hex: '#001489', guide: 'C' }, { code: 'PMS Process Blue C', hex: '#0085CA', guide: 'C' }, { code: 'PMS Green C', hex: '#00AB84', guide: 'C' }, { code: 'PMS Black C', hex: '#2D2926', guide: 'C' },
  { code: 'PMS 100 C', hex: '#F6E500', guide: 'C' }, { code: 'PMS 185 C', hex: '#E4002B', guide: 'C' }, { code: 'PMS 286 C', hex: '#0033A0', guide: 'C' }, { code: 'PMS 300 C', hex: '#005EB8', guide: 'C' }, { code: 'PMS 361 C', hex: '#43B02A', guide: 'C' }, { code: 'PMS 485 C', hex: '#DA291C', guide: 'C' }, { code: 'PMS 7462 C', hex: '#005F99', guide: 'C' },
  // UNCOATED (U)
  { code: 'PMS Yellow U', hex: '#F6EB61', guide: 'U' }, { code: 'PMS Orange 021 U', hex: '#FF6D2F', guide: 'U' }, { code: 'PMS Warm Red U', hex: '#F9635E', guide: 'U' }, { code: 'PMS Red 032 U', hex: '#F9423A', guide: 'U' }, { code: 'PMS Purple U', hex: '#D689FF', guide: 'U' }, { code: 'PMS Reflex Blue U', hex: '#0054A6', guide: 'U' }, { code: 'PMS Green U', hex: '#00A94F', guide: 'U' }, { code: 'PMS Black U', hex: '#313131', guide: 'U' },
  { code: 'PMS 100 U', hex: '#F9F1A5', guide: 'U' }, { code: 'PMS 185 U', hex: '#F9423A', guide: 'U' }, { code: 'PMS 286 U', hex: '#005CAB', guide: 'U' }, { code: 'PMS 300 U', hex: '#0072C6', guide: 'U' }, { code: 'PMS 361 U', hex: '#6CC24A', guide: 'U' }, { code: 'PMS 485 U', hex: '#ED2E38', guide: 'U' }, { code: 'PMS 7462 U', hex: '#0077C0', guide: 'U' },
  // Adding more range...
  { code: 'PMS 116 C', hex: '#FFCD00', guide: 'C' }, { code: 'PMS 116 U', hex: '#FFD100', guide: 'U' },
  { code: 'PMS 200 C', hex: '#BA0C2F', guide: 'C' }, { code: 'PMS 200 U', hex: '#C6343F', guide: 'U' },
  { code: 'PMS 293 C', hex: '#003DA5', guide: 'C' }, { code: 'PMS 293 U', hex: '#0061A8', guide: 'U' },
  { code: 'PMS 347 C', hex: '#009A44', guide: 'C' }, { code: 'PMS 347 U', hex: '#00A651', guide: 'U' },
  { code: 'PMS 7545 C', hex: '#425563', guide: 'C' }, { code: 'PMS 7545 U', hex: '#586A78', guide: 'U' },
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
      setSearchCode(''); // Clear manual search when picking color
    } catch (e) {
      console.log('EyeDropper canceled');
    }
  };

  // Perform Matching Logic
  useEffect(() => {
    // If user is searching by code
    if (searchCode.trim()) {
        const found = pantoneDataset.filter(p => 
            p.code.toLowerCase().includes(searchCode.toLowerCase()) && 
            p.guide === activeGuide
        ).map(p => ({ ...p, distance: 0 }));
        if (found.length > 0) {
            setMatches(found.slice(0, 4));
            return;
        }
    }

    // Otherwise match by color distance
    if (!/^#[0-9A-F]{6}$/i.test(inputColor)) return;
    
    const inputLab = hexToLab(inputColor);
    const results = pantoneDataset
      .filter(p => p.guide === activeGuide)
      .map(p => {
        const targetLab = hexToLab(p.hex);
        return { ...p, distance: calculateDeltaE(inputLab, targetLab) };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setMatches(results.slice(0, 4));
  }, [inputColor, activeGuide, searchCode]);

  const getAccuracyLabel = (deltaE: number) => {
    if (deltaE === 0) return { text: language === 'ar' ? "بحث مباشر" : "Direct Match", color: "text-blue-500" };
    if (deltaE < 2.3) return { text: language === 'ar' ? "مطابق تماماً" : "Perfect Match", color: "text-green-500" };
    if (deltaE < 5) return { text: language === 'ar' ? "مطابق جيداً" : "Good Match", color: "text-emerald-500" };
    if (deltaE < 10) return { text: language === 'ar' ? "مطابق مقبول" : "Acceptable", color: "text-yellow-500" };
    return { text: language === 'ar' ? "تقريبي" : "Approximate", color: "text-orange-500" };
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-cyan-600 dark:text-cyan-400 p-1.5 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-lg">
            <SwatchIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
             {language === 'ar' ? 'مطابقة ألوان بانتون العالمية' : 'Global Pantone Matcher'}
          </h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Guide Selector Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120]">
          <button 
            onClick={() => setActiveGuide('C')}
            className={`flex-1 py-4 text-xs font-black transition-all border-b-2 ${activeGuide === 'C' ? 'border-cyan-500 text-cyan-600 bg-white dark:bg-slate-900' : 'border-transparent text-slate-400'}`}
          >
              FORMULA GUIDE COATED (C)
          </button>
          <button 
            onClick={() => setActiveGuide('U')}
            className={`flex-1 py-4 text-xs font-black transition-all border-b-2 ${activeGuide === 'U' ? 'border-cyan-500 text-cyan-600 bg-white dark:bg-slate-900' : 'border-transparent text-slate-400'}`}
          >
              FORMULA GUIDE UNCOATED (U)
          </button>
      </div>

      <div className="p-6 md:p-10 flex flex-col md:row-reverse lg:flex-row gap-8">
        
        {/* Left Control Column */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
           <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Color Picker Box */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.pmsInputLabel}</label>
                <div className="flex flex-col gap-4">
                    <div className="w-full h-32 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 relative overflow-hidden group transition-all" style={{ backgroundColor: inputColor }}>
                        <input type="color" value={inputColor} onChange={e => { setInputColor(e.target.value); setSearchCode(''); }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 backdrop-blur-[2px] transition-opacity pointer-events-none">
                            <span className="text-white text-xs font-bold px-2 py-1 bg-black/40 rounded-full">تغيير اللون</span>
                        </div>
                    </div>
                    
                    {eyeDropperSupported && (
                        <button onClick={handleEyeDropper} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                        <EyeDropperIcon className="w-5 h-5" />
                        <span>{language === 'ar' ? 'لقط اللون من الشاشة' : 'Pick from screen'}</span>
                        </button>
                    )}
                </div>
              </div>

              {/* Code Search Input */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">البحث برقم اللون</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={searchCode}
                        onChange={e => setSearchCode(e.target.value)}
                        placeholder="e.g. 286"
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
                </div>
              </div>
           </div>
        </div>

        {/* Right Result Content */}
        <div className="flex-1 space-y-6">
           {matches.length > 0 ? (
             <div className="space-y-6">
                
                {/* Best Match Hero */}
                <div className="animate-fade-in">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">{t.pmsBestMatch}</h3>
                   <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col sm:flex-row">
                      <div className="w-full sm:w-56 h-56 sm:h-auto shrink-0 relative shadow-inner" style={{ backgroundColor: matches[0].hex }}>
                         <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-[10px] font-black text-white uppercase">
                            Formula {activeGuide}
                         </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-center">
                         <div className="mb-6">
                            <h4 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{matches[0].code}</h4>
                            <div className="flex items-center gap-3 flex-wrap">
                               <p className="text-slate-400 font-mono text-sm bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{matches[0].hex}</p>
                               <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 ${getAccuracyLabel(matches[0].distance).color}`}>
                                  {getAccuracyLabel(matches[0].distance).text} 
                                  {matches[0].distance > 0 && <span className="ml-1 opacity-60">(ΔE {matches[0].distance.toFixed(2)})</span>}
                               </span>
                            </div>
                         </div>
                         
                         <div className="flex gap-3">
                            <button onClick={() => navigator.clipboard.writeText(matches[0].code)} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20 active:scale-95">نسخ الكود</button>
                            <button onClick={() => navigator.clipboard.writeText(matches[0].hex)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all active:scale-95">نسخ HEX</button>
                         </div>

                         {matches[0].distance > 0 && (
                            <div className="mt-8">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                                    <span>دقة المطابقة اللوكية</span>
                                    <span>{Math.max(0, 100 - (matches[0].distance * 2.5)).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-700 ease-out ${matches[0].distance < 3 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : matches[0].distance < 7 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${Math.max(5, 100 - (matches[0].distance * 2.5))}%` }}></div>
                                </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Alternatives Grid */}
                {matches.length > 1 && (
                    <div className="animate-fade-in-up">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">{t.pmsOtherMatches}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {matches.slice(1, 4).map((match, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all">
                                    <div className="h-24 w-full relative" style={{ backgroundColor: match.hex }}>
                                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                    </div>
                                    <div className="p-5">
                                        <h5 className="font-black text-slate-800 dark:text-white mb-1 text-base">{match.code}</h5>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-mono text-slate-400">{match.hex}</span>
                                            {match.distance > 0 && <span className="text-[10px] font-bold text-slate-300">ΔE {match.distance.toFixed(1)}</span>}
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(match.code)} className="w-full text-[10px] bg-slate-50 dark:bg-slate-800 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 font-black uppercase tracking-widest transition-all">نسخ الكود</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <span className="text-5xl mb-4 opacity-20">🎨</span>
                <p className="font-bold">لا توجد نتائج مطابقة، جرب لونا آخر</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
