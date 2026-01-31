import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { theme } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import LanguagePickerModal from './LanguagePickerModal';
import ThemePickerModal from './ThemePickerModal';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75; // 75% of screen width

interface SideMenuProps {
    isVisible: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isVisible, onClose }) => {
    const navigation = useNavigation();
    const { isDarkMode, setThemeMode, themeMode, theme: currentTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current; // Start hidden off-screen left
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Internal state to handle exit animation properly
    // We keep the modal visible until the exit animation completes
    const [showModal, setShowModal] = useState(isVisible);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true); // Mount modal immediately
            // Slide In
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Slide Out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -MENU_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowModal(false); // Unmount modal after animation
            });
        }
    }, [isVisible]);

    const handleNavigation = (screen: string) => {
        onClose();
        // Add navigation logic here if screens exist
        // (navigation as any).navigate(screen); 
        console.log(`Navigating to ${screen}`);
    };

    const onSelectLanguage = (lang: 'en' | 'ur') => {
        setLanguage(lang);
        setTimeout(() => setShowLanguagePicker(false), 300); // Small delay for visual feedback
    };

    const onSelectTheme = (mode: 'light' | 'dark' | 'system') => {
        setThemeMode(mode);
        setTimeout(() => setShowThemePicker(false), 300);
    };

    const MenuOption = ({ icon, label, onPress, isLogout = false }: { icon: string, label: string, onPress: () => void, isLogout?: boolean }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[
                styles.iconBox,
                isLogout && styles.logoutIconBox,
                { backgroundColor: isLogout ? '#FFF0F0' : currentTheme.colors.surface }
            ]}>
                <Icon name={icon} size={22} color={isLogout ? '#FF4b4b' : isDarkMode ? '#FFF' : '#333'} />
            </View>
            <Text style={[
                styles.menuText,
                isLogout && styles.logoutText,
                { color: isLogout ? '#FF4b4b' : currentTheme.colors.text }
            ]}>{label}</Text>
            {!isLogout && <Icon name="chevron-right" size={20} color={isDarkMode ? '#555' : '#ccc'} style={{ marginLeft: 'auto' }} />}
        </TouchableOpacity>
    );

    return (
        <Modal
            transparent
            visible={showModal}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlayContainer}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[
                    styles.menuContainer,
                    {
                        transform: [{ translateX: slideAnim }],
                        backgroundColor: currentTheme.colors.background
                    }
                ]}>

                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarBorder}>
                                <Image
                                    source={require('../../assets/images/category/Frame.png')}
                                    style={styles.avatar}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>Andrew Ainsley</Text>
                                <Text style={styles.userEmail}>andrew.ainsley@email.com</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Icon name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Menu Options */}
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('menu_general')}</Text>
                            <MenuOption icon="account-outline" label={t('menu_profile')} onPress={() => handleNavigation('Profile')} />
                            <MenuOption icon="calendar-check-outline" label={t('menu_bookings')} onPress={() => handleNavigation('Booked')} />
                            <MenuOption icon="heart-outline" label={t('menu_saved')} onPress={() => handleNavigation('SavedProviders')} />
                            <MenuOption icon="credit-card-outline" label={t('menu_payment')} onPress={() => handleNavigation('PaymentMethods')} />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('menu_settings')}</Text>
                            <MenuOption icon="bell-outline" label={t('menu_notifications')} onPress={() => { }} />
                            <MenuOption
                                icon="earth"
                                label={t('menu_language')}
                                onPress={() => setShowLanguagePicker(true)}
                            />
                            <MenuOption
                                icon={isDarkMode ? "weather-sunny" : "weather-night"}
                                label={`${t('menu_theme')}: ${themeMode === 'system' ? 'System' : isDarkMode ? t('theme_dark') : t('theme_light')}`}
                                onPress={() => setShowThemePicker(true)}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('menu_support')}</Text>
                            <MenuOption icon="help-circle-outline" label={t('menu_help')} onPress={() => { }} />
                            <MenuOption icon="file-document-outline" label={t('menu_privacy')} onPress={() => { }} />
                            <MenuOption icon="information-outline" label={t('menu_about')} onPress={() => { }} />
                        </View>

                    </ScrollView>

                    {/* Footer / Logout */}
                    <View style={styles.footer}>
                        <MenuOption icon="logout" label={t('menu_logout')} onPress={() => console.log('Logout')} isLogout />
                    </View>

                    <LanguagePickerModal
                        visible={showLanguagePicker}
                        onClose={() => setShowLanguagePicker(false)}
                        onSelectLanguage={onSelectLanguage}
                        currentLanguage={language as 'en' | 'ur'}
                    />

                    <ThemePickerModal
                        visible={showThemePicker}
                        onClose={() => setShowThemePicker(false)}
                        onSelectTheme={onSelectTheme}
                        currentMode={themeMode}
                    />

                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: width,
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        height: hp('22%'),
        backgroundColor: '#12CCB7',
        paddingTop: hp('6%'),
        paddingHorizontal: wp('5%'),
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    avatarBorder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    userInfo: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    closeBtn: {
        position: 'absolute',
        top: hp('5%'),
        right: wp('4%'),
        padding: 5,
    },
    scrollContent: {
        paddingVertical: 10,
        paddingBottom: 50,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: wp('5%'),
    },
    sectionTitle: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 5,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    logoutIconBox: {
        backgroundColor: '#FFF0F0',
    },
    menuText: {
        fontSize: 15,
        fontWeight: '500',
    },
    logoutText: {
        color: '#FF4b4b',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: hp('5%'),
    }
});

export default SideMenu;
