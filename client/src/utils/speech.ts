import { SupportedLanguage } from '../types';

export class SpeechAssistant {
  private static isSpeaking = false;
  private static activeCallback: ((speaking: boolean) => void) | null = null;

  public static speak(
    text: string,
    lang: SupportedLanguage = 'hi',
    onStateChange?: (speaking: boolean) => void
  ) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel existing speech
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    if (this.activeCallback) {
      this.activeCallback(false);
    }

    this.activeCallback = onStateChange || null;

    // Clean markdown stars/brackets for clean spoken audio
    const cleanText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set language code
    const langMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      bn: 'bn-IN'
    };
    utterance.lang = langMap[lang] || 'hi-IN';
    utterance.rate = 0.95; // slightly slower for maximum clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.activeCallback) this.activeCallback(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.activeCallback) this.activeCallback(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      this.isSpeaking = false;
      if (this.activeCallback) this.activeCallback(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      if (this.activeCallback) {
        this.activeCallback(false);
      }
    }
  }

  public static isAudioSpeaking(): boolean {
    return this.isSpeaking;
  }
}
