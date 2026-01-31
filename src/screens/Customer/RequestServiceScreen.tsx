import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Image, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import CustomToast from '../../components/common/CustomToast';

const RequestServiceScreen = () => {
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();
    const navigation = useNavigation();

    // Form State
    const [instruction, setInstruction] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [category, setCategory] = useState('');
    const [urgency, setUrgency] = useState('Flexible');

    // Date/Time State
    const [date, setDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
    const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

    // UI State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const categories = [
        { name: 'Home Improvement', icon: 'home-city', tranKey: 'group_home' },
        { name: 'Plumbing', icon: 'pipe-wrench', tranKey: 'cat_plumber' },
        { name: 'Electrical', icon: 'flash', tranKey: 'cat_electrician' },
        { name: 'Cleaning', icon: 'broom', tranKey: 'cat_cleaning' },
        { name: 'Gardening', icon: 'flower', tranKey: 'cat_gardening' },
        { name: 'Moving', icon: 'truck-delivery', tranKey: 'cat_moving' },
        { name: 'Painting', icon: 'format-paint', tranKey: 'cat_painter' },
        { name: 'Assembly', icon: 'screwdriver', tranKey: 'cat_labor' },
    ];

    const urgencyOptions = [
        { label: t('req_urgent'), value: 'Urgent', icon: 'alert-circle-outline' },
        { label: t('req_sameday'), value: 'Same Day', icon: 'calendar-today' },
        { label: t('req_schedule'), value: 'Schedule', icon: 'calendar-month' },
    ];

    const handlePost = () => {
        if (!category || !instruction) {
            // Basic validation
            // Could show toast error here
            return;
        }
        setShowToast(true);
        setTimeout(() => {
            navigation.goBack();
        }, 2000);
    };

    // Category items are now displayed in the modal

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                    >
                        <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('req_title')}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Welcome Text */}
                    <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_subtitle')}</Text>
                        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                            {t('req_desc')}
                        </Text>
                    </Animated.View>

                    {/* Category Selection Trigger */}
                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_category_label')}</Text>
                        <TouchableOpacity
                            style={[
                                styles.categorySelectBtn,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                            ]}
                            onPress={() => setShowCategoryModal(true)}
                        >
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                <Icon
                                    name={categories.find(c => c.name === category)?.icon || 'shape-outline'}
                                    size={24}
                                    color={category ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <Text style={[
                                    styles.categorySelectText,
                                    {
                                        color: category ? theme.colors.text : theme.colors.textSecondary,
                                        marginLeft: isRTL ? 0 : 12,
                                        marginRight: isRTL ? 12 : 0
                                    }
                                ]}>
                                    {category ? (
                                        categories.find(c => c.name === category)?.tranKey ? t(categories.find(c => c.name === category)?.tranKey as any) : category
                                    ) : t('req_select_cat')}
                                </Text>
                            </View>
                            <Icon name="chevron-down" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Description */}
                    <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                        <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_desc_label')}</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <TextInput
                                style={[styles.textArea, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                                placeholder={t('req_desc_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                multiline
                                numberOfLines={4}
                                value={instruction}
                                onChangeText={(t) => t.length <= 100 && setInstruction(t)}
                            />
                            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
                                {instruction.length}/100
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Location & Budget Row */}
                    <Animated.View entering={FadeInDown.delay(400).duration(600)} style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={{ flex: 1, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }}>
                            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_location_label')}</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="map-marker-outline" size={20} color={theme.colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}
                                    placeholder={t('req_city_zip')}
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_budget_label')}</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Icon name="currency-usd" size={20} color={theme.colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}
                                    placeholder={t('req_est_price')}
                                    placeholderTextColor={theme.colors.textSecondary}
                                    keyboardType="numeric"
                                    value={budget}
                                    onChangeText={setBudget}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Urgency */}
                    <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                        <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_when_label')}</Text>
                        <View style={[styles.urgencyContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            {urgencyOptions.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[
                                        styles.urgencyBtn,
                                        {
                                            backgroundColor: urgency === opt.value ? theme.colors.primary : theme.colors.surface,
                                            borderColor: urgency === opt.value ? theme.colors.primary : theme.colors.border
                                        }
                                    ]}
                                    onPress={() => setUrgency(opt.value)}
                                >
                                    <Icon name={opt.icon} size={20} color={urgency === opt.value ? '#FFF' : theme.colors.textSecondary} />
                                    <Text style={[
                                        styles.urgencyText,
                                        { color: urgency === opt.value ? '#FFF' : theme.colors.text }
                                    ]}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {urgency === 'Schedule' && (
                            <Animated.View entering={FadeInDown.duration(400)} style={[styles.row, { marginTop: 15, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <TouchableOpacity
                                    style={[styles.dateInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                                    onPress={() => setOpenDate(true)}
                                >
                                    <Icon name="calendar" size={20} color={theme.colors.primary} />
                                    <Text style={[styles.dateText, { color: scheduledDate ? theme.colors.text : theme.colors.textSecondary, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
                                        {scheduledDate ? scheduledDate.toLocaleDateString() : t('req_select_date')}
                                    </Text>
                                </TouchableOpacity>

                                <View style={{ width: 10 }} />

                                <TouchableOpacity
                                    style={[styles.dateInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                                    onPress={() => setOpenTime(true)}
                                >
                                    <Icon name="clock-outline" size={20} color={theme.colors.primary} />
                                    <Text style={[styles.dateText, { color: scheduledTime ? theme.colors.text : theme.colors.textSecondary, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
                                        {scheduledTime ? scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('req_select_time')}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Add Photos Placeholder */}
                    <Animated.View entering={FadeInDown.delay(600).duration(600)}>
                        <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('req_photos_label')}</Text>
                        <TouchableOpacity style={[styles.photoUpload, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                            <Icon name="camera-plus-outline" size={32} color={theme.colors.primary} />
                            <Text style={[styles.photoText, { color: theme.colors.textSecondary }]}>{t('req_add_photos')}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Footer */}
                <Animated.View entering={FadeInUp.delay(700).springify()} style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
                    <TouchableOpacity
                        style={[styles.postButton, { backgroundColor: theme.colors.primary, opacity: (category && instruction) ? 1 : 0.6, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                        onPress={handlePost}
                        disabled={!category || !instruction}
                    >
                        <Text style={styles.postButtonText}>{t('req_post_btn')}</Text>
                        <Icon name={isRTL ? "send-circle-outline" : "send-circle"} size={24} color="#FFF" style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Category Selection Modal */}
                <Modal
                    visible={showCategoryModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCategoryModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalBackdrop}
                            activeOpacity={1}
                            onPress={() => setShowCategoryModal(false)}
                        />
                        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                            <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('req_select_service')}</Text>
                                <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeBtn}>
                                    <Icon name="close" size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={styles.modalGrid}>
                                {categories.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.modalItem,
                                            {
                                                backgroundColor: category === item.name ? theme.colors.primary + '15' : theme.colors.background,
                                                borderColor: category === item.name ? theme.colors.primary : theme.colors.border
                                            }
                                        ]}
                                        onPress={() => {
                                            setCategory(item.name);
                                            setShowCategoryModal(false);
                                        }}
                                    >
                                        <View style={[
                                            styles.iconCircle,
                                            { backgroundColor: category === item.name ? theme.colors.primary : theme.colors.surface }
                                        ]}>
                                            <Icon
                                                name={item.icon}
                                                size={28}
                                                color={category === item.name ? '#FFF' : theme.colors.textSecondary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.modalItemText,
                                            { color: category === item.name ? theme.colors.primary : theme.colors.text }
                                        ]}>
                                            {item.tranKey ? t(item.tranKey as any) : item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <CustomToast
                    visible={showToast}
                    message={t('req_success_msg')}
                    type="success"
                    onHide={() => setShowToast(false)}
                />

                <DatePicker
                    modal
                    open={openDate}
                    date={date}
                    mode="date"
                    theme={isDarkMode ? 'dark' : 'light'}
                    onConfirm={(date: Date) => {
                        setOpenDate(false);
                        setScheduledDate(date);
                    }}
                    onCancel={() => setOpenDate(false)}
                />

                <DatePicker
                    modal
                    open={openTime}
                    date={date}
                    mode="time"
                    theme={isDarkMode ? 'dark' : 'light'}
                    onConfirm={(date: Date) => {
                        setOpenTime(false);
                        setScheduledTime(date);
                    }}
                    onCancel={() => setOpenTime(false)}
                />
            </View>
        </KeyboardAvoidingView>
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
        paddingHorizontal: wp('5%'),
        paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('2%'),
        paddingBottom: hp('2%'),

    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
    },
    content: {
        padding: wp('5%'),
    },
    sectionTitle: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: wp('3.8%'),
        marginBottom: 24,
        lineHeight: 22,
    },
    label: {
        fontSize: wp('4%'),
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
    },
    categorySelectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 55,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 10,
    },
    categorySelectText: {
        marginLeft: 12,
        fontSize: wp('4%'),
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom: 40,
        maxHeight: hp('70%'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 5,
    },
    modalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    modalItem: {
        width: wp('28%'), // 3 columns approx
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    modalItemText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 55,
    },
    textAreaContainer: {
        height: 120,
        alignItems: 'flex-start',
        paddingTop: 15,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: wp('4%'),
    },
    textArea: {
        flex: 1,
        fontSize: wp('4%'),
        textAlignVertical: 'top',
        width: '100%',
    },
    charCount: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    urgencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    urgencyBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 4,
    },
    urgencyText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
    },
    dateText: {
        marginLeft: 10,
        fontWeight: '500',
    },
    photoUpload: {
        height: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    photoText: {
        marginTop: 8,
        fontWeight: '500',
    },
    footer: {
        padding: wp('5%'),
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    postButtonText: {
        color: '#FFF',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
});

export default RequestServiceScreen;
