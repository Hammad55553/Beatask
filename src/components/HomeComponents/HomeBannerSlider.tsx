import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    ImageSourcePropType
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface BannerItem {
    id: string;
    titleKey: string;
    subtitleKey: string;
    discount: string;
    image: ImageSourcePropType;
    bgColor: string;
    imageScale: number;
}

const HomeBannerSlider = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const { theme, isDarkMode } = useTheme();
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners: BannerItem[] = [
        {
            id: '1',
            titleKey: 'banner_cleaning_title', // "Home Cleaning"
            subtitleKey: 'banner_cleaning_sub', // "Get your house sparkling clean"
            discount: '30% OFF',
            image: require('../../assets/images/category/Home2.jpg'),
            bgColor: '#4FC3F7',
            imageScale: 1.1
        },
        {
            id: '2',
            titleKey: 'banner_ac_title', // "AC Repair"
            subtitleKey: 'banner_ac_sub', // "Cool down this summer"
            discount: '25% OFF',
            image: require('../../assets/images/category/Troubleshooting.jpg'),
            bgColor: '#FFB74D',
            imageScale: 1.0
        },
        {
            id: '3',
            titleKey: 'banner_painting_title', // "Painting Services"
            subtitleKey: 'banner_painting_sub', // "Color your world"
            discount: '15% OFF',
            image: require('../../assets/images/category/Home1.jpg'),
            bgColor: '#9575CD',
            imageScale: 1.0
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
            setCurrentIndex(nextIndex);

            // Only scroll if ref is attached
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        // Approximation for index based on scroll position + padding/margin logic
        // Using simplified logic or just keeping auto-scroll state
        const index = Math.round(contentOffsetX / (width - wp('8%')));
        if (index !== currentIndex && index >= 0 && index < banners.length) {
            setCurrentIndex(index);
        }
    };

    const BannerCard = ({ item }: { item: BannerItem }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.cardContainer, { width: width - wp('8%'), backgroundColor: item.bgColor }]}
                onPress={() => (navigation as any).navigate('CategoryDetails', { category: 'Offer' })}
            >
                {/* Background Pattern / Gradient Simulation */}
                <View style={styles.patternOverlay} />

                {/* Content */}
                <View style={styles.textContainer}>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                    <Text style={styles.bannerTitle} numberOfLines={2}>
                        {t(item.titleKey as any)}
                    </Text>
                    <Text style={styles.bannerSub} numberOfLines={2}>
                        {t(item.subtitleKey as any)}
                    </Text>

                    <View style={styles.bookNowBtn}>
                        <Text style={[styles.bookNowText, { color: item.bgColor }]}>{t('btn_book_now') || 'Book Now'}</Text>
                    </View>
                </View>

                {/* Constant Image */}
                <Image
                    source={item.image}
                    style={[styles.bannerImage, { transform: [{ scale: item.imageScale }] }]}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={banners}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - wp('8%') + wp('4%')} // Card width + gap
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                renderItem={({ item }) => (
                    <View style={{ width: width - wp('8%'), marginRight: wp('4%') }}>
                        <BannerCard item={item} />
                    </View>
                )}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            // Removed key prop causing re-renders
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index === currentIndex ? theme.colors.primary : '#E0E0E0',
                                width: index === currentIndex ? 20 : 8
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp('2%'),
    },
    cardContainer: {
        height: hp('15%'),
        borderRadius: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        // Removed Shadow per user request earlier
    },
    patternOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)', // Subtle darken
    },
    textContainer: {
        flex: 1,
        padding: 20,
        paddingRight: 10,
        justifyContent: 'center',
        zIndex: 2,
    },
    discountBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    discountText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#333',
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    bannerSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
    },
    bookNowBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    bookNowText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    bannerImage: {
        width: '45%',
        height: '110%',
        resizeMode: 'cover',
        alignSelf: 'flex-end',
        marginRight: -10, // Slight overflow feeling
        marginBottom: -10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    }
});

export default HomeBannerSlider;
