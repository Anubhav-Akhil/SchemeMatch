import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { MainAppDashboard } from './components/MainAppDashboard';
import { SaffronDashboard } from './components/SaffronDashboard';
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
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { FinancialCalculator } from './components/FinancialCalculator';
import { GapAnalyzer } from './components/GapAnalyzer';
import { ChannelPartnerRouter } from './components/ChannelPartnerRouter';
import { 
  Sparkles, 
  FileText, 
  Scale, 
  Compass, 
  CheckCircle2, 
  Filter, 
  Sliders, 
  Calculator, 
  SearchCheck, 
  Building2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView } = useAuth();
  const { t } = useLanguage();
  const {
    activeTab,
    setActiveTab,
    navigateToFeature,
    matchResults,
    otherSchemes,
    totalPotentialSubsidy,
    comparedSchemes,
    personas,
    selectedPersonaId,
    selectPersona
  } = useProfile();

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [showInteractiveTools, setShowInteractiveTools] = useState<boolean>(true);

  // View Routing: 1. Landing Page -> 2. Login/Register -> 3. Main Website (Workspace)
  if (currentView === 'auth') {
    return <AuthPage />;
  }

  if (currentView === 'app') {
    return <SaffronDashboard />;
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

      {/* Interactive AI Workspace: Central Command Hub */}
      <div className="container" id="interactive-workspace" style={{ marginTop: '40px', marginBottom: '60px' }}>
        {/* Workspace Banner & Status Bar */}
        <div className="workspace-hero-bar">
          <div className="workspace-hero-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="workspace-live-badge">
                <span className="pulse-dot" /> LIVE INTERACTIVE ENGINES
              </span>
              <span className="workspace-ai-status">Groq Llama-3.3 Cloud Active</span>
            </div>
            <h2 className="workspace-hero-title">
              Affirmative Scheme Matching &amp; Bankable Credit Suite
            </h2>
            <p className="workspace-hero-desc">
              Interact directly with all 9 core engines below. Select a profile or type in natural language to compute eligibility, simulate 35% subsidies, and generate SIDBI-compliant DPRs.
            </p>
          </div>

          <div className="workspace-hero-stats">
            <div className="ws-stat-card">
              <span className="ws-stat-num">{matchResults.length}</span>
              <span className="ws-stat-label">Eligible Schemes</span>
            </div>
            <div className="ws-stat-card highlight">
              <span className="ws-stat-num">₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</span>
              <span className="ws-stat-label">Potential Subsidy</span>
            </div>
            <button
              onClick={() => setShowInteractiveTools(!showInteractiveTools)}
              className="workspace-toggle-btn"
              title={showInteractiveTools ? "Collapse interactive engine section" : "Expand interactive engine section"}
            >
              {showInteractiveTools ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              <span>{showInteractiveTools ? 'Minimize' : 'Expand Tools'}</span>
            </button>
          </div>
        </div>

        {showInteractiveTools && (
          <div className="workspace-card-surface">
            {/* 1-Click Interactive Persona Selector */}
            <div className="persona-quick-bar">
              <div className="persona-bar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} className="text-amber" />
                  <strong>1-Click Persona Simulator:</strong>
                </div>
                <span className="persona-bar-hint">
                  Select an entrepreneur below to watch real-time eligibility scores and subsidies recalculate instantly:
                </span>
              </div>

              <div className="persona-quick-grid">
                {personas.slice(0, 4).map((p) => {
                  const isSelected = selectedPersonaId === p.id;
                  return (
                    <button
                      key={p.id}
                      className={`persona-quick-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => selectPersona(p.id)}
                      type="button"
                    >
                      <span className="persona-chip-avatar">{p.avatarEmoji}</span>
                      <div className="persona-chip-body">
                        <div className="persona-chip-name-row">
                          <span className="persona-chip-name">{p.fullName}</span>
                          {isSelected && (
                            <span className="persona-selected-tag">
                              <Check size={11} /> Selected
                            </span>
                          )}
                        </div>
                        <span className="persona-chip-role">{p.headline}</span>
                        <div className="persona-chip-tags">
                          <span className="p-tag cat">{p.category}</span>
                          <span className="p-tag loc">{p.locationType}</span>
                          <span className="p-tag loan">₹{(p.requiredLoanAmount / 100000).toFixed(1)}L Loan</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs Bar for all 9 core engines */}
            <nav className="nav-tabs-bar modern-tabs-bar" aria-label="SchemeMatch Features">
              <button
                className={`nav-tab-btn ${activeTab === 'matcher' ? 'active' : ''}`}
                onClick={() => setActiveTab('matcher')}
              >
                <Sparkles size={16} />
                <span>AI Matcher &amp; Extractor</span>
                <span className="tab-badge-count">{matchResults.length}</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'whatif' ? 'active' : ''}`}
                onClick={() => setActiveTab('whatif')}
              >
                <Sliders size={16} />
                <span>What-If Simulator</span>
                <span className="tab-badge-pulse">Live</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                <Calculator size={16} />
                <span>Financial &amp; EMI Calculator</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'gap' ? 'active' : ''}`}
                onClick={() => setActiveTab('gap')}
              >
                <SearchCheck size={16} />
                <span>Eligibility Gap Diagnostic</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'dpr' ? 'active' : ''}`}
                onClick={() => setActiveTab('dpr')}
              >
                <FileText size={16} />
                <span>Bank-Ready DPR</span>
                <span className="tab-badge-accent">SIDBI</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <CheckCircle2 size={16} />
                <span>Document Readiness</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparison')}
              >
                <Scale size={16} />
                <span>Comparison Matrix</span>
                {comparedSchemes.length > 0 && (
                  <span className="tab-badge-saffron">{comparedSchemes.length}</span>
                )}
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('roadmap')}
              >
                <Compass size={16} />
                <span>Application Roadmap</span>
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'partners' ? 'active' : ''}`}
                onClick={() => setActiveTab('partners')}
              >
                <Building2 size={16} />
                <span>Channel Partner Locator</span>
              </button>
            </nav>

            {/* Active Workspace View Area */}
            <main className="workspace-view-container">
              {/* Tab 1: AI Scheme Matcher & Extractor */}
              {activeTab === 'matcher' && (
                <div className="workspace-tab-view animate-fade-in">
                  <EligibilityWizard />

                  <section className="matcher-results-section" style={{ marginTop: '36px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <h2>{t.results.topMatchesTitle}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                          Found <strong>{matchResults.length} prioritized schemes</strong> with up to{' '}
                          <strong style={{ color: '#059669' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> in capital subsidies &amp; concessional funding.
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
                          style={{ padding: '7px 14px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
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

              {/* Tab 2: What-If Simulator */}
              {activeTab === 'whatif' && (
                <div className="workspace-tab-view animate-fade-in">
                  <WhatIfSimulator />
                </div>
              )}

              {/* Tab 3: Financial & EMI Calculator */}
              {activeTab === 'calculator' && (
                <div className="workspace-tab-view animate-fade-in">
                  <FinancialCalculator />
                </div>
              )}

              {/* Tab 4: Eligibility Gap Diagnostic */}
              {activeTab === 'gap' && (
                <div className="workspace-tab-view animate-fade-in">
                  <GapAnalyzer />
                </div>
              )}

              {/* Tab 5: Bank-Ready DPR Generator */}
              {activeTab === 'dpr' && (
                <div className="workspace-tab-view animate-fade-in">
                  <DprGeneratorView />
                </div>
              )}

              {/* Tab 6: Document Readiness Scanner */}
              {activeTab === 'documents' && (
                <div className="workspace-tab-view animate-fade-in">
                  <DocumentReadiness />
                </div>
              )}

              {/* Tab 7: Scheme Comparison */}
              {activeTab === 'comparison' && (
                <div className="workspace-tab-view animate-fade-in">
                  <SchemeComparison />
                </div>
              )}

              {/* Tab 8: Application Navigator */}
              {activeTab === 'roadmap' && (
                <div className="workspace-tab-view animate-fade-in">
                  <ApplicationNavigator />
                </div>
              )}

              {/* Tab 9: Channel Partner Locator */}
              {activeTab === 'partners' && (
                <div className="workspace-tab-view animate-fade-in">
                  <ChannelPartnerRouter />
                </div>
              )}
            </main>
          </div>
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
