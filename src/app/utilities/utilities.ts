// commonUtilities.ts
export function isThisWeek(date: Date) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
}

export function isNextWeek(date: Date) {
    const today = new Date();
    const startOfNextWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    const endOfNextWeek = new Date(today.setDate(today.getDate() - today.getDay() + 13));
    return date >= startOfNextWeek && date <= endOfNextWeek;
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
