import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAppContext } from '../../context';
import { QrIcon, LinkIcon, TextIcon, WifiIcon, EmailIcon, PhoneIcon, SmsIcon, ContactIcon, BackIcon } from '../Icons';

type Tab = 'link' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'contact';

interface QrGeneratorProps {
  onClose?: () => void;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('link');
  const [loading, setLoading] = useState(false);
  
  // Customization State
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [includeMargin, setIncludeMargin] = useState(true);

  // Content State
  const [content, setContent] = useState('https://example.com');
  
  // Specific States
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiHidden, setWifiHidden] = useState(false);
  
  const [emailAddr, setEmailAddr] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [phoneNum, setPhoneNum] = useState('');
  
  const [smsNum, setSmsNum] = useState('');
  const [smsBody, setSmsBody] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactTitle, setContactTitle] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR logic
  useEffect(() => {
    let finalContent = '';

    switch (activeTab) {
      case 'link':
      case 'text':
        finalContent = content;
        break;
      case 'wifi':
        const escape = (v: string) => v.replace(/([\\;,:"])/g, '\\$1');
        finalContent = `WIFI:S:${escape(wifiSsid)};T:WPA;P:${escape(wifiPass)};H:${wifiHidden};;`;
        break;
      case 'email':
        finalContent = `mailto:${emailAddr}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`;
        break;
      case 'phone':
        finalContent = `tel:${phoneNum}`;
        break;
      case 'sms':
        finalContent = `SMSTO:${smsNum}:${smsBody}`;
        break;
      case 'contact':
        finalContent = `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL;TYPE=CELL:${contactPhone}
EMAIL:${contactEmail}
ORG:${contactOrg}
TITLE:${contactTitle}
END:VCARD`;
        break;
    }

    if (!finalContent) return;

    const generate = async () => {
      setLoading(true);
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, finalContent, {
            width: 800, // High res for download
            margin: includeMargin ? 2 : 0,
            color: {
              dark: fgColor,
              light: bgColor
            }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(generate, 300); // Debounce
    return () => clearTimeout(timer);
  }, [
    activeTab, content, 
    wifiSsid, wifiPass, wifiHidden,
    emailAddr, emailSub, emailBody,
    phoneNum,
    smsNum, smsBody,
    contactName, contactPhone, contactEmail, contactOrg, contactTitle,
    bgColor, fgColor, includeMargin
  ]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const tabs = [
    { id: 'link', label: t.qrTabLink, icon: LinkIcon },
    { id: 'text', label: t.qrTabText, icon: TextIcon },
    { id: 'wifi', label: t.qrTabWifi, icon: WifiIcon },
    { id: 'email', label: t.qrTabEmail, icon: EmailIcon },
    { id: 'phone', label: t.qrTabPhone, icon: PhoneIcon },
    { id: 'sms', label: t.qrTabSms, icon: SmsIcon },
    { id: 'contact', label: t.qrTabContact, icon: ContactIcon },
  ];

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      
      {/* Service Header - Slim & Beautiful */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        
        {/* Title and Icon Group */}
        <div className="flex items-center gap-2.5">
          <div className="text-blue-600 dark:text-blue-400 p-1.5 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
            <QrIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.qrTitle}
          </h2>
        </div>

        {/* Close/Back Button */}
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

      {/* Tabs Bar - Scrollable Horizontal */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#020617]">
        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2 snap-x">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 min-w-[70px] snap-center
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Preview Section (Left on Desktop) */}
        <div className="w-full lg:w-5/12 p-8 bg-slate-50 dark:bg-[#0B1120] flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-slate-200 dark:border-slate-800">
          <div className="relative group w-full max-w-[320px]">
            {/* Card Mockup */}
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl ring-1 ring-slate-900/5 dark:ring-slate-700/50 transform transition-transform duration-500">
              <div className="aspect-square w-full flex items-center justify-center bg-transparent rounded-2xl overflow-hidden relative">
                 <canvas ref={canvasRef} className="w-full h-full object-contain" />
                 {loading && (
                   <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10">
                     <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   </div>
                 )}
              </div>
            </div>
            
            {/* Visual Flair */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          <p className="mt-8 text-xs font-mono text-slate-400 opacity-60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE PREVIEW
          </p>
        </div>

        {/* Controls Section (Right on Desktop) */}
        <div className="w-full lg:w-7/12 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-[800px]">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                 {t.qrInputLabel}
               </label>
               <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                 {activeTab}
               </span>
            </div>

            {/* Dynamic Inputs Based on Tab */}
            {activeTab === 'link' && (
               <div className="relative">
                 <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t.qrInputPlaceholderLink}
                  className="w-full p-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white"
                 />
                 <div className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400">
                   <LinkIcon className="w-6 h-6" />
                 </div>
               </div>
            )}

            {activeTab === 'text' && (
               <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.qrInputPlaceholderText}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 resize-none text-slate-800 dark:text-white"
               />
            )}

            {activeTab === 'email' && (
               <div className="space-y-4">
                 <input type="email" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} placeholder={t.qrTabEmail} className="input-field" />
                 <input type="text" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} placeholder={t.qrEmailSubject} className="input-field" />
                 <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder={t.qrEmailBody} className="input-field h-32 resize-none" />
               </div>
            )}

            {activeTab === 'wifi' && (
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder={t.qrWifiSsid} className="input-field" />
                   <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder={t.qrWifiPass} className="input-field" />
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <input type="checkbox" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.qrWifiHidden}</label>
                 </div>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="relative">
                <input type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder={t.qrPhoneNum} className="input-field pl-12 rtl:pr-12" />
                <div className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400">
                   <PhoneIcon className="w-6 h-6" />
                </div>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-4">
                <input type="tel" value={smsNum} onChange={(e) => setSmsNum(e.target.value)} placeholder={t.qrPhoneNum} className="input-field" />
                <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder={t.qrSmsMsg} className="input-field h-32 resize-none" />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder={t.qrContactName} className="input-field" />
                  <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder={t.qrContactPhone} className="input-field" />
                </div>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder={t.qrContactEmail} className="input-field" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={contactOrg} onChange={(e) => setContactOrg(e.target.value)} placeholder={t.qrContactOrg} className="input-field" />
                  <input type="text" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder={t.qrContactTitle} className="input-field" />
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-8"></div>

          {/* Customization */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span>🎨</span> {t.qrCustomize}
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t.qrColorBg}</span>
                <div className="relative">
                   <input 
                    type="color" 
                    value={bgColor} 
                    onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-white dark:border-slate-700 shadow-sm p-0 overflow-hidden"
                   />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t.qrColorFg}</span>
                <div className="relative">
                   <input 
                    type="color" 
                    value={fgColor} 
                    onChange={e => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-white dark:border-slate-700 shadow-sm p-0 overflow-hidden"
                   />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
               <input 
                type="checkbox"
                checked={includeMargin}
                onChange={e => setIncludeMargin(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
               />
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.qrNoWatermark}</span>
            </label>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-4 mt-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-base"
          >
            <span className="text-xl">⬇️</span> {t.qrDownload}
          </button>

        </div>
      </div>
      
      {/* Helper styles for inputs injected via jsx styled components logic usually, but here plain classes */}
      <style>{`
        .input-field {
          @apply w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white;
        }
      `}</style>
    </div>
  );
};