import { Text, View } from 'react-native'
import React from 'react'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { AuthWrapper } from '@/components/modules';
import { RButton, RInput, RKeyboardView, RLogo, SafeArea } from '@/components/common';
import { Button } from 'react-native-paper';
import { Authstyles as styles } from '@/styles/AuthStyles';
import appFonts from '@/config/fonts';
import colors from '@/config/colors';

const RegisterScreen = () => {
    const { login } = usePageTransition();
    return (
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

                    <RKeyboardView style={{ gap: 8 }}>
                        <RInput placeholder='first name' icon={'user'} />
                        <RInput placeholder='last name' icon={'user'} />
                        <RInput placeholder='username' icon={'user'} />
                        <RInput placeholder='Email' icon={'mail'} />

                        <RInput placeholder='Password' icon={'lock'} secureTextEntry />
                        <RInput placeholder='Confirm Password' icon={'lock'} secureTextEntry />

                        <RButton title='Sign Up' onPressButton={() => { }} styleBtn={styles.button} />
                    </RKeyboardView>


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
    )
}

export default RegisterScreen