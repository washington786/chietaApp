import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { RCol, RRow, SafeArea } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

const HistoryScreen = () => {
    return (
        <SafeArea>
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 5, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={<RCol style={styles.conWrap}>
                    <Text variant='titleMedium' style={styles.textColor}>application tracking status</Text>
                </RCol>}
                ListFooterComponent={() => {
                    return (
                        <>
                            <AppTrackingItem />
                            <AppTrackingItem />
                            <AppTrackingItem />
                            <AppTrackingItem />
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

function AppTrackingItem() {
    return (
        <RCol style={styles.itemCon}>
            <RRow style={styles.center}>
                <RRow style={[styles.rowtFlex, styles.center, styles.gap]}>
                    <Ionicons name="grid-outline" size={24} color="black" />
                    <Text style={[styles.txtCap, styles.appTitle]} variant='titleSmall'>discretionary grant 2025</Text>
                </RRow>
                <RCol style={styles.bgStatus}>
                    <Text variant='labelSmall' style={styles.txtClr}>submitted</Text>
                </RCol>
            </RRow>
            <RRow style={[styles.rowtFlex, styles.center, styles.gap]}>
                <Feather name="rotate-cw" size={24} color="black" />
                <Text variant='labelMedium' style={styles.txtClr}>cycle 1</Text>
            </RRow>
            <RRow style={[styles.rowtFlex, styles.center, styles.gap]}>
                <Ionicons name="calendar-clear-outline" size={24} color="black" />
                <Text variant='labelMedium' style={styles.txtClr}>18/11/2025 12:00 PM</Text>
            </RRow>
        </RCol>
    )
}

export default HistoryScreen

const styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2

    },
    textColor: {
        color: colors.slate[900],
        textTransform: "capitalize",
    },
    rowtFlex: {
        flex: 1
    },
    center: {
        alignItems: "center"
    },
    gap: {
        gap: 8
    },
    itemCon: {
        marginVertical: 10,
        backgroundColor: colors.slate[100],
        height: "100%",
        minHeight: 30,
        maxHeight: 100,
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 10
    },
    bgStatus: {
        backgroundColor: colors.violet[100],
        borderRadius: 100,
        padding: 6
    },
    txtCap: {
        textTransform: "capitalize"
    },
    appTitle: {
        flex: 1
    },
    txtClr: {
        color: colors.gray[800]
    }
})