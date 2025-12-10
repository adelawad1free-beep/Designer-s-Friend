import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useAppContext } from '../../context';
import { PdfIcon, BackIcon } from '../Icons';

interface PdfToolsProps {
  onClose?: () => void;
}

type Tab = 'merge' | 'images';

export const PdfTools: React.FC<PdfToolsProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      downloadPdf(pdfBytes, 'merged-document.pdf');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging files. Please ensure they are valid PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(fileBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(fileBuffer);
        } else {
            continue; // Skip unsupported
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, 'images-converted.pdf');
    } catch (error) {
       console.error('Error converting images:', error);
       alert('Error converting images. Ensure they are JPG or PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Clear files when switching tabs
  const switchTab = (tab: Tab) => {
      setActiveTab(tab);
      setFiles([]);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-red-600 dark:text-red-400 p-1.5 bg-red-100/50 dark:bg-red-900/20 rounded-lg">
            <PdfIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.pdfTitle}
          </h2>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <button 
            onClick={() => switchTab('merge')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'merge' ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-900/10' : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
            {t.pdfMerge}
        </button>
        <button 
            onClick={() => switchTab('images')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'images' ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-900/10' : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
            {t.pdfImages}
        </button>
      </div>

      <div className="p-8 min-h-[500px] flex flex-col">
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group mb-8">
            <input 
                type="file" 
                multiple
                accept={activeTab === 'merge' ? ".pdf" : "image/png, image/jpeg"}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="pointer-events-none transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-5xl block mb-4">
                    {activeTab === 'merge' ? '📄' : '🖼️'}
                </span>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-lg mb-2">
                    {activeTab === 'merge' ? t.pdfUploadPdf : t.pdfUploadImages}
                </p>
                <p className="text-sm text-slate-400">
                    {t.pdfNoFiles}
                </p>
            </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-2">
                    <span>{files.length} {t.pdfFileCount}</span>
                    <button onClick={() => setFiles([])} className="text-red-500 hover:underline">Clear All</button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 max-h-[300px] overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-xl shrink-0">{activeTab === 'merge' ? '📄' : '🖼️'}</span>
                                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
                                <span className="text-xs text-slate-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 p-1">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={activeTab === 'merge' ? handleMerge : handleImagesToPdf}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/30'}`}
                >
                    {isProcessing ? t.pdfProcessing : (activeTab === 'merge' ? t.pdfMerge : t.pdfDownload)}
                </button>
            </div>
        )}

      </div>
    </div>
  );
};