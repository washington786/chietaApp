import { OrganisationDto } from "@/core/models/organizationDto";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { LinkedOrganization, OrganizationState } from "../Organization";
import { org_data } from "@/core/types/dummy";

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

            const updatedList = [...existing, newLinkedOrg];
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
        { orgId, status }: { orgId: number; status: 'approved' | 'rejected' },
        { rejectWithValue, getState }
    ) => {
        try {
            const state = getState() as { organization: OrganizationState };
            const currentList = state.organization.linkedOrganizations;

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
    void
>('linkedOrganization/fetchAvailableOrganizations', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return org_data.slice(0, 3);
});