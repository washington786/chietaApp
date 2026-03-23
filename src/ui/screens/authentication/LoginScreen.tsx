import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import { RErrorMessage, RInput, RLoaderAnimation } from '@/components/common'
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

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
    const [rememberMe, setRememberMe] = useState(false);

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
                <Text style={authScreenStyles.footerLink}>Register</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <AuthScreenLayout title='Welcome Back' subtitle='Sign in to access the CHIETA IMS mobile app.' footer={footer}>
            <Formik initialValues={formValues} onSubmit={(values) => handleSubmit(values.email, values.password)} validationSchema={loginSchema}>
                {({ handleSubmit, handleBlur, handleChange, touched, errors, values }) => (
                    <View style={authScreenStyles.formWrapper}>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <RInput
                                placeholder='Enter your email'
                                icon='mail'
                                iconColor={colors.primary[600]}
                                keyboardType='email-address'
                                onChangeText={handleChange('email')}
                                placeholderTextColor='#9ca3af'
                                onBlur={handleBlur('email')}
                                value={values.email}
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            {touched.email && errors.email && <RErrorMessage error={errors.email} />}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordWrapper}>
                                <RInput
                                    placeholder='Enter your password'
                                    icon='lock'
                                    iconColor={colors.primary[600]}
                                    keyboardType='default'
                                    onChangeText={handleChange('password')}
                                    placeholderTextColor='#9ca3af'
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={!showPassword}
                                    customStyle={[authScreenStyles.inputField, styles.passwordInput]}
                                    style={styles.inputText}
                                />
                                <TouchableOpacity
                                    style={styles.togglePassword}
                                    onPress={() => setShowPassword(prev => !prev)}
                                >
                                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color='#9ca3af' />
                                </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && <RErrorMessage error={errors.password} />}
                        </View>

                        {/* Remember Me + Forgot Password */}
                        <View style={styles.rememberRow}>
                            <TouchableOpacity
                                style={styles.rememberLeft}
                                onPress={() => setRememberMe(prev => !prev)}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                    size={22}
                                    color={rememberMe ? colors.primary[700] : '#374151'}
                                />
                                <Text style={styles.rememberText}>Remember Me</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={resetPassword} activeOpacity={0.7}>
                                <Text style={authScreenStyles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <AuthGradientButton title='Login' onPress={handleSubmit} loading={isLoading} />

                        {isLoading && <RLoaderAnimation />}
                    </View>
                )}
            </Formik>
        </AuthScreenLayout>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    inputGroup: {
        gap: 6,
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: `${appFonts.semiBold}`,
        color: '#111827',
    },
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
    inputText: {
        color: '#111827',
    },
    rememberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
    rememberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rememberText: {
        fontSize: 14,
        color: '#374151',
        fontFamily: `${appFonts.medium}`,
    },
});
