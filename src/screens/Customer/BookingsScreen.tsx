import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, StatusBar, Platform, Dimensions, Animated, LayoutAnimation, UIManager, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookingsScreen = () => {
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Completed');

    // Standard Animated API for Tab Indicator
    const tabTranslateX = useRef(new Animated.Value(0)).current;

    const tabs = [
        { key: 'Completed', label: t('bk_completed') },
        { key: 'Awaiting', label: t('bk_awaiting') },
        { key: 'Unsuccessful', label: t('bk_unsuccessful') }
    ];

    const tabWidth = (wp('92%') - 8) / 3;

    useEffect(() => {
        const index = tabs.findIndex(t => t.key === selectedTab);
        const toValue = isRTL ? -(index * tabWidth) : index * tabWidth;

        Animated.spring(tabTranslateX, {
            toValue,
            damping: 20,
            stiffness: 100,
            useNativeDriver: true,
        }).start();

        // Trigger LayoutAnimation for the list items
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [selectedTab, isRTL]);

    const bookings = [
        {
            id: '1',
            title: 'Premium Home Deep Cleaning',
            subtitle: 'Residential cleaning service',
            provider: 'Maryland Winkles',
            date: '20-06-2024',
            time: '10:00 AM',
            price: '$120',
            status: 'Completed',
            image: require('../../assets/images/category/booked.png')
        },
        {
            id: '2',
            title: 'Lawn Mowing & Grooming',
            subtitle: 'Professional Garden Care',
            provider: 'John Smith',
            date: '22-06-2024',
            time: '02:30 PM',
            price: '$45',
            status: 'Awaiting',
            image: require('../../assets/images/category/booked.png')
        },
        {
            id: '3',
            title: 'Emergency Tap Repair',
            subtitle: 'Plumbing & Kitchen Maintenance',
            provider: 'Alex Johnson',
            date: '18-06-2024',
            time: '11:15 AM',
            price: '$35',
            status: 'Unsuccessful',
            image: require('../../assets/images/category/booked.png')
        }
    ];

    const filteredBookings = useMemo(() =>
        bookings.filter(b => b.status === selectedTab),
        [selectedTab]);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Completed': return { color: '#10B981', label: t('bk_completed'), icon: 'check-all' };
            case 'Awaiting': return { color: '#F59E0B', label: t('bk_awaiting'), icon: 'clock-fast' };
            case 'Unsuccessful': return { color: '#EF4444', label: t('bk_redo'), icon: 'alert-circle-outline' };
            default: return { color: '#6B7280', label: 'Unknown', icon: 'help-circle' };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const status = getStatusInfo(item.status);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => (navigation as any).navigate('BookingDetail', { booking: item })}
                style={styles.cardWrapper}
            >
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }
                    ]}
                >
                    {/* Visual Side Column */}
                    <View style={styles.sideColumn}>
                        <Image source={item.image} style={styles.bookingImage} />
                        <View style={[styles.statusIndicator, { backgroundColor: status.color }]} />
                    </View>

                    {/* Content Column */}
                    <View style={[styles.mainContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={[styles.bookingTitle, { color: theme.colors.text }]} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </View>

                        <View style={[styles.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.metaItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="account-circle-outline" size={14} color={theme.colors.primary} />
                                <Text style={[styles.metaText, { color: theme.colors.text }]}>{item.provider}</Text>
                            </View>
                            <View style={styles.dotSeparator} />
                            <Text style={[styles.categoryText, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                        </View>

                        {/* Schedule & Price Row */}
                        <View style={[styles.scheduleRow, { backgroundColor: isDarkMode ? '#FFFFFF05' : '#F9FAFB', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.scheduleItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="calendar-month-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.scheduleText, { color: theme.colors.text }]}>{item.date}</Text>
                            </View>
                            <View style={[styles.scheduleItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="clock-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.scheduleText, { color: theme.colors.text }]}>{item.time}</Text>
                            </View>
                        </View>

                        <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.statusBadge, { backgroundColor: status.color + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name={status.icon} size={14} color={status.color} />
                                <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                            </View>
                            <Text style={[styles.bookingPrice, { color: theme.colors.primary }]}>{item.price}</Text>
                        </View>
                    </View>

                    {/* Floating Chat Btn */}
                    <TouchableOpacity
                        style={[styles.chatBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={() => (navigation as any).navigate('Chat')}
                    >
                        <Icon name="message-text-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            <View style={styles.header}>
                <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        <Text style={[styles.headerBrand, { color: theme.colors.primary }]}>BEATASK</Text>
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('bk_title')}</Text>
                    </View>
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Icon name="tune" size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Premium Tab Bar */}
            <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.tabsInner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Animated.View
                        style={[
                            styles.activeIndicator,
                            {
                                backgroundColor: theme.colors.primary,
                                width: tabWidth,
                                transform: [{ translateX: tabTranslateX }]
                            }
                        ]}
                    />
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tabItem}
                            onPress={() => setSelectedTab(tab.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                {
                                    color: selectedTab === tab.key ? '#FFF' : theme.colors.textSecondary,
                                    fontWeight: selectedTab === tab.key ? '800' : '600'
                                }
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredBookings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.primary + '10' }]}>
                            <Icon name="calendar-clock" size={80} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('bk_no_bookings')}</Text>
                        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                            Looks like you haven't made any {selectedTab.toLowerCase()} bookings yet.
                        </Text>
                        <TouchableOpacity
                            style={[styles.exploreBtn, { backgroundColor: theme.colors.primary }]}
                            onPress={() => (navigation as any).navigate('Home')}
                        >
                            <Text style={styles.exploreBtnText}>Find Services</Text>
                            <Icon name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? hp('7%') : hp('5%'),
        paddingBottom: hp('2%'),
        paddingHorizontal: wp('5%'),
    },
    headerTop: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerBrand: {
        fontSize: wp('3%'),
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: wp('7.5%'),
        fontWeight: '900',
    },
    filterBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabsContainer: {
        marginHorizontal: wp('4%'),
        borderRadius: 20,
        padding: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        marginBottom: 16,
    },
    tabsInner: {
        height: 50,
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        height: '100%',
        borderRadius: 16,
        zIndex: 0,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    tabText: {
        fontSize: wp('3.5%'),
    },
    listContent: {
        padding: wp('4%'),
        paddingBottom: hp('15%'),
    },
    cardWrapper: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 28,
        padding: 12,
        borderWidth: 1,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        position: 'relative',
    },
    sideColumn: {
        alignItems: 'center',
    },
    bookingImage: {
        width: wp('22%'),
        height: wp('26%'),
        borderRadius: 20,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFF',
        position: 'absolute',
        top: 6,
        right: 6,
    },
    mainContent: {
        flex: 1,
        marginLeft: 16,
        marginRight: 16,
        justifyContent: 'space-between',
    },
    cardHeader: {
        marginBottom: 4,
    },
    bookingTitle: {
        fontSize: wp('4.2%'),
        fontWeight: '800',
    },
    metaRow: {
        alignItems: 'center',
        marginBottom: 12,
    },
    metaItem: {
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CCC',
        marginHorizontal: 8,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '500',
    },
    scheduleRow: {
        padding: 8,
        borderRadius: 12,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    scheduleItem: {
        alignItems: 'center',
    },
    scheduleText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    cardFooter: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '800',
        marginLeft: 6,
    },
    bookingPrice: {
        fontSize: 18,
        fontWeight: '900',
    },
    chatBtn: {
        position: 'absolute',
        top: -10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('10%'),
        paddingHorizontal: wp('10%'),
    },
    emptyIconCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: wp('6%'),
        fontWeight: '900',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: wp('4%'),
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    exploreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 18,
        elevation: 6,
    },
    exploreBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BookingsScreen;
