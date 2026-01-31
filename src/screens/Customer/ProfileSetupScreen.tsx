import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    UIManager
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Move CustomInput outside to prevent focus loss on state updates
const CustomInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    keyboardType = 'default',
    isPhone = false,
    theme,
    isRTL,
    countryFlag,
    countryCode,
    onPressCountry,
    maxLength
}: any) => (
    <View style={styles.inputWrapper}>
        <Text style={[styles.inputLabel, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
        <View style={[
            styles.inputContainer,
            {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                flexDirection: isRTL ? 'row-reverse' : 'row'
            }
        ]}>
            <Icon name={icon} size={20} color={theme.colors.primary} style={isRTL ? { marginLeft: 12 } : { marginRight: 12 }} />

            {isPhone && (
                <TouchableOpacity
                    style={[styles.countryTrigger, { borderRightColor: theme.colors.border, borderRightWidth: isRTL ? 0 : 1, borderLeftWidth: isRTL ? 1 : 0, borderLeftColor: theme.colors.border }]}
                    onPress={onPressCountry}
                >
                    <Text style={styles.flagEmoji}>{countryFlag}</Text>
                    <Text style={[styles.countryText, { color: theme.colors.text }]}>{countryCode}</Text>
                    <Icon name="chevron-down" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            )}

            <TextInput
                style={[styles.input, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary + '80'}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxLength}
            />
        </View>
    </View>
);

const ProfileSetupScreen = () => {
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL, language } = useLanguage();
    const navigation = useNavigation();

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [countryCode, setCountryCode] = useState('+1');
    const [countryFlag, setCountryFlag] = useState('🇺🇸');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const handleSelectCountry = (country: any) => {
        setCountryCode(country.dial_code);
        setCountryFlag(country.flag);
        setPickerVisible(false);
    };

    const handleSave = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

            <View style={[styles.header, { borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
                    <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={26} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('pr_edit_profile')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        <View style={styles.avatarSection}>
                            <TouchableOpacity activeOpacity={0.9} onPress={pickImage} style={styles.avatarSection}>
                                <View style={styles.avatarContainer}>
                                    <View style={[styles.avatarBorder, { borderColor: theme.colors.primary }]}>
                                        {imageUri ? (
                                            <Image source={{ uri: imageUri }} style={styles.image} />
                                        ) : (
                                            <Image source={require('../../assets/images/category/user.png')} style={styles.image} />
                                        )}
                                    </View>
                                    <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                                        <Icon name="camera-plus" size={18} color="#FFF" />
                                    </View>
                                </View>
                                <Text style={[styles.setupTitle, { color: theme.colors.text }]}>{t('pr_setup_title')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formSection}>
                            <CustomInput
                                label={t('pr_legal_name')}
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                                icon="account-outline"
                                theme={theme}
                                isRTL={isRTL}
                            />
                            <CustomInput
                                label={t('pr_country')}
                                placeholder="Pakistan"
                                value={country}
                                onChangeText={setCountry}
                                icon="map-marker-outline"
                                theme={theme}
                                isRTL={isRTL}
                            />
                            <CustomInput
                                label={t('pr_phone')}
                                placeholder="312 3456789"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                icon="phone-outline"
                                keyboardType="phone-pad"
                                isPhone
                                theme={theme}
                                isRTL={isRTL}
                                countryFlag={countryFlag}
                                countryCode={countryCode}
                                onPressCountry={() => setPickerVisible(true)}
                                maxLength={11}
                            />
                            <CustomInput
                                label="Email Address"
                                placeholder="example@mail.com"
                                value={email}
                                onChangeText={setEmail}
                                icon="email-outline"
                                keyboardType="email-address"
                                theme={theme}
                                isRTL={isRTL}
                            />
                            <CustomInput
                                label={t('pr_business_address')}
                                placeholder="Office 123, Building A"
                                value={address}
                                onChangeText={setAddress}
                                icon="office-building-marker-outline"
                                theme={theme}
                                isRTL={isRTL}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSave}
                            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
                        >
                            <Text style={styles.saveBtnText}>{t('pr_save_changes')}</Text>
                            <Icon name="check-decagram" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CountryPicker
                show={isPickerVisible}
                pickerButtonOnPress={handleSelectCountry}
                lang={language === 'ur' ? 'ur' : 'en'}
                style={{
                    modal: {
                        height: 500,
                        backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                    },
                    backdrop: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    countryButtonStyles: {
                        backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
                        borderColor: theme.colors.border,
                        borderRadius: 12,
                        marginVertical: 4,
                        paddingVertical: 12,
                    },
                    textInput: {
                        color: theme.colors.text,
                        backgroundColor: isDarkMode ? '#222' : '#F0F0F0',
                        borderRadius: 12,
                        paddingHorizontal: 15,
                    },
                    countryName: {
                        color: theme.colors.text,
                        fontSize: 16,
                        fontWeight: '600',
                    },
                    dialCode: {
                        color: theme.colors.primary,
                        fontSize: 16,
                        fontWeight: '700',
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
        paddingBottom: hp('2%'),
        paddingHorizontal: wp('5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: wp('4.8%'),
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('3%'),
        paddingBottom: hp('10%'),
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarBorder: {
        padding: 5,
        borderRadius: 65,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 3,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    setupTitle: {
        fontSize: wp('5.5%'),
        fontWeight: '800',
        marginTop: 8,
    },
    formSection: {
        marginBottom: hp('3%'),
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: wp('3.5%'),
        fontWeight: '700',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    inputContainer: {
        height: hp('7%'),
        borderRadius: 18,
        borderWidth: 1.5,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: wp('4%'),
        fontWeight: '500',
    },
    countryTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
        marginRight: 12,
        height: '70%',
    },
    flagEmoji: {
        fontSize: wp('6%'),
        marginRight: 8,
    },
    countryText: {
        fontSize: wp('3.8%'),
        fontWeight: '700',
        marginRight: 2,
    },
    saveBtn: {
        height: hp('7%'),
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        marginTop: 10,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
});

export default ProfileSetupScreen;
