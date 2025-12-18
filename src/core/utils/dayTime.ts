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

export const getMonth = (month: number): string => {
    let name = '';
    switch (month) {
        case 1: name = "January";
        case 2: name = "February";
        case 3: name = "March";
        case 4: name = "April";
        case 5: name = "May";
        case 6: name = "June";
        case 7: name = "July";
        case 8: name = "August";
        case 9: name = "September";
        case 10: name = "Octorber";
        case 11: name = "November";
        case 12: name = "December";
    }
    return name;
}