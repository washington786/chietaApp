import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ForgotPasswordScreen, LoginScreen, OtpScreen, RegisterScreen } from '@/ui/screens';
import { navigationTypes } from '@/core/types/navigationTypes';

const Stack = createNativeStackNavigator<navigationTypes>();

const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='login'>
            <Stack.Screen name='login' component={LoginScreen} />
            <Stack.Screen name='register' component={RegisterScreen} />
            <Stack.Screen name='reset' component={ForgotPasswordScreen} />
            <Stack.Screen name='otp' component={OtpScreen} />
        </Stack.Navigator>
    )
}

export default RootStack
