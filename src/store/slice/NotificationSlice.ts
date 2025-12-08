import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification } from '@/core/types/notifications';

interface NotificationState {
    items: AppNotification[];
}

const initialState: NotificationState = {
    items: [],
};

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        saveNotification: (state, action: PayloadAction<AppNotification>) => {
            if (!state.items.some(n => n.id === action.payload.id)) {
                state.items.unshift(action.payload);
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const item = state.items.find(n => n.id === action.payload);
            if (item) item.read = true;
        },
    },
});

export const { saveNotification, markAsRead } = notificationSlice.actions;
const notificationReducer = notificationSlice.reducer;
export default notificationReducer;