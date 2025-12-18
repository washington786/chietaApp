import type {
    MandatoryApplicationDto,
    OrganisationPhysicalAddressDto,
    OrganisationPostalAddressDto,
    DocumentDto,
    MandatoryGrantPaymentDto,
    MandatoryBankingListDto,
    MandatoryGrantBiodataDto,
} from '@/core/models/MandatoryDto';
import { createSlice } from '@reduxjs/toolkit';
import { fetchMandatoryGrantData } from './thunks/MandatoryThunks';

export interface MandatoryGrantState {
    // Applications
    applications: MandatoryApplicationDto[];
    // Addresses
    physicalAddresses: OrganisationPhysicalAddressDto[];
    postalAddresses: OrganisationPostalAddressDto[];
    // Documents
    documents: DocumentDto[];
    // Payments & Banking
    payments: MandatoryGrantPaymentDto[];
    bankingLists: MandatoryBankingListDto[];
    // Biodata
    biodata: MandatoryGrantBiodataDto[];
    // UI State
    loading: boolean;
    error: string | null;
}

const initialState: MandatoryGrantState = {
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

const mandatoryGrantSlice = createSlice({
    name: 'mandatoryGrant',
    initialState,
    reducers: {
        clearMandatoryGrantData: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchMandatoryGrantData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMandatoryGrantData.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications;
                state.physicalAddresses = action.payload.physicalAddresses;
                state.postalAddresses = action.payload.postalAddresses;
                state.documents = action.payload.documents;
                state.payments = action.payload.payments;
                state.bankingLists = action.payload.bankingLists;
                state.biodata = action.payload.biodata;
            })
            .addCase(fetchMandatoryGrantData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMandatoryGrantData } = mandatoryGrantSlice.actions;
const mandatoryGrantReducer = mandatoryGrantSlice.reducer;
export default mandatoryGrantReducer;