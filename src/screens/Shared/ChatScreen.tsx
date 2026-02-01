import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    Platform,
    ImageBackground,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import { Bubble, GiftedChat, IMessage, InputToolbar, Composer, Send, Time, MessageText } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeIn,
    SlideInRight,
    SlideInLeft,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const WatermarkBackground = ({ isDarkMode, theme }: any) => {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.watermarkContainer}>
                {[...Array(20)].map((_, i) => (
                    <View key={i} style={styles.watermarkRow}>
                        {[...Array(5)].map((_, j) => (
                            <Text
                                key={j}
                                style={[
                                    styles.watermarkText,
                                    { color: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }
                                ]}
                            >
                                BEATASK OFFICIAL
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const ChatScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();

    const { provider } = (route.params as any) || {
        provider: {
            name: 'Maryland Winkles',
            online: true,
            image: require('../../assets/images/category/user.png')
        }
    };

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [showSafetyBanner, setShowSafetyBanner] = useState(true);

    useEffect(() => {
        setMessages([
            {
                _id: 2,
                text: 'Hi, I can help you with your cleaning project. When would you like me to visit?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: provider.name,
                    avatar: provider.image,
                },
                sent: true,
                received: true,
            },
            {
                _id: 1,
                text: 'Hello! I need home deep cleaning for this weekend.',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'Me',
                },
                sent: true,
                received: true,
            },
        ]);
    }, [provider]);

    const onSend = useCallback((messagesArray: IMessage[] = []) => {
        const newMessages = messagesArray.map(m => ({
            ...m,
            sent: true,
            received: false,
        }));
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages)
        );
    }, []);

    const renderBubble = (props: any) => {
        const isSelf = props.currentMessage.user._id === 1;

        return (
            <Animated.View
                entering={isSelf ? SlideInRight.springify() : SlideInLeft.springify()}
                style={styles.bubbleWrapper}
            >
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                            borderRadius: 24,
                            borderBottomLeftRadius: isRTL ? 24 : 4,
                            borderBottomRightRadius: isRTL ? 4 : 24,
                            padding: 2,
                            borderWidth: 1,
                            borderColor: isDarkMode ? '#374151' : '#F3F4F6',
                            elevation: 0,
                        },
                        right: {
                            backgroundColor: theme.colors.primary,
                            borderRadius: 24,
                            borderBottomLeftRadius: isRTL ? 4 : 24,
                            borderBottomRightRadius: isRTL ? 24 : 4,
                            padding: 2,
                            elevation: 0,
                        },
                    }}
                    renderTicks={() => null}
                    textStyle={{
                        left: { color: theme.colors.text, fontSize: 15, lineHeight: 22 },
                        right: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
                    }}
                    renderTime={(timeProps) => (
                        <View style={[styles.timeContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Time
                                {...timeProps}
                                timeTextStyle={{
                                    left: { color: theme.colors.textSecondary, fontSize: 10 },
                                    right: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
                                }}
                            />
                            {isSelf && (
                                <Icon
                                    name={props.currentMessage.received ? "check-all" : "check"}
                                    size={14}
                                    color="rgba(255,255,255,0.8)"
                                    style={{ marginLeft: 4 }}
                                />
                            )}
                        </View>
                    )}
                />
            </Animated.View>
        );
    };

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbarContainer}
            renderComposer={(composerProps) => (
                <View style={[styles.customInputContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', borderColor: theme.colors.border }]}>
                    <TouchableOpacity style={styles.attachmentBtn}>
                        <Icon name="plus-circle" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Composer
                        {...composerProps}
                        textInputStyle={[styles.composerInput, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('msg_send_placeholder')}
                        placeholderTextColor={theme.colors.textSecondary + '80'}
                    />
                    <Send {...props}>
                        <View style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}>
                            <Icon name={isRTL ? "arrow-left" : "arrow-up"} size={22} color="#FFF" />
                        </View>
                    </Send>
                </View>
            )}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.surface}
                translucent={false}
            />

            <ImageBackground
                source={{ uri: isDarkMode ? 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8d9744158173b36.jpg' : 'https://i.pinimg.com/736x/21/cd/ca/21cdcace425164d142142e032549d44e.jpg' }}
                style={{ flex: 1 }}
                imageStyle={{ opacity: isDarkMode ? 0.08 : 0.12 }}
            >
                <WatermarkBackground isDarkMode={isDarkMode} theme={theme} />

                {/* Premium Header */}
                <Animated.View entering={FadeInDown.duration(800)} style={[styles.header, { backgroundColor: theme.colors.surface + 'F2', borderBottomColor: theme.colors.border }]}>
                    <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={30} color={theme.colors.text} />
                        </TouchableOpacity>

                        <View style={[styles.userInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={styles.avatarContainer}>
                                <Image source={provider.image} style={styles.avatar} />
                                {provider.online && <View style={styles.onlineDot} />}
                            </View>
                            <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.userName, { color: theme.colors.text }]}>{provider.name}</Text>
                                <Text style={[styles.userStatus, { color: provider.online ? '#10B981' : theme.colors.textSecondary }]}>
                                    {provider.online ? t('msg_online_status') : t('msg_offline_status')}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.headerActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <TouchableOpacity style={styles.actionIcon}>
                                <Icon name="phone-outline" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionIcon, { marginLeft: 15 }]}>
                                <Icon name="dots-vertical" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Safety Banner */}
                {showSafetyBanner && (
                    <Animated.View
                        entering={FadeInUp.delay(500).springify()}
                        style={[styles.safetyBanner, { backgroundColor: isDarkMode ? 'rgba(30, 27, 22, 0.9)' : 'rgba(255, 249, 235, 0.9)', borderColor: isDarkMode ? '#453319' : '#FEF3C7' }]}
                    >
                        <Icon name="shield-check" size={20} color="#F59E0B" />
                        <Text style={[styles.safetyText, { color: isDarkMode ? '#FDE68A' : '#92400E', textAlign: isRTL ? 'right' : 'left' }]}>
                            Official Chat: For your protection, never share personal contact details or pay outside the app.
                        </Text>
                        <TouchableOpacity onPress={() => setShowSafetyBanner(false)}>
                            <Icon name="close" size={18} color={isDarkMode ? '#FDE68A' : '#92400E'} />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    renderInputToolbar={renderInputToolbar}
                    renderUsernameOnMessage={false}
                    alwaysShowSend={true}
                    scrollToBottom
                    infiniteScroll
                    bottomOffset={0}
                    minInputToolbarHeight={70}
                    placeholder={t('msg_send_placeholder')}
                    renderAvatar={null}
                    inverted={true}
                    listViewProps={{
                        contentContainerStyle: {
                            paddingBottom: Platform.OS === 'ios' ? 40 : 20,
                            paddingTop: 10
                        }
                    }}
                />
            </ImageBackground>
            {Platform.OS === 'android' && <View style={{ height: 10 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    watermarkContainer: {
        opacity: 0.5,
        transform: [{ rotate: '-30deg' }, { scale: 1.5 }],
    },
    watermarkRow: {
        flexDirection: 'row',
        paddingVertical: 20,
    },
    watermarkText: {
        fontSize: 14,
        fontWeight: '900',
        marginHorizontal: 30,
        letterSpacing: 2,
    },
    header: {
        height: hp('13%'),
        paddingTop: hp('5%'),
        paddingHorizontal: wp('4%'),
        borderBottomWidth: 1,
        zIndex: 100,
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        padding: 5,
    },
    userInfo: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: '#eee',
    },
    onlineDot: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    textContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    userName: {
        fontSize: 17,
        fontWeight: '800',
    },
    userStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    headerActions: {
        alignItems: 'center',
    },
    actionIcon: {
        padding: 5,
    },
    safetyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        margin: 15,
        borderRadius: 20,
        borderWidth: 1,
        zIndex: 10,
    },
    safetyText: {
        flex: 1,
        fontSize: 11,
        marginHorizontal: 10,
        fontWeight: '700',
        lineHeight: 16,
    },
    bubbleWrapper: {
        marginBottom: 2,
    },
    timeContainer: {
        alignItems: 'center',
        paddingRight: 8,
        paddingBottom: 4,
    },
    inputToolbarContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        paddingHorizontal: wp('3%'),
        marginBottom: Platform.OS === 'ios' ? 0 : 5,
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        minHeight: 56,
        width: wp('94%'),
    },
    attachmentBtn: {
        padding: 8,
    },
    composerInput: {
        fontSize: 16,
        lineHeight: 20,
        marginTop: Platform.OS === 'ios' ? 10 : 2,
        paddingTop: 8,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
});

export default ChatScreen;
