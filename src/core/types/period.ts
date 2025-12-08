export type PeriodStatus = 'upcoming' | 'active' | 'closed';

export interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
}

export interface PeriodInfo {
    status: PeriodStatus;
    countdown: Countdown | null;
    totalDurationDays: number;
}