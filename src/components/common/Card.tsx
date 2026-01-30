import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { theme, darkTheme } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const currentTheme = isDarkMode ? darkTheme : theme;

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
            },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginVertical: theme.spacing.s,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
});
