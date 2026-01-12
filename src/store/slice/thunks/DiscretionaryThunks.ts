import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    mockPhysicalAddresses,
    mockPostalAddresses,
    mockDocuments,
    mockGrantPayments,
    mockBankingLists,
    mockBiodataRecords,
} from '@/core/types/dummy';

const API_BASE_URL = 'https://ims.chieta.org.za:22743';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Async Thunk: Load all discretionary grant data
export const fetchDiscretionaryGrantData = createAsyncThunk(
    'discretionaryGrant/fetchAll',
    async (organisationId: string | undefined, thunkAPI: any) => {
        const { rejectWithValue, getState } = thunkAPI;
        try {
            const state = getState();
            const token = state.auth.token;
            const user = state.auth.user;

            if (!token) {
                return rejectWithValue('User not authenticated');
            }

            // If no organisation ID provided, use placeholder
            const orgId = organisationId || user?.organisationId || '0';

            // Fetch active windows parameters
            const windowsResponse = await fetch(
                `${API_BASE_URL}/api/services/app/DiscretionaryWindow/GetActiveWindowsParams`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const windowsData = windowsResponse.ok
                ? await windowsResponse.json()
                : { result: [] };

            // Fetch organisation discretionary projects
            const applicationsResponse = await fetch(
                `${API_BASE_URL}/api/services/app/DiscretionaryProject/GetOrgProjects?OrganisationId=${orgId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const applicationsData = applicationsResponse.ok
                ? await applicationsResponse.json()
                : { result: [] };

            // Ensure applications is always an array
            const applications = Array.isArray(applicationsData.result) ? applicationsData.result : [];

            // Return combined data
            return {
                applications,
                physicalAddresses: mockPhysicalAddresses,
                postalAddresses: mockPostalAddresses,
                documents: mockDocuments,
                payments: mockGrantPayments,
                bankingLists: mockBankingLists,
                biodata: mockBiodataRecords,
                activeWindows: windowsData.result || [],
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to load discretionary grant data'
            );
        }
    }
);