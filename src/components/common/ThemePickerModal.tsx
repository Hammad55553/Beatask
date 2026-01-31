import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

const { height } = Dimensions.get('window');

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectTheme: (mode: ThemeMode) => void;
    currentMode: ThemeMode;
}

const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
    visible,
    onClose,
    onSelectTheme,
    currentMode
}) => {
    const { theme } = useTheme();
    const [showModal, setShowModal] = useState(visible);

    // Animations
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    const handleSelect = (mode: ThemeMode) => {
        onSelectTheme(mode);
    };

    if (!showModal) return null;

    const ThemeOption = ({ mode, icon, label, subLabel, color }: { mode: ThemeMode, icon: string, label: string, subLabel: string, color: string }) => (
        <TouchableOpacity
            style={[
                styles.option,
                {
                    backgroundColor: theme.colors.background,
                    borderColor: currentMode === mode ? theme.colors.primary : 'transparent',
                    borderWidth: 1
                }
            ]}
            activeOpacity={0.8}
            onPress={() => handleSelect(mode)}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                    <Icon name={icon} size={24} color={color} />
                </View>
                <View style={{ marginLeft: 15 }}>
                    <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{label}</Text>
                    <Text style={[styles.optionSub, { color: theme.colors.textSecondary }]}>{subLabel}</Text>
                </View>
            </View>
            {currentMode === mode && (
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            transparent
            visible={showModal}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[
                    styles.sheetContainer,
                    {
                        backgroundColor: theme.colors.surface,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    {/* Handle Bar */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handleBar} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Appearance</Text>
                    </View>

                    {/* Options */}
                    <View style={styles.content}>
                        <ThemeOption
                            mode="light"
                            icon="weather-sunny"
                            label="Light Mode"
                            subLabel="Always light theme"
                            color="#FFA000"
                        />
                        <ThemeOption
                            mode="dark"
                            icon="weather-night"
                            label="Dark Mode"
                            subLabel="Always dark theme"
                            color="#5C6BC0"
                        />
                        <ThemeOption
                            mode="system"
                            icon="theme-light-dark"
                            label="System Default"
                            subLabel="Match device settings"
                            color="#78909C"
                        />
                    </View>

                    {/* Footer / Safe Area Spacing */}
                    <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />

                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheetContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#DDDDDD',
        borderRadius: 3,
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    content: {
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    optionSub: {
        fontSize: 13,
        marginTop: 2,
    }
});

export default ThemePickerModal;
