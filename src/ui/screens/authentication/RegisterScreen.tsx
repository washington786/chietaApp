import { Text, View } from 'react-native'
import React from 'react'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { AuthWrapper } from '@/components/modules/authentication';
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, SafeArea, Scroller } from '@/components/common';
import { Button } from 'react-native-paper';
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import colors from '@/config/colors';
import { Formik } from 'formik';
import { registerSchema } from '@/core';

const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userName: ''
}

const RegisterScreen = () => {
    const { login, onAuth } = usePageTransition();
    const handleSubmit = () => {
        onAuth();
    }
    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                    <View style={styles.content}>
                        <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                            Create new account
                        </Text>
                        <Text style={[styles.description]}>
                            set up username and password.you can always change it later.
                        </Text>

                        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={registerSchema}>
                            {({ handleBlur, handleChange, handleSubmit, errors, touched, values }) => (

                                <RKeyboardView style={{ gap: 8 }}>

                                    <RInput placeholder='first name' icon={'user'} onBlur={handleBlur('firstName')} onChangeText={handleChange('firstName')} value={values.firstName} />
                                    {
                                        errors.firstName && touched.firstName &&
                                        <RErrorMessage error={errors.firstName} />
                                    }

                                    <RInput placeholder='last name' icon={'user'} onBlur={handleBlur('lastName')} onChangeText={handleChange('lastName')} value={values.lastName} />
                                    {
                                        errors.lastName && touched.lastName &&
                                        <RErrorMessage error={errors.lastName} />
                                    }

                                    <RInput placeholder='username' icon={'user'} onBlur={handleBlur('userName')} onChangeText={handleChange('userName')} value={values.userName} />
                                    {
                                        errors.userName && touched.userName &&
                                        <RErrorMessage error={errors.userName} />
                                    }

                                    <RInput placeholder='Email' icon={'mail'} onBlur={handleBlur('email')} onChangeText={handleChange('email')} value={values.email} />
                                    {
                                        errors.email && touched.email &&
                                        <RErrorMessage error={errors.email} />
                                    }

                                    <RInput placeholder='Password' icon={'lock'} secureTextEntry onBlur={handleBlur('password')} onChangeText={handleChange('password')} value={values.password} />
                                    {
                                        errors.password && touched.password &&
                                        <RErrorMessage error={errors.password} />
                                    }

                                    <RInput placeholder='Confirm Password' icon={'lock'} secureTextEntry onBlur={handleBlur('confirmPassword')} onChangeText={handleChange('confirmPassword')} value={values.confirmPassword} />
                                    {
                                        errors.confirmPassword && touched.confirmPassword &&
                                        <RErrorMessage error={errors.confirmPassword} />
                                    }

                                    <RButton title='Sign Up' onPressButton={handleSubmit} styleBtn={styles.button} />
                                </RKeyboardView>
                            )}
                        </Formik>


                        <Button
                            textColor={colors.slate['700']}
                            labelStyle={{ fontFamily: `${appFonts.medium}` }}
                            style={styles.textButton}
                            onPress={login}
                        >
                            Alreadt have an account?{' '}
                            <Text style={{ color: colors.primary['900'], fontFamily: `${appFonts.semiBold}` }}>
                                Sign In
                            </Text>
                        </Button>
                    </View>
                </SafeArea>
            </AuthWrapper>
        </Scroller>
    )
}

export default RegisterScreen