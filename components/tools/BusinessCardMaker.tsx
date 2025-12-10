import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { IdCardIcon, BackIcon, ImageIcon } from '../Icons';
import { PDFDocument } from 'pdf-lib';

interface BusinessCardMakerProps {
  onClose?: () => void;
}

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
  const [layout, setLayout] = useState<'modern' | 'minimal' | 'bold' | 'elegant' | 'creative'>('modern');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

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
          // Reset position slightly for visibility
          setLogoSettings(prev => ({ ...prev, x: 50, y: 50 }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Helper to process image and remove white background
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

      // Loop through pixels and make white transparent
      // Threshold: 230 (out of 255) to catch off-whites and compression artifacts
      const threshold = 230;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0; // Set Alpha to 0
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
        link.download = `business-card-${layout}-${orientation}-${Date.now()}.png`;
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
            link.download = `business-card-${layout}-${orientation}-${Date.now()}.pdf`;
            link.click();
        } catch (e) {
            console.error("PDF generation failed", e);
            alert("Failed to generate PDF. Please try again.");
        }
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // --- Layout Helpers ---
  const isRtl = language === 'ar';
  
  // In SVG with direction="rtl", 'start' aligns to the right edge (start of the Arabic line).
  const textAnchorStart = 'start'; 
  const textAnchorEnd = 'end';

  // Dynamic Margins & Coordinates
  const margin = 50;
  // Standard layout X positions (for layouts without sidebar)
  const xStart = isRtl ? cardWidth - margin : margin; 
  const centerX = cardWidth / 2;
  const centerY = cardHeight / 2;

  // Modern Layout Specifics
  const sidebarWidth = 300;
  // For Landscape Modern:
  // RTL: Sidebar is at [750, 1050]. Content is at [0, 750]. Text aligns to 700.
  // LTR: Sidebar is at [0, 300]. Content is at [300, 1050]. Text aligns to 350.
  const modernContentX = isLandscape 
    ? (isRtl ? cardWidth - sidebarWidth - margin : sidebarWidth + margin)
    : centerX;

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
             
             {/* Orientation Selector */}
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">أبعاد البطاقة (Orientation)</label>
                <div className="grid grid-cols-2 gap-2">
                   <button
                      onClick={() => setOrientation('landscape')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${orientation === 'landscape' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                   >
                      <span className="w-6 h-4 border-2 border-current rounded-sm"></span>
                      عرضي
                   </button>
                   <button
                      onClick={() => setOrientation('portrait')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${orientation === 'portrait' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                   >
                      <span className="w-4 h-6 border-2 border-current rounded-sm"></span>
                      طولي
                   </button>
                </div>
             </div>

             {/* Layout Selector */}
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.cardLayout}</label>
                <div className="grid grid-cols-2 gap-2">
                   {['modern', 'minimal', 'bold', 'elegant', 'creative'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayout(l as any)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${layout === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
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
                   {['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#000000', '#D4AF37'].map(c => (
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

             {/* Logo Upload Section */}
             <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex justify-between">
                   <span>{language === 'ar' ? 'الشعار' : 'Logo'}</span>
                   {logo && <button onClick={() => { setLogo(null); setOriginalLogo(null); }} className="text-red-500 hover:underline">✕</button>}
                </label>
                
                {!logo ? (
                   <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-[10px] text-slate-500">{language === 'ar' ? 'اضغط لرفع صورة' : 'Click to upload'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                   </label>
                ) : (
                   <div className="space-y-3">
                      <div>
                         <label className="text-[10px] text-slate-400 block mb-1">Position X ({logoSettings.x})</label>
                         <input type="range" min="0" max={cardWidth} value={logoSettings.x} onChange={e => setLogoSettings({...logoSettings, x: Number(e.target.value)})} className="w-full accent-blue-600 h-1" />
                      </div>
                      <div>
                         <label className="text-[10px] text-slate-400 block mb-1">Position Y ({logoSettings.y})</label>
                         <input type="range" min="0" max={cardHeight} value={logoSettings.y} onChange={e => setLogoSettings({...logoSettings, y: Number(e.target.value)})} className="w-full accent-blue-600 h-1" />
                      </div>
                      <div>
                         <label className="text-[10px] text-slate-400 block mb-1">Size ({logoSettings.size}px)</label>
                         <input type="range" min="20" max="300" value={logoSettings.size} onChange={e => setLogoSettings({...logoSettings, size: Number(e.target.value)})} className="w-full accent-blue-600 h-1" />
                      </div>
                      
                      <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                         <input 
                           type="checkbox" 
                           checked={removeBg} 
                           onChange={e => setRemoveBg(e.target.checked)} 
                           className="w-4 h-4 text-blue-600 rounded"
                         />
                         <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">{t.cardRemoveBg}</span>
                      </label>
                   </div>
                )}
             </div>

             {/* Text Positioning Section */}
             <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">{t.cardPosTitle}</label>
                
                <div className="space-y-3">
                   <label className="block text-[10px] font-medium text-slate-400 mb-1">{t.cardPosLabel}</label>
                   <select 
                      value={selectedTextElement}
                      onChange={(e) => setSelectedTextElement(e.target.value as any)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm"
                   >
                      <option value="name">{t.cardPosName}</option>
                      <option value="job">{t.cardPosJob}</option>
                      <option value="company">{t.cardPosCompany}</option>
                      <option value="contact">{t.cardPosContact}</option>
                   </select>

                   <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{t.cardPosX} ({textOffsets[selectedTextElement].x})</label>
                      <input 
                        type="range" 
                        min="-300" 
                        max="300" 
                        value={textOffsets[selectedTextElement].x} 
                        onChange={e => setTextOffsets(prev => ({
                           ...prev,
                           [selectedTextElement]: { ...prev[selectedTextElement], x: Number(e.target.value) }
                        }))} 
                        className="w-full accent-blue-600 h-1" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{t.cardPosY} ({textOffsets[selectedTextElement].y})</label>
                      <input 
                        type="range" 
                        min="-300" 
                        max="300" 
                        value={textOffsets[selectedTextElement].y} 
                        onChange={e => setTextOffsets(prev => ({
                           ...prev,
                           [selectedTextElement]: { ...prev[selectedTextElement], y: Number(e.target.value) }
                        }))} 
                        className="w-full accent-blue-600 h-1" 
                      />
                   </div>
                </div>
             </div>

             {/* Inputs */}
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
                <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                >
                    <span>🖼️</span> {t.cardDownload}
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                >
                    <span>📄</span> {t.cardDownloadPdf}
                </button>
             </div>
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-200 dark:bg-[#0B1120] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
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
               {/* Background */}
               <rect width={cardWidth} height={cardHeight} fill="white" />

               {/* --- LAYOUT: MODERN --- */}
               {layout === 'modern' && (
                  <>
                     {isLandscape ? (
                         // Landscape Modern
                         <>
                            <rect x={isRtl ? cardWidth - sidebarWidth : 0} y="0" width={sidebarWidth} height={cardHeight} fill={themeColor} />
                            
                            <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                               <text 
                                   x={isRtl ? cardWidth - (sidebarWidth / 2) : (sidebarWidth / 2)} 
                                   y={cardHeight / 2} 
                                   fill="white" 
                                   fontSize="40" 
                                   fontWeight="800" 
                                   textAnchor="middle"
                                   transform={`rotate(-90, ${isRtl ? cardWidth - (sidebarWidth / 2) : (sidebarWidth / 2)}, ${cardHeight / 2})`}
                                   letterSpacing="2"
                               >
                                   {data.company.toUpperCase()}
                               </text>
                            </g>
                            
                            <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                               <text x={modernContentX} y="150" fill="#333" fontSize="50" fontWeight="800" textAnchor={textAnchorStart}>{data.name}</text>
                            </g>
                            <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                               <text x={modernContentX} y="190" fill={themeColor} fontSize="28" fontWeight="700" textAnchor={textAnchorStart}>{data.job.toUpperCase()}</text>
                               <line x1={modernContentX} y1="220" x2={isRtl ? modernContentX - 100 : modernContentX + 100} y2="220" stroke="#ddd" strokeWidth="4" />
                            </g>

                            <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                               <g transform="translate(0, 320)" fontSize="22" fill="#555">
                                   <text x={modernContentX} y="0" textAnchor={textAnchorStart}>📞 {data.phone}</text>
                                   <text x={modernContentX} y="50" textAnchor={textAnchorStart}>✉️ {data.email}</text>
                                   <text x={modernContentX} y="100" textAnchor={textAnchorStart}>🌐 {data.website}</text>
                                   <text x={modernContentX} y="150" textAnchor={textAnchorStart}>📍 {data.address}</text>
                               </g>
                            </g>
                         </>
                     ) : (
                         // Portrait Modern
                         <>
                            <rect x="0" y="0" width={cardWidth} height="300" fill={themeColor} />
                            <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                               <text x={centerX} y="150" fill="white" fontSize="40" fontWeight="800" textAnchor="middle" letterSpacing="2">
                                   {data.company.toUpperCase()}
                               </text>
                            </g>
                            
                            <g transform={`translate(0, 350)`}>
                                <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                                   <text x={centerX} y="0" fill="#333" fontSize="50" fontWeight="800" textAnchor="middle">{data.name}</text>
                                </g>
                                <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                                   <text x={centerX} y="50" fill={themeColor} fontSize="28" fontWeight="700" textAnchor="middle">{data.job.toUpperCase()}</text>
                                   <line x1={centerX - 50} y1="80" x2={centerX + 50} y2="80" stroke="#ddd" strokeWidth="4" />
                                </g>

                                <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                                   <g transform={`translate(0, 180)`} fontSize="22" fill="#555">
                                       <text x={centerX} y="0" textAnchor="middle">📞 {data.phone}</text>
                                       <text x={centerX} y="50" textAnchor="middle">✉️ {data.email}</text>
                                       <text x={centerX} y="100" textAnchor="middle">🌐 {data.website}</text>
                                       <text x={centerX} y="150" textAnchor="middle">📍 {data.address}</text>
                                   </g>
                                </g>
                            </g>
                         </>
                     )}
                  </>
               )}

               {/* --- LAYOUT: MINIMAL --- */}
               {layout === 'minimal' && (
                  <>
                     <rect x="30" y="30" width={cardWidth - 60} height={cardHeight - 60} fill="none" stroke={themeColor} strokeWidth="10" />
                     
                     <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                        <text x={centerX} y={centerY - 50} fill="#222" fontSize="60" fontWeight="800" textAnchor="middle">{data.name}</text>
                     </g>
                     <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                        <text x={centerX} y={centerY} fill={themeColor} fontSize="30" fontWeight="700" textAnchor="middle" letterSpacing="3">{data.job.toUpperCase()}</text>
                        <line x1={centerX - 100} y1={centerY + 30} x2={centerX + 100} y2={centerY + 30} stroke="#eee" strokeWidth="2" />
                     </g>

                     <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                        <g transform={`translate(${centerX}, ${cardHeight - 150})`} fontSize="20" fill="#666" textAnchor="middle">
                           <text y="0">{data.phone}  •  {data.email}</text>
                           <text y="40">{data.website}</text>
                           <text y="80">{data.address}</text>
                        </g>
                     </g>

                     <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                        <text x={centerX} y="80" fill="#999" fontSize="18" textAnchor="middle" letterSpacing="1">{data.company}</text>
                     </g>
                  </>
               )}

               {/* --- LAYOUT: BOLD --- */}
               {layout === 'bold' && (
                  <>
                     <rect width={cardWidth} height={cardHeight} fill={themeColor} />
                     
                     {/* Circle Position */}
                     {isLandscape ? (
                         <>
                            <circle cx={isRtl ? cardWidth - 150 : 150} cy="150" r="80" fill="rgba(255,255,255,0.2)" />
                            <text x={isRtl ? cardWidth - 150 : 150} y="175" fill="white" fontSize="80" fontWeight="bold" textAnchor="middle">{data.name.charAt(0)}</text>
                            
                            <g transform={`translate(${isRtl ? -100 : 100}, 0)`}>
                                <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                                   <text x={xStart} y="300" fill="white" fontSize="65" fontWeight="800" textAnchor={textAnchorStart}>{data.name}</text>
                                </g>
                                <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                                   <text x={xStart} y="350" fill="rgba(255,255,255,0.8)" fontSize="32" fontWeight="700" textAnchor={textAnchorStart}>{data.job.toUpperCase()}</text>
                                </g>
                                
                                <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                                   <g transform="translate(0, 430)" fontSize="24" fill="white">
                                       <text x={xStart} y="0" textAnchor={textAnchorStart}>{data.phone} | {data.email}</text>
                                       <text x={xStart} y="40" textAnchor={textAnchorStart}>{data.website}</text>
                                       <text x={xStart} y="80" textAnchor={textAnchorStart}>{data.address}</text>
                                   </g>
                                </g>
                            </g>

                            <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                               <text 
                                   x={isRtl ? 50 : cardWidth - 50} 
                                   y={cardHeight - 50} 
                                   fill="rgba(255,255,255,0.5)" 
                                   fontSize="20" 
                                   fontWeight="bold" 
                                   textAnchor="end"
                                   transform={`rotate(-90, ${isRtl ? 50 : cardWidth - 50}, ${cardHeight - 50})`}
                               >
                                   {data.company.toUpperCase()}
                               </text>
                            </g>
                         </>
                     ) : (
                         // Portrait Bold
                         <>
                            <circle cx={centerX} cy="200" r="100" fill="rgba(255,255,255,0.2)" />
                            <text x={centerX} y="235" fill="white" fontSize="100" fontWeight="bold" textAnchor="middle">{data.name.charAt(0)}</text>
                            
                            <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                               <text x={centerX} y="450" fill="white" fontSize="65" fontWeight="800" textAnchor="middle">{data.name}</text>
                            </g>
                            <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                               <text x={centerX} y="510" fill="rgba(255,255,255,0.8)" fontSize="32" fontWeight="700" textAnchor="middle">{data.job.toUpperCase()}</text>
                            </g>
                            
                            <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                               <g transform={`translate(${centerX}, 700)`} fontSize="24" fill="white" textAnchor="middle">
                                   <text y="0">{data.phone}</text>
                                   <text y="40">{data.email}</text>
                                   <text y="80">{data.website}</text>
                                   <text y="120">{data.address}</text>
                               </g>
                            </g>

                            <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                               <text x={centerX} y={cardHeight - 50} fill="rgba(255,255,255,0.5)" fontSize="20" fontWeight="bold" textAnchor="middle">
                                   {data.company.toUpperCase()}
                               </text>
                            </g>
                         </>
                     )}
                  </>
               )}

               {/* --- LAYOUT: ELEGANT --- */}
               {layout === 'elegant' && (
                  <>
                     <rect width={cardWidth} height={cardHeight} fill="white" />
                     {/* Double Border Frame */}
                     <rect x="40" y="40" width={cardWidth - 80} height={cardHeight - 80} fill="none" stroke={themeColor} strokeWidth="2" />
                     <rect x="50" y="50" width={cardWidth - 100} height={cardHeight - 100} fill="none" stroke="#e5e7eb" strokeWidth="1" />

                     {/* Centered Content */}
                     <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                        <text x={centerX} y={centerY - 80} fill="#1f2937" fontSize="70" fontWeight="800" textAnchor="middle" letterSpacing="1">{data.name}</text>
                     </g>
                     <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                        <text x={centerX} y={centerY - 20} fill={themeColor} fontSize="30" fontWeight="600" textAnchor="middle" letterSpacing="3">{data.job.toUpperCase()}</text>
                        <line x1={centerX - 150} y1={centerY + 20} x2={centerX + 150} y2={centerY + 20} stroke={themeColor} strokeWidth="1" />
                     </g>

                     <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                        <g transform={`translate(${centerX}, ${centerY + 80})`} fontSize="22" fill="#4b5563" textAnchor="middle">
                           <text y="0">{data.phone}  •  {data.email}</text>
                           <text y="40">{data.website}</text>
                           <text y="80">{data.address}</text>
                        </g>
                     </g>

                     {/* Top Company Label */}
                     <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                        <text x={centerX} y="100" fill={themeColor} fontSize="24" fontWeight="bold" textAnchor="middle" letterSpacing="2">{data.company.toUpperCase()}</text>
                     </g>
                  </>
               )}

               {/* --- LAYOUT: CREATIVE (Fix: Separation of content and shape) --- */}
               {layout === 'creative' && (
                  <>
                     <rect width={cardWidth} height={cardHeight} fill="white" />
                     
                     {/* Dynamic Angled Shape - Corrected Logic for RTL vs LTR */}
                     {isLandscape ? (
                        <>
                           {/* 
                              RTL: Shape on LEFT side. Content on RIGHT.
                              LTR: Shape on RIGHT side. Content on LEFT.
                           */}
                           <path 
                              d={isRtl 
                                 ? `M0,0 L${cardWidth * 0.35},0 L${cardWidth * 0.25},${cardHeight} L0,${cardHeight} Z` // Shape on Left
                                 : `M${cardWidth},0 L${cardWidth * 0.65},0 L${cardWidth * 0.75},${cardHeight} L${cardWidth},${cardHeight} Z` // Shape on Right
                              } 
                              fill={themeColor} 
                           />
                           
                           {/* Big initial inside the colored area */}
                           <text 
                              x={isRtl ? cardWidth * 0.12 : cardWidth * 0.88} 
                              y={centerY + 40} 
                              fill="rgba(255,255,255,0.2)" 
                              fontSize="180" 
                              fontWeight="900" 
                              textAnchor="middle"
                           >
                              {data.name.charAt(0)}
                           </text>

                           {/* Content - Positioned clearly in the whitespace */}
                           {/* RTL: Content aligns to Start (Right) at xStart */}
                           {/* LTR: Content aligns to Start (Left) at xStart */}
                           <g transform={`translate(0, 0)`}>
                              <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                                 <text x={isRtl ? cardWidth - 50 : 50} y={centerY - 60} fill="#111" fontSize="60" fontWeight="900" textAnchor={textAnchorStart}>{data.name}</text>
                              </g>
                              <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                                 <text x={isRtl ? cardWidth - 50 : 50} y={centerY} fill={themeColor} fontSize="32" fontWeight="700" textAnchor={textAnchorStart} letterSpacing="1">{data.job.toUpperCase()}</text>
                              </g>
                              
                              <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                                 <g transform={`translate(0, ${centerY + 80})`} fontSize="22" fill="#555">
                                    <text x={isRtl ? cardWidth - 50 : 50} y="0" textAnchor={textAnchorStart}>{data.phone} • {data.email}</text>
                                    <text x={isRtl ? cardWidth - 50 : 50} y="40" textAnchor={textAnchorStart}>{data.website}</text>
                                 </g>
                              </g>
                           </g>
                           
                           {/* Company Name in corner opposite to shape */}
                           <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                              <text 
                                 x={isRtl ? cardWidth - 50 : 50} 
                                 y={50} 
                                 fill="#999" 
                                 fontSize="20" 
                                 fontWeight="bold" 
                                 textAnchor={textAnchorStart}
                              >
                                 {data.company.toUpperCase()}
                              </text>
                           </g>
                        </>
                     ) : (
                        // Portrait Creative
                        <>
                           <path d={`M0,0 L${cardWidth},0 L${cardWidth},${cardHeight * 0.4} L0,${cardHeight * 0.3} Z`} fill={themeColor} />
                           
                           <text x={centerX} y={cardHeight * 0.2} fill="rgba(255,255,255,0.3)" fontSize="120" fontWeight="900" textAnchor="middle">{data.name.charAt(0)}</text>
                           
                           <g transform={`translate(${textOffsets.name.x}, ${textOffsets.name.y})`}>
                              <text x={centerX} y={cardHeight * 0.5} fill="#111" fontSize="55" fontWeight="900" textAnchor="middle">{data.name}</text>
                           </g>
                           <g transform={`translate(${textOffsets.job.x}, ${textOffsets.job.y})`}>
                              <text x={centerX} y={cardHeight * 0.56} fill={themeColor} fontSize="28" fontWeight="700" textAnchor="middle">{data.job.toUpperCase()}</text>
                              <line x1="100" y1={cardHeight * 0.62} x2={cardWidth - 100} y2={cardHeight * 0.62} stroke="#eee" strokeWidth="4" />
                           </g>

                           <g transform={`translate(${textOffsets.contact.x}, ${textOffsets.contact.y})`}>
                              <g transform={`translate(${centerX}, ${cardHeight * 0.7})`} fontSize="24" fill="#555" textAnchor="middle">
                                 <text y="0">{data.phone}</text>
                                 <text y="40">{data.email}</text>
                                 <text y="80">{data.website}</text>
                                 <text y="120">{data.address}</text>
                              </g>
                           </g>
                           
                           <g transform={`translate(${textOffsets.company.x}, ${textOffsets.company.y})`}>
                              <text x={centerX} y={cardHeight - 40} fill="#ccc" fontSize="20" fontWeight="bold" textAnchor="middle" letterSpacing="2">{data.company}</text>
                           </g>
                        </>
                     )}
                  </>
               )}

               {/* --- LOGO LAYER (Always on Top) --- */}
               {logo && (
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