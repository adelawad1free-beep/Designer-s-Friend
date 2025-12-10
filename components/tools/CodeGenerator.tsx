import React, { useState } from 'react';
import { generateDesignCode } from '../../services/geminiService';
import { GeneratedCode } from '../../types';
import { useAppContext } from '../../context';
import { CodeIcon } from '../Icons';

export const CodeGenerator: React.FC = () => {
  const { t, language } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateDesignCode(prompt, language);
      setResult(data);
    } catch (err) {
      setError(t.codeGenError);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.html);
      alert(t.codeGenCopied);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 transition-colors overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
             <CodeIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.codeGenTitle}
          </h2>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            {t.codeGenSubtitle}
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.codeGenPlaceholder}
            className="w-full p-4 h-40 rounded-2xl border border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none transition-all resize-none bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
              ${loading || !prompt.trim() 
                ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            {loading ? t.codeGenLoading : t.codeGenBtn}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/30">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.codeGenPreview}</h3>
             </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900 min-h-[200px] flex items-center justify-center overflow-auto">
                <div 
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: result.html }} 
                />
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                ℹ️ {result.explanation}
              </p>
            </div>
          </div>

          {/* Code Output */}
          <div className="bg-slate-900 dark:bg-black rounded-[2rem] p-6 shadow-lg text-left overflow-hidden" dir="ltr">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-300 font-mono text-xs uppercase tracking-widest">{t.codeGenHtmlTitle}</h3>
              <button 
                onClick={copyToClipboard}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
              >
                {t.codeGenCopy}
              </button>
            </div>
            <pre className="overflow-x-auto text-sm text-green-400 font-mono p-4 bg-black/30 rounded-xl max-h-96 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <code>{result.html}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
