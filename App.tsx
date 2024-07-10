import React from 'react';
import { NavigationContainer, useNavigation, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity, useColorScheme,Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens here
import SplashScreen from './src/screens/splashscreen'; 
import ServicesScreen from './src/screens/ServicesScreen'; 
import ServicesScreen1 from './src/screens/ServicesScreen1'; 
import ServicesScreen2 from './src/screens/ServicesScreen2'; 
import CreateBeatask from './src/screens/createbeatask/createaccountbeatask'; 
import CreateCustomer from './src/screens/createcustomer/createaccountcustomer'; 
import Upload from './src/screens/createbeatask/uplaoddoc'; 
import OTP from './src/screens/createbeatask/OTP';
import OTPCustomer from './src/screens/createcustomer/OTPcustomer'; 
import Login from './src/screens/Login/Login';
import OTPVerification from './src/screens/Login/OTPVerification';
import Home from './src/screens/Home/Homepage';
import Setting from './src/screens/Home/setting/setting';
import ProfileSetup from './src/screens/Home/setting/profileSetup';
import servicelisting from './src/screens/Home/setting/servicelisting';
import profile from './src/screens/Home/profile';
import Booked from './src/screens/Home/booked/booked';
import Review from './src/screens/Home/setting/review';
import Chat from './src/screens/Home/chat/chat';
import Service from './src/screens/Home/setting/Serviceprovider';
import Homeimp from './src/screens/Home/provider/Homeimp';
import Filter from './src/screens/Home/provider/filter';
import Masg from './src/screens/Home/provider/masg';
import payment from './src/screens/Home/provider/payment';
import calenderbook from './src/screens/Home/provider/calenderbooking';
import Request from './src/screens/Home/request';
import seved from './src/screens/Home/provider/sevedimp';
import masglist from './src/screens/Home/chat/masglist';

// Define RootStackParamList with appropriate types
export type RootStackParamList = {
  SplashScreen: undefined;
  ServicesScreen: undefined;
  ServicesScreen1: undefined;
  ServicesScreen2: undefined;
  CreateBeatask: undefined;
  Upload: undefined;
  OTP: undefined;
  CreateCustomer: undefined;
  OTPCustomer: undefined;
  Login: undefined;
  OTPVerification: undefined;
  Home: undefined;
  Setting: undefined;
  ProfileSetup: undefined;
  Profile: undefined;
  Servicelisting: undefined;
  Booked: undefined;
  Review: undefined;
  Chat: undefined;
  Service: undefined;
  Homeimp: undefined;
  Filter: undefined;
  Masg: undefined;
  payment: undefined;
  calenderbook: undefined;
  Request: undefined;
  seved: undefined;
  masglist: undefined;
};

// Create a Stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// App component
const App = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Custom component for headerRight
  const CustomHeaderRight = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const handleSettingsPress = () => {
      navigation.navigate('Home');
    };

    return (
      <TouchableOpacity onPress={handleSettingsPress} style={{ marginRight: 10 }}>
        <Icon name="home-outline" size={30} color={isDarkMode ? '#fff' : '#fff'} />
      </TouchableOpacity>
    );
  };

  

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="ServicesScreen" screenOptions={{ statusBarColor: '#010A0C', headerStyle: { backgroundColor: '#010A0C' }, headerTintColor: '#fff', headerTitleAlign: 'center' }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ServicesScreen" component={ServicesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ServicesScreen1" component={ServicesScreen1}options={{headerShown: true, title:'', headerStyle: {backgroundColor:'transparent',},headerTransparent: true,}}/>
        <Stack.Screen name="ServicesScreen2" component={ServicesScreen2}options={{headerShown: true, title:'', headerStyle: {backgroundColor:'transparent',},headerTransparent: true,}}/>
        <Stack.Screen name="CreateBeatask" component={CreateBeatask} options={{ title: 'Create Account' }} />
        <Stack.Screen name="CreateCustomer" component={CreateCustomer} options={{ title: 'Create Account' }} />
        <Stack.Screen name="Upload" component={Upload} options={{ title: 'Create Account' }} />
        <Stack.Screen name="OTP" component={OTP} options={{ title: 'Email Verification' }} />
        <Stack.Screen name="OTPCustomer" component={OTPCustomer} options={{ title: 'Email Verification' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} options={{ title: 'Two-factor Authentication' }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Setting" component={Setting} options={{ title: 'Setting' }} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetup} options={{ title: 'Profile Setup' }} />
        <Stack.Screen name="Servicelisting" component={servicelisting} options={{ title: 'Service Listing' }} />
        <Stack.Screen name="Profile" component={profile} options={{ title: 'Profile' }} />
        <Stack.Screen name="Booked" component={Booked} options={{ title: 'Booked' }} />
        <Stack.Screen name="Review" component={Review} options={{ title: 'Review' }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true, title: 'Maryland Winkles' }} />
        <Stack.Screen name="Service" component={Service} options={{ headerShown: true, title: 'Provider Profile' }} />
        <Stack.Screen name="Homeimp" component={Homeimp} options={{headerShown: true,title: 'Home Improvement',headerRight: () => <CustomHeaderRight/> }} />
        <Stack.Screen name="Filter" component={Filter} options={{headerShown: true,title: 'Filter'}} />
        <Stack.Screen name="Masg" component={Masg} options={{headerShown: true,title: 'Message service provider'}} />
        <Stack.Screen name="payment" component={payment} options={{headerShown: true,title: 'Payment methods'}} />
        <Stack.Screen name="calenderbook" component={calenderbook} options={{headerShown: true,title: 'Calendar booking'}} />
        <Stack.Screen name="Request" component={Request} options={{headerShown: true,title: 'Request service'}} />
        <Stack.Screen name="seved" component={seved} options={{headerShown: true,title: 'Saved Provider'}} />
        <Stack.Screen name="masglist" component={masglist} options={{headerShown: true,title: 'Message'}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
