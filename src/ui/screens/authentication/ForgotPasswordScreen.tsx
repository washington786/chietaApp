import { Platform, Text, View } from 'react-native'
import React from 'react'
import { AuthWrapper } from '@/components/modules/authentication';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { RButton, RInput, RKeyboardView, RLogo, RRow, RText, SafeArea } from '@/components/common';
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import { IconButton } from 'react-native-paper';
import colors from '@/config/colors';

const ForgotPasswordScreen = () => {
    const { onBack, otp } = usePageTransition();
    return (
        <AuthWrapper>
            <SafeArea>
                <RRow>
                    {
                        Platform.OS === 'ios' ?
                            <RRow style={{ alignItems: "center" }}>
                                <IconButton icon={'chevron-left'} onPress={onBack} rippleColor={colors.violet[50]} />
                                <RText title='go back' onPress={onBack} style={styles.backButton}></RText>
                            </RRow>
                            :
                            <IconButton icon={'arrow-left'} onPress={onBack} />
                    }

                </RRow>
                <RLogo stylesLogo={{ alignContent: "center", marginTop: 60, marginBottom: 20, width: "auto" }} />
                <View style={styles.content}>
                    <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                        forgot your password
                    </Text>
                    <Text style={[styles.description]}>
                        please enter your email address to reset your password.
                    </Text>

                    <RKeyboardView style={{ gap: 12 }}>

                        <RInput placeholder='Email' icon={'mail'} />

                        <RButton title='reset password' onPressButton={otp} styleBtn={styles.button} />
                    </RKeyboardView>

                </View>
            </SafeArea>
        </AuthWrapper>
    )
}

export default ForgotPasswordScreen;