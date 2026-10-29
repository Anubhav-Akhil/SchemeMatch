import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { Scheme } from '../types';
import { X, ExternalLink, Check, Volume2, VolumeX, ShieldCheck, Clock, FileText, Building, Sparkles, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getSchemeDetailNarrationText, getSchemeLocalizedName, getSchemeLocalizedSummary } from '../utils/schemeTranslations';

export const SchemeDetailModal: React.FC = () => {
  const { selectedSchemeModal, setSelectedSchemeModal, profile, allSchemes, matchResults } = useProfile();
  const { speakText, stopSpeech, isSpeaking, language } = useLanguage();
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Safely resolve the scheme object
  const resolvedScheme: Scheme | undefined = selectedSchemeModal?.scheme ||
    allSchemes?.find(s => s.id === (selectedSchemeModal as any)?.id) ||
    matchResults?.find(m => m.scheme?.id === (selectedSchemeModal as any)?.id)?.scheme;

  const scheme: Scheme = (resolvedScheme || {
    id: (selectedSchemeModal as any)?.id || 'scheme-detail',
    name: (selectedSchemeModal as any)?.name || 'Government Welfare & Business Scheme',
    hindiName: 'सरकारी व्यवसाय व ऋण योजना',
    summary: 'Central and state government enterprise loan & subsidy scheme.',
    hindiSummary: 'सरकारी व्यवसाय एवं ऋण योजना।',
    ministry: 'Ministry of Social Justice & MSME',
    apexBody: 'MoSJE & Commercial Banks',
    categoryTag: 'Government Scheme',
    targetGroups: ['All Entrepreneurs', 'Micro Enterprises'],
    minLoanAmount: 50000,
    maxLoanAmount: 1000000,
    interestRatePerAnnum: 'Concessional (8% - 10%)',
    moratoriumPeriodMonths: 6,
    repaymentPeriodMonths: 60,
    subsidyRate: { specialRural: 35, specialUrban: 25 },
    promoterContributionMinPercent: { general: 10, specialCategory: 5 },
    collateralRequirement: 'Collateral-free (CGTMSE)',
    keyHighlights: ['Direct financial assistance', 'Interest subvention', 'Udyam MSME eligible'],
    mandatoryDocuments: ['Aadhaar Card', 'PAN Card', 'Bank Account Statement', 'Business Project Outline'],
    nodalAgency: 'Designated Government Agency / Bank',
    averageProcessingDays: 21,
    officialPortalUrl: 'https://www.myscheme.gov.in/',
    detailedOverview: 'Government credit and subsidy scheme designed to support micro and small entrepreneurs with bank funding and capital assistance.'
  }) as Scheme;

  const matchScore = selectedSchemeModal?.matchScore ?? 92;
  const estimatedSubsidyAmount = selectedSchemeModal?.estimatedSubsidyAmount ?? Math.round((scheme.maxLoanAmount || 500000) * 0.25);

  useEffect(() => {
    if (selectedSchemeModal) {
      setAiExplanation(null);
      fetchAiExplanation();
    }
  }, [selectedSchemeModal]);

  const fetchAiExplanation = async () => {
    if (!selectedSchemeModal) return;
    setLoadingAi(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/explain-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme,
          profile,
          score: matchScore
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data);
      }
    } catch (e) {
      console.warn('AI explain match fetch error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!selectedSchemeModal) return null;

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      const text = getSchemeDetailNarrationText(scheme, language);
      speakText(text, language);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedSchemeModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">{scheme.apexBody || 'Central Ministry'}</span>
              <span className="badge badge-saffron">{scheme.categoryTag || 'Government Scheme'}</span>
              <span className="badge badge-emerald">{matchScore}% Match</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '4px' }}>{scheme.name}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{getSchemeLocalizedName(scheme.id, language) || scheme.hindiName}</div>
          </div>

          <button
            onClick={() => setSelectedSchemeModal(null)}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '6px', border: 'none', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* AI Explainable Match Evaluation Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: '#4F46E5' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Explainable Match Score (AI Intelligence)
              </span>
            </div>
            {loadingAi && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={12} className="animate-spin" /> Evaluating...
              </span>
            )}
          </div>

          {aiExplanation ? (
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 500 }}>
                {aiExplanation.rationale}
              </p>
              {aiExplanation.subsidyBenefitExplanation && (
                <div style={{ padding: '6px 10px', background: 'rgba(16, 185, 129, 0.12)', borderLeft: '3px solid #10B981', borderRadius: '4px', margin: '8px 0', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  💰 {aiExplanation.subsidyBenefitExplanation}
                </div>
              )}
              {aiExplanation.keyStrengthPoints && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Key Strengths:</span>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '18px', fontSize: '0.8rem' }}>
                    {aiExplanation.keyStrengthPoints.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {loadingAi ? 'AI is analyzing eligibility criteria against your profile...' : `Based on your profile, you match ${matchScore}% of criteria with estimated ₹${(estimatedSubsidyAmount / 100000).toFixed(1)}L in benefits.`}
            </p>
          )}
        </div>

        {/* Overview & TTS audio */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Overview & Objectives</h4>
            <button
              className="btn-secondary"
              onClick={handleToggleSpeak}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: isSpeaking ? '#16A34A' : undefined,
                borderColor: isSpeaking ? '#16A34A' : undefined
              }}
              title={isSpeaking ? 'Stop Audio' : 'Listen Aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={14} style={{ color: '#16A34A' }} />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} style={{ color: 'var(--primary-saffron)' }} />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {getSchemeLocalizedSummary(scheme, language) || scheme.detailedOverview}
          </p>
        </div>

        {/* Quick Parameters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Loan Scale</span>
            <strong style={{ fontSize: '0.98rem' }}>₹{(scheme.minLoanAmount || 50000).toLocaleString('en-IN')} - ₹{(scheme.maxLoanAmount || 1000000).toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Interest Rate</span>
            <strong style={{ fontSize: '0.98rem', color: 'var(--trust-indigo)' }}>{scheme.interestRatePerAnnum || 'Concessional'}</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Special Margin Money</span>
            <strong style={{ fontSize: '0.98rem', color: 'var(--emerald-growth)' }}>{scheme.promoterContributionMinPercent?.specialCategory ?? 5}% (General: {scheme.promoterContributionMinPercent?.general ?? 10}%)</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Collateral Norm</span>
            <strong style={{ fontSize: '0.98rem' }}>{scheme.collateralRequirement || 'Collateral-free (CGTMSE)'}</strong>
          </div>
        </div>

        {/* Key Highlights */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>Key Scheme Highlights</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
            {(scheme.keyHighlights || []).map((hl, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <Check size={16} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Documents Checklist */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={18} style={{ color: 'var(--primary-saffron)' }} />
            <span>Required Documents for Appraisal</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(scheme.mandatoryDocuments || []).map((doc, idx) => (
              <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', border: '1px solid var(--border-subtle)' }}>
                📌 {doc}
              </div>
            ))}
          </div>
        </div>

        {/* Nodal Agency & Processing */}
        <div style={{ padding: '14px', background: 'rgba(79, 70, 229, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--trust-indigo)', fontWeight: 700, textTransform: 'uppercase' }}>Nodal Processing Body</span>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{scheme.nodalAgency || 'State Channelizing Agency / Bank'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Clock size={16} />
            <span>Avg. Turnaround: {scheme.averageProcessingDays || 21} Days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
          <button
            className="btn-secondary"
            onClick={() => setSelectedSchemeModal(null)}
          >
            Close
          </button>
          <a
            href={scheme.officialPortalUrl || 'https://www.myscheme.gov.in/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>Proceed to Official Portal</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
