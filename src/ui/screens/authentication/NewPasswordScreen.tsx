import React, { useState } from 'react'
import { AuthWrapper, SuccessWrapper } from '@/components/modules/authentication'
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, SafeArea, Scroller } from '@/components/common'
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { Formik } from 'formik';
import { newPasswordSchema, showToast } from '@/core';
import UseAuth from '@/hooks/main/auth/UseAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { clearResetState } from '@/store/slice/PasswordResetSlice';

interface NewPasswordFormValues {
    password: string
    confirmPassword: string
}

const initialValues: NewPasswordFormValues = {
    password: '',
    confirmPassword: ''
}

const NewPasswordScreen = () => {
    const { login } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    // Get email and otp from Redux state instead of route params
    const {
        email,
        otp,
    } = useSelector((state: RootState) => state.passwordReset);

    const { verifyOtp } = UseAuth();
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (values: NewPasswordFormValues) => {
        const { password } = values;

        if (!email || !otp) {
            showToast({
                message: "Missing email or OTP. Please go through the reset password flow again.",
                type: "error",
                title: "Error",
                position: "top",
            });
            return;
        }

        const result = await verifyOtp({
            email,
            otp,
            newPassword: password
        });

        if (result.type === 'auth/verifyOtp/fulfilled') {
            // Clear the password reset state after successful reset
            dispatch(clearResetState());

            setSuccess(true);
            showToast({
                message: "Password reset successfully",
                type: "success",
                title: "Success",
                position: "top",
            });
        }
    };

    if (error) {
        showToast({
            message: error.message,
            type: "error",
            title: "Error",
            position: "top",
        });
    }

    // Show error if email or otp is missing
    if (!email || !otp) {
        return (
            <Scroller>
                <AuthWrapper>
                    <SafeArea>
                        <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                        <View style={styles.content}>
                            <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                                Error
                            </Text>
                            <RErrorMessage error="Email or OTP not found. Please start the reset process again." />
                        </View>
                    </SafeArea>
                </AuthWrapper>
            </Scroller>
        );
    }

    if (success) {
        return (
            <SuccessWrapper
                onPress={login}
                buttonTitle='Go to Login'
                title='Password Updated!'
                description='Your password has been reset successfully. You can now log in with your new password.'
            />
        )
    }

    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                    <View style={styles.content}>
                        <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                            New Password
                        </Text>
                        <Text style={[styles.description]}>
                            Enter your new password to complete the reset.
                        </Text>

                        <Formik
                            initialValues={initialValues}
                            onSubmit={(values) => handleSubmit(values)}
                            validationSchema={newPasswordSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <RKeyboardView style={{ gap: 8 }}>
                                    <RInput
                                        placeholder='New Password'
                                        icon='lock'
                                        secureTextEntry
                                        onBlur={handleBlur('password')}
                                        onChangeText={handleChange('password')}
                                        value={values.password}
                                    />

                                    {
                                        errors.password && touched.password && <RErrorMessage error={errors.password} />
                                    }

                                    <RInput
                                        placeholder='Confirm Password'
                                        icon='lock'
                                        secureTextEntry
                                        value={values.confirmPassword}
                                        onBlur={handleBlur('confirmPassword')}
                                        onChangeText={handleChange('confirmPassword')}
                                    />
                                    {
                                        errors.confirmPassword && touched.confirmPassword && <RErrorMessage error={errors.confirmPassword} />
                                    }

                                    <RButton
                                        title='Reset Password'
                                        onPressButton={handleSubmit}
                                        styleBtn={styles.button}
                                        isSubmitting={isLoading}
                                    />
                                </RKeyboardView>
                            )}
                        </Formik>

                    </View>
                </SafeArea>
            </AuthWrapper>
        </Scroller>
    )
}

export default NewPasswordScreen