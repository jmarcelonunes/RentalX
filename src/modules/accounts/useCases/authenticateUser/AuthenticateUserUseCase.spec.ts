import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../CreateUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User', () => {
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let createUserUseCase: CreateUserUseCase;
    let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
    let dateProvider: DayJsDateProvider;

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('Should be able to authenticate a user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '789456123',
            email: 'email@email.com',
            name: 'test',
            password: '123456',
        };

        await createUserUseCase.execute(user);

        const token = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(token).toHaveProperty('token');
    });

    it('Should not be able to authenticate non existent user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'blala',
                password: '123456',
            }),
        ).rejects.toEqual(new AppError('Email/Password incorrect'));
    });

    it('Should not be able to authenticate user with wrong password', async () => {
        const user: ICreateUserDTO = {
            driver_license: '789456123',
            email: 'email@email.com',
            name: 'test',
            password: '123456',
        };

        await createUserUseCase.execute(user);
        await expect(
            authenticateUserUseCase.execute({
                email: 'email@email.com',
                password: 'incorrectPassword',
            }),
        ).rejects.toEqual(new AppError('Email/Password incorrect'));
    });
});
