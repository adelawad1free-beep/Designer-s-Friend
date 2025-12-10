import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { FireIcon, BackIcon } from '../Icons';

interface BmrCalculatorProps {
  onClose?: () => void;
}

export const BmrCalculator: React.FC<BmrCalculatorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('25');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [activity, setActivity] = useState<number>(1.2);

  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);

  const activityLevels = [
    { value: 1.2, label: t.bmrActivitySedentary },
    { value: 1.375, label: t.bmrActivityLight },
    { value: 1.55, label: t.bmrActivityModerate },
    { value: 1.725, label: t.bmrActivityActive },
    { value: 1.9, label: t.bmrActivityVeryActive },
  ];

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      setBmr(0);
      setTdee(0);
      return;
    }

    // Mifflin-St Jeor Equation
    let baseBmr = (10 * w) + (6.25 * h) - (5 * a);
    
    if (gender === 'male') {
      baseBmr += 5;
    } else {
      baseBmr -= 161;
    }

    setBmr(Math.round(baseBmr));
    setTdee(Math.round(baseBmr * activity));

  }, [gender, age, weight, height, activity]);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-amber-600 dark:text-amber-400 p-1.5 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg">
            <FireIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.bmrTitle}
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

      <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        
        {/* Inputs */}
        <div className="flex-1 space-y-6">
           
           {/* Gender Toggle */}
           <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded-xl flex border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === 'male' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {t.bmrMale}
              </button>
              <button 
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === 'female' ? 'bg-white dark:bg-slate-700 shadow text-pink-600 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {t.bmrFemale}
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.bmrAge}</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.bmrHeight}</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.bmrWeight}</label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
           </div>

           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.bmrActivity}</label>
              <select
                value={activity}
                onChange={e => setActivity(parseFloat(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-800 dark:text-white cursor-pointer"
              >
                {activityLevels.map(lvl => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
           </div>
        </div>

        {/* Results */}
        <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-8 border border-amber-100 dark:border-amber-900/30 flex flex-col justify-center gap-8">
            
            <div className="text-center">
               <span className="text-sm font-bold text-amber-600/70 dark:text-amber-400 uppercase tracking-widest">{t.bmrResultBMR}</span>
               <div className="text-6xl font-black text-amber-600 dark:text-amber-500 mt-2">
                 {bmr}
                 <span className="text-base font-medium text-slate-400 ml-2">{t.bmrCalories}</span>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{t.bmrResultTDEE}</span>
                  <span className="font-bold text-slate-800 dark:text-white text-xl">{tdee}</span>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">{t.bmrGoalLose} (-0.5kg)</span>
                     <span className="font-bold text-amber-600 dark:text-amber-400">{Math.max(1200, tdee - 500)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">{t.bmrGoalMaintain}</span>
                     <span className="font-bold text-slate-700 dark:text-slate-300">{tdee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">{t.bmrGoalGain} (+0.5kg)</span>
                     <span className="font-bold text-blue-600 dark:text-blue-400">{tdee + 500}</span>
                  </div>
               </div>
            </div>

        </div>

      </div>
    </div>
  );
};