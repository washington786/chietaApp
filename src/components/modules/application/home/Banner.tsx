import { StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import { Badge, Text } from 'react-native-paper'
import { getTimeOfDay } from '@/core/utils/dayTime'
import AntDesign from '@expo/vector-icons/Ionicons'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
const Banner = () => {

    const time = new Date().getTime();

    const currentDayTime = getTimeOfDay(new Date(time));

    const { notifications } = usePageTransition();

    return (
        <RRow style={{ alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <RCol style={{ flex: 1 }}>
                <Text variant='headlineLarge' style={[styles.text, styles.txtClr]}>Good {currentDayTime}</Text>
                <Text variant='bodyMedium' style={[styles.text, styles.txtClr]}>daniel mawasha</Text>
            </RCol>
            <RRow style={styles.not}>
                <AntDesign name="notifications-outline" size={30} color="white" onPress={notifications} />
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
        alignSelf: 'center', backgroundColor: colors.primary[900], borderRadius: 100, padding: 10,
        height: 50,
        width: 50,
        minHeight: 50,
        maxHeight: 50,
        minWidth: 50,
        maxWidth: 50,
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