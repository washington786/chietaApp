import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { RCol, SafeArea } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { AddDgApplicationItem } from '@/components/modules/application';

const AddNewDgApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);

    function onDismissSnackBar() {
        setVisible(!visible);
    }
    return (
        <SafeArea>
            <RHeader name='Add Dg Application' />
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
                            <AddDgApplicationItem onPress={onDismissSnackBar} />
                            <AddDgApplicationItem onPress={onDismissSnackBar} />
                        </>
                    )
                }}
            />
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                style={{ marginBottom: 20 }}
                action={{
                    label: 'Undo',
                    onPress: () => {
                        //Todo:add method to update.
                    },
                }}>
                Application added successfully to your organization profile.
            </Snackbar>
        </SafeArea>
    )
}

export default AddNewDgApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6
    },
    searchBar: {
        backgroundColor: colors.slate[100]
    }
})