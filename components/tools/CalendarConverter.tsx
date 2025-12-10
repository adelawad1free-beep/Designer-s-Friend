import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { DateIcon, BackIcon, SwapIcon } from '../Icons';

interface CalendarConverterProps {
  onClose?: () => void;
}

type Tab = 'converter' | 'calendar';
type ConversionMode = 'g2h' | 'h2g';

export const CalendarConverter: React.FC<CalendarConverterProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('converter');
  const [mode, setMode] = useState<ConversionMode>('g2h');
  
  // Date State
  const [gDateStr, setGDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hDay, setHDay] = useState<number>(1);
  const [hMonth, setHMonth] = useState<number>(1);
  const [hYear, setHYear] = useState<number>(1445);
  
  const [result, setResult] = useState<string>('');

  // Calendar View State
  const [viewDate, setViewDate] = useState(new Date());

  const hijriMonths = t.calHijriMonths.split(',');
  const gregorianMonths = t.calGregorianMonths.split(',');
  const weekDays = t.calWeekDays.split(',');

  // --- Helpers ---

  const toHijri = (date: Date) => {
    if (!date || isNaN(date.getTime())) return '';
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  const getHijriDetails = (date: Date) => {
      if (!date || isNaN(date.getTime())) return { d: 1, m: 1, y: 1445 };
      try {
        const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        const parts = f.formatToParts(date);
        const d = parseInt(parts.find(p => p.type === 'day')?.value || '1');
        const m = parseInt(parts.find(p => p.type === 'month')?.value || '1');
        const y = parseInt(parts.find(p => p.type === 'year')?.value || '1445');
        return { d, m, y };
      } catch (e) {
        return { d: 1, m: 1, y: 1445 };
      }
  };

  // Approximate G from H (Algorithm to find G date that matches H input)
  const estimateGregorianFromHijri = (d: number, m: number, y: number) => {
      if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return new Date('Invalid');

      // Rough estimation: H = 1.030684 * (G - 622)
      // G = (H / 1.030684) + 622
      const estimatedYear = Math.floor((y / 1.030684) + 622);
      const estimatedDate = new Date(estimatedYear, 0, 1); // Jan 1st of estimated year
      
      // Look around ± 400 days from estimation to find exact match
      const center = estimatedDate.getTime();
      
      // Refined estimation:
      // Start checking from specific month offset
      // A Hijri year is ~354 days.
      const dayOfYear = (m - 1) * 29.5 + d;
      const targetTime = center + (dayOfYear * 24 * 60 * 60 * 1000);
      
      // Scan window
      let bestMatch = new Date(targetTime);
      // let found = false;

      // Scan nearby dates (± 20 days from target estimation)
      for (let i = -20; i <= 20; i++) {
          const testDate = new Date(targetTime + (i * 24 * 60 * 60 * 1000));
          if (isNaN(testDate.getTime())) continue;

          const h = getHijriDetails(testDate);
          if (h.d === d && h.m === m && h.y === y) {
              bestMatch = testDate;
              // found = true;
              break;
          }
      }
      return bestMatch;
  };

  // --- Effects ---

  useEffect(() => {
      if (mode === 'g2h') {
          const date = new Date(gDateStr);
          if (!isNaN(date.getTime())) {
              setResult(toHijri(date));
          } else {
              setResult('');
          }
      } else {
          const gDate = estimateGregorianFromHijri(hDay, hMonth, hYear);
          if (!isNaN(gDate.getTime())) {
            try {
              setResult(new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
                  dateStyle: 'full'
              }).format(gDate));
            } catch (e) {
              setResult('');
            }
          } else {
             setResult('');
          }
      }
  }, [gDateStr, hDay, hMonth, hYear, mode, language]);

  // --- Calendar Logic ---
  const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarGrid = () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      
      const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
      const daysInMonth = getDaysInMonth(year, month);
      
      const days = [];
      // Empty slots
      for (let i = 0; i < firstDay; i++) days.push(null);
      // Days
      for (let i = 1; i <= daysInMonth; i++) {
          days.push(new Date(year, month, i));
      }
      return days;
  };

  const changeMonth = (offset: number) => {
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() + offset);
      setViewDate(newDate);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-emerald-600 dark:text-emerald-400 p-1.5 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg">
            <DateIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.calTitle}
          </h2>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all"
            aria-label="Close"
          >
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'converter' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
              {t.calTabConverter}
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'calendar' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
              {t.calTabCalendar}
          </button>
      </div>

      <div className="p-6 md:p-10 min-h-[500px]">
          
          {activeTab === 'converter' && (
              <div className="max-w-xl mx-auto flex flex-col gap-8">
                  
                  {/* Toggle Mode */}
                  <button 
                    onClick={() => setMode(prev => prev === 'g2h' ? 'h2g' : 'g2h')}
                    className="self-center flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                      <span>{mode === 'g2h' ? t.calFromGregorian : t.calFromHijri}</span>
                      <SwapIcon className="w-5 h-5" />
                  </button>

                  {/* Input Area */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
                      {mode === 'g2h' ? (
                          <div className="space-y-4">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.calDateInput} (Gregorian)</label>
                              <input 
                                type="date" 
                                value={gDateStr}
                                onChange={e => setGDateStr(e.target.value)}
                                className="w-full p-4 text-lg bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                              />
                          </div>
                      ) : (
                          <div className="space-y-4">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.calDateInput} (Hijri)</label>
                              <div className="grid grid-cols-3 gap-2">
                                  <input 
                                    type="number" min="1" max="30" 
                                    value={isNaN(hDay) ? '' : hDay} 
                                    onChange={e => setHDay(parseInt(e.target.value))} 
                                    className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                                    placeholder={t.calDay}
                                  />
                                  <select 
                                    value={isNaN(hMonth) ? 1 : hMonth} 
                                    onChange={e => setHMonth(parseInt(e.target.value))}
                                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-center text-slate-800 dark:text-white"
                                  >
                                      {hijriMonths.map((m, i) => (
                                          <option key={i} value={i+1}>{m}</option>
                                      ))}
                                  </select>
                                  <input 
                                    type="number" min="1300" max="1600" 
                                    value={isNaN(hYear) ? '' : hYear} 
                                    onChange={e => setHYear(parseInt(e.target.value))} 
                                    className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                                    placeholder={t.calYear}
                                  />
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Result */}
                  <div className="text-center space-y-2 animate-fade-in-up">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.calResult}</span>
                      <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 min-h-[100px] flex items-center justify-center">
                          {result || '...'}
                      </div>
                  </div>

              </div>
          )}

          {activeTab === 'calendar' && (
              <div className="h-full flex flex-col">
                  {/* Controls */}
                  <div className="flex items-center justify-between mb-6">
                      <button onClick={() => changeMonth(-1)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 rtl:rotate-180">
                          <BackIcon className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white flex flex-col items-center">
                          <span>{gregorianMonths[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal mt-1">
                              {toHijri(viewDate).split(' ').slice(1).join(' ')}
                          </span>
                      </h3>
                      <button onClick={() => changeMonth(1)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 rotate-180 rtl:rotate-0">
                          <BackIcon className="w-5 h-5" />
                      </button>
                  </div>

                  {/* Grid */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                      {/* Weekday Headers */}
                      <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                          {weekDays.map((d, i) => (
                              <div key={i} className="py-3 text-center text-xs font-bold text-slate-500 uppercase">
                                  {d}
                              </div>
                          ))}
                      </div>
                      
                      {/* Days */}
                      <div className="grid grid-cols-7 auto-rows-[1fr]">
                          {generateCalendarGrid().map((date, i) => {
                              if (!date) return <div key={i} className="bg-slate-50/50 dark:bg-slate-900/50 min-h-[80px] border-b border-r border-slate-100 dark:border-slate-800 last:border-r-0"></div>;
                              
                              const isToday = date.toDateString() === new Date().toDateString();
                              const hijri = getHijriDetails(date);

                              return (
                                  <div key={i} className={`p-2 min-h-[100px] border-b border-r border-slate-100 dark:border-slate-800 last:border-r-0 flex flex-col justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${isToday ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}>
                                      <span className={`text-lg font-bold self-end ${isToday ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 w-8 h-8 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>
                                          {date.getDate()}
                                      </span>
                                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                                          <div className="font-bold text-emerald-600/70">{hijri.d}</div>
                                          <div>{hijriMonths[hijri.m - 1]}</div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};