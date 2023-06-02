import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation';
import esTranslation from './es/translation';
import zhTranslation from './zh/translation';

// m17
// export const LANGUAGES = ['en', 'es', 'zh'];
export const LANGUAGES = ['en', 'zh'];

export const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

i18n.use(initReactI18next);

export default i18n;
