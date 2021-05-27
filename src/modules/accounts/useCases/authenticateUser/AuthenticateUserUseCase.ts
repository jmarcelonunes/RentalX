import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest{
    email: string;
    password: string;
}

interface IReturn{
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password } : IRequest) : Promise<IReturn> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email/Password incorrect');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email/Password incorrect');
    }

    const token = sign({}, '81afdf1091a3ea35298d77ccb1fef0cf', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: IReturn = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
