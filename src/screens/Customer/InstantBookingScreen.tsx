import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CustomToast from '../../components/common/CustomToast';

const InstantBookingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();

    const { providerName, serviceName } = (route.params as { providerName?: string, serviceName?: string }) || {};

    const [serviceType, setServiceType] = useState(serviceName || '');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('Immediate'); // Immediate, Today, Schedule

    // Date/Time State
    const [date, setDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
    const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

    const [showToast, setShowToast] = useState(false);

    const handleBack = () => navigation.goBack();

    const handleBooking = () => {
        if (providerName) {
            setShowToast(true);
            setTimeout(() => {
                navigation.goBack();
            }, 2500);
        } else {
            (navigation as any).navigate('CategoryDetails', { category: serviceType || 'Service' });
        }
    };

    const handleUrgencyChange = (value: string) => {
        setUrgency(value);
        if (value === 'Today') {
            setScheduledDate(new Date());
            setScheduledTime(null);
        } else if (value === 'Immediate') {
            setScheduledDate(null);
            setScheduledTime(null);
        } else {
            // Schedule
            setScheduledDate(null);
            setScheduledTime(null);
        }
    };

    const UrgencyOption = ({ label, icon, value }: any) => (
        <TouchableOpacity
            style={[
                styles.urgencyBtn,
                {
                    backgroundColor: urgency === value ? theme.colors.primary : theme.colors.surface,
                    borderColor: urgency === value ? theme.colors.primary : theme.colors.border,
                }
            ]}
            onPress={() => handleUrgencyChange(value)}
        >
            <Icon
                name={icon}
                size={24}
                color={urgency === value ? '#fff' : theme.colors.textSecondary}
            />
            <Text style={[
                styles.urgencyText,
                { color: urgency === value ? '#fff' : theme.colors.text }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                        <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {providerName ? `${t('ib_book_provider')} ${providerName}` : t('ib_title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Animated.View entering={FadeInDown.duration(600).springify()}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('ib_need_help')}</Text>

                        {/* Service Input */}
                        <View style={[
                            styles.inputContainer,
                            {
                                backgroundColor: serviceName ? theme.colors.background : theme.colors.surface,
                                borderColor: theme.colors.border,
                                flexDirection: isRTL ? 'row-reverse' : 'row'
                            }
                        ]}>
                            <Icon name="tools" size={20} color={serviceName ? theme.colors.textSecondary : theme.colors.primary} style={[styles.inputIcon, { marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }]} />
                            <TextInput
                                placeholder={t('ib_service_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                style={[
                                    styles.input,
                                    {
                                        color: serviceName ? theme.colors.textSecondary : theme.colors.text,
                                        textAlign: isRTL ? 'right' : 'left'
                                    }
                                ]}
                                value={serviceType}
                                onChangeText={setServiceType}
                                editable={!serviceName}
                            />
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }]}>{t('ib_location_title')}</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Icon name="map-marker" size={20} color={theme.colors.primary} style={[styles.inputIcon, { marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }]} />
                            <TextInput
                                placeholder={t('ib_location_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                style={[styles.input, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                                value={location}
                                onChangeText={setLocation}
                            />
                            <TouchableOpacity>
                                <Icon name="crosshairs-gps" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }]}>{t('ib_when_title')}</Text>
                        <View style={[styles.urgencyContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <UrgencyOption label={t('ib_now')} icon="lightning-bolt" value="Immediate" />
                            <UrgencyOption label={t('ib_today')} icon="calendar-today" value="Today" />
                            <UrgencyOption label={t('ib_schedule')} icon="calendar-month" value="Schedule" />
                        </View>

                        {/* Show Date/Time for Schedule OR Today */}
                        {(urgency === 'Schedule' || urgency === 'Today') && (
                            <Animated.View entering={FadeInDown.duration(400)} style={[styles.dateRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <TouchableOpacity
                                    style={[
                                        styles.dateInput,
                                        {
                                            backgroundColor: urgency === 'Today' ? theme.colors.background : theme.colors.surface, // Visual cue for disabled
                                            borderColor: theme.colors.border,
                                            flexDirection: isRTL ? 'row-reverse' : 'row',
                                            opacity: urgency === 'Today' ? 0.8 : 1
                                        }
                                    ]}
                                    onPress={() => setOpenDate(true)}
                                    disabled={urgency === 'Today'}
                                >
                                    <Icon name="calendar" size={20} color={theme.colors.primary} />
                                    <Text style={[styles.dateText, { color: scheduledDate ? theme.colors.text : theme.colors.textSecondary, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
                                        {scheduledDate ? scheduledDate.toLocaleDateString() : t('req_select_date')}
                                    </Text>
                                </TouchableOpacity>

                                <View style={{ width: 10 }} />

                                <TouchableOpacity
                                    style={[styles.dateInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                                    onPress={() => setOpenTime(true)}
                                >
                                    <Icon name="clock-outline" size={20} color={theme.colors.primary} />
                                    <Text style={[styles.dateText, { color: scheduledTime ? theme.colors.text : theme.colors.textSecondary, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
                                        {scheduledTime ? scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('req_select_time')}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }]}>{t('ib_details')}</Text>
                        <View style={[styles.textAreaContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <TextInput
                                placeholder={t('ib_details_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                style={[styles.textArea, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Footer Button */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
                    <TouchableOpacity
                        style={[styles.findBtn, { backgroundColor: theme.colors.primary, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                        onPress={handleBooking}
                    >
                        <Text style={[styles.findBtnText, { marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]}>
                            {providerName ? t('ib_confirm_req') : t('ib_find_providers')}
                        </Text>
                        <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={20} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>

                <CustomToast
                    visible={showToast}
                    message={`${t('ib_success_msg')} ${providerName || t('ib_providers')}!`}
                    type="success"
                    onHide={() => setShowToast(false)}
                />

                <DatePicker
                    modal
                    open={openDate}
                    date={date}
                    mode="date"
                    theme={isDarkMode ? 'dark' : 'light'}
                    onConfirm={(date: Date) => {
                        setOpenDate(false);
                        setScheduledDate(date);
                    }}
                    onCancel={() => setOpenDate(false)}
                />

                <DatePicker
                    modal
                    open={openTime}
                    date={date}
                    mode="time"
                    theme={isDarkMode ? 'dark' : 'light'}
                    onConfirm={(date: Date) => {
                        setOpenTime(false);
                        setScheduledTime(date);
                    }}
                    onCancel={() => setOpenTime(false)}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('2%'),
        paddingBottom: hp('2%'),

    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
    },
    content: {
        padding: wp('5%'),
        paddingBottom: hp('15%'),
    },
    sectionTitle: {
        fontSize: wp('4.2%'),
        fontWeight: '600',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: wp('4%'),
    },
    urgencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    urgencyBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 4,
    },
    urgencyText: {
        marginTop: 5,
        fontWeight: '600',
        fontSize: wp('3.5%'),
    },
    textAreaContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        height: 100,
    },
    textArea: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: wp('4%'),
    },
    footer: {
        padding: wp('5%'),
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    findBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    findBtnText: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginRight: 8,
    },
    dateRow: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
    },
    dateText: {
        marginLeft: 10,
        fontWeight: '500',
    },
});

export default InstantBookingScreen;
