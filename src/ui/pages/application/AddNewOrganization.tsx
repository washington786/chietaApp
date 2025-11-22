import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RCol, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemOrganization } from '@/components/modules/application'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'

const AddNewOrganization = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <SafeArea>
            <RHeader name='Link An Organization' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={
                    <RCol style={styles.col}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={styles.searchBar}
                        />
                    </RCol>}
                ListFooterComponent={() => {
                    return (
                        <>
                            <ItemOrganization />
                            <ItemOrganization isActive={true} />
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default AddNewOrganization

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6
    },
    searchBar: {
        backgroundColor: colors.slate[100]
    }
})