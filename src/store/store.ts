import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setupListeners } from '@reduxjs/toolkit/query'
import { AppState, AppStateStatus } from 'react-native'
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
                warnAfter: 128,
            },
        }).concat(api.middleware),
})

setupListeners(store.dispatch, (dispatch, actions) => {
    // Bridge React Native AppState to RTK Query's focus/blur system.
    // When the app returns to the foreground RTK Query will re-run any
    // query that has `refetchOnFocus: true` configured at call-site level.
    let current: AppStateStatus = AppState.currentState

    const subscription = AppState.addEventListener('change', (next: AppStateStatus) => {
        const wasInactive = current.match(/inactive|background/)
        const isNowActive = next === 'active'
        const isNowInactive = next.match(/inactive|background/)

        if (wasInactive && isNowActive) {
            dispatch(actions.onFocus())
            dispatch(actions.onOnline())
        }
        if (!wasInactive && isNowInactive) {
            dispatch(actions.onFocusLost())
        }

        current = next
    })

    return () => subscription.remove()
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch