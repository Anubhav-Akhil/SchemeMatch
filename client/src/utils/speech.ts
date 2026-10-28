import { SupportedLanguage } from '../types';
import { API_BASE_URL } from '../config';

const DEFAULT_SARVAM_KEY = 'sk_ohm78s0d_rSuSyLYskgC1SzPQxCwFrYQT';

export class SpeechAssistant {
  private static isSpeaking = false;
  private static activeCallback: ((speaking: boolean) => void) | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static currentAbortController: AbortController | null = null;

  public static async speak(
    text: string,
    lang: SupportedLanguage = 'en',
    onStateChange?: (speaking: boolean) => void
  ) {
    // 1. Immediately stop any currently playing speech/audio
    this.stop();

    // 2. Set new active callback and speaking state
    this.activeCallback = onStateChange || null;
    this.isSpeaking = true;
    if (this.activeCallback) {
      this.activeCallback(true);
    }

    // 3. Clean markdown formatting, currency symbols, and extra whitespace
    const cleanText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/₹/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      this.stop();
      return;
    }

    const abortController = new AbortController();
    this.currentAbortController = abortController;

    const langCodeMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      pa: 'pa-IN',
      mr: 'mr-IN',
      bn: 'bn-IN'
    };
    const targetLangCode = langCodeMap[lang] || 'en-IN';

    // 4. Tier 1: Request high-fidelity Indic/English audio from backend endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText,
          language: lang
        }),
        signal: abortController.signal
      });

      if (response.ok) {
        const data = (await response.json()) as { audioBase64?: string; format?: string; source?: string };

        if (abortController.signal.aborted || !this.isSpeaking) {
          return;
        }

        if (data.audioBase64) {
          await this.playBase64Audio(data.audioBase64, abortController, cleanText, lang);
          return;
        }
      }
    } catch (backendErr: any) {
      if (backendErr.name === 'AbortError') {
        return;
      }
      console.warn('Backend TTS endpoint unreachable, checking direct Sarvam fallback:', backendErr.message);
    }

    // If playback was cancelled during network roundtrip, halt
    if (abortController.signal.aborted || !this.isSpeaking) {
      return;
    }

    // 5. Tier 2: Direct Sarvam AI synthesis from client (Native Indic voices: te, mr, bn, pa, hi, en)
    const sarvamApiKey = (import.meta.env.VITE_SARVAM_API_KEY as string) || DEFAULT_SARVAM_KEY;
    if (sarvamApiKey) {
      try {
        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: [cleanText],
            target_language_code: targetLangCode,
            speaker: 'ritu',
            model: 'bulbul:v3'
          }),
          signal: abortController.signal
        });

        if (sarvamRes.ok) {
          const data = (await sarvamRes.json()) as { audios?: string[] };
          if (data.audios && data.audios[0]) {
            if (abortController.signal.aborted || !this.isSpeaking) {
              return;
            }
            const audioDataUri = `data:audio/wav;base64,${data.audios[0]}`;
            await this.playBase64Audio(audioDataUri, abortController, cleanText, lang);
            return;
          }
        } else {
          const errText = await sarvamRes.text();
          console.warn(`Direct Sarvam TTS returned ${sarvamRes.status}: ${errText.slice(0, 140)}`);
        }
      } catch (sarvamErr: any) {
        if (sarvamErr.name === 'AbortError') {
          return;
        }
        console.warn('Direct Sarvam AI synthesis failed, falling back to browser SpeechSynthesis:', sarvamErr.message);
      }
    }

    // 6. Tier 3: Browser SpeechSynthesis Fallback
    if (!abortController.signal.aborted && this.isSpeaking) {
      this.speakBrowserFallback(cleanText, lang);
    }
  }

  private static playBase64Audio(
    audioUri: string,
    abortController: AbortController,
    cleanText: string,
    lang: SupportedLanguage
  ): Promise<void> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(audioUri);
        this.currentAudio = audio;

        audio.onended = () => {
          this.stop();
          resolve();
        };

        audio.onerror = (err) => {
          console.warn('Audio playback error, falling back to browser SpeechSynthesis:', err);
          if (!abortController.signal.aborted && this.isSpeaking) {
            this.speakBrowserFallback(cleanText, lang);
          }
          resolve();
        };

        audio.play().then(() => {
          resolve();
        }).catch((err) => {
          console.warn('Audio play() promise rejected (e.g. browser autoplay restrictions):', err);
          if (!abortController.signal.aborted && this.isSpeaking) {
            this.speakBrowserFallback(cleanText, lang);
          }
          resolve();
        });
      } catch (err) {
        console.warn('Audio instantiation failed, using browser fallback:', err);
        if (!abortController.signal.aborted && this.isSpeaking) {
          this.speakBrowserFallback(cleanText, lang);
        }
        resolve();
      }
    });
  }

  private static speakBrowserFallback(cleanText: string, lang: SupportedLanguage) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      this.stop();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        pa: 'pa-IN',
        mr: 'mr-IN',
        bn: 'bn-IN'
      };

      const requestedLocale = langMap[lang] || 'en-IN';
      const voices = window.speechSynthesis.getVoices();

      // Find an exact language voice, partial match, or best Indian voice fallback
      const exactVoice = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === requestedLocale.toLowerCase());
      const prefixVoice = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
      const indicVoice = voices.find((v) => v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().startsWith('hi'));

      if (exactVoice) {
        utterance.voice = exactVoice;
        utterance.lang = exactVoice.lang;
      } else if (prefixVoice) {
        utterance.voice = prefixVoice;
        utterance.lang = prefixVoice.lang;
      } else if (indicVoice) {
        // Fall back to available Indic/English voice to ensure speech plays rather than failing silently
        utterance.voice = indicVoice;
        utterance.lang = indicVoice.lang;
      } else {
        utterance.lang = requestedLocale;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.activeCallback) this.activeCallback(true);
      };

      utterance.onend = () => {
        this.stop();
      };

      utterance.onerror = (e) => {
        console.error('Browser speech synthesis error:', e);
        this.stop();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Failed browser speech fallback:', e);
      this.stop();
    }
  }

  public static stop() {
    // Cancel in-flight network request if any
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }

    // Stop and release HTML Audio element if playing
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }

    // Cancel browser SpeechSynthesis if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    this.isSpeaking = false;
    if (this.activeCallback) {
      const cb = this.activeCallback;
      this.activeCallback = null;
      cb(false);
    }
  }

  public static isAudioSpeaking(): boolean {
    return this.isSpeaking;
  }
}
