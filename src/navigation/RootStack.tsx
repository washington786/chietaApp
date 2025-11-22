import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ForgotPasswordScreen, LoginScreen, NotificationsPage, OtpScreen, RegisterScreen } from '@/ui/screens';
import { navigationTypes } from '@/core/types/navigationTypes';
import BottomTabNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator<navigationTypes>();

const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='app'>
            <Stack.Screen name='login' component={LoginScreen} />
            <Stack.Screen name='register' component={RegisterScreen} />
            <Stack.Screen name='reset' component={ForgotPasswordScreen} />
            <Stack.Screen name='otp' component={OtpScreen} />
            <Stack.Screen name='app' component={BottomTabNavigation} />
            <Stack.Screen name='notifications' component={NotificationsPage} />
        </Stack.Navigator>
    )
}

export default RootStack
