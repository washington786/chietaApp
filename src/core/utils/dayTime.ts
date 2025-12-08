export function getTimeOfDay(date: Date = new Date()): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

export function formatDate(date: Date) {
    return date.toLocaleDateString("en-za", { day: "numeric", month: "numeric", year: "numeric" })
}

export const formatCountdown = (countdown: { days: number; hours: number; minutes: number; seconds: number } | null): string => {
    if (!countdown) return '00 00 00 00';

    const { days, hours, minutes } = countdown;
    const parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    if (parts.length === 0) {
        parts.push(`${countdown.seconds}s`);
    }

    return parts.join(' ');
};