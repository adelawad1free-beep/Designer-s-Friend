import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context';
import { SocialIcon, BackIcon } from '../Icons';

interface SocialSizesProps {
  onClose?: () => void;
}

interface SizeItem {
  nameAr: string;
  nameEn: string;
  width: number;
  height: number;
  ratio: string;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  icon: string;
  sizes: SizeItem[];
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    icon: '📸',
    sizes: [
      { nameAr: 'منشور مربع', nameEn: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { nameAr: 'منشور طولي (بورتريه)', nameEn: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { nameAr: 'منشور عرضي (لاندسكيب)', nameEn: 'Landscape Post', width: 1080, height: 566, ratio: '1.91:1' },
      { nameAr: 'ستوري / ريلز', nameEn: 'Story / Reels', width: 1080, height: 1920, ratio: '9:16' },
      { nameAr: 'صورة الملف الشخصي', nameEn: 'Profile Picture', width: 320, height: 320, ratio: '1:1' },
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: 'bg-[#1877F2]',
    icon: '👥',
    sizes: [
      { nameAr: 'منشور صورة', nameEn: 'Post Image', width: 1200, height: 630, ratio: '1.91:1' },
      { nameAr: 'صورة الغلاف (Cover)', nameEn: 'Cover Photo', width: 820, height: 312, ratio: '2.6:1' },
      { nameAr: 'غلاف مجموعة', nameEn: 'Group Cover', width: 1640, height: 856, ratio: '1.91:1' },
      { nameAr: 'صورة الملف الشخصي', nameEn: 'Profile Picture', width: 180, height: 180, ratio: '1:1' },
      { nameAr: 'ستوري فيسبوك', nameEn: 'Facebook Story', width: 1080, height: 1920, ratio: '9:16' },
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: 'bg-[#FF0000]',
    icon: '🎥',
    sizes: [
      { nameAr: 'صورة مصغرة (Thumbnail)', nameEn: 'Video Thumbnail', width: 1280, height: 720, ratio: '16:9' },
      { nameAr: 'غلاف القناة (Banner)', nameEn: 'Channel Banner', width: 2560, height: 1440, ratio: '16:9' },
      { nameAr: 'فيديو Shorts', nameEn: 'YouTube Shorts', width: 1080, height: 1920, ratio: '9:16' },
      { nameAr: 'صورة الملف (Avatar)', nameEn: 'Profile Picture', width: 800, height: 800, ratio: '1:1' },
    ]
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: 'bg-black',
    icon: '🐦',
    sizes: [
      { nameAr: 'منشور صورة', nameEn: 'Single Image Post', width: 1200, height: 675, ratio: '16:9' },
      { nameAr: 'صورة الغلاف (Header)', nameEn: 'Header Photo', width: 1500, height: 500, ratio: '3:1' },
      { nameAr: 'صورة الملف الشخصي', nameEn: 'Profile Picture', width: 400, height: 400, ratio: '1:1' },
      { nameAr: 'بطاقة الموقع', nameEn: 'Website Card', width: 800, height: 418, ratio: '1.91:1' },
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'bg-[#0A66C2]',
    icon: '💼',
    sizes: [
      { nameAr: 'منشور شركة / صورة', nameEn: 'Company Post', width: 1200, height: 627, ratio: '1.91:1' },
      { nameAr: 'غلاف الصفحة الشخصية', nameEn: 'Background Image', width: 1584, height: 396, ratio: '4:1' },
      { nameAr: 'صورة الملف الشخصي', nameEn: 'Profile Picture', width: 400, height: 400, ratio: '1:1' },
      { nameAr: 'لوجو الشركة', nameEn: 'Company Logo', width: 300, height: 300, ratio: '1:1' },
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'bg-black',
    icon: '🎵',
    sizes: [
      { nameAr: 'فيديو تيك توك', nameEn: 'TikTok Video', width: 1080, height: 1920, ratio: '9:16' },
      { nameAr: 'صورة الملف الشخصي', nameEn: 'Profile Picture', width: 200, height: 200, ratio: '1:1' },
    ]
  }
];

export const SocialSizes: React.FC<SocialSizesProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [activePlatform, setActivePlatform] = useState<string>(platforms[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPlatform = platforms.find(p => p.id === activePlatform)!;

  const filteredSizes = useMemo(() => {
    if (!searchQuery) return currentPlatform.sizes;
    return currentPlatform.sizes.filter(s => 
      s.nameAr.includes(searchQuery) || s.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentPlatform, searchQuery]);

  const copyToClipboard = (w: number, h: number) => {
    navigator.clipboard.writeText(`${w}x${h}`);
    // Brief visual feedback could go here
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col min-h-[600px]">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-pink-600 dark:text-pink-400 p-1.5 bg-pink-100/50 dark:bg-pink-900/20 rounded-lg">
            <SocialIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.socialTitle}
          </h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Sidebar - Platforms */}
        <div className="w-full lg:w-64 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 p-4 space-y-2 flex lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm shrink-0 lg:shrink-1 w-auto lg:w-full ${activePlatform === p.id ? 'bg-white dark:bg-slate-800 shadow-md text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="text-lg">{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder={t.socialSearch}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 rtl:pr-12 rtl:pl-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
            <span className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {/* Grid of Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSizes.map((s, idx) => (
              <div 
                key={idx}
                className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-pink-500 dark:hover:border-pink-500 transition-all shadow-sm flex flex-col md:flex-row items-center gap-6"
              >
                {/* Visual Ratio Placeholder */}
                <div 
                  className={`w-24 h-24 rounded-2xl shrink-0 ${currentPlatform.color} flex items-center justify-center shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div 
                    className="bg-white/20 backdrop-blur-md rounded border border-white/30"
                    style={{ 
                      aspectRatio: `${s.width}/${s.height}`,
                      maxHeight: '70%',
                      maxWidth: '70%',
                      height: s.height >= s.width ? '100%' : 'auto',
                      width: s.width > s.height ? '100%' : 'auto'
                    }}
                  ></div>
                  <span className="absolute bottom-1 right-2 text-[8px] font-black text-white opacity-80">{s.ratio}</span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-right rtl:md:text-right ltr:md:text-left">
                  <h4 className="font-black text-slate-800 dark:text-white text-lg mb-1">
                    {language === 'ar' ? s.nameAr : s.nameEn}
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm font-mono mt-2">
                    <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg">
                      <span className="text-[10px] uppercase mr-2 opacity-50 block">{t.socialWidth}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{s.width} px</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg">
                      <span className="text-[10px] uppercase mr-2 opacity-50 block">{t.socialHeight}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{s.height} px</span>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button 
                  onClick={() => copyToClipboard(s.width, s.height)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-pink-600 hover:text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95"
                >
                  {t.socialCopyDims}
                </button>
              </div>
            ))}
          </div>

          {filteredSizes.length === 0 && (
             <div className="py-20 text-center text-slate-400">
               <span className="text-4xl block mb-4">🔦</span>
               <p>{t.svgNoResults}</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};