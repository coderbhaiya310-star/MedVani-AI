import { LanguageCode, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../i18n/languages';

// Speech Recognition Type Declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

// Global cached voices and load listeners
let cachedVoices: SpeechSynthesisVoice[] = [];

function updateCachedVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        cachedVoices = list;
      }
    } catch {
      // Ignore voice query errors
    }
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateCachedVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    updateCachedVoices();
  };
}

/**
 * Find the best available SpeechSynthesis voice for a given language code.
 * Searches exact locale, language prefix, native script names, and linguistic family fallbacks.
 */
export function findBestVoiceForLanguage(lang: LanguageCode): {
  voice: SpeechSynthesisVoice | null;
  isNative: boolean;
  langCode: string;
} {
  const config = getLanguageConfig(lang);
  const targetLocale = config.speechVoiceLang || config.speechSynthesisLocale || config.locale || 'en-IN';
  const targetPrefix = (config.code || 'en').toLowerCase();

  const voices = updateCachedVoices();
  if (!voices || voices.length === 0) {
    return { voice: null, isNative: false, langCode: targetLocale };
  }

  // 1. Exact locale match (e.g. "hi-IN", "bn-IN", "te-IN", "ta-IN", "ur-IN")
  const exactMatch = voices.find((v) => {
    if (!v.lang) return false;
    const vLang = v.lang.replace('_', '-').toLowerCase();
    const tLoc = targetLocale.toLowerCase();
    return vLang === tLoc || vLang === tLoc.replace('-in', '');
  });
  if (exactMatch) {
    return { voice: exactMatch, isNative: true, langCode: exactMatch.lang };
  }

  // 2. Language prefix match (e.g. starts with "hi", "bn", "mr", "ta", "te", "gu", "kn", "ml", "pa", "or", "as", "ur")
  const prefixMatch = voices.find((v) => {
    if (!v.lang) return false;
    const vLang = v.lang.replace('_', '-').toLowerCase();
    return vLang.startsWith(targetPrefix + '-') || vLang === targetPrefix;
  });
  if (prefixMatch) {
    return { voice: prefixMatch, isNative: true, langCode: prefixMatch.lang };
  }

  // 3. Look for voice name keyword matches (e.g. "Google हिन्दी", "Microsoft Swara", "Google বাংলা", "Microsoft Mohan", etc.)
  const nameKeywords: Record<string, string[]> = {
    hi: ['hindi', 'हिन्दी', 'devanagari', 'swara', 'hemant', 'kalpana', 'madhur'],
    bn: ['bengali', 'bangla', 'বাংলা', 'bashkar', 'tapan', 'tanu'],
    te: ['telugu', 'తెలుగు', 'mohan', 'shruti', 'chitra'],
    ta: ['tamil', 'தமிழ்', 'valluvar', 'pallavi', 'iniya'],
    mr: ['marathi', 'मराठी', 'aarohi', 'manohar'],
    gu: ['gujarati', 'ગુજરાતી', 'dhwani', 'niranjan'],
    kn: ['kannada', 'ಕನ್ನಡ', 'gagan', 'sapna'],
    ml: ['malayalam', 'മലയാളം', 'midhun', 'sobhana'],
    pa: ['punjabi', 'ਪੰਜਾਬੀ', 'raavi', 'gurmukhi'],
    or: ['odia', 'oriya', 'ଓଡ଼ିଆ'],
    as: ['assamese', 'অসমীয়া'],
    ur: ['urdu', 'اردو', 'asad', 'uzma', 'nastaliq'],
    en: ['english (india)', 'india', 'indian', 'neerja', 'ravi', 'en-in', 'en_in'],
  };

  const keywords = nameKeywords[targetPrefix] || [config.name.toLowerCase(), config.nativeName.toLowerCase()];
  const nameMatch = voices.find((v) => {
    const vName = (v.name || '').toLowerCase();
    const vLang = (v.lang || '').toLowerCase();
    return keywords.some((kw) => vName.includes(kw.toLowerCase()) || vLang.includes(kw.toLowerCase()));
  });
  if (nameMatch) {
    return { voice: nameMatch, isNative: true, langCode: nameMatch.lang };
  }

  // 4. Region & script-compatible cross fallbacks:
  // Assamese uses same Eastern Indic script as Bengali; Bengali voices read Assamese fluently
  if (targetPrefix === 'as') {
    const bengaliVoice = voices.find(
      (v) => v.lang && (v.lang.toLowerCase().startsWith('bn') || (v.name && v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')))
    );
    if (bengaliVoice) {
      return { voice: bengaliVoice, isNative: true, langCode: 'bn-IN' };
    }
  }

  // Marathi uses Devanagari script; Hindi voices read Marathi Devanagari clearly
  if (targetPrefix === 'mr') {
    const hindiVoice = voices.find(
      (v) => v.lang && (v.lang.toLowerCase().startsWith('hi') || (v.name && v.name.toLowerCase().includes('hindi')))
    );
    if (hindiVoice) {
      return { voice: hindiVoice, isNative: true, langCode: 'hi-IN' };
    }
  }

  // Urdu regional variants (ur-PK, ar-SA Arabic vocalizer, or Hindi)
  if (targetPrefix === 'ur') {
    const urVariant = voices.find((v) => v.lang && (v.lang.toLowerCase().startsWith('ur') || v.lang.toLowerCase().startsWith('ar')));
    if (urVariant) {
      return { voice: urVariant, isNative: true, langCode: urVariant.lang };
    }
    const hindiVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('hi'));
    if (hindiVoice) {
      return { voice: hindiVoice, isNative: true, langCode: 'hi-IN' };
    }
  }

  // Punjabi regional variants (pa-IN, pa-PK)
  if (targetPrefix === 'pa') {
    const paVariant = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('pa'));
    if (paVariant) {
      return { voice: paVariant, isNative: true, langCode: paVariant.lang };
    }
  }

  // 5. If no native voice exists in OS voice list for this Indic language:
  // IMPORTANT: Return voice: null so the browser does NOT force an English voice on Indic text.
  // The browser will use targetLocale to synthesize online / via native platform engine.
  if (targetPrefix !== 'en') {
    return { voice: null, isNative: false, langCode: targetLocale };
  }

  // For English, fallback to Indian English or first English voice
  const indianEnglish = voices.find((v) => v.lang && v.lang.toLowerCase().includes('en-in'));
  if (indianEnglish) {
    return { voice: indianEnglish, isNative: true, langCode: indianEnglish.lang };
  }

  const anyEnglish = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (anyEnglish) {
    return { voice: anyEnglish, isNative: true, langCode: anyEnglish.lang };
  }

  return { voice: null, isNative: false, langCode: targetLocale };
}

