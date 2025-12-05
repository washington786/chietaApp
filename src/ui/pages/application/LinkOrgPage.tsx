import { StyleSheet } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { RButton, RCol, RRow, RUpload, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import AntDesign from '@expo/vector-icons/AntDesign';
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'

const LinkOrgPage = () => {
    const { onBack } = usePageTransition();

    function handleSubmit() {
        showToast({ message: "Successfully submitted your appointment.", title: "Submitted", type: "success", position: "bottom" })
        setTimeout(() => {
            onBack();
        }, 1000);
    }

    return (
        <>
            <RHeader name='Linking Organization' />
            <Scroller style={{ paddingHorizontal: 12 }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    <InfoWrapper />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)} >
                    <RCol style={styles.wrap}>
                        <RUpload onPress={() => { }} title='Upload Appointment Letter' />
                        <RButton title='submit' onPressButton={handleSubmit} styleBtn={styles.btn} />
                    </RCol>
                </Animated.View>

            </Scroller>
        </>
    )
}

function InfoWrapper() {
    return (
        <RRow style={styles.con}>
            <AntDesign name="info-circle" size={24} color="white" />
            <Text variant='bodySmall' style={styles.txt}>Please upload your organization appointment letter to start.</Text>
        </RRow>
    )
}

export default LinkOrgPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 6,
        paddingVertical: 8,
        backgroundColor: colors.yellow[600],
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4
    },
    txt: {
        color: colors.blue[50],
        fontFamily: `${appFonts.extaLight}`
    },
    wrap: {
        marginVertical: 16
    },
    btn: {
        marginTop: 8,
        backgroundColor: colors.primary[900]
    }
})