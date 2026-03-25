export type AppNotification = {
    id: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    timestamp: number;
    read: boolean;
    source: 'local' | 'push' | 'system' | 'reminder';
};

export interface notificationPayload {
    title: string,
    body: string,
    data: string,
    source: string,
    userId: number
}
