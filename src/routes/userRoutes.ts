import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController';
import adminMiddleware from '../middleware/adminMiddleware';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import verifyAuthentication from '../middleware/authUserMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           example: "joaosilva@ufpr.br"
 *         password:
 *           type: string
 *           example: "joaosilvapassword"
 *         role:
 *           type: string
 *           default: "USER"
 *           example: "USER"
 *         status:
 *           type: boolean
 *           default: true
 *           example: true
 *         courseId:
 *           type: integer
 *           example: 1
 *       required:
 *         - name
 *         - email
 *         - password
 *         - courseId
 */

/**
 * @swagger
 * /api/user/create-user:
 *   post:
 *     description: Create new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *
 *           example:
 *             name: João Silva Camargo
 *             email: joaosilva@ufpr.br
 *             password: joaosilvapassword
 *             courseId: 1
 *
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               user:
 *                 id: 25
 *                 name: João Silva Camargo
 *                 email: joaosilva@ufpr.br
 *                 courseId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/createUser
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
 *                 path: /api/createUser
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/createUser
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/create-user', createUser);

/**
 * @swagger
 * /api/user/get-users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all users.
 *     tags: [User]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               users: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/get-users
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
 *                 path: /api/get-users
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/get-users
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/get-users', verifyAuthentication, getUsers);

/**
 * @swagger
 * /api/user/updateUser/{userId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update user.
 *     tags: [User]
 *     parameters:
 *       - in: path param
 *         name: userId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               user:
 *                 id: 25
 *                 name: João Silva Camargo Martins
 *                 email: joaosilvamartins@ufpr.br
 *                 courseId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/update-user
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
 *                 path: /api/update-user
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/update-user
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/update-user/:id', verifyAuthentication, updateUser);

/**
 * @swagger
 * /api/user/delete-user/{userId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete user.
 *     tags: [User]
 *     parameters:
 *       - in: path param
 *         name: userId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/delete-user
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
 *                 path: /api/delete-user
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/delete-user
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/delete-user/:id', verifyAuthentication, deleteUser);

export default router;