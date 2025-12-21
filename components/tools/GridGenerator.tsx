import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { GridIcon, BackIcon, ImageIcon } from '../Icons';

interface GridGeneratorProps {
  onClose?: () => void;
}

interface GridTemplate {
  id: string;
  name: string;
  cells: number;
  areas: string;
}

interface ImageData {
  src: string;
  x: number;
  y: number;
  zoom: number;
}

const templates: GridTemplate[] = [
  { id: 'grid-6-1', name: '6 Grids Modern', cells: 6, areas: '"a a b" "c d b" "e f f"' },
  { id: 'grid-6-2', name: '6 Grids Collage', cells: 6, areas: '"a b c" "a d e" "a f f"' },
  { id: 'grid-7-1', name: '7 Grids Dynamic', cells: 7, areas: '"a a b c" "d e f g"' },
  { id: 'grid-8-1', name: '8 Grids Symmetrical', cells: 8, areas: '"a b c d" "e f g h"' },
  { id: 'grid-9-1', name: '9 Grids Uniform', cells: 9, areas: '"a b c" "d e f" "g h i"' },
  { id: 'grid-10-1', name: '10 Grids Vertical', cells: 10, areas: '"a b c d e" "f g h i j"' },
];

export const GridGenerator: React.FC<GridGeneratorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [activeTemplate, setActiveTemplate] = useState<GridTemplate>(templates[0]);
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gutter, setGutter] = useState(15);
  const [radius, setRadius] = useState(12);
  const [cellColor, setCellColor] = useState('#3b82f6');
  const [cellOpacity, setCellOpacity] = useState(0.15);
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  
  // Advanced Image State
  const [images, setImages] = useState<Record<number, ImageData>>({});
  const [draggingCell, setDraggingCell] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetCell, setTargetCell] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellClick = (index: number, e: React.MouseEvent) => {
    // If clicking an existing image, we don't necessarily want to re-upload
    // unless it's a double click or specific button. For now, let's use a "Change" logic.
    if (!images[index]) {
        setTargetCell(index);
        fileInputRef.current?.click();
    }
  };

  const triggerFileUpload = (index: number) => {
    setTargetCell(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && targetCell !== null) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => ({ 
          ...prev, 
          [targetCell]: { src: ev.target?.result as string, x: 0, y: 0, zoom: 1 } 
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Dragging Logic
  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    if (!images[index]) return;
    setDraggingCell(index);
    setDragStart({ x: e.clientX - images[index].x, y: e.clientY - images[index].y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCell === null) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setImages(prev => ({
        ...prev,
        [draggingCell]: { ...prev[draggingCell], x: newX, y: newY }
    }));
  };

  const handleMouseUp = () => setDraggingCell(null);

  const updateZoom = (index: number, zoom: number) => {
      setImages(prev => ({
          ...prev,
          [index]: { ...prev[index], zoom }
      }));
  };

  const clearImages = () => setImages({});

  const downloadHighRes = async () => {
    if (!gridRef.current) return;
    
    const canvas = document.createElement('canvas');
    const scale = 2; 
    const rect = gridRef.current.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const children = Array.from(gridRef.current.children) as HTMLElement[];

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const cRect = child.getBoundingClientRect();
        const x = (cRect.left - rect.left) * scale;
        const y = (cRect.top - rect.top) * scale;
        const w = cRect.width * scale;
        const h = cRect.height * scale;
        const r = radius * scale;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();

        const imgData = images[i];
        if (imgData) {
            ctx.save();
            ctx.clip();
            const img = new Image();
            img.src = imgData.src;
            await new Promise(res => {
                if (img.complete) res(null);
                else img.onload = () => res(null);
            });
            
            const imgRatio = img.width / img.height;
            const cellRatio = w / h;
            let drawW, drawH, drawX, drawY;

            // Base cover logic
            if (imgRatio > cellRatio) {
                drawH = h * imgData.zoom;
                drawW = drawH * imgRatio;
            } else {
                drawW = w * imgData.zoom;
                drawH = drawW / imgRatio;
            }
            
            // Center + User Offset
            drawX = x + (w - drawW) / 2 + (imgData.x * scale);
            drawY = y + (h - drawH) / 2 + (imgData.y * scale);

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.restore();
        } else {
            ctx.fillStyle = cellColor + Math.floor(cellOpacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
        }
    }

    const link = document.createElement('a');
    link.download = `pro-moodboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const cellCount = mode === 'template' ? activeTemplate.cells : cols * rows;

  return (
    <div 
        className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col lg:flex-row min-h-[700px]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      
      {/* Settings Sidebar */}
      <div className="w-full lg:w-96 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 overflow-y-auto p-6 space-y-8 flex-shrink-0 custom-scrollbar">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <GridIcon className="w-6 h-6 text-blue-600" />
                {t.gridSettings}
            </h2>
            {onClose && <button onClick={onClose} className="lg:hidden text-slate-400 p-2"><BackIcon className="w-5 h-5 rtl:rotate-180" /></button>}
          </div>

          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl flex border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
                onClick={() => setMode('template')} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'template' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                {t.gridPresets}
            </button>
            <button 
                onClick={() => setMode('custom')} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'custom' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                {t.gridCustom}
            </button>
          </div>

          <div className="space-y-6">
              {mode === 'template' ? (
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.gridTemplates}</label>
                   <div className="grid grid-cols-2 gap-2">
                      {templates.map(tmp => (
                        <button 
                          key={tmp.id}
                          onClick={() => { setActiveTemplate(tmp); setImages({}); }}
                          className={`p-3 rounded-xl border-2 transition-all text-[10px] font-bold ${activeTemplate.id === tmp.id ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                        >
                           <div className="grid gap-1 mb-2 h-8 pointer-events-none opacity-40" style={{ gridTemplateAreas: tmp.areas, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                              {'abcdefghij'.split('').slice(0, tmp.cells).map(char => (
                                <div key={char} style={{ gridArea: char }} className="bg-current rounded-sm"></div>
                              ))}
                           </div>
                           {tmp.name}
                        </button>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <ControlSlider label={t.gridCols} value={cols} onChange={setCols} min={1} max={12} />
                   <ControlSlider label={t.gridRows} value={rows} onChange={setRows} min={1} max={12} />
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-6">
                <ControlSlider label={t.gridGutter} value={gutter} onChange={setGutter} min={0} max={50} suffix="px" />
                <ControlSlider label={t.gridRadius} value={radius} onChange={setRadius} min={0} max={40} suffix="px" />
                
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.gridCellColor}</label>
                   <div className="flex items-center gap-3">
                      <input type="color" value={cellColor} onChange={e => setCellColor(e.target.value)} className="w-8 h-8 rounded-full border-none p-0 cursor-pointer overflow-hidden shadow-inner" />
                      <input type="range" min="0" max="1" step="0.05" value={cellOpacity} onChange={e => setCellOpacity(parseFloat(e.target.value))} className="w-20 accent-blue-600" />
                   </div>
                </div>
              </div>
          </div>

          <div className="pt-8 space-y-4">
              <button 
                onClick={downloadHighRes}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                  <span className="text-sm">{t.gridDownloadHighRes}</span>
                  <span className="text-[9px] opacity-70 uppercase tracking-tighter">PNG - Studio Quality</span>
              </button>
              <button onClick={clearImages} className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black transition-all hover:bg-red-500 hover:text-white">
                  {t.gridClearImages}
              </button>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
             <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 text-center leading-relaxed">
                💡 {language === 'ar' ? 'يمكنك سحب الصورة داخل الخلية لضبط تموضعها، واستخدام شريط التكبير للمزيد من الدقة.' : 'Drag image inside cell to reposition, and use zoom slider for precision.'}
             </p>
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-[#020617] p-6 lg:p-12 flex flex-col relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t.gridPreview}</span>
                <p className="text-[10px] text-blue-500 font-bold">{t.gridUploadHint}</p>
              </div>
              <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full text-[10px] font-black shadow-sm border border-slate-200 dark:border-slate-800 text-slate-500">{cellCount} Cells</span>
              </div>
          </div>

          {/* Grid Viewport */}
          <div className="flex-1 flex items-center justify-center p-4">
             <div 
                ref={gridRef}
                className="w-full h-full max-h-[80vh] transition-all duration-500 ease-out select-none"
                style={{
                    display: 'grid',
                    gap: `${gutter}px`,
                    gridTemplateColumns: mode === 'template' ? 'repeat(auto-fit, minmax(0, 1fr))' : `repeat(${cols}, 1fr)`,
                    gridTemplateRows: mode === 'template' ? 'auto' : `repeat(${rows}, 1fr)`,
                    gridTemplateAreas: mode === 'template' ? activeTemplate.areas : 'none',
                }}
             >
                {Array.from({ length: cellCount }).map((_, i) => (
                    <div 
                        key={i}
                        className="relative group overflow-hidden shadow-sm hover:shadow-xl transition-shadow bg-slate-200 dark:bg-slate-800"
                        style={{ 
                            gridArea: mode === 'template' ? 'abcdefghij'[i] : 'auto',
                            borderRadius: `${radius}px`,
                        }}
                    >
                        {/* Interactive Image Container */}
                        <div 
                           className={`absolute inset-0 ${images[i] ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                           onClick={(e) => handleCellClick(i, e)}
                           onMouseDown={(e) => handleMouseDown(i, e)}
                        >
                            {/* Overlay if no image */}
                            {!images[i] && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ backgroundColor: `${cellColor}${Math.floor(cellOpacity * 255).toString(16).padStart(2, '0')}` }}>
                                    <ImageIcon className="w-8 h-8 text-white opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all" />
                                </div>
                            )}

                            {/* User Image Render */}
                            {images[i] && (
                                <img 
                                    src={images[i].src} 
                                    draggable={false}
                                    className="absolute min-w-full min-h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                                    style={{ 
                                        transform: `translate(${images[i].x}px, ${images[i].y}px) scale(${images[i].zoom})`,
                                        left: '50%',
                                        top: '50%',
                                        marginLeft: '-50%',
                                        marginTop: '-50%'
                                    }} 
                                    alt="" 
                                />
                            )}
                        </div>

                        {/* Cell Overlay Tools */}
                        {images[i] && (
                            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 translate-y-2 group-hover:translate-y-0">
                                <span className="text-[8px] font-bold text-white uppercase shrink-0">Zoom</span>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="3" 
                                    step="0.01" 
                                    value={images[i].zoom} 
                                    onChange={(e) => updateZoom(i, parseFloat(e.target.value))}
                                    className="flex-1 accent-blue-500 h-1"
                                />
                                <button 
                                    onClick={(e) => { e.stopPropagation(); triggerFileUpload(i); }} 
                                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors"
                                    title="Change Image"
                                >
                                    <ImageIcon className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Cell Number */}
                        <div className="absolute top-2 right-2 pointer-events-none">
                             <div className="w-6 h-6 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white text-[10px] font-black">
                                {i + 1}
                             </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />

          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{language === 'ar' ? 'شبكات تصميم ومودبورد احترافية' : 'PRO DESIGN GRID & MOODBOARD'}</p>
          </div>
      </div>
    </div>
  );
};

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
        className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer appearance-none"
    />
  </div>
);