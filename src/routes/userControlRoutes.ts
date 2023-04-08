import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import {
    createUserControl,
    updateUserControl,
    getAllUserControls,
    getUserControl,
    deleteUserControl,
} from '../controllers/userControlController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: https
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     user-control:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *         user-id:
 *           type: integer
 *           example: 1
 *       required:
 *         - reason
 *         - user-id
 *
 */

/**
 * @swagger
 * /api/user-control/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new user-control.
 *     tags: [user-control]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/UserControl'
 *
 *           example:
 *             reason: "Violação dos termos de uso."
 *             user-id: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               user-control:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 user-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user-control/
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/user-control/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/', moderatorMiddleware, createUserControl);

/**
 * @swagger
 * /api/user-control/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an userControl by id.
 *     tags: [user-control]
 *     parameters:
 *       - name: user-control-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/UserControl'
 *
 *           example:
 *             reason: "Violação dos termos de uso."
 *             user-id: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               user-control:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 user-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id', moderatorMiddleware, updateUserControl);

/**
 * @swagger
 * /api/user-control/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all userControls.
 *     tags: [user-control]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               userControls: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user-control/
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/user-control/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllUserControls);

/**
 * @swagger
 * /api/user-control/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a userControl by id.
 *     tags: [user-control]
 *     parameters:
 *       - name: user-control-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               user-control:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 user-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', moderatorMiddleware, getUserControl);

/**
 * @swagger
 * /api/user-control/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an userControl by id.
 *     tags: [user-control]
 *     parameters:
 *       - name: user-control-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
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
 *                 path: /api/user-control/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', moderatorMiddleware, deleteUserControl);

export default router;
