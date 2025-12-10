import React from 'react';
import { ToolType } from '../types';
import { useAppContext } from '../context';
import { BackIcon, LangIcon, MoonIcon, SunIcon, LogoIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTool, onNavigate }) => {
  const { language, theme, toggleLanguage, toggleTheme, t } = useAppContext();

  const isHome = activeTool === ToolType.HOME;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-200 flex flex-col">
      
      {/* Full Width Header Banner */}
      <header className={`
        relative w-full
        bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900
        text-white shadow-2xl transition-all duration-500 ease-in-out
        ${isHome ? 'min-h-[300px]' : 'min-h-[200px]'}
        overflow-hidden
      `}>
          
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Controls (Theme/Lang) - Positioned at logical Start (Top Left in LTR, Top Right in RTL) */}
        <div className="absolute top-6 left-6 rtl:right-6 rtl:left-auto flex gap-2 z-20">
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10 shadow-lg active:scale-95"
              title="Toggle Theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10 shadow-lg active:scale-95"
              title="Switch Language"
            >
              <LangIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Inner Content Container - Centered and Constrained */}
        <div className={`
           max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center md:items-stretch justify-between
           relative z-10
           ${isHome ? 'pt-20 pb-16' : 'pt-12 pb-10'}
        `}>
          
          {/* Text Content */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-start w-full md:w-2/3 mt-8 md:mt-0">
             {/* Optional Badge */}
             <div className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-50 mb-4 self-center md:self-start">
                <span>✨</span>
                <span>v1.0</span>
             </div>

             <h1 className={`font-black tracking-tight leading-tight transition-all duration-500 ${isHome ? 'text-4xl md:text-6xl mb-3' : 'text-3xl md:text-4xl mb-2'}`}>
               {t.appTitle}
             </h1>
             <p className={`text-blue-50 max-w-lg leading-relaxed font-medium transition-all duration-500 ${isHome ? 'text-lg md:text-xl opacity-90' : 'text-sm opacity-80'}`}>
               {t.welcomeText}
             </p>

             {/* Back Button (Only when not home) */}
             {!isHome && (
                <button
                  onClick={() => onNavigate(ToolType.HOME)}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl shadow-lg font-bold hover:bg-blue-50 transition-all active:scale-95"
                >
                  <BackIcon className="w-5 h-5 rtl:rotate-180" />
                  <span>{t.backToHome}</span>
                </button>
              )}
          </div>

          {/* Icon/Brand Visual */}
          <div className={`mt-8 md:mt-0 md:ml-8 rtl:md:mr-8 transition-all duration-500 flex items-center justify-center ${!isHome && 'scale-75 md:scale-90 origin-center'}`}>
            <div className="w-28 h-28 md:w-40 md:h-40 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rotate-3 hover:rotate-6 transition-transform duration-500 group">
               <LogoIcon className="w-14 h-14 md:w-20 md:h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
               {/* Decorative sparkles */}
               <div className="absolute top-4 right-4 text-white/60 text-xl">✦</div>
               <div className="absolute bottom-4 left-4 text-white/40 text-sm">✦</div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 w-full max-w-7xl animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>{t.copyright}</p>
      </footer>
    </div>
  );
};