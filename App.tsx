import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { theme, darkTheme } from './src/theme';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

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
      background: isDarkMode ? darkTheme.colors.background : theme.colors.background,
      primary: theme.colors.primary,
      card: isDarkMode ? darkTheme.colors.surface : theme.colors.surface,
      text: isDarkMode ? darkTheme.colors.text : theme.colors.text,
      border: isDarkMode ? darkTheme.colors.border : theme.colors.border,
    }
  }

  return (
    <NavigationContainer theme={customNavigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
