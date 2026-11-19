import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import enTranslation from './langs/en';
import frTranslation from './langs/fr';

// French is the default language, English the second one
export const resources: {[lang: string]: {translation: any; label: string}} = {
  fr: {translation: frTranslation, label: 'Français'},
  en: {translation: enTranslation, label: 'English (US)'},
};

i18n
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
