import React, { useState } from 'react'
import { AuthWrapper } from '@/components/modules/authentication'
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
            <SuccessWrapper onPress={login} />
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


interface props {
    onPress: () => void;
}
function SuccessWrapper({ onPress }: props) {
    return <>
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
        }}>
            {/* Success Icon with subtle entrance */}
            <Animated.View entering={FadeInDown.duration(600).springify()}>
                <RCol style={{ alignItems: "center", marginBottom: 8 }}>
                    <RCol style={{ width: 80, height: 80, borderRadius: 100, backgroundColor: colors.green[100], alignItems: "center", justifyContent: "center" }}>
                        <MaterialCommunityIcons name="check-circle" size={70} color={colors.green[800]} />
                    </RCol>
                </RCol>
            </Animated.View>

            {/* Title & Message */}
            <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                <Text variant='headlineSmall' style={{ textAlign: "center", color: colors.slate[900], marginBottom: 3 }}>
                    Password Updated!
                </Text>
                <Text variant='bodySmall' style={{ textAlign: "center", color: colors.slate[900], paddingHorizontal: 6 }}>
                    Your password has been changed successfully. You can now log in with your new password.
                </Text>
            </Animated.View>

            {/* Button */}
            <Animated.View
                entering={FadeInUp.delay(400).duration(600)}
                style={{ width: "100%", marginVertical: 10, paddingHorizontal: 8 }}
            >
                <RButton
                    title="Go to Login"
                    onPressButton={onPress}
                />
            </Animated.View>
        </View>
    </>
}

export default NewPasswordScreen