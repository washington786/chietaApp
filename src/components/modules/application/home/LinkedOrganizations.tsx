import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
import { RCol, RDialog, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import colors from '@/config/colors';
import ItemOrgs from './ItemOrgs';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';
import { showToast } from '@/core';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { OrganisationDto } from '@/core/models/organizationDto';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const LinkedOrganizations = () => {
    const { newOrg, discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();
    const { linkedOrganizations, organizations } = useSelector((state: RootState) => state.linkedOrganization);

    const [visible, setVisible] = useState(false);

    function handleDialog() {
        close();
        setVisible(!visible);
    };

    function handleContinue() {
        setVisible(false);
        showToast({ message: "successfully delinked organization from your list.", type: "success", title: "De-linking", position: "top" })
    }

    function handleMandatoryGrants() {
        close();
        mandatoryGrants({ orgId: "1" });
    }

    function handleDiscretionaryGrants() {
        close();
        discretionaryGrants({ orgId: "1" });
    }

    function handleOrgLinking() {
        linkOrgDoc({ orgId: "1" });
    }

    return (
        <RCol>
            <RRow style={{ alignItems: 'center', gap: 6, marginBottom: 12, justifyContent: 'space-between' }}>
                <Text variant='titleSmall'>my linked organizations</Text>
                <TouchableOpacity style={styles.btn} onPress={newOrg}>
                    <Feather name="link-2" size={16} color="white" style={{ marginLeft: 6 }} />
                    <Text variant='titleSmall' style={{ color: "white" }}>add new</Text>
                </TouchableOpacity>
            </RRow>

            <RCol>

                <LinkedOrganization org={organizations} onNewLinking={handleOrgLinking} onPress={() => open(<OrgDetails onDiscretionaryGrants={handleDiscretionaryGrants} onMandatoryGrants={handleMandatoryGrants} onDelink={handleDialog} orgName={`Name`} />, { snapPoints: ["50%"] })} isLinkingRequired={false} newOrgs={linkedOrganizations} isLinkingRequiredNew={true} />

                {/* <ItemOrgs onPress={() => open(<OrgDetails onDiscretionaryGrants={handleDiscretionaryGrants} onMandatoryGrants={handleMandatoryGrants} onDelink={handleDialog} />, { snapPoints: ["50%"] })} isLinkingRequired={false} />

                <ItemOrgs
                    onNewLinking={handleOrgLinking}
                    isLinkingRequired={true}

                /> */}
            </RCol>

            <RDialog hideDialog={handleDialog} visible={visible} message='are you sure you want to de-link this organization?' title='Delink Org' onContinue={handleContinue} />
        </RCol>
    )
}

interface linkedProps {
    org: OrganisationDto[],
    onPress?: () => void;
    isLinkingRequired?: boolean;
    isLinkingRequiredNew?: boolean;
    onNewLinking?: () => void;
    newOrgs?: OrganisationDto[];
}

const LinkedOrganization: FC<linkedProps> = ({ org, isLinkingRequired = false, isLinkingRequiredNew = true, onNewLinking, onPress, newOrgs }) => {

    const renderList = ({ index, item }: { index: number, item: OrganisationDto }) => {
        return (
            <Animated.View key={`tracking-${item}-${Date.now()}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ItemOrgs org={item} onPress={onPress} isLinkingRequired={isLinkingRequired} />
            </Animated.View>
        )
    }

    const renderAddNewItem = ({ index, item }: { index: number, item: OrganisationDto }) => {
        if (!onNewLinking) return null;
        return (
            <Animated.View key={`tracking-${item.id}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ItemOrgs org={item} onNewLinking={onNewLinking} isLinkingRequired={isLinkingRequiredNew} />
            </Animated.View>
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
            windowSize={21}
            ListFooterComponent={
                <FlatList data={newOrgs}
                    keyExtractor={(item) => `linked-orgs-${item.id}`}
                    renderItem={renderAddNewItem}
                    ListHeaderComponent={<Text>New Items</Text>}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={21}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            }
        />
    )
}

interface OrgDetailsProps {
    onDiscretionaryGrants?: () => void;
    onMandatoryGrants?: () => void;
    onDelink?: () => void;
    orgName: string;
}
function OrgDetails({ onDelink, onMandatoryGrants, onDiscretionaryGrants, orgName }: OrgDetailsProps) {
    return <RCol style={{ position: 'relative' }}>
        <Text variant='titleLarge'>{orgName}</Text>
        <Text variant='titleLarge' style={{ fontSize: 11 }}>view applications in categories</Text>
        <TypeDetails title='Mandator grants' onpress={onMandatoryGrants} />
        <TypeDetails title='Discretionary grants' onpress={onDiscretionaryGrants} />

        <TouchableOpacity style={styles.delink} onPress={onDelink}>
            <Feather name="link-2" size={16} color="white" style={{ marginLeft: 6 }} />
            <Text variant='titleSmall' style={[styles.text, { textAlign: 'center', color: colors.slate[50] }]}>delink</Text>
        </TouchableOpacity>

    </RCol>
}

interface TypeDetailsProps {
    title?: string;
    onpress?: () => void;
}

function TypeDetails({ title, onpress }: TypeDetailsProps) {
    return <TouchableOpacity style={[styles.detbtn, { justifyContent: 'space-between' }]} onPress={onpress}>
        <Text variant='titleSmall' style={styles.text}>{title}</Text>
        <Feather name="chevron-right" size={16} color="black" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
}


export default LinkedOrganizations

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.primary[900],
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        flexDirection: "row",
        gap: 3,
    },
    text: {
        flex: 1,
        textTransform: 'capitalize'
    },
    detbtn: {
        backgroundColor: colors.zinc[100],
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 3
    },
    delink: {
        justifyContent: 'center', marginTop: 12, position: 'absolute', bottom: -70, right: 0, padding: 10, borderRadius: 100, backgroundColor: colors.red[500], alignItems: 'center'
    }
})