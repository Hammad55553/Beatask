import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeBannerSlider = () => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    return (
        <Swiper style={styles.swiper} showsButtons={false} autoplay={true} activeDotColor="#12CCB7">
            <View style={styles.slide}>
                {/* Replace with actual ad images when available */}
                <View style={[styles.adPlaceholder, { backgroundColor: '#9DD6EB' }]}>
                    <Text style={styles.slideText}>Ad Banner 1</Text>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={[styles.adPlaceholder, { backgroundColor: '#97CAE5' }]}>
                    <Text style={styles.slideText}>Ad Banner 2</Text>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={[styles.adPlaceholder, { backgroundColor: '#92BBD9' }]}>
                    <Text style={styles.slideText}>Ad Banner 3</Text>
                </View>
            </View>
        </Swiper>
    );
};

const styles = StyleSheet.create({
    swiper: {
        height: hp('20%'),
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wp('4%'),
        marginBottom: hp('4%'), // Adjust for pagination dots
    },
    adPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    slideText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default HomeBannerSlider;
