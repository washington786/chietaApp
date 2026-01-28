import { useEffect, useState } from 'react';
import { requestNotificationPermission, getPushNotificationToken } from '@/core/utils/notifications';

interface UsePushNotificationsReturn {
    pushToken: string | null;
    isLoading: boolean;
    error: Error | null;
    hasPermission: boolean;
}

/**
 * Custom hook to manage push notification setup
 * Requests permission and retrieves push token on mount
 */
export function usePushNotifications(): UsePushNotificationsReturn {
    const [pushToken, setPushToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                setIsLoading(true);

                // Request notification permission
                const permissionGranted = await requestNotificationPermission();
                setHasPermission(permissionGranted);

                if (permissionGranted) {
                    // Get push token
                    const token = await getPushNotificationToken();
                    if (token) {
                        setPushToken(token);
                        console.log('Push token retrieved:', token);
                    }
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setError(error);
                console.error('Failed to initialize notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeNotifications();
    }, []);

    return {
        pushToken,
        isLoading,
        error,
        hasPermission,
    };
}
