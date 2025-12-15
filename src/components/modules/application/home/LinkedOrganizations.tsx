import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RCol, RDialog, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import colors from '@/config/colors';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';
import { showToast } from '@/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { LinkedOrganizationList } from './LinkedOrganizationList';
import { loadLinkedOrganizationsAsync, loadOrganizations } from '@/store/slice/thunks/OrganizationThunks';
import { OrganisationDto } from '@/core/models/organizationDto';

const LinkedOrganizations = () => {
    const { newOrg, discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();
    const { linkedOrganizations, organizations } = useSelector((state: RootState) => state.linkedOrganization);
    const dispatch = useDispatch<AppDispatch>();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        dispatch(loadOrganizations());
        dispatch(loadLinkedOrganizationsAsync());
    }, [dispatch]);

    function handleDialog() {
        close();
        setVisible(!visible);
    };

    function handleContinue() {
        setVisible(false);
        showToast({ message: "successfully delinked organization from your list.", type: "success", title: "De-linking", position: "top" })
    }

    function handleMandatoryGrants(org: OrganisationDto) {
        close();
        mandatoryGrants({ orgId: String(org.id) });
    }

    function handleDiscretionaryGrants(org: OrganisationDto) {
        close();
        discretionaryGrants({ orgId: String(org.id) });
    }

    function handleOrgLinking(org: OrganisationDto) {
        linkOrgDoc({ orgId: String(org.id) });
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
                <LinkedOrganizationList
                    org={organizations}
                    onNewLinking={(selected) => handleOrgLinking(selected)}
                    onPress={(selectedOrg: OrganisationDto) => open(
                        <OrgDetails
                            onDiscretionaryGrants={() => handleDiscretionaryGrants(selectedOrg)} onMandatoryGrants={() => handleMandatoryGrants(selectedOrg)} onDelink={handleDialog} orgName={`${selectedOrg.organisationTradingName}`} />, { snapPoints: ["50%"] })} isLinkingRequired={false}
                    newOrgs={linkedOrganizations.filter(l => l.approvalStatus !== 'cancelled')}
                    isLinkingRequiredNew={true} />
            </RCol>

            <RDialog hideDialog={handleDialog} visible={visible} message='are you sure you want to de-link this organization?' title='Delink Org' onContinue={handleContinue} />
        </RCol>
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
});