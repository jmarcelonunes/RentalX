import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDto';
import { UserTokens } from '../infra/typeorm/entities/UserToken';

interface IUsersTokensRepository {
    create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens>;
    findByIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens>;
    deleteById(id: string): Promise<void>
}

export { IUsersTokensRepository };
