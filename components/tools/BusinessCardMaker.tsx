import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { IdCardIcon, BackIcon } from '../Icons';

// --- Types ---
interface Position {
  x: number;
  y: number;
}

type LayoutType = 'modern' | 'minimal' | 'bold' | 'elegant' | 'creative' | 'corporate';
type ElementKey = 'name' | 'job' | 'company' | 'contact' | 'logo';
type Alignment = 'start' | 'middle' | 'end';

interface BusinessCardMakerProps {
  onClose?: () => void;
}

// --- Sub-Components ---

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{children}</h3>
);

const Input: React.FC<{ label: string, value: string, onChange: (v: string) => void, placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
    />
  </div>
);

const Slider: React.FC<{ label: string, value: number, max: number, min?: number, step?: number, onChange: (v: number) => void }> = ({ label, value, max, min = 0, step = 1, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
      <span>{label}</span>
      <span className="text-blue-500 font-mono">{value % 1 !== 0 ? value.toFixed(1) : value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value} 
      onChange={e => onChange(parseFloat(e.target.value))} 
      className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
);

// --- Card Content (SVG) ---

const CardContent: React.FC<{ 
  side: 'front' | 'back', 
  layout: LayoutType, 
  data: any, 
  themeColor: string, 
  positions: Record<ElementKey, Position>, 
  alignments: Record<ElementKey, Alignment>,
  logoScale: number,
  logo: string | null, 
  isRtl: boolean, 
  bgColor: string 
}> = ({ side, layout, data, themeColor, positions, alignments, logoScale, logo, isRtl, bgColor }) => {
  const centerX = 1050 / 2;
  const centerY = 600 / 2;
  
  // دالة لتحديد مرساة النص بناءً على اللغة والمحاذاة المختارة
  const getAnchor = (key: ElementKey) => {
    return alignments[key];
  };

  if (side === 'back') {
    return (
      <g style={{ fontFamily: 'Cairo' }}>
        <rect width="1050" height="600" fill={themeColor} />
        <circle cx={centerX} cy={centerY} r="320" fill="white" opacity="0.05" />
        {logo ? (
          <image 
            href={logo} 
            x={centerX - (125 * logoScale)} 
            y={centerY - (125 * logoScale)} 
            width={250 * logoScale} 
            height={250 * logoScale} 
            preserveAspectRatio="xMidYMid meet" 
          />
        ) : (
          <text x={centerX} y={centerY} fill="white" fontSize="140" fontWeight="bold" textAnchor="middle" opacity="0.15">{data.company.charAt(0)}</text>
        )}
        <text x={centerX} y={centerY + 120} fill="white" fontSize="42" fontWeight="bold" textAnchor="middle" direction="rtl">{data.company}</text>
        <text x={centerX} y={550} fill="white" fontSize="20" textAnchor="middle" opacity="0.6" direction="ltr">{data.website}</text>
      </g>
    );
  }

  const ContactLine = ({ y, icon, text, isData }: any) => {
    const anchor = getAnchor('contact');
    // حساب موقع الأيقونة بالنسبة للنص
    const iconX = anchor === 'end' ? 45 : (anchor === 'middle' ? - (text.length * 4) - 30 : -45);

    return (
      <g transform={`translate(0, ${y})`}>
        <text x={iconX} y="0" fontSize="24" fill={themeColor} textAnchor="middle">{icon}</text>
        <text 
          x="0" y="0" 
          textAnchor={anchor} 
          direction={isData ? "ltr" : (isRtl ? "rtl" : "ltr")} 
          unicodeBidi="embed" 
          fontWeight={isData ? "600" : "400"}
        >
          {text}
        </text>
      </g>
    );
  };

  return (
    <g style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* العناصر الزخرفية */}
      {layout === 'modern' && <rect x={isRtl ? 750 : 0} width="300" height="600" fill={themeColor} />}
      {layout === 'bold' && <path d="M0,0 L450,0 L250,600 L0,600 Z" fill={themeColor} opacity="0.08" />}
      {layout === 'corporate' && <rect x={isRtl ? 1015 : 0} width="35" height="600" fill={themeColor} />}

      {/* الشعار */}
      {logo ? (
        <image 
          href={logo} 
          x={positions.logo.x - (100 * logoScale)} 
          y={positions.logo.y - (100 * logoScale)} 
          width={200 * logoScale} 
          height={200 * logoScale} 
          preserveAspectRatio="xMidYMid meet" 
        />
      ) : (
        <text x={positions.logo.x} y={positions.logo.y} fill={themeColor} fontSize="80" fontWeight="bold" textAnchor="middle" opacity="0.2">{data.company.charAt(0)}</text>
      )}

      {/* الاسم */}
      <text x={positions.name.x} y={positions.name.y} fill="#0f172a" fontSize="62" fontWeight="900" textAnchor={getAnchor('name')} direction={isRtl ? "rtl" : "ltr"} unicodeBidi="embed">
        {data.name}
      </text>

      {/* الوظيفة */}
      <text x={positions.job.x} y={positions.job.y} fill={themeColor} fontSize="26" fontWeight="800" textAnchor={getAnchor('job')} direction={isRtl ? "rtl" : "ltr"} unicodeBidi="embed" letterSpacing="1">
        {data.job.toUpperCase()}
      </text>

      {/* الشركة */}
      {layout !== 'modern' && (
        <text x={positions.company.x} y={positions.company.y} fill="#64748b" fontSize="30" fontWeight="bold" textAnchor={getAnchor('company')} direction={isRtl ? "rtl" : "ltr"} unicodeBidi="embed">
          {data.company}
        </text>
      )}

      {/* كتلة الاتصال */}
      <g transform={`translate(${positions.contact.x}, ${positions.contact.y})`} fill="#475569" fontSize="22">
        <ContactLine y={0} icon="📞" text={data.phone} isData={true} />
        <ContactLine y={45} icon="✉️" text={data.email} isData={true} />
        <ContactLine y={90} icon="🌐" text={data.website} isData={true} />
        <ContactLine y={135} icon="📍" text={data.address} isData={false} />
      </g>
    </g>
  );
};

