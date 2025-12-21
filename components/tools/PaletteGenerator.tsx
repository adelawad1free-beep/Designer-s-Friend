
'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../context';
import { PaletteIcon, BackIcon, SwapIcon } from '../Icons';
import { generateColorPalette } from '../../services/geminiService';
// Import ToolType from types
import { ColorPalette, ToolType } from '../../types';

interface PaletteGeneratorProps {
  onClose?: () => void;
}

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const data = await generateColorPalette(mood, language);
      setPalette(data);
    } catch (error) {
      console.error(error);
      alert(language === 'ar' ? 'فشل في توليد الألوان. حاول مرة أخرى.' : 'Failed to generate palette. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col min-h-[600px]">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-2xl shadow-inner">
            <PaletteIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
               {t[ToolType.PALETTE_GENERATOR]}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Color Engine</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="p-8 lg:p-12 flex flex-col lg:flex-row gap-12 flex-1">
        
        {/* Left Side: Controls */}
        <div className="w-full lg:w-[400px] space-y-8 flex-shrink-0">
          <div className="space-y-4">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
               {t.palettePromptLabel}
             </label>
             <textarea 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder={t.palettePromptPlaceholder}
                className="w-full h-32 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/20 outline-none transition-all resize-none font-medium"
             />
             <button 
                onClick={handleGenerate}
                disabled={loading || !mood.trim()}
                className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl
                  ${loading || !mood.trim() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
             >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t.paletteLoading}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <SwapIcon className="w-5 h-5" />
                    {t.paletteGenerateBtn}
                  </span>
                )}
             </button>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20">
             <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 text-center leading-relaxed">
               💡 {language === 'ar' ? 'اكتب وصفاً خيالياً، سياقاً للتصميم، أو حتى مشاعراً وسيقوم الذكاء الاصطناعي بترجمتها إلى تناغم لوني.' : 'Write an imaginative description, design context, or even feelings and the AI will translate them into color harmony.'}
             </p>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="flex-1 flex items-center justify-center">
          {palette ? (
            <div className="w-full space-y-8 animate-fade-in-up">
               <div className="text-center md:text-right rtl:md:text-right ltr:md:text-left">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{palette.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{palette.description}</p>
               </div>

               <div className="flex flex-col md:flex-row h-80 rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                  {palette.colors.map((color, idx) => (
                    <button 
                       key={idx}
                       onClick={() => copyToClipboard(color)}
                       className="group relative flex-1 flex flex-col items-center justify-end p-6 transition-all hover:flex-[1.5] cursor-pointer"
                       style={{ backgroundColor: color }}
                    >
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                       
                       <div className={`
                         px-3 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-all mb-4 transform translate-y-2 group-hover:translate-y-0
                         ${copiedColor === color ? 'bg-green-500 border-green-400 scale-110' : ''}
                       `}>
                         {copiedColor === color ? t.paletteCopied : color.toUpperCase()}
                       </div>
                       
                       <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{t.paletteCopyHex}</span>
                    </button>
                  ))}
               </div>

               <div className="flex justify-center gap-4">
                  {palette.colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                       <div className="w-10 h-10 rounded-xl shadow-md border border-slate-200 dark:border-slate-700" style={{ backgroundColor: color }}></div>
                       <span className="text-[10px] font-mono text-slate-400">{color}</span>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="text-center space-y-6 max-w-sm">
               <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto opacity-50 border border-slate-200 dark:border-slate-800">
                  <PaletteIcon className="w-12 h-12 text-slate-400" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-400">جاهز للتوليد</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {language === 'ar' 
                      ? 'أدخل وصفك في الجانب الأيسر للحصول على لوحة ألوان سحرية متناسقة برمجياً.' 
                      : 'Enter your description on the left to get a programmatically harmonized magical color palette.'}
                  </p>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
