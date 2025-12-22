
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
                { t: ToolType.PALETTE_GENERATOR, title: t[ToolType.PALETTE_GENERATOR], desc: t.paletteToolDesc, Icon: PaletteIcon, bg: 'linear-gradient(to bottom right, #F59E0B, #EA580C)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-amber-100' },
                { t: ToolType.DIELINE_GENERATOR, title: t[ToolType.DIELINE_GENERATOR], desc: t.dieDesc, Icon: DielineIcon, bg: 'linear-gradient(to bottom right, #3B82F6, #2563EB)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-blue-100' },
                { t: ToolType.PATTERN_GENERATOR, title: t[ToolType.PATTERN_GENERATOR], desc: t.patternDesc, Icon: PatternIcon, bg: 'linear-gradient(to bottom right, #6366F1, #4338CA)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-indigo-100' },
                { t: ToolType.PRINT_SIZES, title: t[ToolType.PRINT_SIZES], desc: t.printDesc, Icon: PrintIcon, bg: 'linear-gradient(to bottom right, #10B981, #047857)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-emerald-100' },
                { t: ToolType.SOCIAL_SIZES, title: t[ToolType.SOCIAL_SIZES], desc: t.socialDesc, Icon: SocialIcon, bg: 'linear-gradient(to bottom right, #E11D48, #9F1239)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-rose-100' },
                { t: ToolType.GRID_GENERATOR, title: t[ToolType.GRID_GENERATOR], desc: t.gridDesc, Icon: GridIcon, bg: 'linear-gradient(to bottom right, #3B82F6, #1D4ED8)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-blue-100' },
                { t: ToolType.CALENDAR_CONVERTER, title: t[ToolType.CALENDAR_CONVERTER], desc: t.calDesc, Icon: DateIcon, bg: 'linear-gradient(to bottom right, #10B981, #047857)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-emerald-100' },
                { t: ToolType.SVG_LIBRARY, title: t[ToolType.SVG_LIBRARY], desc: t.svgDesc, Icon: ShapesIcon, bg: 'linear-gradient(to bottom right, #06B6D4, #0891B2)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-cyan-100' },
                { t: ToolType.QR_GENERATOR, title: t[ToolType.QR_GENERATOR], desc: t.qrDesc, Icon: QrIcon, bg: 'linear-gradient(to bottom right, #EC4899, #DB2777)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-pink-100' },
                { t: ToolType.BARCODE_GENERATOR, title: t[ToolType.BARCODE_GENERATOR], desc: t.barcodeDesc, Icon: BarcodeIcon, bg: 'linear-gradient(to bottom right, #334155, #0f172a)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-slate-100' },
                { t: ToolType.PDF_TOOLS, title: t[ToolType.PDF_TOOLS], desc: t.pdfDesc, Icon: PdfIcon, bg: 'linear-gradient(to bottom right, #DC2626, #991B1B)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-red-100' },
                { t: ToolType.IMAGE_COMPRESSOR, title: t[ToolType.IMAGE_COMPRESSOR], desc: t.compressDesc, Icon: CompressIcon, bg: 'linear-gradient(to bottom right, #DB2777, #9D174D)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-pink-100' },
                { t: ToolType.UNIT_CONVERTER, title: t[ToolType.UNIT_CONVERTER], desc: t.appDesc, Icon: UnitIcon, bg: 'linear-gradient(to bottom right, #0D9488, #0F766E)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-teal-100' },
                { t: ToolType.NUTRITION_LABEL, title: t[ToolType.NUTRITION_LABEL], desc: t.appDesc, Icon: NutritionIcon, bg: 'linear-gradient(to bottom right, #EA580C, #C2410C)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-orange-100' },
                { t: ToolType.VAT_CALCULATOR, title: t[ToolType.VAT_CALCULATOR], desc: t.vatDesc, Icon: CalculatorIcon, bg: 'linear-gradient(to bottom right, #16A34A, #15803D)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-green-100' },
                { t: ToolType.BMR_CALCULATOR, title: t[ToolType.BMR_CALCULATOR], desc: t.bmrDesc, Icon: FireIcon, bg: 'linear-gradient(to bottom right, #EAB308, #CA8A04)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-yellow-100' },
                { t: ToolType.PANTONE_MATCH, title: t[ToolType.PANTONE_MATCH], desc: t.pantoneDesc, Icon: SwatchIcon, bg: 'linear-gradient(to bottom right, #06B6D4, #3B82F6)', iconContainer: 'bg-white/20 text-white backdrop-blur-md', descColor: 'text-cyan-100' },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  aria-label={item.title}
                  className="w-full rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-right flex flex-col relative overflow-hidden h-full min-h-[190px] border border-white/10"
                  style={{ background: item.bg }}
                >
                  <div className="flex items-start justify-between w-full mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.iconContainer} shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500`}>
                      <item.Icon className="w-7 h-7 drop-shadow-md" />
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                       <span className="transform rtl:rotate-180 text-sm">➜</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-black mb-2 leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h2>
                  
                  <p className={`leading-snug text-[11px] font-medium ${item.descColor} opacity-90`}>
                    {item.desc}
                  </p>
                  
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none"></div>
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
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <DesignerAppContent />
    </AppProvider>
  );
};

export default App;
