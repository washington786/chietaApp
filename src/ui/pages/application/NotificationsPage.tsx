import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'

const NotificationsPage = () => {

    const renderList = ({ index, item }: { index: number, item: any }) => {
        return (
            <Animated.View key={`tracking-${item}-${Date.now()}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ItemNotification isNew={true} />
            </Animated.View>
        )
    }

    return (
        <SafeArea>
            <RHeader name='Notifications' />
            <FlatList data={[1, 2, 3]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={renderList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
            />
        </SafeArea>
    )
}

export default NotificationsPage