import { StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const DgApplicationItem = () => {
    return (
        <RCol style={styles.con}>
            <RRow style={styles.title}>
                <MaterialCommunityIcons name="application-outline" size={18} color="black" />
                <Text>DG2026-2027 Cycle 1</Text>
            </RRow>
            <RDivider />
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>SDL No</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>N030000122</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Focus Area</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Work Integrated Learning</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Type</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Learning Projects</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Status</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle, styles.statusTxt]}>Registered</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Closing Date</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>04/30/2024 11:59PM</Text>
            </RRow>
        </RCol>
    )
}

export default DgApplicationItem

const styles = StyleSheet.create({
    con: { paddingHorizontal: 8, paddingVertical: 12, backgroundColor: colors.slate[50], borderRadius: 5, marginBottom: 12, borderColor: colors.slate[200], borderWidth: 1 },
    title: {
        alignItems: "center",
        gap: 4
    },
    text: {
        textTransform: "capitalize"
    },
    wrap: {
        alignItems: "center",
        justifyContent: "space-between"
    },
    appTitle: {
        fontSize: 12
    },
    statusTxt: {
        backgroundColor: colors.emerald[100],
        borderRadius: 5,
        padding: 4
    }
})