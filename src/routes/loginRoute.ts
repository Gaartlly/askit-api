import { Router } from 'express';
import * as loginController from '../controllers/loginController';

const loginRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SignIn:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "user@ufpr.br"
 *         password:
 *           type: string
 *           example: "userpassword"
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * /api/signin:
 *   post:
 *     description: Login to the application
 *     tags: [SignIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SignIn'
 *
 *           example:
 *             email: user@ufpr.br
 *             password: userpassword
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               access_token: jidshjduashdasuhqipjew51eqw54ew4wewq4e6wq444re54qwr64wq
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/signin
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       404:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: NotFoundError
 *                 path: /api/signin
 *                 statusCode: 404
 *                 message: Not found user
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/signin
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
loginRoutes.post('/signin', loginController.login);

export default loginRoutes;
