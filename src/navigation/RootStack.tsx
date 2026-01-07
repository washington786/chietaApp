import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { ForgotPasswordScreen, LoginScreen, NewPasswordScreen, NotificationsPage, OtpScreen, RegisterScreen } from '@/ui/screens';
import { navigationTypes } from '@/core/types/navigationTypes';
import BottomTabNavigation from './BottomNavigation';
import { AccountSettingsPage, AddNewApplicationPage, AddNewOrganization, ApplicationDetailsPage, ApplicationStatusDetails, ChangePassword, DiscretionaryPage, LinkedOrganizationsPage, LinkOrgPage, MandatoryPage, PdfViewerPage, PrivacyPage, SupportPage } from '@/ui/pages';
import AddNewDgApplicationPage from '@/ui/pages/application/AddNewDgApplicationPage';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import useInitializeSession from '@/hooks/main/auth/useInitializeSession'

const Stack = createNativeStackNavigator<navigationTypes>();

// Protected screens that require authentication
const PROTECTED_SCREENS = ['app', 'notifications', 'newOrgLink', 'mandatory', 'account', 'linkedOrganizationsProfile', 'changePassword', 'privacy', 'support', 'discretionary', 'applicationDetails', 'historyDetails', 'orgDetail', 'pdfViewer', 'newApplication', 'newDgApplication']

// Inner component to use navigation hook
const RootStackNavigator = () => {
    const navigation = useNavigation<NavigationProp<navigationTypes>>()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    // Navigate to login when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            })
        }
    }, [isAuthenticated, navigation])

    // Set up navigation listener to enforce authentication on protected routes
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            const targetRoute = e.data.action.payload?.name

            // If trying to access protected screen without authentication, prevent navigation
            if (targetRoute && PROTECTED_SCREENS.includes(targetRoute) && !isAuthenticated) {
                e.preventDefault()
                // Force navigate to login
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                })
            }
        })

        return unsubscribe
    }, [navigation, isAuthenticated])

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isAuthenticated ? 'app' : 'login'}
        >
            {/* Auth Screens */}
            <Stack.Screen name='login' component={LoginScreen} />
            <Stack.Screen name='register' component={RegisterScreen} />
            <Stack.Screen name='reset' component={ForgotPasswordScreen} />
            <Stack.Screen name='otp' component={OtpScreen} />
            <Stack.Screen name='newPassword' component={NewPasswordScreen} />

            {/* App Screens */}
            <Stack.Screen name='app' component={BottomTabNavigation} />
            <Stack.Screen name='notifications' component={NotificationsPage} />
            <Stack.Screen name='newOrgLink' component={AddNewOrganization} />
            <Stack.Screen name='mandatory' component={MandatoryPage} />

            <Stack.Screen name='account' component={AccountSettingsPage} />
            <Stack.Screen name='linkedOrganizationsProfile' component={LinkedOrganizationsPage} />
            <Stack.Screen name='changePassword' component={ChangePassword} />
            <Stack.Screen name='privacy' component={PrivacyPage} />
            <Stack.Screen name='support' component={SupportPage} />
            <Stack.Screen name='discretionary' component={DiscretionaryPage} />
            <Stack.Screen name='applicationDetails' component={ApplicationDetailsPage} />

            <Stack.Screen name='historyDetails' component={ApplicationStatusDetails} />

            <Stack.Screen name='orgDetail' component={LinkOrgPage} />
            <Stack.Screen name='pdfViewer' component={PdfViewerPage} />

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
const RootStack = () => {
    useInitializeSession()

    return <RootStackNavigator />
}

export default RootStack

