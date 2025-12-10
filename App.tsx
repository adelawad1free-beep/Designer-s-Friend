import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context';
import { Layout } from './components/Layout';
import { QrGenerator } from './components/tools/QrGenerator';
import { UnitConverter } from './components/tools/UnitConverter';
import { NutritionLabelGenerator } from './components/tools/NutritionLabelGenerator';
import { CodeGenerator } from './components/tools/CodeGenerator';
import { ImageResizer } from './components/tools/ImageResizer';
import { PaletteGenerator } from './components/tools/PaletteGenerator';
import { ToolType } from './types';
import { QrIcon, UnitIcon, NutritionIcon, CodeIcon, ImageIcon, PaletteIcon } from './components/Icons';

// Component separated to use context
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
      case ToolType.CODE_GENERATOR:
        return <CodeGenerator onClose={handleClose} />;
      case ToolType.IMAGE_RESIZER:
        return <ImageResizer onClose={handleClose} />;
      case ToolType.PALETTE_GENERATOR:
        return <PaletteGenerator onClose={handleClose} />;
      case ToolType.HOME:
      default:
        return (
          <div className="animate-fade-in flex flex-col items-center">
             {/* Grid of Services */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {[
                { 
                  t: ToolType.CODE_GENERATOR, 
                  title: t[ToolType.CODE_GENERATOR], 
                  desc: t.codeDesc, 
                  Icon: CodeIcon, 
                  gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600',
                  shadow: 'shadow-purple-500/30',
                  border: 'hover:border-purple-200 dark:hover:border-purple-800'
                },
                { 
                  t: ToolType.IMAGE_RESIZER, 
                  title: t[ToolType.IMAGE_RESIZER], 
                  desc: t.resizeDesc, 
                  Icon: ImageIcon, 
                  gradient: 'bg-gradient-to-br from-blue-500 to-sky-600',
                  shadow: 'shadow-blue-500/30',
                  border: 'hover:border-blue-200 dark:hover:border-blue-800'
                },
                { 
                  t: ToolType.PALETTE_GENERATOR, 
                  title: t[ToolType.PALETTE_GENERATOR], 
                  desc: t.paletteDesc, 
                  Icon: PaletteIcon, 
                  gradient: 'bg-gradient-to-br from-orange-400 to-amber-600',
                  shadow: 'shadow-orange-500/30',
                  border: 'hover:border-orange-200 dark:hover:border-orange-800'
                },
                { 
                  t: ToolType.QR_GENERATOR, 
                  title: t[ToolType.QR_GENERATOR], 
                  desc: t.qrDesc, 
                  Icon: QrIcon, 
                  gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600',
                  shadow: 'shadow-blue-500/30',
                  border: 'hover:border-indigo-200 dark:hover:border-indigo-800'
                },
                { 
                  t: ToolType.UNIT_CONVERTER, 
                  title: t[ToolType.UNIT_CONVERTER], 
                  desc: t.unitDesc, 
                  Icon: UnitIcon, 
                  gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
                  shadow: 'shadow-emerald-500/30',
                  border: 'hover:border-emerald-200 dark:hover:border-emerald-800'
                },
                { 
                  t: ToolType.NUTRITION_LABEL, 
                  title: t[ToolType.NUTRITION_LABEL], 
                  desc: t.nutritionDesc, 
                  Icon: NutritionIcon, 
                  gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
                  shadow: 'shadow-orange-500/30',
                  border: 'hover:border-orange-200 dark:hover:border-orange-800'
                },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  className={`
                    w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 
                    shadow-sm hover:shadow-2xl hover:-translate-y-2 
                    border border-slate-100 dark:border-slate-700 ${item.border}
                    transition-all duration-300 group text-right rtl:text-right ltr:text-left 
                    flex flex-col relative overflow-hidden h-full min-h-[280px]
                  `}
                >
                  {/* Beautiful Identity Icon */}
                  <div className={`
                    w-20 h-20 rounded-3xl flex items-center justify-center mb-8 
                    ${item.gradient} shadow-lg ${item.shadow}
                    group-hover:scale-110 transition-transform duration-500
                    ring-4 ring-white dark:ring-slate-700
                  `}>
                    <item.Icon className="w-10 h-10 text-white drop-shadow-md" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base flex-1">
                    {item.desc}
                  </p>
                  
                  <div className={`
                    mt-8 flex items-center font-bold text-sm opacity-0 group-hover:opacity-100 
                    transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 rtl:-translate-x-4 rtl:group-hover:translate-x-0
                    text-slate-800 dark:text-slate-200
                  `}>
                    {t.language === 'ar' ? 'ابدأ الآن ←' : 'Start Now →'}
                  </div>

                  {/* Decorative Background Blob */}
                  <div className={`
                    absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none
                    ${item.gradient}
                  `}></div>
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