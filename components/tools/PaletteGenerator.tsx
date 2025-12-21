
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context';
import { PaletteIcon, BackIcon, SwapIcon } from '../Icons';

interface PaletteGeneratorProps {
  onClose?: () => void;
}

type HarmonyRule = 'analogous' | 'complementary' | 'triadic' | 'monochromatic' | 'tetradic';

// --- Color Utilities (No external libs needed) ---

const hexToHsl = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [seedColor, setSeedColor] = useState('#3B82F6');
  const [rule, setRule] = useState<HarmonyRule>('analogous');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate Palette locally based on Mathematical Rules
  const palette = useMemo(() => {
    const hsl = hexToHsl(seedColor);
    const colors: string[] = [];

    switch (rule) {
      case 'analogous':
        colors.push(hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 345) % 360, hsl.s, hsl.l));
        colors.push(seedColor);
        colors.push(hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
        break;
      case 'complementary':
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 25)));
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 12)));
        colors.push(seedColor);
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 180) % 360, Math.max(0, hsl.s - 20), Math.min(100, hsl.l + 10)));
        break;
      case 'triadic':
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)));
        colors.push(seedColor);
        colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, Math.max(10, hsl.l - 20)));
        break;
      case 'monochromatic':
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 35)));
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 18)));
        colors.push(seedColor);
        colors.push(hslToHex(hsl.h, Math.max(0, hsl.s - 25), Math.min(100, hsl.l + 18)));
        colors.push(hslToHex(hsl.h, Math.max(0, hsl.s - 45), Math.min(100, hsl.l + 35)));
        break;
      case 'tetradic':
        colors.push(seedColor);
        colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, Math.max(10, hsl.l - 20)));
        break;
    }
    return colors;
  }, [seedColor, rule]);

  const handleRandomize = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setSeedColor(randomHex.toUpperCase());
  };

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const rules: { id: HarmonyRule; label: string }[] = [
    { id: 'analogous', label: t.paletteRuleAnalogous },
    { id: 'complementary', label: t.paletteRuleComplementary },
    { id: 'triadic', label: t.paletteRuleTriadic },
    { id: 'monochromatic', label: t.paletteRuleMonochromatic },
    { id: 'tetradic', label: t.paletteRuleTetradic },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* --- Settings Panel --- */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
               <PaletteIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
                {t.paletteTitle}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mathematical Design Logic</p>
            </div>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all"
            >
              <BackIcon className="w-5 h-5 rtl:rotate-180" />
            </button>
          )}
        </div>

        <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-xl">
              {t.paletteSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seed Color Picker */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{language === 'ar' ? 'اللون الأساسي' : 'Base Seed Color'}</label>
                    <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-inner group">
                            <input 
                                type="color" 
                                value={seedColor}
                                onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                                className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                             <input 
                                type="text"
                                value={seedColor}
                                onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                                className="w-full p-4 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                             />
                        </div>
                    </div>
                </div>

                {/* Harmony Rules */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.paletteRule}</label>
                    <div className="relative">
                        <select 
                            value={rule}
                            onChange={(e) => setRule(e.target.value as HarmonyRule)}
                            className="w-full p-4 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                        >
                            {rules.map(r => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <SwapIcon className="w-5 h-5 rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleRandomize}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
            >
                <span>🎲</span> {t.paletteBtn}
            </button>
          </div>

          {/* Tips Section */}
          <div className="w-full lg:w-72 bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 flex flex-col justify-center text-center">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100 dark:border-slate-700">
                <span className="text-2xl">⚡</span>
             </div>
             <h4 className="font-black text-amber-800 dark:text-amber-400 mb-2">{language === 'ar' ? 'فوري ومحلي' : 'Instant & Local'}</h4>
             <p className="text-[11px] leading-relaxed text-amber-700/80 dark:text-amber-400/60 font-medium">
                {language === 'ar' 
                  ? 'هذا المولد يعمل بالكامل داخل جهازك باستخدام خوارزميات رياضية لضمان الخصوصية والسرعة الفائقة.' 
                  : 'This generator runs entirely on your device using math algorithms to ensure privacy and extreme speed.'}
             </p>
          </div>
        </div>
      </div>

      {/* --- Palette Display --- */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mb-10 flex items-center justify-between">
           <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{rule} Palette</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Generated via Harmony Logic</p>
           </div>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[9px] font-black rounded-full border border-amber-100 dark:border-amber-900/30 uppercase tracking-widest">
                Harmonious
              </span>
           </div>
        </div>

        {/* Studio Cards */}
        <article className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[400px]">
          {palette.map((color, index) => (
            <section 
              key={index}
              onClick={() => copyColor(color, index)}
              className="relative group cursor-pointer rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-black/5"
              style={{ backgroundColor: color }}
            >
              <div className="mt-auto p-6 flex flex-col items-center">
                 <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 transform group-hover:scale-105 border border-white/20">
                    <span className="font-mono font-black text-slate-800 dark:text-white text-sm">{color}</span>
                 </div>
              </div>
              
              {/* Feedback Overlay */}
              <div className={`absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${copiedIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    Copied!
                 </div>
              </div>

              {/* Index */}
              <div className="absolute top-6 left-6 text-[10px] font-black opacity-30 pointer-events-none uppercase tracking-widest mix-blend-difference">
                 #{index + 1}
              </div>
            </section>
          ))}
        </article>

        {/* Hex List */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          {palette.map((color, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-amber-400 transition-colors">
               <div 
                className="w-10 h-10 rounded-xl shadow-inner border border-black/5 shrink-0" 
                style={{ backgroundColor: color }}
               />
               <div className="min-w-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter">HEX</span>
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-mono font-bold select-all">{color}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
