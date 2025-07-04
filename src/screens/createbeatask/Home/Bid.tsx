import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BidScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const isDarkMode = colorScheme === 'dark';


    const handleprofile = () => {
        navigation.navigate('ProfileSetup' as never);
    };
    const handlesetting = () => {
        navigation.navigate('Setting' as never);
    };
    const handleHome = () => {
        navigation.navigate('dashboard' as never);
    };
    const handleChat = () => {
        navigation.navigate('masglist1' as never);
    };
    const handlebooked = () => {
        navigation.navigate('booked1' as never);
    };
    const handlebid = () => {
        navigation.navigate('Bid' as never);
    };
    const handleBid1 = () => {
        navigation.navigate('Bid1' as never);
    };
    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <ScrollView style={isDarkMode ? styles.containerDark : styles.containerLight}>
                <Text style={[styles.header, isDarkMode ? styles.textDark : styles.textLight]}>Bid to be hired</Text>
                <Text style={[styles.subHeader, isDarkMode ? styles.textDark : styles.textLight]}>
                    Here you can see service request from users, compare their needs, and select the best fit.
                </Text>

                {[
                    {
                        time: 'Posted 38 minutes ago',
                        category: 'IT and graphic design',
                        description:
                            'I need a software developer for my mobile application. I need the development to be completed in two days.',
                        location: '267 New Avenue Park, New York',
                    },
                    {
                        time: 'Posted 17 hours ago',
                        category: 'Home Improvement',
                        description:
                            'I need a home repair and handyman service, but am only available on Thursdays.',
                        location: '267 New Avenue Park, New York',
                    },
                ].map((job, index) => (
                    <View key={index} style={styles.jobCard}>
                        <Text style={[styles.time, isDarkMode ? styles.textDark : styles.textLight]}>{job.time}</Text>
                        <Text style={[styles.category, isDarkMode ? styles.textDark : styles.textLight]}>{job.category}</Text>
                        <Text style={[styles.description, isDarkMode ? styles.textDark : styles.textLight]}>{job.description}</Text>
                        <Text style={[styles.location, isDarkMode ? styles.textDark : styles.textLight]}>{job.location}</Text>
                        <TouchableOpacity style={styles.button} onPress={handleBid1}>
                            <Text style={styles.buttonText}>SEND QUOTE</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={[styles.footer, { backgroundColor: isDarkMode ? '#021114' : '#FFF' }]}>
                <TouchableOpacity style={styles.footerItem} onPress={handleHome} >
                    <Icon name="home-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>HOME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handlebooked}>
                    <Icon name="calendar-check-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>BOOKED</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handleChat} >
                    <Icon name="chat-processing-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handlebid} >
                    <Icon name="briefcase-variant-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>BID</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handleprofile} >
                    <Icon name="account-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>PROFILE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: wp('5%'),
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#000000',
        padding: wp('5%'),
    },
    container: {
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    lightContainer: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        marginBottom: wp('2%'),

    },
    subHeader: {
        fontSize: wp('4.7%'),
        marginBottom: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        paddingBottom: wp('5%'),
    },
    jobCard: {
        marginBottom: wp('5%'),
        paddingBottom: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#666',
    },
    time: {
        fontSize: wp('3%'),
        marginBottom: wp('1%'),
    },
    category: {
        fontSize: wp('5.5%'),
        fontWeight: 'bold',
        marginBottom: wp('2%'),
    },
    description: {
        fontSize: wp('4.5%'),
        marginBottom: wp('2%'),
    },
    location: {
        fontSize: wp('3.5%'),
        marginBottom: wp('3%'),
    },
    button: {
        backgroundColor: '#00f2ea',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('10%'),
        borderRadius: 30,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: wp('4%'),
    },
    textLight: {
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
    darkText: {
        color: 'white',
    },
    lightText: {
        color: 'black',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Default light mode background color
        paddingVertical: hp('1%'),
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: wp('3%'),
        color: '#000', // Default light mode text color
    },
});

export default BidScreen;
