import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ChatFeatureMode, UserProfile, SupportedLanguage } from '../types';
import { 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  History,
  Globe,
  ChevronDown
} from 'lucide-react';
import { 
  EmiCardView, 
  DocumentChecklistCardView, 
  PartnerFinderCardView, 
  WhatIfCardView, 
  EligibilityCardView 
} from './SaathiChatCards';
import { ApplyProfileCard } from './ApplyProfileCard';
import { ApplyProfileLoadingModal } from './ApplyProfileLoadingModal';
import { ChatHistoryDrawer, SavedChatSession, saveStoredChatSession, loadStoredChatSessions } from './ChatHistoryDrawer';
import { generateSaathiFallback } from '../utils/saathiFallback';
import { 
  SUGGESTIONS, 
  SAATHI_LANGUAGES, 
  SAATHI_UI_LABELS, 
  getSaathiMessageDisplay 
} from '../utils/saathiSuggestions';
import { API_BASE_URL } from '../config';

export const SaathiAICopilot: React.FC = () => {
  const { speakText, stopSpeech, isSpeaking, language: globalLang, setLanguage } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal, setActiveTab, allSchemes, matchResults } = useProfile();
  const { setCurrentView } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chatLang, setChatLang] = useState<SupportedLanguage>(globalLang);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Chat History Drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(() => loadStoredChatSessions().length);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handler = () => {
      setHistoryCount(loadStoredChatSessions().length);
    };
    window.addEventListener('saathi_history_updated', handler);
    return () => window.removeEventListener('saathi_history_updated', handler);
  }, []);

  // Loading popup state when user chooses to apply details & view schemes
  const [isApplyingModal, setIsApplyingModal] = useState<boolean>(false);
  const [applyingStep, setApplyingStep] = useState<number>(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize chatLang with global language
  useEffect(() => {
    setChatLang(globalLang);
  }, [globalLang]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-save active chat to localStorage history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || 'Government Scheme Query';
      const title = firstUserMsg.length > 36 ? firstUserMsg.slice(0, 36) + '...' : firstUserMsg;
      const sessionId = currentSessionId || `session-${Date.now()}`;
      if (!currentSessionId) setCurrentSessionId(sessionId);

      saveStoredChatSession({
        id: sessionId,
        title,
        updatedAt: Date.now(),
        formattedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        messages
      });
    }
  }, [messages, currentSessionId]);

  // Auto-expand textarea height up to 140px
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputQuery(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(Math.max(target.scrollHeight, 26), 140);
    target.style.height = `${newHeight}px`;
  };

  // Safe Scheme Details opener (crash-proof)
  const handleOpenSchemeDetails = (s: { id: string; name: string }) => {
    const existing = matchResults?.find(m => m.scheme?.id === s.id);
    if (existing) {
      setSelectedSchemeModal(existing);
      return;
    }
    const fullScheme = allSchemes?.find(item => item.id === s.id);
    if (fullScheme) {
      setSelectedSchemeModal({
        scheme: fullScheme,
        matchScore: 92,
        estimatedSubsidyAmount: Math.round(fullScheme.maxLoanAmount * 0.25),
        reasonsWhyMatched: ['Direct match based on your inquiry.'],
        conditionsToFulfill: [],
        missingDocuments: []
      } as any);
      return;
    }

    // Dynamic fallback scheme modal data
    setSelectedSchemeModal({
      scheme: {
        id: s.id,
        name: s.name,
        hindiName: s.name,
        ministry: 'Ministry of Social Justice & Empowerment (MoSJE)',
        apexBody: 'National Corporations (NSFDC / NBCFDC / KVIC)',
        categoryTag: 'Micro-Enterprise & Subsidized Credit',
        summary: 'Government-assisted subsidized business credit facility with direct margin money capital subsidy support.',
        hindiSummary: 'सरकारी रियायती व्यावसायिक ऋण एवं पूंजीगत सब्सिडी सहायता योजना।',
        detailedOverview: 'Provides collateral-free financial support and capital subsidy up to 35% for establishing and expanding sustainable micro-enterprises across manufacturing, service, and trading sectors.',
        targetGroups: ['SC', 'ST', 'OBC', 'Women', 'Minority', 'Rural Artisans'],
        minLoanAmount: 20000,
        maxLoanAmount: 1000000,
        subsidyRate: { generalUrban: 0.15, generalRural: 0.25, specialUrban: 0.25, specialRural: 0.35, maxSubsidyAmount: 350000 },
        promoterContributionMinPercent: { general: 10, specialCategory: 5 },
        interestRatePerAnnum: '4% - 8.5% p.a.',
        interestSubventionPercent: 3,
        moratoriumPeriodMonths: 6,
        repaymentTenureYears: 5,
        collateralRequirement: 'No collateral required up to ₹10 Lakhs (Covered under CGTMSE guarantee).',
        eligibility: {
          allowedCategories: ['SC', 'ST', 'OBC', 'General', 'Minority', 'SafaiKaramchari'],
          allowedGenders: ['Male', 'Female', 'Transgender', 'Other'],
          minAge: 18,
          maxAge: 55,
          allowedLocations: ['Rural', 'Urban', 'Semi-Urban'],
          allowedSectors: ['Manufacturing', 'Services', 'Trading', 'ArtisanHandicraft', 'AgroAllied', 'StreetVending', 'Sanitation', 'Textiles'],
          incomeCeilingAnnual: 350000
        },
        applicationUrl: 'https://jansamarth.in',
        helplineNumber: '1800-180-6763'
      },
      matchScore: 82,
      ruleTrace: ['Recommended directly based on conversation parameters.'],
      subsidyAmount: 70000,
      effectiveMarginMoney: 10000,
      applicantLoanAmount: 200000,
      estMonthlyEMI: 4100
    } as any);
  };

  // Handler for Applying details captured in AI chat to Scheme Recommender
  const handleApplyDetailsAndRedirect = async (extractedUpdates: Partial<UserProfile>) => {
    setIsApplyingModal(true);
    setApplyingStep(1);

    await new Promise((r) => setTimeout(r, 450));
    setApplyingStep(2);

    const completeLoan = Number(extractedUpdates.requiredLoanAmount || profile.requiredLoanAmount || 200000);
    const completeCost = Number(extractedUpdates.totalProjectCost || profile.totalProjectCost || Math.round(completeLoan * 1.1));
    const completeMargin = Number(profile.promoterContributionAvailable || Math.round(completeLoan * 0.1));

    const updatedProfile: UserProfile = {
      ...profile,
      ...extractedUpdates,
      category: (extractedUpdates.category || profile.category || 'OBC') as any,
      sector: (extractedUpdates.sector || profile.sector || 'Services') as any,
      tradeType: extractedUpdates.tradeType || profile.tradeType || 'Micro Enterprise',
      requiredLoanAmount: completeLoan,
      totalProjectCost: completeCost,
      promoterContributionAvailable: completeMargin,
      locationType: (extractedUpdates.locationType || profile.locationType || 'Rural') as any,
      state: extractedUpdates.state || profile.state || 'Uttar Pradesh',
      annualFamilyIncome: Number(extractedUpdates.annualFamilyIncome || profile.annualFamilyIncome || 250000),
      age: Number(profile.age || 28),
      gender: (extractedUpdates.gender || profile.gender || 'Female') as any
    };

    setProfile(updatedProfile as any);
    await runMatching(updatedProfile as any);

    await new Promise((r) => setTimeout(r, 550));
    setApplyingStep(3);

    await new Promise((r) => setTimeout(r, 400));
    setIsApplyingModal(false);
    setIsOpen(false);
    setCurrentView('app');
    setActiveTab('matcher');
  };

  const handleSendMessage = async (queryToSend?: string, mode?: ChatFeatureMode) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      featureMode: mode,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const chatHistory = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          profile,
          mode,
          history: chatHistory
        })
      });

      if (res.ok) {
        const reply: ChatMessage = await res.json();
        setMessages((prev) => [...prev, reply]);
      } else {
        throw new Error(`Chat API responded with ${res.status}`);
      }
    } catch (err) {
      console.warn('Backend unavailable or errored, using Saathi domain fallback:', err);
      const fallbackReply = generateSaathiFallback(q, profile, mode);
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const voiceLangMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN'
      };
      recognition.lang = voiceLangMap[chatLang] || 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecordingVoice(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsRecordingVoice(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => setIsRecordingVoice(false);
      recognition.onend = () => setIsRecordingVoice(false);
      recognition.start();
    } catch {
      setIsRecordingVoice(false);
    }
  };

  const handleAudioToggle = (msg: ChatMessage) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(getSaathiMessageDisplay(msg, chatLang), chatLang);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    stopSpeech();
  };

  const handleSelectSession = (session: SavedChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setIsHistoryOpen(false);
    stopSpeech();
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setChatLang(newLang);
    setLanguage(newLang);
    setIsLangMenuOpen(false);
  };

  const uiLabels = SAATHI_UI_LABELS[chatLang] || SAATHI_UI_LABELS.en;
  const currentLangObj = SAATHI_LANGUAGES.find(l => l.code === chatLang) || SAATHI_LANGUAGES[0];

  return (
    <>
      {/* Floating Action Trigger Button on Landing Page */}
      <button
        className="saathi-floating-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open Chat Bot"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <img 
          src="/logo.png" 
          alt="Saathi AI" 
          style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
        />
        <span>Saathi AI</span>
        <ArrowRight size={16} />
      </button>

      {/* Modern Modal Window matching the attached Figma screenshot */}
      {isOpen && (
        <div className="chatbot-modal-overlay" onClick={() => setIsOpen(false)}>
          <div 
            className="chatbot-figma-card" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Chat Bot UI"
            style={{ position: 'relative' }}
          >
            {/* Top Bar */}
            <div className="chatbot-figma-top-bar">
              <div className="chatbot-figma-title" style={{ fontWeight: 700, color: 'var(--text-primary, #0F172A)', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <img src="/logo.png" alt="Saathi AI" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'contain', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>Saathi AI</span>
              </div>

              <div className="chatbot-figma-actions">
                {/* Multilingual Selector supporting all 6 languages */}
                <div className="saathi-lang-selector" ref={langDropdownRef}>
                  <button
                    type="button"
                    className="saathi-lang-selector-trigger"
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    title="Change Language"
                    aria-expanded={isLangMenuOpen}
                  >
                    <Globe size={13} />
                    <span className="saathi-lang-selector-label">{currentLangObj.label}</span>
                    <ChevronDown size={11} className={`saathi-lang-selector-chevron ${isLangMenuOpen ? 'open' : ''}`} />
                  </button>

                  {isLangMenuOpen && (
                    <div className="saathi-lang-dropdown-menu">
                      {SAATHI_LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          className={`saathi-lang-dropdown-item ${chatLang === l.code ? 'active' : ''}`}
                          onClick={() => handleLanguageChange(l.code)}
                        >
                          <span className="saathi-lang-item-name">{l.label}</span>
                          <span className="saathi-lang-item-badge">{l.short}</span>
                          {chatLang === l.code && <span className="saathi-lang-item-check">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chat History Drawer Toggle Button */}
                <button
                  type="button"
                  className={`chatbot-figma-history-pill ${isHistoryOpen ? 'active' : ''}`}
                  onClick={() => setIsHistoryOpen(h => !h)}
                  title="View Saved Chat History"
                >
                  <History size={13} className="chatbot-figma-history-icon" />
                  <span>{uiLabels.history}</span>
                  {historyCount > 0 && (
                    <span className="chatbot-figma-history-count-badge">
                      {historyCount}
                    </span>
                  )}
                </button>

                {/* New Chat Button */}
                <button
                  type="button"
                  className="chatbot-figma-close-btn"
                  onClick={handleNewChat}
                  title={uiLabels.newChatTitle}
                  style={{ fontSize: '0.78rem', gap: '4px' }}
                >
                  <RefreshCw size={14} />
                </button>

                <button
                  type="button"
                  className="chatbot-figma-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat History Drawer */}
            <ChatHistoryDrawer
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              currentSessionId={currentSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              lang={chatLang}
            />

            {/* Main Content Area */}
            {messages.length === 0 ? (
              /* Initial State: Star icon and headline */
              <div className="chatbot-figma-hero">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="chatbot-figma-star">
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"/>
                </svg>
                <h1 className="chatbot-figma-headline">
                  {uiLabels.heroHeadline}
                </h1>
              </div>
            ) : (
              /* Conversation Stream */
              <div className="chatbot-figma-stream">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chatbot-figma-bubble ${msg.sender}`}>
                    {msg.sender === 'assistant' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-saffron)' }}>
                          Saathi AI
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAudioToggle(msg)}
                          style={{ background: 'transparent', border: 'none', color: isSpeaking ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '2px' }}
                          title={isSpeaking ? 'Stop Audio' : 'Listen aloud'}
                        >
                          {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      </div>
                    )}

                    <div style={{ whiteSpace: 'pre-line' }}>
                      {getSaathiMessageDisplay(msg, chatLang)}
                    </div>

                    {/* Matched schemes with crash-free View Details handler */}
                    {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.matchedSchemes.map((s) => (
                          <div
                            key={s.id}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '8px',
                              border: '1px solid rgba(226, 232, 240, 0.9)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.84rem', display: 'block', color: '#0F172A' }}>{s.name}</strong>
                              <span style={{ fontSize: '0.74rem', color: '#EA580C', fontWeight: 600 }}>{s.subsidyHighlight}</span>
                            </div>
                            <button
                              type="button"
                              className="card-quick-action"
                              onClick={() => handleOpenSchemeDetails(s)}
                              style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                            >
                              {uiLabels.viewDetails}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rich Cards */}
                    {msg.emiCard && <EmiCardView card={msg.emiCard} onPromptClick={handleSendMessage} lang={chatLang} />}
                    {msg.documentCard && <DocumentChecklistCardView card={msg.documentCard} onPromptClick={handleSendMessage} lang={chatLang} />}
                    {msg.partnerCard && <PartnerFinderCardView card={msg.partnerCard} onPromptClick={handleSendMessage} lang={chatLang} />}
                    {msg.whatIfCard && <WhatIfCardView card={msg.whatIfCard} onPromptClick={handleSendMessage} lang={chatLang} />}
                    {msg.eligibilityCard && <EligibilityCardView card={msg.eligibilityCard} onPromptClick={handleSendMessage} lang={chatLang} />}

                    {/* Apply Profile Details to Scheme Recommender Card */}
                    {msg.extractedProfileUpdates && (
                      <ApplyProfileCard
                        extractedUpdates={msg.extractedProfileUpdates}
                        lang={chatLang}
                        onApply={handleApplyDetailsAndRedirect}
                      />
                    )}

                    <div style={{ fontSize: '0.66rem', color: '#94A3B8', textAlign: 'right', marginTop: '4px' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chatbot-figma-bubble assistant" style={{ fontStyle: 'italic', fontSize: '0.86rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} className="spin-slow" />
                      {uiLabels.thinking}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Suggestions Section: exactly matching screenshot */}
            <div className="chatbot-figma-suggestions">
              <div className="chatbot-figma-suggestions-title">
                {uiLabels.suggestionsTitle}
              </div>

              <div className="chatbot-figma-suggestions-grid">
                {SUGGESTIONS.map((s, idx) => {
                  const title = s.title[chatLang] || s.title.en;
                  const sub = s.sub[chatLang] || s.sub.en;
                  const prompt = s.prompt[chatLang] || s.prompt.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="chatbot-figma-chip-card"
                      onClick={() => handleSendMessage(prompt, s.mode)}
                    >
                      <span className="chatbot-figma-chip-main">
                        {title}
                      </span>
                      <span className="chatbot-figma-chip-sub">
                        {sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Bar: Multi-line Auto-Expanding Textarea with mic on-off toggle */}
            <div className="chatbot-figma-input-container">
              <div className="chatbot-figma-input-box" style={{ alignItems: 'center' }}>
                <button
                  type="button"
                  className={`saathi-mic-toggle-btn ${isRecordingVoice ? 'on' : 'off'}`}
                  onClick={toggleVoiceInput}
                  title={isRecordingVoice ? uiLabels.turnMicOffTitle : uiLabels.turnMicOnTitle}
                  aria-pressed={isRecordingVoice}
                >
                  {isRecordingVoice ? <Mic size={15} /> : <MicOff size={15} />}
                  <span>{isRecordingVoice ? uiLabels.micOn : uiLabels.micOff}</span>
                  <div className="saathi-mic-toggle-indicator">
                    <div className="saathi-mic-toggle-thumb" />
                  </div>
                </button>

                <textarea
                  ref={textareaRef}
                  className="chatbot-figma-textarea"
                  value={inputQuery}
                  rows={1}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isRecordingVoice
                      ? (chatLang === 'hi' ? 'बोलें, हम सुन रहे हैं...' : chatLang === 'pa' ? 'ਬੋਲੋ, ਸੁਣ ਰਹੇ ਹਾਂ...' : 'Listening...')
                      : uiLabels.inputPlaceholder
                  }
                />

                <button
                  type="button"
                  className="chatbot-figma-send-btn"
                  onClick={() => handleSendMessage()}
                  aria-label={uiLabels.sendTitle}
                  title={uiLabels.sendTitle}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal when applying details and redirecting to Scheme Recommender */}
      <ApplyProfileLoadingModal
        isOpen={isApplyingModal}
        step={applyingStep}
        lang={chatLang}
      />
    </>
  );
};
