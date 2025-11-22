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