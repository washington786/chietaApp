import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'

import { SuccessWrapper } from '@/components/modules/authentication'
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout'
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton'
import { RErrorMessage, RInput, RKeyboardView, RLoaderAnimation } from '@/components/common'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { newPasswordSchema, showToast } from '@/core'
import colors from '@/config/colors'
import { RootState, AppDispatch } from '@/store/store'
import { clearResetState } from '@/store/slice/PasswordResetSlice'
import { clearError } from '@/store/slice/AuthSlice'

interface NewPasswordFormValues {
    password: string
    confirmPassword: string
}

const initialValues: NewPasswordFormValues = {
    password: '',
    confirmPassword: ''
}

const NewPasswordScreen = () => {
    const { login } = usePageTransition()
    const dispatch = useDispatch<AppDispatch>()
    const { email, otp } = useSelector((state: RootState) => state.passwordReset)
    const { verifyOtp } = UseAuth()
    const { isLoading, error } = useSelector((state: RootState) => state.auth)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (values: NewPasswordFormValues) => {
        const { password } = values

        if (!email || !otp) {
            showToast({
                message: 'Missing email or OTP. Please go through the reset password flow again.',
                type: 'error',
                title: 'Error',
                position: 'top'
            })
            return
        }

        const result = await verifyOtp({
            email,
            otp,
            newPassword: password
        })

        if (result.type === 'auth/verifyOtp/fulfilled') {
            dispatch(clearResetState())
            setSuccess(true)
            showToast({
                message: 'Password reset successfully',
                type: 'success',
                title: 'Success',
                position: 'top'
            })
        }
    }

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: 'error',
                title: 'Error',
                position: 'top'
            })
            dispatch(clearError())
        }
    }, [error, dispatch])

    if (!email || !otp) {
        return (
            <AuthScreenLayout title='Error' subtitle='Email or OTP not found. Please start the reset process again.'>
                <View>
                    <RErrorMessage error='Email or OTP not found. Please start the reset process again.' />
                </View>
            </AuthScreenLayout>
        )
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
        <AuthScreenLayout title='New Password' subtitle='Enter your new password to complete the reset.'>
            <Formik
                initialValues={initialValues}
                validationSchema={newPasswordSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <RKeyboardView style={authScreenStyles.formWrapper}>
                        <RInput
                            placeholder='New Password'
                            icon='lock'
                            secureTextEntry
                            onBlur={handleBlur('password')}
                            onChangeText={handleChange('password')}
                            value={values.password}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.password && touched.password && <RErrorMessage error={errors.password} />}

                        <RInput
                            placeholder='Confirm Password'
                            icon='lock'
                            secureTextEntry
                            value={values.confirmPassword}
                            onBlur={handleBlur('confirmPassword')}
                            onChangeText={handleChange('confirmPassword')}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                            <RErrorMessage error={errors.confirmPassword} />
                        )}

                        <AuthGradientButton title='Reset Password' onPress={handleSubmit} loading={isLoading} />
                        {isLoading && <RLoaderAnimation />}
                    </RKeyboardView>
                )}
            </Formik>
        </AuthScreenLayout>
    )
}

export default NewPasswordScreen

const styles = StyleSheet.create({
    inputText: {
        color: '#fff'
    }
})