import { FlatList, Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RCol, SafeArea } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar } from 'react-native-paper';
import colors from '@/config/colors';
import { showToast } from '@/core';
import { ItemOrganization } from '@/components/modules/application';

const AddNewApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    function handleLinkOrganization() {
        showToast({ message: 'Application added successfully to your organization profile', type: 'success', title: 'Organization Linking', position: "top" })
    }
    return (
        <SafeArea>
            <RHeader name='Add Application' />
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={
                    <RCol style={styles.col}>
                        <Searchbar
                            placeholder="Search application"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={styles.searchBar}
                        />
                    </RCol>}
                ListFooterComponent={() => {
                    return (
                        <>
                            <ItemOrganization onPress={handleLinkOrganization} />
                        </>
                    )
                }}
            />
        </SafeArea>
    )
}

export default AddNewApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6
    },
    searchBar: {
        backgroundColor: colors.slate[100]
    }
})