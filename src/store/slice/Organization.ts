import { OrganisationDto } from '@/core/models/organizationDto';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

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
        { rejectWithValue, getState }
    ) => {
        try {
            const state = getState() as { organization: OrganizationState };
            const currentList = state.organization.linkedOrganizations;

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
export interface LinkedOrganization extends OrganisationDto {
    isUploadedAppointmentLetter: boolean;
    approvalStatus: 'submitted' | 'pending' | 'approved' | 'rejected';
}

export interface OrganizationState {
    organizations: OrganisationDto[];
    filteredOrganizations: OrganisationDto[];
    linkedOrganizations: LinkedOrganization[];
    searchQuery: string;
    loading: boolean;
    error: string | null;
}

export const initialOrganizationState: OrganizationState = {
    organizations: [],
    filteredOrganizations: [],
    searchQuery: '',
    loading: false,
    error: null,
    linkedOrganizations: [],
};


const organizationSlice = createSlice({
    name: 'organization',
    initialState: initialOrganizationState,
    reducers: {
        setAllOrganizations: (state, action: PayloadAction<OrganisationDto[]>) => {
            state.organizations = action.payload;
            state.filteredOrganizations = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            const query = action.payload.toLowerCase();
            state.searchQuery = action.payload;
            state.filteredOrganizations = state.organizations.filter(
                (org) =>
                    org.organisationName.toLowerCase().includes(query) ||
                    org.organisationTradingName.toLowerCase().includes(query) ||
                    org.organisationRegistrationNumber.includes(query)
            );
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearLinkedOrganizations: (state) => {
            state.linkedOrganizations = [];
        },
    },
    extraReducers: (builder) => {
        // Load linked orgs
        builder
            .addCase(loadLinkedOrganizationsAsync.fulfilled, (state, action) => {
                state.linkedOrganizations = action.payload;
                state.loading = false;
            })
            .addCase(loadLinkedOrganizationsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadLinkedOrganizationsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Link org
            .addCase(linkOrganizationAsync.fulfilled, (state, action) => {
                state.linkedOrganizations = action.payload;
                state.loading = false;
            })
            .addCase(linkOrganizationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(linkOrganizationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update appointment letter
            .addCase(updateAppointmentLetterStatus.fulfilled, (state, action) => {
                state.linkedOrganizations = action.payload;
            })

            // Update approval status
            .addCase(updateApprovalStatus.fulfilled, (state, action) => {
                state.linkedOrganizations = action.payload;
            });
    },
});

export const {
    setAllOrganizations,
    setSearchQuery,
    setLoading,
    setError,
    clearLinkedOrganizations,
} = organizationSlice.actions;

const organizationReducer = organizationSlice.reducer;
export default organizationReducer;