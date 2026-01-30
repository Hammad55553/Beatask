import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { theme, darkTheme } from '../../theme';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: any;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const currentTheme = isDarkMode ? darkTheme : theme;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={currentTheme.colors.background} />
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
