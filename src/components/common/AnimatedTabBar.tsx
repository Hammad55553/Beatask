import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

// Tab Configuration
const TAB_WIDTH = width / 4; // 4 tabs

const AnimatedTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

    // Animation for the moving indicator
    const translateX = useSharedValue(0);

    /* Update indicator position when active tab shifts */
    useEffect(() => {
        translateX.value = withSpring(state.index * TAB_WIDTH, {
            damping: 15,
            stiffness: 100,
        });
    }, [state.index]);

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {/* Background Active Indicator */}
                <Animated.View style={[styles.activeIndicatorContainer, indicatorStyle]}>
                    <View style={styles.activeIndicator} />
                </Animated.View>

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel as string;
                    const isFocused = state.index === index;

                    // Icon Configuration based on route name
                    let iconName = 'home-outline';
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                    else if (route.name === 'Booked') iconName = isFocused ? 'calendar-check' : 'calendar-check-outline';
                    else if (route.name === 'Message') iconName = isFocused ? 'chat-processing' : 'chat-processing-outline';
                    else if (route.name === 'Profile') iconName = isFocused ? 'account' : 'account-outline';

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabItem
                            key={index}
                            icon={iconName}
                            label={label}
                            isFocused={isFocused}
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Individual Tab Item Component for isolated animations
const TabItem = ({ icon, label, isFocused, onPress }: { icon: string, label: string, isFocused: boolean, onPress: () => void }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isFocused) {
            scale.value = withSpring(1.2);
            translateY.value = withSpring(-5);
        } else {
            scale.value = withTiming(1);
            translateY.value = withTiming(0);
        }
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ]
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
            transform: [{ scale: withTiming(isFocused ? 1 : 0.9) }]
        };
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
        >
            <Animated.View style={animatedIconStyle}>
                <Icon
                    name={icon}
                    size={26}
                    color={isFocused ? '#12CCB7' : '#888'}
                />
            </Animated.View>
            <Animated.Text style={[styles.tabLabel, animatedTextStyle, { color: isFocused ? '#12CCB7' : '#888' }]}>
                {label}
            </Animated.Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        // paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        zIndex: 100,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 70,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        paddingBottom: Platform.OS === 'ios' ? 15 : 5, // Extra padding for iOS home indicator
    },
    activeIndicatorContainer: {
        position: 'absolute',
        top: 0,
        width: TAB_WIDTH,
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    activeIndicator: {
        width: 50,
        height: 4,
        backgroundColor: '#12CCB7',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
});

export default AnimatedTabBar;
