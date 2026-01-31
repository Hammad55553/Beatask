import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, StatusBar, Platform, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface Item {
    id: string;
    name: string;
    profession: string;
    description: string;
    image: any;
    rating: number;
    reviews: number;
    price: number;
    hourlyFrom: number;
    verified: boolean;
}

const mockProviders: Item[] = [
    {
        id: '1',
        name: 'Benjamin Wilson',
        profession: 'Professional Cleaner',
        description: 'Specialized in deep cleaning and organizing. 5 years experience.',
        image: { uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500' },
        rating: 4.8,
        reviews: 124,
        price: 25,
        hourlyFrom: 20,
        verified: true,
    },
    {
        id: '2',
        name: 'John Doe',
        profession: 'Certified Plumber',
        description: 'Emergency plumbing repairs and installations.',
        image: { uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500' },
        rating: 4.9,
        reviews: 89,
        price: 45,
        hourlyFrom: 40,
        verified: true,
    },
    {
        id: '3',
        name: 'Michael Chen',
        profession: 'Electrician',
        description: 'Industrial and residential wiring expert.',
        image: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
        rating: 4.7,
        reviews: 56,
        price: 35,
        hourlyFrom: 30,
        verified: false,
    },
    {
        id: '4',
        name: 'Emily Parker',
        profession: 'Event Planner',
        description: 'Making your special days unforgettable.',
        image: { uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500' },
        rating: 5.0,
        reviews: 42,
        price: 60,
        hourlyFrom: 50,
        verified: true,
    },
    {
        id: '5',
        name: 'David Miller',
        profession: 'Carpenter',
        description: 'Custom furniture and woodwork restoration.',
        image: { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500' },
        rating: 4.6,
        reviews: 31,
        price: 40,
        hourlyFrom: 35,
        verified: true,
    },
];

const ProviderCard = ({ item, index, theme, onPress, t, isRTL }: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { scale.value = withSpring(0.98); };
    const handlePressOut = () => { scale.value = withSpring(1); };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500).springify()}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={[
                    styles.cardInner,
                    animatedStyle,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }
                ]}>
                    <View style={styles.imageWrapper}>
                        <Image source={item.image} style={styles.image} resizeMode="cover" />
                        <View style={[styles.priceBadge, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.priceValue}>${item.hourlyFrom}</Text>
                            <Text style={styles.priceUnit}>/hr</Text>
                        </View>
                    </View>

                    <View style={[styles.infoColumn, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <View style={[styles.nameRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <Text style={[styles.nameText, { color: theme.colors.text }]} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    {item.verified && (
                                        <Icon name="check-decagram" size={16} color="#12CCB7" style={{ marginHorizontal: 4 }} />
                                    )}
                                </View>
                                <Text style={[styles.professionText, { color: theme.colors.primary }]} numberOfLines={1}>
                                    {item.profession}
                                </Text>
                            </View>
                            <View style={[styles.ratingPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="star" size={14} color="#FBBF24" />
                                <Text style={[styles.ratingVal, { color: theme.colors.text }]}>{item.rating}</Text>
                            </View>
                        </View>

                        <Text style={[styles.descText, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                            {item.description}
                        </Text>

                        <View style={[styles.bottomRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.statItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="comment-text-outline" size={14} color={theme.colors.textSecondary} />
                                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                                    {item.reviews} {t('pp_reviews')}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                                onPress={onPress}
                            >
                                <Text style={styles.actionBtnText}>{t('cd_book_now')}</Text>
                                <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const CategoryDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();

    const { category } = (route.params as { category?: string }) || {};
    const title = category || t('cd_providers');

    const [sortVisible, setSortVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Recommended');

    const handleBack = () => navigation.goBack();

    const getSortedProviders = () => {
        let sorted = [...mockProviders];
        switch (sortBy) {
            case 'Highest Rated':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'Price: Low to High':
                return sorted.sort((a, b) => a.hourlyFrom - b.hourlyFrom);
            case 'Price: High to Low':
                return sorted.sort((a, b) => b.hourlyFrom - a.hourlyFrom);
            default:
                return sorted;
        }
    };

    const handleSort = (option: string) => {
        setSortBy(option);
        setSortVisible(false);
    };

    const handleProviderPress = (provider: Item) => {
        (navigation as any).navigate('ProviderProfile', { providerId: provider.id });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Header */}
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={handleBack} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
                <TouchableOpacity onPress={() => setSortVisible(true)} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Icon name="tune-vertical" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={getSortedProviders()}
                renderItem={({ item, index }) => (
                    <ProviderCard
                        item={item}
                        index={index}
                        theme={theme}
                        t={t}
                        isRTL={isRTL}
                        onPress={() => handleProviderPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.primary + '10' }]}>
                            <Icon name="account-search-outline" size={60} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.emptyText, { color: theme.colors.text }]}>{t('cd_no_providers')}</Text>
                    </View>
                }
            />

            {/* Sort Modal */}
            <Modal
                visible={sortVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSortVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSortVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.modalIndicator} />
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('cd_sort')}</Text>
                        {[t('cd_recommended'), t('cd_highest_rated'), t('cd_low_high'), t('cd_high_low')].map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.modalOption, { borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                                onPress={() => handleSort(opt)}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    { color: sortBy === opt ? theme.colors.primary : theme.colors.text, fontWeight: sortBy === opt ? 'bold' : 'normal' }
                                ]}>
                                    {opt}
                                </Text>
                                {sortBy === opt && <Icon name="check-circle" size={22} color={theme.colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
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
        paddingVertical: hp('2%'),
    },
    headerTitle: {
        fontSize: wp('5.5%'),
        fontWeight: '800',
        flex: 1,
        textAlign: 'center',
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    listContent: {
        paddingHorizontal: wp('5%'),
        paddingTop: 10,
        paddingBottom: hp('5%'),
    },
    cardContainer: {
        marginBottom: 16,
    },
    cardInner: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        padding: 12,
    },
    imageWrapper: {
        width: wp('26%'),
        height: wp('32%'),
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    priceBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    priceValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    priceUnit: {
        color: '#FFF',
        fontSize: 10,
        opacity: 0.8,
    },
    infoColumn: {
        flex: 1,
        marginLeft: 15,
        marginRight: 10,
        justifyContent: 'space-between',
    },
    topRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nameRow: {
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    professionText: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 2,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    ratingVal: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    descText: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
    actionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: -8, // Nudge slightly to the right
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
        marginRight: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp('15%'),
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: hp('5%'),
    },
    modalIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#DDD',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 18,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalOptionText: {
        fontSize: 16,
    },
});

export default CategoryDetailsScreen;
