import { FlatList, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { REmpty, SafeArea, RListLoading } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { AppNotification } from '@/core/types/notifications'
import { useGetNotificationsByUserQuery, useMarkNotificationAsReadMutation } from '@/store/api/api'
import { showToast } from '@/core'

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

    const handleNotificationPress = async (notificationId: string) => {
        try {
            await markAsRead(parseInt(notificationId, 10)).unwrap();
            showToast({ message: 'Notification marked as read', type: 'info', title: 'Success', position: 'top' });
        } catch (error) {
            showToast({ message: 'Failed to mark notification as read', type: 'error', title: 'Error', position: 'top' });
            console.error('Failed to mark notification as read:', error);
        }
    };

    const renderList = ({ index, item }: { index: number, item: AppNotification }) => {
        return (
            <Animated.View key={`notification-${item.id}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>

                <ItemNotification notification={item} id={item.id} title={item.title} body={item.body} timestamp={item.timestamp} read={item.read} source={item.source} onPress={() => handleNotificationPress(item.id)} />

            </Animated.View>
        )
    }

    if (isLoading) {
        return <RListLoading count={7} />
    }

    return (
        <SafeArea>
            <RHeader name='Notifications' />
            <FlatList data={notifications}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={renderList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                ListEmptyComponent={<REmpty title='Notifications Not Found' icon='bell-off' subtitle='You do not have any notifications available for your profile.' />}
            />
        </SafeArea>
    )
}

export default NotificationsPage