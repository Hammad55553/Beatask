import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, ImageBackground } from 'react-native';
import { Bubble, GiftedChat, IMessage, InputToolbar, Composer, Send, Time } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const ProviderChatScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const { t, isRTL } = useLanguage();

    // Get client info from route params
    const { client } = (route.params as any) || {
        client: {
            name: 'John Doe',
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
                text: 'Hello, I have an issue with my previous booking. Can you help?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: client.name,
                    avatar: client.image,
                },
            },
            {
                _id: 1,
                text: 'Sure! I am happy to assist you. Please describe the problem.',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'Me',
                },
                sent: true,
                received: true,
            },
        ]);
    }, [client]);

    const onSend = useCallback((messagesArray: IMessage[] = []) => {
        const newMessages = messagesArray.map(m => ({
            ...m,
            sent: true,
            received: true,
        }));
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages)
        );
    }, []);

    const renderBubble = (props: any) => {
        const isSelf = props.currentMessage.user._id === 1;
        return (
            <Animated.View entering={isSelf ? SlideInRight.springify() : SlideInLeft.springify()}>
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
                            borderRadius: 20,
                            padding: 4,
                            borderBottomLeftRadius: isRTL ? 20 : 5,
                            borderBottomRightRadius: isRTL ? 5 : 20,
                        },
                        right: {
                            backgroundColor: theme.colors.primary,
                            borderRadius: 20,
                            padding: 4,
                            borderBottomLeftRadius: isRTL ? 5 : 20,
                            borderBottomRightRadius: isRTL ? 20 : 5,
                        },
                    }}
                    textStyle={{
                        left: { color: theme.colors.text, fontSize: 15, textAlign: isRTL ? 'right' : 'left' },
                        right: { color: '#FFF', fontSize: 15, textAlign: isRTL ? 'right' : 'left' },
                    }}
                    renderTicks={() => null}
                    renderTime={(timeProps) => (
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', paddingRight: 8, paddingBottom: 4 }}>
                            <Time
                                {...timeProps}
                                timeTextStyle={{
                                    left: { color: theme.colors.textSecondary, fontSize: 10 },
                                    right: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
                                }}
                            />
                            {isSelf && (
                                <Icon
                                    name={props.currentMessage.received ? "check-all" : "check"}
                                    size={15}
                                    color={props.currentMessage.received ? "#40E0D0" : "rgba(255,255,255,0.5)"}
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
            containerStyle={[
                styles.inputToolbar,
                { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }
            ]}
            primaryStyle={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}
        />
    );

    const renderComposer = (props: any) => (
        <Composer
            {...props}
            textInputStyle={[styles.composer, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholderTextColor={theme.colors.textSecondary + '80'}
            placeholder={t('msg_send_placeholder')}
        />
    );

    const renderSend = (props: any) => (
        <Send {...props} containerStyle={[styles.sendContainer, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
            <View style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}>
                <Icon name={isRTL ? "send-variant" : "send"} size={20} color="#FFF" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
            </View>
        </Send>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.surface}
                translucent={false}
            />

            {/* Custom Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name={isRTL ? "chevron-right" : "chevron-left"} size={28} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={[styles.headerInfo, { flexDirection: isRTL ? 'row-reverse' : 'row', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
                    <View style={styles.avatarWrap}>
                        <Image source={client.image} style={styles.headerAvatar} />
                        {client.online && <View style={styles.headerOnline} />}
                    </View>
                    <View style={[styles.headerTextWrap, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <Text style={[styles.headerName, { color: theme.colors.text }]}>{client.name}</Text>
                        <Text style={[styles.headerStatus, { color: client.online ? '#4CAF50' : theme.colors.textSecondary }]}>
                            {client.online ? t('msg_online_status') : t('msg_offline_status')}
                        </Text>
                    </View>
                </View>

                <View style={[styles.headerActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity style={styles.headerActionBtn}>
                        <Icon name="phone-outline" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.headerActionBtn, { marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
                        <Icon name="dots-vertical" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Safety Banner */}
            {showSafetyBanner && (
                <Animated.View
                    entering={FadeInUp.duration(600)}
                    style={[styles.safetyBanner, { backgroundColor: isDarkMode ? '#1E1B16' : '#FFEDD5', borderColor: isDarkMode ? '#453319' : '#FED7AA', flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                    <Icon name="alert-circle" size={20} color="#F97316" />
                    <Text style={[styles.safetyText, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {t('msg_safety_1_desc')}
                    </Text>
                    <TouchableOpacity onPress={() => setShowSafetyBanner(false)}>
                        <Icon name="close" size={16} color={isDarkMode ? '#A16207' : '#9A3412'} />
                    </TouchableOpacity>
                </Animated.View>
            )}

            <ImageBackground
                source={{ uri: isDarkMode ? 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8d9744158173b36.jpg' : 'https://i.pinimg.com/736x/21/cd/ca/21cdcace425164d142142e032549d44e.jpg' }}
                style={{ flex: 1 }}
                imageStyle={{ opacity: isDarkMode ? 0.05 : 0.08 }}
            >
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderSend={renderSend}
                    renderUsernameOnMessage={false}
                    alwaysShowSend={true}
                    scrollToBottom={true}
                    infiniteScroll={true}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: hp('12%'),
        paddingTop: hp('4%'),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        borderBottomWidth: 1,
        zIndex: 10,
    },
    backBtn: {
        padding: 5,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrap: {
        position: 'relative',
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    headerOnline: {
        position: 'absolute',
        bottom: 2,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    headerTextWrap: {
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerStatus: {
        fontSize: 12,
        marginTop: 1,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActionBtn: {
        padding: 5,
    },
    safetyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        margin: 15,
        borderRadius: 12,
        borderWidth: 1,
    },
    safetyText: {
        flex: 1,
        fontSize: 12,
        color: '#9A3412',
        marginHorizontal: 10,
        fontWeight: '500',
    },
    inputToolbar: {
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    composer: {
        fontSize: 15,
        lineHeight: 20,
        marginTop: Platform.OS === 'ios' ? 10 : 5,
        marginBottom: Platform.OS === 'ios' ? 10 : 5,
        paddingHorizontal: 10,
    },
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProviderChatScreen;
