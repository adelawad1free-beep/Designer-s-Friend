import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context';
import { NutritionIcon, BackIcon } from '../Icons';

interface NutritionLabelGeneratorProps {
  onClose?: () => void;
}

export const NutritionLabelGenerator: React.FC<NutritionLabelGeneratorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [labelLang, setLabelLang] = useState<'en' | 'ar'>('en');
  
  // State for all nutrition fields
  const [data, setData] = useState({
    servings: '8',
    servingSize: '1 cup (227g)',
    calories: '230',
    totalFat: '8',
    satFat: '1',
    transFat: '0',
    cholesterol: '0',
    sodium: '160',
    totalCarb: '37',
    fiber: '4',
    totalSugar: '12',
    addedSugar: '10',
    protein: '3',
    vitD: '2',
    calcium: '260',
    iron: '8',
    potassium: '235',
  });

  const svgRef = useRef<SVGSVGElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    
    // Prepare image for canvas
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Set high resolution for crisp text
      const scale = 2;
      canvas.width = (svgRef.current?.clientWidth || 300) * scale;
      canvas.height = (svgRef.current?.clientHeight || 600) * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `nutrition-label-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Calculations for % Daily Value (Rough standard based on 2000 cal diet)
  const dv = {
    fat: Math.round((Number(data.totalFat) / 78) * 100) || 0,
    satFat: Math.round((Number(data.satFat) / 20) * 100) || 0,
    chol: Math.round((Number(data.cholesterol) / 300) * 100) || 0,
    sodium: Math.round((Number(data.sodium) / 2300) * 100) || 0,
    carb: Math.round((Number(data.totalCarb) / 275) * 100) || 0,
    fiber: Math.round((Number(data.fiber) / 28) * 100) || 0,
    addedSugar: Math.round((Number(data.addedSugar) / 50) * 100) || 0,
    vitD: Math.round((Number(data.vitD) / 20) * 100) || 0,
    calcium: Math.round((Number(data.calcium) / 1300) * 100) || 0,
    iron: Math.round((Number(data.iron) / 18) * 100) || 0,
    potassium: Math.round((Number(data.potassium) / 4700) * 100) || 0,
  };

  const isAr = labelLang === 'ar';
  const fontFamily = "Cairo, sans-serif";
  // Determine coordinates based on language
  // Force LTR coordinate system, but swap X positions for RTL content
  const txtAnchorStart = isAr ? 'end' : 'start';
  const txtAnchorEnd = isAr ? 'start' : 'end';
  const xStart = isAr ? 290 : 10;
  const xEnd = isAr ? 10 : 290;
  const xIndent = isAr ? 270 : 30; // Indentation for sub-items

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-orange-600 dark:text-orange-400 p-1.5 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg">
            <NutritionIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.nutritionTitle}
          </h2>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Preview Section - Moved to First Position (Right in RTL) */}
        <div className="w-full lg:w-5/12 p-8 bg-slate-100 dark:bg-[#0B1120] flex flex-col items-center justify-start border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800 overflow-y-auto">
          
          <div className="bg-white p-4 shadow-2xl rounded-sm mb-6 transform transition-all hover:scale-[1.01]">
            <svg 
              ref={svgRef}
              width="320" 
              height="600" 
              viewBox="0 0 300 600" 
              xmlns="http://www.w3.org/2000/svg"
              // Ensure LTR direction for stable coordinate system regardless of app direction
              style={{ fontFamily: fontFamily, backgroundColor: 'white', direction: 'ltr' }}
            >
              {/* Border */}
              <rect x="1" y="1" width="298" height="598" fill="none" stroke="black" strokeWidth="2" />
              
              {/* Title */}
              <text x="150" y="35" textAnchor="middle" fontSize="34" fontWeight="900" fill="black">
                 {isAr ? 'حقائق تغذوية' : 'Nutrition Facts'}
              </text>
              
              <line x1="10" y1="45" x2="290" y2="45" stroke="black" strokeWidth="1" />
              
              {/* Servings */}
              <text x={xStart} y="65" textAnchor={txtAnchorStart} fontSize="14" fill="black">
                 {isAr ? `${data.servings} حصص لكل عبوة` : `${data.servings} servings per container`}
              </text>
              
              {/* Serving Size - Combined Label & Value for correct flow */}
              <text x={xStart} y="85" textAnchor={txtAnchorStart} fontSize="14" fill="black">
                 <tspan fontWeight="bold">{isAr ? 'حجم الحصة' : 'Serving size'}</tspan> {data.servingSize}
              </text>
              
              <rect x="10" y="95" width="280" height="12" fill="black" />
              
              {/* Calories */}
              <text x={xStart} y="125" textAnchor={txtAnchorStart} fontSize="12" fontWeight="bold" fill="black">
                 {isAr ? 'الكمية للحصة الواحدة' : 'Amount per serving'}
              </text>
              <text x={xStart} y="155" textAnchor={txtAnchorStart} fontSize="32" fontWeight="900" fill="black">
                 {isAr ? 'السعرات' : 'Calories'}
              </text>
              <text x={xEnd} y="155" textAnchor={txtAnchorEnd} fontSize="40" fontWeight="900" fill="black">
                 {data.calories}
              </text>
              
              <rect x="10" y="170" width="280" height="5" fill="black" />
              
              {/* Daily Value Header */}
              <text x={xEnd} y="185" textAnchor={txtAnchorEnd} fontSize="12" fontWeight="bold" fill="black">
                 {isAr ? '*النسبة المئوية للقيمة اليومية' : '% Daily Value*'}
              </text>
              <line x1="10" y1="190" x2="290" y2="190" stroke="black" strokeWidth="1" />
              
              {/* Nutrients */}
              <g fontSize="13" fill="black">
                {/* Total Fat */}
                <text x={xStart} y="210" textAnchor={txtAnchorStart}><tspan fontWeight="bold">{isAr ? 'الدهون الكلية' : 'Total Fat'}</tspan> {data.totalFat}g</text>
                <text x={xEnd} y="210" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.fat}%</text>
                <line x1="10" y1="216" x2="290" y2="216" stroke="black" strokeWidth="1" />
                
                {/* Sat Fat */}
                <text x={xIndent} y="232" textAnchor={txtAnchorStart}>{isAr ? 'دهون مشبعة' : 'Saturated Fat'} {data.satFat}g</text>
                <text x={xEnd} y="232" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.satFat}%</text>
                <line x1="10" y1="238" x2="290" y2="238" stroke="black" strokeWidth="1" />
                
                {/* Trans Fat */}
                <text x={xIndent} y="254" textAnchor={txtAnchorStart}>{isAr ? 'دهون متحولة' : 'Trans Fat'} {data.transFat}g</text>
                <line x1="10" y1="260" x2="290" y2="260" stroke="black" strokeWidth="1" />
                
                {/* Cholesterol */}
                <text x={xStart} y="276" textAnchor={txtAnchorStart}><tspan fontWeight="bold">{isAr ? 'كوليسترول' : 'Cholesterol'}</tspan> {data.cholesterol}mg</text>
                <text x={xEnd} y="276" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.chol}%</text>
                <line x1="10" y1="282" x2="290" y2="282" stroke="black" strokeWidth="1" />
                
                {/* Sodium */}
                <text x={xStart} y="298" textAnchor={txtAnchorStart}><tspan fontWeight="bold">{isAr ? 'صوديوم' : 'Sodium'}</tspan> {data.sodium}mg</text>
                <text x={xEnd} y="298" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.sodium}%</text>
                <line x1="10" y1="304" x2="290" y2="304" stroke="black" strokeWidth="1" />
                
                {/* Total Carb */}
                <text x={xStart} y="320" textAnchor={txtAnchorStart}><tspan fontWeight="bold">{isAr ? 'الكربوهيدرات' : 'Total Carbohydrate'}</tspan> {data.totalCarb}g</text>
                <text x={xEnd} y="320" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.carb}%</text>
                <line x1="10" y1="326" x2="290" y2="326" stroke="black" strokeWidth="1" />
                
                {/* Fiber */}
                <text x={xIndent} y="342" textAnchor={txtAnchorStart}>{isAr ? 'ألياف غذائية' : 'Dietary Fiber'} {data.fiber}g</text>
                <text x={xEnd} y="342" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.fiber}%</text>
                <line x1="10" y1="348" x2="290" y2="348" stroke="black" strokeWidth="1" />
                
                {/* Sugars */}
                <text x={xIndent} y="364" textAnchor={txtAnchorStart}>{isAr ? 'سكريات كلية' : 'Total Sugars'} {data.totalSugar}g</text>
                <line x1="10" y1="370" x2="290" y2="370" stroke="black" strokeWidth="1" />
                
                {/* Added Sugars */}
                <text x={xIndent} y="386" textAnchor={txtAnchorStart}>
                   {isAr ? `تتضمن ${data.addedSugar}غ سكريات مضافة` : `Includes ${data.addedSugar}g Added Sugars`}
                </text>
                <text x={xEnd} y="386" textAnchor={txtAnchorEnd} fontWeight="bold">{dv.addedSugar}%</text>
                <line x1="10" y1="392" x2="290" y2="392" stroke="black" strokeWidth="1" />
                
                {/* Protein */}
                <text x={xStart} y="408" textAnchor={txtAnchorStart}><tspan fontWeight="bold">{isAr ? 'بروتين' : 'Protein'}</tspan> {data.protein}g</text>
                <rect x="10" y="416" width="280" height="8" fill="black" />
                
                {/* Vitamins */}
                <text x={xStart} y="440" textAnchor={txtAnchorStart}>{isAr ? 'فيتامين د' : 'Vitamin D'} {data.vitD}mcg</text>
                <text x={xEnd} y="440" textAnchor={txtAnchorEnd}>{dv.vitD}%</text>
                <line x1="10" y1="446" x2="290" y2="446" stroke="black" strokeWidth="1" />
                
                <text x={xStart} y="462" textAnchor={txtAnchorStart}>{isAr ? 'كالسيوم' : 'Calcium'} {data.calcium}mg</text>
                <text x={xEnd} y="462" textAnchor={txtAnchorEnd}>{dv.calcium}%</text>
                <line x1="10" y1="468" x2="290" y2="468" stroke="black" strokeWidth="1" />
                
                <text x={xStart} y="484" textAnchor={txtAnchorStart}>{isAr ? 'حديد' : 'Iron'} {data.iron}mg</text>
                <text x={xEnd} y="484" textAnchor={txtAnchorEnd}>{dv.iron}%</text>
                <line x1="10" y1="490" x2="290" y2="490" stroke="black" strokeWidth="1" />
                
                <text x={xStart} y="506" textAnchor={txtAnchorStart}>{isAr ? 'بوتاسيوم' : 'Potassium'} {data.potassium}mg</text>
                <text x={xEnd} y="506" textAnchor={txtAnchorEnd}>{dv.potassium}%</text>
                <line x1="10" y1="512" x2="290" y2="512" stroke="black" strokeWidth="1" />
              </g>

              {/* Footnote */}
              <text x={xStart} y="530" width="280" fontSize="9" fill="black" textAnchor={txtAnchorStart}>
                 {isAr 
                    ? '* تخبرك النسبة المئوية للقيمة اليومية (DV) بمقدار مساهمة' 
                    : '* The % Daily Value (DV) tells you how much a nutrient in'}
              </text>
              <text x={xStart} y="542" width="280" fontSize="9" fill="black" textAnchor={txtAnchorStart}>
                 {isAr 
                    ? 'العنصر الغذائي في حصة الطعام في النظام الغذائي اليومي.' 
                    : 'a serving of food contributes to a daily diet. 2,000 calories'}
              </text>
              <text x={xStart} y="554" width="280" fontSize="9" fill="black" textAnchor={txtAnchorStart}>
                 {isAr 
                    ? 'يستخدم 2000 سعرة حرارية في اليوم لنصائح التغذية العامة.' 
                    : 'a day is used for general nutrition advice.'}
              </text>
            </svg>
          </div>
          
          <button 
             onClick={handleDownload}
             className="bg-slate-800 text-white w-full max-w-[320px] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-lg"
          >
             <span>📥</span> {t.nutExport}
          </button>
        </div>

        {/* Controls Section (Inputs) - Moved to Second Position (Left in RTL) */}
        <div className="w-full lg:w-7/12 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-[800px] bg-white dark:bg-[#0F172A]">
          
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
             <span className="font-bold text-slate-700 dark:text-slate-200">{t.nutLabelLang}</span>
             <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button onClick={() => setLabelLang('ar')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${labelLang === 'ar' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500'}`}>عربي</button>
                <button onClick={() => setLabelLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${labelLang === 'en' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500'}`}>English</button>
             </div>
          </div>

          <div className="space-y-8">
            {/* General Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">{t.nutInfo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup label={t.nutServings} name="servings" value={data.servings} onChange={handleChange} />
                 <InputGroup label={t.nutServingSize} name="servingSize" value={data.servingSize} onChange={handleChange} />
                 <InputGroup label={t.nutCalories} name="calories" value={data.calories} onChange={handleChange} full />
              </div>
            </section>

            {/* Fats */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">{t.nutFats}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup label={t.nutTotalFat} name="totalFat" value={data.totalFat} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutSatFat} name="satFat" value={data.satFat} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutTransFat} name="transFat" value={data.transFat} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutCholesterol} name="cholesterol" value={data.cholesterol} onChange={handleChange} suffix="mg" />
                 <InputGroup label={t.nutSodium} name="sodium" value={data.sodium} onChange={handleChange} suffix="mg" full />
              </div>
            </section>

            {/* Carbs */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">{t.nutCarbs}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup label={t.nutTotalCarb} name="totalCarb" value={data.totalCarb} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutFiber} name="fiber" value={data.fiber} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutSugar} name="totalSugar" value={data.totalSugar} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutAddedSugar} name="addedSugar" value={data.addedSugar} onChange={handleChange} suffix="g" />
                 <InputGroup label={t.nutProtein} name="protein" value={data.protein} onChange={handleChange} suffix="g" full />
              </div>
            </section>

             {/* Vitamins */}
             <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">{t.nutVitamins}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup label={t.nutVitD} name="vitD" value={data.vitD} onChange={handleChange} suffix="mcg" />
                 <InputGroup label={t.nutCalcium} name="calcium" value={data.calcium} onChange={handleChange} suffix="mg" />
                 <InputGroup label={t.nutIron} name="iron" value={data.iron} onChange={handleChange} suffix="mg" />
                 <InputGroup label={t.nutPotassium} name="potassium" value={data.potassium} onChange={handleChange} suffix="mg" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, suffix, full }: any) => (
  <div className={full ? 'col-span-1 md:col-span-2' : ''}>
    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-800 dark:text-white text-sm font-mono"
      />
      {suffix && (
        <span className="absolute top-1/2 -translate-y-1/2 right-3 left-auto rtl:left-3 rtl:right-auto text-xs text-slate-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);