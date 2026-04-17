import { StyleSheet, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from '@/utils/responsive';

import { Ionicons } from "@expo/vector-icons"
import { Text } from 'react-native-paper'
import colors from '../../config/colors'

const RNotification = ({ title }: { title: string }) => {
    return (
        <View style={styles.con}>
            <Ionicons name='notifications-circle' size={30} />
            <Text variant='bodySmall'>{title}</Text>
        </View>
    )
}

export default RNotification

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[100],
        minHeight: verticalScale(40),
        alignItems: "center",
        flexDirection: "row",
        gap: scale(8),
        padding: scale(8),
        borderRadius: scale(8),
    }
})