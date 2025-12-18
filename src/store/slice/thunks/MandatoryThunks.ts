import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    mockMandatoryApplications,
    mockPhysicalAddresses,
    mockPostalAddresses,
    mockDocuments,
    mockGrantPayments,
    mockBankingLists,
    mockBiodataRecords,
} from '@/core/types/dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Async Thunk: Load all mandatory grant data
export const fetchMandatoryGrantData = createAsyncThunk(
    'mandatoryGrant/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await delay(800);

            // const applications = await api.getApplications();
            // const addresses = await api.getAddresses();

            // For now: return mock data
            return {
                applications: mockMandatoryApplications,
                physicalAddresses: mockPhysicalAddresses,
                postalAddresses: mockPostalAddresses,
                documents: mockDocuments,
                payments: mockGrantPayments,
                bankingLists: mockBankingLists,
                biodata: mockBiodataRecords,
            };
        } catch (error) {
            return rejectWithValue('Failed to load mandatory grant data');
        }
    }
);