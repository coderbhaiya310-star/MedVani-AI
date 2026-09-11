import React, { useState, useEffect, useRef } from 'react';
import {
  CaseTakingSession,
  ChatMessage,
  LiveExtractionState,
  StructuredInterviewState,
  LanguageCode,
} from '../types';
import { SUPPORTED_LANGUAGES, getLanguageConfig, getLocalizedWelcomeGreeting } from '../i18n/languages';
import {
  ClinicalSpeechManager,
  speakTextAloud,
  stopSpeaking,
  terminateAllSpeechEngines,
  transcribeAudioOnServer,
} from '../utils/speechUtils';
import {
  sendClinicalChatMessage,
  generateStructuredClinicalSummary,
} from '../services/geminiService';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  AlertTriangle,
  FileUp,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Sliders,
  Send,
  Globe,
  Stethoscope,
  Activity,
  Pause,
  Zap,
  MessageSquare,
  Radio,
  Pill,
  Flame,
  AlertCircle,
  Clock,
  HeartPulse,
  RefreshCw,
  Play,
  ShieldCheck,
  FileText,
  UserCheck,
  Camera,
} from 'lucide-react';
import { CameraDocumentScanner } from './CameraDocumentScanner';
import { MedicalDocument } from '../types';

interface VoiceIntakeViewProps {
  session: CaseTakingSession;
  onUpdateSession: (updatedSession: Partial<CaseTakingSession>) => void;
  onOpenDocuments: () => void;
  onOpenRegistration: () => void;
  onViewDoctorDashboard: () => void;
}

type VoiceEngineState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR' | 'COMPLETED';

