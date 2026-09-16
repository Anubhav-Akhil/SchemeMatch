import React from 'react';
import { 
  ChatEmiCardData, 
  ChatDocumentItem, 
  ChatPartnerItem, 
  ChatWhatIfCardData, 
  ChatEligibilityCardData,
  ChatFeatureMode 
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
  labelEn: string;
  labelHi: string;
  labelPa: string;
  icon: React.ReactNode;
  prompt: string;
}

export const SAATHI_FEATURES: FeatureChip[] = [
  {
    id: 'recommendation',
    labelEn: '🎯 Smart Schemes',
    labelHi: '🎯 योजना सुझाव',
    labelPa: '🎯 ਸਕੀਮ ਸੁਝਾਅ',
    icon: <Target size={14} />,
    prompt: 'Find the most suitable schemes based on my profile'
  },
  {
    id: 'eligibility',
    labelEn: '✅ Eligibility Checker',
    labelHi: '✅ पात्रता जांच',
    labelPa: '✅ ਯੋਗਤਾ ਜਾਂਚ',
    icon: <CheckCircle2 size={14} />,
    prompt: 'Check my eligibility score and explain the criteria'
  },
  {
    id: 'emi',
    labelEn: '💰 Loan & EMI',
    labelHi: '💰 ऋण व ईएमआई',
    labelPa: '💰 ਕਰਜ਼ਾ ਤੇ EMI',
    icon: <BadgePercent size={14} />,
    prompt: 'Calculate my loan amount, EMI, interest rate, and moratorium'
  },
  {
    id: 'documents',
    labelEn: '📄 Document Checklist',
    labelHi: '📄 दस्तावेज़ सूची',
    labelPa: '📄 ਦਸਤਾਵੇਜ਼ ਸੂਚੀ',
    icon: <FileText size={14} />,
    prompt: 'Provide personalized required-document checklist'
  },
  {
    id: 'partners',
    labelEn: '🏦 Channel Partners',
    labelHi: '🏦 अधिकृत बैंक/पार्टनर',
    labelPa: '🏦 ਚੈਨਲ ਪਾਰਟਨਰ',
    icon: <Building2 size={14} />,
    prompt: 'Find suitable authorized channel partners and guide where to apply'
  },
  {
    id: 'whatif',
    labelEn: '🧮 What-If Simulator',
    labelHi: '🧮 व्हॉट-इफ सिमुलेटर',
    labelPa: '🧮 What-If ਸਿਮੂਲੇਟਰ',
    icon: <SlidersHorizontal size={14} />,
    prompt: 'Show what-if simulation: how changing location or income affects eligibility'
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
          const label = lang === 'hi' ? feat.labelHi : lang === 'pa' ? feat.labelPa : feat.labelEn;
          return (
            <button
              key={feat.id}
              type="button"
              className={`saathi-feature-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectMode(feat.id, feat.prompt)}
              title={feat.prompt}
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
