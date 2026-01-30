import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    useColorScheme
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { theme as lightTheme, darkTheme } from '../../theme';

// Import reusable components for the Body
import ServiceCategories from '../../components/HomeComponents/ServiceCategories';
import FeaturedSection from '../../components/HomeComponents/FeaturedSection';
import HomeBannerSlider from '../../components/HomeComponents/HomeBannerSlider';

// Mock Data
const featuredProviders = [
    { id: '1', name: 'Benjamin Wilson', description: 'Creative event planner', image: require('../../assets/images/category/Image1.png') },
    { id: '2', name: 'Fina Benjamin', description: 'Creative Graphic Designer', image: require('../../assets/images/category/Image1.png') },
    { id: '3', name: 'John Doe', description: 'Experienced Plumber', image: require('../../assets/images/category/Image1.png') },
    { id: '4', name: 'Jane Smith', description: 'Professional Gardener', image: require('../../assets/images/category/Image1.png') },
];

const mostBookedServices = [
    { id: '1', name: 'Intellectual Property', rating: 4.8, reviews: '3k', price: '100', image: require('../../assets/images/category/Legal.jpg') },
    { id: '2', name: 'Personal Coaching', rating: 4.9, reviews: '1.2k', price: '150', image: require('../../assets/images/category/Personal.jpg') },
    { id: '3', name: 'Math Tutoring', rating: 5.0, reviews: '500', price: '40', image: require('../../assets/images/category/It.jpg') },
];

