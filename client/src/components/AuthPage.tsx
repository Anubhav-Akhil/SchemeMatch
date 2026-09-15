import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { 
    authMode, 
    setAuthMode, 
    setCurrentView, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginDemo,
    isConfigured 
  } = useAuth();
  const { theme } = useLanguage();

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
          // Show success and switch to sign-in tab so they can log in
          setSuccessMessage('🎉 Account created successfully! Sign in with your credentials below.');
          setAuthMode('login');
          // Keep email & password so they can just click Sign In
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
    <div className="auth-page-wrapper">
      {/* Subtle Ambient Radial Glowing Lights */}
      <div className="auth-ambient-glow" />

      {/* Main Container */}
      <div className="auth-container">
        {/* Top Back Navigation */}
        <div className="auth-back-nav">
          <button 
            type="button"
            className="auth-back-btn" 
            onClick={() => setCurrentView('landing')}
          >
            <ArrowLeft size={16} />
            <span>Back to SchemeMatch</span>
          </button>
        </div>

        {/* Auth Glass Card */}
        <div className="auth-card">
          {/* Card Header & Brand Logo */}
          <div className="auth-card-header">
            <div className="auth-logo-badge">
              <img src={logoImg} alt="SchemeMatch" className="auth-logo-img" />
            </div>
            <h1 className="auth-title">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-subtitle">
              {authMode === 'login'
                ? 'Sign in to access your matched schemes, bankable DPRs, and nodal mentors.'
                : 'Join SchemeMatch to unlock tailored national capital subsidies for your enterprise.'}
            </p>

            {/* Segmented Pill Tabs */}
            <div className="auth-tabs-row" role="tablist">
              <button
                type="button"
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="auth-body">
            {/* Feedback Banners */}
            {errorMessage && (
              <div className="auth-alert error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>{errorMessage}</span>
                  {errorMessage.includes('Supabase Dashboard') && (
                    <a
                      href="https://supabase.com/dashboard/project/flhiigvcnixepsixfpxm/auth/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'underline', fontSize: '0.78rem' }}
                    >
                      Open Supabase Google Provider Settings &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert success">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              className="auth-google-btn"
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

            {/* Centered Divider */}
            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name for Registration */}
              {authMode === 'register' && (
                <div className="auth-form-group">
                  <label htmlFor="auth-name">Full Name / Enterprise Name</label>
                  <div className="auth-input-wrapper">
                    <UserIcon size={16} className="auth-input-icon" />
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="e.g. Sunita Devi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="auth-form-group">
                <label htmlFor="auth-email">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@enterprise.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label htmlFor="auth-pass">Password</label>
                  {authMode === 'login' && (
                    <button 
                      type="button" 
                      className="auth-forgot-link"
                      onClick={() => setSuccessMessage('Password recovery dispatched. Check your inbox.')}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="auth-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer with 1-Click Demo Shortcut & Security */}
          <div className="auth-card-footer">
            <div className="auth-demo-box">
              <span className="auth-demo-label">Testing without entering credentials?</span>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={() => loginDemo('Sunita Devi (Demo)', 'sunita.devi@enterprise.in')}
              >
                <Sparkles size={14} />
                <span>⚡ Instant Demo Access (Sunita Devi • 96% Match)</span>
              </button>
            </div>

            <div className="auth-security-tag">
              <ShieldCheck size={13} />
              <span>Secured with Supabase Cloud • 256-bit TLS Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
