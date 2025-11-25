import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { FAB } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { DgApplicationItem, InformationBanner } from '@/components/modules/application'

const DiscretionaryPage = () => {
    const { newDgApplication } = usePageTransition();
    return (
        <SafeArea>
            <RHeader name='Discretionary Grant Applications' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={< InformationBanner title='list of Discretionary grants applied for.You can only submit during open grant window.' />}
                ListHeaderComponentStyle={{ padding: 2 }}
                ListFooterComponent={() => {
                    return (
                        <>
                            <DgApplicationItem />
                            <DgApplicationItem />
                        </>
                    )
                }}
            />
            <FAB
                mode='flat'
                icon="plus"
                style={styles.fab}
                onPress={newDgApplication}
            />
        </SafeArea>
    )
}

export default DiscretionaryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100
    },
})