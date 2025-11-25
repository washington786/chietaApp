import { StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@/config/colors';

const ApplicationItem = () => {
    return (
        <RCol style={styles.con}>
            <RRow style={styles.title}>
                <MaterialCommunityIcons name="application-outline" size={18} color="black" />
                <Text>Mandatory Grant 2024</Text>
            </RRow>
            <RDivider />
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Reference</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>mg2024</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Title</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Mandatory Grant 2024</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}> status</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle, styles.statusTxt]}>Application</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Date submitted</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>04/30/2024 11:59PM</Text>
            </RRow>
        </RCol>
    )
}

export default ApplicationItem

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