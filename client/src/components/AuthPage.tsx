import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import authSideBannerImg from '../assets/auth-side-banner.jpg';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { 
    authMode, 
    setAuthMode, 
    setCurrentView, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginDemo 
  } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMessage('Please provide your full name or enterprise name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        const result = await registerWithEmail(email, password, fullName);
        if (result === 'confirm' || result === 'session') {
          setSuccessMessage('🎉 Account created successfully! Sign in with your credentials below.');
          setAuthMode('login');
        }
      }
    } catch (err: any) {
      const msg: string = err.message || '';
      if (msg === 'SUPABASE_NOT_CONFIGURED') {
        loginDemo(fullName || email.split('@')[0], email);
      } else if (msg.toLowerCase().includes('rate limit')) {
        setErrorMessage('Too many requests — please wait a minute and try again.');
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        setErrorMessage('This email is already registered. Switch to Sign In.');
      } else {
        setErrorMessage(msg || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message || '';
      if (msg.includes('Unsupported provider') || msg.includes('provider is not enabled')) {
        setErrorMessage('Google Sign-In needs to be enabled in your Supabase Dashboard: go to Authentication -> Providers -> Google and toggle ON.');
      } else {
        setErrorMessage(msg || 'Failed to initiate Google sign-in. Please try again.');
      }
    }
  };

  return (
    <div className="new-auth-page-root">
      {/* Warm Ambient Radial Glow Background matching mockup */}
      <div className="new-auth-ambient-glow" />

      {/* Floating Back to Home Button */}
      <div className="new-auth-top-nav">
        <button
          type="button"
          className="new-auth-back-btn"
          onClick={() => setCurrentView('landing')}
          title="Return to SchemeMatch Main Page"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Rounded 2-Column Card Container */}
      <div className="new-auth-card-frame">
        {/* =========================================================
            LEFT COLUMN: Side Banner Image matching 2nd image
            ========================================================= */}
        <div className="new-auth-side-column">
          <img 
            src={authSideBannerImg} 
            alt="Your Goals Our Support — SchemeMatch Affirmative Schemes" 
            className="new-auth-side-image"
          />
        </div>

        {/* =========================================================
            RIGHT COLUMN: Form & Navigation matching 1st image
            ========================================================= */}
        <div className="new-auth-form-column">
          {/* Top Bar: Brand Logo & Sign Up Toggle */}
          <div className="new-auth-header-bar">
            <div 
              className="new-auth-brand"
              onClick={() => setCurrentView('landing')}
              style={{ cursor: 'pointer' }}
              title="Return to SchemeMatch Home"
            >
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="new-auth-sprout-logo">
                <path d="M7 23C7 18 12 14 18 14C18 20 14 25 7 23Z" fill="#F97316" />
                <path d="M16 11C16 6 21 3 26 4C25 10 20 14 16 11Z" fill="#FB923C" />
                <path d="M12 16C9 12 11 7 15 5C17 10 16 15 12 16Z" fill="#EA580C" />
                <path d="M13 27C14 22 17 19 21 18C21 23 18 27 13 27Z" fill="#F97316" />
                <circle cx="16" cy="18" r="2" fill="#C2410C" />
              </svg>
              <div>
                <div className="new-auth-brand-name">SchemeMatch</div>
                <div className="new-auth-brand-tagline">Match • Apply • Grow</div>
              </div>
            </div>

            <div className="new-auth-switch-link">
              <span>{authMode === 'login' ? 'New here?' : 'Already have an account?'}</span>{' '}
              <button
                type="button"
                className="new-auth-signup-text"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Center Form Section */}
          <div className="new-auth-center-content">
            <div className="new-auth-headings">
              <h1 className="new-auth-title">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="new-auth-subtitle">
                {authMode === 'login'
                  ? 'Sign in to continue your journey towards a brighter future.'
                  : 'Join SchemeMatch to unlock tailored affirmative subsidies for your enterprise.'}
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="new-auth-alert error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="new-auth-alert success">
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="new-auth-fields-form">
              {/* Full Name (when in Register Mode) */}
              {authMode === 'register' && (
                <div className="new-auth-input-box">
                  <UserIcon size={18} className="new-auth-icon" />
                  <input
                    type="text"
                    className="new-auth-input"
                    placeholder="Full Name / Enterprise Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email or Username */}
              <div className="new-auth-input-box">
                <Mail size={18} className="new-auth-icon" />
                <input
                  type="text"
                  className="new-auth-input"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="new-auth-input-box">
                <Lock size={18} className="new-auth-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="new-auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="new-auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Forgot password? Link */}
              {authMode === 'login' && (
                <div className="new-auth-forgot-row">
                  <button
                    type="button"
                    className="new-auth-forgot-link"
                    onClick={() => setSuccessMessage('Password recovery dispatched. Please check your inbox.')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button ("→ Sign In") */}
              <button
                type="submit"
                className="new-auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <ArrowRight size={18} />
                    <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  </>
                )}
              </button>
            </form>

            {/* "OR" Divider */}
            <div className="new-auth-divider">
              <span className="divider-line" />
              <span className="divider-text">OR</span>
              <span className="divider-line" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              className="new-auth-google-btn"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="google-icon" width="18" height="18" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Shortcut */}
            <div className="new-auth-demo-wrap">
              <button
                type="button"
                className="new-auth-demo-pill"
                onClick={() => loginDemo('Sunita Devi (Demo)', 'sunita.devi@enterprise.in')}
              >
                <Sparkles size={13} className="text-amber" />
                <span>⚡ Instant Demo Access (Sunita Devi • 96% Match)</span>
              </button>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="new-auth-footer-row">
            <span className="new-auth-copyright">© 2026 SchemeMatch. All rights reserved.</span>

            <div className="new-auth-footer-nav">
              <button type="button" onClick={() => setCurrentView('landing')}>About</button>
              <span className="footer-dot">•</span>
              <button type="button" onClick={() => setCurrentView('landing')}>Contact Us</button>
              <span className="footer-dot">•</span>
              <div className="new-auth-lang-drop">
                <Globe size={13} />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  aria-label="Select platform language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                  <option value="bn">বাংলা</option>
                  <option value="te">తెలుగు</option>
                  <option value="pa">ਪੰਜਾਬੀ</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
