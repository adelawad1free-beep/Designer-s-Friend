import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { CalculatorIcon, BackIcon } from '../Icons';

interface VatCalculatorProps {
  onClose?: () => void;
}

export const VatCalculator: React.FC<VatCalculatorProps> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('15');
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const [result, setResult] = useState({
    net: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    const val = parseFloat(amount);
    const taxRate = parseFloat(rate);

    if (isNaN(val) || isNaN(taxRate)) {
      setResult({ net: 0, tax: 0, total: 0 });
      return;
    }

    let net = 0, tax = 0, total = 0;

    if (mode === 'exclusive') {
      net = val;
      tax = val * (taxRate / 100);
      total = net + tax;
    } else {
      total = val;
      net = total / (1 + (taxRate / 100));
      tax = total - net;
    }

    setResult({ net, tax, total });
  }, [amount, rate, mode]);

  const formatCurrency = (num: number) => {
    return num.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
      
      {/* Header - More Contrast */}
      <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="text-emerald-600 dark:text-emerald-400 p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <CalculatorIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.vatTitle}</h2>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all border border-transparent hover:border-red-100"
          >
            <BackIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 bg-slate-50/30 dark:bg-transparent">
        
        {/* Input Controls */}
        <div className="flex-1 space-y-10">
           
           <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                {t.vatAmountInput || 'Amount'}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-8 rounded-[2rem] text-5xl font-black bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder-slate-200 shadow-sm"
                />
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg rtl:right-8 rtl:left-auto uppercase tracking-tighter">SAR</span>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                {t.vatRateInput || 'Tax Rate'}
              </label>
              <div className="grid grid-cols-4 gap-3">
                 {[5, 10, 15, 20].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setRate(r.toString())}
                      className={`py-4 rounded-2xl text-base font-black transition-all border-2 ${rate === r.toString() ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-emerald-400'}`}
                    >
                       {r}%
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                {t.vatMode || 'Calculation Mode'}
              </label>
              <div className="bg-white dark:bg-slate-900 p-1.5 rounded-3xl flex border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                <button 
                  onClick={() => setMode('exclusive')}
                  className={`flex-1 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all ${mode === 'exclusive' ? 'bg-emerald-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-800'}`}
                >
                   {t.vatModeExcl || 'Exclusive'}
                </button>
                <button 
                  onClick={() => setMode('inclusive')}
                  className={`flex-1 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all ${mode === 'inclusive' ? 'bg-emerald-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-800'}`}
                >
                   {t.vatModeIncl || 'Inclusive'}
                </button>
              </div>
           </div>
        </div>

        {/* High-Contrast Results Panel */}
        <div className="flex-1 bg-slate-900 dark:bg-black rounded-[3rem] p-10 md:p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl ring-2 ring-white/5">
            {/* Subtle Design Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                   <span className="text-slate-200 text-[11px] font-black uppercase tracking-[0.25em]">
                    {t.vatResultNet || 'Net Amount'}
                   </span>
                   <span className="text-2xl font-black font-mono tracking-tight text-white">{formatCurrency(result.net)}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                   <span className="text-emerald-300 text-[11px] font-black uppercase tracking-[0.25em]">
                    {t.vatResultTax || 'Tax Value'}
                   </span>
                   <span className="text-2xl font-black font-mono tracking-tight text-emerald-400">+{formatCurrency(result.tax)}</span>
                </div>

                <div className="pt-4">
                   <span className="text-slate-200 text-[11px] font-black uppercase tracking-[0.3em] block mb-4">
                    {t.vatResultTotal || 'Grand Total'}
                   </span>
                   <div className="flex items-baseline gap-4">
                      <span className="text-7xl font-black font-mono tracking-tighter text-white drop-shadow-lg">
                        {formatCurrency(result.total)}
                      </span>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">SAR</span>
                   </div>
                </div>

                <button 
                   onClick={() => setAmount('')}
                   className="w-full py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:text-emerald-400 mt-10 active:scale-95"
                >
                   {t.vatReset || 'Reset'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};