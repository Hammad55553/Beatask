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

interface LanguagePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectLanguage: (lang: 'en' | 'ur') => void;
    currentLanguage: 'en' | 'ur';
}

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
    visible,
    onClose,
    onSelectLanguage,
    currentLanguage
}) => {
    const { theme, isDarkMode } = useTheme();
    const [showModal, setShowModal] = useState(visible);

    // Animations
    const slideAnim = useRef(new Animated.Value(height)).current; // Start below screen
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

    const handleSelect = (lang: 'en' | 'ur') => {
        onSelectLanguage(lang);
    };

    if (!showModal) return null;

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
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            {currentLanguage === 'en' ? 'Choose Language' : 'زبان منتخب کریں'}
                        </Text>
                    </View>

                    {/* Options */}
                    <View style={styles.content}>

                        {/* English Option */}
                        <TouchableOpacity
                            style={[
                                styles.option,
                                {
                                    backgroundColor: theme.colors.background,
                                    borderColor: currentLanguage === 'en' ? theme.colors.primary : 'transparent',
                                    borderWidth: 1 // Always have border logic but transparent if not selected
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleSelect('en')}
                        >
                            <View style={styles.optionLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                    <Text style={{ fontSize: 20 }}>🇬🇧</Text>
                                </View>
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={[styles.langName, { color: theme.colors.text }]}>English</Text>
                                    <Text style={[styles.langSub, { color: theme.colors.textSecondary }]}>US / UK</Text>
                                </View>
                            </View>
                            {currentLanguage === 'en' && (
                                <Icon name="check-circle" size={24} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>

                        {/* Urdu Option */}
                        <TouchableOpacity
                            style={[
                                styles.option,
                                {
                                    backgroundColor: theme.colors.background,
                                    borderColor: currentLanguage === 'ur' ? theme.colors.primary : 'transparent',
                                    borderWidth: 1
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleSelect('ur')}
                        >
                            <View style={styles.optionLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
                                    <Text style={{ fontSize: 20 }}>🇵🇰</Text>
                                </View>
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={[styles.langName, { color: theme.colors.text }]}>Urdu (اردو)</Text>
                                    <Text style={[styles.langSub, { color: theme.colors.textSecondary }]}>Pakistan</Text>
                                </View>
                            </View>
                            {currentLanguage === 'ur' && (
                                <Icon name="check-circle" size={24} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>

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
    langName: {
        fontSize: 16,
        fontWeight: '600',
    },
    langSub: {
        fontSize: 13,
        marginTop: 2,
    }
});

export default LanguagePickerModal;
