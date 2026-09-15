import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS, Translations } from '../utils/translations';
import { SpeechAssistant } from '../utils/speech';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: Translations;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeech: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const speakText = (text: string) => {
    SpeechAssistant.speak(text, language, (speaking) => {
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
    stopSpeech
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
