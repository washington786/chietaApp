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
import { loadLinkedOrganizationsAsync } from '@/store/slice/thunks/OrganizationThunks';
import { OrganisationDto } from '@/core/models/organizationDto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDelinkOrganizationMutation, useGetOrganizationsBySdfIdQuery } from '@/store/api/api';

const LinkedOrganizations = () => {
    const { newOrg, discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();
    const { linkedOrganizations, loading, error } = useSelector((state: RootState) => state.linkedOrganization);
    const { user } = useSelector((state: RootState) => state.auth);

    // Use sdfId directly from authenticated user (now correctly populated after login)
    const sdfId = user?.sdfId;

    // Get organizations using SDF ID
    const { data: organizationsData, isLoading: orgLoading, error: orgError } = useGetOrganizationsBySdfIdQuery(sdfId || 0, {
        skip: !sdfId
    });

    const userId = user && user.id || 0;

    const [delinkOrganization] = useDelinkOrganizationMutation();

    const dispatch = useDispatch<AppDispatch>();

    const [visible, setVisible] = useState(false);
    const prevErrorRef = useRef<typeof error>(null);

    useEffect(() => {
        dispatch(loadLinkedOrganizationsAsync());
    }, [dispatch]);

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

        if (!sdfId) {
            showToast({ message: "SDF ID not found", type: "error", title: "Error", position: "top" });
            return;
        }

        setVisible(false);
        try {
            await delinkOrganization({ id: sdfId, userid: Number(userId) }).unwrap();
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

    if (loading || orgLoading) {
        return (<RListLoading count={1} />);
    }
    return (
        <RCol style={{ marginTop: 12 }}>
            <RCol>
                <LinkedOrganizationList
                    org={organizationsData || []}
                    onNewLinking={(selected) => handleOrgLinking(selected)}
                    onPress={(selectedOrg: OrganisationDto) => open(
                        <OrgDetails
                            onDiscretionaryGrants={() => handleDiscretionaryGrants(selectedOrg)}
                            onMandatoryGrants={() => handleMandatoryGrants(selectedOrg)}
                            onDelink={handleDialog}
                            onCancel={close}
                            orgName={`${selectedOrg.organisationTradingName}`}
                        />, { snapPoints: ["70%"] })} isLinkingRequired={false}
                    newOrgs={linkedOrganizations.filter(l => l.approvalStatus !== 'cancelled')}
                    isLinkingRequiredNew={true} />
            </RCol>

            <RDialog hideDialog={handleDialog} visible={visible} message={`are you sure you want to de-link this organization with SDFID-${sdfId}?`} title='Delink Org' onContinue={handleContinue} />
        </RCol>
    )
}



interface OrgDetailsProps {
    onDiscretionaryGrants?: () => void;
    onMandatoryGrants?: () => void;
    onDelink?: () => void;
    orgName: string;
    onCancel?: () => void;
}

export function OrgDetails({ onDelink, onMandatoryGrants, onDiscretionaryGrants, orgName, onCancel }: OrgDetailsProps) {
    return <RCol style={{ alignItems: 'center', paddingVertical: 20, paddingHorizontal: 10, gap: 16 }}>
        {/* Header with org icon and name */}
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 8 }}>
            <TouchableOpacity style={styles.delinkBtn} onPress={onDelink}>
                <Text style={styles.delinkText}>Delink</Text>
                <Feather name="x" size={18} color={colors.red[600]} />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="office-building" size={40} color={colors.slate[300]} />
            </View>
            <Text variant='headlineMedium' style={{ marginTop: 12, fontWeight: '700' }}>{orgName}</Text>
            <Text variant='bodySmall' style={{ color: colors.zinc[400], marginTop: 4, textAlign: 'center' }}>Select grant type to view and manage your active applications for this organization</Text>
        </View>

        {/* Grant type options */}
        <View style={{ width: '100%', gap: 12 }}>
            <TypeDetails
                icon="file-document"
                title='Mandatory Grants'
                description='View and manage mandatory submissions'
                onpress={onMandatoryGrants}
            />
            <TypeDetails
                icon="folder-multiple"
                title='Discretionary Grants'
                description='Explore additional funding opportunities'
                onpress={onDiscretionaryGrants}
            />
        </View>

        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
    </RCol>
}

interface TypeDetailsProps {
    title?: string;
    description?: string;
    icon?: string;
    onpress?: () => void;
}

function TypeDetails({ title, description, icon = "file-document", onpress }: TypeDetailsProps) {
    return <TouchableOpacity style={styles.grantBtn} onPress={onpress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
            <View style={styles.iconBg}>
                <MaterialCommunityIcons name={icon as any} size={28} color={colors.primary[600]} />
            </View>
            <View style={{ flex: 1 }}>
                <Text variant='titleMedium' style={{ fontWeight: '600', color: colors.slate[900] }}>{title}</Text>
                <Text variant='bodySmall' style={{ color: colors.slate[400], marginTop: 2 }}>{description}</Text>
            </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.slate[600]} />
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.slate[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBg: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    grantBtn: {
        backgroundColor: colors.slate[50],
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: colors.slate[200],
        gap: 8,
    },
    delinkBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 0.4,
        borderColor: colors.red[300],
        borderRadius: 20,
    },
    delinkText: {
        color: colors.red[600],
        fontSize: 12,
        fontWeight: '600',
    },
    cancelBtn: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelText: {
        color: colors.slate[400],
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    linkedOrgsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    linkedOrgsTitle: { fontSize: 15, fontWeight: '600', color: '#222' },
    viewAll: { color: '#4F8CFF', fontWeight: '500' },
});