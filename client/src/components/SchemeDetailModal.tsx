import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ExternalLink, Check, Volume2, ShieldCheck, Clock, FileText, Building } from 'lucide-react';

export const SchemeDetailModal: React.FC = () => {
  const { selectedSchemeModal, setSelectedSchemeModal } = useProfile();
  const { speakText, language } = useLanguage();

  if (!selectedSchemeModal) return null;

  const { scheme, matchScore, estimatedSubsidyAmount } = selectedSchemeModal;

  const handleSpeak = () => {
    const text = `${scheme.name}. ${scheme.detailedOverview}. Maximum loan limit is ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}. Nodal agency is ${scheme.nodalAgency}.`;
    speakText(text);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedSchemeModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">{scheme.apexBody}</span>
              <span className="badge badge-saffron">{scheme.categoryTag}</span>
              <span className="badge badge-emerald">{matchScore}% Match</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '4px' }}>{scheme.name}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{scheme.hindiName}</div>
          </div>

          <button
            onClick={() => setSelectedSchemeModal(null)}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '6px' }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Overview & TTS audio */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Overview & Objectives</h4>
            <button
              className="btn-secondary"
              onClick={handleSpeak}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Volume2 size={14} style={{ color: 'var(--primary-saffron)' }} />
              <span>Listen Aloud</span>
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {scheme.detailedOverview}
          </p>
        </div>

        {/* Quick Parameters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Loan Scale</span>
            <strong style={{ fontSize: '0.98rem' }}>₹{scheme.minLoanAmount.toLocaleString('en-IN')} - ₹{scheme.maxLoanAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Interest Rate</span>
            <strong style={{ fontSize: '0.98rem', color: 'var(--trust-indigo)' }}>{scheme.interestRatePerAnnum}</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Special Margin Money</span>
            <strong style={{ fontSize: '0.98rem', color: 'var(--emerald-growth)' }}>{scheme.promoterContributionMinPercent.specialCategory}% (General: {scheme.promoterContributionMinPercent.general}%)</strong>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Collateral Norm</span>
            <strong style={{ fontSize: '0.98rem' }}>{scheme.collateralRequirement}</strong>
          </div>
        </div>

        {/* Key Highlights */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>Key Scheme Highlights</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scheme.keyHighlights.map((hl, idx) => (
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
            {scheme.mandatoryDocuments.map((doc, idx) => (
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
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{scheme.nodalAgency}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Clock size={16} />
            <span>Avg. Turnaround: {scheme.averageProcessingDays} Days</span>
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
            href={scheme.officialPortalUrl}
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
