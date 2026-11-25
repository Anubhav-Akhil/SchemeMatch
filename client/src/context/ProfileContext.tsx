import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SchemeMatchResult, PersonaProfile, Scheme } from '../types';
import { SAMPLE_PERSONAS } from '../data/samplePersonas';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

interface ProfileContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfileField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void;
  personas: PersonaProfile[];
  selectedPersonaId: string;
  selectPersona: (personaId: string) => void;
  matchResults: SchemeMatchResult[];
  otherSchemes: SchemeMatchResult[];
  isLoadingMatches: boolean;
  hasCalculated: boolean;
  runMatching: (profileToMatch?: UserProfile) => Promise<void>;
  
  // Tabs & Navigation
  activeTab: 'dashboard' | 'profile' | 'matcher' | 'gap' | 'whatif' | 'calculator' | 'partners' | 'documents' | 'dpr' | 'comparison' | 'roadmap';
  setActiveTab: (tab: 'dashboard' | 'profile' | 'matcher' | 'gap' | 'whatif' | 'calculator' | 'partners' | 'documents' | 'dpr' | 'comparison' | 'roadmap') => void;
  navigateToFeature: (
    tab: 'dashboard' | 'profile' | 'matcher' | 'gap' | 'whatif' | 'calculator' | 'partners' | 'documents' | 'dpr' | 'comparison' | 'roadmap',
    opts?: { schemeId?: string; scroll?: boolean }
  ) => void;

  // Comparison
  comparedSchemes: Scheme[];
  toggleCompareScheme: (scheme: Scheme) => void;
  isSchemeCompared: (schemeId: string) => boolean;
  clearComparison: () => void;

  // Detail Modal
  selectedSchemeModal: SchemeMatchResult | null;
  setSelectedSchemeModal: (scheme: SchemeMatchResult | null) => void;

  // Document states
  uploadedDocIds: string[];
  toggleDocumentUpload: (docId: string) => void;

  // Aggregate stats
  totalPotentialSubsidy: number;

  // Raw scheme repository
  allSchemes: Scheme[];
  fetchAllSchemes: () => Promise<Scheme[]>;
}