const halfPriceDeals = [
    { id: '1', name: 'Intellectual Property', rating: 4.8, reviews: '3k', price: '88', oldPrice: '100', discount: '-12%', image: require('../../assets/images/category/Legal.jpg') },
    { id: '2', name: 'Personal Coaching', rating: 4.8, reviews: '3k', price: '88', oldPrice: '100', discount: '-12%', image: require('../../assets/images/category/Personal.jpg') },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    // Search State
    const [searchText, setSearchText] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchOptions, setSearchOptions] = useState(['Home Improvement', 'Business', 'IT and Graphic Design']);
    const [filteredOptions, setFilteredOptions] = useState(searchOptions);

    // Animation Values
    const scrollY = useRef(new Animated.Value(0)).current;

    // Constants for Animation
    const HEADER_HEIGHT = hp('15%');
    const HEADER_HIDE_DISTANCE = HEADER_HEIGHT * 1.5;

    // Interpolations
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE * 0.9, HEADER_HIDE_DISTANCE],
        outputRange: [1, 1, 1],
        extrapolate: 'clamp',
    });

    const headerContentOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE * 0.3, HEADER_HIDE_DISTANCE * 0.6],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE * 0.5, HEADER_HIDE_DISTANCE],
        outputRange: [0, -hp('8%'), -hp('10%')], // Reduced final offset to keep search bar lower
        extrapolate: 'clamp',
    });

    const homeBgImgTranslateY = scrollY.interpolate({
        inputRange: [0, hp('28%')],
        outputRange: [0, -hp('18%')],
        extrapolate: 'clamp',
    });

    const homeBgImgBorderRadius = scrollY.interpolate({
        inputRange: [0, hp('10%')],
        outputRange: [wp('15%'), 0],
        extrapolate: 'clamp',
    });

    const homeBgImgHeight = scrollY.interpolate({
        inputRange: [0, hp('20%')],
        outputRange: [Platform.OS === 'ios' ? hp('39%') : hp('38%'), Platform.OS === 'ios' ? hp('41%') : hp('42%')],
        extrapolate: 'clamp',
    });

    const logoOpacity = scrollY.interpolate({
        inputRange: [HEADER_HIDE_DISTANCE * 0.2, HEADER_HIDE_DISTANCE * 0.6, HEADER_HIDE_DISTANCE * 0.9],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
    });

    const logoTranslateX = scrollY.interpolate({
        inputRange: [HEADER_HIDE_DISTANCE * 0.2, HEADER_HIDE_DISTANCE * 0.8],
        outputRange: [-50, 0],
        extrapolate: 'clamp',
    });

    const searchBarWidth = scrollY.interpolate({
        inputRange: [HEADER_HIDE_DISTANCE * 0.2, HEADER_HIDE_DISTANCE * 0.8],
        outputRange: [1.2, 0.95], // Slightly wider
        extrapolate: 'clamp',
    });

    const searchBarMarginLeft = scrollY.interpolate({
        inputRange: [HEADER_HIDE_DISTANCE * 0.2, HEADER_HIDE_DISTANCE * 0.8],
        outputRange: [-wp('5%'), wp('2%')], // Partial overlap with hidden logo initially, then spacing
        extrapolate: 'clamp',
    });

    const searchBarMarginBottom = scrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE * 0.5, HEADER_HIDE_DISTANCE],
        outputRange: [hp('1%'), hp('2%'), hp('3%')],
        extrapolate: 'clamp',
    });

    // Search Functions
    const handleFilterOptions = (text: string) => {
        setSearchText(text);
        const filtered = searchOptions.filter(opt => opt.toLowerCase().includes(text.toLowerCase()));
        setFilteredOptions(filtered);
    };

    const handleSearchPress = (category: string) => {
        (navigation as any).navigate('CategoryDetails', { category });
        setShowSearchModal(false);
    };

    const handleFABPress = () => {
        (navigation as any).navigate('RequestService');
    };

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.colors.background }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Backgound Image layer */}
            <Animated.View
                style={[
                    styles.homeBgImg,
                    {
                        zIndex: 2,
                        transform: [{ translateY: homeBgImgTranslateY }],
                        borderBottomLeftRadius: homeBgImgBorderRadius,
                        borderBottomRightRadius: homeBgImgBorderRadius,
                        height: homeBgImgHeight,
                    },
                ]}
                pointerEvents="none"
            >
                <Image
                    source={require('../../assets/images/category/Home1.jpg')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                {/* Overlay for better text readability */}
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }} />
            </Animated.View>

            {/* Collapsing Header */}
            <Animated.View
                style={[
                    styles.animatedHeader,
                    { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity, zIndex: 10 },
                ]}
                pointerEvents="box-none"
            >
                <View style={styles.fixedHeader} pointerEvents="box-none">
                    {/* Top Row: Menu, Greeting, Profile */}
                    <Animated.View style={[styles.headerRow, { opacity: headerContentOpacity }]} pointerEvents="box-none">
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.menuButton}>
                                <Icon name="menu" size={28} color="#fff" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.greet}>
                                    Hey, <Text style={styles.bold}>Andrew!</Text>
                                </Text>
                                <Text style={styles.explore}>Let's explore services</Text>
                            </View>
                        </View>
                        <View style={styles.avatarWrap}>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../assets/images/category/Frame.png')}
                                    style={styles.avatar}
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Bottom Row: Logo (fades in) + SearchBar (animates) */}
                    <Animated.View style={{ height: hp('5%'), marginBottom: searchBarMarginBottom }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* Logo that slides in */}
                            <Animated.View
                                style={{
                                    opacity: logoOpacity,
                                    transform: [{ translateX: logoTranslateX }],
                                }}
                            >
                                <Icon name="briefcase-check" size={40} color={currentTheme.colors.primary} style={{ marginTop: 10, marginRight: 5 }} />
                            </Animated.View>

                            {/* Search Input Container */}
                            <Animated.View style={{ flex: searchBarWidth, marginLeft: searchBarMarginLeft }}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => setShowSearchModal(true)}
                                    style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}
                                >
                                    <Icon name="magnify" size={20} color={isDarkMode ? '#CCC' : '#51514C'} style={{ marginRight: 8 }} />
                                    <Text style={{ color: isDarkMode ? '#CCC' : '#666' }}>Search services...</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Scrollable Content */}
            <Animated.ScrollView
                contentContainerStyle={{
                    paddingTop: hp('30%'), // Start content below header/bg
                    paddingBottom: hp('10%'),
                }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.contentSection}>
                    <ServiceCategories />
                </View>

                {/* Ads Component */}
                <HomeBannerSlider />

                <FeaturedSection
                    title="Featured Service Providers"
                    data={featuredProviders}
                    type="provider"
                />

                <FeaturedSection
                    title="Most Booked Services"
                    data={mostBookedServices}
                    type="service"
                />

                <FeaturedSection
                    title="Half Price Deals"
                    data={halfPriceDeals}
                    type="deal"
                />

                {/* Padding at bottom */}
                <View style={{ height: 50 }} />
            </Animated.ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleFABPress}>
                <Icon name="plus" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Search Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSearchModal}
                onRequestClose={() => setShowSearchModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowSearchModal(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#222' : '#FFF' }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                            <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.modalSearchInput, { color: isDarkMode ? '#FFF' : '#000' }]}
                            placeholder="Search..."
                            placeholderTextColor={isDarkMode ? '#888' : '#666'}
                            value={searchText}
                            onChangeText={handleFilterOptions}
                            autoFocus={true}
                        />
                    </View>

                    <View style={styles.optionsContainer}>
                        <Text style={[styles.recentText, { color: isDarkMode ? '#FFF' : '#000' }]}>Recent Searches</Text>
                        {filteredOptions.map((option, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSearchPress(option)}>
                                <View style={styles.optionItem}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name="history" size={20} color="#888" style={{ marginRight: 10 }} />
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#FFF' : '#333' }]}>{option}</Text>
                                    </View>
                                    <Icon name="arrow-top-right" size={18} color="#888" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    homeBgImg: {
        position: 'absolute',
        width: wp('105%'),
        left: wp('-2.5%'),
        marginBottom: hp('100%'),
        top: Platform.OS === 'ios' ? hp('-8%') : hp('-10%'),
        zIndex: 0,
        overflow: 'hidden',
    },
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    fixedHeader: {
        paddingTop: Platform.OS === 'ios' ? hp('2%') : hp('0.12%'),
        paddingHorizontal: wp(4),
        zIndex: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('5%'),
        marginBottom: hp('2%'),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuButton: {
        marginRight: wp('3%'),
        padding: 4,
    },
    greet: {
        fontSize: wp('4.5%'),
        color: '#fff',
        fontWeight: '400',
    },
    bold: {
        fontWeight: '700',
        color: '#00C9A7',
    },
    explore: {
        fontSize: wp('3.5%'),
        color: '#eee',
    },
    avatarWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contentSection: {
        marginTop: 0,
    },
    fab: {
        position: 'absolute',
        bottom: hp('12%'),
        right: wp('5%'),
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#00C9A7',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 100,
    },
    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        marginTop: hp('15%'),
        marginHorizontal: wp('4%'),
        borderRadius: 15,
        padding: 20,
        elevation: 10,
        maxHeight: hp('60%'),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalSearchInput: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
    optionsContainer: {
        marginTop: 5,
    },
    recentText: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 14,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 15,
    },
});

export default HomeScreen;
