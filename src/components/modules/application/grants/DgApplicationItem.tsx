import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { dgProject } from '@/core/models/DiscretionaryDto'

interface props {
    item: dgProject;
}
const DgApplicationItem: FC<props> = ({ item }) => {
    const { applicationDetails } = usePageTransition();
    const { focusArea, sdlNo, projectStatus, projectEndDate: endDate, projType, projectNam: title, id, organisationId } = item;
    return (
        <TouchableOpacity onPress={() => applicationDetails({ type: "dg-app", appId: `${id}`, orgId: `${organisationId}` })}>
            <RCol style={styles.con}>
                <RRow style={styles.title}>
                    <MaterialCommunityIcons name="application-outline" size={18} color="black" />
                    <Text>{title}</Text>
                </RRow>
                <RDivider />
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>SDL No</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{sdlNo}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Focus Area</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{focusArea && focusArea.length > 45 ? focusArea.substring(0, 45) + "..." : focusArea}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Type</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{projType}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Status</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle, styles.statusTxt]}>{projectStatus}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Closing Date</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{endDate}</Text>
                </RRow>
            </RCol>
        </TouchableOpacity>
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