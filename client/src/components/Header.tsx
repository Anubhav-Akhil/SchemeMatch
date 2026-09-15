import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { SupportedLanguage } from '../types';
import { Volume2, VolumeX, Moon, Sun, Scale } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t, isSpeaking, stopSpeech } = useLanguage();
  const { comparedSchemes, setActiveTab } = useProfile();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Section with Official Logo */}
        <div className="brand-section">
          <div className="brand-logo-container" onClick={() => setActiveTab('matcher')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={logoImg} 
              alt="SchemeMatch Logo" 
              className="brand-logo-img"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                borderRadius: '12px',
                background: '#FFFFFF',
                padding: '2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1.5px solid var(--border-subtle)'
              }} 
            />
            <div className="brand-text">
              <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)', WebkitBackgroundClip: theme === 'light' ? 'text' : 'unset', color: theme === 'dark' ? '#FFFFFF' : '#0D1B2A' }}>
                  {t.appTitle}
                </span>
              </h1>
              <div className="gov-tag" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {t.sponsoringMinistry}
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="header-actions">
          {/* Audio Speaking Status */}
          {isSpeaking && (
            <button 
              className="audio-status-pill"
              onClick={stopSpeech}
              title="Stop voice narration"
            >
              <Volume2 size={16} />
              <span>Speaking Audio (Click to Stop)</span>
              <VolumeX size={14} />
            </button>
          )}

          {/* Scheme Comparison Quick Badge */}
          {comparedSchemes.length > 0 && (
            <button
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('comparison')}
            >
              <Scale size={16} />
              <span>Compare ({comparedSchemes.length}/3)</span>
            </button>
          )}

          {/* Language Selector */}
          <select 
            value={language} 
            onChange={handleLanguageChange}
            aria-label="Select Language"
            style={{ fontWeight: 600, padding: '7px 12px', fontSize: '0.88rem' }}
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>

          {/* Theme Toggle */}
          <button 
            className="btn-secondary"
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Theme"
            style={{ padding: '8px 12px' }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
