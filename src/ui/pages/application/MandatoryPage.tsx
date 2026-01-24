import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ApplicationItem, InformationBanner } from '@/components/modules/application'
import { FAB, Searchbar } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import colors from '@/config/colors'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { showToast } from '@/core'
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useGetOrgApplicationsQuery } from '@/store/api/api'

const MandatoryPage = () => {
    const { newApplication } = usePageTransition();
    const [allApplications, setAllApplications] = useState<MandatoryApplicationDto[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [show, setShow] = useState<boolean>(false);

    const router = useRoute<RouteProp<navigationTypes, "mandatory">>();

    const { orgId } = router.params;

    const { data, isLoading: loading, error } = useGetOrgApplicationsQuery(orgId || '', { skip: !orgId });

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
        if (data?.items) {
            setAllApplications(data.items);
        }
    }, [data]);

    const sortedApplications = useMemo(() => {
        return [...allApplications].sort((a, b) => b.id - a.id);
    }, [allApplications]);

    const fieldsToSearch = ['referenceNo', 'description', 'grantStatus', 'organisation_Name'] as const;

    const filteredApplications = useMemo(() => {
        let applications = sortedApplications;

        if (searchQuery?.trim()) {
            const query = searchQuery.trim().toLowerCase();
            applications = sortedApplications.filter((app) => {
                return fieldsToSearch.some((field) => {
                    const value = app[field];
                    return typeof value === 'string' && value.toLowerCase().includes(query);
                });
            });
        }

        return applications;
    }, [sortedApplications, searchQuery]);

    const renderList = ({ index, item }: { index: number, item: MandatoryApplicationDto }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ApplicationItem item={item} />
            </Animated.View>
        )
    }

    if (loading) {
        return <RListLoading count={7} />
    }
    return (
        <SafeArea>
            <RHeader name='Mandatory Grant Applications' hasRightIcon iconRight='search' onPressRight={() => setShow(!show)} />
            {
                show &&
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
            <FlatList data={filteredApplications}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={renderList}
                ListHeaderComponent={
                    <>
                        {
                            !show &&
                            <InformationBanner title='search and filter through your mandatory grant applications.' />
                        }

                    </>
                }
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={false}
                ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`when you have applications, they'll appear here`} />}
            />
            <FAB
                mode='flat'
                icon="plus"
                style={styles.fab}
                onPress={newApplication}
                color='white'
            />
        </SafeArea>
    )


}

export default MandatoryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.primary[900]
    },
})