import dayjs, { Dayjs } from 'dayjs';

export type PeriodStatus = 'upcoming' | 'active' | 'closed';

export interface PeriodInfo {
    status: PeriodStatus;
    daysRemaining: number | null;
    totalDurationDays: number;
    isOpen: boolean;
    isClosed: boolean;
}

/**
 * Calculates the status and countdown between open and close dates.
 * @param openDate - When the period opens (Dayjs or Date string)
 * @param closeDate - When the period closes (Dayjs or Date string)
 * @returns PeriodInfo
 */
export const getPeriodInfo = (openDate: Dayjs | string, closeDate: Dayjs | string): PeriodInfo => {
    const now = dayjs();
    const open = dayjs(openDate);
    const close = dayjs(closeDate);

    const totalDurationDays = close.diff(open, 'day');

    if (now.isBefore(open)) {
        // Upcoming
        const daysUntilOpen = open.diff(now, 'day');
        return {
            status: 'upcoming',
            daysRemaining: daysUntilOpen,
            totalDurationDays,
            isOpen: false,
            isClosed: false,
        };
    } else if (now.isAfter(close)) {
        // Closed
        return {
            status: 'closed',
            daysRemaining: null,
            totalDurationDays,
            isOpen: false,
            isClosed: true,
        };
    } else {
        // Active
        const daysRemaining = close.diff(now, 'day');
        return {
            status: 'active',
            daysRemaining,
            totalDurationDays,
            isOpen: true,
            isClosed: false,
        };
    }
};