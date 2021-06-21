import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayJsDateProvider implements IDateProvider {
    dateNow(): Date {
        return dayjs().toDate();
    }
    convertToUtc(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    compareInHours(start: Date, end_date: Date): number {
        const end_date_utc = this.convertToUtc(end_date);
        const start_utc = this.convertToUtc(start);
        return dayjs(end_date_utc).diff(start_utc, 'hours');
    }

    compareInDays(start: Date, end_date: Date): number {
        const end_date_utc = this.convertToUtc(end_date);
        const start_utc = this.convertToUtc(start);
        return dayjs(end_date_utc).diff(start_utc, 'days');
    }

    addDays(days: number): Date {
        return dayjs().add(days, 'days').toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, 'hour').toDate();
    }

    compareIfBefore(start: Date, end_date: Date): boolean {
        return dayjs(start).isBefore(end_date);
    }
}

export { DayJsDateProvider };
