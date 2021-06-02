import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all avaiable cars', async () => {
    await carsRepositoryInMemory.create({
      name: 'Audi A1',
      description: 'Audi branco',
      daily_rate: 100,
      license_plate: 'JGJ1221',
      fine_amount: 40,
      brand: 'Audi',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });
    await carsRepositoryInMemory.create({
      name: 'Audi A3',
      description: 'Audi preto',
      daily_rate: 100,
      license_plate: 'JGJ1222',
      fine_amount: 40,
      brand: 'Audi',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });
    await carsRepositoryInMemory.create({
      name: 'Audi A2',
      description: 'Audi prata',
      daily_rate: 100,
      license_plate: 'JGJ1223',
      fine_amount: 40,
      brand: 'Audi',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toHaveLength(3);
  });

  it('should be able to list all avaiable cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Mercedes classe E',
      description: 'Mercedes prata',
      daily_rate: 100,
      license_plate: 'JGJ1224',
      fine_amount: 40,
      brand: 'Mercedes',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });

    const cars = await listAvailableCarsUseCase.execute({ name: 'Mercedes classe E' });
    expect(cars).toEqual([car]);
  });

  it('should be able to list all avaiable cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Mercedes classe B',
      description: 'Mercedes prata',
      daily_rate: 100,
      license_plate: 'JGJ1225',
      fine_amount: 40,
      brand: 'Mercedes',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });
    expect(cars).toEqual([car]);
  });

  it('should be able to list all avaiable cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Mercedes classe A',
      description: 'Mercedes prata',
      daily_rate: 100,
      license_plate: 'JGJ1228',
      fine_amount: 40,
      brand: 'Mercedes',
      category_id: '77c7d23b-6916-48b6-ada7-85a15193e49f',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Mercedes',
    });
    expect(cars).toEqual([car]);
  });
});
