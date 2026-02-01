import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    Platform
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'default' | 'destructive' | 'success' | 'warning';
    icon?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    type = 'default',
    icon
}) => {
    const { theme } = useTheme();
    const { isRTL, t } = useLanguage();

    if (!visible) return null;

    const getTypeColor = () => {
        switch (type) {
            case 'destructive': return '#FF5252';
            case 'success': return '#00E676';
            case 'warning': return '#FFD700';
            default: return theme.colors.primary;
        }
    };

    const getTypeIcon = () => {
        if (icon) return icon;
        switch (type) {
            case 'destructive': return 'alert-circle-outline';
            case 'success': return 'check-circle-outline';
            case 'warning': return 'alert-outline';
            default: return 'help-circle-outline';
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                />

                <Animated.View
                    entering={ZoomIn.springify().damping(15)}
                    exiting={ZoomOut}
                    style={[
                        styles.alertBox,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            alignItems: isRTL ? 'flex-end' : 'center'
                        }
                    ]}
                >
                    <View style={[styles.iconCircle, { backgroundColor: getTypeColor() + '15' }]}>
                        <Icon name={getTypeIcon()} size={40} color={getTypeColor()} />
                    </View>

                    <Text style={[styles.title, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'center' }]}>
                        {title}
                    </Text>

                    <Text style={[styles.message, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'center' }]}>
                        {message}
                    </Text>

                    <View style={[styles.buttonRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        {onCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelBtn, { borderColor: theme.colors.border }]}
                                onPress={onCancel}
                            >
                                <Text style={[styles.cancelBtnText, { color: theme.colors.textSecondary }]}>
                                    {cancelText || (t as any)('common_cancel') || 'Cancel'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.confirmBtn, { backgroundColor: getTypeColor() }]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmBtnText}>
                                {confirmText || (t as any)('common_ok') || 'OK'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('10%'),
    },
    alertBox: {
        width: '100%',
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,

    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 28,
        fontWeight: '500',
    },
    buttonRow: {
        width: '100%',
        justifyContent: 'center',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmBtn: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cancelBtn: {
        borderWidth: 1.5,
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CustomAlert;
