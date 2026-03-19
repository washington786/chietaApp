import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getPushNotificationToken,
  requestNotificationPermission,
  setupPushNotificationListener,
} from '@/core/utils/notifications';
import { AppNotification } from '@/core/types/notifications';
import { useRegisterPushTokenMutation } from '@/store/api/api';
import { RootState } from '@/store/store';
import { saveNotification } from '@/store/slice/NotificationSlice';
import { useReminderScheduler } from './useReminderScheduler';

type NotificationCenterState = {
  pushToken: string | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: Error | null;
  lastSync: number | null;
};

type NotificationCenterValue = NotificationCenterState & {
  refresh: () => Promise<void>;
};

const NotificationContext = createContext<NotificationCenterValue | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const numericUserId = typeof userId === 'number' ? userId : userId ? Number(userId) : undefined;
  const [registerPushToken] = useRegisterPushTokenMutation();
  const lastRegisteredToken = useRef<string | null>(null);
  const [state, setState] = useState<NotificationCenterState>({
    pushToken: null,
    hasPermission: false,
    isLoading: false,
    error: null,
    lastSync: null,
  });

  useEffect(() => {
    if (!numericUserId) {
      lastRegisteredToken.current = null;
    }
  }, [numericUserId]);

  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        setState(prev => ({
          ...prev,
          hasPermission: false,
          isLoading: false,
          lastSync: Date.now(),
        }));
        return;
      }

      const token = await getPushNotificationToken();
      if (token) {
        setState(prev => ({
          ...prev,
          pushToken: token,
          hasPermission: true,
        }));

        if (numericUserId && lastRegisteredToken.current !== token) {
          try {
            await registerPushToken({ userId: numericUserId, token }).unwrap();
            lastRegisteredToken.current = token;
          } catch (error) {
            console.warn('Failed to register push token', error);
          }
        }
      } else {
        setState(prev => ({ ...prev, hasPermission: true }));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState(prev => ({ ...prev, error }));
      console.error('Notification initialization failed:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false, lastSync: Date.now() }));
    }
  }, [numericUserId, registerPushToken]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!state.hasPermission) {
      return;
    }

    const subscription = setupPushNotificationListener(notification => {
      const data = (notification.request?.content?.data as Record<string, any>) || {};
      const derivedId =
        data?.id ||
        notification.request?.identifier ||
        `push-${Date.now()}`;

      const appNotification: AppNotification = {
        id: String(derivedId),
        title: notification.request?.content?.title || data?.title || 'Notification',
        body: notification.request?.content?.body || data?.body || '',
        data,
        timestamp: Date.now(),
        read: false,
        source: 'push',
      };

      dispatch(saveNotification(appNotification));
    });

    return () => {
      subscription?.remove?.();
    };
  }, [dispatch, state.hasPermission]);

  const contextValue = useMemo<NotificationCenterValue>(
    () => ({
      ...state,
      refresh: initialize,
    }),
    [initialize, state],
  );

  useReminderScheduler({
    enabled: state.hasPermission,
    userId: numericUserId,
  });

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationCenter = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationCenter must be used within a NotificationProvider');
  }
  return context;
};
