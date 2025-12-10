import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context';
import { Layout } from './components/Layout';
import { QrGenerator } from './components/tools/QrGenerator';
import { UnitConverter } from './components/tools/UnitConverter';
import { NutritionLabelGenerator } from './components/tools/NutritionLabelGenerator';
import { ToolType } from './types';
import { QrIcon, UnitIcon, NutritionIcon } from './components/Icons';

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
      case ToolType.HOME:
      default:
        return (
          <div className="animate-fade-in flex flex-col items-center">
             {/* Grid of Services */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
              {[
                { 
                  t: ToolType.QR_GENERATOR, 
                  title: t[ToolType.QR_GENERATOR], 
                  desc: t.qrDesc, 
                  Icon: QrIcon, 
                  // Purple/Pink Gradient
                  bgClass: 'bg-gradient-to-br from-[#8B5CF6] to-[#DB2777]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-sm',
                  descColor: 'text-purple-100'
                },
                { 
                  t: ToolType.UNIT_CONVERTER, 
                  title: t[ToolType.UNIT_CONVERTER], 
                  desc: t.unitDesc, 
                  Icon: UnitIcon, 
                  // Emerald/Teal Gradient
                  bgClass: 'bg-gradient-to-br from-[#10B981] to-[#0F766E]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-sm',
                  descColor: 'text-emerald-100'
                },
                { 
                  t: ToolType.NUTRITION_LABEL, 
                  title: t[ToolType.NUTRITION_LABEL], 
                  desc: t.nutritionDesc, 
                  Icon: NutritionIcon, 
                  // Orange/Red Gradient
                  bgClass: 'bg-gradient-to-br from-[#F97316] to-[#DC2626]',
                  iconContainer: 'bg-white/20 text-white backdrop-blur-sm',
                  descColor: 'text-orange-100'
                },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  className={`
                    w-full rounded-2xl p-5 
                    shadow-lg hover:shadow-xl hover:-translate-y-1 
                    ${item.bgClass} text-white
                    transition-all duration-300 group text-right rtl:text-right ltr:text-left 
                    flex flex-col relative overflow-hidden h-full min-h-[140px] border border-white/10
                  `}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                     {/* Icon Container */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      ${item.iconContainer} shadow-inner
                      group-hover:scale-110 transition-transform duration-500
                    `}>
                      <item.Icon className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    
                    {/* Action Arrow */}
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center 
                      bg-white/20 text-white
                      group-hover:bg-white/40
                      transition-colors opacity-80 group-hover:opacity-100
                    `}>
                       <span className="transform rtl:rotate-180 text-xs">➜</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-1 leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h3>
                  
                  <p className={`leading-snug text-xs font-medium ${item.descColor}`}>
                    {item.desc}
                  </p>
                  
                  {/* Decorative Background Blob */}
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none"></div>
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