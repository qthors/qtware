import { useEffect, useState } from 'react';
import { withTranslation as withTranslationHOC } from 'react-i18next';

import i18n, { LANGUAGES, resources } from '../translations';
import storage from '../utils/storage';

// MI
// console.log('language: ' + i18n.language); // undefined

// const DEFAULT_LANGUAGE = 'zh'; //MI, vanilla: 'en'
const usrlangs = navigator.languages;
console.log('language: ' + usrlangs);
const DEFAULT_LANGUAGE = usrlangs?.[0].startsWith('zh') ? 'zh' : 'en';

const STORAGE_KEYS = {
  LANGUAGE: 'lang',
};

export const withTranslation = withTranslationHOC;

const useTranslations = () => {
  const [loaded, setLoaded] = useState(i18n.isInitialized);
  const [selected, setSelected] = useState();
  useEffect(() => {
    if (!loaded) {
      storage.getItem(STORAGE_KEYS.LANGUAGE).then(language => {
        i18n
          .init({
            compatibilityJSON: 'v3',
            resources,
            lng: language || DEFAULT_LANGUAGE,
            fallbackLng: DEFAULT_LANGUAGE,
            interpolation: {
              escapeValue: false,
            },
          })
          .then(() => {
            setSelected(language || DEFAULT_LANGUAGE);
            setLoaded(true);
          });
      });
    }
  }, [loaded]);
  const changeLanguage = async lng => {
    await storage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    setSelected(lng);
    i18n.changeLanguage(lng);
  };
  return { selected, loaded, languages: LANGUAGES, changeLanguage };
};

export default useTranslations;
