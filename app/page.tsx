
'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context';
import { Layout } from '@/components/Layout';
import { ToolType } from '@/types';
import dynamic from 'next/dynamic';

// استيراد الأدوات ديناميكياً لتقليل حجم التحميل الأولي
const PaletteGenerator = dynamic(() => import('@/components/tools/PaletteGenerator').then(m => m.PaletteGenerator), { ssr: false });
const QrGenerator = dynamic(() => import('@/components/tools/QrGenerator').then(m => m.QrGenerator), { ssr: false });
const DielineGenerator = dynamic(() => import('@/components/tools/DielineGenerator').then(m => m.DielineGenerator), { ssr: false });
const PatternGenerator = dynamic(() => import('@/components/tools/PatternGenerator').then(m => m.PatternGenerator), { ssr: false });
const PrintSizes = dynamic(() => import('@/components/tools/PrintSizes').then(m => m.PrintSizes), { ssr: false });
const SocialSizes = dynamic(() => import('@/components/tools/SocialSizes').then(m => m.SocialSizes), { ssr: false });
const GridGenerator = dynamic(() => import('@/components/tools/GridGenerator').then(m => m.GridGenerator), { ssr: false });
const CalendarConverter = dynamic(() => import('@/components/tools/CalendarConverter').then(m => m.CalendarConverter), { ssr: false });
const SvgLibrary = dynamic(() => import('@/components/tools/SvgLibrary').then(m => m.SvgLibrary), { ssr: false });
const BarcodeGenerator = dynamic(() => import('@/components/tools/BarcodeGenerator').then(m => m.BarcodeGenerator), { ssr: false });
const PdfTools = dynamic(() => import('@/components/tools/PdfTools').then(m => m.PdfTools), { ssr: false });
const ImageCompressor = dynamic(() => import('@/components/tools/ImageCompressor').then(m => m.ImageCompressor), { ssr: false });
const UnitConverter = dynamic(() => import('@/components/tools/UnitConverter').then(m => m.UnitConverter), { ssr: false });
const NutritionLabelGenerator = dynamic(() => import('@/components/tools/NutritionLabelGenerator').then(m => m.NutritionLabelGenerator), { ssr: false });
const VatCalculator = dynamic(() => import('@/components/tools/VatCalculator').then(m => m.VatCalculator), { ssr: false });
const BmrCalculator = dynamic(() => import('@/components/tools/BmrCalculator').then(m => m.BmrCalculator), { ssr: false });
const PantoneMatch = dynamic(() => import('@/components/tools/PantoneMatch').then(m => m.PantoneMatch), { ssr: false });

