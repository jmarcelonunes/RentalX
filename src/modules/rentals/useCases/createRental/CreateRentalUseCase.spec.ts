import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayJsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    dayJsDateProvider = new DayJsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
    );
  });

  it('should create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '123456',
      car_id: '123456',
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if car already rented',
    async () => {
      expect(async () => {
        await createRentalUseCase.execute({
          user_id: '123456',
          car_id: '123456',
          expected_return_date: dayAdd24Hours,
        });

        await createRentalUseCase.execute({
          user_id: '1234567',
          car_id: '123456',
          expected_return_date: dayAdd24Hours,
        });
      }).rejects.toBeInstanceOf(AppError);
    });

  it('should not create a new rental if user has already a rental in progress',
    async () => {
      expect(async () => {
        await createRentalUseCase.execute({
          user_id: '123456',
          car_id: '123456',
          expected_return_date: dayAdd24Hours,
        });

        await createRentalUseCase.execute({
          user_id: '123456',
          car_id: '127456',
          expected_return_date: dayAdd24Hours,
        });
      }).rejects.toBeInstanceOf(AppError);
    });

  it('should not create a new rental with invalid return date',
    async () => {
      expect(async () => {
        await createRentalUseCase.execute({
          user_id: '123456',
          car_id: '123456',
          expected_return_date: dayjs().toDate(),
        });
      }).rejects.toBeInstanceOf(AppError);
    });
});
