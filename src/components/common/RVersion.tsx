import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'

const RVersion = () => {
    return (
        <View style={styles.con}>
            <Text variant='titleSmall' style={styles.appName}>Chieta IMS</Text>
            <Text variant='bodySmall' style={styles.versionText}>Version 1.0.0</Text>
            <Text variant='bodySmall' style={styles.versionText}>&copy; 2025 Chieta IMS</Text>
        </View>
    )
}

export default RVersion

const styles = StyleSheet.create({
    con: {
        alignItems: 'flex-start',
        marginVertical: 10,
        width: 'auto',
        backgroundColor: colors.primary[50],
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.slate[100]
    },
    versionText: {
        fontSize: 10,
        fontWeight: 'thin',
        color: colors.gray[400]
    },
    appName: {
        fontSize: 13,
        fontWeight: "medium",
        color: colors.gray[500]
    }
})