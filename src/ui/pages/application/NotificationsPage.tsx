import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemNotification } from '@/components/modules/application'

const NotificationsPage = () => {
    return (
        <SafeArea>
            <RHeader name='Notifications' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListFooterComponent={() => {
                    return (
                        <>
                            <ItemNotification isNew={true} />
                            <ItemNotification />
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default NotificationsPage

const styles = StyleSheet.create({})