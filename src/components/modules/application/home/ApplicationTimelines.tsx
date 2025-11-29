import { StyleSheet, View } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';

interface props {
    isClosed?: boolean
}
const ApplicationTimelines: FC<props> = ({ isClosed = true }) => {
    return (
        <RCol style={styles.col}>
            <Text variant='titleLarge' style={[styles.txt, styles.title]}>Application timelines</Text>
            <RRow style={{ flexWrap: "nowrap", height: 200, marginVertical: 10, gap: 6 }}>
                <RCol style={styles.con}>
                    <Text variant='titleMedium' style={styles.conText}>Mandatory Grants</Text>
                    <Text variant='labelSmall' style={styles.conText}>Closes In:</Text>
                    <RRow style={{ alignItems: "center", gap: 4, marginTop: 6, backgroundColor: colors.blue[50], paddingHorizontal: 4, borderRadius: 6, paddingVertical: 12, width: "50%" }}>
                        <Ionicons name="timer-outline" size={20} color="black" />
                        <Text variant='labelSmall' style={styles.conText}>00 00 00 00</Text>
                    </RRow>

                    <RCol>
                        <Text variant='labelSmall' style={[styles.conText, { marginTop: 12 }]}>upcoming events:</Text>
                        <RRow style={{ alignItems: "center", gap: 4, marginTop: 6 }}>
                            <Ionicons name={!isClosed ? "calendar-outline" : "alert-circle-outline"} size={20} color="black" />
                            <Text variant='labelSmall' style={styles.conText}>unavailable</Text>
                        </RRow>
                    </RCol>

                    <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: colors.red[400], padding: 6, width: "50%", alignItems: "center", borderTopLeftRadius: 100 }}>
                        <Text variant='titleSmall' style={styles.conText}>closed</Text>
                    </View>
                </RCol>
                <RCol style={styles.con}>
                    <Text variant='titleMedium' style={styles.conText}>Discretionary Grants</Text>
                    <Text variant='labelSmall' style={styles.conText}>Closes In</Text>
                    <RRow style={{ alignItems: "center", gap: 4, marginTop: 6, backgroundColor: colors.blue[50], paddingHorizontal: 4, borderRadius: 6, paddingVertical: 12, width: "50%" }}>
                        <Ionicons name="timer-outline" size={20} color="black" />
                        <Text variant='labelSmall' style={styles.conText}>00 00 00 00</Text>
                    </RRow>

                    <RCol>
                        <Text variant='labelSmall' style={[styles.conText, { marginTop: 12 }]}>upcoming events:</Text>
                        <Text variant='labelSmall' style={styles.conText}>cycle 1</Text>
                        <RRow style={{ alignItems: "center", gap: 4, marginTop: 6 }}>
                            <Ionicons name="calendar-outline" size={20} color="black" />
                            <Text variant='labelSmall' style={styles.conText}>12/11/2025 -  12/12/2025</Text>
                        </RRow>
                    </RCol>
                </RCol>
            </RRow>
        </RCol>
    )
}

export default ApplicationTimelines

const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        color: "white"
    },
    col: {
        marginVertical: 10,
        paddingVertical: 4,
        backgroundColor: colors.primary[950],
        paddingHorizontal: 5,
        borderRadius: 10
    },
    txt: {
        textTransform: "capitalize"
    },
    con: {
        backgroundColor: colors.slate[100], flex: 1, borderRadius: 10,
        padding: 6,
        position: "relative",
        borderWidth: 1,
        borderColor: colors.slate[200],
        overflow: "hidden"
    },
    conText: {
        color: colors.slate[700],
    }
})