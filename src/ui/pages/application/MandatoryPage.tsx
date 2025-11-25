import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ApplicationItem, InformationBanner } from '@/components/modules/application'
import { FAB } from 'react-native-paper'

const MandatoryPage = () => {
    return (
        <SafeArea>
            <RHeader name='Mandatory Grant Applications' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={<InformationBanner title='view your applications and apply for new grants. You can only submit during open grant window.' />}
                ListFooterComponent={() => {
                    return (
                        <>
                            <ApplicationItem />
                            <ApplicationItem />
                        </>
                    )
                }}
            />
            <FAB
                mode='flat'
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Pressed')}
            />
        </SafeArea>
    )
}

export default MandatoryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100
    },
})