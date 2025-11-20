import { StyleSheet, View } from 'react-native'
import React from 'react'
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
        backgroundColor: colors.primary[600],
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
        borderRadius: 4
    },
    text: {
        color: colors.slate[50]
    }
})