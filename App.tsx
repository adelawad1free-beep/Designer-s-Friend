import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context';
import { Layout } from './components/Layout';
import { QrGenerator } from './components/tools/QrGenerator';
import { UnitConverter } from './components/tools/UnitConverter';
import { NutritionLabelGenerator } from './components/tools/NutritionLabelGenerator';
import { BarcodeGenerator } from './components/tools/BarcodeGenerator';
import { ImageCompressor } from './components/tools/ImageCompressor';
import { PdfTools } from './components/tools/PdfTools';
import { VatCalculator } from './components/tools/VatCalculator';
import { PantoneMatch } from './components/tools/PantoneMatch';
import { BmrCalculator } from './components/tools/BmrCalculator';
import { SvgLibrary } from './components/tools/SvgLibrary';
import { CalendarConverter } from './components/tools/CalendarConverter';
import { GridGenerator } from './components/tools/GridGenerator';
import { SocialSizes } from './components/tools/SocialSizes';
import { PrintSizes } from './components/tools/PrintSizes';
import { PatternGenerator } from './components/tools/PatternGenerator';
import { DielineGenerator } from './components/tools/DielineGenerator';
import { PaletteGenerator } from './components/tools/PaletteGenerator';
import { ToolType } from './types';
import { 
  QrIcon, UnitIcon, NutritionIcon, BarcodeIcon, 
  CompressIcon, PdfIcon, CalculatorIcon, SwatchIcon, 
  FireIcon, ShapesIcon, DateIcon, GridIcon, 
  SocialIcon, PrintIcon, PatternIcon, DielineIcon, PaletteIcon 
} from './components/Icons';

const DesignerAppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);
  const { t } = useAppContext();

  const handleClose = () => setActiveTool(ToolType.HOME);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.QR_GENERATOR: return <QrGenerator onClose={handleClose} />;
      case ToolType.UNIT_CONVERTER: return <UnitConverter onClose={handleClose} />;
      case ToolType.NUTRITION_LABEL: return <NutritionLabelGenerator onClose={handleClose} />;
      case ToolType.BARCODE_GENERATOR: return <BarcodeGenerator onClose={handleClose} />;
      case ToolType.IMAGE_COMPRESSOR: return <ImageCompressor onClose={handleClose} />;
      case ToolType.PDF_TOOLS: return <PdfTools onClose={handleClose} />;
      case ToolType.VAT_CALCULATOR: return <VatCalculator onClose={handleClose} />;
      case ToolType.PANTONE_MATCH: return <PantoneMatch onClose={handleClose} />;
      case ToolType.BMR_CALCULATOR: return <BmrCalculator onClose={handleClose} />;
      case ToolType.SVG_LIBRARY: return <SvgLibrary onClose={handleClose} />;
      case ToolType.CALENDAR_CONVERTER: return <CalendarConverter onClose={handleClose} />;
      case ToolType.GRID_GENERATOR: return <GridGenerator onClose={handleClose} />;
      case ToolType.SOCIAL_SIZES: return <SocialSizes onClose={handleClose} />;
      case ToolType.PRINT_SIZES: return <PrintSizes onClose={handleClose} />;
      case ToolType.PATTERN_GENERATOR: return <PatternGenerator onClose={handleClose} />;
      case ToolType.DIELINE_GENERATOR: return <DielineGenerator onClose={handleClose} />;
      case ToolType.PALETTE_GENERATOR: return <PaletteGenerator onClose={handleClose} />;
      case ToolType.HOME:
      default:
        return (
          <div className="animate-fade-in flex flex-col items-center">
             <div className="w-full max-w-6xl mb-12 text-right">
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
                  {t.welcomeTitle} <span className="text-blue-600">{t.welcomeTitleSpan}</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                  {t.welcomeText}
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl pb-20">
              {[
                { t: ToolType.PALETTE_GENERATOR, title: t[ToolType.PALETTE_GENERATOR], desc: t.paletteToolDesc, Icon: PaletteIcon, bgClass: 'from-[#F59E0B] to-[#EA580C]', iconContainer: 'bg-white/20', descColor: 'text-amber-100' },
                { t: ToolType.DIELINE_GENERATOR, title: t[ToolType.DIELINE_GENERATOR], desc: t.dieDesc, Icon: DielineIcon, bgClass: 'from-[#3B82F6] to-[#2563EB]', iconContainer: 'bg-white/20', descColor: 'text-blue-100' },
                { t: ToolType.PATTERN_GENERATOR, title: t[ToolType.PATTERN_GENERATOR], desc: t.patternDesc, Icon: PatternIcon, bgClass: 'from-[#6366F1] to-[#4338CA]', iconContainer: 'bg-white/20', descColor: 'text-indigo-100' },
                { t: ToolType.PRINT_SIZES, title: t[ToolType.PRINT_SIZES], desc: t.printDesc, Icon: PrintIcon, bgClass: 'from-[#10B981] to-[#047857]', iconContainer: 'bg-white/20', descColor: 'text-emerald-100' },
                { t: ToolType.SOCIAL_SIZES, title: t[ToolType.SOCIAL_SIZES], desc: t.socialDesc, Icon: SocialIcon, bgClass: 'from-[#E11D48] to-[#9F1239]', iconContainer: 'bg-white/20', descColor: 'text-rose-100' },
                { t: ToolType.GRID_GENERATOR, title: t[ToolType.GRID_GENERATOR], desc: t.gridDesc, Icon: GridIcon, bgClass: 'from-[#3B82F6] to-[#1D4ED8]', iconContainer: 'bg-white/20', descColor: 'text-blue-100' },
                { t: ToolType.CALENDAR_CONVERTER, title: t[ToolType.CALENDAR_CONVERTER], desc: t.calDesc, Icon: DateIcon, bgClass: 'from-[#10B981] to-[#047857]', iconContainer: 'bg-white/20', descColor: 'text-emerald-100' },
                { t: ToolType.SVG_LIBRARY, title: t[ToolType.SVG_LIBRARY], desc: t.svgDesc, Icon: ShapesIcon, bgClass: 'from-[#06B6D4] to-[#0891B2]', iconContainer: 'bg-white/20', descColor: 'text-cyan-100' },
                { t: ToolType.QR_GENERATOR, title: t[ToolType.QR_GENERATOR], desc: t.qrDesc, Icon: QrIcon, bgClass: 'from-[#EC4899] to-[#DB2777]', iconContainer: 'bg-white/20', descColor: 'text-pink-100' },
                { t: ToolType.BARCODE_GENERATOR, title: t[ToolType.BARCODE_GENERATOR], desc: t.barcodeDesc, Icon: BarcodeIcon, bgClass: 'from-slate-700 to-slate-900', iconContainer: 'bg-white/20', descColor: 'text-slate-100' },
                { t: ToolType.PDF_TOOLS, title: t[ToolType.PDF_TOOLS], desc: t.pdfDesc, Icon: PdfIcon, bgClass: 'from-[#DC2626] to-[#991B1B]', iconContainer: 'bg-white/20', descColor: 'text-red-100' },
                { t: ToolType.IMAGE_COMPRESSOR, title: t[ToolType.IMAGE_COMPRESSOR], desc: t.compressDesc, Icon: CompressIcon, bgClass: 'from-[#DB2777] to-[#9D174D]', iconContainer: 'bg-white/20', descColor: 'text-pink-100' },
                { t: ToolType.UNIT_CONVERTER, title: t[ToolType.UNIT_CONVERTER], desc: t.appDesc, Icon: UnitIcon, bgClass: 'from-[#0D9488] to-[#0F766E]', iconContainer: 'bg-white/20', descColor: 'text-teal-100' },
                { t: ToolType.NUTRITION_LABEL, title: t[ToolType.NUTRITION_LABEL], desc: t.appDesc, Icon: NutritionIcon, bgClass: 'from-[#EA580C] to-[#C2410C]', iconContainer: 'bg-white/20', descColor: 'text-orange-100' },
                { t: ToolType.VAT_CALCULATOR, title: t[ToolType.VAT_CALCULATOR], desc: t.vatDesc, Icon: CalculatorIcon, bgClass: 'from-[#16A34A] to-[#15803D]', iconContainer: 'bg-white/20', descColor: 'text-green-100' },
                { t: ToolType.BMR_CALCULATOR, title: t[ToolType.BMR_CALCULATOR], desc: t.bmrDesc, Icon: FireIcon, bgClass: 'from-[#EAB308] to-[#CA8A04]', iconContainer: 'bg-white/20', descColor: 'text-yellow-100' },
                { t: ToolType.PANTONE_MATCH, title: t[ToolType.PANTONE_MATCH], desc: t.pantoneDesc, Icon: SwatchIcon, bgClass: 'from-[#06B6D4] to-[#3B82F6]', iconContainer: 'bg-white/20', descColor: 'text-cyan-100' },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  aria-label={item.title}
                  className={`w-full rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-right flex flex-col relative overflow-hidden h-full min-h-[190px] border border-white/10 bg-gradient-to-br ${item.bgClass}`}
                >
                  <div className="flex items-start justify-between w-full mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.iconContainer} backdrop-blur-md shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500`}>
                      <item.Icon className="w-7 h-7 drop-shadow-md text-white" />
                    </div>
                  </div>
                  <h2 className="text-lg font-black mb-2 leading-tight text-white drop-shadow-sm">{item.title}</h2>
                  <p className={`leading-snug text-[11px] font-medium ${item.descColor} opacity-90`}>{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Small & Simple Footer Donation Link */}
            <div className="w-full max-w-7xl pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 mb-20 text-center">
              <p className="text-sm text-slate-500 font-bold">{t.supportDesc}</p>
              <a 
                href="https://buymeacoffee.com/guidai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:scale-105 active:scale-95 transition-all text-sm font-black"
              >
                <span className="animate-float">☕</span>
                <span>{t.buyMeCoffee}</span>
              </a>
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
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <DesignerAppContent />
    </AppProvider>
  );
};

export default App;