import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const FigmaHero: React.FC = () => {
  const { t } = useLanguage();
  const { personas, selectedPersonaId, selectPersona, profile, setActiveTab } = useProfile();

  return (
    <section className="figma-hero-section">
      <div className="container">
        {/* Top Kicker Pill */}
        <div className="figma-kicker-pill">
          <Sparkles size={14} />
          <span>INTRODUCING SCHEMEMATCH AI</span>
        </div>

        {/* Big Editorial Headline with Cursor Highlight */}
        <h1 className="figma-hero-title">
          The platform you <br />
          <span className="cursor-tag-highlight">
            need to match
            <span className="cursor-badge">AI</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="figma-hero-subtitle">
          An intelligent decision-support and application copilot for marginalized entrepreneurs, unlocking up to 35% capital subsidies, 4% concessional credit, and bank-ready DPRs.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab('matcher')}
            style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>Match Your Schemes</span>
            <ArrowRight size={18} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('dpr')}
            style={{ padding: '14px 26px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>Build Bank-Ready DPR</span>
          </button>
        </div>

        {/* Hero Visual Showcase: 3D Multi-Layered Window & Floating Card */}
        <div className="hero-showcase-viewport">
          {/* Background Window: Peeking Scheme Matrix */}
          <div className="mac-window hero-bg-window">
            <div className="mac-titlebar">
              <div className="mac-dots">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                SchemeMatch Enterprise Matrix — Ministry of Social Justice & Empowerment
              </span>
            </div>
            <div style={{ padding: '40px 30px', background: 'var(--bg-surface-subtle)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>PMEGP 2026</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Rural SC 35% Subsidy</strong>
                <small style={{ color: 'var(--text-muted)' }}>KVIC & DIC Task Force</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>NSFDC</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Mahila Samriddhi 4%</strong>
                <small style={{ color: 'var(--text-muted)' }}>MoSJE Apex Corporation</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>PM Vishwakarma</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>₹15k Tool Grant + 5%</strong>
                <small style={{ color: 'var(--text-muted)' }}>18 Traditional Crafts</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>PM SVANidhi</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>₹50,000 Micro-Credit</strong>
                <small style={{ color: 'var(--text-muted)' }}>7% Interest Subvention</small>
              </div>
            </div>
          </div>

          {/* Foreground Floating Focused Card with Purple-Magenta Gradient Header */}
          <div className="hero-floating-modal">
            {/* Top Mac Bar */}
            <div className="mac-titlebar" style={{ background: '#4A1D96', borderBottom: 'none' }}>
              <div className="mac-dots">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginLeft: '10px' }}>
                AI Pre-Appraisal Dossier • Case #SC-2026-UP
              </span>
            </div>

            {/* Vibrant Purple-Magenta Gradient Card Header */}
            <div className="hero-modal-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🧵</span>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                      Verified Marginalized Profile
                    </span>
                  </div>
                  <h3>Sunita Devi • Rural SC Weaver</h3>
                  <p>Varanasi, Uttar Pradesh • Seeking ₹2.5 Lakh for Jacquard Loom</p>
                </div>

                {/* Avatar Stack & 96% Match Badge */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', background: '#FFFFFF', color: '#7C3AED', fontWeight: 800, fontSize: '0.85rem', padding: '4px 10px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    96% Match
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Card Body */}
            <div className="hero-modal-body">
              {/* Checklist items */}
              <div style={{ marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                  <span><strong>Eligible for 35% Rural Capital Subsidy</strong> under PMEGP Special Category</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                  <span><strong>Promoter Margin Money capped at 5%</strong> (Only ₹13,250 self contribution)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                  <span><strong>Collateral-Free Loan</strong> backed by mandatory CGTMSE Guarantee</span>
                </div>
              </div>

              {/* Dark Pill with Live Scheme Stats */}
              <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>Estimated Bank Loan</span>
                  <strong style={{ fontSize: '1.2rem', color: '#38BDF8' }}>₹2,50,000</strong>
                </div>
                <div style={{ borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>Government Subsidy</span>
                  <strong style={{ fontSize: '1.2rem', color: '#4ADE80' }}>₹92,750 (35%)</strong>
                </div>
                <div style={{ borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>Est. Monthly EMI</span>
                  <strong style={{ fontSize: '1.2rem', color: '#FDBA74' }}>₹2,518/mo</strong>
                </div>
              </div>

              {/* Mini Metrics Table */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ padding: '8px', background: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem' }}>Income Ceiling</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Within Limit (&lt;₹3L)</strong>
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem' }}>Project DSCR</span>
                  <strong style={{ color: 'var(--emerald-growth)' }}>7.07 (Highly Bankable)</strong>
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem' }}>Turnaround</span>
                  <strong style={{ color: 'var(--text-primary)' }}>25 Days (KVIC/DIC)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Persona Quick-Switch Strip */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Users size={16} />
            <span>SELECT REAL MARGINALIZED ENTREPRENEUR PROFILES:</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {personas.map((p) => {
              const isActive = p.id === selectedPersonaId;
              return (
                <button
                  key={p.id}
                  onClick={() => selectPersona(p.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--primary-saffron-glow)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isActive ? 'var(--primary-saffron)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 14px var(--primary-saffron-glow)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{p.avatarEmoji}</span>
                  <span>{p.fullName}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({p.category})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
