import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

export const ProcessCards: React.FC = () => {
  const { setActiveTab } = useProfile();

  return (
    <section className="figma-section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Section Centered Header */}
        <h2 className="figma-section-title">
          An intelligent match in every <br />
          scheme application
        </h2>
        <p className="figma-section-subtitle">
          From multi-factor eligibility verification to bank sanction, SchemeMatch automates the entire roadmap for underserved micro-enterprises.
        </p>

        {/* 3 Process Cards Grid */}
        <div className="process-cards-grid">
          {/* Card 1: Teal Gradient Header */}
          <div className="process-card">
            <div className="card-top-gradient teal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  Stage 01 • Discovery
                </span>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
              </div>
              <h4>Explainable Multi-Factor Matching</h4>
              <p>Eliminating bureaucratic confusion with 100% transparent eligibility logic.</p>
            </div>

            <div className="card-process-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Hard Demographic Filter (SC, ST, OBC, Women, PwD)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Rural vs Urban 35% Subsidy Maximization</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Annual Family Income Check (&lt;₹3,00,000 for MoSJE)</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab('matcher')}
                  style={{ width: '100%', fontSize: '0.84rem', justifyContent: 'space-between' }}
                >
                  <span>Explore 23+ Schemes</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Emerald Gradient Header */}
          <div className="process-card">
            <div className="card-top-gradient emerald">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  Stage 02 • Financials
                </span>
                <span style={{ fontSize: '1.2rem' }}>📊</span>
              </div>
              <h4>Bank-Ready Detailed Project Report (DPR)</h4>
              <p>Automated capital allocation, 3-year cash flows, and DSCR proof for bank appraisal.</p>
            </div>

            <div className="card-process-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Capital Expenditure vs Working Capital Split</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Promoter Contribution limited to 5%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>DSCR &gt; 1.50 ("Highly Bankable" standard)</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab('dpr')}
                  style={{ width: '100%', fontSize: '0.84rem', justifyContent: 'space-between' }}
                >
                  <span>Generate Free DPR</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Sunset Orange Gradient Header */}
          <div className="process-card">
            <div className="card-top-gradient sunset">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  Stage 03 • Verification
                </span>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
              </div>
              <h4>Document Readiness & Gap Resolver</h4>
              <p>Simulated OCR scanner, readiness score, and 1-click links to acquire missing documents.</p>
            </div>

            <div className="card-process-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Aadhaar, Caste Certificate & Passbook Scanner</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Free Instant Udyam MSME Integration Guide</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-growth)' }} />
                  <span>Resolution plan to reach 100% "Bank Ready"</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab('documents')}
                  style={{ width: '100%', fontSize: '0.84rem', justifyContent: 'space-between' }}
                >
                  <span>Scan Documents</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
