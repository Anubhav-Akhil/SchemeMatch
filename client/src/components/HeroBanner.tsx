import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { Award, Users, ShieldCheck, TrendingUp, Sparkles, Building2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { t } = useLanguage();
  const { personas, selectedPersonaId, selectPersona } = useProfile();

  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-main-card glass-panel">
          {/* SIH Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-saffron">
              <Award size={14} />
              {t.hero.badge}
            </span>
            <span className="badge badge-emerald">
              <ShieldCheck size={14} />
              MoSJE & MSME Certified Engine
            </span>
          </div>

          {/* Main Title */}
          <h2 className="hero-title">
            {t.hero.titleMain} <br />
            <span className="gradient-text">{t.hero.titleHighlight}</span>
          </h2>

          <p className="hero-tagline">{t.hero.tagline}</p>

          {/* Persona Switcher Strip */}
          <div className="personas-strip">
            <div className="personas-label">
              <Users size={16} />
              <span>{t.hero.personaTitle}</span>
            </div>

            <div className="persona-chips-scroll">
              {personas.map((persona) => {
                const isActive = persona.id === selectedPersonaId;
                return (
                  <button
                    key={persona.id}
                    className={`persona-chip ${isActive ? 'active' : ''}`}
                    onClick={() => selectPersona(persona.id)}
                    title={persona.story}
                  >
                    <span className="persona-chip-emoji">{persona.avatarEmoji}</span>
                    <div className="persona-chip-info">
                      <strong>{persona.fullName}</strong>
                      <span>{persona.headline}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aggregate Stats Row */}
          <div className="stats-row">
            <div className="stat-item">
              <h4>23+</h4>
              <p>{t.hero.stat1Label}</p>
            </div>
            <div className="stat-item">
              <h4 style={{ color: 'var(--emerald-growth)' }}>35%</h4>
              <p>{t.hero.stat2Label}</p>
            </div>
            <div className="stat-item">
              <h4 style={{ color: 'var(--trust-indigo)' }}>4.0%</h4>
              <p>{t.hero.stat3Label}</p>
            </div>
            <div className="stat-item">
              <h4 style={{ color: 'var(--accent-amber)' }}>5 Apex</h4>
              <p>{t.hero.stat4Label} (NSFDC/NBCFDC/NDFDC)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
