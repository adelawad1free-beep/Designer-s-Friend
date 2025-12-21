import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context';
import { GridIcon, BackIcon } from '../Icons';

interface GridGeneratorProps {
  onClose?: () => void;
}

type GridUnit = 'px' | 'mm' | 'rem';

export const GridGenerator: React.FC<GridGeneratorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  
  // State
  const [cols, setCols] = useState(12);
  const [rows, setRows] = useState(1);
  const [gutter, setGutter] = useState(20);
  const [margin, setMargin] = useState(40);
  const [unit, setUnit] = useState<GridUnit>('px');
  const [mode, setMode] = useState<'web' | 'print'>('web');
  const [showNumbers, setShowNumbers] = useState(true);

  // Derived CSS
  const cssCode = useMemo(() => {
    return `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, auto);
  gap: ${gutter}${unit};
  padding: ${margin}${unit};
  width: 100%;
}`;
  }, [cols, rows, gutter, margin, unit]);

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    alert(t.codeGenCopied || "Copied!");
  };

  const handleModeChange = (newMode: 'web' | 'print') => {
      setMode(newMode);
      if (newMode === 'print') {
          setUnit('mm');
          setGutter(5);
          setMargin(10);
      } else {
          setUnit('px');
          setGutter(20);
          setMargin(40);
      }
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col lg:flex-row min-h-[600px]">
      
      {/* Settings Sidebar */}
      <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 overflow-y-auto p-6 space-y-8 flex-shrink-0">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GridIcon className="w-5 h-5 text-blue-600" />
                {t.gridSettings}
            </h2>
            {onClose && (
                <button onClick={onClose} className="lg:hidden text-slate-400">
                    <BackIcon className="w-5 h-5 rtl:rotate-180" />
                </button>
            )}
          </div>

          {/* Mode Selector */}
          <div className="bg-white dark:bg-slate-800 p-1 rounded-xl flex border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
                onClick={() => handleModeChange('web')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'web' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}
            >
                {t.gridWeb}
            </button>
            <button 
                onClick={() => handleModeChange('print')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'print' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}
            >
                {t.gridPrint}
            </button>
          </div>

          <div className="space-y-6">
              <ControlGroup label={t.gridCols} value={cols} onChange={setCols} min={1} max={24} />
              <ControlGroup label={t.gridRows} value={rows} onChange={setRows} min={1} max={24} />
              <ControlGroup label={`${t.gridGutter} (${unit})`} value={gutter} onChange={setGutter} min={0} max={100} />
              <ControlGroup label={`${t.gridMargin} (${unit})`} value={margin} onChange={setMargin} min={0} max={200} />
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">{t.gridVisuals}</h4>
                  <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={showNumbers} 
                        onChange={e => setShowNumbers(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">ترقيم الأعمدة</span>
                  </label>
              </div>
          </div>

          <div className="pt-6 space-y-3">
              <button 
                onClick={copyCss}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                  <span>📋</span> {t.gridCopyCss}
              </button>
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-[#020617] p-4 lg:p-12 flex flex-col relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.gridPreview}</span>
              <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-[10px] font-bold shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500">{cols} Cols</span>
                  <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-[10px] font-bold shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500">{gutter}{unit} Gap</span>
              </div>
          </div>

          {/* Grid Preview Container */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-auto custom-scrollbar group">
              
              {/* Transparent Grid Pattern for Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ 
                       backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
                       backgroundSize: '20px 20px' 
                   }}>
              </div>

              <div 
                className="h-full min-h-[400px] w-full relative z-10 transition-all duration-300"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  gap: `${gutter}px`, // Always use PX for web-based preview to keep it consistent
                  padding: `${margin}px`,
                }}
              >
                  {Array.from({ length: cols * rows }).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center transition-all hover:bg-blue-500/30 hover:border-blue-500/50"
                      >
                          {showNumbers && (
                             <span className="text-[10px] font-mono font-bold text-blue-500/60">{i + 1}</span>
                          )}
                      </div>
                  ))}
              </div>
          </div>

          {/* Code Export (Minimized for better UX) */}
          <div className="mt-8 bg-slate-900 rounded-2xl p-4 shadow-xl border border-white/5 relative group/code">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase">CSS Snippet</span>
                  <button onClick={copyCss} className="text-white hover:text-blue-400 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
              </div>
              <pre className="text-xs font-mono text-blue-400 overflow-x-auto">
                <code>{cssCode}</code>
              </pre>
          </div>
      </div>
    </div>
  );
};

const ControlGroup = ({ label, value, onChange, min, max }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
        <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{value}</span>
    </div>
    <div className="flex items-center gap-4">
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={value} 
            onChange={e => onChange(parseInt(e.target.value))}
            className="flex-1 accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer appearance-none"
        />
        <input 
            type="number" 
            value={value} 
            onChange={e => onChange(parseInt(e.target.value) || 0)}
            className="w-12 text-center p-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white"
        />
    </div>
  </div>
);