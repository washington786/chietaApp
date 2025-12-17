import ItemOrgs from "./ItemOrgs";
import { OrganisationDto } from "@/core/models/organizationDto";
import { FlatList, View } from "react-native";
import { RCol } from "@/components/common";
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

    return (
        <FlatList data={org}
            keyExtractor={(item) => `linked-orgs-${item.id}`}
            style={{ paddingVertical: 5, flex: 1, flexGrow: 1 }}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ListEmptyComponent={<>
                <RCol style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                    <Feather name="box" size={16} color="gray" style={{ marginLeft: 6 }} />
                    <Text variant='bodyMedium' style={{ color: colors.slate[400] }}>No linked organizations found.</Text>
                </RCol>
            </>}
            windowSize={21}
            ListFooterComponent={
                newOrgs && newOrgs.length > 0 ?
                    <FlatList data={newOrgs}
                        keyExtractor={(item) => `linked-orgs-${item.id}`}
                        renderItem={renderAddNewItem}
                        ListHeaderComponent={<>{newOrgs && newOrgs?.length > 0 && <Text style={{ paddingVertical: 8 }}>New Organization(s)</Text>}</>}
                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                        removeClippedSubviews={false}
                        initialNumToRender={1}
                        maxToRenderPerBatch={1}
                        windowSize={21}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    /> : null
            }
        />
    )
}