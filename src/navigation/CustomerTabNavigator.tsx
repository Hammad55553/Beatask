import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import { theme, darkTheme } from '../theme';

// Screens
import HomeScreen from '../screens/Customer/HomeScreen';
import BookingsScreen from '../screens/Customer/BookingsScreen';
import MessagesListScreen from '../screens/Shared/MessagesListScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';

const Tab = createBottomTabNavigator();

import AnimatedTabBar from '../components/common/AnimatedTabBar';

const CustomerTabNavigator = () => {
    // const isDarkMode = useColorScheme() === 'dark'; // Not using direct theme logic here, handled inside component if needed
    // const currentTheme = isDarkMode ? darkTheme : theme;

    return (
        <Tab.Navigator
            tabBar={(props) => <AnimatedTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarStyle: { position: 'absolute' }, // Required for transparent background effect if needed
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'HOME',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Icon name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Booked"
                component={BookingsScreen}
                options={{
                    tabBarLabel: 'BOOKED',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Icon name="calendar-check-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Message"
                component={MessagesListScreen}
                options={{
                    tabBarLabel: 'MESSAGE',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Icon name="chat-processing-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'PROFILE',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Icon name="account-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default CustomerTabNavigator;
