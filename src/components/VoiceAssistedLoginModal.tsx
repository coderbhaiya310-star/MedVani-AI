import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, CheckCircle2, User, Phone, Sparkles, ArrowRight, Globe } from 'lucide-react';
import { speakTextAloud, stopSpeaking, ClinicalSpeechManager } from '../utils/speechUtils';
import { AuthUser, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

const VOICE_LOGIN_PROMPTS: Record<LanguageCode, string> = {
  en: 'Hello. I can help you log in. Please tell me your name or mobile number, or tap your name below.',
  hi: 'नमस्ते। मैं आपकी लॉगिन करने में मदद करूँगी। कृपया अपना नाम या फ़ोन नंबर बोलिए।',
  bn: 'নমস্কার। আমি আপনাকে লগইন করতে সাহায্য করব। আপনার নাম বা ফোন নম্বর বলুন।',
  ta: 'வணக்கம். நான் உங்களுக்கு உதவ முடியும். உங்கள் பெயர் அல்லது தொலைபேசி எண்ணைச் சொல்லுங்கள்.',
  te: 'నమస్కారం. నేను మీకు లాగిన్ అవ్వడానికి సహాయం చేస్తాను. మీ పేరు లేదా ఫోన్ నంబర్ చెప్పండి.',
  mr: 'नमस्कार. मी आपल्याला लॉग इन करण्यास मदत करेन. आपले नाव किंवा फोन नंबर सांगा.',
  gu: 'નમસ્તે. હું આપને લોગિન કરવામાં મદદ કરીશ. આપનું નામ અથવા ફોન નંબર બોલો.',
  kn: 'ನಮಸ್ಕಾರ. ನಾನು ನಿಮಗೆ ಲಾಗಿನ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹೇಳಿ.',
  ml: 'നമസ്കാരം. ഞാൻ നിങ്ങളെ ലോഗിൻ ചെയ്യാൻ സഹായിക്കാം. നിങ്ങളുടെ പേരോ ഫോൺ നമ്പറോ പറയുക.',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਂ ਤੁਹਾਡੀ ਲੌਗਇਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗੀ। ਆਪਣਾ ਨਾਮ ਜਾਂ ਫ਼ੋਨ ਨੰਬਰ ਬੋਲੋ।',
  or: 'ନମସ୍କାର। ମୁଁ ଆପଣଙ୍କୁ ଲଗଇନ୍ କରିବାରେ ସାହାଯ୍ୟ କରିବି। ଆପଣଙ୍କ ନାମ କିମ୍ବା ଫୋନ୍ ନମ୍ବର କୁହନ୍ତୁ।',
  as: 'নমস্কাৰ। মই আপোনাক লগইন কৰাত সহায় কৰিম। আপোনাৰ নাম বা ফোন নম্বৰ কওক।',
  ur: 'السلام علیکم۔ میں آپ کو لاگ ان کرنے میں مدد کروں گی۔ اپنا نام یا فون نمبر بتائیں۔',
};

interface VoiceAssistedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFillCredentials: (identifier: string, password?: string) => void;
}

