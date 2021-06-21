import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create car specification', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory,
        );
    });

    it('should not be able to add a new specification to a non existent car', async () => {
        const car_id = '123';
        const specifications_id = ['5422'];
        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            }),
        ).rejects.toEqual(new AppError('Car does not exists!'));
    });

    it('should be able to add a new specification to the car', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Classe C',
            description: 'Mercedes classe C prata',
            daily_rate: 300,
            license_plate: 'PAW-7878',
            fine_amount: 60,
            brand: 'Mercedes',
            category_id: 'category',
        });

        const specification = await specificationsRepositoryInMemory.create({
            description: 'teste',
            name: 'teste',
        });

        const carSpecification = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id: [specification.id],
        });

        expect(carSpecification).toHaveProperty('specifications');
        expect(carSpecification.specifications.length).toBe(1);
    });
});
