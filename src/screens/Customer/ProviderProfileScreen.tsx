import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal, StatusBar, Dimensions, FlatList, ImageBackground, Platform } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeInDown, SlideInUp, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const PROFILE_IMAGE = require('../../assets/images/category/booked.png');
const USER_IMAGE = require('../../assets/images/category/user.png'); // Fallback

// --- Reusable Components ---

const InfoBadge = ({ icon, text, theme }: any) => (
    <View style={[styles.infoBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Icon name={icon} size={16} color={theme.colors.primary} />
        <Text style={[styles.infoBadgeText, { color: theme.colors.text }]}>{text}</Text>
    </View>
);

const ServiceItem = ({ name, price, duration, theme, formatPrice }: any) => (
    <View style={[styles.serviceItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.serviceInfo}>
            <Text style={[styles.serviceName, { color: theme.colors.text }]}>{name}</Text>
            <Text style={[styles.serviceDuration, { color: theme.colors.textSecondary }]}>{duration}</Text>
        </View>
        <Text style={[styles.servicePrice, { color: theme.colors.primary }]}>{formatPrice(price)}</Text>
        <TouchableOpacity style={[styles.addBtn, { borderColor: theme.colors.primary }]}>
            <Icon name="plus" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
    </View>
);

const ReviewItem = ({ name, review, rating, date, theme }: any) => (
    <View style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.reviewHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={USER_IMAGE} style={styles.reviewerImage} />
                <View>
                    <Text style={[styles.reviewerName, { color: theme.colors.text }]}>{name}</Text>
                    <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>{date}</Text>
                </View>
            </View>
            <View style={styles.ratingBadge}>
                <Icon name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingValue}>{rating}</Text>
            </View>
        </View>
        <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>{review}</Text>
    </View>
);

// --- Main Screen ---

const ProviderProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();
    const { formatPrice } = useCurrency();

    // Params (if any)
    const { id } = route.params as { id: string } || {};

    const [activeTab, setActiveTab] = useState('About');
    const [bookVisible, setBookVisible] = useState(false);
    const [isFav, setIsFav] = useState(false);

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const HEADER_MAX_HEIGHT = hp('32%');
    const HEADER_MIN_HEIGHT = hp('12%');

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, [0, 200], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], Extrapolate.CLAMP),
            opacity: interpolate(scrollY.value, [0, 200], [1, 0.9], Extrapolate.CLAMP),
        };
    });

    const handleMessage = () => {
        (navigation as any).navigate('Chat');
    };

    const handleBooking = () => {
        setBookVisible(true);
    };

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('dark-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor('transparent');
                StatusBar.setTranslucent(true);
            }
        }, [])
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Parallax Header */}
            <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
                <ImageBackground source={PROFILE_IMAGE} style={styles.headerImage} resizeMode="cover">
                    <View style={styles.headerOverlay} />
                    {/* Top Actions */}
                    <View style={styles.topActions}>
                        <TouchableOpacity style={styles.iconBtnBack} onPress={() => navigation.goBack()}>
                            <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFav(!isFav)}>
                                <Icon name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF4B4B" : "#FFF"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Icon name="share-variant" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </Animated.View>

            {/* Main Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: hp('35%'), paddingBottom: hp('12%') }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card Overlay */}
                <Animated.View
                    entering={SlideInUp.duration(600)}
                    style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}
                >
                    <View style={[styles.profileHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                            <Text style={[styles.providerName, { color: theme.colors.text }]}>Home Management</Text>
                            <Text style={[styles.providerCategory, { color: theme.colors.textSecondary }]}>Cleaning & Interior Design</Text>
                        </View>
                        <View style={styles.ratingBigBadge}>
                            <Icon name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingBigText}>4.8</Text>
                            <Text style={styles.reviewCount}>(4.4k)</Text>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <InfoBadge icon="map-marker" text="New York, USA" theme={theme} />
                        <InfoBadge icon="briefcase-check" text={`500+ ${t('pp_jobs')}`} theme={theme} />
                        <InfoBadge icon="shield-check" text={t('pp_verified')} theme={theme} />
                    </View>
                </Animated.View>

                {/* Tabs */}
                <View style={[styles.tabsContainer, { borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {['About', 'Services', 'Reviews'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabItem,
                                activeTab === tab && styles.activeTabItem,
                                activeTab === tab && { borderBottomColor: theme.colors.primary },
                                { marginRight: isRTL ? 0 : 25, marginLeft: isRTL ? 25 : 0 }
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText,
                                { color: activeTab === tab ? theme.colors.primary : theme.colors.textSecondary }
                            ]}>
                                {tab === 'About' ? t('pp_about') : tab === 'Services' ? t('pp_services') : t('pp_reviews')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                <View style={styles.contentSection}>
                    {activeTab === 'About' && (
                        <Animated.View entering={FadeInDown.duration(400)}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('pp_about_me')}</Text>
                            <Text style={[styles.bioText, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                                Expert in residential cleaning services, lawn care, and interior decorating.
                                We define success by our customer's satisfaction. With over 5 years of experience
                                in making homes beautiful and clean.
                            </Text>

                            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }]}>{t('pp_working_hours')}</Text>
                            <View style={[styles.workingHours, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text style={{ color: theme.colors.textSecondary }}>Mon - Fri</Text>
                                <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>09:00 AM - 06:00 PM</Text>
                            </View>
                        </Animated.View>
                    )}

                    {activeTab === 'Services' && (
                        <Animated.View entering={FadeInDown.duration(400)}>
                            <ServiceItem name="Deep Cleaning" price={120} duration="3 Hours" theme={theme} formatPrice={formatPrice} />
                            <ServiceItem name="Lawn Mowing" price={50} duration="1 Hour" theme={theme} formatPrice={formatPrice} />
                            <ServiceItem name="Standard Cleaning" price={80} duration="2 Hours" theme={theme} formatPrice={formatPrice} />
                            <ServiceItem name="Interior Consulting" price={200} duration="Consultation" theme={theme} formatPrice={formatPrice} />
                        </Animated.View>
                    )}

                    {activeTab === 'Reviews' && (
                        <Animated.View entering={FadeInDown.duration(400)}>
                            <ReviewItem
                                name="Sarah Connor"
                                date="2 days ago"
                                rating="5.0"
                                review="Absolutely amazing! My house has never looked this clean. Highly recommended!"
                                theme={theme}
                            />
                            <ReviewItem
                                name="John Wick"
                                date="1 week ago"
                                rating="4.5"
                                review="Very professional and quick. Did exactly what was asked."
                                theme={theme}
                            />
                        </Animated.View>
                    )}
                </View>
            </Animated.ScrollView>

            {/* Bottom Actions Footer */}
            <Animated.View entering={SlideInUp.delay(300)} style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                    <Text style={[styles.footerPriceLabel, { color: theme.colors.textSecondary }]}>{t('pp_starting_from')}</Text>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'baseline' }}>
                        <Text style={[styles.footerPrice, { color: theme.colors.primary }]}>{formatPrice(20)}</Text>
                        <Text style={[styles.footerUnit, { color: theme.colors.textSecondary }]}>/ hr</Text>
                    </View>
                </View>

                <View style={[styles.footerButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity style={[styles.chatBtn, { borderColor: theme.colors.border, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }]} onPress={handleMessage}>
                        <Icon name="message-text-outline" size={22} color={theme.colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.bookBtn, { backgroundColor: theme.colors.primary }]} onPress={handleBooking}>
                        <Text style={styles.bookBtnText}>{t('pp_book_now')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Booking Modal */}
            <Modal
                visible={bookVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setBookVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View entering={SlideInUp} style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('pp_select_booking')}</Text>
                            <TouchableOpacity onPress={() => setBookVisible(false)}>
                                <Icon name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalOption, { backgroundColor: theme.colors.background, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                            onPress={() => {
                                setBookVisible(false);
                                (navigation as any).navigate('InstantBooking', { providerName: 'Home Management', serviceName: 'Cleaning' });
                            }}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Icon name="lightning-bolt" size={24} color={theme.colors.primary} />
                            </View>
                            <View style={{ marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{t('pp_instant')}</Text>
                                <Text style={[styles.optionSub, { color: theme.colors.textSecondary }]}>{t('pp_instant_sub')}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalOption, { backgroundColor: theme.colors.background, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                            onPress={() => {
                                setBookVisible(false);
                                (navigation as any).navigate('BookingCalendar');
                            }}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FFD700' + '20' }]}>
                                <Icon name="calendar-clock" size={24} color="#FFA500" />
                            </View>
                            <View style={{ marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{t('pp_schedule')}</Text>
                                <Text style={[styles.optionSub, { color: theme.colors.textSecondary }]}>{t('pp_schedule_sub')}</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    topActions: {
        marginTop: StatusBar.currentHeight || 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    iconBtnBack: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 0, // Will be offset by ScrollView padding
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    providerName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    providerCategory: {
        fontSize: 14,
    },
    ratingBigBadge: {
        backgroundColor: '#FFF9E6', // Light yellow
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingBigText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewCount: {
        fontSize: 10,
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    infoBadgeText: {
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '500',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        borderBottomWidth: 1,
    },
    tabItem: {
        paddingVertical: 12,
        marginRight: 25,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    contentSection: {
        padding: 20,
        minHeight: 400,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bioText: {
        fontSize: 14,
        lineHeight: 22,
    },
    workingHours: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
    },
    // Service Item
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
    },
    serviceDuration: {
        fontSize: 12,
        marginTop: 2,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 15,
    },
    addBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Review Item
    reviewCard: {
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewDate: {
        fontSize: 12,
    },
    ratingBadge: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        color: '#333'
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 20,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: 30, // Safe area
        borderTopWidth: 1,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    footerPriceLabel: {
        fontSize: 12,
    },
    footerPrice: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    footerUnit: {
        fontSize: 14,
        marginLeft: 4,
    },
    footerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    bookBtn: {
        paddingHorizontal: 24,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    optionSub: {
        fontSize: 12,
    },
    confirmBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ProviderProfileScreen;
