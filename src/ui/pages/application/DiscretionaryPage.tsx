import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'

const DiscretionaryPage = () => {
    return (
        <SafeArea>
            <RHeader name='Discretionary Grant Applications' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                // ListHeaderComponent={<Banner />}
                ListFooterComponent={() => {
                    return (
                        <>
                            {/* <MessageWrapper />
                                    <ApplicationTimelines />
                                    <LinkedOrganizations /> */}
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default DiscretionaryPage

const styles = StyleSheet.create({})