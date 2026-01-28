import { View, SectionList } from 'react-native'
import React, { useMemo } from 'react'
import { REmpty, SafeArea, RListLoading, RToggleInfo, RText } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { AppNotification } from '@/core/types/notifications'
import { useGetNotificationsByUserQuery, useMarkNotificationAsReadMutation } from '@/store/api/api'
import { showToast } from '@/core'
import { StyleSheet } from 'react-native'
import colors from '@/config/colors'

const NotificationsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId: number = user?.id ? parseInt(String(user.id), 10) : 0;

    // Fetch notifications from server
    const { data: serverNotifications, isLoading, error } = useGetNotificationsByUserQuery(userId, {
        skip: userId === 0
    });

    // Mark notification as read mutation
    const [markAsRead] = useMarkNotificationAsReadMutation();

    // Use server notifications
    const notifications = serverNotifications?.items || [];

    // Helper function to get date label
    const getDateLabel = (timestamp: number): string => {
        const notifDate = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (notifDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (notifDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    // Group notifications by type and date
    const groupedNotifications = useMemo(() => {
        const groupByTypeAndDate = (type: string): Array<{ title: string; data: AppNotification[] }> => {
            const filtered: AppNotification[] = notifications.filter((n: AppNotification) => n.source === type);
            const grouped: { [key: string]: AppNotification[] } = {};

            filtered.forEach((notification: AppNotification) => {
                const dateLabel = getDateLabel(notification.timestamp);
                if (!grouped[dateLabel]) {
                    grouped[dateLabel] = [];
                }
                grouped[dateLabel].push(notification);
            });

            // Convert to array of sections, sorted by date
            return Object.entries(grouped)
                .sort((a, b) => {
                    const dateA = new Date(a[0]);
                    const dateB = new Date(b[0]);
                    return dateB.getTime() - dateA.getTime();
                })
                .map(([date, data]: [string, AppNotification[]]) => ({
                    title: date,
                    data,
                }));
        };

        return {
            reminders: groupByTypeAndDate('reminder'),
            system: groupByTypeAndDate('system'),
        };
    }, [notifications]);

    const handleNotificationPress = async (notificationId: string, isRead: boolean) => {
        if (isRead) {
            return;
        }

        try {
            await markAsRead(parseInt(notificationId, 10)).unwrap();
            showToast({ message: 'Notification marked as read', type: 'info', title: 'Success', position: 'top' });
        } catch (error) {
            showToast({ message: 'Failed to mark notification as read', type: 'error', title: 'Error', position: 'top' });
            console.error('Failed to mark notification as read:', error);
        }
    };

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <RText title={title} style={styles.sectionHeader} />
    );

    const renderNotification = ({ item, index }: { item: AppNotification; index: number }) => (
        <Animated.View key={`notification-${item.id}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
            <ItemNotification
                notification={item}
                id={item.id}
                title={item.title}
                body={item.body}
                timestamp={item.timestamp}
                read={item.read}
                source={item.source}
                onPress={() => handleNotificationPress(item.id, item.read)}
            />
        </Animated.View>
    );

    const renderNotificationSection = (sections: Array<{ title: string; data: AppNotification[] }>) => {
        if (sections.length === 0) {
            return <REmpty title='No Notifications' icon='bell-off' subtitle='You do not have any notifications available for your profile.' />;
        }

        return (
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                renderSectionHeader={renderSectionHeader}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                style={{ paddingHorizontal: 12 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        );
    };

    const remindersContent = renderNotificationSection(groupedNotifications.reminders);
    const systemContent = renderNotificationSection(groupedNotifications.system);

    if (isLoading) {
        return <RListLoading count={7} />
    }

    return (
        <SafeArea>
            <RHeader name='Notifications' />
            <View style={{ paddingVertical: 6, flex: 1, flexGrow: 1 }}>
                <RToggleInfo
                    button1Label="Reminders"
                    button2Label="System"
                    defaultActive={1}
                    containerStyle={{ paddingHorizontal: 12 }}
                    content1={remindersContent}
                    content2={systemContent}
                />
            </View>
        </SafeArea>
    )
}

export default NotificationsPage

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[600],
        marginTop: 12,
        marginBottom: 8,
    },
});