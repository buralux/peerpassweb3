import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
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

// Type pour les clés de traduction
export type TranslationKeys = keyof typeof translationEN | keyof typeof translationFR | keyof typeof translationAR;

i18n
  // Détection automatique de la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    debug: true,
    resources,
    fallbackLng: 'fr', // Langue par défaut si la traduction n'existe pas
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    // Langue de démarrage
    lng: window.navigator.language || 'fr',
  });

export default i18n;