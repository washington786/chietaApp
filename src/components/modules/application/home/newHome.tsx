import React, { memo, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import colors from '@/config/colors';
import { RCol, RDivider, RRow } from '@/components/common';
import LinkedOrganizations from './LinkedOrganizations';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { getTimeOfDay } from '@/core';
import { usePeriodInfo } from '@/hooks/main/UsePeriodInfo';
import { formatCountdown } from '@/core/utils/dayTime';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetActiveWindowsParamsQuery } from '@/store/api/api';
import DgActiveWindow from '../grants/ActiveWindow';

interface StatItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: number;
    color: string;
}

const STATS: StatItem[] = [
    { icon: 'business-outline', label: 'Linked Orgs', value: 4, color: '#6d28d9' },
    { icon: 'time-outline', label: 'Orgs Pending', value: 4, color: '#2563eb' },
    { icon: 'calendar-outline', label: 'Upcoming Events', value: 4, color: '#059669' },
    { icon: 'document-text-outline', label: 'Applications', value: 4, color: '#dc2626' },
];

const StatCard = memo(
    ({ item, index }: { item: StatItem; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 120).springify()}
            style={styles.statWrapper}
        >
            <Card style={[styles.statCard, { backgroundColor: item.color }]}>
                <View style={styles.statContent}>
                    <Ionicons name={item.icon} size={28} color="#fff" style={{ position: "absolute", top: 10, left: 10 }} />
                    <Text style={styles.statValue}>{item.value}</Text>
                    <Text style={styles.statLabel} numberOfLines={1}>
                        {item.label}
                    </Text>
                </View>
            </Card>
        </Animated.View>
    )
);

