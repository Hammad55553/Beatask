import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Platform, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const BookingDetailScreen = () => {
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();
    const navigation = useNavigation();
    const route = useRoute();
    const { booking } = (route.params as { booking: any }) || {};

    if (!booking) return null;

    const getStatusColors = (status: string) => {
        switch (status) {
            case 'Completed': return { bg: '#E0F7F4', text: '#12CCB7', icon: 'check-circle' };
            case 'Awaiting': return { bg: '#FFF4E5', text: '#FFA000', icon: 'clock-outline' };
            case 'Unsuccessful': return { bg: '#FFE9E9', text: '#FF5252', icon: 'alert-circle-outline' };
            default: return { bg: '#F5F5F5', text: '#757575', icon: 'help-circle-outline' };
        }
    };

    const statusColors = getStatusColors(booking.status);

    const DetailSection = ({ title, children, icon }: any) => (
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Icon name={icon} size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>{title}</Text>
            </View>
            {children}
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                        <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('bd_title')}</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Status Banner */}
                    <Animated.View entering={FadeIn.duration(600)} style={[styles.statusBanner, { backgroundColor: isDarkMode ? statusColors.text + '20' : statusColors.bg, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Icon name={statusColors.icon} size={24} color={statusColors.text} />
                        <View style={{ marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, flex: 1 }}>
                            <Text style={[styles.statusLabel, { color: statusColors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                {booking.status === 'Unsuccessful' ? t('bk_redo') : t(`bk_${booking.status.toLowerCase()}` as any)}
                            </Text>
                            <Text style={[styles.bookingId, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{t('bd_booking_id')}: #BT-99281</Text>
                        </View>
                    </Animated.View>

                    {/* Service Info */}
                    <DetailSection title={t('bd_service_info')} icon="tools">
                        <View style={[styles.serviceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Image source={booking.image} style={styles.serviceImage} />
                            <View style={{ flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <Text style={[styles.serviceName, { color: theme.colors.text }]}>{booking.title}</Text>
                                <Text style={[styles.serviceCategory, { color: theme.colors.textSecondary }]}>{booking.subtitle}</Text>
                            </View>
                        </View>
                    </DetailSection>

                    {/* Provider Info */}
                    <DetailSection title={t('bd_provider_info')} icon="account-tie">
                        <View style={[styles.providerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={styles.providerAvatarPlaceholder}>
                                <Text style={styles.avatarText}>{booking.provider[0]}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <Text style={[styles.providerName, { color: theme.colors.text }]}>{booking.provider}</Text>
                                <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <Icon name="star" size={14} color="#FFA000" />
                                    <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}> 4.9 (124 reviews)</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => (navigation as any).navigate('Chat')} style={[styles.msgBtn, { backgroundColor: theme.colors.primary + '15' }]}>
                                <Icon name="message-text-outline" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </DetailSection>

                    {/* Time & Location */}
                    <DetailSection title={t('bd_date_time')} icon="calendar-clock">
                        <View style={[styles.infoItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Icon name="calendar-range" size={18} color={theme.colors.textSecondary} />
                            <Text style={[styles.infoVal, { color: theme.colors.text, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}>{booking.date} at {booking.time}</Text>
                        </View>
                        <View style={[styles.infoItem, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 12 }]}>
                            <Icon name="map-marker-outline" size={18} color={theme.colors.textSecondary} />
                            <Text style={[styles.infoVal, { color: theme.colors.text, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}>123 Business Avenue, Suite 100, NY</Text>
                        </View>
                    </DetailSection>

                    {/* Payment Summary */}
                    <DetailSection title={t('bd_payment_summary')} icon="credit-card-outline">
                        <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={{ color: theme.colors.textSecondary }}>{t('bd_total')}</Text>
                            <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 18 }}>{booking.price}</Text>
                        </View>
                        <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 8 }]}>
                            <Text style={{ color: theme.colors.textSecondary }}>{t('bd_paid')} via Visa **** 4242</Text>
                            <Icon name="check-circle" size={18} color="#12CCB7" />
                        </View>
                    </DetailSection>

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        {booking.status === 'Awaiting' && (
                            <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: theme.colors.primary }]}>
                                <Text style={styles.mainActionText}>{t('bd_track')}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: theme.colors.error || '#FF5252' }]}>
                            <Text style={[styles.secondaryActionText, { color: theme.colors.error || '#FF5252' }]}>{t('bd_cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.helpBtn}>
                            <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>{t('bd_help')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: wp('5%'),
        paddingBottom: hp('5%'),
    },
    statusBanner: {
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    statusLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bookingId: {
        fontSize: 13,
        marginTop: 2,
    },
    section: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    serviceCategory: {
        fontSize: 13,
        marginTop: 2,
    },
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    providerAvatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    providerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        fontSize: 12,
    },
    msgBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoVal: {
        fontSize: 14,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionsContainer: {
        marginTop: 10,
    },
    mainActionBtn: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    mainActionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryActionBtn: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryActionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    helpBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    helpText: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    }
});

export default BookingDetailScreen;
