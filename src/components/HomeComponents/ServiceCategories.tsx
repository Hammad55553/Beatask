import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const categories = [
    { name: 'Home Improvement', image: require('../../assets/images/category/Home1.jpg') },
    { name: 'Business', image: require('../../assets/images/category/BUSINESS.jpg') },
    { name: 'IT and Graphic Design', image: require('../../assets/images/category/It.jpg') },
    { name: 'Wellness', image: require('../../assets/images/category/WELLNESS.jpg') },
    { name: 'Pets', image: require('../../assets/images/category/PETS.jpg') },
    { name: 'Events', image: require('../../assets/images/category/Events.jpg') },
    { name: 'Troubleshooting and Repair', image: require('../../assets/images/category/Troubleshooting.jpg') },
    { name: 'Lessons', image: require('../../assets/images/category/Lessons.jpg') },
    { name: 'Personal', image: require('../../assets/images/category/Personal.jpg') },
    { name: 'Legal', image: require('../../assets/images/category/Legal.jpg') },
];

const ServiceCategories = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const handleCategoryPress = (categoryName: string) => {
        (navigation as any).navigate('CategoryDetails', { category: categoryName });
    };

    return (
        <View style={styles.categoryContainer}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>AsperTask service categories</Text>
            <View style={styles.categories}>
                {categories.map((cat, index) => (
                    <View key={index} style={styles.categoryWrapper}>
                        <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress(cat.name)}>
                            <View style={styles.imageContainer}>
                                <Image source={cat.image} style={styles.image} />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.categoryText}>{cat.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        padding: wp('3%'),
    },
    headerTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginBottom: hp('1.5%'),
        marginTop: hp('1%'),
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryWrapper: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: hp('1.5%'),
        borderRadius: wp('3%'),
        overflow: 'hidden',
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    category: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        alignItems: 'center',
    },
    categoryText: {
        color: '#12CCB7',
        fontSize: wp('3.5%'),
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default ServiceCategories;
