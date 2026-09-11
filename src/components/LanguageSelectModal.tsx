import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode, SupportedLanguage } from '../types';
import { Globe, Search, Check, Volume2, X } from 'lucide-react';
import { speakTextAloud, stopSpeaking } from '../utils/speechUtils';

interface LanguageSelectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelect?: (code: LanguageCode) => void;
  onSelectLanguage?: (code: LanguageCode) => void;
}

const SAMPLE_GREETINGS: Record<LanguageCode, string> = {
  en: 'Hello, welcome to your healthcare intake. How can I help you today?',
  hi: 'नमस्ते, आपके स्वास्थ्य परीक्षण में आपका स्वागत है। आज आपको क्या परेशानी है?',
  bn: 'নমস্কার, আপনার স্বাস্থ্য পরীক্ষায় স্বাগতম। আজ আপনার কী সমস্যা হচ্ছে?',
  ta: 'வணக்கம், உங்கள் மருத்துவ பரிசோதனைக்கு வரவேற்கிறோம். என்ன உதவி தேவை?',
  te: 'నమస్కారం, మీ ఆరోగ్య పరీక్షకు స్వాగతం. ఈరోజు మీకు ఎలాంటి సమస్య ఉంది?',
  mr: 'नमस्कार, आपल्या आरोग्य तपासणीत स्वागत आहे. आज आपल्याला काय त्रास होत आहे?',
  gu: 'નમસ્તે, આપની આરોગ્ય તપાસમાં સ્વાગત છે. આજે તમને શું તકલીફ છે?',
  kn: 'ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಆರೋಗ್ಯ ತಪಾಸಣೆಗೆ ಸುಸ್ವಾಗತ. ಇಂದು ನಿಮಗೆ ಯಾವ ಸಮಸ್ಯೆ ಇದೆ?',
  ml: 'നമസ്കാരം, നിങ്ങളുടെ ആരോഗ്യ പരിശോധനയിലേക്ക് സ്വാഗതം. എന്ത് സഹായമാണ് വേണ്ടത്?',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡੀ ਸਿਹਤ ਜਾਂਚ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਅੱਜ ਕੀ ਤਕਲੀਫ਼ ਹੈ?',
  or: 'ନମସ୍କାର, ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷାକୁ ସ୍ୱାଗତ। ଆଜି କ’ଣ ସମସ୍ୟା ହେଉଛି?',
  as: 'নমস্কাৰ, আপোনাৰ স্বাস্থ্য পৰীক্ষালৈ স্বাগতম। আজি কিবা অসুবিধা হৈছে নেকি?',
  ur: 'السلام علیکم، آپ کے طبی معائنے میں خوش آمدید۔ آج آپ کو کیا پریشانی ہے؟',
};

