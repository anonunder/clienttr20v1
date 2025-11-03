import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import sr from './locales/sr.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.startsWith('sr') ? 'sr' : 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    sr: { translation: sr },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

