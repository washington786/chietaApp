import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RCol, SafeArea } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { ItemOrganization } from '@/components/modules/application';

const AddNewApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);

    function onDismissSnackBar() {
        setVisible(!visible);
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
                            <ItemOrganization onPress={onDismissSnackBar} />
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

export default AddNewApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6
    },
    searchBar: {
        backgroundColor: colors.slate[100]
    }
});