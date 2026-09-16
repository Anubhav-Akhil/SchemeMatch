import React from 'react';
import { SchemeMatchResult } from '../types';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { Volume2, VolumeX, ExternalLink, Check, AlertTriangle, Lightbulb, Scale, Eye, Sparkles } from 'lucide-react';

interface SchemeCardProps {
  matchResult: SchemeMatchResult;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ matchResult }) => {
  const { scheme, matchScore, isEligible, estimatedSubsidyAmount, estimatedLoanAmount, estimatedOwnContribution, estimatedMonthlyEmi, reasonsWhyMatched, conditionsToFulfill, subsidyOptimizationTip } = matchResult;
  const { profile, toggleCompareScheme, isSchemeCompared, setSelectedSchemeModal } = useProfile();
  const { speakText, isSpeaking, language } = useLanguage();

  const isCompared = isSchemeCompared(scheme.id);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const narrationText = language === 'hi'
      ? `${scheme.hindiName}। ${scheme.hindiSummary}। अनुमानित सब्सिडी: ₹${estimatedSubsidyAmount.toLocaleString('en-IN')}। ब्याज दर: ${scheme.interestRatePerAnnum}।`
      : `${scheme.name}. ${scheme.summary}. Eligible Capital Subsidy: ₹${estimatedSubsidyAmount.toLocaleString('en-IN')}. Estimated loan: ₹${estimatedLoanAmount.toLocaleString('en-IN')}. Concessional interest rate: ${scheme.interestRatePerAnnum}.`;
    speakText(narrationText);
  };

  return (
    <div className="scheme-card glass-panel">
      {/* Top Bar: Ministry / Apex Badge & Match Score Gauge */}
      <div className="scheme-card-top">
        <div className="scheme-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {matchScore >= 80 && isEligible && (
              <span className="badge" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', fontWeight: 800 }}>
                ⭐ RECOMMENDED SCHEME
              </span>
            )}
            {scheme.id === 'pm-vishwakarma' && (profile.tradeType?.toLowerCase().includes('tailor') || profile.sector === 'Textiles') && (
              <span className="badge" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#FFFFFF', fontWeight: 800 }}>
                🎯 RECOMMENDED FOR TAILORING
              </span>
            )}
            <span className="badge badge-indigo">
              {scheme.apexBody}
            </span>
            <span className="badge badge-saffron">
              {scheme.categoryTag}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {scheme.ministry}
            </span>
          </div>

          <h3>{scheme.name}</h3>
          <div className="hindi-title">{scheme.hindiName}</div>
        </div>

        {/* Match Probability Gauge */}
        <div className="match-score-pill">
          <span className="match-score-num">{matchScore}%</span>
          <span className="match-score-label">Match</span>
        </div>
      </div>

      {/* Brief Summary */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '10px 0' }}>
        {language === 'hi' ? scheme.hindiSummary : scheme.summary}
      </p>

      {/* 4 Financial Highlights Grid */}
      <div className="financial-pills-grid">
        <div className="fin-pill">
          <span>Capital Subsidy (Grant)</span>
          <strong style={{ color: 'var(--emerald-growth)' }}>
            ₹{estimatedSubsidyAmount.toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="fin-pill">
          <span>Bank Loan Needed</span>
          <strong>₹{estimatedLoanAmount.toLocaleString('en-IN')}</strong>
        </div>
        <div className="fin-pill">
          <span>Min. Margin Money (Own)</span>
          <strong>₹{estimatedOwnContribution.toLocaleString('en-IN')}</strong>
        </div>
        <div className="fin-pill">
          <span>Est. Monthly EMI</span>
          <strong style={{ color: 'var(--trust-indigo)' }}>
            ₹{estimatedMonthlyEmi > 0 ? `${estimatedMonthlyEmi.toLocaleString('en-IN')}/mo` : 'Interest Subvention'}
          </strong>
        </div>
      </div>

      {/* Explainable AI: Why You Matched */}
      {reasonsWhyMatched && reasonsWhyMatched.length > 0 && (
        <div className="why-matched-box">
          <div className="why-matched-title">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Why You Matched (Explainable AI)
          </div>
          <ul className="why-matched-list">
            {reasonsWhyMatched.slice(0, 3).map((r, idx) => (
              <li key={idx}>
                <Check size={14} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subsidy Optimization Tip Box */}
      {subsidyOptimizationTip && (
        <div className="optimization-tip-box">
          <Lightbulb size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
          <span>{subsidyOptimizationTip}</span>
        </div>
      )}

      {/* Conditions / Gaps to Satisfy */}
      {conditionsToFulfill && conditionsToFulfill.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '8px' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>Note: {conditionsToFulfill[0]}</span>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="scheme-card-actions">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* TTS Audio Button */}
          <button
            className="btn-secondary"
            onClick={handleSpeak}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            title="Listen to Scheme Summary in Voice"
          >
            <Volume2 size={16} style={{ color: 'var(--primary-saffron)' }} />
            <span>Audio Summary</span>
          </button>

          {/* Deep Dive Details Modal */}
          <button
            className="btn-secondary"
            onClick={() => setSelectedSchemeModal(matchResult)}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Eye size={16} />
            <span>Scheme Details</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Compare Toggle Button */}
          <button
            className={isCompared ? 'btn-success' : 'btn-secondary'}
            onClick={() => toggleCompareScheme(scheme)}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Scale size={16} />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Official Portal External Link */}
          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <span>Official Portal</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
