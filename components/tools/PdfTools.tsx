import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLibModule from 'pdfjs-dist';
import SignaturePad from 'signature_pad';
import { useAppContext } from '../../context';
import { PdfIcon, BackIcon, SplitIcon, LockIcon, ImageIcon, RotateIcon, PenIcon } from '../Icons';

// Initialize PDF.js worker using a compatible stable version
const pdfjsLib = (pdfjsLibModule as any).default || pdfjsLibModule;

if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

interface PdfToolsProps {
  onClose?: () => void;
}

type Tab = 'merge' | 'split' | 'images' | 'protect' | 'rotate' | 'reorder' | 'sign' | 'compress' | 'extract';

export const PdfTools: React.FC<PdfToolsProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feature Specific States
  const [password, setPassword] = useState('');
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [pageOrder, setPageOrder] = useState('');
  const [splitRange, setSplitRange] = useState('');
  const [extractedText, setExtractedText] = useState('');
  
  // Signature Pad Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    // Initialize signature pad when switching to sign tab
    if (activeTab === 'sign' && canvasRef.current) {
        const canvas = canvasRef.current;
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(ratio, ratio);

        signaturePadRef.current = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });
    }
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => activeTab === 'images' || activeTab === 'merge' ? [...prev, ...newFiles] : [newFiles[0]]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearSignature = () => {
      signaturePadRef.current?.clear();
  };

  const downloadPdf = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      downloadPdf(await mergedPdf.save(), 'merged.pdf');
    } catch (error) {
      alert('Error merging files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
      if (files.length === 0) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const srcDoc = await PDFDocument.load(fileBuffer);
          const pageCount = srcDoc.getPageCount();

          if (!splitRange) {
              for (let i = 0; i < pageCount; i++) {
                  const newDoc = await PDFDocument.create();
                  const [page] = await newDoc.copyPages(srcDoc, [i]);
                  newDoc.addPage(page);
                  downloadPdf(await newDoc.save(), `page-${i+1}.pdf`);
              }
          } else {
              const parts = splitRange.split('-').map(p => parseInt(p.trim()));
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                  const newDoc = await PDFDocument.create();
                  const start = Math.max(0, parts[0] - 1);
                  const end = Math.min(pageCount - 1, parts[1] - 1);
                  const indices = [];
                  for(let i = start; i <= end; i++) indices.push(i);
                  
                  const pages = await newDoc.copyPages(srcDoc, indices);
                  pages.forEach(p => newDoc.addPage(p));
                  downloadPdf(await newDoc.save(), `split-${parts[0]}-${parts[1]}.pdf`);
              } else {
                  alert('Invalid range format. Use e.g., 1-5');
              }
          }
      } catch (e) {
          alert('Error splitting PDF.');
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
        if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(fileBuffer);
        else if (file.type === 'image/png') image = await pdfDoc.embedPng(fileBuffer);
        else continue;
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      downloadPdf(await pdfDoc.save(), 'images.pdf');
    } catch (error) {
       alert('Error converting images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProtect = async () => {
      if (files.length === 0 || !password) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer);
          pdfDoc.encrypt({ userPassword: password, ownerPassword: password });
          downloadPdf(await pdfDoc.save(), 'protected.pdf');
      } catch (e) {
          alert('Error protecting PDF.');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleRotate = async () => {
      if (files.length === 0) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer);
          const pages = pdfDoc.getPages();
          pages.forEach(page => {
              page.setRotation(degrees(page.getRotation().angle + rotation));
          });
          downloadPdf(await pdfDoc.save(), 'rotated.pdf');
      } catch (e) {
          alert('Error rotating PDF.');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleReorder = async () => {
    if (files.length === 0 || !pageOrder) return;
    setIsProcessing(true);
    try {
        const fileBuffer = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(fileBuffer);
        const newDoc = await PDFDocument.create();
        const maxPages = srcDoc.getPageCount();
        
        const indices = pageOrder.split(',')
            .map(s => parseInt(s.trim()) - 1)
            .filter(n => !isNaN(n) && n >= 0 && n < maxPages);
        
        if (indices.length === 0) {
            alert('Invalid page numbers.');
            return;
        }

        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach(p => newDoc.addPage(p));
        downloadPdf(await newDoc.save(), 'reordered.pdf');
    } catch (e) {
        alert('Error reordering PDF.');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSign = async () => {
      if (files.length === 0 || signaturePadRef.current?.isEmpty()) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer);
          
          const pngDataUrl = signaturePadRef.current!.toDataURL('image/png');
          const pngImageBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());
          const pngImage = await pdfDoc.embedPng(pngImageBytes);

          const pages = pdfDoc.getPages();
          const lastPage = pages[pages.length - 1];
          const { width } = lastPage.getSize();
          const imgDims = pngImage.scale(0.5);

          lastPage.drawImage(pngImage, {
              x: width / 2 - imgDims.width / 2,
              y: 50,
              width: imgDims.width,
              height: imgDims.height,
          });

          downloadPdf(await pdfDoc.save(), 'signed.pdf');
      } catch (e) {
          alert('Error signing PDF.');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleCompress = async () => {
      if (files.length === 0) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer);
          downloadPdf(await pdfDoc.save(), 'optimized.pdf');
      } catch (e) {
          alert('Error processing PDF.');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleExtractText = async () => {
      if (files.length === 0) return;
      setIsProcessing(true);
      try {
          const fileBuffer = await files[0].arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
          const doc = await loadingTask.promise;
          let fullText = '';
          
          for (let i = 1; i <= doc.numPages; i++) {
              const page = await doc.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map((item: any) => item.str);
              fullText += `--- Page ${i} ---\n` + strings.join(' ') + '\n\n';
          }
          setExtractedText(fullText);
      } catch (e) {
          console.error(e);
          alert('Error extracting text. Ensure file is not encrypted.');
      } finally {
          setIsProcessing(false);
      }
  };

  const switchTab = (tab: Tab) => {
      setActiveTab(tab);
      setFiles([]);
      setExtractedText('');
      setSplitRange('');
      setPassword('');
      setPageOrder('');
  };

  const getAcceptType = () => activeTab === 'images' ? "image/png, image/jpeg" : ".pdf";
  const isSingleFileOp = !['merge', 'images'].includes(activeTab);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col md:flex-row min-h-[600px]">
      
      {/* Improved Contrast Sidebar */}
      <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white/50 dark:bg-black/20">
             <div className="p-2 bg-red-500 text-white rounded-lg shadow-sm">
                <PdfIcon className="w-6 h-6" />
             </div>
             <span className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">{t.pdfTitle}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
             {[
                 { id: 'merge', icon: PdfIcon, label: t.pdfMerge },
                 { id: 'split', icon: SplitIcon, label: t.pdfSplit },
                 { id: 'images', icon: ImageIcon, label: t.pdfImages },
                 { id: 'protect', icon: LockIcon, label: t.pdfProtect },
                 { id: 'rotate', icon: RotateIcon, label: t.pdfRotate },
                 { id: 'reorder', icon: SplitIcon, label: t.pdfReorder },
                 { id: 'sign', icon: PenIcon, label: t.pdfSign },
                 { id: 'extract', icon: PdfIcon, label: t.pdfToImages },
                 { id: 'compress', icon: PdfIcon, label: t.pdfCompress },
             ].map((item) => (
                 <button
                    key={item.id}
                    onClick={() => switchTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all duration-200 ${activeTab === item.id 
                      ? 'bg-red-500 text-white shadow-md scale-[1.02]' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                 >
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                 </button>
             ))}
          </div>

          {onClose && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                  <button onClick={onClose} className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 font-bold text-xs transition-colors">
                      <BackIcon className="w-4 h-4 rtl:rotate-180" />
                      <span>{t.backToHome}</span>
                  </button>
              </div>
          )}
      </div>

      <div className="flex-1 p-6 md:p-10 bg-white dark:bg-[#0F172A] flex flex-col overflow-y-auto">
         <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                {activeTab === 'merge' && t.pdfMerge}
                {activeTab === 'split' && t.pdfSplit}
                {activeTab === 'images' && t.pdfImages}
                {activeTab === 'protect' && t.pdfProtect}
                {activeTab === 'rotate' && t.pdfRotate}
                {activeTab === 'reorder' && t.pdfReorder}
                {activeTab === 'sign' && t.pdfSign}
                {activeTab === 'compress' && t.pdfCompress}
                {activeTab === 'extract' && t.pdfToImages}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
                {activeTab === 'compress' && t.pdfCompressInfo}
                {activeTab === 'sign' && t.pdfSignAdd}
                {activeTab === 'extract' && t.pdfExtractTextInfo}
            </p>
         </div>

         {(files.length === 0 || (!isSingleFileOp && activeTab !== 'sign')) && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group mb-8">
                <input 
                    type="file" 
                    multiple={!isSingleFileOp}
                    accept={getAcceptType()}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="pointer-events-none transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-5xl block mb-4">{activeTab === 'images' ? '🖼️' : '📄'}</span>
                    <p className="font-black text-slate-700 dark:text-slate-200 text-lg mb-2">
                        {activeTab === 'images' ? t.pdfUploadImages : t.pdfUploadPdf}
                    </p>
                    <p className="text-xs text-slate-400 font-bold">{t.pdfNoFiles}</p>
                </div>
            </div>
         )}

         {files.length > 0 && (
             <div className="flex-1 flex flex-col gap-6 animate-fade-in-up">
                 <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 max-h-[200px] overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 shadow-inner">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-xl shrink-0">{activeTab === 'images' ? '🖼️' : '📄'}</span>
                                <span className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">{file.name}</span>
                                <span className="text-[10px] text-slate-400 shrink-0 font-mono">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1">✕</button>
                        </div>
                    ))}
                    {isSingleFileOp && files.length > 0 && <button onClick={() => setFiles([])} className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center w-full mt-2 hover:underline">إلغاء وتغيير الملف</button>}
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                     {activeTab === 'split' && (
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.pdfSplitRange}</label>
                             <input type="text" value={splitRange} onChange={e => setSplitRange(e.target.value)} placeholder="مثال: 1-5" className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-red-500" />
                             <p className="text-[10px] text-slate-400 font-medium">{t.pdfSplitAll}</p>
                         </div>
                     )}

                     {activeTab === 'protect' && (
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.pdfProtectPass}</label>
                             <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-red-500" />
                         </div>
                     )}

                     {activeTab === 'rotate' && (
                         <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.pdfRotateAngle}</label>
                             <div className="flex gap-2">
                                {[90, 180, 270].map(deg => (
                                    <button key={deg} onClick={() => setRotation(deg as any)} className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all ${rotation === deg ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                                        {deg}°
                                    </button>
                                ))}
                             </div>
                         </div>
                     )}

                     {activeTab === 'reorder' && (
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.pdfReorderDesc}</label>
                             <input type="text" value={pageOrder} onChange={e => setPageOrder(e.target.value)} placeholder="مثال: 1, 3, 2, 4" className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-red-500" />
                         </div>
                     )}

                     {activeTab === 'sign' && (
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">لوحة التوقيع</label>
                             <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white overflow-hidden cursor-crosshair shadow-inner">
                                <canvas ref={canvasRef} className="w-full h-44" />
                             </div>
                             <button onClick={clearSignature} className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-2 hover:underline">{t.pdfSignClear}</button>
                         </div>
                     )}

                     {activeTab === 'extract' && extractedText && (
                         <div className="mt-4 animate-fade-in">
                             <h4 className="font-black text-xs text-slate-500 mb-2 uppercase tracking-widest">{t.pdfExtractedTitle}</h4>
                             <textarea readOnly value={extractedText} className="w-full h-48 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono shadow-inner leading-relaxed" />
                         </div>
                     )}

                     <button
                        onClick={() => {
                            if (activeTab === 'merge') handleMerge();
                            else if (activeTab === 'split') handleSplit();
                            else if (activeTab === 'images') handleImagesToPdf();
                            else if (activeTab === 'protect') handleProtect();
                            else if (activeTab === 'rotate') handleRotate();
                            else if (activeTab === 'reorder') handleReorder();
                            else if (activeTab === 'sign') handleSign();
                            else if (activeTab === 'compress') handleCompress();
                            else if (activeTab === 'extract') handleExtractText();
                        }}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all transform active:scale-[0.98] ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/30'}`}
                     >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            {t.pdfProcessing}
                          </span>
                        ) : (activeTab === 'extract' ? t.pdfExtractBtn : t.pdfDownload)}
                     </button>
                 </div>
             </div>
         )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};