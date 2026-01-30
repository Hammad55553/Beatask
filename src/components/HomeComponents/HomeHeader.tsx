import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme, darkTheme } from '../../theme';

const HomeHeader = () => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const currentTheme = isDarkMode ? darkTheme : theme;

    return (
        <View style={styles.header}>
            <Image source={require('../../assets/images/category/Frame.png')} style={styles.profileImage} />
            <Text style={[styles.greeting, { color: currentTheme.colors.text }]}>Good morning Andrew</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('3%'),
    },
    profileImage: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
    },
    greeting: {
        marginLeft: wp('2%'),
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
});

export default HomeHeader;
