import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { UnitIcon, BackIcon, SwapIcon } from '../Icons';

interface UnitConverterProps {
  onClose?: () => void;
}

type Category = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed' | 'data' | 'time';

interface UnitDef {
  id: string;
  labelKey: string;
  factor: number; // Factor to convert TO base unit
  offset?: number; // For temperature
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ onClose }) => {
  const { t } = useAppContext();
  
  const categories: {id: Category, label: string}[] = [
    { id: 'length', label: t.unitCatLength },
    { id: 'weight', label: t.unitCatWeight },
    { id: 'temp', label: t.unitCatTemp },
    { id: 'area', label: t.unitCatArea },
    { id: 'volume', label: t.unitCatVolume },
    { id: 'speed', label: t.unitCatSpeed },
    { id: 'data', label: t.unitCatData },
    { id: 'time', label: t.unitCatTime },
  ];

  const unitsData: Record<Category, UnitDef[]> = {
    length: [
      { id: 'm', labelKey: 'unit_m', factor: 1 },
      { id: 'km', labelKey: 'unit_km', factor: 1000 },
      { id: 'cm', labelKey: 'unit_cm', factor: 0.01 },
      { id: 'mm', labelKey: 'unit_mm', factor: 0.001 },
      { id: 'mi', labelKey: 'unit_mi', factor: 1609.344 },
      { id: 'yd', labelKey: 'unit_yd', factor: 0.9144 },
      { id: 'ft', labelKey: 'unit_ft', factor: 0.3048 },
      { id: 'in', labelKey: 'unit_in', factor: 0.0254 },
    ],
    weight: [
      { id: 'kg', labelKey: 'unit_kg', factor: 1000 },
      { id: 'g', labelKey: 'unit_g', factor: 1 },
      { id: 'mg', labelKey: 'unit_mg', factor: 0.001 },
      { id: 'lb', labelKey: 'unit_lb', factor: 453.592 },
      { id: 'oz', labelKey: 'unit_oz', factor: 28.3495 },
    ],
    temp: [ // Base is Celsius
      { id: 'c', labelKey: 'unit_c', factor: 1, offset: 0 },
      { id: 'f', labelKey: 'unit_f', factor: 0.5555555556, offset: -32 }, // Special handling in logic
      { id: 'k', labelKey: 'unit_k', factor: 1, offset: -273.15 },
    ],
    area: [
      { id: 'sqm', labelKey: 'unit_sqm', factor: 1 },
      { id: 'sqkm', labelKey: 'unit_sqkm', factor: 1000000 },
      { id: 'sqft', labelKey: 'unit_sqft', factor: 0.092903 },
      { id: 'ha', labelKey: 'unit_ha', factor: 10000 },
      { id: 'acre', labelKey: 'unit_acre', factor: 4046.86 },
    ],
    volume: [
      { id: 'l', labelKey: 'unit_l', factor: 1 },
      { id: 'ml', labelKey: 'unit_ml', factor: 0.001 },
      { id: 'gal', labelKey: 'unit_gal', factor: 3.78541 },
      { id: 'qt', labelKey: 'unit_qt', factor: 0.946353 },
      { id: 'pt', labelKey: 'unit_pt', factor: 0.473176 },
      { id: 'cup', labelKey: 'unit_cup', factor: 0.236588 },
    ],
    speed: [
      { id: 'kph', labelKey: 'unit_kph', factor: 0.277778 }, // to m/s
      { id: 'mph', labelKey: 'unit_mph', factor: 0.44704 },
      { id: 'mps', labelKey: 'unit_mps', factor: 1 },
      { id: 'kn', labelKey: 'unit_kn', factor: 0.514444 },
    ],
    data: [
      { id: 'b', labelKey: 'unit_b', factor: 1 },
      { id: 'kb', labelKey: 'unit_kb', factor: 1024 },
      { id: 'mb', labelKey: 'unit_mb', factor: 1048576 },
      { id: 'gb', labelKey: 'unit_gb', factor: 1073741824 },
      { id: 'tb', labelKey: 'unit_tb', factor: 1099511627776 },
    ],
    time: [
      { id: 'sec', labelKey: 'unit_sec', factor: 1 },
      { id: 'min', labelKey: 'unit_min', factor: 60 },
      { id: 'hr', labelKey: 'unit_hr', factor: 3600 },
      { id: 'day', labelKey: 'unit_day', factor: 86400 },
      { id: 'week', labelKey: 'unit_week', factor: 604800 },
      { id: 'month', labelKey: 'unit_month', factor: 2628000 }, // Approx
      { id: 'year', labelKey: 'unit_year', factor: 31536000 },
    ]
  };

  const [activeCat, setActiveCat] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [result, setResult] = useState<string>('');

  // Update defaults when category changes
  useEffect(() => {
    const units = unitsData[activeCat];
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
    setInputValue(1);
  }, [activeCat]);

  // Calculation Logic
  useEffect(() => {
    const val = parseFloat(inputValue.toString());
    if (isNaN(val)) {
      setResult('---');
      return;
    }

    const units = unitsData[activeCat];
    const fromDef = units.find(u => u.id === fromUnit);
    const toDef = units.find(u => u.id === toUnit);

    if (!fromDef || !toDef) return;

    let res = 0;

    if (activeCat === 'temp') {
      // Temperature conversion logic
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * 5/9;
      else if (fromUnit === 'k') celsius = val - 273.15;
      
      if (toUnit === 'c') res = celsius;
      else if (toUnit === 'f') res = (celsius * 9/5) + 32;
      else if (toUnit === 'k') res = celsius + 273.15;
    } else {
      // Standard linear conversion
      // Convert to base, then to target
      const baseValue = val * fromDef.factor;
      res = baseValue / toDef.factor;
    }

    // Smart rounding: if very small or very large, maybe precision changes, 
    // but typically 4-5 decimal places is good for UI.
    // If integer, show no decimals.
    const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(5)).toString();
    setResult(formatted);

  }, [inputValue, fromUnit, toUnit, activeCat]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = () => {
    if (result && result !== '---') {
      navigator.clipboard.writeText(result);
      // Optional: Toast notification
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header - Slim & Beautiful (Consistent with other tools) */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-teal-600 dark:text-teal-400 p-1.5 bg-teal-100/50 dark:bg-teal-900/20 rounded-lg">
            <UnitIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.unitTitle}
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

      {/* Category Tabs */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#020617]">
        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2 snap-x">
          {categories.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-bold whitespace-nowrap snap-center
                  ${isActive 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' 
                    : 'text-slate-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                  }
                `}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 md:p-10 min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1120]">
        
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
          
          {/* From Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.unitFrom}</label>
             <input
               type="number"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               className="w-full text-4xl font-black bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-200"
               placeholder="0"
             />
             <select
               value={fromUnit}
               onChange={(e) => setFromUnit(e.target.value)}
               className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold outline-none focus:ring-2 focus:ring-teal-500"
             >
               {unitsData[activeCat].map(u => (
                 <option key={u.id} value={u.id}>{(t as any)[u.labelKey]}</option>
               ))}
             </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
             <button 
               onClick={handleSwap}
               className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 text-teal-600 hover:scale-110 active:scale-95 transition-all"
             >
               <SwapIcon className="w-6 h-6" />
             </button>
          </div>

          {/* To Section */}
          <div className="bg-teal-600 dark:bg-teal-900 p-6 rounded-3xl shadow-xl shadow-teal-500/20 border border-teal-500 dark:border-teal-800 space-y-4 text-white relative group">
             <label className="text-xs font-bold text-teal-200 uppercase tracking-wider">{t.unitTo}</label>
             <div className="w-full text-4xl font-black min-h-[40px] break-all">
                {result}
             </div>
             <select
               value={toUnit}
               onChange={(e) => setToUnit(e.target.value)}
               className="w-full p-3 bg-teal-700/50 dark:bg-black/20 rounded-xl border border-teal-500/30 text-white font-bold outline-none focus:bg-teal-700 focus:ring-2 focus:ring-white/50 cursor-pointer [&>option]:text-slate-900"
             >
               {unitsData[activeCat].map(u => (
                 <option key={u.id} value={u.id}>{(t as any)[u.labelKey]}</option>
               ))}
             </select>

             <button 
                onClick={copyResult}
                className="absolute top-4 right-4 rtl:left-4 rtl:right-auto opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/20 rounded-lg hover:bg-white/30"
                title={t.unitCopy}
             >
                <span className="text-xs font-bold">📋</span>
             </button>
          </div>

        </div>

        {/* Formula Display (Optional Educational Touch) */}
        <div className="mt-12 text-center text-slate-400 dark:text-slate-500 text-sm font-mono">
           1 {(t as any)[unitsData[activeCat].find(u => u.id === fromUnit)?.labelKey || '']} ≈ {' '}
           {activeCat === 'temp' ? '...' : (
             (unitsData[activeCat].find(u => u.id === fromUnit)?.factor || 0) / 
             (unitsData[activeCat].find(u => u.id === toUnit)?.factor || 1)
           ).toPrecision(4)} {(t as any)[unitsData[activeCat].find(u => u.id === toUnit)?.labelKey || '']}
        </div>

      </div>
    </div>
  );
};