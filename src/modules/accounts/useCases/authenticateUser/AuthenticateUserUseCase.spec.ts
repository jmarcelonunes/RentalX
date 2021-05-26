import { AppError } from '@errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
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

  it('Should not be able to authenticate non existent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'blala',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate user with wrong password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: '789456123',
        email: 'email@email.com',
        name: 'test',
        password: '123456',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: 'email@email.com',
        password: 'incorrectPassword',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
