import { StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import { Badge, Text } from 'react-native-paper'
import { getTimeOfDay } from '@/core/utils/dayTime'
import AntDesign from '@expo/vector-icons/Ionicons'
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
const Banner = () => {

    const time = new Date().getTime();

    const currentDayTime = getTimeOfDay(new Date(time));

    const { notifications } = usePageTransition();

    return (
        <RRow style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: scale(12) }}>
            <RCol style={{ flex: 1 }}>
                <Text variant='headlineLarge' style={[styles.text, styles.txtClr]}>Good {currentDayTime}</Text>
                <Text variant='bodyMedium' style={[styles.text, styles.txtClr]}>daniel mawasha</Text>
            </RCol>
            <RRow style={styles.not}>
                <AntDesign name="notifications-outline" size={moderateScale(30)} color="white" onPress={notifications} />
                <Badge style={styles.badge}>0</Badge>
            </RRow>
        </RRow>
    )
}

export default Banner

const styles = StyleSheet.create({
    text: {
        textTransform: "capitalize",
    },
    txtClr: {
        color: colors.primary[900]
    },
    not: {
        alignSelf: 'center', backgroundColor: colors.primary[900], borderRadius: scale(100), padding: scale(10),
        height: scale(50),
        width: scale(50),
        minHeight: verticalScale(50),
        maxHeight: scale(50),
        minWidth: scale(50),
        maxWidth: scale(50),
        justifyContent: "center",
        position: "relative"
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: colors.red[400]
    }
})