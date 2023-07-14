import { useEffect, useState } from 'react';
import { withTranslation as withTranslationHOC } from 'react-i18next';
import i18n, { LANGUAGES, resources } from '../translations';
import { Platform, NativeModules } from 'react-native';
import storage from '../utils/storage';

// MI
// console.log('language: ' + i18n.language); // undefined
// const DEFAULT_LANGUAGE = 'zh'; //MI, vanilla: 'en'

// as of ios 13, prefer AppleLanguages
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLanguages[0] ||
      NativeModules.SettingsManager.settings.AppleLocale
    : Platform.OS === 'android'
    ? NativeModules.I18nManager.localeIdentifier
    : undefined;

console.log('device language: ' + deviceLanguage); //en_US

const usrlangs = navigator.languages;
console.log('browser language: ' + usrlangs);

const DEFAULT_LANGUAGE = usrlangs
  ? usrlangs?.[0].startsWith('zh')
    ? 'zh'
    : 'en'
  : deviceLanguage ?? 'en';

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
