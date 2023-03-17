import { Router } from 'express';
import * as loginController from '../controllers/loginController';

const loginRoutes = Router();

loginRoutes.post('/signin', loginController.login);

export default loginRoutes;
