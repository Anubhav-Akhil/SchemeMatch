import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { History, Plus, Trash2, MessageSquare, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export interface SavedChatSession {
  id: string;
  title: string;
  snippet?: string;
  updatedAt: number; // timestamp ms
  formattedDate: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'schemematch_saathi_chat_history_v1';

const notifyHistoryUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('saathi_history_updated'));
  }
};

export const loadStoredChatSessions = (): SavedChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
  } catch (e) {
    console.warn('Failed to load chat history from localStorage:', e);
  }
  return [];
};

export const getStoredChatSessionCount = (): number => {
  return loadStoredChatSessions().length;
};

export const saveStoredChatSession = (session: SavedChatSession) => {
  try {
    const existing = loadStoredChatSessions();
    const idx = existing.findIndex(s => s.id === session.id);
    let updated: SavedChatSession[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = session;
    } else {
      updated = [session, ...existing];
    }
    // Keep up to 30 most recent chat sessions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
    notifyHistoryUpdated();
  } catch (e) {
    console.warn('Failed to save chat session to localStorage:', e);
  }
};

export const deleteStoredChatSession = (sessionId: string) => {
  try {
    const existing = loadStoredChatSessions();
    const filtered = existing.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifyHistoryUpdated();
  } catch (e) {
    console.warn('Failed to delete chat session:', e);
  }
};

export const clearAllStoredChatSessions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyHistoryUpdated();
  } catch (e) {
    console.warn('Failed to clear chat history:', e);
  }
};

export const formatSessionDate = (timestamp: number, lang: 'en' | 'hi' | 'pa'): string => {
  if (!timestamp) return '';
  const now = new Date();
  const date = new Date(timestamp);
  const isToday = now.toDateString() === date.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (isToday) {
    if (lang === 'hi') return `आज, ${timeStr}`;
    if (lang === 'pa') return `ਅੱਜ, ${timeStr}`;
    return `Today, ${timeStr}`;
  }
  if (isYesterday) {
    if (lang === 'hi') return `कल, ${timeStr}`;
    if (lang === 'pa') return `ਕੱਲ੍ਹ, ${timeStr}`;
    return `Yesterday, ${timeStr}`;
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + `, ${timeStr}`;
};

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId: string | null;
  onSelectSession: (session: SavedChatSession) => void;
  onNewChat: () => void;
  lang: 'en' | 'hi' | 'pa';
}