export const VoiceAssistedLoginModal: React.FC<VoiceAssistedLoginModalProps> = ({
  isOpen,
  onClose,
  onFillCredentials,
}) => {
  const [speechManager] = useState<ClinicalSpeechManager>(() => new ClinicalSpeechManager());
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [securityWarning, setSecurityWarning] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('hi');

  const voicePromptText =
    VOICE_LOGIN_PROMPTS[selectedLang] || VOICE_LOGIN_PROMPTS.en;

  useEffect(() => {
    if (isOpen) {
      setSecurityWarning('');
      setSpokenText('');
      // Speak gentle greeting when opened
      setIsAiSpeaking(true);
      speakTextAloud(
        voicePromptText,
        selectedLang,
        0.82,
        () => setIsAiSpeaking(true),
        () => {
          setIsAiSpeaking(false);
          startListeningForElderly();
        }
      );
    } else {
      stopSpeaking();
      speechManager.stopListening();
      setIsListening(false);
    }
    return () => {
      stopSpeaking();
      speechManager.stopListening();
    };
  }, [isOpen, selectedLang]);

  const startListeningForElderly = () => {
    setIsListening(true);
    setSecurityWarning('');
    speechManager.setLanguage(selectedLang);
    speechManager.startListening({
      onTranscriptUpdate: (transcript) => {
        setSpokenText(transcript);
      },
      onTurnComplete: (finalText) => {
        setIsListening(false);
        handleProcessSpokenLogin(finalText);
      },
      onListeningState: (listening) => {
        setIsListening(listening);
      },
      onError: (err) => {
        console.warn('Voice login recognition error:', err);
      },
    });
  };

  const handleProcessSpokenLogin = (phrase: string) => {
    const raw = (phrase || '').trim();
    const cleanDigits = raw.replace(/\D/g, '');

    if (cleanDigits.length >= 10) {
      // User spoke 10 digits mobile number!
      onFillCredentials(cleanDigits, 'Password@123');
      onClose();
      return;
    }

    // Name spoken: strictly warn that name-only login is blocked for security
    const warning =
      'सुरक्षा कारणों से केवल नाम से लॉगिन बंद है। कृपया अपना 10 अंकों का पंजीकृत मोबाइल नंबर और पासवर्ड दर्ज करें।';
    setSecurityWarning(warning);
    speakTextAloud(warning, 'hi', 0.85);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-teal-300 overflow-hidden flex flex-col p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800">
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Voice Assistant (आवाज से सहायता)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                पंजीकृत मोबाइल नंबर बोलकर या चुनकर क्रेडेंशियल्स दर्ज करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Security Warning Notice */}
        {securityWarning && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
            <span className="text-base shrink-0">⚠️</span>
            <span>{securityWarning}</span>
          </div>
        )}

        {/* AI Voice Prompt Box */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Assistant Speaking</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-teal-950 leading-relaxed">
            "{voicePromptText}"
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-teal-50 border-slate-200'
                  }`}
                >
                  {lang.nativeName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Mic Centerpiece */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <button
            onClick={() => {
              if (isListening) {
                speechManager.stopListening();
                setIsListening(false);
              } else {
                startListeningForElderly();
              }
            }}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-emerald-600 text-white ring-8 ring-emerald-200 animate-pulse'
                : 'bg-teal-700 text-white hover:bg-teal-800'
            }`}
          >
            <Mic className="w-12 h-12 mb-1" />
            <span className="text-xs font-black uppercase tracking-wider">
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </span>
          </button>
          {spokenText && (
            <p className="text-sm font-semibold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              सुना: "{spokenText}"
            </p>
          )}
        </div>

        {/* Fill Registered Senior Patient Credentials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              पंजीकृत मोबाइल नंबर व पासवर्ड भरें (Fill Registered Credentials):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                onFillCredentials('+91 98765 43210', 'Password@123');
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                RS
              </div>
              <div className="font-bold text-slate-900 text-sm">Ramesh Singh</div>
              <div className="text-xs text-slate-500 font-medium">+91 98765 43210</div>
              <div className="text-[10px] text-teal-700 font-semibold mt-1">Pass: Password@123 →</div>
            </button>

            <button
              type="button"
              onClick={() => {
                onFillCredentials('+91 98111 22334', 'Password@123');
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                SD
              </div>
              <div className="font-bold text-slate-900 text-sm">Savitri Devi</div>
              <div className="text-xs text-slate-500 font-medium">+91 98111 22334</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">Pass: Password@123 →</div>
            </button>

            <button
              type="button"
              onClick={() => {
                onFillCredentials('+91 98222 33445', 'Password@123');
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                GS
              </div>
              <div className="font-bold text-slate-900 text-sm">Gurpreet Singh</div>
              <div className="text-xs text-slate-500 font-medium">+91 98222 33445</div>
              <div className="text-[10px] text-indigo-700 font-semibold mt-1">Pass: Password@123 →</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
