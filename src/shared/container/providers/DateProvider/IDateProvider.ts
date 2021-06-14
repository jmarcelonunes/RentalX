interface IDateProvider {
    compareInHours(start: Date, end_date: Date): number;
    convertToUtc(date: Date): string;
    dateNow(): Date
    compareInDays(start: Date, end_date: Date): number
    addDays(days: number): Date
}

export { IDateProvider };
