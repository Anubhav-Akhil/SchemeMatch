import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage, ChatFeatureMode } from '../types';
import {
  LogOut, Sparkles, FileText, CheckCircle2, Scale, Compass,
  ArrowLeft, Building2, User as UserIcon, LayoutDashboard,
  Target, SearchCheck, Sliders, Calculator, ArrowRight,
  Sun, Moon, Globe, FileCheck2, Cpu, Menu, X, ChevronLeft,
  ChevronRight, Send, Mic, MicOff, Volume2, VolumeX, TrendingUp,
  IndianRupee, Award, Filter, RefreshCw
} from 'lucide-react';
import logoImg from '../assets/logo.png';

// Feature components
import { EligibilityWizard } from './EligibilityWizard';
import { SchemeCard } from './SchemeCard';
import { SchemeDetailModal } from './SchemeDetailModal';
import { SchemeComparison } from './SchemeComparison';
import { DprGeneratorView } from './DprGeneratorView';
import { DocumentReadiness } from './DocumentReadiness';
import { ApplicationNavigator } from './ApplicationNavigator';
import { GapAnalyzer } from './GapAnalyzer';
import { WhatIfSimulator } from './WhatIfSimulator';
import { FinancialCalculator } from './FinancialCalculator';
import { ChannelPartnerRouter } from './ChannelPartnerRouter';
import {
  EmiCardView,
  DocumentChecklistCardView,
  PartnerFinderCardView,
  WhatIfCardView,
  EligibilityCardView
} from './SaathiChatCards';

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

