import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ApplyProfileCardProps {
  extractedUpdates: Partial<UserProfile>;
  lang: 'en' | 'hi' | 'pa';
  onApply: (updates: Partial<UserProfile>) => void;
}

export const ApplyProfileCard: React.FC<ApplyProfileCardProps> = ({
  extractedUpdates,
  lang,
  onApply
}) => {
  const labels = {
    en: {
      badge: 'Details Captured by Saathi AI',
      title: 'Ready for Scheme Recommender',
      desc: 'Apply these captured details directly to your profile form. Unlocks all 35+ verified government schemes with exact subsidies and EMI calculation without re-filling.',
      btn: 'Apply Details & View in Scheme Recommender →',
      trade: 'Trade',
      loan: 'Loan',
      category: 'Category',
      location: 'Location',
      gender: 'Gender'
    },
    hi: {
      badge: 'साथी AI द्वारा विवरण संकलित',
      title: 'योजना अनुशंसक में देखने हेतु तैयार',
      desc: 'इन विवरणों को सीधे अपने प्रोफ़ाइल फॉर्म में लागू करें। फॉर्म दोबारा भरे बिना सभी ३५+ सरकारी योजनाओं की सब्सिडी और ईएमआई अनलॉक करें।',
      btn: 'विवरण लागू करें और योजनाएं देखें →',
      trade: 'व्यवसाय',
      loan: 'ऋण राशि',
      category: 'श्रेणी',
      location: 'क्षेत्र',
      gender: 'लिंग'
    },
    pa: {
      badge: 'ਸਾਥੀ AI ਦੁਆਰਾ ਵੇਰਵੇ ਦਰਜ',
      title: 'ਸਕੀਮ ਸਿਫ਼ਾਰਿਸ਼ਕਰਤਾ ਵਿੱਚ ਵੇਖਣ ਲਈ ਤਿਆਰ',
      desc: 'ਇਹਨਾਂ ਵੇਰਵਿਆਂ ਨੂੰ ਸਿੱਧਾ ਆਪਣੇ ਪ੍ਰੋਫਾਈਲ ਫਾਰਮ ਵਿੱਚ ਲਾਗੂ ਕਰੋ। ਫਾਰਮ ਦੁਬਾਰਾ ਭਰੇ ਬਿਨਾਂ ਸਾਰੀਆਂ 35+ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵੇਖੋ।',
      btn: 'ਵੇਰਵੇ ਲਾਗੂ ਕਰੋ ਅਤੇ ਸਕੀਮਾਂ ਵੇਖੋ →',
      trade: 'ਕੰਮ',
      loan: 'ਕਰਜ਼ਾ',
      category: 'ਸ਼੍ਰੇਣੀ',
      location: 'ਖੇਤਰ',
      gender: 'ਲਿੰਗ'
    }
  };

  const l = labels[lang] || labels.en;

  const hasAnyField = Boolean(
    extractedUpdates.tradeType ||
    extractedUpdates.sector ||
    extractedUpdates.requiredLoanAmount ||
    extractedUpdates.category ||
    extractedUpdates.locationType ||
    extractedUpdates.gender
  );

  if (!hasAnyField) return null;

  return (
    <div className="saathi-apply-profile-card">
      <div className="saathi-apply-card-header">
        <div className="saathi-apply-badge">
          <Sparkles size={13} style={{ color: '#EA580C' }} />
          <span>{l.badge}</span>
        </div>
        <div className="saathi-apply-gov-verified">
          <ShieldCheck size={12} style={{ color: '#16A34A' }} />
          <span>35+ Schemes</span>
        </div>
      </div>

      <div className="saathi-apply-card-title">{l.title}</div>

      {/* Pill tags showing captured parameters */}
      <div className="saathi-extracted-pills">
        {extractedUpdates.tradeType && (
          <span className="saathi-pill">
            <strong>{l.trade}:</strong> {extractedUpdates.tradeType}
          </span>
        )}
        {extractedUpdates.sector && !extractedUpdates.tradeType && (
          <span className="saathi-pill">
            <strong>{l.trade}:</strong> {extractedUpdates.sector}
          </span>
        )}
        {extractedUpdates.requiredLoanAmount && (
          <span className="saathi-pill highlight">
            <strong>{l.loan}:</strong> ₹{Number(extractedUpdates.requiredLoanAmount).toLocaleString('en-IN')}
          </span>
        )}
        {extractedUpdates.category && (
          <span className="saathi-pill">
            <strong>{l.category}:</strong> {extractedUpdates.category}
          </span>
        )}
        {extractedUpdates.locationType && (
          <span className="saathi-pill">
            <strong>{l.location}:</strong> {extractedUpdates.locationType}
          </span>
        )}
        {extractedUpdates.gender && (
          <span className="saathi-pill">
            <strong>{l.gender}:</strong> {extractedUpdates.gender}
          </span>
        )}
      </div>

      <p className="saathi-apply-card-desc">{l.desc}</p>

      <button
        type="button"
        className="saathi-apply-action-btn"
        onClick={() => onApply(extractedUpdates)}
      >
        <span>{l.btn}</span>
      </button>
    </div>
  );
};

