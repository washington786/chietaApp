import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    mockPhysicalAddresses,
    mockPostalAddresses,
    mockDocuments,
    mockGrantPayments,
    mockBankingLists,
    mockBiodataRecords,
    mockDiscretionaryProjects,
    mockAllDiscretionaryProjects
} from '@/core/types/dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Async Thunk: Load all mandatory grant data
export const fetchDiscretionaryGrantData = createAsyncThunk(
    'discretionaryGrant/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await delay(800);

            // const applications = await api.getApplications();
            // const addresses = await api.getAddresses();

            const linkedProjects = mockDiscretionaryProjects.map(p => ({
                ...p,
                isLinked: true,
            }));

            const allProjects = mockAllDiscretionaryProjects.map(p => {
                const isLinked = linkedProjects.some(lp => lp.id === p.id);
                return { ...p, isLinked: isLinked };
            });

            // For now: return mock data
            return {
                applications: allProjects,
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