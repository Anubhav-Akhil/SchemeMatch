import React from 'react';
import { 
  ChatEmiCardData, 
  ChatDocumentItem, 
  ChatPartnerItem, 
  ChatWhatIfCardData, 
  ChatEligibilityCardData,
  ChatFeatureMode,
  SupportedLanguage
} from '../types';
import { 
  Target, 
  CheckCircle2, 
  BadgePercent, 
  FileText, 
  Building2, 
  SlidersHorizontal, 
  ArrowUpRight, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  FileCheck
} from 'lucide-react';

export interface FeatureChip {
  id: ChatFeatureMode;
  label: Record<SupportedLanguage, string>;
  icon: React.ReactNode;
  prompt: Record<SupportedLanguage, string>;
}

export const SAATHI_FEATURES: FeatureChip[] = [
  {
    id: 'recommendation',
    icon: <Target size={14} />,
    label: {
      en: '🎯 Find a scheme',
      hi: '🎯 योजना खोजें',
      pa: '🎯 ਸਕੀਮ ਲੱਭੋ',
      te: '🎯 పథకం కనుగొనండి',
      mr: '🎯 योजना शोधा',
      bn: '🎯 স্কিম খুঁজুন'
    },
    prompt: {
      en: 'Find a scheme based on my work and profile',
      hi: 'मेरी प्रोफाइल और कार्य के अनुसार सर्वोत्तम योजनाएं खोजें',
      pa: 'ਮੇਰੇ ਕੰਮ ਅਤੇ ਪ੍ਰੋਫਾਈਲ ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲੱਭੋ',
      te: 'నా పని మరియు ప్రొఫైల్ ఆధారంగా ఉత్తమ ప్రభుత్వ పథకాలను కనుగొనండి',
      mr: 'माझ्या कामाच्या आणि प्रोफाइलच्या आधारावर सर्वोत्तम सरकारी योजना शोधा',
      bn: 'আমার কাজ এবং প্রোফাইল অনুযায়ী সেরা সরকারি স্কিমগুলি খুঁজুন'
    }
  },
  {
    id: 'documents',
    icon: <FileText size={14} />,
    label: {
      en: '📄 Documents needed',
      hi: '📄 आवश्यक दस्तावेज़',
      pa: '📄 ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
      te: '📄 అవసరమైన పత్రాలు',
      mr: '📄 आवश्यक कागदपत्रे',
      bn: '📄 প্রয়োজনীয় নথি'
    },
    prompt: {
      en: 'What documents are needed to apply for loans?',
      hi: 'ऋण आवेदन के लिए आवश्यक दस्तावेज़ों की सूची क्या है?',
      pa: 'ਕਰਜ਼ਾ ਅਰਜ਼ੀ ਲਈ ਕਿਹੜੇ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?',
      te: 'రుణ దరఖాస్తు కోసం ఏ పత్రాలు అవసరం?',
      mr: 'कर्ज अर्जासाठी कोणती आवश्यक कागदपत्रे लागतात?',
      bn: 'ঋণ আবেদনের জন্য কী কী প্রয়োজনীয় নথি দরকার?'
    }
  },
  {
    id: 'emi',
    icon: <BadgePercent size={14} />,
    label: {
      en: '💰 Calculate EMI',
      hi: '💰 EMI गणना करें',
      pa: '💰 EMI ਗਣਨਾ ਕਰੋ',
      te: '💰 EMI లెక్కించండి',
      mr: '💰 EMI गणना करा',
      bn: '💰 EMI গণনা করুন'
    },
    prompt: {
      en: 'Calculate loan EMI, interest rate, and subsidy',
      hi: 'ऋण की EMI, ब्याज दर और सरकारी सब्सिडी की गणना करें',
      pa: 'ਕਰਜ਼ੇ ਦੀ EMI, ਵਿਆਜ ਦਰ ਅਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਦੀ ਗਣਨਾ ਕਰੋ',
      te: 'రుణం EMI, వడ్డీ రేటు మరియు ప్రభుత్వ సబ్సిడీని లెక్కించండి',
      mr: 'कर्जाचा EMI, व्याजदर आणि सरकारी अनुदानाची गणना करा',
      bn: 'ঋণের EMI, সুদের হার এবং সরকারি ভর্তুকি গণনা করুন'
    }
  },
  {
    id: 'partners',
    icon: <Building2 size={14} />,
    label: {
      en: '🏦 Where to apply',
      hi: '🏦 कहाँ आवेदन करें',
      pa: '🏦 ਕਿੱਥੇ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ',
      te: '🏦 ఎక్కడ దరఖాస్తు చేయాలి',
      mr: '🏦 कुठे अर्ज करावा',
      bn: '🏦 কোথায় আবেদন করবেন'
    },
    prompt: {
      en: 'Where to apply and authorized channel partners',
      hi: 'कहाँ आवेदन करें और अधिकृत चैनल पार्टनर कौन से हैं?',
      pa: 'ਕਿੱਥੇ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ ਅਤੇ ਅਧਿਕਾਰਤ ਚੈਨਲ ਪਾਰਟਨਰ ਕਿਹੜੇ ਹਨ?',
      te: 'ఎక్కడ దరఖాస్తు చేయాలి మరియు అధీకృత ఛానల్ భాగస్వాములు ఎవరు?',
      mr: 'कुठे अर्ज करावा आणि अधिकृत चॅनेल भागीदार कोण आहेत?',
      bn: 'কোথায় আবেদন করতে হবে এবং অনুমোদিত চ্যানেল পার্টনার কারা?'
    }
  },
  {
    id: 'eligibility',
    icon: <CheckCircle2 size={14} />,
    label: {
      en: '✅ Eligibility Checker',
      hi: '✅ पात्रता जांच',
      pa: '✅ ਯੋਗਤਾ ਜਾਂਚ',
      te: '✅ అర్హత తనిఖీ',
      mr: '✅ पात्रता तपासणी',
      bn: '✅ যোগ্যতা পরীক্ষা'
    },
    prompt: {
      en: 'Check my eligibility score and explain the criteria',
      hi: 'मेरी पात्रता स्कोर की जाँच करें और मानदंड बताएं',
      pa: 'ਮੇਰਾ ਯੋਗਤਾ ਸਕੋਰ ਚੈੱਕ ਕਰੋ ਅਤੇ ਮਾਪਦੰਡ ਦੱਸੋ',
      te: 'నా అర్హత స్కోర్‌ను తనిఖీ చేయండి మరియు ప్రమాణాలను వివరించండి',
      mr: 'माझा पात्रता स्कोअर तपासा आणि निकष स्पष्ट करा',
      bn: 'আমার যোগ্যতার স্কোর পরীক্ষা করুন এবং মানদণ্ড ব্যাখ্যা করুন'
    }
  },
  {
    id: 'whatif',
    icon: <SlidersHorizontal size={14} />,
    label: {
      en: '🧮 What-If Simulator',
      hi: '🧮 व्हॉट-इफ सिमुलेटर',
      pa: '🧮 What-If ਸਿਮੂਲੇਟਰ',
      te: '🧮 వాట్-ఇఫ్ సిమ్యులేటర్',
      mr: '🧮 व्हॉट-इफ सिम्युलेटर',
      bn: '🧮 হোয়াট-ইফ সিমুলেটর'
    },
    prompt: {
      en: 'Show what-if simulation: how changing location or income affects eligibility',
      hi: 'व्हॉट-इफ सिमुलेशन दिखाएं: स्थान या आय बदलने से पात्रता कैसे प्रभावित होती है',
      pa: 'What-If ਸਿਮੂਲੇਸ਼ਨ ਦਿਖਾਓ: ਸਥਾਨ ਜਾਂ ਆਮਦਨ ਬਦਲਣ ਨਾਲ ਯੋਗਤਾ ਕਿਵੇਂ ਬਦਲਦੀ ਹੈ',
      te: 'వాట్-ఇఫ్ సిమ్యులేషన్ చూపించండి: ప్రాంతం లేదా ఆదాయం మార్చడం అర్హతను ఎలా ప్రభావితం చేస్తుంది',
      mr: 'व्हॉट-इफ सिम्युलेशन दाखवा: स्थान किंवा उत्पन्न बदलल्याने पात्रतेवर कसा परिणाम होतो',
      bn: 'হোয়াট-ইফ সিমুলেশন দেখান: অবস্থান বা আয় পরিবর্তন যোগ্যতাকে কীভাবে প্রভাবিত করে'
    }
  }
];

