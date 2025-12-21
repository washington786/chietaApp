import type {
    OrganisationPhysicalAddressDto,
    OrganisationPostalAddressDto,
    DocumentDto,
    MandatoryGrantPaymentDto,
    MandatoryGrantBiodataDto,
} from '@/core/models/MandatoryDto';
import { createSlice } from '@reduxjs/toolkit';
import { BankDetail } from '@/core/models/BankDto';
import { DiscretionaryProjectDto } from '../../core/models/DiscretionaryDto'
import { fetchDiscretionaryGrantData } from './thunks/DiscretionaryThunks';

export interface DiscretionaryGrantState {
    // Applications
    applications: DiscretionaryProjectDto[];
    // Addresses
    physicalAddresses: OrganisationPhysicalAddressDto[];
    postalAddresses: OrganisationPostalAddressDto[];
    // Documents
    documents: DocumentDto[];
    // Payments & Banking
    payments: MandatoryGrantPaymentDto[];
    bankingLists: BankDetail[];
    // // Biodata
    biodata: MandatoryGrantBiodataDto[];
    // UI State
    loading: boolean;
    error: string | null;
}

const initialState: DiscretionaryGrantState = {
    applications: [],
    physicalAddresses: [],
    postalAddresses: [],
    documents: [],
    payments: [],
    bankingLists: [],
    biodata: [],
    loading: false,
    error: null,
};

const discretionaryGrantSlice = createSlice({
    name: 'discretionaryGrant',
    initialState,
    reducers: {
        clearDiscretionaryGrantData: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchDiscretionaryGrantData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscretionaryGrantData.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications;
                state.physicalAddresses = action.payload.physicalAddresses;
                state.postalAddresses = action.payload.postalAddresses;
                state.documents = action.payload.documents;
                state.payments = action.payload.payments;
                state.bankingLists = action.payload.bankingLists;
                state.biodata = action.payload.biodata;
            })
            .addCase(fetchDiscretionaryGrantData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearDiscretionaryGrantData } = discretionaryGrantSlice.actions;
const discretionaryGrantReducer = discretionaryGrantSlice.reducer;
export default discretionaryGrantReducer;