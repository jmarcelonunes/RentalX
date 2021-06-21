import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }

    async create({
        brand,
        name,
        daily_rate,
        description,
        fine_amount,
        license_plate,
        specifications,
        category_id,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            brand,
            name,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            specifications,
            category_id,
            id,
        });

        await this.repository.save(car);
        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({ license_plate });
        return car;
    }

    async findAvailable(
        name?: string,
        brand?: string,
        category_id?: string,
    ): Promise<Car[]> {
        const carsQuery = this.repository
            .createQueryBuilder('c')
            .where('available = :available', { available: true });

        if (name) {
            carsQuery.andWhere('name = :name', { name });
        }
        if (brand) {
            carsQuery.andWhere('brand = :brand', { brand });
        }
        if (category_id) {
            carsQuery.andWhere('category_id = :category_id', { category_id });
        }

        return carsQuery.getMany();
    }

    findById(id: string): Promise<Car> {
        return this.repository.findOne(id);
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where('id = :id')
            .setParameters({ id })
            .execute();
    }
}

export { CarsRepository };
