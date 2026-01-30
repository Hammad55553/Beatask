import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, useColorScheme } from 'react-native';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

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
    data: Provider[]; // We'll pass specific data for different sections
    type: 'provider' | 'service' | 'deal';
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ title, data, type }) => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});

    const toggleLike = (id: string) => {
        setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePress = () => {
        (navigation as any).navigate('ProviderProfile');
    };

    // Group data into pairs for the swiper slides (2 cards per slide)
    const groupedData = [];
    for (let i = 0; i < data.length; i += 2) {
        groupedData.push(data.slice(i, i + 2));
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>{title}</Text>
            <Swiper
                style={styles.swiper}
                showsButtons={false}
                autoplay={false}
                showsPagination={false}
                loop={false}
            >
                {groupedData.map((group, groupIndex) => (
                    <View key={groupIndex} style={styles.slideRow}>
                        {group.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.card, {
                                    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFF',
                                    borderColor: isDarkMode ? '#444' : '#DDD'
                                }]}
                                onPress={handlePress}
                            >
                                <TouchableOpacity
                                    style={styles.heartIcon}
                                    onPress={() => toggleLike(item.id)}
                                >
                                    {type === 'deal' && item.discount ? (
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>{item.discount}</Text>
                                        </View>
                                    ) : (
                                        <Icon
                                            name={likedItems[item.id] ? 'cards-heart' : 'cards-heart-outline'}
                                            size={wp('6%')}
                                            color={likedItems[item.id] ? 'red' : '#12CCB7'}
                                        />
                                    )}

                                </TouchableOpacity>

                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.image} />
                                </View>

                                <Text style={[styles.name, { color: isDarkMode ? '#FFF' : '#021114' }]} numberOfLines={1}>
                                    {item.name}
                                </Text>

                                {type === 'provider' ? (
                                    <Text style={[styles.description, { color: isDarkMode ? '#AAA' : '#555' }]} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                ) : (
                                    <>
                                        <Text style={[styles.ratingText, { color: isDarkMode ? '#AAA' : '#555' }]}>
                                            ⭐ {item.rating} ({item.reviews})
                                        </Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.price}>${item.price}</Text>
                                            {item.oldPrice && (
                                                <Text style={[styles.oldPrice, { color: isDarkMode ? '#888' : '#888' }]}>
                                                    ${item.oldPrice}
                                                </Text>
                                            )}
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                        {/* If the last group has only 1 item, add an empty view to maintain layout */}
                        {group.length === 1 && <View style={styles.card} />}
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp('2%'),
    },
    title: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginLeft: wp('3%'),
        marginBottom: hp('1.5%'),
    },
    swiper: {
        height: hp('32%'), // Adjusted height
    },
    slideRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Change to space-between
        paddingHorizontal: wp('3%'),
    },
    card: {
        width: '48%', // Fixed width slightly less than 50%
        borderRadius: wp('3%'),
        padding: wp('3%'),
        borderWidth: 1,
        // elevation: 2,
        alignItems: 'center',
        // IMPORTANT: Don't set flex: 1 here if you want gap. Width percentage is better.
        // If using flex: 1, you need gap in container which React Native supports in new versions.
    },
    heartIcon: {
        position: 'absolute',
        top: wp('2%'),
        right: wp('2%'),
        zIndex: 10,
    },
    imageContainer: {
        width: '100%',
        height: wp('30%'),
        borderRadius: wp('2%'),
        overflow: 'hidden',
        marginBottom: hp('1%'),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    name: {
        fontSize: wp('3.8%'),
        fontWeight: 'bold',
        marginBottom: hp('0.5%'),
        textAlign: 'center',
    },
    description: {
        fontSize: wp('3%'),
        textAlign: 'center',
    },
    ratingText: {
        fontSize: wp('3.2%'),
        marginBottom: hp('0.5%'),
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        color: '#12CCB7',
        fontWeight: 'bold',
        fontSize: wp('3.8%'),
        marginRight: wp('2%'),
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        fontSize: wp('3.5%'),
    },
    discountBadge: {
        backgroundColor: 'lightgreen',
        borderColor: 'darkgreen',
        borderWidth: 1,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: 'darkgreen',
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export default FeaturedSection;
