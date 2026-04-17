import { View, SectionList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { REmpty, SafeArea, RListLoading, RToggleInfo, RText } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useCombinedNotifications } from '@/hooks/notifications'
import type { CombinedNotification } from '@/hooks/notifications'
import { useMarkNotificationAsReadMutation } from '@/store/api/api'
import { showToast } from '@/core'
import colors from '@/config/colors'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'

/* Stable separator — defined outside the component to avoid re-creation */
const ItemSeparator = () => <View style={styles.itemSeparator} />;

const NotificationsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id ? Number(user.id) : undefined;

    const {
        reminders,
        system,
        isLoading,
        isFetching,
        unreadReminders,
        unreadSystem,
        errorMessage,
        markLocalNotificationAsRead,
    } = useCombinedNotifications(userId);

    const [markAsRead] = useMarkNotificationAsReadMutation();

    /* ── Date helpers ─────────────────────────────────────────────── */

    const getDateLabel = useCallback((timestamp: number): string => {
        const notifDate = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (notifDate.toDateString() === today.toDateString()) return 'Today';
        if (notifDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return notifDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }, []);

    const groupByDate = useCallback(
        (items: CombinedNotification[]) => {
            const grouped: Record<string, { sortKey: number; items: CombinedNotification[] }> = {};

            items.forEach((n) => {
                const label = getDateLabel(n.timestamp);
                if (!grouped[label]) grouped[label] = { sortKey: n.timestamp, items: [] };
                grouped[label].items.push(n);
                grouped[label].sortKey = Math.max(grouped[label].sortKey, n.timestamp);
            });

            return Object.entries(grouped)
                .sort(([, a], [, b]) => b.sortKey - a.sortKey)
                .map(([title, { items: data }]) => ({ title, data }));
        },
        [getDateLabel],
    );

    const groupedReminders = useMemo(() => groupByDate(reminders), [groupByDate, reminders]);
    const groupedSystem = useMemo(() => groupByDate(system), [groupByDate, system]);

    /* ── Mark as read ─────────────────────────────────────────────── */

    const handleNotificationPress = useCallback(
        async (notification: CombinedNotification) => {
            if (notification.read) return;

            if (notification.isLocal) {
                markLocalNotificationAsRead(notification.id);
            }

            const serverId = notification.serverId ? Number(notification.serverId) : null;

            if (serverId && !Number.isNaN(serverId)) {
                try {
                    await markAsRead(serverId).unwrap();
                    showToast({ message: 'Marked as read', type: 'info', title: 'Done', position: 'top' });
                } catch (error) {
                    showToast({ message: 'Failed to mark as read', type: 'error', title: 'Error', position: 'top' });
                    console.error('Failed to mark notification as read:', error);
                }
            }
        },
        [markAsRead, markLocalNotificationAsRead],
    );

    /* ── Renderers ────────────────────────────────────────────────── */

    const renderSectionHeader = useCallback(
        ({ section: { title } }: { section: { title: string } }) => (
            <View style={styles.sectionHeaderWrap}>
                <RText title={title} style={styles.sectionHeaderText} />
            </View>
        ),
        [],
    );

    const renderItem = useCallback(
        ({ item, index }: { item: CombinedNotification; index: number }) => (
            <Animated.View
                entering={FadeInDown.duration(400).delay(Math.min(index * 80, 400)).springify()}
            >
                <ItemNotification
                    notification={item}
                    id={item.id}
                    title={item.title}
                    body={item.body}
                    timestamp={item.timestamp}
                    read={item.read}
                    source={item.source}
                    onPress={() => handleNotificationPress(item)}
                />
            </Animated.View>
        ),
        [handleNotificationPress],
    );

    const renderList = useCallback(
        (
            sections: Array<{ title: string; data: CombinedNotification[] }>,
            emptySubtitle: string,
        ) => {
            if (sections.length === 0) {
                return (
                    <REmpty
                        title="No Notifications"
                        icon="bell-off"
                        subtitle={emptySubtitle}
                    />
                );
            }

            return (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={ItemSeparator}
                />
            );
        },
        [renderItem, renderSectionHeader],
    );

    /* ── Initial skeleton ─────────────────────────────────────────── */

    if (isLoading) {
        return (
            <SafeArea>
                <RHeader name="Notifications" />
                <RListLoading count={7} />
            </SafeArea>
        );
    }

    const emptySubtitle = errorMessage ?? 'No notifications available for your profile.';
    const remindersLabel = unreadReminders > 0 ? `Reminders (${unreadReminders})` : 'Reminders';
    const systemLabel = unreadSystem > 0 ? `System (${unreadSystem})` : 'System';

    return (
        <SafeArea>
            <RHeader name="Notifications" />
            <View style={styles.page}>
                {isFetching && (
                    <ActivityIndicator
                        size="small"
                        color={colors.primary[700]}
                        style={styles.refreshIndicator}
                    />
                )}
                <RToggleInfo
                    button1Label={remindersLabel}
                    button2Label={systemLabel}
                    defaultActive={1}
                    containerStyle={styles.toggleContainer}
                    content1={renderList(groupedReminders, emptySubtitle)}
                    content2={renderList(groupedSystem, emptySubtitle)}
                />
            </View>
        </SafeArea>
    );
};

export default NotificationsPage;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingTop: verticalScale(6),
    },
    toggleContainer: {
        paddingHorizontal: scale(12),
    },
    refreshIndicator: {
        position: 'absolute',
        top: verticalScale(4),
        right: scale(16),
        zIndex: 10,
    },
    sectionHeaderWrap: {
        backgroundColor: colors.gray[50],
        paddingVertical: verticalScale(6),
        paddingHorizontal: scale(4),
    },
    sectionHeaderText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: colors.slate[500],
        marginVertical: 0,
    },
    listContent: {
        paddingHorizontal: scale(12),
        paddingBottom: verticalScale(80),
    },
    itemSeparator: {
        height: verticalScale(8),
    },
});
