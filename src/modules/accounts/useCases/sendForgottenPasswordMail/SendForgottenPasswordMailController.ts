import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgottenPasswordUseCase } from './SendForgottenPasswordMailUseCase';

class SendForgottenPasswordController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email } = request.body;
        const sendForgottenPasswordUseCase = container.resolve(
            SendForgottenPasswordUseCase,
        );

        await sendForgottenPasswordUseCase.execute(email);

        return response.send();
    }
}

export { SendForgottenPasswordController };
