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
  };

  return (
    <div className="space-y-8">
       <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 transition-colors overflow-hidden">
        
        {/* Header - Slim & Beautiful */}
        <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
               <PaletteIcon className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
              {t.paletteTitle}
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

        <div className="p-6 md:p-8">
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
            {t.paletteSubtitle}
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder={t.palettePlaceholder}
              className="flex-1 p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-shadow text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !mood.trim()}
              className="px-8 py-4 bg-slate-800 dark:bg-orange-600 text-white rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg text-sm"
            >
              {loading ? t.paletteLoading : t.paletteBtn}
            </button>
          </div>
          
          {error && <p className="text-red-500 dark:text-red-400 mt-4 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/20">{error}</p>}
        </div>
      </div>

      {palette && (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-md border border-slate-200 dark:border-slate-700 animate-fade-in-up transition-colors">
          <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{palette.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{palette.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-48 md:h-64 rounded-3xl overflow-hidden shadow-inner ring-1 ring-slate-100 dark:ring-slate-700">
            {palette.colors.map((color, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer h-full flex flex-col justify-end p-4 transition-all hover:flex-grow-[1.5]"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              >
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg scale-90 group-hover:scale-100">
                  <span className="font-mono font-bold text-slate-800 text-sm">{color}</span>
                  <span className="block text-[10px] text-slate-500 mt-1 uppercase tracking-wide">{t.paletteCopy}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
            {palette.colors.map((color, idx) => (
              <div key={idx} className="text-center flex-1">
                 <div 
                  className="w-8 h-8 rounded-full mb-2 mx-auto shadow-sm ring-2 ring-white dark:ring-slate-700" 
                  style={{ backgroundColor: color }}
                 />
                 <span className="text-xs text-slate-400 dark:text-slate-500 font-mono select-all">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};