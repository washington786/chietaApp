import ItemOrgs from "./ItemOrgs";
import { OrganisationDto } from "@/core/models/organizationDto";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import { RCol, RDivider } from "@/components/common";
import { Text } from "react-native-paper";
import Feather from '@expo/vector-icons/Feather';
import { FC } from "react";
import colors from "@/config/colors";

interface linkedProps {
    org: OrganisationDto[],
    onPress: (selected: OrganisationDto) => void;
    isLinkingRequired?: boolean;
    isLinkingRequiredNew?: boolean;
    onNewLinking?: (item: OrganisationDto) => void;
    newOrgs?: OrganisationDto[];
}

export const LinkedOrganizationList: FC<linkedProps> = ({ org, isLinkingRequired = false, isLinkingRequiredNew = true, onNewLinking, onPress, newOrgs }) => {
    const { height: windowHeight } = useWindowDimensions();
    const baseListHeight = Math.max(120, Math.min(180, windowHeight * 0.22));
    const newOrgListHeight = Math.max(140, Math.min(200, windowHeight * 0.26));
    const hasNewOrgs = Boolean(newOrgs && newOrgs.length > 0);

    const renderList = ({ item }: { index: number, item: OrganisationDto }) => {
        return (
            <ItemOrgs org={item} onPress={() => onPress(item)} isLinkingRequired={isLinkingRequired} key={`item-${item.id}`} />
        )
    }

    const renderAddNewItem = ({ item }: { index: number, item: OrganisationDto }) => {
        if (!onNewLinking) return null;
        return (
            <ItemOrgs org={item} onNewLinking={() => onNewLinking(item)} isLinkingRequired={isLinkingRequiredNew} key={`${item.id}`} />
        )
    }

    const scrollProps = {
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        bounces: false,
        alwaysBounceHorizontal: false,
        overScrollMode: 'never' as const,
    }

    return (
        <View>
            <View style={{ height: baseListHeight }}>
                <FlatList data={org}
                    keyExtractor={(item) => `linked-orgs-${item.id}`}
                    style={{ paddingVertical: 5 }}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={renderList}
                    {...scrollProps}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<>
                        <RCol style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20, flex: 1 }}>
                            <Feather name="box" size={40} color="gray" style={{ marginLeft: 6 }} />
                            <Text variant='bodyMedium' style={{ color: colors.slate[400] }}>No linked organizations found.</Text>
                        </RCol>
                    </>}
                    windowSize={21}
                    horizontal={true}
                    scrollEnabled={org.length > 1}
                />
            </View>

            {hasNewOrgs && <View style={{ height: newOrgListHeight }}>
                <RCol>
                    <View style={listStyles.newOrgHeader}>
                        <Text style={listStyles.newOrgCount}>{newOrgs?.length} New Organisation{(newOrgs?.length || 0) > 1 ? 's' : ''}</Text>
                    </View>
                    <RDivider />
                </RCol>
                <FlatList data={newOrgs}
                    keyExtractor={(item) => `linked-orgs-${item.id}`}
                    renderItem={renderAddNewItem}
                    style={{ paddingVertical: 5 }}
                    contentContainerStyle={{ gap: 8 }}
                    ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    {...scrollProps}
                    horizontal={true}
                    scrollEnabled={(newOrgs?.length || 0) > 1}
                />
            </View>}
        </View>
    )
}

const listStyles = StyleSheet.create({
    newOrgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    newOrgCount: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary[700],
        letterSpacing: 0.2,
    },
});
