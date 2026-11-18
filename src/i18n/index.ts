import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import {COUNTRY} from '@env';
import enTranslation from './langs/en';
import npTranslation from './langs/np';
import frTranslation from './langs/fr';

const allResources: {[lang: string]: {translation: any; label: string}} = {
  fr: {translation: frTranslation, label: 'Français'},
  en: {translation: enTranslation, label: 'English (US)'},
  ne: {translation: npTranslation, label: 'Nepali'},
};

// Languages offered in the settings, the first one being the default language
const countryLanguages: {[country: string]: string[]} = {
  cd: ['fr', 'en'],
  np: ['ne', 'en'],
  sl: ['en', 'ne'],
};

const languages = countryLanguages[COUNTRY] || countryLanguages.sl;

export const resources: {[lang: string]: {translation: any; label: string}} =
  languages.reduce(
    (list, language) => ({...list, [language]: allResources[language]}),
    {},
  );

i18n
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    compatibilityJSON: 'v3',
    resources,
    ...(COUNTRY === 'cd' ? {lng: 'fr'} : {}),
    fallbackLng: languages[0],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
