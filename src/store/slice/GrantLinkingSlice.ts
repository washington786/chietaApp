import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto';

export interface DiscretionaryLinkingState {
    linkedProjects: DiscretionaryProjectDto[];
    pendingLinks: number[];
    error: string | null;
    success: string | null;
}

const initialState: DiscretionaryLinkingState = {
    linkedProjects: [],
    pendingLinks: [],
    error: null,
    success: null,
};

export const linkDiscretionaryProject = createAsyncThunk(
    'discretionaryLinking/linkProject',
    async (projectId: number, { rejectWithValue }) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // In real app: await api.linkProject(projectId);
            return projectId;
        } catch (error) {
            return rejectWithValue('Failed to link project');
        }
    }
);

const discretionaryLinkingSlice = createSlice({
    name: 'discretionaryLinking',
    initialState,
    reducers: {
        clearSuccess: (state) => {
            state.success = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(linkDiscretionaryProject.pending, (state, action) => {
                state.pendingLinks.push(action.meta.arg);
                state.error = null;
                state.success = null;
            })
            .addCase(linkDiscretionaryProject.fulfilled, (state, action) => {
                state.pendingLinks = state.pendingLinks.filter(id => id !== action.payload);
                state.success = `Project ${action.payload} linked successfully`;
            })
            .addCase(linkDiscretionaryProject.rejected, (state, action) => {
                state.pendingLinks = state.pendingLinks.filter(id => id !== action.meta.arg);
                state.error = action.payload as string;
            });
    },
});

export const { clearSuccess, clearError } = discretionaryLinkingSlice.actions;
export default discretionaryLinkingSlice.reducer;