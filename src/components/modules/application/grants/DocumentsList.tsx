import { StyleSheet, View, FlatList, Linking, ActivityIndicator } from 'react-native'
import React from 'react'
import { moderateScale, scale } from '@/utils/responsive'
import { Text, IconButton } from 'react-native-paper'
import colors from '@/config/colors'
import { RRow } from '@/components/common'

export interface Document {
    entityid: number;
    newfilename: string;
    filename: string;
    lastmodifieddate: string;
    size: string;
    type: string;
    documenttype: string;
    module: string;
    userId: number;
    id: number;
}

interface DocumentsListProps {
    documents: Document[];
    isLoading?: boolean;
    onDownload?: (document: Document) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
    documents = [],
    isLoading = false,
    onDownload
}) => {
    const formatFileSize = (bytes: string): string => {
        const numBytes = parseInt(bytes) || 0;
        if (numBytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(numBytes) / Math.log(k));
        return Math.round((numBytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDownload = (document: Document) => {
        if (onDownload) {
            onDownload(document);
        } else {
            // Default: open document in browser or download
            const downloadUrl = `https://ims.chieta.org.za:22743/api/services/app/Account/DownloadFile?id=${document.id}`;
            Linking.openURL(downloadUrl).catch(err =>
                console.log('An error occurred', err)
            );
        }
    };

    const renderDocumentItem = ({ item }: { item: Document }) => (
        <View style={styles.documentItem}>
            <RRow style={{ alignItems: 'flex-start', gap: 12 }}>
                <View style={styles.fileIconContainer}>
                    <Text style={styles.fileIcon}>📄</Text>
                </View>
                <View style={[styles.documentInfo, { flex: 1 }]}>
                    <Text style={styles.filename} numberOfLines={2}>{item.filename}</Text>
                    <RRow style={{ gap: 8, marginTop: 6 }}>
                        <Text style={styles.meta}>{formatFileSize(item.size)}</Text>
                        <Text style={styles.meta}>•</Text>
                        <Text style={styles.meta} numberOfLines={1}>{item.lastmodifieddate}</Text>
                    </RRow>
                </View>
                <IconButton
                    icon="download"
                    size={moderateScale(20)}
                    iconColor={colors.primary[500]}
                    onPress={() => handleDownload(item)}
                    style={styles.downloadButton}
                />
            </RRow>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
                <Text style={styles.loadingText}>Loading documents...</Text>
            </View>
        );
    }

    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No documents uploaded yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={documents}
                renderItem={renderDocumentItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default DocumentsList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.zinc[50],
        borderRadius: scale(8),
        overflow: 'hidden',
    },
    documentItem: {
        paddingVertical: scale(12),
        paddingHorizontal: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.zinc[200],
    },
    fileIconContainer: {
        width: scale(40),
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.zinc[100],
        borderRadius: scale(6),
    },
    fileIcon: {
        fontSize: moderateScale(20),
    },
    documentInfo: {
        justifyContent: 'center',
    },
    filename: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.slate[900],
    },
    meta: {
        fontSize: moderateScale(12),
        color: colors.slate[500],
    },
    downloadButton: {
        margin: 0,
    },
    loadingContainer: {
        paddingVertical: scale(24),
        paddingHorizontal: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    loadingText: {
        fontSize: moderateScale(14),
        color: colors.slate[500],
    },
    emptyContainer: {
        paddingVertical: scale(24),
        paddingHorizontal: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: moderateScale(14),
        color: colors.slate[500],
    },
});
