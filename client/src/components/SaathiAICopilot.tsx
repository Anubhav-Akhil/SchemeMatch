import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ChatFeatureMode, UserProfile } from '../types';
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
  History
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
import { API_BASE_URL } from '../config';

interface SuggestionOption {
  titleEn: string;
  titleHi: string;
  titlePa: string;
  subEn: string;
  subHi: string;
  subPa: string;
  mode: ChatFeatureMode;
  prompt: string;
}

const SUGGESTIONS: SuggestionOption[] = [
  {
    titleEn: 'Find a scheme',
    titleHi: 'योजना खोजें',
    titlePa: 'ਸਕੀਮ ਲੱਭੋ',
    subEn: 'Best schemes for your work & profile',
    subHi: 'अपनी प्रोफ़ाइल हेतु सर्वश्रेष्ठ योजनाएं',
    subPa: 'ਆਪਣੇ ਕੰਮ ਲਈ ਵਧੀਆ ਸਕੀਮਾਂ',
    mode: 'recommendation',
    prompt: 'Find a scheme based on my work and profile'
  },
  {
    titleEn: 'Documents needed',
    titleHi: 'आवश्यक दस्तावेज़',
    titlePa: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
    subEn: 'Check personalized document checklist',
    subHi: 'आवेदन हेतु दस्तावेज़ों की सूची',
    subPa: 'ਕਰਜ਼ੇ ਲਈ ਜ਼ਰੂਰੀ ਕਾਗਜ਼ਾਤ ਸੂਚੀ',
    mode: 'documents',
    prompt: 'What documents are needed to apply for loans?'
  },
  {
    titleEn: 'Calculate EMI',
    titleHi: 'EMI गणना करें',
    titlePa: 'EMI ਗਣਨਾ ਕਰੋ',
    subEn: 'Loan amount, subsidy & monthly EMI',
    subHi: 'ऋण, सरकारी सब्सिडी व मासिक किस्त',
    subPa: 'ਕਰਜ਼ਾ, ਸਬਸਿਡੀ ਅਤੇ ਮਾਸਿਕ ਕਿਸ਼ਤ',
    mode: 'emi',
    prompt: 'Calculate loan EMI, interest rate, and subsidy'
  },
  {
    titleEn: 'Where to apply',
    titleHi: 'कहाँ आवेदन करें',
    titlePa: 'ਕਿੱਥੇ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ',
    subEn: 'Authorized banks & channel partners',
    subHi: 'अधिकृत बैंक और चैनल पार्टनर खोजें',
    subPa: 'ਅਧਿਕਾਰਤ ਬੈਂਕ ਤੇ ਚੈਨਲ ਪਾਰਟਨਰ',
    mode: 'partners',
    prompt: 'Where to apply and authorized channel partners'
  }
];

