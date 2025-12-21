
import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../../context';
import { PatternIcon, BackIcon } from '../Icons';

interface PatternGeneratorProps {
  onClose?: () => void;
}

type PatternType = 'dots' | 'lines' | 'grid' | 'cross' | 'zigzag' | 'waves' | 'diamonds' | 'triangles' | 'hexagons' | 'checkered' | 'polka';

export const PatternGenerator: React.FC<PatternGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  
  const [type, setType] = useState<PatternType>('dots');
  const [size, setSize] = useState(20);
  const [spacing, setSpacing] = useState(60);
  const [thickness, setThickness] = useState(2);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [shapeColor, setShapeColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');

  const svgRef = useRef<SVGSVGElement>(null);

  // Generate SVG Pattern Content for rendering and export
  const renderPattern = () => {
    const s = spacing;
    const half = s / 2;
    const q = s / 4;
    const color = shapeColor;
    const op = opacity;

    let content = null;
    switch (type) {
      case 'dots':
        content = <circle cx={half} cy={half} r={size / 4} fill={color} fillOpacity={op} />;
        break;
      case 'lines':
        content = <line x1="0" y1={half} x2={s} y2={half} stroke={color} strokeWidth={thickness} strokeOpacity={op} />;
        break;
      case 'grid':
        content = (
          <>
            <line x1="0" y1={half} x2={s} y2={half} stroke={color} strokeWidth={thickness} strokeOpacity={op} />
            <line x1={half} y1="0" x2={half} y2={s} stroke={color} strokeWidth={thickness} strokeOpacity={op} />
          </>
        );
        break;
      case 'cross':
        const len = size / 2;
        content = (
          <g transform={`translate(${half}, ${half})`}>
            <line x1={-len} y1="0" x2={len} y2="0" stroke={color} strokeWidth={thickness} strokeOpacity={op} />
            <line x1="0" y1={-len} x2="0" y2={len} stroke={color} strokeWidth={thickness} strokeOpacity={op} />
          </g>
        );
        break;
      case 'zigzag':
        content = <polyline points={`0,${s} ${half},0 ${s},${s}`} fill="none" stroke={color} strokeWidth={thickness} strokeOpacity={op} />;
        break;
      case 'waves':
        content = <path d={`M0 ${half} Q ${q} 0 ${half} ${half} T ${s} ${half}`} fill="none" stroke={color} strokeWidth={thickness} strokeOpacity={op} />;
        break;
      case 'diamonds':
        const ds = size / 2;
        content = <rect x={half - ds/2} y={half - ds/2} width={ds} height={ds} fill={color} fillOpacity={op} transform={`rotate(45, ${half}, ${half})`} />;
        break;
      case 'triangles':
        const ts = size / 2;
        content = <polygon points={`${half},${half-ts} ${half-ts},${half+ts} ${half+ts},${half+ts}`} fill={color} fillOpacity={op} />;
        break;
      case 'hexagons':
        const r = size / 2;
        const h = r * Math.sqrt(3) / 2;
        content = <path d={`M${half},${half-r} L${half+h},${half-r/2} L${half+h},${half+r/2} L${half},${half+r} L${half-h},${half+r/2} L${half-h},${half-r/2} Z`} fill={color} fillOpacity={op} />;
        break;
      case 'checkered':
        content = (
          <>
            <rect x="0" y="0" width={half} height={half} fill={color} fillOpacity={op} />
            <rect x={half} y={half} width={half} height={half} fill={color} fillOpacity={op} />
          </>
        );
        break;
      case 'polka':
        content = (
          <>
            <circle cx={q} cy={q} r={size / 8} fill={color} fillOpacity={op} />
            <circle cx={s-q} cy={s-q} r={size / 8} fill={color} fillOpacity={op} />
          </>
        );
        break;
    }

    return (
      <g transform={`rotate(${rotation}, ${half}, ${half})`}>
        {content}
      </g>
    );
  };

  const encodeSVGComponent = () => {
    const s = spacing;
    const half = s / 2;
    const q = s / 4;
    const color = shapeColor.replace('#', '%23');
    const op = opacity;
    const t_ = thickness;
    const sz = size;

    switch (type) {
      case 'dots': return `%3Ccircle cx='${half}' cy='${half}' r='${sz/4}' fill='${color}' fill-opacity='${op}'/%3E`;
      case 'lines': return `%3Cline x1='0' y1='${half}' x2='${s}' y2='${half}' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E`;
      case 'grid': return `%3Cline x1='0' y1='${half}' x2='${s}' y2='${half}' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E%3Cline x1='${half}' y1='0' x2='${half}' y2='${s}' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E`;
      case 'cross': return `%3Cg transform='translate(${half} ${half})'%3E%3Cline x1='-${sz/2}' y1='0' x2='${sz/2}' y2='0' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E%3Cline x1='0' y1='-${sz/2}' x2='0' y2='${sz/2}' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E%3C/g%3E`;
      case 'zigzag': return `%3Cpolyline points='0,${s} ${half},0 ${s},${s}' fill='none' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E`;
      case 'waves': return `%3Cpath d='M0 ${half} Q ${q} 0 ${half} ${half} T ${s} ${half}' fill='none' stroke='${color}' stroke-width='${t_}' stroke-opacity='${op}'/%3E`;
      case 'diamonds': return `%3Crect x='${half - (sz/4)}' y='${half - (sz/4)}' width='${sz/2}' height='${sz/2}' fill='${color}' fill-opacity='${op}' transform='rotate(45 ${half} ${half})'/%3E`;
      case 'triangles': return `%3Cpolygon points='${half},${half-sz/2} ${half-sz/2},${half+sz/2} ${half+sz/2},${half+sz/2}' fill='${color}' fill-opacity='${op}'/%3E`;
      case 'hexagons': 
        const r = sz / 2;
        const h = r * Math.sqrt(3) / 2;
        return `%3Cpath d='M${half},${half-r} L${half+h},${half-r/2} L${half+h},${half+r/2} L${half},${half+r} L${half-h},${half+r/2} L${half-h},${half-r/2} Z' fill='${color}' fill-opacity='${op}'/%3E`;
      case 'checkered': return `%3Crect x='0' y='0' width='${half}' height='${half}' fill='${color}' fill-opacity='${op}'/%3E%3Crect x='${half}' y='${half}' width='${half}' height='${half}' fill='${color}' fill-opacity='${op}'/%3E`;
      case 'polka': return `%3Ccircle cx='${q}' cy='${q}' r='${sz/8}' fill='${color}' fill-opacity='${op}'/%3E%3Ccircle cx='${s-q}' cy='${s-q}' r='${sz/8}' fill='${color}' fill-opacity='${op}'/%3E`;
    }
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const patternSize = spacing;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="p" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
            <rect width="${patternSize}" height="${patternSize}" fill="${bgColor}" />
            ${new XMLSerializer().serializeToString(svgRef.current.querySelector('g')!)}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" />
      </svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${type}.svg`;
    link.click();
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    const patternSize = spacing;
    const exportScale = 4;
    canvas.width = patternSize * exportScale;
    canvas.height = patternSize * exportScale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const patternMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${patternSize}" height="${patternSize}">
      <rect width="${patternSize}" height="${patternSize}" fill="${bgColor}" />
      ${new XMLSerializer().serializeToString(svgRef.current!.querySelector('g')!)}
    </svg>`;
    
    img.onload = () => {
      ctx.scale(exportScale, exportScale);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `pattern-tile-${type}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(patternMarkup)));
  };

  const patternOptions = [
    { id: 'dots', label: t.patternDots, icon: '•' },
    { id: 'lines', label: t.patternLines, icon: '—' },
    { id: 'grid', label: t.patternGrid, icon: '田' },
    { id: 'cross', label: t.patternCross, icon: '+' },
    { id: 'zigzag', label: t.patternZigzag, icon: 'W' },
    { id: 'waves', label: t.patternWaves, icon: '〜' },
    { id: 'diamonds', label: t.patternDiamonds, icon: '◆' },
    { id: 'triangles', label: t.patternTriangles, icon: '▲' },
    { id: 'hexagons', label: t.patternHexagons, icon: '⬢' },
    { id: 'checkered', label: t.patternCheckered, icon: '🏁' },
    { id: 'polka', label: t.patternPolka, icon: '⚬' },
  ];

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col lg:flex-row min-h-[750px]">
      
      {/* Settings Sidebar */}
      <div className="w-full lg:w-[420px] bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 overflow-y-auto p-8 space-y-8 flex-shrink-0 custom-scrollbar">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <PatternIcon className="w-6 h-6 text-blue-600" />
                {t.patternSettings}
            </h2>
            {onClose && <button onClick={onClose} className="lg:hidden text-slate-400 p-2"><BackIcon className="w-5 h-5 rtl:rotate-180" /></button>}
          </div>

          {/* Pattern Type Grid */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.patternType}</label>
             <div className="grid grid-cols-4 gap-2">
                {patternOptions.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setType(p.id as PatternType)}
                    title={p.label}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${type === p.id ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    <span className="text-xl font-bold">{p.icon}</span>
                    <span className="text-[8px] font-black uppercase truncate w-full text-center">{p.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Controls */}
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
             <ControlSlider label={t.patternSize} value={size} onChange={setSize} min={5} max={150} />
             <ControlSlider label={t.patternSpacing} value={spacing} onChange={setSpacing} min={10} max={300} />
             <ControlSlider label={t.patternRotation} value={rotation} onChange={setRotation} min={0} max={360} suffix="°" />
             <ControlSlider label={t.patternThickness} value={thickness} onChange={setThickness} min={1} max={20} />
             <ControlSlider label={t.patternOpacity} value={opacity} onChange={setOpacity} min={0.1} max={1} step={0.1} />
          </div>

          {/* Colors */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.patternColors}</label>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <span className="text-[9px] font-bold text-slate-500">{t.patternBgColor}</span>
                   <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden shadow-sm" />
                </div>
                <div className="space-y-2">
                   <span className="text-[9px] font-bold text-slate-500">{t.patternShapeColor}</span>
                   <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden shadow-sm" />
                </div>
             </div>
          </div>

          <div className="pt-8 space-y-3">
             <button onClick={downloadSVG} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
               {t.patternDownloadSVG}
             </button>
             <button onClick={downloadPNG} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs hover:bg-slate-900 transition-all">
               {t.patternDownloadPNG}
             </button>
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-[#020617] p-8 lg:p-12 flex flex-col relative overflow-hidden">
          
          <div className="absolute top-8 left-8 z-10 flex gap-2">
             <span className="px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest shadow-sm">Live Preview</span>
          </div>

          {/* Hidden SVG for Export Source */}
          <svg ref={svgRef} width={spacing} height={spacing} className="hidden">
             {renderPattern()}
          </svg>

          {/* Tiled Preview */}
          <div className="w-full h-full rounded-[3rem] shadow-inner border border-slate-200 dark:border-slate-800 overflow-hidden bg-white relative">
             <div 
                className="w-full h-full transition-all duration-300"
                style={{
                  backgroundColor: bgColor,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}'%3E%3Cg transform='rotate(${rotation} ${spacing/2} ${spacing/2})'%3E${encodeSVGComponent()}%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat'
                }}
             />
          </div>

          <div className="mt-6 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Designer's Friend Pattern Engine</p>
          </div>
      </div>
    </div>
  );
};

const ControlSlider = ({ label, value, onChange, min, max, step = 1, suffix = "" }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</label>
        <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">{value}{suffix}</span>
    </div>
    <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer appearance-none"
    />
  </div>
);
