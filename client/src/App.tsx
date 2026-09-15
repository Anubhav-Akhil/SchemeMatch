import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { MainAppDashboard } from './components/MainAppDashboard';
import { Header } from './components/Header';
import { HeroScrollWindow } from './components/HeroScrollWindow';
import { SuperpoweredCardsSection } from './components/SuperpoweredCardsSection';
import { BentoShowcase } from './components/BentoShowcase';
import { ConnectedFeatures } from './components/ConnectedFeatures';
import { FullDashboardShowcase } from './components/FullDashboardShowcase';
import { BottomCTA } from './components/BottomCTA';
import { EligibilityWizard } from './components/EligibilityWizard';
import { SchemeCard } from './components/SchemeCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { SchemeComparison } from './components/SchemeComparison';
import { DprGeneratorView } from './components/DprGeneratorView';
import { DocumentReadiness } from './components/DocumentReadiness';
import { ApplicationNavigator } from './components/ApplicationNavigator';
import { SaathiAICopilot } from './components/SaathiAICopilot';
import { Sparkles, FileText, Scale, Compass, CheckCircle2, Filter } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView } = useAuth();
  const { t } = useLanguage();
  const {
    activeTab,
    setActiveTab,
    matchResults,
    otherSchemes,
    totalPotentialSubsidy,
    comparedSchemes
  } = useProfile();

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [showInteractiveTools, setShowInteractiveTools] = useState<boolean>(false);

  // View Routing: 1. Landing Page -> 2. Login/Register -> 3. Main Website (Workspace)
  if (currentView === 'auth') {
    return <AuthPage />;
  }

  if (currentView === 'app') {
    return <MainAppDashboard />;
  }

  // Filter schemes on landing interactive preview
  const filteredMatches = matchResults.filter((m) => {
    if (selectedFilterCategory !== 'all') {
      if (
        !m.scheme.categoryTag.toLowerCase().includes(selectedFilterCategory.toLowerCase()) &&
        !m.scheme.targetGroups.includes(selectedFilterCategory)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header />

      {/* 1st Scroll Window: Hero Section matching Image 1 (Headline & Typography) & Image 2 (Visual with movement animations) */}
      <HeroScrollWindow />

      {/* 2nd Scroll Window: Superpowered Cards Section matching the reference design */}
      <SuperpoweredCardsSection />

      {/* 3rd Scroll Window: Bento Showcase matching "Find the Right Government Schemes" */}
      <BentoShowcase />

      {/* 4th Scroll Window: Connected Features ("Leave every application feeling Confident") */}
      <ConnectedFeatures />

      {/* 5th Scroll Window: Full-Width Workspace Showcase ("All in a workspace, that's a joy to use") */}
      <FullDashboardShowcase />

      {/* Interactive AI Workspace Toggle & Tabs */}
      <div className="container" id="interactive-workspace" style={{ marginTop: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: showInteractiveTools ? '20px' : '0' }}>
          <button
            onClick={() => setShowInteractiveTools(!showInteractiveTools)}
            className="btn-secondary"
            style={{ 
              padding: '10px 22px', 
              fontSize: '0.88rem', 
              borderRadius: 'var(--radius-full)',
              background: showInteractiveTools ? 'var(--bg-surface-elevated)' : 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: '#4F46E5',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.1)'
            }}
          >
            <Sparkles size={16} />
            <span>{showInteractiveTools ? 'Collapse Interactive AI Engine Tools' : '⚡ Open Live Interactive AI Scheme Engine'}</span>
          </button>
        </div>

        {showInteractiveTools && (
          <>
            <nav className="nav-tabs-bar" aria-label="SchemeMatch Features" style={{ marginTop: '16px' }}>
              <button
                className={`nav-tab-btn ${activeTab === 'matcher' ? 'active' : ''}`}
                onClick={() => { setActiveTab('matcher'); }}
              >
                <Sparkles size={18} />
                <span>{t.tabs.matcher}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>({matchResults.length})</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'dpr' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dpr'); }}
              >
                <FileText size={18} />
                <span>{t.tabs.dpr}</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => { setActiveTab('documents'); }}
              >
                <CheckCircle2 size={18} />
                <span>{t.tabs.documents}</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => { setActiveTab('comparison'); }}
              >
                <Scale size={18} />
                <span>{t.tabs.comparison}</span>
                {comparedSchemes.length > 0 && (
                  <span className="badge badge-saffron" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                    {comparedSchemes.length}
                  </span>
                )}
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => { setActiveTab('roadmap'); }}
              >
                <Compass size={18} />
                <span>{t.tabs.roadmap}</span>
              </button>
            </nav>

            <main className="container" style={{ marginTop: '24px' }}>
              {/* Tab 1: AI Scheme Matcher */}
              {activeTab === 'matcher' && (
                <div>
                  <EligibilityWizard />

                  <section className="matcher-results-section" style={{ marginTop: '36px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <h2>{t.results.topMatchesTitle}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                          Found <strong>{matchResults.length} prioritized schemes</strong> with up to{' '}
                          <strong style={{ color: '#059669' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> in capital subsidies & concessional funding.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <Filter size={16} />
                          <span>Filter:</span>
                        </div>
                        <select
                          value={selectedFilterCategory}
                          onChange={(e) => setSelectedFilterCategory(e.target.value)}
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          <option value="all">All Schemes ({matchResults.length})</option>
                          <option value="Credit Subsidy">Credit Subsidy</option>
                          <option value="Term Loan">Term Loans</option>
                          <option value="Grant">Direct Grants</option>
                          <option value="Micro-Credit">Micro-Credit</option>
                          <option value="Women">Women Entrepreneurs</option>
                          <option value="SC">SC / ST Entrepreneurs</option>
                          <option value="OBC">OBC Entrepreneurs</option>
                          <option value="Safai Karamchari">Safai Karamchari</option>
                        </select>
                      </div>
                    </div>

                    <div className="schemes-list">
                      {filteredMatches.map((match) => (
                        <SchemeCard key={match.scheme.id} matchResult={match} />
                      ))}
                    </div>

                    {otherSchemes.length > 0 && (
                      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px dashed var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                          Other Evaluated Government Schemes ({otherSchemes.length})
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                          These schemes are currently conditional due to trade type, income ceiling, or specific criteria.
                        </p>
                        <div className="schemes-list">
                          {otherSchemes.slice(0, 3).map((match) => (
                            <SchemeCard key={match.scheme.id} matchResult={match} />
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Tab 2: Bank-Ready DPR Generator */}
              {activeTab === 'dpr' && <DprGeneratorView />}

              {/* Tab 3: Document Readiness Scanner */}
              {activeTab === 'documents' && <DocumentReadiness />}

              {/* Tab 4: Scheme Comparison */}
              {activeTab === 'comparison' && <SchemeComparison />}

              {/* Tab 5: Application Navigator */}
              {activeTab === 'roadmap' && <ApplicationNavigator />}
            </main>
          </>
        )}
      </div>

      {/* Floating Saathi AI Voice Copilot */}
      <SaathiAICopilot />

      {/* Deep Dive Details Modal */}
      <SchemeDetailModal />

      {/* 6th Scroll Window: Bottom CTA & Verified Footer ("It's time. Get SchemeMatched") */}
      <BottomCTA />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}

export default App;
