import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import { RCol, RRow } from '@/components/common'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import { usePeriodInfo } from '@/hooks/main/UsePeriodInfo'
import { formatCountdown, formatDate } from '@/core/utils/dayTime'
import { useGetActiveWindowsParamsQuery } from '@/store/api/api'

const ApplicationTimelines = () => {
    // Fetch active discretionary windows
    const { data: windowsData, isLoading: windowsLoading } = useGetActiveWindowsParamsQuery(undefined);

    // Get active discretionary window
    const activeDiscretionaryWindow = useMemo(() => {
        const items = windowsData?.result?.items || [];
        const active = items.find((w: any) => w.activeYN === true);
        return active;
    }, [windowsData]);

    const mgOpen = '2025-12-01';
    const mgClose = '2025-12-12';

    const dgOpen = '2025-11-01';
    const dgClose = '2025-11-30';

    const mgPeriod = usePeriodInfo(mgOpen, mgClose, { autoUpdate: true });
    const dgPeriod = usePeriodInfo(dgOpen, dgClose, { autoUpdate: true });

    return (
        <RCol style={styles.col}>
            <Text variant='titleLarge' style={[styles.txt, styles.title]}>Application timelines</Text>
            <RRow style={{ flexWrap: "nowrap", height: verticalScale(200), marginVertical: scale(10), gap: scale(6) }}>
                <TimeLineItem
                    name='Mandatory Grants'
                    period={formatCountdown(mgPeriod.countdown)}
                    closeDate={new Date("2025-12-01")}
                    cycle={0}
                    isClosed={mgPeriod.status === 'closed'}
                    openDate={new Date("2025-11-12")}
                    status={mgPeriod.status}
                />

                <TimeLineItem
                    name={windowsLoading ? 'Loading...' : activeDiscretionaryWindow?.title || 'Discretionary Grants'}
                    period={formatCountdown(dgPeriod.countdown)}
                    closeDate={new Date("2025-11-12")}
                    cycle={1}
                    isClosed={dgPeriod.status === 'closed'}
                    openDate={new Date("2026-10-12")}
                    status={dgPeriod.status}
                    isActive={activeDiscretionaryWindow?.activeYN}
                />
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
    isActive?: boolean;
}
function TimeLineItem({ name, closeDate, isClosed, cycle, openDate, period, status, isActive }: props) {
    const fmOpenDate = openDate ? formatDate(openDate) : null;
    const fmCloseDate = closeDate ? formatDate(closeDate) : null;

    // If isActive is explicitly false, show no active cycles message
    if (isActive === false) {
        return (
            <RCol style={styles.con}>
                <Text variant='titleMedium' style={styles.conText}>{name}</Text>
                <Text variant='labelSmall' style={styles.conText}>Status</Text>
                <View style={{ position: "absolute", bottom: -30, right: -10, backgroundColor: colors.red[400], padding: scale(6), width: "50%", alignItems: "center", borderTopLeftRadius: scale(100) }}>
                    <Text variant='titleSmall' style={styles.conText}>No active cycles</Text>
                </View>
            </RCol>
        );
    }

    return (
        <RCol style={styles.con}>
            <Text variant='titleMedium' style={styles.conText}>{name}</Text>
            <Text variant='labelSmall' style={styles.conText}>Closes In</Text>
            <RRow style={{ alignItems: "center", gap: scale(4), marginTop: scale(6), backgroundColor: colors.blue[50], paddingHorizontal: scale(4), borderRadius: scale(6), paddingVertical: scale(12), width: "50%" }}>
                <Ionicons name="timer-outline" size={moderateScale(20)} color="black" />
                <Text variant='labelSmall' style={styles.conText}>{period}</Text>
            </RRow>

            <RCol>

                {
                    isClosed ? (<>
                        <RCol>
                            <Text variant='labelSmall' style={[styles.conText, { marginTop: scale(12) }]}>{status} events:</Text>
                            <RRow style={{ alignItems: "center", gap: scale(4), marginTop: scale(6) }}>
                                <Ionicons name={!isClosed ? "calendar-outline" : "alert-circle-outline"} size={moderateScale(20)} color="black" />
                                <Text variant='labelSmall' style={styles.conText}>unavailable</Text>
                            </RRow>
                        </RCol>

                        <View style={{ position: "absolute", bottom: -30, right: -10, backgroundColor: colors.red[400], padding: scale(6), width: "50%", alignItems: "center", borderTopLeftRadius: scale(100) }}>
                            <Text variant='titleSmall' style={styles.conText}>closed</Text>
                        </View>
                    </>) : <>
                        <Text variant='labelSmall' style={[styles.conText, { marginTop: scale(12) }]}>upcoming events:</Text>
                        <Text variant='labelSmall' style={styles.conText}>cycle {cycle}</Text>
                        <RRow style={{ alignItems: "center", gap: scale(4), marginTop: scale(6) }}>
                            <Ionicons name="calendar-outline" size={moderateScale(20)} color="black" />
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
        fontSize: moderateScale(14),
        color: "white"
    },
    col: {
        marginVertical: scale(10),
        paddingVertical: scale(4),
        backgroundColor: colors.primary[950],
        paddingHorizontal: scale(5),
        borderRadius: scale(10)
    },
    txt: {
        textTransform: "capitalize"
    },
    con: {
        backgroundColor: colors.zinc[50], flex: 1, borderRadius: scale(10),
        padding: scale(6),
        position: "relative",
        borderWidth: 1,
        borderColor: colors.slate[200],
        overflow: "hidden"
    },
    conText: {
        color: colors.slate[700],
    }
})