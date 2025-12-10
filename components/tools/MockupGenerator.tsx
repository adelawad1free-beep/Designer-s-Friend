import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { MockupIcon, BackIcon, ImageIcon } from '../Icons';

interface MockupGeneratorProps {
  onClose?: () => void;
}

type DeviceType = 'phone' | 'laptop' | 'browser';
type FitMode = 'cover' | 'contain';
type BgType = 'transparent' | 'color' | 'gradient';

// UI Components for Controls
const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider flex items-center gap-2">
        {children}
    </h3>
);

export const MockupGenerator: React.FC<MockupGeneratorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  
  // State
  const [device, setDevice] = useState<DeviceType>('phone');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [deviceColor, setDeviceColor] = useState('#2a2a2a');
  const [objectFit, setObjectFit] = useState<FitMode>('cover');
  
  // Background State
  const [bgType, setBgType] = useState<BgType>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradientPreset, setGradientPreset] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gradient Presets
  const gradients = [
    ['#ff9a9e', '#fecfef'],
    ['#a18cd1', '#fbc2eb'],
    ['#84fab0', '#8fd3f4'],
    ['#e0c3fc', '#8ec5fc'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageSrc(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    // Small delay to ensure state updates
    const timer = setTimeout(() => drawCanvas(), 50);
    return () => clearTimeout(timer);
  }, [device, imageSrc, deviceColor, objectFit, bgType, bgColor, gradientPreset]);

  // --- DRAWING HELPERS ---

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      
      if (bgType === 'color') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, w, h);
      } else if (bgType === 'gradient') {
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, gradients[gradientPreset][0]);
          grad.addColorStop(1, gradients[gradientPreset][1]);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
      }
  };

  const drawUserImage = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      if (!imageSrc) {
          // Professional Placeholder
          const grad = ctx.createLinearGradient(x, y, x + w, y + h);
          grad.addColorStop(0, '#f1f5f9');
          grad.addColorStop(1, '#e2e8f0');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, w, h);
          
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.mockUpload, x + w/2, y + h/2);
          
          // Icon
          ctx.font = '40px sans-serif';
          ctx.fillText("🖼️", x + w/2, y + h/2 - 50);
          return;
      }

      const img = new Image();
      img.src = imageSrc;
      // Assume preloaded for simplicity in this context, normally needs onload callback structure
      // But since we use DataURL from state, it's usually fast enough for re-renders.
      
      const imgRatio = img.width / img.height;
      const targetRatio = w / h;
      let renderW, renderH, renderX, renderY;

      if (objectFit === 'cover') {
          if (imgRatio > targetRatio) {
              renderH = h;
              renderW = h * imgRatio;
              renderX = x + (w - renderW) / 2;
              renderY = y;
          } else {
              renderW = w;
              renderH = w / imgRatio;
              renderX = x;
              renderY = y + (h - renderH) / 2;
          }
      } else {
          // Contain
          if (imgRatio > targetRatio) {
              renderW = w;
              renderH = w / imgRatio;
              renderX = x;
              renderY = y + (h - renderH) / 2;
          } else {
              renderH = h;
              renderW = h * imgRatio;
              renderX = x + (w - renderW) / 2;
              renderY = y;
          }
          // Fill background for contain
          ctx.fillStyle = '#000'; 
          ctx.fillRect(x, y, w, h);
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.drawImage(img, renderX, renderY, renderW, renderH);
      
      // Screen Glare Overlay (Subtle)
      const glare = ctx.createLinearGradient(x, y, x+w, y+h);
      glare.addColorStop(0, 'rgba(255,255,255,0.1)');
      glare.addColorStop(0.5, 'rgba(255,255,255,0)');
      glare.addColorStop(1, 'rgba(255,255,255,0.05)');
      ctx.fillStyle = glare;
      ctx.fillRect(x, y, w, h);
      
      ctx.restore();
  };

  // --- DEVICE RENDERERS ---

  const drawPhone = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // High Res iPhone Style Mockup
      const phoneW = 400;
      const phoneH = 820;
      const cx = w / 2;
      const cy = h / 2;
      const x = cx - phoneW / 2;
      const y = cy - phoneH / 2;
      const r = 55; // Corner radius

      // 1. Shadow (Soft & Realistic)
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 30;
      ctx.fillStyle = deviceColor; // Chassis color
      drawRoundedRect(ctx, x, y, phoneW, phoneH, r);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // 2. Buttons (Volume/Power) - Drawn behind/side
      ctx.fillStyle = deviceColor; // Slightly darker/lighter could be better but same works
      // Left buttons
      ctx.fillRect(x - 3, y + 150, 4, 35); 
      ctx.fillRect(x - 3, y + 200, 4, 60); 
      // Right button
      ctx.fillRect(x + phoneW - 1, y + 180, 4, 90);

      // 3. Main Chassis Frame (Gradient for metallic look)
      const frameGrad = ctx.createLinearGradient(x, y, x + phoneW, y + phoneH);
      frameGrad.addColorStop(0, '#666'); // Highlight top-left
      frameGrad.addColorStop(0.2, deviceColor);
      frameGrad.addColorStop(0.8, deviceColor);
      frameGrad.addColorStop(1, '#222'); // Shadow bottom-right
      ctx.fillStyle = frameGrad;
      drawRoundedRect(ctx, x, y, phoneW, phoneH, r);
      ctx.fill();

      // 4. Black Bezel
      const bezelW = 15;
      ctx.fillStyle = "#000000";
      drawRoundedRect(ctx, x + 3, y + 3, phoneW - 6, phoneH - 6, r - 2);
      ctx.fill();

      // 5. Screen Content
      const screenX = x + bezelW;
      const screenY = y + bezelW;
      const screenW = phoneW - bezelW * 2;
      const screenH = phoneH - bezelW * 2;
      const screenR = r - 12;

      ctx.save();
      drawRoundedRect(ctx, screenX, screenY, screenW, screenH, screenR);
      ctx.clip();
      drawUserImage(ctx, screenX, screenY, screenW, screenH);
      ctx.restore();

      // 6. Dynamic Island / Notch
      const islandW = 110;
      const islandH = 32;
      const islandX = cx - islandW / 2;
      const islandY = screenY + 12;
      
      ctx.fillStyle = "#000";
      drawRoundedRect(ctx, islandX, islandY, islandW, islandH, 16);
      ctx.fill();
      
      // Lens reflection in island
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath(); ctx.arc(islandX + islandW - 12, islandY + islandH/2, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#0f0f0f"; // darker
      ctx.beginPath(); ctx.arc(islandX + islandW - 12, islandY + islandH/2, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath(); ctx.arc(islandX + islandW - 12 - 2, islandY + islandH/2 - 2, 1.5, 0, Math.PI*2); ctx.fill();

      // 7. Speaker Grill (Thin line above island)
      ctx.fillStyle = "#111";
      drawRoundedRect(ctx, cx - 40, y + 8, 80, 4, 2);
      ctx.fill();
  };

  const drawLaptop = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Modern MacBook Style
      const laptopW = 800;
      const screenRatio = 16/10; 
      const laptopH = 500; // Lid height approx
      const cx = w / 2;
      const startY = (h - laptopH) / 2 - 20;
      const r = 24;

      // 1. Lid Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;

      // 2. Lid Chassis (Back)
      ctx.fillStyle = deviceColor; // Usually silver/gray
      drawRoundedRect(ctx, cx - laptopW/2, startY, laptopW, laptopH, r);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // 3. Black Bezel
      const bezel = 16;
      ctx.fillStyle = "#000";
      drawRoundedRect(ctx, cx - laptopW/2 + 2, startY + 2, laptopW - 4, laptopH - 4, r - 2);
      ctx.fill();

      // 4. Screen Area
      const screenX = cx - laptopW/2 + bezel;
      const screenY = startY + bezel;
      const screenW = laptopW - bezel * 2;
      const screenH = laptopH - bezel * 2; // Bottom bezel is slightly thicker usually, but equal is cleaner
      
      ctx.save();
      // Simple rect clip
      ctx.beginPath();
      ctx.rect(screenX, screenY, screenW, screenH); 
      ctx.clip();
      drawUserImage(ctx, screenX, screenY, screenW, screenH);
      ctx.restore();

      // 5. Camera Notch (New Macs)
      const notchW = 120;
      const notchH = 24;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(cx - notchW/2, screenY);
      ctx.lineTo(cx - notchW/2 + 8, screenY + notchH);
      ctx.lineTo(cx + notchW/2 - 8, screenY + notchH);
      ctx.lineTo(cx + notchW/2, screenY);
      ctx.fill();

      // 6. Bottom Case (Keyboard Deck visible part)
      const baseH = 25;
      const baseY = startY + laptopH;
      const baseX = cx - laptopW/2;
      
      // Hinge Shadow
      const hingeGrad = ctx.createLinearGradient(baseX, baseY, baseX, baseY + 10);
      hingeGrad.addColorStop(0, '#000');
      hingeGrad.addColorStop(1, deviceColor);
      ctx.fillStyle = hingeGrad;
      ctx.fillRect(baseX + 20, baseY - 2, laptopW - 40, 10);

      // Main Base Slab
      ctx.fillStyle = deviceColor;
      // Trapezoid effect for perspective
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + laptopW, baseY);
      ctx.lineTo(baseX + laptopW, baseY + baseH - 5);
      ctx.quadraticCurveTo(baseX + laptopW, baseY + baseH, baseX + laptopW - 10, baseY + baseH);
      ctx.lineTo(baseX + 10, baseY + baseH);
      ctx.quadraticCurveTo(baseX, baseY + baseH, baseX, baseY + baseH - 5);
      ctx.closePath();
      ctx.fill();

      // Keyboard Indent/Opener
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath();
      ctx.arc(cx, baseY, 25, 0, Math.PI, false);
      ctx.fill();
      
      // Rubber Feet (Tiny detail)
      ctx.fillStyle = "#111";
      ctx.fillRect(baseX + 20, baseY + baseH - 3, 30, 3);
      ctx.fillRect(baseX + laptopW - 50, baseY + baseH - 3, 30, 3);
  };

  const drawBrowser = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Clean Minimalist Browser
      const winW = 900;
      const winH = 650;
      const cx = w/2;
      const cy = h/2;
      const x = cx - winW/2;
      const y = cy - winH/2;
      const r = 12;
      const headerH = 60;

      // 1. Window Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 80;
      ctx.shadowOffsetY = 40;

      // 2. Main Body
      ctx.fillStyle = "#fff";
      drawRoundedRect(ctx, x, y, winW, winH, r);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // 3. Header Background
      const headerGrad = ctx.createLinearGradient(x, y, x, y + headerH);
      headerGrad.addColorStop(0, '#f3f4f6');
      headerGrad.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = headerGrad;
      
      // Clip header to top rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y + headerH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + winW - r, y);
      ctx.quadraticCurveTo(x + winW, y, x + winW, y + r);
      ctx.lineTo(x + winW, y + headerH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Traffic Lights
      const dotY = y + headerH / 2;
      const startDot = x + 30;
      const gap = 22;
      
      // Red
      ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(startDot, dotY, 6, 0, Math.PI*2); ctx.fill();
      // Yellow
      ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(startDot + gap, dotY, 6, 0, Math.PI*2); ctx.fill();
      // Green
      ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(startDot + gap*2, dotY, 6, 0, Math.PI*2); ctx.fill();

      // 5. Address Bar
      const barH = 34;
      const barW = winW * 0.6;
      const barX = cx - barW/2;
      const barY = y + (headerH - barH)/2;
      
      ctx.fillStyle = "#fff";
      // Shadow for input
      ctx.shadowColor = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      drawRoundedRect(ctx, barX, barY, barW, barH, 8);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // URL Text placeholder
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("example.com", cx, barY + barH/2);
      // Lock icon
      ctx.fillText("🔒", cx - 50, barY + barH/2);

      // 6. Content
      const contentY = y + headerH;
      const contentH = winH - headerH;
      
      ctx.save();
      // Clip bottom corners
      ctx.beginPath();
      ctx.moveTo(x, contentY);
      ctx.lineTo(x + winW, contentY);
      ctx.lineTo(x + winW, y + winH - r);
      ctx.quadraticCurveTo(x + winW, y + winH, x + winW - r, y + winH);
      ctx.lineTo(x + r, y + winH);
      ctx.quadraticCurveTo(x, y + winH, x, y + winH - r);
      ctx.closePath();
      ctx.clip();
      
      drawUserImage(ctx, x, contentY, winW, contentH);
      ctx.restore();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High Res Output
    let w = 1200;
    let h = 900;
    
    if (device === 'phone') { w = 1000; h = 1000; }
    else if (device === 'laptop') { w = 1200; h = 800; }
    else if (device === 'browser') { w = 1200; h = 900; }

    canvas.width = w;
    canvas.height = h;

    // Draw Background
    drawBackground(ctx, w, h);

    if (device === 'phone') {
        drawPhone(ctx, w, h);
    } else if (device === 'laptop') {
        drawLaptop(ctx, w, h);
    } else if (device === 'browser') {
        drawBrowser(ctx, w, h);
    }
  };

  const downloadMockup = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `mockup-${device}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Max quality
      link.click();
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-violet-600 dark:text-violet-400 p-1.5 bg-violet-100/50 dark:bg-violet-900/20 rounded-lg">
            <MockupIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.mockTitle}
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

      <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px]">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] overflow-y-auto p-6 space-y-8 flex-shrink-0">
            
            {/* 1. Device Selection */}
            <div>
                <SectionTitle>📱 {t.mockSettingsDevice}</SectionTitle>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { id: 'phone', icon: '📱', label: t.mockPhone },
                        { id: 'laptop', icon: '💻', label: t.mockLaptop },
                        { id: 'browser', icon: '🌐', label: t.mockBrowser }
                    ].map(d => (
                        <button 
                            key={d.id}
                            onClick={() => setDevice(d.id as DeviceType)}
                            title={d.label}
                            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${device === d.id ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300'}`}
                        >
                            <span className="text-xl">{d.icon}</span>
                        </button>
                    ))}
                </div>

                {/* Device Color */}
                {device !== 'browser' && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">{t.mockColor}</label>
                        <div className="flex gap-2">
                            {['#2a2a2a', '#e2e2e2', '#d4af37', '#2563eb'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setDeviceColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 ${deviceColor === c ? 'border-violet-500 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c, boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)' }}
                                />
                            ))}
                            <input 
                                type="color" 
                                value={deviceColor} 
                                onChange={e => setDeviceColor(e.target.value)}
                                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none p-0 bg-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

            {/* 2. Image & Content */}
            <div>
                <SectionTitle>🖼️ {t.mockSettingsScreen}</SectionTitle>
                
                {/* Upload */}
                <div className="relative group mb-4">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="text-2xl block mb-1">📤</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.mockUpload}</span>
                    </div>
                </div>

                {/* Fit Mode */}
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setObjectFit('cover')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${objectFit === 'cover' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : 'text-slate-500'}`}
                    >
                        {t.mockFitCover}
                    </button>
                    <button 
                        onClick={() => setObjectFit('contain')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${objectFit === 'contain' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : 'text-slate-500'}`}
                    >
                        {t.mockFitContain}
                    </button>
                </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

            {/* 3. Background */}
            <div>
                <SectionTitle>🎨 {t.mockSettingsBg}</SectionTitle>
                
                {/* Type Selector */}
                <div className="grid grid-cols-3 gap-1 mb-4">
                    <button onClick={() => setBgType('transparent')} className={`text-[10px] font-bold py-2 rounded-lg border ${bgType === 'transparent' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                        {t.mockBgTransparent}
                    </button>
                    <button onClick={() => setBgType('color')} className={`text-[10px] font-bold py-2 rounded-lg border ${bgType === 'color' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                        {t.mockBgColor}
                    </button>
                    <button onClick={() => setBgType('gradient')} className={`text-[10px] font-bold py-2 rounded-lg border ${bgType === 'gradient' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                        {t.mockBgGradient}
                    </button>
                </div>

                {bgType === 'color' && (
                    <input 
                        type="color" 
                        value={bgColor} 
                        onChange={e => setBgColor(e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer p-0 border-0"
                    />
                )}

                {bgType === 'gradient' && (
                    <div className="grid grid-cols-4 gap-2">
                        {gradients.map((g, i) => (
                            <button 
                                key={i}
                                onClick={() => setGradientPreset(i)}
                                className={`w-full h-8 rounded-md transition-transform ${gradientPreset === i ? 'ring-2 ring-violet-500 scale-110' : ''}`}
                                style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4">
                <button
                    onClick={downloadMockup}
                    disabled={!imageSrc}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                    ${!imageSrc ? 'bg-slate-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-500/30 active:scale-[0.98]'}`}
                >
                    <span>📥</span> {t.mockDownload}
                </button>
            </div>

        </div>

        {/* Canvas Preview Area */}
        <div className="flex-1 bg-slate-200 dark:bg-[#020617] flex items-center justify-center p-8 overflow-hidden relative">
            
            {/* Grid Pattern Background for Transparent feel */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)',
                     backgroundSize: '20px 20px',
                     backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
                 }}>
            </div>
            
            {/* The Canvas itself acts as the preview */}
            <div className="relative shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-out transform hover:scale-[1.01]" style={{ maxHeight: '90%', maxWidth: '90%' }}>
                <canvas 
                    ref={canvasRef} 
                    className="w-auto h-auto max-w-full max-h-full object-contain"
                    style={{ maxHeight: '80vh' }}
                />
            </div>
            
            {!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-8 py-4 rounded-full text-base font-bold text-slate-700 dark:text-slate-200 shadow-xl border border-white/20 animate-bounce">
                        👋 {t.mockUploadDesc}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};