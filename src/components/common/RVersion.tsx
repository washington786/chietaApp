import { StyleSheet, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Constants from 'expo-constants'

const RVersion = () => {
    const version = Constants.expoConfig?.version ?? '—'
    return (
        <View style={styles.con}>
            <Text variant='titleSmall' style={styles.appName}>Chieta IMS</Text>
            <Text variant='bodySmall' style={styles.versionText}>Version {version}</Text>
            <Text variant='bodySmall' style={styles.versionText}>&copy; 2025 Chieta IMS</Text>
        </View>
    )
}

export default RVersion

const styles = StyleSheet.create({
    con: {
        alignItems: 'flex-start',
        marginVertical: verticalScale(10),
        width: 'auto',
        backgroundColor: colors.primary[50],
        padding: scale(8),
        borderRadius: scale(5),
        borderWidth: 1,
        borderColor: colors.slate[100]
    },
    versionText: {
        fontSize: moderateScale(10),
        fontWeight: 'thin',
        color: colors.gray[400]
    },
    appName: {
        fontSize: moderateScale(13),
        fontWeight: "medium",
        color: colors.gray[500]
    }
})