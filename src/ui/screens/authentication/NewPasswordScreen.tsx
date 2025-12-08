import React, { useState } from 'react'
import { AuthWrapper, SuccessWrapper } from '@/components/modules/authentication'
import { RButton, RErrorMessage, RInput, RKeyboardView, RLogo, SafeArea } from '@/components/common'
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { Formik } from 'formik';
import { newPasswordSchema } from '@/core';

const initialValues = {
    password: '',
    confirmPassword: ''
}

const NewPasswordScreen = () => {
    const { login } = usePageTransition();

    const [success, setSuccess] = useState<boolean>(false);

    const resetPassword = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        })
    }

    async function submit() {
        try {
            await resetPassword();
            setSuccess(true)

        } catch (error) {
            console.log(error);
            setSuccess(false);
        }
    }

    if (success) {
        return (
            <SuccessWrapper onPress={login} buttonTitle='go to login' title='Password Updated!' description='Your password has been changed successfully. You can now log in with your new password.' />
        )
    }

    const handleSubmit = () => {
        submit();
    }

    return (
        <AuthWrapper>
            <SafeArea>
                <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                <View style={styles.content}>
                    <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                        New Password
                    </Text>
                    <Text style={[styles.description]}>
                        enter your new password to continue to reset.
                    </Text>

                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={newPasswordSchema}>
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <RKeyboardView style={{ gap: 8 }}>
                                <RInput placeholder='New Password' onBlur={handleBlur('password')} onChangeText={handleChange('password')} value={values.password} />

                                {
                                    errors.password && touched.password && <RErrorMessage error={errors.password} />
                                }

                                <RInput placeholder='Confirm Password' value={values.confirmPassword} onBlur={handleBlur('confirmPassword')} onChangeText={handleChange('confirmPassword')} />
                                {
                                    errors.confirmPassword && touched.confirmPassword && <RErrorMessage error={errors.confirmPassword} />
                                }

                                <RButton title='submit' onPressButton={handleSubmit} styleBtn={styles.button} />
                            </RKeyboardView>
                        )}
                    </Formik>

                </View>
            </SafeArea>
        </AuthWrapper>
    )
}

export default NewPasswordScreen