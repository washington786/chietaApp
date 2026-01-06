import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api/api';
import AuthReducer from './slice/AuthSlice';
import PasswordResetReducer from './slice/PasswordResetSlice';
import notificationReducer from './slice/NotificationSlice';
import organizationReducer from './slice/Organization';
import discretionaryProjectsReducer from './slice/ProjectSlice';
import mandatoryGrantReducer from './slice/MandatorySlice';
import discretionaryGrantReducer from './slice/DiscretionarySlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}
const persistNotificationConfig = {
    key: 'notification',
    storage: AsyncStorage,
}

const rootReducer = {
    auth: persistReducer(persistConfig, AuthReducer),
    passwordReset: PasswordResetReducer,
    notification: persistReducer(persistNotificationConfig, notificationReducer),
    linkedOrganization: organizationReducer,
    discretionaryProjects: discretionaryProjectsReducer,
    discretionaryGrant: discretionaryGrantReducer,
    mandatoryGrant: mandatoryGrantReducer,
    [api.reducerPath]: api.reducer,

}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(api.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch