import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { INBUILT_AVATARS, InbuiltAvatar } from '../utils/inbuiltAvatars';
import {
  LogOut,
  User as UserIcon,
  Lock,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';

interface ProfileDropdownProps {
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className }) => {
  const { user, logout, updateProfile, updatePassword } = useAuth();
  const { profile, setProfile } = useProfile();
  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [avatarError, setAvatarError] = useState(false);

  // Cached Google avatar URL (if signed in via Google or stored previously)
  const googleAvatarUrl = 
    user?.googleAvatarUrl || 
    (typeof window !== 'undefined' ? localStorage.getItem('schemematch_google_avatar') : null) || 
    (user?.avatarUrl && user.avatarUrl.includes('googleusercontent.com') ? user.avatarUrl : null);

  // If user has a Google avatar, ensure it stays remembered in localStorage
  useEffect(() => {
    if (user?.avatarUrl && user.avatarUrl.includes('googleusercontent.com')) {
      try {
        localStorage.setItem('schemematch_google_avatar', user.avatarUrl);
      } catch (e) {}
    }
  }, [user?.avatarUrl]);

  // Draft editing states (for Full Name + Profile Avatar)
  const [draftFirstName, setDraftFirstName] = useState('');
  const [draftLastName, setDraftLastName] = useState('');
  const [draftAvatarUrl, setDraftAvatarUrl] = useState<string | undefined>(undefined);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password changing fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset / roll back draft state to current saved user
  const resetDraftToUser = () => {
    if (user?.fullName) {
      const parts = user.fullName.trim().split(/\s+/);
      setDraftFirstName(parts[0] || '');
      setDraftLastName(parts.slice(1).join(' ') || '');
    } else {
      setDraftFirstName('Entrepreneur');
      setDraftLastName('');
    }
    setDraftAvatarUrl(user?.avatarUrl || '');
    setAvatarError(false);
    setProfileSuccess(false);
    setProfileError(null);
  };

  // Sync draft states when user updates or dropdown opens
  useEffect(() => {
    resetDraftToUser();
  }, [user?.fullName, user?.avatarUrl, isOpen]);

  // Outside click and Escape key detection (roll back draft upon cancel/closing)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        resetDraftToUser();
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetDraftToUser();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, user?.fullName, user?.avatarUrl]);

  // Cancel action: rolls back draft to previous values and closes dropdown
  const handleCancel = () => {
    resetDraftToUser();
    setIsOpen(false);
  };

  // Save Profile action: applies name and avatar simultaneously
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedFirst = draftFirstName.trim();
    const trimmedLast = draftLastName.trim();
    if (!trimmedFirst) {
      setProfileError('First name cannot be empty.');
      return;
    }

    const full = trimmedLast ? `${trimmedFirst} ${trimmedLast}` : trimmedFirst;
    setProfileSaving(true);
    setProfileSuccess(false);
    setProfileError(null);

    try {
      await updateProfile({
        fullName: full,
        avatarUrl: draftAvatarUrl ? draftAvatarUrl : ''
      });
      // Keep profile context in sync
      setProfile({
        ...profile,
        fullName: full
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setProfileError(err?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'New password and confirm password do not match.' });
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.success) {
        setPasswordStatus({ success: true, message: 'Password successfully changed!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ success: false, message: res.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ success: false, message: err?.message || 'Error updating password.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Saved initials for trigger button
  const initials = user?.fullName
    ? user.fullName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  // Preview initials for draft preview & initials avatar button
  const previewInitials = (
    (draftFirstName.trim()[0] || 'U') + (draftLastName.trim()[0] || '')
  ).toUpperCase();

  // Determine if draft has unsaved changes
  const currentSavedFirst = user?.fullName ? user.fullName.trim().split(/\s+/)[0] || '' : 'Entrepreneur';
  const currentSavedLast = user?.fullName ? user.fullName.trim().split(/\s+/).slice(1).join(' ') || '' : '';
  const currentSavedAvatar = user?.avatarUrl || '';

  const isDirty = 
    draftFirstName.trim() !== currentSavedFirst ||
    draftLastName.trim() !== currentSavedLast ||
    (draftAvatarUrl || '') !== currentSavedAvatar;

  const isGoogleUser = user?.provider === 'google';

  return (
    <div className={`si-profile-dropdown-wrapper ${className || ''}`} ref={containerRef} style={{ position: 'relative' }}>
      {/* ── Trigger Pill ────────────────────────────────────────── */}
      <button
        type="button"
        className={`si-user-badge ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Account Profile & Settings"
        style={{
          cursor: 'pointer',
          border: isOpen ? '1px solid var(--primary-saffron, #FF6F00)' : undefined,
          boxShadow: isOpen ? '0 0 14px rgba(255, 111, 0, 0.25)' : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 10px 5px 6px',
          background: 'inherit',
          color: 'inherit',
          textAlign: 'left'
        }}
      >
        <div className="si-user-avatar" style={{ position: 'relative' }}>
          {user?.avatarUrl && !avatarError ? (
            <img
              src={user.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="si-user-info" style={{ lineHeight: 1.2 }}>
          <div className="si-user-name" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>{user?.fullName || 'Entrepreneur'}</span>
            {isGoogleUser && (
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: 'rgba(66, 133, 244, 0.12)',
                  color: '#4285F4',
                  fontWeight: 700
                }}
              >
                G
              </span>
            )}
          </div>
          <div className="si-user-sub" style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email || 'entrepreneur@schemematch.gov.in'}
          </div>
        </div>

        <ChevronDown
          size={14}
          style={{
            marginLeft: '2px',
            color: 'var(--text-muted)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* ── Dropdown Menu ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="si-profile-dropdown-card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '350px',
            maxWidth: '92vw',
            background: 'var(--bg-surface-elevated, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.1))',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'siDropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Top User Header Card */}
          <div
            style={{
              padding: '18px 20px',
              background: 'linear-gradient(135deg, rgba(255, 111, 0, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
              borderBottom: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6F00, #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.25rem',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(255, 111, 0, 0.25)',
                border: '2px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              {draftAvatarUrl && !avatarError ? (
                <img
                  src={draftAvatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span>{previewInitials}</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{draftFirstName.trim() || 'Entrepreneur'} {draftLastName.trim()}</span>
                {isDirty && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 111, 0, 0.15)',
                      color: '#FF6F00',
                      fontWeight: 700
                    }}
                  >
                    Draft
                  </span>
                )}
                {profileSuccess && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      fontWeight: 700
                    }}
                  >
                    Saved ✓
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '2px'
                }}
              >
                {user?.email || 'entrepreneur@schemematch.gov.in'}
              </div>

              {/* Provider Badge */}
              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isGoogleUser ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: 'rgba(66, 133, 244, 0.1)',
                      color: '#4285F4',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google Account</span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    <ShieldCheck size={11} />
                    <span>Email & Password</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
              background: 'var(--bg-surface-subtle, rgba(0, 0, 0, 0.02))'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--bg-surface-elevated, #fff)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--primary-saffron, #FF6F00)' : 'var(--text-muted)',
                borderBottom: activeTab === 'profile' ? '2px solid var(--primary-saffron, #FF6F00)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <UserIcon size={14} />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                background: activeTab === 'password' ? 'var(--bg-surface-elevated, #fff)' : 'transparent',
                color: activeTab === 'password' ? 'var(--primary-saffron, #FF6F00)' : 'var(--text-muted)',
                borderBottom: activeTab === 'password' ? '2px solid var(--primary-saffron, #FF6F00)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Lock size={14} />
              <span>Security & Password</span>
            </button>
          </div>

          {/* Tab 1: My Profile (Avatar Selection + Full & Last Name) */}
          {activeTab === 'profile' && (
            <div style={{ padding: '16px 20px', maxHeight: '420px', overflowY: 'auto' }}>
              
              <form onSubmit={handleSaveProfile}>
                {/* Profile Picture / Avatar Options */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                      Profile Photo / Avatar
                    </label>
                    <span style={{ fontSize: '0.68rem', color: isDirty ? 'var(--primary-saffron, #FF6F00)' : 'var(--text-muted)', fontWeight: isDirty ? 700 : 500 }}>
                      {isDirty ? '● Unsaved changes' : 'Click Save to apply'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '8px',
                      padding: '10px 8px',
                      background: 'var(--bg-surface-subtle, rgba(0, 0, 0, 0.02))',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.06))'
                    }}
                  >
                    {/* Option 1: Google Profile Photo (if user has Google account / photo) */}
                    {googleAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarError(false);
                          setDraftAvatarUrl(googleAvatarUrl);
                        }}
                        title="Your Google / Gmail Profile Photo"
                        style={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          borderRadius: '50%',
                          border: draftAvatarUrl === googleAvatarUrl ? '2.5px solid var(--primary-saffron, #FF6F00)' : '2px solid transparent',
                          padding: '2px',
                          background: draftAvatarUrl === googleAvatarUrl ? 'rgba(255, 111, 0, 0.15)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          transition: 'transform 0.15s, border-color 0.15s',
                          transform: draftAvatarUrl === googleAvatarUrl ? 'scale(1.08)' : 'scale(1)'
                        }}
                      >
                        <img
                          src={googleAvatarUrl}
                          alt="Google Account"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        {/* Small Google 'G' icon badge on top right */}
                        <div
                          style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            padding: 1
                          }}
                          title="Google Account Photo"
                        >
                          <svg viewBox="0 0 24 24" width="10" height="10">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        </div>
                        {draftAvatarUrl === googleAvatarUrl && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              width: 15,
                              height: 15,
                              borderRadius: '50%',
                              background: 'var(--primary-saffron, #FF6F00)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            <Check size={9} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    )}

                    {/* Option 2: Default Initials */}
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarError(false);
                        setDraftAvatarUrl('');
                      }}
                      title="Default Initials"
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '50%',
                        border: !draftAvatarUrl ? '2.5px solid var(--primary-saffron, #FF6F00)' : '2px solid transparent',
                        padding: '2px',
                        background: !draftAvatarUrl ? 'rgba(255, 111, 0, 0.15)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'transform 0.15s, border-color 0.15s',
                        transform: !draftAvatarUrl ? 'scale(1.08)' : 'scale(1)'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #475569, #334155)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}
                      >
                        {previewInitials}
                      </div>
                      {!draftAvatarUrl && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            width: 15,
                            height: 15,
                            borderRadius: '50%',
                            background: 'var(--primary-saffron, #FF6F00)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </button>

                    {/* Option 3: Inbuilt Indian Entrepreneur Avatars */}
                    {INBUILT_AVATARS.map((avatar) => {
                      const isSelected = draftAvatarUrl === avatar.url;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            setAvatarError(false);
                            setDraftAvatarUrl(avatar.url);
                          }}
                          title={`${avatar.name} - ${avatar.role}`}
                          style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            borderRadius: '50%',
                            border: isSelected ? '2.5px solid var(--primary-saffron, #FF6F00)' : '2px solid transparent',
                            padding: '2px',
                            background: isSelected ? 'rgba(255, 111, 0, 0.15)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'transform 0.15s, border-color 0.15s',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)'
                          }}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                          />
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                width: 15,
                                height: 15,
                                borderRadius: '50%',
                                background: 'var(--primary-saffron, #FF6F00)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            >
                              <Check size={9} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Changing Option */}
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Name Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                      placeholder="e.g. Ramesh"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        fontSize: '0.82rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.15))',
                        background: 'var(--bg-surface, #fff)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={draftLastName}
                      onChange={(e) => setDraftLastName(e.target.value)}
                      placeholder="e.g. Kumar"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        fontSize: '0.82rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.15))',
                        background: 'var(--bg-surface, #fff)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Full name preview */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Full name preview:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {draftFirstName.trim()} {draftLastName.trim()}
                  </strong>
                </div>

                {profileError && (
                  <div
                    style={{
                      padding: '7px 10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#DC2626',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertCircle size={13} />
                    <span>{profileError}</span>
                  </div>
                )}

                {profileSuccess && (
                  <div
                    style={{
                      padding: '7px 10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#059669',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Check size={13} />
                    <span>Profile and avatar saved successfully!</span>
                  </div>
                )}

                {/* Unified Action Buttons: Cancel (Roll Back) + Save Changes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={profileSaving}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-subtle, rgba(0, 0, 0, 0.04))',
                      border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.15))',
                      color: 'var(--text-secondary, #64748B)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={profileSaving || !draftFirstName.trim()}
                    style={{
                      flex: 2,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #FF6F00, #F59E0B)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: (profileSaving || !draftFirstName.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(255, 111, 0, 0.25)',
                      opacity: (!draftFirstName.trim() || profileSaving) ? 0.7 : 1,
                      transition: 'all 0.15s'
                    }}
                  >
                    <Check size={14} />
                    <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Password Changing (Conditional for Email vs Google) */}
          {activeTab === 'password' && (
            <div style={{ padding: '16px 20px', maxHeight: '380px', overflowY: 'auto' }}>
              {isGoogleUser ? (
                /* Google Authenticated Account Info */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      padding: '14px',
                      background: 'rgba(66, 133, 244, 0.08)',
                      borderRadius: '10px',
                      border: '1px solid rgba(66, 133, 244, 0.25)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>
                      <ShieldCheck size={16} />
                      <span>Google Account Security</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      You signed in using Google Single Sign-On (OAuth). Password resets, multi-factor authentication, and credential changes are managed securely through your Google Account.
                    </p>
                  </div>

                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated, #fff)',
                      border: '1px solid rgba(66, 133, 244, 0.4)',
                      color: '#4285F4',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Manage Google Security</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ) : (
                /* Email & Password User: Password Change Form */
                <form onSubmit={handleUpdatePassword}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    Change Password
                  </div>

                  {passwordStatus && (
                    <div
                      style={{
                        padding: '8px 10px',
                        background: passwordStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${passwordStatus.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        color: passwordStatus.success ? '#059669' : '#DC2626',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {passwordStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{passwordStatus.message}</span>
                    </div>
                  )}

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        style={{
                          width: '100%',
                          padding: '8px 32px 8px 10px',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.15))',
                          background: 'var(--bg-surface, #fff)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        style={{
                          width: '100%',
                          padding: '8px 32px 8px 10px',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.15))',
                          background: 'var(--bg-surface, #fff)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordUpdating || !newPassword}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: passwordUpdating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                    }}
                  >
                    <Lock size={13} />
                    <span>{passwordUpdating ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Divider & Sign Out Button */}
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
              background: 'var(--bg-surface-subtle, rgba(0, 0, 0, 0.02))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              SchemeMatch v2.4
            </span>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(225, 29, 72, 0.08)',
                color: '#E11D48',
                border: '1px solid rgba(225, 29, 72, 0.2)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E11D48';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.08)';
                e.currentTarget.style.color = '#E11D48';
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
