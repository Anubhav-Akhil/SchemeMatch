import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { ChatMessage, ChatFeatureMode } from '../types';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Globe,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { 
  FeatureChipsBar, 
  EmiCardView, 
  DocumentChecklistCardView, 
  PartnerFinderCardView, 
  WhatIfCardView, 
  EligibilityCardView 
} from './SaathiChatCards';

export const SaathiAICopilot: React.FC = () => {
  const { t, speakText, stopSpeech, isSpeaking, language: globalLang } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal } = useProfile();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'pa'>('en');
  const [activeFeature, setActiveFeature] = useState<ChatFeatureMode>('recommendation');

  // Keep chatLang synced with globalLang if globalLang is one of our primary chat langs
  useEffect(() => {
    if (globalLang === 'hi') setChatLang('hi');
    else if (globalLang === 'pa') setChatLang('pa');
    else setChatLang('en');
  }, [globalLang]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste! I am Saathi AI, your personalized welfare & credit copilot. Choose a feature above or ask me any question in English, Hindi, or Punjabi.',
      hindiText: 'नमस्ते! मैं साथी (Saathi) AI हूँ। अपने कार्य और ऋण आवश्यकता के बारे में बताएं, या ऊपर दिए गए विकल्पों से तुरंत पात्रता, EMI और दस्तावेज़ जांचें।',
      punjabiText: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਾਥੀ (Saathi) AI ਹਾਂ। ਆਪਣੀ ਜ਼ਰੂਰਤ ਦੱਸੋ ਜਾਂ ਉੱਪਰ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਤੋਂ ਆਪਣੀ ਯੋਗਤਾ, ਕਿਸ਼ਤ (EMI) ਅਤੇ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਜਾਣੋ।',
      timestamp: 'Just now',
      suggestedPrompts: [
        'Calculate my monthly EMI and subsidy',
        'Check my eligibility for PMEGP',
        'Show my required document checklist',
        'Find nearest authorized channel partner'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryToSend?: string, overrideMode?: ChatFeatureMode) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q) return;

    const modeToUse = overrideMode || activeFeature;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      featureMode: modeToUse,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          profile,
          mode: modeToUse
        })
      });

      if (res.ok) {
        const reply: ChatMessage = await res.json();
        setMessages((prev) => [...prev, reply]);

        if (reply.featureMode) {
          setActiveFeature(reply.featureMode);
        }

        // Apply entity extractions if detected
        if (reply.extractedProfileUpdates) {
          setProfile((prev) => ({
            ...prev,
            ...reply.extractedProfileUpdates
          }));
          runMatching({
            ...profile,
            ...reply.extractedProfileUpdates
          });
        }
      }
    } catch (err) {
      console.error('Chat query failed:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary connection issue. Please verify your query or try again.',
        hindiText: 'क्षमा करें, अस्थायी नेटवर्क समस्या आई है। कृपया पुनः प्रयास करें।',
        punjabiText: 'ਮਾਫ਼ ਕਰਨਾ, ਨੈੱਟਵਰਕ ਸਮੱਸਿਆ ਆਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFeature = (mode: ChatFeatureMode, prompt: string) => {
    setActiveFeature(mode);
    handleSendMessage(prompt, mode);
  };

  // Multilingual voice speech recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
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

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecordingVoice(false);
    }
  };

  const getMessageDisplay = (msg: ChatMessage) => {
    if (chatLang === 'hi' && msg.hindiText) return msg.hindiText;
    if (chatLang === 'pa' && msg.punjabiText) return msg.punjabiText;
    return msg.text;
  };

  const handleSpeakToggle = (msg: ChatMessage) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      const text = getMessageDisplay(msg);
      speakText(text, chatLang);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="saathi-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Saathi AI"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <img src="/logo.png" alt="Saathi AI" style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFFFFF', padding: '1px' }} />
        <span>Ask Saathi AI</span>
        <ArrowRight size={16} />
      </button>

      {/* Expandable Drawer */}
      {isOpen && (
        <div className="saathi-drawer">
          {/* Header */}
          <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="SchemeMatch" style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFFFFF', padding: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.98rem', display: 'block' }}>Saathi AI Copilot</strong>
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
                  {chatLang === 'hi' ? 'स्मार्ट योजना व वित्तीय सहायक' : chatLang === 'pa' ? 'ਸਮਾਰਟ ਸਕੀਮ ਤੇ ਕਰਜ਼ਾ ਸਹਾਇਕ' : 'Smart Scheme & Credit Assistant'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', color: '#FFFFFF', padding: '4px', border: 'none', cursor: 'pointer' }}
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Feature Selector Chips Bar */}
          <FeatureChipsBar 
            activeMode={activeFeature} 
            onSelectMode={handleSelectFeature} 
            lang={chatLang}
          />

          {/* Body / Message History */}
          <div className="drawer-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-saffron)' }}>
                        Saathi AI
                      </span>
                      {msg.featureMode && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255, 111, 0, 0.1)', color: 'var(--primary-saffron)', fontWeight: 600 }}>
                          {msg.featureMode.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSpeakToggle(msg)}
                      style={{ background: 'transparent', color: isSpeaking ? '#059669' : 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '2px', transition: 'color 0.2s' }}
                      title={isSpeaking ? 'Stop Audio' : 'Listen aloud'}
                    >
                      {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line', fontSize: '0.86rem', lineHeight: '1.45' }}>
                  {getMessageDisplay(msg)}
                </div>

                {/* 1. Rich Scheme Recommendation Card */}
                {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--emerald-growth)' }}>
                      {chatLang === 'hi' ? 'सुझाई गई प्रमुख योजनाएं:' : chatLang === 'pa' ? 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀਆਂ ਸਕੀਮਾਂ:' : 'Recommended High-Impact Schemes:'}
                    </div>
                    {msg.matchedSchemes.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: '8px 10px',
                          background: 'var(--bg-surface-subtle)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.82rem', display: 'block', color: 'var(--text-primary)' }}>{s.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary-saffron)', fontWeight: 600 }}>{s.subsidyHighlight}</span>
                          {s.interestRate && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '8px' }}>• {s.interestRate}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="card-quick-action"
                          onClick={() => setSelectedSchemeModal({ id: s.id, name: s.name } as any)}
                          style={{ fontSize: '0.68rem', padding: '3px 8px', flexShrink: 0 }}
                        >
                          {chatLang === 'hi' ? 'विवरण' : chatLang === 'pa' ? 'ਵੇਰਵਾ' : 'View'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Rich Loan & EMI Card */}
                {msg.emiCard && (
                  <EmiCardView 
                    card={msg.emiCard} 
                    onPromptClick={handleSendMessage} 
                    lang={chatLang}
                  />
                )}

                {/* 3. Rich Document Checklist Card */}
                {msg.documentCard && (
                  <DocumentChecklistCardView 
                    card={msg.documentCard} 
                    onPromptClick={handleSendMessage} 
                    lang={chatLang}
                  />
                )}

                {/* 4. Rich Channel Partner Finder Card */}
                {msg.partnerCard && (
                  <PartnerFinderCardView 
                    card={msg.partnerCard} 
                    onPromptClick={handleSendMessage} 
                    lang={chatLang}
                  />
                )}

                {/* 5. Rich What-If Simulator Card */}
                {msg.whatIfCard && (
                  <WhatIfCardView 
                    card={msg.whatIfCard} 
                    onPromptClick={handleSendMessage} 
                    lang={chatLang}
                  />
                )}

                {/* 6. Rich Eligibility Checker Card */}
                {msg.eligibilityCard && (
                  <EligibilityCardView 
                    card={msg.eligibilityCard} 
                    onPromptClick={handleSendMessage} 
                    lang={chatLang}
                  />
                )}

                {/* Quick prompt suggestions */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        style={{
                          fontSize: '0.73rem',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble assistant" style={{ fontStyle: 'italic', fontSize: '0.84rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} className="spin-slow" />
                  {chatLang === 'hi' ? 'सरकारी दिशानिर्देशों का विश्लेषण हो रहा है...' : chatLang === 'pa' ? 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...' : 'Analyzing government guidelines & calculating exact benefits...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="drawer-footer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`btn-secondary ${isRecordingVoice ? 'btn-success' : ''}`}
              onClick={toggleVoiceInput}
              style={{ padding: '8px 12px', flexShrink: 0 }}
              title={`Voice Input (${chatLang.toUpperCase()})`}
            >
              {isRecordingVoice ? (
                <div className="voice-recording-wave">
                  <div className="voice-wave-dot" />
                  <span>REC</span>
                </div>
              ) : (
                <Mic size={18} />
              )}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                isRecordingVoice
                  ? (chatLang === 'hi' ? 'बोलें, हम सुन रहे हैं...' : chatLang === 'pa' ? 'ਬੋਲੋ, ਅਸੀਂ ਸੁਣ ਰਹੇ ਹਾਂ...' : 'Listening to your voice...')
                  : (chatLang === 'hi' ? 'योजना, ईएमआई या पात्रता के बारे में पूछें...' : chatLang === 'pa' ? 'ਸਕੀਮ, EMI ਜਾਂ ਯੋਗਤਾ ਬਾਰੇ ਪੁੱਛੋ...' : 'Ask about schemes, EMI, documents or partners...')
              }
              style={{ flex: 1 }}
            />

            <button
              type="button"
              className="btn-primary"
              onClick={() => handleSendMessage()}
              style={{ padding: '8px 14px', flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
