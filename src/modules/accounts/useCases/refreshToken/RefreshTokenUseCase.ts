import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject('UsersTokensRepository')
        private usersTokensRepository: IUsersTokensRepository,
        @inject('DayJsDateProvider')
        private dateProvider: IDateProvider,
    ) {}
    async execute(token: string): Promise<string> {
        const { email, sub } = verify(
            token,
            auth.secret_refresh_token,
        ) as IPayload;

        const user_id = sub;

        const userToken =
            await this.usersTokensRepository.findByIdAndRefreshToken(
                user_id,
                token,
            );

        if (!userToken) {
            throw new AppError('Refresh token does not exists!');
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token,
        });

        const expires_date = this.dateProvider.addDays(
            auth.expires_refresh_token_days,
        );

        this.usersTokensRepository.create({
            expires_date,
            user_id,
            refresh_token,
        });

        return refresh_token;
    }
}

export { RefreshTokenUseCase };
