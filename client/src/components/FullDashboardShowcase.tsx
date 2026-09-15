import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Maximize2, 
  X, 
  Check, 
  Bell, 
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const FullDashboardShowcase: React.FC = () => {
  const { setActiveTab, navigateToFeature, setSelectedSchemeModal, matchResults } = useProfile();
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<number>(15);

  const handleOpenTopScheme = (schemeId?: string) => {
    if (schemeId) {
      navigateToFeature('matcher', { schemeId });
    } else if (matchResults.length > 0) {
      setSelectedSchemeModal(matchResults[0]);
    } else {
      navigateToFeature('matcher');
    }
  };

  return (
    <section className="dashboard-showcase-section" id="dashboard-showcase">
      <div className="container">
        {/* Section Headline with Hand-drawn Smile Curve underline */}
        <div className="dashboard-showcase-header">
          <h2 className="dashboard-showcase-title">
            {t.landing.dashboardTitleLine1} <br />
            <span className="smile-underline-wrap">
              {t.landing.dashboardTitleHighlight}
              <svg className="smile-underline-svg" viewBox="0 0 240 24" fill="none">
                <path
                  d="M6,14 C60,24 180,24 234,10"
                  stroke="#3B82F6"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="dashboard-showcase-subtitle">
            {t.landing.dashboardSubtitle}
          </p>

          {/* Feature Chips / Pills Row matching Figma reference */}
          <div className="dashboard-feature-chips">
            <span className="dash-pill" onClick={() => navigateToFeature('matcher')} style={{ cursor: 'pointer' }}>⚡ Desktop & Web App</span>
            <span className="dash-pill" onClick={() => navigateToFeature('matcher')} style={{ cursor: 'pointer' }}>🎯 AI Eligibility Matcher</span>
            <span className="dash-pill" onClick={() => navigateToFeature('whatif')} style={{ cursor: 'pointer' }}>🔮 What-If Simulator</span>
            <span className="dash-pill" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>📑 DigiLocker & Udyam Sync</span>
            <span className="dash-pill" onClick={() => navigateToFeature('roadmap')} style={{ cursor: 'pointer' }}>🧭 Nodal Roadmap Tracker</span>
          </div>
        </div>

        {/* Full-Width Wide Dark macOS Dashboard Window */}
        <div className="dash-window-stage">
          <div className="dash-mac-window dark">
            {/* Window Titlebar */}
            <div className="dash-window-titlebar">
              <div className="dash-titlebar-left">
                <div className="mac-dots">
                  <span className="mac-dot red" />
                  <span className="mac-dot yellow" />
                  <span className="mac-dot green" />
                </div>
                <button className="dash-today-btn" onClick={() => navigateToFeature('roadmap')}>Today</button>
                <div className="dash-nav-arrows">
                  <button className="dash-nav-btn"><ChevronLeft size={13} /></button>
                  <button className="dash-nav-btn"><ChevronRight size={13} /></button>
                </div>
                <span className="dash-date-label">November, 2025</span>
              </div>

              <div className="dash-titlebar-right">
                <button className="dash-icon-btn" onClick={() => navigateToFeature('matcher')}><Search size={13} /></button>
                <button className="dash-icon-btn" onClick={() => navigateToFeature('roadmap')}><Bell size={13} /></button>
                <div className="dash-user-avatar" onClick={() => navigateToFeature('matcher')} style={{ cursor: 'pointer' }}>SD</div>
              </div>
            </div>

            {/* 3-Column Interior Layout */}
            <div className="dash-workspace-grid">
              {/* Left Sidebar: Schemes & Nodal Officers */}
              <div className="dash-col-sidebar">
                <div className="dash-sidebar-group">
                  <span className="dash-group-title">SCHEMES</span>
                  <div className="dash-group-item active" onClick={() => handleOpenTopScheme('pmegp-2026')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot blue" />
                    <span>PMEGP Scheme</span>
                  </div>
                  <div className="dash-group-item" onClick={() => handleOpenTopScheme('stand-up-india')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot cyan" />
                    <span>Stand-Up India</span>
                  </div>
                  <div className="dash-group-item" onClick={() => handleOpenTopScheme('pm-vishwakarma')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot green" />
                    <span>PM Vishwakarma</span>
                  </div>
                  <div className="dash-group-item" onClick={() => handleOpenTopScheme('nsfdc-term-loan')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot purple" />
                    <span>NSFDC Term Loan</span>
                  </div>
                </div>

                <div className="dash-sidebar-group">
                  <span className="dash-group-title">NODAL DESK</span>
                  <div className="dash-search-input">
                    <Search size={12} />
                    <input type="text" placeholder="Search for mentor..." readOnly />
                  </div>
                  <div className="dash-group-item" onClick={() => navigateToFeature('partners')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot blue" />
                    <span>Sunil Kumar (Bank Lead)</span>
                  </div>
                  <div className="dash-group-item" onClick={() => navigateToFeature('partners')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot orange" />
                    <span>Dr. Rita Sharma (DIC)</span>
                  </div>
                  <div className="dash-group-item" onClick={() => navigateToFeature('partners')} style={{ cursor: 'pointer' }}>
                    <span className="dash-dot purple" />
                    <span>MSME Helpdesk</span>
                  </div>
                </div>
              </div>

              {/* Center Timeline Calendar Grid */}
              <div className="dash-col-timeline">
                <div className="dash-timeline-header">
                  <span className="dash-tz-label">PST • November 2025</span>
                </div>

                {/* Days Columns Header */}
                <div className="dash-days-grid">
                  {[
                    { d: '13', day: 'Sun' },
                    { d: '14', day: 'Mon' },
                    { d: '15', day: 'Tue', current: true },
                    { d: '16', day: 'Wed' },
                    { d: '17', day: 'Thu' },
                    { d: '18', day: 'Fri' },
                    { d: '19', day: 'Sat' }
                  ].map(item => (
                    <div 
                      key={item.d} 
                      className={`dash-day-col-header ${item.current ? 'active-today' : ''}`}
                      onClick={() => setSelectedDay(parseInt(item.d))}
                    >
                      <span className="dash-day-num">{item.d}</span>
                      <span className="dash-day-name">{item.day}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline Grid with Colorful Event Blocks */}
                <div className="dash-events-canvas">
                  {/* Time Guide Lines */}
                  <div className="dash-time-guide">
                    <span>9 AM</span>
                    <span>10 AM</span>
                    <span>11 AM</span>
                    <span>12 PM</span>
                    <span>1 PM</span>
                    <span>2 PM</span>
                    <span>3 PM</span>
                    <span>4 PM</span>
                  </div>

                  {/* Scheduled Events Blocks */}
                  <div className="dash-events-layer">
                    {/* Sun 13 Event */}
                    <div className="dash-event-chip col-1 top-10 blue" onClick={() => handleOpenTopScheme()}>
                      <strong>Orientation Call</strong>
                      <span>9:30 – 10:30 AM</span>
                    </div>

                    {/* Mon 14 Event */}
                    <div className="dash-event-chip col-2 top-20 orange" onClick={() => handleOpenTopScheme()}>
                      <strong>DPR Review Session</strong>
                      <span>10:30 – 11:30 AM</span>
                      <div className="dash-chip-avatars">
                        <span className="mini-avatar bg-amber">PS</span>
                        <span className="mini-avatar bg-rose">MB</span>
                      </div>
                    </div>

                    {/* Tue 15 Event (Today) with Current Time Marker */}
                    <div className="dash-event-chip col-3 top-30 red highlight" onClick={() => handleOpenTopScheme()}>
                      <strong>Nodal Inspection @ 11 AM</strong>
                      <span>11:00 AM – 12:30 PM</span>
                      <div className="dash-chip-avatars">
                        <span className="mini-avatar bg-sky">SK</span>
                        <span className="mini-avatar bg-indigo">SD</span>
                      </div>
                    </div>
                    {/* Live Time Indicator Line */}
                    <div className="dash-current-time-line" />

                    {/* Wed 16 Event */}
                    <div className="dash-event-chip col-4 top-20 blue" onClick={() => handleOpenTopScheme()}>
                      <strong>Credit Guarantee Sanction</strong>
                      <span>10:00 – 11:00 AM</span>
                    </div>

                    {/* Thu 17 Event */}
                    <div className="dash-event-chip col-5 top-40 purple" onClick={() => handleOpenTopScheme()}>
                      <strong>State SCA Clearance</strong>
                      <span>1:00 – 2:00 PM</span>
                    </div>

                    {/* Fri 18 Event */}
                    <div className="dash-event-chip col-6 top-15 emerald" onClick={() => handleOpenTopScheme()}>
                      <strong>Margin Money Disbursal</strong>
                      <span>9:45 – 11:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Inbox & Tasks Checklist */}
              <div className="dash-col-tasks">
                <div className="dash-tasks-header">
                  <div className="dash-tasks-tabs">
                    <span className="active">Inbox</span>
                    <span>Complete</span>
                  </div>
                </div>

                <div className="dash-tasks-list">
                  <div className="dash-task-row done">
                    <CheckCircle2 size={13} className="text-emerald" />
                    <span>Upload KYC & Aadhaar docs</span>
                  </div>

                  <div className="dash-task-row done">
                    <CheckCircle2 size={13} className="text-emerald" />
                    <span>Finalize SIDBI DPR document</span>
                  </div>

                  <div className="dash-task-row pending">
                    <div className="dash-task-radio" />
                    <span>Follow up on loan interest subvention</span>
                  </div>

                  <div className="dash-task-row pending">
                    <div className="dash-task-radio" />
                    <span>Submit 3-year projected cash flows</span>
                  </div>

                  <div className="dash-task-row pending">
                    <div className="dash-task-radio" />
                    <span>Update nodal committee meeting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Overlapping Date Pill 15 centered at the bottom */}
            <div className="dash-center-date-pill">
              <span>15</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
