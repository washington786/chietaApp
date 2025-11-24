import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RCol, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemOrganization } from '@/components/modules/application'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'
import { showToast } from '@/core'

const AddNewOrganization = () => {
    const [searchQuery, setSearchQuery] = useState('');
    function handleLinkOrganization() {
        showToast({ message: 'Organization linked successfully to your profile', type: 'success', title: 'Organization Linking', position: "bottom" })
    }
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
                            <ItemOrganization onPress={handleLinkOrganization} />
                            <ItemOrganization isActive={true} onPress={handleLinkOrganization} />
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