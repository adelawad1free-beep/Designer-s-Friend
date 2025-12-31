import React, { useState } from 'react';
import { useAppContext } from '../../context';
import { CompressIcon, BackIcon } from '../Icons';

interface ImageCompressorProps {
  onClose?: () => void;
}

interface ProcessedFile {
  id: string;
  originalFile: File;
  compressedBlob: Blob | null;
  compressedSize: number;
  reduction: number;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState('image/jpeg');
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const currentCount = files.length;
    const allowed = 10 - currentCount;
    if (allowed <= 0) return;

    const filesArray = Array.from(newFiles).slice(0, allowed).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      compressedBlob: null,
      compressedSize: 0,
      reduction: 0,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...filesArray]);
  };

  const removeFile = (id: string) => setFiles(files.filter(f => f.id !== id));

  const compressImage = async (file: ProcessedFile) => {
    return new Promise<ProcessedFile>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file.originalFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve({ ...file, status: 'error' }); return; }

        if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) { resolve({ ...file, status: 'error' }); return; }
          const reduction = Math.round(((file.originalFile.size - blob.size) / file.originalFile.size) * 100);
          resolve({
            ...file,
            compressedBlob: blob,
            compressedSize: blob.size,
            reduction: reduction > 0 ? reduction : 0,
            status: 'done'
          });
          URL.revokeObjectURL(img.src);
        }, format, quality);
      };
      img.onerror = () => resolve({ ...file, status: 'error' });
    });
  };

  const processAll = async () => {
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));
    const processed = await Promise.all(files.map(f => compressImage(f)));
    setFiles(processed);
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.compressedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file.compressedBlob);
    let ext = format === 'image/webp' ? 'webp' : (format === 'image/png' ? 'png' : 'jpg');
    const originalName = file.originalFile.name.substring(0, file.originalFile.name.lastIndexOf('.')) || file.originalFile.name;
    link.download = `${originalName}-min.${ext}`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="text-pink-600 dark:text-pink-400 p-2 bg-pink-50 dark:bg-pink-900/30 rounded-xl">
            <CompressIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-wide">
            {t.compTitle}
          </h2>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="p-6 lg:p-10 flex flex-col gap-8 bg-slate-50/20 dark:bg-transparent">
        
        {/* Solid Toolbar Area */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.compQuality}: <span className="text-pink-600 font-mono font-black">{Math.round(quality * 100)}%</span></label>
              <input 
                type="range" min="0.1" max="1" step="0.05" value={quality} 
                onChange={e => setQuality(parseFloat(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none border border-slate-200 dark:border-slate-700"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.compFormat}</label>
              <select 
                 value={format} onChange={e => setFormat(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-[11px] font-black text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all cursor-pointer shadow-sm"
              >
                  <option value="image/jpeg">JPEG (أعلى ضغط)</option>
                  <option value="image/webp">WebP (أحدث جودة)</option>
                  <option value="image/png">PNG (ضغط بسيط)</option>
              </select>
           </div>

           <button 
             onClick={processAll}
             disabled={files.length === 0}
             className="bg-pink-600 hover:bg-pink-700 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed text-white px-8 rounded-[1.5rem] shadow-xl shadow-pink-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 h-[52px] self-end mt-1"
           >
              <span className="font-black text-xs uppercase tracking-widest">{t.compProcess}</span>
           </button>
        </div>

        {/* Dynamic Dropzone Area */}
        <div 
           className={`border-4 border-dashed rounded-[3rem] p-12 text-center transition-all cursor-pointer relative group
             ${isDragging 
               ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 scale-[0.98]' 
               : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-100/50 hover:border-pink-300 dark:hover:border-pink-900 shadow-inner'
             }
           `}
           onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
           onDragLeave={() => setIsDragging(false)}
           onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        >
            <input type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="pointer-events-none transform transition-transform duration-500 flex flex-col items-center">
                <div className="w-24 h-24 bg-pink-100/50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-6 border border-pink-100 dark:border-pink-800 group-hover:scale-110 transition-transform">
                  <span className="text-5xl animate-float">📸</span>
                </div>
                <p className="font-black text-slate-800 dark:text-slate-100 text-2xl mb-2">{t.compUpload}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.compUploadSub}</p>
            </div>
        </div>

        {/* Files List - High Contrast Cards */}
        {files.length > 0 && (
           <div className="space-y-6">
              <div className="flex items-center justify-between px-6">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{files.length} / 10 صور مختارة</span>
                 <button onClick={() => setFiles([])} className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] hover:underline">إلغاء الكل</button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {files.map(file => (
                    <div key={file.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-md hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                           <img src={URL.createObjectURL(file.originalFile)} className="w-full h-full object-cover" alt="" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm truncate mb-2">{file.originalFile.name}</h4>
                           <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.compOriginal}: <span className="text-slate-600 dark:text-slate-300">{formatSize(file.originalFile.size)}</span></span>
                              {file.status === 'done' && (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{t.compCompressed}: <span className="font-mono">{formatSize(file.compressedSize)}</span></span>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black">-{file.reduction}%</span>
                                </>
                              )}
                           </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-4">
                           {file.status === 'processing' && (
                              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                           )}
                           
                           {file.status === 'done' && (
                              <button 
                                onClick={() => downloadFile(file)}
                                className="w-12 h-12 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-600/20 active:scale-90"
                              >
                                 <span className="text-xl">📥</span>
                              </button>
                           )}

                           <button 
                             onClick={() => removeFile(file.id)}
                             className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all"
                           >
                              ✕
                           </button>
                        </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>
    </div>
  );
};