export const VoiceIntakeView: React.FC<VoiceIntakeViewProps> = ({
  session,
  onUpdateSession,
  onOpenDocuments,
  onOpenRegistration,
  onViewDoctorDashboard,
}) => {
  const [speechManager] = useState<ClinicalSpeechManager>(() => new ClinicalSpeechManager());
  const [voiceState, setVoiceState] = useState<VoiceEngineState>('IDLE');
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [liveInterimText, setLiveInterimText] = useState('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [textInputFallback, setTextInputFallback] = useState('');
  const [showManualTextInput, setShowManualTextInput] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.84); // Empathetic, elderly-friendly cadence
  const [silenceDelay, setSilenceDelay] = useState<number>(1800); // 1.8s natural silence window
  const [speechErrorMessage, setSpeechErrorMessage] = useState<string | null>(null);
  const [urgentRedFlagTriggered, setUrgentRedFlagTriggered] = useState(false);
  const [fontSizeLarge, setFontSizeLarge] = useState(true);
  const [showLiveSummaryPanel, setShowLiveSummaryPanel] = useState(true);
  const [hasResumableInterview, setHasResumableInterview] = useState(false);
  const [resumableState, setResumableState] = useState<StructuredInterviewState | null>(null);
  const [showCameraScanner, setShowCameraScanner] = useState(false);

  const isProcessingRef = useRef(false);
  const lastProcessedRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const failedPatientTextRef = useRef<string>('');
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Structured Real-time Nurse Extraction State
  const [liveExtraction, setLiveExtraction] = useState<LiveExtractionState>(() => {
    return (
      session.liveExtraction || {
        chiefComplaint: session.summary?.chiefComplaint || '',
        symptoms: session.summary?.historyOfPresentIllness?.associatedSymptoms || [],
        medicationsMentioned: session.summary?.medicationReconciliation?.map((m) => m.medicationName) || [],
        conflictsDetected: session.summary?.conflicts?.map((c) => c.title) || [],
        redFlags: session.summary?.redFlagsOrUrgentAlerts || [],
        recapSummary: session.summary?.historyOfPresentIllness?.chronologicalNarrative || '',
      }
    );
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isVoiceSessionActiveRef = useRef(isVoiceSessionActive);
  isVoiceSessionActiveRef.current = isVoiceSessionActive;

  const { openLanguageSelector, language, setLanguage, t } = useLanguage();
  const activeLangCode = session.activeLanguage || language;
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLangCode) ||
    SUPPORTED_LANGUAGES[0];

  const handleSwitchLanguageDirectly = (newLang: LanguageCode) => {
    stopSpeaking();
    setLanguage(newLang);
    speechManager.setLanguage(newLang);

    const shouldUpdateWelcome =
      session.messages.length === 1 &&
      (session.messages[0].id.startsWith('msg-welcome') || session.messages[0].id.startsWith('msg-init'));

    const updatedMessages = shouldUpdateWelcome
      ? [
          {
            ...session.messages[0],
            text: getLocalizedWelcomeGreeting(newLang, session.patient.fullName),
          },
        ]
      : session.messages;

    onUpdateSession({
      activeLanguage: newLang,
      messages: updatedMessages,
      patient: {
        ...session.patient,
        preferredLanguage: newLang,
      },
    });
  };

  // Check database for existing interview progress on mount or patient switch
  useEffect(() => {
    const loadSavedInterview = async () => {
      if (!session.patient?.id) return;
      const saved = await dbService.getInterviewState(session.patient.id);
      if (saved && saved.conversationTranscript && saved.conversationTranscript.length > 0 && !saved.interviewCompleted) {
        setHasResumableInterview(true);
        setResumableState(saved);
      } else {
        setHasResumableInterview(false);
        setResumableState(null);
      }
    };
    loadSavedInterview();
  }, [session.patient?.id]);

  // Scroll to bottom on transcript updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, liveInterimText]);

  // Sync speech manager with language & silence duration
  useEffect(() => {
    speechManager.setLanguage(session.activeLanguage);
    speechManager.setSilenceThreshold(silenceDelay);
  }, [session.activeLanguage, silenceDelay, speechManager]);

  // Connect speech audio visualizer & cleanup
  useEffect(() => {
    speechManager.onVoiceLevel((level) => {
      setAudioLevel(level);
    });

    const unsubLogout = authService.onLogout(() => {
      setIsVoiceSessionActive(false);
      setVoiceState('IDLE');
      stopSpeaking();
      terminateAllSpeechEngines();
      speechManager.stopListening();
      speechManager.cleanup();
    });

    return () => {
      unsubLogout();
      stopSpeaking();
      terminateAllSpeechEngines();
      speechManager.stopListening();
      speechManager.cleanup();
    };
  }, [speechManager]);

  // Handle Natural Patient Interruption (Stops AI speech instantly & switches to listening)
  const handleUserInterruption = () => {
    if (voiceState === 'AI_SPEAKING') {
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        } catch {}
      }
      stopSpeaking();
      speechManager.setAiSpeaking(false);
      setVoiceState('LISTENING');
      if (isVoiceSessionActiveRef.current) {
        startListeningHandsFree();
      }
    }
  };

  // Start continuous hands-free listening
  const startListeningHandsFree = () => {
    if (isProcessingRef.current) return;
    setVoiceState('LISTENING');
    speechManager.setAiSpeaking(false);
    speechManager.startListening({
      onTranscriptUpdate: (transcript, isFinal) => {
        setLiveInterimText(transcript);
        if (speechErrorMessage) {
          setSpeechErrorMessage(null);
        }
      },
      onTurnComplete: async (finalText: string, audioBlob?: Blob) => {
        if (isProcessingRef.current) return;
        speechManager.stopListening();
        setVoiceState('PROCESSING');
        setLiveInterimText('');
        setSpeechErrorMessage(null);

        let resolvedTranscript = (finalText || '').trim();

        // 1. High-accuracy server-side STT (OpenAI Whisper / Gemini Multimodal)
        if (audioBlob && audioBlob.size > 800) {
          try {
            const sttResult = await transcribeAudioOnServer(audioBlob, session.activeLanguage);
            if (sttResult.success && sttResult.transcript && sttResult.transcript.trim()) {
              resolvedTranscript = sttResult.transcript.trim();
            }
          } catch (sttErr) {
            console.warn('[STT] Server transcription notice:', sttErr);
          }
        }

        // 2. Handle empty/no speech detected error
        if (!resolvedTranscript) {
          const noSpeechMsg =
            session.activeLanguage === 'hi'
              ? 'मैं आपकी आवाज़ नहीं सुन पाया। कृपया दोबारा बोलें।'
              : 'I could not hear your voice. Please speak again.';
          setSpeechErrorMessage(noSpeechMsg);
          setVoiceState('ERROR');
          return;
        }

        // 3. Handle unclear/single-character noise
        if (resolvedTranscript.length < 2) {
          const unclearMsg =
            session.activeLanguage === 'hi'
              ? 'मुझे आपकी बात स्पष्ट रूप से समझ नहीं आई। कृपया दोबारा बताएं।'
              : 'I could not understand clearly. Please speak again.';
          setSpeechErrorMessage(unclearMsg);
          setVoiceState('ERROR');
          return;
        }

        // 4. Send single, complete, finalized answer to ChatGPT
        processPatientResponse(resolvedTranscript);
      },
      onListeningState: (isListening) => {
        if (isListening && !isProcessingRef.current && voiceState !== 'AI_SPEAKING' && voiceState !== 'ERROR') {
          setVoiceState('LISTENING');
        }
      },
      onError: (err) => {
        console.warn('Speech recognition notice:', err);
        const lower = (err || '').toLowerCase();
        if (lower.includes('denied') || lower.includes('not-allowed') || err.includes('Microphone permission')) {
          const permMsg = 'Microphone permission required है। कृपया माइक्रोफोन एक्सेस की अनुमति दें।';
          setMicPermissionError(permMsg);
          setSpeechErrorMessage(permMsg);
          setVoiceState('ERROR');
        }
      },
      onUserInterrupt: handleUserInterruption,
    });
  };

  // Speak AI Nurse response aloud (with OpenAI TTS + Web Speech API fallback)
  const speakAiResponse = async (textToSpeak: string, targetLang?: string) => {
    setVoiceState('AI_SPEAKING');
    speechManager.setAiSpeaking(true);
    speechManager.stopListening();

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch {}
    }

    const onPlaybackDone = () => {
      speechManager.setAiSpeaking(false);
      currentAudioRef.current = null;
      if (isVoiceSessionActiveRef.current) {
        startListeningHandsFree();
      } else {
        setVoiceState('IDLE');
      }
    };

    // 1. Try server-side OpenAI TTS
    try {
      const res = await fetch('/api/clinical/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });
      if (res.ok && res.status === 200) {
        const audioBlob = await res.blob();
        if (audioBlob.size > 500) {
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            onPlaybackDone();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            speakViaWebSpeech(textToSpeak, onPlaybackDone, targetLang);
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Proceed to client Web Speech API fallback
    }

    speakViaWebSpeech(textToSpeak, onPlaybackDone, targetLang);
  };

  const speakViaWebSpeech = (textToSpeak: string, onDone: () => void, targetLang?: string) => {
    speakTextAloud(
      textToSpeak,
      (targetLang || session.activeLanguage) as any,
      speechSpeed,
      () => {
        setVoiceState('AI_SPEAKING');
        speechManager.setAiSpeaking(true);
      },
      onDone
    );
  };

  // Process Patient's response through Clinical Chat API (ChatGPT Reasoning Engine)
  const processPatientResponse = async (patientSpokenText: string) => {
    const cleanText = patientSpokenText.trim();
    if (!cleanText) return;

    // Deduplicate identical speech triggers within 2500ms
    const now = Date.now();
    if (
      cleanText.toLowerCase() === lastProcessedRef.current.text.toLowerCase() &&
      now - lastProcessedRef.current.time < 2500
    ) {
      console.log('[Voice Intake] Duplicate speech trigger ignored:', cleanText);
      return;
    }

    if (isProcessingRef.current) {
      console.log('[Voice Intake] Previous turn still processing. Concurrent input ignored.');
      return;
    }

    // Cancel any previous in-flight AI call
    if (activeAbortControllerRef.current) {
      try {
        activeAbortControllerRef.current.abort();
      } catch {}
      activeAbortControllerRef.current = null;
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;
    lastProcessedRef.current = { text: cleanText, time: now };
    isProcessingRef.current = true;
    speechManager.stopListening();
    setLiveInterimText('');
    setVoiceState('PROCESSING');
    setSpeechErrorMessage(null);

    const patientMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicalTag: 'symptom_detail',
    };

    const updatedMessages = [...session.messages, patientMsg];
    onUpdateSession({ messages: updatedMessages });

    const activeSessionId = authService.getCurrentSessionId();

    try {
      // Call Nurse Chat Engine (ChatGPT as primary clinical reasoning engine)
      const aiResponse = await sendClinicalChatMessage({
        messages: updatedMessages,
        patient: session.patient,
        documents: session.documents,
        activeLanguage: session.activeLanguage,
        conversationPhase: session.conversationPhase,
        liveExtraction: session.liveExtraction || liveExtraction,
        signal: abortController.signal,
      });

      // Strict verification: If user logged out or switched account during in-flight call, discard result
      if (!authService.isSessionActive(activeSessionId)) {
        return;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiResponse.replyText,
        translatedText: aiResponse.englishTranslation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinicalTag: aiResponse.clinicalTag || 'symptom_detail',
      };

      const finalMessages = [...updatedMessages, aiMsg];

      // Update and merge live clinical extraction
      let newLiveExt = liveExtraction;
      if (aiResponse.liveExtraction) {
        newLiveExt = {
          ...liveExtraction,
          ...aiResponse.liveExtraction,
          chiefComplaint: aiResponse.liveExtraction.chiefComplaint || liveExtraction.chiefComplaint || cleanText,
          symptoms: Array.from(new Set([...(liveExtraction.symptoms || []), ...(aiResponse.liveExtraction.symptoms || [])])),
          medicationsMentioned: Array.from(
            new Set([...(liveExtraction.medicationsMentioned || []), ...(aiResponse.liveExtraction.medicationsMentioned || [])])
          ),
          conflictsDetected: Array.from(
            new Set([...(liveExtraction.conflictsDetected || []), ...(aiResponse.liveExtraction.conflictsDetected || [])])
          ),
          redFlags: Array.from(new Set([...(liveExtraction.redFlags || []), ...(aiResponse.liveExtraction.redFlags || [])])),
          recapSummary: aiResponse.liveExtraction.recapSummary || liveExtraction.recapSummary,
        };
        setLiveExtraction(newLiveExt);
      }

      const resolvedLang = (aiResponse.detected_language_code as any) || session.activeLanguage;

      onUpdateSession({
        activeLanguage: resolvedLang,
        messages: finalMessages,
        conversationPhase: (aiResponse.nextPhase as any) || session.conversationPhase,
        liveExtraction: newLiveExt,
      });

      failedPatientTextRef.current = '';

      // Incremental Database Save (Ensures zero loss of data on refresh)
      if (session.patient?.id) {
        await dbService.saveInterviewState(session.patient.id, {
          patientId: session.patient.id,
          chiefComplaint: newLiveExt.chiefComplaint || '',
          symptoms: newLiveExt.symptoms || [],
          associatedSymptoms: aiResponse.liveExtraction?.associatedSymptoms || [],
          location: aiResponse.liveExtraction?.location || '',
          duration: aiResponse.liveExtraction?.duration || '',
          severity: aiResponse.liveExtraction?.severity || '',
          medicationHistory: newLiveExt.medicationsMentioned || [],
          redFlags: newLiveExt.redFlags || [],
          stage: aiResponse.nextPhase || 'symptom_exploration',
          conversationTranscript: finalMessages,
          interviewCompleted: aiResponse.nextPhase === 'completed' || aiResponse.nextPhase === 'wrap_up',
        });
      }

      if (aiResponse.isUrgentRedFlag || (newLiveExt.redFlags && newLiveExt.redFlags.length > 0)) {
        setUrgentRedFlagTriggered(true);
      }

      // Check if document scanner should be opened automatically
      const hasDocumentKeywords = /\b(scan|scanner|kheechna|kheecho|photo|dastavej|parchi|prescription|report|paper|upload|document|dikhaana|dikhao|le lijiye|padh lijiye)\b/i.test(cleanText);
      if (aiResponse.isDocumentScanIntent || hasDocumentKeywords) {
        setShowCameraScanner(true);
      }

      // If active, speak AI response in matching language and continue loop
      if (isVoiceSessionActiveRef.current) {
        speakAiResponse(aiResponse.replyText, resolvedLang);
      } else {
        setVoiceState('IDLE');
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return;
      }
      console.error('Clinical response error:', error);
      setVoiceState('ERROR');
      failedPatientTextRef.current = cleanText;
      const displayError = error?.message || 'ChatGPT reasoning engine error. Please verify your OpenAI API key or tap retry.';
      setSpeechErrorMessage(displayError);
    } finally {
      isProcessingRef.current = false;
      activeAbortControllerRef.current = null;
    }
  };

  // Handle Document Successfully Scanned by Camera Scanner
  const handleDocumentCaptured = async (scannedDoc: MedicalDocument) => {
    // 1. Ensure patient ID is strictly bound
    const docWithPatient: MedicalDocument = {
      ...scannedDoc,
      patientId: session.patient?.id || scannedDoc.patientId,
    };

    // 2. Add to session documents list
    const updatedDocuments = [...session.documents, docWithPatient];
    
    // 3. Extract newly found medications and diagnoses from OCR
    const newMeds = docWithPatient.extractedData?.medications?.map((m) => m.name) || [];
    const newDiagnoses = docWithPatient.extractedData?.diagnoses || [];

    const updatedLiveExt: LiveExtractionState = {
      ...liveExtraction,
      medicationsMentioned: Array.from(new Set([...(liveExtraction.medicationsMentioned || []), ...newMeds])),
      symptoms: Array.from(new Set([...(liveExtraction.symptoms || []), ...newDiagnoses])),
    };

    // 4. Create localized conversational feedback message from Nurse Ananya
    const localizedConfirmations: Record<string, string> = {
      en: `I have scanned and read your ${docWithPatient.title || 'document'}. The medications (${newMeds.slice(0, 3).join(', ') || 'prescribed items'}) have been added to your file. Are you taking these regularly?`,
      hi: `मैंने आपकी ${docWithPatient.title || 'दवाइयों की पर्ची'} को पढ़ लिया है। इसमें लिखी दवाइयाँ आपकी मेडिकल फ़ाइल में जोड़ दी गई हैं। क्या आप ये दवाइयाँ नियमित रूप से ले रहे हैं?`,
      bn: `আমি আপনার ${docWithPatient.title || 'প্রেসক্রিপশন'} সফলভাবে পড়ে ফাইলে যুক্ত করেছি। আপনি কি এই ওষুধগুলো নিয়মিত খাচ্ছেন?`,
      te: `మీ ${docWithPatient.title || 'మెడికల్ రిపోర్టు'}ను నేను చదివి రికార్డు చేశాను. ఈ మందులను మీరు రోజూ వాడుతున్నారా?`,
      ta: `உங்கள் ${docWithPatient.title || 'மருத்துவ ஆவணத்தை'} நான் வெற்றிகரமாகப் படித்துப் பதிவு செய்துள்ளேன். இந்த மருந்துகளைத் தவறாமல் சாப்பிடுகிறீர்களா?`,
      mr: `मी तुमची ${docWithPatient.title || 'प्रिस्क्रिप्शन'} वाचली आहे आणि औषधे फाईलमध्ये जोडली आहेत. तुम्ही ही औषधे नियमित घेत आहात का?`,
      gu: `મેં તમારી ${docWithPatient.title || 'દવાની ચબરખી'} વાંચી લીધી છે અને ફાઇલમાં ઉમેરી દીધી છે. શું તમે આ દવાઓ નિયમિત લો છો?`,
      kn: `ನಿಮ್ಮ ${docWithPatient.title || 'ದಾಖಲೆಯನ್ನು'} ನಾನು ಪರಿಶೀಲಿಸಿ ಫೈಲ್‌ಗೆ ಸೇರಿಸಿದ್ದೇನೆ. ನೀವು ಈ ಔಷಧಿಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?`,
      ml: `നിങ്ങളുടെ ${docWithPatient.title || 'മെഡിക്കൽ രേഖ'} ഞാൻ പരിശോധിച്ച് ഫയലിൽ ചേർത്തു. ഈ മരുന്നുകൾ കൃത്യമായി കഴിക്കുന്നുണ്ടോ?`,
      pa: `ਮੈਂ ਤੁਹਾਡੀ ${docWithPatient.title || 'ਪਰਚੀ'} ਪੜ੍ਹ ਕੇ ਫਾਈਲ ਵਿੱਚ ਜੋੜ ਦਿੱਤੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਦਵਾਈਆਂ ਰੋਜ਼ਾਨਾ ਲੈਂਦੇ ਹੋ?`,
      or: `ମୁଁ ଆପଣଙ୍କ ${docWithPatient.title || 'ମେଡିକାଲ ରେକର୍ଡ'} ପଢ଼ି ରେକର୍ଡ କରିଛି। ଆପଣ ଏହି ଔଷଧ ନିୟମିତ ନେଉଛନ୍ତି କି?`,
      as: `মই আপোনাৰ ${docWithPatient.title || 'চিকিৎসা নথিখন'} পঢ়ি লৈছোঁ। আপুনি এই ঔষধসমূহ নিয়মীয়াকৈ খাইছেনে?`,
      ur: `میں نے آپ کی ${docWithPatient.title || 'میڈیکل رپورٹ'} پڑھ لی ہے۔ کیا آپ یہ دوائیں باقاعدگی سے لیتے ہیں؟`,
    };

    const confirmText = localizedConfirmations[session.activeLanguage] || localizedConfirmations['en'];

    const nurseMsg: ChatMessage = {
      id: 'msg-doc-' + Date.now(),
      sender: 'ai',
      text: confirmText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicalTag: 'medication',
    };

    const newMessages = [...session.messages, nurseMsg];

    setLiveExtraction(updatedLiveExt);
    onUpdateSession({
      documents: updatedDocuments,
      messages: newMessages,
      liveExtraction: updatedLiveExt,
      conversationPhase: 'medication_history',
    });

    // 5. Persist to DB and add timeline event
    try {
      await dbService.saveDocument(docWithPatient);
      if (session.patient?.id) {
        await dbService.createTimelineEvent({
          patientId: session.patient.id,
          type: 'document',
          title: `Scanned: ${docWithPatient.title || 'Prescription / Lab Record'}`,
          subtitle: `${docWithPatient.pageCount || 1} Page(s) • ${docWithPatient.facilityOrDoctor || 'Clinic Document'}`,
          details: docWithPatient.extractedText?.slice(0, 180) || 'Multi-page OCR analysis complete.',
          badgeText: 'Camera OCR Processed',
          badgeColor: 'emerald',
        });
      }
    } catch (e) {
      console.error('Failed to save scanned document:', e);
    }

    // 6. Close scanner and continue hands-free voice loop
    setShowCameraScanner(false);
    if (isVoiceSessionActiveRef.current) {
      speakAiResponse(confirmText);
    }
  };

  // Start Voice Interview (Hands-Free)
  const handleStartVoiceSession = async () => {
    setMicPermissionError(null);
    const permResult = await speechManager.requestPermission();
    if (!permResult.granted && permResult.error) {
      setMicPermissionError(permResult.error);
    }

    setIsVoiceSessionActive(true);
    setHasResumableInterview(false);
    onUpdateSession({ isVoiceActive: true });

    // Speak initial greeting if no messages or resume latest question
    if (session.messages.length === 0) {
      const initialGreeting = getLocalizedWelcomeGreeting(session.activeLanguage, session.patient.fullName);

      const greetingMsg: ChatMessage = {
        id: 'msg-init-' + Date.now(),
        sender: 'ai',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinicalTag: 'chief_complaint',
      };
      onUpdateSession({ messages: [greetingMsg], isVoiceActive: true });
      speakAiResponse(initialGreeting);
    } else {
      const latestAi = [...session.messages].reverse().find((m) => m.sender === 'ai');
      if (latestAi) {
        speakAiResponse(latestAi.text);
      } else {
        startListeningHandsFree();
      }
    }
  };

  // Resume saved interview from Database
  const handleResumeSavedInterview = () => {
    if (!resumableState) return;
    setHasResumableInterview(false);
    setIsVoiceSessionActive(true);
    onUpdateSession({
      messages: resumableState.conversationTranscript || [],
      conversationPhase: (resumableState.stage as any) || 'symptom_exploration',
      isVoiceActive: true,
      liveExtraction: {
        chiefComplaint: resumableState.chiefComplaint || '',
        symptoms: resumableState.symptoms || [],
        medicationsMentioned: resumableState.medicationHistory || [],
        conflictsDetected: [],
        redFlags: resumableState.redFlags || [],
        recapSummary: resumableState.chiefComplaint || '',
      },
    });

    const latestAi = [...(resumableState.conversationTranscript || [])].reverse().find((m) => m.sender === 'ai');
    if (latestAi) {
      speakAiResponse(latestAi.text);
    } else {
      startListeningHandsFree();
    }
  };

  // Pause Voice Session
  const handlePauseVoiceSession = () => {
    setIsVoiceSessionActive(false);
    setVoiceState('IDLE');
    speechManager.stopListening();
    stopSpeaking();
    onUpdateSession({ isVoiceActive: false });
  };

  // Manual Text Submit Fallback
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputFallback.trim()) return;
    const text = textInputFallback;
    setTextInputFallback('');
    processPatientResponse(text);
  };

  // Finish Interview & Generate Doctor Summary
  const handleFinishAndGenerateSummary = async () => {
    handlePauseVoiceSession();
    setVoiceState('PROCESSING');
    const activeSessionId = authService.getCurrentSessionId();
    const abortSignal = authService.createAbortSignal();

    try {
      const generated = await generateStructuredClinicalSummary({
        messages: session.messages,
        patient: session.patient,
        documents: session.documents,
        liveExtraction: session.liveExtraction || liveExtraction,
        signal: abortSignal,
      });

      // Strict session lifecycle check
      if (!authService.isSessionActive(activeSessionId)) {
        return;
      }

      onUpdateSession({
        summary: generated,
        conversationPhase: 'completed',
      });

      // Save structured completion to database
      if (session.patient?.id) {
        await dbService.saveInterviewState(session.patient.id, {
          interviewCompleted: true,
          stage: 'completed',
          chiefComplaint: generated.chiefComplaint || liveExtraction.chiefComplaint,
          symptoms: generated.historyOfPresentIllness?.associatedSymptoms || liveExtraction.symptoms,
          medicationHistory: generated.medicationReconciliation?.map((m) => m.medicationName) || liveExtraction.medicationsMentioned,
          redFlags: generated.redFlagsOrUrgentAlerts || liveExtraction.redFlags,
        });

        // Update Patient status in queue
        await dbService.updatePatient(session.patient.id, {
          status: 'in_consultation',
          chiefComplaint: generated.chiefComplaint || liveExtraction.chiefComplaint,
        });

        // Permanently persist ConsultationRecord for patient
        const consultationRecordToSave = (generated as any).consultationRecord || {
          id: (generated as any).consultationId,
          patientId: session.patient.id,
          doctorId: 'doc-auto-intake',
          doctorName: 'Sister Ananya, RN (AI Clinical Intake)',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chiefComplaint: generated.chiefComplaint || 'Clinical Intake Consultation',
          clinicalHistory: generated.historyOfPresentIllness?.chronologicalNarrative || generated.aiExecutiveSummary || '',
          currentSymptoms: (generated.historyOfPresentIllness?.associatedSymptoms || []).join(', ') || generated.chiefComplaint || '',
          assessment: generated.formattedDoctorSummaryText || 'Intake completed.',
          status: 'draft',
        };
        await dbService.createConsultation(consultationRecordToSave);

        // Create Timeline event
        await dbService.createTimelineEvent({
          patientId: session.patient.id,
          type: 'consultation',
          title: 'AI Nurse Intake Completed (Sister Ananya)',
          subtitle: `Chief Complaint: ${generated.chiefComplaint || 'Clinical evaluation'}`,
          details: `Structured clinical interview completed with ${session.messages.length} conversational turns. Case file and medication reconciliation prepared for physician.`,
          badgeText: 'Intake Complete',
          badgeColor: 'emerald',
        });
      }

      setVoiceState('COMPLETED');
      onViewDoctorDashboard();
    } catch (e) {
      console.error('Failed to generate clinical summary:', e);
      setVoiceState('COMPLETED');
      onViewDoctorDashboard();
    }
  };

  // Quick 1-Click Nurse Simulation Scenarios (Tests full OPQRST & natural Hinglish pathways)
  const testPhrases = [
    { label: '🗣️ "Stomach pain since yesterday"', text: 'Mujhe kal se pet mein bohot dard ho raha hai aur ulti bhi aayi thi.' },
    { label: '🦵 "Knee pain for 3 weeks"', text: 'I have severe right knee pain for 3 weeks. It swells when I walk and I take painkillers.' },
    { label: '🫀 "Chest heaviness on stairs"', text: 'I feel heavy squeezing chest pressure and breathlessness whenever I walk or climb stairs.' },
    { label: '💊 "Stopped BP medicine"', text: 'I stopped my blood pressure tablet last month because my pressure was normal.' },
    { label: '✅ "Recap is accurate"', text: 'Haan doctor, aapne bilkul sahi samjha hai, yahi meri saari takleef hai.' },
  ];

  const phaseLabels: Record<string, string> = {
    greeting: '1. Nurse Greeting & Chief Complaint',
    chief_complaint: '1. Chief Complaint Exploration',
    symptom_exploration: '2. OPQRST Clinical Deep-Dive',
    medication_history: '3. Medications & Compliance Check',
    medical_history: '4. Past Medical History & Surgeries',
    confirmation: '5. Caring Verbal Recap',
    wrap_up: '6. Ready for Physician Review',
    completed: '7. Intake Completed',
  };

  const latestAiMessage = [...session.messages].reverse().find((m) => m.sender === 'ai');
  const latestPatientMessage = [...session.messages].reverse().find((m) => m.sender === 'patient');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Patient Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-base shadow-xs">
            {session.patient.fullName ? session.patient.fullName.charAt(0) : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base sm:text-lg">
                {session.patient.fullName || 'New Patient'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {session.patient.age} yrs • {session.patient.gender}
              </span>
              {session.patient.patientNumber && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {session.patient.patientNumber}
                </span>
              )}
              {session.patient.abhaId && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  ABHA: {session.patient.abhaId}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={openLanguageSelector}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold transition cursor-pointer"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>{currentLang.nativeName}</span>
                <span className="text-[11px] text-teal-600">({currentLang.englishName})</span>
                <span className="text-[10px] text-teal-700 bg-white/70 px-1.5 py-0.2 rounded border border-teal-200 ml-0.5">
                  Switch
                </span>
              </button>
              <span>•</span>
              <span className="text-slate-600 font-medium">Assistant: Sister Ananya (Clinical Nurse)</span>
              <span>•</span>
              <button
                onClick={onOpenRegistration}
                className="text-teal-600 hover:text-teal-700 font-medium underline cursor-pointer"
              >
                Patient Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Voice Camera Document Scanner */}
          <button
            id="camera-scan-doc-btn"
            onClick={() => setShowCameraScanner(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-300 shadow-xs transition-all cursor-pointer"
            title="Open elderly-friendly camera scanner"
          >
            <Camera className="w-4 h-4 text-teal-700 animate-pulse" />
            <span>Scan Prescription / Report</span>
          </button>

          {/* Live Extraction Toggle */}
          <button
            id="toggle-live-summary-btn"
            onClick={() => setShowLiveSummaryPanel(!showLiveSummaryPanel)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
              showLiveSummaryPanel
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>{showLiveSummaryPanel ? 'Live Case ON' : 'Show Live Case'}</span>
          </button>

          {/* Medical Records OCR */}
          <button
            id="open-documents-btn"
            onClick={onOpenDocuments}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <FileUp className="w-4 h-4 text-teal-600" />
            <span>Records ({session.documents.length})</span>
          </button>

          {/* Text Size */}
          <button
            onClick={() => setFontSizeLarge(!fontSizeLarge)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              fontSizeLarge ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle Text Size for High Readability"
          >
            <span className="text-sm">A</span>
            <span className="text-xs">+</span>
          </button>

          {/* Doctor Dashboard View */}
          <button
            onClick={onViewDoctorDashboard}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor View</span>
          </button>
        </div>
      </div>

      {/* 1-Click Spoken Language Switcher Bar */}
      <div className="bg-gradient-to-r from-teal-50/90 via-white to-blue-50/90 rounded-2xl p-3 sm:p-3.5 border border-teal-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
          <Globe className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Active Language / बातचीत की भाषा:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar text-xs">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = activeLangCode === l.code;
            return (
              <button
                key={l.code}
                type="button"
                id={`btn-quick-lang-${l.code}`}
                onClick={() => handleSwitchLanguageDirectly(l.code)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-500/40'
                    : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-slate-200/90 shadow-2xs'
                }`}
                title={`Switch speaking & listening language to ${l.name} (${l.nativeName})`}
              >
                <span>{l.nativeName}</span>
                <span className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                  ({l.code.toUpperCase()})
                </span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-teal-200" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={openLanguageSelector}
            className="px-3 py-1.5 rounded-xl font-bold bg-teal-100/70 hover:bg-teal-200 text-teal-900 border border-teal-300 transition-all shrink-0 text-xs cursor-pointer ml-1"
          >
            All 13 Languages ▾
          </button>
        </div>
      </div>

      {/* Resumable Session Alert Banner */}
      {hasResumableInterview && resumableState && (
        <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-teal-950 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-teal-900">Unfinished Interview Session Found</h2>
              <p className="text-xs text-teal-700">
                Found previous session with {resumableState.conversationTranscript.length} messages (Chief complaint:{' '}
                {resumableState.chiefComplaint || 'In progress'}). Would you like to resume where you left off?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResumeSavedInterview}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Resume Interview
            </button>
            <button
              onClick={() => {
                setHasResumableInterview(false);
                handleStartVoiceSession();
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Urgent Red Flag Alert Banner */}
      {urgentRedFlagTriggered && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-950 shadow-sm animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h2 className="font-bold text-sm text-rose-900">Clinical Triage Alert: Urgent Red Flag Flagged</h2>
            <p className="text-xs text-rose-800">
              The AI intake flagged potential critical symptoms (e.g. chest discomfort, orthopnea, fluid overload, severe pain).
              Please alert the duty physician immediately.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Voice Interaction Stage + Real-Time Live Case Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Voice Interface Stage */}
        <div className={`space-y-6 ${showLiveSummaryPanel ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}`}>
          {/* Phase Badge */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                Phase: {phaseLabels[session.conversationPhase] || 'Clinical Interview'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Voice-First • Automatic Turn-Taking • Multi-Dialect
            </span>
          </div>

          {/* ELDERLY-FRIENDLY VOICE INTERACTION STAGE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg relative overflow-hidden text-center space-y-7">
            <div className="absolute inset-0 bg-radial from-teal-50/50 via-transparent to-transparent pointer-events-none" />

            {/* Interaction Status Banner */}
            <div className="space-y-2 relative z-10">
              {voiceState === 'AI_SPEAKING' ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-300 text-teal-800 text-sm font-bold shadow-xs">
                  <Volume2 className="w-4 h-4 text-teal-600 animate-bounce" />
                  <span>{t('nurseSpeaking')}</span>
                </div>
              ) : voiceState === 'LISTENING' ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{currentLang.listeningPrompt || t('listening')}</span>
                </div>
              ) : voiceState === 'PROCESSING' ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-sm font-bold shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>{currentLang.processingPrompt || t('processing')}</span>
                </div>
              ) : isVoiceSessionActive ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold">
                  <Mic className="w-4 h-4 text-teal-600" />
                  <span>{t('handsFreeActive')}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-bold">
                  <Mic className="w-4 h-4 text-slate-500" />
                  <span>{t('tapToSpeak')}</span>
                </div>
              )}
            </div>

            {/* Central Giant Voice Control Action */}
            <div className="relative z-10 flex flex-col items-center justify-center py-2">
              {/* Speech Error Banner (No speech, unclear speech, or permission denied) */}
              {speechErrorMessage && (
                <div className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-amber-950 text-xs shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Voice Input Notice / आवाज़ सूचना</span>
                  </div>
                  <p className="text-amber-800 text-sm font-medium">{speechErrorMessage}</p>
                  <div className="flex items-center gap-2 pt-1">
                    {failedPatientTextRef.current ? (
                      <button
                        type="button"
                        onClick={() => {
                          const textToRetry = failedPatientTextRef.current;
                          setSpeechErrorMessage(null);
                          setMicPermissionError(null);
                          processPatientResponse(textToRetry);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Answer / पुनः प्रयास करें</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSpeechErrorMessage(null);
                          setMicPermissionError(null);
                          startListeningHandsFree();
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Tap to Speak / दोबारा बोलें</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSpeechErrorMessage(null);
                        setMicPermissionError(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {micPermissionError && !speechErrorMessage && (
                <div className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-amber-950 text-xs shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Microphone Permission Needed / माइक की अनुमति चाहिए</span>
                  </div>
                  <p className="text-amber-800">{micPermissionError}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleStartVoiceSession}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer"
                    >
                      Allow Microphone / दोबारा अनुमति दें
                    </button>
                    <button
                      type="button"
                      onClick={() => setMicPermissionError(null)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {!isVoiceSessionActive ? (
                <button
                  id="speak-to-start-btn"
                  onClick={handleStartVoiceSession}
                  className="group relative flex flex-col items-center justify-center w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white shadow-2xl shadow-teal-700/30 hover:shadow-teal-700/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping duration-1000" />
                  <div className="absolute -inset-3 rounded-full border-2 border-teal-400/40 animate-pulse" />

                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/15 flex items-center justify-center mb-2.5 shadow-inner">
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">Start Voice Intake</span>
                  <span className="text-xs text-teal-100 font-medium mt-1">Single tap • 100% Hands-Free</span>
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  {/* Acoustic Aura Stage */}
                  <div
                    onClick={() => {
                      if (voiceState === 'ERROR') {
                        setSpeechErrorMessage(null);
                        startListeningHandsFree();
                      } else {
                        handleUserInterruption();
                      }
                    }}
                    style={{
                      transform: voiceState === 'LISTENING' ? `scale(${1 + Math.min(0.2, audioLevel * 0.4)})` : undefined,
                      transition: 'transform 0.15s ease-out',
                    }}
                    className={`group relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full text-white shadow-2xl cursor-pointer transition-colors ${
                      voiceState === 'ERROR' ? 'bg-amber-950 border-4 border-amber-500/60' : 'bg-teal-950'
                    }`}
                    title={
                      voiceState === 'AI_SPEAKING'
                        ? 'Tap anywhere to interrupt AI and speak'
                        : voiceState === 'ERROR'
                        ? 'Tap to try speaking again'
                        : 'Hands-free active'
                    }
                  >
                    {voiceState === 'LISTENING' && (
                      <>
                        <div className="absolute -inset-4 rounded-full border-4 border-emerald-400/40 animate-ping duration-1000" />
                        <div className="absolute -inset-8 rounded-full border-2 border-emerald-400/20 animate-pulse" />
                      </>
                    )}
                    {voiceState === 'AI_SPEAKING' && (
                      <div className="absolute -inset-4 rounded-full border-4 border-teal-400/50 animate-pulse" />
                    )}
                    {voiceState === 'PROCESSING' && (
                      <div className="absolute -inset-4 rounded-full border-4 border-amber-400/50 animate-pulse" />
                    )}

                    <div className="flex flex-col items-center justify-center text-center p-4">
                      {voiceState === 'AI_SPEAKING' ? (
                        <>
                          <Volume2 className="w-14 h-14 text-teal-300 animate-bounce mb-2" />
                          <span className="text-base font-bold tracking-wide text-white">AI is speaking...</span>
                          <span className="text-[11px] text-teal-200/80 mt-1 underline group-hover:text-amber-300">
                            Tap to Interrupt
                          </span>
                        </>
                      ) : voiceState === 'LISTENING' ? (
                        <>
                          <Mic className="w-14 h-14 text-emerald-400 animate-pulse mb-2" />
                          <span className="text-base font-bold tracking-wide text-white">🎙️ Listening...</span>
                          <span className="text-xs text-emerald-200 mt-1 font-medium">Please speak...</span>
                          {audioLevel > 0.04 ? (
                            <span className="text-[11px] text-emerald-300 font-bold mt-1 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              Voice Detected
                            </span>
                          ) : null}
                        </>
                      ) : voiceState === 'PROCESSING' ? (
                        <>
                          <Loader2 className="w-14 h-14 text-amber-400 animate-spin mb-2" />
                          <span className="text-base font-bold tracking-wide text-white">Understanding your response...</span>
                          <span className="text-xs text-amber-200 mt-1">Please wait a moment...</span>
                        </>
                      ) : (
                        <>
                          <MicOff className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />
                          <span className="text-sm font-bold tracking-wide text-amber-200 px-2 leading-tight">
                            {speechErrorMessage || 'Main aapki awaaz nahi sun paaya.'}
                          </span>
                          <span className="text-xs text-white bg-amber-600/90 hover:bg-amber-500 px-3 py-1 rounded-full mt-2 font-semibold transition">
                            Tap to Speak Again / दोबारा बोलें
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Immediate Turn Finisher if patient has finished speaking */}
                  {voiceState === 'LISTENING' && (liveInterimText.length > 2 || audioLevel > 0.05) && (
                    <button
                      id="done-speaking-btn"
                      type="button"
                      disabled={voiceState === 'PROCESSING'}
                      onClick={() => {
                        speechManager.triggerTurnComplete();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 animate-in fade-in"
                      title="Tap when finished speaking to get nurse response immediately"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Done Speaking / सब बता दिया</span>
                    </button>
                  )}

                  {/* Pause / Resume Controls & Interruption Hint */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      id="pause-voice-btn"
                      onClick={handlePauseVoiceSession}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Session</span>
                    </button>
                    <button
                      onClick={() => {
                        if (latestAiMessage) speakAiResponse(latestAiMessage.text);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repeat Question</span>
                    </button>
                    {voiceState === 'AI_SPEAKING' && (
                      <button
                        onClick={handleUserInterruption}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Interrupt Nurse</span>
                      </button>
                    )}
                    {voiceState === 'ERROR' && (
                      <button
                        onClick={() => {
                          setSpeechErrorMessage(null);
                          startListeningHandsFree();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Try Again / दोबारा बोलें</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowCameraScanner(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan Prescription / Report</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Subtitle & Live Dialogue Display */}
            <div className="relative z-10 text-left bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  Live Dialogue Feed
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Automatic multi-dialect translation</span>
              </div>

              {/* Current Nurse Question */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Nurse Ananya ({currentLang.name}):
                  </span>
                  <button
                    type="button"
                    onClick={() => speakAiResponse(latestAiMessage?.text || currentLang.greeting)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition cursor-pointer"
                    title="Listen aloud in active language"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen / Bol Kar Sunayein</span>
                  </button>
                </div>
                <p
                  className={`font-semibold text-slate-900 leading-relaxed ${
                    fontSizeLarge ? 'text-lg sm:text-xl' : 'text-base'
                  }`}
                >
                  {latestAiMessage?.text || currentLang.greeting}
                </p>
                {latestAiMessage?.translatedText && session.activeLanguage !== 'en' && (
                  <p className="text-xs text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-200/60">
                    English translation: {latestAiMessage.translatedText}
                  </p>
                )}
              </div>

              {/* Live Patient Speaking Subtitle */}
              {(liveInterimText || latestPatientMessage) && (
                <div className="pt-3 border-t border-slate-200/80 space-y-1 bg-teal-50/60 p-3.5 rounded-xl border border-teal-100">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Patient Spoken Answer:
                  </span>
                  <p
                    className={`font-medium text-slate-800 italic ${
                      fontSizeLarge ? 'text-base sm:text-lg' : 'text-sm'
                    }`}
                  >
                    "{liveInterimText || latestPatientMessage?.text}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Simulation Bar (1-Click Pathway Tester) */}
            <div className="relative z-10 pt-2 border-t border-slate-100 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-teal-600" />
                  Quick Clinical Simulation Phrases:
                </span>
                <span className="text-[10px] text-slate-400">Tests Hinglish & OPQRST intelligence</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {testPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => processPatientResponse(phrase.text)}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 transition-all cursor-pointer"
                  >
                    {phrase.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Settings: Speed & Silence Duration */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Speech Pace:</span>
                  <button
                    onClick={() => setSpeechSpeed(0.80)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                      speechSpeed <= 0.82 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    Gentle (0.8x)
                  </button>
                  <button
                    onClick={() => setSpeechSpeed(0.88)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                      speechSpeed > 0.82 && speechSpeed <= 0.90 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    Standard (0.9x)
                  </button>
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <span className="font-semibold text-slate-700">Speech End Pause:</span>
                  <button
                    onClick={() => {
                      setSilenceDelay(1500);
                      speechManager.setSilenceThreshold(1500);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                      silenceDelay === 1500 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                    title="1.5s pause before sending answer"
                  >
                    1.5s
                  </button>
                  <button
                    onClick={() => {
                      setSilenceDelay(1800);
                      speechManager.setSilenceThreshold(1800);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                      silenceDelay === 1800 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                    title="1.8s pause for natural conversational speaking"
                  >
                    1.8s (Natural)
                  </button>
                  <button
                    onClick={() => {
                      setSilenceDelay(2500);
                      speechManager.setSilenceThreshold(2500);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                      silenceDelay === 2500 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                    title="2.5s pause for relaxed or elderly patients"
                  >
                    2.5s (Relaxed)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowManualTextInput(!showManualTextInput)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-teal-600" />
                  <span>{showManualTextInput ? 'Hide Text Input' : 'Type Instead'}</span>
                </button>
              </div>
            </div>

            {/* Finish & Review Action Button */}
            <div className="relative z-10 pt-2 flex justify-end">
              <button
                id="finish-intake-btn"
                onClick={handleFinishAndGenerateSummary}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Intake & Save to Doctor Chart</span>
              </button>
            </div>

            {/* Manual Text Drawer */}
            {showManualTextInput && (
              <form onSubmit={handleTextSubmit} className="relative z-10 pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your spoken answer here..."
                  value={textInputFallback}
                  onChange={(e) => setTextInputFallback(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 bg-white"
                />
                <button
                  type="submit"
                  disabled={!textInputFallback.trim()}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Live Structured Case Builder */}
        {showLiveSummaryPanel && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Real-Time Case Extraction</h2>
                    <p className="text-[11px] text-slate-500">Live database-synchronized entities</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Chief Complaint Live Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500" />
                  Chief Complaint
                </span>
                <p className="text-xs font-semibold text-slate-900 leading-snug">
                  {liveExtraction.chiefComplaint || 'Listening for initial complaint...'}
                </p>
              </div>

              {/* Extracted Symptoms & OPQRST */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-teal-600" />
                  Extracted Symptoms & OPQRST
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {liveExtraction.symptoms && liveExtraction.symptoms.length > 0 ? (
                    liveExtraction.symptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200"
                      >
                        {sym}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No symptoms extracted yet</span>
                  )}
                </div>
              </div>

              {/* Medications Mentioned */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Pill className="w-3 h-3 text-indigo-600" />
                  Medications & Adherence
                </span>
                <div className="space-y-1">
                  {liveExtraction.medicationsMentioned && liveExtraction.medicationsMentioned.length > 0 ? (
                    liveExtraction.medicationsMentioned.map((med, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-indigo-50/70 text-indigo-950 border border-indigo-100 flex items-center justify-between"
                      >
                        <span>{med}</span>
                        <span className="text-[10px] text-indigo-700 font-semibold">Reported</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No medications recorded yet</span>
                  )}
                </div>
              </div>

              {/* Conflict Flags */}
              {liveExtraction.conflictsDetected && liveExtraction.conflictsDetected.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Conflict Flag Detected ({liveExtraction.conflictsDetected.length})
                  </span>
                  <ul className="text-xs text-amber-950 space-y-1 pl-4 list-disc">
                    {liveExtraction.conflictsDetected.map((conf, idx) => (
                      <li key={idx} className="font-medium leading-tight">
                        {conf}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags / Urgent Alerts */}
              {liveExtraction.redFlags && liveExtraction.redFlags.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Urgent Alerts ({liveExtraction.redFlags.length})
                  </span>
                  <ul className="text-xs text-rose-950 space-y-1 pl-4 list-disc">
                    {liveExtraction.redFlags.map((rf, idx) => (
                      <li key={idx} className="font-semibold leading-tight">
                        {rf}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Status */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Linked Medical Documents:</span>
                <span className="font-semibold text-slate-800">{session.documents.length} Records Ingested</span>
              </div>
            </div>

            {/* Real-Time Transcript Preview Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full Dialogue Memory ({session.messages.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Persisted</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs divide-y divide-slate-100">
                {session.messages.map((msg) => (
                  <div key={msg.id} className="pt-1.5 first:pt-0 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold ${msg.sender === 'ai' ? 'text-teal-700' : 'text-slate-800'}`}>
                        {msg.sender === 'ai' ? 'Nurse Ananya' : session.patient.fullName || 'Patient'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speakAiResponse(msg.text)}
                          className="text-slate-400 hover:text-teal-700 p-0.5 rounded transition cursor-pointer"
                          title="Listen aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <span className="text-slate-400">{msg.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-snug">{msg.text}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Voice-Controlled Camera Document Scanner */}
      {showCameraScanner && (
        <CameraDocumentScanner
          patientId={session.patient?.id || 'PAT-TEMP'}
          onDocumentCaptured={handleDocumentCaptured}
          onClose={() => setShowCameraScanner(false)}
          initialType="prescription"
          sourceContext="voice_intake"
        />
      )}
    </div>
  );
};
