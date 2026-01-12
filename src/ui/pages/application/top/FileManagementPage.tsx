import { FlatList, StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import { RCol, REmpty } from '@/components/common'
import { useRoute, RouteProp } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { DocumentDto } from '@/core/models/MandatoryDto'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { mockDocuments } from '@/core/types/dummy'
import { showToast } from '@/core'
import RDownload from '@/components/common/RDownload'
import { Text } from 'react-native-paper'

const FileManagementPage = () => {
    const route = useRoute<RouteProp<navigationTypes, "applicationDetails">>();
    const { item } = route.params || {};

    const discretionaryDocs = useSelector((state: RootState) => state.discretionaryGrant.documents);

    const documents = useMemo<DocumentDto[]>(() => {
        if (item?.documents && Array.isArray(item.documents) && item.documents.length) {
            return item.documents;
        }
        if (discretionaryDocs.length) {
            return discretionaryDocs;
        }
        return mockDocuments;
    }, [item?.documents, discretionaryDocs]);

    const handleDownload = (doc: DocumentDto) => {
        showToast({
            title: "Download",
            message: `Preparing ${doc.filename}...`,
            type: "success",
            position: "top"
        });
    };

    const renderItem = ({ item }: { item: DocumentDto }) => (
        <RDownload
            title={item.documentType || "Document"}
            fileName={item.filename}
            onPress={() => handleDownload(item)}
        />
    );

    return (
        <FlatList
            data={documents}
            keyExtractor={(doc) => `${doc.id}-${doc.filename}`}
            style={styles.list}
            renderItem={renderItem}
            ListHeaderComponent={<RCol style={{ paddingVertical: 6 }}><Text>Documents to Download</Text></RCol>}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListEmptyComponent={<REmpty title='No Files Found' subtitle={`Files available in the cycle will appear here.`} />}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
        />
    )
}

export default FileManagementPage

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
})