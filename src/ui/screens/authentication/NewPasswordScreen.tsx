import React, { useState } from 'react'
import { AuthWrapper, SuccessWrapper } from '@/components/modules/authentication'
import { RButton, RCol, RInput, RKeyboardView, RLogo, SafeArea } from '@/components/common'
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Text } from 'react-native-paper';
import { View } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import colors from '@/config/colors';

const NewPasswordScreen = () => {
    const { login } = usePageTransition();

    const [success, setSuccess] = useState<boolean>(false);

    const resetPassword = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        })
    }

    async function submit() {
        try {
            await resetPassword();
            setSuccess(true)

        } catch (error) {
            console.log(error);
            setSuccess(false);
        }
    }

    if (success) {
        return (
            <SuccessWrapper onPress={login} buttonTitle='go to login' title='Password Updated!' description='Your password has been changed successfully. You can now log in with your new password.' />
        )
    }

    return (
        <AuthWrapper>
            <SafeArea>
                <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                <View style={styles.content}>
                    <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                        New Password
                    </Text>
                    <Text style={[styles.description]}>
                        enter your new password to continue to reset.
                    </Text>

                    <RKeyboardView style={{ gap: 8 }}>
                        <RInput placeholder='New Password' />
                        <RInput placeholder='Confirm Password' />

                        <RButton title='submit' onPressButton={submit} styleBtn={styles.button} />
                    </RKeyboardView>

                </View>
            </SafeArea>
        </AuthWrapper>
    )
}

export default NewPasswordScreen