/**
 * Check whether a speech synthesis voice exists for the target language
 */
export function isTtsVoiceAvailable(lang: LanguageCode): {
  available: boolean;
  voiceName?: string;
  isNative: boolean;
  locale: string;
} {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { available: false, isNative: false, locale: 'en-IN' };
  }
  const result = findBestVoiceForLanguage(lang);
  return {
    available: true,
    voiceName: result.voice?.name || 'Browser Cloud Engine',
    isNative: result.isNative,
    locale: result.langCode,
  };
}

// Clinical terms normalization dictionary to enhance STT accuracy for Indian clinical context
const CLINICAL_TERM_MAP: Record<string, string> = {
  // Common phonetic misrecognitions for medical terms
  'beeper': 'BP',
  'be pee': 'BP',
  'b p': 'BP',
  'shugar': 'sugar',
  'suger': 'sugar',
  'loose motion': 'loose motion',
  'dast': 'dast (loose motion)',
  'vomit': 'vomiting',
  'ulti': 'ulti (vomiting)',
  'pet dard': 'pet dard (stomach pain)',
  'sar dard': 'sar dard (headache)',
  'sir dard': 'sir dard (headache)',
  'chhati': 'chhati (chest)',
  'ghutna': 'ghutna (knee)',
  'ghutne': 'ghutne (knees)',
  'sujan': 'sujan (swelling)',
  'crocin': 'Crocin (paracetamol)',
  'paracetamol': 'Paracetamol',
  'combiflam': 'Combiflam',
  'pan 40': 'Pan-40',
  'pantocid': 'Pantocid',
};

