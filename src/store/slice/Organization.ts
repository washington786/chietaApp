import { OrganisationDto } from '@/core/models/organizationDto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { linkOrganizationAsync, loadLinkedOrganizationsAsync, loadOrganizations, loadAllOrganizations, removeLinkedOrganizationAsync, updateAppointmentLetterStatus, updateApprovalStatus } from './thunks/OrganizationThunks';

export interface LinkedOrganization extends OrganisationDto {
    isUploadedAppointmentLetter: boolean;
    approvalStatus: 'submitted' | 'pending' | 'approved' | 'rejected' | 'cancelled';
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

const includesText = (value: unknown, query: string) =>
    String(value ?? '').toLowerCase().includes(query);

const mergeOrganizationsById = (
    existing: OrganisationDto[],
    incoming: OrganisationDto[]
) => {
    const orgMap = new Map<number, OrganisationDto>();

    existing.forEach((org) => {
        orgMap.set(org.id, org);
    });

    incoming.forEach((org) => {
        orgMap.set(org.id, org);
    });

    return Array.from(orgMap.values());
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
                    includesText(org.organisationName, query) ||
                    includesText(org.organisationTradingName, query) ||
                    includesText(org.organisationRegistrationNumber, query)
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
        builder
            // Load linked orgs
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
            })

            // Load organizations
            .addCase(loadOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadOrganizations.fulfilled, (state, action) => {
                state.organizations = action.payload;
                state.filteredOrganizations = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loadOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to load available organizations';
            })

            // Load all organizations (paginated)
            .addCase(loadAllOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadAllOrganizations.fulfilled, (state, action) => {
                const isFirstPage = action.meta.arg.first === 0;
                state.organizations = isFirstPage
                    ? mergeOrganizationsById([], action.payload)
                    : mergeOrganizationsById(state.organizations, action.payload);
                // Re-apply search filter if there's an active search query
                if (state.searchQuery.trim()) {
                    const query = state.searchQuery.toLowerCase();
                    state.filteredOrganizations = state.organizations.filter(
                        (org) =>
                            includesText(org.organisationName, query) ||
                            includesText(org.organisationTradingName, query) ||
                            includesText(org.organisationRegistrationNumber, query)
                    );
                } else {
                    // No search query, show all organizations
                    state.filteredOrganizations = state.organizations;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(loadAllOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to load organizations';
            })

            //remove
            .addCase(removeLinkedOrganizationAsync.fulfilled, (state, action) => {
                state.linkedOrganizations = action.payload;
            })
            .addCase(removeLinkedOrganizationAsync.rejected, (state, action) => {
                state.error = action.payload as string || 'Unknown error';
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
