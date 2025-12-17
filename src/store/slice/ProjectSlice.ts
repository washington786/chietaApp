
import { DiscretionaryGrantApplication } from '@/core/models/DiscretionaryDto';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const fetchDiscretionaryProjects = async (): Promise<DiscretionaryGrantApplication[]> => {
    const { sampleDiscretionaryGrantApplications } = await import('@/core/types/dummy');
    return sampleDiscretionaryGrantApplications;
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
    items: DiscretionaryGrantApplication[];
    filteredItems: DiscretionaryGrantApplication[];
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

const discretionaryGrantsSlice = createSlice({
    name: 'discretionaryGrants',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const q = action.payload.toLowerCase().trim();
            if (!q) {
                state.filteredItems = state.items;
                return;
            }
            state.filteredItems = state.items.filter(item =>
                item.organisation_Name.toLowerCase().includes(q) ||
                item.organisation_Trade_Name.toLowerCase().includes(q) ||
                item.sdl.includes(q) ||
                item.contract_Number.includes(q) ||
                item.province.toLowerCase().includes(q) ||
                item.status.toLowerCase().includes(q) ||
                item.approvalStatus.approvalStatusId
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

export const { setSearchQuery } = discretionaryGrantsSlice.actions;
const discretionaryProjectsReducer = discretionaryGrantsSlice.reducer;
export default discretionaryProjectsReducer;