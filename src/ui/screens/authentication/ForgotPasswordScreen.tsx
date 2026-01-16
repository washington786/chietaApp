import { Platform, Text, View } from 'react-native'
import React from 'react'
import { AuthWrapper, BackBtn } from '@/components/modules/authentication';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, RRow, RText, SafeArea, Scroller } from '@/components/common';
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import { IconButton } from 'react-native-paper';
import colors from '@/config/colors';
import { Formik } from 'formik';
import { resetPasswordSchema, showToast } from '@/core';
import UseAuth from '@/hooks/main/auth/UseAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { ResetPasswordRequest } from '@/core/models/UserDto';
import { initializeReset } from '@/store/slice/PasswordResetSlice';
import { AppDispatch } from '@/store/store';

const initialValues = {
    email: ''
}

const ForgotPasswordScreen = () => {
    const { onBack, otp } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    const { resetPassword } = UseAuth();
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const handleSubmit = async (values: ResetPasswordRequest) => {
        const { email } = values;
        const result = await resetPassword({
            email: email,
        });

        if (result.type === 'auth/resetPassword/fulfilled') {
            // Store email in Redux state for password reset flow
            dispatch(initializeReset({ email: email }));

            showToast({
                message: "One time pin sent to your email",
                type: "success",
                title: "Success",
                position: "top",
            });

            // Navigate to OTP screen without passing email as param
            otp();
        }
    }

    if (error) {
        showToast({
            message: error.message,
            type: "error",
            title: "Login Error",
            position: "top",
        });
    }

    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <BackBtn />

                    <RLogo stylesLogo={{ alignContent: "center", marginTop: 120, marginBottom: 20, width: "auto" }} />

                    <View style={styles.content}>
                        <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "bold", textTransform: "capitalize" }]}>
                            forgot your password
                        </Text>
                        <Text style={[styles.description]}>
                            please enter your email address to reset your password.
                        </Text>

                        <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)} validationSchema={resetPasswordSchema}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <RKeyboardView style={{ gap: 12 }}>
                                    <RInput placeholder='Email' icon={'mail'} onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />

                                    {
                                        errors.email && touched.email && <RErrorMessage error={errors.email} />
                                    }

                                    <RButton title='reset password' onPressButton={handleSubmit} styleBtn={styles.button} isSubmitting={isLoading} />
                                </RKeyboardView>
                            )}
                        </Formik>


                    </View>
                </SafeArea>
            </AuthWrapper>
        </Scroller>
    )
}

export default ForgotPasswordScreen;