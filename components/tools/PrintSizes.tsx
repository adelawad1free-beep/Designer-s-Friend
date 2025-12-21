import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context';
import { PrintIcon, BackIcon } from '../Icons';

interface PrintSizesProps {
  onClose?: () => void;
}

type PrintUnit = 'mm' | 'cm' | 'in';
type PrintCategory = 'paper' | 'envelopes' | 'business' | 'posters';

interface SizeItem {
  id: string;
  category: PrintCategory;
  nameAr: string;
  nameEn: string;
  widthMm: number;
  heightMm: number;
  ratio: string;
}

const printDatabase: SizeItem[] = [
  // --- ISO A Series (Paper) ---
  { id: 'a0', category: 'paper', nameAr: 'مقاس A0', nameEn: 'A0 Size', widthMm: 841, heightMm: 1189, ratio: '1:√2' },
  { id: 'a1', category: 'paper', nameAr: 'مقاس A1', nameEn: 'A1 Size', widthMm: 594, heightMm: 841, ratio: '1:√2' },
  { id: 'a2', category: 'paper', nameAr: 'مقاس A2', nameEn: 'A2 Size', widthMm: 420, heightMm: 594, ratio: '1:√2' },
  { id: 'a3', category: 'paper', nameAr: 'مقاس A3', nameEn: 'A3 Size', widthMm: 297, heightMm: 420, ratio: '1:√2' },
  { id: 'a4', category: 'paper', nameAr: 'مقاس A4 (الورق الرسمي)', nameEn: 'A4 Size (Standard)', widthMm: 210, heightMm: 297, ratio: '1:√2' },
  { id: 'a5', category: 'paper', nameAr: 'مقاس A5', nameEn: 'A5 Size', widthMm: 148, heightMm: 210, ratio: '1:√2' },
  { id: 'a6', category: 'paper', nameAr: 'مقاس A6', nameEn: 'A6 Size', widthMm: 105, heightMm: 148, ratio: '1:√2' },
  
  // --- Envelopes ---
  { id: 'dl', category: 'envelopes', nameAr: 'ظرف DL (للأوراق المطوية)', nameEn: 'DL Envelope', widthMm: 220, heightMm: 110, ratio: '2:1' },
  { id: 'c4', category: 'envelopes', nameAr: 'ظرف C4 (للورق A4 كامل)', nameEn: 'C4 Envelope', widthMm: 229, heightMm: 324, ratio: '1:√2' },
  { id: 'c5', category: 'envelopes', nameAr: 'ظرف C5 (للورق A5)', nameEn: 'C5 Envelope', widthMm: 162, heightMm: 229, ratio: '1:√2' },
  { id: 'c6', category: 'envelopes', nameAr: 'ظرف C6', nameEn: 'C6 Envelope', widthMm: 114, heightMm: 162, ratio: '1:√2' },

  // --- Business Cards ---
  { id: 'bc-sa', category: 'business', nameAr: 'كارت عمل (قياسي)', nameEn: 'Business Card (Std)', widthMm: 85, heightMm: 55, ratio: '1.54:1' },
  { id: 'bc-us', category: 'business', nameAr: 'كارت عمل (أمريكي)', nameEn: 'Business Card (US)', widthMm: 88.9, heightMm: 50.8, ratio: '1.75:1' },
  { id: 'bc-sq', category: 'business', nameAr: 'كارت عمل مربع', nameEn: 'Square Business Card', widthMm: 65, heightMm: 65, ratio: '1:1' },

  // --- Posters ---
  { id: 'post-b1', category: 'posters', nameAr: 'بوستر B1', nameEn: 'B1 Poster', widthMm: 707, heightMm: 1000, ratio: '1:√2' },
  { id: 'post-b2', category: 'posters', nameAr: 'بوستر B2', nameEn: 'B2 Poster', widthMm: 500, heightMm: 707, ratio: '1:√2' },
];

export const PrintSizes: React.FC<PrintSizesProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<PrintCategory | 'all'>('all');
  const [unit, setUnit] = useState<PrintUnit>('mm');
  const [searchQuery, setSearchQuery] = useState('');

  const formatValue = (mm: number) => {
    if (unit === 'mm') return `${mm.toFixed(0)} mm`;
    if (unit === 'cm') return `${(mm / 10).toFixed(1)} cm`;
    return `${(mm / 25.4).toFixed(2)} in`;
  };

  const filteredSizes = useMemo(() => {
    return printDatabase.filter(s => {
      const matchesSearch = s.nameAr.includes(searchQuery) || s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  const copyToClipboard = (w: number, h: number) => {
    const text = `${formatValue(w)} × ${formatValue(h)}`;
    navigator.clipboard.writeText(text);
  };

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
    { id: 'paper', label: t.printCatPaper },
    { id: 'envelopes', label: t.printCatEnvelopes },
    { id: 'business', label: t.printCatBusiness },
    { id: 'posters', label: t.printCatPosters },
  ];

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col min-h-[600px]">
      
      {/* Header */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-xl">
            <PrintIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
              {t.printTitle}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.printDesc}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1">
        
        {/* Toolbar */}
        <div className="bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder={t.printSearch}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full p-3 pl-10 rtl:pr-10 rtl:pl-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <span className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                </div>

                {/* Unit Picker */}
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm">
                    {(['mm', 'cm', 'in'] as PrintUnit[]).map(u => (
                        <button
                            key={u}
                            onClick={() => setUnit(u)}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${unit === u ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-emerald-600'}`}
                        >
                            {u === 'mm' ? t.printUnitMm : u === 'cm' ? t.printUnitCm : t.printUnitIn}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                            activeCategory === cat.id 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSizes.map((s) => (
              <div 
                key={s.id}
                className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                   {/* Aspect Preview */}
                   <div className="w-20 h-24 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/10 transition-colors">
                      <div 
                        className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                        style={{ 
                            aspectRatio: `${s.widthMm}/${s.heightMm}`,
                            width: s.widthMm > s.heightMm ? '80%' : 'auto',
                            height: s.heightMm >= s.widthMm ? '80%' : 'auto',
                        }}
                      />
                   </div>

                   <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                          {categories.find(c => c.id === s.category)?.label}
                      </span>
                      <h4 className="font-black text-slate-800 dark:text-white text-lg truncate mb-2">
                        {language === 'ar' ? s.nameAr : s.nameEn}
                      </h4>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                           <span className="text-slate-400 font-bold">{language === 'ar' ? 'الأبعاد' : 'Dims'}</span>
                           <span className="font-black text-slate-700 dark:text-slate-200 font-mono">
                             {formatValue(s.widthMm)} × {formatValue(s.heightMm)}
                           </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => copyToClipboard(s.widthMm, s.heightMm)}
                        className="mt-4 w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                      >
                        {t.printCopySize}
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSizes.length === 0 && (
             <div className="py-20 text-center text-slate-400 flex flex-col items-center">
               <span className="text-5xl mb-4 grayscale opacity-20">🖨️</span>
               <p className="font-bold">{t.svgNoResults}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};