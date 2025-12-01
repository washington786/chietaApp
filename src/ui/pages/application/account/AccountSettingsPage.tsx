import { StyleSheet } from 'react-native'
import React from 'react'
import { RButton, RCol, RInput, Scroller } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'

const AccountSettingsPage = () => {
    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller style={styles.con}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
                    <RInput placeholder='First Name' />
                    <RInput placeholder='Last Name' />
                    <RInput placeholder='Username' />
                    <RInput placeholder='Email address' />

                    <RButton title='Update profile' onPressButton={() => { }} styleBtn={styles.btn} />
                </Animated.View>
            </Scroller>
        </>
    )
}

export default AccountSettingsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginTop: 10
    },
    btn: {
        backgroundColor: colors.primary[900],
        borderRadius: 5,
        marginTop: 30
    },
    col: {
        marginVertical: 10
    },
    anim: {
        gap: 8
    }
})