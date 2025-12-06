import dayjs, { Dayjs } from 'dayjs';
import { PeriodInfo } from '../types/period';

export const getPeriodInfo = (openDate: Dayjs | string, closeDate: Dayjs | string): PeriodInfo => {
    const now = dayjs();
    const open = dayjs(openDate);
    const close = dayjs(closeDate);

    const totalDurationDays = close.diff(open, 'day');

    // Case 1: Upcoming
    if (now.isBefore(open)) {
        return {
            status: 'upcoming',
            countdown: null,
            totalDurationDays,
        };
    }

    // Case 2: Closed
    if (now.isAfter(close)) {
        return {
            status: 'closed',
            countdown: null,
            totalDurationDays,
        };
    }

    const diffMs = close.diff(now);
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        status: 'active',
        countdown: {
            days,
            hours,
            minutes,
            seconds,
            totalSeconds,
        },
        totalDurationDays,
    };
};