import React, { useState, useRef } from 'react';
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
    
    // Enforce 10 files limit
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

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const compressImage = async (file: ProcessedFile) => {
    return new Promise<ProcessedFile>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file.originalFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
           resolve({ ...file, status: 'error' });
           return;
        }

        // Fill white background for JPEGs (handles transparent PNGs conversion)
        if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve({ ...file, status: 'error' });
            return;
          }

          const reduction = Math.round(((file.originalFile.size - blob.size) / file.originalFile.size) * 100);
          
          resolve({
            ...file,
            compressedBlob: blob,
            compressedSize: blob.size,
            reduction: reduction > 0 ? reduction : 0, // Avoid negative if larger
            status: 'done'
          });
          
          URL.revokeObjectURL(img.src);
        }, format, quality);
      };
      img.onerror = () => resolve({ ...file, status: 'error' });
    });
  };

  const processAll = async () => {
    const pending = files.filter(f => f.status !== 'processing');
    
    // Mark as processing
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

    const processed = await Promise.all(pending.map(f => compressImage(f)));
    
    setFiles(processed);
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.compressedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file.compressedBlob);
    
    // Determine extension
    let ext = 'jpg';
    if (format === 'image/webp') ext = 'webp';
    else if (format === 'image/png') ext = 'png';

    const originalName = file.originalFile.name.substring(0, file.originalFile.name.lastIndexOf('.')) || file.originalFile.name;
    link.download = `${originalName}-compressed.${ext}`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-pink-600 dark:text-pink-400 p-1.5 bg-pink-100/50 dark:bg-pink-900/20 rounded-lg">
            <CompressIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.compTitle}
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

      <div className="p-6 lg:p-10 flex flex-col gap-8">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.compQuality}: {Math.round(quality * 100)}%</label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={quality} 
                onChange={e => setQuality(parseFloat(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
           </div>

           <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.compFormat}</label>
              <select 
                 value={format}
                 onChange={e => setFormat(e.target.value)}
                 className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-pink-500"
              >
                  <option value="image/jpeg">JPEG (Best Compression)</option>
                  <option value="image/webp">WebP (Modern)</option>
              </select>
           </div>

           <button 
             onClick={processAll}
             disabled={files.length === 0}
             className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
           >
              <span>⚡</span> {t.compProcess}
           </button>
        </div>

        {/* Upload Area */}
        <div 
           className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer relative group
             ${isDragging 
               ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' 
               : 'border-slate-300 dark:border-slate-700 hover:border-pink-400 bg-slate-50 dark:bg-slate-900'
             }
           `}
           onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
           onDragLeave={() => setIsDragging(false)}
           onDrop={e => {
             e.preventDefault();
             setIsDragging(false);
             handleFiles(e.dataTransfer.files);
           }}
        >
            <input 
                type="file" 
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={e => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="pointer-events-none transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-4xl block mb-4">🖼️</span>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-lg mb-2">
                    {t.compUpload}
                </p>
                <p className="text-sm text-slate-400">
                    {t.compUploadSub}
                </p>
            </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{files.length} / 10</span>
                 <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:underline font-bold">{t.compClear}</button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {files.map(file => (
                    <div key={file.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 shadow-sm animate-fade-in-up">
                        {/* Preview Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-900 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                           <img src={URL.createObjectURL(file.originalFile)} className="w-full h-full object-cover" alt="" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate mb-1">{file.originalFile.name}</h4>
                           <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-500">{t.compOriginal}: {formatSize(file.originalFile.size)}</span>
                              {file.status === 'done' && (
                                <>
                                  <span className="text-slate-300 dark:text-slate-600">•</span>
                                  <span className="text-green-600 dark:text-green-400 font-bold">{t.compCompressed}: {formatSize(file.compressedSize)}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold">-{file.reduction}%</span>
                                </>
                              )}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="shrink-0 flex items-center gap-2">
                           {file.status === 'processing' && (
                              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                           )}
                           
                           {file.status === 'done' && (
                              <button 
                                onClick={() => downloadFile(file)}
                                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                              >
                                 ⬇️
                              </button>
                           )}

                           <button 
                             onClick={() => removeFile(file.id)}
                             className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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