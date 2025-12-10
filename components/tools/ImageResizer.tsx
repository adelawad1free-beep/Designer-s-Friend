import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context';
import { ImageIcon, BackIcon } from '../Icons';

interface ImageResizerProps {
  onClose?: () => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetDimensions, setTargetDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const img = new Image();
          img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setTargetDimensions({ width: img.width, height: img.height });
            setImageSrc(ev.target!.result as string);
          };
          img.src = ev.target!.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 0;
    setTargetDimensions(prev => {
      const height = maintainAspectRatio 
        ? Math.round((width / originalDimensions.width) * originalDimensions.height) 
        : prev.height;
      return { width, height };
    });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 0;
    setTargetDimensions(prev => {
      const width = maintainAspectRatio 
        ? Math.round((height / originalDimensions.height) * originalDimensions.width) 
        : prev.width;
      return { width, height };
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = targetDimensions.width;
      canvas.height = targetDimensions.height;
      
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, targetDimensions.width, targetDimensions.height);
      
      const link = document.createElement('a');
      link.download = `resized-${imageFile?.name || 'image.png'}`;
      link.href = canvas.toDataURL(imageFile?.type || 'image/png');
      link.click();
    };
    img.src = imageSrc;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 transition-colors overflow-hidden">
      
      {/* Header - Slim & Beautiful */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.resizeTitle}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-10 text-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="pointer-events-none group-hover:scale-105 transition-transform duration-300">
                <span className="text-4xl block mb-4">📤</span>
                <p className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-1">{t.resizeUpload}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{t.resizeUploadSub}</p>
              </div>
            </div>

            {imageSrc && (
              <div className="space-y-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-3 uppercase tracking-wider">{t.resizeSettings}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{t.resizeWidth}</label>
                    <input
                      type="number"
                      value={targetDimensions.width}
                      onChange={handleWidthChange}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none text-slate-700 dark:text-white transition-shadow text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{t.resizeHeight}</label>
                    <input
                      type="number"
                      value={targetDimensions.height}
                      onChange={handleHeightChange}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none text-slate-700 dark:text-white transition-shadow text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ratio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="ratio" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">{t.resizeRatio}</label>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                   <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">{t.resizeOriginal} {originalDimensions.width} × {originalDimensions.height}</p>
                   <button
                    onClick={downloadImage}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 text-sm"
                  >
                    {t.resizeDownload}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[400px] overflow-hidden p-6 relative">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                  aspectRatio: `${targetDimensions.width}/${targetDimensions.height}` 
                }} 
                className="shadow-xl rounded-lg bg-white dark:bg-slate-800"
              />
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-600">
                 <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-20" />
                 <p className="text-sm">{t.resizePreview}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};