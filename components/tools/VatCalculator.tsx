import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { CalculatorIcon, BackIcon } from '../Icons';

interface VatCalculatorProps {
  onClose?: () => void;
}

export const VatCalculator: React.FC<VatCalculatorProps> = ({ onClose }) => {
  const { t } = useAppContext();
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

    let net = 0;
    let tax = 0;
    let total = 0;

    if (mode === 'exclusive') {
      // Add Tax
      net = val;
      tax = val * (taxRate / 100);
      total = net + tax;
    } else {
      // Extract Tax
      // Total = Net * (1 + Rate/100)
      // Net = Total / (1 + Rate/100)
      total = val;
      net = total / (1 + (taxRate / 100));
      tax = total - net;
    }

    setResult({ net, tax, total });
  }, [amount, rate, mode]);

  const formatCurrency = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-emerald-600 dark:text-emerald-400 p-1.5 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg">
            <CalculatorIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.vatTitle}
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

      <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
        
        {/* Input Section */}
        <div className="flex-1 space-y-6">
           <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.vatAmountInput}</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-4 rounded-xl text-lg font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{t.vatRateInput}</label>
                <div className="flex gap-2">
                   {[5, 15, 100].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setRate(r.toString())}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border ${rate === r.toString() ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                      >
                         {r}%
                      </button>
                   ))}
                   <input 
                    type="number"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    className="flex-1 p-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                   />
                </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">{t.vatMode}</label>
              
              <button 
                onClick={() => setMode('exclusive')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${mode === 'exclusive' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                 <span className="font-bold">{t.vatModeExcl}</span>
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'exclusive' ? 'border-emerald-500' : 'border-slate-300'}`}>
                    {mode === 'exclusive' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                 </div>
              </button>

              <button 
                onClick={() => setMode('inclusive')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${mode === 'inclusive' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                 <span className="font-bold">{t.vatModeIncl}</span>
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'inclusive' ? 'border-emerald-500' : 'border-slate-300'}`}>
                    {mode === 'inclusive' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                 </div>
              </button>
           </div>
        </div>

        {/* Result Section */}
        <div className="flex-1 bg-slate-900 dark:bg-black rounded-3xl p-8 text-white flex flex-col justify-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                   <span className="text-emerald-200 text-sm font-medium">{t.vatResultNet}</span>
                   <span className="text-2xl font-bold font-mono">{formatCurrency(result.net)}</span>
                </div>

                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                   <span className="text-emerald-200 text-sm font-medium">{t.vatResultTax} ({rate}%)</span>
                   <span className="text-2xl font-bold font-mono text-emerald-400">+{formatCurrency(result.tax)}</span>
                </div>

                <div className="pt-2">
                   <span className="text-emerald-200 text-sm font-bold uppercase tracking-widest block mb-2">{t.vatResultTotal}</span>
                   <span className="text-5xl md:text-6xl font-black font-mono tracking-tight">{formatCurrency(result.total)}</span>
                </div>
            </div>

            <button 
               onClick={() => setAmount('')}
               className="mt-auto w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
            >
               {t.vatReset}
            </button>
        </div>

      </div>
    </div>
  );
};