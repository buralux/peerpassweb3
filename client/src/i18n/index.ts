import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importation des fichiers de traduction
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationAR from './locales/ar.json';

// Les ressources de traduction
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  ar: {
    translation: translationAR
  }
};

i18n
  // Détection de la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut si la langue détectée n'est pas disponible
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // Non nécessaire pour React car il échappe par défaut
    },
    
    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'peerpassLanguage', // Clé utilisée dans localStorage
      caches: ['localStorage'],
    },
  });

export default i18n;

// Types pour faciliter l'autocomplétion des clés de traduction
export type TranslationKeys = keyof typeof translationEN | keyof typeof translationFR | keyof typeof translationAR;