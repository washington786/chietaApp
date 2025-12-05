import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthWrapper } from '@/components/modules/authentication';
import { RButton, RKeyboardView, RLogo, SafeArea } from '@/components/common';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Authstyles as styles } from '@/styles/AuthStyles';
import { Button } from 'react-native-paper';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { OtpInput } from "react-native-otp-entry";

const OtpScreen = () => {
    const { newPassword } = usePageTransition();
    const [canResend, setCanResend] = useState<Boolean>(false);
    const [timer, setTimer] = useState<number>(60);
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }

        const timeout = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timeout);
    }, [timer]);
    return (
        <AuthWrapper>
            <SafeArea>
                <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                <View style={styles.content}>
                    <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                        verify one time password
                    </Text>
                    <Text style={[styles.description]}>
                        enter the 6-digit code sent to your email address.
                    </Text>

                    <RKeyboardView style={{ gap: 8 }}>
                        <OtpInput numberOfDigits={6} onTextChange={(text) => console.log(text)} focusColor={colors.primary[600]} />

                        <RButton title='verify pin' onPressButton={newPassword} styleBtn={styles.button} />
                    </RKeyboardView>

                    <Button
                        textColor={colors.slate['700']}
                        labelStyle={{ fontFamily: `${appFonts.medium}` }}
                        style={styles.textButton}
                    >
                        <Text style={{ color: colors.primary['900'], fontFamily: `${appFonts.semiBold}` }}>
                            {canResend ? 'Resend Code' : 'Resend code in '} {timer ? `00:${timer < 10 ? `0${timer}` : timer}` : ''}
                        </Text>

                    </Button>

                </View>
            </SafeArea>
        </AuthWrapper>
    )
}

export default OtpScreen