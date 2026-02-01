import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { Currency } from '../../context/CurrencyContext';

const { height } = Dimensions.get('window');

interface CurrencyPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectCurrency: (currency: Currency) => void;
    currentCurrency: Currency;
    isRTL: boolean;
}

const currencies: { key: Currency; label: string; symbol: string; icon: string }[] = [
    { key: 'USD', label: 'US Dollar', symbol: '$', icon: 'currency-usd' },
    { key: 'PKR', label: 'Pakistani Rupee', symbol: 'Rs', icon: 'currency-pkr' },
    { key: 'EUR', label: 'Euro', symbol: '€', icon: 'currency-eur' },
    { key: 'GBP', label: 'British Pound', symbol: '£', icon: 'currency-gbp' },
];

const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
    visible,
    onClose,
    onSelectCurrency,
    currentCurrency,
    isRTL
}) => {
    const { theme } = useTheme();
    const [showModal, setShowModal] = useState(visible);

    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    if (!showModal) return null;

    return (
        <Modal
            transparent
            visible={showModal}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[
                    styles.sheetContainer,
                    {
                        backgroundColor: theme.colors.surface,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <View style={styles.handleContainer}>
                        <View style={styles.handleBar} />
                    </View>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            {isRTL ? 'کرنسی منتخب کریں' : 'Choose Currency'}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        {currencies.map((curr) => (
                            <TouchableOpacity
                                key={curr.key}
                                style={[
                                    styles.option,
                                    {
                                        backgroundColor: theme.colors.background,
                                        borderColor: currentCurrency === curr.key ? theme.colors.primary : 'transparent',
                                        borderWidth: 1,
                                        flexDirection: isRTL ? 'row-reverse' : 'row'
                                    }
                                ]}
                                activeOpacity={0.8}
                                onPress={() => onSelectCurrency(curr.key)}
                            >
                                <View style={[styles.optionLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                                        <Icon name={curr.icon} size={24} color={theme.colors.primary} />
                                    </View>
                                    <View style={{ marginHorizontal: 15 }}>
                                        <Text style={[styles.currencyName, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                            {curr.label}
                                        </Text>
                                        <Text style={[styles.currencySub, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                                            {curr.symbol}
                                        </Text>
                                    </View>
                                </View>
                                {currentCurrency === curr.key && (
                                    <Icon name="check-circle" size={24} color={theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheetContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#DDDDDD',
        borderRadius: 3,
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    content: {
    },
    option: {
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
    },
    optionLeft: {
        alignItems: 'center',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currencyName: {
        fontSize: 16,
        fontWeight: '600',
    },
    currencySub: {
        fontSize: 13,
        marginTop: 2,
    }
});

export default CurrencyPickerModal;
