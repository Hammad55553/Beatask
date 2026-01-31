import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { theme as lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themeMode: ThemeMode;
    toggleTheme: () => void; // Simple toggle between light/dark, or we can use set method
    setThemeMode: (mode: ThemeMode) => void;
    theme: typeof lightTheme;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = useNativeColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');

    // Calculate effective scheme
    const isDarkMode =
        themeMode === 'system'
            ? systemScheme === 'dark'
            : themeMode === 'dark';

    const theme = isDarkMode ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setThemeMode((prev) => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light'; // Cycle: Light -> Dark -> System -> Light
        });
    };

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme, theme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
