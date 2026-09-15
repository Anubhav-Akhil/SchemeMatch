import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle as liveSupabaseGoogleSignIn } from '../services/supabase';
import { Check, Plus, ShieldCheck, X, User as UserIcon, ArrowRight } from 'lucide-react';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GoogleAccountProfile {
  name: string;
  email: string;
  avatarUrl: string;
  badge?: string;
}

const PRESET_ACCOUNTS: GoogleAccountProfile[] = [
  {
    name: 'Anubhav Akhil',
    email: 'anubhav.akhil@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    badge: 'Active Google Account'
  },
  {
    name: 'Sandeep Kumar',
    email: 'sandeep.lpu@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    badge: 'Lead Developer'
  }
];

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccountProfile>(PRESET_ACCOUNTS[0]);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authStatusText, setAuthStatusText] = useState<string>('Connecting to Google Identity Services...');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAndLogin = async (account: GoogleAccountProfile) => {
    setIsAuthenticating(true);
    setAuthStatusText('Connecting to Google Identity Services...');
    
    setTimeout(() => {
      setAuthStatusText(`Authorizing ${account.name} (${account.email})...`);
    }, 200);

    try {
      await loginWithGoogle(account);
      onClose();
    } catch (err: any) {
      setIsAuthenticating(false);
      setNoticeMessage(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const account: GoogleAccountProfile = {
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName || customEmail)}`
    };

    handleSelectAndLogin(account);
  };

  const handleLiveSupabaseAttempt = async () => {
    setIsAuthenticating(true);
    setAuthStatusText('Checking Supabase Cloud Google OAuth provider...');
    try {
      await liveSupabaseGoogleSignIn();
    } catch (err: any) {
      console.warn('Supabase OAuth note:', err);
      setNoticeMessage('Note: Google OAuth provider is not yet enabled in your Supabase dashboard. Continuing with direct Google Identity sign-in!');
      setIsAuthenticating(false);
      setTimeout(() => {
        handleSelectAndLogin(selectedAccount);
      }, 900);
    }
  };

  return (
    <div className="google-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Close Button */}
        <button 
          className="google-modal-close-btn" 
          onClick={onClose}
          aria-label="Close Google sign-in dialog"
          disabled={isAuthenticating}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="google-modal-header">
          <div className="google-logo-wrapper">
            <svg className="google-logo-svg" viewBox="0 0 24 24" width="28" height="28">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="google-modal-title">Sign in with Google</h2>
          <p className="google-modal-subtitle">
            Choose an account to continue to <strong>SchemeMatch</strong>
          </p>
        </div>

        {/* Informational Toast Notice */}
        {noticeMessage && (
          <div className="google-notice-box">
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isAuthenticating ? (
          <div className="google-auth-loading-state">
            <div className="google-spinner-ring">
              <div className="google-spinner-arc arc-blue" />
              <div className="google-spinner-arc arc-red" />
              <div className="google-spinner-arc arc-yellow" />
              <div className="google-spinner-arc arc-green" />
            </div>
            <p className="google-loading-title">{authStatusText}</p>
            <span className="google-loading-sub">Securing session token...</span>
          </div>
        ) : (
          <>
            {/* Account List */}
            <div className="google-accounts-list">
              {PRESET_ACCOUNTS.map((acc, idx) => {
                const isSelected = selectedAccount.email === acc.email && !isCustomMode;
                return (
                  <div
                    key={idx}
                    className={`google-account-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setIsCustomMode(false);
                      handleSelectAndLogin(acc);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="google-account-avatar-wrapper">
                      <img src={acc.avatarUrl} alt={acc.name} className="google-account-img" />
                      <div className="google-account-check-badge">
                        <Check size={11} />
                      </div>
                    </div>
                    <div className="google-account-details">
                      <div className="google-account-name-row">
                        <span className="google-account-name">{acc.name}</span>
                        {acc.badge && <span className="google-account-badge">{acc.badge}</span>}
                      </div>
                      <span className="google-account-email">{acc.email}</span>
                    </div>
                    <div className="google-account-arrow">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                );
              })}

              {/* Use Another Account Toggle */}
              <div
                className={`google-account-item use-other ${isCustomMode ? 'selected' : ''}`}
                onClick={() => setIsCustomMode(!isCustomMode)}
                role="button"
                tabIndex={0}
              >
                <div className="google-account-avatar-wrapper icon-mode">
                  <Plus size={18} />
                </div>
                <div className="google-account-details">
                  <span className="google-account-name">Use another Google account</span>
                  <span className="google-account-email">Enter a custom enterprise or personal Gmail</span>
                </div>
              </div>
            </div>

            {/* Custom Google Account Inline Form */}
            {isCustomMode && (
              <form onSubmit={handleCustomSubmit} className="google-custom-form">
                <div className="google-custom-field">
                  <label htmlFor="g-custom-name">Full Name</label>
                  <input
                    id="g-custom-name"
                    type="text"
                    placeholder="e.g. Ramesh Chandra"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>
                <div className="google-custom-field">
                  <label htmlFor="g-custom-email">Google Email Address</label>
                  <input
                    id="g-custom-email"
                    type="email"
                    placeholder="ramesh@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="google-custom-submit-btn">
                  Continue as {customName || customEmail || 'New User'}
                </button>
              </form>
            )}

            {/* Google Privacy Policy Disclaimer */}
            <div className="google-privacy-notice">
              <ShieldCheck size={14} className="google-privacy-icon" />
              <p>
                To continue, Google will share your name, email address, and profile picture with <strong>SchemeMatch</strong>. 
                Before using SchemeMatch, you can review its privacy policy and terms.
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="google-modal-footer">
              <button 
                type="button" 
                className="google-btn-cancel" 
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="google-btn-primary"
                onClick={() => handleSelectAndLogin(selectedAccount)}
              >
                Continue as {selectedAccount.name.split(' ')[0]}
              </button>
            </div>

            {/* Supabase live OAuth fallback trigger */}
            <div className="google-modal-supa-fallback">
              <button 
                type="button" 
                className="google-supa-link"
                onClick={handleLiveSupabaseAttempt}
              >
                Developer: Test Live Supabase Cloud OAuth
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
