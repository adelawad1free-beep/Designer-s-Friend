import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme } from './types';
import { translations } from './translations';

interface AppContextType {
  language: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: typeof translations['ar'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Language based on Storage -> Browser Preference -> Default
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('app-lang') as Language;
      if (savedLang) return savedLang;
      
      // Check browser language
      const browserLang = navigator.language;
      if (browserLang.toLowerCase().startsWith('ar')) {
        return 'ar';
      }
      return 'en';
    }
    return 'ar';
  });

  // Initialize Theme based on Storage -> System Preference -> Default
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme') as Theme;
      if (savedTheme) return savedTheme;
      
      // Check system theme preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Update Document Direction and Language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('app-lang', language);
  }, [language]);

  // Update Theme Class on Body/HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    language,
    theme,
    toggleLanguage,
    toggleTheme,
    t: translations[language]
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};