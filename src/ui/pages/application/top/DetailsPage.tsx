import { FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { RListLoading } from '@/components/common'
import { Text } from 'react-native-paper'
import { Expandable } from '@/components/modules/application';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useGetOrgBankQuery, useGetOrganizationByProjectQuery, useGetOrganizationByIdQuery, useGetPersonByUserIdQuery } from '@/store/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { navigationTypes } from '@/core/types/navigationTypes';
import { getDesignation } from '@/core/utils/designation';
import colors from '@/config/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mask }: { label: string; value?: string | null; mask?: boolean }) {
    const display = !value || value === 'N/A' ? '—' : value;
    const masked = mask && value && value.length > 4
        ? '•'.repeat(value.length - 4) + value.slice(-4)
        : display;
    return (
        <View style={rowStyles.row}>
            <Text style={rowStyles.label}>{label}</Text>
            <Text style={rowStyles.value} numberOfLines={2}>{mask ? masked : display}</Text>
        </View>
    );
}

function SectionDivider({ title }: { title: string }) {
    return (
        <View style={rowStyles.dividerRow}>
            <View style={rowStyles.dividerLine} />
            <Text style={rowStyles.dividerText}>{title}</Text>
            <View style={rowStyles.dividerLine} />
        </View>
    );
}

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    label: {
        fontSize: 12,
        color: colors.slate[400],
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        flex: 1,
        fontWeight: '500',
    },
    value: {
        fontSize: 13,
        color: colors.gray[800],
        fontWeight: '600',
        flex: 1.4,
        textAlign: 'right',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 4,
        gap: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray[200],
    },
    dividerText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.slate[400],
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
});

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, label, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }) {
    return (
        <View style={headerStyles.wrap}>
            <View style={[headerStyles.iconWrap, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={[headerStyles.label, { color }]}>{label}</Text>
        </View>
    );
}

const headerStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    iconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
});


