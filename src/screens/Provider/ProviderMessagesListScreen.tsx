import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Platform,
  Image,
  SafeAreaView,
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, {
  FadeInDown,
  FadeInLeft,
  Layout,
  ZoomIn
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// --- Mock Data ---
const RECENT_CLIENTS = [
  { id: '1', name: 'John', image: require('../../assets/images/category/user.png'), online: true },
  { id: '2', name: 'Jane', image: require('../../assets/images/category/user.png'), online: true },
  { id: '3', name: 'Robert', image: require('../../assets/images/category/user.png'), online: false },
  { id: '4', name: 'Emily', image: require('../../assets/images/category/user.png'), online: true },
];

const CHATS = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'I need to reschedule the plumbing work.',
    time: '11:45 AM',
    unread: 1,
    online: true,
    image: require('../../assets/images/category/user.png'),
    typing: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'The quote looks good. When can you start?',
    time: 'Yesterday',
    unread: 0,
    online: false,
    image: require('../../assets/images/category/user.png'),
    typing: false,
  },
  {
    id: '3',
    name: 'Robert Fox',
    lastMessage: 'Thank you for the quick repair!',
    time: 'Monday',
    unread: 0,
    online: true,
    image: require('../../assets/images/category/user.png'),
    typing: false,
  }
];

const SafetyOverlay = ({ visible, onClose, theme, isDarkMode, t, isRTL }: any) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <Animated.View entering={ZoomIn.duration(400)} style={[styles.safetyCard, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.safetyHeader, { backgroundColor: isDarkMode ? '#FFB80020' : '#FFF9E5' }]}>
          <Icon name="shield-lock" size={40} color="#FFB800" />
          <Text style={[styles.safetyTitle, { color: '#FFB800' }]}>{t('msg_safety_title')}</Text>
        </View>

        <ScrollView style={styles.safetyContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.safetyIntro, { color: theme.colors.text, textAlign: 'center' }]}>
            {t('msg_safety_intro')}
          </Text>

          {[
            { title: t('msg_safety_1_title'), desc: t('msg_safety_1_desc'), icon: 'cash-check' },
            { title: t('msg_safety_2_title'), desc: t('msg_safety_2_desc'), icon: 'briefcase-account' },
            { title: t('msg_safety_3_title'), desc: t('msg_safety_3_desc'), icon: 'shield-account' }
          ].map((item, idx) => (
            <View key={idx} style={[styles.safetyItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.safetyIconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                <Icon name={item.icon} size={20} color={theme.colors.primary} />
              </View>
              <View style={[styles.safetyTextRow, { marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.safetyItemTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{item.title}</Text>
                <Text style={[styles.safetyItemDesc, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={[styles.safetyCloseBtn, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
          <Text style={styles.safetyCloseText}>{t('msg_safety_understand')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

const MessageItem = ({ item, index, theme, isRTL, onPress, t }: any) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600).springify()}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.chatCard,
          {
            backgroundColor: theme.colors.surface,
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image source={item.image} style={styles.avatar} />
          {item.online && <View style={styles.onlineBadge} />}
        </View>

        <View style={[styles.chatInfo, { marginLeft: isRTL ? 0 : 18, marginRight: isRTL ? 18 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <View style={[styles.chatHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.nameText, { color: theme.colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>{item.time}</Text>
          </View>

          <View style={[styles.chatFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {item.typing ? (
              <Text style={[styles.typingText, { color: theme.colors.primary }]}>{t('msg_typing')}</Text>
            ) : (
              <Text
                style={[
                  styles.lastMsg,
                  {
                    color: item.unread > 0 ? theme.colors.text : theme.colors.textSecondary,
                    fontWeight: item.unread > 0 ? '700' : '400',
                    textAlign: isRTL ? 'right' : 'left'
                  }
                ]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            )}
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProviderMessagesListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyVisible, setSafetyVisible] = useState(true);

  const filteredChats = useMemo(() => {
    return CHATS.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />

      <SafetyOverlay
        visible={safetyVisible}
        onClose={() => setSafetyVisible(false)}
        theme={theme}
        isDarkMode={isDarkMode}
        t={t}
        isRTL={isRTL}
      />

      {/* Header Content */}
      <View style={styles.header}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>{t('msg_chats')}</Text>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('msg_title')}</Text>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => setSafetyVisible(true)}
            >
              <Icon name="shield-lock" size={22} color="#FFB800" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>
              <Icon name="cog-outline" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Icon name="magnify" size={22} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('msg_search_placeholder')}
            placeholderTextColor={theme.colors.textSecondary + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('12%') }}>
        {/* Active Leads Section */}
        <View style={styles.storiesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('msg_online')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: wp('5%') }}>
            {RECENT_CLIENTS.map((client, index) => (
              <Animated.View
                key={client.id}
                entering={FadeInLeft.delay(index * 100).duration(500)}
                style={[styles.storyItem, { marginRight: isRTL ? 0 : 15, marginLeft: isRTL ? 15 : 0 }]}
              >
                <View style={[styles.storyAvatarOuter, { borderColor: client.online ? theme.colors.primary : theme.colors.border }]}>
                  <Image source={client.image} style={styles.storyAvatar} />
                  {client.online && <View style={styles.storyOnlineBadge} />}
                </View>
                <Text style={[styles.storyName, { color: theme.colors.text }]} numberOfLines={1}>{client.name}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Conversations List */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left', marginBottom: 10 }]}>{t('msg_conversations')}</Text>
          {filteredChats.length > 0 ? (
            filteredChats.map((item, index) => (
              <MessageItem
                key={item.id}
                item={item}
                index={index}
                theme={theme}
                isRTL={isRTL}
                t={t}
                onPress={() => (navigation as any).navigate('ProviderChat', { client: item })}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="text-box-remove-outline" size={60} color={theme.colors.textSecondary + '30'} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>{t('msg_no_conversations')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 2,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  storiesSection: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: wp('5%'),
    marginBottom: 15,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  storyAvatarOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storyOnlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  storyName: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  listSection: {
    paddingTop: 10,
  },
  chatCard: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: 18,
    marginHorizontal: wp('3%'),
    borderRadius: 24,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  typingText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  safetyCard: {
    width: '100%',
    maxHeight: hp('70%'),
    borderRadius: 36,
    overflow: 'hidden',
  },
  safetyHeader: {
    padding: 30,
    alignItems: 'center',
  },
  safetyTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },
  safetyContent: {
    padding: 24,
  },
  safetyIntro: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  safetyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyTextRow: {
    flex: 1,
  },
  safetyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  safetyItemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  safetyCloseBtn: {
    margin: 24,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyCloseText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProviderMessagesListScreen;