import { 
  QrIcon, UnitIcon, NutritionIcon, BarcodeIcon, 
  CompressIcon, PdfIcon, CalculatorIcon, SwatchIcon, 
  FireIcon, ShapesIcon, DateIcon, GridIcon, 
  SocialIcon, PrintIcon, PatternIcon, DielineIcon, PaletteIcon 
} from '@/components/Icons';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);
  const { t } = useAppContext();

  const handleClose = () => setActiveTool(ToolType.HOME);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.PALETTE_GENERATOR: return <PaletteGenerator onClose={handleClose} />;
      case ToolType.QR_GENERATOR: return <QrGenerator onClose={handleClose} />;
      case ToolType.DIELINE_GENERATOR: return <DielineGenerator onClose={handleClose} />;
      case ToolType.PATTERN_GENERATOR: return <PatternGenerator onClose={handleClose} />;
      case ToolType.PRINT_SIZES: return <PrintSizes onClose={handleClose} />;
      case ToolType.SOCIAL_SIZES: return <SocialSizes onClose={handleClose} />;
      case ToolType.GRID_GENERATOR: return <GridGenerator onClose={handleClose} />;
      case ToolType.CALENDAR_CONVERTER: return <CalendarConverter onClose={handleClose} />;
      case ToolType.SVG_LIBRARY: return <SvgLibrary onClose={handleClose} />;
      case ToolType.BARCODE_GENERATOR: return <BarcodeGenerator onClose={handleClose} />;
      case ToolType.PDF_TOOLS: return <PdfTools onClose={handleClose} />;
      case ToolType.IMAGE_COMPRESSOR: return <ImageCompressor onClose={handleClose} />;
      case ToolType.UNIT_CONVERTER: return <UnitConverter onClose={handleClose} />;
      case ToolType.NUTRITION_LABEL: return <NutritionLabelGenerator onClose={handleClose} />;
      case ToolType.VAT_CALCULATOR: return <VatCalculator onClose={handleClose} />;
      case ToolType.BMR_CALCULATOR: return <BmrCalculator onClose={handleClose} />;
      case ToolType.PANTONE_MATCH: return <PantoneMatch onClose={handleClose} />;
      default:
        return (
          <div className="animate-fade-in flex flex-col items-center">
             <div className="w-full max-w-6xl mb-12 text-right">
                <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
                  {t.welcomeTitle} <span className="text-blue-600">{t.welcomeTitleSpan}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                  {t.welcomeText}
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl pb-20">
              {[
                { t: ToolType.PALETTE_GENERATOR, title: t[ToolType.PALETTE_GENERATOR], desc: t.paletteToolDesc, Icon: PaletteIcon, bgClass: 'bg-gradient-to-br from-[#F59E0B] to-[#EA580C]', iconContainer: 'bg-white/20', descColor: 'text-amber-100' },
                { t: ToolType.DIELINE_GENERATOR, title: t[ToolType.DIELINE_GENERATOR], desc: t.dieDesc, Icon: DielineIcon, bgClass: 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]', iconContainer: 'bg-white/20', descColor: 'text-blue-100' },
                { t: ToolType.PATTERN_GENERATOR, title: t[ToolType.PATTERN_GENERATOR], desc: t.patternDesc, Icon: PatternIcon, bgClass: 'bg-gradient-to-br from-[#6366F1] to-[#4338CA]', iconContainer: 'bg-white/20', descColor: 'text-indigo-100' },
                { t: ToolType.PRINT_SIZES, title: t[ToolType.PRINT_SIZES], desc: t.printDesc, Icon: PrintIcon, bgClass: 'bg-gradient-to-br from-[#10B981] to-[#047857]', iconContainer: 'bg-white/20', descColor: 'text-emerald-100' },
                { t: ToolType.SOCIAL_SIZES, title: t[ToolType.SOCIAL_SIZES], desc: t.socialDesc, Icon: SocialIcon, bgClass: 'bg-gradient-to-br from-[#E11D48] to-[#9F1239]', iconContainer: 'bg-white/20', descColor: 'text-rose-100' },
                { t: ToolType.GRID_GENERATOR, title: t[ToolType.GRID_GENERATOR], desc: t.gridDesc, Icon: GridIcon, bgClass: 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]', iconContainer: 'bg-white/20', descColor: 'text-blue-100' },
                { t: ToolType.CALENDAR_CONVERTER, title: t[ToolType.CALENDAR_CONVERTER], desc: t.calDesc, Icon: DateIcon, bgClass: 'bg-gradient-to-br from-[#10B981] to-[#047857]', iconContainer: 'bg-white/20', descColor: 'text-emerald-100' },
                { t: ToolType.SVG_LIBRARY, title: t[ToolType.SVG_LIBRARY], desc: t.svgDesc, Icon: ShapesIcon, bgClass: 'bg-gradient-to-br from-[#06B6D4] to-[#0891B2]', iconContainer: 'bg-white/20', descColor: 'text-cyan-100' },
                { t: ToolType.QR_GENERATOR, title: t[ToolType.QR_GENERATOR], desc: t.qrDesc, Icon: QrIcon, bgClass: 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]', iconContainer: 'bg-white/20', descColor: 'text-pink-100' },
                { t: ToolType.BARCODE_GENERATOR, title: t[ToolType.BARCODE_GENERATOR], desc: t.barcodeDesc, Icon: BarcodeIcon, bgClass: 'bg-gradient-to-br from-slate-700 to-slate-900', iconContainer: 'bg-white/20', descColor: 'text-slate-100' },
                { t: ToolType.PDF_TOOLS, title: t[ToolType.PDF_TOOLS], desc: t.pdfDesc, Icon: PdfIcon, bgClass: 'bg-gradient-to-br from-[#DC2626] to-[#991B1B]', iconContainer: 'bg-white/20', descColor: 'text-red-100' },
                { t: ToolType.IMAGE_COMPRESSOR, title: t[ToolType.IMAGE_COMPRESSOR], desc: t.compressDesc, Icon: CompressIcon, bgClass: 'bg-gradient-to-br from-[#DB2777] to-[#9D174D]', iconContainer: 'bg-white/20', descColor: 'text-pink-100' },
                { t: ToolType.UNIT_CONVERTER, title: t[ToolType.UNIT_CONVERTER], desc: t.appDesc, Icon: UnitIcon, bgClass: 'bg-gradient-to-br from-[#0D9488] to-[#0F766E]', iconContainer: 'bg-white/20', descColor: 'text-teal-100' },
                { t: ToolType.NUTRITION_LABEL, title: t[ToolType.NUTRITION_LABEL], desc: t.appDesc, Icon: NutritionIcon, bgClass: 'bg-gradient-to-br from-[#EA580C] to-[#C2410C]', iconContainer: 'bg-white/20', descColor: 'text-orange-100' },
                { t: ToolType.VAT_CALCULATOR, title: t[ToolType.VAT_CALCULATOR], desc: t.vatDesc, Icon: CalculatorIcon, bgClass: 'bg-gradient-to-br from-[#16A34A] to-[#15803D]', iconContainer: 'bg-white/20', descColor: 'text-green-100' },
                { t: ToolType.BMR_CALCULATOR, title: t[ToolType.BMR_CALCULATOR], desc: t.bmrDesc, Icon: FireIcon, bgClass: 'bg-gradient-to-br from-[#EAB308] to-[#CA8A04]', iconContainer: 'bg-white/20', descColor: 'text-yellow-100' },
                { t: ToolType.PANTONE_MATCH, title: t[ToolType.PANTONE_MATCH], desc: t.pantoneDesc, Icon: SwatchIcon, bgClass: 'bg-gradient-to-br from-[#06B6D4] to-[#3B82F6]', iconContainer: 'bg-white/20', descColor: 'text-cyan-100' },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  className={`w-full rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 ${item.bgClass} text-white transition-all duration-300 group text-right flex flex-col relative overflow-hidden h-full min-h-[190px] border border-white/10`}
                >
                  <div className="flex items-start justify-between w-full mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.iconContainer} shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500`}>
                      <item.Icon className="w-7 h-7 drop-shadow-md" />
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                       <span className="transform rtl:rotate-180 text-sm">➜</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black mb-2 leading-tight text-white drop-shadow-sm">{item.title}</h3>
                  <p className={`leading-snug text-[11px] font-medium ${item.descColor} opacity-90`}>{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeTool={activeTool} onNavigate={setActiveTool}>
      {renderContent()}
    </Layout>
  );
}