const NewHome = () => {
    const [expanded, setExpanded] = useState(false);
    const [addLinking, setAdd] = useState<boolean>(false);
    const { newOrg, notifications, linkedOrganizations } = usePageTransition();

    // Fetch active discretionary windows
    const { data: windowsData, isLoading: windowsLoading } = useGetActiveWindowsParamsQuery(undefined);

    // Process windows data to separate mandatory and discretionary
    const { mandatory, discretionary } = useMemo(() => {
        const items = windowsData?.result?.items || [];
        const mandatory: any[] = [];
        const discretionary: any[] = [];

        items.forEach((window: any) => {
            if (window.activeYN) {
                // For now, assume all items are discretionary windows
                // In production, you might need additional logic to identify mandatory grants
                discretionary.push(window);
            }
        });

        // If no discretionary windows, use fallback dates
        if (discretionary.length === 0) {
            discretionary.push({
                title: 'No active cycles',
                activeYN: false,
                dG_Window: 'N/A'
            });
        }

        return { mandatory, discretionary };
    }, [windowsData]);

    // Use first active discretionary window for display, with fallback to hardcoded dates
    const activeDiscretionaryWindow = discretionary[0];

    // For dates, we'll use fallback since the API doesn't provide specific open/close dates
    // In production, you might have another endpoint that provides these dates
    const dgOpen = activeDiscretionaryWindow?.openDate || '2025-12-01';
    const dgClose = activeDiscretionaryWindow?.closeDate || '2025-12-23';

    // Mandatory grants - fallback to hardcoded if no data
    const mgOpen = '2025-12-01';
    const mgClose = '2025-12-23';

    const mgPeriod = usePeriodInfo(mgOpen, mgClose, { autoUpdate: true });
    const dgPeriod = usePeriodInfo(dgOpen, dgClose, { autoUpdate: true });

    const { user } = useSelector((state: RootState) => state.auth);

    let fullname: string = '';

    if (user && user.firstName && user.lastName) {
        fullname = `${user.firstName} ${user.lastName}`;
    } else if (user && user.username) {
        fullname = user.username;
    } else {
        const name = user?.email.split('@')[0] || '';

        fullname = name.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }

    function handleLinkNewOrg() {
        setAdd(!addLinking);
    }

    function handleAddLinkNewOrg() {
        newOrg()
        setAdd(!addLinking);
    }

    const time = new Date().getTime();
    const currentDayTime = getTimeOfDay(new Date(time));

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.greeting}>Good {currentDayTime},</Text>
                                <Text style={styles.userName}>{fullname}</Text>

                            </View>

                            {
                                addLinking &&
                                <TouchableOpacity style={{ position: "absolute", top: 16, right: 50, backgroundColor: colors.primary[950], height: 40, zIndex: 1, width: 160, borderTopLeftRadius: 10, borderBottomStartRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={handleAddLinkNewOrg}>
                                    <Text style={{ color: colors.zinc[50] }}>link new organization</Text>
                                </TouchableOpacity>
                            }

                            <View style={styles.headerActions}>
                                {
                                    !addLinking &&
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel="Notifications"
                                        onPress={notifications}
                                    >
                                        <View style={styles.badge} />
                                        <Ionicons
                                            name="notifications-outline"
                                            size={34}
                                            color={colors.primary[950]}
                                        />
                                    </TouchableOpacity>
                                }

                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel="Add organization"
                                    style={{ backgroundColor: colors.primary[950], borderRadius: 10, height: 40, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" }}
                                    onPress={handleLinkNewOrg}
                                >
                                    <Feather name={addLinking ? "x" : "plus"} size={28} color={colors.zinc[50]} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* active windows */}
                        <DgActiveWindow />

                        {/* Stats */}
                        <RCol style={{ backgroundColor: colors.primary[950], marginBottom: 8 }}>
                            <Text style={styles.subtitle}>
                                Good to see you again! Here’s what’s happening today.
                            </Text>
                            <View style={styles.statsGrid}>
                                {STATS.map((item, index) => (
                                    <StatCard key={item.label} item={item} index={index} />
                                ))}
                            </View>
                        </RCol>

                        {/* Timelines */}
                        <View style={styles.section}>
                            <RRow style={{ alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={styles.sectionTitle}>Application Timelines</Text>
                                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={colors.gray[500]} />
                                </TouchableOpacity>
                            </RRow>

                            {
                                expanded &&
                                <View style={styles.timelineGrid}>
                                    {/* Mandatory Grants Card */}
                                    <Card style={styles.timelineCard}>
                                        <Text style={styles.timelineLabel}>Mandatory Grants</Text>
                                        <View style={styles.countdownContainer}>
                                            <Ionicons name="time-outline" size={30} color="#fff" />
                                            <Text style={styles.countdownValue}>{formatCountdown(mgPeriod.countdown)}</Text>
                                            <Text style={styles.countdownUnit}>dd hh mm ss</Text>
                                        </View>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusText}>{mgPeriod.status}</Text>
                                        </View>
                                    </Card>

                                    {/* Discretionary Grants Card - Dynamic */}
                                    <Card style={styles.timelineCard}>
                                        <Text style={styles.timelineLabel}>
                                            {windowsLoading ? 'Loading...' : activeDiscretionaryWindow?.title || 'Discretionary Grants'}
                                        </Text>
                                        {activeDiscretionaryWindow?.activeYN && (
                                            <>
                                                <View style={styles.countdownContainer}>
                                                    <Ionicons name="time-outline" size={30} color="#fff" />
                                                    <Text style={styles.countdownValue}>{formatCountdown(dgPeriod.countdown)}</Text>
                                                    <Text style={styles.countdownUnit}>dd hh mm ss</Text>
                                                </View>
                                                <View style={styles.statusBadge}>
                                                    <Text style={styles.statusText}>{dgPeriod.status}</Text>
                                                </View>
                                            </>
                                        )}
                                        {!activeDiscretionaryWindow?.activeYN && (
                                            <View style={styles.statusBadge}>
                                                <Text style={styles.statusText}>No active cycles</Text>
                                            </View>
                                        )}
                                    </Card>
                                </View>
                            }
                        </View>

                        {/* Linked Orgs Header */}
                        <RRow style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>My Linked Organizations</Text>
                            <TouchableOpacity onPress={linkedOrganizations}>
                                <Text style={styles.viewAllText}>View all</Text>
                            </TouchableOpacity>
                        </RRow>
                        <RDivider />
                    </>
                }
                ListFooterComponent={LinkedOrganizations}
                ListFooterComponentStyle={{ paddingHorizontal: 8 }}
            />
        </SafeAreaView>
    );
};

export default memo(NewHome);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 48,
    },

    /* Header */
    header: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: "relative"
    },
    greeting: {
        fontSize: 30,
        fontWeight: '300',
        color: '#374151',
        textTransform: "capitalize"
    },
    userName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginTop: 4,
    },
    subtitle: {
        fontSize: 15,
        color: colors.slate[50],
        paddingLeft: 16,
        paddingVertical: 10
    },
    headerActions: {
        flexDirection: 'row',
        gap: 20,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 14,
        height: 14,
        borderRadius: 100,
        backgroundColor: colors.red[500],
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
    },

    /* Stats */
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 32,
    },

    statWrapper: {
        width: '49%',
        marginBottom: 10,
        position: "relative"
    },

    statCard: {
        borderRadius: 10,
        elevation: 6,
    },

    statContent: {
        paddingVertical: 22,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        marginTop: 8,
    },

    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginTop: 4,
        opacity: 0.95,
        textAlign: 'center',
    },


    /* Sections */
    section: {
        paddingHorizontal: 15,
        marginBottom: 32,
        paddingVertical: 10,
        backgroundColor: colors.slate[100],
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },

    /* Timeline */
    timelineGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    timelineCard: {
        flex: 1,
        backgroundColor: colors.primary[950],
        borderRadius: 10,
        padding: 26,
        alignItems: 'center',
    },
    timelineLabel: {
        color: colors.zinc[50],
        fontWeight: '600',
        marginBottom: 5,
        fontSize: 12,
        textAlign: "center"
    },
    countdownContainer: {
        alignItems: 'center',
    },
    countdownValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.secondary[200],
        letterSpacing: 2,
        marginVertical: 10,
    },
    countdownUnit: {
        fontSize: 12,
        color: colors.secondary[400],
    },
    statusBadge: {
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: colors.red[600],
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    statusText: {
        color: colors.zinc[50],
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    /* Orgs */
    sectionHeader: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    viewAllText: {
        color: colors.blue[300],
        fontWeight: '600',
    }
});
