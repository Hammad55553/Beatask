import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { en, ur } from '../i18n/translations';
import { I18nManager, NativeModules, Platform } from 'react-native';

type Language = 'en' | 'ur' | 'es' | 'ar'; // Add more languages as needed (Spanish, Arabic as placeholders)
type Translations = typeof en;

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Helper to get device language best guess
const getDeviceLanguage = (): Language => {
    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;

    // Check if device language starts with 'ur'
    return deviceLanguage?.toLowerCase().startsWith('ur') ? 'ur' : 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    // Default to device language, or fallback to 'en'
    const [language, setLanguageState] = useState<Language>('en');

    // Initialize with device language on mount (simulating auto-detection)
    useEffect(() => {
        const detected = getDeviceLanguage();
        // Since we are not persisting yet, just set it. 
        // In a real app, we'd check AsyncStorage first.
        setLanguageState(detected);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        // NOTE: For full RTL support, we would need to do:
        // if (lang === 'ur' && !I18nManager.isRTL) { I18nManager.forceRTL(true); RNRestart.Restart(); }
        // For this demo, we are just swapping text to avoid crashing/restarting loop.
    };

    const t = (key: keyof Translations): string => {
        const uiStrings = language === 'ur' ? ur : en;
        return uiStrings[key] || en[key] || key;
    };

    const isRTL = language === 'ur';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
