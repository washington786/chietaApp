import { StyleSheet, View } from 'react-native'
import React from 'react'

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
        minHeight: 40,
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        padding: 8,
        borderRadius: 8
    }
})