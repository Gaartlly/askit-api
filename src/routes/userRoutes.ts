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
 *         course-id:
 *           type: integer
 *           example: 1
 *       required:
 *         - name
 *         - email
 *         - password
 *         - course-id
 */

/**
 * @swagger
 * /api/user/:
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
 *             course-id: 1
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
 *                 course-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user/
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
 *                 path: /api/user/
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
 *                 path: /api/user/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/user/:
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
 *                 path: /api/user/
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
 *                 path: /api/user/
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
 *                 path: /api/user/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', verifyAuthentication, getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user-id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
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
 *                 course-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user/
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
 *                 path: /api/user/
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
 *                 path: /api/user/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id', verifyAuthentication, updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user-id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
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
 *                 path: /api/user/
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
 *                 path: /api/user/
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
 *                 path: /api/user/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', verifyAuthentication, deleteUser);

export default router;
