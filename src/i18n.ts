import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bgCommon from './locales/bg/common';
import enCommon from './locales/en/common';

export const SUPPORTED_LANGUAGES = ['bg', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const LANGUAGE_STORAGE_KEY = 'osogovo_language';

const getInitialLanguage = (): SupportedLanguage => {
    if (typeof window === 'undefined') {
        return 'bg';
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === 'bg' || storedLanguage === 'en') {
        return storedLanguage;
    }

    return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'bg';
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            bg: {
                common: bgCommon,
            },
            en: {
                common: enCommon,
            },
        },
        lng: getInitialLanguage(),
        fallbackLng: 'bg',
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (language) => {
    if (typeof window !== 'undefined' && (language === 'bg' || language === 'en')) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
});

export default i18n;
