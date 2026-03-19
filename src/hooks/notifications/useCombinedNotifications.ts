import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetNotificationsByUserQuery } from '@/store/api/api';
import { RootState } from '@/store/store';
import { markAsRead } from '@/store/slice/NotificationSlice';
import { buildCombinedNotifications, CombinedNotification } from './notificationFeed';
import { showToast } from '@/core';
import { extractApiError, formatApiErrorMessage } from '@/utils/apiError';
import { logger } from '@/utils/logger';

const toNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};

export function useCombinedNotifications(userId?: number) {
    const dispatch = useDispatch();
    const localNotifications = useSelector((state: RootState) => state.notification.items);
    const numericUserId = toNumber(userId);

    const {
        data: serverNotifications,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetNotificationsByUserQuery(numericUserId ?? 0, {
        skip: !numericUserId,
    });

    const parsedError = useMemo(() => (error ? extractApiError(error) : undefined), [error]);
    const lastErrorKey = useRef<string | null>(null);

    useEffect(() => {
        if (!error || !parsedError) {
            lastErrorKey.current = null;
            return;
        }

        const key = `${parsedError.status ?? ''}-${parsedError.message}-${parsedError.details ?? ''}`;
        if (lastErrorKey.current === key) {
            return;
        }

        lastErrorKey.current = key;

        // 500 is a server-side problem — log silently, don't surface to the user
        const isServerError =
            typeof parsedError.status === 'number' && parsedError.status >= 500;

        if (!isServerError) {
            showToast({
                message: formatApiErrorMessage(parsedError),
                title: 'Notifications',
                type: 'error',
                position: 'top',
            });
        }

        logger.warn('Failed to load remote notifications', {
            status: parsedError.status,
            message: parsedError.message,
            userId: numericUserId,
        });
    }, [error, numericUserId, parsedError]);

    const {
        reminders,
        system,
        unreadReminders,
        unreadSystem,
        all,
    } = useMemo(
        () =>
            buildCombinedNotifications(
                localNotifications,
                serverNotifications?.items,
            ),
        [localNotifications, serverNotifications],
    );

    const markLocalNotificationAsRead = useCallback(
        (id: string) => {
            dispatch(markAsRead(id));
        },
        [dispatch],
    );

    return {
        reminders,
        system,
        all,
        unreadReminders,
        unreadSystem,
        unreadTotal: unreadReminders + unreadSystem,
        isLoading: isLoading || isFetching,
        error,
        errorMessage: parsedError ? formatApiErrorMessage(parsedError) : undefined,
        refetch,
        markLocalNotificationAsRead,
    };
}
