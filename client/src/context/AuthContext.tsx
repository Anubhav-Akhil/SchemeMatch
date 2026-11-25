import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  supabase, 
  isSupabaseConfigured, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser,
  getActiveSession
} from '../services/supabase';

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  googleAvatarUrl?: string;
  isDemo?: boolean;
  provider?: 'google' | 'email' | 'demo';
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  currentView: 'landing' | 'auth' | 'app';
  setCurrentView: (view: 'landing' | 'auth' | 'app') => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, fullName: string) => Promise<string>;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
  navigateToAuth: (mode?: 'login' | 'register') => void;
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'schemematch_demo_user';
const GOOGLE_USER_KEY = 'schemematch_google_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const activeSession = await getActiveSession();
          if (activeSession?.user) {
            setSession(activeSession);
            mapSupabaseUser(activeSession.user);
            setCurrentView('app'); // if user has active session, open app directly
            return;
          }
        }
        
        // Check for saved Google user session
        const savedGoogle = localStorage.getItem(GOOGLE_USER_KEY);
        if (savedGoogle) {
          try {
            const parsed = JSON.parse(savedGoogle);
            if (parsed && parsed.email) {
              setUser(parsed);
              setCurrentView('app');
              return;
            }
          } catch (e) {
            localStorage.removeItem(GOOGLE_USER_KEY);
          }
        }

        // Check for saved local demo session
        const savedDemo = localStorage.getItem(DEMO_USER_KEY);
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed);
            setCurrentView('app');
          } catch (e) {
            localStorage.removeItem(DEMO_USER_KEY);
          }
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase Auth State changes (for Google OAuth redirects, signin, signout)
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          mapSupabaseUser(newSession.user);
          setCurrentView('app');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentView('landing');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const mapSupabaseUser = (sbUser: User) => {
    const email = sbUser.email || '';
    const emailKey = email.toLowerCase();

    // 1. Check local persistent profile cache for this specific user
    let savedLocalProfile: { fullName?: string; avatarUrl?: string; googleAvatarUrl?: string } | null = null;
    try {
      const stored = localStorage.getItem(`schemematch_user_profile_${emailKey}`);
      if (stored) {
        savedLocalProfile = JSON.parse(stored);
      }
    } catch (e) {}

    // 2. Check Supabase custom metadata (which Google OAuth sync never overwrites)
    const customFullName = sbUser.user_metadata?.custom_full_name;
    const customAvatarUrl = sbUser.user_metadata?.custom_avatar_url;

    // 3. Raw Google avatar from identities or metadata
    const rawGoogleAvatar = sbUser.identities?.find(i => i.provider === 'google')?.identity_data?.avatar_url ||
                            sbUser.identities?.find(i => i.provider === 'google')?.identity_data?.picture ||
                            sbUser.user_metadata?.picture ||
                            (sbUser.user_metadata?.avatar_url && sbUser.user_metadata.avatar_url.includes('googleusercontent.com') ? sbUser.user_metadata.avatar_url : undefined);

    if (rawGoogleAvatar) {
      try {
        localStorage.setItem(`schemematch_google_avatar_${emailKey}`, rawGoogleAvatar);
        localStorage.setItem('schemematch_google_avatar', rawGoogleAvatar);
      } catch (e) {}
    }

    const savedGoogleAvatar = rawGoogleAvatar || 
                              localStorage.getItem(`schemematch_google_avatar_${emailKey}`) ||
                              localStorage.getItem('schemematch_google_avatar') || 
                              undefined;

    // 4. Resolve fullName (Custom preference > Supabase raw claims > default)
    const fullName = savedLocalProfile?.fullName ||
                     customFullName ||
                     sbUser.user_metadata?.full_name || 
                     sbUser.user_metadata?.name || 
                     sbUser.email?.split('@')[0] || 
                     'Entrepreneur';

    // 5. Resolve avatarUrl:
    // If the user previously selected an avatar (inbuilt, initials '', or google), respect it!
    let avatarUrl: string | undefined = undefined;
    if (savedLocalProfile && savedLocalProfile.avatarUrl !== undefined) {
      avatarUrl = savedLocalProfile.avatarUrl || undefined;
    } else if (customAvatarUrl !== undefined) {
      avatarUrl = customAvatarUrl || undefined;
    } else if (sbUser.user_metadata?.avatar_url) {
      avatarUrl = sbUser.user_metadata.avatar_url;
    } else {
      avatarUrl = savedGoogleAvatar;
    }

    const mappedUser: AppUser = {
      id: sbUser.id,
      email,
      fullName,
      avatarUrl,
      googleAvatarUrl: savedGoogleAvatar,
      isDemo: false,
      provider: sbUser.app_metadata?.provider === 'google' ? 'google' : 'email'
    };

    // Cache to ensure it survives signout/signin
    try {
      localStorage.setItem(`schemematch_user_profile_${emailKey}`, JSON.stringify({
        fullName,
        avatarUrl,
        googleAvatarUrl: savedGoogleAvatar
      }));
    } catch (e) {}

    setUser(mappedUser);
  };

  const loginWithEmailHandler = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Fallback demo login if keys are missing
        loginDemo(email.split('@')[0], email);
        return;
      }
      const data = await signInWithEmail(email, pass);
      if (data.user) {
        mapSupabaseUser(data.user);
        setCurrentView('app');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailHandler = async (email: string, pass: string, fullName: string): Promise<string> => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        loginDemo(fullName, email);
        return 'demo';
      }
      const data = await signUpWithEmail(email, pass, fullName);
      // If Supabase returned a user with an active session (email confirm disabled), log in directly
      if (data.session) {
        mapSupabaseUser(data.user!);
        setCurrentView('app');
        return 'session';
      }
      // Otherwise email confirmation is enabled — tell the UI to switch to sign-in
      return 'confirm';
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogleHandler = async () => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = (name: string = 'Entrepreneur', email: string = 'entrepreneur@schemematch.gov.in') => {
    const emailKey = email.toLowerCase();
    let savedDemoProfile: any = null;
    try {
      const stored = localStorage.getItem(`schemematch_user_profile_${emailKey}`) || localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        savedDemoProfile = JSON.parse(stored);
      }
    } catch (e) {}

    const demoUser: AppUser = {
      id: savedDemoProfile?.id || ('demo-' + Date.now()),
      email,
      fullName: savedDemoProfile?.fullName || name,
      avatarUrl: savedDemoProfile?.avatarUrl,
      googleAvatarUrl: savedDemoProfile?.googleAvatarUrl || (typeof window !== 'undefined' ? localStorage.getItem('schemematch_google_avatar') : undefined) || undefined,
      isDemo: true,
      provider: 'demo'
    };
    setUser(demoUser);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setCurrentView('app');
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(GOOGLE_USER_KEY);
      localStorage.removeItem('schemematch_cached_user');
      // Preserving schemematch_user_profile_* and schemematch_business_profile_*
      // so user's customized data persists on subsequent sign-ins!
      await signOutUser();
      setUser(null);
      setSession(null);
      setCurrentView('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfileHandler = async (data: { fullName?: string; avatarUrl?: string }) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const nextUser: AppUser = {
      ...user,
      fullName: data.fullName !== undefined ? data.fullName : user.fullName,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : user.avatarUrl,
      googleAvatarUrl: user.googleAvatarUrl || localStorage.getItem(`schemematch_google_avatar_${emailKey}`) || localStorage.getItem('schemematch_google_avatar') || undefined
    };
    setUser(nextUser);

    // Save permanently keyed by user's email so it survives re-login
    try {
      localStorage.setItem(`schemematch_user_profile_${emailKey}`, JSON.stringify({
        fullName: nextUser.fullName,
        avatarUrl: nextUser.avatarUrl,
        googleAvatarUrl: nextUser.googleAvatarUrl
      }));
    } catch (e) {}

    if (user.isDemo) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(nextUser));
    } else if (user.provider === 'google') {
      localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.setItem('schemematch_cached_user', JSON.stringify(nextUser));
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: nextUser.fullName,
            avatar_url: nextUser.avatarUrl || null,
            custom_full_name: nextUser.fullName,
            custom_avatar_url: nextUser.avatarUrl || '',
            custom_profile_saved: true
          }
        });
      } catch (err) {
        console.warn('Supabase updateUser metadata notice:', err);
      }
    }
  };

  const updatePasswordHandler = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User is not signed in.' };
    }
    if (user.provider === 'google') {
      return { success: false, error: 'Password changes for Google sign-in are managed through your Google Account.' };
    }
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to update password' };
      }
    } else {
      // Demo mode fallback
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        currentView,
        setCurrentView,
        authMode,
        setAuthMode,
        loginWithEmail: loginWithEmailHandler,
        registerWithEmail: registerWithEmailHandler,
        loginWithGoogle: loginWithGoogleHandler,
        loginDemo,
        logout: logoutHandler,
        navigateToAuth,
        updateProfile: updateProfileHandler,
        updatePassword: updatePasswordHandler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