export const EMPTY_PROFILE: UserProfile = {
  fullName: '',
  age: '' as any,
  gender: '',
  category: '',
  isDifferentlyAbled: false,
  locationType: '',
  state: '',
  district: '',
  annualFamilyIncome: '' as any,
  educationLevel: '' as any,
  enterpriseStage: '' as any,
  sector: '' as any,
  tradeType: '',
  businessName: '',
  businessDescription: '',
  requiredLoanAmount: '' as any,
  totalProjectCost: '' as any,
  promoterContributionAvailable: '' as any,
  hasExistingUdyam: false,
  hasCasteCertificate: false,
  hasBankStatement6Months: false,
  hasLandOrRentDeed: false,
  hasSkillTrainingCertificate: false,
  hasProjectReport: false
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setCurrentView } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [personas, setPersonas] = useState<PersonaProfile[]>(SAMPLE_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const [matchResults, setMatchResults] = useState<SchemeMatchResult[]>([]);
  const [otherSchemes, setOtherSchemes] = useState<SchemeMatchResult[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [totalPotentialSubsidy, setTotalPotentialSubsidy] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'matcher' | 'gap' | 'whatif' | 'calculator' | 'partners' | 'documents' | 'dpr' | 'comparison' | 'roadmap'>('profile');
  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeModal, setSelectedSchemeModal] = useState<SchemeMatchResult | null>(null);
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>(['aadhaar-card', 'caste-certificate', 'bank-statement']);

  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);

  // Storage keys keyed by user to guarantee persistence across logins and sessions
  const profileStorageKey = user?.email
    ? `schemematch_business_profile_${user.email.toLowerCase()}`
    : 'schemematch_business_profile_guest';

  const matchesStorageKey = user?.email
    ? `schemematch_matches_${user.email.toLowerCase()}`
    : 'schemematch_matches_guest';

  const docsStorageKey = user?.email
    ? `schemematch_docs_${user.email.toLowerCase()}`
    : 'schemematch_docs_guest';

  // Restore saved business profile, matches, and uploaded docs when user logs in or on mount
  useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem(profileStorageKey);
      if (savedProfileStr) {
        const parsed = JSON.parse(savedProfileStr);
        if (parsed && typeof parsed === 'object') {
          // If user has a name in auth context, ensure profile stays synced with it
          if (user?.fullName && (!parsed.fullName || parsed.fullName === 'Entrepreneur')) {
            parsed.fullName = user.fullName;
          }
          setProfile(parsed);

          // Restore saved matches if available
          const savedMatchesStr = localStorage.getItem(matchesStorageKey);
          if (savedMatchesStr) {
            try {
              const parsedMatches = JSON.parse(savedMatchesStr);
              if (parsedMatches && parsedMatches.matches && parsedMatches.matches.length > 0) {
                setMatchResults(parsedMatches.matches);
                setOtherSchemes(parsedMatches.otherSchemes || []);
                setTotalPotentialSubsidy(parsedMatches.totalPotentialSubsidy || 0);
                setHasCalculated(true);
              }
            } catch (e) {}
          } else if (parsed.sector || parsed.requiredLoanAmount || parsed.category) {
            runMatching(parsed);
          }

          // Restore saved documents if available
          const savedDocsStr = localStorage.getItem(docsStorageKey);
          if (savedDocsStr) {
            try {
              const parsedDocs = JSON.parse(savedDocsStr);
              if (Array.isArray(parsedDocs)) {
                setUploadedDocIds(parsedDocs);
              }
            } catch (e) {}
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to restore saved business profile:', e);
    }

    // Default: initialize profile name from user if available
    if (user?.fullName) {
      setProfile(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName
      }));
    }
  }, [user?.email, user?.fullName, profileStorageKey]);

  // Persist business profile whenever it updates
  useEffect(() => {
    if (profile && (profile.fullName || profile.category || profile.sector || profile.requiredLoanAmount)) {
      try {
        localStorage.setItem(profileStorageKey, JSON.stringify(profile));
      } catch (e) {}
    }
  }, [profile, profileStorageKey]);

  // Persist matches whenever calculated
  useEffect(() => {
    if (hasCalculated && matchResults.length > 0) {
      try {
        localStorage.setItem(matchesStorageKey, JSON.stringify({
          matches: matchResults,
          otherSchemes,
          totalPotentialSubsidy
        }));
      } catch (e) {}
    }
  }, [hasCalculated, matchResults, otherSchemes, totalPotentialSubsidy, matchesStorageKey]);

  // Persist uploaded documents
  useEffect(() => {
    if (uploadedDocIds.length > 0) {
      try {
        localStorage.setItem(docsStorageKey, JSON.stringify(uploadedDocIds));
      } catch (e) {}
    }
  }, [uploadedDocIds, docsStorageKey]);

  // Method to fetch all government schemes from backend repository
  const fetchAllSchemes = async (): Promise<Scheme[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/schemes`);
      if (res.ok) {
        const data = await res.json();
        const list = data.schemes || [];
        setAllSchemes(list);
        return list;
      }
    } catch (err) {
      console.warn('Backend schemes fetch failed:', err);
    }
    return [];
  };

  // Fetch personas and full scheme repository on load
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/personas`);
        if (res.ok) {
          const data = await res.json();
          if (data.personas && data.personas.length > 0) {
            setPersonas(data.personas);
          }
        }
      } catch (err) {
        console.warn('Backend personas fetch failed, continuing with defaults:', err);
      }
    };
    fetchPersonas();
    fetchAllSchemes();
  }, []);

  // Run matching whenever profile changes or requested
  const runMatching = async (profileToMatch?: UserProfile) => {
    setIsLoadingMatches(true);
    const targetProfile = profileToMatch || profile;
    try {
      const res = await fetch(`${API_BASE_URL}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetProfile)
      });
      if (res.ok) {
        const data = await res.json();
        const matches = data.topMatches || [];
        setMatchResults(matches);
        setOtherSchemes(data.otherSchemes || []);
        setTotalPotentialSubsidy(data.totalPotentialSubsidy || 0);
        setHasCalculated(matches.length > 0);
      }
    } catch (err) {
      console.error('Error running AI scheme match:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // Do NOT auto-run matching on mount so schemes are only calculated upon user action

  const selectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const found = personas.find((p) => p.id === personaId) || SAMPLE_PERSONAS.find((p) => p.id === personaId);
    if (found) {
      const newProfile: UserProfile = { ...found };
      setProfile(newProfile);
      runMatching(newProfile);
    }
  };

  const navigateToFeature = (
    tab: 'dashboard' | 'profile' | 'matcher' | 'gap' | 'whatif' | 'calculator' | 'partners' | 'documents' | 'dpr' | 'comparison' | 'roadmap',
    opts?: { schemeId?: string; scroll?: boolean }
  ) => {
    setActiveTab(tab);
    if (opts?.schemeId) {
      const found = matchResults.find(m => m.scheme.id === opts.schemeId) ||
                    otherSchemes.find(m => m.scheme.id === opts.schemeId);
      if (found) {
        setSelectedSchemeModal(found);
      }
    }
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfileField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto adjust total project cost if required loan changed
      if (field === 'requiredLoanAmount') {
        const num = Number(value);
        if (!isNaN(num)) {
          updated.totalProjectCost = Math.round(num * 1.1);
        }
      }
      return updated;
    });
  };

  // Scheme comparison toggles
  const toggleCompareScheme = (scheme: Scheme) => {
    setComparedSchemes((prev) => {
      const exists = prev.some((s) => s.id === scheme.id);
      if (exists) {
        return prev.filter((s) => s.id !== scheme.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 schemes at a time.');
          return prev;
        }
        return [...prev, scheme];
      }
    });
  };

  const isSchemeCompared = (schemeId: string) => {
    return comparedSchemes.some((s) => s.id === schemeId);
  };

  const clearComparison = () => {
    setComparedSchemes([]);
  };

  const toggleDocumentUpload = (docId: string) => {
    setUploadedDocIds((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  const value: ProfileContextType = {
    profile,
    setProfile,
    updateProfileField,
    personas,
    selectedPersonaId,
    selectPersona,
    matchResults,
    otherSchemes,
    isLoadingMatches,
    hasCalculated,
    runMatching,
    activeTab,
    setActiveTab,
    navigateToFeature,
    comparedSchemes,
    toggleCompareScheme,
    isSchemeCompared,
    clearComparison,
    selectedSchemeModal,
    setSelectedSchemeModal,
    uploadedDocIds,
    toggleDocumentUpload,
    totalPotentialSubsidy,
    allSchemes,
    fetchAllSchemes
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
};
