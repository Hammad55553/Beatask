import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface Provider {
    id: string;
    name: string;
    description?: string;
    image: any;
    rating?: number;
    reviews?: string;
    price?: string;
    oldPrice?: string;
    discount?: string;
}

interface FeaturedSectionProps {
    title: string;
    data: Provider[];
    type: 'provider' | 'service' | 'deal';
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ title, data, type }) => {
    const navigation = useNavigation();
    const { isDarkMode, theme } = useTheme();
    const { t, isRTL } = useLanguage();
    const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});

    const toggleLike = (id: string) => {
        setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePress = () => {
        (navigation as any).navigate('ProviderProfile');
    };

    const renderCard = ({ item, index }: { item: Provider, index: number }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, {
                backgroundColor: theme.colors.surface,
                marginLeft: index === 0 ? wp('5%') : 0,
                marginRight: wp('4%'),
                borderColor: theme.colors.border,
            }]}
            onPress={handlePress}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.imageOverlay} />

                {/* Badges */}
                <View style={[styles.badgeLayer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {type === 'deal' && item.discount ? (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{item.discount}</Text>
                        </View>
                    ) : (
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.primary }]}>
                            <Icon name="check-decagram" size={12} color="#FFF" />
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.likeBtn}
                        onPress={() => toggleLike(item.id)}
                    >
                        <Icon
                            name={likedItems[item.id] ? 'heart' : 'heart-outline'}
                            size={18}
                            color={likedItems[item.id] ? '#FF4b4b' : '#666'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Rating Overlay */}
                {item.rating && (
                    <View style={[styles.ratingPill, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Icon name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>
                            {item.rating} <Text style={styles.reviewCount}>({item.reviews})</Text>
                        </Text>
                    </View>
                )}
            </View>

            {/* Content Section */}
            <View style={[styles.cardInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.cardName, { color: theme.colors.text }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[styles.cardDesc, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                    {item.description || "Expert Professional"}
                </Text>

                <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {type !== 'provider' ? (
                        <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                            <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text style={[styles.currentPrice, { color: theme.colors.primary }]}>${item.price}</Text>
                                {item.oldPrice && (
                                    <Text style={styles.oldPrice}>${item.oldPrice}</Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.statusRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={styles.onlineStatus} />
                            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Available</Text>
                        </View>
                    )}

                    <View style={[styles.nextBtn, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} color={theme.colors.primary} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
                <TouchableOpacity
                    style={[styles.seeAllBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={() => (navigation as any).navigate('SectionList', { title, type, data })}
                >
                    <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>{t('cat_see_all')}</Text>
                    <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={18} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp('3%'),
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: wp('4.8%'),
        fontWeight: '800',
    },
    seeAllBtn: {
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '700',
    },
    listContainer: {
        paddingBottom: 10,
    },
    card: {
        width: wp('55%'),
        borderRadius: 24,
        padding: 10,
        borderWidth: 1,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    imageContainer: {
        width: '100%',
        height: hp('16%'),
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    badgeLayer: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    verifiedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    discountBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    discountText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    likeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    ratingPill: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#222',
        marginLeft: 3,
    },
    reviewCount: {
        fontWeight: '400',
        color: '#666',
        fontSize: 10,
    },
    cardInfo: {
        paddingHorizontal: 4,
    },
    cardName: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 10,
    },
    cardFooter: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceRow: {
        alignItems: 'baseline',
    },
    currentPrice: {
        fontSize: 18,
        fontWeight: '900',
    },
    oldPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#AAA',
        marginLeft: 6,
    },
    statusRow: {
        alignItems: 'center',
    },
    onlineStatus: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    nextBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FeaturedSection;
