import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const BentoShowcase: React.FC = () => {
  const { setActiveTab } = useProfile();
  const { language } = useLanguage();

  const targetBentoImg = getLandingImage('bento', language);
  const [displayedImg, setDisplayedImg] = useState<string>(targetBentoImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetBentoImg === displayedImg) return;
    setIsImgReady(false);
    const img = new Image();
    img.src = targetBentoImg;
    img.onload = () => {
      setDisplayedImg(targetBentoImg);
      setIsImgReady(true);
    };
    img.onerror = () => {
      setDisplayedImg(targetBentoImg);
      setIsImgReady(true);
    };
  }, [targetBentoImg]);

  // 3D Tilt State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (-3.5 deg to +3.5 deg)
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setActiveTooltip(null);
  };

  return (
    <section className="bento-image-section" id="bento-showcase">
      <div className="container">
        {/* 3D Visual Stage with the exact user image asset */}
        <div
          ref={containerRef}
          className={`bento-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.008, 1.008, 1.008)`
              : undefined
          }}
        >
          <div className="bento-image-wrapper">
            <img
              src={displayedImg}
              alt="Find the Right Government Schemes - SchemeMatch Interactive Bento Showcase"
              className={`bento-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* =====================================================================
                Interactive Hotspot Overlays on the Image
                ===================================================================== */}

            {/* Tool 1: Scheme Search */}
            <div
              className="bento-hotspot hotspot-tool-search"
              onClick={() => setActiveTab('matcher')}
              onMouseEnter={() => setActiveTooltip('Scheme Search: Discover 23+ Central & MoSJE Schemes')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Scheme Search"
            >
              <div className="bento-pulse-dot blue" />
            </div>

            {/* Tool 2: Eligibility Checker */}
            <div
              className="bento-hotspot hotspot-tool-checker"
              onClick={() => setActiveTab('matcher')}
              onMouseEnter={() => setActiveTooltip('Eligibility Checker: Multi-Factor Affirmative Rules')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Eligibility Checker"
            >
              <div className="bento-pulse-dot green" />
            </div>

            {/* Tool 3: What-If Simulator */}
            <div
              className="bento-hotspot hotspot-tool-simulator"
              onClick={() => setActiveTab('dpr')}
              onMouseEnter={() => setActiveTooltip('What-If Simulator: Calculate 35% Subsidies & DSCR')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="What-If Simulator"
            >
              <div className="bento-pulse-dot pink" />
            </div>

            {/* Tool 4: Scheme Comparison */}
            <div
              className="bento-hotspot hotspot-tool-comparison"
              onClick={() => setActiveTab('comparison')}
              onMouseEnter={() => setActiveTooltip('Scheme Comparison: Side-by-side terms & interest')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Scheme Comparison"
            >
              <div className="bento-pulse-dot purple" />
            </div>

            {/* Tool 5: Document Checklist */}
            <div
              className="bento-hotspot hotspot-tool-docs"
              onClick={() => setActiveTab('documents')}
              onMouseEnter={() => setActiveTooltip('Document Checklist: Digital OCR & Readiness Verification')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Document Checklist"
            >
              <div className="bento-pulse-dot amber" />
            </div>

            {/* Tool 6: Application Tracker */}
            <div
              className="bento-hotspot hotspot-tool-tracker"
              onClick={() => setActiveTab('roadmap')}
              onMouseEnter={() => setActiveTooltip('Application Tracker: 6-Stage Nodal Clearance Milestones')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Application Tracker"
            >
              <div className="bento-pulse-dot gold" />
            </div>

            {/* Profile Selection Hotspot: SC/ST & Rural Popover */}
            <div
              className="bento-hotspot hotspot-profile-popover"
              onClick={() => setActiveTab('matcher')}
              onMouseEnter={() => setActiveTooltip('Filter Schemes by Targeted Profile & Affirmative Category')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Profile Recommendations"
            />

            {/* Smart Tasks Hotspot */}
            <div
              className="bento-hotspot hotspot-tasks"
              onClick={() => setActiveTab('roadmap')}
              onMouseEnter={() => setActiveTooltip('Smart Tasks: Assign & Track Application Milestones')}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Smart Tasks"
            />

            {/* Floating Action Tooltip */}
            {activeTooltip && (
              <div className="bento-floating-tooltip">
                <Sparkles size={14} style={{ color: '#38BDF8' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura */}
          <div className="bento-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
