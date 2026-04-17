import { StyleSheet, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/responsive';
import { Text } from 'react-native-paper'
import colors from '../../config/colors'

const RErrorMessage = ({ error }: { error: string }) => {
    return (
        <View style={styles.con}>
            <Text variant='labelSmall' style={styles.text}>{error}</Text>
        </View>
    )
}

export default RErrorMessage

const styles = StyleSheet.create({
    con: {
        minHeight: verticalScale(40),
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    text: {
        color: colors.red[600]
    }
})