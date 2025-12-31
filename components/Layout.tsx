import React from 'react';
import { ToolType } from '../types';
import { useAppContext } from '../context';
import { BackIcon, LangIcon, MoonIcon, SunIcon, LogoIcon, QrIcon, PdfIcon, ShapesIcon, DateIcon, GridIcon, SocialIcon, PrintIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTool, onNavigate }) => {
  const { language, theme, toggleLanguage, toggleTheme, t } = useAppContext();

  const isHome = activeTool === ToolType.HOME;
  const isActive = (type: ToolType) => activeTool === type;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans transition-colors duration-300 flex flex-col lg:flex-row">
      
      {/* Sidebar / Navigation */}
      <aside className={`
        lg:w-80 w-full lg:h-screen lg:sticky lg:top-0 z-50
        bg-gradient-to-b from-blue-700 to-blue-900 dark:from-slate-900 dark:to-black
        text-white shadow-2xl flex flex-col transition-all duration-500
      `}>
        
        {/* Brand Area */}
        <div className="p-8 flex flex-col items-center lg:items-start gap-4">
          <div 
            onClick={() => onNavigate(ToolType.HOME)}
            className="cursor-pointer group flex flex-col items-center lg:items-start"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:rotate-6 transition-transform duration-300 mb-4">
              <LogoIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-blue-200 text-xs font-medium opacity-80 mt-1 hidden lg:block">
              {t.appDesc}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 hidden lg:flex flex-col gap-1 custom-scrollbar">
          <button
            onClick={() => onNavigate(ToolType.HOME)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isHome ? 'bg-white/15 text-white shadow-inner' : 'hover:bg-white/5 text-blue-100'}`}
          >
            <div className={`p-1.5 rounded-lg ${isHome ? 'bg-blue-500' : 'bg-white/10'}`}>
              <LogoIcon className="w-4 h-4" />
            </div>
            <span>{t[ToolType.HOME]}</span>
          </button>

          <div className="my-4 h-px bg-white/10 mx-4"></div>
          <span className="px-4 text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">{t.homeDesc}</span>

          {[
            { id: ToolType.PRINT_SIZES, icon: PrintIcon },
            { id: ToolType.SOCIAL_SIZES, icon: SocialIcon },
            { id: ToolType.GRID_GENERATOR, icon: GridIcon },
            { id: ToolType.SVG_LIBRARY, icon: ShapesIcon },
            { id: ToolType.QR_GENERATOR, icon: QrIcon },
            { id: ToolType.PDF_TOOLS, icon: PdfIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive(item.id) ? 'bg-white text-blue-900 shadow-xl' : 'hover:bg-white/5 text-blue-100'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate">{t[item.id]}</span>
            </button>
          ))}

          {/* Minimal Buy Me a Coffee - Bottom of Sidebar */}
          <div className="mt-auto pt-6 pb-2">
            <a 
              href="https://buymeacoffee.com/guidai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mx-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 group"
            >
               <span className="text-lg group-hover:animate-float">☕</span>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">{t.buyMeCoffee}</span>
            </a>
          </div>
        </nav>

        {/* Bottom Controls */}
        <div className="p-6 bg-black/10 backdrop-blur-md border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              <span className="text-xs font-bold lg:hidden xl:block">{theme === 'light' ? (language === 'ar' ? 'ليلي' : 'Dark') : (language === 'ar' ? 'نهاري' : 'Light')}</span>
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
            >
              <LangIcon className="w-5 h-5" />
              <span className="text-xs font-bold lg:hidden xl:block">{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
          <div className="text-[10px] text-blue-300/60 text-center font-medium mt-2 hidden lg:block">
            {t.copyright}
          </div>
        </div>

        {!isHome && (
          <button
            onClick={() => onNavigate(ToolType.HOME)}
            className="lg:hidden absolute top-6 left-6 rtl:right-6 rtl:left-auto bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30"
          >
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:h-screen overflow-y-auto bg-slate-50 dark:bg-[#020617] flex flex-col">
        {!isHome && (
          <div className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 lg:z-10">
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => onNavigate(ToolType.HOME)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors lg:flex hidden"
               >
                  <BackIcon className="w-5 h-5 rtl:rotate-180 text-slate-400" />
               </button>
               <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">{t[activeTool]}</h2>
                  <p className="text-xs text-slate-500 font-medium">{t.appDesc}</p>
               </div>
            </div>
          </div>
        )}
        <div className={`flex-1 p-6 md:p-12 ${isHome ? 'animate-fade-in' : 'animate-fade-in-up'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        <div className="h-20 lg:hidden"></div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};