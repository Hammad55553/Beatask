import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    TextInput,
    Platform,
    StatusBar,
    LayoutAnimation,
    UIManager,
    Alert,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Provider {
    id: string;
    name: string;
    description: string;
    image: any;
    rating: number;
    reviews: number;
    hourlyFrom: number;
    category: string;
    verified?: boolean;
}

const INITIAL_DATA: Provider[] = [
    {
        id: '1',
        name: 'Benjamin Wilson',
        description: 'Expert in residential cleaning services, lawn care and trimming.',
        image: require('../../assets/images/category/booked.png'),
        rating: 4.5,
        reviews: 24,
        hourlyFrom: 20,
        category: 'Cleaning',
        verified: true
    },
    {
        id: '2',
        name: 'Maryland Winkles',
        description: 'Professional electrician with 10 years of experience.',
        image: require('../../assets/images/category/booked.png'),
        rating: 5.0,
        reviews: 32,
        hourlyFrom: 35,
        category: 'Electrician',
        verified: true
    },
    {
        id: '3',
        name: 'John Doe',
        description: 'Expert in gardening and landscaping.',
        image: require('../../assets/images/category/booked.png'),
        rating: 4.8,
        reviews: 45,
        hourlyFrom: 25,
        category: 'Gardening',
        verified: false
    },
    {
        id: '4',
        name: 'Jane Smith',
        description: 'Interior design expert with creative solutions.',
        image: require('../../assets/images/category/booked.png'),
        rating: 4.2,
        reviews: 50,
        hourlyFrom: 30,
        category: 'Design',
        verified: true
    }
];

const ProviderCard = ({ item, index, theme, onRemove, t, isRTL, onPress }: any) => {
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
                                <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 2 }]}>
                                    <Icon name="star" size={14} color="#FBBF24" />
                                    <Text style={[styles.ratingVal, { color: theme.colors.text }]}>{item.rating}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
                                <Icon name="heart" size={24} color="#FF5252" />
                            </TouchableOpacity>
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
                                <Text style={styles.actionBtnText}>{t('sp_view_profile')}</Text>
                                <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const SavedProvidersScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const [savedProviders, setSavedProviders] = useState(INITIAL_DATA);
    const [filteredProviders, setFilteredProviders] = useState(INITIAL_DATA);

    useEffect(() => {
        const filtered = savedProviders.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProviders(filtered);
    }, [searchQuery, savedProviders]);

    const handleRemove = (id: string) => {
        Alert.alert(
            t('sp_title'),
            t('sp_remove_confirm'),
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setSavedProviders(prev => prev.filter(p => p.id !== id));
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

            {/* Header */}
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={26} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('sp_title')}</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Icon name="magnify" size={22} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('sp_search_placeholder')}
                        placeholderTextColor={theme.colors.textSecondary + '80'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close-circle" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Providers List or Empty State */}
            {filteredProviders.length > 0 ? (
                <FlatList
                    data={filteredProviders}
                    renderItem={({ item, index }) => (
                        <ProviderCard
                            item={item}
                            index={index}
                            theme={theme}
                            onRemove={handleRemove}
                            t={t}
                            isRTL={isRTL}
                            onPress={() => (navigation as any).navigate('ProviderProfile', { provider: item })}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.primary + '10' }]}>
                        <Icon name="heart-outline" size={60} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                        {searchQuery === '' ? t('sp_no_saved') : t('sp_no_results')}
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        {searchQuery === ''
                            ? "Items you save will appear here for quick access."
                            : "Try searching for a different name or service."}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    headerTitle: {
        fontSize: wp('6%'),
        fontWeight: '900',
        flex: 1,
        textAlign: 'center',
    },
    searchSection: {
        paddingHorizontal: wp('5%'),
        marginBottom: 10,
    },
    searchContainer: {
        height: 55,
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: 10,
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
    removeBtn: {
        padding: 4,
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
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingVal: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 11,
        marginLeft: 4,
        fontWeight: '500',
    },
    actionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: -8, // Increased nudge for better fit
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
        marginRight: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('10%'),
        marginTop: -hp('10%'),
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default SavedProvidersScreen;