/**
 * Normalizes speech recognition text to preserve user words accurately
 * while correcting common speech-to-text artifacts for clinical and Hinglish terms.
 */
export function normalizeSpokenMedicalText(rawText: string): string {
  if (!rawText) return '';
  let cleaned = rawText.trim();

  // Clean duplicate spaces and punctuation glitches
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Normalize phonetic variations without altering the patient's intent
  const words = cleaned.split(' ');
  const normalizedWords = words.map((w) => {
    const lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (CLINICAL_TERM_MAP[lower]) {
      return CLINICAL_TERM_MAP[lower];
    }
    return w;
  });

  return normalizedWords.join(' ');
}

// Global registry of speech managers to ensure clean session termination
const activeSpeechManagers = new Set<ClinicalSpeechManager>();

export class ClinicalSpeechManager {
  private recognition: any | null = null;
  private isListeningActive = false;
  private isAiSpeaking = false;
  private isTurnFinalizing = false;
  private silenceTimer: any = null;
  private lastVoiceDetectedTimestamp = 0;
  private hasSpokenInTurn = false;

  // Multi-segment sentence preservation across browser speech recognition restarts
  private confirmedSegments: string[] = [];
  private currentSessionFinal = '';
  private currentSessionInterim = '';

  // Audio Recording (MediaRecorder) for Server-Side STT (OpenAI Whisper / Gemini)
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recorderMimeType = '';

  private onTranscriptUpdateCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onTurnCompleteCallback: ((finalText: string, audioBlob?: Blob) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onListeningStateCallback: ((isListening: boolean) => void) | null = null;
  private onUserInterruptCallback: (() => void) | null = null;
  private onVoiceLevelCallback: ((level: number) => void) | null = null;
  private activeLanguage: LanguageCode = 'hi';
  private silenceThresholdMs = 1800; // 1.8s silence window: patient can speak complete natural sentences

  // Audio Stream & Web Audio API for VAD (Voice Activity Detection)
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private permissionState: 'prompt' | 'granted' | 'denied' = 'prompt';

  constructor() {
    activeSpeechManagers.add(this);
    this.initSpeechRecognition();
  }

  /**
   * Proactively requests browser microphone permission with noise suppression & echo cancellation
   */
  public async requestPermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof window === 'undefined') {
      return { granted: false, error: 'Browser environment not available' };
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { granted: false, error: 'Microphone permission required hai. Please microphone access allow karein.' };
    }

