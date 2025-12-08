import { StyleSheet, View } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePeriodInfo } from '@/hooks/main/UsePeriodInfo'
import { formatCountdown, formatDate } from '@/core/utils/dayTime'

const ApplicationTimelines = () => {

    const mgOpen = '2025-12-01';
    const mgClose = '2025-12-12';

    const dgOpen = '2025-11-01';
    const dgClose = '2025-11-30';

    const mgPeriod = usePeriodInfo(mgOpen, mgClose, { autoUpdate: true });
    const dgPeriod = usePeriodInfo(dgOpen, dgClose, { autoUpdate: true });

    return (
        <RCol style={styles.col}>
            <Text variant='titleLarge' style={[styles.txt, styles.title]}>Application timelines</Text>
            <RRow style={{ flexWrap: "nowrap", height: 200, marginVertical: 10, gap: 6 }}>
                <TimeLineItem name='Mandatory Grants' period={formatCountdown(mgPeriod.countdown)} closeDate={new Date("2025-12-01")} cycle={0} isClosed={mgPeriod.status === 'closed'} openDate={new Date("2025-11-12")} status={mgPeriod.status} />

                <TimeLineItem name='Discretionary Grants' period={formatCountdown(dgPeriod.countdown)} closeDate={new Date("2025-11-12")} cycle={1} isClosed={dgPeriod.status === 'closed'} openDate={new Date("2026-10-12")} status={dgPeriod.status} />
            </RRow>
        </RCol>
    )
}

interface props {
    name: string;
    isClosed?: boolean;
    openDate?: Date;
    closeDate?: Date;
    cycle?: number;
    period: any;
    status?: string;
}
function TimeLineItem({ name, closeDate, isClosed, cycle, openDate, period, status }: props) {
    const fmOpenDate = openDate ? formatDate(openDate) : null;
    const fmCloseDate = closeDate ? formatDate(closeDate) : null;
    return (
        <RCol style={styles.con}>
            <Text variant='titleMedium' style={styles.conText}>{name}</Text>
            <Text variant='labelSmall' style={styles.conText}>Closes In</Text>
            <RRow style={{ alignItems: "center", gap: 4, marginTop: 6, backgroundColor: colors.blue[50], paddingHorizontal: 4, borderRadius: 6, paddingVertical: 12, width: "50%" }}>
                <Ionicons name="timer-outline" size={20} color="black" />
                <Text variant='labelSmall' style={styles.conText}>{period}</Text>
            </RRow>

            <RCol>

                {
                    isClosed ? (<>
                        <RCol>
                            <Text variant='labelSmall' style={[styles.conText, { marginTop: 12 }]}>{status} events:</Text>
                            <RRow style={{ alignItems: "center", gap: 4, marginTop: 6 }}>
                                <Ionicons name={!isClosed ? "calendar-outline" : "alert-circle-outline"} size={20} color="black" />
                                <Text variant='labelSmall' style={styles.conText}>unavailable</Text>
                            </RRow>
                        </RCol>

                        <View style={{ position: "absolute", bottom: -30, right: -10, backgroundColor: colors.red[400], padding: 6, width: "50%", alignItems: "center", borderTopLeftRadius: 100 }}>
                            <Text variant='titleSmall' style={styles.conText}>closed</Text>
                        </View>
                    </>) : <>
                        <Text variant='labelSmall' style={[styles.conText, { marginTop: 12 }]}>upcoming events:</Text>
                        <Text variant='labelSmall' style={styles.conText}>cycle {cycle}</Text>
                        <RRow style={{ alignItems: "center", gap: 4, marginTop: 6 }}>
                            <Ionicons name="calendar-outline" size={20} color="black" />
                            <Text variant='labelSmall' style={styles.conText}>{fmOpenDate} -  {fmCloseDate}</Text>
                        </RRow>
                    </>
                }
            </RCol>
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
        backgroundColor: colors.zinc[50], flex: 1, borderRadius: 10,
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