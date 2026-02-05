import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@/config/colors'
import { RErrorMessage, RInput, RKeyboardView, RLoaderAnimation } from '@/components/common'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { Formik } from 'formik'
import { loginSchema, showToast } from '@/core'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { Feather } from '@expo/vector-icons'
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout'
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton'
import { clearError } from '@/store/slice/AuthSlice'

const formValues = {
    email: '',
    password: ''
}

const LoginScreen = () => {
    const { register, resetPassword, onAuth } = usePageTransition();
    const { login } = UseAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth)
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (email: string, password: string) => {
        const result = await login({
            email: email,
            password: password
        })

        if (result.type === 'auth/login/fulfilled') {
            onAuth();
        }
    }

    useEffect(() => {
        if (error) {
            showToast({ message: error.message, type: 'error', title: 'Login Error', position: "top" });
            dispatch(clearError());
        }
    }, [error, dispatch])

    const footer = (
        <View style={authScreenStyles.footerRow}>
            <Text style={authScreenStyles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={register}>
                <Text style={authScreenStyles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <AuthScreenLayout title='Welcome Back' subtitle='Sign in to access your IMS portal.' footer={footer}>
            <Formik initialValues={formValues} onSubmit={(values) => handleSubmit(values.email, values.password)} validationSchema={loginSchema}>
                {({ handleSubmit, handleBlur, handleChange, touched, errors, values }) => (
                    <RKeyboardView style={authScreenStyles.formWrapper}>
                        <RInput
                            placeholder='Email or Username'
                            icon={'mail'}
                            keyboardType='email-address'
                            onChangeText={handleChange('email')}
                            placeholderTextColor={colors.slate[200]}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {touched.email && errors.email && (<RErrorMessage error={errors.email} />)}

                        <View style={styles.passwordWrapper}>
                            <RInput
                                placeholder='Password'
                                icon={'lock'}
                                keyboardType='default'
                                onChangeText={handleChange("password")}
                                placeholderTextColor={colors.slate[200]}
                                onBlur={handleBlur("password")}
                                value={values.password}
                                secureTextEntry={!showPassword}
                                customStyle={[authScreenStyles.inputField, styles.passwordInput]}
                                style={styles.inputText}
                            />
                            <TouchableOpacity style={styles.togglePassword} onPress={() => setShowPassword((prev) => !prev)}>
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && (<RErrorMessage error={errors.password} />)}

                        <TouchableOpacity onPress={resetPassword} style={styles.forgotLink}>
                            <Text style={authScreenStyles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <AuthGradientButton title='Sign In' onPress={handleSubmit} loading={isLoading} />
                        {isLoading && <RLoaderAnimation />}
                    </RKeyboardView>
                )}
            </Formik>
        </AuthScreenLayout>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    passwordWrapper: {
        width: '100%',
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 48,
    },
    togglePassword: {
        position: 'absolute',
        right: 18,
        top: '35%',
    },
    forgotLink: {
        alignSelf: 'flex-end',
    },
    inputText: {
        color: '#fff',
    },
});