const DetailsPage = () => {

    const route = useRoute<RouteProp<navigationTypes, "applicationDetails">>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { appId, orgId, type } = route.params;

    const { data: bankData, isLoading: bankLoading } = useGetOrgBankQuery(orgId, { skip: !orgId });
    const { data: dgOrgData, isLoading: dgOrgLoading } = useGetOrganizationByProjectQuery(appId, { skip: type !== "dg-app" || !appId });
    const { data: mgOrgData, isLoading: mgOrgLoading } = useGetOrganizationByIdQuery(orgId, { skip: type !== "mg-app" || !orgId });
    const { data: sdfData, isLoading: sdfLoading } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const orgLoading = type === "dg-app" ? dgOrgLoading : mgOrgLoading;

    // Normalize org data to camelCase regardless of source:
    // getOrganizationByProject (dg-app) returns raw snake_case inside result.organisation
    // getOrganizationById (mg-app) has transformResponse → already flat camelCase
    const organization = React.useMemo(() => {
        if (type === "dg-app") {
            const raw = dgOrgData?.result?.organisation;
            if (!raw) return null;
            return {
                sdlNo: raw.sdL_No,
                organisationRegistrationNumber: raw.organisation_Registration_Number,
                organisationTradingName: raw.organisation_Trading_Name,
                sicCode: raw.siC_Code,
                coreBusiness: raw.corE_BUSINESS,
                numberOfEmployees: raw.numbeR_OF_EMPLOYEES,
                companySize: raw.companY_SIZE,
                bbbeeStatus: raw.bbbeE_Status,
                bbbeeLevel: raw.bbbeE_LEVEL,
                organisationContactPhoneNumber: raw.organisation_Contact_Phone_Number,
                organisationContactCellNumber: raw.organisation_Contact_Cell_Number,
                organisationContactEmailAddress: raw.organisation_Contact_Email_Address,
                ceoName: raw.ceO_Name,
                ceoSurname: raw.ceO_Surname,
                ceoEmail: raw.ceO_Email,
                ceoRaceId: raw.ceO_RaceId,
                ceoGenderId: raw.ceO_GenderId,
                seniorRepName: raw.senior_Rep_Name,
                seniorRepSurname: raw.senior_Rep_Surname,
                seniorRepEmail: raw.senior_Rep_Email,
                seniorRepRaceId: raw.senior_Rep_RaceId,
                seniorRepGenderId: raw.senior_Rep_GenderId,
            };
        }
        return mgOrgData ?? null;
    }, [type, dgOrgData, mgOrgData]);

    const [expandSdf, setExpandSdf] = useState(true);
    const [expandOrg, setExpandOrg] = useState(false);
    const [expandBank, setExpandBank] = useState(false);

    if (bankLoading || orgLoading || sdfLoading) {
        return <RListLoading count={4} />;
    }

    const person = sdfData?.result?.person;

    return (
        <FlatList
            data={[]}
            style={styles.con}
            renderItem={null}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={styles.footer}
            ListFooterComponent={() => (
                <>
                    {/* ── SDF Details ───────────────────────────────────────── */}
                    <Expandable
                        title='SDF Details'
                        isExpanded={expandSdf}
                        onPress={() => setExpandSdf(!expandSdf)}
                    >
                        <SectionHeader icon="person-circle-outline" label="Identity" color={colors.primary[600]} />
                        <InfoRow label="Designation" value={person?.designation ? getDesignation(person.designation) : undefined} />
                        <InfoRow label="Title" value={person?.title} />
                        <InfoRow label="Full Name" value={`${person?.firstname || ''} ${person?.middlenames || ''} ${person?.lastname || ''}`.trim() || undefined} />
                        <InfoRow label="ID Number" value={person?.saidnumber} mask />
                        <InfoRow label="Phone" value={person?.phone} />
                        <InfoRow label="Cell" value={person?.cellphone} />
                        <InfoRow label="Email" value={person?.email} />

                        <SectionDivider title="Demographics" />
                        <SectionHeader icon="stats-chart-outline" label="Personal Info" color={colors.blue[600]} />
                        <InfoRow label="DOB" value={person?.dob ? new Date(person.dob).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined} />
                        <InfoRow label="Gender" value={person?.gender} />
                        <InfoRow label="Language" value={person?.language} />
                        <InfoRow label="Equity" value={person?.equity} />
                        <InfoRow label="Nationality" value={person?.nationality} />
                        <InfoRow label="Citizenship" value={person?.citizenship} />
                    </Expandable>

                    {/* ── Organisation Details ──────────────────────────────── */}
                    <Expandable
                        title='Organisation Details'
                        isExpanded={expandOrg}
                        onPress={() => setExpandOrg(!expandOrg)}
                    >
                        <SectionHeader icon="business-outline" label="Registration" color={colors.secondary[600]} />
                        <InfoRow label="SDL No" value={organization?.sdlNo} />
                        <InfoRow label="Reg No" value={organization?.organisationRegistrationNumber} />
                        <InfoRow label="Trade Name" value={organization?.organisationTradingName} />
                        <InfoRow label="SIC Code" value={organization?.sicCode} />
                        <InfoRow label="Core Business" value={organization?.coreBusiness} />
                        <InfoRow label="Employees" value={organization?.numberOfEmployees != null ? String(organization.numberOfEmployees) : undefined} />
                        <InfoRow label="Company Size" value={organization?.companySize} />
                        <InfoRow label="BBBEE Status" value={organization?.bbbeeStatus} />
                        <InfoRow label="BBBEE Level" value={organization?.bbbeeLevel != null ? String(organization.bbbeeLevel) : undefined} />

                        <SectionDivider title="Contact Details" />
                        <SectionHeader icon="call-outline" label="Organisation Contact" color={colors.blue[600]} />
                        <InfoRow label="Phone" value={organization?.organisationContactPhoneNumber} />
                        <InfoRow label="Cell" value={organization?.organisationContactCellNumber} />
                        <InfoRow label="Email" value={organization?.organisationContactEmailAddress} />

                        <SectionDivider title="CEO Details" />
                        <SectionHeader icon="ribbon-outline" label="CEO" color={colors.violet[600]} />
                        <InfoRow label="Full Name" value={`${organization?.ceoName || ''} ${organization?.ceoSurname || ''}`.trim() || undefined} />
                        <InfoRow label="Email" value={organization?.ceoEmail} />
                        <InfoRow label="Race" value={organization?.ceoRaceId} />
                        <InfoRow label="Gender" value={organization?.ceoGenderId} />

                        <SectionDivider title="Senior Representative" />
                        <SectionHeader icon="people-outline" label="Senior Rep" color={colors.emerald[600]} />
                        <InfoRow label="Full Name" value={`${organization?.seniorRepName || ''} ${organization?.seniorRepSurname || ''}`.trim() || undefined} />
                        <InfoRow label="Email" value={organization?.seniorRepEmail} />
                        <InfoRow label="Race" value={organization?.seniorRepRaceId} />
                        <InfoRow label="Gender" value={organization?.seniorRepGenderId} />
                    </Expandable>

                    {/* ── Bank Details ──────────────────────────────────────── */}
                    <Expandable
                        title='Bank Details'
                        isExpanded={expandBank}
                        onPress={() => setExpandBank(!expandBank)}
                    >
                        <SectionHeader icon="card-outline" label="Banking Information" color={colors.emerald[600]} />
                        <InfoRow label="Bank" value={bankData?.bankName} />
                        <InfoRow label="Branch Name" value={bankData?.branchName} />
                        <InfoRow label="Branch Code" value={bankData?.branchCode} />
                        <InfoRow label="Account No" value={bankData?.accountNumber} mask />
                        <InfoRow label="Account Holder" value={bankData?.accountHolder} />
                        <InfoRow label="Account Type" value={bankData?.accountType} />
                    </Expandable>
                </>
            )}
        />
    );
}

export default DetailsPage;

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        flex: 1,
        flexGrow: 1,
        backgroundColor: colors.gray[50],
    },
    footer: { paddingBottom: 30 },
});