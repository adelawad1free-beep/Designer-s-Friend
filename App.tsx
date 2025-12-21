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
import { ToolType } from './types';
import { QrIcon, UnitIcon, NutritionIcon, BarcodeIcon, CompressIcon, PdfIcon, CalculatorIcon, SwatchIcon, FireIcon, ShapesIcon, DateIcon, GridIcon, SocialIcon, PrintIcon } from './components/Icons';

const MainApp: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);
  const { t } = useAppContext();

  const handleClose = () => setActiveTool(ToolType.HOME);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.QR_GENERATOR:
        return <QrGenerator onClose={handleClose} />;
      case ToolType.UNIT_CONVERTER:
        return <UnitConverter onClose={handleClose} />;
      case ToolType.NUTRITION_LABEL:
        return <NutritionLabelGenerator onClose={handleClose} />;
      case ToolType.BARCODE_GENERATOR:
        return <BarcodeGenerator onClose={handleClose} />;
      case ToolType.IMAGE_COMPRESSOR:
        return <ImageCompressor onClose={handleClose} />;
      case ToolType.PDF_TOOLS:
        return <PdfTools onClose={handleClose} />;
      case ToolType.VAT_CALCULATOR:
        return <VatCalculator onClose={handleClose} />;
      case ToolType.PANTONE_MATCH:
        return <PantoneMatch onClose={handleClose} />;
      case ToolType.BMR_CALCULATOR:
        return <BmrCalculator onClose={handleClose} />;
      case ToolType.SVG_LIBRARY:
        return <SvgLibrary onClose={handleClose} />;
      case ToolType.CALENDAR_CONVERTER:
        return <CalendarConverter onClose={handleClose} />;
      case ToolType.GRID_GENERATOR:
        return <GridGenerator onClose={handleClose} />;
      case ToolType.SOCIAL_SIZES:
        return <SocialSizes onClose={handleClose} />;
      case ToolType.PRINT_SIZES:
        return <PrintSizes onClose={handleClose} />;
      case ToolType.HOME:
      default:
        return (
          <div className="animate-fade-in flex flex-col items-center">
             {/* Simple Section Header for Home */}
             <div className="w-full max-w-6xl mb-12 text-right">
                <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
                  {t.welcomeTitle} <span className="text-blue-600">{t.welcomeTitleSpan}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                  {t.welcomeText}
                </p>
             </div>

             {/* Grid of Services */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
              {[
                { 
                  t: ToolType.PRINT_SIZES, 
                  title: t[ToolType.PRINT_SIZES], 
                  desc: t.printDesc, 
                  Icon: PrintIcon, 
                  bgClass: 'bg-gradient-to-br from-[#10B981] to-[#047857]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-emerald-100'
                },
                { 
                  t: ToolType.SOCIAL_SIZES, 
                  title: t[ToolType.SOCIAL_SIZES], 
                  desc: t.socialDesc, 
                  Icon: SocialIcon, 
                  bgClass: 'bg-gradient-to-br from-[#E11D48] to-[#9F1239]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-rose-100'
                },
                { 
                  t: ToolType.GRID_GENERATOR, 
                  title: t[ToolType.GRID_GENERATOR], 
                  desc: t.gridDesc, 
                  Icon: GridIcon, 
                  bgClass: 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-blue-100'
                },
                { 
                  t: ToolType.CALENDAR_CONVERTER, 
                  title: t[ToolType.CALENDAR_CONVERTER], 
                  desc: t.calDesc, 
                  Icon: DateIcon, 
                  bgClass: 'bg-gradient-to-br from-[#10B981] to-[#047857]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-emerald-100'
                },
                { 
                  t: ToolType.SVG_LIBRARY, 
                  title: t[ToolType.SVG_LIBRARY], 
                  desc: t.svgDesc, 
                  Icon: ShapesIcon, 
                  bgClass: 'bg-gradient-to-br from-[#06B6D4] to-[#0891B2]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-cyan-100'
                },
                { 
                  t: ToolType.BMR_CALCULATOR, 
                  title: t[ToolType.BMR_CALCULATOR], 
                  desc: t.bmrDesc, 
                  Icon: FireIcon, 
                  bgClass: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-amber-100'
                },
                { 
                  t: ToolType.QR_GENERATOR, 
                  title: t[ToolType.QR_GENERATOR], 
                  desc: t.qrDesc, 
                  Icon: QrIcon, 
                  bgClass: 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-pink-100'
                },
                { 
                  t: ToolType.PANTONE_MATCH, 
                  title: t[ToolType.PANTONE_MATCH], 
                  desc: t.pantoneDesc, 
                  Icon: SwatchIcon, 
                  bgClass: 'bg-gradient-to-br from-[#06B6D4] to-[#3B82F6]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-cyan-100'
                },
                { 
                  t: ToolType.PDF_TOOLS, 
                  title: t[ToolType.PDF_TOOLS], 
                  desc: t.pdfDesc, 
                  Icon: PdfIcon, 
                  bgClass: 'bg-gradient-to-br from-[#DC2626] to-[#991B1B]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-red-100'
                },
                { 
                  t: ToolType.VAT_CALCULATOR, 
                  title: t[ToolType.VAT_CALCULATOR], 
                  desc: t.vatDesc, 
                  Icon: CalculatorIcon, 
                  bgClass: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-emerald-100'
                },
                { 
                  t: ToolType.IMAGE_COMPRESSOR, 
                  title: t[ToolType.IMAGE_COMPRESSOR], 
                  desc: t.compressDesc, 
                  Icon: CompressIcon, 
                  bgClass: 'bg-gradient-to-br from-[#EC4899] to-[#E11D48]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-pink-100'
                },
                { 
                  t: ToolType.BARCODE_GENERATOR, 
                  title: t[ToolType.BARCODE_GENERATOR], 
                  desc: t.barcodeDesc, 
                  Icon: BarcodeIcon, 
                  bgClass: 'bg-gradient-to-br from-[#4F46E5] to-[#2563EB]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-md',
                  descColor: 'text-indigo-100'
                },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  className={`
                    w-full rounded-3xl p-6 
                    shadow-xl hover:shadow-2xl hover:-translate-y-2 
                    ${item.bgClass} text-white
                    transition-all duration-300 group text-right rtl:text-right ltr:text-left 
                    flex flex-col relative overflow-hidden h-full min-h-[180px] border border-white/10
                  `}
                >
                  <div className="flex items-start justify-between w-full mb-4">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      ${item.iconContainer} shadow-inner ring-1 ring-white/30
                      group-hover:scale-110 transition-transform duration-500
                    `}>
                      <item.Icon className="w-7 h-7 drop-shadow-md" />
                    </div>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      bg-white/20 text-white backdrop-blur-sm
                      group-hover:bg-white/30
                      transition-all opacity-0 group-hover:opacity-100
                    `}>
                       <span className="transform rtl:rotate-180 text-sm">➜</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black mb-2 leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h3>
                  
                  <p className={`leading-snug text-xs font-medium ${item.descColor} opacity-90`}>
                    {item.desc}
                  </p>
                  
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none"></div>
                  <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-black/5 blur-2xl pointer-events-none"></div>
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
      <MainApp />
    </AppProvider>
  );
};

export default App;