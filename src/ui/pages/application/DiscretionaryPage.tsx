import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { FAB, Searchbar } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { DgApplicationItem, InformationBanner } from '@/components/modules/application'
import colors from '@/config/colors'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { dgProject } from '@/core/models/DiscretionaryDto'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useGetDGOrgApplicationsQuery } from '@/store/api/api'

const DiscretionaryPage = () => {
    const { newDgApplication } = usePageTransition();
    const [allApplications, setAllApplications] = useState<{ discretionaryProject: dgProject }[]>([]);

    const [showSearch, setShowSearch] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const router = useRoute<RouteProp<navigationTypes, "discretionary">>();

    const { orgId } = router.params;

    const { data, isLoading: loading, error } = useGetDGOrgApplicationsQuery(orgId || '', { skip: !orgId });

    useEffect(() => {
        if (error && orgId) {
            let errorMessage = 'Failed to load applications';
            if (error && typeof error === 'object' && 'data' in error && error.data) {
                errorMessage = JSON.stringify(error.data);
            } else if (error && typeof error === 'object' && 'message' in error && error.message) {
                errorMessage = error.message as string;
            }
            if (errorMessage && errorMessage !== 'null') {
                showToast({ message: errorMessage, title: "Error Fetching", type: "error", position: "top" });
            }
        }
    }, [error, orgId]);

    useEffect(() => {
        if (data?.result?.items) {
            const wrappedItems = data.result.items.map((item: dgProject) => ({ discretionaryProject: item }));
            setAllApplications(wrappedItems);
        }
    }, [data]);

    const fieldsToSearch = [
        'title',
        'focusArea',
        'projType',
        'subCategory',
    ] as const;

    const filteredProjects = useMemo(() => {
        if (!searchQuery?.trim()) return allApplications;

        const query = searchQuery.trim().toLowerCase();

        return allApplications.filter(({ discretionaryProject }) => {
            return fieldsToSearch.some((field) => {
                const value = discretionaryProject[field];
                return typeof value === 'string' && value.toLowerCase().includes(query);
            });
        });
    }, [allApplications, searchQuery]);

    const renderList = ({ index, item }: { index: number, item: { discretionaryProject: dgProject } }) => {
        return (
            <Animated.View key={`app-${item.discretionaryProject.id}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <DgApplicationItem item={item.discretionaryProject} />
            </Animated.View>
        )
    }

    if (loading) {
        return <RListLoading count={7} />
    } else {
        return (
            <SafeArea>
                <RHeader name='Discretionary Grant Applications' hasRightIcon iconRight='search' onPressRight={() => setShowSearch(!showSearch)} />

                {
                    showSearch &&
                    <RCol style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12
                    }}>
                        <Searchbar
                            placeholder="Search application"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={{ backgroundColor: colors.zinc[50], borderWidth: 1, borderColor: colors.zinc[300] }}
                        />
                    </RCol>
                }

                <FlatList
                    data={filteredProjects}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                    renderItem={renderList}
                    ListHeaderComponent={<>{!showSearch && < InformationBanner title='list of Discretionary grants applied for.You can only submit during open grant window.' />}</>}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`when you have applications, they'll appear here`} />}
                />
                <FAB
                    mode='flat'
                    icon="plus"
                    style={styles.fab}
                    onPress={() => newDgApplication({ orgId: orgId || '' })}
                    color='white'
                />
            </SafeArea>
        )
    }

}

export default DiscretionaryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.primary[900],
    },
})