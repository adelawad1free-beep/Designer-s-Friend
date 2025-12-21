
import React, { useState } from 'react';
import { generateColorPalette } from '../../services/geminiService';
import { ColorPalette } from '../../types';
import { useAppContext } from '../../context';
import { PaletteIcon, BackIcon } from '../Icons';

interface PaletteGeneratorProps {
  onClose?: () => void;
}

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateColorPalette(mood, language);
      setPalette(result);
    } catch (err) {
      setError(t.paletteError);
    } finally {
      setLoading(false);
    }
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
        
        {/* Header - Slim & Beautiful */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
               <PaletteIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
                {t.paletteTitle}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Harmonious Engine</p>
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

        <div className="p-8 md:p-10">
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm max-w-2xl">
            {t.paletteSubtitle}
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder={t.palettePlaceholder}
              className="flex-1 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !mood.trim()}
              className="px-10 py-5 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-amber-600/20 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>{t.paletteLoading}</span>
                </div>
              ) : t.paletteBtn}
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 mt-6 rounded-2xl border border-red-100 dark:border-red-900/30 text-xs font-bold">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {palette && (
        <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up transition-colors">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{palette.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xl">{palette.description}</p>
            </div>
            <div className="flex gap-2">
               <span className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-full border border-amber-100 dark:border-amber-900/30 uppercase tracking-widest">
                 {palette.colors.length} Harmonious Colors
               </span>
            </div>
          </div>

          {/* SEO Optimized Palette Display */}
          <article className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[400px] rounded-[2.5rem] overflow-hidden">
            {palette.colors.map((color, index) => (
              <section 
                key={index}
                className="relative group cursor-pointer h-full flex flex-col justify-end p-6 transition-all duration-500 hover:flex-grow-[2] shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              >
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 shadow-2xl scale-90 group-hover:scale-100 border border-white/20">
                  <span className="font-mono font-black text-slate-800 text-base block mb-1">{color.toUpperCase()}</span>
                  <span className="block text-[9px] text-slate-500 font-black uppercase tracking-widest">{t.paletteCopy}</span>
                </div>
                
                {/* Visual Label for Lighter/Darker background readability */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-20 pointer-events-none uppercase tracking-widest mix-blend-difference">
                   Color {index + 1}
                </div>
              </section>
            ))}
          </article>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            {palette.colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <div 
                  className="w-12 h-12 rounded-xl shadow-inner border border-white/20 shrink-0" 
                  style={{ backgroundColor: color }}
                 />
                 <div className="min-w-0">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Color {idx+1}</span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-mono font-bold select-all">{color}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
