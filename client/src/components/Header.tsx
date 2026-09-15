import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../types';
import { 
  Moon, 
  Sun, 
  LogIn, 
  UserPlus,
  Sparkles, 
  Globe, 
  ChevronDown
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t } = useLanguage();
  const { user, navigateToAuth, setCurrentView } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const langs: { code: SupportedLanguage; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'te', label: 'తెలుగు', short: 'TE' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'PA' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
    { code: 'bn', label: 'বাংলা', short: 'BN' },
  ];

  const currentLang = langs.find(l => l.code === language) || langs[0];

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Left: Logo & Brand Name */}
        <div className="hdr-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" tabIndex={0}>
          <img src={logoImg} alt="SchemeMatch" className="hdr-brand-logo" />
          <span className="hdr-brand-name">SchemeMatch</span>
        </div>

        {/* Right: Utilities & Auth */}
        <div className="hdr-actions">
          {/* Language Selector */}
          <div className="hdr-lang" ref={langRef}>
            <button
              type="button"
              className="hdr-lang-trigger"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select Language"
            >
              <Globe size={15} />
              <span className="hdr-lang-label">{currentLang.label}</span>
              <ChevronDown size={12} className={`hdr-lang-chevron ${langOpen ? 'rotated' : ''}`} />
            </button>

            {langOpen && (
              <div className="hdr-lang-dropdown">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`hdr-lang-option ${language === l.code ? 'selected' : ''}`}
                    onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <span className="hdr-lang-dot" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="hdr-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Separator */}
          <div className="hdr-separator" />

          {/* Auth Buttons */}
          {user ? (
            <button
              type="button"
              className="hdr-workspace-pill"
              onClick={() => setCurrentView('app')}
            >
              <span className="hdr-avatar">{user.fullName?.charAt(0).toUpperCase() || 'U'}</span>
              <span>{t.nav.workspace}</span>
              <Sparkles size={13} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="hdr-signin-btn"
                onClick={() => navigateToAuth('login')}
              >
                <LogIn size={15} />
                <span>{t.nav.signIn}</span>
              </button>

              <button
                type="button"
                className="hdr-register-btn"
                onClick={() => navigateToAuth('register')}
              >
                <UserPlus size={15} />
                <span>{t.nav.createAccount}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
