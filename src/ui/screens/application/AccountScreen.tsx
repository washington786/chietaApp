import { StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { RCol, RDialog, RDivider, RLoaderAnimation, SafeArea, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { showToast } from '@/core'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import { AccWrapper, DeactivateAccount } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const AccountScreen = () => {
    const { account, privacy, support, changePassword, linkedOrganizations } = usePageTransition();
    const { logout } = UseAuth();

    const [visible, setVisible] = useState(false);
    const prevErrorRef = useRef<typeof error>(null);

    const { error, isLoading } = useSelector((state: RootState) => state.auth);

    const { open, close } = useGlobalBottomSheet();

    // Handle errors via useEffect
    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({
                message: error.message,
                type: "error",
                title: "Error",
                position: "top",
            })
        }
        prevErrorRef.current = error;
    }, [error])

    function handleDialog() {
        setVisible(!visible);
    };

    function handleContinue() {
        setVisible(false);
        logout();
        showToast({ message: "Successfully logout of your account.", type: "success", title: "Sign out", position: "top" })
    }

    function handleCloseSheet() {
        close();
        showToast({ message: "Successfully deactivated your account from CHIETA", type: "success", title: "Deactivated", position: "top" })
    }

    function handleBsheet() {
        open(<DeactivateAccount onPress={handleCloseSheet} />, { "snapPoints": ["60%"] });
    }

    return (
        <SafeArea>
            <Animated.View entering={FadeInDown.duration(600).springify()}>
                <RCol style={styles.conWrap}>
                    <Text variant='titleLarge' style={styles.textColor}>Account Management</Text>
                </RCol>
            </Animated.View>

            <Scroller style={{ marginTop: 20, paddingHorizontal: 12 }}>
                <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
                    <RCol style={{ borderRadius: 10, backgroundColor: colors.primary[50] }}>
                        <Text variant='titleSmall' style={{ paddingVertical: 5 }}>Profile Section</Text>
                        <RDivider />
                        <AccWrapper icon='person-sharp' title='Account settings' onPress={account} />
                        <AccWrapper icon='file-tray-outline' title='Linked Organizations' onPress={linkedOrganizations} />
                        <AccWrapper icon='lock-closed-outline' title='Change Password' onPress={changePassword} />
                        <AccWrapper icon='lock-closed-sharp' title='Privacy' onPress={privacy} />
                        <AccWrapper icon='help-circle-sharp' title='Support' onPress={support} />
                    </RCol>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
                    <RCol style={{ marginVertical: 10 }}>
                        <Text variant='titleSmall'>Application Section</Text>
                        <RDivider />
                        <AccWrapper icon='exit-outline' title='sign out' onPress={handleDialog} />
                        <AccWrapper icon='remove-circle-sharp' title='deactivate account' onPress={handleBsheet} />

                        {isLoading && <RLoaderAnimation />}
                    </RCol>
                </Animated.View>
            </Scroller>

            <RDialog hideDialog={handleDialog} visible={visible} message='are you sure you want to sign-out of account?' title='Sign out' onContinue={handleContinue} />


        </SafeArea>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12

    },
    textColor: {
        color: colors.primary[900]
    },

    //item
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    rw: {
        alignItems: "center",
        gap: 5,
        flex: 1,
        paddingVertical: 2
    },
    //btn sheet
    btn: {
        borderRadius: 5,
        backgroundColor: colors.red[800],
        marginVertical: 12,
        padding: 4
    },
    wrapperSheet: {
        gap: 5
    }
})