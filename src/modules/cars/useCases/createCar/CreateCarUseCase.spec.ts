import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });
    it('Should be able to create a new car', async () => {
        const car = await createCarUseCase.execute({
            name: 'Classe C',
            description: 'Mercedes classe C prata',
            daily_rate: 300,
            license_plate: 'PAW-7878',
            fine_amount: 60,
            brand: 'Mercedes',
            category_id: 'category',
        });
        expect(car).toHaveProperty('id');
    });

    it('Should not be able to create a car with the same license plate', async () => {
        await createCarUseCase.execute({
            name: 'Classe C',
            description: 'Mercedes classe C prata',
            daily_rate: 300,
            license_plate: 'PAW-7878',
            fine_amount: 60,
            brand: 'Mercedes',
            category_id: 'category',
        });
        await expect(
            createCarUseCase.execute({
                name: 'Classe A',
                description: 'Mercedes classe A prata',
                daily_rate: 300,
                license_plate: 'PAW-7878',
                fine_amount: 60,
                brand: 'Mercedes',
                category_id: 'category',
            }),
        ).rejects.toEqual(new AppError('Car already exists!'));
    });

    it('Should not be able to create an available car by default', async () => {
        const car = await createCarUseCase.execute({
            name: 'Classe C',
            description: 'Mercedes classe C prata',
            daily_rate: 300,
            license_plate: 'PAQ-7878',
            fine_amount: 60,
            brand: 'Mercedes',
            category_id: 'category',
        });

        expect(car.available).toBeTruthy();
    });
});
