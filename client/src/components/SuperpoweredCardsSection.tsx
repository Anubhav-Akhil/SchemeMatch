import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, MapPin, Compass, CheckCircle2, ArrowRight, Building2, Scale, ShieldCheck } from 'lucide-react';

export const SuperpoweredCardsSection: React.FC = () => {
  const { setActiveTab, navigateToFeature, setSelectedSchemeModal, matchResults } = useProfile();
  const { t, language, theme } = useLanguage();

  const targetSpImg = getLandingImage('superpowered', language, theme);
  const [displayedImg, setDisplayedImg] = useState<string>(targetSpImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetSpImg === displayedImg) return;
    const img = new Image();
    img.src = targetSpImg;
    if (img.complete) {
      setDisplayedImg(targetSpImg);
      setIsImgReady(true);
    } else {
      img.onload = () => {
        setDisplayedImg(targetSpImg);
        setIsImgReady(true);
      };
      img.onerror = () => {
        setDisplayedImg(targetSpImg);
        setIsImgReady(true);
      };
    }
  }, [targetSpImg]);

  // 3D Tilt & Specular Glare State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-4 deg to +4 deg)
    const rotateX = ((y - centerY) / centerY) * -4.0;
    const rotateY = ((x - centerX) / centerX) * 4.0;

    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.16 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setActiveTooltip(null);
  };

  const handleOpenTermLoan = () => {
    const found = matchResults.find(m => 
      m.scheme.id.includes('nsfdc-term-loan') || 
      m.scheme.name.toLowerCase().includes('term loan')
    ) || matchResults[0];

    if (found) {
      setSelectedSchemeModal(found);
    } else {
      navigateToFeature('matcher');
    }
  };

  return (
    <section className="superpowered-section" id="superpowered-showcase">
      <div className="container">
        {/* Section Headline matching Reference Design */}
        <div className="superpowered-header">
          <h2 className="superpowered-title">
            {t.landing.superpoweredTitleLine1} <br />
            {t.landing.superpoweredTitleLine2} <br />
            {t.landing.superpoweredTitleLine3}
          </h2>
          <p className="superpowered-subtitle">
            {t.landing.superpoweredSubtitle}
          </p>
        </div>

        {/* 2nd Visual Element Stage (4K Image Showcase with 3D Tilt, Floating & Hotspots) */}
        <div
          ref={containerRef}
          className={`sp-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
              : undefined
          }}
        >
          <div className="sp-image-wrapper">
            {/* 4K Visual Asset */}
            <img
              src={displayedImg}
              alt="SchemeMatch 3-Card Multi-Window Workspace Showcase"
              className={`sp-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* Dynamic Specular Glare Reflection moving with cursor */}
            <div
              className="sp-glare-sheen"
              style={{
                background: isHovered
                  ? `radial-gradient(circle 500px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 75%)`
                  : undefined
              }}
            />

            {/* --- CARD 1 (LEFT: Discovery & Category Filter) --- */}
            {/* Hotspot 1: Start a Business Button */}
            <div
              className="sp-hotspot sp-hotspot-start-biz"
              onClick={() => navigateToFeature('matcher')}
              onMouseEnter={() => setActiveTooltip('Filter Schemes for Micro & Small Business Startups')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Start a Business Discovery"
            >
              <div className="sp-pulse-ring blue" />
            </div>

            {/* Hotspot 2: Recent Activity (Viewed Term Loan Scheme) */}
            <div
              className="sp-hotspot sp-hotspot-recent-loan"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip('Resume Application: NSFDC Term Loan Scheme')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Resume NSFDC Term Loan"
            >
              <div className="sp-pulse-ring orange" />
            </div>

            {/* --- CARD 2 (CENTER: Top Match Term Loan Scheme) --- */}
            {/* Hotspot 3: Term Loan Scheme 96% Match Header */}
            <div
              className="sp-hotspot sp-hotspot-header"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip('Open MoSJE Term Loan Scheme Details & 96% Match Dossier')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="View Top Match Details"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 4: Key Highlights (Up to ₹50 Lakh @ 6.5%-8%) */}
            <div
              className="sp-hotspot sp-hotspot-highlights"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip('Loan Amount: Up to ₹50 Lakh • Moratorium: 3-12 Months')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Loan Terms & Moratorium"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 5: 96% Match Circular Score Gauge */}
            <div
              className="sp-hotspot sp-hotspot-match-ring"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip('96% High-Confidence Eligibility Fit (SC Verified, Capex within Limit)')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="96% Eligibility Fit"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 6: [View Full Details ->] Button */}
            <div
              className="sp-hotspot sp-hotspot-view-details"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip('Open Complete Scheme Breakdown & DPR Requirements')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="View Full Details"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 7: [⚖️ Compare Schemes] Button */}
            <div
              className="sp-hotspot sp-hotspot-compare-schemes"
              onClick={() => navigateToFeature('comparison')}
              onMouseEnter={() => setActiveTooltip('Compare Term Loan vs PMEGP vs Stand-Up India Matrix')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Compare Schemes"
            >
              <div className="sp-pulse-ring blue" />
            </div>

            {/* --- CARD 3 (RIGHT: Authorized Channel Partners) --- */}
            {/* Hotspot 8: View on Map Button */}
            <div
              className="sp-hotspot sp-hotspot-map-btn"
              onClick={() => navigateToFeature('partners')}
              onMouseEnter={() => setActiveTooltip('View Authorized Channel Partners on Interactive Nodal Map')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="View Channel Partners"
            >
              <div className="sp-pulse-ring purple" />
            </div>

            {/* Hotspot 9: State Bank of India Eligible Row */}
            <div
              className="sp-hotspot sp-hotspot-sbi-partner"
              onClick={() => navigateToFeature('partners')}
              onMouseEnter={() => setActiveTooltip('State Bank of India (Patna Main Branch) • Authorized Nodal Desk')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="SBI Main Branch Patna"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 10: [✈️ Get Directions ->] Button */}
            <div
              className="sp-hotspot sp-hotspot-get-directions"
              onClick={() => navigateToFeature('partners')}
              onMouseEnter={() => setActiveTooltip('Get Navigation Directions to Nearest Nodal Bank Branch')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Get Directions"
            >
              <div className="sp-pulse-ring blue" />
            </div>

            {/* Dynamic Floating Interactive Live Tooltip */}
            {activeTooltip && (
              <div className="sp-floating-tooltip">
                <Sparkles size={14} style={{ color: '#10B981' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura behind 2nd Visual Element */}
          <div className="sp-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
