import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

interface CustomToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onHide?: () => void;
}

const CustomToast = ({ visible, message, type = 'success', onHide }: CustomToastProps) => {

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                if (onHide) onHide();
            }, 3000); // Auto hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const getBgColor = () => {
        switch (type) {
            case 'success': return '#00E676'; // Bright Green
            case 'error': return '#FF5252'; // Bright Red
            case 'info': return '#2979FF'; // Bright Blue
            default: return '#333';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            default: return 'information';
        }
    };

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp}
            style={[styles.container, { shadowColor: getBgColor() }]}
        >
            <View style={[styles.accent, { backgroundColor: getBgColor() }]} />
            <View style={[styles.iconContainer, { backgroundColor: getBgColor() + '20' }]}>
                <Icon name={getIcon()} size={24} color={getBgColor()} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}
                </Text>
                <Text style={styles.message} numberOfLines={2}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Glass-ish
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        zIndex: 9999,
        // Premium Shadow
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    accent: {
        position: 'absolute',
        left: 0,
        top: 15,
        bottom: 15,
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginLeft: 5,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
});

export default CustomToast;