    try {
      // Request audio with standard acoustic constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaStream = stream;
      this.permissionState = 'granted';
      this.setupAudioAnalyser(stream);
      return { granted: true };
    } catch (err: any) {
      this.permissionState = 'denied';
      console.warn('Microphone permission error:', err);
      return {
        granted: false,
        error: 'Microphone permission required hai. Please microphone access allow karein.',
      };
    }
  }

  public getPermissionState(): 'prompt' | 'granted' | 'denied' {
    return this.permissionState;
  }

  /**
   * Sets up real-time audio analysis for live voice level detection and voice activity monitoring
   */
  private setupAudioAnalyser(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        if (this.onVoiceLevelCallback) {
          this.onVoiceLevelCallback(normalized);
        }

        // Voice Activity Detection: If audio energy is detected (> 14%), user is speaking or taking breath
        if (this.isListeningActive && !this.isAiSpeaking && !this.isTurnFinalizing && normalized > 14) {
          this.lastVoiceDetectedTimestamp = Date.now();
          if (this.hasSpokenInTurn) {
            // Keep microphone alive & postpone silence timer so patient is not cut off mid-sentence
            this.resetSilenceTimer();
          }
        }

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio analyser setup notice:', e);
    }
  }

  public onVoiceLevel(cb: (level: number) => void) {
    this.onVoiceLevelCallback = cb;
  }

  /**
   * Inform speech manager whether the AI is speaking aloud
   * (Prevents AI voice from interrupting itself via microphone echo)
   */
  public setAiSpeaking(isSpeaking: boolean) {
    this.isAiSpeaking = isSpeaking;
    if (isSpeaking) {
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      this.stopMediaRecorder();
    }
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        if (!this.isAiSpeaking) {
          this.isListeningActive = true;
          if (this.onListeningStateCallback) this.onListeningStateCallback(true);
        }
      };

      this.recognition.onend = () => {
        // Automatically keep listening active if session is ongoing and not finalizing/AI-speaking
        if (this.isListeningActive && !this.isAiSpeaking && !this.isTurnFinalizing) {
          // Commit any confirmed final segments before restarting the browser recognition session
          if (this.currentSessionFinal.trim()) {
            this.confirmedSegments.push(this.currentSessionFinal.trim());
            this.currentSessionFinal = '';
          }
          this.currentSessionInterim = '';

          try {
            this.recognition.start();
          } catch {
            setTimeout(() => {
              if (this.isListeningActive && !this.isAiSpeaking && !this.isTurnFinalizing && this.recognition) {
                try {
                  this.recognition.start();
                } catch {}
              }
            }, 120);
          }
        } else {
          if (this.onListeningStateCallback) this.onListeningStateCallback(false);
        }
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        // If AI is currently speaking or turn is finalizing, discard echo
        if (this.isAiSpeaking || this.isTurnFinalizing) {
          return;
        }

        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i];
          const textChunk = result[0]?.transcript || '';
          if (result.isFinal) {
            sessionFinal += (sessionFinal ? ' ' : '') + textChunk.trim();
          } else {
            sessionInterim += (sessionInterim ? ' ' : '') + textChunk.trim();
          }
        }

        this.currentSessionFinal = sessionFinal.trim();
        this.currentSessionInterim = sessionInterim.trim();

        const fullSpoken = [...this.confirmedSegments, this.currentSessionFinal, this.currentSessionInterim]
          .filter(Boolean)
          .join(' ')
          .trim();

        if (fullSpoken) {
          this.hasSpokenInTurn = true;
          this.lastVoiceDetectedTimestamp = Date.now();
          const normalized = normalizeSpokenMedicalText(fullSpoken);

          // User spoke new words; trigger interrupt if AI was speaking
          if (this.onUserInterruptCallback && !this.isAiSpeaking && normalized.length > 2) {
            this.onUserInterruptCallback();
          }

          // Live interim transcript update
          if (this.onTranscriptUpdateCallback) {
            this.onTranscriptUpdateCallback(normalized, Boolean(this.currentSessionFinal));
          }

          // Reset speech-end silence timer: patient is actively speaking
          this.resetSilenceTimer();
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.isListeningActive = false;
          this.permissionState = 'denied';
          if (this.onErrorCallback) {
            this.onErrorCallback('Microphone permission required hai. Please microphone access allow karein.');
          }
          if (this.onListeningStateCallback) this.onListeningStateCallback(false);
        } else if (event.error === 'no-speech') {
          // Normal background pause - handled gracefully by silence detection
        } else if (event.error === 'network') {
          console.warn('Network issue in browser speech recognition. Continuing audio capture...');
        }
      };
    }
  }

  /**
   * Resets and initiates speech-end silence detection
   * Waits for 1.5 - 2.0 seconds of uninterrupted silence before completing turn
   */
  private resetSilenceTimer() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    // Only count silence once the patient has actually spoken words
    if (!this.hasSpokenInTurn || this.isTurnFinalizing || this.isAiSpeaking) {
      return;
    }

    this.silenceTimer = setTimeout(() => {
      // Check if patient made sound or spoke recently
      const elapsedSinceVoice = Date.now() - this.lastVoiceDetectedTimestamp;
      if (elapsedSinceVoice < 1000) {
        // Patient made sound within the last second; extend by 800ms to avoid cutting off
        this.resetSilenceTimer();
        return;
      }
      this.triggerTurnComplete();
    }, this.silenceThresholdMs);
  }

  private startMediaRecorder() {
    if (!this.mediaStream) return;
    try {
      this.stopMediaRecorder();
      this.recordedChunks = [];

      const candidateTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/aac',
      ];
      this.recorderMimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        for (const mime of candidateTypes) {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime)) {
            this.recorderMimeType = mime;
            break;
          }
        }
      }

      this.mediaRecorder = new MediaRecorder(
        this.mediaStream,
        this.recorderMimeType ? { mimeType: this.recorderMimeType } : undefined
      );

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(200); // 200ms audio chunk slices
    } catch (err) {
      console.warn('MediaRecorder start notice:', err);
    }
  }

  private stopMediaRecorder(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        if (this.recordedChunks.length > 0) {
          resolve(new Blob(this.recordedChunks, { type: this.recorderMimeType || 'audio/webm' }));
        } else {
          resolve(null);
        }
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: this.recorderMimeType || 'audio/webm' });
        resolve(audioBlob);
      };

      try {
        this.mediaRecorder.stop();
      } catch {
        resolve(null);
      }
    });
  }

  /**
   * Manually or automatically finishes the user's speaking turn and submits text
   */
  public async triggerTurnComplete() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.isTurnFinalizing) return;
    this.isTurnFinalizing = true;

    // Collect all final & interim speech into a complete sentence
    const fullSpoken = [...this.confirmedSegments, this.currentSessionFinal, this.currentSessionInterim]
      .filter(Boolean)
      .join(' ')
      .trim();

    // Stop recognition
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }

    // Stop audio recorder and get raw audio blob for server STT
    const audioBlob = await this.stopMediaRecorder();

    const textToDeliver = normalizeSpokenMedicalText(fullSpoken);

    // Reset turn buffers for next turn
    this.confirmedSegments = [];
    this.currentSessionFinal = '';
    this.currentSessionInterim = '';
    this.hasSpokenInTurn = false;
    this.isTurnFinalizing = false;

    if (this.onTurnCompleteCallback) {
      this.onTurnCompleteCallback(textToDeliver, audioBlob || undefined);
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.activeLanguage = lang;
    const config = getLanguageConfig(lang);
    const recognitionLocale = config.speechRecognitionLocale || config.locale || 'hi-IN';
    if (this.recognition) {
      this.recognition.lang = recognitionLocale;
    }
  }

  public setSilenceThreshold(ms: number) {
    // Configurable silence delay (1.5s - 3.5s)
    this.silenceThresholdMs = Math.max(1500, Math.min(3500, ms));
  }

  /**
   * Flexible startListening supporting both options object and positional arguments
   */
  public startListening(
    callbacksOrInterim:
      | {
          onTranscriptUpdate: (transcript: string, isFinal: boolean) => void;
          onTurnComplete: (finalText: string, audioBlob?: Blob) => void;
          onListeningState?: (isListening: boolean) => void;
          onError?: (error: string) => void;
          onUserInterrupt?: () => void;
        }
      | ((interim: string) => void),
    argTurnComplete?: (finalText: string, audioBlob?: Blob) => void,
    argError?: (error: string) => void
  ) {
    if (typeof callbacksOrInterim === 'function') {
      this.onTranscriptUpdateCallback = (t) => callbacksOrInterim(t);
      this.onTurnCompleteCallback = argTurnComplete || null;
      this.onErrorCallback = argError || null;
      this.onListeningStateCallback = null;
      this.onUserInterruptCallback = null;
    } else {
      this.onTranscriptUpdateCallback = callbacksOrInterim.onTranscriptUpdate;
      this.onTurnCompleteCallback = callbacksOrInterim.onTurnComplete;
      this.onListeningStateCallback = callbacksOrInterim.onListeningState || null;
      this.onErrorCallback = callbacksOrInterim.onError || null;
      this.onUserInterruptCallback = callbacksOrInterim.onUserInterrupt || null;
    }

    this.isListeningActive = true;
    this.isAiSpeaking = false;
    this.isTurnFinalizing = false;
    this.hasSpokenInTurn = false;
    this.confirmedSegments = [];
    this.currentSessionFinal = '';
    this.currentSessionInterim = '';

    const config = getLanguageConfig(this.activeLanguage);
    const recognitionLocale = config.speechRecognitionLocale || config.locale || 'hi-IN';

    // Resume Audio Context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }

    // Start background audio recorder for high-accuracy server STT
    this.startMediaRecorder();

    if (this.recognition) {
      this.recognition.lang = recognitionLocale;
      try {
        this.recognition.start();
      } catch {
        // Already active or transitioning
      }
    } else {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition is not supported in this browser. You can type your response below.');
      }
    }
  }

  public stopListening() {
    this.isListeningActive = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.stopMediaRecorder();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    if (this.onListeningStateCallback) this.onListeningStateCallback(false);
  }

  public cleanup() {
    activeSpeechManagers.delete(this);
    this.stopListening();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}

