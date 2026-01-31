import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Modal,
    StatusBar,
    Image,
    Platform,
    Animated,
    LayoutAnimation,
    UIManager,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguagePickerModal from '../../components/common/LanguagePickerModal';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { t, isRTL, setLanguage, language } = useLanguage();

    const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);
    const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogout = () => {
        setLogoutPopupVisible(true);
    };

    const handleConfirmLogout = () => {
        setLogoutPopupVisible(false);
        // Assuming SplashScreen or Login is the root
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' as never }],
        });
    };

    const SettingItem = ({ icon, label, onPress, value, type = 'link', color }: any) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={type === 'switch'}
            style={[styles.settingItem, { borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: (color || theme.colors.primary) + '15' }]}>
                <Icon name={icon} size={22} color={color || theme.colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>

            {type === 'link' && (
                <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={theme.colors.textSecondary} />
            )}

            {type === 'switch' && (
                <Switch
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                    thumbColor={'#fff'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onPress}
                    value={value}
                />
            )}

            {type === 'text' && (
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{value}</Text>
            )}
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {title.toUpperCase()}
        </Text>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
                translucent={Platform.OS === 'ios'}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>

                    {/* Premium Header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={[styles.avatarBorder, { borderColor: theme.colors.primary }]}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/300?img=12' }}
                                    style={styles.avatar}
                                />
                            </View>
                            <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
                                <Icon name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>Hammad Ali</Text>
                        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>hammad.ali@example.com</Text>

                        <TouchableOpacity
                            onPress={() => (navigation as any).navigate('ProfileSetup')}
                            style={[styles.editProfileBtn, { backgroundColor: theme.colors.primary }]}
                        >
                            <Text style={styles.editProfileText}>{t('pr_edit_profile')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* App Settings Section */}
                    <View style={styles.sectionContainer}>
                        <SectionHeader title={t('pr_app_settings')} />
                        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <SettingItem
                                icon="brightness-6"
                                label={t('pr_dark_mode')}
                                type="switch"
                                value={isDarkMode}
                                onPress={toggleTheme}
                            />
                            <SettingItem
                                icon="earth"
                                label={t('pr_language')}
                                type="text"
                                value={language === 'en' ? t('pr_english') : t('pr_urdu')}
                                onPress={() => setLanguageModalVisible(true)}
                            />
                        </View>
                    </View>

                    {/* Account Settings Section */}
                    <View style={styles.sectionContainer}>
                        <SectionHeader title={t('pr_account_settings')} />
                        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <SettingItem
                                icon="bookmark-outline"
                                label={t('pr_saved_providers')}
                                onPress={() => (navigation as any).navigate('SavedProviders')}
                            />
                            <SettingItem
                                icon="star-outline"
                                label={t('pr_reviews')}
                                onPress={() => (navigation as any).navigate('ProviderReviews')}
                            />
                            <SettingItem
                                icon="shield-check-outline"
                                label={t('pr_privacy')}
                                onPress={() => (navigation as any).navigate('PrivacyPolicy')}
                            />
                            <SettingItem
                                icon="help-circle-outline"
                                label={t('pr_help')}
                                onPress={() => (navigation as any).navigate('HelpCenter')}
                            />
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={[styles.logoutBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FF525215' }]}>
                            <Icon name="logout" size={22} color="#FF5252" />
                        </View>
                        <Text style={[styles.logoutLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('pr_logout')}</Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal transparent={true} visible={isLogoutPopupVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={[styles.modalIcon, { backgroundColor: '#FF525215' }]}>
                            <Icon name="alert-circle-outline" size={40} color="#FF5252" />
                        </View>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('pr_logout')}</Text>
                        <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>{t('pr_logout_confirm')}</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.colors.border }]}
                                onPress={() => setLogoutPopupVisible(false)}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#FF5252' }]}
                                onPress={handleConfirmLogout}
                            >
                                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* Language Selection Modal */}
            <LanguagePickerModal
                visible={isLanguageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                onSelectLanguage={(lang) => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setLanguage(lang);
                    setLanguageModalVisible(false);
                }}
                currentLanguage={language as 'en' | 'ur'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? hp('7%') : hp('6%'),
        paddingBottom: hp('15%'),
        paddingHorizontal: wp('5%'),
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarBorder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 3,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: wp('3.5%'),
        marginBottom: 16,
    },
    editProfileBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 2,
    },
    editProfileText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: wp('3.8%'),
    },
    sectionContainer: {
        marginBottom: hp('3%'),
    },
    sectionHeader: {
        fontSize: wp('3.2%'),
        fontWeight: '800',
        marginBottom: 10,
        paddingHorizontal: 4,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingLabel: {
        flex: 1,
        fontSize: wp('4%'),
        marginHorizontal: 16,
        fontWeight: '500',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        padding: 12,
        marginTop: 10,
    },
    logoutLabel: {
        flex: 1,
        fontSize: wp('4%'),
        marginHorizontal: 16,
        fontWeight: 'bold',
        color: '#FF5252',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('10%'),
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalBtn: {
        flex: 1,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
