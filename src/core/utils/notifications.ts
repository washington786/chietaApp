import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import colors from '@/config/colors';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
        name: 'Default Channel',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.primary[950],
        sound: "default",
    });
}

/**
 * Request notification permissions
 * Call this once during onboarding or app initialization
 */
export async function requestNotificationPermission() {
    if (!Device.isDevice) {
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    return true;
}

/**
 * Get push notification token for the device
 */
export async function getPushNotificationToken(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn('Push notifications not available on simulator');
        return null;
    }

    try {
        const token = await Notifications.getExpoPushTokenAsync();
        return token.data;
    } catch (error) {
        console.error('Failed to get push notification token:', error);
        return null;
    }
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification({
    title,
    body,
    data,
    seconds = 2,
    channelId = 'default',
}: {
    title: string;
    body: string;
    data?: Record<string, any>;
    seconds?: number;
    channelId?: string;
}) {
    try {
        const trigger: Notifications.NotificationTriggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, seconds),
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: data || {},
                sound: true,
                badge: 1,
                ...(Platform.OS === 'android' && { channelId }),
            },
            trigger,
        });

        return notificationId;
    } catch (error) {
        console.error('Failed to schedule notification:', error);
        throw error;
    }
}

/**
 * Set up listener for incoming push notifications
 */
export function setupPushNotificationListener(callback?: (notification: Notifications.Notification) => void) {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        if (callback) {
            callback(response.notification);
        }
    });

    return subscription;
}