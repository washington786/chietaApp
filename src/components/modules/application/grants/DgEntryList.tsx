import { StyleSheet, View, FlatList, Text, ListRenderItem } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import DgApplicationEntryItem, { ApplicationEntry } from './DgApplicationEntryItem'
import colors from '@/config/colors'

interface DgEntryListProps {
    data: ApplicationEntry[];
    onEdit?: (data: ApplicationEntry) => void;
    onDelete?: (id: string) => void;
    isLoading?: boolean;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const DgEntryList: React.FC<DgEntryListProps> = ({
    data,
    onEdit,
    onDelete,
    isLoading = false,
    ListEmptyComponent,
}) => {
    const renderItem: ListRenderItem<ApplicationEntry> = useCallback(
        ({ item }) => (
            <DgApplicationEntryItem
                data={item}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
        [onEdit, onDelete]
    );

    const keyExtractor = useCallback((item: ApplicationEntry) => item.id, []);

    const DefaultEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {isLoading ? 'Loading applications...' : 'No applications added yet'}
            </Text>
        </View>
    );

    const emptyComponent = ListEmptyComponent || <DefaultEmptyComponent />;

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                scrollEnabled={data.length > 0}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={emptyComponent}
                nestedScrollEnabled
            />
        </View>
    );
};

export default DgEntryList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.slate[50],
    },
    listContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 100,
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 14,
        color: colors.gray[500],
        textAlign: 'center',
    },
});
