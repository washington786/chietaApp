import { useMemo, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { PeriodInfo, Countdown } from '@/core/types/period';

export interface UsePeriodInfoOptions {
    autoUpdate?: boolean;
    updateIntervalMs?: number;
}

const calculateCountdown = (target: Dayjs): Countdown => {
    const now = dayjs();
    const diffMs = target.diff(now);
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
};

export const usePeriodInfo = (
    openDate: Dayjs | string,
    closeDate: Dayjs | string,
    options: UsePeriodInfoOptions = {}
): PeriodInfo => {
    const { autoUpdate = false, updateIntervalMs = 60_000 } = options;

    // Parse and memoize static date info
    const memoized = useMemo(() => {
        const open = dayjs(openDate);
        const close = dayjs(closeDate);
        const totalDurationDays = close.diff(open, 'day');
        return { open, close, totalDurationDays };
    }, [openDate, closeDate]);

    // Compute initial state
    const computePeriodInfo = (): PeriodInfo => {
        const now = dayjs();

        if (now.isBefore(memoized.open)) {
            return {
                status: 'upcoming',
                countdown: calculateCountdown(memoized.open),
                totalDurationDays: memoized.totalDurationDays,
            };
        }

        if (now.isAfter(memoized.close)) {
            return {
                status: 'closed',
                countdown: null,
                totalDurationDays: memoized.totalDurationDays,
            };
        }

        return {
            status: 'active',
            countdown: calculateCountdown(memoized.close),
            totalDurationDays: memoized.totalDurationDays,
        };
    };

    const [periodInfo, setPeriodInfo] = useState<PeriodInfo>(computePeriodInfo);

    // Auto-update logic
    useEffect(() => {
        if (!autoUpdate) return;

        const tick = () => setPeriodInfo(computePeriodInfo);
        const intervalId = setInterval(tick, updateIntervalMs);

        return () => clearInterval(intervalId);
    }, [autoUpdate, updateIntervalMs, memoized.open, memoized.close]);

    return periodInfo;
};