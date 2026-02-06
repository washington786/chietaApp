import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { RErrorMessage, RInput, RKeyboardView, RLoaderAnimation } from '@/components/common';
import colors from '@/config/colors';
import { Formik } from 'formik';
import { resetPasswordSchema, showToast } from '@/core';
import UseAuth from '@/hooks/main/auth/UseAuth';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ResetPasswordRequest } from '@/core/models/UserDto';
import { initializeReset } from '@/store/slice/PasswordResetSlice';
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout';
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton';
import { clearError } from '@/store/slice/AuthSlice';

const initialValues = {
    email: ''
}

const ForgotPasswordScreen = () => {
    const { otp } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    const { resetPassword } = UseAuth();
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: "error",
                title: "Login Error",
                position: "top",
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

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

    return (
        <AuthScreenLayout
            title='Forgot your password'
            subtitle='Please enter your email address to reset your password.'
        >
            <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)} validationSchema={resetPasswordSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <RKeyboardView style={authScreenStyles.formWrapper}>
                        <RInput
                            placeholder='Email'
                            icon={'mail'}
                            onChangeText={handleChange('email')}
                            placeholderTextColor={colors.slate[200]}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />

                        {errors.email && touched.email && <RErrorMessage error={errors.email} />}

                        <AuthGradientButton title='Reset Password' onPress={handleSubmit} loading={isLoading} />
                        {isLoading && <RLoaderAnimation />}
                    </RKeyboardView>
                )}
            </Formik>
        </AuthScreenLayout>
    )
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    inputText: {
        color: '#fff',
    },
});