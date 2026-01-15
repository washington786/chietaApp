import { FlatList, View } from 'react-native'
import React from 'react'
import { REmpty, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { AppNotification } from '@/core/types/notifications'

const NotificationsPage = () => {
    const notifications = useSelector((state: RootState) => state.notification.items);

    const renderList = ({ index, item }: { index: number, item: AppNotification }) => {
        return (
            <Animated.View key={`notification-${item.id}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ItemNotification notification={item} id={item.id} title={item.title} body={item.body} timestamp={item.timestamp} read={item.read} source={item.source} />
            </Animated.View>
        )
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
                ListEmptyComponent={REmpty}
            />
        </SafeArea>
    )
}

export default NotificationsPage