/* ─── Saathi AI Slider Panel (Landing Page Figma UI) ──────────────── */
const SaathiPanel: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed, onToggle
}) => {
  const { speakText, stopSpeech, isSpeaking, language: globalLang } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal } = useProfile();

  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'pa'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globalLang === 'hi') setChatLang('hi');
    else if (globalLang === 'pa') setChatLang('pa');
    else setChatLang('en');
  }, [globalLang]);

  useEffect(() => {
    if (!collapsed && messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, collapsed]);

  const handleSendMessage = async (queryToSend?: string, mode?: ChatFeatureMode) => {
    const q = (queryToSend || input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      featureMode: mode,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          profile,
          mode
        })
      });

      if (res.ok) {
        const reply: ChatMessage = await res.json();
        setMessages(prev => [...prev, reply]);

        if (reply.extractedProfileUpdates) {
          const updated = {
            ...profile,
            ...reply.extractedProfileUpdates
          };
          setProfile(updated as any);
          runMatching(updated as any);
        }
      }
    } catch (err) {
      console.error('Chat query error:', err);
      setMessages(prev => [
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

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = chatLang === 'hi' ? 'hi-IN' : chatLang === 'pa' ? 'pa-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const getDisplayContent = (msg: ChatMessage) => {
    if (chatLang === 'hi' && msg.hindiText) return msg.hindiText;
    if (chatLang === 'pa' && msg.punjabiText) return msg.punjabiText;
    return msg.text;
  };

  const handleAudioToggle = (msg: ChatMessage) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(getDisplayContent(msg), chatLang);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    stopSpeech();
  };

  /* ── Collapsed Slider Tab ────────────────────────── */
  if (collapsed) {
    return (
      <div
        className="si-saathi-panel collapsed"
        onClick={onToggle}
        title="Open Saathi AI Slider"
        role="button"
        aria-label="Expand Saathi AI Slider"
      >
        <button
          className="si-saathi-toggle-btn"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{ margin: '16px auto', display: 'flex' }}
          title="Open Saathi AI Slider"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="si-saathi-slider-tag">
          <img 
            src={logoImg} 
            alt="Saathi AI" 
            style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'contain' }} 
          />
          <span>Saathi AI</span>
          <ChevronLeft size={13} style={{ color: 'var(--si-nav-active)' }} />
        </div>
      </div>
    );
  }

  /* ── Expanded Slider Panel ───────────────────────── */
  return (
    <div className="si-saathi-panel" role="region" aria-label="Saathi AI Slider">
      {/* Top Bar matching Figma design */}
      <div className="chatbot-figma-top-bar">
        <span className="chatbot-figma-title" style={{ fontWeight: 600, color: 'var(--text-primary, #0F172A)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoImg} alt="Saathi AI" style={{ width: '22px', height: '22px', borderRadius: '5px', objectFit: 'contain' }} />
          <span>Saathi AI</span>
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

          {messages.length > 0 && (
            <button
              type="button"
              className="chatbot-figma-close-btn"
              onClick={handleResetChat}
              title="New Chat"
              style={{ fontSize: '0.78rem' }}
            >
              <RefreshCw size={14} />
            </button>
          )}

          <button
            type="button"
            className="chatbot-figma-close-btn"
            onClick={onToggle}
            title="Collapse Slider"
            aria-label="Collapse"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        /* Center Hero when empty */
        <div className="chatbot-figma-hero">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="chatbot-figma-star">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"/>
          </svg>
          <h2 className="chatbot-figma-headline">
            {chatLang === 'hi' ? 'हमारे AI से कुछ भी पूछें' : chatLang === 'pa' ? 'ਸਾਡੇ AI ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ' : 'Ask our AI anything'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '320px', lineHeight: 1.45 }}>
            {chatLang === 'hi' 
              ? 'अपनी पात्रता, सरकारी ऋण, सब्सिडी और दस्तावेज़ों के बारे में तुरंत पूछें।'
              : chatLang === 'pa'
              ? 'ਆਪਣੀ ਯੋਗਤਾ, ਸਰਕਾਰੀ ਕਰਜ਼ੇ, ਸਬਸਿਡੀ ਅਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਬਾਰੇ ਪੁੱਛੋ।'
              : 'Explore government schemes, check personalized loan subsidies, EMI and documents.'}
          </p>
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
                    style={{ background: 'transparent', border: 'none', color: isSpeaking ? '#10B981' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title={isSpeaking ? 'Stop Audio' : 'Listen aloud'}
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              )}

              <div style={{ whiteSpace: 'pre-line' }}>
                {getDisplayContent(msg)}
              </div>

              {/* Matched schemes */}
              {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {msg.matchedSchemes.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--bg-surface-subtle, rgba(255, 255, 255, 0.9))',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.9))',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.84rem', display: 'block', color: 'var(--text-primary)' }}>{s.name}</strong>
                        <span style={{ fontSize: '0.74rem', color: '#EA580C', fontWeight: 600 }}>{s.subsidyHighlight}</span>
                      </div>
                      <button
                        type="button"
                        className="card-quick-action"
                        onClick={() => setSelectedSchemeModal({ id: s.id, name: s.name } as any)}
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

              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted, #94A3B8)', textAlign: 'right', marginTop: '4px' }}>
                {msg.timestamp}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chatbot-figma-bubble assistant" style={{ fontStyle: 'italic', fontSize: '0.84rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} className="spin-slow" />
                {chatLang === 'hi' ? 'एआई उत्तर तैयार कर रहा है...' : chatLang === 'pa' ? 'ਏਆਈ ਉੱਤਰ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...' : 'AI is thinking...'}
              </span>
            </div>
          )}

          <div ref={endRef} />
        </div>
      )}

      {/* Suggestions Section */}
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

      {/* Input Area with Mic ON/OFF toggle switch */}
      <div className="chatbot-figma-input-container">
        <div className="chatbot-figma-input-box">
          <button
            type="button"
            className={`saathi-mic-toggle-btn ${isRecording ? 'on' : 'off'}`}
            onClick={toggleVoiceInput}
            title={isRecording ? 'Click to turn Mic OFF' : 'Click to turn Mic ON'}
            aria-pressed={isRecording}
          >
            {isRecording ? <Mic size={14} /> : <MicOff size={14} />}
            <span>{isRecording ? 'Mic: ON' : 'Mic: OFF'}</span>
            <div className="saathi-mic-toggle-indicator">
              <div className="saathi-mic-toggle-thumb" />
            </div>
          </button>

          <input
            type="text"
            className="chatbot-figma-input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isRecording
                ? (chatLang === 'hi' ? 'बोलें, हम सुन रहे हैं...' : chatLang === 'pa' ? 'ਬੋਲੋ, ਸੁਣ ਰਹੇ ਹਾਂ...' : 'Listening...')
                : (chatLang === 'hi' ? 'अपनी योजनाओं के बारे में पूछें...' : chatLang === 'pa' ? 'ਆਪਣੀਆਂ ਸਕੀਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...' : 'Ask about schemes, loans, documents...')
            }
          />

          <button
            type="button"
            className="chatbot-figma-send-btn"
            onClick={() => handleSendMessage()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main SaffronDashboard ───────────────────────────────────────── */
export const SaffronDashboard: React.FC = () => {
  const { user, logout, setCurrentView } = useAuth();
  const {
    activeTab, setActiveTab,
    matchResults, otherSchemes, totalPotentialSubsidy,
    comparedSchemes, profile, hasCalculated,
    setSelectedSchemeModal
  } = useProfile();
  const { t, theme, toggleTheme, language, setLanguage } = useLanguage();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saathiCollapsed, setSaathiCollapsed] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const firstNameGreeting = user?.fullName?.split(' ')[0] || 'Entrepreneur';

  // Translated nav labels
  const navLabels: Record<string, Record<string, string>> = {
    en: {
      overview: 'Overview', dashboard: 'Dashboard', aiTools: 'AI Tools',
      profile: 'AI Profile Extraction', matcher: 'Scheme Recommender',
      gap: 'Eligibility Gap Analyzer', whatif: 'What-If Simulator',
      calculator: 'Financial Calculator', partners: 'Channel Partner Router',
      documents: 'Document Readiness', appraisal: 'Appraisal & Delivery',
      dpr: 'Bank-Ready DPR', comparison: 'Scheme Comparison', roadmap: 'Application Roadmap',
      toolsFeatures: 'Tools & Features', launch: 'Launch', viewAll: 'View All',
      prioritySchemes: 'Top Priority Schemes', schemesUnlocked: 'Priority Schemes Unlocked',
      welcomeBack: 'Welcome back', schemesMatched: 'government schemes',
      upTo: 'up to', subsidies: 'in capital subsidies, concessional credit, and collateral-free loans.',
      viewMatched: 'View Matched Schemes', diagnoseGaps: 'Diagnose Eligibility Gaps',
      subsAvail: 'Available Subsidy', docReady: 'Doc Ready', schemesFound: 'Schemes Found',
      activeProfile: 'Active Profile', signOut: 'Sign Out'
    },
    hi: {
      overview: 'अवलोकन', dashboard: 'डैशबोर्ड', aiTools: 'AI उपकरण',
      profile: 'AI प्रोफ़ाइल निष्कर्षण', matcher: 'योजना अनुशंसक',
      gap: 'पात्रता अंतर विश्लेषक', whatif: 'क्या-अगर सिम्युलेटर',
      calculator: 'वित्तीय कैलकुलेटर', partners: 'चैनल पार्टनर राउटर',
      documents: 'दस्तावेज़ तत्परता', appraisal: 'मूल्यांकन एवं वितरण',
      dpr: 'बैंक-रेडी DPR', comparison: 'योजना तुलना', roadmap: 'आवेदन रोडमैप',
      toolsFeatures: 'उपकरण और सुविधाएं', launch: 'खोलें', viewAll: 'सभी देखें',
      prioritySchemes: 'शीर्ष प्राथमिकता योजनाएं', schemesUnlocked: 'प्राथमिकता योजनाएं अनलॉक',
      welcomeBack: 'वापसी पर स्वागत है', schemesMatched: 'सरकारी योजनाओं',
      upTo: 'तक', subsidies: 'पूंजी सब्सिडी, रियायती ऋण, और जमानत-मुक्त ऋण में।',
      viewMatched: 'मिलान योजनाएं देखें', diagnoseGaps: 'पात्रता अंतर जांचें',
      subsAvail: 'उपलब्ध सब्सिडी', docReady: 'दस्तावेज़ तैयार', schemesFound: 'योजनाएं मिलीं',
      activeProfile: 'सक्रिय प्रोफ़ाइल', signOut: 'साइन आउट'
    },
    te: {
      overview: 'అవలోకనం', dashboard: 'డ్యాష్‌బోర్డ్', aiTools: 'AI సాధనాలు',
      profile: 'AI ప్రొఫైల్ వెలికితీత', matcher: 'పథక సిఫార్సుదారు',
      gap: 'అర్హత లోటు విశ్లేషకం', whatif: 'ఏమైతే-అయితే సిమ్యులేటర్',
      calculator: 'ఆర్థిక కాలిక్యులేటర్', partners: 'ఛానల్ పార్ట్‌నర్ రూటర్',
      documents: 'పత్ర సంసిద్ధత', appraisal: 'మూల్యాంకనం & వితరణ',
      dpr: 'బ్యాంక్-రెడీ DPR', comparison: 'పథక పోలిక', roadmap: 'దరఖాస్తు రోడ్‌మ్యాప్',
      toolsFeatures: 'సాధనాలు & ఫీచర్లు', launch: 'ప్రారంభించు', viewAll: 'అన్నీ చూడు',
      prioritySchemes: 'అగ్ర ప్రాధాన్య పథకాలు', schemesUnlocked: 'ప్రాధాన్య పథకాలు అన్‌లాక్',
      welcomeBack: 'తిరిగి స్వాగతం', schemesMatched: 'ప్రభుత్వ పథకాలు',
      upTo: 'వరకు', subsidies: 'మూలధన సబ్సిడీలు, రాయితీ క్రెడిట్, మరియు జామీన్-రహిత రుణాలలో.',
      viewMatched: 'సరిపోయిన పథకాలు చూడండి', diagnoseGaps: 'అర్హత లోపాలను గుర్తించండి',
      subsAvail: 'అందుబాటులో సబ్సిడీ', docReady: 'డాక్ సిద్ధం', schemesFound: 'పథకాలు కనుగొనబడ్డాయి',
      activeProfile: 'యాక్టివ్ ప్రొఫైల్', signOut: 'సైన్ అవుట్'
    },
    pa: {
      overview: 'ਸੰਖੇਪ', dashboard: 'ਡੈਸ਼ਬੋਰਡ', aiTools: 'AI ਸੰਦ',
      profile: 'AI ਪ੍ਰੋਫਾਈਲ ਐਕਸਟ੍ਰੈਕਸ਼ਨ', matcher: 'ਸਕੀਮ ਸਿਫ਼ਾਰਿਸ਼ਕਰਤਾ',
      gap: 'ਯੋਗਤਾ ਘਾਟ ਵਿਸ਼ਲੇਸ਼ਕ', whatif: 'ਕੀ-ਜੇ ਸਿਮੂਲੇਟਰ',
      calculator: 'ਵਿੱਤੀ ਕੈਲਕੁਲੇਟਰ', partners: 'ਚੈਨਲ ਪਾਰਟਨਰ ਰਾਊਟਰ',
      documents: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ', appraisal: 'ਮੁਲਾਂਕਣ ਅਤੇ ਡਿਲੀਵਰੀ',
      dpr: 'ਬੈਂਕ-ਰੈਡੀ DPR', comparison: 'ਸਕੀਮ ਤੁਲਨਾ', roadmap: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ',
      toolsFeatures: 'ਸੰਦ ਅਤੇ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', launch: 'ਖੋਲੋ', viewAll: 'ਸਾਰੇ ਦੇਖੋ',
      prioritySchemes: 'ਪ੍ਰਮੁੱਖ ਸਕੀਮਾਂ', schemesUnlocked: 'ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੀਮਾਂ ਅਨਲੌਕ',
      welcomeBack: 'ਵਾਪਸੀ \'ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ', schemesMatched: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
      upTo: 'ਤੱਕ', subsidies: 'ਪੂੰਜੀ ਸਬਸਿਡੀ, ਰਿਆਇਤੀ ਕ੍ਰੈਡਿਟ, ਅਤੇ ਜ਼ਮਾਨਤ-ਮੁਕਤ ਕਰਜ਼ਿਆਂ ਵਿੱਚ.',
      viewMatched: 'ਮੇਲ ਖਾਂਦੀਆਂ ਸਕੀਮਾਂ ਦੇਖੋ', diagnoseGaps: 'ਯੋਗਤਾ ਘਾਟ ਜਾਂਚੋ',
      subsAvail: 'ਉਪਲਬਧ ਸਬਸਿਡੀ', docReady: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰ', schemesFound: 'ਸਕੀਮਾਂ ਮਿਲੀਆਂ',
      activeProfile: 'ਸਰਗਰਮ ਪ੍ਰੋਫਾਈਲ', signOut: 'ਸਾਈਨ ਆਊਟ'
    },
    mr: {
      overview: 'विहंगावलोकन', dashboard: 'डॅशबोर्ड', aiTools: 'AI साधने',
      profile: 'AI प्रोफाइल निष्कर्षण', matcher: 'योजना शिफारसकर्ता',
      gap: 'पात्रता तफावत विश्लेषक', whatif: 'काय-जर सिम्युलेटर',
      calculator: 'आर्थिक कॅल्क्युलेटर', partners: 'चॅनेल पार्टनर राउटर',
      documents: 'दस्तावेज सज्जता', appraisal: 'मूल्यांकन आणि वितरण',
      dpr: 'बँक-रेडी DPR', comparison: 'योजना तुलना', roadmap: 'अर्ज रोडमॅप',
      toolsFeatures: 'साधने आणि वैशिष्ट्ये', launch: 'उघडा', viewAll: 'सर्व पहा',
      prioritySchemes: 'अग्रक्रम योजना', schemesUnlocked: 'प्राधान्य योजना अनलॉक',
      welcomeBack: 'पुन्हा स्वागत', schemesMatched: 'सरकारी योजना',
      upTo: 'पर्यंत', subsidies: 'भांडवल अनुदान, सवलतीचे कर्ज, आणि तारणमुक्त कर्जामध्ये.',
      viewMatched: 'जुळणाऱ्या योजना पहा', diagnoseGaps: 'पात्रता तफावत तपासा',
      subsAvail: 'उपलब्ध अनुदान', docReady: 'दस्तावेज तयार', schemesFound: 'योजना सापडल्या',
      activeProfile: 'सक्रिय प्रोफाइल', signOut: 'साइन आउट'
    },
    bn: {
      overview: 'সংক্ষিপ্ত বিবরণ', dashboard: 'ড্যাশবোর্ড', aiTools: 'AI সরঞ্জাম',
      profile: 'AI প্রোফাইল নিষ্কাশন', matcher: 'প্রকল্প সুপারিশকারী',
      gap: 'যোগ্যতা ফাঁক বিশ্লেষক', whatif: 'কী-যদি সিমুলেটর',
      calculator: 'আর্থিক ক্যালকুলেটর', partners: 'চ্যানেল পার্টনার রাউটার',
      documents: 'নথি প্রস্তুতি', appraisal: 'মূল্যায়ন ও বিতরণ',
      dpr: 'ব্যাংক-রেডি DPR', comparison: 'প্রকল্প তুলনা', roadmap: 'আবেদন রোডম্যাপ',
      toolsFeatures: 'সরঞ্জাম ও বৈশিষ্ট্য', launch: 'খুলুন', viewAll: 'সব দেখুন',
      prioritySchemes: 'শীর্ষ অগ্রাধিকার প্রকল্প', schemesUnlocked: 'অগ্রাধিকার প্রকল্প আনলক',
      welcomeBack: 'পুনরায় স্বাগতম', schemesMatched: 'সরকারি প্রকল্প',
      upTo: 'পর্যন্ত', subsidies: 'মূলধন ভর্তুকি, রেয়াতি ক্রেডিট, এবং জামিনমুক্ত ঋণে.',
      viewMatched: 'মিলিত প্রকল্প দেখুন', diagnoseGaps: 'যোগ্যতা ঘাটতি নির্ণয় করুন',
      subsAvail: 'উপলভ্য ভর্তুকি', docReady: 'নথি প্রস্তুত', schemesFound: 'প্রকল্প পাওয়া গেছে',
      activeProfile: 'সক্রিয় প্রোফাইল', signOut: 'সাইন আউট'
    }
  };

  const nl = navLabels[language] || navLabels.en;

  const navGroups = [
    {
      group: nl.overview,
      items: [
        { id: 'dashboard', label: nl.dashboard, icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: nl.aiTools,
      items: [
        { id: 'profile', label: nl.profile, icon: Cpu, badge: null },
        { id: 'matcher', label: nl.matcher, icon: Target, badge: `${matchResults.length}` },
        { id: 'gap', label: nl.gap, icon: SearchCheck, badge: null },
        { id: 'whatif', label: nl.whatif, icon: Sliders, badge: null },
        { id: 'calculator', label: nl.calculator, icon: Calculator, badge: null },
        { id: 'partners', label: nl.partners, icon: Building2, badge: null },
        { id: 'documents', label: nl.documents, icon: FileCheck2, badge: null },
      ]
    },
    {
      group: nl.appraisal,
      items: [
        { id: 'dpr', label: nl.dpr, icon: FileText, badge: null },
        { id: 'comparison', label: nl.comparison, icon: Scale, badge: comparedSchemes.length > 0 ? `${comparedSchemes.length}` : null },
        { id: 'roadmap', label: nl.roadmap, icon: Compass, badge: null },
      ]
    }
  ];

  const filteredMatches = matchResults.filter(m => {
    if (filterCategory === 'all') return true;
    return m.scheme.categoryTag.toLowerCase().includes(filterCategory.toLowerCase()) ||
      m.scheme.targetGroups.includes(filterCategory);
  });

  /* ── JSX ──────────────────────────────────────────────────────── */
  return (
    <div className="si-layout-container">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header className="si-top-bar">
        {/* Left: mobile menu + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="si-mobile-menu-btn" onClick={() => setMobileSidebarOpen(o => !o)} aria-label="Menu">
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="si-brand-area" onClick={() => setCurrentView('landing')} title="Return to Landing">
            <img src={logoImg} alt="SchemeMatch" className="si-brand-logo" />
            <span className="si-brand-name">SchemeMatch</span>
          </div>
        </div>

        {/* Right: controls + user */}
        <div className="si-top-right">
          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select className="si-lang-select" value={language} onChange={e => setLanguage(e.target.value as any)}>
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {/* Theme toggle */}
          <button className="si-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Back to landing */}
          <button className="si-icon-btn" onClick={() => setCurrentView('landing')} title="Landing Page">
            <ArrowLeft size={15} />
          </button>

          {/* User badge */}
          <div className="si-user-badge">
            <div className="si-user-avatar">
              {user?.avatarUrl && !avatarError ? (
                <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer"
                  crossOrigin="anonymous" onError={() => setAvatarError(true)} />
              ) : (
                <span>
                  {user?.fullName
                    ? user.fullName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
                    : 'U'}
                </span>
              )}
            </div>
            <div className="si-user-info">
              <div className="si-user-name">{user?.fullName || 'Entrepreneur'}</div>
              <div className="si-user-sub">{user?.email || ''}</div>
            </div>
          </div>

          {/* Sign out */}
          <button className="si-signout-btn" onClick={logout} title={nl.signOut}>
            <LogOut size={15} />
            <span className="ws-signout-label">{nl.signOut}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN FRAME: Sidebar + Content + Saathi ────────────── */}
      <div className="si-main-frame">

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <aside className={`si-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="si-sidebar-scrollable">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                <span className="si-nav-group-title">{group.group}</span>
                <nav className="si-nav-list">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`si-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                      >
                        <span className="si-nav-item-icon"><Icon size={16} /></span>
                        <span className="si-nav-item-label">{item.label}</span>
                        {item.badge && (
                          <span className="si-nav-item-badge">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar footer — tricolor strip + profile snapshot */}
          <div className="si-sidebar-footer">
            <div className="si-tricolor-strip">
              <span className="tc-saffron" /><span className="tc-white" /><span className="tc-green" />
            </div>
            <div className="si-profile-snapshot">
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>{nl.activeProfile}</div>
              <span className="si-profile-snapshot-name">{user?.fullName || 'Entrepreneur'}</span>
              <span className="si-profile-snapshot-sub">
                {user?.email || `${profile.category || ''} · ${profile.tradeType || profile.sector || ''}`}
              </span>
            </div>
          </div>
        </aside>

        {/* ── CONTENT VIEWPORT ────────────────────────────────── */}
        <main className="si-content-viewport">

          {/* ══ TAB: DASHBOARD OVERVIEW ══════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div style={{ animation: 'si-fade-in 0.2s ease' }}>

              {/* Hero Banner */}
              <div className="si-hero-banner">
                <h1 className="si-hero-title">
                  <span>{matchResults.length} {nl.schemesUnlocked}</span>
                </h1>
                <p className="si-hero-subtitle">
                  {nl.welcomeBack}, <strong>{firstNameGreeting}</strong>! {language === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your profile is matched with'}{' '}
                  <strong>{matchResults.length} {nl.schemesMatched}</strong> {language === 'hi' ? 'से मिलान किया गया है जो' : 'offering'} {nl.upTo}{' '}
                  <strong>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> {nl.subsidies}
                </p>
                <div className="si-hero-cta-row">
                  <button className="si-hero-cta-primary" onClick={() => setActiveTab('matcher')}>
                    <Target size={16} /> {nl.viewMatched} <ArrowRight size={14} />
                  </button>
                  <button className="si-hero-cta-secondary" onClick={() => setActiveTab('gap')}>
                    <SearchCheck size={16} /> {nl.diagnoseGaps}
                  </button>
                </div>
              </div>

              {/* KPI Pill Bar */}
              <div className="si-kpi-bar">
                <div className="si-kpi-pill">
                  <span className="si-kpi-pill-icon"><IndianRupee size={14} /></span>
                  ₹{(totalPotentialSubsidy / 100000).toFixed(1)}L {nl.subsAvail}
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><Award size={14} /></span>
                  {matchResults[0]?.scheme.name?.split(' ').slice(0, 2).join(' ') || 'PMEGP'}
                </div>
                <div className="si-kpi-pill green">
                  <span className="si-kpi-pill-icon"><CheckCircle2 size={14} /></span>
                  85% {nl.docReady}
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><TrendingUp size={14} /></span>
                  {matchResults.length} {nl.schemesFound}
                </div>
              </div>

              {/* Horizontal Scheme Cards Scroller */}
              <div className="si-section-header">
                <span className="si-section-title">🏛️ {nl.prioritySchemes}</span>
                {hasCalculated && matchResults.length > 0 && (
                  <button className="si-view-all-btn" onClick={() => setActiveTab('matcher')}>
                    {nl.viewAll} ({matchResults.length}) <ArrowRight size={13} />
                  </button>
                )}
              </div>
              {hasCalculated && matchResults.length > 0 ? (
                <div className="si-scheme-scroller">
                  {matchResults.slice(0, 6).map(m => (
                    <div
                      key={m.scheme.id}
                      className="si-scheme-card"
                      onClick={() => setSelectedSchemeModal(m)}
                      role="button"
                      tabIndex={0}
                    >
                      {/* Tricolor top strip */}
                      <div className="si-scheme-card-tricolor">
                        <span className="tc-s" /><span className="tc-w" /><span className="tc-g" />
                      </div>
                      <div className="si-scheme-card-body">
                        <div className="si-scheme-card-top">
                          <span className="si-scheme-card-name">{m.scheme.name}</span>
                          <span className="si-scheme-match-badge">{m.matchScore}%</span>
                        </div>
                        <div className="si-scheme-subsidy-chip">
                          <IndianRupee size={11} /> {m.estimatedSubsidyAmount > 0 ? `₹${(m.estimatedSubsidyAmount / 100000).toFixed(1)}L` : m.scheme.categoryTag}
                        </div>
                        <div className="si-scheme-progress-bar">
                          <div className="si-scheme-progress-fill" style={{ width: `${m.matchScore}%` }} />
                        </div>
                        <div className="si-scheme-card-footer">
                          <button className="si-scheme-apply-btn" onClick={e => { e.stopPropagation(); setActiveTab('dpr'); }}>
                            {language === 'hi' ? 'DPR बनाएं' : 'Generate DPR'}
                          </button>
                          <button className="si-scheme-compare-btn" onClick={e => { e.stopPropagation(); setActiveTab('comparison'); }}>
                            {language === 'hi' ? 'तुलना करें' : 'Compare'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '24px 20px',
                  background: 'var(--si-card-bg)',
                  border: '1.5px dashed var(--si-card-border)',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <strong style={{ fontSize: '0.94rem', color: 'var(--si-indigo)', display: 'block', marginBottom: '4px' }}>
                      {language === 'hi' ? 'पात्र योजनाएं खोजने के लिए प्रोफ़ाइल गणना करें' : 'Calculate your profile to discover eligible schemes'}
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {language === 'hi' ? 'कोई पूर्व-चयनित योजनाएं नहीं हैं। अपनी व्यापार आवश्यकताएं दर्ज करें।' : 'No schemes loaded yet. Enter your business requirements to unlock subsidies.'}
                    </span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab('profile')}
                    style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                  >
                    <span>{language === 'hi' ? 'गणना शुरू करें' : 'Calculate Schemes'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Module Grid */}
              <div className="si-section-header">
                <span className="si-section-title">⚙️ {nl.toolsFeatures}</span>
              </div>
              <div className="si-module-grid">
                {[
                  { id: 'profile',     icon: Cpu,          color: 'indigo', label: nl.profile,    desc: language === 'hi' ? 'NLP द्वारा प्रोफ़ाइल निर्माण' : 'Natural-language profile builder with NLP extraction.' },
                  { id: 'matcher',     icon: Target,        color: '',       label: nl.matcher, desc: language === 'hi' ? `${matchResults.length} योजनाएं मिलान स्कोर के साथ` : `${matchResults.length} matched schemes with explainable scores.` },
                  { id: 'gap',         icon: SearchCheck,   color: 'indigo', label: nl.gap, desc: language === 'hi' ? 'अनुपूर्ति मार्गदर्शन' : 'Pinpoints missing criteria with remediation guides.' },
                  { id: 'whatif',      icon: Sliders,       color: '',       label: nl.whatif,        desc: language === 'hi' ? 'ऋण, क्षेत्र, स्थान बदलकर देखें' : 'Tweak loan, location, and sector for live eligibility.' },
                  { id: 'calculator',  icon: Calculator,    color: 'green',  label: nl.calculator,     desc: language === 'hi' ? 'EMI, सब्सिडी और DSCR गणना' : 'Scheme-aware EMI, subsidy deduction, DSCR.' },
                  { id: 'partners',    icon: Building2,     color: 'indigo', label: nl.partners,   desc: language === 'hi' ? 'अधिकृत बैंक और एजेंसी खोजें' : 'Locate authorized SCAs, PSBs, and RRBs.' },
                  { id: 'documents',   icon: FileCheck2,    color: 'green',  label: nl.documents,       desc: language === 'hi' ? 'OCR आधारित दस्तावेज़ जांच' : 'OCR-based checklist with readiness scoring.' },
                  { id: 'dpr',         icon: FileText,      color: '',       label: nl.dpr,    desc: language === 'hi' ? 'SIDBI स्वरूप 3 वर्ष अनुमान' : 'SIDBI-compliant 3-year projections.' },
                  { id: 'comparison',  icon: Scale,         color: 'indigo', label: nl.comparison,    desc: language === 'hi' ? 'ऋण सीमा, ब्याज और अवधि तुलना' : 'Side-by-side comparison of loan terms.' },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.id} className="si-module-tile" onClick={() => setActiveTab(m.id as any)}>
                      <div className={`si-module-tile-icon ${m.color}`}><Icon size={20} /></div>
                      <div className="si-module-tile-title">{m.label}</div>
                      <div className="si-module-tile-desc">{m.desc}</div>
                      <div className="si-module-tile-footer">
                        <span>{nl.launch}</span><ArrowRight size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ TAB: AI PROFILE ══════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="si-tab-panel">
              <div className="si-tab-panel-header">
                <div className="si-tab-panel-title">{nl.profile}</div>
                <div className="si-tab-panel-sub">{language === 'hi' ? 'प्राकृतिक भाषा में प्रोफ़ाइल जानकारी दर्ज करें।' : 'Enter natural-language profile info. AI extracts socio-economic indicators.'}</div>
              </div>
              <EligibilityWizard />
            </div>
          )}

          {/* ══ TAB: SCHEME MATCHER ══════════════════════════════ */}
          {activeTab === 'matcher' && (
            <div className="si-tab-panel">
              <div className="si-tab-panel-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="si-tab-panel-title">{nl.matcher}</div>
                    <div className="si-tab-panel-sub">
                      {language === 'hi' 
                        ? <>{matchResults.length} योजनाएं मिलीं, <strong style={{ color: 'var(--si-success)' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</strong> तक अनुदान के साथ</>
                        : <>Found <strong>{matchResults.length} schemes</strong> with up to{' '}
                          <strong style={{ color: 'var(--si-success)' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</strong> in grants.</>
                      }
                    </div>
                    {!profile.category && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>💡 {language === 'hi' ? 'सुझाव: अपनी श्रेणी (SC/ST/OBC) चुनें ताकि लक्षित सब्सिडी 35% तक अनलॉक हो।' : 'Tip: Select your category (SC/ST/OBC) in Profile to unlock targeted subsidies up to 35%!'}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      style={{ padding: '7px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1.5px solid var(--si-card-border)', background: 'var(--si-card-bg)', color: 'var(--si-indigo)' }}
                    >
                      <option value="all">{language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'} ({matchResults.length})</option>
                      <option value="Credit Subsidy">{language === 'hi' ? 'ऋण सब्सिडी' : 'Credit Subsidy'}</option>
                      <option value="Term Loan">{language === 'hi' ? 'सावधि ऋण' : 'Term Loans'}</option>
                      <option value="Grant">{language === 'hi' ? 'प्रत्यक्ष अनुदान' : 'Direct Grants'}</option>
                      <option value="Micro-Credit">{language === 'hi' ? 'सूक्ष्म ऋण' : 'Micro-Credit'}</option>
                      <option value="Women">{language === 'hi' ? 'महिला उद्यमी' : 'Women Entrepreneurs'}</option>
                      <option value="SC">{language === 'hi' ? 'SC / ST' : 'SC / ST'}</option>
                      <option value="OBC">{language === 'hi' ? 'OBC उद्यमी' : 'OBC Entrepreneurs'}</option>
                    </select>
                  </div>
                </div>
              </div>
              {!hasCalculated || matchResults.length === 0 ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: 'var(--si-card-bg)',
                  border: '1.5px dashed var(--si-card-border)',
                  borderRadius: '16px',
                  margin: '20px 0'
                }}>
                  <Target size={44} style={{ color: 'var(--primary-saffron)', margin: '0 auto 14px' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--si-indigo)', marginBottom: '8px' }}>
                    {language === 'hi' ? 'अभी कोई योजनाएं परिकलित नहीं हैं' : 'No Schemes Calculated Yet'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                    {language === 'hi' 
                      ? 'कृपया AI प्रोफ़ाइल निष्कर्षण में अपनी जानकारी दर्ज करें और अपनी योग्य सब्सिडी खोजने के लिए "पात्र योजनाओं की गणना करें" पर क्लिक करें।'
                      : 'Please enter your details in AI Profile Extraction and click "Calculate Eligible Schemes & Subsidies" to discover your personalized schemes and grants.'}
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab('profile')}
                    style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>{language === 'hi' ? 'प्रोफ़ाइल भरें और गणना करें' : 'Go to Profile & Calculate Schemes'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredMatches.map(m => <SchemeCard key={m.scheme.id} matchResult={m} />)}
                  </div>
                  {otherSchemes.length > 0 && (
                    <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1.5px dashed var(--si-card-border)' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--si-indigo)', marginBottom: '6px' }}>
                        {language === 'hi' ? `सशर्त योजनाएं (${otherSchemes.length})` : `Conditional Schemes (${otherSchemes.length})`}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        {language === 'hi' ? 'इनमें कुछ दस्तावेज़ अद्यतन या विशेष मानदंड पूर्ति आवश्यक है।' : 'These need minor documentation updates or specific criteria to be met.'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {otherSchemes.slice(0, 3).map(m => <SchemeCard key={m.scheme.id} matchResult={m} />)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ Feature Tabs ════════════════════════════════════ */}
          {activeTab === 'gap'        && <div className="si-tab-panel"><GapAnalyzer /></div>}
          {activeTab === 'whatif'     && <div className="si-tab-panel"><WhatIfSimulator /></div>}
          {activeTab === 'calculator' && <div className="si-tab-panel"><FinancialCalculator /></div>}
          {activeTab === 'partners'   && <div className="si-tab-panel"><ChannelPartnerRouter /></div>}
          {activeTab === 'documents'  && <div className="si-tab-panel"><DocumentReadiness /></div>}
          {activeTab === 'dpr'        && <div className="si-tab-panel"><DprGeneratorView /></div>}
          {activeTab === 'comparison' && <div className="si-tab-panel"><SchemeComparison /></div>}
          {activeTab === 'roadmap'    && <div className="si-tab-panel"><ApplicationNavigator /></div>}

        </main>

        {/* ── SAATHI AI RIGHT SLIDER PANEL ────────────────────────────── */}
        {!saathiCollapsed && (
          <div 
            className="si-saathi-backdrop" 
            onClick={() => setSaathiCollapsed(true)} 
            aria-label="Close Saathi AI Slider"
          />
        )}
        <SaathiPanel collapsed={saathiCollapsed} onToggle={() => setSaathiCollapsed(c => !c)} />

        {/* Mobile Floating Trigger when Slider is Collapsed */}
        {saathiCollapsed && (
          <button
            className="saathi-floating-btn si-mobile-saathi-trigger"
            onClick={() => setSaathiCollapsed(false)}
            aria-label="Open Saathi AI Slider"
          >
            <img 
              src={logoImg} 
              alt="Saathi AI" 
              style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFFFFF', padding: '1px' }} 
            />
            <span>Ask Saathi AI</span>
            <ArrowRight size={16} />
          </button>
        )}

      </div>

      {/* Deep Dive Scheme Modal */}
      <SchemeDetailModal />
    </div>
  );
};

export default SaffronDashboard;
