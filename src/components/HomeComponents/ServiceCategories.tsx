import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInDown
} from 'react-native-reanimated';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// --- Types ---
type Ad = {
    id: string;
    image: any;
};

// Simplified Group Type
type Group = {
    name: string;
    image: any;
    subCategories: any[];
};

type GridItem =
    | { type: 'category'; data: Group; index: number }
    | { type: 'ad'; data: Ad; index: number };

// --- Components ---

const CategoryCard = ({ item, index, theme, onPress }: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).duration(600).springify()}
            style={[styles.cardContainer, { width: (width - wp('9%')) / 2 }]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={[styles.cardInner, animatedStyle, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.imageWrapper}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.overlay} />
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={[styles.categoryName, { color: theme.colors.text }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const GridAdCard = ({ ad, onPress }: { ad: Ad; onPress: (ad: Ad) => void }) => {
    return (
        <TouchableOpacity
            style={styles.gridAdContainer}
            activeOpacity={0.9}
            onPress={() => onPress(ad)}
        >
            <Image
                source={ad.image}
                style={styles.gridAdImage}
                resizeMode='cover'
            />
        </TouchableOpacity>
    );
};

// --- Main Component ---

const ServiceCategories = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Ad Preview State
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

    // Mock Ads Data
    const mockAds: Ad[] = [
        { id: 'ad1', image: require('../../assets/images/category/Home2.jpg') },
        { id: 'ad2', image: require('../../assets/images/category/Troubleshooting.jpg') },
        { id: 'ad3', image: require('../../assets/images/category/Home1.jpg') },
    ];

    // --- All Services Data ---
    // Using Unsplash Images for reliability and aesthetics
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

    const SERVICES = {
        // Home & Living
        cleaning: { id: 'h1', name: t('cat_cleaning'), image: IMAGES.cleaning, icon: 'broom' },
        cook: { id: 'h2', name: t('cat_chef'), image: IMAGES.cooking, icon: 'chef-hat' },
        laundry: { id: 'h3', name: t('cat_laundry'), image: IMAGES.laundry, icon: 'washing-machine' },
        pest: { id: 'h4', name: t('cat_pest'), image: IMAGES.pest, icon: 'bug' },
        disinfection: { id: 'h5', name: t('cat_disinfection'), image: IMAGES.cleaning, icon: 'spray-bottle' },
        sofa: { id: 'h6', name: t('cat_sofa'), image: IMAGES.cleaning, icon: 'sofa' },
        gardening: { id: 'h7', name: t('cat_gardening'), image: IMAGES.gardening, icon: 'flower' },

        // Security
        security: { id: 'sec1', name: t('cat_security'), image: IMAGES.security, icon: 'shield-account' },

        // Maintenance
        plumber: { id: 'm1', name: t('cat_plumber'), image: IMAGES.plumber, icon: 'water-pump' },
        electrician: { id: 'm2', name: t('cat_electrician'), image: IMAGES.electrician, icon: 'flash' },
        ac: { id: 'm3', name: t('cat_ac'), image: IMAGES.tech, icon: 'air-conditioner' },
        appliance: { id: 'm4', name: t('cat_appliance'), image: IMAGES.electrician, icon: 'washing-machine' },
        locksmith: { id: 'm5', name: t('cat_locksmith'), image: IMAGES.security, icon: 'lock-open' },
        cctv: { id: 'm6', name: t('cat_cctv'), image: IMAGES.tech, icon: 'cctv' },
        welder: { id: 'm7', name: t('cat_welder'), image: IMAGES.electrician, icon: 'welding' },

        // Renovation
        painter: { id: 'r1', name: t('cat_painter'), image: IMAGES.painter, icon: 'format-paint' },
        carpenter: { id: 'r2', name: t('cat_carpenter'), image: IMAGES.painter, icon: 'hammer' },
        mason: { id: 'r3', name: t('cat_mason'), image: IMAGES.painter, icon: 'wall' },
        flooring: { id: 'r4', name: t('cat_flooring'), image: IMAGES.painter, icon: 'floor-plan' },
        roofing: { id: 'r5', name: t('cat_roofing'), image: IMAGES.painter, icon: 'home-roof' },
        glass: { id: 'r6', name: t('cat_glass'), image: IMAGES.painter, icon: 'window-closed' },
        labor: { id: 'r7', name: t('cat_labor'), image: IMAGES.labor, icon: 'account-hard-hat' },

        // Wellness
        salon_men: { id: 'w1', name: t('cat_salon_men'), image: IMAGES.salon, icon: 'scissors-cutting' },
        salon_women: { id: 'w2', name: t('cat_salon_women'), image: IMAGES.salon, icon: 'face-woman' },
        spa: { id: 'w3', name: t('cat_spa'), image: IMAGES.salon, icon: 'spa' },
        makeup: { id: 'w4', name: t('cat_makeup'), image: IMAGES.salon, icon: 'lipstick' },
        henna: { id: 'w5', name: t('cat_henna'), image: IMAGES.salon, icon: 'hand-scyle' },
        yoga: { id: 'w6', name: t('cat_yoga'), image: IMAGES.salon, icon: 'yoga' },

        // Medical
        doctor: { id: 'he1', name: t('cat_doctor'), image: IMAGES.doctor, icon: 'doctor' },
        lab: { id: 'he2', name: t('cat_lab'), image: IMAGES.lab, icon: 'flask' },
        vet: { id: 'he3', name: t('cat_vet'), image: IMAGES.vet, icon: 'paw' },
        nursing: { id: 'he4', name: t('cat_nursing'), image: IMAGES.nursing, icon: 'needle' },

        // Auto
        mechanic: { id: 'a1', name: t('cat_mechanic'), image: IMAGES.mechanic, icon: 'car-wrench' },
        carwash: { id: 'a2', name: t('cat_carwash'), image: IMAGES.mechanic, icon: 'car-wash' },
        driver: { id: 'a3', name: t('cat_driver'), image: IMAGES.mechanic, icon: 'steering' },
        recovery: { id: 'a4', name: t('cat_recovery'), image: IMAGES.mechanic, icon: 'tow-truck' },
        moving: { id: 'a5', name: t('cat_moving'), image: IMAGES.moving, icon: 'truck' },

        // Tech
        computer: { id: 't1', name: t('cat_computer'), image: IMAGES.tech, icon: 'laptop' },
        mobile: { id: 't2', name: t('cat_mobile'), image: IMAGES.tech, icon: 'cellphone' },
        web: { id: 't3', name: t('cat_web'), image: IMAGES.tech, icon: 'web' },
        graphics: { id: 't4', name: t('cat_graphics'), image: IMAGES.tech, icon: 'palette' },
        tax: { id: 't5', name: t('cat_tax'), image: IMAGES.tax, icon: 'file-document' },
        online: { id: 't6', name: t('cat_online'), image: IMAGES.online, icon: 'web' },

        // Events
        photo: { id: 'e1', name: t('cat_photo'), image: IMAGES.events, icon: 'camera' },
        video: { id: 'e2', name: t('cat_video'), image: IMAGES.events, icon: 'video' },
        planner: { id: 'e3', name: t('cat_planner'), image: IMAGES.events, icon: 'calendar-star' },
        dj: { id: 'e4', name: t('cat_dj'), image: IMAGES.events, icon: 'music-note' },
        catering: { id: 'e5', name: t('cat_catering'), image: IMAGES.cooking, icon: 'food' },

        // Lessons
        tutor: { id: 'l1', name: t('cat_tutor'), image: IMAGES.tutor, icon: 'school' },
        quran: { id: 'l2', name: t('cat_quran'), image: IMAGES.tutor, icon: 'book-open-variant' },
        music: { id: 'l3', name: t('cat_music'), image: IMAGES.events, icon: 'piano' },
        language: { id: 'l4', name: t('cat_language'), image: IMAGES.tutor, icon: 'translate' },
    };

    // --- Main Groups ---
    const mainGroups = [
        {
            name: t('group_home'),
            image: IMAGES.cleaning,
            subCategories: [SERVICES.cleaning, SERVICES.cook, SERVICES.laundry, SERVICES.pest, SERVICES.sofa, SERVICES.disinfection, SERVICES.gardening, SERVICES.security]
        },
        {
            name: t('group_maintenance'),
            image: IMAGES.plumber,
            subCategories: [SERVICES.plumber, SERVICES.electrician, SERVICES.ac, SERVICES.appliance, SERVICES.locksmith, SERVICES.cctv, SERVICES.welder]
        },
        {
            name: t('group_renovation'),
            image: IMAGES.painter,
            subCategories: [SERVICES.painter, SERVICES.carpenter, SERVICES.mason, SERVICES.flooring, SERVICES.roofing, SERVICES.glass, SERVICES.labor]
        },
        {
            name: t('group_wellness'),
            image: IMAGES.salon,
            subCategories: [SERVICES.salon_men, SERVICES.salon_women, SERVICES.spa, SERVICES.makeup, SERVICES.henna, SERVICES.yoga]
        },
        {
            name: t('group_health'),
            image: IMAGES.doctor,
            subCategories: [SERVICES.doctor, SERVICES.lab, SERVICES.vet, SERVICES.nursing]
        },
        {
            name: t('group_auto'),
            image: IMAGES.mechanic,
            subCategories: [SERVICES.mechanic, SERVICES.carwash, SERVICES.moving, SERVICES.driver, SERVICES.recovery]
        },
        {
            name: t('group_tech'),
            image: IMAGES.tech,
            subCategories: [SERVICES.computer, SERVICES.mobile, SERVICES.web, SERVICES.graphics, SERVICES.tax, SERVICES.online]
        },
        {
            name: t('group_events'),
            image: IMAGES.events,
            subCategories: [SERVICES.photo, SERVICES.video, SERVICES.planner, SERVICES.dj, SERVICES.catering]
        },
        {
            name: t('group_education'),
            image: IMAGES.tutor,
            subCategories: [SERVICES.tutor, SERVICES.quran, SERVICES.music, SERVICES.language]
        }
    ];

    const handleCategoryPress = (group: any) => {
        (navigation as any).navigate('AllCategories', { title: group.name, data: group.subCategories });
    };

    const handleAdPress = (ad: Ad) => {
        setSelectedAd(ad);
        setPreviewVisible(true);
    };

    // Simple Grid Elements for Main Groups
    const gridElements = mainGroups.map((group, index) => ({
        type: 'category',
        data: group,
        index: index
    }));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{t('cat_title')}</Text>
                <TouchableOpacity onPress={() => (navigation as any).navigate('AllCategories')}>
                    <Text style={[styles.seeAll, { color: theme.colors.primary }]}>{t('cat_see_all')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {mainGroups.slice(0, 8).map((group, index) => (
                    <CategoryCard
                        key={`group-${index}`}
                        item={group}
                        index={index}
                        theme={theme}
                        onPress={() => handleCategoryPress(group)}
                    />
                ))}
            </View>

            {/* Ad Preview Modal */}
            <Modal
                visible={previewVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPreviewVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setPreviewVisible(false)}
                    >
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                    {selectedAd && (
                        <Image
                            source={selectedAd.image}
                            style={styles.previewImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp('4%'),
        marginBottom: hp('2%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
        marginTop: hp('1%'),
    },
    title: {
        fontSize: wp('4.8%'),
        fontWeight: '700',
    },
    seeAll: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardContainer: {
        marginBottom: hp('2%'),
    },
    cardInner: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    imageWrapper: {
        height: hp('14%'),
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
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    contentContainer: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: wp('3.8%'),
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    // Grid Ad Styles
    gridAdContainer: {
        width: '100%',
        height: hp('15%'),
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#F5F5F5' // Fallback
    },
    gridAdImage: {
        width: '100%',
        height: '100%',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(21, 21, 21, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 40,
        right: 30,
        zIndex: 10,
        backgroundColor: 'rgba(21, 21, 21, 0.5)',
        borderRadius: 20,
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    previewImage: {
        width: '95%',
        height: '70%',
        borderRadius: 18,
    }
});

export default ServiceCategories;
