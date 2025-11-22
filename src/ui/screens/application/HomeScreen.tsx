import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import { Banner } from '@/components/modules'

const HomeScreen = () => {
    return (
        <SafeArea>
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={<Banner />}
                ListFooterComponent={() => {
                    return (
                        <>
                            {/* <ActionsList />
                            <ActivityList /> */}
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})