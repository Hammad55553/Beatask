import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions, Image, StatusBar, Platform, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

// Data
const categories = [
    { id: '1', name: 'Plumber', image: require('../../assets/images/category/Home1.jpg'), icon: 'water-pump' },
    { id: '2', name: 'Electrician', image: require('../../assets/images/category/Troubleshooting.jpg'), icon: 'flash' },
    { id: '3', name: 'Mason (Mistri)', image: require('../../assets/images/category/Home1.jpg'), icon: 'wall' },
    { id: '4', name: 'Welder', image: require('../../assets/images/category/Troubleshooting.jpg'), icon: 'welding' },
    { id: '5', name: 'AC & Fridge', image: require('../../assets/images/category/It.jpg'), icon: 'air-conditioner' },
    { id: '6', name: 'Cleaning', image: require('../../assets/images/category/Home1.jpg'), icon: 'broom' },
    { id: '7', name: 'Gardening', image: require('../../assets/images/category/WELLNESS.jpg'), icon: 'flower' },
    { id: '8', name: 'Painter', image: require('../../assets/images/category/Home1.jpg'), icon: 'format-paint' },
    { id: '9', name: 'Carpenter', image: require('../../assets/images/category/Home1.jpg'), icon: 'hammer' },
    { id: '10', name: 'Moving', image: require('../../assets/images/category/BUSINESS.jpg'), icon: 'truck' },
    { id: '11', name: 'Pest Control', image: require('../../assets/images/category/PETS.jpg'), icon: 'bug' },
    { id: '12', name: 'Mechanic', image: require('../../assets/images/category/Troubleshooting.jpg'), icon: 'car-wrench' },
    { id: '13', name: 'Tutor', image: require('../../assets/images/category/Lessons.jpg'), icon: 'school' },
    { id: '14', name: 'Cook / Chef', image: require('../../assets/images/category/Home1.jpg'), icon: 'chef-hat' },
];

