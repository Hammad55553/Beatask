import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { theme, darkTheme } from '../theme';

// Auth
import WelcomeScreen from '../screens/Shared/WelcomeScreen';
import OnboardingStep1 from '../screens/Onboarding/OnboardingStep1';
import OnboardingStep2 from '../screens/Onboarding/OnboardingStep2';
import OnboardingStep3 from '../screens/Onboarding/OnboardingStep3';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterCustomerScreen from '../screens/Auth/RegisterCustomerScreen';
import RegisterProviderScreen from '../screens/Auth/RegisterProviderScreen';
import CustomerOTPScreen from '../screens/Auth/CustomerOTPScreen';
import ProviderOTPScreen from '../screens/Auth/ProviderOTPScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';
import UploadDocumentsScreen from '../screens/Auth/UploadDocumentsScreen';

// Customer
import CustomerTabNavigator from './CustomerTabNavigator';
import CategoryDetailsScreen from '../screens/Customer/CategoryDetailsScreen';
import SavedProvidersScreen from '../screens/Customer/SavedProvidersScreen';
import ProviderProfileScreen from '../screens/Customer/ProviderProfileScreen';
import BookingCalendarScreen from '../screens/Customer/BookingCalendarScreen';
import RequestServiceScreen from '../screens/Customer/RequestServiceScreen';
import PaymentMethodsScreen from '../screens/Customer/PaymentMethodsScreen';
import FilterScreen from '../screens/Customer/FilterScreen';
// I think 'Setting' in App.tsx was ProviderSettings. 
// Let's assume Customer Settings is dealt with in Profile or similar.
// Wait, I see "src/screens/Customer/ProfileSetupScreen.tsx".
import ProfileSetupScreen from '../screens/Customer/ProfileSetupScreen';

// Provider
import DashboardScreen from '../screens/Provider/DashboardScreen';
import ProviderBookingsScreen from '../screens/Provider/ProviderBookingsScreen';
import BidScreen from '../screens/Provider/BidScreen';
import ProviderMessagesListScreen from '../screens/Provider/ProviderMessagesListScreen';
import ProviderSettingsScreen from '../screens/Provider/ProviderSettingsScreen';
import WithdrawScreen from '../screens/Provider/WithdrawScreen';
import ProviderReviewsScreen from '../screens/Provider/ProviderReviewsScreen';
import AgreementScreen from '../screens/Provider/AgreementScreen';

// Shared
import ChatScreen from '../screens/Shared/ChatScreen';
import ProviderChatScreen from '../screens/Shared/ProviderChatScreen';

export type RootStackParamList = {
    Welcome: undefined;
    OnboardingStep1: undefined;
    OnboardingStep2: undefined;
    OnboardingStep3: undefined;
    Login: undefined;
    RegisterCustomer: undefined;
    RegisterProvider: undefined;
    CustomerOTP: undefined;
    ProviderOTP: undefined;
    OTPVerification: undefined;
    UploadDocuments: undefined;

    CustomerHome: undefined; // Main Tab
    CategoryDetails: undefined;
    SavedProviders: undefined;
    ProviderProfile: undefined; // 'Service' in old app
    BookingCalendar: undefined;
    RequestService: undefined;
    PaymentMethods: undefined;
    Filter: undefined;
    ProfileSetup: undefined;

    ProviderDashboard: undefined;
    ProviderBookings: undefined;
    Bid: undefined;
    ProviderMessages: undefined;
    ProviderSettings: undefined;
    Withdraw: undefined;
    ProviderReviews: undefined;
    Agreement: undefined;

    Chat: undefined;
    ProviderChat: undefined; // 'Chat1'
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const currentTheme = isDarkMode ? darkTheme : theme;

    return (
        <Stack.Navigator
            initialRouteName="CustomerHome"
            screenOptions={{
                headerStyle: { backgroundColor: currentTheme.colors.background },
                headerTintColor: currentTheme.colors.text,
                headerTitleAlign: 'center',
                statusBarColor: currentTheme.colors.background,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            {/* Auth Flow */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingStep1" component={OnboardingStep1} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingStep2" component={OnboardingStep2} options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingStep3" component={OnboardingStep3} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="RegisterCustomer" component={RegisterCustomerScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="RegisterProvider" component={RegisterProviderScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="CustomerOTP" component={CustomerOTPScreen} options={{ title: 'Verification' }} />
            <Stack.Screen name="ProviderOTP" component={ProviderOTPScreen} options={{ title: 'Verification' }} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} options={{ title: '2FA' }} />
            <Stack.Screen name="UploadDocuments" component={UploadDocumentsScreen} options={{ title: 'Upload Documents' }} />

            {/* Customer Flow */}
            <Stack.Screen name="CustomerHome" component={CustomerTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} options={{ title: 'Details' }} />
            <Stack.Screen name="SavedProviders" component={SavedProvidersScreen} options={{ title: 'Saved' }} />
            <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: 'Provider Profile' }} />
            <Stack.Screen name="BookingCalendar" component={BookingCalendarScreen} options={{ title: 'Book Service' }} />
            <Stack.Screen name="RequestService" component={RequestServiceScreen} options={{ title: 'Request' }} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment' }} />
            <Stack.Screen name="Filter" component={FilterScreen} options={{ title: 'Filter' }} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ title: 'Profile Setup' }} />

            {/* Provider Flow */}
            <Stack.Screen name="ProviderDashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProviderBookings" component={ProviderBookingsScreen} options={{ title: 'Bookings' }} />
            <Stack.Screen name="Bid" component={BidScreen} options={{ title: 'Bid' }} />
            <Stack.Screen name="ProviderMessages" component={ProviderMessagesListScreen} options={{ title: 'Messages' }} />
            <Stack.Screen name="ProviderSettings" component={ProviderSettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ title: 'Withdraw' }} />
            <Stack.Screen name="ProviderReviews" component={ProviderReviewsScreen} options={{ title: 'Reviews' }} />
            <Stack.Screen name="Agreement" component={AgreementScreen} options={{ title: 'Agreement' }} />

            {/* Shared */}
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
            <Stack.Screen name="ProviderChat" component={ProviderChatScreen} options={{ title: 'Chat' }} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
