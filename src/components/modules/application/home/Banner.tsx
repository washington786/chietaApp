import { StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
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
                <Text variant='headlineLarge' style={styles.text}>Good {currentDayTime}</Text>
                <Text variant='bodyMedium' style={styles.text}>daniel mawasha</Text>
            </RCol>
            {/* TODO:ADD NOTIFICATION INDICATOR */}
            <AntDesign name="notifications-outline" size={35} color="black" style={{ alignSelf: 'center', backgroundColor: colors.violet[100], borderRadius: 100, padding: 10 }} onPress={notifications} />
        </RRow>
    )
}

export default Banner

const styles = StyleSheet.create({
    text: {
        textTransform: "capitalize",
    }
})