import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayJsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    dayJsDateProvider = new DayJsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('should create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'car test',
      daily_rate: 5,
      license_plate: 'XX-XXXX',
      fine_amount: 10,
      category_id: '1234',
      brand: 'test',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '123456',
      car_id: car.id,
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