/**
 * Server-Side Speech-to-Text Transcriber (Whisper / Gemini)
 * Converts patient audio blob to text via backend API
 */
export async function transcribeAudioOnServer(
  audioBlob: Blob,
  language: LanguageCode = 'hi'
): Promise<{ success: boolean; transcript: string; error?: string }> {
  try {
    if (!audioBlob || audioBlob.size < 600) {
      return { success: false, transcript: '', error: 'Audio too short' };
    }

    // Convert blob to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    if (!base64Data) {
      return { success: false, transcript: '', error: 'Failed to encode audio' };
    }

    const response = await fetch('/api/clinical/transcribe-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBase64: base64Data,
        mimeType: audioBlob.type || 'audio/webm',
        language,
      }),
    });

    if (!response.ok) {
      return { success: false, transcript: '', error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return {
      success: Boolean(data.success && data.transcript),
      transcript: data.transcript || '',
      error: data.error,
    };
  } catch (err: any) {
    console.warn('[STT] Server audio transcription error:', err?.message || err);
    return { success: false, transcript: '', error: err?.message || 'STT failure' };
  }
}

// Split long text into natural breath groups / sentences for flawless SpeechSynthesis playback
function splitTextIntoSentences(text: string): string[] {
  if (!text) return [];
  // Split on Devanagari danda '।', periods '.', question marks '?', exclamation '!', or newlines
  const rawChunks = text.split(/([।\.\?\!\n]+)/g);
  const result: string[] = [];
  let buffer = '';

  for (let i = 0; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    if (!chunk) continue;
    buffer += chunk;
    if (/[।\.\?\!\n]/.test(chunk) || buffer.length > 90) {
      const trimmed = buffer.trim();
      if (trimmed && /[\p{L}\p{N}]/u.test(trimmed)) {
        result.push(trimmed);
      }
      buffer = '';
    }
  }
  if (buffer.trim() && /[\p{L}\p{N}]/u.test(buffer.trim())) {
    result.push(buffer.trim());
  }

  return result.length > 0 ? result : [text.trim()];
}