export const FeatureChipsBar: React.FC<{
  activeMode: ChatFeatureMode;
  onSelectMode: (mode: ChatFeatureMode, prompt: string) => void;
  lang?: string;
}> = ({ activeMode, onSelectMode, lang = 'en' }) => {
  return (
    <div className="saathi-chips-container" role="tablist" aria-label="Saathi AI Feature Assistants">
      <div className="saathi-chips-scroll">
        {SAATHI_FEATURES.map((feat) => {
          const isActive = activeMode === feat.id;
          const curLang = (lang as SupportedLanguage) || 'en';
          const label = feat.label[curLang] || feat.label.en;
          const promptText = feat.prompt[curLang] || feat.prompt.en;
          return (
            <button
              key={feat.id}
              type="button"
              className={`saathi-feature-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectMode(feat.id, promptText)}
              title={promptText}
            >
              <span className="chip-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const EmiCardView: React.FC<{ 
  card: ChatEmiCardData; 
  onPromptClick?: (p: string) => void;
  lang?: string;
}> = ({ card, onPromptClick, lang = 'en' }) => {
  return (
    <div className="saathi-card saathi-card-emi">
      <div className="saathi-card-header">
        <div className="card-badge emi-badge">
          <BadgePercent size={13} />
          <span>{lang === 'hi' ? 'ऋण व ईएमआई विश्लेषण' : lang === 'pa' ? 'ਕਰਜ਼ਾ ਅਤੇ EMI ਵੇਰਵਾ' : 'Loan & EMI Analysis'}</span>
        </div>
        <span className="card-scheme-pill">{card.schemeName}</span>
      </div>

      <div className="emi-highlight-box">
        <div className="emi-amount-wrap">
          <span className="emi-label">{lang === 'hi' ? 'अनुमानित शुद्ध ईएमआई' : lang === 'pa' ? 'ਅਨੁਮਾਨਿਤ ਮਾਸਿਕ EMI' : 'Net Monthly EMI'}</span>
          <div className="emi-val">₹{card.monthlyEmi.toLocaleString('en-IN')}<span className="emi-period">/{lang === 'hi' ? 'माह' : lang === 'pa' ? 'ਮਹੀਨਾ' : 'mo'}</span></div>
        </div>
        <div className="subsidy-pill">
          <span>{lang === 'hi' ? 'सब्सिडी' : lang === 'pa' ? 'ਸਬਸਿਡੀ' : 'Subsidy'}: ₹{card.subsidyAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="emi-grid">
        <div className="emi-metric">
          <span className="metric-title">{lang === 'hi' ? 'कुल ऋण' : lang === 'pa' ? 'ਕੁੱਲ ਕਰਜ਼ਾ' : 'Total Loan'}</span>
          <span className="metric-num">₹{card.loanAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="emi-metric">
          <span className="metric-title">{lang === 'hi' ? 'ब्याज दर' : lang === 'pa' ? 'ਵਿਆਜ ਦਰ' : 'Interest Rate'}</span>
          <span className="metric-num">{card.interestRate}% p.a.</span>
        </div>
        <div className="emi-metric">
          <span className="metric-title">{lang === 'hi' ? 'अवधि' : lang === 'pa' ? 'ਮਿਆਦ' : 'Tenure'}</span>
          <span className="metric-num">{card.tenureMonths / 12} {lang === 'hi' ? 'वर्ष' : lang === 'pa' ? 'ਸਾਲ' : 'Years'} ({card.tenureMonths}m)</span>
        </div>
        <div className="emi-metric">
          <span className="metric-title">{lang === 'hi' ? 'मोरेटोरियम' : lang === 'pa' ? 'ਮੋਰੇਟੋਰੀਅਮ' : 'Moratorium'}</span>
          <span className="metric-num">{card.moratoriumMonths || 6} {lang === 'hi' ? 'माह' : lang === 'pa' ? 'ਮਹੀਨੇ' : 'Months'}</span>
        </div>
      </div>

      <div className="card-note">
        <Sparkles size={12} className="text-saffron" />
        <span>{lang === 'hi' ? 'सरकारी सब्सिडी बैंक खाते में क्रेडिट होने के बाद मूलधन स्वतः घट जाता है।' : lang === 'pa' ? 'ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਆਉਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਰਕਮ ਘੱਟ ਜਾਂਦੀ ਹੈ।' : 'Capital subsidy reduces the net principal, lowering your debt burden from Day 1.'}</span>
      </div>

      {onPromptClick && (
        <div className="card-actions">
          <button 
            type="button" 
            className="card-quick-action" 
            onClick={() => onPromptClick('What documents are needed for this loan approval?')}
          >
            {lang === 'hi' ? 'दस्तावेज़ आवश्यकता देखें →' : lang === 'pa' ? 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਦੇਖੋ →' : 'View Required Documents →'}
          </button>
        </div>
      )}
    </div>
  );
};

export const DocumentChecklistCardView: React.FC<{ 
  card: { schemeName: string; documents: ChatDocumentItem[] }; 
  onPromptClick?: (p: string) => void;
  lang?: string;
}> = ({ card, onPromptClick, lang = 'en' }) => {
  return (
    <div className="saathi-card saathi-card-docs">
      <div className="saathi-card-header">
        <div className="card-badge docs-badge">
          <FileCheck size={13} />
          <span>{lang === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : lang === 'pa' ? 'ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਸੂਚੀ' : 'Document Checklist'}</span>
        </div>
        <span className="card-scheme-pill">{card.schemeName}</span>
      </div>

      <div className="docs-list">
        {card.documents.map((doc, idx) => (
          <div key={idx} className="doc-item-row">
            <div className="doc-item-left">
              {doc.status === 'Ready' ? (
                <CheckCircle2 size={16} className="doc-icon ready" />
              ) : (
                <AlertCircle size={16} className="doc-icon missing" />
              )}
              <div>
                <div className="doc-item-name">
                  {doc.name}
                  {doc.mandatory && <span className="mandatory-tag">{lang === 'hi' ? 'अनिवार्य' : lang === 'pa' ? 'ਜ਼ਰੂਰੀ' : 'Mandatory'}</span>}
                </div>
                {doc.howToGet && (
                  <div className="doc-how-to">{doc.howToGet}</div>
                )}
              </div>
            </div>
            <span className={`doc-status-badge ${doc.status === 'Ready' ? 'ready' : 'missing'}`}>
              {doc.status === 'Ready' ? (lang === 'hi' ? 'तैयार' : lang === 'pa' ? 'ਤਿਆਰ' : 'Ready') : (lang === 'hi' ? 'आवश्यक' : lang === 'pa' ? 'ਬਾਕੀ' : 'Pending')}
            </span>
          </div>
        ))}
      </div>

      <div className="card-note docs-note">
        <Sparkles size={12} />
        <span>{lang === 'hi' ? 'उद्यम पंजीकरण और डिजिटल जाति प्रमाण पत्र होने से लोन 3 गुना जल्दी पास होता है।' : lang === 'pa' ? 'ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਡਿਜੀਟਲ ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਕਰਜ਼ਾ ਬਹੁਤ ਜਲਦੀ ਪਾਸ ਹੁੰਦਾ ਹੈ।' : 'Having Udyam Registration & digitized certificates accelerates sanction by 3x.'}</span>
      </div>
    </div>
  );
};

export const PartnerFinderCardView: React.FC<{ 
  card: { nearestPartners: ChatPartnerItem[] }; 
  onPromptClick?: (p: string) => void;
  lang?: string;
}> = ({ card, onPromptClick, lang = 'en' }) => {
  return (
    <div className="saathi-card saathi-card-partners">
      <div className="saathi-card-header">
        <div className="card-badge partners-badge">
          <Building2 size={13} />
          <span>{lang === 'hi' ? 'निकटतम अधिकृत पार्टनर' : lang === 'pa' ? 'ਅਧਿਕਾਰਤ ਚੈਨਲ ਪਾਰਟਨਰ' : 'Authorized Channel Partners'}</span>
        </div>
      </div>

      <div className="partners-list">
        {card.nearestPartners.map((pt, idx) => (
          <div key={idx} className="partner-item-card">
            <div className="partner-top">
              <div>
                <div className="partner-name">{pt.name}</div>
                <span className="partner-type-tag">{pt.type}</span>
              </div>
              <div className="partner-dist">
                <MapPin size={12} />
                <span>{pt.distanceKm} km</span>
              </div>
            </div>

            <div className="partner-addr">{pt.address}</div>

            <div className="partner-auth">
              <strong>{lang === 'hi' ? 'अधिकृत योजनाएं:' : lang === 'pa' ? 'ਸਕੀਮਾਂ:' : 'Authorized for:'}</strong> {pt.schemeAuthorization}
            </div>
          </div>
        ))}
      </div>

      {onPromptClick && (
        <div className="card-actions">
          <button 
            type="button" 
            className="card-quick-action" 
            onClick={() => onPromptClick('What documents should I carry to the SCA office?')}
          >
            {lang === 'hi' ? 'आवेदन हेतु आवश्यक तैयारी पूछें →' : lang === 'pa' ? 'ਅਰਜ਼ੀ ਲਈ ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ →' : 'Application Guidance & Steps →'}
          </button>
        </div>
      )}
    </div>
  );
};

export const WhatIfCardView: React.FC<{ 
  card: ChatWhatIfCardData; 
  onPromptClick?: (p: string) => void;
  lang?: string;
}> = ({ card, onPromptClick, lang = 'en' }) => {
  const savings = Math.max(0, card.baselineEmi - card.improvedEmi);
  const extraSubsidy = Math.max(0, card.improvedSubsidy - card.baselineSubsidy);

  return (
    <div className="saathi-card saathi-card-whatif">
      <div className="saathi-card-header">
        <div className="card-badge whatif-badge">
          <SlidersHorizontal size={13} />
          <span>{lang === 'hi' ? 'व्हॉट-इफ सिमुलेशन' : lang === 'pa' ? 'What-If ਸਿਮੂਲੇਸ਼ਨ' : 'What-If Eligibility Simulation'}</span>
        </div>
      </div>

      <div className="whatif-comparison-table">
        <div className="whatif-col baseline">
          <span className="col-header">{lang === 'hi' ? 'वर्तमान / सामान्य' : lang === 'pa' ? 'ਮੌਜੂਦਾ ਵਿਕਲਪ' : 'Baseline Scenario'}</span>
          <div className="col-metric">
            <span className="m-label">{lang === 'hi' ? 'सब्सिडी' : lang === 'pa' ? 'ਸਬਸਿਡੀ' : 'Subsidy'}</span>
            <span className="m-val">₹{card.baselineSubsidy.toLocaleString('en-IN')}</span>
          </div>
          <div className="col-metric">
            <span className="m-label">{lang === 'hi' ? 'मासिक ईएमआई' : lang === 'pa' ? 'ਮਾਸਿਕ ਕਿਸ਼ਤ' : 'Monthly EMI'}</span>
            <span className="m-val">₹{card.baselineEmi.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="whatif-col improved">
          <span className="col-header highlighted">{lang === 'hi' ? 'अनुकूलित (ग्रामीण/श्रेणी)' : lang === 'pa' ? 'ਅਨੁਕੂਲਿਤ ਵਿਕਲਪ' : 'Optimized Profile'}</span>
          <div className="col-metric">
            <span className="m-label">{lang === 'hi' ? 'सब्सिडी' : lang === 'pa' ? 'ਸਬਸਿਡੀ' : 'Subsidy'}</span>
            <span className="m-val highlight">₹{card.improvedSubsidy.toLocaleString('en-IN')}</span>
          </div>
          <div className="col-metric">
            <span className="m-label">{lang === 'hi' ? 'मासिक ईएमआई' : lang === 'pa' ? 'ਮਾਸਿਕ ਕਿਸ਼ਤ' : 'Monthly EMI'}</span>
            <span className="m-val highlight">₹{card.improvedEmi.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="whatif-gain-bar">
        <div className="gain-metric">
          <span className="gain-label">{lang === 'hi' ? 'अतिरिक्त सब्सिडी लाभ' : lang === 'pa' ? 'ਵਾਧੂ ਸਬਸਿਡੀ' : 'Extra Subsidy Unlocked'}</span>
          <span className="gain-val">+₹{extraSubsidy.toLocaleString('en-IN')}</span>
        </div>
        <div className="gain-metric">
          <span className="gain-label">{lang === 'hi' ? 'मासिक ईएमआई बचत' : lang === 'pa' ? 'ਮਾਸਿਕ ਬੱਚਤ' : 'Monthly Savings'}</span>
          <span className="gain-val green">-₹{savings.toLocaleString('en-IN')}/mo</span>
        </div>
      </div>

      <div className="card-note whatif-note">
        <Sparkles size={13} className="text-saffron" />
        <span>{card.recommendationTip}</span>
      </div>
    </div>
  );
};

export const EligibilityCardView: React.FC<{ 
  card: ChatEligibilityCardData; 
  onPromptClick?: (p: string) => void;
  lang?: string;
}> = ({ card, onPromptClick, lang = 'en' }) => {
  return (
    <div className="saathi-card saathi-card-eligibility">
      <div className="saathi-card-header">
        <div className="card-badge elig-badge">
          <CheckCircle2 size={13} />
          <span>{lang === 'hi' ? 'पात्रता विश्लेषण' : lang === 'pa' ? 'ਯੋਗਤਾ ਨਤੀਜਾ' : 'Eligibility Analysis'}</span>
        </div>
        <span className={`verdict-tag ${card.verdict.toLowerCase().replace(' ', '-')}`}>
          {card.verdict}
        </span>
      </div>

      <div className="elig-score-banner">
        <div className="elig-score-circle">
          <span className="score-num">{card.matchScore}%</span>
          <span className="score-lbl">{lang === 'hi' ? 'मैच' : lang === 'pa' ? 'ਮੈਚ' : 'Match'}</span>
        </div>
        <div className="elig-score-text">
          <div className="elig-scheme-title">{card.schemeName}</div>
          <div className="elig-status-sub">
            {lang === 'hi' ? 'आप सभी प्रमुख सामाजिक-आर्थिक और परियोजना शर्तों को पूरा करते हैं।' : lang === 'pa' ? 'ਤੁਸੀਂ ਸਾਰੀਆਂ ਜ਼ਰੂਰੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹੋ।' : 'You meet all core guidelines for 35% capital subsidy & 4%-8% bank credit.'}
          </div>
        </div>
      </div>

      <div className="elig-reasons-list">
        <div className="reasons-heading">{lang === 'hi' ? 'सत्यापित मानदंड:' : lang === 'pa' ? 'ਮਨਜ਼ੂਰ ਸ਼ਰਤਾਂ:' : 'Verified Criteria:'}</div>
        {card.reasons.map((r, i) => (
          <div key={i} className="reason-item">
            <CheckCircle2 size={14} className="reason-check" />
            <span>{r}</span>
          </div>
        ))}
      </div>

      {card.remedyTips && card.remedyTips.length > 0 && (
        <div className="card-note remedy-note">
          <AlertCircle size={13} />
          <div>
            <strong>{lang === 'hi' ? 'स्वीकृति हेतु सुझाव:' : lang === 'pa' ? 'ਜਲਦੀ ਮਨਜ਼ੂਰੀ ਲਈ:' : 'Fast-Track Tips:'}</strong>
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {card.remedyTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
