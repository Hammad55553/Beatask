import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, useColorScheme, ScrollView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Font } from '../../components/coustomFonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { theme, darkTheme } from '../../theme';
import { ScreenContainer } from '../../components/common/ScreenContainer';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const currentTheme = isDarkMode ? darkTheme : theme;

  const createcoustomer = () => {
    navigation.navigate('RegisterCustomer' as never);
  };

  const createAsperTask = () => {
    navigation.navigate('RegisterProvider' as never);
  };

  const login = () => {
    navigation.navigate('Login' as never);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo11.png')} style={styles.logo} />
        </View>
        <Text style={[styles.title, { fontFamily: Font, color: currentTheme.colors.text }]}>Connect with {"\n"}service providers.{"\n"} Get tasks done quickly.</Text>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={createAsperTask}
        >
          <Text style={styles.buttonText}>I AM A ASPERTASKER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={createcoustomer}
        >
          <Text style={styles.buttonText}>I Need A ASPERTASKER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={login}
        >
          <Text style={styles.loginText}>SIGN IN</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('25%'),
    height: hp('12.5%'),
    resizeMode: 'contain',
    marginBottom: hp('6.25%'),
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    textAlign: 'center',
    marginHorizontal: wp('5%'),
    marginBottom: hp('5%'),
    lineHeight: hp('5.3%'),
  },
  createAccountButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('2.5%'),
  },
  buttonText: {
    color: '#0D0D0D',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
  },
  loginText: {
    color: '#12CCB7',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