const CategoryCard = ({ item, index, theme, onPress, viewMode }: any) => {
    const scale = useSharedValue(1);
    const isGrid = viewMode === 'grid';

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
                        height: isGrid ? undefined : hp('10%'),
                        alignItems: isGrid ? 'stretch' : 'center',

                        // Modified styling based on user request (no shadow, simple border)
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        elevation: 0,
                        shadowOpacity: 0,
                    }
                ]}>
                    <View style={[
                        styles.imageWrapper,
                        !isGrid && { width: hp('10%'), height: '100%' } // Square image for list items
                    ]}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.overlay} />
                        {isGrid && (
                            <View style={styles.iconBadge}>
                                <Icon name={item.icon} size={18} color={theme.colors.primary} />
                            </View>
                        )}
                    </View>

                    <View style={[
                        styles.contentContainer,
                        !isGrid && { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }
                    ]}>
                        <Text style={[
                            styles.categoryName,
                            { color: theme.colors.text, fontSize: isGrid ? wp('4%') : wp('4.5%') }
                        ]} numberOfLines={1}>
                            {item.name}
                        </Text>
                        {/* Chevron for List Mode */}
                        {!isGrid && (
                            <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
                        )}
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const AllCategoriesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // --- Copied IMAGES from ServiceCategories (ideally shared) ---
    const IMAGES = {
        cleaning: { uri: 'https://images.unsplash.com/photo-1581579186913-45ac3e6e3dd2?w=500' },
        gardening: { uri: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=500' },
        cooking: { uri: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=500' },
        plumber: { uri: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500' },
        electrician: { uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500' },
        painter: { uri: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500' },
        salon: { uri: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500' },
        mechanic: { uri: 'https://images.unsplash.com/photo-1486262715619-01b80258e0b5?w=500' },
        tech: { uri: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500' },
        events: { uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500' },
        tutor: { uri: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500' },
        moving: { uri: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500' },
        pest: { uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500' },
        laundry: { uri: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500' },
        security: { uri: 'https://images.unsplash.com/photo-1558002038-1091a166111c?w=500' },
        doctor: { uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500' },
        lab: { uri: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500' },
        vet: { uri: 'https://images.unsplash.com/photo-1553688738-a278b9f72434?w=500' },
        nursing: { uri: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500' },
        tax: { uri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
        online: { uri: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500' },
        labor: { uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500' },
    };

    // Full List of Services
    const allServices = [
        // Home
        { id: 'h1', name: t('cat_cleaning'), image: IMAGES.cleaning, icon: 'broom' },
        { id: 'h2', name: t('cat_chef'), image: IMAGES.cooking, icon: 'chef-hat' },
        { id: 'h3', name: t('cat_laundry'), image: IMAGES.laundry, icon: 'washing-machine' },
        { id: 'h4', name: t('cat_pest'), image: IMAGES.pest, icon: 'bug' },
        { id: 'h5', name: t('cat_disinfection'), image: IMAGES.cleaning, icon: 'spray-bottle' },
        { id: 'h6', name: t('cat_sofa'), image: IMAGES.cleaning, icon: 'sofa' },
        { id: 'h7', name: t('cat_gardening'), image: IMAGES.gardening, icon: 'flower' },
        { id: 'sec1', name: t('cat_security'), image: IMAGES.security, icon: 'shield-account' },
        // Maintenance
        { id: 'm1', name: t('cat_plumber'), image: IMAGES.plumber, icon: 'water-pump' },
        { id: 'm2', name: t('cat_electrician'), image: IMAGES.electrician, icon: 'flash' },
        { id: 'm3', name: t('cat_ac'), image: IMAGES.tech, icon: 'air-conditioner' },
        { id: 'm4', name: t('cat_appliance'), image: IMAGES.electrician, icon: 'washing-machine' },
        { id: 'm5', name: t('cat_locksmith'), image: IMAGES.security, icon: 'lock-open' },
        { id: 'm6', name: t('cat_cctv'), image: IMAGES.tech, icon: 'cctv' },
        { id: 'm7', name: t('cat_welder'), image: IMAGES.electrician, icon: 'welding' },
        // Renovation
        { id: 'r1', name: t('cat_painter'), image: IMAGES.painter, icon: 'format-paint' },
        { id: 'r2', name: t('cat_carpenter'), image: IMAGES.painter, icon: 'hammer' },
        { id: 'r3', name: t('cat_mason'), image: IMAGES.painter, icon: 'wall' },
        { id: 'r4', name: t('cat_flooring'), image: IMAGES.painter, icon: 'floor-plan' },
        { id: 'r5', name: t('cat_roofing'), image: IMAGES.painter, icon: 'home-roof' },
        { id: 'r6', name: t('cat_glass'), image: IMAGES.painter, icon: 'window-closed' },
        { id: 'r7', name: t('cat_labor'), image: IMAGES.labor, icon: 'account-hard-hat' },
        // Wellness
        { id: 'w1', name: t('cat_salon_men'), image: IMAGES.salon, icon: 'scissors-cutting' },
        { id: 'w2', name: t('cat_salon_women'), image: IMAGES.salon, icon: 'face-woman' },
        { id: 'w3', name: t('cat_spa'), image: IMAGES.salon, icon: 'spa' },
        { id: 'w4', name: t('cat_makeup'), image: IMAGES.salon, icon: 'lipstick' },
        { id: 'w5', name: t('cat_henna'), image: IMAGES.salon, icon: 'hand-scyle' },
        { id: 'w6', name: t('cat_yoga'), image: IMAGES.salon, icon: 'yoga' },
        // Medical
        { id: 'he1', name: t('cat_doctor'), image: IMAGES.doctor, icon: 'doctor' },
        { id: 'he2', name: t('cat_lab'), image: IMAGES.lab, icon: 'flask' },
        { id: 'he3', name: t('cat_vet'), image: IMAGES.vet, icon: 'paw' },
        { id: 'he4', name: t('cat_nursing'), image: IMAGES.nursing, icon: 'needle' },
        // Auto
        { id: 'a1', name: t('cat_mechanic'), image: IMAGES.mechanic, icon: 'car-wrench' },
        { id: 'a2', name: t('cat_carwash'), image: IMAGES.mechanic, icon: 'car-wash' },
        { id: 'a3', name: t('cat_driver'), image: IMAGES.mechanic, icon: 'steering' },
        { id: 'a4', name: t('cat_recovery'), image: IMAGES.mechanic, icon: 'tow-truck' },
        { id: 'a5', name: t('cat_moving'), image: IMAGES.moving, icon: 'truck' },
        // Tech
        { id: 't1', name: t('cat_computer'), image: IMAGES.tech, icon: 'laptop' },
        { id: 't2', name: t('cat_mobile'), image: IMAGES.tech, icon: 'cellphone' },
        { id: 't3', name: t('cat_web'), image: IMAGES.tech, icon: 'web' },
        { id: 't4', name: t('cat_graphics'), image: IMAGES.tech, icon: 'palette' },
        { id: 't5', name: t('cat_tax'), image: IMAGES.tax, icon: 'file-document' },
        { id: 't6', name: t('cat_online'), image: IMAGES.online, icon: 'web' },
        // Events
        { id: 'e1', name: t('cat_photo'), image: IMAGES.events, icon: 'camera' },
        { id: 'e2', name: t('cat_video'), image: IMAGES.events, icon: 'video' },
        { id: 'e3', name: t('cat_planner'), image: IMAGES.events, icon: 'calendar-star' },
        { id: 'e4', name: t('cat_dj'), image: IMAGES.events, icon: 'music-note' },
        { id: 'e5', name: t('cat_catering'), image: IMAGES.cooking, icon: 'food' },
        // Lessons
        { id: 'l1', name: t('cat_tutor'), image: IMAGES.tutor, icon: 'school' },
        { id: 'l2', name: t('cat_quran'), image: IMAGES.tutor, icon: 'book-open-variant' },
        { id: 'l3', name: t('cat_music'), image: IMAGES.events, icon: 'piano' },
        { id: 'l4', name: t('cat_language'), image: IMAGES.tutor, icon: 'translate' },
    ];

    // Get params
    const { title, data } = (route.params as { title?: string, data?: any[] }) || {};
    const sourceData = data || allServices; // Use allServices if no data passed

    // Removed imperative StatusBar effect
    // StatusBar handles itself via props below

    const filteredCategories = sourceData.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleBack = () => navigation.goBack();
    const handleCategoryPress = (name: string) => {
        (navigation as any).navigate('CategoryDetails', { category: name });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
                translucent={Platform.OS === 'ios'}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Icon name="chevron-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{title || 'All Categories'}</Text>

                {/* View Toggle */}
                <View style={[styles.viewToggle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.toggleBtn, viewMode === 'grid' && { backgroundColor: theme.colors.primary + '20' }]}>
                        <Icon name="view-grid" size={22} color={viewMode === 'grid' ? theme.colors.primary : theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: theme.colors.primary + '20' }]}>
                        <Icon name="format-list-bulleted" size={22} color={viewMode === 'list' ? theme.colors.primary : theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, elevation: 0 }]}>
                <Icon name="magnify" size={24} color={theme.colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder="Search category..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Content Grid */}
            <FlatList
                key={viewMode} // Forces re-render on mode change
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
                renderItem={({ item, index }) => (
                    <CategoryCard
                        item={item}
                        index={index}
                        theme={theme}
                        viewMode={viewMode}
                        onPress={() => handleCategoryPress(item.name)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="alert-circle-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No categories found</Text>
                    </View>
                }
            />
        </SafeAreaView>
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
        paddingVertical: hp('2%'),
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    viewToggle: {
        flexDirection: 'row',
        padding: 3,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    toggleBtn: {
        padding: 5,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp('4%'),
        marginBottom: hp('2%'),
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: wp('4%'),
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingBottom: hp('5%'),
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardContainer: {
        marginBottom: hp('1.5%'),
    },
    cardInner: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    imageWrapper: {
        height: hp('16%'),
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    iconBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    contentContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyContainer: {
        marginTop: hp('10%'),
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: wp('4%'),
    }
});

export default AllCategoriesScreen;
