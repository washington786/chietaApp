import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthWrapper } from '@/components/modules/authentication';
import { RButton, RErrorMessage, RKeyboardView, RLogo, SafeArea } from '@/components/common';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Authstyles as styles } from '@/styles/AuthStyles';
import { Button } from 'react-native-paper';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { OtpInput } from "react-native-otp-entry";
import { Formik } from 'formik';
import { otpSchema } from '@/core';

const initialValues = {
    otp: ''
}

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

    const handleSubmit = () => {
        newPassword();
    };

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

                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={otpSchema}>
                        {({ setFieldValue, handleBlur, handleSubmit, errors, touched }) => (
                            <RKeyboardView style={{ gap: 8 }}>
                                <OtpInput numberOfDigits={6} onTextChange={(text) => setFieldValue('otp', text)} onBlur={() => handleBlur('otp')} focusColor={colors.primary[600]} type='numeric' />
                                {
                                    errors.otp && touched.otp && <RErrorMessage error={errors.otp} />
                                }

                                <RButton title='verify pin' onPressButton={handleSubmit} styleBtn={styles.button} />
                            </RKeyboardView>
                        )}
                    </Formik>

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