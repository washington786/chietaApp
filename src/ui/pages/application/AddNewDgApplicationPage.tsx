import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { RCol, REmpty, RListLoading, SafeArea, RText, RRow } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { AddDgApplicationItem } from '@/components/modules/application';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { activeWindow, activeWindowBodyRequest, DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto';
import { showToast } from '@/core';
import { fetchDiscretionaryGrantData } from '@/store/slice/thunks/DiscretionaryThunks';
import { linkProjectToOrganization } from '@/store/slice/DiscretionarySlice';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useCreateEditApplicationMutation, useGetActiveWindowsParamsQuery, api } from '@/store/api/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { navigationTypes } from '@/core/types/navigationTypes';

import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Text as RnText } from 'react-native-paper'
import { errorBox } from '@/components/loadAssets';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';
const AddNewDgApplicationPage = () => {
    const { orgId } = useRoute<RouteProp<navigationTypes, "newDgApplication">>().params;

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const [snackbar, setSnackbar] = useState<{ visible: boolean; lastLinkedId: number | null }>({
        visible: false,
        lastLinkedId: null,
    });

    const { user, error: authError } = useSelector((state: RootState) => state.auth);

    const { close, open } = useGlobalBottomSheet();

    useEffect(() => {
        if (authError) {
            showToast({ message: authError.message, type: "error", title: "Authentication Error", position: "top" });
        }
    }, [authError]);


    const [createApplication] = useCreateEditApplicationMutation();


    const { onBack } = usePageTransition();

    // Fetch active discretionary windows
    const { data: windowsData, isLoading: windowsLoading, error } = useGetActiveWindowsParamsQuery(undefined);

    // Get active windows filtered by search query
    const activeWindows = useMemo(() => {
        const items = windowsData?.result?.items || [];
        const filtered = items.filter((w: activeWindow) => {
            // Only show active windows
            if (!w.activeYN) return false;
            // If no search query, show all active windows
            if (!searchQuery) return true;
            // Filter by search query matching any field
            const query = searchQuery.toLowerCase();
            const titleMatch = w.title?.toLowerCase().includes(query) ?? false;
            const focusMatch = w.focusArea?.toLowerCase().includes(query) ?? false;
            const projMatch = w.projType?.toLowerCase().includes(query) ?? false;
            return titleMatch || focusMatch || projMatch;
        });

        // Sort by id in descending order (most recent first)
        return filtered.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
    }, [windowsData, searchQuery]);


    const dispatch = useDispatch<AppDispatch>();


    const handleLinkingProject = async (item: activeWindow) => {
        let projTypeCode = 0;

        switch (item.projType) {
            case 'Learning Projects':
                projTypeCode = 2;
                break;
            case "Research Projects":
                projTypeCode = 3;
                break;
            case "Strategic Projects":
                projTypeCode = 4;
                break;
            default:
                projTypeCode = 0;
                break;
        };

        const now = new Date().toISOString();

        const payload: activeWindowBodyRequest = {
            organisationId: Number(orgId),
            projectStatusID: 9,
            windowParamId: item.id,
            projectTypeId: projTypeCode,
            submittedBy: Number(user?.id) || 0,
            submissionDte: now,
            captureDte: now,
            usrUpd: user?.id || '0',
            dteCreated: now,
            projectNam: item.projType,
            projShortNam: item.projType,
            projectStatDte: now,
            grantWindowId: 0
        };
        try {
            await createApplication(payload).unwrap();
            // Refetch discretionary grant data and RTK Query cache to show new application on top
            dispatch(fetchDiscretionaryGrantData());
            // Invalidate the cache for getOrgProjects so it refetches with the new application
            dispatch(api.util.invalidateTags(['Grant']));
            setSnackbar({ visible: true, lastLinkedId: item.id });
            setTimeout(() => {
                onBack();
            }, 2000);
        } catch (error) {
            open(<LinkingApplicationError close={close} />, { snapPoints: ["40%"] });
            console.warn('Error linking project to organization:', error);
        }
    };

    const handleUndo = () => {
        if (snackbar.lastLinkedId !== null) {
            dispatch(linkProjectToOrganization(snackbar.lastLinkedId));
            setSnackbar({ visible: false, lastLinkedId: null });
        }
    };


    useEffect(() => {
        dispatch(fetchDiscretionaryGrantData())
    }, [dispatch])

    if (error) {
        showToast({ message: "Failed to fetch active windows", title: "Error Fetching", type: "error", position: "top" });
    }

    const renderList = ({ index, item }: { index: number, item: activeWindow }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <AddDgApplicationItem onPress={() => handleLinkingProject(item)} item={item} />
            </Animated.View>
        )
    }

    if (windowsLoading) {
        return (
            <SafeArea>
                <RListLoading count={7} />
            </SafeArea>
        )
    } else {
        return (
            <SafeArea>
                <RHeader name='Add Dg Application' hasRightIcon onPressRight={() => setShowSearch(!showSearch)} iconRight='search' />
                {
                    showSearch && (

                        <RCol style={styles.col}>
                            <Searchbar
                                placeholder="Search application"
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                            />
                        </RCol>
                    )
                }
                <FlatList data={activeWindows}
                    style={{ paddingHorizontal: 12, paddingVertical: 16, flexGrow: 1, flex: 1, marginTop: 2 }}
                    renderItem={renderList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`Applications available in the cycle will appear here.`} />}
                />
                <Snackbar
                    visible={snackbar.visible}
                    style={{ marginBottom: 20 }}
                    onDismiss={() => setSnackbar({ visible: false, lastLinkedId: null })}
                    action={{ label: 'Undo', onPress: handleUndo }}>
                    Application added successfully to your organization profile.
                </Snackbar>
            </SafeArea>
        )
    }
}


function LinkingApplicationError({ close }: { close: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
            <RRow
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <RnText variant="titleMedium">Application Error</RnText>
                </View>

                <TouchableOpacity onPress={close}>
                    <EvilIcons name="close" size={32} color="black" />
                </TouchableOpacity>
            </RRow>

            <RCol style={{ alignItems: "center", gap: 16 }}>
                <Image source={errorBox} style={{ width: 64, height: 64 }} />
                <RnText variant="headlineMedium" style={{ fontWeight: "bold" }}>
                    Error Adding Application
                </RnText>
                <RnText
                    variant="bodyMedium"
                    style={{ textAlign: "center", color: "#666", lineHeight: 24 }}
                >
                    This application already exists in your organization profile. Please check your applications list.
                </RnText>
            </RCol>
        </View>
    )
}

export default AddNewDgApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    searchBar: {
        backgroundColor: colors.zinc[100],
        borderWidth: 0.5,
        borderColor: colors.zinc[300]
    },
    windowInfo: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.slate[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200]
    },
    windowBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.slate[100],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.slate[300]
    },
    windowBadgeActive: {
        backgroundColor: colors.blue[600],
        borderColor: colors.blue[700]
    }
})