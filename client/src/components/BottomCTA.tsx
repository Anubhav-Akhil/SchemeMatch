import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { ArrowRight, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

export const BottomCTA: React.FC = () => {
  const { setActiveTab } = useProfile();

  return (
    <footer className="landing-bottom-cta-section" id="bottom-cta">
      <div className="container">
        {/* Main CTA Block matching crop3 */}
        <div className="bottom-cta-card">
          <h2 className="bottom-cta-heading">
            It's time. <br />
            Get SchemeMatched
          </h2>

          <p className="bottom-cta-subheading">
            Your enterprise has the power to shape your future. Don't settle for missed capital subsidies or endless bureaucratic delays. <br />
            Get SchemeMatched, and let's shape the future of entrepreneurship and capital access together.
          </p>

          <div className="bottom-cta-actions">
            <button
              className="bottom-cta-primary-btn"
              onClick={() => setActiveTab('matcher')}
            >
              <span>Sign Up Free</span>
            </button>

            <button
              className="bottom-cta-secondary-btn"
              onClick={() => setActiveTab('dpr')}
            >
              <span>Download Scheme Guide</span>
            </button>
          </div>
        </div>

        {/* Bottom Minimalist Footer matching crop3 */}
        <div className="landing-footer-bar">
          <div className="footer-left-col">
            <div className="footer-brand-tag">
              <span>SchemeMatch — national network</span>
              <span className="footer-verified-badge">
                <CheckCircle2 size={12} strokeWidth={3} />
              </span>
            </div>
            <div className="footer-legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>

          <div className="footer-social-col">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
