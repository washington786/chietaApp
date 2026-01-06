import { Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import colors from '@/config/colors'
import { Button } from 'react-native-paper'
import appFonts from '@/config/fonts'
import { AuthWrapper } from '@/components/modules/authentication'
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, SafeArea, Scroller } from '@/components/common'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { Authstyles as styles } from '@/styles/AuthStyles'
import { Formik } from 'formik'
import { loginSchema, showToast } from '@/core'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { clearError } from '@/store/slice/AuthSlice'

const formValues = {
    email: '',
    password: ''
}

const LoginScreen = () => {
    const { register, resetPassword, onAuth } = usePageTransition();
    const dispatch = useDispatch();
    const { login } = UseAuth();
    const { isLoading, error } = useSelector((state: RootState) => state.auth)
    const prevErrorRef = useRef<typeof error>(null);

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
        if (error && !prevErrorRef.current) {
            showToast({ message: error.message, type: 'error', title: 'Login Error', position: "top" });
            dispatch(clearError());
        }
        prevErrorRef.current = error;
    }, [error, dispatch])

    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <RLogo stylesLogo={{ alignContent: "center", marginTop: 90, marginBottom: 20, width: "auto" }} />
                    <View style={styles.content}>
                        <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500" }]}>
                            Welcome Back
                        </Text>
                        <Text style={[styles.description]}>
                            Sign in to continue to your account
                        </Text>

                        <Formik initialValues={formValues} onSubmit={(values) => handleSubmit(values.email, values.password)} validationSchema={loginSchema}>
                            {({ handleSubmit, handleBlur, handleChange, touched, errors, values }) => (
                                <RKeyboardView style={{ gap: 12 }}>

                                    <RInput placeholder='Email' icon={'mail'} onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                                    {touched.email && errors.email && (<RErrorMessage error={errors.email} />)}

                                    <RInput placeholder='Password' icon={'lock'} secureTextEntry onChangeText={handleChange("password")} onBlur={handleBlur("password")} value={values.password} />
                                    {touched.password && errors.password && (<RErrorMessage error={errors.password} />)}

                                    <RButton title='Sign In' onPressButton={handleSubmit} styleBtn={styles.button} isSubmitting={isLoading} />
                                </RKeyboardView>
                            )}
                        </Formik>


                        <Button
                            textColor={colors.slate['600']}
                            labelStyle={{ fontFamily: `${appFonts.medium}` }}
                            style={styles.textButton}
                            onPress={resetPassword}
                        >
                            Forgot Password?
                        </Button>

                        <Button
                            textColor={colors.slate['700']}
                            labelStyle={{ fontFamily: `${appFonts.medium}` }}
                            style={styles.textButton}
                            onPress={register}
                        >
                            Don’t have an account?{' '}
                            <Text style={{ color: colors.primary['900'], fontFamily: `${appFonts.semiBold}` }}>
                                Sign Up
                            </Text>
                        </Button>
                    </View>
                </SafeArea>
            </AuthWrapper>
        </Scroller>
    )
}

export default LoginScreen
