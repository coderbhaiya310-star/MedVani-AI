import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LanguageCode, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageConfig, DEFAULT_LANGUAGE } from '../i18n/languages';
import { translations, getTranslation, TranslationSchema } from '../i18n';

interface LanguageContextType {
  language: LanguageCode;
  languageConfig: SupportedLanguage;
  setLanguage: (lang: LanguageCode) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  translations: TranslationSchema;
  isRtl: boolean;
  isLanguageSelectorOpen: boolean;
  openLanguageSelector: () => void;
  closeLanguageSelector: () => void;
  supportedLanguages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'clinical_ai_active_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }

    // Detect browser language for first-time visitors
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserCode = navigator.language.split('-')[0].toLowerCase() as LanguageCode;
      const matched = SUPPORTED_LANGUAGES.find((l) => l.code === browserCode);
      if (matched) {
        return matched.code;
      }
    }

    return DEFAULT_LANGUAGE;
  });

  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  const languageConfig = useMemo(() => {
    return getLanguageConfig(language);
  }, [language]);

  const activeTranslations = useMemo(() => {
    return getTranslation(language);
  }, [language]);

  const isRtl = useMemo(() => {
    return Boolean(languageConfig.isRtl);
  }, [languageConfig]);

  const setLanguage = (newLang: LanguageCode) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  // Set HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = languageConfig.speechLocale || language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, languageConfig, isRtl]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = activeTranslations;
    let fallback: any = translations.en;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
      }

      if (fallback && typeof fallback === 'object' && key in fallback) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
      }
    }

    let result = (typeof current === 'string' ? current : (typeof fallback === 'string' ? fallback : path));

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
      });
    }

    return result;
  };

  const openLanguageSelector = () => setIsLanguageSelectorOpen(true);
  const closeLanguageSelector = () => setIsLanguageSelectorOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageConfig,
        setLanguage,
        t,
        translations: activeTranslations,
        isRtl,
        isLanguageSelectorOpen,
        openLanguageSelector,
        closeLanguageSelector,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