const POPULAR_LANG_CODES: LanguageCode[] = ['hi', 'en', 'bn', 'te', 'ta', 'mr', 'pa', 'ur'];

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSelect: propOnSelect,
  onSelectLanguage: propOnSelectLanguage,
}) => {
  const {
    language: activeLanguage,
    setLanguage,
    supportedLanguages,
    isLanguageSelectorOpen,
    closeLanguageSelector,
    t,
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [previewingCode, setPreviewingCode] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<'all' | 'popular' | 'north' | 'south' | 'east' | 'west'>('all');

  const isOpen = propIsOpen !== undefined ? propIsOpen : isLanguageSelectorOpen;

  const handleClose = () => {
    stopSpeaking();
    setPreviewingCode(null);
    if (propOnClose) {
      propOnClose();
    } else {
      closeLanguageSelector();
    }
  };

  const filteredLanguages = useMemo(() => {
    let list = supportedLanguages;

    if (filterRegion === 'popular') {
      list = list.filter((l) => POPULAR_LANG_CODES.includes(l.code));
    } else if (filterRegion === 'north') {
      list = list.filter((l) => ['hi', 'pa', 'ur', 'en'].includes(l.code));
    } else if (filterRegion === 'south') {
      list = list.filter((l) => ['te', 'ta', 'kn', 'ml'].includes(l.code));
    } else if (filterRegion === 'east') {
      list = list.filter((l) => ['bn', 'or', 'as'].includes(l.code));
    } else if (filterRegion === 'west') {
      list = list.filter((l) => ['mr', 'gu', 'hi'].includes(l.code));
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter((lang) => {
      return (
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.englishName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query) ||
        lang.script.toLowerCase().includes(query)
      );
    });
  }, [supportedLanguages, searchQuery, filterRegion]);

  const handleSelectLanguage = (code: LanguageCode) => {
    stopSpeaking();
    setLanguage(code);
    if (propOnSelect) {
      propOnSelect(code);
    }
    if (propOnSelectLanguage) {
      propOnSelectLanguage(code);
    }
    handleClose();
  };

  const handlePreviewVoice = (e: React.MouseEvent, lang: SupportedLanguage) => {
    e.stopPropagation();
    try {
      const greetingText = lang.greeting || SAMPLE_GREETINGS[lang.code] || lang.nativeName;
      setPreviewingCode(lang.code);
      speakTextAloud(
        greetingText,
        lang.code,
        0.88,
        () => setPreviewingCode(lang.code),
        () => setPreviewingCode(null)
      );
    } catch {
      setPreviewingCode(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="language-select-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        id="language-select-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-blue-50/80 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('languageModal.title') || 'Select Spoken Language / भाषा चुनें'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t('languageModal.subtitle') || 'AI clinical voice recognition & speech adapts instantly'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-language-modal"
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Chips & Search Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-language-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language (e.g. Hindi, हिन्दी, Telugu, தமிழ், Urdu)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-2xs font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterRegion('all')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                filterRegion === 'all'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All 13 Languages
            </button>
            <button
              type="button"
              onClick={() => setFilterRegion('popular')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                filterRegion === 'popular'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Most Common (हिन्दी, বাংলা, தமிழ், etc.)
            </button>
            <button
              type="button"
              onClick={() => setFilterRegion('north')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                filterRegion === 'north'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              North
            </button>
            <button
              type="button"
              onClick={() => setFilterRegion('south')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                filterRegion === 'south'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              South
            </button>
            <button
              type="button"
              onClick={() => setFilterRegion('east')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                filterRegion === 'east'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              East
            </button>
            <button
              type="button"
              onClick={() => setFilterRegion('west')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                filterRegion === 'west'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              West
            </button>
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="px-5 py-4 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = activeLanguage === lang.code;
              const isSpeaking = previewingCode === lang.code;

              return (
                <div
                  key={lang.code}
                  id={`lang-card-${lang.code}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`cursor-pointer rounded-2xl p-3.5 border text-left transition-all duration-150 flex items-center justify-between group active:scale-[0.98] ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/90 shadow-sm ring-2 ring-teal-500/30'
                      : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/90 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800'
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-base leading-tight truncate">
                          {lang.nativeName}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-600 text-white shrink-0 shadow-2xs">
                            <Check className="w-3 h-3 mr-0.5" />
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5 truncate font-medium">
                        <span>{lang.englishName}</span>
                        <span>•</span>
                        <span className="text-slate-400">{lang.script}</span>
                        {lang.isRtl && (
                          <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-800 rounded font-semibold">
                            RTL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <button
                      type="button"
                      id={`btn-voice-preview-${lang.code}`}
                      title="Preview Voice Speaking in this language"
                      onClick={(e) => handlePreviewVoice(e, lang)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-teal-600 text-white border-teal-600 animate-pulse'
                          : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50 border-slate-200'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium">No languages match "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterRegion('all');
                }}
                className="mt-2 text-xs text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">13 Indian Languages supported</span>
          </div>
          <button
            id="btn-close-lang-footer"
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
