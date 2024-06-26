import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../src/languages/en.json';
import translationRO from '../src/languages/ro.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ro: { translation: translationRO }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
