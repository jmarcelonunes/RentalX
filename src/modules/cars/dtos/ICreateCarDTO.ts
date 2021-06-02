import { Specification } from '../infra/typeorm/entities/Specification';

interface ICreateCarDTO {
    name: string;
    description: string;
    daily_rate: number;
    license_plate: string;
    fine_amount: number;
    brand: string;
    specifications?: Specification[];
    category_id: string;
    id?: string;
}

export { ICreateCarDTO };
