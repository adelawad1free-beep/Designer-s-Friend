import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context';
import { Layout } from './components/Layout';
import { CodeGenerator } from './components/tools/CodeGenerator';
import { ImageResizer } from './components/tools/ImageResizer';
import { PaletteGenerator } from './components/tools/PaletteGenerator';
import { QrGenerator } from './components/tools/QrGenerator';
import { ToolType } from './types';
import { CodeIcon, ImageIcon, PaletteIcon, QrIcon } from './components/Icons';

// Component separated to use context
const MainApp: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);
  const { t } = useAppContext();

  const handleClose = () => setActiveTool(ToolType.HOME);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.CODE_GENERATOR:
        return <CodeGenerator onClose={handleClose} />;
      case ToolType.IMAGE_RESIZER:
        return <ImageResizer onClose={handleClose} />;
      case ToolType.PALETTE_GENERATOR:
        return <PaletteGenerator onClose={handleClose} />;
      case ToolType.QR_GENERATOR:
        return <QrGenerator onClose={handleClose} />;
      case ToolType.HOME:
      default:
        return (
          <div className="animate-fade-in">
             {/* Grid of Services */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {[
                { 
                  t: ToolType.CODE_GENERATOR, 
                  title: t[ToolType.CODE_GENERATOR], 
                  desc: t.codeDesc, 
                  Icon: CodeIcon, 
                  color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' 
                },
                { 
                  t: ToolType.IMAGE_RESIZER, 
                  title: t[ToolType.IMAGE_RESIZER], 
                  desc: t.resizeDesc, 
                  Icon: ImageIcon, 
                  color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                },
                { 
                  t: ToolType.PALETTE_GENERATOR, 
                  title: t[ToolType.PALETTE_GENERATOR], 
                  desc: t.paletteDesc, 
                  Icon: PaletteIcon, 
                  color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' 
                },
                { 
                  t: ToolType.QR_GENERATOR, 
                  title: t[ToolType.QR_GENERATOR], 
                  desc: t.qrDesc, 
                  Icon: QrIcon, 
                  color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' 
                },
              ].map((item) => (
                <button
                  key={item.t}
                  onClick={() => setActiveTool(item.t)}
                  className="w-full bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 group text-right rtl:text-right ltr:text-left flex flex-col h-full transform hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <item.Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs flex-1">{item.desc}</p>
                  
                  <div className="mt-6 flex items-center text-primary-600 dark:text-primary-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 rtl:-translate-x-4 rtl:group-hover:translate-x-0">
                    {t.language === 'ar' ? 'ابدأ الآن ←' : 'Start Now →'}
                  </div>
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