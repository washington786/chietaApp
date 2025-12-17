
import { DiscretionaryProjectDetailsApproval } from '@/core/models/DiscretionaryDto';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const fetchDiscretionaryProjects = async (): Promise<DiscretionaryProjectDetailsApproval[]> => {
    const { mockDiscretionaryProjectDetailsApprovals } = await import('@/core/types/dummy');
    return mockDiscretionaryProjectDetailsApprovals;
};

// Async Thunk
export const fetchDiscretionaryProjectsAsync = createAsyncThunk(
    'discretionaryProjects/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchDiscretionaryProjects();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to load discretionary projects');
        }
    }
);

// State
export interface DiscretionaryProjectsState {
    items: DiscretionaryProjectDetailsApproval[];
    filteredItems: DiscretionaryProjectDetailsApproval[];
    searchQuery: string;
    loading: boolean;
    error: string | null;
}

const initialState: DiscretionaryProjectsState = {
    items: [],
    filteredItems: [],
    searchQuery: '',
    loading: false,
    error: null,
};

// Slice
const discretionaryProjectsSlice = createSlice({
    name: 'discretionaryProjects',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const query = action.payload.toLowerCase().trim();
            if (!query) {
                state.filteredItems = state.items;
                return;
            }
            state.filteredItems = state.items.filter(
                (item) =>
                    (item.reason && item.reason.toLowerCase().includes(query)) ||
                    (item.province && item.province.toLowerCase().includes(query)) ||
                    (item.municipality && item.municipality.toLowerCase().includes(query)) ||
                    (item.contractNumber && item.contractNumber.includes(query)) ||
                    (item.approvalStatus && item.approvalStatus.toLowerCase().includes(query))
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscretionaryProjectsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscretionaryProjectsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(fetchDiscretionaryProjectsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSearchQuery } = discretionaryProjectsSlice.actions;
export default discretionaryProjectsSlice.reducer;