import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context';
import { FireIcon, BackIcon } from '../Icons';

interface BmrCalculatorProps {
  onClose?: () => void;
}

export const BmrCalculator: React.FC<BmrCalculatorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('25');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [activity, setActivity] = useState<number>(1.2);

  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);

  // استخدام useMemo لضمان تحديث النصوص عند تغيير اللغة وضمان وجودها
  const activityLevels = useMemo(() => [
    { value: 1.2, label: t.bmrActivitySedentary || (language === 'ar' ? 'خامل' : 'Sedentary') },
    { value: 1.375, label: t.bmrActivityLight || (language === 'ar' ? 'نشاط خفيف' : 'Light Active') },
    { value: 1.55, label: t.bmrActivityModerate || (language === 'ar' ? 'نشاط متوسط' : 'Moderate') },
    { value: 1.725, label: t.bmrActivityActive || (language === 'ar' ? 'نشيط جداً' : 'Very Active') },
    { value: 1.9, label: t.bmrActivityVeryActive || (language === 'ar' ? 'رياضي' : 'Extra Active') },
  ], [t, language]);

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      setBmr(0);
      setTdee(0);
      return;
    }

    let baseBmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') baseBmr += 5;
    else baseBmr -= 161;

    setBmr(Math.round(baseBmr));
    setTdee(Math.round(baseBmr * activity));
  }, [gender, age, weight, height, activity]);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="text-orange-600 dark:text-orange-400 p-2 bg-orange-100/50 dark:bg-orange-900/30 rounded-xl">
            <FireIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-wide">
            {t.bmrTitle}
          </h2>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 bg-slate-50/20 dark:bg-transparent">
        
        {/* Inputs Column */}
        <div className="flex-1 space-y-8">
           
           {/* Gender Toggle - حل مشكلة اختفاء النص عبر استخدام ألوان خلفية صريحة */}
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">{language === 'ar' ? 'الجنس' : 'Gender'}</label>
              <div className="bg-slate-200/50 dark:bg-slate-900 p-1.5 rounded-2xl flex border border-slate-300 dark:border-slate-700 shadow-inner">
                <button 
                  onClick={() => setGender('male')}
                  className={`flex-1 py-4 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 ${gender === 'male' ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="text-lg">♂</span> {t.bmrMale}
                </button>
                <button 
                  onClick={() => setGender('female')}
                  className={`flex-1 py-4 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 ${gender === 'female' ? 'bg-pink-600 text-white shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="text-lg">♀</span> {t.bmrFemale}
                </button>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputBox label={t.bmrAge} value={age} onChange={(v: string) => setAge(v)} unit={language === 'ar' ? 'سنة' : 'yrs'} />
              <InputBox label={t.bmrHeight} value={height} onChange={(v: string) => setHeight(v)} unit="cm" />
              <InputBox label={t.bmrWeight} value={weight} onChange={(v: string) => setWeight(v)} unit="kg" />
           </div>

           {/* Activity Level - حل مشكلة اختفاء القائمة المنسدلة */}
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">{t.bmrActivity}</label>
              <div className="relative">
                <select
                  value={activity}
                  onChange={e => setActivity(parseFloat(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-white font-bold cursor-pointer appearance-none shadow-sm"
                >
                  {activityLevels.map(lvl => (
                    <option key={lvl.value} value={lvl.value} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">
                      {lvl.label}
                    </option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rtl:right-4 rtl:left-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
           </div>
        </div>

        {/* Results Column */}
        <div className="flex-1 space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <span className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em] mb-4">{t.bmrResultBMR}</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-7xl font-black text-white tracking-tighter drop-shadow-lg animate-float">{bmr}</span>
                   <span className="text-sm font-black text-white/80 uppercase">{t.bmrCalories}</span>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
               <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
                  <span className="font-black text-slate-800 dark:text-slate-100 text-sm">{t.bmrResultTDEE}</span>
                  <div className="text-right">
                    <span className="font-black text-orange-600 dark:text-orange-500 text-2xl font-mono">{tdee}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-tighter">kcal / day</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <GoalRow label={t.bmrGoalLose} value={Math.max(1200, tdee - 500)} color="text-orange-600" progress={70} />
                  <GoalRow label={t.bmrGoalMaintain} value={tdee} color="text-amber-600" progress={100} />
                  <GoalRow label={t.bmrGoalGain} value={tdee + 500} color="text-emerald-600" progress={130} />
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const InputBox = ({ label, value, onChange, unit }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-white font-black text-xl shadow-sm"
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-tighter rtl:right-4 rtl:left-auto">{unit}</span>
    </div>
  </div>
);

const GoalRow = ({ label, value, color, progress }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center text-[11px] font-black">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className={`${color} font-mono`}>{value} kcal</span>
     </div>
     <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color.replace('text', 'bg')}`} 
          style={{ width: `${Math.min(100, (progress/130)*100)}%` }}
        ></div>
     </div>
  </div>
);