import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'

const MandatoryPage = () => {
    return (
        <SafeArea>
            <RHeader name='Mandatory Grant Applications' />
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

export default MandatoryPage

const styles = StyleSheet.create({})