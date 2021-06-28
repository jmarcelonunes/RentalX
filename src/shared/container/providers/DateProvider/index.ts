import { container } from 'tsyringe';

import { IDateProvider } from './IDateProvider';
import { DayJsDateProvider } from './implementations/DayjsDateProvider';

container.registerSingleton<IDateProvider>(
    'DayJsDateProvider',
    DayJsDateProvider,
);
