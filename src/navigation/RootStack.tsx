import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ForgotPasswordScreen, LoginScreen, NotificationsPage, OtpScreen, RegisterScreen } from '@/ui/screens';
import { navigationTypes } from '@/core/types/navigationTypes';
import BottomTabNavigation from './BottomNavigation';
import { AccountSettingsPage, AddNewApplicationPage, AddNewOrganization, ApplicationDetailsPage, ApplicationStatusDetails, DiscretionaryPage, LinkOrgPage, MandatoryPage, PrivacyPage, SupportPage } from '@/ui/pages';
import AddNewDgApplicationPage from '@/ui/pages/application/AddNewDgApplicationPage';

const Stack = createNativeStackNavigator<navigationTypes>();

const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='login'>
            <Stack.Screen name='login' component={LoginScreen} />
            <Stack.Screen name='register' component={RegisterScreen} />
            <Stack.Screen name='reset' component={ForgotPasswordScreen} />
            <Stack.Screen name='otp' component={OtpScreen} />
            <Stack.Screen name='app' component={BottomTabNavigation} />
            <Stack.Screen name='notifications' component={NotificationsPage} />
            <Stack.Screen name='newOrgLink' component={AddNewOrganization} />
            <Stack.Screen name='mandatory' component={MandatoryPage} />
            <Stack.Screen name='account' component={AccountSettingsPage} />
            <Stack.Screen name='privacy' component={PrivacyPage} />
            <Stack.Screen name='support' component={SupportPage} />
            <Stack.Screen name='discretionary' component={DiscretionaryPage} />
            <Stack.Screen name='applicationDetails' component={ApplicationDetailsPage} />
            <Stack.Screen name='historyDetails' component={ApplicationStatusDetails} />

            <Stack.Screen name='orgDetail' component={LinkOrgPage} />

            <Stack.Screen name='newApplication' component={AddNewApplicationPage} options={{
                presentation: "fullScreenModal",
                animation: "slide_from_bottom",
                headerShown: false
            }} />

            <Stack.Screen name='newDgApplication' component={AddNewDgApplicationPage} options={{
                presentation: "fullScreenModal",
                animation: "slide_from_bottom",
                headerShown: false
            }} />
        </Stack.Navigator>
    )
}

export default RootStack
