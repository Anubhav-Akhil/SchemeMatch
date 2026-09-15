import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export const HeroScrollWindow: React.FC = () => {
  const { setActiveTab, navigateToFeature, setSelectedSchemeModal, matchResults } = useProfile();
  const { t, language } = useLanguage();

  const targetHeroImg = getLandingImage('hero', language);
  const [displayedImg, setDisplayedImg] = useState<string>(targetHeroImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetHeroImg === displayedImg) return;
    setIsImgReady(false);
    const img = new Image();
    img.src = targetHeroImg;
    img.onload = () => {
      setDisplayedImg(targetHeroImg);
      setIsImgReady(true);
    };
    img.onerror = () => {
      setDisplayedImg(targetHeroImg);
      setIsImgReady(true);
    };
  }, [targetHeroImg]);

  // 3D Tilt & Specular Glare State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within container
    const y = e.clientY - rect.top;  // y position within container
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-4.5 deg to +4.5 deg)
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    // Specular Glare coordinate in percentage
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

  const handleOpenPmegp = () => {
    const found = matchResults.find(m => m.scheme.id === 'pmegp-2026') || matchResults[0];
    if (found) {
      setSelectedSchemeModal(found);
    } else {
      navigateToFeature('matcher');
    }
  };

  return (
    <section className="hero-scroll-window-section" id="hero-scroll-window">
      <div className="container">
        {/* Kicker Label matching Image 1 */}
        <div className="hero-scroll-kicker">
          <span>{t.landing.heroKicker}</span>
        </div>

        {/* Big Bold Headline matching Image 1 */}
        <h1 className="hero-scroll-heading">
          {t.landing.heroHeadingLine1} <br />
          <span className="hero-scroll-highlight">
            {t.landing.heroHeadingLine2}
            <span className="hero-cursor-line" />
            <span className="hero-cursor-tag">{t.landing.heroCursorTag}</span>
          </span>
        </h1>

        {/* Subtitle matching Image 1 rhythm */}
        <p className="hero-scroll-subtitle">
          {t.landing.heroSubtitle}
        </p>

        {/* Visual Element Container (Image 2 with Movement Animations & 3D Tilt) */}
        <div
          ref={containerRef}
          className={`hero-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
              : undefined
          }}
        >
          {/* Main Visual Image matching Image 2 */}
          <div className="hero-image-wrapper">
            <img
              src={displayedImg}
              alt="SchemeMatch AI Interactive Showcase"
              className={`hero-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* Dynamic Specular Glare Reflection moving with cursor */}
            <div
              className="hero-glare-sheen"
              style={{
                background: isHovered
                  ? `radial-gradient(circle 500px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 75%)`
                  : undefined
              }}
            />

            {/* Interactive Animated Hotspot 1: PMEGP 98% Match Header */}
            <div
              className="hero-hotspot hotspot-header"
              onClick={handleOpenPmegp}
              onMouseEnter={() => setActiveTooltip('Click to view Scheme Details & 35% Rural Subsidy')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Click to view Scheme Details & 35% Rural Subsidy"
            >
              <div className="hotspot-pulse-ring" />
            </div>

            {/* Interactive Animated Hotspot 2: Fast-Track Application Button */}
            <div
              className="hero-hotspot hotspot-fast-track"
              onClick={() => navigateToFeature('roadmap')}
              onMouseEnter={() => setActiveTooltip('Open 6-Stage Application Roadmap')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Open 6-Stage Application Roadmap"
            >
              <div className="hotspot-pulse-ring blue" />
            </div>

            {/* Interactive Animated Hotspot 3: Upload Doc Action Required */}
            <div
              className="hero-hotspot hotspot-upload-doc"
              onClick={() => navigateToFeature('documents')}
              onMouseEnter={() => setActiveTooltip('Open Document Readiness Scanner')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Open Document Readiness Scanner"
            >
              <div className="hotspot-pulse-ring blue" />
            </div>

            {/* Interactive Animated Hotspot 4: Auto-Gen with AI (DPR) */}
            <div
              className="hero-hotspot hotspot-auto-gen"
              onClick={() => navigateToFeature('dpr')}
              onMouseEnter={() => setActiveTooltip('Generate Bank-Ready DPR (SIDBI/PMEGP)')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Generate Bank-Ready DPR"
            >
              <div className="hotspot-pulse-ring gold" />
            </div>

            {/* Interactive Animated Hotspot 5: Run DPR Simulation Button */}
            <div
              className="hero-hotspot hotspot-run-simulation"
              onClick={() => navigateToFeature('whatif')}
              onMouseEnter={() => setActiveTooltip('Simulate ₹11.37 Lakhs Subsidy & 3-Year Cash Flows')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Run DPR Simulation"
            >
              <div className="hotspot-pulse-ring cyan" />
            </div>

            {/* Interactive Animated Hotspot 6: Financial Benefits & Subsidy Breakdown Table */}
            <div
              className="hero-hotspot hotspot-financial-breakdown"
              onClick={() => navigateToFeature('calculator')}
              onMouseEnter={() => setActiveTooltip('Explore Financial & EMI Subsidy Calculator')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Explore Financial Calculator"
            >
              <div className="hotspot-pulse-ring green" />
            </div>

            {/* Floating Interactive Live Tooltip */}
            {activeTooltip && (
              <div className="hero-floating-tooltip">
                <Sparkles size={14} style={{ color: '#F59E0B' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura behind visual */}
          <div className="hero-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
