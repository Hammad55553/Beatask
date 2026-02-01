import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { CurrencyProvider } from './src/context/CurrencyContext';

const AppContent = () => {
  const { isDarkMode, theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;

  // Sync navigation theme with our custom theme
  const customNavigationTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: theme.colors.background,
      primary: theme.colors.primary,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    }
  };

  return (
    <NavigationContainer theme={customNavigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
