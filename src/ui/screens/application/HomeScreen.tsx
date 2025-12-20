import { FlatList } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import { ApplicationTimelines, Banner, MessageWrapper } from '@/components/modules/authentication'
import { LinkedOrganizations, NewTimelines, Stats } from '@/components/modules/application'

const HomeScreen = () => {
    return (
        <SafeArea>
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<Banner />}
                ListFooterComponent={() => {
                    return (
                        <>
                            <MessageWrapper />
                            {/* <Stats /> */}
                            {/* <NewTimelines /> */}
                            <ApplicationTimelines />
                            <LinkedOrganizations />
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default HomeScreen