export type AppNotification = {
    id: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    timestamp: number;
    read: boolean;
    source: 'local' | 'push';
};