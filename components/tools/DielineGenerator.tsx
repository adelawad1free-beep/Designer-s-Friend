
import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context';
import { DielineIcon, BackIcon } from '../Icons';

interface DielineGeneratorProps {
  onClose?: () => void;
}

type BoxType = 'standard' | 'sleeve' | 'tray' | 'flip-top';

export const DielineGenerator: React.FC<DielineGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  
  const [boxType, setBoxType] = useState<BoxType>('flip-top');
  const [width, setWidth] = useState(180);
  const [height, setHeight] = useState(40);
  const [depth, setDepth] = useState(130);
  const [flap, setFlap] = useState(25);

  const svgRef = useRef<SVGSVGElement>(null);

  // Constants for drawing
  const CUT_COLOR = "#FF0000";
  const FOLD_COLOR = "#0000FF";
  const STROKE_WIDTH = 1.2;

  /**
   * Safe Dynamic ViewBox Calculation to prevent outline clipping
   */
  const getDynamicViewBox = (w = width, h = height, d = depth, f = flap, type = boxType) => {
    const p = 40; // Internal padding
    let minX = -p, minY = -p, vW = 400, vH = 400;

    switch (type) {
      case 'standard':
        vW = (w * 2) + (d * 2) + f + (p * 2);
        vH = h + (d * 2) + (p * 2);
        minY = -p;
        break;
      case 'flip-top':
        minY = -h - f - p;
        vW = w + (d * 2) + (p * 2);
        vH = (h * 2) + (d * 2) + f + (p * 2);
        break;
      case 'sleeve':
        vW = (w * 2) + (d * 2) + f + (p * 2);
        vH = h + (p * 2);
        break;
      case 'tray':
        vW = w + (d * 2) + (p * 2);
        vH = h + (d * 2) + (p * 2);
        break;
    }
    return `${minX} ${minY} ${vW} ${vH}`;
  };

  const renderDieline = (w_ = width, h_ = height, d_ = depth, f_ = flap, type_ = boxType) => {
    const W = w_; const H = h_; const D = d_; const F = f_;

    switch (type_) {
      case 'standard':
        const totalW = (W * 2) + (D * 2) + F;
        return (
          <g>
            <rect x="0" y={D} width={totalW} height={H} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={D} y1={D} x2={D} y2={D + H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={D + W} y1={D} x2={D + W} y2={D + H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={D * 2 + W} y1={D} x2={D * 2 + W} y2={D + H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={D * 2 + W * 2} y1={D} x2={D * 2 + W * 2} y2={D + H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <rect x={D} y="0" width={W} height={D} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <rect x={D*2 + W} y="0" width={W} height={D} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <rect x={D} y={D + H} width={W} height={D} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <rect x={D*2 + W} y={D + H} width={W} height={D} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
          </g>
        );

      case 'flip-top':
        return (
          <g>
            {/* Main Base Outline (Cut) */}
            <rect x="0" y="0" width={W + (D*2)} height={H + (D*2)} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            {/* Inner Folds */}
            <rect x={D} y={D} width={W} height={H} fill="none" stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={D} y1={0} x2={D} y2={D} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={W+D} y1={0} x2={W+D} y2={D} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            {/* Lid Part (Top) */}
            <rect x={D} y={-H-F} width={W} height={H + F} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={D} y1={-F} x2={W+D} y2={-F} stroke={FOLD_COLOR} strokeDasharray="4 4" />
          </g>
        );

      case 'sleeve':
        const sleeveW = (W * 2) + (D * 2) + F;
        return (
          <g>
            <rect x="0" y="0" width={sleeveW} height={H} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={W} y1="0" x2={W} y2={H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={W + D} y1="0" x2={W + D} y2={H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={W * 2 + D} y1="0" x2={W * 2 + D} y2={H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <line x1={W * 2 + D * 2} y1="0" x2={W * 2 + D * 2} y2={H} stroke={FOLD_COLOR} strokeDasharray="4 4" />
          </g>
        );

      case 'tray':
        return (
          <g>
            <rect x={D} y={D} width={W} height={H} fill="none" stroke={FOLD_COLOR} strokeDasharray="4 4" />
            <rect x="0" y="0" width={W + D*2} height={H + D*2} fill="none" stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={D} y1="0" x2={D} y2={D} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={W+D} y1="0" x2={W+D} y2={D} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={D} y1={H+D} x2={D} y2={H+D*2} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
            <line x1={W+D} y1={H+D} x2={W+D} y2={H+D*2} stroke={CUT_COLOR} strokeWidth={STROKE_WIDTH} />
          </g>
        );
    }
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const svgContent = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dieline-${boxType}-${width}x${height}x${depth}.svg`;
    link.click();
  };

  return (
    <div className="space-y-16 pb-24">
      {/* --- Generator Main Canvas --- */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col lg:flex-row min-h-[700px]">
        
        {/* Sidebar Controls */}
        <div className="w-full lg:w-96 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 overflow-y-auto p-8 space-y-8 flex-shrink-0 custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <DielineIcon className="w-6 h-6 text-blue-600" />
                  {t.dieSettings}
              </h2>
              {onClose && <button onClick={onClose} className="lg:hidden text-slate-400"><BackIcon className="w-5 h-5 rtl:rotate-180" /></button>}
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.dieBoxType}</label>
               <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'standard', label: t.dieBoxStandard, icon: '📦' },
                    { id: 'flip-top', label: t.dieBoxFlipTop, icon: '🎁' },
                    { id: 'sleeve', label: t.dieBoxSleeve, icon: '✉️' },
                    { id: 'tray', label: t.dieBoxTray, icon: '🍱' }
                  ].map(b => (
                    <button 
                      key={b.id}
                      onClick={() => setBoxType(b.id as BoxType)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${boxType === b.id ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'}`}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-[10px] font-black uppercase text-center leading-tight">{b.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
               <ControlSlider label={t.dieWidth} value={width} onChange={setWidth} min={40} max={600} suffix=" mm" />
               <ControlSlider label={t.dieHeight} value={height} onChange={setHeight} min={20} max={500} suffix=" mm" />
               <ControlSlider label={t.dieDepth} value={depth} onChange={setDepth} min={20} max={600} suffix=" mm" />
               <ControlSlider label={t.dieFlapSize} value={flap} onChange={setFlap} min={0} max={60} suffix=" mm" />
            </div>

            <div className="pt-8">
               <button onClick={downloadSVG} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                 <span>📥</span> {t.dieExportSVG}
               </button>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2">
               <div className="flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-red-600"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t.dieLegendCut}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-blue-600 border-t border-dashed"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t.dieLegendFold}</span>
               </div>
            </div>
        </div>

        {/* Live Preview Wrapper */}
        <div className="flex-1 bg-slate-100 dark:bg-[#020617] p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-8 left-8 z-10">
               <span className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest shadow-sm">
                 Studio Preview • 1:1 Engineering
               </span>
            </div>

            <div className="w-full h-full max-h-[75vh] flex items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-12 overflow-auto custom-scrollbar">
               <svg 
                  ref={svgRef}
                  viewBox={getDynamicViewBox()}
                  className="max-w-full h-auto transition-all duration-300 transform-gpu"
                  style={{ minWidth: '350px' }}
               >
                  {renderDieline()}
               </svg>
            </div>
            
            <div className="mt-8 text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Designer's Friend Blueprint Generator</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ControlSlider = ({ label, value, onChange, min, max, suffix = "" }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</label>
        <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">{value}{suffix}</span>
    </div>
    <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer appearance-none shadow-inner"
    />
  </div>
);
