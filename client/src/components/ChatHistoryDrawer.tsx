import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { History, Plus, Trash2, MessageSquare, Clock, ArrowRight, X } from 'lucide-react';

export interface SavedChatSession {
  id: string;
  title: string;
  updatedAt: number; // timestamp ms
  formattedDate: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'schemematch_saathi_chat_history_v1';

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
  } catch (e) {
    console.warn('Failed to save chat session to localStorage:', e);
  }
};

export const deleteStoredChatSession = (sessionId: string) => {
  try {
    const existing = loadStoredChatSessions();
    const filtered = existing.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to delete chat session:', e);
  }
};

export const clearAllStoredChatSessions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear chat history:', e);
  }
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
      newChat: 'New Chat',
      emptyTitle: 'No Past Conversations',
      emptyDesc: 'Your conversations with Saathi AI will automatically be saved here so you can revisit them anytime.',
      clearAll: 'Clear All History',
      messagesCount: 'messages',
      deleteConfirm: 'Delete this chat session?'
    },
    hi: {
      title: 'चैट इतिहास',
      newChat: 'नया चैट',
      emptyTitle: 'कोई पूर्व बातचीत नहीं है',
      emptyDesc: 'साथी AI के साथ आपकी बातचीत यहाँ स्वतः सहेजी जाएगी ताकि आप कभी भी दोबारा देख सकें।',
      clearAll: 'पूरा इतिहास मिटाएं',
      messagesCount: 'संदेश',
      deleteConfirm: 'क्या आप इस चैट सत्र को हटाना चाहते हैं?'
    },
    pa: {
      title: 'ਚੈਟ ਇਤਿਹਾਸ',
      newChat: 'ਨਵੀਂ ਚੈਟ',
      emptyTitle: 'ਕੋਈ ਪੁਰਾਣੀ ਗੱਲਬਾਤ ਨਹੀਂ ਹੈ',
      emptyDesc: 'ਸਾਥੀ AI ਨਾਲ ਤੁਹਾਡੀ ਗੱਲਬਾਤ ਆਪਣੇ ਆਪ ਇੱਥੇ ਸੁਰੱਖਿਅਤ ਹੋ ਜਾਵੇਗੀ।',
      clearAll: 'ਸਾਰਾ ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ',
      messagesCount: 'ਸੰਦੇਸ਼',
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
    clearAllStoredChatSessions();
    setSessions([]);
  };

  return (
    <div className="saathi-history-drawer-overlay" onClick={onClose}>
      <div className="saathi-history-drawer" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="saathi-history-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--primary-saffron, #FF6F00)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              {l.title}
            </span>
          </div>
          <button
            type="button"
            className="saathi-history-close-btn"
            onClick={onClose}
            aria-label="Close History"
          >
            <X size={16} />
          </button>
        </div>

        {/* Start New Chat Button */}
        <div style={{ padding: '12px 14px 6px' }}>
          <button
            type="button"
            className="saathi-history-new-btn"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <Plus size={15} />
            <span>{l.newChat}</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="saathi-history-list">
          {sessions.length === 0 ? (
            <div className="saathi-history-empty">
              <MessageSquare size={36} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{l.emptyTitle}</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.45 }}>
                {l.emptyDesc}
              </p>
            </div>
          ) : (
            sessions.map(s => {
              const isActive = s.id === currentSessionId;
              return (
                <div
                  key={s.id}
                  className={`saathi-history-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectSession(s);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="saathi-history-item-title">
                      {s.title || 'Inquiry on Government Schemes'}
                    </div>
                    <div className="saathi-history-item-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {s.formattedDate}
                      </span>
                      <span>•</span>
                      <span>{s.messages.length} {l.messagesCount}</span>
                    </div>
                  </div>

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
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="saathi-history-footer">
            <button
              type="button"
              className="saathi-history-clear-btn"
              onClick={handleClearAll}
            >
              <Trash2 size={13} />
              <span>{l.clearAll}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
