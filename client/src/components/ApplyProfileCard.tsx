import React from 'react';
import { UserProfile, SupportedLanguage } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ApplyProfileCardProps {
  extractedUpdates: Partial<UserProfile>;
  lang: SupportedLanguage;
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
    },
    te: {
      badge: 'సాథీ AI ద్వారా వివరాలు సంగ్రహించబడ్డాయి',
      title: 'స్కీమ్ సిఫార్సుదారులో వీక్షించడానికి సిద్ధంగా ఉంది',
      desc: 'ఈ వివరాలను నేరుగా మీ ప్రొఫైల్ ఫారమ్‌కు వర్తింపజేయండి. ఫారమ్‌ను మళ్లీ పూరించకుండా అన్ని 35+ ధృవీకరించబడిన ప్రభుత్వ పథకాలను చూడండి.',
      btn: 'వివరాలను వర్తింపజేసి పథకాలను చూడండి →',
      trade: 'వృత్తి',
      loan: 'రుణం',
      category: 'వర్గం',
      location: 'ప్రాంతం',
      gender: 'లింగం'
    },
    mr: {
      badge: 'साथी AI द्वारे तपशील नोंदवले गेले',
      title: 'योजना शिफारसकर्त्यामध्ये पाहण्यासाठी तयार',
      desc: 'हे तपशील थेट तुमच्या प्रोफाइल फॉर्मवर लागू करा. फॉर्म पुन्हा न भरता सर्व ३५+ सरकारी योजना आणि अनुदान पहा.',
      btn: 'तपशील लागू करा आणि योजना पहा →',
      trade: 'व्यवसाय',
      loan: 'कर्ज',
      category: 'प्रवर्ग',
      location: 'परिसर',
      gender: 'लिंग'
    },
    bn: {
      badge: 'সাথী AI দ্বারা তথ্য সংগ্রহ করা হয়েছে',
      title: 'স্কিম সুপারিশকারীতে দেখার জন্য প্রস্তুত',
      desc: 'এই বিবরণগুলি সরাসরি আপনার প্রোফাইল ফর্মে প্রয়োগ করুন। পুনরায় ফর্ম পূরণ না করে সমস্ত ৩৫+ সরকারি স্কিম দেখুন।',
      btn: 'বিবরণ প্রয়োগ করুন এবং স্কিম দেখুন →',
      trade: 'কাজ',
      loan: 'ঋণ',
      category: 'শ্রেণি',
      location: 'এলাকা',
      gender: 'লিঙ্গ'
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

