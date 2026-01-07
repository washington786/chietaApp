import { OrganisationDto } from "@/core/models/organizationDto";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { LinkedOrganization } from "../Organization";
import { org_data } from "@/core/types/dummy";

export const loadAllOrganizations = createAsyncThunk<
    OrganisationDto[],
    { first: number; rows: number },
    { state: any }
>('organization/loadAllOrganizations', async ({ first, rows }, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            return rejectWithValue('Authentication token not found');
        }

        const response = await fetch(`https://ims.chieta.org.za:22743/api/services/app/Organisation/getAll?first=${first}&rows=${rows}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return org_data;
        }

        const data = await response.json();

        // Parse the API response structure: result.items[].organisation
        if (data?.result?.items && Array.isArray(data.result.items)) {
            const organizations = data.result.items.map((item: any) => {
                const org = item.organisation;
                // Map snake_case API fields to camelCase OrganisationDto fields
                return {
                    sdlNo: org.sdL_No,
                    setaId: org.setA_Id,
                    seta: org.seta,
                    sicCode: org.siC_Code,
                    organisationRegistrationNumber: org.organisation_Registration_Number,
                    organisationName: org.organisation_Name,
                    organisationTradingName: org.organisation_Trading_Name,
                    organisationFaxNumber: org.organisation_Fax_Number,
                    organisationContactName: org.organisation_Contact_Name,
                    organisationContactEmailAddress: org.organisation_Contact_Email_Address,
                    organisationContactPhoneNumber: org.organisation_Contact_Phone_Number,
                    organisationContactCellNumber: org.organisation_Contact_Cell_Number,
                    companySize: org.companY_SIZE,
                    numberOfEmployees: org.numbeR_OF_EMPLOYEES,
                    typeOfEntity: org.typE_OF_ENTITY,
                    coreBusiness: org.corE_BUSINESS,
                    parentSdlNumber: org.parenT_SDL_NUMBER,
                    bbbeeStatus: org.bbbeE_Status,
                    bbbeeLevel: org.bbbeE_LEVEL,
                    dateBusinessCommenced: org.datebusinesscommenced,
                    status: org.status,
                    exemptionCode: org.exmptioncode,
                    chamber: org.chamber,
                    ceoName: org.ceO_Name,
                    ceoSurname: org.ceO_Surname,
                    ceoEmail: org.ceO_Email,
                    ceoRaceId: org.ceO_RaceId,
                    ceoGenderId: org.ceO_GenderId,
                    seniorRepName: org.senior_Rep_Name,
                    seniorRepSurname: org.senior_Rep_Surname,
                    seniorRepEmail: org.senior_Rep_Email,
                    seniorRepRaceId: org.senior_Rep_RaceId,
                    seniorRepGenderId: org.senior_Rep_GenderId,
                    id: org.id,
                } as OrganisationDto;
            });
            return organizations;
        }

        return org_data;
    } catch (error: any) {
        return org_data;
    }
});

export const linkOrganizationAsync = createAsyncThunk(
    'organization/linkOrganizationAsync',
    async (org: OrganisationDto, { rejectWithValue }) => {
        try {
            const stored = await SecureStore.getItemAsync('LINKED_ORGANIZATIONS');
            const existing: LinkedOrganization[] = stored ? JSON.parse(stored) : [];

            const alreadyLinked = existing.some(item => item.id === org.id);
            if (alreadyLinked) {
                return rejectWithValue('Organization already linked');
            }

            const newLinkedOrg: LinkedOrganization = {
                ...org,
                isUploadedAppointmentLetter: false,
                approvalStatus: 'pending',
            };

            const updatedList = [newLinkedOrg, ...existing];
            await SecureStore.setItemAsync('LINKED_ORGANIZATIONS', JSON.stringify(updatedList));
            return updatedList;
        } catch (error) {
            return rejectWithValue('Failed to link organization');
        }
    }
);

export const removeLinkedOrganizationAsync = createAsyncThunk(
    'organization/removeLinkedOrganizationAsync',
    async (orgId: number, { rejectWithValue }) => {
        try {
            const stored = await SecureStore.getItemAsync('LINKED_ORGANIZATIONS');
            const existing: LinkedOrganization[] = stored ? JSON.parse(stored) : [];

            const orgExists = existing.some(item => item.id === orgId);
            if (!orgExists) {
                return rejectWithValue('Organization not found');
            }

            const updatedList = existing.filter(item => item.id !== orgId);
            await SecureStore.setItemAsync('LINKED_ORGANIZATIONS', JSON.stringify(updatedList));

            return updatedList;
        } catch (error) {
            console.error('Failed to remove linked organization:', error);
            return rejectWithValue('Failed to remove organization');
        }
    }
);

export const loadLinkedOrganizationsAsync = createAsyncThunk(
    'organization/loadLinkedOrganizationsAsync',
    async (_, { rejectWithValue }) => {
        try {
            const stored = await SecureStore.getItemAsync('LINKED_ORGANIZATIONS');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return rejectWithValue('Failed to load linked organizations');
        }
    }
);

export const updateAppointmentLetterStatus = createAsyncThunk(
    'organization/updateAppointmentLetterStatus',
    async (
        { orgId, isUploaded }: { orgId: number; isUploaded: boolean },
        { rejectWithValue }
    ) => {
        try {
            const stored = await SecureStore.getItemAsync('LINKED_ORGANIZATIONS');
            const currentList: LinkedOrganization[] = stored ? JSON.parse(stored) : [];

            const orgExists = currentList.some(org => org.id === orgId);
            if (!orgExists) {
                return rejectWithValue('Organization not found');
            }

            const updatedList = currentList.map(org =>
                org.id === orgId
                    ? { ...org, isUploadedAppointmentLetter: isUploaded }
                    : org
            );

            await SecureStore.setItemAsync('LINKED_ORGANIZATIONS', JSON.stringify(updatedList));
            return updatedList;
        } catch (error) {
            return rejectWithValue('Failed to update appointment letter status');
        }
    }
);

export const updateApprovalStatus = createAsyncThunk(
    'organization/updateApprovalStatus',
    async (
        { orgId, status }: { orgId: number; status: 'approved' | 'rejected' | 'cancelled' },
        { rejectWithValue }
    ) => {
        try {
            const stored = await SecureStore.getItemAsync('LINKED_ORGANIZATIONS');
            const currentList: LinkedOrganization[] = stored ? JSON.parse(stored) : [];

            const orgExists = currentList.some(org => org.id === orgId);

            if (!orgExists) {
                return rejectWithValue('Organization not found');
            }

            const updatedList = currentList.map(org =>
                org.id === orgId ? { ...org, approvalStatus: status } : org
            );

            await SecureStore.setItemAsync('LINKED_ORGANIZATIONS', JSON.stringify(updatedList));
            return updatedList;
        } catch (error) {
            return rejectWithValue('Failed to update approval status');
        }
    }
);

export const loadOrganizations = createAsyncThunk<
    OrganisationDto[],
    string | undefined,
    { state: any }
>('linkedOrganization/fetchAvailableOrganizations', async (userId, { rejectWithValue, getState }) => {
    try {
        if (!userId) {
            return rejectWithValue('User ID is required');
        }

        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            return rejectWithValue('Authentication token not found');
        }

        const response = await fetch(`https://ims.chieta.org.za:22743/api/services/app/Organisation/GetSdfLinked?userid=${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return org_data;
        }

        const data = await response.json();

        // Parse the API response structure: result.items[].organisation
        if (data?.result?.items && Array.isArray(data.result.items)) {
            const organizations = data.result.items.map((item: any) => {
                const org = item.organisation;
                // Map snake_case API fields to camelCase OrganisationDto fields
                return {
                    sdlNo: org.sdL_No,
                    setaId: org.setA_Id,
                    seta: org.seta,
                    sicCode: org.siC_Code,
                    organisationRegistrationNumber: org.organisation_Registration_Number,
                    organisationName: org.organisation_Name,
                    organisationTradingName: org.organisation_Trading_Name,
                    organisationFaxNumber: org.organisation_Fax_Number,
                    organisationContactName: org.organisation_Contact_Name,
                    organisationContactEmailAddress: org.organisation_Contact_Email_Address,
                    organisationContactPhoneNumber: org.organisation_Contact_Phone_Number,
                    organisationContactCellNumber: org.organisation_Contact_Cell_Number,
                    companySize: org.companY_SIZE,
                    numberOfEmployees: org.numbeR_OF_EMPLOYEES,
                    typeOfEntity: org.typE_OF_ENTITY,
                    coreBusiness: org.corE_BUSINESS,
                    parentSdlNumber: org.parenT_SDL_NUMBER,
                    bbbeeStatus: org.bbbeE_Status,
                    bbbeeLevel: org.bbbeE_LEVEL,
                    dateBusinessCommenced: org.datebusinesscommenced,
                    status: org.status,
                    exemptionCode: org.exmptioncode,
                    chamber: org.chamber,
                    ceoName: org.ceO_Name,
                    ceoSurname: org.ceO_Surname,
                    ceoEmail: org.ceO_Email,
                    ceoRaceId: org.ceO_RaceId,
                    ceoGenderId: org.ceO_GenderId,
                    seniorRepName: org.senior_Rep_Name,
                    seniorRepSurname: org.senior_Rep_Surname,
                    seniorRepEmail: org.senior_Rep_Email,
                    seniorRepRaceId: org.senior_Rep_RaceId,
                    seniorRepGenderId: org.senior_Rep_GenderId,
                    id: org.id,
                } as OrganisationDto;
            });
            return organizations;
        }

        // Fallback if response structure is unexpected
        return org_data;
    } catch (error: any) {
        return org_data;
    }
});