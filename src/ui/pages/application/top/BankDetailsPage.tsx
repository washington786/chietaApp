import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { InformationBanner } from '@/components/modules/application'
import { FileWrapper } from '@/components/modules/application/grants/FileWrapper';

const BankDetailsPage = () => {
    return (
        <FlatList data={[]}
            style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
            renderItem={null}
            ListHeaderComponent={<InformationBanner title='Please select pdf statements you want to download.' />}
            ListFooterComponent={() => {
                return (
                    <>
                        <FileWrapper />
                        <FileWrapper />
                        <FileWrapper />
                        <FileWrapper />
                    </>
                )
            }}
        />
    )
}

export default BankDetailsPage

const styles = StyleSheet.create({})