import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { RCol, RDialog, RListLoading, RRow } from '@/components/common'
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDelinkOrganizationMutation, useGetSDFByUserQuery } from '@/store/api/api';

const LinkedOrganizations = () => {
    const { newOrg, discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();
    const { linkedOrganizations, organizations, loading, error } = useSelector((state: RootState) => state.linkedOrganization);
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: sdfData } = useGetSDFByUserQuery(user ? user.id : 0, { skip: !user || !user.id });

    const userId = user && user.id || 0;

    const [delinkOrganization] = useDelinkOrganizationMutation();

    const dispatch = useDispatch<AppDispatch>();

    const [visible, setVisible] = useState(false);
    const prevErrorRef = useRef<typeof error>(null);

    useEffect(() => {
        if (user && user?.sdfId) {
            dispatch(loadOrganizations(user.sdfId));
        }
        dispatch(loadLinkedOrganizationsAsync());
    }, [dispatch, user?.sdfId]);

    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({ message: error, type: "error", title: "Error", position: "top" });
        }
        prevErrorRef.current = error;
    }, [error]);

    function handleDialog() {
        close();
        setVisible(!visible);
    };

    async function handleContinue() {

        if (!sdfData || !sdfData.id) {
            showToast({ message: "SDF ID not found", type: "error", title: "Error", position: "top" });
            return;
        }

        setVisible(false);
        try {
            await delinkOrganization({ id: sdfData.id, userid: Number(userId) }).unwrap();
            showToast({ message: "successfully delinked organization from your list.", type: "success", title: "De-linking", position: "top" });
            dispatch(loadLinkedOrganizationsAsync());
        } catch (err) {
            showToast({ message: "Failed to delink organization from your list.", type: "error", title: "De-linking", position: "top" });
        }
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

    if (loading) {
        return (<RListLoading count={7} />);
    } else {
        return (
            <RCol style={{ marginTop: 12 }}>
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

                <RDialog hideDialog={handleDialog} visible={visible} message={`are you sure you want to de-link this organization with SDFID-${sdfData?.id}?`} title='Delink Org' onContinue={handleContinue} />
            </RCol>
        )
    }

}

interface OrgDetailsProps {
    onDiscretionaryGrants?: () => void;
    onMandatoryGrants?: () => void;
    onDelink?: () => void;
    orgName: string;
}

export function OrgDetails({ onDelink, onMandatoryGrants, onDiscretionaryGrants, orgName }: OrgDetailsProps) {
    return <RCol style={{ position: 'relative' }}>
        <RRow style={{ alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="office-building" size={24} color="gray" />
            <Text variant='headlineLarge'>{orgName}</Text>
        </RRow>
        <Text variant='titleLarge' style={{ fontSize: 11 }}>Select a grant type to view your applications</Text>
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
        backgroundColor: colors.primary[200],
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 3
    },
    delink: {
        justifyContent: 'center', marginTop: 12, position: 'absolute', bottom: -70, right: 0, padding: 10, borderRadius: 100, backgroundColor: colors.red[600], alignItems: 'center'
    },
    linkedOrgsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    linkedOrgsTitle: { fontSize: 15, fontWeight: '600', color: '#222' },
    viewAll: { color: '#4F8CFF', fontWeight: '500' },

});