/**
 * Speech Synthesis (Text-To-Speech) with language-aware voice selection & chunked sequential speaking
 * Ensures full voice speaking support across all 13 supported Indian languages.
 */
// Active SpeechSynthesis cancel function to ensure immediate cancellation on logout
let globalSpeechCancelFn: (() => void) | null = null;

export function speakTextAloud(
  text: string,
  lang: LanguageCode = 'en',
  rate: number = 0.88,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  // Cancel any prior active utterance loop
  if (globalSpeechCancelFn) {
    globalSpeechCancelFn();
    globalSpeechCancelFn = null;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text || !text.trim()) {
    if (onStart) onStart();
    const timeout = setTimeout(() => {
      if (onEnd) onEnd();
    }, 800);
    const cancelTimeout = () => clearTimeout(timeout);
    globalSpeechCancelFn = cancelTimeout;
    return cancelTimeout;
  }

  // Ensure fresh voice catalog
  updateCachedVoices();

  // Cancel any prior speech
  try {
    window.speechSynthesis.cancel();
  } catch {}

  const langConfig = getLanguageConfig(lang);
  const targetLocale = langConfig.speechVoiceLang || langConfig.speechSynthesisLocale || langConfig.locale || 'en-IN';
  const { voice, langCode } = findBestVoiceForLanguage(lang);

  const sentences = splitTextIntoSentences(text);
  let isCancelled = false;
  let currentIndex = 0;
  let hasTriggeredStart = false;

  // Keep-alive timer to prevent Chrome from freezing TTS after 15 seconds
  const keepAliveInterval = setInterval(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 2500);

  const cleanupTTS = () => {
    clearInterval(keepAliveInterval);
  };

  const speakNextChunk = () => {
    if (isCancelled || currentIndex >= sentences.length) {
      cleanupTTS();
      if (globalSpeechCancelFn === cancelUtterance) {
        globalSpeechCancelFn = null;
      }
      if (!isCancelled && onEnd) onEnd();
      return;
    }

    const chunkText = sentences[currentIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = langCode || targetLocale;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (!hasTriggeredStart) {
        hasTriggeredStart = true;
        if (onStart) onStart();
      }
    };

    utterance.onend = () => {
      currentIndex++;
      speakNextChunk();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis chunk notice:', e);
      currentIndex++;
      speakNextChunk();
    };

    try {
      window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      currentIndex++;
      speakNextChunk();
    }
  };

  // Small delay after cancel() prevents browser race conditions where new utterances get discarded
  const startTimeout = setTimeout(() => {
    if (!isCancelled) {
      speakNextChunk();
    }
  }, 40);

  // Generous safety fallback in case browser speech engine hangs
  const maxSafetyTimeout = setTimeout(() => {
    if (!isCancelled && currentIndex < sentences.length) {
      console.warn('TTS safety timeout reached');
      cleanupTTS();
      if (globalSpeechCancelFn === cancelUtterance) {
        globalSpeechCancelFn = null;
      }
      if (onEnd) onEnd();
    }
  }, Math.max(15000, sentences.length * 6000));

  const cancelUtterance = () => {
    isCancelled = true;
    clearTimeout(startTimeout);
    clearTimeout(maxSafetyTimeout);
    cleanupTTS();
    try {
      window.speechSynthesis.cancel();
    } catch {}
    if (globalSpeechCancelFn === cancelUtterance) {
      globalSpeechCancelFn = null;
    }
  };

  globalSpeechCancelFn = cancelUtterance;
  return cancelUtterance;
}

export function stopSpeaking() {
  if (globalSpeechCancelFn) {
    globalSpeechCancelFn();
    globalSpeechCancelFn = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Terminate ALL active speech instances, microphones, AudioContexts, and TTS immediately.
 * Call this on logout or session reset to prevent audio or recognition leaks across accounts.
 */
export function terminateAllSpeechEngines() {
  stopSpeaking();
  activeSpeechManagers.forEach((mgr) => {
    try {
      mgr.cleanup();
    } catch (e) {
      console.warn('Error during speech manager cleanup on logout:', e);
    }
  });
  activeSpeechManagers.clear();
}

// Media Recorder for Voice Consent
export class AudioConsentRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  public async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  public async stopRecording(): Promise<{ audioBlob: Blob; audioUrl: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder not initialized'));
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve({ audioBlob, audioUrl });
      };

      this.mediaRecorder.stop();
      // Stop all audio tracks to release microphone
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }
}