export const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  currentSessionId,
  onSelectSession,
  onNewChat,
  lang
}) => {
  const [sessions, setSessions] = useState<SavedChatSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSessions(loadStoredChatSessions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const labels = {
    en: {
      title: 'Chat History',
      subtitle: 'Past inquiries & scheme recommendations',
      newChat: 'New Conversation',
      emptyTitle: 'No Saved Chats Yet',
      emptyDesc: 'Your conversations with Saathi AI are automatically saved here so you can revisit scheme recommendations and answers anytime.',
      startChat: 'Start a Conversation',
      clearAll: 'Clear All History',
      messagesCount: 'messages',
      activeBadge: 'Active',
      chatsCount: 'chats saved',
      deleteConfirm: 'Delete this conversation?'
    },
    hi: {
      title: 'चैट इतिहास',
      subtitle: 'पिछली बातचीत व योजना सिफारिशें',
      newChat: 'नई बातचीत शुरू करें',
      emptyTitle: 'कोई सहेजी गई चैट नहीं है',
      emptyDesc: 'साथी AI के साथ आपकी बातचीत यहाँ स्वतः सहेजी जाती है ताकि आप कभी भी योजनाओं और उत्तरों को दोबारा देख सकें।',
      startChat: 'नई बातचीत शुरू करें',
      clearAll: 'पूरा इतिहास मिटाएं',
      messagesCount: 'संदेश',
      activeBadge: 'सक्रिय',
      chatsCount: 'चैट सहेजे गए',
      deleteConfirm: 'क्या आप इस चैट को हटाना चाहते हैं?'
    },
    pa: {
      title: 'ਚੈਟ ਇਤਿਹਾਸ',
      subtitle: 'ਪੁਰਾਣੀ ਗੱਲਬਾਤ ਅਤੇ ਸਕੀਮ ਸਿਫ਼ਾਰਸ਼ਾਂ',
      newChat: 'ਨਵੀਂ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ',
      emptyTitle: 'ਕੋਈ ਸੁਰੱਖਿਅਤ ਚੈਟ ਨਹੀਂ ਹੈ',
      emptyDesc: 'ਸਾਥੀ AI ਨਾਲ ਤੁਹਾਡੀ ਗੱਲਬਾਤ ਆਪਣੇ ਆਪ ਇੱਥੇ ਸੁਰੱਖਿਅਤ ਹੋ ਜਾਂਦੀ ਹੈ ਤਾਂ ਜੋ ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸਕੀਮਾਂ ਬਾਰੇ ਮੁੜ ਵੇਖ ਸਕੋ।',
      startChat: 'ਨਵੀਂ ਚੈਟ ਸ਼ੁਰੂ ਕਰੋ',
      clearAll: 'ਸਾਰਾ ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ',
      messagesCount: 'ਸੰਦੇਸ਼',
      activeBadge: 'ਸਰਗਰਮ',
      chatsCount: 'ਚੈਟ ਸੁਰੱਖਿਅਤ',
      deleteConfirm: 'ਕੀ ਤੁਸੀਂ ਇਸ ਚੈਟ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?'
    }
  };

  const l = labels[lang] || labels.en;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteStoredChatSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm(l.deleteConfirm)) {
      clearAllStoredChatSessions();
      setSessions([]);
    }
  };

  return (
    <div className="saathi-history-drawer-overlay" onClick={onClose}>
      <div className="saathi-history-drawer" onClick={e => e.stopPropagation()}>
        {/* Figma Header with Saathi AI Star and Logo */}
        <div className="saathi-history-header">
          <div className="saathi-history-header-title-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="saathi-history-star-icon">
              <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
            </svg>
            <h3 className="saathi-history-header-title">
              {l.title}
              {sessions.length > 0 && (
                <span className="saathi-history-count-pill">
                  {sessions.length}
                </span>
              )}
            </h3>
          </div>

          <button
            type="button"
            className="chatbot-figma-close-btn"
            onClick={onClose}
            aria-label="Close History"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Start New Chat Action Button */}
        <div className="saathi-history-action-bar">
          <button
            type="button"
            className="saathi-history-new-btn"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <Plus size={16} />
            <span>{l.newChat}</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="saathi-history-list">
          {sessions.length === 0 ? (
            /* Figma Empty State matching Hero */
            <div className="saathi-history-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="saathi-history-empty-star">
                <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
              </svg>
              <h4 className="saathi-history-empty-title">{l.emptyTitle}</h4>
              <p className="saathi-history-empty-desc">{l.emptyDesc}</p>
              <button
                type="button"
                className="saathi-history-empty-action"
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
              >
                <Plus size={14} />
                <span>{l.startChat}</span>
              </button>
            </div>
          ) : (
            sessions.map((s, index) => {
              const isActive = s.id === currentSessionId;
              const dateText = s.updatedAt ? formatSessionDate(s.updatedAt, lang) : s.formattedDate;
              // Extract preview snippet from the session messages
              const snippet = s.snippet || (s.messages?.slice().reverse().find(m => m.sender === 'assistant')?.text) || (s.messages?.[1]?.text) || '';
              const cleanSnippet = snippet ? (snippet.length > 75 ? snippet.slice(0, 75) + '...' : snippet) : '';

              return (
                <div
                  key={s.id}
                  className={`saathi-history-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectSession(s);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ animationDelay: `${Math.min(index * 0.035, 0.3)}s` }}
                >
                  <div className="saathi-history-card-top">
                    <div className="saathi-history-card-title-group">
                      <div className="saathi-history-chat-icon-badge">
                        <MessageSquare size={13} />
                      </div>
                      <span className="saathi-history-card-title">
                        {s.title || 'Government Scheme Inquiry'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isActive && (
                        <span className="saathi-history-active-tag">
                          <span className="saathi-history-active-dot" />
                          {l.activeBadge}
                        </span>
                      )}

                      <button
                        type="button"
                        className="saathi-history-delete-btn"
                        onClick={(e) => handleDelete(e, s.id)}
                        title="Delete Chat"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {cleanSnippet && (
                    <p className="saathi-history-card-snippet">
                      {cleanSnippet}
                    </p>
                  )}

                  <div className="saathi-history-card-meta">
                    <div className="saathi-history-meta-left">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {dateText}
                      </span>
                      <span>•</span>
                      <span className="saathi-history-meta-pill">
                        {s.messages?.length || 0} {l.messagesCount}
                      </span>
                    </div>

                    <ArrowRight size={13} style={{ color: 'var(--text-muted, #94A3B8)', opacity: 0.7 }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="saathi-history-footer">
            <span className="saathi-history-footer-count">
              {sessions.length} {l.chatsCount}
            </span>
            <button
              type="button"
              className="saathi-history-clear-btn"
              onClick={handleClearAll}
            >
              <Trash2 size={12} />
              <span>{l.clearAll}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
