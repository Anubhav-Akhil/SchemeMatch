import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ApplyProfileLoadingModalProps {
  isOpen: boolean;
  step: number; // 1, 2, or 3
  lang: 'en' | 'hi' | 'pa';
}

export const ApplyProfileLoadingModal: React.FC<ApplyProfileLoadingModalProps> = ({
  isOpen,
  step,
  lang
}) => {
  if (!isOpen) return null;

  const labels = {
    en: {
      title: 'Personalizing Your Scheme Recommender',
      step1: '1/3: Auto-populating profile form with your business & loan details...',
      step2: '2/3: Calculating eligibility & subsidies across 35+ verified schemes...',
      step3: '3/3: Redirecting to Scheme Recommender workspace...',
      note: 'No need to re-fill the form — automatically configured and verified'
    },
    hi: {
      title: 'आपकी योजनाएं और प्रोफ़ाइल तैयार की जा रही हैं',
      step1: '१/३: प्रोफ़ाइल फॉर्म में व्यवसाय और ऋण का विवरण स्वतः भरा जा रहा है...',
      step2: '२/३: ३५+ सरकारी योजनाओं में पात्रता व सब्सिडी की सटीक गणना...',
      step3: '३/३: योजना अनुशंसक (Scheme Recommender) में भेजा जा रहा है...',
      note: 'फॉर्म दोबारा भरने की कोई आवश्यकता नहीं — सीधे स्वतः भरा गया'
    },
    pa: {
      title: 'ਤੁਹਾਡੀਆਂ ਸਕੀਮਾਂ ਅਤੇ ਪ੍ਰੋਫਾਈਲ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ',
      step1: '੧/੩: ਪ੍ਰੋਫਾਈਲ ਫਾਰਮ ਵਿੱਚ ਕਾਰੋਬਾਰ ਅਤੇ ਕਰਜ਼ੇ ਦੇ ਵੇਰਵੇ ਭਰੇ ਜਾ ਰਹੇ ਹਨ...',
      step2: '੨/੩: ੩੫+ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵਿੱਚ ਯੋਗਤਾ ਅਤੇ ਸਬਸਿਡੀ ਦੀ ਗਣਨਾ...',
      step3: '੩/੩: ਸਕੀਮ ਸਿਫ਼ਾਰਿਸ਼ਕਰਤਾ ਵਿੱਚ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
      note: 'ਫਾਰਮ ਦੁਬਾਰਾ ਭਰਨ ਦੀ ਲੋੜ ਨਹੀਂ — ਆਪਣੇ ਆਪ ਭਰਿਆ ਗਿਆ'
    }
  };

  const current = labels[lang] || labels.en;

  return (
    <div className="saathi-loading-popup-overlay" role="dialog" aria-modal="true">
      <div className="saathi-loading-popup-card">
        {/* Tricolor Ring Pulse Animation */}
        <div className="saathi-popup-spinner-ring">
          <div className="saathi-popup-spinner-inner">
            <Sparkles size={24} className="saathi-popup-sparkle-icon" />
          </div>
        </div>

        <h3 className="saathi-popup-title">{current.title}</h3>

        <div className="saathi-popup-step-box">
          <p className="saathi-popup-subtitle">
            {step === 1 && current.step1}
            {step === 2 && current.step2}
            {step >= 3 && current.step3}
          </p>
        </div>

        {/* Progress Track */}
        <div className="saathi-popup-progress-track">
          <div 
            className="saathi-popup-progress-bar" 
            style={{ width: `${Math.min(100, Math.max(30, (step / 3) * 100))}%` }} 
          />
        </div>

        {/* Note badge */}
        <div className="saathi-popup-footer-note">
          <CheckCircle2 size={15} style={{ color: '#16A34A', flexShrink: 0 }} />
          <span>{current.note}</span>
        </div>
      </div>
    </div>
  );
};
