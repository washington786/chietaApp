import { Text, View } from 'react-native'
import React from 'react'
import colors from '@/config/colors'
import { Button } from 'react-native-paper'
import appFonts from '@/config/fonts'
import { AuthWrapper } from '@/components/modules/authentication'
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, SafeArea } from '@/components/common'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { Authstyles as styles } from '@/styles/AuthStyles'
import { Formik } from 'formik'
import { loginSchema } from '@/core'

const formValues = {
    email: '',
    password: ''
}

const LoginScreen = () => {
    const { register, resetPassword, onAuth } = usePageTransition();

    const handleSubmit = () => {
        onAuth();
    }

    return (
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

                    <Formik initialValues={formValues} onSubmit={handleSubmit} validationSchema={loginSchema}>
                        {({ handleSubmit, handleBlur, handleChange, touched, errors, values }) => (
                            <RKeyboardView style={{ gap: 12 }}>

                                <RInput placeholder='Email' icon={'mail'} onChangeText={handleChange('email')} onBlur={handleBlur('email')} />
                                {touched.email && errors.email && (<RErrorMessage error={errors.email} />)}

                                <RInput placeholder='Password' icon={'lock'} secureTextEntry onChangeText={handleChange("password")} onBlur={handleBlur("password")} />
                                {touched.password && errors.password && (<RErrorMessage error={errors.password} />)}

                                <RButton title='Sign In' onPressButton={handleSubmit} styleBtn={styles.button} />
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
    )
}

export default LoginScreen
