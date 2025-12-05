import { StyleSheet } from 'react-native'
import RHeader from '@/components/common/RHeader'
import { RButton, RInput, Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'
import colors from '@/config/colors'

const ChangePassword = () => {
    return (
        <>
            <RHeader name='Change Password' />
            <Scroller style={styles.con}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
                    <RInput placeholder='Old Password' />
                    <RInput placeholder='New Password' />
                    <RInput placeholder='Confirm Password' />

                    <RButton title='Update Password' onPressButton={() => { }} styleBtn={styles.btn} />
                </Animated.View>
            </Scroller>
        </>
    )
}

export default ChangePassword

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