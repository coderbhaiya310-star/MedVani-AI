import { LanguageCode } from '../types';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { bn } from './translations/bn';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { mr } from './translations/mr';
import { gu } from './translations/gu';
import { kn } from './translations/kn';
import { ml } from './translations/ml';
import { pa } from './translations/pa';
import { or } from './translations/or';
import { as } from './translations/as';
import { ur } from './translations/ur';

export type TranslationSchema = typeof en;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const translations: Record<LanguageCode, DeepPartial<TranslationSchema> & { app?: any; nav?: any }> = {
  en,
  hi,
  bn,
  ta,
  te,
  mr,
  gu,
  kn,
  ml,
  pa,
  or,
  as,
  ur,
};

export function getTranslation(lang: LanguageCode): DeepPartial<TranslationSchema> {
  return translations[lang] || translations.en;
}
