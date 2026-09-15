import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle2, 
  ChevronDown, 
  Inbox, 
  CheckSquare, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ConnectedFeatures: React.FC = () => {
  const { setActiveTab, navigateToFeature } = useProfile();
  const { t } = useLanguage();

  return (
    <section className="connected-features-section" id="connected-features">
      <div className="container">
        {/* Section Headline with Hand-drawn Circular Marker around 'every' */}
        <div className="connected-header">
          <h2 className="connected-title">
            {t.landing.connectedTitlePrefix}{' '}
            <span className="sketched-circle-wrap">
              {t.landing.connectedTitleHighlight}
              <svg className="sketched-circle-svg" viewBox="0 0 120 54" fill="none">
                <path
                  d="M15,28 C12,12 55,4 95,8 C115,10 118,34 92,44 C55,54 18,48 8,30 C3,18 35,8 80,12"
                  stroke="#3B82F6"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{' '}
            {t.landing.connectedTitleSuffix}
          </h2>
          <p className="connected-subtitle">
            {t.landing.connectedSubtitle}
          </p>
        </div>

        {/* 3 Asymmetric Connected Cards Layout matching Figma design */}
        <div className="connected-cards-grid">
          {/* Left Column: Card 1 (Time Travel) & Card 2 (Dossier Threads) */}
          <div className="connected-col-left">
            {/* Card 1: Time Travel */}
            <div className="cf-card card-time-travel">
              <div className="cf-card-header">
                <h3 className="cf-card-title">Time Travel</h3>
                <p className="cf-card-desc">
                  SchemeMatch connects your applications together. Jump back in time to audit past submissions or leap forward to forecast 3-year cash flows.
                </p>
              </div>

              {/* Embedded Meeting / Review Window */}
              <div className="cf-mini-window">
                <div className="cf-window-bar">
                  <span className="cf-pill-btn">
                    Going <ChevronDown size={11} />
                  </span>
                  <div className="mac-dots mini">
                    <span className="mac-dot red" />
                    <span className="mac-dot yellow" />
                    <span className="mac-dot green" />
                  </div>
                </div>

                <div className="cf-meeting-row">
                  <div>
                    <h4 className="cf-meeting-title">PMEGP &lt;&gt; SIDBI Review</h4>
                    <span className="cf-meeting-time">Nov 15th at 11 – 12pm • Weekly on Tuesday</span>
                    <button className="cf-join-btn" onClick={() => navigateToFeature('roadmap')}>
                      <span className="cf-pulse-dot" />
                      <span>Join Nodal Review</span>
                    </button>
                  </div>
                  <div className="cf-avatars">
                    <div className="cf-avatar bg-amber">PS</div>
                    <div className="cf-avatar bg-rose">SD</div>
                  </div>
                </div>
              </div>

              {/* Decorative Hand-drawn Doodle */}
              <div className="cf-doodle-lines left" />
            </div>

            {/* Card 2: Threads */}
            <div className="cf-card card-threads">
              <div className="cf-card-header">
                <h3 className="cf-card-title">Dossier Threads</h3>
                <p className="cf-card-desc">
                  SchemeMatch organizes everything for you in structured dossiers, never worry about missing documentation again.
                </p>
              </div>

              {/* Embedded Dark macOS App Window */}
              <div className="cf-threads-window dark">
                <div className="cf-threads-titlebar">
                  <div className="mac-dots mini">
                    <span className="mac-dot red" />
                    <span className="mac-dot yellow" />
                    <span className="mac-dot green" />
                  </div>
                  <span className="cf-threads-app-title">📁 Scheme Dossiers</span>
                </div>
                <div className="cf-threads-body">
                  <div className="cf-threads-sidebar">
                    <span className="active" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}><Inbox size={12} /> Inbox</span>
                    <span onClick={() => navigateToFeature('roadmap')} style={{ cursor: 'pointer' }}><CheckSquare size={12} /> Tasks</span>
                    <span onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}><FileText size={12} /> DPR Models</span>
                    <span onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}><ShieldCheck size={12} /> Vault</span>
                  </div>
                  <div className="cf-threads-tasks">
                    <div className="cf-task-item done" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>Udyam Aadhaar Sync</span>
                    </div>
                    <div className="cf-task-item done" onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>SIDBI PMEGP DPR Formatted</span>
                    </div>
                    <div className="cf-task-item pending" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                      <div className="cf-circle-radio" />
                      <span>Land Lease NOC Upload</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Card 3 (Task Sidebar) */}
          <div className="connected-col-right">
            <div className="cf-card card-task-sidebar">
              <div className="cf-card-header">
                <h3 className="cf-card-title">Task Sidebar</h3>
                <p className="cf-card-desc">
                  See all your tasks, bank checklists, and action items from across your applications in one place right alongside your funding roadmap.
                </p>
              </div>

              {/* Embedded Task Sidebar Board */}
              <div className="cf-task-board">
                <div className="cf-board-header">
                  <div className="cf-board-tabs">
                    <span className="active">Inbox</span>
                    <span>Complete</span>
                  </div>
                  <span className="cf-board-badge">4 Active</span>
                </div>

                <div className="cf-board-list">
                  <div className="cf-board-item" onClick={() => navigateToFeature('roadmap')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>Follow up on Udyam Registration</strong>
                      <span className="cf-tag blue">Proj Kickoff</span>
                    </div>
                  </div>

                  <div className="cf-board-item highlight" onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>Finalize SIDBI Bankable DPR</strong>
                      <span className="cf-tag gold">Nodal Meeting</span>
                    </div>
                  </div>

                  <div className="cf-board-item" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>Upload Workshop Lease NOC</strong>
                      <span className="cf-tag purple">DIC Verification</span>
                    </div>
                  </div>

                  <div className="cf-board-item" onClick={() => navigateToFeature('whatif')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>Confirm 35% Capital Grant Credit</strong>
                      <span className="cf-tag green">Bank Sanction</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="cf-board-btn"
                  onClick={() => navigateToFeature('roadmap')}
                >
                  <span>Open Full Application Roadmap</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Decorative Hand-drawn Doodle */}
              <div className="cf-doodle-lines right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
