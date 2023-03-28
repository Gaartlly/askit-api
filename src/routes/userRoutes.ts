import express from 'express';
import { verifyAuthentication } from '../middleware/authUserMiddleware';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController';

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
 * /api/user/createUser:
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
router.post('/createUser', createUser);

/**
 * @swagger
 * /api/user/getUsers:
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
 *                 path: /api/getUsers
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
 *                 path: /api/getUsers
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
 *                 path: /api/getUsers
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getUsers', verifyAuthentication, getUsers);

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
 *                 path: /api/updateUser
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
 *                 path: /api/updateUser
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
 *                 path: /api/updateUser
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/updateUser/:userId', verifyAuthentication, updateUser);

/**
 * @swagger
 * /api/user/deleteUser/{userId}:
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
 *                 path: /api/deleteUser
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
 *                 path: /api/deleteUser
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
 *                 path: /api/deleteUser
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteUser/:userId', verifyAuthentication, deleteUser);

export default router;
