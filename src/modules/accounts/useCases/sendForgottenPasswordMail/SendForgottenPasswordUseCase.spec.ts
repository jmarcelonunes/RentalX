import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgottenPasswordUseCase } from './SendForgottenPasswordMailUseCase';

describe('Send forgot mail', () => {
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let sendForgottenPasswordUseCase: SendForgottenPasswordUseCase;
    let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
    let dateProvider: DayJsDateProvider;
    let mailProvider: MailProviderInMemory;

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        mailProvider = new MailProviderInMemory();

        sendForgottenPasswordUseCase = new SendForgottenPasswordUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider,
        );
    });

    it('Should be able to send a forgot email password mail to user', async () => {
        const sendMail = jest.spyOn(mailProvider, 'sendMail');

        await usersRepositoryInMemory.create({
            driver_license: '157921',
            email: 'abora@edef.gl',
            name: 'Lola Fox',
            password: '379',
        });

        await sendForgottenPasswordUseCase.execute('abora@edef.gl');
        expect(sendMail).toHaveBeenCalled();
    });

    it('Should not be able to send a forgot email if user does not exists', async () => {
        await expect(
            sendForgottenPasswordUseCase.execute('abora@edef.gl'),
        ).rejects.toEqual(new AppError('User does not exists!'));
    });

    it('Should be able to create an user token', async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            'create',
        );

        await usersRepositoryInMemory.create({
            driver_license: '87202',
            email: 'fotki@keizsi.aw',
            name: 'Harry Weber',
            password: '379',
        });

        await sendForgottenPasswordUseCase.execute('fotki@keizsi.aw');

        expect(generateTokenMail).toBeCalled();
    });
});
