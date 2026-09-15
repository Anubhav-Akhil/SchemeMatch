import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { ChatMessage } from '../types';
import { Bot, MessageSquare, Send, Mic, MicOff, X, Sparkles, Volume2, ArrowRight, Check } from 'lucide-react';

export const SaathiAICopilot: React.FC = () => {
  const { t, speakText, language } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal, matchResults } = useProfile();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste! I am Saathi AI, your personalized scheme discovery copilot. Tell me about your work, where you live, or what funds you need, and I will find the best government subsidies and 4% concessional credit for you.',
      hindiText: 'नमस्ते! मैं साथी (Saathi) AI हूँ। मुझे अपने कार्य, क्षेत्र और ऋण आवश्यकता के बारे में बताएं, मैं आपके लिए सर्वश्रेष्ठ सरकारी सब्सिडी और रियायती ऋण खोजूँगा।',
      timestamp: 'Just now',
      suggestedPrompts: [
        'What is PMEGP subsidy for rural SC women?',
        'Tell me about PM Vishwakarma toolkit grant',
        'How to get 5% VISVAS interest subvention?',
        'How to register on Udyam portal for free?'
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

  const handleSendMessage = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
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
          profile
        })
      });

      if (res.ok) {
        const reply: ChatMessage = await res.json();
        setMessages((prev) => [...prev, reply]);

        // If assistant extracted profile updates, offer or auto-apply
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
        text: 'Sorry, I encountered a temporary connection issue. Please check your query or try again.',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Speech Recognition toggle (Web Speech API)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your query in English, Hindi, or Hinglish.');
      return;
    }

    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
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
        <Sparkles size={16} />
      </button>

      {/* Expandable Drawer */}
      {isOpen && (
        <div className="saathi-drawer">
          {/* Header */}
          <div className="drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="SchemeMatch" style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFFFFF', padding: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.98rem', display: 'block' }}>{t.copilot.title}</strong>
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>{t.copilot.subtitle}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', color: '#FFFFFF', padding: '4px' }}
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body / Message History */}
          <div className="drawer-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-saffron)' }}>
                      Saathi AI
                    </span>
                    <button
                      onClick={() => speakText(language === 'hi' && msg.hindiText ? msg.hindiText : msg.text)}
                      style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
                      title="Listen text aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line' }}>
                  {language === 'hi' && msg.hindiText ? msg.hindiText : msg.text}
                </div>

                {/* Scheme recommendations inside message */}
                {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-growth)', marginBottom: '4px' }}>
                      Recommended Schemes:
                    </div>
                    {msg.matchedSchemes.map((s) => (
                      <div
                        key={s.id}
                        style={{ padding: '6px 8px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '4px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-subtle)' }}
                      >
                        <div>
                          <strong>{s.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--primary-saffron)' }}>{s.subsidyHighlight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick prompt suggestions */}
                {msg.suggestedPrompts && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        style={{
                          fontSize: '0.74rem',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
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
                Analyzing government eligibility guidelines...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="drawer-footer">
            <button
              className={`btn-secondary ${isRecordingVoice ? 'btn-success' : ''}`}
              onClick={toggleVoiceInput}
              style={{ padding: '8px 12px' }}
              title="Voice Input (English/Hindi)"
            >
              {isRecordingVoice ? <MicOff size={18} style={{ color: 'var(--accent-rose)' }} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecordingVoice ? t.copilot.listening : t.copilot.placeholder}
              style={{ flex: 1 }}
            />

            <button
              className="btn-primary"
              onClick={() => handleSendMessage()}
              style={{ padding: '8px 14px' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
