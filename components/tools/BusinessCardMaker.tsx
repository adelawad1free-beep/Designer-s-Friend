import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { IdCardIcon, BackIcon, ImageIcon, SwapIcon } from '../Icons';
import { PDFDocument } from 'pdf-lib';

interface BusinessCardMakerProps {
  onClose?: () => void;
}

type LayoutType = 'modern' | 'minimal' | 'bold' | 'elegant' | 'creative' | 'corporate' | 'artistic' | 'tech' | 'classic' | 'geometric';
type CardSide = 'front' | 'back';

export const BusinessCardMaker: React.FC<BusinessCardMakerProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const svgRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState({
    name: language === 'ar' ? 'محمد أحمد' : 'John Doe',
    job: language === 'ar' ? 'مصمم جرافيك' : 'Graphic Designer',
    company: language === 'ar' ? 'استوديو الإبداع' : 'Creative Studio',
    phone: '+123 456 789',
    email: 'hello@example.com',
    website: 'www.example.com',
    address: language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'New York, USA',
  });

  const [themeColor, setThemeColor] = useState('#2563eb');
  const [layout, setLayout] = useState<LayoutType>('modern');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [activeSide, setActiveSide] = useState<CardSide>('front');

  // Logo State
  const [logo, setLogo] = useState<string | null>(null);
  const [originalLogo, setOriginalLogo] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState(false);
  const [logoSettings, setLogoSettings] = useState({ x: 50, y: 50, size: 100 });

  // Text Positioning State
  const [selectedTextElement, setSelectedTextElement] = useState<'name' | 'job' | 'company' | 'contact'>('name');
  const [textOffsets, setTextOffsets] = useState({
    name: { x: 0, y: 0 },
    job: { x: 0, y: 0 },
    company: { x: 0, y: 0 },
    contact: { x: 0, y: 0 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const rawLogo = ev.target.result as string;
          setOriginalLogo(rawLogo);
          setLogo(rawLogo);
          setLogoSettings(prev => ({ ...prev, x: 50, y: 50 }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!originalLogo) return;

    if (!removeBg) {
      setLogo(originalLogo);
      return;
    }

    const img = new Image();
    img.src = originalLogo;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const threshold = 230;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0; 
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setLogo(canvas.toDataURL());
    };
  }, [removeBg, originalLogo]);

  const isLandscape = orientation === 'landscape';
  const cardWidth = isLandscape ? 1050 : 600;
  const cardHeight = isLandscape ? 600 : 1050;

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = `card-${layout}-${activeSide}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownloadPdf = () => {
    if (!svgRef.current) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngDataUrl = canvas.toDataURL('image/png');

        try {
            const pdfDoc = await PDFDocument.create();
            const pngImage = await pdfDoc.embedPng(pngDataUrl);
            const page = pdfDoc.addPage([cardWidth, cardHeight]);
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: cardWidth,
                height: cardHeight,
            });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `card-${layout}-${activeSide}.pdf`;
            link.click();
        } catch (e) {
            console.error("PDF generation failed", e);
            alert("Failed to generate PDF.");
        }
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // --- Layout Helpers ---
  const isRtl = language === 'ar';
  const textAnchorStart = 'start'; // In SVG RTL, start is right
  const textAnchorEnd = 'end';
  const margin = 50;
  const xStart = isRtl ? cardWidth - margin : margin; 
  const centerX = cardWidth / 2;
  const centerY = cardHeight / 2;

  // Render Logic Helpers
  const renderLogo = (x: number, y: number, size: number = 100) => {
      if (logo) {
          return <image href={logo} x={x - size/2} y={y - size/2} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
      }
      // Placeholder if no logo
      return (
          <g transform={`translate(${x}, ${y})`}>
              <circle r={size/2} fill="rgba(0,0,0,0.1)" />
              <text y="10" fontSize={size/2} textAnchor="middle" fill="#666" fontWeight="bold">
                  {data.company.charAt(0).toUpperCase()}
              </text>
          </g>
      );
  };

  const layouts = [
      'modern', 'minimal', 'bold', 'elegant', 'creative',
      'corporate', 'artistic', 'tech', 'classic', 'geometric'
  ];

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto max-h-[40vh] md:max-h-full">
          
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 sticky top-0 z-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <IdCardIcon className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t.cardTitle}</h2>
             </div>
             {onClose && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <BackIcon className="w-5 h-5 rtl:rotate-180" />
                </button>
             )}
          </div>

          <div className="p-5 space-y-6 pb-20">
             
             {/* Side & Orientation */}
             <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-1 rounded-xl flex border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button onClick={() => setActiveSide('front')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeSide === 'front' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>{t.cardFaceFront}</button>
                    <button onClick={() => setActiveSide('back')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeSide === 'back' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>{t.cardFaceBack}</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setOrientation('landscape')} className={`py-2 rounded-lg text-xs font-bold border transition-all ${orientation === 'landscape' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>عرضي</button>
                   <button onClick={() => setOrientation('portrait')} className={`py-2 rounded-lg text-xs font-bold border transition-all ${orientation === 'portrait' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>طولي</button>
                </div>
             </div>

             {/* Layout Selector */}
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.cardLayout}</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                   {layouts.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayout(l as any)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${layout === l ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'}`}
                      >
                         {t[`card${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof typeof t]}
                      </button>
                   ))}
                </div>
             </div>

             {/* Color Picker */}
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.cardColor}</label>
                <div className="flex flex-wrap gap-2">
                   {['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#000000', '#D4AF37', '#06b6d4', '#e11d48'].map(c => (
                      <button
                        key={c}
                        onClick={() => setThemeColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${themeColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                   ))}
                   <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-0 p-0" />
                </div>
             </div>

             {/* Logo & Position */}
             <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">{language === 'ar' ? 'الشعار' : 'Logo'}</label>
                    {logo && <button onClick={() => { setLogo(null); setOriginalLogo(null); }} className="text-xs text-red-500 hover:underline">✕</button>}
                </div>
                
                {!logo ? (
                   <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500">{language === 'ar' ? 'رفع صورة' : 'Upload'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                   </label>
                ) : (
                   <div className="space-y-2">
                      <input type="range" min="0" max={cardWidth} value={logoSettings.x} onChange={e => setLogoSettings({...logoSettings, x: Number(e.target.value)})} className="w-full h-1 accent-blue-600" title="X Position" />
                      <input type="range" min="0" max={cardHeight} value={logoSettings.y} onChange={e => setLogoSettings({...logoSettings, y: Number(e.target.value)})} className="w-full h-1 accent-blue-600" title="Y Position" />
                      <input type="range" min="20" max="400" value={logoSettings.size} onChange={e => setLogoSettings({...logoSettings, size: Number(e.target.value)})} className="w-full h-1 accent-blue-600" title="Size" />
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                         <input type="checkbox" checked={removeBg} onChange={e => setRemoveBg(e.target.checked)} className="w-3 h-3 rounded" />
                         <span className="text-[10px] text-slate-600 dark:text-slate-400">{t.cardRemoveBg}</span>
                      </label>
                   </div>
                )}
             </div>

             {/* Text Content */}
             <div className="space-y-3">
                <Input label={t.cardName} name="name" value={data.name} onChange={handleChange} />
                <Input label={t.cardJob} name="job" value={data.job} onChange={handleChange} />
                <Input label={t.cardCompany} name="company" value={data.company} onChange={handleChange} />
                <Input label={t.cardPhone} name="phone" value={data.phone} onChange={handleChange} />
                <Input label={t.cardEmail} name="email" value={data.email} onChange={handleChange} />
                <Input label={t.cardWebsite} name="website" value={data.website} onChange={handleChange} />
                <Input label={t.cardAddress} name="address" value={data.address} onChange={handleChange} />
             </div>

             <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleDownload} className="btn-secondary">{t.cardDownload}</button>
                <button onClick={handleDownloadPdf} className="btn-primary">{t.cardDownloadPdf}</button>
             </div>
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-200 dark:bg-[#0B1120] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="mb-4 bg-white/80 dark:bg-black/50 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm border border-white/20">
             {t[`card${layout.charAt(0).toUpperCase() + layout.slice(1)}` as keyof typeof t]} • {activeSide === 'front' ? t.cardFaceFront : t.cardFaceBack}
         </div>

         <div 
            className="relative shadow-2xl rounded-sm overflow-hidden bg-white transition-all duration-500 hover:scale-[1.01]"
            style={{ 
                width: '100%', 
                maxWidth: isLandscape ? '900px' : '500px',
                aspectRatio: `${cardWidth}/${cardHeight}`
            }}
         >
            <svg
               ref={svgRef}
               viewBox={`0 0 ${cardWidth} ${cardHeight}`}
               xmlns="http://www.w3.org/2000/svg"
               className="w-full h-full block"
               style={{ fontFamily: 'Cairo, sans-serif', direction: isRtl ? 'rtl' : 'ltr' }}
            >
               <rect width={cardWidth} height={cardHeight} fill="white" />

               {/* ================================================================================== */}
               {/* ============================== LAYOUT RENDER LOGIC =============================== */}
               {/* ================================================================================== */}

               {layout === 'modern' && (
                   activeSide === 'front' ? (
                       <>
                           <rect x={isRtl ? cardWidth - 300 : 0} y="0" width="300" height={cardHeight} fill={themeColor} />
                           {renderLogo(isRtl ? cardWidth - 150 : 150, centerY, 150)}
                           <g transform={`translate(${isLandscape ? (isRtl ? -200 : 200) : 0}, 0)`}>
                               <text x={centerX} y={centerY - 40} fill="#333" fontSize="50" fontWeight="800" textAnchor={isLandscape ? textAnchorStart : "middle"}>{data.name}</text>
                               <text x={centerX} y={centerY + 10} fill={themeColor} fontSize="24" fontWeight="600" textAnchor={isLandscape ? textAnchorStart : "middle"}>{data.job.toUpperCase()}</text>
                               <g transform={`translate(${isLandscape ? 0 : centerX}, ${centerY + 80})`} fontSize="20" fill="#555" textAnchor={isLandscape ? textAnchorStart : "middle"}>
                                   <text y="0">📞 {data.phone}</text>
                                   <text y="35">✉️ {data.email}</text>
                                   <text y="70">🌐 {data.website}</text>
                               </g>
                           </g>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                           <rect x="50" y="50" width={cardWidth - 100} height={cardHeight - 100} fill="white" opacity="0.1" />
                           {renderLogo(centerX, centerY - 50, 200)}
                           <text x={centerX} y={centerY + 100} fill="white" fontSize="40" fontWeight="bold" textAnchor="middle">{data.company}</text>
                           <text x={centerX} y={centerY + 140} fill="white" fontSize="20" opacity="0.8" textAnchor="middle">{data.website}</text>
                       </>
                   )
               )}

               {layout === 'minimal' && (
                   activeSide === 'front' ? (
                        <>
                            <rect x="40" y="40" width={cardWidth - 80} height={cardHeight - 80} fill="none" stroke={themeColor} strokeWidth="4" />
                            <text x={centerX} y={centerY - 30} fill="#222" fontSize="55" fontWeight="bold" textAnchor="middle">{data.name}</text>
                            <text x={centerX} y={centerY + 20} fill={themeColor} fontSize="24" textAnchor="middle" letterSpacing="2">{data.job.toUpperCase()}</text>
                            <line x1={centerX - 50} y1={centerY + 50} x2={centerX + 50} y2={centerY + 50} stroke="#ddd" strokeWidth="2" />
                            <g transform={`translate(${centerX}, ${cardHeight - 100})`} fontSize="18" fill="#666" textAnchor="middle">
                                <text>{data.phone} • {data.email} • {data.website}</text>
                            </g>
                        </>
                   ) : (
                        <>
                            <rect width={cardWidth} height={cardHeight} fill="#f9fafb" />
                            {renderLogo(centerX, centerY, 150)}
                            <text x={centerX} y={centerY + 100} fill="#333" fontSize="24" letterSpacing="4" textAnchor="middle">{data.company.toUpperCase()}</text>
                        </>
                   )
               )}

               {layout === 'bold' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                           <circle cx={isRtl ? 150 : cardWidth - 150} cy={isLandscape ? cardHeight / 2 : 150} r="300" fill="rgba(255,255,255,0.1)" />
                           <text x={xStart} y={centerY} fill="white" fontSize="70" fontWeight="900" textAnchor={textAnchorStart}>{data.name}</text>
                           <text x={xStart} y={centerY + 50} fill="rgba(255,255,255,0.8)" fontSize="30" textAnchor={textAnchorStart}>{data.job}</text>
                           <text x={isRtl ? 50 : cardWidth - 50} y={cardHeight - 50} fill="white" fontSize="20" textAnchor={textAnchorEnd}>{data.phone}</text>
                           <text x={isRtl ? 50 : cardWidth - 50} y={cardHeight - 80} fill="white" fontSize="20" textAnchor={textAnchorEnd}>{data.email}</text>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#111" />
                           <text x={centerX} y={centerY} fill={themeColor} fontSize="200" fontWeight="900" textAnchor="middle" opacity="0.2">{data.name.charAt(0)}</text>
                           <text x={centerX} y={centerY} fill="white" fontSize="50" fontWeight="bold" textAnchor="middle">{data.company}</text>
                       </>
                   )
               )}

               {layout === 'elegant' && (
                   activeSide === 'front' ? (
                       <>
                           <defs>
                               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                   <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                               </pattern>
                           </defs>
                           <rect width={cardWidth} height={cardHeight} fill="url(#grid)" />
                           <rect x="0" y={centerY - 80} width={cardWidth} height="160" fill="white" opacity="0.9" />
                           <line x1="0" y1={centerY - 80} x2={cardWidth} y2={centerY - 80} stroke={themeColor} strokeWidth="2" />
                           <line x1="0" y1={centerY + 80} x2={cardWidth} y2={centerY + 80} stroke={themeColor} strokeWidth="2" />
                           
                           <text x={centerX} y={centerY - 10} fill="#111" fontSize="48" fontWeight="bold" textAnchor="middle">{data.name}</text>
                           <text x={centerX} y={centerY + 30} fill={themeColor} fontSize="20" textAnchor="middle">{data.job}</text>
                           
                           <g transform={`translate(${centerX}, ${cardHeight - 40})`} fontSize="16" fill="#555" textAnchor="middle">
                               <text>{data.address} | {data.phone}</text>
                           </g>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#fff" />
                           <rect x="20" y="20" width={cardWidth - 40} height={cardHeight - 40} fill="none" stroke={themeColor} strokeWidth="1" />
                           <rect x="30" y="30" width={cardWidth - 60} height={cardHeight - 60} fill="none" stroke={themeColor} strokeWidth="4" />
                           {renderLogo(centerX, centerY - 20, 120)}
                           <text x={centerX} y={centerY + 80} fill="#333" fontSize="28" fontFamily="serif" textAnchor="middle">{data.company}</text>
                       </>
                   )
               )}

               {layout === 'creative' && (
                   activeSide === 'front' ? (
                       <>
                           <path d={`M0,0 L${cardWidth},0 L${cardWidth},${cardHeight*0.8} Q${cardWidth/2},${cardHeight} 0,${cardHeight*0.8} Z`} fill={themeColor} />
                           <text x={centerX} y={cardHeight * 0.4} fill="white" fontSize="60" fontWeight="bold" textAnchor="middle">{data.name}</text>
                           <text x={centerX} y={cardHeight * 0.5} fill="rgba(255,255,255,0.9)" fontSize="28" textAnchor="middle">{data.job}</text>
                           <g transform={`translate(${centerX}, ${cardHeight * 0.85})`} fontSize="18" fill="#333" textAnchor="middle">
                               <text>{data.email} • {data.website}</text>
                           </g>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#fff" />
                           <path d={`M0,${cardHeight} L${cardWidth},${cardHeight} L${cardWidth},${cardHeight*0.2} Q${cardWidth/2},0 0,${cardHeight*0.2} Z`} fill={themeColor} />
                           {renderLogo(centerX, cardHeight/2, 150)}
                       </>
                   )
               )}

               {layout === 'corporate' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#f3f4f6" />
                           <rect x="0" y="0" width="20" height={cardHeight} fill={themeColor} />
                           <text x="50" y="80" fill={themeColor} fontSize="30" fontWeight="bold" textAnchor="start">{data.company}</text>
                           
                           <line x1="50" y1={centerY} x2={cardWidth - 50} y2={centerY} stroke="#ddd" strokeWidth="1" />
                           
                           <text x="50" y={centerY - 20} fill="#333" fontSize="40" fontWeight="bold" textAnchor="start">{data.name}</text>
                           <text x={cardWidth - 50} y={centerY - 20} fill="#666" fontSize="20" textAnchor="end">{data.job}</text>
                           
                           <text x="50" y={centerY + 40} fill="#555" fontSize="18" textAnchor="start">📞 {data.phone}</text>
                           <text x="50" y={centerY + 70} fill="#555" fontSize="18" textAnchor="start">✉️ {data.email}</text>
                           <text x="50" y={centerY + 100} fill="#555" fontSize="18" textAnchor="start">📍 {data.address}</text>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                           <line x1="0" y1={centerY} x2={cardWidth} y2={centerY} stroke="rgba(255,255,255,0.2)" strokeWidth="200" />
                           {renderLogo(centerX, centerY, 180)}
                           <text x={centerX} y={cardHeight - 50} fill="white" fontSize="20" textAnchor="middle">{data.website}</text>
                       </>
                   )
               )}

               {layout === 'artistic' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="white" />
                           <circle cx="0" cy="0" r={cardHeight} fill={themeColor} opacity="0.1" />
                           <circle cx={cardWidth} cy={cardHeight} r={cardHeight*0.8} fill={themeColor} opacity="0.1" />
                           
                           <text x={centerX} y={centerY} fill="#333" fontSize="50" fontWeight="900" fontStyle="italic" textAnchor="middle">{data.name}</text>
                           <text x={centerX} y={centerY + 40} fill={themeColor} fontSize="24" textAnchor="middle">{data.job}</text>
                           
                           <line x1={centerX-50} y1={centerY+60} x2={centerX+50} y2={centerY+60} stroke="#333" strokeWidth="2" />
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                           <text x="0" y="0" fontSize="300" fill="white" opacity="0.1" fontWeight="900">{data.name.charAt(0)}</text>
                           {renderLogo(centerX, centerY, 150)}
                           <text x={centerX} y={centerY + 100} fill="white" fontSize="30" fontWeight="bold" textAnchor="middle">{data.company}</text>
                       </>
                   )
               )}

               {layout === 'tech' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#111" />
                           <path d={`M0,0 L${cardWidth},0 L${cardWidth},10 L0,10 Z`} fill={themeColor} />
                           <path d={`M0,${cardHeight-10} L${cardWidth},${cardHeight-10} L${cardWidth},${cardHeight} L0,${cardHeight} Z`} fill={themeColor} />
                           
                           <text x="40" y={centerY} fill="white" fontSize="45" fontFamily="monospace" fontWeight="bold" textAnchor="start">{`<${data.name} />`}</text>
                           <text x="40" y={centerY + 40} fill={themeColor} fontSize="20" fontFamily="monospace" textAnchor="start">{`// ${data.job}`}</text>
                           
                           <text x={cardWidth - 40} y={centerY} fill="#888" fontSize="16" fontFamily="monospace" textAnchor="end">{data.email}</text>
                           <text x={cardWidth - 40} y={centerY + 25} fill="#888" fontSize="16" fontFamily="monospace" textAnchor="end">{data.phone}</text>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#000" />
                           <path d={`M0,0 L${cardWidth},${cardHeight}`} stroke={themeColor} strokeWidth="2" opacity="0.3" />
                           <path d={`M${cardWidth},0 L0,${cardHeight}`} stroke={themeColor} strokeWidth="2" opacity="0.3" />
                           
                           <rect x={centerX - 100} y={centerY - 30} width="200" height="60" fill="#111" stroke={themeColor} strokeWidth="2" />
                           <text x={centerX} y={centerY + 10} fill="white" fontSize="24" fontFamily="monospace" textAnchor="middle">{data.website}</text>
                       </>
                   )
               )}

               {layout === 'classic' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#fffbf0" /> {/* Creamy white */}
                           <rect x="20" y="20" width={cardWidth - 40} height={cardHeight - 40} fill="none" stroke="#333" strokeWidth="1" />
                           <rect x="25" y="25" width={cardWidth - 50} height={cardHeight - 50} fill="none" stroke={themeColor} strokeWidth="3" />
                           
                           <text x={centerX} y={centerY - 20} fill="#222" fontSize="48" fontFamily="serif" fontWeight="bold" textAnchor="middle">{data.name}</text>
                           <text x={centerX} y={centerY + 20} fill="#555" fontSize="22" fontFamily="serif" fontStyle="italic" textAnchor="middle">{data.job}</text>
                           
                           <text x={centerX} y={cardHeight - 60} fill="#444" fontSize="16" textAnchor="middle">{data.phone} • {data.email}</text>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="#222" />
                           <rect x="30" y="30" width={cardWidth - 60} height={cardHeight - 60} fill="none" stroke={themeColor} strokeWidth="2" />
                           {renderLogo(centerX, centerY - 40, 120)}
                           <text x={centerX} y={centerY + 60} fill={themeColor} fontSize="28" fontFamily="serif" textAnchor="middle">{data.company}</text>
                           <text x={centerX} y={centerY + 90} fill="#888" fontSize="16" fontFamily="serif" fontStyle="italic" textAnchor="middle">Est. 2024</text>
                       </>
                   )
               )}

               {layout === 'geometric' && (
                   activeSide === 'front' ? (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill="white" />
                           <polygon points={`0,0 ${cardWidth/2},0 0,${cardHeight}`} fill={themeColor} opacity="0.8" />
                           <polygon points={`${cardWidth},${cardHeight} ${cardWidth/2},${cardHeight} ${cardWidth},0`} fill="#222" opacity="0.9" />
                           
                           <text x={cardWidth * 0.25} y={cardHeight * 0.4} fill="white" fontSize="40" fontWeight="bold" textAnchor="middle">{data.name}</text>
                           <text x={cardWidth * 0.75} y={cardHeight * 0.6} fill="white" fontSize="20" textAnchor="middle">{data.job}</text>
                           
                           <rect x={cardWidth/2 - 150} y={centerY - 30} width="300" height="60" fill="white" rx="30" shadow="lg" />
                           <text x={centerX} y={centerY + 10} fill="#333" fontSize="20" fontWeight="bold" textAnchor="middle">{data.phone}</text>
                       </>
                   ) : (
                       <>
                           <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                           <polygon points={`0,${cardHeight} ${cardWidth},0 ${cardWidth},${cardHeight}`} fill="#222" opacity="0.2" />
                           {renderLogo(centerX, centerY, 160)}
                           <text x={centerX} y={cardHeight - 40} fill="white" fontSize="24" fontWeight="bold" textAnchor="middle" letterSpacing="4">{data.website.toUpperCase()}</text>
                       </>
                   )
               )}

               {/* Add uploaded logo if configured manually over layouts (except where explicitly handled) */}
               {logo && activeSide === 'front' && (
                  <image 
                     href={logo} 
                     x={logoSettings.x} 
                     y={logoSettings.y} 
                     width={logoSettings.size} 
                     height={logoSettings.size} 
                     preserveAspectRatio="xMidYMid meet"
                  />
               )}

            </svg>
         </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800 dark:text-white text-sm"
    />
  </div>
);