// --- Main Component ---

export const BusinessCardMaker: React.FC<BusinessCardMakerProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const isRtl = language === 'ar';
  
  const frontSvgRef = useRef<SVGSVGElement>(null);
  const backSvgRef = useRef<SVGSVGElement>(null);

  const cardWidth = 1050;
  const cardHeight = 600;

  const [data, setData] = useState({
    name: isRtl ? 'أحمد محمود العوضي' : 'Ahmed Mahmoud',
    job: isRtl ? 'مطور واجهات ومصمم' : 'Frontend Developer & Designer',
    company: isRtl ? 'حلول التقنية المبتكرة' : 'Innovative Tech Solutions',
    phone: '+966 50 000 0000',
    email: 'info@example.com',
    website: 'www.creative-studio.com',
    address: isRtl ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
  });

  const [themeColor, setThemeColor] = useState('#2563eb');
  const [cardBgColor, setCardBgColor] = useState('#ffffff');
  const [layout, setLayout] = useState<LayoutType>('modern');
  const [logo, setLogo] = useState<string | null>(null);
  const [originalLogo, setOriginalLogo] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementKey>('name');

  const [positions, setPositions] = useState<Record<ElementKey, Position>>({
    name: { x: isRtl ? 950 : 100, y: 240 },
    job: { x: isRtl ? 950 : 100, y: 290 },
    company: { x: isRtl ? 950 : 100, y: 100 },
    contact: { x: isRtl ? 950 : 100, y: 380 },
    logo: { x: isRtl ? 850 : 150, y: 150 },
  });

  const [alignments, setAlignments] = useState<Record<ElementKey, Alignment>>({
    name: isRtl ? 'end' : 'start',
    job: isRtl ? 'end' : 'start',
    company: isRtl ? 'end' : 'start',
    contact: isRtl ? 'end' : 'start',
    logo: 'middle'
  });

  const [logoScale, setLogoScale] = useState(1.0);

  // Background Removal
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
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 235 && d[i+1] > 235 && d[i+2] > 235) d[i+3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      setLogo(canvas.toDataURL());
    };
  }, [removeBg, originalLogo]);

  // Layouts
  useEffect(() => {
    const centerX = 525;
    const defaults: Record<LayoutType, Record<ElementKey, Position>> = {
      modern: {
        name: { x: isRtl ? 700 : 360, y: 240 },
        job: { x: isRtl ? 700 : 360, y: 290 },
        company: { x: isRtl ? 950 : 100, y: 100 },
        contact: { x: isRtl ? 700 : 360, y: 380 },
        logo: { x: isRtl ? 870 : 160, y: 300 },
      },
      minimal: { name: { x: centerX, y: 280 }, job: { x: centerX, y: 330 }, company: { x: centerX, y: 100 }, contact: { x: centerX, y: 480 }, logo: { x: centerX, y: 200 } },
      bold: { name: { x: 100, y: 280 }, job: { x: 100, y: 340 }, company: { x: 100, y: 100 }, contact: { x: 100, y: 450 }, logo: { x: 850, y: 300 } },
      elegant: { name: { x: centerX, y: 220 }, job: { x: centerX, y: 270 }, company: { x: centerX, y: 120 }, contact: { x: centerX, y: 430 }, logo: { x: centerX, y: 100 } },
      creative: { name: { x: isRtl ? 900 : 150, y: 150 }, job: { x: isRtl ? 900 : 150, y: 200 }, company: { x: 525, y: 520 }, contact: { x: isRtl ? 150 : 900, y: 300 }, logo: { x: 525, y: 100 } },
      corporate: { name: { x: isRtl ? 900 : 150, y: 300 }, job: { x: isRtl ? 900 : 150, y: 350 }, company: { x: isRtl ? 900 : 150, y: 100 }, contact: { x: isRtl ? 900 : 150, y: 430 }, logo: { x: 150, y: 150 } }
    };
    
    const alignDefaults: Record<LayoutType, Record<ElementKey, Alignment>> = {
      modern: { name: isRtl ? 'end' : 'start', job: isRtl ? 'end' : 'start', company: isRtl ? 'end' : 'start', contact: isRtl ? 'end' : 'start', logo: 'middle' },
      minimal: { name: 'middle', job: 'middle', company: 'middle', contact: 'middle', logo: 'middle' },
      bold: { name: 'start', job: 'start', company: 'start', contact: 'start', logo: 'middle' },
      elegant: { name: 'middle', job: 'middle', company: 'middle', contact: 'middle', logo: 'middle' },
      creative: { name: isRtl ? 'end' : 'start', job: isRtl ? 'end' : 'start', company: 'middle', contact: isRtl ? 'start' : 'end', logo: 'middle' },
      corporate: { name: isRtl ? 'end' : 'start', job: isRtl ? 'end' : 'start', company: isRtl ? 'end' : 'start', contact: isRtl ? 'end' : 'start', logo: 'middle' },
    };

    setPositions(defaults[layout]);
    setAlignments(alignDefaults[layout]);
  }, [layout, isRtl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setOriginalLogo(ev.target?.result as string);
        setLogo(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const downloadPng = (ref: React.RefObject<SVGSVGElement>, name: string) => {
    if (!ref.current) return;
    const svgData = new XMLSerializer().serializeToString(ref.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `card-${name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      
      {/* 1. Preview Section - Top */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start animate-fade-in-up">
          {/* Front Face */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.cardFaceFront}</span>
              <div className="flex gap-1.5 items-center">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{isRtl ? 'لون الهوية:' : 'Accent:'}</span>
                {['#2563eb', '#1e293b', '#dc2626', '#059669', '#d97706', '#D4AF37'].map(c => (
                  <button key={c} onClick={() => setThemeColor(c)} className={`w-4 h-4 rounded-full border border-white shadow-sm transition-transform ${themeColor === c ? 'scale-125 ring-1 ring-blue-400' : 'opacity-60 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-[1050/600] border border-slate-200 ring-1 ring-black/5">
               <svg ref={frontSvgRef} viewBox={`0 0 ${cardWidth} ${cardHeight}`} className="w-full h-full block">
                  <rect width={cardWidth} height={cardHeight} fill={cardBgColor} />
                  <CardContent 
                    side="front" layout={layout} data={data} themeColor={themeColor} 
                    positions={positions} alignments={alignments} logoScale={logoScale}
                    logo={logo} isRtl={isRtl} bgColor={cardBgColor} 
                  />
               </svg>
            </div>
          </div>

          {/* Back Face */}
          <div className="space-y-3">
            <div className="px-2 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.cardFaceBack}</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase">{layout.toUpperCase()}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-[1050/600] border border-slate-200 ring-1 ring-black/5">
               <svg ref={backSvgRef} viewBox={`0 0 ${cardWidth} ${cardHeight}`} className="w-full h-full block">
                  <rect width={cardWidth} height={cardHeight} fill={cardBgColor} />
                  <CardContent 
                    side="back" layout={layout} data={data} themeColor={themeColor} 
                    positions={positions} alignments={alignments} logoScale={logoScale}
                    logo={logo} isRtl={isRtl} bgColor={cardBgColor} 
                  />
               </svg>
            </div>
          </div>
      </div>

      {/* 2. Controls Section - Bottom */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20"><IdCardIcon className="w-6 h-6" /></div>
             <h2 className="text-xl font-black text-slate-800 dark:text-white">{isRtl ? 'تخصيص البطاقة' : 'Card Customization'}</h2>
          </div>
          {onClose && <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"><BackIcon className="w-5 h-5 rtl:rotate-180" /></button>}
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Section 1: Data */}
          <div className="space-y-4">
             <SectionTitle>{isRtl ? '١. المعلومات الأساسية' : '1. Basic Info'}</SectionTitle>
             <Input label={t.cardName} value={data.name} onChange={v => setData({...data, name: v})} />
             <Input label={t.cardJob} value={data.job} onChange={v => setData({...data, job: v})} />
             <Input label={t.cardCompany} value={data.company} onChange={v => setData({...data, company: v})} />
             <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'شعارك الخاص' : 'Your Custom Logo'}</label>
                <input type="file" onChange={handleLogoUpload} className="text-[10px] text-slate-400 block w-full" />
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={removeBg} onChange={e => setRemoveBg(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600">{t.cardRemoveBg || 'تفريغ الشعار من الأبيض'}</span>
                </label>
             </div>
          </div>

          {/* Section 2: Layout & Appearance */}
          <div className="space-y-6">
             <div>
                <SectionTitle>{isRtl ? '٢. النمط والألوان' : '2. Style & Colors'}</SectionTitle>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['modern', 'minimal', 'bold', 'elegant', 'creative', 'corporate'].map(l => (
                    <button key={l} onClick={() => setLayout(l as any)} className={`py-2 text-[9px] font-black rounded-xl border transition-all ${layout === l ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 dark:border-slate-700 hover:border-blue-400'}`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                {/* Background Color Picker */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{isRtl ? 'لون خلفية البطاقة' : 'Card Background'}</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={cardBgColor} onChange={e => setCardBgColor(e.target.value)} className="w-12 h-10 rounded-lg border-none p-0 cursor-pointer shadow-sm" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{cardBgColor}</span>
                        </div>
                    </div>
                    <button onClick={() => setCardBgColor('#ffffff')} className="text-[9px] font-bold text-blue-500 hover:underline">{isRtl ? 'إعادة تعيين' : 'Reset'}</button>
                </div>
             </div>

             {/* Positioning & Alignment */}
             <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                <SectionTitle>{isRtl ? '٣. التحكم في العناصر' : '3. Elements Control'}</SectionTitle>
                <select value={selectedElement} onChange={e => setSelectedElement(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-bold outline-none">
                  <option value="name">{t.cardPosName}</option>
                  <option value="job">{t.cardPosJob}</option>
                  <option value="company">{t.cardPosCompany}</option>
                  <option value="contact">{t.cardPosContact}</option>
                  <option value="logo">{isRtl ? 'الشعار' : 'Logo'}</option>
                </select>

                <div className="space-y-4">
                   <Slider label={t.cardPosX} value={positions[selectedElement].x} max={cardWidth} onChange={v => setPositions({...positions, [selectedElement]: {...positions[selectedElement], x: v}})} />
                   <Slider label={t.cardPosY} value={positions[selectedElement].y} max={cardHeight} onChange={v => setPositions({...positions, [selectedElement]: {...positions[selectedElement], y: v}})} />
                   
                   {selectedElement !== 'logo' ? (
                     <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-4">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2">{isRtl ? 'محاذاة النص' : 'Alignment'}</label>
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                            <button onClick={() => setAlignments({...alignments, [selectedElement]: isRtl ? 'end' : 'start'})} className={`flex-1 py-1.5 rounded-md text-[10px] font-black transition-all ${alignments[selectedElement] === (isRtl ? 'end' : 'start') ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-blue-500'}`}>{isRtl ? 'يمين' : 'Left'}</button>
                            <button onClick={() => setAlignments({...alignments, [selectedElement]: 'middle'})} className={`flex-1 py-1.5 rounded-md text-[10px] font-black transition-all ${alignments[selectedElement] === 'middle' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-blue-500'}`}>{isRtl ? 'وسط' : 'Center'}</button>
                            <button onClick={() => setAlignments({...alignments, [selectedElement]: isRtl ? 'start' : 'end'})} className={`flex-1 py-1.5 rounded-md text-[10px] font-black transition-all ${alignments[selectedElement] === (isRtl ? 'start' : 'end') ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-blue-500'}`}>{isRtl ? 'يسار' : 'Right'}</button>
                        </div>
                     </div>
                   ) : (
                     <Slider label={isRtl ? "تكبير الشعار" : "Logo Scale"} value={logoScale} min={0.2} max={4.0} step={0.1} onChange={v => setLogoScale(v)} />
                   )}
                </div>
             </div>
          </div>

          {/* Section 3: Contact & Export */}
          <div className="space-y-4">
             <SectionTitle>{isRtl ? '٤. التواصل والتصدير' : '4. Contact & Export'}</SectionTitle>
             <Input label={t.cardPhone} value={data.phone} onChange={v => setData({...data, phone: v})} />
             <Input label={t.cardEmail} value={data.email} onChange={v => setData({...data, email: v})} />
             <Input label={t.cardAddress} value={data.address} onChange={v => setData({...data, address: v})} />
             <div className="grid grid-cols-2 gap-3 pt-6">
                <button onClick={() => downloadPng(frontSvgRef, 'front')} className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center gap-1">
                    <span>{isRtl ? 'تحميل الوجه الأمامي' : 'Export Front'}</span>
                    <span className="text-[8px] opacity-70">PNG - High Quality</span>
                </button>
                <button onClick={() => downloadPng(backSvgRef, 'back')} className="bg-slate-800 text-white py-4 rounded-2xl font-black text-xs shadow-lg hover:shadow-slate-500/20 hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center gap-1">
                    <span>{isRtl ? 'تحميل الوجه الخلفي' : 'Export Back'}</span>
                    <span className="text-[8px] opacity-70">PNG - High Quality</span>
                </button>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};
