import { Router } from 'express';

import { ResetPasswordUserController } from '@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController';
import { SendForgottenPasswordController } from '@modules/accounts/useCases/sendForgottenPasswordMail/SendForgottenPasswordMailController';

const passwordRoutes = Router();

const sendForgottenPasswordController = new SendForgottenPasswordController();
const resetPasswordController = new ResetPasswordUserController();

passwordRoutes.post('/forgot', sendForgottenPasswordController.handle);

passwordRoutes.post('/reset', resetPasswordController.handle);

export { passwordRoutes };
