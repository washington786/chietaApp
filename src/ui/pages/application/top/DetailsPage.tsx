import { FlatList } from 'react-native'
import React, { useState } from 'react'
import { RDivider, RListLoading } from '@/components/common'
import { Text } from 'react-native-paper'
import { Expandable, TextWrap } from '@/components/modules/application';
import { RouteProp, useRoute } from '@react-navigation/native';
import { showToast } from '@/core';
import { useGetOrgBankQuery, useGetOrganizationByProjectQuery, useGetPersonByIdQuery, useGetOrganizationByIdQuery } from '@/store/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { navigationTypes } from '@/core/types/navigationTypes';

const DetailsPage = () => {

    const route = useRoute<RouteProp<navigationTypes, "applicationDetails">>();

    const { user } = useSelector((state: RootState) => state.auth);

    const { appId, orgId, type } = route.params;

    // Fetch organization bank details
    const { data: bankData, isLoading: bankLoading, error: bankError } = useGetOrgBankQuery(orgId, { skip: !orgId });

    // Fetch organization details (DG: by project, MG: by ID)
    const { data: dgOrgData, isLoading: dgOrgLoading, error: dgOrgError } = useGetOrganizationByProjectQuery(appId, { skip: type !== "dg-app" || !appId });

    const { data: mgOrgData, isLoading: mgOrgLoading, error: mgOrgError } = useGetOrganizationByIdQuery(orgId, { skip: type !== "mg-app" || !orgId });

    // Fetch SDF/Person details
    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByIdQuery(user?.id, { skip: !user?.id });

    // Use appropriate org data based on type
    const orgData = type === "dg-app" ? dgOrgData : mgOrgData;
    const orgLoading = type === "dg-app" ? dgOrgLoading : mgOrgLoading;
    const orgError = type === "dg-app" ? dgOrgError : mgOrgError;

    const [expandSdf, setExpandSdf] = useState(false);
    const [expandOrg, setExpandOrg] = useState(false);
    const [expandBank, setExpandBank] = useState(false);

    // Handle errors
    if (bankError) {
        showToast({ title: "Error Fetching", message: "Failed to load bank details", type: "error", position: "top" });
    }
    if (orgError) {
        showToast({ title: "Error Fetching", message: "Failed to load organization details", type: "error", position: "top" });
    }
    if (sdfError) {
        showToast({ title: "Error Fetching", message: "Failed to load SDF details", type: "error", position: "top" });
    }

    const isLoading = bankLoading || orgLoading || sdfLoading;

    if (isLoading) {
        return <RListLoading count={3} />
    }

    // Extract data from API responses
    const bankDetails = bankData?.result?.bankDetails;
    const bankName = bankData?.result?.bankName;
    const accountType = bankData?.result?.account_Type;

    const organization = orgData?.result?.organisation;

    console.log('====================================');
    console.log(organization);
    console.log('====================================');

    const person = sdfData?.result?.person;

    return (
        <FlatList data={[]}
            style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
            renderItem={null}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{ paddingBottom: 30 }}
            ListFooterComponent={() => {
                return (
                    <>
                        <Expandable title='bank details' isExpanded={expandBank} onPress={() => setExpandBank(!expandBank)}>
                            <TextWrap desc='Bank' title={bankName || 'N/A'} />
                            <TextWrap desc='Branch Name' title={bankDetails?.branch_Name || 'N/A'} />
                            <TextWrap desc='code' title={bankDetails?.branch_Code || 'N/A'} />
                            <TextWrap desc='Account Number' title={bankDetails?.account_Number ? '*'.repeat(bankDetails.account_Number.length - 4) + bankDetails.account_Number.slice(-4) : 'N/A'} />
                            <TextWrap desc='Account holder' title={bankDetails?.account_Holder || 'N/A'} />
                            <TextWrap desc='Type' title={accountType || 'N/A'} />
                        </Expandable>

                        <Expandable title='sdf details' isExpanded={expandSdf} onPress={() => setExpandSdf(!expandSdf)}>
                            <TextWrap desc='Designation' title={person?.designation ? String(person.designation) : 'N/A'} />
                            <TextWrap desc='title' title={person?.title || 'N/A'} />
                            <TextWrap desc='Fullnames' title={`${person?.firstname || ''} ${person?.middlenames || ''} ${person?.lastname || ''}`.trim() || 'N/A'} />
                            <TextWrap desc='ID Number' title={person?.saidnumber || 'N/A'} />
                            <TextWrap desc='Phone' title={person?.phone || 'N/A'} />
                            <TextWrap desc='cell phone' title={person?.cellphone || 'N/A'} />
                            <TextWrap desc='Email' title={person?.email || 'N/A'} />
                            <RDivider />
                            <Text>Demographics</Text>
                            <RDivider />
                            <TextWrap desc='DOB' title={person?.dob ? new Date(person.dob).toLocaleDateString() : 'N/A'} />
                            <TextWrap desc='gender' title={person?.gender || 'N/A'} />
                            <TextWrap desc='Language' title={person?.language || 'N/A'} />
                            <TextWrap desc='Equity' title={person?.equity || 'N/A'} />
                            <TextWrap desc='Nationality' title={person?.nationality || 'N/A'} />
                            <TextWrap desc='citizenship' title={person?.citizenship || 'N/A'} />
                        </Expandable>

                        <Expandable title='organization details' isExpanded={expandOrg} onPress={() => setExpandOrg(!expandOrg)}>
                            <TextWrap desc='SDL No' title={organization?.sdL_No || 'N/A'} />
                            <TextWrap desc='Org No' title={organization?.organisation_Registration_Number || 'N/A'} />
                            <TextWrap desc='trade name' title={organization?.organisation_Trading_Name || 'N/A'} />
                            <TextWrap desc='sic code' title={organization?.siC_Code || 'N/A'} />
                            <TextWrap desc='core business' title={organization?.corE_BUSINESS || 'N/A'} />
                            <TextWrap desc='No of Emps' title={String(organization?.numbeR_OF_EMPLOYEES || 'N/A')} />
                            <TextWrap desc='company size' title={organization?.companY_SIZE || 'N/A'} />
                            <TextWrap desc='BBBEE status' title={organization?.bbbeE_Status || 'N/A'} />
                            <TextWrap desc='BBEE Level' title={String(organization?.bbbeE_LEVEL || 'N/A')} />
                            <TextWrap desc='registration no' title={organization?.organisation_Registration_Number || 'N/A'} />
                            <RDivider />
                            <Text>Organization Contact Details</Text>
                            <RDivider />
                            <TextWrap desc='Phone' title={organization?.organisation_Contact_Phone_Number || 'N/A'} />
                            <TextWrap desc='Cellphone' title={organization?.organisation_Contact_Cell_Number || 'N/A'} />
                            <TextWrap desc='Email' title={organization?.organisation_Contact_Email_Address || 'N/A'} />
                            <RDivider />
                            <Text>CEO Details</Text>
                            <RDivider />
                            <TextWrap desc='Fullname' title={`${organization?.ceO_Name || ''} ${organization?.ceO_Surname || ''}`.trim() || 'N/A'} />
                            <TextWrap desc='Email' title={organization?.ceO_Email || 'N/A'} />
                            <TextWrap desc='Race' title={organization?.ceO_RaceId || 'N/A'} />
                            <TextWrap desc='Gender' title={organization?.ceO_GenderId || 'N/A'} />
                            <Text>Senior Rep Details</Text>
                            <RDivider />
                            <TextWrap desc='Fullname' title={`${organization?.senior_Rep_Name || ''} ${organization?.senior_Rep_Surname || ''}`.trim() || 'N/A'} />
                            <TextWrap desc='Email' title={organization?.senior_Rep_Email || 'N/A'} />
                            <TextWrap desc='Race' title={organization?.senior_Rep_RaceId || 'N/A'} />
                            <TextWrap desc='Gender' title={organization?.senior_Rep_GenderId || 'N/A'} />
                        </Expandable>
                    </>
                )
            }}
        />
    )
}

export default DetailsPage