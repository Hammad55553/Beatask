import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions, Image, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

// --- Reusable Card Component ---
const SectionCard = ({ item, index, theme, viewMode, type, onPress, isLiked, onToggleLike, t }: any) => {
    const scale = useSharedValue(1);
    const isGrid = viewMode === 'grid';
    const isProvider = type === 'provider';

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { scale.value = withSpring(0.98); };
    const handlePressOut = () => { scale.value = withSpring(1); };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 10).duration(300).springify()}
            style={[
                styles.cardContainer,
                isGrid ? { width: (width - wp('8%')) / 2 - 5 } : { width: '100%' }
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={[
                    styles.cardInner,
                    animatedStyle,
                    {
                        backgroundColor: theme.colors.surface,
                        flexDirection: isGrid ? 'column' : 'row',
                        // Fixed height for grid, auto for list
                        height: isGrid ? hp('24%') : hp('12%'),

                        // Style per user preference
                        borderWidth: 1,
                        borderColor: isProvider ? theme.colors.primary + '20' : theme.colors.border,
                        elevation: 0,
                    }
                ]}>
                    {/* Image Section */}
                    <View style={[
                        styles.imageWrapper,
                        !isGrid && { width: hp('12%'), height: '100%' }
                    ]}>
                        <Image source={item.image} style={styles.image} />

                        {/* Overlays - Show in both Grid and List */}
                        <View style={styles.overlay} />
                        {type === 'deal' && item.discount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{item.discount}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.favBtn}
                            onPress={onToggleLike}
                        >
                            <Icon
                                name={isLiked ? "heart" : "heart-outline"}
                                size={18}
                                color={isLiked ? "#FF4B4B" : "#FFF"}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Content Section */}
                    <View style={[
                        styles.contentContainer,
                        !isGrid && { flex: 1, paddingVertical: 10, paddingHorizontal: 15, justifyContent: 'center' }
                    ]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[
                                styles.title,
                                { color: theme.colors.text, fontSize: isGrid ? wp('3.8%') : wp('4.2%') }
                            ]} numberOfLines={1}>
                                {item.name}
                            </Text>

                            {/* Provider/Service Description */}
                            {type === 'provider' && (
                                <Text style={[styles.subTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                                    {item.description || t('txt_pro_service' as any)}
                                </Text>
                            )}

                            {/* Reviews/Rating */}
                            {item.rating && (
                                <View style={styles.ratingRow}>
                                    <Icon name="star" size={14} color="#FFD700" />
                                    <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                                        {item.rating} ({item.reviews || '0'})
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Footer: Price or Action */}
                        <View style={styles.footerRow}>
                            {item.price ? (
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={[styles.price, { color: theme.colors.primary }]}>${item.price}</Text>
                                    {item.oldPrice && (
                                        <Text style={[styles.oldPrice, { color: theme.colors.textSecondary }]}>${item.oldPrice}</Text>
                                    )}
                                </View>
                            ) : (
                                // Provider status or generic
                                <View style={styles.statusBadge}>
                                    <View style={styles.dot} />
                                    <Text style={{ fontSize: 10, color: theme.colors.textSecondary }}>{t('txt_available' as any)}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={[styles.bookBtn, { backgroundColor: theme.colors.primary + '10' }]}>
                                <Icon name="arrow-right" size={18} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- Main Screen ---
const SectionListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t } = useLanguage();

    // Params passed from navigation
    const { title, type, data } = route.params as { title: string, type: 'provider' | 'service' | 'deal', data: any[] };

    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});

    const filteredData = data ? data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    ) : [];

    const handleBack = () => navigation.goBack();

    const toggleLike = (id: string) => {
        setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>

                {/* View Switcher */}
                <View style={[styles.viewToggle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.toggleBtn, viewMode === 'grid' && { backgroundColor: theme.colors.primary + '20' }]}>
                        <Icon name="view-grid" size={20} color={viewMode === 'grid' ? theme.colors.primary : theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: theme.colors.primary + '20' }]}>
                        <Icon name="format-list-bulleted" size={20} color={viewMode === 'list' ? theme.colors.primary : theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Icon name="magnify" size={24} color={theme.colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder={`${t('txt_search_placeholder' as any)} ${type}...`}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Content */}
            <FlatList
                key={viewMode}
                data={filteredData}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <SectionCard
                        item={item}
                        index={index}
                        theme={theme}
                        t={t} // Pass t function
                        viewMode={viewMode}
                        type={type}
                        onPress={() => (navigation as any).navigate('ProviderProfile', { id: item.id })}
                        isLiked={likedItems[item.id]}
                        onToggleLike={() => toggleLike(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="information-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>{t('txt_no_items' as any)}</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
        marginTop: hp('4%'), // Added top margin
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    viewToggle: {
        flexDirection: 'row',
        padding: 3,
        borderRadius: 10,
        borderWidth: 1,
    },
    toggleBtn: {
        padding: 6,
        borderRadius: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp('4%'),
        marginBottom: hp('2%'),
        paddingHorizontal: 15,
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    // Card Styles
    cardContainer: {
        marginBottom: hp('2%'),
    },
    cardInner: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        height: '60%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF3B30',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    discountText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    favBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: '700',
        marginBottom: 2,
    },
    subTitle: {
        fontSize: 12,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ratingText: {
        fontSize: 11,
        marginLeft: 4,
        fontWeight: '500',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    oldPrice: {
        fontSize: 11,
        textDecorationLine: 'line-through',
        marginLeft: 5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#34C759',
        marginRight: 4,
    },
    bookBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    emptyContainer: {
        marginTop: hp('20%'),
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
    }
});

export default SectionListScreen;