export const SaathiAICopilot: React.FC = () => {
  const { speakText, stopSpeech, isSpeaking, language: globalLang } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal, setActiveTab, allSchemes, matchResults } = useProfile();
  const { setCurrentView } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'pa'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Chat History Drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(() => loadStoredChatSessions().length);

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

  useEffect(() => {
    if (globalLang === 'hi') setChatLang('hi');
    else if (globalLang === 'pa') setChatLang('pa');
    else setChatLang('en');
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

  // Adjust textarea height dynamically with content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputQuery(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(Math.max(target.scrollHeight, 36), 140);
    target.style.height = `${newHeight}px`;
  };

  // Safe Scheme Details modal opener (prevents crashing by ensuring full Scheme object exists)
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
    // Safe fallback scheme
    setSelectedSchemeModal({
      scheme: {
        id: s.id,
        name: s.name,
        hindiName: '',
        apexBody: 'MoSJE & Commercial Banks',
        categoryTag: 'Government Scheme',
        targetGroups: ['All Entrepreneurs'],
        minLoanAmount: 50000,
        maxLoanAmount: 1000000,
        interestRatePerAnnum: 'Concessional (8% - 10%)',
        subsidyRate: { specialRural: 35, specialUrban: 25 },
        promoterContributionMinPercent: { general: 10, specialCategory: 5 },
        collateralRequirement: 'Collateral-free (CGTMSE)',
        keyHighlights: ['Direct financial assistance', 'Subsidized interest rate', 'Bankable project support'],
        mandatoryDocuments: ['Aadhaar Card', 'PAN Card', 'Bank Account Statement', 'Business Project Outline'],
        nodalAgency: 'Designated Government Agency / Bank',
        averageProcessingDays: 21,
        officialPortalUrl: 'https://www.myscheme.gov.in/',
        detailedOverview: 'Government enterprise funding and subsidy scheme.'
      } as any,
      matchScore: 90,
      estimatedSubsidyAmount: 250000,
      reasonsWhyMatched: ['Eligible under national scheme guidelines.'],
      conditionsToFulfill: [],
      missingDocuments: []
    } as any);
  };

  // Seamless transition: Populates form, runs 35+ scheme calculations, and redirects to Scheme Recommender
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

    setProfile(updatedProfile);
    await runMatching(updatedProfile);

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
      }
    } catch (err) {
      console.error('Chat query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I am here to help. Could you please rephrase or try again?',
          hindiText: 'मैं आपकी सहायता के लिए तैयार हूँ। कृपया पुनः प्रयास करें।',
          punjabiText: 'ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਹਾਜ਼ਰ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
          timestamp: 'Just now'
        }
      ]);
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
      recognition.lang = chatLang === 'hi' ? 'hi-IN' : chatLang === 'pa' ? 'pa-IN' : 'en-IN';
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

  const getMessageDisplay = (msg: ChatMessage) => {
    if (chatLang === 'hi' && msg.hindiText) return msg.hindiText;
    if (chatLang === 'pa' && msg.punjabiText) return msg.punjabiText;
    return msg.text;
  };

  const handleAudioToggle = (msg: ChatMessage) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(getMessageDisplay(msg), chatLang);
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
        <span>Ask Saathi AI</span>
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
              <span className="chatbot-figma-title" style={{ fontWeight: 600, color: 'var(--text-primary, #0F172A)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="Saathi AI" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'contain' }} />
                Saathi AI
              </span>

              <div className="chatbot-figma-actions">
                {/* Language Switcher */}
                <div className="saathi-lang-switcher">
                  <button 
                    type="button" 
                    className={`saathi-lang-btn ${chatLang === 'en' ? 'active' : ''}`}
                    onClick={() => setChatLang('en')}
                  >
                    EN
                  </button>
                  <button 
                    type="button" 
                    className={`saathi-lang-btn ${chatLang === 'hi' ? 'active' : ''}`}
                    onClick={() => setChatLang('hi')}
                  >
                    हिन्दी
                  </button>
                  <button 
                    type="button" 
                    className={`saathi-lang-btn ${chatLang === 'pa' ? 'active' : ''}`}
                    onClick={() => setChatLang('pa')}
                  >
                    ਪੰਜਾਬੀ
                  </button>
                </div>

                {/* Chat History Drawer Toggle Button */}
                <button
                  type="button"
                  className={`chatbot-figma-history-pill ${isHistoryOpen ? 'active' : ''}`}
                  onClick={() => setIsHistoryOpen(h => !h)}
                  title="View Saved Chat History"

                >
                  <History size={13} className="chatbot-figma-history-icon" />
                  <span>{chatLang === 'hi' ? 'इतिहास' : chatLang === 'pa' ? 'ਇਤਿਹਾਸ' : 'History'}</span>
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
                  title="New Chat"
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
              /* Initial State: Star icon and "Ask our AI anything" */
              <div className="chatbot-figma-hero">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="chatbot-figma-star">
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"/>
                </svg>
                <h1 className="chatbot-figma-headline">
                  {chatLang === 'hi' ? 'हमारे AI से कुछ भी पूछें' : chatLang === 'pa' ? 'ਸਾਡੇ AI ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ' : 'Ask our AI anything'}
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
                      {getMessageDisplay(msg)}
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
                              {chatLang === 'hi' ? 'विवरण' : chatLang === 'pa' ? 'ਵੇਰਵਾ' : 'View Details'}
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
                      {chatLang === 'hi' ? 'एआई उत्तर तैयार कर रहा है...' : chatLang === 'pa' ? 'ਏਆਈ ਉੱਤਰ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...' : 'AI is thinking...'}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Suggestions Section: exactly matching screenshot */}
            <div className="chatbot-figma-suggestions">
              <div className="chatbot-figma-suggestions-title">
                {chatLang === 'hi' ? 'हमारे AI से क्या पूछें:' : chatLang === 'pa' ? 'ਸਾਡੇ AI ਤੋਂ ਕੀ ਪੁੱਛਣਾ ਹੈ:' : 'Suggestions on what to ask Our AI'}
              </div>

              <div className="chatbot-figma-suggestions-grid">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chatbot-figma-chip-card"
                    onClick={() => handleSendMessage(s.prompt, s.mode)}
                  >
                    <span className="chatbot-figma-chip-main">
                      {chatLang === 'hi' ? s.titleHi : chatLang === 'pa' ? s.titlePa : s.titleEn}
                    </span>
                    <span className="chatbot-figma-chip-sub">
                      {chatLang === 'hi' ? s.subHi : chatLang === 'pa' ? s.subPa : s.subEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar: Multi-line Auto-Expanding Textarea with mic on-off toggle */}
            <div className="chatbot-figma-input-container">
              <div className="chatbot-figma-input-box" style={{ alignItems: 'flex-end' }}>
                <button
                  type="button"
                  className={`saathi-mic-toggle-btn ${isRecordingVoice ? 'on' : 'off'}`}
                  onClick={toggleVoiceInput}
                  title={isRecordingVoice ? 'Click to turn Mic OFF' : 'Click to turn Mic ON'}
                  aria-pressed={isRecordingVoice}
                  style={{ marginBottom: '4px' }}
                >
                  {isRecordingVoice ? <Mic size={15} /> : <MicOff size={15} />}
                  <span>{isRecordingVoice ? 'Mic: ON' : 'Mic: OFF'}</span>
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
                      : (chatLang === 'hi' ? 'अपनी योजनाओं या आवश्यकताओं के बारे में कुछ भी पूछें...' : chatLang === 'pa' ? 'ਆਪਣੀਆਂ ਸਕੀਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...' : 'Ask me anything about your projects, schemes, or loans...')
                  }
                />

                <button
                  type="button"
                  className="chatbot-figma-send-btn"
                  onClick={() => handleSendMessage()}
                  aria-label="Send message"
                  style={{ marginBottom: '4px' }}
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
