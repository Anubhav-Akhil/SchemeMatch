import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS, Translations } from '../utils/translations';
import { SpeechAssistant } from '../utils/speech';
import { preloadAllLandingImages } from '../utils/landingImages';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: Translations;
  isSpeaking: boolean;
  speakText: (text: string, langOverride?: SupportedLanguage) => void;
  stopSpeech: () => void;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);

  // Preload all 4K images into browser cache on mount
  useEffect(() => {
    preloadAllLandingImages();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setLanguage = (lang: SupportedLanguage) => {
    if (lang === language) return;
    setIsChangingLanguage(true);
    document.body.classList.add('lang-transition-active');

    setLanguageState(lang);

    setTimeout(() => {
      setIsChangingLanguage(false);
      document.body.classList.remove('lang-transition-active');
    }, 380);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const speakText = (text: string, langOverride?: SupportedLanguage) => {
    SpeechAssistant.speak(text, langOverride || language, (speaking) => {
      setIsSpeaking(speaking);
    });
  };

  const stopSpeech = () => {
    SpeechAssistant.stop();
    setIsSpeaking(false);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    theme,
    toggleTheme,
    t: TRANSLATIONS[language] || TRANSLATIONS.en,
    isSpeaking,
    speakText,
    stopSpeech,
    isChangingLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {/* Top Global Accent Loading Progress Bar on Language Transition */}
      {isChangingLanguage && (
        <div className="global-lang-progress-bar" />
      )}
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
